import { searchLocations } from '../helpers/searchLocations'
import { HomeStateItemLocation } from './HomeStateItemLocation'
import { initialHomeState } from './initialHomeState'
import { SearchRouteParams, router } from './router'

export const dist = (a: number, b: number) => {
  return a > b ? a - b : b - a
}

export async function getLocationFromRoute(): Promise<HomeStateItemLocation | null> {
  const page = router.curPage

  if (page.name === 'search') {
    const params = page.params as SearchRouteParams

    if (params.location === 'here') {
      return null
    }

    // lat _ lng _ span
    if (+params.location[0] >= 0) {
      const [latStr, lngStr, spanStr] = params.location.split('_')
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

    // otherwise, using "nice name"
    const locations = await searchLocations(params.location)

    if (locations.length) {
      const [nearest] = locations
      return {
        center: nearest.center,
        span: {
          lat: dist(nearest.bbox[0], nearest.bbox[2]) / 2,
          lng: dist(nearest.bbox[1], nearest.bbox[3]) / 2,
        },
      }
    }
  }

  return {
    center: initialHomeState.center,
    span: initialHomeState.span,
  }
}
