import MapBox from 'mapbox-gl';
import React from 'react';
import ReactMap, { MapContext } from 'react-mapbox-gl';
import { useOvermind } from '../../../lib/store/overmind';
import Marker from './Marker';
import './style.scss';
import {debounce} from '../../../utils/debounce'
import {isWithinBounds} from '../../../utils/isWithinBounds'
import { Restaurant } from '@dish/models';


const accessToken = 'pk.eyJ1IjoidG9tYmgiLCJhIjoiY2p4cWlqNnY1MDFhZDNscXc5YXJpcTJzciJ9.7gGR5t8KEAY0ZoXfTVBcng';

const MapComponent = ReactMap({
  accessToken,
})

export default () => {

  const debouncedSearch = debounce((map) => {
    actions.updateRestaurants({centre: map.getCenter(), bounds: map.getBounds()})
  }, 100, false)

  const { state, actions, reaction } = useOvermind()
  
  // @ts-ignore
  const onInit = (map) => {
  

  }
  const updateMap = (map: MapBox.Map, _event: React.SyntheticEvent) => {

      debouncedSearch(map)

  }


  return (
    <div>
      <nav id='dish-sidebar'>
        {
          <div id='dish-sidebar-title'>
            <small>Welcome to Dish</small>
            <small>{state.getWithinCurrentBounds.length} Results</small>
          </div>
        }
        <hr/>
        <div id='dish-sidebar-content'>
          <ul>
            {
              state.getWithinCurrentBounds.map((restaurant: Restaurant) => {
                return (<li>
                  <img src={restaurant.image}/>
                    <hgroup>
                      <h5>{restaurant.name}</h5>
                      <small>{restaurant.description}</small>
                    </hgroup>
                  </li>)
              })
            }
          </ul>
        </div>
      </nav>
      <MapComponent
        center={state.map.center}
        zoom={state.map.zoom}
        onRender={updateMap} 
        containerStyle={{height: '100vh'}}
        style='mapbox://styles/mapbox/streets-v9'>
        
        {
          state.getWithinCurrentBounds.map((restaurant: Restaurant) => (
            <Marker 
              key={restaurant.id}
              coordinates={[
                restaurant.location.coordinates[0],
                restaurant.location.coordinates[1]
              ]}
            />
          ))
        }

        {}
        <MapContext.Consumer>
          {(map):any => { onInit(map) }}
        </MapContext.Consumer>
      </MapComponent>
    </div>
  )
}