import { LngLat, MapPosition } from '@dish/graph'
import { reduce } from '@dish/helpers'
import bbox from '@turf/bbox'
import getCenter from '@turf/center'
import { BBox, MultiPolygon, Polygon } from '@turf/helpers'

const { abs } = Math

export function snapCoordsToTileCentre(lon: number, lat: number, zoom: number) {
  const n = Math.pow(2, zoom)
  const in_lat_rad = lat * (Math.PI / 180)
  const x_coord = n * ((lon + 180) / 360)
  const magic = 1 - Math.log(Math.tan(in_lat_rad) + 1 / Math.cos(in_lat_rad)) / Math.PI
  const y_coord = 0.5 * n * magic
  const xtile = Math.floor(x_coord)
  const ytile = Math.floor(y_coord)
  const out_lat_rad = Math.atan(Math.sinh(Math.PI * (1 - (2 * ytile) / n)))

  lon = (xtile / n) * 360.0 - 180.0
  lat = (out_lat_rad * 180.0) / Math.PI
  return [lon, lat]
}

// TODO getZoomLevel, distanceForZoom, spanToScope all similar...

// this is incorrect technically, doesnt correspond to map.getZoom()
export const getZoomFromSpan = (span: LngLat) => {
  const zoom = (Math.abs(span.lat) + Math.abs(span.lng)) / 2
  return zoom
}

export type MapZoomLevel = 'close' | 'medium' | 'far'

export const getZoomLevel = (span: LngLat): MapZoomLevel => {
  const curZoom = getZoomFromSpan(span)
  return curZoom < 0.05 ? 'close' : curZoom > 0.3 ? 'far' : 'medium'
}

// See https://wiki.openstreetmap.org/wiki/Zoom_levels
const distances: { [key: string]: number } = {
  10: 0.352, // metro
  11: 0.176, // city
  12: 0.088, // town/city/district
  13: 0.044, // suburb
}

export function getDistanceForZoom(zoom: number) {
  const x = Math.ceil(zoom)
  for (const d in distances) {
    if (x <= +d) {
      return distances[d]
    }
  }
  const keys = Object.keys(distances)
  return distances[keys[keys.length - 1]]
}

export function spanToScope(
  span: LngLat
): 'street' | 'neighborhood' | 'city' | 'state' | 'country' {
  const est = getZoomFromSpan(span)
  if (est < 0.025) {
    return 'street'
  }
  if (est < 0.05) {
    return 'neighborhood'
  }
  if (est < 1.5) {
    return 'city'
  }
  if (est < 4) {
    return 'state'
  }
  return 'country'
}

export const polygonToLngLat = (poly: MultiPolygon | Polygon) => {
  return bboxToLngLat(bbox(poly))
}

export const polygonToMapPosition = (geo: MultiPolygon | Polygon): MapPosition => {
  const full = bboxToLngLat(bbox(geo))
  const centerCoord = getCenter(geo)
  return {
    center: {
      lng: centerCoord.geometry.coordinates[0],
      lat: centerCoord.geometry.coordinates[1],
    },
    span: {
      lng: full.lng / 2,
      lat: full.lat / 2,
    },
  }
}

export const mapPositionToBBox = ({
  center,
  span,
}: MapPosition): [number, number, number, number] => {
  return [
    center.lng - span.lng,
    center.lat - span.lat,
    center.lng + span.lng,
    center.lat + span.lat,
  ]
}

export const coordsToLngLat = (coords: number[]) => {
  return {
    lng: coords[0],
    lat: coords[1],
  }
}

export function bboxToLngLat(bbox: BBox | readonly [number, number, number, number]) {
  return {
    lat: dist(bbox[0], bbox[2]) / 2,
    lng: dist(bbox[1], bbox[3]) / 2,
  }
}

// either some % or smal abs, whichever is smaller
export const padLngLat = (ll: LngLat, padPct = 2, padAbs = 0.0333) => {
  return reduce(ll, (_, v) => Math.min(v * padPct, v + padAbs))
}

export const getMinLngLat = (ll: LngLat, max: LngLat) => {
  return reduce(ll, (k, v) => Math.min(max[k], v))
}

export const getMaxLngLat = (ll: LngLat, max: LngLat) => {
  return reduce(ll, (k, v) => Math.max(max[k], v))
}

// used to help prevent duplicate searches on slight diff in map move
export const roundLngLat = (ll: LngLat): LngLat => {
  return reduce(ll, (_, v) => roundCoord(v))
}

export const roundCoord = (coordinate: number, to = 100000) => Math.round(coordinate * to) / to

export const hasMovedAtLeast = (
  current: { center: LngLat; span: LngLat },
  next: { center: LngLat; span: LngLat },
  distance: number = 0.005
) => {
  const d1 = abs(next.center.lng - current.center.lng)
  const d2 = abs(next.center.lat - current.center.lat)
  const d3 = abs(next.span.lat - current.span.lat)
  const d4 = abs(next.span.lng - current.span.lng)
  const diff = d1 + d2 + d3 + d4
  return diff > distance
}

export const dist = (a: number, b: number) => {
  return a > b ? a - b : b - a
}
