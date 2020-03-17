import React, { useState, useEffect } from 'react'
import { MapkitProvider, Map, useMap as useMap_, Marker } from 'react-mapkit'

import { useHistory } from 'react-router-dom'

const mapkitToken = `eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkwzQ1RLNTYzUlQifQ.eyJpYXQiOjE1ODQ0MDU5MzYuMjAxLCJpc3MiOiIzOTlXWThYOUhZIn0.wAw2qtwuJkcL6T6aI-nLZlVuwJZnlCNg2em6V1uopx9hkUgWZE1ISAWePMoRttzH_NPOem4mQfrpmSTRCkh2bg`

import { useOvermind } from '../../state/om'
import { VStack } from '../shared/Stacks'
import { RegionType } from 'react-mapkit/dist/utils'
import { useWindowSize } from '../../hooks/useWindowSize'
import { useHomeDrawerWidth } from './HomeMainPane'
import { LabAuth } from '../auth'

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

type MapState = {
  zoom: [number]
  bounds: any
}

export default function HomeMapContainer() {
  let history = useHistory()
  return (
    <MapkitProvider tokenOrCallback={mapkitToken}>
      <HomeMap />
    </MapkitProvider>
  )
}

function HomeMap() {
  const om = useOvermind()
  const drawerWidth = useHomeDrawerWidth()
  const { map, mapProps, setRotation, setCenter, setVisibleMapRect } = useMap({
    center: [37.759251, -122.421351],
    showsZoomControl: false,
    showsMapTypeControl: false,
    isZoomEnabled: true,
    isScrollEnabled: true,
    padding: {
      left: drawerWidth * 0.5,
    },
  })

  useEffect(() => {
    console.log('map', map, 'mapkit', window['mapkit'])
    if (map) {
      map['_allowWheelToZoom'] = true
    }
  }, [map])

  const restaurants = om.state.home.top_restaurants

  useEffect(() => {
    if (!map) {
      return
    }
    const annotations = restaurants.map(
      restaurant =>
        new mapkit.Annotation(
          new mapkit.Coordinate(
            restaurant.location.coordinates[1],
            restaurant.location.coordinates[0]
          ),
          x => document.createElement('div'),
          {}
        )
    )
    map.showItems(annotations)
  }, [!!map, restaurants.map(x => x.id).join('')])

  return (
    <>
      <Map {...mapProps}>
        {restaurants.map((restaurant, key) => (
          <Marker
            key={key}
            latitude={restaurant.location.coordinates[1]}
            longitude={restaurant.location.coordinates[0]}
            clusteringIdentifier="1"
          />
        ))}
      </Map>
    </>
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
