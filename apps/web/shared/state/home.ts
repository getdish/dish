import { ModelBase, Restaurant, Review } from '@dish/models'
import { Action, AsyncAction, Derive } from 'overmind'
import _ from 'lodash'
import { HistoryItem } from './router'
import { isEqual } from '@o/fast-compare'

type LngLat = { lng: number; lat: number }

type TopDish = {
  category: string
  frequency: number
}

export type SearchResults =
  | { status: 'loading' }
  | {
      status: 'complete'
      results: {
        restaurants: Partial<Restaurant>[]
        dishes: string[]
        locations: string[]
      }
    }

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
  showMenu: boolean
  hoveredRestaurant: Restaurant | null
  states: HomeStateItem[]
  defaultHomeState: Derive<HomeState, HomeStateItemHome>
  breadcrumbStates: Derive<HomeState, HomeStateItem[]>
  currentState: Derive<HomeState, HomeStateItem>
  previousState: Derive<HomeState, HomeStateItem>
}

const RADIUS = 0.015

export const state: HomeState = {
  showMenu: false,
  hoveredRestaurant: null,
  states: [],
  defaultHomeState: state => {
    return (
      ([...state.states]
        .reverse()
        .find(x => x.type == 'home') as HomeStateItemHome) ?? {
        type: 'home',
        searchQuery: state.currentState?.searchQuery ?? '',
        centre: state.currentState?.centre ?? {
          lng: -122.421351,
          lat: 37.759251,
        },
      }
    )
  },
  breadcrumbStates: state => {
    const lastHome = state.defaultHomeState
    const lastHomeIndex = state.states.findIndex(x => x === lastHome)
    return state.states.slice(lastHomeIndex == -1 ? 0 : lastHomeIndex)
  },
  currentState: state => _.last(state.states),
  previousState: state => state.states[state.states.length - 2],
}

const _pushHomeState: Action<HistoryItem> = (om, item) => {
  const { currentState } = om.state.home
  const currentBaseState = {
    historyId: item.id,
    searchQuery: currentState?.searchQuery ?? '',
    centre: currentState?.centre ?? { lng: -122.421351, lat: 37.759251 },
  }

  let nextState: HomeStateItem | null = null
  let fetchData: Function | null = null

  switch (item.name) {
    case 'home':
      const lastHomeState = [...om.state.home.states]
        .reverse()
        .find(x => x.type === 'home')
      nextState = {
        type: 'home',
        ...currentBaseState,
        ...lastHomeState,
      }
      fetchData = () => {
        om.actions.home.getTopDishes()
      }
      break
    case 'search':
      const lastMatchingSearchState = [...om.state.home.states]
        .reverse()
        .find(
          x => x.type === 'search' && x.searchQuery == item.params.query
        ) as HomeStateItemSearch

      nextState = {
        type: 'search',
        results: {
          status: 'loading',
        },
        ...lastMatchingSearchState,
        ...currentBaseState,
      }
      fetchData = () => {
        om.actions.home.runSearch(item.params.query)
      }
      break
    case 'restaurant':
      nextState = {
        type: 'restaurant',
        restaurant: null,
        review: null,
        reviews: [],
        ...currentBaseState,
      }
      fetchData = () => {
        om.actions.home.setCurrentRestaurant(item.params.slug)
      }
      break
  }

  om.state.home.states.push(nextState)
  if (fetchData) {
    fetchData()
  }
}

const _popHomeState: Action<HistoryItem> = (om, item) => {
  if (om.state.home.states.length > 1) {
    om.state.home.states = _.dropRight(om.state.home.states)
  }
}

const setSearchQuery: Action<string> = (om, next) => {
  om.state.home.currentState.searchQuery = next
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
  const isOnSearch = om.state.home.currentState.type == 'search'

  if (query == '') {
    const state = om.state.home.currentState
    state.searchQuery = query
    if (isOnSearch) {
      om.actions.router.navigate({ name: 'home' })
    }
    return
  }

  if (!isOnSearch) {
    om.actions.router.navigate({
      name: 'search',
      params: {
        query,
      },
      replace: isOnSearch,
    })
  }

  const state = [...om.state.home.states]
    .reverse()
    .find(x => x.type === 'search') as HomeStateItemSearch
  state.searchQuery = query
  state.results = { status: 'loading' }

  const [restaurants, topRestaurants] = await Promise.all([
    Restaurant.search(
      om.state.home.currentState.centre.lat,
      om.state.home.currentState.centre.lng,
      RADIUS,
      query
    ),
    Restaurant.highestRatedByDish(
      om.state.home.currentState.centre.lat,
      om.state.home.currentState.centre.lng,
      RADIUS,
      [query]
    ),
  ])

  state.results = {
    status: 'complete',
    results: {
      restaurants: [...topRestaurants, ...restaurants],
      dishes: [],
      locations: [],
    },
  }
}

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

const setShowMenu: Action<boolean> = (om, val) => {
  om.state.home.showMenu = val
}

export const actions = {
  _pushHomeState,
  _popHomeState,
  setShowMenu,
  setHoveredRestaurant,
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
