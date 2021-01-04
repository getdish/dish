import { getLocalJSON, setLocalJSON } from './getLocalJSON'
import { HomeStateItemLocation } from '../types/homeTypes'

const initSpan = {
  lng: 0.15 / 2,
  lat: 0.15,
}

export function getDefaultLocation(): HomeStateItemLocation {
  const location = getLocalJSON('DEFAULT_LOCATION', {
    center: {
      lng: -122.421351,
      lat: 37.759251,
    },
    span: initSpan,
  })
  return {
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
