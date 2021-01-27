import { series } from '@dish/async'
import { MapPosition, resolved } from '@dish/graph'
import { useStoreInstance } from '@dish/use-store'
import { debounce } from 'lodash'
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { HStack, VStack, useGet, useMedia, useTheme } from 'snackui'

import {
  pageWidthMax,
  searchBarHeight,
  zIndexMap,
} from '../constants/constants'
import { getLngLat, getMinLngLat } from '../helpers/getLngLat'
import { queryRestaurant } from '../queries/queryRestaurant'
import { router } from '../router'
import { Region } from '../types/homeTypes'
import { AppMapControls } from './AppMapControls'
import { appMapStore, useAppMapStore } from './AppMapStore'
import { drawerStore } from './drawerStore'
import { ensureFlexText } from './home/restaurant/ensureFlexText'
import { homeStore } from './homeStore'
import { useLastValueWhen } from './hooks/useLastValueWhen'
import { useMapSize } from './hooks/useMapSize'
import { MapView } from './Map'
import { RegionWithVia } from './MapProps'

const styles = {
  light: 'mapbox://styles/nwienert/ckddrrcg14e4y1ipj0l4kf1xy',
  // monochrome dark
  dark: 'mapbox://styles/nwienert/ckkapnkmz30vj17ktc1fxccrh',
  // dish dark
  //'mapbox://styles/nwienert/ck68dg2go01jb1it5j2xfsaja',
}

const updateRegion = debounce(
  (region: RegionWithVia, position: MapPosition) => {
    const { currentState } = homeStore
    console.log('got it', region)
    if (
      currentState.type === 'home' ||
      (currentState.type === 'search' && region.via === 'click')
    ) {
      if (currentState.region === region.slug) {
        return
      }
      homeStore.navigate({
        state: {
          ...currentState,
          ...position,
          region: region.slug,
        },
      })
    }
  },
  150
)

export default memo(function AppMap() {
  const { features, results, showRank, zoomOnHover, hovered } = useAppMapStore()
  const media = useMedia()
  const { width, paddingLeft } = useMapSize(media.sm)
  const { position } = useStoreInstance(appMapStore)
  const { center, span } = position

  // HOVERED
  useEffect(() => {
    if (!hovered || !zoomOnHover) return
    if (hovered.via !== 'list') return
    return series([
      () => resolved(() => queryRestaurant(hovered.slug)[0].location),
      (location) => {
        if (!location) return
        appMapStore.setPosition({
          via: 'hover',
          center: getLngLat(location.coordinates),
          span: getMinLngLat(span, 0.004, 0.004),
        })
      },
    ])
  }, [hovered, zoomOnHover])

  // gather restaruants
  const isLoading = !results.length
  const key = useLastValueWhen(
    () =>
      `${position.id ?? ''}${JSON.stringify(
        results.map((x) => x.location?.coordinates ?? '-')
      )}`,
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
    const center = getLngLat(coords)
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
      appMapStore.setNextPosition({ center, span })
      updateRegion.cancel()
      if (media.sm && (drawerStore.isDragging || drawerStore.snapIndex === 0)) {
        console.log('avoid move stuff when snapped to top')
        return
      }
    },
    [media.sm]
  )

  const getResults = useGet(results)

  const handleDoubleClick = useCallback((id) => {
    updateRegion.cancel()
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
    updateRegion.cancel()
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
    } else {
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
    }
  }, [])

  const handleSelectRegion = useCallback(
    (region: RegionWithVia | null, position) => {
      if (!region) return
      if (!region.slug) {
        console.log('no region slug', region)
        return
      }
      updateRegion.cancel()
      if (region.via === 'click') {
        // avoid handleMoveStart being called next frame
        setTimeout(() => {
          updateRegion(region, position)
        })
      } else {
        updateRegion(region, position)
      }
    },
    []
  )

  const theme = useTheme()
  const themeName = theme.backgroundColor === '#fff' ? 'light' : 'dark'

  const handleMoveStart = useCallback(() => {
    updateRegion.cancel()
  }, [])

  return (
    <HStack
      position="absolute"
      fullscreen
      alignItems="center"
      justifyContent="center"
    >
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
          <AppMapControls />
          <MapView
            center={center}
            style={styles[themeName]}
            span={span}
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
          />
        </VStack>
      </HStack>
    </HStack>
  )
})
