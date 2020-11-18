import mapboxgl from 'mapbox-gl'
import polylabel from 'polylabel'

import { getCoordinates } from './getCoordinates'

export function getCenter(
  geometry: mapboxgl.MapboxGeoJSONFeature['geometry']
): [number, number] | null {
  const coordinates = getCoordinates(geometry)
  return coordinates ? polylabel(coordinates, 1.0) : null
}
