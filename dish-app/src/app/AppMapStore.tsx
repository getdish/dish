import { LngLat, RestaurantOnlyIds } from '@dish/graph'
import { Store, createStore } from '@dish/use-store'
import { isEqual } from 'lodash'

import { defaultLocationAutocompleteResults } from '../constants/defaultLocationAutocompleteResults'
import {
  getDefaultLocation,
  setDefaultLocation,
} from '../helpers/getDefaultLocation'
import { getNavigateItemForState } from '../helpers/getNavigateItemForState'
import { reverseGeocode } from '../helpers/reverseGeocode'
import { router } from '../router'
import { autocompleteLocationStore } from './AppAutocomplete'
import { homeStore } from './homeStore'
import { inputStoreLocation } from './inputStore'

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
  position: MapPosition = getDefaultLocation()

  setPosition(via: string, pos: Partial<MapPosition>) {
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
    const state = homeStore.currentState
    homeStore.updateHomeState('appMapStore.moveToUserLocation', {
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
    const curLocInfo = await reverseGeocode(center, span)
    if (curLocInfo) {
      const curLocName =
        curLocInfo.fullName ?? curLocInfo.name ?? curLocInfo.country
      homeStore.updateCurrentState('appMapStore.updateAreaInfo', {
        curLocInfo,
        curLocName,
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
    if ('center' in exact) {
      homeStore.updateCurrentState('appMapStore.setLocation', {
        center: { ...exact.center },
        curLocName: val,
      })
      const curState = homeStore.currentState
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
