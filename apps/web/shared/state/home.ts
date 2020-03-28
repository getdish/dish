import { ModelBase, Restaurant, Review } from '@dish/models'
import { Action, AsyncAction, Derive } from 'overmind'
import _ from 'lodash'
import { HistoryItem } from './router'
import { Taxonomy, taxonomyLenses, taxonomyFilters } from './Taxonomy'
import { sleep } from '../helpers/sleep'
import { query } from '../../src/graphql'

type LngLat = { lng: number; lat: number }

type TopDish = {
  dish: string
  frequency: number
}

export type SearchResults =
  | { status: 'loading' }
  | {
      status: 'complete'
      results: {
        restaurantIds: string[]
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
  lenses: Taxonomy[]
  filters: Taxonomy[]
  activeLense: number
}

export type HomeStateItemSearch = HomeStateItemBase & {
  type: 'search'
  results: SearchResults
  hoveredRestaurant: string
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

export type HomeStateItemSimple = Omit<HomeStateItem, 'historyId'>

export type AutocompleteItem = {
  title: string
  route: { name: string; params: Object }
}

type HomeState = {
  autocompleteResults: AutocompleteItem[]
  restaurants: { [id: string]: Restaurant }
  showMenu: boolean
  states: HomeStateItem[]
  lastHomeState: Derive<HomeState, HomeStateItemHome>
  lastSearchState: Derive<HomeState, HomeStateItemSearch>
  lastRestaurantState: Derive<HomeState, HomeStateItemRestaurant>
  breadcrumbStates: Derive<HomeState, HomeStateItemSimple[]>
  currentState: Derive<HomeState, HomeStateItem>
  previousState: Derive<HomeState, HomeStateItem>
  hoveredRestaurant: Derive<HomeState, Restaurant | null>
}

const RADIUS = 0.05

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

const lastHomeState = (state: HomeState) =>
  _.findLast(state.states, (x) => x.type === 'home') as HomeStateItemHome | null
const lastRestaurantState = (state: HomeState) =>
  _.findLast(
    state.states,
    (x) => x.type === 'restaurant'
  ) as HomeStateItemRestaurant | null
const lastSearchState = (state: HomeState) =>
  _.findLast(
    state.states,
    (x) => x.type === 'search'
  ) as HomeStateItemSearch | null

export const state: HomeState = {
  autocompleteResults: [],
  restaurants: {},
  showMenu: false,
  states: [initialHomeState],
  currentState: (state) => _.last(state.states),
  previousState: (state) => state.states[state.states.length - 2],
  lastHomeState,
  lastSearchState,
  lastRestaurantState,
  breadcrumbStates: (state) => {
    const lastType = _.last(state.states).type
    const lastHome = lastHomeState(state)
    const lastSearch = lastType != 'home' && lastSearchState(state)
    const lastRestaurant =
      lastType == 'restaurant' && lastRestaurantState(state)
    return [lastHome, lastSearch, lastRestaurant]
      .filter(Boolean)
      .map((x) => _.omit(x), 'historyId')
  },
  hoveredRestaurant: (state) => {
    const index = lastSearchState(state)?.hoveredRestaurant
    return state.restaurants[index] ?? null
  },
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
        searchQuery: '',
      }
      break
    case 'search':
      const lastSearchState = om.state.home.lastSearchState
      nextState = {
        type: 'search',
        filters: [],
        results: {
          status: 'loading',
        },
        ...lastSearchState,
        ...currentBaseState,
      }
      fetchData = () => {
        console.log('what is', lastSearchState)
        if (lastSearchState?.searchQuery !== item.params.query) {
          om.actions.home.runSearch(item.params.query)
        }
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
      fetchData = async () => {
        await om.actions.home.setCurrentRestaurant(item.params.slug)
      }
      break
  }

  om.state.home.states.push(nextState)
  if (fetchData) {
    fetchData()
  }
}

const popTo: Action<HomeStateItem | number> = (om, item) => {
  let homeItem: HomeStateItem

  if (typeof item == 'number') {
    const index = om.state.home.states.length - 1 + item
    homeItem = om.state.home.states[index]
    if (!homeItem) {
      console.warn('no item at index', index)
      return
    }
  } else {
    homeItem = item
  }

  om.actions.router.navigate({
    name: homeItem.type,
    params:
      _.findLast(om.state.router.history, (x) => x.name == homeItem.type)
        ?.params ?? {},
  })
}

const _popHomeState: Action<HistoryItem> = (om, item) => {
  if (om.state.home.states.length > 1) {
    console.log('popHomeState', om.state.home.states)
    om.state.home.states = _.dropRight(om.state.home.states)
  }
}

const setCurrentRestaurant: AsyncAction<string> = async (om, slug: string) => {
  const restaurant = new Restaurant()
  await restaurant.findOne('slug', slug)
  const state = om.state.home.lastRestaurantState
  if (state) {
    state.restaurant = restaurant
    state.center = {
      lng: restaurant.location.coordinates[0],
      lat: restaurant.location.coordinates[1] - 0.0037,
    }
    state.reviews = await Review.findAllForRestaurant(restaurant.id)

    if (om.state.auth.is_logged_in) {
      await om.actions.home.getReview()
    }
  }
}

const getUserReviews: AsyncAction<string> = async (om, user_id: string) => {
  const state = om.state.home.currentState
  if (state.type == 'restaurant') {
    state.reviews = await Review.findAllForUser(user_id)
  }
}

const getTopDishes: AsyncAction = async (om) => {
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
        dish: true,
        frequency: true,
      },
    },
  }
  const response = await ModelBase.hasura(query)
  console.log('set top dishes')
  om.state.home.lastHomeState.top_dishes = response.data.data.top_dishes
}

const DEBOUNCE_SEARCH = 230
let lastRunAt = Date.now()
const setSearchQuery: AsyncAction<string> = async (om, query: string) => {
  const state = om.state.home.currentState

  if (state.type === 'search') {
    state.searchQuery = query

    if (query == '') {
      const state = om.state.home.currentState
      state.searchQuery = query
      if (om.state.home.currentState.type === 'search') {
        om.actions.router.navigate({ name: 'home' })
      }
      return
    }
  }

  // TODO run autocomplete here

  const isOnSearch = state.type === 'search'
  if (isOnSearch) {
    // debounce
    lastRunAt = Date.now()
    let id = lastRunAt
    await sleep(DEBOUNCE_SEARCH)
    if (id != lastRunAt) return
  }

  om.actions.router.navigate({
    name: 'search',
    params: {
      query,
    },
    replace: isOnSearch,
  })
  if (isOnSearch) {
    om.actions.home.runSearch(query)
  }
}

let runSearchId = 0
const runSearch: AsyncAction<string> = async (om, query: string) => {
  runSearchId = Math.random()
  let curId = runSearchId
  let state = om.state.home.currentState

  if (state.type != 'search') return

  state.searchQuery = query
  state.results = { status: 'loading' }

  await sleep(350)

  state = om.state.home.currentState
  if (runSearchId != curId) return

  if (state.type != 'search') return
  const tags = _.uniq([...state.filters.map((f) => f.name)])

  const restaurants = await Restaurant.search(
    om.state.home.currentState.center.lat,
    om.state.home.currentState.center.lng,
    RADIUS,
    query,
    tags
  )

  state = om.state.home.currentState
  if (state.type != 'search') return
  if (runSearchId != curId) return

  // update denormalized dictionary
  for (const restaurant of restaurants) {
    om.state.home.restaurants[restaurant.id] = restaurant
  }

  state.results = {
    status: 'complete',
    results: {
      restaurantIds: restaurants.map((x) => x.id).filter(Boolean),
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
  let state = om.state.home.lastRestaurantState
  if (!state) return
  if (!om.state.auth.user) return
  let review = new Review()
  await review.findOne(state.restaurant.id, om.state.auth.user.id)
  state.review = review
  if (typeof state.review.id == 'undefined') {
    Object.assign(state.review, {
      restaurant_id: state.restaurant.id,
      user_id: om.state.auth.user.id,
    })
  }
}

const submitReview: AsyncAction<Review> = async (om, review) => {
  if (!om.state.auth.user) {
    console.error('Not logged in')
    return
  }
  if (typeof review.id == 'undefined') {
    review.user_id = om.state.auth.user.id
    await review.insert()
    review.id = review.id
  } else {
    await review.update()
  }
}

const setHoveredRestaurant: Action<Restaurant> = (om, val) => {
  if (om.state.home.lastSearchState) {
    om.state.home.lastSearchState.hoveredRestaurant = val.id
  }
}

const setShowMenu: Action<boolean> = (om, val) => {
  om.state.home.showMenu = val
}

const setActiveLense: Action<Taxonomy> = (om, val) => {
  om.state.home.lastHomeState.activeLense = om.state.home.lastHomeState.lenses.findIndex(
    (x) => x.id == val.id
  )
}

const suggestTags: AsyncAction<string> = async (om, tags) => {
  let state = om.state.home.currentState
  if (state.type != 'restaurant') return
  let restaurant = new Restaurant(state.restaurant)
  await restaurant.upsertTags(tags.split(','))
  state.restaurant = restaurant
}

export const actions = {
  setSearchQuery,
  popTo,
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
  _pushHomeState,
  _popHomeState,
  suggestTags,
}
