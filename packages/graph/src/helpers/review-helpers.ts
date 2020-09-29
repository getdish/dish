import { uniqBy } from 'lodash'

import { globalTagId } from '../constants'
import { order_by, query, review_constraint, uuid } from '../graphql'
import { Review } from '../types'
import { createQueryHelpersFor } from './queryHelpers'
import { resolvedWithFields } from './queryResolvers'

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

export async function reviewFindAllForRestaurant(restaurant_id: uuid) {
  return await resolvedWithFields(
    () => {
      return query.review({
        where: {
          restaurant_id: { _eq: restaurant_id },
        },
        order_by: [
          {
            updated_at: order_by.asc,
          },
        ],
      })
    },
    { relations: ['sentiments'] }
  )
}

export async function reviewFindAllForUser(user_id: uuid) {
  return await resolvedWithFields(() => {
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
  })
}

export async function userFavoriteARestaurant(
  user_id: uuid,
  restaurant_id: uuid,
  favorited = true
) {
  const [review] = await reviewUpsert([
    {
      restaurant_id: restaurant_id,
      user_id: user_id,
      tag_id: globalTagId,
      favorited: favorited,
    },
  ])
  return review
}

export async function userFavorites(user_id: string) {
  return await resolvedWithFields(() => {
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
  })
}

export async function reviewExternalUpsert(reviews: Review[]) {
  reviews = reviews.map((r) => {
    r.text = cleanReviewText(r.text)
    return r
  })
  return await reviewUpsert(
    reviews,
    review_constraint.review_username_restaurant_id_tag_id_authored_at_key
  )
}

export function cleanReviewText(text: string | null | undefined) {
  if (!text) return null
  const br = /<br\s*[\/]?>/gi
  const apostrophe = '&#39;'
  const cleaned = text.replace(br, '\n').replaceAll(apostrophe, "'")
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

export function dedupeSentiments(sentiments: ReviewTagSentence[]) {
  const deduped = uniqBy(sentiments, (sentiment: ReviewTagSentence) => {
    return sentiment.tag_id + sentiment.sentence
  })
  return deduped
}
