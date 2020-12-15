import { selectFields } from '@dish/gqless'

import {
  mutation,
  restaurant_tag,
  restaurant_tag_constraint,
  restaurant_tag_update_column,
} from '../graphql'
import { RestaurantTag, RestaurantWithId } from '../types'
import { resolvedMutationWithFields } from './queryResolvers'

export async function restaurantTagUpsert(
  restaurant_id: string,
  tags: Partial<RestaurantTag>[],
  fn?: (returning: restaurant_tag[]) => any[]
): Promise<RestaurantWithId> {
  if (!tags.length) throw new Error('No tags given to restaurantTagUpsert')
  const objects: Partial<RestaurantTag>[] = tags.map((tag) => {
    if (!tag.sentences || tag.sentences.length == 0) {
      delete tag.sentences
    }
    return {
      ...tag,
      restaurant_id,
    }
  })
  const response = await resolvedMutationWithFields(
    () => {
      const insert = mutation.insert_restaurant_tag

      const obj = insert({
        objects: objects as any,
        on_conflict: {
          constraint: restaurant_tag_constraint.restaurant_tag_pkey,
          update_columns: [
            restaurant_tag_update_column.rank,
            restaurant_tag_update_column.photos,
            restaurant_tag_update_column.rating,
            restaurant_tag_update_column.score,
          ],
        },
      })

      return obj
    },
    '*',
    fn ||
      ((returning: restaurant_tag[]) => {
        return returning.map((r_t) => {
          const rest_tags = r_t.restaurant.tags()
          return {
            restaurant: {
              ...selectFields(r_t.restaurant),
              tags: rest_tags.map((r_t_2) => {
                const tag_categories = r_t_2.tag.categories()
                return {
                  tag: {
                    ...selectFields(r_t_2.tag),
                    categories: tag_categories.map((cat) => {
                      return {
                        category: selectFields(cat.category),
                      }
                    }),
                    parent: selectFields(r_t_2.tag.parent),
                  },
                  reviews: selectFields(r_t_2.reviews(), '*', 2),
                }
              }),
            },
          }
        })
      })
  )
  return (response as any)[0].restaurant
}
