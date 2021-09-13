import {
  DeepPartial,
  Review,
  client,
  globalTagId,
  mutate,
  order_by,
  query,
  refetch,
  review,
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

export const useUserReviewQuery = (restaurantSlug: string) => {
  const user = useUserStore().user
  return user
    ? query.review({
        where: {
          text: {
            _neq: '',
          },
          restaurant: {
            slug: {
              _eq: restaurantSlug,
            },
          },
          user_id: {
            _eq: user.id,
          },
        },
        limit: 1,
      })
    : []
}

export const useUserReviewQueryMutations = ({
  restaurantId,
  reviewQuery,
}: {
  restaurantId?: string
  reviewQuery?: review[] | null
}) => {
  const review = reviewQuery?.[0]
  const user = useUserStore().user

  // ensure we select id for update/deletion gqty
  review?.id
  review?.list_id
  review?.restaurant_id
  review?.tag_id

  return {
    async upsertReview(review: Partial<review>) {
      if (!restaurantId || !user) {
        Toast.error('no restaurant / user')
        return
      }
      const result = await upsertUserReview(
        {
          ...review,
          user_id: user.id,
          restaurant_id: restaurantId,
        },
        reviewQuery
      )
      return result
    },
    async deleteReview() {
      if (review) {
        // @ts-ignore
        return await deleteUserReview(review, reviewQuery)
      }
    },
  }
}

export async function upsertUserReview(review: Partial<review>, reviewQuery?: any) {
  const result = await upsertUserReviewFn({
    type: review.type || 'comment',
    id: review.id,
    text: review.text,
    vote: review.vote,
    favorited: review.favorited,
    rating: review.rating,
    list_id: review.list_id,
    restaurant_id: review.restaurant_id,
    tag_id: review.tag_id,
    username: userStore.user?.username ?? review.username,
  })
  if (result === false) {
    // prompted login
    return
  }
  if (!result) {
    console.error('no result for', result)
    Toast.error(`Couldn't save`)
    return
  }
  Toast.show(`Saved!`)
  if (reviewQuery) {
    console.warn('setting cache', review)
    setCache(reviewQuery, [review])
    // refetch(reviewQuery)
  }
  return result
}

export async function deleteUserReview(review: { id: string }, reviewQuery: any[] | null) {
  Toast.show(`Deleting...`)
  await reviewDelete({
    id: review.id,
  })
  if (reviewQuery) {
    setCache(reviewQuery, null)
  }
  Toast.show(`Deleted!`)
  refetch(reviewQuery)
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
    upsert: async (review: UpdateableReview) => {
      const res = await upsertUserReviewFn(review)
      refetch(reviewsQuery)
      return res
    },
  }
}

type UpdateableReview = Partial<review> & {
  // require type
  type: Review['type']
}

export async function upsertUserReviewFn(review: UpdateableReview) {
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
            update_columns: Object.keys(review_update_column) as any,
          },
        })?.affected_rows
      })
      if (!response) {
        console.error('response', response)
        Toast.error('Error saving')
        return false
      }
      return response
    } catch (err) {
      console.log('aught err', err)
      if (err.message?.includes('Uniqueness violation')) {
        const existing = await reviewFindOne(next as any)
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
  } catch (err) {
    console.error('error', err)
    Toast.error('Error saving')
    return false
  }
}

export const useUserFavoriteQuery = (where: review_bool_exp) => {
  const { reviewsQuery, reviews, upsert } = useUserReviewsQuery(where)
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
