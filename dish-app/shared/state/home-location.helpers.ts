import { getStore } from '@dish/use-store'
import bbox from '@turf/bbox'

import { AppMapStore } from '../AppMap'
import { searchLocations } from '../helpers/searchLocations'
import { getCenter } from '../views/getCenter'
import { getCoordinates } from '../views/getCoordinates'
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

    // otherwise, using "nice name"
    // @nate temp until we get full region querying in
    const region = getStore(AppMapStore).regions[params.region]
    if (region) {
      const center = getCenter(region.geometry)
      if (!center) {
        return
      }
      return {
        center: {
          lng: center[0],
          lat: center[1],
        },
        span: bboxToSpan(bbox(region.geometry)),
      }
    }

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

function bboxToSpan(bbox: number[]) {
  return {
    lat: dist(bbox[0], bbox[2]) / 2,
    lng: dist(bbox[1], bbox[3]) / 2,
  }
}
