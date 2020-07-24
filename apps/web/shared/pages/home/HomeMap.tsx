import { fullyIdle, idle, series, sleep } from '@dish/async'
import { Restaurant, graphql, query } from '@dish/graph'
import {
  AbsoluteVStack,
  VStack,
  useDebounce,
  useDebounceEffect,
  useGet,
  useOnMount,
} from '@dish/ui'
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
import { isRestaurantState, isSearchState } from '../../state/home-helpers'
import { setMapView } from '../../state/mapView'
import { omStatic, useOvermind } from '../../state/useOvermind'
import { Map, useMap } from '../../views/map'
import { centerMapToRegion } from './centerMapToRegion'
import { getRankingColor, getRestaurantRating } from './getRestaurantRating'
import { setMapIsLoaded } from './onMapLoadedCallback'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'
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
      () => sleep(500),
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

const HomeMapDataLoader = memo(
  graphql(
    (props: {
      onLoadedRestaurantDetail: Function
      onLoadedRestaurants: Function
    }) => {
      const om = useOvermind()

      let state = om.state.home.currentState

      // for going deeper than search, leave the last search state on map
      if (!isRestaurantState(state) && !isSearchState(state)) {
        state = om.state.home.lastSearchState
      }

      // restaurants
      const restaurantDetailInfo = isRestaurantState(state)
        ? { id: state.restaurantId, slug: state.restaurantSlug }
        : null
      const restaurantResults = (isSearchState(state)
        ? state.results
        : [restaurantDetailInfo]
      ).filter(Boolean)

      // for now to avoid so many large db calls just have search api return it instead of re-fetch here
      const restaurants = restaurantResults.map(({ id, slug }) => {
        const r = useRestaurantQuery(slug)
        const coords = r.location?.coordinates
        return {
          id,
          slug,
          location: {
            coordinates: [coords?.[0], coords?.[1]],
          },
        }
      })

      useEffect(() => {
        props.onLoadedRestaurants?.(restaurants)
      }, [JSON.stringify(restaurants.map((x) => x.location?.coordinates))])

      // restaurantDetail
      const restaurantDetail = restaurantDetailInfo
        ? restaurants.find((x) => x.id === restaurantDetailInfo.id)
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

  const mapWidth = isSmall
    ? window.innerWidth
    : Math.min(window.innerWidth, frameWidthMax - 20) - drawerWidth + 300
  let paddingLeft = isSmall ? 0 : 300 - 20

  const padding = isSmall
    ? {
        left: 0,
        top: searchBarHeight + 15 + 15,
        bottom: window.innerHeight * 0.7,
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

  const annotations = useMemo(
    () =>
      getRestaurantAnnotations(
        (restaurantDetail ? [restaurantDetail] : restaurants) ?? []
      ),
    [restaurants, restaurantDetail]
  )

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
    center: om.state.home.currentState.center,
    span: om.state.home.currentState.span,
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
          if (!hoveredRestaurant) return
          if (om.state.home.isScrolling) return
          for (const annotation of map.annotations) {
            if (annotation.data?.id === hoveredRestaurant.id) {
              annotation.selected = true
            }
          }
          const restaurants = getRestaurants()
          console.log('hovered', hoveredRestaurant, restaurants)
          const restaurant = restaurants.find(
            (x) =>
              x.id === hoveredRestaurant.id || x.slug === hoveredRestaurant.slug
          )
          const coordinates = restaurant?.location?.coordinates
          console.log('ok', restaurant, coordinates)
          if (coordinates) {
            resumeMap()
            centerMapToRegionMain({
              map,
              center: {
                lat: coordinates[1],
                lng: coordinates[0],
              },
              span: {
                lat: state.span.lat,
                lng: state.span.lng,
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
  useDebounceEffect(
    () => {
      if (!map) return
      if (!restaurants?.length) return

      // debounce
      const cancels = new Set<Function>()
      const cb = (e) => {
        const selected = e.annotation.data.id || ''
        console.log('selected is', selected)
      }
      map.addEventListener('select', cb)
      cancels.add(() => map.removeEventListener('select', cb))

      // map.showAnnotations(annotations)
      try {
        map.addAnnotations(annotations)
      } catch (err) {
        console.error(err)
      }

      // animate to them
      // map.showItems(annotations, {
      //   animate: false,
      //   minimumSpan: createCoordinateSpan(radius, radius),
      // })

      return () => {
        cancels.forEach((x) => x())
        try {
          console.warn('REMOVING ANNOTATIONS')
          map.removeAnnotations(annotations)
        } catch (err) {
          console.error('Error removing annotations', err)
        }
      }
    },
    40,
    [!!map, annotations]
  )

  return (
    <AbsoluteVStack
      position="absolute"
      top={0}
      right={0}
      bottom={0}
      width={mapWidth}
    >
      <Map {...mapProps} />
    </AbsoluteVStack>
  )
})

function getRestaurantAnnotations(
  restaurants: Restaurant[]
): mapkit.MarkerAnnotation[] {
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

// map.addEventListener('select', (e) => {
// console.log('select', e, map)
// })
// map.addEventListener('deselect', (e) => {
// console.log('deselect', e, map)
// })
// map.addEventListener('drag-start', (e) => {
//   console.log('drag-start', e, map)
// })
// map.addEventListener('drag-end', (e) => {
//   console.log('drag-end', e, map)
// })
// map.addEventListener('user-location-change', (e) => {
//   console.log('user-location-change', e, map)
// })
// // hover on map annotation
// const annotationsContainer = document.querySelector(
//   '.mk-annotation-container'
// )
//  broke, mapkit stopped insertings the divs in the same order?
// useDebounceEffect(
//   () => {
//     if (!annotationsContainer) return
//     const annotationsRoot: HTMLElement = annotationsContainer.shadowRoot.querySelector(
//       '.mk-annotations'
//     )
//     if (!annotationsRoot) return
//     let annotationElements: ChildNode[] = []
//     let dispose = () => {}
//     const onMouseEnter = (e: MouseEvent | any) => {
//       const index = annotationElements.indexOf(e.target as any)
//       console.log('index', index, restaurants[index], restaurants)
//       om.actions.home.setHoveredRestaurant(restaurants[index])
//     }
//     const observer = new MutationObserver(() => {
//       dispose()
//       annotationElements = Array.from(annotationsRoot.childNodes)
//       for (const el of annotationElements) {
//         el.addEventListener('mouseenter', onMouseEnter)
//       }
//       dispose = () => {
//         for (const el of annotationElements) {
//           el.removeEventListener('mouseenter', onMouseEnter)
//         }
//       }
//     })
//     observer.observe(annotationsRoot, {
//       childList: true,
//     })
//     return () => {
//       dispose()
//       observer.disconnect()
//     }
//   },
//   100,
//   [annotationsContainer, restaurantsVersion]
// )
// selected on map
// useEffect(() => {
//   if (!focusedRestaurant) return
//   if (!map) return
//   map.setCenterAnimated(
//     coordinates[restaurants.findIndex((x) => x.id === focusedRestaurant.id)],
//     true
//   )
// }, [map, focusedRestaurant])
