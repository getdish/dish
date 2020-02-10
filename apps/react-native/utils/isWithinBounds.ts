import { LngLat } from 'mapbox-gl'

export function isWithinBounds(point: LngLat, bounds: any) {

 if (point[0] > bounds._sw.lng &&
     point[0] < bounds._ne.lng &&
     point[1] > bounds._sw.lat &&
     point[1] < bounds._ne.lat)

    return true

   return false

}