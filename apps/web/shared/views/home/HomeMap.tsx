import React, { useState, useEffect, useMemo } from 'react'

import { useOvermind } from '../../state/om'
import { VStack, ZStack, HStack } from '../shared/Stacks'
import { Text, Button, TouchableOpacity, Image } from 'react-native'
import _ from 'lodash'
import { Spacer } from '../shared/Spacer'
import { useMap, Map } from '../map'
import { useHomeDrawerWidth } from './HomeView'
import { useDebounceValue } from '../../hooks/useDebounce'
import { useOnMount } from '../../hooks/useOnMount'

function centerMapToRegion({
  map,
  location,
  span,
}: {
  map: mapkit.Map
  location: [number, number]
  span: number
}) {
  const newCenter = new mapkit.Coordinate(location[1], location[0])
  const coordspan = new mapkit.CoordinateSpan(span, span)
  const region = new mapkit.CoordinateRegion(newCenter, coordspan)
  map.setRegionAnimated(region)
}

export default function HomeMapContainer() {
  return <HomeMap />
}

function HomeMap() {
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
    center: [center.lat, center.lng],
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
      location: [center.lng, center.lat],
      span: span,
    })

    map.addEventListener('select', (e) => {
      console.log('select', e)
    })

    map.addEventListener('deselect', (e) => {
      console.log('deselect', e)
    })

    map.addEventListener('region-change-end', (e) => {
      console.log('region-change-end', e)
    })

    map.addEventListener('drag-start', (e) => {
      console.log('drag-start', e)
    })

    map.addEventListener('drag-end', (e) => {
      console.log('drag-end', e)
    })

    map.addEventListener('user-location-change', (e) => {
      console.log('user-location-change', e)
    })
  }, [map])

  const [selected, setSelected] = useState('')

  const curRestaurant = state.type == 'restaurant' ? state.restaurant : null
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
    [...searchResults, ...prevResults, curRestaurant?.id].filter(
      (id) => !!id && !!allRestaurants[id]?.location?.coordinates
    )
  )

  const restaurants = restaurantIds.map((id) => allRestaurants[id])
  const restaurantsVersion = restaurantIds.join('')
  const restaurantSelected = restaurants.find((x) => x.id == selected)
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

  useEffect(() => {
    // hovering restaurants
    if (!map) return
    return om.reaction(
      (state) => state.home.hoveredRestaurant,
      (hoveredRestaurant) => {
        if (!hoveredRestaurant) return
        const index = restaurantIds.indexOf(hoveredRestaurant.id)
        console.log(
          'covering',
          index,
          hoveredRestaurant,
          map.annotations.length
        )
        if (map.annotations[index]) {
          map.annotations[index].selected = true
        }
      }
    )
  }, [map, restaurantIds])

  const curRestaurantD = useDebounceValue(curRestaurant, 250)
  useEffect(() => {
    if (!map || !mapkit || !curRestaurantD || !curRestaurantD.location) return
    centerMapToRegion({
      map,
      location: curRestaurantD.location.coordinates,
      span: 0.09,
    })
  }, [!!map, mapkit, curRestaurantD])

  useEffect(() => {
    if (!restaurantSelected) return
    if (!map) return
    map.setCenterAnimated(
      coordinates[restaurants.findIndex((x) => x.id === restaurantSelected.id)],
      true
    )
  }, [map, restaurantSelected])

  useEffect(() => {
    if (!map) return
    if (!restaurants.length) return

    const cancels = new Set<Function>()

    const cb = (e) => {
      const selected = e.annotation.data.id || ''
      setSelected(selected)
      console.log('selected', selected)
    }
    map.addEventListener('select', cb)
    cancels.add(() => map.removeEventListener('select', cb))

    console.log('SHOW ANNOTATIONS', annotations)
    map.showItems(annotations, { animate: true })

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
}
