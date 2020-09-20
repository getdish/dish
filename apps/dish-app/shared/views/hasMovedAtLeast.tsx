import { LngLat } from '@dish/graph'

const abs = (x: number) => Math.abs(x)

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
