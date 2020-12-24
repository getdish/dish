import { bboxToSpan } from '../helpers/bboxToSpan'
import { fetchRegion } from '../helpers/fetchRegion'
import { searchLocations } from '../helpers/searchLocations'
import { HomeStateItemLocation } from './HomeStateItemLocation'
import { initialHomeState } from './initialHomeState'
import { SearchRouteParams, router } from './router'

export async function getLocationFromRoute(): Promise<HomeStateItemLocation | null> {
  const page = router.curPage

  if (page.name === 'search') {
    const params = page.params as SearchRouteParams

    if (params.region === 'here') {
      return null
    }

    // lat _ lng _ span
    if (+params.region[0] >= 0) {
      const [latStr, lngStr, spanStr] = params.region.split('_')
      return {
        center: {
          lat: +latStr,
          lng: +lngStr,
        },
        span: {
          lat: +spanStr,
          lng: +spanStr,
        },
      }
    }

    // find by slug
    const region = await fetchRegion(params.region)
    if (region) {
      return {
        center: region.center,
        span: region.span,
      }
    }

    // ?? old find by slug
    const locations = await searchLocations(params.region.split('-').join(' '))
    if (locations.length) {
      const [nearest] = locations
      return {
        center: nearest.center,
        span: bboxToSpan(nearest.bbox),
      }
    }
  }

  return {
    center: initialHomeState.center,
    span: initialHomeState.span,
  }
}
