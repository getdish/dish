import '@dish/common'

import {
  Restaurant,
  restaurantFindBatch,
  settingGet,
  settingSet,
} from '@dish/graph/_'
import axios from 'axios'
import _ from 'lodash'
import moment, { Moment } from 'moment'
import { Pool, Result } from 'pg'

import { isGoogleGeocoderID } from './GoogleGeocoder'

const HEREMAPS_API_TOKEN = process.env.HEREMAPS_API_TOKEN

type Coord = [number, number]

export const CITY_LIST = [
  'San Francisco, CA',
  'Los Angeles, CA',
  'Chicago, Illinois',
  'Tuscon, Arizona',
  'Istanbul, Turkey',
]

export class DB {
  pool: Pool
  constructor(config: object) {
    this.pool = new Pool(config)
  }

  async query(query: string) {
    let result: Result
    const client = await this.pool.connect()
    try {
      result = await client.query(query)
    } catch (e) {
      console.error('Errored query: ' + query)
      console.error(e.message)
      if (query.includes('BEGIN;') || query.includes('TRANSACTION;')) {
        await client.query('ROLLBACK')
      }
      await client.release()
      throw e
    }
    await client.release()
    return result
  }
}

export const main_db = new DB({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || '5432',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: 'dish',
})

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
  const result = await main_db.query(query)
  return result.rows
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
  const result = await main_db.query(query)
  return result.rows
}

export async function getTableCount(
  table: string,
  where = ''
): Promise<number> {
  const query = `SELECT count(id) FROM ${table} ${where}`
  const result = await main_db.query(query)
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
  await main_db.query(query)
}
