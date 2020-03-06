import { Dish, Restaurant, ScrapeData } from '@dish/models'
import { LngLat } from 'mapbox-gl'
import { Action, AsyncAction } from 'overmind'
import SlidingUpPanel from 'rn-sliding-up-panel'
import { Dimensions } from 'react-native'

type LabState = {
  restaurants: { [key: string]: Restaurant }
  selected: {
    id: string
    model: Restaurant
  }
  panel: SlidingUpPanel
  centre: LngLat
  search_results: Partial<Restaurant>
}

const RADIUS = 0.015

export const state: LabState = {
  restaurants: {},
  selected: {
    id: '',
    model: {} as Restaurant,
  },
  panel: {} as SlidingUpPanel,
  centre: {} as LngLat,
  search_results: [] as Partial<Restaurant>,
}

const updateRestaurants: AsyncAction<LngLat> = async (om, centre: LngLat) => {
  const restaurants = await Restaurant.findNear(centre.lat, centre.lng, RADIUS)
  for (const restaurant of restaurants) {
    om.state.map.restaurants[restaurant.id] = restaurant
  }
}

const setSelected: Action<string> = (om, id: string) => {
  const height = Dimensions.get('window').height
  om.state.map.selected.id = id
  om.actions.map.getAllDataForRestaurant()
  om.state.map.panel.show(height / 2)
}

const setPanel: Action<SlidingUpPanel> = (om, panel: SlidingUpPanel) => {
  om.state.map.panel = panel
}

const getAllDataForRestaurant: AsyncAction = async om => {
  const restaurant = new Restaurant()
  await restaurant.findOne('id', om.state.map.selected.id)
  om.state.map.selected.model = restaurant
}

const getTopDishes: AsyncAction = async om => {}

const restaurantSearch: AsyncAction<string> = async (om, query: string) => {
  om.state.map.search_results = [{ name: 'searching...' }]
  om.state.map.search_results = await Restaurant.search(
    om.state.map.centre.lat,
    om.state.map.centre.lng,
    RADIUS,
    query
  )
}

const setMapCentre: Action<LngLat> = (om, centre: LngLat) => {
  om.state.map.centre = centre
}

export const actions = {
  updateRestaurants: updateRestaurants,
  setSelected: setSelected,
  getAllDataForRestaurant: getAllDataForRestaurant,
  setPanel: setPanel,
  getTopDishes: getTopDishes,
  restaurantSearch: restaurantSearch,
  setMapCentre: setMapCentre,
}
