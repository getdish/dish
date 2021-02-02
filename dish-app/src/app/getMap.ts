// last resort use this, shares map between native and web
// so only functions that work on both will work on map

import type MapboxNativeGL from '@react-native-mapbox-gl/maps'

// make sure its on both:
//  1. https://github.com/react-native-mapbox-gl/maps/blob/master/docs/MapView.md
//  2. https://docs.mapbox.com/mapbox-gl-js/api/map/

// only export functions that are on both

let map: mapboxgl.Map | MapboxNativeGL.MapView | null = null

export function setMap(x: any) {
  map = x
}

export function getMapZoom() {
  return Promise.resolve(map?.getZoom())
}
