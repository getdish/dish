import { LngLat, Restaurant, RestaurantOnlyIds, graphql } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { Store, getStore, useStore } from '@dish/use-store'
import { debounce, isEqual, rest, uniqBy } from 'lodash'
import React, {
  Suspense,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  AbsoluteVStack,
  HStack,
  Text,
  VStack,
  useDebounce,
  useDebounceValue,
  useGet,
} from 'snackui'

import { BottomDrawerStore } from './BottomDrawerStore'
import { pageWidthMax, searchBarHeight, zIndexMap } from './constants'
import { getLngLat, getMinLngLat } from './helpers/getLngLat'
import { getRestaurantRating } from './helpers/getRestaurantRating'
import { getWindowHeight } from './helpers/getWindow'
import { getIs, useIsNarrow } from './hooks/useIs'
import { useLastValueWhen } from './hooks/useLastValueWhen'
import { useMapSize } from './hooks/useMapSize'
import { useRestaurantQuery } from './hooks/useRestaurantQuery'
import { sfRegion } from './sfRegion'
import { findLastHomeOrSearch } from './state/home'
import { isRestaurantState } from './state/home-helpers'
import { Region } from './state/home-types'
import { useOvermind } from './state/om'
import { omStatic } from './state/omStatic'
import { router } from './state/router'
import { MapView } from './views/Map'

export class AppMapStore extends Store {
  regions: { [slug: string]: Region | undefined } = {
    'san-francisco': sfRegion,
  }

  setRegion(slug: string, region: Region) {
    this.regions = {
      ...this.regions,
      [slug]: region,
    }
  }
}

export default memo(function AppMap() {
  const [restaurants, setRestaurantsFast] = useState<Restaurant[]>([])
  const [
    restaurantDetail,
    setRestaurantDetailFast,
  ] = useState<Restaurant | null>(null)
  const setRestaurants = useDebounce(setRestaurantsFast, 150)
  const setRestaurantDetail = useDebounce(setRestaurantDetailFast, 150)

  return (
    <>
      <Suspense fallback={null}>
        <AppMapDataLoader
          onLoadedRestaurants={setRestaurants}
          onLoadedRestaurantDetail={setRestaurantDetail}
        />
      </Suspense>
      <Suspense fallback={null}>
        <AppMapContent
          restaurantDetail={restaurantDetail}
          restaurants={restaurants}
        />
      </Suspense>
    </>
  )
})

const AppMapDataLoader = memo(
  graphql(
    (props: {
      onLoadedRestaurantDetail: Function
      onLoadedRestaurants: Function
    }) => {
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
    }
  )
)

const updateRegion = debounce((region: Region) => {
  const appMapStore = getStore(AppMapStore)
  appMapStore.setRegion(region.slug, region)
  console.warn('>>>> NEW REGION', region)
  router.navigate({
    replace: true,
    name: 'homeRegion',
    params: {
      region: region.slug,
    },
  })
}, 150)

const AppMapContent = memo(function AppMap({
  restaurants,
  restaurantDetail,
}: {
  restaurantDetail: Restaurant | null
  restaurants: Restaurant[]
}) {
  const om = useOvermind()
  const isSmall = useIsNarrow()
  const { width, paddingLeft } = useMapSize(isSmall)
  const [internal, setInternal] = useState(() => ({
    id: omStatic.state.home.selectedRestaurant?.id,
    span: omStatic.state.home.currentState.span,
    center: omStatic.state.home.currentState.center,
    via: 'select' as 'select' | 'hover' | 'detail',
  }))
  const setState = (next: Partial<typeof internal>) => {
    setInternal((prev) => {
      const fullNext = { ...prev, ...next }
      if (isEqual(fullNext, prev)) {
        return prev
      }
      return fullNext
    })
  }

  const getZoomedSpan = (span: LngLat, max: number) => {
    const curState = omStatic.state.home.currentState
    const curSpan = curState.mapAt?.span ?? curState.span
    const next = getMinLngLat(
      span,
      Math.min(max, curSpan.lng),
      Math.min(max, curSpan.lat)
    )
    return next
  }

  const { center, span } = internal

  // SELECTED
  useEffect(() => {
    return om.reaction(
      (state) => state.home.selectedRestaurant?.id,
      (selectedId) => {
        const nextSpan = getZoomedSpan(span, 0.025)
        setState({
          id: selectedId,
          via: 'select',
          span: nextSpan,
        })
      }
    )
  }, [])

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
      `${internal.id ?? ''}${
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
    () => (internal.id ? restaurants.find((x) => x.id === internal.id) : null),
    [key]
  )

  useEffect(() => {
    return om.reaction(
      (omState) => {
        const stateId = omState.home.currentState.id
        const state = omState.home.allStates[stateId]
        const span = state.mapAt?.span ?? state.span
        const center = state.mapAt?.center ?? state.center
        // stringify to prevent extra reactions
        return JSON.stringify({ span, center })
      },
      (spanCenter) => {
        const { span, center } = JSON.parse(spanCenter)
        console.log('got new map pos: center', center, 'span', span)
        setState({
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
    setState({
      center,
    })
  }, [restaurantSelected])

  const drawerStore = useStore(BottomDrawerStore)
  // ensure never goes to 0
  const delayedIndex = useDebounceValue(drawerStore.snapIndex, 250)
  const currentSnapIndex = Math.max(1, delayedIndex)
  const currentSnapPoint = drawerStore.snapPoints[currentSnapIndex]
  const padding = useMemo(() => {
    return isSmall
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
  }, [isSmall, paddingLeft, currentSnapPoint])

  const features = useMemo(() => {
    return getRestaurantMarkers(
      restaurants,
      internal.id ?? restaurantDetail?.id
    )
  }, [key])

  const handleMoveEnd = useCallback(
    ({ center, span }) => {
      if (isSmall && (drawerStore.isDragging || drawerStore.snapIndex === 0)) {
        console.log('avoid move stuff when snapped to top')
        return
      }
      if (omStatic.state.home.centerToResults) {
        // we just re-centered, ignore
        om.actions.home.setCenterToResults(0)
      }
      setState({
        center,
        span,
      })
      om.actions.home.updateCurrentState({
        mapAt: {
          center,
          span,
        },
      })
      om.actions.home.updateCurrentMapAreaInformation()
    },
    [isSmall]
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
      om.actions.home.setHoveredRestaurant(null)
      return
    }
    const { hoveredRestaurant } = omStatic.state.home
    const restaurants = getRestaurants()
    if (!hoveredRestaurant || id !== hoveredRestaurant?.id) {
      const restaurant = restaurants?.find((x) => x.id === id)
      if (restaurant) {
        om.actions.home.setHoveredRestaurant({
          id: restaurant.id,
          slug: restaurant.slug,
        })
      } else {
        console.warn('not found?', restaurants, id)
      }
    }
  }, [])

  const handleSelect = useCallback((id: string) => {
    const restaurants = getRestaurants()
    const restaurant = restaurants?.find((x) => x.id === id)
    if (!restaurant) {
      console.warn('not found', id)
      return
    }
    if (omStatic.state.home.currentStateType === 'search') {
      if (id !== omStatic.state.home.selectedRestaurant?.id) {
        om.actions.home.setSelectedRestaurant({
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

      if (router.isRouteActive(route)) {
        if (getIs('sm')) {
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
    console.log('setting to region', region)
    updateRegion(region)
  }, [])

  return (
    <HStack
      position="absolute"
      fullscreen
      alignItems="center"
      justifyContent="center"
    >
      <HStack height="100%" maxWidth={pageWidthMax} width="100%">
        <VStack height="100%" flex={2}>
          <Text>
            Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem
            Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem
            Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem
            Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem
            Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem
            Lorem Lorem Lorem Lorem Lorem Lorem Lorem{' '}
          </Text>
        </VStack>
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
          <MapView
            center={center}
            span={span}
            padding={padding}
            features={features}
            centerToResults={om.state.home.centerToResults}
            selected={internal.id}
            hovered={
              om.state.home.hoveredRestaurant &&
              om.state.home.hoveredRestaurant.id
            }
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
