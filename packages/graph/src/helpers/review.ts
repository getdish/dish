import { query } from '../graphql'
import { Review } from '../types'
import { allFieldsForTable } from './allFieldsForTable'
import { findOne } from './queryHelpers'
import { resolveFields } from './resolveFields'

export async function reviewFindOne(
  restaurant_id: string,
  user_id: string,
  tag_id = ''
): Promise<Review> {
  return await findOne<Review>('reviews', {
    restaurant_id,
    user_id,
    tag_id,
  })
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
