import { Restaurant, RestaurantSearchArgs, Review, TopDish } from '@dish/models'
import _ from 'lodash'
import { Action, AsyncAction, Derive } from 'overmind'

import { sleep } from '../helpers/sleep'
import { HistoryItem } from './router'
import { Taxonomy, taxonomyFilters, taxonomyLenses } from './Taxonomy'

type LngLat = { lng: number; lat: number }

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
  radius: number
  historyId?: string
}

export type HomeStateItem =
  | HomeStateItemHome
  | HomeStateItemSearch
  | HomeStateItemRestaurant

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

export type HomeStateItemSimple = Omit<HomeStateItem, 'historyId'>

export type AutocompleteItem = {
  title: string
  route: { name: string; params: Object }
}

type HomeStateBase = {
  autocompleteResults: AutocompleteItem[]
  allTopDishes: string[]
  restaurants: { [id: string]: Restaurant }
  showMenu: boolean
  states: HomeStateItem[]
}
export type HomeState = HomeStateBase & {
  lastHomeState: Derive<HomeState, HomeStateItemHome>
  lastSearchState: Derive<HomeState, HomeStateItemSearch | null>
  lastRestaurantState: Derive<HomeState, HomeStateItemRestaurant | null>
  breadcrumbStates: Derive<HomeState, HomeStateItemSimple[]>
  currentState: Derive<HomeState, HomeStateItem>
  previousState: Derive<HomeState, HomeStateItem>
  hoveredRestaurant: Derive<HomeState, Restaurant | null>
}

const INITIAL_RADIUS = 0.1

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
  radius: INITIAL_RADIUS,
}

const lastHomeState = (state: HomeStateBase) =>
  _.findLast(state.states, (x) => x.type === 'home') as HomeStateItemHome
const lastRestaurantState = (state: HomeStateBase) =>
  _.findLast(
    state.states,
    (x) => x.type === 'restaurant'
  ) as HomeStateItemRestaurant | null
const lastSearchState = (state: HomeStateBase) =>
  _.findLast(
    state.states,
    (x) => x.type === 'search'
  ) as HomeStateItemSearch | null

const breadcrumbStates = (state: HomeStateBase) => {
  const lastType = _.last(state.states)!.type
  const lastHome = lastHomeState(state)
  const lastSearch = lastType != 'home' && lastSearchState(state)
  const lastRestaurant = lastType == 'restaurant' && lastRestaurantState(state)
  return [lastHome, lastSearch, lastRestaurant]
    .filter(Boolean)
    .map((x) => _.omit(x as any, 'historyId'))
}

const hoveredRestaurant = (state: HomeStateBase) => {
  const id = lastSearchState(state)?.hoveredRestaurant
  return id ? state.restaurants[id] ?? null : null
}

export const state: HomeState = {
  autocompleteResults: [],
  allTopDishes: [],
  restaurants: {},
  showMenu: false,
  states: [initialHomeState],
  currentState: (state) => _.last(state.states)!,
  previousState: (state) => state.states[state.states.length - 2],
  lastHomeState,
  lastSearchState,
  lastRestaurantState,
  breadcrumbStates,
  hoveredRestaurant,
}

const _pushHomeState: Action<HistoryItem> = (om, item) => {
  const { currentState } = om.state.home

  const currentBaseState = {
    historyId: item.id,
    searchQuery: currentState?.searchQuery ?? '',
    center: currentState?.center ?? { lng: -122.421351, lat: 37.759251 },
    radius: currentState?.radius ?? 0.05,
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
      } as HomeStateItemHome
      break
    case 'search':
      const lastSearchState = om.state.home.lastSearchState
      nextState = {
        type: 'search',
        filters: [],
        hoveredRestaurant: '',
        results: {
          status: 'loading',
        },
        ...lastSearchState,
        ...currentBaseState,
      } as HomeStateItemSearch
      fetchData = () => {
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

  if (nextState) {
    om.state.home.states.push(nextState)
    if (fetchData) {
      fetchData()
    }
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

  const params =
    _.findLast(om.state.router.history, (x) => x.name == homeItem.type)
      ?.params ?? {}
  om.actions.router.navigate({
    name: homeItem.type,
    params,
  } as any)
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

const loadHomeDishes: AsyncAction = async (om) => {
  om.state.home.lastHomeState.top_dishes = await Restaurant.getHomeDishes(
    om.state.home.currentState.center.lat,
    om.state.home.currentState.center.lng,
    om.state.home.currentState.radius
  )
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
let lastSearchKey = ''
const runSearch: AsyncAction<string> = async (om, query: string) => {
  runSearchId = Math.random()
  let curId = runSearchId
  let state = om.state.home.currentState

  if (state.type != 'search') return

  const tags = _.uniq([...state.filters.map((f) => f.name)])
  const searchArgs: RestaurantSearchArgs = {
    lat: state.center.lat,
    lng: state.center.lng,
    radius: state.radius,
    query,
    tags,
  }
  const searchKey = JSON.stringify(searchArgs)
  // simple prevent duplicate searches
  if (searchKey === lastSearchKey) return
  lastSearchKey = searchKey

  state.searchQuery = query
  state.results = { status: 'loading' }

  await sleep(350)

  state = om.state.home.currentState
  if (runSearchId != curId) return

  if (state.type != 'search') return

  const restaurants = await Restaurant.search(searchArgs)

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

const setMapArea: Action<{ center: LngLat; radius: number }> = (om, val) => {
  om.state.home.currentState.center = val.center
  om.state.home.currentState.radius = val.radius
  om.actions.home.runSearch(om.state.home.currentState.searchQuery)
}

export const actions = {
  setMapArea,
  setSearchQuery,
  popTo,
  setActiveLense,
  setShowMenu,
  setHoveredRestaurant,
  setCurrentRestaurant,
  runSearch,
  loadHomeDishes,
  clearSearch,
  getReview,
  submitReview,
  getUserReviews,
  _pushHomeState,
  _popHomeState,
  suggestTags,
}
