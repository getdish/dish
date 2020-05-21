import { Restaurant, graphql, query } from '@dish/graph'
import { ZStack, useDebounceEffect, useOnMount } from '@dish/ui'
import _ from 'lodash'
import React, {
  Suspense,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'

import { searchBarHeight } from '../../constants'
import { LngLat, setMapView } from '../../state/home'
import { isRestaurantState, isSearchState } from '../../state/home-helpers'
import { omStatic, useOvermind } from '../../state/useOvermind'
import { Map, useMap } from '../map'
import { useMediaQueryIsSmall } from './HomeViewDrawer'
import { getRankingColor, getRestaurantRating } from './RestaurantRatingView'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

const mapMaxWidth = 1300

export const HomeMap = memo(function HomeMap() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [restaurantDetail, setRestaurantDetail] = useState<Restaurant>(null)
  const om = useOvermind()

  useOnMount(() => {
    startMapKit().then(() => {
      setIsLoaded(true)
    })
  })

  if (isLoaded) {
    return (
      <>
        <Suspense fallback={null}>
          <HomeMapDataLoader
            key={om.state.home.currentStateType}
            onLoadedRestaurants={setRestaurants}
            onLoadedRestaurantDetail={setRestaurantDetail}
          />
        </Suspense>
        <HomeMapContent
          restaurantDetail={restaurantDetail}
          restaurants={restaurants}
        />
      </>
    )
  }

  return null
})

const HomeMapDataLoader = memo(
  graphql(
    (props: {
      onLoadedRestaurantDetail: Function
      onLoadedRestaurants: Function
    }) => {
      const om = useOvermind()
      const state = om.state.home.currentState

      // restaurants
      const restaurantId = isRestaurantState(state) ? state.restaurantId : null
      const restaurantIds: string[] = isSearchState(state)
        ? state.results?.results?.restaurantIds.filter(Boolean) ?? []
        : restaurantId
        ? [restaurantId]
        : []

      // for now to avoid so many large db calls just have search api return it instead of re-fetch here
      const restaurants = restaurantIds.map((id) => {
        return om.state.home.allRestaurants[id]
      })

      // const restaurants = query.restaurant({
      //   where: {
      //     id: {
      //       _in: restaurantIds,
      //     },
      //   },
      // })
      // restaurants.map((x) => {
      //   x.id
      //   x.location?.coordinates
      // })

      useEffect(() => {
        props.onLoadedRestaurants?.(restaurants)
      }, [props.onLoadedRestaurants, JSON.stringify(restaurants)])

      // restaurantDetail
      const restaurantDetail =
        state.type == 'restaurant'
          ? restaurants.find((x) => x.id === restaurantId)
          : null

      useEffect(() => {
        props.onLoadedRestaurantDetail?.(restaurantDetail)
      }, [props.onLoadedRestaurantDetail, JSON.stringify(restaurantDetail)])
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
  const drawerWidth = useHomeDrawerWidth()
  const isSmall = useMediaQueryIsSmall()
  const state = om.state.home.currentState
  const { center, span } = state

  const mapPadRight = 10
  let padLeft = drawerWidth
  if (window.innerWidth > mapMaxWidth) {
    padLeft = drawerWidth - Math.min(550, window.innerWidth - mapMaxWidth)
  }

  const padding = isSmall
    ? {
        left: 0,
        top: searchBarHeight + 15 + 15,
        bottom: window.innerHeight * 0.6,
        right: 0,
      }
    : {
        left: padLeft,
        top: searchBarHeight + 15 + 15,
        bottom: 0,
        right: drawerWidth > 600 ? mapPadRight : 0,
      }

  const { map, mapProps } = useMap({
    region: {
      latitude: center.lat,
      longitude: center.lng,
      latitudeSpan: span.lat,
      longitudeSpan: span.lng,
    },
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
    const tm = setTimeout(() => {
      pendingUpdates = false
      resumeMap()
    }, 100)
    return () => {
      clearTimeout(tm)
    }
  })

  const annotations = useMemo(
    () =>
      getRestaurantAnnotations(
        restaurantDetail ? [restaurantDetail] : restaurants
      ),
    [restaurants, restaurantDetail]
  )

  useEffect(() => {
    if (!map) return
    // set initial zoom level
    const tm = requestIdleCallback(() => {
      centerMapToRegion({
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
  useEffect(() => {
    if (!map) return
    let tm: any
    let tm2: any

    const dispose1 = () => {
      clearTimeout(tm)
      clearTimeout(tm2)
    }

    // react to changed center specifically
    const dispose2 = om.reaction(
      (state) =>
        JSON.stringify([
          state.home.currentState.center,
          state.home.currentState.span,
        ]),
      () => {
        pauseMap()
        tm = requestIdleCallback(() => {
          centerMapToRegion({
            map,
            center: om.state.home.currentState.center,
            span: om.state.home.currentState.span,
          })
          tm2 = setTimeout(resumeMap, 300)
        })
      }
    )
    return () => {
      pauseMapUpdates = false
      dispose1()
      dispose2()
    }
  }, [map])

  // Search - hover restaurant
  useDebounceEffect(
    () => {
      if (!map) return
      return om.reaction(
        (state) => state.home.hoveredRestaurant,
        (hoveredRestaurant) => {
          if (!hoveredRestaurant) return
          for (const annotation of map.annotations) {
            if (annotation.data?.id === hoveredRestaurant.id) {
              annotation.selected = true
            }
          }
          if (hoveredRestaurant.location?.coordinates) {
            centerMapToRegion({
              map,
              center: {
                lat: hoveredRestaurant.location.coordinates[1],
                lng: hoveredRestaurant.location.coordinates[0],
              },
              span: state.span,
            })
          }
        }
      )
    },
    250,
    [map]
  )

  // Detail - center to restaurant
  useDebounceEffect(
    () => {
      if (!map || !restaurantDetail?.location) return
      const index = restaurants.findIndex((x) => x.id === restaurantDetail.id)
      if (index > -1) {
        if (map.annotations[index]) {
          map.annotations[index].selected = true
        } else {
          console.warn('no annotations?', index, map.annotations)
        }
      }
      console.log('now center to the detail')
      if (restaurantDetail.location?.coordinates) {
        centerMapToRegion({
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
      if (!restaurants.length) return

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
    <ZStack
      position="absolute"
      top={0}
      right={0}
      bottom={0}
      width="100%"
      maxWidth={mapMaxWidth}
    >
      <Map {...mapProps} />
    </ZStack>
  )
})

function getRestaurantAnnotations(
  restaurants: Restaurant[]
): mapkit.MarkerAnnotation[] {
  const coordinates = restaurants
    .map(
      (restaurant) =>
        !!restaurant.location?.coordinates &&
        new window.mapkit.Coordinate(
          restaurant.location.coordinates[1],
          restaurant.location.coordinates[0]
        )
    )
    .filter(Boolean)

  if (!coordinates.length) {
    return []
  }

  return restaurants
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

const loadedCallbacks = new Set<Function>()
export const onMapLoadedCallback = (cb: Function) => {
  loadedCallbacks.add(cb)
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
      loadedCallbacks.forEach((cb) => cb())
      res()
    }
    if (document.readyState == 'complete') {
      setup()
    } else {
      window.addEventListener('load', setup)
    }
  })
}

export function centerMapToRegion(p: {
  map: mapkit.Map
  center: LngLat
  span: LngLat
}) {
  const newCenter = new window.mapkit.Coordinate(p.center.lat, p.center.lng)
  const coordspan = new window.mapkit.CoordinateSpan(p.span.lat, p.span.lng)
  const region = new window.mapkit.CoordinateRegion(newCenter, coordspan)
  try {
    p.map?.setRegionAnimated(region)
  } catch (err) {
    console.warn('map hmr err', err.message)
  }
}

// appears *above* all markers and cant go below...
// const dotFactory = (coordinate, options) => {
//   const div = document.createElement('div')
//   // div.textContent = 'HI'
//   div.className = 'dot-annotation'
//   return div
// }

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
const forceResumeMap = () => {
  const id = version
  setTimeout(() => {
    if (id === version) {
      resumeMap(true)
    }
  }, 50)
}
const resumeMap = (force: boolean = false) => {
  version++
  pauseMapUpdates = false
  if (force || pendingUpdates) {
    pendingUpdates = false
    handleRegionChangeEnd()
  }
}

const handleRegionChangeEnd = () => {
  if (pauseMapUpdates) {
    pendingUpdates = true
    console.log('pausing update region change')
    // dont update while were transitioning to new state!
    return
  }

  // were hovering avoid
  if (omStatic.state.home.hoveredRestaurant) {
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
