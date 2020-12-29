import { LngLat, RestaurantOnlyIds } from '@dish/graph'
import { Store, createStore } from '@dish/use-store'

import { autocompleteLocationStore } from './AppAutocomplete'
import { inputStoreLocation } from './InputStore'
import { defaultLocationAutocompleteResults } from '../constants/defaultLocationAutocompleteResults'
import { setDefaultLocation } from '../helpers/getDefaultLocation'
import { getNavigateItemForState } from './state/getNavigateItemForState'
import { initialHomeState } from '../constants/initialHomeState'
import { om } from './state/om'
import { reverseGeocode } from '../helpers/reverseGeocode'
import { router } from '../router'

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

  setLocation(val: string) {
    const current = [
      ...autocompleteLocationStore.results,
      ...defaultLocationAutocompleteResults,
    ]
    inputStoreLocation.setValue(val)
    const exact = current.find((x) => x.name === val)
    if (exact?.center) {
      om.actions.home.updateCurrentState({
        center: { ...exact.center },
        currentLocationName: val,
      })
      const curState = om.state.home.currentState
      const navItem = getNavigateItemForState(curState)
      if (router.getShouldNavigate(navItem)) {
        router.navigate(navItem)
      }
      setDefaultLocation({
        center: exact.center,
        span: curState.span,
      })
    } else {
      console.warn('No center found?')
    }
  }
}

export const appMapStore = createStore(AppMapStore)
