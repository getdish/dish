import { HomeStateItemLocation } from '../types/homeTypes'
import { AppMapPosition } from '../types/mapTypes'
import { getLocalJSON, setLocalJSON } from './getLocalJSON'

const initSpan = {
  lng: 0.15 / 2,
  lat: 0.15,
}

export function getDefaultLocation(): AppMapPosition & { region?: string } {
  const location = getLocalJSON('DEFAULT_LOCATION', {
    center: {
      lng: -122.421351,
      lat: 37.759251,
    },
    span: initSpan,
  })
  return {
    via: 'init',
    ...location,
    span: {
      // minimum span for initial location
      lng: Math.max(initSpan.lng, location.span.lng),
      lat: Math.max(initSpan.lat, location.span.lat),
    },
  }
}

export function setDefaultLocation(value: HomeStateItemLocation) {
  setLocalJSON('DEFAULT_LOCATION', value)
}
