import React, { useState, useEffect, useMemo } from 'react'

import { useOvermind } from '../../state/om'
import { VStack, ZStack, HStack } from '../shared/Stacks'
import { Text, Button } from 'react-native'
import _ from 'lodash'
import { Spacer } from '../shared/Spacer'
import { useMap, Map } from '../map'
import { useHomeDrawerWidth } from './HomeView'
import { HomeUserMenu } from './HomeUserMenu'

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

  // set initial zoom level
  useEffect(() => {
    if (map) {
      centerMapToRegion({
        map,
        location: [center.lng, center.lat],
        span: span,
      })
    }
  }, [map])

  const [selected, setSelected] = useState('')

  const curRestaurant = state.type == 'restaurant' ? state.restaurant : null
  const prevResults =
    (state.type == 'restaurant' &&
      om.state.home.previousState?.type == 'search' &&
      om.state.home.previousState?.results.status === 'complete' &&
      om.state.home.previousState?.results.results.restaurants) ||
    []

  const restaurants = _.uniqBy(
    [
      ...(state.type == 'home' ? state.top_restaurants ?? [] : []),
      ...(state.type == 'search'
        ? state.results.status == 'complete'
          ? state.results.results.restaurants
          : []
        : []),
      ...prevResults,
      curRestaurant,
    ].filter((x) => !!x?.location?.coordinates),
    (x) => x.id
  )

  const restaurantIds = restaurants.map((x) => x.id)
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

  const { hoveredRestaurant } = om.state.home
  useEffect(() => {
    if (hoveredRestaurant) {
      const index = restaurantIds.indexOf(hoveredRestaurant.id)
      if (map.annotations[index]) {
        map.annotations[index].selected = true
      }
    }
  }, [hoveredRestaurant])

  useEffect(() => {
    if (!map || !mapkit || !curRestaurant || !curRestaurant.location) return
    centerMapToRegion({
      map,
      location: curRestaurant.location.coordinates,
      span: 0.09,
    })
  }, [!!map, mapkit, curRestaurant])

  useEffect(() => {
    if (!restaurantSelected) return
    // map.setCenterAnimated(
    //   coordinates[restaurants.findIndex((x) => x.id === restaurantSelected.id)],
    //   true
    // )
  }, [restaurantSelected])

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

      <ZStack fullscreen padding={20} pointerEvents="none" left={drawerWidth}>
        <VStack flex={1}>
          <HStack>
            <VStack></VStack>

            <Spacer flex />

            <HStack pointerEvents="auto">
              <HomeUserMenu />
            </HStack>
          </HStack>
          <Spacer flex />
        </VStack>
        <Text>{restaurantSelected?.id ?? 'none selected'}</Text>
      </ZStack>
    </ZStack>
  )
}
