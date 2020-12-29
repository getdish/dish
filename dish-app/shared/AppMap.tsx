import { Restaurant, RestaurantOnlyIds, graphql } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { useStoreInstance } from '@dish/use-store'
import { debounce, uniqBy } from 'lodash'
import React, {
  Suspense,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  HStack,
  VStack,
  useDebounce,
  useDebounceValue,
  useGet,
  useMedia,
  useTheme,
} from 'snackui'

import { AppMapControls } from './AppMapControls'
import { appMapStore } from './AppMapStore'
import { drawerStore } from './DrawerStore'
import { pageWidthMax, searchBarHeight, zIndexMap } from './constants/constants'
import { getLngLat } from './helpers/getLngLat'
import { getRestaurantRating } from './helpers/getRestaurantRating'
import { getWindowHeight } from './helpers/getWindow'
import { useLastValueWhen } from './hooks/useLastValueWhen'
import { useMapSize } from './hooks/useMapSize'
import { useRestaurantQuery } from './hooks/useRestaurantQuery'
import { ensureFlexText } from './home/restaurant/ensureFlexText'
import { findLastHomeOrSearch } from './state/home'
import { isRestaurantState } from './state/home-helpers'
import { Region } from './state/home-types'
import { omStatic } from './state/omStatic'
import { router } from './state/router'
import { useOvermind } from './state/useOvermind'
import { MapView } from './views/Map'

const styles = {
  light: 'mapbox://styles/nwienert/ckddrrcg14e4y1ipj0l4kf1xy',
  dark: 'mapbox://styles/nwienert/ck68dg2go01jb1it5j2xfsaja',
}

export default memo(function AppMap() {
  const [restaurants, setRestaurantsFast] = useState<Restaurant[]>([])
  const [
    restaurantDetail,
    setRestaurantDetailFast,
  ] = useState<Restaurant | null>(null)
  const setRestaurants = useDebounce(setRestaurantsFast, 150)
  const setRestaurantDetail = useDebounce(setRestaurantDetailFast, 150)

  console.log('🗺.render', { restaurants, restaurantDetail })

  return (
    <>
      <Suspense fallback={null}>
        <AppMapDataLoader
          onLoadedRestaurants={setRestaurants}
          onLoadedRestaurantDetail={setRestaurantDetail}
        />
      </Suspense>
      <AppMapContent
        restaurantDetail={restaurantDetail}
        restaurants={restaurants}
      />
    </>
  )
})

const AppMapDataLoader = memo(
  graphql(function AppMapDataLoader(props: {
    onLoadedRestaurantDetail: Function
    onLoadedRestaurants: Function
  }) {
    const om = useOvermind()
    const state = om.state.home.currentState
    let all: RestaurantOnlyIds[] = []
    let single: RestaurantOnlyIds | null = null

    if (isRestaurantState(state)) {
      const restaurant = useRestaurantQuery(state.restaurantSlug)
      single = {
        id: restaurant.id ?? '',
        slug: state.restaurantSlug ?? '',
      }
      const last = findLastHomeOrSearch(omStatic.state.home.states)
      all = [single, ...(last?.['results'] ?? [])]
    } else if ('results' in state) {
      all = state?.results ?? []
    }

    all = all.filter(isPresent)

    const allIds = [...new Set(all.map((x) => x.id))]
    const allResults = allIds
      .map((id) => all.find((x) => x.id === id))
      .filter(isPresent)

    const restaurants = uniqBy(
      allResults
        .map(({ id, slug }) => {
          if (!slug) {
            return null
          }
          const r = useRestaurantQuery(slug)
          if (!r) {
            return null
          }
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

    useEffect(() => {
      props.onLoadedRestaurants?.(restaurants)
    }, [JSON.stringify(restaurants.map((x) => x.location?.coordinates))])

    const restaurantDetail = single
      ? restaurants.find((x) => x.id === single!.id)
      : null

    useEffect(() => {
      props.onLoadedRestaurantDetail?.(restaurantDetail)
    }, [JSON.stringify(restaurantDetail?.location?.coordinates ?? null)])

    return null
  })
)

const updateRegion = debounce((region: Region) => {
  const { currentState } = omStatic.state.home
  const type = currentState.type
  if (type === 'home' || type === 'search') {
    omStatic.actions.home.navigate({
      state: {
        ...currentState,
        region: region.slug,
      },
    })
  }
}, 150)

const AppMapContent = memo(
  ({
    restaurants,
    restaurantDetail,
  }: {
    restaurantDetail: Restaurant | null
    restaurants: Restaurant[]
  }) => {
    const om = useOvermind()
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
    const isLoading = restaurants[0]?.location?.coordinates[0] === null
    const key = useLastValueWhen(
      () =>
        `${position.id ?? ''}${
          restaurantDetail?.location.coordinates ?? ''
        }${JSON.stringify(
          restaurants.map((x) => x.location?.coordinates ?? '-')
        )}`,
      isLoading || (!restaurants.length && !restaurantDetail)
    )

    // sync down location from above state
    // gqless hack - touch the prop before memo
    restaurants[0]?.id
    const restaurantSelected = useMemo(
      () =>
        position.id ? restaurants.find((x) => x.id === position.id) : null,
      [key]
    )

    useEffect(() => {
      return om.reaction(
        (omState) => {
          const stateId = omState.home.currentState.id
          const state = omState.home.allStates[stateId]
          const span = state.span
          const center = state.center
          // stringify to prevent extra reactions
          return JSON.stringify({ span, center })
        },
        (spanCenter) => {
          const { span, center } = JSON.parse(spanCenter)
          console.log('🗺 position', { center, span })
          updateRegion.cancel()
          appMapStore.setPosition({
            span,
            center,
          })
        }
      )
    }, [])

    // CENTER (restauarantSelected.location)
    useEffect(() => {
      if (!restaurantSelected) {
        return
      }
      const coords = restaurantSelected.location.coordinates
      if (!coords) return
      const center = getLngLat(coords)
      appMapStore.setPosition({
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
            bottom:
              getWindowHeight() - getWindowHeight() * currentSnapPoint + 10,
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
      return getRestaurantMarkers(
        restaurants,
        position.id ?? restaurantDetail?.id
      )
    }, [key])

    const handleMoveEnd = useCallback(
      ({ center, span }) => {
        updateRegion.cancel()
        if (
          media.sm &&
          (drawerStore.isDragging || drawerStore.snapIndex === 0)
        ) {
          console.log('avoid move stuff when snapped to top')
          return
        }
        // if (omStatic.state.home.centerToResults) {
        //   // we just re-centered, ignore
        //   //@ts-expect-error
        //   om.actions.home.setCenterToResults(0)
        // }
        appMapStore.setPosition({
          center,
          span,
        })
      },
      [media.sm]
    )

    const getRestaurants = useGet(restaurants)

    const handleDoubleClick = useCallback((id) => {
      const restaurant = getRestaurants()?.find((x) => x.id === id)
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
      const restaurants = getRestaurants()
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
      const restaurants = getRestaurants()
      const restaurant = restaurants?.find((x) => x.id === id)
      if (!restaurant) {
        console.warn('not found', id)
        return
      }
      if (omStatic.state.home.currentStateType === 'search') {
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
  }
)

let ids = {}
const getNumId = (id: string): number => {
  ids[id] = ids[id] ?? Math.round(Math.random() * 10000000000)
  return ids[id]
}

const getRestaurantMarkers = (
  restaurants: Restaurant[] | null,
  selectedId?: string | null
) => {
  const result: GeoJSON.Feature[] = []
  if (!restaurants) {
    return result
  }
  for (const restaurant of restaurants) {
    if (!restaurant?.location?.coordinates) {
      continue
    }
    const percent = getRestaurantRating(restaurant.rating)
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
