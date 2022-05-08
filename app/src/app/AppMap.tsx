import { isWeb, pageWidthMax, searchBarHeight, zIndexMap } from '../constants/constants'
import { isTouchDevice, supportsTouchWeb } from '../constants/platforms'
import { getWindowHeight } from '../helpers/getWindow'
import { coordsToLngLat, getMinLngLat } from '../helpers/mapHelpers'
import { queryRestaurant } from '../queries/queryRestaurant'
import { router } from '../router'
import { MapRegionEvent } from '../types/homeTypes'
import { AppMapControls } from './AppMapControls'
import { cancelUpdateRegion, updateRegion, updateRegionFaster, useAppMapStore } from './appMapStore'
import { drawerStore } from './drawerStore'
import { AppFloatingTagMenuBar } from './home/AppFloatingTagMenuBar'
import { ensureFlexText } from './home/restaurant/ensureFlexText'
import { homeStore } from './homeStore'
import { useAppDrawerWidth } from './hooks/useAppDrawerWidth'
import { useLastValueWhen } from './hooks/useLastValueWhen'
import { useMapSize } from './hooks/useMapSize'
import { mapStyles } from './mapStyles'
import { useIsInteractive } from './useIsInteractive'
import { useIsMobilePhone } from './useIsMobilePhone'
import { series } from '@dish/async'
import { resolved } from '@dish/graph'
// import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import {
  AbsoluteYStack,
  LinearGradient,
  XStack,
  YStack,
  useDebounceValue,
  useGet,
  useMedia,
  useTheme,
  useThemeName,
} from '@dish/ui'
import { useStoreInstance, useStoreInstanceSelector } from '@dish/use-store'
import loadable from '@loadable/component'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'

export default memo(function AppMap() {
  // lighthouse/slow browser optimization
  const isFullyIdle = useIsInteractive()
  const media = useMedia()
  // const drawerHeight = useStoreInstanceSelector(drawerStore, (x) => x.heightIgnoringFullyOpen)
  // const y0 = media.sm
  //   ? (() => {
  //       const distanceFromCenter = getWindowHeight() - drawerStore.snapHeights[1] - drawerHeight
  //       return Math.round(Math.min(0, -drawerHeight / 1.8 + distanceFromCenter / 4))
  //     })()
  //   : 0

  // const y = useDebounceValue(y0, 150)
  // const [translateY] = useState(() => new Animated.Value(y))
  // const offset = useSharedValue(y)
  // const animatedStyles = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ translateY: offset.value }],
  //   }
  // }, [])

  // useEffect(() => {
  //   Animated.spring(translateY, {
  //     useNativeDriver: !isWeb,
  //     toValue: y,
  //   }).start()
  // }, [y])

  if (!isFullyIdle) {
    return null
  }

  return (
    <>
      {media.sm && <AppMapControls />}
      {/* this is breaking suddenly but not anything to do with tamagui */}
      {/* the position relative from .css-view is overriding the atomic position absolute */}
      {/* <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateY }],
          },
        ]}
      > */}
      <AppMapContents />
      {/* </Animated.View> */}
    </>
  )
})

export const AppMapContents = memo(function AppMapContents() {
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
    <XStack
      pos="absolute"
      fullscreen
      maxHeight="100%"
      alignItems="flex-end"
      justifyContent="flex-end"
      maxWidth={pageWidthMax}
      margin="auto"
    >
      {/* <MapFlexItem /> */}
      <YStack
        pos="relative"
        pe="auto"
        contain="strict"
        zIndex={zIndexMap}
        maxHeight="100%"
        height="100%"
        width="100%"
        maxWidth="100%"
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
            <XStack height={80} x="$4" width={width} top={0} right={0} zi={100000} pos="absolute">
              <AppFloatingTagMenuBar />
            </XStack>
            <XStack zi="$2" pos="absolute" height={90} width={width} right={0} bottom={0}>
              <AppMapControls />
            </XStack>
          </>
        )}
        {media.sm && <AppMapBottomFade />}
        {!media.sm && <AppMapRightFade />}
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
      </YStack>
    </XStack>
  )
})

const AppMapBottomFade = memo(() => {
  const theme = useTheme()
  const isPhone = useIsMobilePhone()

  if (isPhone) {
    return null
  }

  return (
    <AbsoluteYStack zIndex={100} pointerEvents="none" bottom={0} left={0} right={0}>
      {/* <LinearGradient
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        colors={[`${theme.background}00`, theme.background.toString()]}
      /> */}
    </AbsoluteYStack>
  )
})

const AppMapRightFade = memo(() => {
  const theme = useTheme()
  const isPhone = useIsMobilePhone()

  if (isPhone) {
    return null
  }

  return (
    <AbsoluteYStack zIndex={300} pointerEvents="none" bottom={0} top={0} right={0} width={100}>
      <LinearGradient
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        start={[0, 0]}
        end={[1, 0]}
        colors={[`${theme.background}00`, theme.background.toString()]}
      />
    </AbsoluteYStack>
  )
})

const Map =
  process.env.TARGET === 'native' || process.env.TARGET === 'ssr'
    ? require('./Map').default
    : loadable(() => import('./Map'))
