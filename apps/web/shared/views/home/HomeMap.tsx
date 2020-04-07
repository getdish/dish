import _ from 'lodash'
import React, { memo, useEffect, useMemo, useState } from 'react'

import { searchBarHeight } from '../../constants'
import { useDebounceValue } from '../../hooks/useDebounce'
import { useDebounceEffect } from '../../hooks/useDebounceEffect'
import { LngLat } from '../../state/home'
import { useOvermind } from '../../state/om'
import { Map, useMap } from '../map'
// import { mapkit } from '../mapkit'
import { ZStack } from '../shared/Stacks'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

function centerMapToRegion(p: {
  map: mapkit.Map
  center: LngLat
  span: LngLat
}) {
  const newCenter = new mapkit.Coordinate(p.center.lat, p.center.lng)
  const coordspan = new mapkit.CoordinateSpan(p.span.lat, p.span.lng)
  const region = new mapkit.CoordinateRegion(newCenter, coordspan)
  p.map.setRegionAnimated(region)
}

export let mapView: any

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
  mapView = map

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

    // map.addEventListener('select', (e) => {
    // console.log('select', e, map)
    // })

    // map.addEventListener('deselect', (e) => {
    // console.log('deselect', e, map)
    // })

    map.addEventListener('region-change-end', (e) => {
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
    })

    // map.addEventListener('drag-start', (e) => {
    //   console.log('drag-start', e, map)
    // })

    // map.addEventListener('drag-end', (e) => {
    //   console.log('drag-end', e, map)
    // })

    // map.addEventListener('user-location-change', (e) => {
    //   console.log('user-location-change', e, map)
    // })
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
  const annotations = useMemo(
    () =>
      mapkit
        ? restaurants.map(
            (restaurant, index) =>
              new mapkit.MarkerAnnotation(coordinates[index], {
                glyphText: index <= 12 ? `${index + 1}` : ``,
                data: {
                  id: restaurant.id,
                },
              })
          )
        : [],
    [restaurantsVersion]
  )

  console.log('HomeMap', { mapkit, restaurantDetail, restaurantIds })

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

      const onMouseEnter = (e: MouseEvent) => {
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
      centerMapToRegion({
        map,
        center: state.center,
        span: state.span,
      })

      // react to changed center specifically
      return om.reaction(
        (state) => state.home.currentState.center,
        (center) => {
          centerMapToRegion({
            map,
            center,
            span: state.span,
          })
        }
      )
    },
    100,
    [map, om.state.home.states.length]
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
        map.annotations[index].selected = true
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
