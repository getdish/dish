import React, { useState, useEffect, useMemo } from 'react'
import { MapkitProvider, Map, useMap as useMap_ } from 'react-mapkit'

const mapkitToken = `eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkwzQ1RLNTYzUlQifQ.eyJpYXQiOjE1ODQ0MDU5MzYuMjAxLCJpc3MiOiIzOTlXWThYOUhZIn0.wAw2qtwuJkcL6T6aI-nLZlVuwJZnlCNg2em6V1uopx9hkUgWZE1ISAWePMoRttzH_NPOem4mQfrpmSTRCkh2bg`

import { useOvermind } from '../../state/om'
import { VStack, ZStack, HStack } from '../shared/Stacks'
import { RegionType } from 'react-mapkit/dist/utils'
import { useHomeDrawerWidth } from './HomeMainPane'
import { View, Text, Button } from 'react-native'
import _ from 'lodash'
import { Spacer } from '../shared/Spacer'

type UseMapProps = Pick<
  mapkit.MapConstructorOptions,
  | 'rotation'
  | 'tintColor'
  | 'colorScheme'
  | 'mapType'
  | 'showsMapTypeControl'
  | 'isRotationEnabled'
  | 'showsCompass'
  | 'isZoomEnabled'
  | 'showsZoomControl'
  | 'isScrollEnabled'
  | 'showsScale'
  | 'annotationForCluster'
  | 'annotations'
  | 'selectedAnnotation'
  | 'overlays'
  | 'selectedOverlay'
  | 'showsPointsOfInterest'
  | 'showsUserLocation'
  | 'tracksUserLocation'
  | 'showsUserLocationControl'
> & {
  visibleMapRect?: [number, number, number, number] | undefined
  region?: RegionType | undefined
  center?: [number, number] | undefined
  padding?: number | mapkit.PaddingConstructorOptions | undefined
}

const useMap = (props: UseMapProps) => {
  return useMap_(props)
}

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
  return (
    <MapkitProvider tokenOrCallback={mapkitToken}>
      <HomeMap />
    </MapkitProvider>
  )
}

function HomeMap() {
  const om = useOvermind()
  const drawerWidth = useHomeDrawerWidth()
  const state = om.state.home.currentState
  const centre = state.centre
  const {
    mapkit,
    map,
    mapProps,
    // setRotation,
    // setCenter,
    // setVisibleMapRect,
  } = useMap({
    center: [centre.lat, centre.lng],
    showsZoomControl: false,
    showsMapTypeControl: false,
    isZoomEnabled: true,
    isScrollEnabled: true,
    padding: {
      left: drawerWidth + 40,
      top: 40,
      bottom: 40,
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
        location: [centre.lng, centre.lat],
        span: 0.1,
      })
    }
  }, [map])

  const [selected, setSelected] = useState('')

  const curRestaurant = state.type == 'restaurant' ? state.restaurant : null
  const restaurants = _.uniqBy(
    [
      ...(state.type == 'home' ? state.top_restaurants ?? [] : []),
      ...(state.type == 'search'
        ? state.results.status == 'complete'
          ? state.results.results.restaurants
          : []
        : []),
      curRestaurant,
    ].filter(x => !!x?.location?.coordinates),
    x => x.id
  )

  const restaurantIds = restaurants.map(x => x.id).join('')
  const restaurantSelected = restaurants.find(x => x.id == selected)
  const coordinates = useMemo(
    () =>
      mapkit
        ? restaurants
            .map(
              restaurant =>
                !!restaurant.location?.coordinates &&
                new mapkit.Coordinate(
                  restaurant.location.coordinates[1],
                  restaurant.location.coordinates[0]
                )
            )
            .filter(Boolean)
        : [],
    [restaurantIds]
  )
  const annotations = useMemo(
    () =>
      mapkit
        ? restaurants.map(
            (restaurant, index) =>
              new mapkit.MarkerAnnotation(coordinates[index], {
                glyphText: index <= 10 ? `${index + 1}` : ``,
                data: {
                  id: restaurant.id,
                },
              })
          )
        : [],
    [restaurantIds]
  )

  const hoveredRestaurant = om.state.home.hoveredRestaurant
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
      span: 0.1,
    })
  }, [!!map, mapkit, curRestaurant])

  useEffect(() => {
    if (!restaurantSelected) return
    map.setCenterAnimated(
      coordinates[restaurants.findIndex(x => x.id === restaurantSelected.id)],
      true
    )
  }, [restaurantSelected])

  useEffect(() => {
    if (!map) return
    if (!restaurants.length) return

    const cancels = new Set<Function>()

    const cb = e => {
      const selected = e.annotation.data.id || ''
      setSelected(selected)
      console.log('selected', selected)
    }
    map.addEventListener('select', cb)
    cancels.add(() => map.removeEventListener('select', cb))

    console.log('SHOW ANNOTATIONS', annotations)
    map.showItems(annotations, { animate: true })

    return () => {
      cancels.forEach(x => x())
      map.removeAnnotations(annotations)
    }
  }, [!!map, restaurantIds])

  return (
    <ZStack width="100%" height="100%">
      <Map {...mapProps} />

      <ZStack fullscreen padding={20} pointerEvents="none">
        <VStack flex={1}>
          <HStack>
            <Spacer flex />

            <HStack pointerEvents="auto">
              <Button title="🧭" onPress={() => {}} />
            </HStack>
          </HStack>
          <Spacer flex />
        </VStack>
        <Text>{restaurantSelected?.id ?? 'none selected'}</Text>
      </ZStack>
    </ZStack>
  )
}
