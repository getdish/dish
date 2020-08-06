import { globalTagId } from '../constants'
import { order_by, query, review_constraint, t_uuid } from '../graphql'
import { Review } from '../types'
import { createQueryHelpersFor } from './queryHelpers'
import { resolvedWithFields } from './queryResolvers'

const QueryHelpers = createQueryHelpersFor<Review>('review')
export const reviewInsert = QueryHelpers.insert
export const reviewUpsert = QueryHelpers.upsert
export const reviewUpdate = QueryHelpers.update
export const reviewFindOne = QueryHelpers.findOne
export const reviewRefresh = QueryHelpers.refresh

export async function reviewFindAllForRestaurant(restaurant_id: t_uuid) {
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

export async function reviewFindAllForUser(user_id: t_uuid) {
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
  user_id: t_uuid,
  restaurant_id: t_uuid,
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
  return await reviewUpsert(
    reviews,
    review_constraint.review_username_restaurant_id_tag_id_authored_at_key
  )
}
