import { LngLat } from '@dish/graph'
import { reduce } from '@dish/helpers'
import { BBox } from '@turf/helpers'

import { Point } from '../types/homeTypes'

const { abs } = Math

export const getZoomLevel = (span: LngLat) => {
  const curZoom = (Math.abs(span.lat) + Math.abs(span.lng)) / 2
  return curZoom < 0.05 ? 'close' : curZoom > 0.3 ? 'far' : 'medium'
}

export const polygonToLngLat = ({
  coordinates,
}: {
  type: 'Polygon'
  coordinates: [[Point, Point, Point, Point, Point]]
}) => {
  const simpleBbox = [
    coordinates[0][0][0],
    coordinates[0][0][1],
    coordinates[0][2][0],
    coordinates[0][2][1],
  ] as const
  return bboxToLngLat(simpleBbox)
}

export const coordsToLngLat = (coords: number[]) => {
  return {
    lng: coords[0],
    lat: coords[1],
  }
}

export function bboxToLngLat(
  bbox: BBox | readonly [number, number, number, number]
) {
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

// used to help prevent duplicate searches on slight diff in map move
export const roundLngLat = (ll: LngLat): LngLat => {
  return reduce(ll, (_, v) => Math.round(v * 100000) / 100000)
}

export const hasMovedAtLeast = (
  current: { center: LngLat; span: LngLat },
  next: { center: LngLat; span: LngLat },
  distance: number = 0.01
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
