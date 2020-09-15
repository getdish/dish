import { LngLat, Restaurant, graphql } from '@dish/graph'
import { AbsoluteVStack, useDebounce, useLazyEffect } from '@dish/ui'
import { useStore } from '@dish/use-store'
import { findLast, isEqual, pick, uniqBy } from 'lodash'
import mapboxgl from 'mapbox-gl'
import React, { Suspense, memo, useEffect, useMemo, useState } from 'react'

import { searchBarHeight, zIndexMap } from '../../constants'
import { getWindowHeight } from '../../helpers/getWindow'
import { findLastHomeOrSearch } from '../../state/home'
import {
  isHomeState,
  isRestaurantState,
  isSearchState,
} from '../../state/home-helpers'
import { HomeStateItemHome } from '../../state/home-types'
import { setMapView } from '../../state/mapView'
import { omStatic, useOvermind } from '../../state/om'
import { router } from '../../state/router'
import { Map } from '../../views/Map'
import { BottomDrawerStore } from './BottomDrawerStore'
import { getLngLat, getMinLngLat } from './getLngLat'
import { getRestaurantRating } from './getRestaurantRating'
import { useLastValueWhen } from './useLastValueWhen'
import { useMapSize } from './useMapSize'
import { useMediaQueryIsSmall } from './useMediaQueryIs'
import { useRestaurantQuery } from './useRestaurantQuery'

export default memo(function HomeMap() {
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
        <HomeMapDataLoader
          onLoadedRestaurants={setRestaurants}
          onLoadedRestaurantDetail={setRestaurantDetail}
        />
      </Suspense>
      <Suspense fallback={null}>
        <HomeMapContent
          restaurantDetail={restaurantDetail}
          restaurants={restaurants}
        />
      </Suspense>
    </>
  )
})

type RestaurantIdentified = Required<Pick<Restaurant, 'slug' | 'id'>>

const HomeMapDataLoader = memo(
  graphql(
    (props: {
      onLoadedRestaurantDetail: Function
      onLoadedRestaurants: Function
    }) => {
      const om = useOvermind()
      const state = om.state.home.currentState
      let all: RestaurantIdentified[] = []
      let single: RestaurantIdentified | null = null

      if (isRestaurantState(state)) {
        single = {
          id: state.restaurantId,
          slug: state.restaurantSlug,
        }
        const last = findLastHomeOrSearch(omStatic.state.home.states)
        all = [single, ...(last?.results ?? [])]
      } else if ('results' in state) {
        all = state?.results ?? []
      }

      all = all.filter(Boolean)

      const allIds = [...new Set(all.map((x) => x.id))]
      const allResults = allIds
        .map((id) => all.find((x) => x.id === id))
        .filter(Boolean)

      const restaurants = uniqBy(
        allResults
          .map(({ id, slug }) => {
            const r = useRestaurantQuery(slug)
            if (!r) {
              return null
            }
            const coords = r?.location?.coordinates
            return {
              id: id ?? r.id,
              slug,
              name: r.name,
              location: {
                coordinates: [coords?.[0], coords?.[1]],
              },
            }
          })
          .filter(Boolean),
        (x) => `${x.location.coordinates[0]}${x.location.coordinates[1]}`
      )
        // ensure has location
        .filter((x) => !!x.location.coordinates[0])

      useEffect(() => {
        console.warn('loaded', restaurants)
        props.onLoadedRestaurants?.(restaurants)
      }, [JSON.stringify(restaurants.map((x) => x.location?.coordinates))])

      const restaurantDetail = single
        ? restaurants.find((x) => x.id === single.id)
        : null
      useEffect(() => {
        props.onLoadedRestaurantDetail?.(restaurantDetail)
      }, [JSON.stringify(restaurantDetail?.location?.coordinates ?? null)])
    }
  )
)

const HomeMapContent = memo(function HomeMap({
  restaurants,
  restaurantDetail,
}: {
  restaurantDetail: Restaurant | null
  restaurants: Restaurant[] | null
}) {
  const om = useOvermind()
  const isSmall = useMediaQueryIsSmall()
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
      `${internal.id}${restaurantDetail?.location.coordinates}${JSON.stringify(
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
  const padding = isSmall
    ? {
        left: 10,
        top: 10,
        bottom:
          getWindowHeight() -
          getWindowHeight() * drawerStore.currentSnapPoint +
          10,
        right: 10,
      }
    : {
        left: paddingLeft + 10,
        top: searchBarHeight + 20,
        bottom: 10,
        right: 10,
      }

  const features = useMemo(() => getRestaurantMarkers(restaurants), [key])

  return (
    <AbsoluteVStack
      className="map-container"
      position="absolute"
      top={0}
      right={0}
      bottom={0}
      zIndex={zIndexMap}
      width={width}
    >
      <Map
        center={center}
        span={span}
        padding={padding}
        features={features}
        centerToResults={om.state.home.centerToResults}
        mapRef={(map: mapboxgl.Map) => {
          setMapView(map)
        }}
        selected={internal.id}
        hovered={
          om.state.home.hoveredRestaurant && om.state.home.hoveredRestaurant.id
        }
        onMoveEnd={({ center, span }) => {
          if (isSmall && drawerStore.currentSnapPoint === 0) {
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
        }}
        onDoubleClick={(id) => {
          const restaurant = restaurants?.find((x) => x.id === id)
          if (restaurant) {
            router.navigate({
              name: 'restaurant',
              params: {
                slug: restaurant.slug,
              },
            })
          }
        }}
        onHover={(id) => {
          const { hoveredRestaurant } = omStatic.state.home
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
        }}
        onSelect={(id) => {
          const restaurant = restaurants?.find((x) => x.id === id)
          if (!restaurant) {
            console.warn('not found', id)
            return
          }
          if (omStatic.state.home.currentStateType === 'search') {
            if (id !== omStatic.state.home.selectedRestaurant?.id) {
              om.actions.home.setSelectedRestaurant({
                id: restaurant.id,
                slug: restaurant.slug,
              })
            }
          } else {
            router.navigate({
              name: 'restaurant',
              params: {
                slug: restaurant.slug,
              },
            })
          }
        }}
      />
    </AbsoluteVStack>
  )
})

let ids = {}
const getNumId = (id: string): number => {
  ids[id] = ids[id] ?? Math.round(Math.random() * 10000000000)
  return ids[id]
}

const getRestaurantMarkers = (restaurants: Restaurant[]) => {
  const result: GeoJSON.Feature[] = []
  for (const restaurant of restaurants) {
    if (!restaurant?.location?.coordinates) {
      continue
    }
    const percent = getRestaurantRating(restaurant.rating)
    // const color = getRankingColor(percent)
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
      },
    })
  }
  return result
}
