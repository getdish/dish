import { Review, order_by, query, reviewUpsert, review_constraint } from '@dish/graph'
import { Store, useStore } from '@dish/use-store'
import { debounce } from 'lodash'
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { Toast, useConstant } from 'snackui'

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

  writeVote = debounce(async (restaurantId: string, vote: VoteNumber) => {
    try {
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
      return await writeReview(review)
    } catch (err) {
      Toast.error(`Error writing vote: ${err.message}`)
    }
  }, 50)
}

const writeReview = async (review: Partial<Review>) => {
  console.log('writing', review)
  await reviewUpsert([review], review_constraint.review_type_user_id_list_id_key)
}

export const useUserTagVotes = (restaurantSlug: string, activeTags: HomeActiveTagsRecord) => {
  // never change to avoid hooks issues, should never change from above
  const tagSlugList = useConstant(() => Object.keys(activeTags).filter((x) => activeTags[x]))

  // handles multiple
  const votes: VoteNumber[] = []
  const setVotes = useRef<Function[]>([])
  for (const tagSlug of tagSlugList) {
    const { vote, setVote } = useUserTagVote({ restaurantSlug, tagSlug })
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

  const vote = userId
    ? restaurant?.reviews({
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
        order_by: [{ authored_at: order_by.desc }],
      })[0]?.vote ?? 0
    : 0

  useEffect(() => {
    if (vote !== voteStore.vote) {
      voteStore.setVote(vote)
    }
  }, [vote])

  return {
    vote: voteStore.vote,
    setVote: async (userVote: VoteNumber | 'toggle') => {
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
  }
}

const toggleRating = (r: number) => (r == 1 ? -1 : 1)
