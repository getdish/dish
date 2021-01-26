import { LngLat } from '@dish/graph'

import { appMapStore, useAppMap } from '../app/AppMapStore'

export const mapHelpers = null

export const getZoomLevel = (span: LngLat) => {
  const curZoom = (Math.abs(span.lat) + Math.abs(span.lng)) / 2
  return curZoom < 0.05 ? 'close' : curZoom > 0.3 ? 'far' : 'medium'
}

export const useZoomLevel = () => {
  const position = useAppMap('position')
  return getZoomLevel(position.span!)
}

export const mapZoomToMedium = () => {
  let span = appMapStore.position.span!
  let center = appMapStore.position.center!
  for (const state of [...appMapStore.lastPositions].reverse()) {
    if (getZoomLevel(state.span!) === 'medium') {
      span = state.span!
      center = state.center!
      break
    }
  }
  appMapStore.setPosition({
    span,
    center,
  })
}
