import { Review, ReviewWithId, query, review, reviewUpsert } from '@dish/graph'
import { Store, useStore } from '@dish/use-store'
import { debounce, isNumber } from 'lodash'
import { useCallback, useLayoutEffect, useRef } from 'react'
import { Toast, useConstant, useForceUpdate } from 'snackui'

import { getFullTags } from '../../helpers/getFullTags'
import { queryRestaurant } from '../../queries/queryRestaurant'
import { HomeActiveTagsRecord } from '../../types/homeTypes'
import { useUserStore, userStore } from '../userStore'

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
      console.error('error writing vote', this.props.tagSlug)
      return undefined
    }
    const review = {
      tag_id: tag.id,
      user_id: userStore.user?.id,
      restaurant_id: restaurantId,
      vote,
      type: 'vote',
    }
    return writeReview(review)
  }
}

const writeReview = debounce(async (review: Partial<Review>) => {
  console.log('writing', review)
  await reviewUpsert([review])
}, 50)

export const useUserTagVotes = (restaurantSlug: string, activeTags: HomeActiveTagsRecord) => {
  const tagSlugList = useConstant(() => Object.keys(activeTags).filter((x) => activeTags[x]))

  // handles multiple
  const votes: VoteNumber[] = []
  const setVotes = useRef<Function[]>([])
  for (const tagSlug of tagSlugList) {
    const [vote, setVote] = useUserTagVote({ restaurantSlug, tagSlug })
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

export const useUserTagVote = (props: VoteStoreProps) => {
  const userStore = useUserStore()
  const userId = userStore.user?.id
  const voteStore = useStore(TagVoteStore, props)
  const [restaurant] = queryRestaurant(props.restaurantSlug)
  let vote: 1 | -1 | 0 = 0

  if (restaurant?.id && userId) {
    const res = query.review({
      where: {
        restaurant_id: {
          _eq: restaurant.id,
        },
        user_id: {
          _eq: userId,
        },
        type: {
          _eq: 'vote',
        },
      },
      limit: 200,
    })
    const found = res.find((x) => x.tag?.slug === props.tagSlug)
    if (found) {
      vote = found.vote ?? 0
    }
  } else {
    // console.warn('none', restaurant.id, userId, tagId)
  }

  useLayoutEffect(() => {
    if (vote !== voteStore.vote) {
      voteStore.setVote(vote)
    }
  }, [vote])

  return [
    voteStore.vote,
    async (userVote: VoteNumber | 'toggle') => {
      if (userStore.promptLogin()) {
        return
      }
      if (!restaurant) {
        return
      }
      const vote = userVote == 'toggle' ? toggleRating(voteStore.vote) : userVote
      voteStore.setVote(vote)
      voteStore.writeVote(restaurant.id, vote)
      Toast.show(`Saved`)
    },
  ] as const
}

const toggleRating = (r: number) => (r == 1 ? -1 : 1)
