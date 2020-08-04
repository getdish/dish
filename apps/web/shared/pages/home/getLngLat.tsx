import { LngLat } from '@dish/graph'

export const getLngLat = (coords: number[]) => {
  return {
    lng: coords[0],
    lat: coords[1],
  }
}
export const getMinLngLat = (ll: LngLat, max: number) => {
  return getLngLat([Math.min(max, ll.lng), Math.min(max, ll.lat)])
}
