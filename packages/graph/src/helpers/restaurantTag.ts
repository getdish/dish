// import {
//   restaurant_tag_constraint,
//   restaurant_tag_update_column,
// } from '../graphql'
import {
  mutation,
  query,
  restaurant_tag,
  restaurant_tag_constraint,
  restaurant_tag_update_column,
  selectFields,
} from '../graphql/new-generated'
// import { mutation } from '../graphql/mutation'
import { RestaurantTag, RestaurantWithId } from '../types'
import { resolvedMutationWithFields } from './queryResolvers'

export async function restaurantTagUpsert(
  restaurant_id: string,
  tags: RestaurantTag[]
): Promise<RestaurantWithId> {
  if (!tags.length) throw new Error('No tags given to restaurantTagUpsert')
  const objects: RestaurantTag[] = tags.map((tag) => {
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
    (returning: restaurant_tag[]) => {
      return returning.map((r_t) => {
        r_t.restaurant
        return {
          restaurant: {
            ...selectFields(r_t.restaurant),
            tags: r_t.restaurant.tags().map((r_t_2) => {
              return {
                tag: {
                  ...selectFields(r_t_2.tag),
                  categories: r_t_2.tag.categories().map((cat) => {
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
    }
    // {
    //   relations: [
    //     'restaurant.tags.tag.categories.category',
    //     'restaurant.tags.tag.parent',
    //     ...extra_relations,
    //   ],
    // }
  )
  return (response as any)[0].restaurant
}
