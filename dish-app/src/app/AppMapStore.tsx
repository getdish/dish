import { series } from '@dish/async'
import { LngLat, MapPosition, RestaurantOnlyIds, resolved } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { Store, createStore, useStoreInstance } from '@dish/use-store'
import bbox from '@turf/bbox'
import center from '@turf/center'
import { featureCollection } from '@turf/helpers'
import { BBox } from '@turf/helpers'
import { findLast, uniqBy } from 'lodash'
import { useEffect } from 'react'

import { getDefaultLocation } from '../constants/initialHomeState'
import { bboxToSpan } from '../helpers/bboxToSpan'
import { reverseGeocode } from '../helpers/reverseGeocode'
import { queryRestaurant } from '../queries/queryRestaurant'
import { AppMapPosition, MapResultItem } from '../types/mapTypes'
import { homeStore } from './homeStore'

type MapOpts = {
  showRank?: boolean
  zoomOnHover?: boolean
  fitToResults?: boolean
}

type MapHoveredRestaurant = RestaurantOnlyIds & { via: 'map' | 'list' }

// TODO this wants to be a stack where you have states you push:
// {
//   via: '',
//   results: [],
//   zoomOnHover: true,
//   showRank: false,
// }
// that way we can do things like hovering on states to see them
// and have it pop back to show last state before hover

class AppMapStore extends Store {
  selected: RestaurantOnlyIds | null = null
  hovered: MapHoveredRestaurant | null = null
  userLocation: LngLat | null = null
  position: AppMapPosition = getDefaultLocation()
  lastPositions: AppMapPosition[] = []
  results: MapResultItem[] = []
  features: GeoJSON.Feature[] = []
  resultsBbox: BBox | null = null
  showRank = false
  zoomOnHover = false
  ids = {}

  setState(val: MapOpts & { results?: MapResultItem[] | null }) {
    this.setSelected(null)
    this.setHovered(null)
    this.results = val.results ?? []
    this.features = this.getMapFeatures(this.results)
    this.showRank = val.showRank ?? false
    this.zoomOnHover = val.zoomOnHover ?? false

    const collection = featureCollection(this.features)
    this.resultsBbox = this.features.length ? bbox(collection) : null

    if (val.fitToResults && this.resultsBbox) {
      // @ts-expect-error
      const centerCoord = center(collection)
      this.position = {
        via: 'results',
        center: {
          lng: centerCoord.geometry.coordinates[0],
          lat: centerCoord.geometry.coordinates[1],
        },
        // @ts-expect-error
        span: bboxToSpan(this.resultsBbox),
      }
    }
  }

  setPosition(pos: Partial<AppMapPosition>) {
    this.position = {
      center: pos.center ?? this.position.center,
      span: pos.span ?? this.position.span,
      via: pos.via ?? this.position.via,
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
    appMapStore.setPosition({
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

  private getNumId = (id: string): number => {
    this.ids[id] = this.ids[id] ?? Math.round(Math.random() * 10000000000)
    return this.ids[id]
  }

  private getMapFeatures = (
    results: MapResultItem[] | null,
    selectedId?: string | null
  ) => {
    const result: GeoJSON.Feature[] = []
    if (!results) {
      return result
    }
    for (const restaurant of results) {
      if (!restaurant?.location?.coordinates) {
        continue
      }
      // const percent = getRestaurantRating(restaurant.rating)
      // const color = getRankingColor(percent)
      if (!restaurant.id) {
        throw new Error('No id for restaurant')
      }
      result.push({
        type: 'Feature',
        id: this.getNumId(restaurant.id),
        geometry: {
          type: 'Point',
          coordinates: restaurant.location.coordinates,
        },
        properties: {
          id: restaurant.id,
          title: restaurant.name ?? 'none',
          subtitle: 'Pho, Banh Mi',
          color: '#fbb03b',
          selected: selectedId === restaurant.id ? 1 : 0,
        },
      })
    }
    return result
  }
}

export const appMapStore = createStore(AppMapStore)

export const useAppMapStore = () => useStoreInstance(appMapStore)
export const useAppMap = <A extends keyof AppMapStore>(key: A) =>
  useStoreInstance(appMapStore, (x) => x[key])

export const useSetAppMap = (
  props: MapOpts & {
    center?: MapPosition['center']
    span?: MapPosition['span']
    results?: RestaurantOnlyIds[]
    isActive: boolean
  }
) => {
  const { results, showRank, isActive, zoomOnHover, center, span } = props

  useEffect(() => {
    if (isActive && (center || span)) {
      appMapStore.setPosition({
        center,
        span,
      })
    }
  }, [isActive, center?.lat, center?.lng, span?.lat, span?.lng])

  useEffect(() => {
    if (!isActive) return
    let restaurants: MapResultItem[] | null = null

    const disposeSeries = series([
      async () => {
        const all = results
        if (!all) return
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
  }, [JSON.stringify(results), isActive])
}
