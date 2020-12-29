import { LngLat, RestaurantOnlyIds } from '@dish/graph'
import { Store, createStore } from '@dish/use-store'

import { initialHomeState } from './state/initialHomeState'
import { om } from './state/om'
import { reverseGeocode } from './state/reverseGeocode'

type MapPosition = {
  center: LngLat
  span: LngLat
  id?: string
  via?: 'select' | 'hover' | 'detail'
}

class AppMapStore extends Store {
  selected: RestaurantOnlyIds | null = null
  hovered: RestaurantOnlyIds | null = null
  userLocation: LngLat | null = null
  position: MapPosition = {
    center: initialHomeState.center,
    span: initialHomeState.span,
  }

  setPosition(pos: Partial<MapPosition>) {
    if (pos.center === undefined) {
      debugger
    }
    this.position = {
      ...this.position,
      ...pos,
    }
    this.updateAreaInfo()
  }

  setSelected(n: RestaurantOnlyIds | null) {
    this.selected = n
  }

  setHovered(n: RestaurantOnlyIds | null) {
    this.hovered = n
  }

  async moveToUserLocation() {
    const position = await this.getUserPosition()
    const location: LngLat = {
      lng: position.coords.longitude,
      lat: position.coords.latitude,
    }
    this.userLocation = location
    const state = om.state.home.currentState
    om.actions.home.updateHomeState({
      ...state,
      center: { ...location },
    })
  }

  getUserPosition = () => {
    return new Promise<any>((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, rej)
    })
  }

  async updateAreaInfo() {
    const { center, span } = this.position
    const res = await reverseGeocode(center, span)
    if (res) {
      const name = res.fullName ?? res.name ?? res.country
      om.actions.home.updateCurrentState({
        currentLocationInfo: res,
        currentLocationName: name,
      })
    }
  }
}

export const appMapStore = createStore(AppMapStore)
