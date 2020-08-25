import {
  RestaurantWithId,
  ensureJSONSyntax,
  restaurantFindOne,
} from '@dish/graph'

import { DoorDash } from './doordash/DoorDash'
import { Google } from './google/Google'
import { GoogleGecoder } from './GoogleGeocoder'
import { GrubHub } from './grubhub/GrubHub'
import { Infatuated } from './infatuated/Infatuated'
import { Michelin } from './michelin/Michelin'
import { Tripadvisor } from './tripadvisor/Tripadvisor'
import { UberEats } from './ubereats/UberEats'
import { DB } from './utils'
import { Yelp } from './yelp/Yelp'

let db_config = {
  host: process.env.TIMESCALE_HOST || 'localhost',
  port: process.env.TIMESCALE_PORT || '5433',
  user: process.env.TIMESCALE_USER || 'postgres',
  password: process.env.TIMESCALE_PASSWORD || 'postgres',
  database: 'scrape_data',
  ssl: false,
}
if (process.env.DISH_ENV == 'production' || process.env.USE_PG_SSL == 'true') {
  db_config.ssl = true
}
const db = new DB(db_config)

type LatLon = {
  lon: number
  lat: number
}

export type Scrape = {
  id?: string
  time?: Date
  restaurant_id: string
  location: LatLon
  source: string
  id_from_source: string
  data: ScrapeData
}

export type ScrapeData = { [key: string]: any }

export async function scrapeFindOneBySourceID(source: string, id: string) {
  const result = await db.query(`
    SELECT *, st_asgeojson(location) as location
    FROM scrape
      WHERE source = '${source}'
      AND id_from_source = '${id}'
    ORDER BY time DESC
    LIMIT 1;
  `)
  if (result.rows.length == 0) throw 'Scrape not found: ' + id
  result.rows[0].location = parseLocation(result.rows[0].location)
  return result.rows[0] as Scrape
}

export async function scrapeFindOneByUUID(id: string) {
  const result = await db.query(`
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

export async function latestScrapeForRestaurant(
  restaurant: RestaurantWithId,
  source: string
) {
  const result = await db.query(`
    SELECT *, st_asgeojson(location) as location
    FROM scrape
      WHERE restaurant_id = '${restaurant.id}'
      AND source = '${source}'
    ORDER BY time DESC
    LIMIT 1;
  `)
  if (result.rows.length == 0) {
    if (process.env.NODE_ENV != 'test') {
      console.debug(`No ${source} scrapes found for: ` + restaurant.name)
    }
    return null
  } else {
    if (process.env.NODE_ENV != 'test') {
      console.debug(`${source} scrape found for: ` + restaurant.name)
    }
    result.rows[0].location = parseLocation(result.rows[0].location)
    return result.rows[0] as Scrape
  }
}

export async function scrapeInsert(scrape: Scrape) {
  let data = ensureJSONSyntax(scrape.data)
  data = JSON.stringify(data).replace(/'/g, `''`)
  const result = await db.query(`
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
  return result.rows[0].id as string
}

export async function scrapeUpdateBasic(scrape: Scrape) {
  const result = await db.query(`
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
  await db.query(`
    UPDATE scrape SET
      restaurant_id = ${restaurant_id}
    WHERE source = '${source}'
      AND id_from_source = '${id_from_source}'
  `)
}

export async function scrapeMergeData(id: string, data: ScrapeData) {
  data = ensureJSONSyntax(data)
  const stringified = JSON.stringify(data).replace(/'/g, `''`)
  const result = await db.query(`
    UPDATE scrape
      SET data = data || '${stringified}'
      WHERE id = '${id}'
    RETURNING *;
  `)
  return result.rows[0]
}

export function scrapeGetData(
  scrape: Scrape,
  path: string,
  default_value: any = ''
): any {
  if (!scrape) return default_value
  let obj = scrape.data
  if (!obj) {
    return
  }
  const keys = path.split('.')
  const length = keys.length
  let index = -1
  if (typeof obj === 'undefined') {
    return default_value
  }
  for (let i = 0; i < length; i++) {
    let key = keys[i]
    const matches = key.match(/\[(.*)\]/)
    if (matches) {
      key = key.split('[')[0]
      index = parseFloat(matches[0][1])
    } else {
      index = -1
    }
    if (key in obj) {
      obj = obj[key]
      if (obj === null) {
        return default_value
      }
      if (index >= 0) {
        obj = obj[index]
      }
      if (typeof obj === 'undefined') {
        return default_value
      }
    } else {
      return default_value
    }
  }
  return obj
}

export async function deleteAllScrapesBySourceID(id: string) {
  await db.query(`
    DELETE FROM scrape WHERE id_from_source = '${id}';
  `)
}

export async function scrapeGetAllDistinct() {
  const result = await db.query(`SELECT scrape_id FROM distinct_sources`)
  return result.rows
}

export async function scrapeUpdateGeocoderID(scrape_id: string) {
  const result = await db.query(
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
  const geocoder = new GoogleGecoder()
  const lon = scrape.location.coordinates[0]
  const lat = scrape.location.coordinates[1]
  const query = deets.name + ',' + deets.address
  const google_id = await geocoder.searchForID(query, lat, lon)
  if (google_id) {
    const restaurant = await restaurantFindOne({ geocoder_id: google_id })
    if (restaurant) {
      console.log(
        'SCRAPE GEOCODES',
        deets.name,
        scrape.restaurant_id,
        restaurant.id
      )
      scrape.restaurant_id = restaurant.id
      await scrapeUpdateAllRestaurantIDs(
        scrape.source,
        scrape.id_from_source,
        restaurant.id
      )
    }
  } else {
    console.log('SCRAPE GEOCODES', deets.name, scrape.restaurant_id, null)
    await scrapeUpdateAllRestaurantIDs(
      scrape.source,
      scrape.id_from_source,
      null
    )
  }
}
