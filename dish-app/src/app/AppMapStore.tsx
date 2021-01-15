import { series } from '@dish/async'
import { LngLat, RestaurantOnlyIds, resolved } from '@dish/graph'
import { isPresent } from '@dish/helpers/src'
import { Store, createStore, useStoreInstance } from '@dish/use-store'
import { isEqual, uniqBy } from 'lodash'
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
import { autocompleteLocationStore } from './AppAutocomplete'
import { homeStore } from './homeStore'
import { inputStoreLocation } from './inputStore'

type MapPosition = {
  center: LngLat
  span: LngLat
  id?: string
  via?: 'select' | 'hover' | 'detail'
}

export type MapResultItem = {
  id: any
  slug: string
  name: string
  location: {
    coordinates: any[]
  }
}

class AppMapStore extends Store {
  selected: RestaurantOnlyIds | null = null
  hovered: RestaurantOnlyIds | null = null
  userLocation: LngLat | null = null
  position: MapPosition = getDefaultLocation()
  results: MapResultItem[] = []
  showRank = false

  setResults(val: { results: MapResultItem[]; showRank?: boolean }) {
    this.setSelected(null)
    this.setHovered(null)
    this.results = val.results
    this.showRank = val.showRank
  }

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

export const useSetAppMapResults = (props: {
  isActive: boolean
  results: RestaurantOnlyIds[]
  showRank?: boolean
}) => {
  const { results, showRank, isActive } = props
  useEffect(() => {
    if (!isActive) return
    let restaurants: MapResultItem[] | null = null

    return series([
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
        appMapStore.setResults({
          results: restaurants,
          showRank,
        })
      },
    ])
  }, [JSON.stringify(props)])
}
