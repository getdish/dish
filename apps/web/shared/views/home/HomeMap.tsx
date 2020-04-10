import _ from 'lodash'
import React, { memo, useEffect, useMemo, useState } from 'react'

import { searchBarHeight } from '../../constants'
import { useDebounceValue } from '../../hooks/useDebounce'
import { useDebounceEffect } from '../../hooks/useDebounceEffect'
import { LngLat, setMapView } from '../../state/home'
import { useOvermind } from '../../state/om'
import { Map, useMap } from '../map'
import { ZStack } from '../shared/Stacks'
import { getRankingColor, getRestaurantRating } from './RatingView'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

export function centerMapToRegion(p: {
  map: mapkit.Map
  center: LngLat
  span: LngLat
}) {
  const newCenter = new mapkit.Coordinate(p.center.lat, p.center.lng)
  const coordspan = new mapkit.CoordinateSpan(p.span.lat, p.span.lng)
  const region = new mapkit.CoordinateRegion(newCenter, coordspan)
  p.map.setRegionAnimated(region)
}

// appears *above* all markers and cant go below...
// const dotFactory = (coordinate, options) => {
//   const div = document.createElement('div')
//   // div.textContent = 'HI'
//   div.className = 'dot-annotation'
//   return div
// }

export const HomeMap = memo(() => {
  const om = useOvermind()
  const drawerWidth = useHomeDrawerWidth()
  const state = om.state.home.currentState
  const { center, span } = state
  const {
    map,
    mapProps,
    // setRotation,
    // setCenter,
    // setVisibleMapRect,
  } = useMap({
    // center: [, center.lng],
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
    padding: {
      left: drawerWidth + 15,
      top: searchBarHeight + 15 + 15,
      bottom: 15,
      right: 15,
    },
  })

  setMapView(map)

  // wheel zoom
  if (map && map['_allowWheelToZoom'] == false) {
    map['_allowWheelToZoom'] = true
  }

  useEffect(() => {
    if (!map) return
    // set initial zoom level
    centerMapToRegion({
      map,
      center,
      span,
    })

    const handleRegionChangeEnd = (e) => {
      console.log('region-change-end', e)
      const span = map.region.span
      om.actions.home.setMapArea({
        center: {
          lng: map.center.longitude,
          lat: map.center.latitude,
        },
        span: {
          lat: span.latitudeDelta,
          lng: span.longitudeDelta,
        },
      })
    }

    map.addEventListener('region-change-end', handleRegionChangeEnd)

    return () => {
      map.removeEventListener('region-change-end', handleRegionChangeEnd)
    }
  }, [map])

  const [focused, setFocused] = useState('')

  const restaurantDetail =
    state.type == 'restaurant'
      ? om.state.home.allRestaurants[state.restaurantId]
      : null
  const prevResults: string[] =
    (state.type == 'restaurant' &&
      om.state.home.previousState?.type == 'search' &&
      om.state.home.previousState?.results.status === 'complete' &&
      om.state.home.previousState?.results.results.restaurantIds) ||
    []

  const allRestaurants = om.state.home.allRestaurants
  const searchResults =
    state.type == 'search' ? state.results?.results?.restaurantIds ?? [] : []

  const restaurantIds: string[] = _.uniq(
    [...searchResults, ...prevResults, restaurantDetail?.id].filter(
      (id) => !!id && !!allRestaurants[id]?.location?.coordinates
    )
  )

  const restaurants = restaurantIds.map((id) => allRestaurants[id])
  const restaurantsVersion = restaurantIds.join('')
  // const focusedRestaurant = restaurants.find((x) => x.id == focused)
  const coordinates = useMemo(
    () =>
      mapkit
        ? restaurants
            .map(
              (restaurant) =>
                !!restaurant.location?.coordinates &&
                new mapkit.Coordinate(
                  restaurant.location.coordinates[1],
                  restaurant.location.coordinates[0]
                )
            )
            .filter(Boolean)
        : [],
    [restaurantsVersion]
  )
  const annotations = useMemo(() => {
    return restaurants
      .map((restaurant, index) => {
        const percent = getRestaurantRating(restaurant)
        const color = getRankingColor(percent)

        // if (index >= 10) {
        //   return new mapkit.Annotation(coordinates[index], dotFactory, {
        //     data: {
        //       id: restaurant.id,
        //     },
        //   })
        // }

        return new mapkit.MarkerAnnotation(coordinates[index], {
          glyphText: index <= 12 ? `${index + 1}` : ``,
          color: color,
          title: index < 10 ? restaurant.name : '',
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
        // return new mapkit.PinAnnotation(coordinates[index], {
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
  useDebounceEffect(
    () => {
      if (!map) return
      // react to changed center specifically
      return om.reaction(
        (state) => state.home.currentState.center,
        (center) => {
          centerMapToRegion({
            map,
            center,
            span: om.state.home.currentState.span,
          })
        }
      )
    },
    100,
    [map]
  )

  // Search - hover restaurant
  useDebounceEffect(
    () => {
      if (!map) return
      return om.reaction(
        (state) => state.home.hoveredRestaurant,
        (hoveredRestaurant) => {
          if (!hoveredRestaurant) return
          const index = restaurantIds.indexOf(hoveredRestaurant.id)
          if (map.annotations[index]) {
            map.annotations[index].selected = true
          }
        }
      )
    },
    250,
    [map, restaurantIds]
  )

  // Detail - center to restaurant
  const restaurantDelayed = useDebounceValue(restaurantDetail, 250)
  useDebounceEffect(
    () => {
      if (!map || !restaurantDelayed?.location) return
      const index = restaurantIds.indexOf(restaurantDelayed.id)
      if (index > -1) {
        if (map.annotations[index]) {
          map.annotations[index].selected = true
        } else {
          console.warn('no annotations?', index, map.annotations)
        }
      }
      centerMapToRegion({
        map,
        center: {
          lat: restaurantDelayed.location.coordinates[1],
          lng: restaurantDelayed.location.coordinates[0],
        },
        span: state.span,
      })
    },
    250,
    [map, restaurantDelayed]
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
        setFocused(selected)
      }
      map.addEventListener('select', cb)
      cancels.add(() => map.removeEventListener('select', cb))

      // map.showAnnotations(annotations)
      for (const annotation of annotations) {
        map.addAnnotation(annotation)
      }

      // animate to them
      // map.showItems(annotations, {
      //   animate: false,
      //   minimumSpan: createCoordinateSpan(radius, radius),
      // })

      return () => {
        cancels.forEach((x) => x())
        map.removeAnnotations(annotations)
      }
    },
    200,
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
