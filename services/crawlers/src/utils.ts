import '@dish/common'

import { sleep } from '@dish/async'
import { sentryException } from '@dish/common'
import { Restaurant, settingGet, settingSet } from '@dish/graph'
import axios from 'axios'
import _ from 'lodash'
import moment, { Moment } from 'moment'
import { Pool, PoolClient, QueryResult } from 'pg'

import { isGoogleGeocoderID } from './GoogleGeocoder'

const HEREMAPS_API_TOKEN = process.env.HEREMAPS_API_TOKEN

type Coord = [number, number]

export const CITY_LIST = [
  'San Francisco, CA',
  'Los Angeles, CA',
  'San Jose, CA',
  'Redwood City, CA',
  'Fremont, CA',
  'San Rafael, CA',
  'Chicago, Illinois',
  'Tuscon, Arizona',
  'Istanbul, Turkey',
]

export class DB {
  pool: Pool | null = null

  constructor(public config: Object) {
    if (process.env.DEBUG) {
      console.log('setup db', config)
    }
    this.connect()
  }

  static main_db() {
    return new DB({
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || '5432',
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: 'dish',
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 0,
    })
  }

  static async one_query_on_main(query: string) {
    const db = DB.main_db()
    const result = await db.query(query)
    await db.pool?.end()
    return result
  }

  connect() {
    this.pool = new Pool(this.config)
    this.pool.setMaxListeners(800)
    let total = 0
    this.pool.on('connect', () => {
      total++
      console.log('total', total)
    })
    this.pool.on('remove', () => {
      total--
    })
    this.pool.on('error', (e) => {
      sentryException(e, {
        more: 'Error likely from long-lived pool connection in node-pg',
      })
      this.pool = null
    })
  }

  async query(query: string) {
    if (process.env.DEBUG) {
      console.log('DB.query', this.config['port'], query)
    }
    let result: QueryResult
    if (!this.pool) {
      this.connect()
    }
    const pool = this.pool!
    console.log('max', pool.getMaxListeners())
    const client = await pool.connect()
    if (!client) {
      throw new Error('no client')
    }
    try {
      const timeout = sleep(15000)
      const res = await Promise.race([
        client.query(query),
        timeout.then(() => {
          console.error(`Timed out on query`, query)
          return 'timed_out'
        }),
      ] as const)
      if (res === 'timed_out') {
        throw new Error(`Timed out`)
      }
      timeout.cancel()
      result = res as any
    } catch (e) {
      console.error('Errored query: ' + query)
      console.error(e.message)
      if (query.includes('BEGIN;') || query.includes('TRANSACTION;')) {
        await client.query('ROLLBACK')
      }
      throw e
    } finally {
      client.release()
    }
    if (process.env.DEBUG) {
      console.log(' DB.query response', result.rowCount, result.rows)
    }
    return result
  }
}

export function shiftLatLonByMetres(
  lat: number,
  lon: number,
  diff_north: number,
  diff_east: number
): [number, number] {
  const RADIUS = 6378137
  const diff_lat = diff_north / RADIUS
  const diff_lon = diff_east / (RADIUS * Math.cos((Math.PI * lat) / 180))

  const latO = lat + diff_lat * (180 / Math.PI)
  const lonO = lon + diff_lon * (180 / Math.PI)
  return [latO, lonO]
}

// Returns an array of coords that fill an area. Think of it as a way
// to fill a space with a number of equally spaced boxes. The number of
// boxes is (chunk_factor + 1)^2
export function aroundCoords(
  lat: number,
  lon: number,
  chunk_size: number,
  chunk_factor: number
) {
  let coords: Coord[] = []
  const edge = chunk_size * chunk_factor
  for (let y = edge; y >= -edge; y = y - chunk_size) {
    for (let x = -edge; x <= edge; x = x + chunk_size) {
      coords.push(shiftLatLonByMetres(lat, lon, y, x))
    }
  }
  return coords
}

export function boundingBoxFromcenter(
  lat: number,
  lon: number,
  radius: number
): [Coord, Coord] {
  const top_right = shiftLatLonByMetres(lat, lon, radius, radius)
  const bottom_left = shiftLatLonByMetres(lat, lon, -radius, -radius)
  return [top_right, bottom_left]
}

export async function geocode(address: string): Promise<Coord> {
  let coordinates: Coord
  const key = 'GEOCODER_CACHE'
  const cache = await settingGet(key)
  const address_as_key = address.toLowerCase().replace(/[\W_]+/g, '_')
  if (cache[address_as_key]) {
    coordinates = cache[address_as_key]
  } else {
    coordinates = await _geocode_without_cache(address)
    cache[address_as_key] = coordinates
    console.log('Updating geocoder cache for: ' + address)
    await settingSet(key, cache)
  }
  return coordinates
}

async function _geocode_without_cache(address: string): Promise<Coord> {
  const base = 'https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey='
  const query = '&searchtext=' + encodeURI(address)
  const url = base + HEREMAPS_API_TOKEN + query
  const response = await axios.get(url)
  const result = response.data.Response.View[0].Result[0]
  const coords = result.Location.DisplayPosition
  return [coords.Latitude, coords.Longitude]
}

function geoJSONPolygon(corners: Coord[]) {
  return {
    type: 'Feature',
    properties: { prop0: 'value0' },
    geometry: {
      type: 'Polygon',
      coordinates: [corners],
    },
  }
}

export function aroundCoordsGeoJSON(
  lat: number,
  lon: number,
  radius: number,
  size: number
) {
  const coords = aroundCoords(lat, lon, radius, size)
  let boxes: any[] = []
  const offset = radius / 2
  for (const centre of coords) {
    const yc = centre[0]
    const xc = centre[1]
    const corners: Coord[] = []
    const joined = _.reverse(shiftLatLonByMetres(yc, xc, -offset, -offset))
    corners.push(joined)
    corners.push(_.reverse(shiftLatLonByMetres(yc, xc, -offset, offset)))
    corners.push(_.reverse(shiftLatLonByMetres(yc, xc, offset, offset)))
    corners.push(_.reverse(shiftLatLonByMetres(yc, xc, offset, -offset)))
    corners.push(joined)
    boxes.push(geoJSONPolygon(corners))
  }
  return JSON.stringify({
    type: 'FeatureCollection',
    features: boxes,
  })
}

export function toDBDate(in_date: Date | string, format: string = '') {
  let m: Moment
  if (format == '') {
    m = moment(in_date)
  } else {
    m = moment(in_date, format)
  }
  const out_date = m.format('YYYY-MM-DD') + 'T00:00:00.0+00:00'
  return out_date
}

export function googlePermalink(id: string, lat: number, lon: number) {
  return (
    `https://www.google.com/maps/place/` +
    `@${lat},${lon},11z/data=!3m1!4b1!4m5!3m4!1s${id}!8m2!3d${lat}!4d${lon}`
  )
}

export async function restaurantFindIDBatchForCity(
  size: number,
  previous_id: string,
  city: string,
  radius = 0.5
): Promise<Restaurant[]> {
  const coords = await geocode(city)
  const query = `
    SELECT id FROM restaurant
      WHERE ST_DWithin(
        location,
        ST_Makepoint(${coords[1]}, ${coords[0]}),
        ${radius}
      )
      AND id > '${previous_id}'
    ORDER BY id
    LIMIT ${size}
  `
  const result = await DB.one_query_on_main(query)
  return result.rows
}

export async function restaurantCountForCity(city: string, radius = 0.5) {
  const coords = await geocode(city)
  const query = `
    SELECT count(*) FROM restaurant
      WHERE ST_DWithin(
        location,
        ST_Makepoint(${coords[1]}, ${coords[0]}),
        ${radius}
      )
  `
  const result = await DB.one_query_on_main(query)
  return result.rows[0].count
}

export async function restaurantFindBasicBatchForAll(
  size: number,
  previous_id: string,
  extra_where = ''
): Promise<Restaurant[]> {
  const query = `
    SELECT id, name, address, st_asgeojson(location) as location FROM restaurant
      WHERE id > '${previous_id}'
      ${extra_where}
    ORDER BY id
    LIMIT ${size}
  `
  const result = await DB.one_query_on_main(query)
  return result.rows
}

export async function batchIDsForAll(
  table: string,
  size: number,
  previous_id: string,
  extra_where = ''
) {
  const query = `
    SELECT id FROM ${table}
      WHERE id > '${previous_id}'
      ${extra_where}
    ORDER BY id
    LIMIT ${size}
  `
  const result = await DB.one_query_on_main(query)
  return result.rows.map((r) => r.id)
}

export async function photoBatchForAll(
  size: number,
  previous_id: string,
  extra_where = ''
) {
  const query = `
    SELECT id, url FROM photo
      WHERE id > '${previous_id}'
      ${extra_where}
    ORDER BY id
    LIMIT ${size}
  `
  const result = await DB.one_query_on_main(query)
  return result.rows
}

export async function getTableCount(
  table: string,
  where = ''
): Promise<number> {
  const query = `SELECT count(id) FROM ${table} ${where}`
  const result = await DB.one_query_on_main(query)
  return parseInt(result.rows[0].count)
}

export function isUUID(uuid: string) {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuid.match(regex)
}

// One-off behaviour when moving to using Google's geocoder IDs.
// `geocoder_id` is unique, so just prefer the existing one and delete
// the newly geocoded one.
//
// ALERT! Depends on a previous query where restaurants are queried
// for having a geocoder_id of NULL
export async function restaurantDeleteOrUpdateByGeocoderID(
  restaurant_id: string,
  geocoder_id: string
) {
  if (!isUUID(restaurant_id) || !isGoogleGeocoderID(geocoder_id)) {
    throw new Error('GOOGLE GEOCODER BATCH: Bad identifier')
  }
  const query = `
  DO
  $do$
  BEGIN
    IF EXISTS (
      SELECT FROM restaurant
        WHERE geocoder_id = '${geocoder_id}'
        AND id != '${restaurant_id}'
    ) THEN
      DELETE FROM restaurant WHERE id = '${restaurant_id}';
    ELSE
      UPDATE restaurant SET geocoder_id = '${geocoder_id}'
        WHERE id = '${restaurant_id}';
    END IF;
  END
  $do$
  `
  await DB.one_query_on_main(query)
}

export async function restaurantFindOneWithTagsSQL(restaurant_id: string) {
  const query = `
    SELECT json_agg(s) FROM (
      SELECT
        *,
        st_asgeojson(location) AS location,
        (
          SELECT array_agg(rtags_subquery) FROM (
            SELECT
              *,
              (
                SELECT (json_agg(ts))->0 FROM (
                  SELECT * FROM tag
                  WHERE tag.id = restaurant_tag.tag_id
                ) ts
              ) as tag
            FROM restaurant_tag
            WHERE restaurant_tag.restaurant_id = restaurant.id
          ) rtags_subquery
        ) AS tags
      FROM restaurant
      WHERE restaurant.id = '${restaurant_id}'
    ) s
  `
  const response = await DB.one_query_on_main(query)
  const restaurant = response.rows[0].json_agg[0]
  if (!restaurant.tags) restaurant.tags = []
  restaurant.location = JSON.parse(restaurant.location)
  return restaurant
}

export function roughSizeOfObject(object) {
  var objectList: any[] = []
  var stack = [object]
  var bytes = 0

  while (stack.length) {
    var value = stack.pop()

    if (typeof value === 'boolean') {
      bytes += 4
    } else if (typeof value === 'string') {
      bytes += value.length * 2
    } else if (typeof value === 'number') {
      bytes += 8
    } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
      objectList.push(value)

      for (var i in value) {
        stack.push(value[i])
      }
    }
  }
  return bytes
}

export function decodeEntities(encodedString) {
  var translate_re = /&(nbsp|amp|quot|lt|gt);/g
  var translate = {
    nbsp: ' ',
    amp: '&',
    quot: '"',
    lt: '<',
    gt: '>',
  }
  return encodedString
    .replace(translate_re, function (match, entity) {
      return translate[entity]
    })
    .replace(/&#(\d+);/gi, function (match, numStr) {
      var num = parseInt(numStr, 10)
      return String.fromCharCode(num)
    })
}
