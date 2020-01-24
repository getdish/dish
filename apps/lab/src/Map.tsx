import React, { useState } from 'react'
import ReactMap, { Feature, Layer } from 'react-mapbox-gl'
import MapBox, { LngLatBounds, Popup } from 'mapbox-gl'

import { useOvermind } from './overmind'

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
    zoom: [13],
    bounds: {} as LngLatBounds,
  }
  const [mapState, setMapState] = useState(initialState)

  const { state, actions } = useOvermind()

  const popup = new Popup({
    closeButton: false,
    closeOnClick: false,
  })

  const updateMap = (map: MapBox.Map, _event: React.SyntheticEvent) => {
    if (mapState.bounds == ({} as LngLatBounds)) {
      mapState.bounds = map.getBounds()
      setMapState(mapState)
      actions.updateRestaurants(map.getCenter())
    }
    if (isBoundsChanged(map.getBounds())) {
      mapState.bounds = map.getBounds()
      setMapState(mapState)
      actions.updateRestaurants(map.getCenter())
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
        {Object.keys(state.restaurants).map(key => (
          <Feature
            key={state.restaurants[key].data.id}
            properties={{
              uuid: state.restaurants[key].data.id,
              name: state.restaurants[key].data.name,
              image: state.restaurants[key].data.image,
              dishes_count: Object.keys(state.dishes[key]).length,
            }}
            coordinates={[
              state.restaurants[key].data.location.coordinates[0],
              state.restaurants[key].data.location.coordinates[1],
            ]}
            onMouseEnter={(mapWithEvt: any) => {
              popup
                .setLngLat(mapWithEvt.lngLat)
                .setHTML(
                  `
                  <img width="60px" src="${mapWithEvt.feature.properties.image}">
                  &nbsp;${mapWithEvt.feature.properties.name}<br />
                  ${mapWithEvt.feature.properties.dishes_count} dishes
                  `
                )
                .addTo(mapWithEvt.map)
            }}
            onMouseLeave={(_mapWithEvt: any) => {
              popup.remove()
            }}
            onClick={(mapWithEvt: any) => {
              actions.setSelected(mapWithEvt.feature.properties.uuid)
            }}
          />
        ))}
      </Layer>
    </MapComponent>
  )
}

export default Map
