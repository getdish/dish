import { Restaurant, RestaurantSearchArgs, Review, TopDish } from '@dish/models'
import Fuse from 'fuse.js'
import _ from 'lodash'
import { Action, AsyncAction, Derive } from 'overmind'

import { isWorker } from '../constants'
import { sleep } from '../helpers/sleep'
import { mapView } from '../views/home/HomeMap'
import { HistoryItem, RouteItem } from './router'
import { Taxonomy, taxonomyFilters, taxonomyLenses } from './Taxonomy'
import { fuzzy } from '../helpers/fuzzy'

type ShowAutocomplete = 'search' | 'location' | false

type HomeStateBase = {
  activeIndex: number // index for vertical (in page), -1 = autocomplete
  allFilters: Taxonomy[]
  allLenses: Taxonomy[]
  allRestaurants: { [id: string]: Restaurant }
  autocompleteDishes: TopDish['dishes']
  autocompleteIndex: number // index for horizontal row (autocomplete)
  autocompleteResults: AutocompleteItem[]
  hoveredRestaurant: Restaurant | null
  location: AutocompleteItem | null // for now just autocomplete item
  locationAutocompleteResults: AutocompleteItem[]
  locationSearchQuery: string
  showAutocomplete: ShowAutocomplete
  showUserMenu: boolean
  states: HomeStateItem[]
  topDishes: TopDish[]
  topDishesFilteredIndices: number[]
}

export type HomeState = HomeStateBase & {
  lastHomeState: Derive<HomeState, HomeStateItemHome>
  lastSearchState: Derive<HomeState, HomeStateItemSearch | null>
  lastRestaurantState: Derive<HomeState, HomeStateItemRestaurant | null>
  breadcrumbStates: Derive<HomeState, HomeStateItemSimple[]>
  currentState: Derive<HomeState, HomeStateItem>
  // my hypothesis is these more granular derives prevent updates on same value in views, need to test that
  currentStateType: Derive<HomeState, HomeStateItem['type']>
  currentStateSearchQuery: Derive<HomeState, HomeStateItem['searchQuery']>
  previousState: Derive<HomeState, HomeStateItem>
  currentActiveTaxonomyIds: Derive<HomeState, string[]>
  isAutocompleteActive: Derive<HomeState, boolean>
  activeAutocompleteResults: Derive<HomeState, AutocompleteItem[]>
  isLoading: Derive<HomeState, boolean>
}

type SearchResultsResults = {
  restaurantIds: string[]
  dishes: string[]
  locations: string[]
}

export type SearchResults =
  | { status: 'loading'; results?: SearchResultsResults }
  | {
      status: 'complete'
      results: SearchResultsResults
    }

export type LngLat = { lng: number; lat: number }

type HomeStateItemBase = {
  searchQuery: string
  center: LngLat
  span: LngLat
  historyId?: string
}

export type HomeStateItem =
  | HomeStateItemHome
  | HomeStateItemSearch
  | HomeStateItemRestaurant

export type HomeStateItemHome = HomeStateItemBase & {
  type: 'home'
  activeTaxonomyIds: string[]
}

export type HomeStateItemSearch = HomeStateItemBase & {
  type: 'search'
  activeTaxonomyIds: string[]
  results: SearchResults
  filters: Taxonomy[]
}

export type HomeStateItemRestaurant = HomeStateItemBase & {
  type: 'restaurant'
  restaurantId: string | null
  reviews: Review[]
  review: Review | null
}

export type HomeStateItemSimple = Omit<HomeStateItem, 'historyId'>

export type AutocompleteItem = {
  icon?: string
  name: string
  type: 'dish' | 'restaurant' | 'location' | 'country' | 'search'
  id: string
  center?: LngLat
}

const INITIAL_RADIUS = 0.1

export const initialHomeState: HomeStateItemHome = {
  type: 'home',
  activeTaxonomyIds: ['0'],
  searchQuery: '',
  center: {
    lng: -122.421351,
    lat: 37.759251,
  },
  span: { lng: INITIAL_RADIUS, lat: INITIAL_RADIUS },
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

const currentActiveTaxonomyIds = (state: HomeStateBase) => {
  const lastHomeOrSearch = _.findLast(
    state.states,
    (x) => x.type == 'search' || x.type == 'home'
  ) as HomeStateItemHome | HomeStateItemSearch | null
  return lastHomeOrSearch?.activeTaxonomyIds ?? []
}

/*
 *  HomeState!
 */

const defaultLocationAutocompleteResults: AutocompleteItem[] = [
  { name: 'New York', icon: '📍', type: 'location', id: '0' },
  { name: 'Los Angeles', icon: '📍', type: 'location', id: '1' },
  { name: 'Las Vegas', icon: '📍', type: 'location', id: '2' },
  { name: 'Miami', icon: '📍', type: 'location', id: '3' },
  { name: 'Chicago', icon: '📍', type: 'location', id: '4' },
  { name: 'New Orleans', icon: '📍', type: 'location', id: '5' },
]

export const state: HomeState = {
  activeIndex: -1,
  allFilters: taxonomyFilters,
  allLenses: taxonomyLenses,
  allRestaurants: {},
  autocompleteDishes: [],
  autocompleteIndex: 0,
  autocompleteResults: [],
  breadcrumbStates,
  currentActiveTaxonomyIds,
  currentState: (state) => _.last(state.states)!,
  currentStateSearchQuery: (state) => state.currentState.searchQuery,
  currentStateType: (state) => state.currentState.type,
  hoveredRestaurant: null,
  isAutocompleteActive: (state) => state.activeIndex === -1,
  lastHomeState,
  lastRestaurantState,
  lastSearchState,
  location: null,
  locationAutocompleteResults: defaultLocationAutocompleteResults,
  locationSearchQuery: '',
  previousState: (state) => state.states[state.states.length - 2],
  showAutocomplete: false,
  showUserMenu: false,
  states: [initialHomeState],
  topDishes: [],
  topDishesFilteredIndices: [],
  activeAutocompleteResults: (state) => {
    const prefix: AutocompleteItem[] = [
      {
        name: 'Home',
        icon: '🔍',
        id: '-2',
        type: 'search' as const,
      },
    ]
    if (state.currentStateSearchQuery) {
      prefix.push({
        name: state.currentStateSearchQuery, // `"${}"`,
        icon: '🔍',
        id: '-1',
        type: 'search' as const,
      })
    }
    return [
      ...prefix,
      ...(state.showAutocomplete === 'location'
        ? state.locationAutocompleteResults
        : state.autocompleteResults),
    ]
  },
  isLoading: (state) => {
    const cur = state.currentState
    if (cur.type === 'search') {
      return cur.results.status === 'loading'
    }
    return false
  },
}

const start: AsyncAction<void> = async (om) => {
  //
  await om.actions.home._loadHomeDishes()
  await om.actions.home._runAutocomplete(om.state.home.currentState.searchQuery)
}

const _pushHomeState: AsyncAction<HistoryItem> = async (om, item) => {
  const { currentState } = om.state.home

  const fallbackState = {
    center: currentState?.center ?? initialHomeState.center,
    span: currentState?.span ?? initialHomeState.span,
  }
  const newState = {
    historyId: item.id,
    searchQuery: currentState?.searchQuery ?? '',
  }

  let nextState: HomeStateItem | null = null
  let fetchData: () => Promise<void> | null = null

  switch (item.name) {
    case 'home':
      nextState = {
        ...fallbackState,
        type: 'home',
        ...om.state.home.lastHomeState,
        ...newState,
      } as HomeStateItemHome
      break
    case 'search':
      const lastSearchState = om.state.home.lastSearchState
      const searchState: HomeStateItemSearch = {
        ...fallbackState,
        type: 'search',
        activeTaxonomyIds: [],
        results: { status: 'loading' },
        ...lastSearchState,
        ...newState,
      }
      nextState = searchState
      fetchData = async () => {
        if (lastSearchState?.searchQuery !== item.params.query) {
          await om.actions.home.runSearch(item.params.query)
        }
      }
      break
    case 'restaurant':
      nextState = {
        ...fallbackState,
        type: 'restaurant',
        restaurantId: null,
        review: null,
        reviews: [],
        ...newState,
      }
      fetchData = async () => {
        await om.actions.home._loadRestaurantDetail({
          slug: item.params.slug,
          currentState,
        })
      }
      break
  }

  if (nextState) {
    om.state.home.states.push(nextState)
    if (fetchData) {
      await fetchData()
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

const _loadRestaurantDetail: AsyncAction<{
  slug: string
  currentState: HomeStateItem
}> = async (om, { slug, currentState }) => {
  const restaurant = new Restaurant()
  await restaurant.findOne('slug', slug)
  om.state.home.allRestaurants[restaurant.id] = restaurant
  const state = om.state.home.lastRestaurantState
  if (state) {
    state.restaurantId = restaurant.id
    state.center = {
      lng: restaurant.location.coordinates[0],
      lat: restaurant.location.coordinates[1] - 0.0037,
    }
    // zoom in a bit
    state.span = {
      lng: currentState.span.lng * 0.66,
      lat: currentState.span.lat * 0.66,
    }
    state.reviews = await Review.findAllForRestaurant(restaurant.id)
    if (om.state.user.isLoggedIn) {
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

const _loadHomeDishes: AsyncAction = async (om) => {
  const all = await Restaurant.getHomeDishes(
    om.state.home.currentState.center.lat,
    om.state.home.currentState.center.lng,
    // TODO span
    om.state.home.currentState.span.lat
  )

  const chunks = _.chunk(all, 4)

  if (isWorker) {
    let now = []
    for (const chunk of chunks) {
      await sleep(300)
      now = [...now, ...chunk]
      om.state.home.topDishes = now
    }
  }

  const dishes = om.state.home.topDishes
    .map((x) => x.dishes)
    .flat()
    .filter(Boolean)

  // weird side effect
  autocompleteDishesFuzzy = new Fuse(
    om.state.home.autocompleteDishes,
    fuzzyOpts
  )

  if (!isWorker) {
    om.state.home.autocompleteDishes = dishes ?? []
    om.state.home.topDishes = all
  }
}

const fuzzyOpts = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  minMatchCharLength: 1,
  keys: ['name'],
}

let autocompleteDishesFuzzy = new Fuse([], fuzzyOpts)

const DEBOUNCE_AUTOCOMPLETE = 60
const DEBOUNCE_SEARCH = 600
let lastRunAt = Date.now()
const setSearchQuery: AsyncAction<string> = async (om, query: string) => {
  const state = om.state.home.currentState
  const isHomeSearch = state.type === 'home' && !!query
  lastRunAt = Date.now()
  let id = lastRunAt

  if (state.type === 'home' || state.type === 'search') {
    state.searchQuery = query
  }

  if (query == '') {
    if (state.type === 'search') {
      om.state.home.lastHomeState.searchQuery = ''
      om.actions.router.navigate({ name: 'home' })
    }
    om.state.home.topDishesFilteredIndices = []
    return
  }

  // AUTOCOMPLETE
  // very slight debounce
  const isOnSearch = state.type === 'search'

  if (isOnSearch || isHomeSearch) {
    await sleep(DEBOUNCE_AUTOCOMPLETE)
    if (id != lastRunAt) return

    // fast actions
    om.actions.home.setShowAutocomplete('search')
    om.actions.home._runAutocomplete(query)

    // slow actions below here
    await sleep(DEBOUNCE_SEARCH - DEBOUNCE_AUTOCOMPLETE)
    if (id != lastRunAt) return
  }

  if (isHomeSearch) {
    om.actions.home._runHomeSearch(query)
    return
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

let defaultAutocompleteResults: AutocompleteItem[] | null = null

const _runAutocomplete: AsyncAction<string> = async (om, query) => {
  const state = om.state.home.currentState

  if (query === '') {
    if (!defaultAutocompleteResults) {
      defaultAutocompleteResults = om.state.home.topDishes.map((x) => ({
        id: x.country,
        type: 'country',
        name: x.country,
        icon: x.icon,
      }))
    }
    om.state.home.autocompleteResults = defaultAutocompleteResults
    om.state.home.locationAutocompleteResults = defaultLocationAutocompleteResults
    return
  }

  const locationPromise = searchLocations(state.searchQuery)
  const restaurantsPromise = Restaurant.search({
    center: state.center,
    span: state.span,
    query,
    limit: 5,
  })

  const autocompleteDishes = om.state.home.autocompleteDishes
  let found: { name: string }[] = autocompleteDishesFuzzy
    .search(query, { limit: 10 })
    .map((x) => x.item)
  if (found.length < 10) {
    found = [...found, ...autocompleteDishes.slice(0, 10 - found.length)]
  }
  const dishResults: AutocompleteItem[] = _.uniqBy(found, (x) => x.name).map(
    (x) => ({
      name: x.name,
      type: 'dish',
      icon: `🍛`,
      id: `dish-${x.name}`,
    })
  )

  const [restaurantsResults, locationResults] = await Promise.all([
    restaurantsPromise,
    locationPromise,
  ])

  const unsortedResults: AutocompleteItem[] = _.uniqBy(
    [
      ...dishResults,
      ...restaurantsResults.map((restaurant) => ({
        name: restaurant.name,
        // TODO tom - can we get the cuisine taxonomy icon here? we can load common ones somewhere
        icon: '🏘',
        type: 'restaurant' as const,
        id: restaurant.id,
      })),
      ...locationResults.map(locationToAutocomplete),
    ],
    (x) => `${x.name}${x.type}`
  )

  // final fuzzy...
  const searcher = new Fuse(unsortedResults, fuzzyOpts)
  const results = searcher.search(query, { limit: 8 }).map((x) => x.item)

  om.state.home.autocompleteResults = results
}

const locationToAutocomplete = (location: {
  name: string
  coordinate: { latitude: number; longitude: number }
}) => {
  return {
    name: location.name,
    type: 'location' as const,
    icon: '📍',
    id: `loc-${location.name}`,
    center: {
      lat: location.coordinate.latitude,
      lng: location.coordinate.longitude,
    },
  }
}

let runSearchId = 0
let lastSearchKey = ''
let lastSearchAt = Date.now()
const runSearch: AsyncAction<string> = async (om, query: string) => {
  runSearchId = Math.random()
  let curId = runSearchId
  let state = om.state.home.currentState

  if (state.type != 'search') return

  const allTags = [...om.state.home.allFilters, ...om.state.home.allLenses]
  const tags = state.activeTaxonomyIds.map(
    (id) => allTags.find((x) => x.id === id).name
  )
  const searchArgs: RestaurantSearchArgs = {
    center: state.center,
    span: state.span,
    query,
    tags,
  }
  const searchKey = JSON.stringify(searchArgs)
  // simple prevent duplicate searches
  if (searchKey === lastSearchKey) return
  lastSearchKey = searchKey

  state.searchQuery = query
  state.results = {
    // preserve last results
    results: state.results.results,
    status: 'loading',
  }

  // delay logic
  const timeSince = Date.now() - lastSearchAt
  lastSearchAt = Date.now()
  if (timeSince < 350) {
    await sleep(timeSince - 350)
  }

  state = om.state.home.currentState
  if (runSearchId != curId) return

  if (state.type != 'search') return

  let restaurants = await Restaurant.search(searchArgs)

  state = om.state.home.currentState
  if (state.type != 'search') return
  if (runSearchId != curId) return

  // fetch reviews before render
  if (om.state.user.isLoggedIn) {
    const reviews = (
      await om.effects.gql.queries.userRestaurantReviews({
        user_id: om.state.user.user.id,
        restaurant_ids: restaurants.map((x) => x.id),
      })
    ).review
    // TODO how do we do nice GC of allReviews?
    for (const review of reviews) {
      om.state.user.allReviews[review.restaurant_id] = review
    }
  }

  // update denormalized dictionary
  for (const restaurant of restaurants) {
    om.state.home.allRestaurants[restaurant.id] = restaurant
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
  if (!om.state.user.user) return
  let review = new Review()
  await review.findOne(state.restaurantId, om.state.user.user.id)
  state.review = review
  if (typeof state.review.id == 'undefined') {
    Object.assign(state.review, {
      restaurant_id: state.restaurantId,
      user_id: om.state.user.user.id,
    })
  }
}

const submitReview: AsyncAction<Review> = async (om, review) => {
  if (!om.state.user.user) {
    console.error('Not logged in')
    return
  }
  if (typeof review.id == 'undefined') {
    review.user_id = om.state.user.user.id
    await review.insert()
    review.id = review.id
  } else {
    await review.update()
  }
}

const setHoveredRestaurant: Action<Restaurant> = (om, val) => {
  om.state.home.hoveredRestaurant = new Restaurant({ ...val })
}

const setShowUserMenu: Action<boolean> = (om, val) => {
  om.state.home.showUserMenu = val
}

const toggleActiveTaxonomy: Action<Taxonomy> = (om, val) => {
  if (!val) {
    console.log('no taxonomy?', val)
    return
  }
  const state = om.state.home.currentState
  if (state.type != 'home' && state.type != 'search') {
    return
  }
  if (state.activeTaxonomyIds.some((x) => x == val.id)) {
    state.activeTaxonomyIds = state.activeTaxonomyIds.filter((x) => x != val.id)
  } else {
    state.activeTaxonomyIds = [...state.activeTaxonomyIds, val.id]
  }
}

const suggestTags: AsyncAction<string> = async (om, tags) => {
  let state = om.state.home.currentState
  if (state.type != 'restaurant') return
  let restaurant = new Restaurant(
    om.state.home.allRestaurants[state.restaurantId]
  )
  await restaurant.upsertTags(tags.split(','))
  om.state.home.allRestaurants[state.restaurantId] = restaurant
}

const setMapArea: Action<{ center: LngLat; span: LngLat }> = (om, val) => {
  om.state.home.currentState.center = val.center
  om.state.home.currentState.span = val.span
  om.actions.home.runSearch(om.state.home.currentState.searchQuery)
}

const handleRouteChange: AsyncAction<RouteItem> = async (
  om,
  { type, name, item }
) => {
  om.state.home.hoveredRestaurant = null
  switch (name) {
    case 'home':
    case 'search':
    case 'restaurant':
      if (type == 'replace') {
        return
      }
      if (type === 'push') {
        await om.actions.home._pushHomeState(item)
      } else {
        await om.actions.home._popHomeState(item)
      }
      return
  }
}

const setShowAutocomplete: Action<ShowAutocomplete> = (om, val) => {
  om.state.home.showAutocomplete = val
}

// TODO this sort of duplicates HomeStateItem.center... we should move it there
const setLocation: AsyncAction<string> = async (om, val) => {
  const current = om.state.home.locationAutocompleteResults
  om.actions.home.setLocationSearchQuery(val)
  const exact = current.find((x) => x.name === val)
  if (exact?.center) {
    om.state.home.location = { ...exact }
    om.state.home.currentState.center = { ...exact.center }
  }
}

let locationSearchId = 0
const setLocationSearchQuery: AsyncAction<string> = async (om, val) => {
  om.state.home.locationSearchQuery = val
  locationSearchId = Math.random()
  let curId = locationSearchId
  await sleep(70)
  if (curId !== locationSearchId) return
  const results = (await searchLocations(val)).map(locationToAutocomplete)
  const searcher = new Fuse(results, fuzzyOpts)
  const orderedResults = searcher.search(val, { limit: 8 }).map((x) => x.item)
  om.state.home.locationAutocompleteResults = _.uniqBy(
    orderedResults,
    (x) => x.id
  )
}

function searchLocations(query: string) {
  if (!query) {
    return Promise.resolve([])
  }
  const locationSearch = new mapkit.Search({ region: mapView.region })
  return new Promise<
    { name: string; formattedAddress: string; coordinate: any }[]
  >((res, rej) => {
    locationSearch.search(query, (err, data) => {
      if (err) {
        console.log('network failure')
        return res([])
      }
      res(data.places)
    })
  })
}

const moveAutocompleteIndex: Action<number> = (om, val) => {
  const cur = om.state.home.autocompleteIndex
  om.state.home.autocompleteIndex = Math.min(Math.max(-1, cur + val), 1000) // TODO
}

const setActiveIndex: Action<number> = (om, val) => {
  om.state.home.activeIndex = Math.min(Math.max(-1, val), 1000) // TODO
}

const moveActiveDown: Action = (om) => {
  om.actions.home.setActiveIndex(om.state.home.activeIndex + 1)
}

const moveActiveUp: Action = (om) => {
  om.actions.home.setActiveIndex(om.state.home.activeIndex - 1)
}

const _runHomeSearch: AsyncAction<string> = async (om, query) => {
  const res = await fuzzy(query, om.state.home.topDishes, ['country'])
  om.state.home.topDishesFilteredIndices = res
}

export const actions = {
  start,
  moveAutocompleteIndex,
  setActiveIndex,
  moveActiveDown,
  moveActiveUp,
  setShowAutocomplete,
  handleRouteChange,
  setLocationSearchQuery,
  setLocation,
  setMapArea,
  setSearchQuery,
  popTo,
  toggleActiveTaxonomy,
  setShowUserMenu,
  setHoveredRestaurant,
  runSearch,
  clearSearch,
  getReview,
  submitReview,
  getUserReviews,
  suggestTags,
  _runAutocomplete,
  _loadRestaurantDetail,
  _loadHomeDishes,
  _pushHomeState,
  _popHomeState,
  _runHomeSearch,
}
