import {
  DeepPartial,
  Review,
  client,
  globalTagId,
  mutate,
  order_by,
  query,
  reviewDelete,
  reviewUpdate,
  reviewUpsert,
  review_bool_exp,
  review_constraint,
  review_update_column,
  setCache,
  useRefetch,
} from '@dish/graph'
import { useEffect, useState } from 'react'
import { Toast } from 'snackui'

import { useUserStore, userStore } from '../userStore'

export type ReviewWithTag = Pick<
  Review,
  | 'id'
  | 'rating'
  | 'tag_id'
  | 'text'
  | 'type'
  | 'list_id'
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

export const isTagReview = (r: DeepPartial<Review>) => !!r.tag_id && r.tag_id !== globalTagId

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
  const { reviews, refetch, upsert, reviewsQuery } = useUserReviewsQuery({
    restaurant_id: { _eq: restaurantId },
    type: { _eq: 'comment' },
  })
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
      setCache(reviewsQuery, result?.[0])
      onUpsert?.()
      return result
    },
    async deleteReview() {
      Toast.show(`Deleting...`)
      await reviewDelete({
        id: review.id,
      })
      if (reviewsQuery) {
        setCache(reviewsQuery, null)
      }
      onDelete?.()
      Toast.show(`Deleted!`)
      refetch(reviewsQuery)
    },
  }
}

export const useUserReviewsQuery = (where: review_bool_exp) => {
  const userStore = useUserStore()
  const userId = (userStore.user?.id as string) ?? ''
  const shouldFetch = userId && (where.restaurant_id || where.list_id)
  const refetch = useRefetch()
  const reviewsQuery = shouldFetch
    ? query.review({
        where: {
          ...where,
          user_id: {
            _eq: userId,
          },
        },
        limit: 10,
        order_by: [{ updated_at: order_by.desc }],
      })
    : null
  const reviews = reviewsQuery
    ? reviewsQuery.map<ReviewWithTag>((review) => {
        const tag = {
          name: review?.tag?.name ?? '',
          type: review?.tag?.type ?? '',
        }
        const res: ReviewWithTag = {
          id: review.id ?? '',
          rating: review.rating ?? 0,
          tag_id: review.tag_id ?? '',
          text: review.text ?? '',
          tag,
          vote: review.vote ?? 0,
          restaurant_id: review.restaurant_id ?? '',
          list_id: review.list_id ?? '',
          user_id: review.user_id ?? '',
          user: {
            username: review.user.username ?? '',
          },
          favorited: review.favorited ?? false,
          updated_at: review.updated_at ?? '',
        }
        return res
      })
    : []

  return {
    userId,
    reviews,
    reviewsQuery,
    refetch,
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
        const next = {
          rating: 0,
          ...review,
          user_id: user.id,
        }
        const response = reviewUpsert([next], review_constraint.review_pkey)
        // const response = await mutate((mutation) => {
        //   return mutation.insert_review({
        //     objects: [next],
        //     on_conflict: {
        //       constraint: review_constraint.review_pkey,
        //       update_columns: [review_update_column.favorited],
        //     },
        //   })?.affected_rows
        // })
        if (!response) {
          console.error('response', response)
          Toast.show('Error saving')
          return false
        }
        Toast.show(`Saved`)
        refetch(reviewsQuery)
      } catch (err) {
        console.error('error', err)
        Toast.show('Error saving')
        return false
      }
    },
  }
}

export const useUserFavoriteQuery = (where: review_bool_exp) => {
  const { reviewsQuery, reviews, upsert, refetch, userId } = useUserReviewsQuery(where)
  const review = reviews.find(
    (x) =>
      x.tag_id === where.tag_id?._eq ||
      x.restaurant_id === where.restaurant_id?._eq ||
      x.list_id === where.list_id?._eq
  )
  // until gqless is more reliable...
  const [state, setState] = useState(false)
  const favorited = review?.favorited ?? false
  useEffect(() => {
    setState(favorited)
  }, [favorited])
  const totalQuery = query.review_aggregate({
    where: {
      type: {
        _eq: 'favorite',
      },
      favorited: {
        _eq: true,
      },
      user_id: {
        _eq: userId,
      },
      ...where,
    },
  })
  const total = totalQuery.aggregate?.count() ?? 0
  return {
    favorited: state,
    reviewsQuery,
    total: total + (state ? 1 : 0),
    toggle: async () => {
      const next = {
        id: review?.id,
        user_id: userStore.user?.id,
        type: 'favorite',
        ...(where.restaurant_id && {
          restaurant_id: where.restaurant_id._eq,
        }),
        ...(where.list_id && {
          list_id: where.list_id._eq,
        }),
        favorited: !favorited,
      }
      setState(next.favorited)
      console.log('toggle me........', next.favorited)
      // fixes slow speed bug
      client.cache = {}
      await upsert(next)
      // refetch(reviewsQuery)
      // refetch(totalQuery)
    },
  }
}
