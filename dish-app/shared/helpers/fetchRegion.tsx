import { SEARCH_DOMAIN } from '@dish/graph'
import { QueryConfig, queryCache, useQuery } from 'react-query'

type RegionApiResponse = {
  bbox: number[]
  centroid: [number, number]
  name: string
}

const key = 'useRegionQuery'

export const fetchRegion = async (slug: string) => {
  const res = await fetch(
    `${SEARCH_DOMAIN}/regions?slug=${encodeURIComponent(slug)}`
  ).then((res) => res.json())
  queryCache.setQueryData(key, res)
  return res as RegionApiResponse
}

export const useRegionQuery = (slug: string, config?: QueryConfig<any>) => {
  return useQuery(key, () => fetchRegion(slug), config)
}
