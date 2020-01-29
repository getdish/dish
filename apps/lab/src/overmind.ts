import { Action, AsyncAction, IConfig } from 'overmind'
import { createHook } from 'overmind-react'
import { Restaurant, Dish } from '@dish/models'
import { LngLat } from 'mapbox-gl'

type LabState = {
  dishes: { [key: string]: Dish[] }
  restaurants: { [key: string]: Restaurant }
  selected: string
  stats: {
    restaurant_count: number
    dish_count: number
  }
}

let state: LabState = {
  dishes: {},
  restaurants: {},
  selected: '',
  stats: {
    restaurant_count: 0,
    dish_count: 0,
  },
}

const updateRestaurants: AsyncAction<LngLat> = async (
  { state }: { state: LabState },
  centre: LngLat
) => {
  const restaurants = await Restaurant.findNear(centre.lat, centre.lng, 1000)
  for (const restaurant of restaurants) {
    state.restaurants[restaurant.id] = restaurant
    state.dishes[restaurant.id] = restaurant.dishes
  }
}

const setSelected: Action<string> = (
  { state }: { state: LabState },
  id: string
) => {
  state.selected = id
}

const getStats: AsyncAction = async ({ state }: { state: LabState }) => {
  state.stats.restaurant_count = await Restaurant.allRestaurantsCount()
  state.stats.dish_count = await Dish.allDishesCount()
}

export const config = {
  state: state,
  actions: {
    updateRestaurants: updateRestaurants,
    setSelected: setSelected,
    getStats: getStats,
  },
}

declare module 'overmind' {
  interface Config extends IConfig<typeof config> {}
}

export const useOvermind = createHook<typeof config>()
