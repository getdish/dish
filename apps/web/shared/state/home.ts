import { ModelBase, Restaurant, Review, Dish } from '@dish/models'
import { Action, AsyncAction, Derive } from 'overmind'
import _ from 'lodash'
import { HistoryItem } from './router'

type LngLat = { lng: number; lat: number }

type TopDish = {
  category: string
  frequency: number
}

export type SearchResults = {
  status: 'loading' | 'complete'
  results: {
    restaurants: Partial<Restaurant>[]
    dishes: string[]
    locations: string[]
  }
  is_results: boolean
}

// TODO finish merge
// search_results: {
//   status: 'complete',
//   results: {
//     restaurants: [],
//     dishes: [],
//     locations: [],
//   },
//   is_results: false,
// },

type Base = {
  searchQuery: string
  centre: LngLat
  historyId?: string
}
export type HomeStateItemHome = Base & {
  type: 'home'
  top_dishes?: TopDish[]
  top_restaurants?: Restaurant[]
}
export type HomeStateItemSearch = Base & {
  type: 'search'
  results: SearchResults
}
export type HomeStateItemRestaurant = Base & {
  type: 'restaurant'
  restaurant: Restaurant | null
  reviews: Review[]
  review: Review | null
}
export type HomeStateItemDish = Base & { type: 'dish'; dish: string }
export type HomeStateItem =
  | HomeStateItemHome
  | HomeStateItemSearch
  | HomeStateItemRestaurant
  | HomeStateItemDish

type HomeState = {
  hoveredRestaurant: Restaurant | null
  states: HomeStateItem[]
  currentState: Derive<HomeState, HomeStateItem>
}

const RADIUS = 0.015

export const state: HomeState = {
  hoveredRestaurant: null,
  states: [],
  currentState: state => _.last(state.states),
}

const pushHomeState: Action<HistoryItem> = (om, item) => {
  console.log('push home state', item)
  const { currentState } = om.state.home
  const currentBaseState = {
    historyId: item.id,
    searchQuery: currentState?.searchQuery ?? '',
    centre: currentState?.centre ?? { lng: -122.421351, lat: 37.759251 },
  }

  switch (item.name) {
    case 'home':
      om.state.home.states.push({
        type: 'home',
        ...currentBaseState,
      })
      return
    case 'search':
      om.state.home.states.push({
        type: 'search',
        results: { status: 'loading', results: [] },
        ...currentBaseState,
      })
      om.actions.home.runSearch(item.params.query)
      return
    case 'restaurant':
      om.state.home.states.push({
        type: 'restaurant',
        restaurant: null,
        review: null,
        reviews: [],
        ...currentBaseState,
      })
      om.actions.home.setCurrentRestaurant(item.params.slug)
      return
  }
}

const popHomeState: Action<HistoryItem> = (om, item) => {
  if (om.state.home.states.length > 1) {
    om.state.home.states = _.dropRight(om.state.home.states)
  }
}

const setSearchQuery: Action<string> = (om, next) => {
  om.state.home.currentState.searchQuery = next
}

const updateRestaurants: AsyncAction<LngLat> = async (om, centre: LngLat) => {
  const restaurants = await Restaurant.findNear(centre.lat, centre.lng, RADIUS)
  const state = [...om.state.home.states]
    .reverse()
    .find(x => x.type === 'search') as HomeStateItemSearch | null
  if (state) {
    state.results = restaurants
  }
}

const setCurrentRestaurant: AsyncAction<string> = async (om, slug: string) => {
  const restaurant = new Restaurant()
  await restaurant.findOne('slug', slug)
  const state = [...om.state.home.states]
    .reverse()
    .find(x => x.type === 'restaurant') as HomeStateItemRestaurant | null

  if (state) {
    state.restaurant = restaurant
    state.centre = {
      lng: restaurant.location.coordinates[0],
      lat: restaurant.location.coordinates[1] - 0.0037,
    }
    const reviews = new Review()
    state.reviews = await reviews.findAllForRestaurant(restaurant.id)
  }
}

const getUserReviews: AsyncAction<string> = async (om, user_id: string) => {
  const reviews = new Review()
  const state = om.state.home.currentState
  if (state.type == 'restaurant') {
    state.reviews = await reviews.findAllForUser(user_id)
  }
}

const getTopDishes: AsyncAction = async om => {
  const state = om.state.home.currentState
  if (state.type !== 'home') {
    return
  }
  const query = {
    query: {
      top_dishes: {
        __args: {
          args: {
            lon: om.state.home.currentState.centre.lng,
            lat: om.state.home.currentState.centre.lat,
            radius: RADIUS,
          },
        },
        category: true,
        frequency: true,
      },
    },
  }
  const response = await ModelBase.hasura(query)
  state.top_dishes = response.data.data.top_dishes
}

const runSearch: AsyncAction<string> = async (om, query: string) => {
  const state = om.state.home.currentState
  if (state.type == 'search') {
    state.results = { status: 'loading', results: [] }
    const results = await Restaurant.highestRatedByDish(
      om.state.home.currentState.centre.lat,
      om.state.home.currentState.centre.lng,
      RADIUS * 10,
      [query]
    )
    state.results = { status: 'complete', results }
  }
}

// let searchVersion = 0
// const restaurantSearch: AsyncAction<string> = async (om, query: string) => {
//   searchVersion = (searchVersion + 1) % Number.MAX_VALUE
//   om.actions.home.setSearchQuery(query)

//   if (query == '') {
//     om.state.home.search_results = null
//   } else {
//     om.state.home.search_results = {
//       status: 'loading',
//       results: om.state.home.search_results?.results ?? [],
//     }
//     let myVersion = searchVersion
//     const next = await Restaurant.search(
//       om.state.home.currentState.centre.lat,
//       om.state.home.currentState.centre.lng,
//       RADIUS,
//       query
//     )
//     if (myVersion == searchVersion) {
//       om.state.home.search_results = {
//         status: 'complete',
//         results: next,
//       }
//     }
//   }
// }

const clearSearch: Action = om => {
  const state = om.state.home.currentState
  if (state.type == 'search') {
    om.actions.router.back()
  }
}

const setMapCentre: Action<LngLat> = (om, centre: LngLat) => {
  om.state.home.currentState.centre = centre
}

const getReview: AsyncAction = async om => {
  const state = om.state.home.currentState

  if (state.type == 'restaurant') {
    let review = new Review()
    await review.findOne(state.restaurant.id, om.state.auth.user.id)
    state.review = review
  }
}

const submitReview: AsyncAction<[number, string]> = async (
  om,
  args: [number, string]
) => {
  const rating = args[0]
  const text = args[1]
  let review = new Review()
  const state = om.state.home.currentState
  if (state.type == 'restaurant') {
    if (typeof state.review.id == 'undefined') {
      Object.assign(review, {
        restaurant_id: state.restaurant.id,
        user_id: om.state.auth.user.id,
        rating: rating,
        text: text,
      })
      await review.insert()
    } else {
      Object.assign(review, state.review)
      Object.assign(review, {
        rating: rating,
        text: text,
      })
      await review.update()
    }
    state.review = review
  }
}

const setHoveredRestaurant: Action<Restaurant | null> = (om, val) => {
  om.state.home.hoveredRestaurant = val
}

export const actions = {
  pushHomeState,
  popHomeState,
  setHoveredRestaurant,
  updateRestaurants,
  setCurrentRestaurant,
  runSearch,
  getTopDishes,
  // restaurantSearch,
  clearSearch,
  setMapCentre,
  getReview,
  submitReview,
  getUserReviews,
  setSearchQuery,
}
