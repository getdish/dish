import React, { useState, useEffect, useMemo } from 'react'
import { MapkitProvider, Map, useMap as useMap_ } from 'react-mapkit'

const mapkitToken = `eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkwzQ1RLNTYzUlQifQ.eyJpYXQiOjE1ODQ0MDU5MzYuMjAxLCJpc3MiOiIzOTlXWThYOUhZIn0.wAw2qtwuJkcL6T6aI-nLZlVuwJZnlCNg2em6V1uopx9hkUgWZE1ISAWePMoRttzH_NPOem4mQfrpmSTRCkh2bg`

import { useOvermind } from '../../state/om'
import { VStack, ZStack } from '../shared/Stacks'
import { RegionType } from 'react-mapkit/dist/utils'
import { useHomeDrawerWidth } from './HomeMainPane'
import { View, Text } from 'react-native'
import _ from 'lodash'

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
  const {
    mapkit,
    map,
    mapProps,
    // setRotation,
    // setCenter,
    // setVisibleMapRect,
  } = useMap({
    center: [37.759251, -122.421351],
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

  const [state, setState] = useState({
    selected: '',
  })

  const curRestaurant = om.state.home.current_restaurant
  const restaurants = _.uniqBy(
    [...om.state.home.top_restaurants, curRestaurant].filter(
      x => !!x?.location?.coordinates
    ),
    x => x.id
  )

  const restaurantIds = restaurants.map(x => x.id).join('')
  const restaurantSelected = restaurants.find(x => x.id == state.selected)
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

  useEffect(() => {
    if (!map || !mapkit || !curRestaurant || !curRestaurant.location) return
    const newCenter = new mapkit.Coordinate(
      curRestaurant.location.coordinates[1],
      curRestaurant.location.coordinates[0]
    )
    const span = new mapkit.CoordinateSpan(0.01, 0.01)
    const region = new mapkit.CoordinateRegion(newCenter, span)
    console.log('going to region', newCenter, span, region)
    map.setRegionAnimated(region)
  }, [!!map, mapkit, curRestaurant])

  useEffect(() => {
    if (!restaurantSelected) return

    console.warn('SET CENTER')
    map.setCenterAnimated(
      coordinates[restaurants.findIndex(x => x.id === restaurantSelected.id)],
      true
    )

    // setCenter(restaurantSelected.location.coordinates, true)
  }, [restaurantSelected])

  useEffect(() => {
    if (!map) return
    if (!restaurants.length) return

    const cancels = new Set<Function>()

    const cb = e => {
      const selected = e.annotation.data.id || ''
      setState({ selected })
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

      <View style={{ position: 'absolute' }}>
        <VStack>
          <Text>{restaurantSelected?.id ?? 'none selected'}</Text>
        </VStack>
      </View>
    </ZStack>
  )
}

// const popup = new Popup({
//   closeButton: false,
//   closeOnClick: false,
// })

// const updateMap = (map: MapboxGL.Map, _event: React.SyntheticEvent) => {
//   if (
//     mapState.bounds == ({} as LngLatBounds) ||
//     isBoundsChanged(map.getBounds())
//   ) {
//     mapState.bounds = map.getBounds()
//     setMapState(mapState)
//     actions.home.setMapCentre(map.getCenter())
//     actions.home.updateRestaurants(map.getCenter())
//   }
// }

// const isBoundsChanged = (new_bounds: LngLatBounds) => {
//   return mapState.bounds.toString() !== new_bounds.toString()
// }

// <MapComponent
//   style={style}
//   center={[state.home.centre.lng, state.home.centre.lat]}
//   zoom={mapState.zoom}
//   containerStyle={mapStyle}
//   onRender={updateMap}
// >
//   <Layer
//     type="symbol"
//     id="marker"
//     // See: https://github.com/mapbox/mapbox-gl-styles/blob/master/README.md
//     layout={{ 'icon-image': 'restaurant-15' }}
//   >
//     {Object.keys(state.home.restaurants).map(key => (
//       <Feature
//         key={state.home.restaurants[key].id}
//         properties={{
//           uuid: state.home.restaurants[key].id,
//           name: state.home.restaurants[key].name,
//           image: state.home.restaurants[key].image,
//         }}
//         coordinates={[
//           state.home.restaurants[key].location.coordinates[0],
//           state.home.restaurants[key].location.coordinates[1],
//         ]}
//         onMouseEnter={(mapWithEvt: any) => {
// //           popup
// //             .setLngLat(mapWithEvt.lngLat)
// //             .setHTML(
// //               `
// //                <img width="60px" src="${mapWithEvt.feature.properties.image}">
// //                &nbsp;${mapWithEvt.feature.properties.name}<br />
// //                `
// //             )
// //             .addTo(mapWithEvt.map)
// //         }}
// //         onMouseLeave={(_mapWithEvt: any) => {
// //           popup.remove()
// //         }}
// //         onClick={(mapWithEvt: any) => {
// //           const id = mapWithEvt.feature.properties.uuid
// //           history.push('/e/' + id)
// //           popup.remove()
// //         }}
// //       />
// //     ))}
// //   </Layer>
// // </MapComponent>

// export default Map
