import { resolved } from 'gqless'

import {
  restaurant_tag_constraint,
  restaurant_tag_update_column,
} from '../graphql'
import { mutation } from '../graphql/mutation'
import { RestaurantTag, Tag } from '../types'
import { resolvedMutation } from './queryResolvers'

export async function restaurantTagUpsert(
  restaurant_id: string,
  tags: RestaurantTag[]
): Promise<void> {
  const objects: RestaurantTag[] = tags.map((tag) => ({
    ...tag,
    restaurant_id,
  }))
  await resolvedMutation(() => {
    return mutation.insert_restaurant_tag({
      // @ts-ignore
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
