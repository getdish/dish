import { series } from '@dish/async'
import { LngLat, RestaurantOnlyIds, resolved } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { Store, createStore, useStoreInstance } from '@dish/use-store'
import { findLast, uniqBy } from 'lodash'
import { useEffect } from 'react'

import { defaultLocationAutocompleteResults } from '../constants/defaultLocationAutocompleteResults'
import {
  getDefaultLocation,
  setDefaultLocation,
} from '../helpers/getDefaultLocation'
import { getNavigateItemForState } from '../helpers/getNavigateItemForState'
import { reverseGeocode } from '../helpers/reverseGeocode'
import { queryRestaurant } from '../queries/queryRestaurant'
import { router } from '../router'
import { AppMapPosition, MapResultItem } from '../types/mapTypes'
import { autocompleteLocationStore } from './AppAutocomplete'
import { homeStore } from './homeStore'
import { inputStoreLocation } from './inputStore'

type MapOpts = {
  showRank?: boolean
  zoomOnHover?: boolean
}

type MapHoveredRestaurant = RestaurantOnlyIds & { via: 'map' | 'list' }

class AppMapStore extends Store {
  selected: RestaurantOnlyIds | null = null
  hovered: MapHoveredRestaurant | null = null
  userLocation: LngLat | null = null
  position: AppMapPosition = getDefaultLocation()
  lastPositions: AppMapPosition[] = []
  results: MapResultItem[] = []
  showRank = false
  zoomOnHover = false

  setState(val: MapOpts & { results?: MapResultItem[] }) {
    this.setSelected(null)
    this.setHovered(null)
    this.results = val.results ?? []
    this.showRank = val.showRank
    this.zoomOnHover = val.zoomOnHover
  }

  setPosition(pos: AppMapPosition) {
    this.position = {
      ...this.position,
      ...pos,
    }
    const n = [...this.lastPositions, this.position]
    this.lastPositions = n.reverse().slice(0, 15).reverse() // keep only 15
    this.updateAreaInfo()
  }

  clearHover() {
    const beforeHover = findLast(this.lastPositions, (x) => x.via !== 'hover')
    this.hovered = null
    if (beforeHover) {
      this.position = beforeHover
    }
  }

  setSelected(n: RestaurantOnlyIds | null) {
    this.selected = n
  }

  setHovered(n: MapHoveredRestaurant | null) {
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
      const curState = homeStore.currentState
      const center = exact.center
      const span = exact.span ?? curState.span
      homeStore.updateCurrentState('appMapStore.setLocation', {
        center,
        span,
        curLocName: val,
      })
      setDefaultLocation({
        center,
        span,
      })
      const navItem = getNavigateItemForState(curState)
      if (router.getShouldNavigate(navItem)) {
        router.navigate(navItem)
      }
    } else {
      console.warn('No center found?')
    }
  }
}

export const appMapStore = createStore(AppMapStore)
export const useAppMapStore = () => useStoreInstance(appMapStore)

export const useSetAppMapResults = (
  props: MapOpts & {
    results?: RestaurantOnlyIds[]
    isActive: boolean
  }
) => {
  const { results, showRank, isActive, zoomOnHover } = props
  useEffect(() => {
    if (!isActive) return
    let restaurants: MapResultItem[] | null = null

    const disposeSeries = series([
      async () => {
        const all = results
        const allIds = [...new Set(all.map((x) => x.id))]
        const allResults = allIds
          .map((id) => all.find((x) => x.id === id))
          .filter(isPresent)

        restaurants = await resolved(() => {
          return (
            uniqBy(
              allResults
                .map(({ id, slug }) => {
                  if (!slug) return null
                  const [r] = queryRestaurant(slug)
                  if (!r) return null
                  const coords = r?.location?.coordinates
                  return {
                    id: id || r.id,
                    slug,
                    name: r.name,
                    location: {
                      coordinates: [coords?.[0], coords?.[1]],
                    },
                  }
                })
                .filter(isPresent),
              (x) => `${x.location.coordinates[0]}${x.location.coordinates[1]}`
            )
              // ensure has location
              .filter((x) => x.id && !!x.location.coordinates[0])
          )
        })
      },
      () => {
        appMapStore.setState({
          results: restaurants,
          showRank,
          zoomOnHover,
        })
      },
    ])

    return () => {
      disposeSeries()
      appMapStore.setState({
        zoomOnHover: false,
        showRank: false,
      })
    }
  }, [JSON.stringify(props)])
}
