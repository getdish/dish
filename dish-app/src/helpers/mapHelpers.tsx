import { LngLat } from '@dish/graph'

import { omStatic } from '../app/state/omStatic'
import { useOvermind } from '../app/state/useOvermind'

export const mapHelpers = null

export const getZoomLevel = (span: LngLat) => {
  const curZoom = (Math.abs(span.lat) + Math.abs(span.lng)) / 2
  return curZoom < 0.05 ? 'close' : curZoom > 0.3 ? 'far' : 'medium'
}

export const useZoomLevel = () => {
  const om = useOvermind()
  return getZoomLevel(om.state.home.currentState.span!)
}

export const mapZoomToMedium = () => {
  const om = omStatic
  let span = om.state.home.currentState.span!
  let center = om.state.home.currentState.center!
  for (const state of [...omStatic.state.home.states].reverse()) {
    if (getZoomLevel(state.span!) === 'medium') {
      span = state.span!
      center = state.center!
      break
    }
  }
  omStatic.actions.home.updateCurrentState({
    span,
    center,
  })
}
