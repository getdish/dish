import { getLocalJSON, setLocalJSON } from './getLocalJSON'
import { HomeStateItemLocation } from './initialHomeState'

export function getDefaultLocation(): HomeStateItemLocation {
  return getLocalJSON('DEFAULT_LOCATION', {
    center: {
      lng: -122.421351,
      lat: 37.759251,
    },
    span: { lng: 0.2 / 2, lat: 0.2 },
  })
}

export function setDefaultLocation(value: HomeStateItemLocation) {
  setLocalJSON('DEFAULT_LOCATION', value)
}
