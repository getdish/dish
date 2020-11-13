import _ from 'lodash'

import { globalTagId } from '../constants'
import {
  Maybe,
  client,
  order_by,
  resolved,
  restaurant,
  selectFields,
} from '../graphql/new-generated'
// import { order_by, query } from '../graphql'
import { Restaurant, RestaurantTag, RestaurantWithId, Tag } from '../types'
import { createQueryHelpersFor } from './queryHelpers'
// import { resolvedWithFields } from './queryResolvers'
import { restaurantTagUpsert } from './restaurantTag'
import { tagSlugs } from './tag-extension-helpers'
import { tagGetAllChildren, tagGetAllGenerics, tagUpsert } from './tag-helpers'

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

export async function restaurantFindOneWithTags(restaurant: RestaurantWithId) {
  return await restaurantFindOne(restaurant, (v: Maybe<restaurant>[]) => {
    return v.map((rest) => {
      return {
        ...selectFields(rest),
        tags: rest?.tags().map((tagV) => {
          return {
            ...selectFields(tagV),
            tag: {
              categories: tagV.tag.categories().map((catV) => {
                return {
                  category: selectFields(catV.category),
                }
              }),
              parent: selectFields(tagV.tag.parent),
            },
            sentences: selectFields(tagV.sentences()),
          }
        }),
      } as any
    })
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
  restaurant_tags: RestaurantTag[]
) {
  if (!restaurant_tags.length) return
  const populated = restaurant_tags.map((rt) => {
    const existing = getRestaurantTagFromTag(restaurant, rt.tag_id)
    return { ...existing, ...rt }
  })
  const next = await restaurantUpsertRestaurantTags(restaurant, populated)
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
  const tags = tag_strings.map<Tag>((tag_name) => ({
    name: tag_name,
  }))
  const full_tags = await tagUpsert(tags)
  return full_tags.map<RestaurantTag>((tag) => ({
    tag_id: tag.id,
  }))
}

export async function restaurantUpsertRestaurantTags(
  restaurant: RestaurantWithId,
  restaurant_tags: RestaurantTag[]
) {
  const updated_restaurant = await restaurantTagUpsert(
    restaurant.id,
    restaurant_tags
  )
  console.log(140, JSON.stringify(updated_restaurant))
  return await restaurantUpdateTagNames(updated_restaurant)
}

async function restaurantUpdateTagNames(restaurant: RestaurantWithId) {
  if (!restaurant) return
  const tags: RestaurantTag[] = restaurant.tags ?? []
  const tag_names: string[] = [
    ...new Set(
      tags
        .map((rt: RestaurantTag) => {
          // @natew do you know why this has to be manually cast to a Tag?
          return tagSlugs(rt.tag as Tag)
        })
        .flat()
    ),
  ]
  return await restaurantUpdate({
    ...restaurant,
    // @ts-ignore
    tag_names: tag_names,
  })
}

function getRestaurantTagFromTag(restaurant: Restaurant, tag_id: string) {
  const existing = (restaurant.tags || []).find((i) => {
    return i.tag.id == tag_id
  })
  let rt = {} as RestaurantTag
  if (existing) {
    const cloned = _.cloneDeep(existing)
    delete cloned.tag
    delete cloned.restaurant
    rt = cloned
  }
  rt.tag_id = tag_id
  return rt
}

export async function restaurantGetAllPossibleTags(restaurant: Restaurant) {
  const cuisine_dishes = await tagGetAllChildren(
    (restaurant.tags ?? []).map((i) => {
      return i.tag.id
    })
  )
  const orphans = restaurant.tags
    .filter((rt) => {
      return rt.tag.parentId == globalTagId
    })
    .map((rt) => rt.tag)
  const generics = await tagGetAllGenerics()
  return [...cuisine_dishes, ...orphans, ...generics]
}
