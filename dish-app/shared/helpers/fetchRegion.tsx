import { LngLat, SEARCH_DOMAIN } from '@dish/graph'
import { QueryConfig, queryCache, useQuery } from 'react-query'

import { bboxToSpan } from './bboxToSpan'

export type Point = [number, number]

type RegionApiResponse = {
  bbox: {
    type: 'Polygon'
    coordinates: [[Point, Point, Point, Point, Point]]
  }
  centroid: {
    type: 'Point'
    coordinates: Point
  }
  name: string
}

const key = 'useRegionQuery'

export const fetchRegion = async (slug: string) => {
  try {
    const res: RegionApiResponse = await fetch(
      `${SEARCH_DOMAIN}/regions?slug=${encodeURIComponent(slug)}`
    ).then((x) => x.json())

    const centerAt = res?.centroid?.coordinates
    if (!!centerAt) {
      const center: LngLat = {
        lng: centerAt[0],
        lat: centerAt[1],
      }
      const coords = res.bbox.coordinates[0]
      const simpleBbox = [
        coords[0][0],
        coords[0][1],
        coords[2][0],
        coords[2][1],
      ] as const
      const span: LngLat = bboxToSpan(simpleBbox)
      const response = {
        ...res,
        center,
        span,
      }
      queryCache.setQueryData(key, response)
      return response
    }

    return null
  } catch (err) {
    console.error(err)
    return null
  }
}

export const useRegionQuery = (slug: string, config?: QueryConfig<any>) => {
  return useQuery(key, () => fetchRegion(slug), config)
}
