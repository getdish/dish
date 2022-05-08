import { MapRegionEvent } from '../types/homeTypes'
import { appMapStore, cancelUpdateRegion } from './appMapStore'
import { homeStore } from './homeStore'

export function appMapStoreUpdateRegion(region: MapRegionEvent) {
  cancelUpdateRegion()
  const { currentState } = homeStore
  if (currentState.type === 'home' || (currentState.type === 'search' && region.via === 'click')) {
    if (currentState.region === region.slug) {
      return
    }
    appMapStore.setCurRegion(region)
    homeStore.navigate({
      state: {
        ...currentState,
        region: region.slug,
        curLocName: region.name,
        center: region.center,
        span: region.span,
      },
    })
  }
}
