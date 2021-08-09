import { DISH_DEBUG, MapPosition } from '@dish/graph'

import { getLocalJSON, setLocalJSON } from '../helpers/getLocalJSON'
import { router } from '../router'
import { HomeStateItemHome, HomeStateItemLocation } from '../types/homeTypes'
import { AppMapPosition } from '../types/mapTypes'

const location = getLocalJSON('DEFAULT_LOCATION')

export const initialPosition: MapPosition = {
  center: location?.center ?? {
    lng: -122.421351,
    lat: 37.759251,
  },
  span: location?.span ?? {
    lat: 0.15,
    lng: 0.15,
  },
}

const curPage = router.curPage
const urlRegion = curPage.name === 'homeRegion' ? curPage.params.region : null
const initialRegion = urlRegion ?? location?.region ?? 'ca-san-francisco'

export const initialHomeState: HomeStateItemHome = {
  id: '0',
  type: 'home',
  activeTags: {},
  searchQuery: '',
  region: initialRegion,
  section: '',
}

export const initialLocation = {
  ...initialPosition,
  region: initialHomeState.region,
}

export function getDefaultLocation(): AppMapPosition & { region?: string } {
  const location = getLocalJSON('DEFAULT_LOCATION', initialPosition)
  return {
    via: 'init',
    ...location,
    region: initialRegion,
  }
}

export function setDefaultLocation(value: Partial<HomeStateItemLocation>) {
  const prev = getDefaultLocation()
  const next = {
    region: value.region ?? prev.region ?? initialLocation.region,
    span: value.span ?? prev.span ?? initialLocation.span,
    center: value.center ?? prev.center ?? initialLocation.center,
  }
  if (process.env.NODE_ENV === 'development') {
    console.log('setDefaultLocation', next)
  }
  setLocalJSON('DEFAULT_LOCATION', next)
}

// if (DISH_DEBUG) {
//   console.log('getDefaultLocation', getDefaultLocation(), {
//     urlRegion,
//     initialRegion,
//     curPage,
//     initialHomeState,
//     initialLocation,
//   })
// }
