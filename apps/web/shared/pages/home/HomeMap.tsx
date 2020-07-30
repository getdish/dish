import { fullyIdle, idle, series, sleep } from '@dish/async'
import { Restaurant, graphql } from '@dish/graph'
import {
  AbsoluteVStack,
  VStack,
  useDebounce,
  useDebounceEffect,
  useGet,
  useOnMount,
} from '@dish/ui'
import { uniqBy } from 'lodash'
import React, {
  Suspense,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'

import { frameWidthMax, searchBarHeight } from '../../constants'
import { LngLat } from '../../state/home'
import {
  isHomeState,
  isRestaurantState,
  isSearchState,
} from '../../state/home-helpers'
import { setMapView } from '../../state/mapView'
import { omStatic, useOvermind } from '../../state/useOvermind'
import { Map, useMap } from '../../views/map'
import { centerMapToRegion } from './centerMapToRegion'
import { getRankingColor, getRestaurantRating } from './getRestaurantRating'
import { HomeMapControlsOverlay } from './HomeMapControlsOverlay'
import { setMapIsLoaded } from './onMapLoadedCallback'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'
import { useLastValueWhen } from './useLastValueWhen'
import { useMediaQueryIsSmall } from './useMediaQueryIs'
import { useRestaurantQuery } from './useRestaurantQuery'

type MapLoadState = 'wait' | 'loading' | 'loaded'

export const HomeMap = memo(function HomeMap() {
  const [status, setLoadStatus] = useState<MapLoadState>('wait')
  const [restaurants, setRestaurantsFast] = useState<Restaurant[]>([])
  const [
    restaurantDetail,
    setRestaurantDetailFast,
  ] = useState<Restaurant | null>(null)
  const setRestaurants = useDebounce(setRestaurantsFast, 150)
  const setRestaurantDetail = useDebounce(setRestaurantDetailFast, 150)

  useEffect(() => {
    return series([
      startMapKit,
      () => setLoadStatus('loading'),
      () => sleep(800),
      () => setLoadStatus('loaded'),
    ])
  }, [])

  if (status === 'wait') {
    return null
  }

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

let mapView: mapkit.Map

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
    const span = mapView.region.span
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

export function centerMapToRegionMain(p: {
  map: mapkit.Map
  center: LngLat
  span: LngLat
}) {
  if (pauseMapUpdates) {
    console.debug('paused no centering')
    return
  }
  centerMapToRegion(p)
}

const HomeMapContent = memo(function HomeMap({
  restaurants,
  restaurantDetail,
}: {
  restaurantDetail: Restaurant | null
  restaurants: Restaurant[] | null
}) {
  const om = useOvermind()
  const drawerWidth = useHomeDrawerWidth(Infinity)
  const isSmall = useMediaQueryIsSmall()
  const state = om.state.home.currentState
  const getRestaurants = useGet(restaurants)
  const { center, span } = state

  if (!center || !span) {
    return null
  }

  const mapWidth = isSmall
    ? window.innerWidth
    : Math.min(window.innerWidth, frameWidthMax - 20) - drawerWidth + 300
  let paddingLeft = isSmall ? 0 : 300 - 20

  const padding = isSmall
    ? {
        left: 0,
        top: 0,
        bottom: window.innerHeight * 0.7 + searchBarHeight,
        right: 0,
      }
    : {
        left: paddingLeft,
        top: searchBarHeight + 15 + 15,
        bottom: 0,
        right: drawerWidth > 600 ? 6 : 0,
      }

  const { map, mapProps } = useMap({
    region: {
      latitude: center.lat,
      longitude: center.lng,
      latitudeSpan: span.lat,
      longitudeSpan: span.lng,
    },
    // @ts-ignore
    showsZoomControl: false,
    showsMapTypeControl: false,
    isZoomEnabled: true,
    isScrollEnabled: true,
    showsCompass: mapkit.FeatureVisibility.Hidden,
    padding,
  })

  if (map) {
    setMapView(map)
    mapView = map
  }

  // wheel zoom
  if (map && map['_allowWheelToZoom'] == false) {
    map['_allowWheelToZoom'] = true
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
  const annotations = useMemo(() => {
    console.log('getannotations', key)
    return getRestaurantAnnotations(restaurants)
  }, [key])

  useEffect(() => {
    if (!map) return
    // set initial zoom level
    const tm = requestIdleCallback(() => {
      centerMapToRegionMain({
        map,
        center,
        span,
      })
    })

    map.addEventListener('region-change-end', forceResumeMap)
    map.addEventListener('region-change-start', pauseMap)

    return () => {
      clearTimeout(tm)
      map.removeEventListener('region-change-end', forceResumeMap)
      map.removeEventListener('region-change-start', pauseMap)
    }
  }, [map])

  // stop map animation when moving away from page (see if this fixes some animation glitching/tearing)
  useLayoutEffect(() => {
    // equivalent to map.pauseAnimation() i think?
    try {
      map?.setRegionAnimated(map?.region, false)
    } catch (err) {
      console.warn('map hmr err', err.message)
    }
  }, [map, restaurants])

  // Navigate - return to previous map position
  // why not just useEffect for center/span? because not always wanted
  const next = {
    center: om.state.home.currentState.center!,
    span: om.state.home.currentState.span!,
  }
  useEffect(() => {
    return series([
      fullyIdle,
      () => {
        centerMapToRegionMain({
          map,
          ...next,
        })
      },
      fullyIdle,
      resumeMap,
    ])
  }, [JSON.stringify(next)])

  // Search - hover restaurant
  useDebounceEffect(
    () => {
      if (!map) return

      const disposeReaction = om.reaction(
        (state) => state.home.hoveredRestaurant,
        (hoveredRestaurant) => {
          if (hoveredRestaurant === false) {
            centerMapToRegionMain({
              map,
              center,
              span,
            })
            return
          }
          if (!hoveredRestaurant) {
            return
          }
          if (omStatic.state.home.isScrolling) return
          for (const annotation of map.annotations) {
            if (annotation.data?.id === hoveredRestaurant.id) {
              annotation.selected = true
            }
          }
          const restaurants = getRestaurants()
          const restaurant = restaurants.find(
            (x) =>
              x.id === hoveredRestaurant.id || x.slug === hoveredRestaurant.slug
          )
          const coordinates = restaurant?.location?.coordinates
          if (coordinates) {
            // keep current span
            resumeMap()
            const state = omStatic.state.home.currentState
            centerMapToRegionMain({
              map,
              center: {
                lat: coordinates[1],
                lng: coordinates[0],
              },
              span: {
                lat: Math.min(state.span.lat, 0.025),
                lng: Math.min(state.span.lng, 0.025),
              },
            })
          }
        }
      )

      return () => {
        disposeReaction()
      }
    },
    250,
    [map]
  )

  // Detail - center to restaurant
  useDebounceEffect(
    () => {
      if (!map || !restaurantDetail?.location) return
      const index =
        restaurants?.findIndex((x) => x.id === restaurantDetail.id) ?? -1
      if (index > -1) {
        if (map.annotations[index]) {
          map.annotations[index].selected = true
        } else {
          console.warn('no annotations?', index, map.annotations)
        }
      }
      if (restaurantDetail.location?.coordinates) {
        centerMapToRegionMain({
          map,
          center: {
            lat: restaurantDetail.location.coordinates[1],
            lng: restaurantDetail.location.coordinates[0],
          },
          span: state.span,
        })
      }
    },
    350,
    [map, restaurants, restaurantDetail]
  )

  // update annotations
  useEffect(() => {
    if (!map) return
    if (!restaurants?.length) return

    // debounce
    const cancels = new Set<Function>()

    const handleSelect = (e) => {
      const id = e.annotation.data.id
      const restaurant = restaurants.find((x) => x.id === id)

      if (restaurant) {
        om.actions.home.setSelectedRestaurant({
          id: restaurant.id,
          slug: restaurant.slug,
        })
      }

      if (omStatic.state.home.currentStateType === 'search') {
        const index = restaurants.findIndex((x) => x.id === id)
        om.actions.home.setActiveIndex({
          index,
          event: om.state.home.isHoveringRestaurant ? 'hover' : 'pin',
        })
      } else {
        if (omStatic.state.home.currentStateType != 'restaurant') {
          console.warn('show a little popover in large mode?')
          // router.navigate({
          //   name: 'restaurant',
          //   params: {
          //     slug: e.annotation.data.slug ?? '',
          //   },
          // })
        }
      }
    }

    const handleDeselect = () => {
      if (om.state.home.selectedRestaurant) {
        om.actions.home.setSelectedRestaurant(null)
      }
    }

    map.addEventListener('select', handleSelect)
    map.addEventListener('deselect', handleDeselect)
    cancels.add(() => {
      map.removeEventListener('select', handleSelect)
      map.removeEventListener('deselect', handleDeselect)
    })

    // map.showAnnotations(annotations)
    const hasAnnotations = !!annotations.length
    if (hasAnnotations) {
      try {
        handleDeselect()
        map.addAnnotations(annotations)
      } catch (err) {
        console.error(err)
      }
    }

    // animate to them
    // map.showItems(annotations, {
    //   animate: false,
    //   minimumSpan: createCoordinateSpan(radius, radius),
    // })

    return () => {
      cancels.forEach((x) => x())
      if (hasAnnotations) {
        try {
          console.warn('REMOVING ANNOTATIONS')
          map.removeAnnotations(annotations)
        } catch (err) {
          console.error('Error removing annotations', err)
        }
      }
    }
  }, [!!map, annotations])

  return (
    <AbsoluteVStack
      position="absolute"
      top={0}
      right={0}
      bottom={0}
      width={mapWidth}
    >
      <Suspense fallback={null}>
        <HomeMapControlsOverlay paddingLeft={paddingLeft} />
      </Suspense>
      <Map {...mapProps} />
    </AbsoluteVStack>
  )
})

const getRestaurantAnnotations = (
  restaurants: Restaurant[]
): mapkit.MarkerAnnotation[] => {
  const coordinates = restaurants
    .filter((restaurant) => !!restaurant.location?.coordinates)
    .map(
      (restaurant) =>
        new mapkit.Coordinate(
          restaurant.location.coordinates[1],
          restaurant.location.coordinates[0]
        )
    )

  if (!coordinates.length) {
    return []
  }

  return restaurants
    .filter((_, index) => {
      if (!coordinates[index]) {
        console.warn('noo coordinate')
        return false
      }
      return true
    })
    .map((restaurant, index) => {
      const percent = getRestaurantRating(restaurant.rating)
      const color = getRankingColor(percent)
      return new mapkit.MarkerAnnotation(coordinates[index], {
        glyphText: index <= 12 ? `${index + 1}` : ``,
        color: color,
        title: index <= 3 ? restaurant.name : '',
        subtitle: index >= 10 ? restaurant.name : '',
        collisionMode: mapkit.Annotation.CollisionMode.Circle,
        displayPriority:
          index <= 10
            ? mapkit.Annotation.DisplayPriority.Required // change to High to hide overlaps
            : mapkit.Annotation.DisplayPriority.Low,
        data: {
          id: restaurant.id,
          slug: restaurant.slug,
        },
      })
    })
    .reverse()
}

async function startMapKit() {
  return await new Promise((res) => {
    function setup() {
      // hmr resilient logic
      if (window['MAPKIT_STARTED']) {
        return
      }
      window['MAPKIT_STARTED'] = true
      const token = `eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkwzQ1RLNTYzUlQifQ.eyJpYXQiOjE1ODQ0MDU5MzYuMjAxLCJpc3MiOiIzOTlXWThYOUhZIn0.wAw2qtwuJkcL6T6aI-nLZlVuwJZnlCNg2em6V1uopx9hkUgWZE1ISAWePMoRttzH_NPOem4mQfrpmSTRCkh2bg`
      // init mapkit
      const mapkit = require('../../../web/mapkitExport')
      // @ts-ignore
      mapkit.init({
        authorizationCallback: (done) => {
          done(token)
        },
      })
      setMapIsLoaded()
      res()
    }
    if (document.readyState == 'complete') {
      setup()
    } else {
      window.addEventListener('load', setup)
    }
  })
}
