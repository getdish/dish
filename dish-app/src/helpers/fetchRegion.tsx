import { SEARCH_DOMAIN } from '@dish/graph'
import { capitalize } from 'lodash'
import { UseQueryOptions } from 'react-query'

import { RegionApiResponse, RegionNormalized } from '../types/homeTypes'
import { coordsToLngLat, padLngLat, polygonToLngLat } from './mapHelpers'
import { queryClient } from './queryClient'
import { useQueryLoud } from './useQueryLoud'

const getKey = (slug: string) => `REGIONQUERY-${slug}`

const statePrefixRe = /[A-Z]{2}\- /

export const fetchRegion = async (slug: string) => {
  try {
    const url = `${SEARCH_DOMAIN}/regions?slug=${encodeURIComponent(slug)}`
    const res: RegionApiResponse = await fetch(url).then((x) => x.json())
    const centerAt = res?.centroid?.coordinates
    if (!!centerAt) {
      const response: RegionNormalized = {
        ...res,
        center: coordsToLngLat(centerAt),
        span: padLngLat(polygonToLngLat(res.bbox)),
      }
      queryClient.setQueryData(getKey(slug), response)

      if (statePrefixRe.test(response.name)) {
        return {
          ...response,
          name: response.name
            .replace(statePrefixRe, '')
            .split(' ')
            .map((x) => capitalize(x.toLowerCase()))
            .join(' '),
        }
      }

      return response
    }

    return null
  } catch (err) {
    console.error(err)
    return null
  }
}

export const useRegionQuery = (slug: string, config?: UseQueryOptions<any>) => {
  return useQueryLoud<RegionNormalized | null>(
    getKey(slug),
    () => fetchRegion(slug),
    config
  )
}
