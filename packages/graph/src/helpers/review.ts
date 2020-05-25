import { order_by, query, review_constraint } from '../graphql'
import { Review } from '../types'
import { createQueryHelpersFor } from './queryHelpers'
import { resolvedWithFields } from './queryResolvers'

const QueryHelpers = createQueryHelpersFor<Review>(
  'review',
  review_constraint.review_user_id_restaurant_id_taxonomy_id_key
)
export const reviewInsert = QueryHelpers.insert
export const reviewUpsert = QueryHelpers.upsert
export const reviewUpdate = QueryHelpers.update
export const reviewFindOne = QueryHelpers.findOne
export const reviewRefresh = QueryHelpers.refresh

export async function reviewFindAllForRestaurant(restaurant_id: string) {
  return await resolvedWithFields('review', () => {
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
  })
}

export async function reviewFindAllForUser(user_id: string) {
  return await resolvedWithFields('review', () => {
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
