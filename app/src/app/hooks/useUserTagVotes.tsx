import { Review, order_by, reviewUpsert, review_constraint, useRefetch } from '@dish/graph'
import { Store, useStore } from '@dish/use-store'
import { debounce } from 'lodash'
import { useCallback, useEffect, useRef } from 'react'
import { Toast, useConstant, useLazyEffect } from 'snackui'

import { getFullTags } from '../../helpers/getFullTags'
import { queryRestaurant } from '../../queries/queryRestaurant'
import { HomeActiveTagsRecord } from '../../types/homeTypes'
import { useUserStore, userStore } from '../userStore'

export type VoteNumber = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

type VoteStoreProps = { tagSlug: string; restaurantSlug: string }

// using this for now until gqty optimistic update gets better
export class TagVoteStore extends Store<VoteStoreProps> {
  vote: VoteNumber = 0

  setVote(vote: VoteNumber) {
    this.vote = vote
  }

  writeVote = debounce(async (restaurantId: string, vote: VoteNumber) => {
    try {
      // insert into db
      const [tag] = await getFullTags([{ slug: this.props.tagSlug }])
      if (!tag) {
        console.error('error writing vote', this.props.tagSlug)
        return undefined
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
      return await writeReview(review)
    } catch (err) {
      console.error('error writing vote', err.message, err.stack)
      Toast.error(`Error writing vote`)
    }
  }, 50)
}

const writeReview = async (review: Partial<Review>) => {
  console.log('writing', review)
  await reviewUpsert([review], review_constraint.review_username_restauarant_id_tag_id_type_key)
}

export const useUserTagVotes = (
  restaurantSlug: string,
  activeTags: HomeActiveTagsRecord,
  refetchKey?: string
) => {
  // never change to avoid hooks issues, should never change from above
  const tagSlugList = useConstant(() => Object.keys(activeTags).filter((x) => activeTags[x]))

  // handles multiple
  const votes: VoteNumber[] = []
  const setVotes = useRef<Function[]>([])
  for (const tagSlug of tagSlugList) {
    const { vote, setVote } = useUserTagVote({ restaurantSlug, tagSlug }, refetchKey)
    votes.push(vote)
    setVotes.current.push(setVote)
  }

  const setVote = useCallback((vote: VoteNumber) => {
    if (userStore.promptLogin()) {
      return
    }
    for (const setVote of setVotes.current) {
      setVote(vote)
    }
    Toast.show(`Saved`)
  }, [])

  return {
    vote: votes[0] ?? 0, // use the first one when querying multiple
    setVote,
  }
}

export const useUserTagVote = (props: VoteStoreProps, refetchKey?: string) => {
  const userStore = useUserStore()
  const userId = userStore.user?.id
  const voteStore = useStore(TagVoteStore, props)
  const [restaurant] = queryRestaurant(props.restaurantSlug)
  const restaurantId = restaurant?.id
  const refetch = useRefetch()

  const voteQuery =
    userId && restaurant && props.tagSlug
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
                _eq: props.tagSlug,
              },
            },
          },
          order_by: [{ authored_at: order_by.asc }],
        })
      : null

  useLazyEffect(() => {
    refetch(voteQuery)
  }, [refetchKey])

  const vote = voteQuery?.[0]?.vote ?? 0

  useEffect(() => {
    if (vote !== voteStore.vote) {
      voteStore.setVote(vote)
    }
  }, [vote])

  return {
    vote: voteStore.vote,
    setVote: async (userVote: VoteNumber | 'toggle') => {
      if (!restaurantId) {
        Toast.error('No restaurant ID')
        return
      }
      if (userStore.promptLogin()) {
        return
      }
      if (!restaurant) {
        return
      }
      const vote = userVote == 'toggle' ? toggleRating(voteStore.vote) : userVote
      voteStore.setVote(vote)
      voteStore.writeVote(restaurantId, vote)
      Toast.show(`Saved`)
    },
  }
}

const toggleRating = (r: number) => (r == 1 ? -1 : 1)
