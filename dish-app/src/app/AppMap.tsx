import { isEqual } from '@dish/fast-compare'
import { reaction, useStoreInstance } from '@dish/use-store'
import { debounce } from 'lodash'
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import {
  HStack,
  VStack,
  useDebounceValue,
  useGet,
  useMedia,
  useTheme,
} from 'snackui'

import {
  pageWidthMax,
  searchBarHeight,
  zIndexMap,
} from '../constants/constants'
import { getLngLat } from '../helpers/getLngLat'
import { getWindowHeight } from '../helpers/getWindow'
import { router } from '../router'
import { Region } from '../types/homeTypes'
import { AppMapControls } from './AppMapControls'
import { MapResultItem, appMapStore, useAppMapStore } from './AppMapStore'
import { drawerStore } from './drawerStore'
import { ensureFlexText } from './home/restaurant/ensureFlexText'
import { homeStore } from './homeStore'
import { useLastValueWhen } from './hooks/useLastValueWhen'
import { useMapSize } from './hooks/useMapSize'
import { MapView } from './views/Map'

const styles = {
  light: 'mapbox://styles/nwienert/ckddrrcg14e4y1ipj0l4kf1xy',
  dark: 'mapbox://styles/nwienert/ck68dg2go01jb1it5j2xfsaja',
}

export default memo(function AppMap() {
  const { results } = useAppMapStore()
  return <AppMapContent results={results} />
})

const updateRegion = debounce((region: Region) => {
  const { currentState } = homeStore
  const type = currentState.type
  if (type === 'home' || type === 'search') {
    homeStore.navigate({
      state: {
        ...currentState,
        region: region.slug,
      },
    })
  }
}, 150)

const AppMapContent = memo(({ results }: { results: MapResultItem[] }) => {
  const media = useMedia()
  const { width, paddingLeft } = useMapSize(media.sm)
  const { position } = useStoreInstance(appMapStore)
  const { center, span } = position

  // SELECTED
  // useEffect(() => {
  //   return om.reaction(
  //     (state) => state.home.selectedRestaurant?.id,
  //     (selectedId) => {
  //       const nextSpan = getZoomedSpan(span, 0.025)
  //       setState({
  //         id: selectedId,
  //         via: 'select',
  //         span: nextSpan,
  //       })
  //     }
  //   )
  // }, [])

  // HOVERED
  // TODO make it zoom just icon
  // const hoveredId =
  //   om.state.home.hoveredRestaurant && om.state.home.hoveredRestaurant.id
  // useEffect(() => {
  //   if (!hoveredId) return
  //   setState({
  //     id: hoveredId,
  //     via: 'hover',
  //     span: getMinLngLat(state.span, 0.02),
  //   })
  // }, [hoveredId])

  // DETAIL
  // const detailId = restaurantDetail?.id
  // useEffect(() => {
  //   if (!detailId) return
  //   if (state.type !== 'restaurant') return
  //   console.log('the detail is.....', detailId)
  //   setState({
  //     id: detailId,
  //     via: 'detail',
  //     span: getZoomedSpan(state.span, 0.0025),
  //   })
  // }, [detailId])

  // gather restaruants
  const isLoading = results[0]?.location?.coordinates[0] === null
  const key = useLastValueWhen(
    () =>
      `${position.id ?? ''}${JSON.stringify(
        results.map((x) => x.location?.coordinates ?? '-')
      )}`,
    isLoading || !results.length
  )

  // sync down location from above state
  const restaurantSelected = useMemo(
    () => (position.id ? results.find((x) => x.id === position.id) : null),
    [key]
  )

  useEffect(() => {
    return reaction(
      homeStore,
      () => {
        const stateId = homeStore.currentState.id
        const state = homeStore.allStates[stateId]
        const span = state.span
        const center = state.center
        // stringify to prevent extra reactions
        return { span, center }
      },
      ({ span, center }) => {
        updateRegion.cancel()
        appMapStore.setPosition('homeState.currentState', {
          span,
          center,
        })
      },
      isEqual
    )
  }, [])

  // CENTER (restauarantSelected.location)
  useEffect(() => {
    const coords = restaurantSelected?.location.coordinates
    if (!coords) return
    const center = getLngLat(coords)
    appMapStore.setPosition('restaurantSelected', {
      center,
    })
  }, [restaurantSelected])

  const drawer = useStoreInstance(drawerStore)
  // ensure never goes to 0
  const delayedIndex = useDebounceValue(drawer.snapIndex, 250)
  const currentSnapIndex = Math.max(1, delayedIndex)
  const currentSnapPoint = drawer.snapPoints[currentSnapIndex]
  const padding = useMemo(() => {
    return media.sm
      ? {
          left: 10,
          top: 10,
          bottom: getWindowHeight() - getWindowHeight() * currentSnapPoint + 10,
          right: 10,
        }
      : {
          left: paddingLeft,
          top: searchBarHeight + 20,
          bottom: 10,
          right: 10,
        }
  }, [media.sm, paddingLeft, currentSnapPoint])

  const features = useMemo(() => {
    return getMapFeatures(results, position.id)
  }, [key])

  const handleMoveEnd = useCallback(
    ({ center, span }) => {
      if (media.sm && (drawerStore.isDragging || drawerStore.snapIndex === 0)) {
        console.log('avoid move stuff when snapped to top')
        return
      }
      // if (om.state.home.centerToResults) {
      //   // we just re-centered, ignore
      //   //@ts-expect-error
      //   om.actions.home.setCenterToResults(0)
      // }
      console.log('should set position on map?')
      // appMapStore.setPosition('moveEnd', {
      //   center,
      //   span,
      // })
    },
    [media.sm]
  )

  const getResults = useGet(results)

  const handleDoubleClick = useCallback((id) => {
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
      }

      if (router.getIsRouteActive(route)) {
        if (media.sm) {
          drawerStore.setSnapPoint(0)
        }
      } else {
        router.navigate(route)
      }
    }
  }, [])

  const handleSelectRegion = useCallback((region: Region | null) => {
    console.log('handleSelectRegion', region)
    if (!region) return
    if (!region.slug) {
      console.log('no region slug', region)
      return
    }
    updateRegion.cancel()
    updateRegion(region)
  }, [])

  const theme = useTheme()
  const themeName = theme.backgroundColor === '#fff' ? 'light' : 'dark'

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
            // centerToResults={om.state.home.centerToResults}
            selected={position.id}
            hovered={appMapStore.hovered?.id}
            onMoveEnd={handleMoveEnd}
            onDoubleClick={handleDoubleClick}
            onHover={handleHover}
            onSelect={handleSelect}
            onSelectRegion={handleSelectRegion}
          />
        </VStack>
      </HStack>
    </HStack>
  )
})

let ids = {}
const getNumId = (id: string): number => {
  ids[id] = ids[id] ?? Math.round(Math.random() * 10000000000)
  return ids[id]
}

const getMapFeatures = (
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
      id: getNumId(restaurant.id),
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
