import { Dish, Restaurant, Scrape, ScrapeData } from '@dish/models'
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
    om.state.home.restaurants[restaurant.id] = restaurant
  }
}

const setSelected: Action<string> = (om, id: string) => {
  om.state.home.selected.id = id
}

const getAllDataForRestaurant: AsyncAction = async om => {
  const restaurant = new Restaurant()
  await restaurant.findOne('id', state.selected.id)
  om.state.home.selected.model = restaurant
  om.state.home.selected.scrapes = {
    yelp: (await restaurant.getLatestScrape('yelp')).data,
    ubereats: (await restaurant.getLatestScrape('ubereats')).data,
  }
}

const getStats: AsyncAction = async om => {
  om.state.home.stats.restaurant_count = await Restaurant.allCount()
  om.state.home.stats.dish_count = await Dish.allCount()
  om.state.home.stats.scrape_count = await Scrape.allCount()
}

export const actions = {
  updateRestaurants: updateRestaurants,
  setSelected: setSelected,
  getStats: getStats,
  getAllDataForRestaurant: getAllDataForRestaurant,
}
