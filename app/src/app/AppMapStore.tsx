import { series, sleep } from '@dish/async'
import {
  LngLat,
  MapPosition,
  RestaurantOnlyIds,
  RestaurantOnlyIdsPartial,
  resolved,
} from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { Store, createStore, useStoreInstance, useStoreInstanceSelector } from '@dish/use-store'
import bbox from '@turf/bbox'
import getCenter from '@turf/center'
import { featureCollection } from '@turf/helpers'
import { findLast, uniqBy } from 'lodash'
import { useEffect } from 'react'

import {
  getDefaultLocation,
  initialLocation,
  setDefaultLocation,
} from '../constants/initialHomeState'
import {
  MapZoomLevel,
  bboxToLngLat,
  getMaxLngLat,
  getZoomLevel,
  hasMovedAtLeast,
  padLngLat,
} from '../helpers/mapHelpers'
import { reverseGeocode } from '../helpers/reverseGeocode'
import { queryRestaurant } from '../queries/queryRestaurant'
import { RegionWithVia } from '../types/homeTypes'
import { AppMapPosition, MapResultItem } from '../types/mapTypes'
import { homeStore } from './homeStore'

type MapOpts = {
  showRank?: boolean
  zoomOnHover?: boolean
  hideRegions?: boolean
  fitToResults?: boolean
}

export type MapHoveredRestaurant = RestaurantOnlyIds & {
  via: 'map' | 'list'
}

// TODO this wants to be a stack where you have states you push:
// {
//   via: '',
//   results: [],
//   zoomOnHover: true,
//   showRank: false,
// }
// that way we can do things like hovering on states to see them
// and have it pop back to show last state before hover

let defaultLocation = getDefaultLocation()

// fix broken localstorage
if (!defaultLocation.center?.lat) {
  setDefaultLocation(initialLocation)
  defaultLocation = getDefaultLocation()
}

class AppMapStore extends Store {
  selected: RestaurantOnlyIds | null = null
  hovered: MapHoveredRestaurant | null = null
  userLocation: LngLat | null = null
  position: AppMapPosition = defaultLocation
  nextPosition: AppMapPosition = defaultLocation
  lastPositions: AppMapPosition[] = []
  results: MapResultItem[] = []
  features: GeoJSON.Feature[] = []
  showRank = false
  zoomOnHover = false
  hideRegions = false
  ids = {}
  lastRegion: null | RegionWithVia = null

  setState(
    val: MapOpts & {
      results?: MapResultItem[] | null
      features: GeoJSON.Feature[]
    }
  ) {
    this.setSelected(null)
    this.setHovered(null)
    this.results = val.results ?? []
    if (val.features?.length) {
      this.features = val.features
    }
    this.showRank = val.showRank || false
    this.zoomOnHover = val.zoomOnHover || false
    this.hideRegions = val.hideRegions || false
  }

  setPosition(pos: Partial<AppMapPosition>) {
    this.position = {
      center: pos.center ?? this.position.center,
      span: pos.span ?? this.position.span,
      via: pos.via ?? this.position.via,
      at: Date.now(),
    }
    // fix if it gets bad value...
    this.position.center.lat = this.position.center.lat ?? defaultLocation.center.lat
    this.position.center.lng = this.position.center.lng ?? defaultLocation.center.lng
    this.nextPosition = this.position
    const n = [...this.lastPositions, this.position]
    this.lastPositions = n.reverse().slice(0, 15).reverse() // keep only 15
  }

  get currentPosition() {
    return this.nextPosition ?? this.position
  }

  get currentZoomLevel() {
    return getZoomLevel(this.currentPosition.span)
  }

  setNextPosition(pos: Partial<AppMapPosition>) {
    this.nextPosition = {
      center: pos.center ?? this.position.center,
      span: pos.span ?? this.position.span,
      via: pos.via ?? this.position.via,
      at: Date.now(),
    }
  }

  setLastRegion(next: RegionWithVia | null) {
    this.lastRegion = next
  }

  get isOnRegion() {
    return !!this.lastRegion && !hasMovedAtLeast(this.lastRegion, this.position, 0.04)
  }

  async getCurrentLocationInfo() {
    const { center, span } = this.currentPosition
    const curLocInfo = await reverseGeocode(center, span)
    if (!curLocInfo) {
      return null
    }
    const curLocName = curLocInfo.fullName ?? curLocInfo.name ?? curLocInfo.country
    return {
      curLocName,
      curLocInfo,
    }
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

  // private watchId: any
  async moveToUserLocation() {
    // navigator.geolocation.clearWatch(this.watchId)
    const positionToLngLat = (position: GeolocationPosition): LngLat => {
      return {
        lng: position.coords.longitude,
        lat: position.coords.latitude,
      }
    }
    const position = await this.getUserPosition()
    if (position) {
      const positionLngLat = positionToLngLat(position)
      this.userLocation = positionLngLat
      const state = homeStore.currentState
      appMapStore.setPosition({
        center: positionLngLat,
      })
      // watching actually is anti-pattern, just move where they are once
      // we could "show" where they are at all times, but that may be doable through mapbox
      // this.watchId = navigator.geolocation.watchPosition(position => {
      //   appMapStore.setPosition({
      //     center: positionToLngLat(position)
      //   })
      // })
    }
  }

  zoomIn() {
    switch (this.currentZoomLevel) {
      case 'far':
        this.zoomToLevel('medium')
        break
      case 'medium':
        this.zoomToLevel('close')
        break
    }
  }

  zoomOut() {
    switch (this.currentZoomLevel) {
      case 'close':
        this.zoomToLevel('medium')
        break
      case 'medium':
        this.zoomToLevel('far')
        break
    }
  }

  static levels: { [key in MapZoomLevel]: LngLat } = {
    close: {
      lng: 0.03,
      lat: 0.01,
    },
    medium: {
      lng: 0.12,
      lat: 0.05,
    },
    far: {
      lng: 0.75,
      lat: 0.28,
    },
  }

  zoomToLevel(level: MapZoomLevel) {
    const span = AppMapStore.levels[level]
    this.setPosition({
      span,
    })
  }

  getUserPosition = () => {
    return new Promise<any>((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, rej)
    })
  }

  private getNumId = (id: string): number => {
    this.ids[id] = this.ids[id] || Math.round(Math.random() * 10000000000)
    return this.ids[id]
  }

  getMapFeatures = (results: MapResultItem[] | null, selectedId?: string | null) => {
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
export const useAppMapKey = <A extends keyof AppMapStore>(key: A) =>
  useStoreInstanceSelector(appMapStore, (x) => x[key])

export const useZoomLevel = () => {
  const position = useAppMapKey('position')
  return getZoomLevel(position.span!)
}

export function updateRegionImmediate(region: RegionWithVia) {
  cancelUpdateRegion()
  const { currentState } = homeStore
  if (currentState.type === 'home' || (currentState.type === 'search' && region.via === 'click')) {
    if (currentState.region === region.slug) {
      return
    }
    appMapStore.setLastRegion(region)
    console.log('map navigate to', region)
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

export const updateRegion = updateRegionImmediate // debounce(updateRegionImmediate, 340)
export const updateRegionFaster = updateRegionImmediate // debounce(updateRegionImmediate, 300)

export const cancelUpdateRegion = () => {
  // only for non-concurrent mode
  // updateRegion.cancel()
  // updateRegionFaster.cancel()
}

export const useSetAppMap = (
  props: MapOpts & {
    center?: MapPosition['center']
    span?: MapPosition['span']
    results?: RestaurantOnlyIdsPartial[]
    isActive: boolean
    region?: RegionWithVia | null
  }
) => {
  const {
    results,
    showRank,
    isActive,
    zoomOnHover,
    center,
    span,
    fitToResults,
    hideRegions,
    region,
  } = props

  useEffect(() => {
    if (!isActive) return
    if (!center && !span) return
    // console.log('got new map pos from useSetAppMap', center)
    appMapStore.setPosition({
      center,
      span,
    })
  }, [fitToResults, isActive, center?.lat, center?.lng, span?.lat, span?.lng])

  useEffect(() => {
    if (!isActive) return
    if (!region) return
    if (!center || !span) return
    appMapStore.setLastRegion(region)
  }, [region?.slug, isActive])

  useEffect(() => {
    if (!isActive) return

    const disposeSeries = series([
      () => {
        // fetch map items after page may be fetched so we may get cache hits
        return sleep(200)
      },
      async () => {
        const all = results
        if (!all) return
        const allIds = new Set<string>()
        const allResults: RestaurantOnlyIdsPartial[] = []
        for (const item of all) {
          if (item && item.id) {
            allIds.add(item.id)
            allResults.push(item)
          }
        }

        if (!allResults.length) {
          return []
        }

        return await resolved(() => {
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
      (results) => {
        const features = appMapStore.getMapFeatures(results)
        appMapStore.setState({
          results,
          showRank,
          zoomOnHover,
          features,
          hideRegions,
        })
        if (fitToResults && features.length) {
          const collection = featureCollection(features)
          const resultsBbox = bbox(collection)
          if (resultsBbox) {
            const centerCoord = getCenter(collection as any)
            const position = {
              center: {
                lng: centerCoord.geometry.coordinates[0],
                lat: centerCoord.geometry.coordinates[1],
              },
              span: getMaxLngLat(padLngLat(bboxToLngLat(resultsBbox), 3), {
                // dont zoom too much in
                lng: 0.005,
                lat: 0.005,
              }),
            }
            appMapStore.setPosition({
              via: 'results',
              ...position,
            })
          }
        }
      },
    ])

    return () => {
      disposeSeries()
      appMapStore.setState({
        zoomOnHover: false,
        showRank: false,
        features: [],
      })
    }
  }, [JSON.stringify(results), fitToResults, isActive, zoomOnHover, hideRegions])
}
