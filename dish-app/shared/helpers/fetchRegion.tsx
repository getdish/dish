import { LngLat, SEARCH_DOMAIN } from '@dish/graph'
import { UseQueryOptions } from 'react-query'

import { bboxToSpan } from './bboxToSpan'
import { queryClient } from './queryClient'
import { useQueryLoud } from './useQueryLoud'

export type Point = [number, number]

export type RegionApiResponse = {
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

export type RegionNormalized = RegionApiResponse & {
  center: LngLat
  span: LngLat
}

export const fetchRegion = async (slug: string) => {
  try {
    const url = `${SEARCH_DOMAIN}/regions?slug=${encodeURIComponent(slug)}`
    const res: RegionApiResponse = await fetch(url).then((x) => x.json())
    console.log('fetchRegion', res)
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
      const response: RegionNormalized = {
        ...res,
        center,
        span,
      }
      queryClient.setQueryData(key, response)
      return response
    }

    return null
  } catch (err) {
    console.error(err)
    return null
  }
}

export const useRegionQuery = (slug: string, config?: UseQueryOptions<any>) => {
  return useQueryLoud<RegionNormalized>(
    `REGIONQUERY-${slug}`,
    () => fetchRegion(slug),
    config
  )
}
