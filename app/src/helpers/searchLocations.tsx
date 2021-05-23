import { LngLat } from '@dish/graph'
import { isPresent } from '@dish/helpers'

import { MAPBOX_ACCESS_TOKEN } from '../constants/constants'
import { GeocodePlace } from '../types/homeTypes'
import { AutocompleteItemFull, createAutocomplete } from './createAutocomplete'

const baseUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places`

export async function searchLocations(query: string, near?: LngLat): Promise<GeocodePlace[]> {
  if (!query) {
    return Promise.resolve([])
  }
  const initialParams = `access_token=${MAPBOX_ACCESS_TOKEN}&autocomplete=1`
  let url = `${baseUrl}/${encodeURIComponent(query)}.json?${initialParams}`
  if (near) {
    url += `&proximity=${encodeURIComponent(`${near.lng},${near.lat}`)}`
  }
  const res = await fetch(url).then((x) => x.json())
  if (!res?.features) {
    console.warn('nothing', query, res)
    return []
  }
  return res.features
    .map((feat) => {
      if (feat.bbox) {
        const [lng1, lat1, lng2, lat2] = feat.bbox
        const maxLng = Math.max(lng1, lng2)
        const minLng = Math.min(lng1, lng2)
        const maxLat = Math.max(lat1, lat2)
        const minLat = Math.min(lat1, lat2)
        const lngDist = (Math.abs(maxLng) - Math.abs(minLng)) / 2
        const latDist = (Math.abs(maxLat) - Math.abs(minLat)) / 2
        const span = {
          lng: lngDist,
          lat: latDist,
        }
        return {
          name: feat.text,
          fullName: feat.place_name,
          type: feat.place_type[0],
          bbox: feat.bbox,
          center: {
            lng: feat.center[0],
            lat: feat.center[1],
          },
          span,
          state: feat.context?.find((x) => x.wikidata === 'Q99'),
          country: feat.context?.find((x) => x.wikidata === 'Q30'),
        }
      }
      return undefined
    })
    .filter(isPresent)
}

export const locationToAutocomplete = (place: GeocodePlace): AutocompleteItemFull => {
  return createAutocomplete({
    name: place.name,
    description: place.fullName,
    type: 'place',
    icon: '📍',
    center: place.center,
    span: place.span,
  })
}
