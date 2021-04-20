import { MapPosition } from '@dish/graph'
import { useStoreInstance } from '@dish/use-store'
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import {
  AbsoluteVStack,
  HStack,
  Theme,
  VStack,
  useDebounceValue,
  useGet,
  useMedia,
  useThemeName,
} from 'snackui'

import { pageWidthMax, searchBarHeight, zIndexMap } from '../constants/constants'
import { coordsToLngLat } from '../helpers/mapHelpers'
import { router } from '../router'
import { RegionWithVia } from '../types/homeTypes'
import { AppAutocompleteLocation } from './AppAutocompleteLocation'
import { AppMapControls } from './AppMapControls'
import {
  appMapStore,
  cancelUpdateRegion,
  updateRegion,
  updateRegionFaster,
  useAppMapStore,
} from './AppMapStore'
import { drawerStore } from './drawerStore'
import { ensureFlexText } from './home/restaurant/ensureFlexText'
import { homeStore } from './homeStore'
import { useLastValueWhen } from './hooks/useLastValueWhen'
import { useMapSize } from './hooks/useMapSize'
import { MapView } from './Map'
import { mapStyles } from './mapStyles'

export default memo(function AppMap() {
  const { features, results, showRank, zoomOnHover, hovered, hideRegions } = useAppMapStore()
  const media = useMedia()
  const mapSize = useMapSize(media.sm)
  const { width, paddingLeft } = useDebounceValue(mapSize, 1000)
  const store = useStoreInstance(appMapStore)
  const position = store.currentPosition
  const { center, span } = position

  // HOVERED
  // useEffect(() => {
  //   if (!hovered || !zoomOnHover) return
  //   if (hovered.via !== 'list') return
  //   return series([
  //     () => resolved(() => queryRestaurant(hovered.slug)[0]?.location),
  //     (location) => {
  //       if (!location) return
  //       appMapStore.setPosition({
  //         via: 'hover',
  //         center: coordsToLngLat(location.coordinates),
  //         span: getMinLngLat(span, { lng: 0.1, lat: 0.1 }),
  //       })
  //     },
  //   ])
  // }, [hovered, zoomOnHover])

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

  const drawer = useStoreInstance(drawerStore)
  // ensure never goes to 0
  const bottomOcclude = drawer.bottomOccludedIgnoreFullyClosed + 10
  const padding = useMemo(() => {
    return media.sm
      ? {
          left: 10,
          top: 10,
          bottom: bottomOcclude,
          right: 10,
        }
      : {
          left: paddingLeft,
          top: searchBarHeight + 20,
          bottom: 10,
          right: 10,
        }
  }, [media.sm, paddingLeft, bottomOcclude])

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

  const handleSelectRegion = useCallback((region: RegionWithVia | null) => {
    if (!region) return
    if (!region.slug) {
      console.log('no region slug', region)
      return
    }
    if (region.via === 'drag' && homeStore.currentStateType === 'search') {
      // ignore region drag during search to be less aggressive
      return
    }
    if (region.via === 'click') {
      // avoid handleMoveStart being called next frame
      updateRegionFaster(region)
    } else {
      updateRegion(region)
    }
  }, [])

  const themeName = useThemeName()
  const handleMoveStart = useCallback(() => {
    cancelUpdateRegion()
  }, [])

  return (
    <HStack position="absolute" fullscreen alignItems="center" justifyContent="center">
      <HStack height="100%" maxWidth={pageWidthMax} width="100%">
        {!media.sm && (
          <VStack height="100%" flex={2}>
            {ensureFlexText}
          </VStack>
        )}
        <VStack
          pointerEvents="auto"
          contain="strict"
          zIndex={zIndexMap}
          maxHeight="100%"
          width={width}
          borderTopRightRadius={12}
          borderBottomRightRadius={12}
          overflow="hidden"
        >
          {!media.sm && (
            <Theme name="dark">
              <AbsoluteVStack
                zIndex={1000000000}
                pointerEvents="none"
                left={0}
                right={0}
                bottom={0}
                top={searchBarHeight}
              >
                <AppAutocompleteLocation />
              </AbsoluteVStack>
            </Theme>
          )}
          <AppMapControls />
          <MapView
            center={center}
            span={span}
            style={mapStyles[themeName]}
            padding={padding}
            features={features}
            selected={position.id}
            hovered={appMapStore.hovered?.id}
            onMoveStart={handleMoveStart}
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
    </HStack>
  )
})
