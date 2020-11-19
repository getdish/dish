import { uniqBy } from 'lodash'

import { globalTagId } from '../constants'
import {
  Scalars,
  order_by,
  query,
  review,
  review_constraint,
  selectFields,
} from '../graphql/new-generated'
// import { order_by, query, review_constraint, uuid } from '../graphql'
import { Review } from '../types'
import { createQueryHelpersFor } from './queryHelpers'
import { resolvedWithFields } from './queryResolvers'

export type uuid = Scalars['uuid']

const QueryHelpers = createQueryHelpersFor<Review>('review')
export const reviewInsert = QueryHelpers.insert
export const reviewUpsert = QueryHelpers.upsert
export const reviewUpdate = QueryHelpers.update
export const reviewFindOne = QueryHelpers.findOne
export const reviewRefresh = QueryHelpers.refresh
export const reviewDelete = QueryHelpers.delete

export type ReviewTagSentence = {
  id: string
  review_id: string
  tag_id: string
  sentence?: string
  ml_sentiment?: number
  ml_score?: number
}

String.prototype.replaceAll = function (search, replacement) {
  var target = this
  return target.replace(new RegExp(search, 'g'), replacement)
}

export async function reviewFindAllForRestaurant(
  restaurant_id: uuid,
  fn?: (v: any) => unknown
) {
  return await resolvedWithFields(
    () => {
      const r = query.review({
        where: {
          restaurant_id: { _eq: restaurant_id },
        },
        order_by: [
          {
            updated_at: order_by.asc,
          },
        ],
      })

      return r
    },
    (r: review[]) => {
      return r.map((review) => {
        return {
          ...selectFields(review, '*', 2),
          restaurant: {
            ...selectFields(review.restaurant),
            tags: selectFields(review.restaurant.tags(), '*', 2),
          },
          sentiments: selectFields(review.sentiments(), '*', 2),
        }
      })
    }
  )
}

export async function reviewFindAllForUser(user_id: uuid) {
  return await resolvedWithFields(
    () => {
      return query.review({
        where: {
          user_id: { _eq: user_id },
        },
        order_by: [
          {
            updated_at: order_by.asc,
          },
        ],
      })
    },
    (r: review[]) => {
      return r.map((review) => {
        return {
          ...selectFields(review, '*', 2),
          restaurant: {
            ...selectFields(review.restaurant),
            tags: selectFields(review.restaurant.tags(), '*', 2),
          },
          sentiments: selectFields(review.sentiments(), '*', 2),
        }
      })
    }
  )
}

export async function userFavoriteARestaurant(
  user_id: uuid,
  restaurant_id: uuid,
  favorited = true
) {
  const [review] = await reviewUpsert(
    [
      {
        restaurant_id: restaurant_id,
        user_id: user_id,
        tag_id: globalTagId,
        favorited: favorited,
      },
    ],
    undefined,
    (r_v: review[]) => {
      return r_v.map((review) => {
        return {
          ...selectFields(review, '*', 2),
          restaurant: {
            ...selectFields(review.restaurant),
            tags: selectFields(review.restaurant.tags(), '*', 2),
          },
          sentiments: selectFields(review.sentiments(), '*', 2),
        }
      })
    }
  )
  return review
}

export async function userFavorites(user_id: string) {
  return await resolvedWithFields(
    () => {
      return query.review({
        where: {
          user_id: { _eq: user_id },
          favorited: { _eq: true },
        },
        order_by: [
          {
            updated_at: order_by.asc,
          },
        ],
      })
    },
    (r: review[]) => {
      return r.map((review) => {
        return {
          ...selectFields(review, '*', 2),
          restaurant: {
            ...selectFields(review.restaurant),
            tags: selectFields(review.restaurant.tags(), '*', 2),
          },
          sentiments: selectFields(review.sentiments(), '*', 2),
        }
      })
    }
  )
}

export async function reviewExternalUpsert(reviews: Review[]) {
  reviews = reviews.map((r) => {
    r.text = cleanReviewText(r.text)
    return r
  })

  const d = await reviewUpsert(
    reviews,
    review_constraint.review_username_restaurant_id_tag_id_authored_at_key,
    (r_v: review[]) => {
      return r_v.map((review) => {
        return {
          ...selectFields(review, '*', 2),
          restaurant: {
            ...selectFields(review.restaurant),
            tags: selectFields(review.restaurant.tags(), '*', 2),
          },
          sentiments: selectFields(review.sentiments(), '*', 2),
        }
      })
    }
  )

  return d
}

export function cleanReviewText(text: string | null | undefined) {
  if (!text) return null
  const br = /<br\s*[\/]?>/gi
  const apostrophe = '&#39;'
  const quote = '&#34;'
  const cleaned = text
    .replace(br, '\n')
    .replaceAll(apostrophe, "'")
    .replaceAll(quote, '"')
  return cleaned
}

export function dedupeReviews(reviews: Review[]) {
  const deduped = uniqBy(reviews, (review: Review) => {
    return (
      review.username +
      review.restaurant_id +
      review.tag_id +
      review.authored_at
    )
  })
  return deduped
}

export function dedupeSentiments<A extends ReviewTagSentence>(sentiments: A[]) {
  const deduped = uniqBy(sentiments, (sentiment: ReviewTagSentence) => {
    return sentiment.tag_id + sentiment.sentence
  })
  return deduped
}
