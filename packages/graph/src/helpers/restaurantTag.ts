import { resolved } from 'gqless'

import { mutation } from '../graphql/mutation'
import { RestaurantTag } from '../types'
import { allFieldsForTable } from './allFieldsForTable'

const upsert_constraint = 'restaurant_tag_pkey'

export async function restaurantTagUpsertMany(
  restaurant_id: string,
  tags: Partial<RestaurantTag>[]
): Promise<void> {
  const objects = tags.map((i) => {
    if (typeof i.asObject != 'undefined') {
      i = i.asObject()
    }
    i.restaurant_id = restaurant_id
    return i
  })

  return await resolved(() => {
    mutation.insert_restaurant_tag({
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
