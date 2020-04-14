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
import { HistoryItem, RouteItem } from './router'
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
  type: 'search'
  activeTagIds: { [id: string]: boolean }
  results: SearchResults
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
      case 'user':
      case 'restaurant':
        if (crumbs.some((x) => x.type === cur.type)) {
          break
        }
        if (
          cur.type === 'restaurant' &&
          crumbs.some((x) => x.type === 'search')
        ) {
          break
        }
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
    if (cur.type === 'search') {
      return cur.results.status === 'loading'
    }
    return false
  },
  lastActiveTags: (state) => {
    const lastTaggable = _.findLast(
      state.states,
      (x) => x.type === 'home' || x.type === 'search'
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

const start: AsyncAction = async (om) => {
  // depends on topDishes
  om.state.home.started = true
  // stuff that can run after rendering
  await new Promise((res) => (window['requestIdleCallback'] ?? setTimeout)(res))
  await om.actions.home._runAutocomplete(om.state.home.currentState.searchQuery)
}

const pushHomeState: AsyncAction<HistoryItem> = async (om, item) => {
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
  let afterPush: () => Promise<any> | null = null

  switch (item.name) {
    // home
    case 'home':
      nextState = {
        ...fallbackState,
        type: 'home',
        ...om.state.home.lastHomeState,
        ...newState,
      } as HomeStateItemHome
      break

    // search or userSearch
    case 'userSearch':
    case 'search':
      const lastSearchState = om.state.home.lastSearchState
      const searchState: HomeStateItemSearch = {
        ...fallbackState,
        type: 'search',
        results: { status: 'loading' },
        ...lastSearchState,
        activeTagIds: om.state.home.started
          ? { ...om.state.home.lastHomeState.activeTagIds }
          : {},
        ...newState,
      }
      nextState = searchState
      afterPush = async () => {
        await om.actions.home._syncUrlToTags(item.params)
      }
      fetchData = async () => {
        await om.actions.home.runSearch()
      }
      break

    // restaurant
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
    return
  }

  console.log('PUSHING HOME', nextState, item)

  if (item.replace && om.state.home.currentStateType === nextState.type) {
    // try granular update
    const lastState = om.state.home.states[om.state.home.states.length - 1]
    for (const key in nextState) {
      if (nextState[key] !== lastState[key]) {
        lastState[key] = nextState[key]
      }
    }
  } else {
    om.state.home.states.push(nextState)
  }

  if (afterPush) {
    await afterPush()
  }

  const shouldSkip = om.state.home.skipNextPageFetchData
  om.state.home.skipNextPageFetchData = false
  if (!shouldSkip && fetchData) {
    race(fetchData(), 2000, 'fetchData', {
      warnOnly: true,
    })
  }
}

const popTo: Action<HomeStateItem | number> = (om, item) => {
  if (om.state.home.currentState === om.state.home.lastHomeState) {
    return
  }

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

  // navigate
  om.actions.router.navigate({
    name: homeItem.type,
    params,
  } as any)
}

const popHomeState: Action<HistoryItem> = (om, item) => {
  if (om.state.home.states.length > 1) {
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
  const isOnHome = state.type === 'home'
  const isOnSearch = state.type === 'search'
  lastRunAt = Date.now()
  let id = lastRunAt

  await sleep(40)
  if (id != lastRunAt) return

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

  if (isOnHome) {
    // we will load the search results with more debounce in next lines
    om.state.home.skipNextPageFetchData = true
    await om.actions.home._syncStateToRoute({ ...state, searchQuery: query })
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

  if (!isOnHome) {
    await om.actions.home._syncStateToRoute()
  }

  om.actions.home.runSearch()
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
  if (state.type != 'search') return

  lastSearchAt = Date.now()
  let curId = lastSearchAt

  // we can remove one we have search service
  const ogQuery = om.state.home.currentState.searchQuery ?? ''
  let query = ogQuery ?? ''
  const tags = Object.keys(state.activeTagIds).map(
    (id) => om.state.home.allTags[id]
  )

  const shouldCancel = () => {
    const answer = lastSearchAt != curId
    if (answer) console.log('cancelling search')
    return answer
  }

  if (true) {
    console.log(
      'TODO one search service accepts tags, send in tags',
      state.activeTagIds
    )
    if (Object.keys(state.activeTagIds).length) {
      query = `${query} ${_.uniq(
        tags.filter((tag) => tag.type !== 'lense').map((tag) => tag.name)
      ).join(' ')}`
    }
  }

  query = query.trim()

  const searchArgs: RestaurantSearchArgs = {
    center: state.center,
    span: padSpan(state.span),
    query,
    tags: tags.map((tag) => getTagId(tag)),
  }
  console.log('searchArgs', searchArgs, opts)

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

const suggestTags: AsyncAction<string> = async (om, tags) => {
  let state = om.state.home.currentState
  if (state.type != 'restaurant') return
  let restaurant = new Restaurant(
    om.state.home.allRestaurants[state.restaurantId]
  )
  await restaurant.upsertTags(tags.split(',').map((name) => ({ name })))
  om.state.home.allRestaurants[state.restaurantId] = restaurant
}

function reverseGeocode(center: LngLat) {
  const mapGeocoder = new mapkit.Geocoder({
    language: 'en-GB',
    getsUserLocation: true,
  })
  return new Promise((res, rej) => {
    mapGeocoder.reverseLookup(
      new mapkit.Coordinate(center.lat, center.lng),
      (err, data) => {
        if (err) return rej(err)
        res(data.results)
      }
    )
  })
}

const setMapArea: AsyncAction<{ center: LngLat; span: LngLat }> = async (
  om,
  { center, span }
) => {
  console.warn('set map area')
  om.state.home.currentState.center = center
  om.state.home.currentState.span = span
  om.actions.home.runSearch({
    quiet: true,
  })

  // reverse geocode location
  try {
    const res = await reverseGeocode(center)
    console.log('reverse geocode says', res)
  } catch (err) {
    return
  }
}

const handleRouteChange: AsyncAction<RouteItem> = async (
  om,
  { type, name, item }
) => {
  om.state.home.hoveredRestaurant = null
  console.log('handleRouteChange', { type, name, item })
  switch (name) {
    case 'home':
    case 'search':
    case 'user':
    case 'userSearch':
    case 'restaurant':
      if (type == 'replace') {
        return
      }
      if (type === 'push') {
        await pushHomeState(om, item)
      } else {
        await popHomeState(om, item)
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
  if (state.type != 'home' && state.type != 'search') return
  delete state.activeTagIds[getTagId(val)]
}

const setTagActiveFn = async (om: Om, val: NavigableTag) => {
  let state = om.state.home.currentState
  const willSearch = isSearchBarTag(val)

  // push to search on adding lense
  if (state.type === 'home' && willSearch) {
    // if adding a searchable tag while existing search query, replace it
    if (state.searchQuery) {
      state.searchQuery = ''
    }

    // don't set it active!
    await om.actions.home._syncStateToRoute({
      ...state,
      activeTagIds: { ...state.activeTagIds, [getTagId(val)]: true },
    })
    state = om.state.home.currentState
    console.log('on search now?', state)
  }

  if (state.type == 'search' || (state.type === 'home' && !willSearch)) {
    state.activeTagIds[getTagId(val)] = true
  }
}

const setTagInactive: AsyncAction<NavigableTag> = async (om, val) => {
  if (!val) throw new Error(`No val ${val}`)
  setTagInactiveFn(om, val)
  await om.actions.home._handleTagChange()
}

const setTagActive: AsyncAction<NavigableTag> = async (om, val) => {
  if (val.type === 'lense') {
    // ensure only ever one lense
    await om.actions.home.replaceActiveTagOfType(val)
  } else {
    await setTagActiveFn(om, val)
    await om.actions.home._handleTagChange()
  }
}

const toggleTagActive: AsyncAction<NavigableTag> = async (om, val) => {
  if (!val) return
  const state = om.state.home.currentState
  if (state.type != 'home' && state.type != 'search') return
  if (state.activeTagIds[getTagId(val)]) {
    setTagInactiveFn(om, val)
  } else {
    await setTagActiveFn(om, val)
  }
  await om.actions.home._handleTagChange()
}

const replaceActiveTagOfType: AsyncAction<NavigableTag> = async (om, val) => {
  if (!val) return
  const state = om.state.home.currentState
  if (state.type != 'home' && state.type != 'search') return
  const existing = Object.keys(state.activeTagIds)
    .map((id) => om.state.home.allTags[id])
    .filter(Boolean)
    .find((x) => x.type === val.type)
  if (existing) {
    setTagInactiveFn(om, existing)
  }
  await setTagActiveFn(om, val)
  await om.actions.home._handleTagChange()
}

const _syncUrlToTags: AsyncAction<Object> = async (om, params) => {
  // automatically map path segments to tags
  const allTags = om.state.home.allTags

  const setTag = (name: string, type: any) => {
    const tag = allTags[getTagId({ name, type })]
    if (tag) {
      setTagActiveFn(om, tag)
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

  await om.actions.home._handleTagChange()
}

function getTagRouteParams(om: IContext<Config>): { [key: string]: string } {
  const state = om.state.home.currentState
  if (state.type != 'home' && state.type != 'search') {
    return null
  }
  const allActiveTags = Object.keys(state.activeTagIds).map(
    (id) => om.state.home.allTags[id]
  )
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
const _handleTagChange: AsyncAction = async (om) => {
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

const _syncStateToRoute: AsyncAction<HomeStateItem | void> = async (
  om,
  state
) => {
  state = state || om.state.home.currentState

  if (state.type === 'home') {
    const tags = Object.keys(state.activeTagIds).map(
      (x) => om.state.home.allTags[x]
    )
    if (state.searchQuery === '' && tags.every((tag) => !isSearchBarTag(tag))) {
      console.log('avoid route update on home')
      // no need to nav off home unless we add a lense
      return
    }
  }

  const isOnSearch = state.type === 'search'
  const params = getTagRouteParams(om)
  if (!!om.state.home.currentStateSearchQuery) {
    params.query = om.state.home.currentStateSearchQuery
  }

  if (
    isOnSearch &&
    state.searchQuery === '' &&
    om.state.home.searchBarTags.length === 0
  ) {
    console.log(`back to home then, nextQuery: ${state.searchQuery}`)
    om.actions.home.popTo(om.state.home.lastHomeState)
    return
  }

  om.actions.router.navigate({
    name: 'search',
    params,
    replace: isOnSearch,
  })
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

export const actions = {
  _handleTagChange,
  _loadHomeDishes,
  _loadRestaurantDetail,
  _loadUserDetail,
  _runAutocomplete,
  _runHomeSearch,
  _syncUrlToTags,
  _syncStateToRoute,
  clearSearch,
  forkCurrentList,
  getReview,
  handleRouteChange,
  moveActiveDown,
  moveActiveUp,
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
