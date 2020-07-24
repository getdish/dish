import { LngLat } from '../../state/home'

export function centerMapToRegion(p: {
  map: mapkit.Map
  center: LngLat
  span: LngLat
  animated?: boolean
}) {
  const newCenter = new mapkit.Coordinate(p.center.lat, p.center.lng)
  const coordspan = new mapkit.CoordinateSpan(p.span.lat, p.span.lng)
  const region = new mapkit.CoordinateRegion(newCenter, coordspan)
  try {
    p.map?.setRegionAnimated(region, p.animated ?? true)
  } catch (err) {
    console.warn('map hmr err', err.message)
  }
}
