import {
  Review,
  order_by,
  restaurant,
  reviewUpsert,
  review_constraint,
  useRefetch,
} from '@dish/graph'
import { Toast, useLazyEffect } from '@dish/ui'
import { Store, createStore, useStoreInstanceSelector, useStoreSelector } from '@dish/use-store'
import { debounce } from 'lodash'
import { useCallback, useEffect } from 'react'

import { getFullTags } from '../../helpers/getFullTags'
import { useUserStore, userStore } from '../userStore'

export type VoteNumber = -1 | 0 | 1 | 2 | 3 | 4 | 5

const tagVotesStore = createStore(
  class TagVotesStore extends Store {
    votesByRestaurant = {}

    _setVote(rid: string, tagSlug: string, val: VoteNumber) {
      this.votesByRestaurant = {
        ...this.votesByRestaurant,
        [rid]: {
          ...this.votesByRestaurant[rid],
          [tagSlug]: val,
        },
      }
    }
  }
)

const writeVote = debounce(async (tagSlug: string, restaurantId: string, vote: VoteNumber) => {
  let ogVote = tagVotesStore.votesByRestaurant[restaurantId][tagSlug]
  try {
    // optimistic
    tagVotesStore._setVote(restaurantId, tagSlug, vote)
    // insert into db
    const [tag] = await getFullTags([{ slug: tagSlug }])
    if (!tag) {
      console.error('error writing vote', tagSlug)
      return
    }
    const user_id = userStore.user?.id
    const username = userStore.user?.username
    if (!user_id || !username) {
      // not logged in, default to ignore (promptLogin can trigger)
      console.warn('ignoring no user')
      return
    }
    const review = {
      username,
      tag_id: tag.id,
      user_id,
      restaurant_id: restaurantId,
      vote,
      type: 'vote',
    }
    return await upsertReview(review)
  } catch (err) {
    console.error('error writing vote', err.message, err.stack)
    Toast.error(`Error writing vote`)
    // unwind optimistic
    tagVotesStore._setVote(restaurantId, tagSlug, ogVote)
  }
})

const upsertReview = async (review: Partial<Review>) => {
  await reviewUpsert([review], review_constraint.review_username_restauarant_id_tag_id_type_key)
}

export type UserTagVotesProps = {
  restaurant?: restaurant | null
  activeTags: string[]
  refetchKey?: string
}

const useTagVotes = (rid: string, tagSlugs: string[]) => {
  return useStoreInstanceSelector(tagVotesStore, (s) => {
    for (const slug of tagSlugs) {
      if (s.votesByRestaurant[rid]?.[slug]) {
        return s.votesByRestaurant[rid][slug]
      }
    }
  })
}

export const useUserTagVotes = (props: UserTagVotesProps) => {
  const refetch = useRefetch()
  const restaurantId = props.restaurant?.id
  const votesNow = useTagVotes(restaurantId, props.activeTags)
  const votes = props.activeTags.map((tagSlug) =>
    queryUserTagVote({
      ...props,
      tagSlug,
    })
  )
  // use the first one when querying multiple
  const vote = votesNow ?? (votes[0]?.vote || null)

  // sync down
  useEffect(() => {
    for (const vote of votes) {
      if (vote) {
        tagVotesStore._setVote(restaurantId, vote.tagSlug, vote.vote)
      }
    }
  }, [JSON.stringify(votes)])

  useLazyEffect(() => {
    votes.map(({ voteQuery }) => refetch(voteQuery))
  }, [props.refetchKey])

  const setVote = useCallback(
    (vote: VoteNumber) => {
      if (userStore.promptLogin()) {
        return
      }
      for (const tagSlug of props.activeTags) {
        const existing = votes.find((x) => x?.tagSlug === tagSlug)?.voteQuery?.[0]
        if (existing) {
          existing.vote = vote
        }
        writeVote(tagSlug, restaurantId, vote)
      }
      Toast.show(`Saved`)
    },
    [restaurantId]
  )

  return {
    vote,
    setVote,
    didVoteDuringSession: !!votesNow,
  }
}

export type UserTagVotes = typeof useUserTagVotes

const queryUserTagVote = ({
  tagSlug,
  activeTags,
  restaurant,
}: UserTagVotesProps & {
  tagSlug: string
}) => {
  const userStore = useUserStore()
  const userId = userStore.user?.id

  const voteQuery =
    userId && restaurant && tagSlug
      ? restaurant.reviews({
          limit: 1,
          where: {
            type: {
              _eq: 'vote',
            },
            user_id: {
              _eq: userId,
            },
            tag: {
              slug: {
                _eq: tagSlug,
              },
            },
          },
          order_by: [{ authored_at: order_by.desc }],
        })
      : null

  const vote = voteQuery?.[0]?.vote ?? 0

  return {
    tagSlug,
    voteQuery,
    vote,
  }
}
