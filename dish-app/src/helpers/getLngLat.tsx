import { LngLat } from '@dish/graph'

export const getLngLat = (coords: number[]) => {
  return {
    lng: coords[0],
    lat: coords[1],
  }
}
export const getMinLngLat = (ll: LngLat, maxLng: number, maxLat: number) => {
  return getLngLat([Math.min(maxLng, ll.lng), Math.min(maxLat, ll.lat)])
}
