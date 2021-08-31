import {
  DeepPartial,
  Review,
  client,
  globalTagId,
  mutate,
  order_by,
  query,
  resolved,
  reviewDelete,
  reviewFindOne,
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

export const isTagReview = (r: DeepPartial<Review>) => !!r.tag_id && r.tag_id !== globalTagId

export const useCurrentUserQuery = () => {
  const userStore = useUserStore()
  return (
    query.user({
      where: {
        id: {
          _eq: userStore.user?.id,
        },
      },
      limit: 1,
    }) ?? []
  )
}

export const useUserReviewCommentQuery = (
  restaurantSlug: string,
  {
    onUpsert,
    onDelete,
  }: {
    onUpsert?: () => void
    onDelete?: () => void
  } = {}
) => {
  const [user] = useCurrentUserQuery()
  const { reviews, refetch, upsert, reviewsQuery } = useUserReviewsQuery(
    {
      restaurant: {
        slug: {
          _eq: restaurantSlug,
        },
      },
      type: { _eq: 'comment' },
    },
    {
      limit: 1,
    }
  )
  const review = reviews.filter((x) => !isTagReview(x) && !!x.text)[0]
  return {
    user,
    review,
    reviewsQuery,
    async upsertReview(review: Partial<Review>) {
      const restaurantId = await resolved(
        () => query.restaurant({ where: { slug: { _eq: restaurantSlug } } })[0]?.id
      )
      if (!restaurantId) {
        Toast.error('no restaurant')
        return
      }
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

export const useUserReviewsQuery = (where: review_bool_exp, rest: any = null) => {
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
        ...rest,
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
      const user = userStore.user
      if (!user) return
      try {
        const next = {
          ...review,
          user_id: user.id,
        }
        // hacky workaround for upsert not working via gqty
        try {
          const response = await mutate((mutation) => {
            return mutation.insert_review({
              objects: [
                {
                  rating: 0,
                  ...next,
                } as any,
              ],
              on_conflict: {
                constraint: review_constraint.review_type_user_id_list_id_key,
                update_columns: [review_update_column.favorited],
              },
            })?.affected_rows
          })
          console.log('response', response)
          if (!response) {
            console.error('response', response)
            Toast.error('Error saving')
            return false
          }
        } catch (err) {
          console.log('aught err', err)
          if (err.message?.includes('Uniqueness violation')) {
            const existing = await reviewFindOne(next)
            if (!existing) {
              Toast.error('Error saving')
              return
            }
            const response = await mutate((mutation) => {
              return mutation.update_review({
                where: {
                  id: {
                    _eq: existing.id,
                  },
                },
                _set: next,
              })?.affected_rows
            })
            if (!response) {
              console.error('response', response)
              Toast.error('Error saving')
              return false
            }
          }
        }
        Toast.show(`Saved`)
        refetch(reviewsQuery)
      } catch (err) {
        console.error('error', err)
        Toast.error('Error saving')
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
  // until gqty is more reliable...
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
        favorited: !state,
      }
      setState(next.favorited)
      // fixes slow speed bug
      client.cache = {}
      await upsert(next)
    },
  }
}
