import { Action, AsyncAction, IConfig } from 'overmind'
import { createHook } from 'overmind-react'
import { Restaurant, Dish, Scrape, ScrapeData } from '@dish/models'
import { LngLat } from 'mapbox-gl'

type LabState = {
  restaurants: { [key: string]: Restaurant }
  selected: {
    id: string
    model: Restaurant
    scrape: ScrapeData
  }
  stats: {
    restaurant_count: number
    dish_count: number
    scrape_count: number
  }
}

let state: LabState = {
  restaurants: {},
  selected: {
    id: '',
    model: {} as Restaurant,
    scrape: {},
  },
  stats: {
    restaurant_count: 0,
    dish_count: 0,
    scrape_count: 0,
  },
}

const updateRestaurants: AsyncAction<LngLat> = async (
  { state }: { state: LabState },
  centre: LngLat
) => {
  const restaurants = await Restaurant.findNear(centre.lat, centre.lng, 0.015)
  for (const restaurant of restaurants) {
    state.restaurants[restaurant.id] = restaurant
  }
}

const setSelected: Action<string> = (
  { state }: { state: LabState },
  id: string
) => {
  state.selected.id = id
}

const getAllDataForRestaurant: AsyncAction = async ({
  state,
}: {
  state: LabState
}) => {
  const restaurant = new Restaurant()
  await restaurant.findOne('id', state.selected.id)
  state.selected.model = restaurant
  const scrape = await Restaurant.getLatestScrape(
    'yelp',
    state.restaurants[state.selected.id].name
  )
  state.selected.scrape = scrape[0]
}

const getStats: AsyncAction = async ({ state }: { state: LabState }) => {
  state.stats.restaurant_count = await Restaurant.allCount()
  state.stats.dish_count = await Dish.allCount()
  state.stats.scrape_count = await Scrape.allCount()
}

export const config = {
  state: state,
  actions: {
    updateRestaurants: updateRestaurants,
    setSelected: setSelected,
    getStats: getStats,
    getAllDataForRestaurant: getAllDataForRestaurant,
  },
}

declare module 'overmind' {
  interface Config extends IConfig<typeof config> {}
}

export const useOvermind = createHook<typeof config>()
