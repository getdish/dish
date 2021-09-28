import { DISH_API_ENDPOINT } from '@dish/graph'
import { capitalize } from 'lodash'
import { SWRConfiguration } from 'swr'

import { RegionApiResponse, RegionNormalized } from '../types/homeTypes'
import { coordsToLngLat, getMinLngLat, polygonToLngLat, roundLngLat } from './mapHelpers'
import { useQueryLoud } from './useQueryLoud'

const getKey = (slug?: string | null) => `REGIONQUERY-${slug}`

const statePrefixRe = /[A-Z]{2}\- /

export const fetchRegion = async (slug?: string | null) => {
  if (!slug) {
    return null
  }
  const url = `${DISH_API_ENDPOINT}/region?slug=${encodeURIComponent(slug)}`
  try {
    const res: RegionApiResponse = await fetch(url).then((x) => x.json())
    const centerAt = res?.centroid?.coordinates
    // console.log('got region response', res, centerAt)
    if (!!centerAt) {
      let response: RegionNormalized = {
        ...res,
        center: roundLngLat(coordsToLngLat(centerAt)),
        span: roundLngLat(getMinLngLat(polygonToLngLat(res.bbox), { lng: 0.5, lat: 0.5 })),
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
      return response
    }
    return null
  } catch (err) {
    console.error('error fetching region', err, url)
    return null
  }
}

export const useRegionQuery = (slug?: string | null, config?: SWRConfiguration<any>) => {
  return useQueryLoud<RegionNormalized | null>(getKey(slug), () => fetchRegion(slug), {
    ...config,
    isPaused() {
      return !slug
    },
  })
}
