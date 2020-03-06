import { Dish, Restaurant, ScrapeData } from '@dish/models'
import { LngLat } from 'mapbox-gl'
import { Action, AsyncAction } from 'overmind'

type LabState = {
  restaurants: { [key: string]: Restaurant }
  selected: {
    id: string
    model: Restaurant
    scrapes: {
      [source: string]: ScrapeData
    }
  }
  stats: {
    restaurant_count: number
    dish_count: number
    scrape_count: number
  }
}

export const state: LabState = {
  restaurants: {},
  selected: {
    id: '',
    model: {} as Restaurant,
    scrapes: {
      yelp: {},
      ubereats: {},
    },
  },
  stats: {
    restaurant_count: 0,
    dish_count: 0,
    scrape_count: 0,
  },
}

const updateRestaurants: AsyncAction<LngLat> = async (om, centre: LngLat) => {
  const restaurants = await Restaurant.findNear(centre.lat, centre.lng, 0.015)
  for (const restaurant of restaurants) {
    om.state.map.restaurants[restaurant.id] = restaurant
  }
}

const setSelected: Action<string> = (om, id: string) => {
  om.state.map.selected.id = id
}

const getAllDataForRestaurant: AsyncAction = async om => {
  const restaurant = new Restaurant()
  await restaurant.findOne('id', state.selected.id)
  om.state.map.selected.model = restaurant
}

export const actions = {
  updateRestaurants: updateRestaurants,
  setSelected: setSelected,
  getAllDataForRestaurant: getAllDataForRestaurant,
}
