import { LngLat } from '../../state/home-types'

export function centerMapToRegion(p: {
  map: mapboxgl.Map
  center: LngLat
  span: LngLat
  animated?: boolean
}) {
  console.warn('todo')
  // const newCenter = new mapkit.Coordinate(p.center.lat, p.center.lng)
  // const coordspan = new mapkit.CoordinateSpan(p.span.lat, p.span.lng)
  // const region = new mapkit.CoordinateRegion(newCenter, coordspan)
  // try {
  //   p.map?.setRegionAnimated(region, p.animated ?? true)
  // } catch (err) {
  //   console.warn('map hmr err', err.message)
  // }
}
