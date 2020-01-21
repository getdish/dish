import React, { Component } from 'react'
import ReactMap, { Feature, Layer } from 'react-mapbox-gl'
import MapBox, { LngLatBounds, LngLat } from 'mapbox-gl'

import { Restaurant } from '@dish/models'

const accessToken =
  'pk.eyJ1IjoidG9tYmgiLCJhIjoiY2p4cWlqNnY1MDFhZDNscXc5YXJpcTJzciJ9.7gGR5t8KEAY0ZoXfTVBcng'
const style = 'mapbox://styles/mapbox/streets-v9'

const Map = ReactMap({
  accessToken,
})

const mapStyle = {
  height: '100vh',
  width: '100vw',
}

type State = {
  center: [number, number]
  zoom: [number]
  restaurants: { [key: string]: Restaurant }
}

class App extends Component<{}, State> {
  bounds!: LngLatBounds

  public state: State = {
    center: [-122.421351, 37.759251],
    zoom: [13],
    restaurants: {},
  }

  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <Map
        style={style}
        center={this.state.center}
        zoom={this.state.zoom}
        containerStyle={mapStyle}
        onRender={this.updateMap.bind(this)}
      >
        <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
          {Object.keys(this.state.restaurants).map(key => (
            <Feature
              key={this.state.restaurants[key].data.name}
              coordinates={[
                this.state.restaurants[key].data.location.coordinates[0],
                this.state.restaurants[key].data.location.coordinates[1],
              ]}
            />
          ))}
        </Layer>
      </Map>
    )
  }

  updateMap(map: MapBox.Map, _event: React.SyntheticEvent) {
    if (typeof this.bounds == 'undefined') {
      this.bounds = map.getBounds()
    }
    if (this.isBoundsChanged(map.getBounds())) {
      this.bounds = map.getBounds()
      this.updateRestaurants(map.getCenter())
    }
  }

  isBoundsChanged(new_bounds: LngLatBounds) {
    return this.bounds.toString() !== new_bounds.toString()
  }

  async updateRestaurants(centre: LngLat) {
    const r = new Restaurant()
    const response = await r.findNear(centre.lat, centre.lng, 1000)
    for (const data of response.data.data.restaurant) {
      const restaurant = new Restaurant()
      restaurant.data = data
      this.state.restaurants[data['name']] = restaurant
    }
    this.setState({ restaurants: this.state.restaurants })
  }
}

export default App
