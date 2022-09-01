import { getInitialHomeState } from '../../../constants/initialHomeState'
import { fetchRegion } from '../../../helpers/fetchRegion'
import { bboxToLngLat } from '../../../helpers/mapHelpers'
import { searchLocations } from '../../../helpers/searchLocations'
import { useQueryLoud } from '../../../helpers/useQueryLoud'
import { SearchRouteParams } from '../../../router'
import { RegionNormalized } from '../../../types/homeTypes'
import { urlSerializers } from './urlSerializers'
import { LngLat, MapPosition } from '@dish/graph'
import { HistoryItem } from '@dish/router'

export function useLocationFromRoute(route: HistoryItem<'search'>) {
  const key = `location-${route.name + route.params.region}`
  return useQueryLoud(key, () => getLocationFromRoute(route), {
    suspense: false,
  })
}

export const regionPositions: { [key: string]: MapPosition } = {}

export async function getLocationFromRoute(
  route: HistoryItem<'search'>
): Promise<{ center: LngLat; span: LngLat; region?: RegionNormalized } | null> {
  if (route.name === 'search') {
    const params = route.params as SearchRouteParams

    if (params.region === 'here') {
      // TODO get from localStorage or set to default sf
      return null
    }

    // lat _ lng _ spanlat _ spanlng
    if (urlSerializers.search.region.match(params.region)) {
      // @ts-expect-error
      return urlSerializers.search.region.deserialize(params.region)
    }

    // find by slug
    const region = await fetchRegion(params.region)
    if (region) {
      regionPositions[params.region] = {
        center: region.center,
        span: region.span,
      }
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
          span: bboxToLngLat(nearest.bbox),
        }
      }
    }
  }

  return (await getInitialHomeState()).initialPosition
}
