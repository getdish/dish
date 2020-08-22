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
  return res.features.map((feat) => {
    return {
      name: feat.text,
      fullName: feat.place_name,
      type: feat.place_type[0],
      bbox: feat.bbox,
      center: feat.center,
      state: feat.context.find((x) => x.wikidata === 'Q99'),
      country: feat.context.find((x) => x.wikidata === 'Q30'),
    }
  })
}

export const locationToAutocomplete = (
  place: GeocodePlace
): AutocompleteItem => {
  return createAutocomplete({
    name: place.neighborhood,
    type: 'country',
    icon: '📍',
    center: {
      lat: place.center[1],
      lng: place.center[0],
    },
  })
}
