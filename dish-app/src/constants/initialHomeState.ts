import { getLocalJSON, setLocalJSON } from '../helpers/getLocalJSON'
import { HomeStateItemHome, HomeStateItemLocation } from '../types/homeTypes'
import { AppMapPosition } from '../types/mapTypes'

const location = getLocalJSON('DEFAULT_LOCATION')

export const initialPosition = {
  center: {
    lng: -122.421351,
    lat: 37.759251,
  },
  span: {
    lat: 0.15,
    lng: 0.15,
  },
  ...location,
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
    region: value.region ?? prev.region ?? initialHomeState.region,
    span: value.span ?? prev.span ?? initialPosition.span,
    center: value.center ?? prev.center ?? initialPosition.center,
  })
}

export const initialHomeState: HomeStateItemHome = {
  id: '0',
  type: 'home',
  activeTags: {},
  searchQuery: '',
  region: initialPosition.region ?? 'ca-san-francisco',
  section: '',
}
