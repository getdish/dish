import { selectFields } from '@dish/gqless'
import _, { chunk } from 'lodash'

import { globalTagId } from '../constants'
import { Maybe, client, order_by, resolved, restaurant } from '../graphql'
import { createQueryHelpersFor } from '../helpers/queryHelpers'
import { SelectionOptions, resolvedWithFields } from '../helpers/queryResolvers'
import { tagSlugs } from '../helpers/tagHelpers'
import { Restaurant, RestaurantTag, RestaurantWithId } from '../types'
import { restaurantTagUpsert } from './restaurantTagQueries'
import {
  tagFindAll,
  tagGetAllChildren,
  tagGetAllGenerics,
  tagSelectAll,
  tagUpsert,
} from './tagQueries'

const query = client.query

const QueryHelpers = createQueryHelpersFor<Restaurant>('restaurant')
export const restaurantInsert = QueryHelpers.insert
export const restaurantUpsert = QueryHelpers.upsert
export const restaurantUpdate = QueryHelpers.update
export const restaurantFindOne = QueryHelpers.findOne
export const restaurantRefresh = QueryHelpers.refresh

export const restaurant_fixture = {
  name: 'Test Restaurant',
  address: 'On The Street',
  geocoder_id: '123',
  location: { type: 'Point', coordinates: [0, 0] },
}

export async function restaurantFindOneWithTags(
  restaurant: Partial<RestaurantWithId>
) {
  return await restaurantFindOne(restaurant, {
    select: (v: Maybe<restaurant>[]) => {
      return v.map((rest) => {
        return {
          ...selectFields(rest),
          tag_names: rest?.tag_names(),
          tags: rest?.tags().map((tagV) => {
            return {
              ...selectFields(tagV),
              tag: {
                ...selectFields(tagV.tag),
                categories: tagV.tag.categories().map((catV) => {
                  return {
                    category: selectFields(catV.category),
                  }
                }),
                parent: selectFields(tagV.tag.parent),
                alternates: tagV.tag.alternates(),
              },
              sentences: selectFields(tagV.sentences()),
              score_breakdown: tagV.score_breakdown(),
              source_breakdown: tagV.source_breakdown(),
            }
          }),
          menu_items: selectFields(rest?.menu_items()),
          score_breakdown: rest?.score_breakdown(),
          source_breakdown: rest?.source_breakdown(),
          photos: rest?.photos(),
          rating_factors: rest?.rating_factors(),
          sources: rest?.sources(),
        }
      })
    },
  })
}

export async function restaurantFindBatch(
  size: number,
  previous_id: string,
  extra_where: {} = {}
): Promise<restaurant[]> {
  return await resolved(() => {
    return query.restaurant({
      where: {
        id: { _gt: previous_id },
        ...extra_where,
      },
      order_by: [{ id: order_by.asc }],
      limit: size,
    })
  })
}

export async function restaurantFindNear(
  lat: number,
  lng: number,
  distance: number
): Promise<restaurant[]> {
  return await resolved(() => {
    const restaurant = query.restaurant({
      where: {
        location: {
          _st_d_within: {
            distance: distance,
            from: {
              type: 'Point',
              coordinates: [lng, lat],
            },
          },
        },
      },
    })

    return selectFields(restaurant, '*', 1)
  })
}

export async function restaurantUpsertManyTags(
  restaurant: RestaurantWithId,
  restaurant_tags: Partial<RestaurantTag>[],
  opts?: SelectionOptions
) {
  if (!restaurant_tags.length) {
    return null
  }
  const populated = restaurant_tags.map((rt) => {
    const existing = getRestaurantTagFromTag(restaurant, rt.tag_id)
    return { ...existing, ...rt }
  })
  const chunks = chunk(populated, 10)
  console.log('Upserting tags chunks...', chunks.length)
  let next: RestaurantWithId | null = null
  for (const [index, chunk] of chunks.entries()) {
    console.log('Inserting tags chunk...', index)
    next = await restaurantUpsertRestaurantTags(restaurant, chunk, opts)
  }
  return next
}

export async function restaurantUpsertOrphanTags(
  restaurant: RestaurantWithId,
  tag_strings: string[]
) {
  const restaurant_tags = await convertSimpleTagsToRestaurantTags(tag_strings)

  return await restaurantUpsertRestaurantTags(restaurant, restaurant_tags)
}

export async function convertSimpleTagsToRestaurantTags(tag_strings: string[]) {
  const tags = tag_strings.map((tag_name) => ({
    name: tag_name,
  }))

  const full_tags = await tagUpsert(tags)

  return full_tags.map((tag) => ({
    tag_id: tag.id,
  }))
}

export async function restaurantUpsertRestaurantTags(
  restaurant: RestaurantWithId,
  restaurant_tags: Partial<RestaurantTag>[],
  opts?: SelectionOptions
) {
  const updated_restaurant = await restaurantTagUpsert(
    restaurant.id,
    restaurant_tags
  )
  return await restaurantUpdateTagNames(updated_restaurant, opts)
}

async function restaurantUpdateTagNames(
  restaurant: RestaurantWithId,
  opts?: SelectionOptions
) {
  if (!restaurant) {
    return null
  }
  const tags = restaurant.tags ?? []
  const tag_names: string[] = [
    ...new Set(
      tags
        .map((rt) => {
          return tagSlugs(rt.tag)
        })
        .flat()
    ),
  ]

  const dataRestaurantUpdate = await restaurantUpdate(
    {
      ...restaurant,
      tag_names,
    },
    {
      keys: '*',
      select: (v: restaurant[]) => {
        return v.map((rest) => {
          return {
            ...selectFields(rest),
            tag_names: rest.tag_names(),
            tags: rest.tags().map((r_t) => {
              const tagInfo = selectFields(r_t.tag)

              return {
                ...selectFields(r_t, '*', 2),
                tag: {
                  ...tagInfo,
                  categories: r_t.tag.categories().map((cat) => {
                    return {
                      ...selectFields(cat),
                      category: selectFields(cat.category),
                    }
                  }),
                  parent: selectFields(r_t.tag.parent),
                },
              }
            }),
          }
        })
      },
      ...opts,
    }
  )

  return dataRestaurantUpdate
}

function getRestaurantTagFromTag(restaurant: Restaurant, tag_id: string) {
  const existing = (restaurant.tags || []).find((i) => {
    return i.tag.id == tag_id
  })
  let rt = {} as RestaurantTag
  if (existing) {
    const cloned = _.cloneDeep(existing)
    //@ts-ignore
    delete cloned.tag
    //@ts-ignore
    delete cloned.restaurant
    rt = cloned
  }
  rt.tag_id = tag_id
  return rt
}

export async function restaurantGetAllPossibleTags(restaurant: Restaurant) {
  const directCuisineDishes = await tagGetAllChildren(
    (restaurant.tags ?? []).map((i) => {
      return i.tag.id
    })
  )
  const nonDirectCuisineDishes = await resolvedWithFields(() => {
    return query.tag({
      order_by: [{ popularity: order_by.desc_nulls_last }],
      where: {
        type: {
          _eq: 'dish',
        },
      },
      // get more or less if they already have a lot of cuisine tags
      limit: directCuisineDishes.length > 20 ? 25 : 100,
    })
  }, tagSelectAll)
  const cuisineDishes = [
    // get tagged cuisine dishes
    ...directCuisineDishes,
    // to ensure we scan at least some dishes if no cuisine tags found
    // for now just default to grabbing the top popular dish tags
    ...nonDirectCuisineDishes,
  ]
  // prettier-ignore
  console.log('Dish tags', cuisineDishes.map((x) => x.name).slice(0, 10).join(', '), '...', cuisineDishes.length)
  const orphans = restaurant.tags
    .filter((rt) => {
      return rt?.tag.parentId == globalTagId
    })
    .map((rt) => rt?.tag)
  const generics = await tagGetAllGenerics()
  return _.uniqBy([...cuisineDishes, ...orphans, ...generics], (x) => x.id)
}
