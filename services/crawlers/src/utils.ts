import '@dish/common'

import axios from 'axios'

const HEREMAPS_API_TOKEN = process.env.HEREMAPS_API_TOKEN

export function shiftLatLonByMetres(
  lat: number,
  lon: number,
  diff_north: number,
  diff_east: number
): [number, number] {
  const RADIUS = 6378137
  const diff_lat = diff_north / RADIUS
  const diff_lon = diff_east / (RADIUS * Math.cos((Math.PI * lat) / 180))

  const latO = lat + (diff_lat * 180) / Math.PI
  const lonO = lon + (diff_lon * 180) / Math.PI
  return [latO, lonO]
}

// Returns an array of coords that fill an area. Think of it as a way
// to fill a space with a number of equally spaced boxes. The number of
// boxes is size*size
export function aroundCoords(
  lat: number,
  lon: number,
  radius: number,
  size: number
) {
  let coords: [number, number][] = []
  const edge = radius * (size / 2)
  for (let y = edge; y >= -edge; y = y - radius) {
    for (let x = -edge; x <= edge; x = x + radius) {
      coords.push(shiftLatLonByMetres(lat, lon, y, x))
    }
  }
  return coords
}

export function boundingBoxFromcenter(
  lat: number,
  lon: number,
  radius: number
): [[number, number], [number, number]] {
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
