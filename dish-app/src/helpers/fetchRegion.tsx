import { SEARCH_DOMAIN } from '@dish/graph'
import { capitalize } from 'lodash'
import { UseQueryOptions } from 'react-query'

import { RegionApiResponse, RegionNormalized } from '../types/homeTypes'
import { coordsToLngLat, getMinLngLat, padLngLat, polygonToLngLat } from './mapHelpers'
import { queryClient } from './queryClient'
import { useQueryLoud } from './useQueryLoud'

const getKey = (slug?: string | null) => `REGIONQUERY-${slug}`

const statePrefixRe = /[A-Z]{2}\- /

export const fetchRegion = async (slug?: string | null) => {
  if (!slug) {
    return null
  }
  try {
    const url = `${SEARCH_DOMAIN}/regions?slug=${encodeURIComponent(slug)}`
    const res: RegionApiResponse = await fetch(url).then((x) => x.json())
    const centerAt = res?.centroid?.coordinates
    if (!!centerAt) {
      let response: RegionNormalized = {
        ...res,
        center: coordsToLngLat(centerAt),
        span: getMinLngLat(polygonToLngLat(res.bbox), { lng: 0.5, lat: 0.5 }),
      }
      if (statePrefixRe.test(response.name)) {
        response = {
          ...response,
          name: response.name
            .replace(statePrefixRe, '')
            .split(' ')
            .map((x) => capitalize(x.toLowerCase()))
            .join(' '),
        }
      }
      queryClient.setQueryData(getKey(slug), response)
      return response
    }
    return null
  } catch (err) {
    console.error(err)
    return null
  }
}

export const useRegionQuery = (slug?: string | null, config?: UseQueryOptions<any>) => {
  return useQueryLoud<RegionNormalized | null>(getKey(slug), () => fetchRegion(slug), {
    ...config,
    enabled: !!slug,
  })
}
