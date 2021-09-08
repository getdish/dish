import { series, sleep } from '@dish/async'
import {
  LngLat,
  MapPosition,
  RestaurantOnlyIds,
  RestaurantOnlyIdsPartial,
  resolved,
} from '@dish/graph'
import { isPresent, isSafari } from '@dish/helpers'
import { Store, createStore, useStoreInstance, useStoreInstanceSelector } from '@dish/use-store'
import loadable from '@loadable/component'
import bbox from '@turf/bbox'
import getCenter from '@turf/center'
import { featureCollection } from '@turf/helpers'
import { findLast, uniqBy } from 'lodash'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Animated, StyleSheet } from 'react-native'
// import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import {
  AbsoluteVStack,
  HStack,
  LinearGradient,
  VStack,
  useDebounceValue,
  useGet,
  useMedia,
  useTheme,
  useThemeName,
} from 'snackui'

import { isWeb, pageWidthMax, searchBarHeight, zIndexMap } from '../constants/constants'
import {
  getDefaultLocation,
  initialLocation,
  setDefaultLocation,
} from '../constants/initialHomeState'
import { isTouchDevice, supportsTouchWeb } from '../constants/platforms'
import { getWindowHeight } from '../helpers/getWindow'
import {
  MapZoomLevel,
  bboxToLngLat,
  coordsToLngLat,
  getMaxLngLat,
  getMinLngLat,
  getZoomLevel,
  hasMovedAtLeast,
  padLngLat,
} from '../helpers/mapHelpers'
import { reverseGeocode } from '../helpers/reverseGeocode'
import { queryRestaurant } from '../queries/queryRestaurant'
import { router } from '../router'
import { MapRegionEvent } from '../types/homeTypes'
import { AppMapPosition, MapResultItem } from '../types/mapTypes'
import { AppAutocompleteLocation } from './AppAutocompleteLocation'
import { AppMapControls } from './AppMapControls'
import { drawerStore } from './drawerStore'
import { ensureFlexText } from './home/restaurant/ensureFlexText'
import { homeStore } from './homeStore'
import { useLastValueWhen } from './hooks/useLastValueWhen'
import { useMapSize } from './hooks/useMapSize'
import { mapStyles } from './mapStyles'

const useIsInteractive = () => {
  if (!isWeb || isSafari) {
    return true
  }
  const [val, setVal] = useState(false)
  useEffect(() => {
    if (!val) {
      let setOnce = false
      const setTrueOnce = () => {
        if (setOnce) return
        setOnce = true
        setVal(true)
      }
      // prettier-ignore
      const events = ['resize', 'mousemove', 'touchstart', 'scroll', 'click', 'focus', 'keydown']
      // maximum 10 seconds
      const tm = setTimeout(setTrueOnce, process.env.NODE_ENV === 'development' ? 0 : 15_000)
      for (const evt of events) {
        window.addEventListener(evt, setTrueOnce, true)
      }
      return () => {
        clearTimeout(tm)
        for (const evt of events) {
          window.removeEventListener(evt, setTrueOnce, true)
        }
      }
    }
  }, [val])
  return val
}

export default memo(function AppMap() {
  // lighthouse/slow browser optimization
  const isFullyIdle = useIsInteractive()
  const media = useMedia()
  const drawerHeight = useStoreInstanceSelector(drawerStore, (x) => x.heightIgnoringFullyOpen)
  const y0 = media.sm
    ? (() => {
        const distanceFromCenter = getWindowHeight() - drawerStore.snapHeights[1] - drawerHeight
        return Math.round(Math.min(0, -drawerHeight / 1.8 + distanceFromCenter / 4))
      })()
    : 0

  const y = useDebounceValue(y0, 150)
  const [translateY] = useState(() => new Animated.Value(y))
  // const offset = useSharedValue(y)
  // const animatedStyles = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ translateY: offset.value }],
  //   }
  // }, [])

  useEffect(() => {
    Animated.spring(translateY, {
      useNativeDriver: !isWeb,
      toValue: y,
    }).start()
  }, [y])

  if (!isFullyIdle) {
    return null
  }

  return (
    <>
      {media.sm && <AppMapControls />}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <AppMapContents />
      </Animated.View>
    </>
  )
})

const AppMapContents = memo(function AppMapContents() {
  const appMapStore = useAppMapStore()
  const { features, results, showRank, region, hovered, zoomOnHover } = appMapStore
  const isOnHome = useStoreInstanceSelector(homeStore, (x) => x.currentStateType === 'home')
  const hideRegions = !isOnHome || appMapStore.hideRegions
  const media = useMedia()
  const mapSize = useMapSize(media.sm)
  const { width, paddingLeft } = useDebounceValue(mapSize, 1000)
  const showUserLocation = useStoreInstanceSelector(appMapStore, (x) => !!x.userLocation)
  const appMap = useStoreInstance(appMapStore)
  const show = true //useAppShouldShow('map')
  const position = appMap.currentPosition
  const { center, span } = position

  // HOVERED
  useEffect(() => {
    if (!hovered || !zoomOnHover) return
    if (hovered.via !== 'list') return
    return series([
      () => resolved(() => queryRestaurant(hovered.slug)[0]?.location),
      (location) => {
        if (!location) return
        appMapStore.setPosition({
          via: 'hover',
          center: coordsToLngLat(location.coordinates),
          span: getMinLngLat(span, { lng: 0.02, lat: 0.02 }),
        })
      },
    ])
  }, [hovered, zoomOnHover])

  // gather restaruants
  const isLoading = !results.length
  const key = useLastValueWhen(
    () =>
      `${position.id ?? ''}${JSON.stringify(results.map((x) => x.location?.coordinates ?? '-'))}`,
    isLoading
  )

  // sync down location from above state
  const restaurantSelected = useMemo(
    () => (position.id ? results.find((x) => x.id === position.id) : null),
    [key]
  )

  // CENTER (restauarantSelected.location)
  useEffect(() => {
    const coords = restaurantSelected?.location.coordinates
    if (!coords) return
    const center = coordsToLngLat(coords)
    appMapStore.setPosition({
      center,
      via: 'click',
    })
  }, [restaurantSelected])

  const padding = useMemo(() => {
    const verticalPad = Math.round(Math.max(50, Math.min(130, getWindowHeight() * 0.333)))
    return media.sm
      ? {
          left: 10,
          top: verticalPad,
          bottom: verticalPad,
          right: 10,
        }
      : {
          left: paddingLeft,
          top: searchBarHeight + 20,
          bottom: 10,
          right: 10,
        }
  }, [media.sm, paddingLeft])

  const handleMoveEnd = useCallback(
    ({ center, span }) => {
      if (drawerStore.snapIndex === 0) {
        console.log('avoid map pos while fully open')
        return
      }
      appMapStore.setNextPosition({ center, span })
      // cancelUpdateRegion()
      if (media.sm && (drawerStore.isDragging || drawerStore.snapIndex === 0)) {
        console.log('avoid move stuff when snapped to top')
        return
      }
    },
    [media.sm]
  )

  const getResults = useGet(results)

  const handleDoubleClick = useCallback((id) => {
    cancelUpdateRegion()
    const restaurant = getResults()?.find((x) => x.id === id)
    if (restaurant) {
      router.navigate({
        replace: true,
        name: 'restaurant',
        params: {
          slug: restaurant.slug,
        },
      })
    }
  }, [])

  const handleHover = useCallback((id) => {
    if (id == null) {
      appMapStore.setHovered(null)
      return
    }
    const restaurants = getResults()
    if (!appMapStore.hovered || id !== appMapStore.hovered.id) {
      const restaurant = restaurants?.find((x) => x.id === id)
      if (restaurant) {
        appMapStore.setHovered({
          id: restaurant.id,
          slug: restaurant.slug ?? '',
          via: 'map',
        })
      } else {
        console.warn('not found?', restaurants, id)
      }
    }
  }, [])

  const handleSelect = useCallback((id: string) => {
    cancelUpdateRegion()
    const restaurants = getResults()
    const restaurant = restaurants?.find((x) => x.id === id)
    if (!restaurant) {
      console.warn('not found', id, restaurants)
      return
    }
    // move drawer from bottom up to mid
    if (drawerStore.snapIndex === 2) {
      drawerStore.setSnapIndex(1)
    }
    if (homeStore.currentStateType === 'search') {
      if (id !== appMapStore.selected?.id) {
        appMapStore.setSelected({
          id: restaurant.id,
          slug: restaurant.slug ?? '',
        })
      }
    }
    const route = {
      name: 'restaurant',
      params: {
        slug: restaurant.slug,
      },
    } as const

    if (router.getIsRouteActive(route)) {
      if (media.sm) {
        drawerStore.setSnapIndex(0)
      }
    } else {
      router.navigate(route)
    }
  }, [])

  const handleSelectRegion = useCallback((region: MapRegionEvent | null) => {
    if (!region) return
    if (!region.slug) {
      console.log('no region slug', region)
      return
    }
    if (region.via === 'drag' && homeStore.currentStateType === 'search') {
      // ignore region drag during search to be less aggressive
      return
    }
    appMapStore.regionSlugToTileId[region.slug] = region.id
    if (region.via === 'click') {
      // avoid handleMoveStart being called next frame
      updateRegionFaster(region)
    } else {
      updateRegion(region)
    }
  }, [])

  const themeName = useThemeName()
  const tileId = region ? appMapStore.regionSlugToTileId[region] : null

  if (!show) {
    return null
  }

  return (
    <HStack
      position="absolute"
      fullscreen
      maxHeight="100%"
      alignItems="flex-end"
      justifyContent="flex-end"
      maxWidth={pageWidthMax}
    >
      <VStack display={media.sm ? 'none' : 'flex'} height="100%" flex={2}>
        {ensureFlexText}
      </VStack>
      <VStack
        position="relative"
        pointerEvents="auto"
        contain="strict"
        zIndex={zIndexMap}
        maxHeight="100%"
        height="100%"
        width={width}
        maxWidth="100%"
        borderTopRightRadius={12}
        borderBottomRightRadius={12}
        overflow="hidden"
        {...(isTouchDevice && {
          onTouchMove: () => {
            if (!isWeb || supportsTouchWeb) {
              if (drawerStore.snapIndex !== 2) {
                drawerStore.setSnapIndex(2)
              }
            }
          },
        })}
      >
        {!media.sm && (
          <>
            <AppAutocompleteLocation />
            <AppMapControls />
          </>
        )}
        {media.sm && <AppMapBottomFade />}
        <Map
          center={center}
          span={span}
          style={mapStyles[themeName]}
          padding={padding}
          features={features}
          selected={position.id}
          hovered={appMapStore.hovered?.id}
          showUserLocation={showUserLocation}
          // onMoveStart={handleMoveStart}
          tileId={tileId}
          onMoveEnd={handleMoveEnd}
          onDoubleClick={handleDoubleClick}
          onHover={handleHover}
          onSelect={handleSelect}
          onSelectRegion={handleSelectRegion}
          showRank={showRank}
          hideRegions={hideRegions}
        />
      </VStack>
    </HStack>
  )
})

const AppMapBottomFade = memo(() => {
  const media = useMedia()
  const theme = useTheme()
  return (
    <AbsoluteVStack
      zIndex={100}
      pointerEvents="none"
      bottom={0}
      left={0}
      right={0}
      height={media.sm ? 250 : 100}
    >
      <LinearGradient
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        colors={[`${theme.mapBackground}00`, theme.mapBackground]}
      />
    </AbsoluteVStack>
  )
})

const Map =
  process.env.TARGET === 'native' || process.env.TARGET === 'ssr'
    ? require('./Map').default
    : loadable(() => import('./Map'))

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
  regionSlugToTileId: { [key: string]: string } = {}
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
  curRegion: null | MapRegionEvent = null
  region: null | string = null

  setState(
    val: MapOpts & {
      results?: MapResultItem[] | null
      features?: GeoJSON.Feature[]
      region?: string | null
    }
  ) {
    this.setSelected(null)
    this.setHovered(null)
    this.results = val.results ?? []
    this.features = val.features ?? []
    this.showRank = val.showRank || false
    this.zoomOnHover = val.zoomOnHover || false
    this.hideRegions = val.hideRegions || false
    this.region = val.region || null
  }

  setPositionToNextPosition() {
    this.position = this.nextPosition
  }

  // only use this directly if you *dont* want to preserve the map position in history
  // if you want it in history, see homeStore.updateCurrentState('', { center, span })
  // TODO should make this private and have a scarier function exported just for this
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

  setCurRegion(next: MapRegionEvent | null) {
    this.curRegion = next
  }

  get isOnRegion() {
    return !!this.curRegion && !hasMovedAtLeast(this.curRegion, this.position, 0.04)
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
      this.setNextPosition(beforeHover)
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

export function updateRegionImmediate(region: MapRegionEvent) {
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

export const updateRegion = updateRegionImmediate // debounce(updateRegionImmediate, 340)
export const updateRegionFaster = updateRegionImmediate // debounce(updateRegionImmediate, 300)

export const cancelUpdateRegion = () => {
  // only for non-concurrent mode
  // updateRegion.cancel()
  // updateRegionFaster.cancel()
}

export type UseSetAppMapProps = MapOpts & {
  id: string // eq homeStore.states[].id
  center?: MapPosition['center'] | null
  span?: MapPosition['span'] | null
  results?: RestaurantOnlyIdsPartial[]
  isActive: boolean
  region?: string | null
}

export const useSetAppMap = (props: UseSetAppMapProps) => {
  const {
    id,
    results,
    showRank,
    isActive,
    zoomOnHover,
    center,
    span,
    fitToResults = false,
    hideRegions,
    region,
  } = props

  const setToPosition = (position: Partial<AppMapPosition>) => {
    homeStore.updateHomeState('useSetAppMap.position', {
      id,
      position,
    })
    appMapStore.setPosition(position)
  }

  useEffect(() => {
    if (!isActive) return
    if (!center || !span) return
    if (fitToResults) return
    setToPosition({ center, span, via: 'useSetAppMap' })
  }, [fitToResults, isActive, center?.lat, center?.lng, span?.lat, span?.lng])

  useEffect(() => {
    if (!isActive) return

    const disposeSeries = series([
      () => {
        // set first to more quickly update non-feature based settings
        appMapStore.setState({
          showRank,
          zoomOnHover,
          hideRegions,
          region,
        })
        // fetch map items after page may be fetched so we may get cache hits
        return sleep(100)
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
        const state = {
          results,
          showRank,
          zoomOnHover,
          hideRegions,
          region,
          features,
        }

        appMapStore.setState(state)

        if (fitToResults && features.length) {
          const collection = featureCollection(features)
          const resultsBbox = bbox(collection)
          if (resultsBbox) {
            const centerCoord = getCenter(collection as any)
            const span = getMaxLngLat(padLngLat(bboxToLngLat(resultsBbox), 3), {
              // dont zoom too much in
              lng: 0.005,
              lat: 0.005,
            })
            const center = {
              lng: centerCoord.geometry.coordinates[0],
              lat: centerCoord.geometry.coordinates[1],
            }
            const position = {
              center,
              span,
            }
            setToPosition({
              via: 'results',
              ...position,
            })
          }
        }
      },
    ])

    return () => {
      disposeSeries()
      // appMapStore.setState({
      //   zoomOnHover: false,
      //   showRank: false,
      //   features: [],
      // })
    }
  }, [JSON.stringify(results), fitToResults, isActive, zoomOnHover, hideRegions, region, showRank])
}
