import { dist } from './dist'

export function bboxToSpan(bbox: readonly [number, number, number, number]) {
  return {
    lat: dist(bbox[0], bbox[2]) / 2,
    lng: dist(bbox[1], bbox[3]) / 2,
  }
}
