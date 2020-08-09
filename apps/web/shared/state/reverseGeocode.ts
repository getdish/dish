import { MAPBOX_ACCESS_TOKEN } from '../constants'
import { GeocodePlace, LngLat } from './home-types'

export async function reverseGeocode(center: LngLat): Promise<GeocodePlace[]> {
  console.warn('TODO verify reverseGeocode')
  return await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      `${center.lat},${center.lng}`
    )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
  ).then((res) => res.json())
}
