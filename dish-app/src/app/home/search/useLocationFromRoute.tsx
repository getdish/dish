import { LngLat } from '@dish/graph'
import { HistoryItem } from '@dish/router'

import { initialPosition } from '../../../constants/initialHomeState'
import { bboxToSpan } from '../../../helpers/bboxToSpan'
import { fetchRegion } from '../../../helpers/fetchRegion'
import { searchLocations } from '../../../helpers/searchLocations'
import { useQueryLoud } from '../../../helpers/useQueryLoud'
import { SearchRouteParams } from '../../../router'
import { RegionNormalized } from '../../../types/homeTypes'

export function useLocationFromRoute(route: HistoryItem<'search'>) {
  const key = `location-${route.name + route.params.region}`
  return useQueryLoud(key, () => getLocationFromRoute(route), {
    suspense: false,
  })
}

export async function getLocationFromRoute(
  route: HistoryItem<'search'>
): Promise<{ center: LngLat; span: LngLat; region?: RegionNormalized } | null> {
  if (route.name === 'search') {
    const params = route.params as SearchRouteParams

    if (params.region === 'here') {
      // TODO get from localStorage or set to default sf
      return null
    }

    // lat _ lng _ span
    if (+params.region[0] >= 0) {
      const [latStr, lngStr, spanLatStr, spanLngStr] = params.region.split('_')
      return {
        center: {
          lat: +latStr,
          lng: +lngStr,
        },
        span: {
          lat: +spanLatStr,
          lng: +spanLngStr,
        },
      }
    }

    // find by slug
    const region = await fetchRegion(params.region)
    if (region) {
      return {
        center: region.center,
        span: region.span,
        region,
      }
    }

    // ?? old find by slug
    const locations = await searchLocations(params.region.split('-').join(' '))
    if (locations.length) {
      const [nearest] = locations
      if (nearest.center && nearest.bbox) {
        return {
          center: nearest.center,
          span: bboxToSpan(nearest.bbox),
        }
      }
    }
  }

  return initialPosition
}
