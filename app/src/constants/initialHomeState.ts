import { MapPosition } from '@dish/graph'

import { getLocalJSON, setLocalJSON } from '../helpers/getLocalJSON'
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

export const initialHomeState: HomeStateItemHome = {
  id: '0',
  type: 'home',
  activeTags: {},
  searchQuery: '',
  region: location?.region ?? 'ca-san-francisco',
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
  }
}

export function setDefaultLocation(value: Partial<HomeStateItemLocation>) {
  const prev = getDefaultLocation()
  setLocalJSON('DEFAULT_LOCATION', {
    region: value.region ?? prev.region ?? initialLocation.region,
    span: value.span ?? prev.span ?? initialLocation.span,
    center: value.center ?? prev.center ?? initialLocation.center,
  })
}
