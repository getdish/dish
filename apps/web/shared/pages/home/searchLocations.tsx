import { LngLat } from '@dish/graph'

import { MAPBOX_ACCESS_TOKEN } from '../../constants'
import { createAutocomplete } from '../../state/createAutocomplete'
import { AutocompleteItem, GeocodePlace } from '../../state/home-types'

const baseUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places`

export async function searchLocations(
  query: string,
  near?: LngLat
): Promise<GeocodePlace[]> {
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
  console.log('res', res)
  return res.features
    .map((feat) => {
      if (feat.bbox) {
        const [minLng, minLat, maxLng, maxLat] = feat.bbox
        return {
          name: feat.text,
          fullName: feat.place_name,
          type: feat.place_type[0],
          bbox: feat.bbox,
          center: {
            lng: feat.center[0],
            lat: feat.center[1],
          },
          span: {
            lng: feat.center[0] - (maxLng - minLng) / 2,
            lat: feat.center[1] - (maxLat - minLat) / 2,
          },
          state: feat.context?.find((x) => x.wikidata === 'Q99'),
          country: feat.context?.find((x) => x.wikidata === 'Q30'),
        }
      }
    })
    .filter(Boolean)
}

export const locationToAutocomplete = (
  place: GeocodePlace
): AutocompleteItem => {
  return createAutocomplete({
    name: place.name,
    description: place.fullName,
    type: 'country',
    icon: '📍',
    center: place.center,
    span: place.span,
  })
}
