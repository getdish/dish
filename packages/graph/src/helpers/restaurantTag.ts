import {
  restaurant_tag_constraint,
  restaurant_tag_update_column,
} from '../graphql'
import { mutation } from '../graphql/mutation'
import { RestaurantTag, RestaurantWithId } from '../types'
import { resolvedMutationWithFields } from './queryResolvers'

export async function restaurantTagUpsert(
  restaurant_id: string,
  tags: RestaurantTag[],
  extra_relations: string[] = []
): Promise<RestaurantWithId> {
  if (!tags.length) throw new Error('No tags given to restaurantTagUpsert')
  const objects: RestaurantTag[] = tags.map((tag) => ({
    ...tag,
    restaurant_id,
  }))
  const response = await resolvedMutationWithFields(
    () => {
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
    },
    {
      relations: [
        'restaurant.tags.tag.categories.category',
        'restaurant.tags.tag.parent',
        ...extra_relations,
      ],
    }
  )
  return response[0].restaurant
}
