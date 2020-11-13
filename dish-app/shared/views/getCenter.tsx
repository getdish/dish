import polylabel from 'polylabel'

import { getCoordinates } from './getCoordinates'

export function getCenter(geometry: {
  type: string
  coordinates: number[]
}): [number, number] | null {
  const coordinates = getCoordinates(geometry)
  return coordinates ? polylabel(coordinates) : null
}
