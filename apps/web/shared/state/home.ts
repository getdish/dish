import { ModelBase, Restaurant, Review } from '@dish/models'
import { Action, AsyncAction, Derive } from 'overmind'
import _ from 'lodash'
import { HistoryItem } from './router'
import { isEqual } from '@o/fast-compare'
import { Taxonomy, taxonomyLenses, taxonomyFilters } from './Taxonomy'

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

type HomeStateItemBase = {
  searchQuery: string
  center: LngLat
  span: number
  historyId?: string
}

export type HomeStateItem =
  | HomeStateItemHome
  | HomeStateItemSearch
  | HomeStateItemRestaurant
// | HomeStateItemDish

export type HomeStateItemHome = HomeStateItemBase & {
  type: 'home'
  top_dishes?: TopDish[]
  top_restaurants?: Restaurant[]
  lenses: Taxonomy[]
  filters: Taxonomy[]
  activeLense: number
}

export type HomeStateItemSearch = HomeStateItemBase & {
  type: 'search'
  results: SearchResults
  filters: Taxonomy[]
}

export type HomeStateItemRestaurant = HomeStateItemBase & {
  type: 'restaurant'
  restaurant: Restaurant | null
  reviews: Review[]
  review: Review | null
}

// export type HomeStateItemDish = HomeStateItemBase & {
//   type: 'dish'
//   dish: string
// }

type HomeState = {
  showMenu: boolean
  hoveredRestaurant: Restaurant | null
  states: HomeStateItem[]
  breadcrumbStates: Derive<HomeState, HomeStateItem[]>
  currentState: Derive<HomeState, HomeStateItem>
  previousState: Derive<HomeState, HomeStateItem>
  lastHomeState: Derive<HomeState, HomeStateItemHome>
}

const RADIUS = 0.15

// TODO location ask?
export const initialHomeState: HomeStateItemHome = {
  type: 'home',
  lenses: taxonomyLenses,
  filters: taxonomyFilters,
  activeLense: 0,
  searchQuery: '',
  center: {
    lng: -122.421351,
    lat: 37.759251,
  },
  span: 0.05,
}

export const state: HomeState = {
  showMenu: false,
  hoveredRestaurant: null,
  states: [initialHomeState],
  breadcrumbStates: (state) => {
    const lastHome = state.lastHomeState
    const lastHomeIndex = state.states.findIndex((x) => x === lastHome)
    return state.states.slice(lastHomeIndex == -1 ? 0 : lastHomeIndex)
  },
  currentState: (state) => _.last(state.states),
  previousState: (state) => state.states[state.states.length - 2],
  lastHomeState: (state) =>
    [...state.states]
      .reverse()
      .find((x) => x.type === 'home') as HomeStateItemHome,
}

const _pushHomeState: Action<HistoryItem> = (om, item) => {
  const { currentState } = om.state.home

  const currentBaseState = {
    historyId: item.id,
    searchQuery: currentState?.searchQuery ?? '',
    center: currentState?.center ?? { lng: -122.421351, lat: 37.759251 },
    span: currentState?.span ?? 0.05,
  }

  let nextState: HomeStateItem | null = null
  let fetchData: Function | null = null

  switch (item.name) {
    case 'home':
      nextState = {
        type: 'home',
        ...om.state.home.lastHomeState,
        ...currentBaseState,
      }
      break
    case 'search':
      const lastMatchingSearchState = [...om.state.home.states]
        .reverse()
        .find(
          (x) => x.type === 'search' && x.searchQuery == item.params.query
        ) as HomeStateItemSearch

      nextState = {
        type: 'search',
        filters: [],
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

const popTo: Action<HomeStateItem> = (om, item) => {
  om.actions.router.navigate({
    name: item.type,
    params:
      [...om.state.router.history].reverse().find((x) => x.name == item.type)
        ?.params ?? {},
  })
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
    .find((x) => x.type === 'restaurant') as HomeStateItemRestaurant | null

  if (state) {
    state.restaurant = restaurant
    state.center = {
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

const getTopDishes: AsyncAction = async (om) => {
  const state = om.state.home.currentState
  if (state.type !== 'home') {
    return
  }
  const query = {
    query: {
      top_dishes: {
        __args: {
          args: {
            lon: om.state.home.currentState.center.lng,
            lat: om.state.home.currentState.center.lat,
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

let lastRunId = 0

const runSearch: AsyncAction<string> = async (om, query: string) => {
  lastRunId = Math.random()
  let curRunId = lastRunId
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
    .find((x) => x.type === 'search') as HomeStateItemSearch

  if (!state) {
    return
  }

  state.searchQuery = query
  state.results = { status: 'loading' }

  const [restaurants, topRestaurants] = await Promise.all([
    Restaurant.search(
      om.state.home.currentState.center.lat,
      om.state.home.currentState.center.lng,
      RADIUS,
      query
    ),
    Restaurant.highestRatedByDish(
      om.state.home.currentState.center.lat,
      om.state.home.currentState.center.lng,
      RADIUS,
      [query]
    ),
  ])

  if (lastRunId == curRunId) {
    state.results = {
      status: 'complete',
      results: {
        restaurants: [...topRestaurants, ...restaurants],
        dishes: [],
        locations: [],
      },
    }
    om.state.home.states = om.state.home.states.map((x) => {
      if (x.historyId == state.historyId) {
        return state
      }
      return x
    })
  }
}

const clearSearch: Action = (om) => {
  const state = om.state.home.currentState
  if (state.type == 'search') {
    om.actions.router.back()
  }
}

const setMapcenter: Action<LngLat> = (om, center: LngLat) => {
  om.state.home.currentState.center = center
}

const getReview: AsyncAction = async (om) => {
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

const setActiveLense: Action<Taxonomy> = (om, val) => {
  om.state.home.lastHomeState.activeLense = om.state.home.lastHomeState.lenses.findIndex(
    (x) => x.id == val.id
  )
}

export const actions = {
  popTo,
  _pushHomeState,
  _popHomeState,
  setActiveLense,
  setShowMenu,
  setHoveredRestaurant,
  setCurrentRestaurant,
  runSearch,
  getTopDishes,
  // restaurantSearch,
  clearSearch,
  setMapcenter,
  getReview,
  submitReview,
  getUserReviews,
  setSearchQuery,
}
