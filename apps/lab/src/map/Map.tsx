import MapBox, { LngLatBounds, Popup } from 'mapbox-gl'
import React, { useState } from 'react'
import ReactMap, { Feature, Layer } from 'react-mapbox-gl'

import { useOvermind } from '../overmind'

const accessToken =
  'pk.eyJ1IjoidG9tYmgiLCJhIjoiY2p4cWlqNnY1MDFhZDNscXc5YXJpcTJzciJ9.7gGR5t8KEAY0ZoXfTVBcng'
const style = 'mapbox://styles/mapbox/streets-v9'

const MapComponent = ReactMap({
  accessToken,
})

const mapStyle = {
  height: '100vh',
}

type MapState = {
  center: [number, number]
  zoom: [number]
  bounds: LngLatBounds
}

const Map = () => {
  const initialState: MapState = {
    center: [-122.421351, 37.759251],
    zoom: [15],
    bounds: {} as LngLatBounds,
  }
  const [mapState, setMapState] = useState(initialState)

  const { state, actions } = useOvermind()

  const popup = new Popup({
    closeButton: false,
    closeOnClick: false,
  })

  const updateMap = (map: MapBox.Map, _event: React.SyntheticEvent) => {
    if (
      mapState.bounds == ({} as LngLatBounds) ||
      isBoundsChanged(map.getBounds())
    ) {
      mapState.bounds = map.getBounds()
      setMapState(mapState)
      actions.map.updateRestaurants(map.getCenter())
    }
  }

  const isBoundsChanged = (new_bounds: LngLatBounds) => {
    return mapState.bounds.toString() !== new_bounds.toString()
  }

  return (
    <MapComponent
      style={style}
      center={mapState.center}
      zoom={mapState.zoom}
      containerStyle={mapStyle}
      onRender={updateMap}
    >
      <Layer
        type="symbol"
        id="marker"
        // See: https://github.com/mapbox/mapbox-gl-styles/blob/master/README.md
        layout={{ 'icon-image': 'restaurant-15' }}
      >
        {Object.keys(state.map.restaurants).map(key => (
          <Feature
            key={state.map.restaurants[key].id}
            properties={{
              uuid: state.map.restaurants[key].id,
              name: state.map.restaurants[key].name,
              image: state.map.restaurants[key].image,
            }}
            coordinates={[
              state.map.restaurants[key].location.coordinates[0],
              state.map.restaurants[key].location.coordinates[1],
            ]}
            onMouseEnter={(mapWithEvt: any) => {
              popup
                .setLngLat(mapWithEvt.lngLat)
                .setHTML(
                  `
                  <img width="60px" src="${mapWithEvt.feature.properties.image}">
                  &nbsp;${mapWithEvt.feature.properties.name}<br />
                  `
                )
                .addTo(mapWithEvt.map)
            }}
            onMouseLeave={(_mapWithEvt: any) => {
              popup.remove()
            }}
            onClick={(mapWithEvt: any) => {
              const id = mapWithEvt.feature.properties.uuid
              actions.map.setSelected(id)
              actions.map.getAllDataForRestaurant()
            }}
          />
        ))}
      </Layer>
    </MapComponent>
  )
}

export default Map
