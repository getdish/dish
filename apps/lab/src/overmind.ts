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
  const response = await Restaurant.findNear(centre.lat, centre.lng, 1000)
  for (const data of response.data.data.restaurant) {
    const restaurant = new Restaurant()
    restaurant.data = data
    state.restaurants[data.id] = restaurant
    state.dishes[data.id] = data.dishes.map((item: any) => {
      const dish = new Dish()
      dish.data = item
      return dish
    })
  }
}

const setSelected: Action<string> = (
  { state }: { state: LabState },
  id: string
) => {
  state.selected = id
}

const getStats: AsyncAction = async ({ state }: { state: LabState }) => {
  const r1 = await Restaurant.allRestaurantsCount()
  state.stats.restaurant_count =
    r1.data.data.restaurant_aggregate.aggregate.count
  const r2 = await Dish.allDishesCount()
  state.stats.dish_count = r2.data.data.dish_aggregate.aggregate.count
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
