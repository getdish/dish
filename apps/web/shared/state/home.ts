import {
  Restaurant,
  RestaurantSearchArgs,
  Review,
  TopDish,
  User,
  slugify,
} from '@dish/models'
import _ from 'lodash'
import { Action, AsyncAction, Config, Derive, IContext } from 'overmind'

import { isWorker } from '../constants'
import { fuzzyFind, fuzzyFindIndices } from '../helpers/fuzzy'
import { race } from '../helpers/race'
import { sleep } from '../helpers/sleep'
import { Toast } from '../views/Toast'
import { HistoryItem, NavigateItem, RouteItem } from './router'
import { NavigableTag, Tag, getTagId, tagFilters, tagLenses } from './Tag'

type Om = IContext<Config>

const SPLIT_TAG = '_'
const SPLIT_TAG_TYPE = '~'

type ShowAutocomplete = 'search' | 'location' | false

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
  | HomeStateItemUser

export type HomeStateItemHome = HomeStateItemBase & {
  type: 'home'
  activeTagIds: { [id: string]: boolean }
}

export type HomeStateItemSearch = HomeStateItemBase & {
  type: 'search' | 'userSearch'
  activeTagIds: { [id: string]: boolean }
  results: SearchResults
  // for not forcing map to be always synced
  searchedCenter?: LngLat
  searchedSpan?: LngLat
  user?: User
  username?: string
  hasMovedMap: boolean
}

export type HomeStateItemRestaurant = HomeStateItemBase & {
  type: 'restaurant'
  restaurantId: string | null
  reviews: Review[]
  review: Review | null
}

export type HomeStateItemUser = HomeStateItemBase & {
  type: 'user'
  username: string
  user: User
  reviews: Review[]
}

export type HomeStateItemSimple = Omit<HomeStateItem, 'historyId'>

export type AutocompleteItem = {
  icon?: string
  name: string
  tagId: string
  type: Tag['type']
  center?: LngLat
}

const INITIAL_RADIUS = 0.1

export const initialHomeState: HomeStateItemHome = {
  type: 'home',
  activeTagIds: {
    [getTagId(tagLenses[0])]: true,
  },
  searchQuery: '',
  center: {
    lng: -122.421351,
    lat: 37.759251,
  },
  span: { lng: INITIAL_RADIUS / 2, lat: INITIAL_RADIUS },
}

type HSIJustType = Pick<HomeStateItem, 'type'>
export const isUserState = (x?: HSIJustType): x is HomeStateItemUser =>
  x?.type === 'user'
export const isSearchState = (x?: HSIJustType): x is HomeStateItemSearch =>
  x?.type === 'search' || x?.type === 'userSearch'
export const isHomeState = (x?: HSIJustType): x is HomeStateItemHome =>
  x?.type === 'home'
export const isRestaurantState = (
  x?: HSIJustType
): x is HomeStateItemRestaurant => x?.type === 'restaurant'

export const lastHomeState = (state: HomeStateBase) =>
  _.findLast(state.states, isHomeState)
export const lastRestaurantState = (state: HomeStateBase) =>
  _.findLast(state.states, isRestaurantState)
export const lastSearchState = (state: HomeStateBase) =>
  _.findLast(state.states, isSearchState)

// not beautiful..
const breadcrumbStates = (state: HomeStateBase) => {
  let crumbs: HomeStateItem[] = []
  for (let i = state.states.length - 1; i >= 0; i--) {
    const cur = state.states[i]
    switch (cur.type) {
      case 'home':
        crumbs.unshift(cur)
        return crumbs
      case 'search':
      case 'userSearch':
      case 'user':
      case 'restaurant':
        if (crumbs.some((x) => x.type === cur.type)) {
          break
        }
        if (cur.type === 'restaurant' && crumbs.some(isSearchState)) {
          break
        }
        if (isSearchState(cur) && crumbs.some(isSearchState)) {
          break
        }
        // we could prevent stacking userSearch
        // if (cur.type === 'search' && crumbs.some(x => x.type === 'userSearch'))
        crumbs.unshift(cur)
        break
    }
  }
}

/*
 *  HomeState!
 */

const createAutocomplete = (x: Partial<AutocompleteItem>): AutocompleteItem => {
  return {
    name: x.name,
    type: x.type,
    ...x,
    tagId: getTagId({ name: x.name, type: x.type }),
  }
}

const defaultLocationAutocompleteResults: AutocompleteItem[] = [
  createAutocomplete({ name: 'New York', icon: '📍', type: 'country' }),
  createAutocomplete({ name: 'Los Angeles', icon: '📍', type: 'country' }),
  createAutocomplete({ name: 'Las Vegas', icon: '📍', type: 'country' }),
  createAutocomplete({ name: 'Miami', icon: '📍', type: 'country' }),
  createAutocomplete({ name: 'Chicago', icon: '📍', type: 'country' }),
  createAutocomplete({ name: 'New Orleans', icon: '📍', type: 'country' }),
]

type HomeStateBase = {
  started: boolean
  activeIndex: number // index for vertical (in page), -1 = autocomplete
  allTags: { [keyPath: string]: Tag }
  allLenseTags: Tag[]
  allFilterTags: Tag[]
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
  skipNextPageFetchData: boolean
  locationName: string
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
  isAutocompleteActive: Derive<HomeState, boolean>
  isLoading: Derive<HomeState, boolean>
  autocompleteResultsActive: Derive<HomeState, AutocompleteItem[]>
  lastActiveTags: Derive<HomeState, Tag[]>
  searchbarFocusedTag: Derive<HomeState, Tag>
  autocompleteFocusedTag: Derive<HomeState, Tag>
  searchBarTags: Derive<HomeState, Tag[]>
}

const isSearchBarTag = (tag: Pick<Tag, 'type'>) => tag?.type === 'country'

export const state: HomeState = {
  started: false,
  locationName: 'San Fransisco',
  skipNextPageFetchData: false,
  activeIndex: -1,
  allTags: [...tagFilters, ...tagLenses].reduce((acc, cur) => {
    acc[getTagId(cur)] = cur
    return acc
  }, {}),
  allLenseTags: tagLenses,
  allFilterTags: tagFilters,
  allRestaurants: {},
  autocompleteDishes: [],
  autocompleteIndex: 0,
  autocompleteResults: [],
  breadcrumbStates,
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
  searchBarTags: (state) => state.lastActiveTags.filter(isSearchBarTag),
  autocompleteFocusedTag: (state) => {
    const { autocompleteIndex } = state
    if (autocompleteIndex < 0) return null
    return (state.allTags[
      state.autocompleteResults[autocompleteIndex - 1]?.tagId
    ] ?? null) as Tag
  },
  searchbarFocusedTag: (state) => {
    const { autocompleteIndex } = state
    if (autocompleteIndex > -1) return null
    return state.searchBarTags[-1 - autocompleteIndex]
  },
  autocompleteResultsActive: (state) => {
    const prefix: AutocompleteItem[] = [
      {
        name: 'Search',
        icon: '🔍',
        tagId: '',
        type: 'orphan' as const,
      },
    ]
    return [
      ...prefix,
      ...(state.showAutocomplete === 'location'
        ? state.locationAutocompleteResults
        : state.autocompleteResults),
    ]
  },
  isLoading: (state) => {
    const cur = state.currentState
    if (isSearchState(cur)) {
      return cur.results.status === 'loading'
    }
    return false
  },
  lastActiveTags: (state) => {
    const lastTaggable = _.findLast(
      state.states,
      (x) => isHomeState(x) || isSearchState(x)
    ) as HomeStateItemSearch | HomeStateItemHome
    return Object.keys(lastTaggable.activeTagIds)
      .map((id) => state.allTags[id])
      .filter(Boolean) as Tag[]
  },
}

// TODO type
let mapView
export function setMapView(x) {
  mapView = x
}

const startBeforeRouting: AsyncAction = async (om) => {
  await om.actions.home._loadHomeDishes()
}

export const isOnOwnProfile = (state: Om['state']) => {
  return (
    slugify(state.user.user?.username) === state.router.curPage.params.username
  )
}

export const isEditingUserPage = (state: Om['state']) => {
  return state.home.currentStateType === 'userSearch' && isOnOwnProfile(state)
}

const start: AsyncAction = async (om) => {
  // stuff that can run after rendering
  await new Promise((res) => (window['requestIdleCallback'] ?? setTimeout)(res))
  await om.actions.home._runAutocomplete(om.state.home.currentState.searchQuery)
}

const pushHomeState: AsyncAction<HistoryItem> = async (om, item) => {
  const { started, currentState } = om.state.home

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

  const type = item.name
  switch (type) {
    // home
    case 'home':
      nextState = {
        ...fallbackState,
        type,
        ...om.state.home.lastHomeState,
        ...newState,
      } as HomeStateItemHome
      break

    // search or userSearch
    case 'userSearch':
    case 'search':
      const activeTagIds = started
        ? { ...om.state.home.lastHomeState.activeTagIds }
        : {}
      const searchState: HomeStateItemSearch = {
        ...fallbackState,
        hasMovedMap: false,
        results: { status: 'loading' },
        ...om.state.home.lastSearchState,
        ...newState,
        type,
        activeTagIds,
      }
      nextState = searchState
      fetchData = async () => {
        await om.actions.home._syncRouteToState(item.params)
        await om.actions.home.runSearch()
        // userpage load user
        if (item.name === 'userSearch') {
          const user = new User()
          await user.findOne('username', item.params.username)
          const state = om.state.home.currentState
          if (!user || state.type !== 'userSearch') return
          state.user = user
        }
      }
      break

    // restaurant
    case 'restaurant':
      nextState = {
        ...fallbackState,
        type,
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

    case 'user':
      nextState = {
        ...fallbackState,
        type: 'user',
        reviews: [],
        user: null,
        username: item.params.username,
        ...newState,
      }
      fetchData = async () => {
        await om.actions.home._loadUserDetail({
          username: item.params.username,
        })
      }
      break
  }

  if (!nextState) {
    console.warn('no nextstate', item)
    return
  }

  const replace =
    item.replace || om.state.home.currentStateType === nextState.type

  console.log('pushHomeState', { item, replace, nextState })

  if (replace) {
    // try granular update
    const lastState = om.state.home.states[om.state.home.states.length - 1]
    for (const key in nextState) {
      if (nextState[key] !== lastState[key]) {
        lastState[key] = nextState[key]
      }
    }
  } else {
    // const prev = []
    // const added = new Set()
    // const states = [...om.state.home.states].reverse()
    // // garbage collect duplicate states, only one of each type allowed
    // for (const state of states) {
    //   if (!added.has(state.type)) {
    //     added.add(state.type)
    //     prev.push(state)
    //   }
    // }
    om.state.home.states = [...om.state.home.states, nextState]
  }

  if (!om.state.home.started) {
    om.state.home.started = true
  }

  const shouldSkip = om.state.home.skipNextPageFetchData
  om.state.home.skipNextPageFetchData = false
  if (!shouldSkip && fetchData) {
    await race(fetchData(), 2000, 'fetchData', {
      warnOnly: true,
    })
  }
}

const popTo: Action<HomeStateItem['type'] | number> = (om, item) => {
  if (om.state.home.currentState === om.state.home.lastHomeState) {
    return
  }

  let type: HomeStateItem['type']
  if (typeof item == 'number') {
    const lastIndex = om.state.home.states.length - 1
    const index = lastIndex + item
    type = om.state.home.states[index]?.type
    if (!type) {
      console.warn('no item at index', index)
      return
    }
  } else {
    type = item
  }

  const stateItem = _.findLast(om.state.router.history, (x) => x.name == type)
  if (
    stateItem === om.state.router.history[om.state.router.history.length - 1]
  ) {
    om.actions.router.back()
  } else {
    om.actions.router.navigate({
      name: type,
      params: stateItem?.params ?? {},
    })
  }
}

const popHomeState: Action<HistoryItem> = (om, item) => {
  if (om.state.home.states.length > 1) {
    console.log('popHomeState', item)
    om.actions.home.setShowAutocomplete(false)
    om.state.home.states = _.dropRight(om.state.home.states)
  }
}

const _loadUserDetail: AsyncAction<{
  username: string
}> = async (om, { username }) => {
  const user = new User()
  await user.findOne('username', username)
  const state = om.state.home.currentState
  if (state.type === 'user') {
    state.user = user
    state.reviews = await Review.findAllForUser(user.id)
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
      lng: currentState.span.lng * 0.5,
      lat: currentState.span.lat * 0.5,
    }
    state.reviews = await Review.findAllForRestaurant(restaurant.id)
    if (om.state.user.isLoggedIn) {
      await om.actions.home.getReview()
    }
  }
}

const _loadHomeDishes: AsyncAction = async (om) => {
  const all = await Restaurant.getHomeDishes(
    om.state.home.currentState.center.lat,
    om.state.home.currentState.center.lng,
    // TODO span
    om.state.home.currentState.span.lat
  )

  // update tags
  for (const topDishes of all) {
    // country tag
    const tag: Tag = {
      id: `${topDishes.country}`,
      name: topDishes.country,
      type: 'country',
      icon: topDishes.icon,
    }
    om.state.home.allTags[getTagId(tag)] = tag
    // dish tags
    for (const dish of topDishes.dishes ?? []) {
      const tag: Tag = {
        id: `${dish.name}`,
        name: dish.name,
        type: 'dish',
      }
      om.state.home.allTags[getTagId(tag)] = tag
    }
  }

  const chunks = _.chunk(all, 4)

  if (isWorker) {
    let now = []
    for (const chunk of chunks) {
      await sleep(300)
      now = [...now, ...chunk]
      om.state.home.topDishes = now
    }
  }

  const dishes = all
    .map((x) => x.dishes)
    .flat()
    .filter(Boolean)

  if (!isWorker) {
    if (dishes) {
      om.state.home.autocompleteDishes = dishes
    }
    om.state.home.topDishes = all
  }
}

const DEBOUNCE_AUTOCOMPLETE = 120
const DEBOUNCE_SEARCH = 1000

let lastRunAt = Date.now()
const setSearchQuery: AsyncAction<string> = async (om, query: string) => {
  // also reset runSearch! hacky!
  lastSearchAt = Date.now()
  const state = om.state.home.currentState
  const isDeleting = query.length < state.searchQuery.length
  const isOnHome = isHomeState(state)
  const isOnSearch = isSearchState(state)
  lastRunAt = Date.now()
  let id = lastRunAt

  // experiment
  await new Promise((res) => requestIdleCallback(res))
  if (id != lastRunAt) return

  if (isOnHome || isOnSearch) {
    state.searchQuery = query
  }

  const nextState = { ...state, searchQuery: query }
  const isGoingHome = shouldBeOnHome(om.state.home, nextState)

  if (isOnSearch && isGoingHome) {
    om.state.home.lastHomeState.searchQuery = ''
    om.state.home.topDishesFilteredIndices = []
    om.actions.router.navigate({ name: 'home' })
    return
  }

  if (isOnHome) {
    // we will load the search results with more debounce in next lines
    om.state.home.skipNextPageFetchData = true
    await om.actions.home._syncStateToRoute(nextState)
  }

  // AUTOCOMPLETE
  // very slight debounce
  if (isOnSearch || isOnHome) {
    const delayByX = isDeleting ? 2 : 1
    await sleep(DEBOUNCE_AUTOCOMPLETE * delayByX)
    if (id != lastRunAt) return

    // fast actions
    om.actions.home.setShowAutocomplete('search')
    om.actions.home._runAutocomplete(query)

    // slow actions below here
    await sleep(DEBOUNCE_SEARCH * delayByX - DEBOUNCE_AUTOCOMPLETE * delayByX)
    if (id != lastRunAt) return
  }

  await om.actions.home._syncStateToRoute()
}

let defaultAutocompleteResults: AutocompleteItem[] | null = null

const _runAutocomplete: AsyncAction<string> = async (om, query) => {
  const state = om.state.home.currentState

  if (!defaultAutocompleteResults) {
    defaultAutocompleteResults = om.state.home.topDishes.map((x) => ({
      id: x.country,
      type: 'country',
      name: x.country,
      icon: x.icon,
      tagId: getTagId({ type: 'country', name: x.country }),
    }))
    om.state.home.autocompleteResults = defaultAutocompleteResults
  }

  if (query === '') {
    om.state.home.autocompleteResults = defaultAutocompleteResults
    om.state.home.locationAutocompleteResults = defaultLocationAutocompleteResults
    return
  }

  const locationPromise = searchLocations(state.searchQuery)
  const restaurantsPromise = Restaurant.search({
    center: state.center,
    span: padSpan(state.span),
    query,
    limit: 5,
  })

  const autocompleteDishes = om.state.home.autocompleteDishes
  let found = await fuzzyFind(query, autocompleteDishes)
  // .search(query, { limit: 10 })
  // .map((x) => x.item)
  if (found.length < 10) {
    found = [...found, ...autocompleteDishes.slice(0, 10 - found.length)]
  }
  const dishResults: AutocompleteItem[] = _.uniqBy(found, (x) => x.name).map(
    (x) =>
      createAutocomplete({
        name: x.name,
        type: 'dish',
        icon: `🍛`,
      })
  )

  const [restaurantsResults, locationResults] = await Promise.all([
    restaurantsPromise,
    locationPromise,
  ])

  const unsortedResults: AutocompleteItem[] = _.uniqBy(
    [
      ...dishResults,
      ...restaurantsResults.map((restaurant) =>
        createAutocomplete({
          name: restaurant.name,
          // TODO tom - can we get the cuisine tag icon here? we can load common ones somewhere
          icon: '🏘',
          type: 'restaurant',
        })
      ),
      ...locationResults.map(locationToAutocomplete),
    ],
    (x) => `${x.name}${x.type}`
  )

  // final fuzzy...
  const results = query
    ? await fuzzyFind(query, unsortedResults)
    : unsortedResults
  om.state.home.autocompleteResults = results
}

const locationToAutocomplete = (location: {
  name: string
  coordinate: { latitude: number; longitude: number }
}) => {
  return createAutocomplete({
    name: location.name,
    type: 'country',
    icon: '📍',
    center: {
      lat: location.coordinate.latitude,
      lng: location.coordinate.longitude,
    },
  })
}

let lastSearchKey = ''
let lastSearchAt = Date.now()
const runSearch: AsyncAction<{ quiet?: boolean } | void> = async (om, opts) => {
  opts = opts || { quiet: false }

  let state = om.state.home.currentState as HomeStateItemSearch
  if (!isSearchState(state)) return

  lastSearchAt = Date.now()
  let curId = lastSearchAt

  // we can remove one we have search service
  const ogQuery = om.state.home.currentState.searchQuery ?? ''
  let query = ogQuery ?? ''
  const tags = getActiveTags(om.state.home)

  const shouldCancel = () => {
    const answer = !state || lastSearchAt != curId
    if (answer) console.log('search: cancel')
    return answer
  }

  query = query.trim()

  const searchArgs: RestaurantSearchArgs = {
    center: state.center,
    span: padSpan(state.span),
    query,
    tags: tags.map((tag) => getTagId(tag)),
  }
  // console.log('searchArgs', searchArgs, opts)

  // prevent duplicate searches
  const searchKey = JSON.stringify(searchArgs)
  if (searchKey === lastSearchKey) return

  // update state
  state.searchQuery = ogQuery
  if (!opts?.quiet) {
    state.results = {
      // preserve last results
      results: state.results.results,
      status: 'loading',
    }
  }

  // debounce
  // const timeSince = Date.now() - lastSearchAt
  // if (timeSince < 350) {
  //   await sleep(Math.min(350, timeSince - 350))
  // }
  // if (shouldCancel()) return

  // fetch
  let restaurants = await Restaurant.search(searchArgs)
  if (shouldCancel()) return

  state = om.state.home.lastSearchState
  if (shouldCancel()) return

  // fetch reviews before render
  if (om.state.user.isLoggedIn) {
    const reviews = (
      await om.effects.gql.queries.userRestaurantReviews({
        user_id: om.state.user.user.id,
        restaurant_ids: restaurants.map((x) => x.id),
      })
    ).review
    if (shouldCancel()) return
    // TODO how do we do nice GC of allReviews?
    for (const review of reviews) {
      om.state.user.allReviews[review.restaurant_id] = review
    }
  }

  // update denormalized dictionary
  for (const restaurant of restaurants) {
    om.state.home.allRestaurants[restaurant.id] = restaurant
  }

  // only update searchkey once finished
  lastSearchKey = searchKey
  state.results = {
    status: 'complete',
    results: {
      restaurantIds: restaurants.map((x) => x.id).filter(Boolean),
      dishes: [],
      locations: [],
    },
  }
}

const clearSearch: Action = (om) => {
  const state = om.state.home.currentState
  if (isSearchState(state)) {
    om.actions.router.back()
  }
}

const getReview: AsyncAction = async (om) => {
  let state = om.state.home.lastRestaurantState
  if (!state) return
  if (!om.state.user.user) return
  try {
    let review = new Review()
    await review.findOne(state.restaurantId, om.state.user.user.id)
    state.review = review
    if (typeof state.review.id == 'undefined') {
      Object.assign(state.review, {
        restaurant_id: state.restaurantId,
        user_id: om.state.user.user.id,
      })
    }
  } catch (err) {
    console.error(`Error getting review ${err.message}`)
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

const suggestTags: AsyncAction<string> = async (om, tags) => {
  let state = om.state.home.currentState
  if (!isRestaurantState(state)) return
  let restaurant = new Restaurant(
    om.state.home.allRestaurants[state.restaurantId]
  )
  await restaurant.upsertTags(tags.split(',').map((name) => ({ name })))
  om.state.home.allRestaurants[state.restaurantId] = restaurant
}

type Place = mapkit.Place & {
  locality: string
  administrativeArea: string
  countryCode: string
  country: string
  timezone: string
  dependentLocalities: string[]
  subLocality: string
}

function reverseGeocode(center: LngLat): Promise<Place[]> {
  const mapGeocoder = new mapkit.Geocoder({
    language: 'en-GB',
    getsUserLocation: true,
  })
  return new Promise((res, rej) => {
    mapGeocoder.reverseLookup(
      new mapkit.Coordinate(center.lat, center.lng),
      (err, data) => {
        if (err) return rej(err)
        res((data.results as any) as Place[])
      }
    )
  })
}

const setMapArea: AsyncAction<{ center: LngLat; span: LngLat }> = async (
  om,
  { center, span }
) => {
  const state = om.state.home.currentState

  if (isSearchState(state)) {
    state.hasMovedMap = true
  }

  om.state.home.currentState.center = center
  om.state.home.currentState.span = span

  // reverse geocode location
  try {
    const [firstResult] = (await reverseGeocode(center)) ?? []
    const placeName = firstResult.subLocality ?? firstResult.locality
    if (placeName) {
      om.state.home.locationName = placeName
    }
  } catch (err) {
    return
  }
}

const handleRouteChange: AsyncAction<RouteItem> = async (
  om,
  { type, name, item }
) => {
  // actions on every route
  if (om.state.home.hoveredRestaurant) {
    om.state.home.hoveredRestaurant = null
  }

  // actions per-route
  switch (name) {
    case 'home':
    case 'search':
    case 'user':
    case 'userSearch':
    case 'restaurant':
      if (type === 'push' || type === 'replace') {
        await pushHomeState(om, item)
      } else {
        popHomeState(om, item)
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
  const orderedResults = await fuzzyFind(val, results)
  if (curId !== locationSearchId) return
  om.state.home.locationAutocompleteResults = _.uniqBy(
    orderedResults,
    (x) => x.tagId
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
  const tags = om.state.home.lastActiveTags
  const min = -1 - tags.length
  om.state.home.autocompleteIndex = Math.min(Math.max(min, cur + val), 1000) // TODO
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
  const res = await fuzzyFindIndices(query, om.state.home.topDishes, [
    'country',
  ])
  om.state.home.topDishesFilteredIndices = res
}

const setTagInactiveFn = (om: Om, val: NavigableTag) => {
  const state = om.state.home.currentState
  if (isHomeState(state) || isSearchState(state)) {
    state.activeTagIds[getTagId(val)] = false
  }
}

const setTagActiveFn = async (om: Om, val: NavigableTag) => {
  let state = om.state.home.currentState
  const willSearch = isSearchBarTag(val)

  // push to search on adding lense
  if (isHomeState(state) && willSearch) {
    // if adding a searchable tag while existing search query, replace it
    if (state.searchQuery) {
      state.searchQuery = ''
    }

    // go to new route first
    await om.actions.home._syncStateToRoute({
      ...state,
      activeTagIds: { ...state.activeTagIds, [getTagId(val)]: true },
    })
    state = om.state.home.currentState
    console.log('on search now?', state)
  }

  if (isSearchState(state) || (isHomeState(state) && !willSearch)) {
    state.activeTagIds[getTagId(val)] = true
  }
}

const setTagInactive: AsyncAction<NavigableTag> = async (om, val) => {
  if (!val) throw new Error(`No val ${val}`)
  setTagInactiveFn(om, val)
  await om.actions.home._afterTagChange()
}

const setTagActive: AsyncAction<NavigableTag> = async (om, val) => {
  if (val.type === 'lense') {
    // ensure only ever one lense
    await om.actions.home.replaceActiveTagOfType(val)
  } else {
    await setTagActiveFn(om, val)
    await om.actions.home._afterTagChange()
  }
}

const toggleTagActive: AsyncAction<NavigableTag> = async (om, val) => {
  if (!val) return
  const state = om.state.home.currentState
  if (!isHomeState(state) && !isSearchState(state)) return
  if (state.activeTagIds[getTagId(val)]) {
    setTagInactiveFn(om, val)
  } else {
    await setTagActiveFn(om, val)
  }
  await om.actions.home._afterTagChange()
}

const replaceActiveTagOfType: AsyncAction<NavigableTag> = async (om, next) => {
  const state = om.state.home.currentState
  if (!next || (!isHomeState(state) && !isSearchState(state))) return
  const tags = getActiveTags(om.state.home)
  // remove old
  for (const tag of tags) {
    if (tag.type === next.type) {
      state.activeTagIds[getTagId(tag)] = false
    }
  }
  await setTagActiveFn(om, next)
  await om.actions.home._afterTagChange()
}

function getTagRouteParams(
  om: IContext<Config>,
  state = om.state.home.currentState
): { [key: string]: string } {
  if (!isHomeState(state) && !isSearchState(state)) {
    return null
  }
  const allActiveTags = getActiveTags(om.state.home, state)
  // build our final path segment
  const filterTags = allActiveTags.filter((x) => x.type === 'filter')
  const otherTags = allActiveTags.filter(
    (x) => x.type !== 'lense' && x.type !== 'filter'
  )
  let tags = `${filterTags.map((x) => slugify(x.name)).join(SPLIT_TAG)}`
  if (otherTags.length) {
    if (tags.length) {
      tags += SPLIT_TAG
    }
    tags += `${otherTags
      .map((t) => `${t.type}${SPLIT_TAG_TYPE}${slugify(t.name)}`)
      .join(SPLIT_TAG)}`
  }
  const params: any = {
    location: 'here',
  }
  const lenseTag = allActiveTags.find((x) => x.type === 'lense')?.name ?? ''
  if (lenseTag) {
    params.lense = slugify(lenseTag)
  }
  if (tags.length) {
    params.tags = tags
  }
  return params
}

let _htgId = 0
const _afterTagChange: AsyncAction = async (om) => {
  if (!om.state.home.started) return
  _htgId = (_htgId + 1) % Number.MAX_VALUE
  let cur = _htgId
  await sleep(50)
  if (cur != _htgId) return
  await om.actions.home._syncStateToRoute()
  if (cur != _htgId) return
  om.actions.home.runSearch()
}

const requestLocation: Action = (om) => {}

type HomeStateDerived = Om['state']['home']

export const getActiveTags = (
  home: HomeStateDerived,
  state: HomeStateItem = home.currentState
) => {
  const lastState = home.states[home.states.length - 1]
  const curState = state ?? lastState
  const activeTagIds = curState?.['activeTagIds'] ?? {}
  return Object.keys(activeTagIds)
    .filter((x) => activeTagIds[x])
    .map((x) => home.allTags[x])
    .filter(Boolean)
}

const shouldBeOnHome = (
  home: HomeStateDerived,
  state: HomeStateItem = home.states[home.states.length - 1]
) => {
  return (
    state.searchQuery === '' &&
    getActiveTags(home, state).every((tag) => !isSearchBarTag(tag))
  )
}

const _syncRouteToState: AsyncAction<Object, boolean> = async (om, params) => {
  const state = om.state.home.currentState
  if (!isSearchState(state)) {
    throw new Error(`Should never sync outside search page`)
  }

  let didSet = false
  const setTag = (name: string, type: any) => {
    const tagId = getTagId({ name, type })
    if (!state.activeTagIds[tagId]) {
      state.activeTagIds[tagId] = true
      didSet = true
    }
  }

  for (const type of Object.keys(params ?? {})) {
    const name = params[type]
    if (type === 'tags') {
      // handle them different
      for (const tag of name.split(SPLIT_TAG)) {
        if (tag.indexOf(SPLIT_TAG_TYPE) > -1) {
          const [type, name] = tag.split(SPLIT_TAG_TYPE)
          setTag(name, type)
        } else {
          setTag(tag, 'filter')
        }
      }
    } else {
      setTag(name, type)
    }
  }

  if (didSet) {
    console.log('_syncRouteToState')
    await om.actions.home._syncStateToRoute()
  }

  return didSet
}

const _syncStateToRoute: AsyncAction<HomeStateItem | void> = async (
  om,
  ogState
) => {
  const state = ogState || om.state.home.currentState
  const shouldBeHome = shouldBeOnHome(om.state.home, state)
  const shouldBeSearch = !shouldBeHome
  const isHome = isHomeState(state)

  if (isHome) {
    if (shouldBeHome) {
      console.log('maybe dont go here')
      // no need to nav off home unless we add a lense
      // om.actions.router.navigate({ name: 'home' })
      return
    }
  }

  const params = getTagRouteParams(om, state)
  if (state.searchQuery) {
    params.query = state.searchQuery
  }
  if (state.type === 'userSearch') {
    params.username = om.state.router.curPage.params.username
  }

  if (shouldBeSearch && shouldBeHome) {
    console.log(`_syncStateTORoute back to home!`)
    om.actions.home.popTo('home')
    return
  }

  if (isHome || shouldBeSearch) {
    let name = state.type as any
    if (name === 'home' && !shouldBeHome) {
      name = 'search'
    }
    const isChangingType = ogState
      ? ogState.type === om.state.home.currentState.type
      : true
    const replace = !isChangingType
    const navItem: NavigateItem = {
      name,
      params,
      replace,
    }
    console.log('_syncStateToRoute', {
      navItem,
      params,
      ogState,
      isChangingType,
    })
    om.actions.router.navigate(navItem)
  }
}

const setSearchBarFocusedTag: Action<Tag | null> = (om, val) => {
  if (!val) {
    om.state.home.autocompleteIndex = 0
    return
  }
  om.state.home.autocompleteIndex = -om.state.home.lastActiveTags.findIndex(
    (x) => x.id === val.id
  )
}

const forkCurrentList: Action = (om) => {
  const user = om.state.user.user
  if (!user) {
    Toast.show(`Login please`)
    return
  }
  const { curPage } = om.state.router
  if (curPage.name !== 'search') {
    Toast.show(`Can't fork a non-search page`)
    return
  }
  om.actions.router.navigate({
    ...curPage,
    name: 'userSearch',
    params: {
      ...curPage.params,
      username: user.username,
    },
  })
}

// padding for map visual frame
function padSpan(val: LngLat): LngLat {
  return {
    lng: val.lng * 0.95,
    lat: val.lat * 0.95,
  }
}

const up: Action = (om) => {
  const { breadcrumbStates } = om.state.home
  if (breadcrumbStates.length == 1) return
  const prev = breadcrumbStates[breadcrumbStates.length - 2]
  om.actions.home.popTo(prev?.type ?? 'home')
}

export const actions = {
  _afterTagChange,
  _loadHomeDishes,
  _loadRestaurantDetail,
  _loadUserDetail,
  _runAutocomplete,
  _runHomeSearch,
  _syncRouteToState,
  _syncStateToRoute,
  clearSearch,
  forkCurrentList,
  getReview,
  handleRouteChange,
  moveActiveDown,
  moveActiveUp,
  up,
  moveAutocompleteIndex,
  popTo,
  replaceActiveTagOfType,
  requestLocation,
  runSearch,
  setActiveIndex,
  setHoveredRestaurant,
  setLocation,
  setLocationSearchQuery,
  setMapArea,
  setSearchBarFocusedTag,
  setSearchQuery,
  setShowAutocomplete,
  setShowUserMenu,
  setTagActive,
  setTagInactive,
  start,
  startBeforeRouting,
  submitReview,
  suggestTags,
  toggleTagActive,
}
