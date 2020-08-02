import { idle } from '@dish/async'
import { Restaurant, graphql } from '@dish/graph'
import {
  AbsoluteVStack,
  VStack,
  useDebounce,
  useGet,
  useOnMount,
  useStateFn,
} from '@dish/ui'
import { uniqBy } from 'lodash'
import mapboxgl from 'mapbox-gl'
import React, {
  Suspense,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'

import { frameWidthMax, searchBarHeight, zIndexMap } from '../../constants'
import { getWindowHeight, getWindowWidth } from '../../helpers/getWindow'
import {
  isHomeState,
  isRestaurantState,
  isSearchState,
} from '../../state/home-helpers'
import { HomeStateItem, LngLat } from '../../state/home-types'
import { initialHomeState } from '../../state/initialHomeState'
import { setMapView } from '../../state/mapView'
import { omStatic, useOvermind } from '../../state/useOvermind'
import { Map } from '../../views/Map'
import { centerMapToRegion } from './centerMapToRegion'
import { getRankingColor, getRestaurantRating } from './getRestaurantRating'
import { snapPoints } from './HomeSmallDrawer'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'
import { useLastValueWhen } from './useLastValueWhen'
import { useMediaQueryIsSmall } from './useMediaQueryIs'
import { useRestaurantQuery } from './useRestaurantQuery'

export const HomeMap = memo(function HomeMap() {
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
      <VStack
        className="ease-in-out-fast"
        flex={1}
        opacity={status === 'loading' ? 0 : 1}
      >
        <HomeMapContent
          restaurantDetail={restaurantDetail}
          restaurants={restaurants}
        />
      </VStack>
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
        // @ts-ignore
        all = om.state.home.topDishes
          .map((x) => x.top_restaurants)
          .flat()
          .filter((x) => x?.id)
          .map((x) => ({ id: x.id, slug: x.slug }))
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
            id,
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

let mapView: mapboxgl.Map

// pause/unpause, need to define better
// start paused, first map update we ignore because its slightly off
let pauseMapUpdates = true
let pendingUpdates = false
let version = 0
const pauseMap = () => {
  version++
  pauseMapUpdates = true
}
const forceResumeMap = async () => {
  const id = version
  await idle(20)
  if (id === version) {
    resumeMap(true)
  }
}
const resumeMap = (force: boolean = false) => {
  version++
  pauseMapUpdates = false
  if (force || pendingUpdates) {
    pendingUpdates = false
    if (pauseMapUpdates) {
      pendingUpdates = true
      console.log('pausing update region change')
      // dont update while were transitioning to new state!
      return
    }
    omStatic.actions.home.setHasMovedMap()
    const span = mapView.span
    pendingUpdates = false

    if (
      omStatic.state.home.hoveredRestaurant &&
      omStatic.state.home.currentStateType === 'search'
    ) {
      console.log('avoid while hovered')
      return
    }

    omStatic.actions.home.setMapArea({
      center: {
        lng: mapView.center.longitude,
        lat: mapView.center.latitude,
      },
      span: {
        lat: span.latitudeDelta,
        lng: span.longitudeDelta,
      },
    })
  }
}

function centerMapTo(p: { map: mapboxgl.Map; center: LngLat; span: LngLat }) {
  if (pauseMapUpdates) {
    console.debug('paused no centering')
    return
  }
  centerMapToRegion(p)
}

export const useMapSize = (isSmall: boolean) => {
  const drawerWidth = useHomeDrawerWidth(Infinity)
  const width = isSmall
    ? getWindowWidth()
    : Math.min(getWindowWidth(), frameWidthMax - 20) - drawerWidth + 300
  let paddingLeft = isSmall ? 0 : 300 - 20
  return { width, paddingLeft, drawerWidth }
}

const getStateLocation = (state: HomeStateItem) => ({
  center: state.center,
  span: state.span,
})

const HomeMapContent = memo(function HomeMap({
  restaurants,
  restaurantDetail,
}: {
  restaurantDetail: Restaurant | null
  restaurants: Restaurant[] | null
}) {
  const om = useOvermind()
  const isSmall = useMediaQueryIsSmall()
  const state = om.state.home.currentState
  const getRestaurants = useGet(restaurants)
  const { drawerWidth, width, paddingLeft } = useMapSize(isSmall)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const [getLocation, setLocation] = useStateFn(getStateLocation(state))

  useEffect(() => {
    setLocation(getStateLocation(state))
  }, [JSON.stringify(state.center), JSON.stringify(state.span)])

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

  useOnMount(() => {
    // fix: dont send initial map location update, wait for ~fully loaded
    const tm = setTimeout(resumeMap, 100)
    return () => {
      clearTimeout(tm)
    }
  })

  const isLoading = restaurants[0]?.location?.coordinates[0] === null
  const key = useLastValueWhen(
    () => JSON.stringify(restaurants.map((x) => x.location?.coordinates)),
    isLoading
  )
  const features = useMemo(() => {
    return getRestaurantMarkers(restaurants)
  }, [key])

  useEffect(() => {
    if (!map) return
    map.on('moveend', forceResumeMap)
    map.on('region-change-start', pauseMap)
    return () => {
      map.off('moveend', forceResumeMap)
      map.off('movestart', pauseMap)
    }
  }, [map])

  // stop map animation when moving away from page (see if this fixes some animation glitching/tearing)
  useLayoutEffect(() => {
    if (!map) return
    console.warn('test removing this')
    map.stop()
  }, [map, restaurants])

  // Search - hover restaurant
  // useEffect(
  //   () => {
  //     if (!map) return

  //     return om.reaction(
  //       (state) => state.home.hoveredRestaurant,
  //       (hoveredRestaurant) => {
  //         if (hoveredRestaurant === false) {
  //           setCenter(getStateLocation(om.state.home.currentState))
  //           return
  //         }
  //         if (!hoveredRestaurant) {
  //           return
  //         }
  //         if (omStatic.state.home.isScrolling) return
  //         for (const annotation of map.annotations) {
  //           if (annotation.data?.id === hoveredRestaurant.id) {
  //             annotation.selected = true
  //           }
  //         }
  //         const restaurants = getRestaurants()
  //         const restaurant = restaurants.find(
  //           (x) =>
  //             x.id === hoveredRestaurant.id || x.slug === hoveredRestaurant.slug
  //         )
  //         const coordinates = restaurant?.location?.coordinates
  //         if (coordinates) {
  //           // keep current span
  //           resumeMap()
  //           const state = omStatic.state.home.currentState
  //           centerMapTo({
  //             map,
  //             center: {
  //               lat: coordinates[1],
  //               lng: coordinates[0],
  //             },
  //             span: {
  //               lat: Math.min(state.span.lat, 0.036),
  //               lng: Math.min(state.span.lng, 0.036),
  //             },
  //           })
  //         }
  //       }
  //     )
  //   },
  //   [map]
  // )

  // Detail - center to restaurant
  // useDebounceEffect(
  //   () => {
  //     if (!map || !restaurantDetail?.location) return
  //     const index =
  //       restaurants?.findIndex((x) => x.id === restaurantDetail.id) ?? -1
  //     if (index > -1) {
  //       if (map.annotations[index]) {
  //         map.annotations[index].selected = true
  //       } else {
  //         console.warn('no annotations?', index, map.annotations)
  //       }
  //     }
  //     if (restaurantDetail.location?.coordinates) {
  //       centerMapTo({
  //         map,
  //         center: {
  //           lat: restaurantDetail.location.coordinates[1],
  //           lng: restaurantDetail.location.coordinates[0],
  //         },
  //         span: state.span,
  //       })
  //     }
  //   },
  //   350,
  //   [map, restaurants, restaurantDetail]
  // )

  // update annotations
  // useEffect(() => {
  //   if (!map) return
  //   if (!restaurants?.length) return

  //   // debounce
  //   const cancels = new Set<Function>()

  //   const handleSelect = (e) => {
  //     const id = e.annotation.data.id
  //     const restaurant = restaurants.find((x) => x.id === id)

  //     if (restaurant) {
  //       om.actions.home.setSelectedRestaurant({
  //         id: restaurant.id,
  //         slug: restaurant.slug,
  //       })
  //     }

  //     if (omStatic.state.home.currentStateType === 'search') {
  //       const index = restaurants.findIndex((x) => x.id === id)
  //       om.actions.home.setActiveIndex({
  //         index,
  //         event: om.state.home.isHoveringRestaurant ? 'hover' : 'pin',
  //       })
  //     } else {
  //       if (omStatic.state.home.currentStateType != 'restaurant') {
  //         console.warn('show a little popover in large mode?')
  //         // router.navigate({
  //         //   name: 'restaurant',
  //         //   params: {
  //         //     slug: e.annotation.data.slug ?? '',
  //         //   },
  //         // })
  //       }
  //     }
  //   }

  //   const handleDeselect = () => {
  //     if (om.state.home.selectedRestaurant) {
  //       om.actions.home.setSelectedRestaurant(null)
  //     }
  //   }

  //   map.addEventListener('select', handleSelect)
  //   map.addEventListener('deselect', handleDeselect)
  //   cancels.add(() => {
  //     map.removeEventListener('select', handleSelect)
  //     map.removeEventListener('deselect', handleDeselect)
  //   })

  //   // map.showAnnotations(annotations)
  //   const hasAnnotations = !!annotations.length
  //   if (hasAnnotations) {
  //     try {
  //       handleDeselect()
  //       map.addAnnotations(annotations)
  //     } catch (err) {
  //       console.error(err)
  //     }
  //   }

  //   // animate to them
  //   // map.showItems(annotations, {
  //   //   animate: false,
  //   //   minimumSpan: createCoordinateSpan(radius, radius),
  //   // })

  //   return () => {
  //     cancels.forEach((x) => x())
  //     if (hasAnnotations) {
  //       try {
  //         console.warn('REMOVING ANNOTATIONS')
  //         map.removeAnnotations(annotations)
  //       } catch (err) {
  //         console.error('Error removing annotations', err)
  //       }
  //     }
  //   }
  // }, [!!map, annotations])

  const setMapRef = useCallback((map: mapboxgl.Map) => {
    setMap(map)
    setMapView(map)
    mapView = map
  }, [])

  return (
    <AbsoluteVStack
      position="absolute"
      top={0}
      right={0}
      bottom={0}
      zIndex={zIndexMap}
      width={width}
    >
      <Map
        {...getLocation()}
        padding={padding}
        features={features}
        mapRef={setMapRef}
      />
    </AbsoluteVStack>
  )
})

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
