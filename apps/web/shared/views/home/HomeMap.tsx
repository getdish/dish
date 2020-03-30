import _ from 'lodash'
import React, { memo, useEffect, useMemo, useState } from 'react'

import { useDebounceValue } from '../../hooks/useDebounce'
import { LngLat } from '../../state/home'
import { useOvermind } from '../../state/om'
import { Map, useMap } from '../map'
import { mapkit } from '../mapkit'
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

export default function HomeMapContainer() {
  return <HomeMap />
}

const HomeMap = memo(() => {
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
      left: drawerWidth + 40,
      top: 15,
      bottom: 15,
      right: 20,
    },
  })

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

    map.addEventListener('select', (e) => {
      console.log('select', e, map)
    })

    map.addEventListener('deselect', (e) => {
      console.log('deselect', e, map)
    })

    map.addEventListener('region-change-end', (e) => {
      console.log('region-change-end', e)
      const span = map.region.span
      console.log('span', span)
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

    map.addEventListener('drag-start', (e) => {
      console.log('drag-start', e, map)
    })

    map.addEventListener('drag-end', (e) => {
      console.log('drag-end', e, map)
    })

    map.addEventListener('user-location-change', (e) => {
      console.log('user-location-change', e, map)
    })
  }, [map])

  const [focused, setFocused] = useState('')

  const restaurantDetail = state.type == 'restaurant' ? state.restaurant : null
  const prevResults: string[] =
    (state.type == 'restaurant' &&
      om.state.home.previousState?.type == 'search' &&
      om.state.home.previousState?.results.status === 'complete' &&
      om.state.home.previousState?.results.results.restaurantIds) ||
    []

  const allRestaurants = om.state.home.restaurants
  const searchResults =
    state.type == 'search'
      ? state.results.status == 'complete'
        ? state.results.results.restaurantIds ?? []
        : []
      : []

  const restaurantIds: string[] = _.uniq(
    [...searchResults, ...prevResults, restaurantDetail?.id].filter(
      (id) => !!id && !!allRestaurants[id]?.location?.coordinates
    )
  )

  const restaurants = restaurantIds.map((id) => allRestaurants[id])
  const restaurantsVersion = restaurantIds.join('')
  const focusedRestaurant = restaurants.find((x) => x.id == focused)
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

  // Navigate - return to previous map position
  useEffect(() => {
    if (!map) return
    centerMapToRegion({
      map,
      center: state.center,
      span: state.span,
    })
  }, [map, om.state.home.states.length])

  // Search - hover restaurant
  useEffect(() => {
    if (!map) return
    return om.reaction(
      (state) => state.home.hoveredRestaurant,
      (hoveredRestaurant) => {
        if (!hoveredRestaurant) return
        console.log('hovered restaurant', hoveredRestaurant)
        const index = restaurantIds.indexOf(hoveredRestaurant.id)
        if (map.annotations[index]) {
          map.annotations[index].selected = true
        }
      }
    )
  }, [map, restaurantIds])

  // Detail - center to restaurant
  const restaurantDelayed = useDebounceValue(restaurantDetail, 250)
  useEffect(() => {
    if (!map || !mapkit || !restaurantDelayed?.location) return
    console.log('center map to', restaurantDelayed)
    centerMapToRegion({
      map,
      center: {
        lat: restaurantDelayed.location.coordinates[1],
        lng: restaurantDelayed.location.coordinates[0],
      },
      span: state.span,
    })
  }, [!!map, mapkit, restaurantDelayed])

  // selected on map
  useEffect(() => {
    if (!focusedRestaurant) return
    if (!map) return
    console.log('center app to selected', focusedRestaurant)
    // map.setCenterAnimated(
    //   coordinates[restaurants.findIndex((x) => x.id === focusedRestaurant.id)],
    //   true
    // )
  }, [map, focusedRestaurant])

  // update annotations
  useEffect(() => {
    if (!map) return
    if (!restaurants.length) return
    const cancels = new Set<Function>()
    const cb = (e) => {
      const selected = e.annotation.data.id || ''
      setFocused(selected)
      console.log('selected', selected)
    }
    map.addEventListener('select', cb)
    cancels.add(() => map.removeEventListener('select', cb))

    // map.showAnnotations(annotations)
    console.log('render annotations')
    for (const annotation of annotations) {
      map.addAnnotation(annotation)
    }

    // map.showItems(annotations, {
    //   animate: false,
    //   minimumSpan: createCoordinateSpan(radius, radius),
    // })

    return () => {
      cancels.forEach((x) => x())
      map.removeAnnotations(annotations)
    }
  }, [!!map, restaurantsVersion])

  return (
    <ZStack width="100%" height="100%">
      <Map {...mapProps} />
    </ZStack>
  )
})
