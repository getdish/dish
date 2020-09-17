import { series, sleep } from '@dish/async'
import {
  Review,
  query,
  refetch,
  resolved,
  reviewDelete,
  reviewUpsert,
} from '@dish/graph'
import { Toast, useForceUpdate, useLazyEffect } from '@dish/ui'
import { useEffect, useState } from 'react'

import { useIsMountedRef } from '../pages/home/useIsMountedRef'
import { allTags } from '../state/allTags'
import { getTagId } from '../state/getTagId'
import { getFullTags } from '../state/home-tag-helpers'
import { HomeActiveTagsRecord } from '../state/home-types'
import { NavigableTag } from '../state/NavigableTag'
import { useOvermind } from '../state/om'
import { omStatic } from '../state/omStatic'

type ReviewWithTag = Pick<
  Review,
  | 'id'
  | 'rating'
  | 'tag_id'
  | 'text'
  | 'restaurant_id'
  | 'user_id'
  | 'favorited'
  | 'updated_at'
> & {
  user?: {
    username: string
  }
  tag: {
    name: string
    type: string
  }
}

export const useUserReviewsQuery = (restaurantId: string) => {
  const om = useOvermind()
  const forceUpdate = useForceUpdate()
  const userId = (om.state.user.user?.id as string) ?? ''
  const [fetchKey, setFetchKey] = useState(0)
  const shouldFetch = userId && restaurantId
  const reviewsQuery = shouldFetch
    ? query.review({
        where: {
          restaurant_id: {
            _eq: restaurantId,
          },
          user_id: {
            _eq: userId,
          },
        },
      })
    : null
  const reviews = reviewsQuery
    ? reviewsQuery.map<ReviewWithTag>((review) => {
        let tag = {
          name: '',
          type: '',
        }
        if (review.tag_id) {
          const tagQuery = query.tag({
            where: { id: { _eq: review.tag_id } },
          })[0]
          tag = {
            name: tagQuery?.name ?? '',
            type: tagQuery?.type ?? '',
          }
        }
        return {
          id: review.id,
          rating: review.rating,
          tag_id: review.tag_id,
          text: review.text,
          tag,
          restaurant_id: review.restaurant_id,
          user_id: review.user_id,
          user: {
            username: review.user.username,
          },
          favorited: review.favorited,
          updated_at: review.updated_at,
        }
      })
    : []

  // ensure fetched by gqless
  useLazyEffect(() => {
    if (fetchKey && shouldFetch) {
      const fetcher = refetch(reviewsQuery) as any
      if (fetcher) {
        return series([() => resolved(fetcher), forceUpdate])
      }
    }
  }, [shouldFetch, fetchKey])

  const doRefetch = () => {
    setFetchKey(Math.random())
  }

  return {
    userId,
    reviews,
    reviewsQuery,
    om,
    refetch: doRefetch,
    async upsert(review: Partial<Review>) {
      if (omStatic.actions.home.promptLogin()) {
        return false
      }
      Toast.show('Saving...')
      try {
        // optimistic update
        if (review.id) {
          const cur = reviewsQuery.find((x) => x.id === review.id)
          for (const key in review) {
            cur[key] = review[key]
          }
        }

        const response = await reviewUpsert([
          {
            // defaults
            rating: 0,
            ...review,
            // overrides
            user_id: omStatic.state.user.user!.id,
          },
        ])

        if (!response.length) {
          console.error('response', response)
          Toast.show('Error saving')
          return false
        }

        const result = response[0]

        // post-optimistic update
        if (result.id) {
          const cur = reviewsQuery.find((x) => x.id === result.id)
          for (const key in result) {
            cur[key] = result[key]
          }
        }

        Toast.show(`Saved!`)
        doRefetch()
        return response
      } catch (err) {
        console.error('error', err)
        Toast.show('Error saving')
        return false
      }
    },
  }
}

const isTagReview = (r: Review) =>
  !!r.tag_id && r.tag_id !== '00000000-0000-0000-0000-000000000000'

export const useUserReviewCommentQuery = (restaurantId: string) => {
  const { reviews, upsert, refetch } = useUserReviewsQuery(restaurantId)
  const review = reviews.filter((x) => !isTagReview(x) && !!x.text)[0]
  return {
    review,
    upsertReview(review: Partial<Review>) {
      return upsert({
        ...review,
        restaurant_id: restaurantId,
      })
    },
    async deleteReview() {
      Toast.show(`Deleting...`)
      await reviewDelete({
        id: review.id,
      })
      Toast.show(`Deleted!`)
      refetch()
    },
  }
}

export const useUserFavoriteQuery = (restaurantId: string) => {
  const { reviews, upsert } = useUserReviewsQuery(restaurantId)
  const review = reviews.filter((x) => !isTagReview(x) && x.favorited)[0]
  const [optimistic, setOptimistic] = useState<boolean | null>(null)
  const isStarred = optimistic ?? review?.favorited
  return [
    isStarred,
    (next: boolean) => {
      setOptimistic(next)
      return upsert({
        favorited: next,
        restaurant_id: restaurantId,
      })
    },
  ] as const
}

export const useUserUpvoteDownvoteQuery = (
  restaurantId: string,
  activeTags: HomeActiveTagsRecord
) => {
  const om = useOvermind()
  const userId = om.state.user.user?.id
  const [votes] = useUserTagVotes(restaurantId)
  const vote = getTagUpvoteDownvote(votes, activeTags)
  const [userVote, setUserVote] = useState<number | null>(null)
  return [
    userVote ?? vote,
    async (rating: number) => {
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
  ] as const
}

const getTagUpvoteDownvote = (
  votes: ReviewWithTag[],
  activeTags: HomeActiveTagsRecord
): number => {
  const tagIdVotes = votes
    .filter((x) => (x.tag ? activeTags[getTagId(x.tag)] : null))
    .filter(Boolean)
  if (tagIdVotes.length === 0) {
    return 0
  }
  if ([...new Set(tagIdVotes.map((x) => x.rating))].length !== 1) {
    // mistmatched votes
    console.warn('mistmatched votes across tags?')
    return 0
  }
  return +(tagIdVotes[0].rating ?? 0)
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
      const id = tagId ?? om.state.home.allTags[getTagId(tag)]?.id
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
