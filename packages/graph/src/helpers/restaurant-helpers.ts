import _ from 'lodash'

import { globalTagId } from '../constants'
import { order_by, query } from '../graphql'
import { Restaurant, RestaurantTag, RestaurantWithId, Tag } from '../types'
import { createQueryHelpersFor } from './queryHelpers'
import { resolvedWithFields } from './queryResolvers'
import { restaurantTagUpsert } from './restaurantTag'
import { tagSlugs } from './tag-extension-helpers'
import { tagGetAllChildren, tagUpsert } from './tag-helpers'

const QueryHelpers = createQueryHelpersFor<Restaurant>('restaurant')
export const restaurantInsert = QueryHelpers.insert
export const restaurantUpsert = QueryHelpers.upsert
export const restaurantUpdate = QueryHelpers.update
export const restaurantFindOne = QueryHelpers.findOne
export const restaurantRefresh = QueryHelpers.refresh

const tagDataRelations = {
  relations: ['tags.tag.categories.category', 'tags.tag.parent'],
}

export async function restaurantFindOneWithTags(
  restaurant: RestaurantWithId,
  extra_relations: string[] = []
) {
  const options = {
    ...tagDataRelations,
    relations: [
      ...tagDataRelations.relations,
      ...['tags.sentences'],
      ...extra_relations,
    ],
  }
  return await restaurantFindOne(restaurant, options)
}

export async function restaurantFindBatch(
  size: number,
  previous_id: string,
  extra_where: {} = {}
): Promise<Restaurant[]> {
  return await resolvedWithFields(() => {
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
): Promise<Restaurant[]> {
  return await resolvedWithFields(() => {
    return query.restaurant({
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
  return await restaurantUpdate(
    {
      ...restaurant,
      // @ts-ignore
      tag_names: tag_names,
    },
    tagDataRelations
  )
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
  return [...cuisine_dishes, ...orphans]
}
