import '@dish/common'

import axios from 'axios'
import _ from 'lodash'
import { Pool, Result } from 'pg'

const HEREMAPS_API_TOKEN = process.env.HEREMAPS_API_TOKEN

type Coord = [number, number]

export const sanfran = {
  location: {
    _st_d_within: {
      distance: 0.5,
      from: {
        coordinates: [-122.421351, 37.759251],
        type: 'Point',
      },
    },
  },
}

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
      console.error(query)
      throw e
    } finally {
      client.release()
    }
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

export async function geocode(address: string) {
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
