import { appMapStore } from '../app/appMapStore'
import { MAPBOX_ACCESS_TOKEN } from '../constants/constants'
import { GeocodePlace, LngLat } from '../types/homeTypes'
import { spanToScope } from './mapHelpers'

export async function reverseGeocode(center: LngLat, span?: LngLat): Promise<GeocodePlace | null> {
  const centerArg = `${center.lng},${center.lat}`
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    centerArg
  )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
  const res = await fetch(url).then((res) => res.json())

  if (res.features?.length) {
    const { features } = res
    const scope = spanToScope(span ?? appMapStore.position.span)
    const placeNames = {
      street: features.find((x) => x.place_type?.includes('address'))?.text,
      neighborhood: features.find((x) => x.place_type?.includes('neighborhood'))?.text,
      city: features.find((x) => x.place_type?.includes('place'))?.text,
      state: features.find((x) => x.place_type?.includes('region'))?.text,
      country: features.find((x) => x.place_type?.includes('country'))?.text,
    }
    return {
      type: scope,
      name: placeNames[scope] ?? placeNames.neighborhood ?? placeNames.city,
      ...placeNames,
    }
  }

  return null
}
