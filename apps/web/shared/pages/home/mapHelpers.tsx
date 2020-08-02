import { LngLat } from '@dish/graph/_'

import { initialHomeState } from '../../state/initialHomeState'
import { omStatic, useOvermind } from '../../state/useOvermind'

export const mapHelpers = null

export const getZoomLevel = (span: LngLat) => {
  const curZoom = (span.lat + span.lng) / 2
  return curZoom < 0.1 ? 'close' : curZoom > 0.2 ? 'far' : 'medium'
}

export const useZoomLevel = () => {
  const om = useOvermind()
  return getZoomLevel(om.state.home.currentState.span!)
}

export const mapZoomToMedium = () => {
  let span = initialHomeState.span
  let center = initialHomeState.center
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
