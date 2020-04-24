import {
  Restaurant,
  RestaurantSearchArgs,
  Review,
  User,
  slugify,
} from '@dish/models'
import { LngLat } from '@dish/models/_/Restaurant'
import { isEqual } from '@o/fast-compare'
import _ from 'lodash'
import { Action, AsyncAction } from 'overmind'

import { isWorker } from '../constants'
import { fuzzyFind, fuzzyFindIndices } from '../helpers/fuzzy'
import { sleep } from '../helpers/sleep'
import { Toast } from '../views/Toast'
import {
  isHomeState,
  isRestaurantState,
  isSearchState,
  lastHomeState,
  lastRestaurantState,
  lastSearchState,
  shouldBeOnHome,
} from './home-helpers'
import {
  allTags,
  currentNavItem,
  getActiveTags,
  getFullTags,
  getNavigateToTag,
  getTagsFromRoute,
  isSearchBarTag,
  navigateToTag,
  navigateToTagId,
  toggleTagOnHomeState,
} from './home-tag-helpers'
import { getNavigateItemForState } from './home-tag-helpers'
import {
  AutocompleteItem,
  GeocodePlace,
  HomeActiveTagIds,
  HomeState,
  HomeStateBase,
  HomeStateItem,
  HomeStateItemHome,
  HomeStateItemSearch,
  HomeStateItemSimple,
  Om,
  OmState,
  ShowAutocomplete,
} from './home-types'
import { HistoryItem, NavigateItem, RouteItem } from './router'
import { NavigableTag, Tag, getTagId, tagFilters, tagLenses } from './Tag'

const INITIAL_RADIUS = 0.1

// backward compat
export * from './home-types'

export const initialHomeState: HomeStateItemHome = {
  id: '0',
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

const defaultLocationAutocompleteResults: AutocompleteItem[] = [
  createAutocomplete({ name: 'New York', icon: '📍', type: 'country' }),
  createAutocomplete({ name: 'Los Angeles', icon: '📍', type: 'country' }),
  createAutocomplete({ name: 'Las Vegas', icon: '📍', type: 'country' }),
  createAutocomplete({ name: 'Miami', icon: '📍', type: 'country' }),
  createAutocomplete({ name: 'Chicago', icon: '📍', type: 'country' }),
  createAutocomplete({ name: 'New Orleans', icon: '📍', type: 'country' }),
]

export const state: HomeState = {
  started: false,
  skipNextPageFetchData: false,
  activeIndex: -1,
  allTags,
  allLenseTags: tagLenses,
  allFilterTags: tagFilters,
  allRestaurants: {},
  autocompleteDishes: [],
  autocompleteIndex: 0,
  autocompleteResults: [],
  breadcrumbStates: [],
  currentState: (state) => _.last(state.states)!,
  currentNavItem,
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
    return (
      state.allTags[state.autocompleteResults[autocompleteIndex - 1]?.tagId] ||
      null
    )
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
    return getActiveTags(state, lastTaggable)
  },
}

// TODO type
let mapView: mapkit.Map | null = null
export function setMapView(x: mapkit.Map) {
  mapView = x
}

export const isOnOwnProfile = (state: OmState) => {
  return (
    slugify(state.user?.user?.username) ===
    state.router.curPage.params?.username
  )
}

export const isEditingUserPage = (state: OmState) => {
  return state.home.currentStateType === 'userSearch' && isOnOwnProfile(state)
}

const start: AsyncAction = async (om) => {
  om.actions.home.updateBreadcrumbs()
  om.actions.home.updateCurrentMapAreaInformation()
  // promises are nice here, dont wait on anything top level unless necessary
  om.actions.home._loadHomeDishes().then(async () => {
    await om.actions.home.startAutocomplete()
  })
}

let defaultAutocompleteResults: AutocompleteItem[] | null = null

const startAutocomplete: AsyncAction = async (om) => {
  const dishes = _.flatMap(om.state.home.topDishes.map((x) => x.dishes))
    .filter(Boolean)
    .slice(0, 20)
    .map((d) => ({
      id: d.name,
      name: d.name,
      type: 'dish',
      icon: d.image,
      tagId: getTagId({ type: 'dish', name: d.name }),
    }))
  const countries = om.state.home.topDishes.map((x) => ({
    id: x.country,
    type: 'country',
    name: x.country,
    icon: x.icon,
    tagId: getTagId({ type: 'country', name: x.country }),
  }))

  const results = [
    ...dishes.slice(0, 3),
    ..._.flatMap(_.zip(countries, dishes.slice(3))),
  ]
    .filter(Boolean)
    .slice(0, 20) as AutocompleteItem[]
  defaultAutocompleteResults = results
  om.state.home.autocompleteResults = results
  await om.actions.home._runAutocomplete(om.state.home.currentState.searchQuery)
}

type PageAction = (om: Om) => Promise<void>

const pushHomeState: AsyncAction<
  HistoryItem,
  {
    fetchDataPromise: Promise<void>
  }
> = async (om, item) => {
  const { started, currentState } = om.state.home

  const fallbackState = {
    id: item.replace ? currentState.id : `${Math.random()}`,
    center: currentState?.center ?? initialHomeState.center,
    span: currentState?.span ?? initialHomeState.span,
    searchQuery: currentState?.searchQuery ?? '',
  }
  const newState = {
    historyId: item.id,
  }

  let nextState: HomeStateItem | null = null
  let fetchData: PageAction | null = null
  let activeTagIds: HomeActiveTagIds

  const type = item.name

  switch (type) {
    // home
    case 'home': {
      activeTagIds = om.state.home.lastHomeState.activeTagIds

      // be sure to remove all searchbar tags
      activeTagIds = Object.keys(activeTagIds).reduce((acc, id) => {
        if (!isSearchBarTag(om.state.home.allTags[id])) {
          acc[id] = true
        }
        return acc
      }, {})

      nextState = {
        ...fallbackState,
        type,
        ...om.state.home.lastHomeState,
        ...newState,
        activeTagIds,
      } as HomeStateItemHome
      break
    }

    // search or userSearch
    case 'userSearch':
    case 'search': {
      const lastHomeOrSearch = _.findLast(
        om.state.home.states,
        (x) => isHomeState(x) || isSearchState(x)
      ) as HomeStateItemHome | HomeStateItemSearch

      // use last home or search to get most up to date
      activeTagIds = lastHomeOrSearch.activeTagIds

      if (!started) {
        let fakeTags = getTagsFromRoute(om.state.router.curPage)
        const tags = await getFullTags(fakeTags)

        console.log('got tags', tags)
        activeTagIds = tags.reduce((acc, tag) => {
          const id = getTagId(tag)
          om.state.home.allTags[id] = tag as Tag // ?
          acc[id] = true
          return acc
        }, {})
      }

      const username =
        type == 'userSearch' ? om.state.router.curPage.params.username : ''
      const searchQuery = item.params.search ?? fallbackState.searchQuery
      const searchState: HomeStateItemSearch = {
        ...fallbackState,
        hasMovedMap: false,
        results: { status: 'loading' },
        ...om.state.home.lastSearchState,
        ...newState,
        type,
        username,
        activeTagIds,
        searchQuery,
      }
      nextState = searchState
      fetchData = async (om) => {
        await Promise.all([
          /// search
          om.actions.home.runSearch(),
          getUserInfo(),
        ])

        async function getUserInfo() {
          // userpage load user
          if (item.name === 'userSearch') {
            const user = new User()
            await user.findOne('username', item.params.username)
            const state = om.state.home.currentState
            if (!user || state.type !== 'userSearch') return
            state.user = user
          }
        }
      }
      break
    }

    // restaurant
    case 'restaurant': {
      nextState = {
        ...fallbackState,
        type,
        restaurantId: null,
        review: null,
        reviews: [],
        ...newState,
      }
      fetchData = async () => {
        const slug = item.params.slug
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
            lng: 0.008, // Math.max(0.010675285275539181, currentState.span.lng * 0.5),
            lat: 0.003, // Math.max(0.004697178346440012, currentState.span.lat * 0.5),
          }
          state.reviews = await Review.findAllForRestaurant(restaurant.id)
          if (om.state.user.isLoggedIn) {
            await om.actions.home.getReview()
          }
        }
      }
      break
    }

    case 'user': {
      nextState = {
        ...fallbackState,
        type: 'user',
        reviews: [],
        user: null,
        username: item.params.username,
        ...newState,
      }
      fetchData = async (om) => {
        await om.actions.home._loadUserDetail({
          username: item.params.username,
        })
      }
      break
    }
  }

  if (!nextState) {
    console.warn('no nextstate', item)
    return
  }

  const replace =
    item.replace || om.state.home.currentStateType === nextState.type

  console.log('pushHomeState', { nextState, item, replace })

  if (replace) {
    // try granular update
    const lastState = om.state.home.states[om.state.home.states.length - 1]
    for (const key in nextState) {
      if (!isEqual(nextState[key], lastState[key])) {
        // console.log('update value', key, lastState[key], 'to', nextState[key])
        lastState[key] = _.isPlainObject(nextState[key])
          ? { ...nextState[key] }
          : nextState[key]
      }
    }
  } else {
    om.state.home.states = [...om.state.home.states, nextState]
  }

  if (!om.state.home.started) {
    om.state.home.started = true
  }

  const shouldSkip = om.state.home.skipNextPageFetchData
  om.state.home.skipNextPageFetchData = false

  let fetchDataPromise: Promise<any> | null
  if (!shouldSkip && fetchData) {
    fetchDataPromise = om.actions.home.startAction(fetchData)
  }
  return {
    fetchDataPromise,
  }
}

let currentAction: PageAction

const refresh: AsyncAction = async (om) => {
  if (!currentAction) return
  currentAction(om)
}

const startAction: AsyncAction<PageAction> = async (om, fn) => {
  currentAction = fn
  await fn(om)
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
    om.actions.home.setShowAutocomplete(false)
    om.state.home.states = _.dropRight(om.state.home.states)
  }
}

const attemptAuthenticatedAction = async (om: Om, cb: Function) => {
  try {
    return await cb()
  } catch (err) {
    if (`${err.message}`.includes('JWTExpired')) {
      // logout
      Toast.show(`Login has expired`)
      await om.actions.user.logout()
    } else {
      throw err
    }
  }
}

const _loadUserDetail: AsyncAction<{
  username: string
}> = async (om, { username }) => {
  await attemptAuthenticatedAction(om, async () => {
    const user = new User()
    await user.findOne('username', username)
    const state = om.state.home.currentState
    if (state.type === 'user') {
      state.user = user
      state.reviews = await Review.findAllForUser(user.id)
    }
  })
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

  if (!isWorker) {
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
    if (id != lastRunAt) return
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

  await om.actions.home._syncStateToRoute(nextState)
}

const _runAutocomplete: AsyncAction<string> = async (om, query) => {
  const state = om.state.home.currentState

  if (query === '') {
    console.log('no query', defaultAutocompleteResults)
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
  console.log('set autocomplete results', results)
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
    // if (answer) console.log('search: cancel')
    return answer
  }

  query = query.trim()

  const searchArgs: RestaurantSearchArgs = {
    center: roundLngLat(state.center),
    span: roundLngLat(padSpan(state.span)),
    query,
    tags: tags.map((tag) => getTagId(tag)),
  }

  // prevent duplicate searches
  const searchKey = JSON.stringify(searchArgs)
  console.log('searchArgs', searchArgs, opts, searchKey === lastSearchKey)
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
  console.log('searched', searchArgs, restaurants)
  if (shouldCancel()) return

  state = om.state.home.lastSearchState
  if (shouldCancel()) return

  // fetch reviews before render
  if (om.state.user.isLoggedIn) {
    await attemptAuthenticatedAction(om, async () => {
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
    })
    if (shouldCancel()) return
  }

  // update denormalized dictionary
  const { allRestaurants } = om.state.home
  for (const restaurant of restaurants) {
    const existing = allRestaurants[restaurant.id]
    if (!existing || existing.updated_at !== restaurant.updated_at) {
      allRestaurants[restaurant.id] = restaurant
    }
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

function reverseGeocode(center: LngLat): Promise<GeocodePlace[]> {
  const mapGeocoder = new window.mapkit.Geocoder({
    language: 'en-GB',
    getsUserLocation: true,
  })
  return new Promise((res, rej) => {
    mapGeocoder.reverseLookup(
      new window.mapkit.Coordinate(center.lat, center.lng),
      (err, data) => {
        if (err) return rej(err)
        res((data.results as any) as GeocodePlace[])
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
  await om.actions.home.updateCurrentMapAreaInformation()
}

const spanToLocationName = (span: LngLat, place: GeocodePlace): string => {
  if (span.lat < 0.3) {
    return place.subLocality
  }
  return place.locality
}

const updateCurrentMapAreaInformation: AsyncAction = async (om) => {
  const currentState = om.state.home.currentState
  const center = currentState.center
  const span = currentState.span
  try {
    const [firstResult] = (await reverseGeocode(center)) ?? []
    const placeName = firstResult.subLocality ?? firstResult.locality
    if (placeName) {
      currentState.currentLocationInfo = firstResult
      currentState.currentLocationName = spanToLocationName(span, firstResult)
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

  const promises = new Set<Promise<any>>()

  // actions per-route
  switch (name) {
    case 'home':
    case 'search':
    case 'user':
    case 'userSearch':
    case 'restaurant': {
      if (type === 'push' || type === 'replace') {
        const { fetchDataPromise } = await pushHomeState(om, item)
        promises.add(fetchDataPromise)
      } else {
        popHomeState(om, item)
      }
      break
    }
  }

  om.actions.home.updateBreadcrumbs()
  currentStates = om.state.home.states
  await Promise.all([...promises])
}

export let currentStates: HomeStateItem[] = []

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
  const locationSearch = new window.mapkit.Search({ region: mapView.region })
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

const runHomeSearch: AsyncAction<string> = async (om, query) => {
  const res = await fuzzyFindIndices(query, om.state.home.topDishes, [
    'country',
  ])
  om.state.home.topDishesFilteredIndices = res
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

const _syncStateToRoute: AsyncAction<HomeStateItem | void> = async (
  om,
  ogState
) => {
  const homeState = ogState || om.state.home.currentState
  const next = getNavigateItemForState(om.state, homeState)
  if (om.actions.router.getShouldNavigate(next)) {
    om.actions.router.navigate(next)
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
  const username = om.state.user.user?.username
  if (!username) {
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
      username,
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

// used to help prevent duplicate searches on slight diff in map move
const roundLngLat = (val: LngLat): LngLat => {
  // 4 decimal precision is good to a few meters
  return {
    lng: Math.round(val.lng * 10000) / 10000,
    lat: Math.round(val.lat * 10000) / 10000,
  }
}

const setMapMoved: Action = (om) => {
  const { lastSearchState } = om.state.home
  if (lastSearchState?.hasMovedMap === false) {
    lastSearchState.hasMovedMap = true
  }
}

const updateBreadcrumbs: Action = (om) => {
  const next = createBreadcrumbs(om.state.home)
  if (!isEqual(next, om.state.home.breadcrumbStates)) {
    om.state.home.breadcrumbStates = next
  }
}

const createBreadcrumbs = (state: HomeStateBase) => {
  let crumbs: HomeStateItemSimple[] = []
  stateLoop: for (let i = state.states.length - 1; i >= 0; i--) {
    const cur = state.states[i]
    switch (cur.type) {
      case 'home': {
        crumbs.unshift(cur)
        break stateLoop
      }
      case 'search':
      case 'userSearch':
      case 'user':
      case 'restaurant': {
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
  return crumbs.map((x) => _.pick(x, 'id', 'type'))
}

function createAutocomplete(x: Partial<AutocompleteItem>): AutocompleteItem {
  return {
    name: x.name,
    type: x.type,
    ...x,
    tagId: getTagId({ name: x.name, type: x.type }),
  }
}

export const actions = {
  navigateToTag,
  setMapMoved,
  navigateToTagId,
  getNavigateToTag,
  startAutocomplete,
  _afterTagChange,
  _loadHomeDishes,
  _loadUserDetail,
  _runAutocomplete,
  runHomeSearch,
  updateCurrentMapAreaInformation,
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
  start,
  refresh,
  submitReview,
  suggestTags,
  startAction,
  updateBreadcrumbs,
  toggleTagOnHomeState,
}
