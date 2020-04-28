import _ from 'lodash'
import React, { memo, useEffect, useMemo, useRef } from 'react'

import { searchBarHeight } from '../../constants'
import { useDebounceEffect } from '../../hooks/useDebounceEffect'
import { LngLat, setMapView } from '../../state/home'
import { isSearchState } from '../../state/home-helpers'
import { om, useOvermind } from '../../state/om'
import { Map, useMap } from '../map'
import { ZStack } from '../ui/Stacks'
import { useMediaQueryIsSmall } from './HomeViewDrawer'
import { getRankingColor, getRestaurantRating } from './RestaurantRatingView'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

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
    console.error(err)
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
// start paused, first map update we ignore because its slightly off
let pauseMapUpdates = true
let pendingUpdates = false

const handleRegionChangeEnd = () => {
  if (pauseMapUpdates) {
    pendingUpdates = true
    console.log('pausing update region change')
    // dont update while were transitioning to new state!
    return
  }
  om.actions.home.setMapMoved()
  const span = mapView.region.span
  console.log('updating center/span')
  pendingUpdates = false
  om.actions.home.setMapArea({
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

export const HomeMap = memo(() => {
  const om = useOvermind()
  const drawerWidth = useHomeDrawerWidth()
  const isSmall = useMediaQueryIsSmall()
  const state = om.state.home.currentState
  const { center, span } = state

  const padding = isSmall
    ? {
        left: 0,
        top: searchBarHeight + 15 + 15,
        bottom: window.innerHeight * 0.6,
        right: 0,
      }
    : {
        left: drawerWidth,
        top: searchBarHeight + 15 + 15,
        bottom: 0,
        right: drawerWidth > 600 ? window.innerWidth * 0.4 - drawerWidth : 0,
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

  setMapView(map)
  mapView = map

  // wheel zoom
  if (map && map['_allowWheelToZoom'] == false) {
    map['_allowWheelToZoom'] = true
  }

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

    map.addEventListener('region-change-end', handleRegionChangeEnd)

    return () => {
      clearTimeout(tm)
      map.removeEventListener('region-change-end', handleRegionChangeEnd)
    }
  }, [map])

  const restaurantDetail =
    state.type == 'restaurant'
      ? om.state.home.allRestaurants[state.restaurantId]
      : null
  const prevState = om.state.home.previousState
  const prevResults: string[] =
    (state.type == 'restaurant' &&
      isSearchState(prevState) &&
      prevState.results.status === 'complete' &&
      prevState.results.results.restaurantIds) ||
    []

  const allRestaurants = om.state.home.allRestaurants
  const searchResults = isSearchState(state)
    ? state.results?.results?.restaurantIds ?? []
    : []

  const restaurantIds: string[] = _.uniq(
    [...searchResults, ...prevResults, restaurantDetail?.id].filter(
      (id) => !!id && !!allRestaurants[id]?.location?.coordinates
    )
  )

  const restaurants = restaurantIds.map((id) => allRestaurants[id])
  const restaurantsVersion = restaurantIds.join('')
  // const focusedRestaurant = restaurants.find((x) => x.id == focused)

  const annotations = useMemo(() => {
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

    return restaurants
      .map((restaurant, index) => {
        const percent = getRestaurantRating(restaurant)
        const color = getRankingColor(percent)

        // if (index >= 10) {
        //   return new window.mapkit.Annotation(coordinates[index], dotFactory, {
        //     data: {
        //       id: restaurant.id,
        //     },
        //   })
        // }

        return new window.mapkit.MarkerAnnotation(coordinates[index], {
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
        // return new window.mapkit.PinAnnotation(coordinates[index], {
        //   data: {
        //     id: restaurant.id,
        //   },
        // })
      })
      .reverse()
  }, [restaurantsVersion])

  // hover on map annotation
  const annotationsContainer = document.querySelector(
    '.mk-annotation-container'
  )

  // stop map animation when moving away from page (see if this fixes some animation glitching/tearing)
  useEffect(() => {
    // equivalent to map.pauseAnimation() i think?
    try {
      map?.setRegionAnimated(map?.region, false)
    } catch (err) {
      console.error(err)
    }
  }, [map, restaurantsVersion])

  useDebounceEffect(
    () => {
      if (!annotationsContainer) return
      const annotationsRoot: HTMLElement = annotationsContainer.shadowRoot.querySelector(
        '.mk-annotations'
      )
      if (!annotationsRoot) return

      let annotationElements: ChildNode[] = []
      let dispose = () => {}

      const onMouseEnter = (e: MouseEvent | any) => {
        const index = annotationElements.indexOf(e.target as any)
        om.actions.home.setHoveredRestaurant(restaurants[index])
      }
      const observer = new MutationObserver(() => {
        dispose()
        annotationElements = Array.from(annotationsRoot.childNodes)
        for (const el of annotationElements) {
          el.addEventListener('mouseenter', onMouseEnter)
        }
        dispose = () => {
          for (const el of annotationElements) {
            el.removeEventListener('mouseenter', onMouseEnter)
          }
        }
      })
      observer.observe(annotationsRoot, {
        childList: true,
      })

      return () => {
        dispose()
        observer.disconnect()
      }
    },
    100,
    [annotationsContainer, restaurantsVersion]
  )

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
        console.log('new area')
        pauseMapUpdates = true
        tm = requestIdleCallback(() => {
          centerMapToRegion({
            map,
            center: om.state.home.currentState.center,
            span: om.state.home.currentState.span,
          })
          tm2 = setTimeout(() => {
            pauseMapUpdates = false
            if (pendingUpdates) {
              pendingUpdates = false
              handleRegionChangeEnd()
            }
          }, 300)
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
        }
      )
    },
    250,
    [map, restaurantIds]
  )

  // Detail - center to restaurant
  useDebounceEffect(
    () => {
      if (!map || !restaurantDetail?.location) return
      const index = restaurantIds.indexOf(restaurantDetail.id)
      if (index > -1) {
        if (map.annotations[index]) {
          map.annotations[index].selected = true
        } else {
          console.warn('no annotations?', index, map.annotations)
        }
      }
      // centerMapToRegion({
      //   map,
      //   center: {
      //     lat: restaurantDetail.location.coordinates[1],
      //     lng: restaurantDetail.location.coordinates[0],
      //   },
      //   span: state.span,
      // })
    },
    350,
    [map, restaurantDetail]
  )

  // selected on map
  // useEffect(() => {
  //   if (!focusedRestaurant) return
  //   if (!map) return
  //   map.setCenterAnimated(
  //     coordinates[restaurants.findIndex((x) => x.id === focusedRestaurant.id)],
  //     true
  //   )
  // }, [map, focusedRestaurant])

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
        for (const annotation of annotations) {
          map.addAnnotation(annotation)
        }
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
    [!!map, restaurantsVersion]
  )

  return (
    <ZStack width="100%" height="100%">
      <Map {...mapProps} />
    </ZStack>
  )
})

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
