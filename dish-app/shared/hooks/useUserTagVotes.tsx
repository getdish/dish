import { query, review, reviewUpsert } from '@dish/graph'
import { Store, useStore } from '@dish/use-store'
import { isNumber } from 'lodash'
import { useEffect, useLayoutEffect } from 'react'
import { Toast, useConstant, useForceUpdate, useLazyEffect } from 'snackui'

import { addTagsToCache, allTags } from '../state/allTags'
import { getFullTags } from '../state/getFullTags'
import { HomeActiveTagsRecord } from '../state/home-types'
import { useUserStore, userStore } from '../state/user'
import { useRestaurantQuery } from './useRestaurantQuery'

export type VoteNumber = -1 | 0 | 1

type VoteStoreProps = { tagSlug: string; restaurantSlug: string }

// using this for now until gqless optimistic update gets better
export class TagVoteStore extends Store<VoteStoreProps> {
  vote: VoteNumber = 0

  setVote(vote: VoteNumber) {
    this.vote = vote
  }

  async writeVote(restaurantId: string, vote: VoteNumber) {
    // insert into db
    const [tag] = await getFullTags([{ slug: this.props.tagSlug }])
    if (!tag) {
      console.error('error writing vote')
      return undefined
    }
    const review = {
      tag_id: tag.id,
      user_id: userStore.user?.id,
      restaurant_id: restaurantId,
      vote,
      type: 'vote',
    }
    return await reviewUpsert([review])
  }
}

export const useUserTagVotes = (
  restaurantSlug: string,
  activeTags: HomeActiveTagsRecord
) => {
  const tagSlugList = useConstant(() =>
    Object.keys(activeTags).filter((x) => activeTags[x])
  )

  if (process.env.NODE_ENV === 'development') {
    useLazyEffect(() => {
      console.warn(
        'CHANGING ACTIVE TAGS NOT ALLOWED< USE KEY INSTEAD',
        activeTags,
        tagSlugList
      )
    }, [JSON.stringify(activeTags)])
  }

  // handles multiple
  const votes: VoteNumber[] = []
  const setVotes: Function[] = []
  for (const tagSlug of tagSlugList) {
    const [vote, setVote] = useUserTagVote({ restaurantSlug, tagSlug })
    votes.push(vote)
    setVotes.push(setVote)
  }

  return {
    vote: votes[0] ?? 0, // use the first one when querying multiple
    setVote: (vote: VoteNumber) => {
      if (userStore.promptLogin()) {
        return
      }
      for (const setVote of setVotes) {
        setVote(vote)
      }
      Toast.show(`Saved`)
    },
  }
}

export const useUserTagVote = (props: VoteStoreProps) => {
  const userStore = useUserStore()
  const userId = userStore.user?.id
  const voteStore = useStore(TagVoteStore, props)
  const restaurant = useRestaurantQuery(props.restaurantSlug)
  const forceUpdate = useForceUpdate()
  const tag = allTags[props.tagSlug]
  const tagId = tag?.id
  let review: review | null = null

  if (restaurant.id && userId && tagId) {
    review = query.review({
      where: {
        restaurant_id: {
          _eq: restaurant.id,
        },
        tag_id: {
          _eq: tagId,
        },
        user_id: {
          _eq: userId,
        },
        type: {
          _eq: 'vote',
        },
      },
    })[0]
  } else {
    // console.warn('none', restaurant.id, userId, tagId)
  }

  useLayoutEffect(() => {
    if (!review) return
    if (isNumber(review.vote)) {
      voteStore.setVote(review.vote! as VoteNumber)
    }
  }, [review?.vote])

  useEffect(() => {
    let unmounted = false
    if (!tagId && tag) {
      getFullTags([tag]).then(([fullTag]) => {
        if (unmounted) return
        if (addTagsToCache([fullTag])) {
          forceUpdate()
        }
      })
    }
    return () => {
      unmounted = true
    }
  }, [tagId])

  return [
    voteStore.vote,
    async (userVote: VoteNumber | 'toggle') => {
      if (userStore.promptLogin()) {
        return
      }
      const vote =
        userVote == 'toggle' ? toggleRating(voteStore.vote) : userVote
      voteStore.setVote(vote)
      voteStore.writeVote(restaurant.id, vote)
      Toast.show(`Saved`)
    },
  ] as const
}

const toggleRating = (r: number) => (r == 1 ? -1 : 1)
