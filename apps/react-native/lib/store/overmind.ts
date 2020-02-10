import { Action, AsyncAction, IConfig } from 'overmind'
import { createHook } from 'overmind-react'
import MapBox, { LngLatBounds, Popup } from 'mapbox-gl'
import { Restaurant, Dish } from '@dish/models'
import { LngLat } from 'mapbox-gl'
import { MapState } from '../../types'
import { isWithinBounds } from '../../utils/isWithinBounds'

type MapAppState = {
  dishes: { [key: string]: Dish[] }
  restaurants: { [key: string]: Restaurant }
  selected: string
  stats: {
    restaurant_count: number
    dish_count: number
  },
  map: MapState,
  getWithinCurrentBounds: Restaurant[]
}

let state: MapAppState = {
  dishes: {},
  restaurants: {},
  selected: '',
  stats: {
    restaurant_count: 0,
    dish_count: 0,
  },
  map: {
    center: [-122.421351, 37.759251],
    zoom: [13],
    bounds: {} as LngLatBounds,
  },
  get getWithinCurrentBounds(): Restaurant[] {
    let result = Object.values(this.restaurants).filter(x => isWithinBounds(x.location.coordinates, this.map.bounds)).slice(0, 30)
    console.log(result) 
    return result
  }
}

const setSelected: Action<string> = (
  { state }: { state: MapAppState },
  id: string
) => {
  state.selected = id
}

const updateRestaurants: AsyncAction<LngLat> = async (
  { state }: { state: MapAppState },
  {centre, bounds}: { centre: LngLat, bounds: any }
) => {
  state.map.bounds = bounds
  console.log('finding ... ')
  const restaurants = await Restaurant.findNear(centre.lat, centre.lng, .05)
  console.log(restaurants)
  console.log(restaurants.length)
  for (const restaurant of restaurants) {
    state.restaurants[restaurant.id] = restaurant
    state.dishes[restaurant.id] = restaurant.dishes
  }
}


const setMapState: Action<MapState> = (
  { state }: { state: MapAppState },
  mapState: MapState
) => {
  state.map = mapState
}

const getStats: AsyncAction = async ({ state }: { state: MapAppState }) => {
  const r1 = await Restaurant.allRestaurantsCount()
  state.stats.restaurant_count =
    r1.data.data.restaurant_aggregate.aggregate.count
  const r2 = await Dish.allDishesCount()
  state.stats.dish_count = r2.data.data.dish_aggregate.aggregate.count
}

export const config = {
  state: state,
  actions: {
    setSelected: setSelected,
    updateRestaurants,
    getStats: getStats,
    setMapState
  },
}

declare module 'overmind' {
  interface Config extends IConfig<typeof config> {}
}

export const useOvermind = createHook<typeof config>()
