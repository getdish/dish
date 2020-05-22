import { resolved } from 'gqless'

import { mutation } from '../graphql/mutation'
import { RestaurantTag } from '../types'
import { allFieldsForTable } from './allFieldsForTable'

const upsert_constraint = 'restaurant_tag_pkey'

export async function restaurantTagUpsertMany(
  restaurant_id: string,
  tags: Partial<RestaurantTag>[]
): Promise<void> {
  const objects: RestaurantTag[] = tags.map((tag) => ({
    ...tag,
    restaurant_id,
  }))
  return await resolved(() => {
    mutation.insert_restaurant_tag({
      // @ts-ignore
      objects: objects,
      // TODO not sure how to make this
      on_conflict: {
        // @ts-ignore
        constraint: upsert_constraint,
        // @ts-ignore
        update_columns: allFieldsForTable('restaurant_tag'),
      },
    })
  })
}
