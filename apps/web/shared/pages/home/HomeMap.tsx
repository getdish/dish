import { Restaurant, Tag, graphql } from '@dish/graph'
import { AbsoluteVStack, useDebounce, useLazyEffect } from '@dish/ui'
import { uniqBy } from 'lodash'
import mapboxgl from 'mapbox-gl'
import React, {
  Suspense,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'

import { searchBarHeight, zIndexMap } from '../../constants'
import { getWindowHeight } from '../../helpers/getWindow'
import {
  isHomeState,
  isRestaurantState,
  isSearchState,
} from '../../state/home-helpers'
import { setMapView } from '../../state/mapView'
import { useOvermind } from '../../state/om'
import { router } from '../../state/router'
import { Map } from '../../views/Map'
import { getLngLat, getMinLngLat } from './getLngLat'
import { getRankingColor, getRestaurantRating } from './getRestaurantRating'
import { snapPoints } from './HomeSmallDrawer'
import { useLastValue } from './useLastValue'
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
        const searchState = om.state.home.lastSearchState
        all = [single, ...(searchState?.results ?? [])]
      } else if (isSearchState(state)) {
        const searchState = om.state.home.lastSearchState
        all = searchState?.results ?? []
      } else if (isHomeState(state)) {
        // for now, bad abstraction we should generalize in states
        // @ts-ignore
        all = om.state.home.topDishes
          .map((x) => x.top_restaurants)
          .flat()
          .filter((x) => x?.id)
          .map((x) => ({ id: x.id, slug: x.slug }))
          // slicing for now
          .slice(0, 50)
      }

      const allIds = [...new Set(all.map((x) => x.id))]
      const allResults = allIds
        .map((id) => all.find((x) => x.id === id))
        .filter(Boolean)

      const restaurants = uniqBy(
        allResults.map(({ id, slug }) => {
          const r = useRestaurantQuery(slug)
          const coords = r.location?.coordinates
          return {
            id: id ?? r.id,
            slug,
            name: r.name,
            location: {
              coordinates: [coords?.[0], coords?.[1]],
            },
          }
        }),
        (x) => `${x.location.coordinates[0]}${x.location.coordinates[1]}`
      )
        // ensure has location
        .filter((x) => !!x.location.coordinates[0])

      useEffect(() => {
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
  const stateId = om.state.home.currentState.id
  const state = om.state.home.allStates[stateId]
  const { drawerWidth, width, paddingLeft } = useMapSize(isSmall)
  const [internal, setInternal] = useState({
    id: om.state.home.selectedRestaurant?.id,
    span: state.span,
    center: state.center,
    via: 'select' as 'select' | 'hover' | 'detail',
  })
  const setState = (next: Partial<typeof internal>) => {
    console.warn('setting', JSON.stringify(next, null, 2))
    setInternal((x) => ({ ...x, ...next }))
  }

  const { center, span } = internal

  // SELECTED
  const selectedId = om.state.home.selectedRestaurant?.id
  useEffect(() => {
    if (!selectedId) return
    setState({
      id: selectedId,
      via: 'select',
      span: getMinLngLat(state.span, 0.025),
    })
  }, [selectedId])

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
  const detailId = restaurantDetail?.id
  useEffect(() => {
    if (!detailId) return
    if (state.type !== 'restaurant') return
    setState({
      id: detailId,
      via: 'detail',
      span: getMinLngLat(state.span, 0.0025),
    })
  }, [detailId])

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

  // SPAN (state.span)
  useLazyEffect(() => {
    setState({
      span: state.span,
    })
  }, [state.span.lat, state.span.lng])

  // CENTER (state.center)
  useLazyEffect(() => {
    setState({
      center: state.center,
    })
  }, [state.center.lat, state.center.lng])

  // CENTER (restauarantSelected.location)
  useEffect(() => {
    if (!restaurantSelected) {
      return
    }
    const coords = restaurantSelected.location.coordinates
    if (!coords) return
    setState({
      center: getLngLat(coords),
    })
  }, [restaurantSelected])

  const snapPoint = isSmall
    ? // avoid resizing to top "fully open drawer" snap
      Math.max(1, om.state.home.drawerSnapPoint)
    : 0
  const padding = isSmall
    ? {
        left: 0,
        top: 0,
        bottom: getWindowHeight() - getWindowHeight() * snapPoints[snapPoint],
        right: 0,
      }
    : {
        left: paddingLeft,
        top: searchBarHeight + 15 + 15,
        bottom: 0,
        right: drawerWidth > 600 ? 6 : 0,
      }

  // console.log('HomeMap', {
  //   internal,
  //   restaurantDetail,
  //   restaurantSelected,
  //   key,
  //   center,
  //   span,
  //   restaurants,
  //   padding,
  // })

  const features = useMemo(() => getRestaurantMarkers(restaurants), [key])

  // stop map animation when moving away from page (see if this fixes some animation glitching/tearing)
  // useLayoutEffect(() => {
  //   if (!map) return
  //   console.warn('test removing this')
  //   map.stop()
  // }, [map, restaurants])

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
        onMoveEnd={({ center, span }) => {
          if (om.state.home.centerToResults) {
            // we just re-centered, ignore
            om.actions.home.setCenterToResults(0)
          }
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
        onSelect={(id) => {
          if (id !== om.state.home.selectedRestaurant?.id) {
            const restaurant = restaurants?.find((x) => x.id === id)
            if (restaurant) {
              om.actions.home.setSelectedRestaurant({
                id: restaurant.id,
                slug: restaurant.slug,
              })
              if (om.state.home.currentStateType === 'search') {
                const index = restaurants.findIndex((x) => x.id === id)
                om.actions.home.setActiveIndex({
                  index,
                  event: om.state.home.isHoveringRestaurant ? 'hover' : 'pin',
                })
              }
            }
          }
        }}
      />
    </AbsoluteVStack>
  )
})

const getMapStyle = (lense: Tag) => {
  switch (lense.name) {
    case 'Gems':
      return 'mapbox://styles/nwienert/ck675hkw702mt1ikstagge6yq'
    case 'Vibe':
      return 'mapbox://styles/nwienert/ckddrrhfa4dnc1io6yindi3hi'
  }
}

let ids = {}
const getNumId = (id: string): number => {
  ids[id] = ids[id] ?? Math.round(Math.random() * 10000000000)
  return ids[id]
}

const getRestaurantMarkers = (restaurants: Restaurant[]) => {
  const result: GeoJSON.Feature[] = []
  for (const restaurant of restaurants) {
    if (!restaurant.location?.coordinates) {
      continue
    }
    const percent = getRestaurantRating(restaurant.rating)
    const color = getRankingColor(percent)
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
        color: color,
      },
    })
    // result.push(
    //   new mapboxgl.Marker({
    //     color,
    //   }).setLngLat(restaurant.location.coordinates)
    // )
  }
  return result
}
// return restaurants
//   .filter((_, index) => {
//     if (!coordinates[index]) {
//       console.warn('noo coordinate')
//       return false
//     }
//     return true
//   })
//   .map((restaurant, index) => {
//     return new mapkit.MarkerAnnotation(coordinates[index], {
//       glyphText: index <= 12 ? `${index + 1}` : ``,
//       color: color,
//       title: index <= 3 ? restaurant.name : '',
//       subtitle: index >= 10 ? restaurant.name : '',
//       collisionMode: mapkit.Annotation.CollisionMode.Circle,
//       displayPriority:
//         index <= 10
//           ? mapkit.Annotation.DisplayPriority.Required // change to High to hide overlaps
//           : mapkit.Annotation.DisplayPriority.Low,
//       data: {
//         id: restaurant.id,
//         slug: restaurant.slug,
//       },
//     })
//   })
//   .reverse()
