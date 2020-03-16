import { ModelBase, Restaurant, Review } from '@dish/models'
import { LngLat } from 'mapbox-gl'
import { Action, AsyncAction } from 'overmind'
import SlidingUpPanel from 'rn-sliding-up-panel'
import { Dimensions, AccessibilityEventName } from 'react-native'
import Bottom, { bottomPanel } from '../views/map/MainPane'

type TopDish = {
  category: string
  frequency: number
}

type SearchResults = {
  status: 'loading' | 'complete'
  results: Partial<Restaurant>[]
}

type HomeState = {
  restaurants: { [key: string]: Restaurant }
  panel: SlidingUpPanel
  centre: LngLat
  search_results: SearchResults | null
  top_dishes: TopDish[]
  top_restaurants: Restaurant[]
  current_dish: string
  current_restaurant: Restaurant
  current_review: Review
  restaurant_reviews: Review[]
  user_reviews: Review[]
}

const RADIUS = 0.015

export const state: HomeState = {
  restaurants: {},
  panel: {} as SlidingUpPanel,
  centre: { lng: -122.421351, lat: 37.759251 } as LngLat,
  search_results: null,
  top_dishes: [],
  top_restaurants: [],
  current_dish: '',
  current_restaurant: {} as Restaurant,
  current_review: {} as Review,
  restaurant_reviews: [],
  user_reviews: [],
}

const openPanel = om => {
  const height = Dimensions.get('window').height
  bottomPanel.show(height / 2)
}

const updateRestaurants: AsyncAction<LngLat> = async (om, centre: LngLat) => {
  const restaurants = await Restaurant.findNear(centre.lat, centre.lng, RADIUS)
  for (const restaurant of restaurants) {
    om.state.home.restaurants[restaurant.id] = restaurant
  }
}

const getCurrentRestaurant: AsyncAction<string> = async (om, slug: string) => {
  const restaurant = new Restaurant()
  await restaurant.findOne('id', slug)
  om.state.home.current_restaurant = restaurant
  om.state.home.centre = {
    lng: restaurant.location.coordinates[0],
    lat: restaurant.location.coordinates[1] - 0.0037,
  }
  const reviews = new Review()
  om.state.map.restaurant_reviews = await reviews.findAllForRestaurant(
    restaurant.id
  )
  openPanel(om)
}

const getUserReviews: AsyncAction<string> = async (om, user_id: string) => {
  const reviews = new Review()
  om.state.map.user_reviews = await reviews.findAllForUser(user_id)
  openPanel(om)
}

const getTopDishes: AsyncAction = async om => {
  const query = {
    query: {
      top_dishes: {
        __args: {
          args: {
            lon: om.state.home.centre.lng,
            lat: om.state.home.centre.lat,
            radius: RADIUS,
          },
        },
        category: true,
        frequency: true,
      },
    },
  }
  const response = await ModelBase.hasura(query)
  om.state.home.top_dishes = response.data.data.top_dishes
  openPanel(om)
}

const getTopRestaurantsByDish: AsyncAction<string> = async (
  om,
  dish: string
) => {
  om.state.home.top_restaurants = []
  om.state.home.top_restaurants = await Restaurant.highestRatedByDish(
    om.state.home.centre.lat,
    om.state.home.centre.lng,
    RADIUS * 10,
    [dish]
  )
  om.state.home.current_dish = dish
  openPanel(om)
}

let searchVersion = 0

const restaurantSearch: AsyncAction<string> = async (om, query: string) => {
  searchVersion = (searchVersion + 1) % Number.MAX_VALUE

  if (query == '') {
    om.state.home.search_results = null
  } else {
    om.state.home.search_results = {
      status: 'loading',
      results: om.state.home.search_results?.results ?? [],
    }
    let myVersion = searchVersion
    const next = await Restaurant.search(
      om.state.home.centre.lat,
      om.state.home.centre.lng,
      RADIUS,
      query
    )
    if (myVersion == searchVersion) {
      om.state.home.search_results = {
        status: 'complete',
        results: next,
      }
    }
  }
}

const clearRestaurantSearch: Action = om => {
  om.state.home.search_results = null
}

const setMapCentre: Action<LngLat> = (om, centre: LngLat) => {
  om.state.home.centre = centre
}

const getReview: AsyncAction = async om => {
  let review = new Review()
  await review.findOne(
    om.state.home.current_restaurant.id,
    om.state.auth.user.id
  )
  om.state.home.current_review = review
}

const submitReview: AsyncAction<[number, string]> = async (
  om,
  args: [number, string]
) => {
  const rating = args[0]
  const text = args[1]
  let review = new Review()
  if (typeof om.state.home.current_review.id == 'undefined') {
    Object.assign(review, {
      restaurant_id: om.state.home.current_restaurant.id,
      user_id: om.state.auth.user.id,
      rating: rating,
      text: text,
    })
    await review.insert()
  } else {
    Object.assign(review, om.state.home.current_review)
    Object.assign(review, {
      rating: rating,
      text: text,
    })
    await review.update()
  }
  om.state.home.current_review = review
}

export const actions = {
  updateRestaurants,
  getCurrentRestaurant,
  getTopRestaurantsByDish,
  getTopDishes,
  restaurantSearch,
  clearRestaurantSearch,
  setMapCentre,
  getReview,
  submitReview,
  getUserReviews,
}
