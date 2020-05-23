import { query } from '../graphql'
import { Review, ReviewWithId } from '../types'
import { findOne, insert, update, upsert } from './queryHelpers'
import { resolveFields, resolvedWithFields } from './queryResolvers'

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
  const res = await resolvedWithFields(() => {
    return query.review({
      where: {
        restaurant_id: { _eq: restaurant_id },
      },
      order_by: {
        // @ts-ignore TODO bad type?
        updated_at: 'desc',
      },
    })
  })
  return res
}

export async function reviewFindAllForUser(user_id: string) {
  // TODO just need to compile
  return await resolvedWithFields(() => {
    return query.review({
      where: {
        user_id: { _eq: user_id },
      },
      order_by: {
        // @ts-ignore TODO bad type?
        updated_at: 'desc',
      },
    })
  })
}
