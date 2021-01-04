import {
  DeepPartial,
  Review,
  globalTagId,
  query,
  reviewDelete,
  reviewUpsert,
  setCache,
  useRefetch,
} from '@dish/graph'
import { useState } from 'react'
import { Toast, useLazyEffect } from 'snackui'

import { useUserStore } from '../userStore'

export type ReviewWithTag = Pick<
  Review,
  | 'id'
  | 'rating'
  | 'tag_id'
  | 'text'
  | 'type'
  | 'vote'
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

type ReviewTypes = 'vote' | 'favorite' | 'comment'

export const useUserReviewsQuery = (
  restaurantId: string,
  type?: ReviewTypes
) => {
  const refetch = useRefetch()
  const userStore = useUserStore()
  const userId = (userStore.user?.id as string) ?? ''
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
          ...(!!type && {
            type: {
              _eq: type,
            },
          }),
        },
      })
    : null
  const reviews = reviewsQuery
    ? reviewsQuery.map<ReviewWithTag>((review) => {
        const tag = {
          name: review?.tag?.name ?? '',
          type: review?.tag?.type ?? '',
        }
        return {
          id: review.id,
          rating: review.rating,
          tag_id: review.tag_id,
          text: review.text,
          tag,
          vote: review.vote,
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
      refetch(reviewsQuery).catch(console.error)
      // const fetcher = refetch(reviewsQuery) as any
      // if (fetcher) {
      //   return series([() => resolved(fetcher), forceUpdate])
      // }
      // refetchAll()
    }
  }, [shouldFetch, fetchKey])

  const doRefetch = () => {
    setFetchKey(Math.random())
  }

  return {
    userId,
    reviews,
    reviewsQuery,
    refetch: doRefetch,
    async upsert(
      review: Partial<Review> & {
        // require type
        type: Review['type']
      }
    ) {
      if (userStore.promptLogin()) {
        return false
      }
      const user = userStore.user!
      try {
        // optimistic update
        if (review.id) {
          const cur = reviewsQuery?.find((x) => x.id === review.id)
          if (cur) {
            for (const key in review) {
              cur[key] = review[key]
            }
          }
        }

        const response = await reviewUpsert([
          {
            // defaults
            rating: 0,
            ...review,
            // overrides
            user_id: user.id,
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
          const cur = reviewsQuery?.find((x) => x.id === result.id)
          if (cur) {
            for (const key in result) {
              cur[key] = result[key]
            }
          }
        }

        Toast.show(`Saved`)
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

export const isTagReview = (r: DeepPartial<Review>) =>
  !!r.tag_id && r.tag_id !== globalTagId

export const useUserReviewCommentQuery = (
  restaurantId: string,
  {
    onUpsert,
    onDelete,
  }: {
    onUpsert?: () => void
    onDelete?: () => void
  } = {}
) => {
  const { reviews, upsert, reviewsQuery } = useUserReviewsQuery(
    restaurantId,
    'comment'
  )
  const review = reviews.filter((x) => !isTagReview(x) && !!x.text)[0]
  return {
    review,
    reviewsQuery,
    async upsertReview(review: Partial<Review>) {
      const result = await upsert({
        type: 'comment',
        ...review,
        restaurant_id: restaurantId,
      })

      setCache(reviewsQuery, result[0])

      onUpsert?.()

      return result
    },
    async deleteReview() {
      Toast.show(`Deleting...`)
      await reviewDelete({
        id: review.id,
      })
      setCache(reviewsQuery, null)
      onDelete?.()
      Toast.show(`Deleted!`)
      // refetch()
    },
  }
}

export const useUserFavoriteQuery = (restaurantId: string) => {
  const { reviews, upsert } = useUserReviewsQuery(restaurantId, 'favorite')
  const review = reviews.filter((x) => !isTagReview(x) && x.favorited)[0]
  const [optimistic, setOptimistic] = useState<boolean | null>(null)
  const isStarred = optimistic ?? review?.favorited
  return [
    isStarred,
    (next: boolean) => {
      setOptimistic(next)
      return upsert({
        type: 'favorite',
        favorited: next,
        restaurant_id: restaurantId,
      })
    },
  ] as const
}
