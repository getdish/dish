import { LngLat } from '@dish/graph'

import { homeStore, useHomeStore } from '../app/homeStore'

export const mapHelpers = null

export const getZoomLevel = (span: LngLat) => {
  const curZoom = (Math.abs(span.lat) + Math.abs(span.lng)) / 2
  return curZoom < 0.05 ? 'close' : curZoom > 0.3 ? 'far' : 'medium'
}

export const useZoomLevel = () => {
  const home = useHomeStore()
  return getZoomLevel(home.currentState.span!)
}

export const mapZoomToMedium = () => {
  let span = homeStore.currentState.span!
  let center = homeStore.currentState.center!
  for (const state of [...homeStore.states].reverse()) {
    if (getZoomLevel(state.span!) === 'medium') {
      span = state.span!
      center = state.center!
      break
    }
  }
  homeStore.updateCurrentState({
    span,
    center,
  })
}
