import _ from 'lodash'

import { order_by, query } from '../graphql'
import { tagGetAllChildren, tagUpsert } from '../helpers/tag'
import {
  Restaurant,
  RestaurantTag,
  RestaurantTagWithID,
  RestaurantWithId,
  Scrape,
  Tag,
} from '../types'
import { allFieldsForTable } from './allFieldsForTable'
import { levenshteinDistance } from './levenshteinDistance'
import {
  findOne,
  insert,
  update,
  upsert,
  upsertConstraints,
} from './queryHelpers'
import { resolveFields } from './resolveFields'

export async function restaurantInsert(restaurants: Restaurant[]) {
  return await insert<Restaurant>('restaurant', restaurants)
}

export async function restaurantUpsert(objects: Restaurant[]) {
  return await upsert<Restaurant>(
    'restaurant',
    upsertConstraints.restaurant_name_address_key,
    objects
  )
}

export async function restaurantUpdate(restaurant: RestaurantWithId) {
  return await update<RestaurantWithId>('restaurant', restaurant)
}

export async function restaurantFindOne(restaurant: Partial<Restaurant>) {
  return await findOne<RestaurantWithId>('restaurant', restaurant)
}

export async function restaurantFindBatch(
  size: number,
  previous_id: string,
  extra_where: {} = {}
): Promise<Restaurant[]> {
  return await resolveFields(allFieldsForTable('restaurant'), () => {
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
  return await resolveFields(allFieldsForTable('restaurant'), () => {
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

export async function restaurantLatestScrape(
  restaurant: Restaurant,
  source: string
): Promise<Scrape> {
  const [first] = await resolveFields(allFieldsForTable('scrape'), () => {
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
) {
  const found = await findExistingCanonical(lon, lat, name)
  if (found) return found
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
  console.log(
    'tom, restaurantInsert for now doesnt return new restaurant, idk if want to add here'
  )
  // restaurant = await find()
  if (process.env.RUN_WITHOUT_WORKER != 'true') {
    console.log('Created new canonical restaurant: ' + restaurant.id)
  }
  return restaurant
}

async function findExistingCanonical(lon: number, lat: number, name: string) {
  const nears = await restaurantFindNear(lat, lon, 0.0005)
  let found: Restaurant | undefined = undefined
  let shortlist = [] as Restaurant[]
  let highest_sources_count = 0
  for (const candidate of nears) {
    if (candidate.name.includes(name) || name.includes(candidate.name)) {
      shortlist.push(candidate)
    }

    if (levenshteinDistance(candidate.name, name) <= 3) {
      shortlist.push(candidate)
    }
  }
  if (shortlist.length == 0) return

  found = shortlist[0]
  for (const final of shortlist) {
    const sources_count = Object.keys(final.sources || {}).length
    if (sources_count > highest_sources_count) {
      highest_sources_count = sources_count
      found = final
    }
  }
  if (process.env.RUN_WITHOUT_WORKER != 'true') {
    console.log('Found existing canonical restaurant: ' + found.id)
  }
  return found
}

export async function restaurantRefresh(restaurant: Restaurant) {
  return await restaurantFindOne({ id: restaurant.id })
}

export async function restaurantUpsertManyTags(
  restaurant: RestaurantWithId,
  restaurant_tags: RestaurantTag[]
) {
  const populated = restaurant_tags.map((rt) => {
    const existing = getRestaurantTagFromTag(restaurant, rt.tag_id)
    return { ...existing, ...rt }
  })
  await restaurantUpsertRestaurantTag(restaurant, populated)
  return await restaurantRefresh(restaurant)
}

export async function restaurantUpsertRestaurantTag(
  restaurant: RestaurantWithId,
  restaurant_tags: RestaurantTag[]
) {
  await restaurantUpsertManyTags(restaurant, restaurant_tags)
  await updateTagNames(restaurant)
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
  await restaurantUpsertRestaurantTag(restaurant, restaurant_tags)
}

async function updateTagNames(restaurant: RestaurantWithId) {
  restaurant = await restaurantRefresh(restaurant)
  const tag_names = restaurant.tags.map((i) => i.tag.slugs().flat())
  // @ts-ignore
  restaurant.tag_names = _.uniq([
    ...(restaurant.tag_names() || []),
    ...tag_names,
  ])
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

export async function restaurantUpsertTagRestaurantData(
  restaurant: RestaurantWithId,
  restaurant_tags: RestaurantTagWithID[]
) {
  return await restaurantUpsertManyTags(restaurant, restaurant_tags)
}

export async function restaurantGetLatestScrape(
  restaurant: RestaurantWithId,
  source: string
): Promise<Scrape> {
  const [first] = await resolveFields(allFieldsForTable('scrape'), () => {
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

export async function restaurantGetAllPossibleTags(restaurant: Restaurant) {
  return await tagGetAllChildren(
    restaurant.tags.map((i) => {
      return i.tag.id
    })
  )
}
