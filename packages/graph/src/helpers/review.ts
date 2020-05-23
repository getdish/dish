import { order_by, query } from '../graphql'
import { Review, ReviewWithId } from '../types'
import { findOne, insert, update } from './queryHelpers'
import { resolvedWithFields } from './queryResolvers'

export async function reviewInsert(reviews: Review[]): Promise<Review[]> {
  return await insert<Review>('review', reviews)
}

// export async function reviewUpsert(objects: Review[]): Promise<Review[]> {
//   return await upsert<Review>('review', '', objects)
// }

export async function reviewUpdate(
  review: ReviewWithId
): Promise<ReviewWithId> {
  return await update<ReviewWithId>('review', review)
}

export async function reviewFindOne(
  review: Partial<Review>
): Promise<ReviewWithId | null> {
  return await findOne<ReviewWithId>('review', review)
}

export async function reviewFindAllForRestaurant(restaurant_id: string) {
  return await resolvedWithFields(() => {
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
