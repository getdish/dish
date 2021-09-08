import { RestaurantWithId, ZeroUUID, ensureJSONSyntax, restaurantFindOne } from '@dish/graph'
import { scrape_db } from '@dish/helpers-node'
import { clone } from 'lodash'

import { DoorDash } from './doordash/DoorDash'
import { GoogleGeocoder } from './google/GoogleGeocoder'
import { GrubHub } from './grubhub/GrubHub'
import { Infatuated } from './infatuated/Infatuated'
import { Michelin } from './michelin/Michelin'
import { Tripadvisor } from './tripadvisor/Tripadvisor'
import { UberEats } from './ubereats/UberEats'
import { Yelp } from './yelp/Yelp'

type LatLon = {
  lon: number
  lat: number
}

export type Scrape<D extends ScrapeData = ScrapeData> = {
  id?: string
  time?: Date
  restaurant_id: string
  location: LatLon
  source: string
  id_from_source: string
  data: D
}

export type ScrapeData = { [key: string]: ScrapeData | any }

export function scrapeGetData<
  S extends Scrape = Scrape,
  Select extends Function = (s: S['data']) => any
>(
  scrape: S | null,
  select: Select,
  defaultValue: any = ''
): Select extends (s: S['data']) => infer Res ? Res : any {
  if (!scrape) {
    return defaultValue
  }
  return clone(select(scrape.data) ?? defaultValue)
}

export async function scrapeFindOneBySourceID(source: string, id: string, allow_not_found = false) {
  const result = await scrape_db.query(`
  SELECT *, st_asgeojson(location) as location
  FROM scrape
    WHERE source = '${source}'
    AND id_from_source = '${id}'
    AND restaurant_id != '${ZeroUUID}'
  ORDER BY time DESC
  LIMIT 1;
`)
  if (result.rows.length == 0) {
    if (allow_not_found) {
      return null
    } else {
      throw new Error('Scrape not found: ' + id)
    }
  }
  result.rows[0].location = parseLocation(result.rows[0].location)
  return result.rows[0] as Scrape
}

export async function scrapeFindOneByUUID(id: string) {
  const result = await scrape_db.query(`
    SELECT *, st_asgeojson(location) as location
    FROM scrape
      WHERE id = '${id}'
  `)
  result.rows[0].location = parseLocation(result.rows[0].location)
  return result.rows[0] as Scrape
}

function parseLocation(json: string) {
  const location = JSON.parse(json)
  return {
    lon: location.coordinates[0],
    lat: location.coordinates[1],
  }
}

export async function latestScrapeForRestaurant(restaurant: RestaurantWithId, source: string) {
  const result = await scrape_db.query(`
    SELECT *
    FROM scrape
      WHERE restaurant_id = '${restaurant.id}'
      AND source = '${source}'
    ORDER BY time DESC
    LIMIT 1;
  `)
  if (result.rows.length == 0) {
    if (process.env.NODE_ENV !== 'test') {
      console.debug(`No scrapes found for ${source}: ` + restaurant.name)
    }
    return null
  } else {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`${source} scrape found for: ` + restaurant.name)
    }
    return result.rows[0] as Scrape
  }
}

export async function removeScrapeForRestaurant(restaurant: RestaurantWithId, source: string) {
  console.log('Removing scrape for', restaurant.id)
  await scrape_db.query(`
    DELETE
    FROM scrape
      WHERE restaurant_id = '${restaurant.id}'
      AND source = '${source}';
  `)
}

export async function scrapeInsert(scrape: Scrape) {
  try {
    const data = JSON.stringify(ensureJSONSyntax(scrape.data)).replace(/'/g, `''`)
    const result = await scrape_db.query(`
      INSERT INTO scrape (
        time,
        source,
        id_from_source,
        data,
        restaurant_id,
        location
      ) VALUES (
        NOW(),
        '${scrape.source}',
        '${scrape.id_from_source}',
        '${data}'::jsonb,
        '${scrape.restaurant_id}',
        ST_GeomFromText('POINT(
          ${scrape.location.lon} ${scrape.location.lat}
        )', 4326)
      )
      RETURNING id;
    `)
    const res = result.rows[0].id as string
    return res
  } catch (err) {
    console.error(`Error inserting scrape`, err)
  }
}

export async function scrapeUpdateBasic(scrape: Scrape) {
  console.log(`Updating scrape ${scrape.id} to point to restaurant ${scrape.restaurant_id}`)
  const result = await scrape_db.query(`
    UPDATE scrape SET
      restaurant_id = '${scrape.restaurant_id}',
      location = ST_GeomFromText('POINT(
        ${scrape.location.lon} ${scrape.location.lat}
      )', 4326)
    WHERE id = '${scrape.id}';
  `)
  return result.rows[0]
}

export async function scrapeUpdateAllRestaurantIDs(
  source: string,
  id_from_source: string,
  restaurant_id: string | null
) {
  restaurant_id = restaurant_id == null ? `NULL` : `'${restaurant_id}'`
  await scrape_db.query(`
    UPDATE scrape SET
      restaurant_id = ${restaurant_id}
    WHERE source = '${source}'
      AND id_from_source = '${id_from_source}'
  `)
}

// NB this does not deep merge, eg;
// ```
// select '{"a": {"s1": 1}}'::jsonb || '{"a": {"s2": 2}}'::jsonb
// -- {"a": {"s2": 2}}
// ```
// It only merges the top-level keys:
// // ```
// select '{"a": {"s1": 1}}'::jsonb || '{"b": {"s2": 2}}'::jsonb
// -- {"a": {"s1": 1}, "b": {"s2": 2}}
// ```
export async function scrapeMergeData(id: string, data: ScrapeData) {
  data = ensureJSONSyntax(data)
  const stringified = JSON.stringify(data).replace(/'/g, `''`)
  const result = await scrape_db.query(`
    UPDATE scrape
      SET data = data || '${stringified}'
      WHERE id = '${id}'
    RETURNING *;
  `)
  return result.rows[0]
}

export async function deleteAllScrapesBySourceID(id: string) {
  await scrape_db.query(`
    DELETE FROM scrape WHERE id_from_source = '${id}';
  `)
}

export async function deleteAllTestScrapes() {
  await scrape_db.query(`
    DELETE FROM scrape WHERE id_from_source LIKE 'test%';
  `)
}

export async function scrapeGetAllDistinct() {
  const result = await scrape_db.query(`SELECT scrape_id FROM distinct_sources`)
  return result.rows
}

export async function scrapeUpdateGeocoderID(scrape_id: string) {
  const result = await scrape_db.query(
    `
      SELECT *, st_asgeojson(location) as location
      FROM scrape WHERE id = '${scrape_id}'
    `
  )
  let scrape = result.rows[0]
  scrape.location = JSON.parse(scrape.location)
  let deets: any
  switch (scrape.source) {
    case 'doordash':
      deets = DoorDash.getNameAndAddress(scrape)
      break
    case 'google':
      //deets = Google.getNameAndAddress(scrape)
      break
    case 'grubhub':
      deets = GrubHub.getNameAndAddress(scrape)
      break
    case 'infatuation':
      deets = Infatuated.getNameAndAddress(scrape)
      break
    case 'michelin':
      deets = Michelin.getNameAndAddress(scrape)
      break
    case 'tripadvisor':
      deets = Tripadvisor.getNameAndAddress(scrape)
      break
    case 'ubereats':
      deets = UberEats.getNameAndAddress(scrape)
      break
    case 'yelp':
      deets = Yelp.getNameAndAddress(scrape)
      break
    default:
      break
  }
  const geocoder = new GoogleGeocoder()
  const lon = scrape.location.coordinates[0]
  const lat = scrape.location.coordinates[1]
  const query = deets.name + ',' + deets.address
  const google_id = await geocoder.searchForID(query, lat, lon)
  if (google_id) {
    const restaurant = await restaurantFindOne({ geocoder_id: google_id })
    if (restaurant) {
      console.log('SCRAPE GEOCODES', deets.name, scrape.restaurant_id, restaurant.id)
      scrape.restaurant_id = restaurant.id
      await scrapeUpdateAllRestaurantIDs(scrape.source, scrape.id_from_source, restaurant.id)
    }
  } else {
    console.log('SCRAPE GEOCODES', deets.name, scrape.restaurant_id, null)
    await scrapeUpdateAllRestaurantIDs(scrape.source, scrape.id_from_source, null)
  }
}
