import { resolved } from 'gqless'
import _ from 'lodash'

import { order_by, query, restaurant_constraint } from '../graphql'
import { restaurantTagUpsert } from '../helpers/restaurantTag'
import { tagGetAllChildren, tagUpsert } from '../helpers/tag'
import {
  Restaurant,
  RestaurantTag,
  RestaurantWithId,
  Scrape,
  Tag,
} from '../types'
import { allFieldsForTable } from './allFieldsForTable'
import { levenshteinDistance } from './levenshteinDistance'
import { createQueryHelpersFor, objectToWhere } from './queryHelpers'
import { resolvedWithFields } from './queryResolvers'

const QueryHelpers = createQueryHelpersFor<Restaurant>(
  'restaurant',
  restaurant_constraint.restaurant_name_address_key
)
export const restaurantInsert = QueryHelpers.insert
export const restaurantUpsert = QueryHelpers.upsert
export const restaurantUpdate = QueryHelpers.update
export const restaurantFindOne = QueryHelpers.findOne

export async function restaurantFindOneWithTags(
  restaurant: Restaurant
): Promise<Required<Restaurant>> {
  const [first] = await resolved(() => {
    const res = query.restaurant(objectToWhere(restaurant))
    const tag = res[0].tags()[0]
    for (const key of allFieldsForTable('restaurant_tag')) {
      tag[key]
    }
    return res as any
  })
  return first
}

export async function restaurantFindBatch(
  size: number,
  previous_id: string,
  extra_where: {} = {}
): Promise<Restaurant[]> {
  return await resolvedWithFields(() => {
    const x = query.restaurant({
      where: {
        id: { _gt: previous_id },
        ...extra_where,
      },
      order_by: [{ id: order_by.asc }],
      limit: size,
    })
    return x
  })
}

export async function restaurantFindNear(
  lat: number,
  lng: number,
  distance: number
): Promise<Restaurant[]> {
  return await resolvedWithFields(() =>
    query.restaurant({
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
  )
}

export async function restaurantLatestScrape(
  restaurant: Restaurant,
  source: string
): Promise<Scrape> {
  const [first] = await resolvedWithFields(() => {
    return query.scrape({
      where: {
        restaurant_id: {
          _eq: restaurant.id,
        },
        source: {
          _eq: source,
        },
      },
      order_by: [
        {
          updated_at: order_by.desc,
        },
      ],
      limit: 1,
    })
  })
  return first
}

export async function restaurantSaveCanonical(
  lon: number,
  lat: number,
  name: string,
  street_address: string
): Promise<Restaurant> {
  const found = await findExistingCanonical(lon, lat, name)
  if (found) {
    return found
  }
  const [restaurant] = await restaurantInsert([
    {
      name,
      address: street_address,
      location: {
        type: 'Point',
        coordinates: [lon, lat],
      },
    },
  ])
  if (process.env.RUN_WITHOUT_WORKER != 'true') {
    console.log('Created new canonical restaurant: ' + restaurant.id)
  }
  return restaurant
}

async function findExistingCanonical(
  lon: number,
  lat: number,
  name: string
): Promise<Restaurant | null> {
  const nears = await restaurantFindNear(lat, lon, 0.0005)
  let found: Restaurant | undefined = undefined
  let shortlist = [] as Restaurant[]
  let highest_sources_count = 0
  for (const candidate of nears) {
    if (candidate.name?.includes(name) || name.includes(candidate.name ?? '')) {
      shortlist.push(candidate)
    }
    if (levenshteinDistance(candidate.name ?? '', name) <= 3) {
      shortlist.push(candidate)
    }
  }
  if (shortlist.length == 0) {
    return null
  }
  found = shortlist[0]
  for (const final of shortlist) {
    const sources_count = Object.keys(final.sources || {}).length
    if (sources_count > highest_sources_count) {
      highest_sources_count = sources_count
      found = final
    }
  }
  return found
}

export async function restaurantRefresh<A extends Restaurant>(
  restaurant: A
): Promise<A> {
  return (await restaurantFindOne({ id: restaurant.id })) as A
}

export async function restaurantUpsertManyTags(
  restaurant: RestaurantWithId,
  restaurant_tags: RestaurantTag[]
): Promise<RestaurantWithId> {
  const populated = restaurant_tags.map((rt) => {
    const existing = getRestaurantTagFromTag(restaurant, rt.tag_id)
    return { ...existing, ...rt }
  })
  await restaurantTagUpsert(restaurant.id, populated)
  await updateTagNames(restaurant)
  return await restaurantRefresh(restaurant)
}

export async function restaurantUpsertOrphanTags(
  restaurant: RestaurantWithId,
  tag_strings: string[]
) {
  const tags = tag_strings.map((tag_name) => {
    return {
      name: tag_name,
    } as Tag
  })
  const full_tags = await tagUpsert(tags)
  const restaurant_tags = full_tags.map((tag: Tag) => {
    return {
      tag_id: tag.id,
    } as RestaurantTag
  })
  await restaurantTagUpsert(restaurant.id, restaurant_tags)
  await updateTagNames(restaurant)
  return await restaurantFindOne(restaurant)
}

async function updateTagNames(restaurant: RestaurantWithId) {
  restaurant = await restaurantRefresh(restaurant)
  const tag_names = (restaurant.tags ?? []).map((i) => i.tag.slugs().flat())
  restaurant.tag_names = _.uniq([...(restaurant.tag_names || []), ...tag_names])
  return await restaurantUpdate(restaurant)
}

function getRestaurantTagFromTag(restaurant: Restaurant, tag_id: string) {
  const existing = (restaurant.tags || []).find((i) => {
    return i.tag.id == tag_id
  })
  let rt = {} as RestaurantTag
  if (existing) {
    const cloned = _.cloneDeep(existing)
    delete cloned.tag
    rt = cloned
  }
  rt.tag_id = tag_id
  return rt
}

export async function restaurantGetLatestScrape(
  restaurant: RestaurantWithId,
  source: string
): Promise<Scrape> {
  const [first] = await resolvedWithFields(() =>
    query.scrape({
      where: {
        restaurant_id: {
          _eq: restaurant.id,
        },
        source: {
          _eq: source,
        },
      },
      order_by: [
        {
          updated_at: order_by.desc,
        },
      ],
      limit: 1,
    })
  )
  return first
}

export async function restaurantGetAllPossibleTags(restaurant: Restaurant) {
  return await tagGetAllChildren(
    (restaurant.tags ?? []).map((i) => {
      return i.tag.id
    })
  )
}
