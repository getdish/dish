import { query } from '../graphql'
import { Review } from '../types'
import { allFieldsForTable } from './allFieldsForTable'
import { findOne, insert, update, upsert } from './queryHelpers'
import { resolveFields } from './resolveFields'

export async function reviewInsert(reviews: Review[]): Promise<Review[]> {
  return await insert<Review>('review', reviews)
}

export async function reviewUpsert(objects: Review[]): Promise<Review[]> {
  return await upsert<Review>('review', '', objects)
}

export async function reviewUpdate(review: Review): Promise<Review[]> {
  return await update<Review>('review', review)
}

export async function reviewFindOne(review: Partial<Review>): Promise<Review> {
  return await findOne<Review>('review', review)
}

export async function reviewFindAllForRestaurant(
  restaurant_id: string
): Promise<Review[]> {
  return await resolveFields(allFieldsForTable('reviews'), () => {
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
}

export async function reviewFindAllForUser(user_id: string): Promise<Review[]> {
  return await resolveFields(allFieldsForTable('reviews'), () => {
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
