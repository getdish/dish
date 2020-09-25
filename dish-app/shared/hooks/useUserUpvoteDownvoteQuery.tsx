import { sleep } from '@dish/async'
import { Review, reviewUpsert } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { Toast } from '@dish/ui'
import { useState } from 'react'

import { useIsMountedRef } from '../helpers/useIsMountedRef'
import { allTags } from '../state/allTags'
import { getFullTags } from '../state/getFullTags'
import { getTagId } from '../state/getTagId'
import { HomeActiveTagsRecord } from '../state/home-types'
import { NavigableTag } from '../state/NavigableTag'
import { useOvermind } from '../state/om'
import { omStatic } from '../state/omStatic'
import {
  ReviewWithTag,
  isTagReview,
  useUserReviewsQuery,
} from './useUserReview'

export type VoteNumber = -1 | 0 | 1

export const useUserUpvoteDownvoteQuery = (
  restaurantId: string,
  activeTags: HomeActiveTagsRecord
) => {
  const om = useOvermind()
  const userId = om.state.user.user?.id
  const [votes] = useUserTagVotes(restaurantId)
  const vote = getTagUpvoteDownvote(votes, activeTags)
  const [userVote, setUserVote] = useState<VoteNumber | null>(null)
  return {
    votes,
    vote: userVote ?? vote,
    setVote: async (rating: VoteNumber) => {
      if (omStatic.actions.home.promptLogin()) {
        return
      }
      setUserVote(rating)
      const tagsList = Object.keys(activeTags)
        .filter((x) => activeTags[x])
        .map((id) => allTags[id])
      const saved = await voteForTags(restaurantId, userId, tagsList, rating)
      if (saved?.length) {
        Toast.show(`Saved`)
      }
    },
  }
}

const getTagUpvoteDownvote = (
  votes: ReviewWithTag[],
  activeTags: HomeActiveTagsRecord
): VoteNumber => {
  const tagIdVotes = votes
    .filter((x) => (x.tag ? activeTags[getTagId(x.tag)] : null))
    .filter(isPresent)
  if (tagIdVotes.length === 0) {
    return 0
  }
  if ([...new Set(tagIdVotes.map((x) => x.rating))].length !== 1) {
    // mistmatched votes
    console.warn('mistmatched votes across tags?')
    return 0
  }
  return +(tagIdVotes[0].rating ?? 0) as VoteNumber
}

const voteForTags = async (
  restaurantId: string,
  userId: string,
  tags: NavigableTag[],
  rating: number
) => {
  const partialTags = tags.map((tag) => ({
    ...allTags[getTagId(tag)],
    ...tag,
  }))
  const fullTags = await getFullTags(partialTags)
  const insertTags = tags.map<Review>((tag) => {
    const tagId = fullTags.find(
      (x) => x.name?.toLowerCase() === tag.name?.toLowerCase()
    )?.id
    if (!tagId) {
      console.warn({ name, tags, partialTags, fullTags })
      throw new Error('no tag')
    }
    return {
      tag_id: tagId,
      user_id: userId,
      restaurant_id: restaurantId,
      rating,
    }
  })
  if (insertTags.length) {
    console.log('upsert', insertTags)
    return await reviewUpsert(insertTags)
  } else {
    console.warn('no tags?')
  }
}

const toggleRating = (r: number) => (r == 1 ? -1 : 1)

export const useUserTagVotes = (restaurantId: string, tagId?: string) => {
  const isMounted = useIsMountedRef()
  const { userId, reviews, reviewsQuery, om, refetch } = useUserReviewsQuery(
    restaurantId
  )
  console.log('reviews', reviews)
  const votes = reviews.filter((review) => {
    if (!isTagReview(review)) return false
    if (review.rating === 0) return false
    if (tagId && review.tag_id !== tagId) return false
    return true
  })
  return [
    votes,
    async (tag: NavigableTag, userRating: number | 'toggle') => {
      if (omStatic.actions.home.promptLogin()) {
        return
      }
      const id = tagId ?? allTags[getTagId(tag)]?.id
      const existing = reviewsQuery.find((x) => x.tag_id === id)
      if (existing) {
        // optimistic
        existing.rating =
          userRating == 'toggle' ? toggleRating(existing.rating) : userRating
      }
      // delayed
      const saved = await voteForTags(
        restaurantId,
        userId,
        [tag],
        userRating === 'toggle' ? 1 : userRating
      )
      const didSave = !!saved?.length
      if (didSave) {
        Toast.show(`Saved`)
        sleep(350).then(() => {
          if (isMounted.current) {
            refetch()
          }
        })
      }
    },
  ] as const
}
