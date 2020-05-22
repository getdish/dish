import { resolved } from 'gqless'

import {
  restaurant_tag_constraint,
  restaurant_tag_update_column,
} from '../graphql'
import { mutation } from '../graphql/mutation'
import { RestaurantTag } from '../types'

export async function restaurantTagUpsert(
  restaurant_id: string,
  tags: Partial<RestaurantTag>[]
): Promise<void> {
  const objects: RestaurantTag[] = tags.map((tag) => ({
    ...tag,
    restaurant_id,
  }))
  return await resolved(() => {
    mutation.insert_restaurant_tag({
      objects: objects,
      on_conflict: {
        constraint: restaurant_tag_constraint.restaurant_tag_pkey,
        update_columns: [
          restaurant_tag_update_column.rank,
          restaurant_tag_update_column.photos,
          restaurant_tag_update_column.rating,
        ],
      },
    })
  })
}
