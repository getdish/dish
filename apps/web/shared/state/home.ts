import { requestIdle, sleep } from '@dish/async'
import {
  Restaurant,
  RestaurantSearchArgs,
  TopCuisine,
  getHomeDishes,
  query,
  resolved,
  search,
  slugify,
} from '@dish/graph'
import { Toast } from '@dish/ui'
import { isEqual } from '@o/fast-compare'
import _, { findLast, last } from 'lodash'
import { Action, AsyncAction, derived } from 'overmind'

import { isWorker } from '../constants'
import { fuzzyFind, fuzzyFindIndices } from '../helpers/fuzzy'
import { timer } from '../helpers/timer'
import {
  isHomeState,
  isRestaurantState,
  isSearchState,
  shouldBeOnHome,
} from './home-helpers'
import {
  allTags,
  getActiveTags,
  getFullTags,
  getNavigateItemForState,
  getNavigateToTags,
  getNextStateWithTags,
  getTagsFromRoute,
  isSearchBarTag,
  navigateToTag,
  syncStateToRoute,
} from './home-tag-helpers'
import {
  AutocompleteItem,
  GeocodePlace,
  HomeActiveTagIds,
  HomeState,
  HomeStateItem,
  HomeStateItemHome,
  HomeStateItemRestaurant,
  HomeStateItemSearch,
  HomeStateItemSimple,
  HomeStateTagNavigable,
  LngLat,
  OmState,
  ShowAutocomplete,
} from './home-types'
import { HistoryItem, NavigateItem, RouteItem } from './router'
import { Tag, getTagId, tagFilters, tagLenses } from './Tag'

const INITIAL_RADIUS = 0.16

// backward compat
export * from './home-types'

export const homeTimer = timer('home')

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

const derivations = {
  currentNavItem: derived<HomeState, NavigateItem>((state, om) =>
    getNavigateItemForState(om, last(state.states)!)
  ),

  lastHomeState: derived<HomeState, HomeStateItemHome>(
    (state) => findLast(state.states, isHomeState)!
  ),
  lastRestaurantState: derived<HomeState, HomeStateItemRestaurant | undefined>(
    (state) => findLast(state.states, isRestaurantState)
  ),
  lastSearchState: derived<HomeState, HomeStateItemSearch | undefined>(
    (state) => findLast(state.states, isSearchState)
  ),
  currentState: derived<HomeState, HomeStateItem>(
    (state) => _.last(state.states)!
  ),
  currentStateSearchQuery: derived<HomeState, HomeStateItem['searchQuery']>(
    (state) => state.currentState.searchQuery
  ),
  currentStateType: derived<HomeState, HomeStateItem['type']>(
    (state) => state.currentState.type
  ),
  isAutocompleteActive: derived<HomeState, boolean>(
    (state) => state.activeIndex === -1
  ),
  previousState: derived<HomeState, HomeStateItem>(
    (state) => state.states[state.states.length - 2]
  ),
  searchBarTags: derived<HomeState, Tag[]>((state) =>
    state.lastActiveTags.filter(isSearchBarTag)
  ),
  autocompleteFocusedTag: derived<HomeState, Tag | null>((state) => {
    const { autocompleteIndex } = state
    if (autocompleteIndex < 0) return null
    if (!state.autocompleteResults) return null
    return (
      state.allTags[state.autocompleteResults[autocompleteIndex - 1]?.tagId] ||
      null
    )
  }),
  searchbarFocusedTag: derived<HomeState, Tag | null>((state) => {
    const { autocompleteIndex } = state
    if (autocompleteIndex > -1) return null
    const index = state.searchBarTags.length + autocompleteIndex
    return state.searchBarTags[index]
  }),
  autocompleteResultsActive: derived<HomeState, AutocompleteItem[]>((state) => {
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
        ? state.locationAutocompleteResults ?? []
        : state.autocompleteResults ?? []),
    ]
  }),
  isLoading: derived<HomeState, boolean>((state) => {
    const cur = state.currentState
    if (isSearchState(cur)) {
      return cur.results.status === 'loading'
    }
    return false
  }),
  lastActiveTags: derived<HomeState, Tag[]>((state) => {
    const lastTaggable = _.findLast(
      state.states,
      (x) => isHomeState(x) || isSearchState(x)
    ) as HomeStateItemSearch | HomeStateItemHome
    return getActiveTags(state, lastTaggable)
  }),
}

export const state: HomeState = {
  started: false,
  isScrolling: false,
  skipNextPageFetchData: false,
  activeIndex: -1,
  allTags,
  allTagsNameToID: {},
  allUsers: {},
  allLenseTags: tagLenses,
  allFilterTags: tagFilters,
  allRestaurants: {},
  autocompleteDishes: [],
  autocompleteIndex: 0,
  autocompleteResults: [],
  breadcrumbStates: [],
  hoveredRestaurant: null,
  location: null,
  locationAutocompleteResults: defaultLocationAutocompleteResults,
  locationSearchQuery: '',
  showAutocomplete: false,
  showUserMenu: false,
  states: [initialHomeState],
  topDishes: [],
  topDishesFilteredIndices: [],
  ...derivations,
}

// TODO type
let mapView: mapkit.Map | null = null
export function setMapView(x: mapkit.Map) {
  mapView = x
}

export const isOnOwnProfile = (state: OmState) => {
  const username = state.user?.user?.username
  return username && slugify(username) === state.router.curPage.params?.username
}

export const isEditingUserPage = (state: OmState) => {
  return state.home.currentStateType === 'userSearch' && isOnOwnProfile(state)
}

// only await things that are required on first render
const start: AsyncAction = async (om) => {
  om.actions.home.updateBreadcrumbs()
  om.actions.home.updateCurrentMapAreaInformation()
  // promises are nice here, dont wait on anything top level unless necessary
  loadHomeDishes(om).then(async () => {
    await om.actions.home.startAutocomplete()
  })
}

let defaultAutocompleteResults: AutocompleteItem[] | null = null

const startAutocomplete: AsyncAction = async (om) => {
  const dishes = om.state.home.topDishes
    .map((x) => x.dishes)
    .flat()
    .filter(Boolean)
    .slice(0, 20)
    .map((d) => ({
      id: d.name,
      name: d.name,
      type: 'dish',
      icon: d.image,
      tagId: getTagId({ type: 'dish', name: d.name ?? '' }),
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
    ..._.zip(countries, dishes.slice(3)).flat(),
  ]
    .filter(Boolean)
    .slice(0, 20) as AutocompleteItem[]
  defaultAutocompleteResults = results
  om.state.home.autocompleteResults = results
  await runAutocomplete(om, om.state.home.currentState.searchQuery)
}

type PageAction = () => Promise<void>

let nextPushIsReallyAPop = false

const pushHomeState: AsyncAction<
  HistoryItem,
  {
    fetchDataPromise: Promise<any>
  } | null
> = async (om, item) => {
  const { started, currentState } = om.state.home
  const historyId = item.id
  const id = item.replace ? currentState.id : `${Math.random()}`
  const fallbackState = {
    id,
    center: currentState?.center ?? initialHomeState.center,
    span: currentState?.span ?? initialHomeState.span,
    searchQuery: item.params.query ?? currentState?.searchQuery ?? '',
  }
  const newState = {
    historyId,
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
        ...om.state.home.lastHomeState,
        type,
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
        const fakeTags = getTagsFromRoute(om.state.router.curPage)
        const tags = await getFullTags(fakeTags)
        activeTagIds = tags.reduce((acc, tag) => {
          const id = getTagId(tag)
          om.actions.home.addTagToCache(tag)
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
      fetchData = om.actions.home.loadPageSearch
      break
    }

    // restaurant
    case 'restaurant': {
      nextState = {
        ...fallbackState,
        type,
        restaurantId: null,
        restaurantSlug: item.params.slug,
        ...newState,
      }
      fetchData = om.actions.home.loadPageRestaurant
      break
    }

    case 'user': {
      nextState = {
        ...fallbackState,
        type: 'user',
        username: item.params.username,
        ...newState,
      }
      break
    }

    case 'gallery': {
      nextState = {
        ...fallbackState,
        type: 'gallery',
        restaurantSlug: item.params.restaurantSlug,
        dishId: item.params.dishId,
      }
      break
    }
  }

  console.log('pushHomeState', { item, nextState })

  async function runFetchData() {
    if (!fetchData) {
      return
    }
    try {
      await fetchData()
    } catch (err) {
      console.error(err)
      Toast.show(`Error loading page`)
    }
  }

  // is going back
  // we are going back to a prev state!
  // hacky for now
  if (nextPushIsReallyAPop) {
    nextPushIsReallyAPop = false
    const prev = _.findLast(om.state.home.states, (x) => x.type === item.name)
    if (prev) {
      const prevIndex = om.state.home.states.indexOf(prev)
      om.state.home.states.splice(prevIndex)
      om.state.home.states.push({ ...prev, id })
    } else {
      throw new Error('unreachable')
    }
    currentAction = runFetchData
    return { fetchDataPromise: Promise.resolve(null) }
  }

  if (!nextState) {
    console.warn('no nextstate', item)
    return null
  }

  const replace =
    item.replace || om.state.home.currentStateType === nextState.type

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

  let fetchDataPromise: Promise<any> | null = null
  if (!shouldSkip && fetchData) {
    currentAction = runFetchData
    // start
    let res: any
    let rej: any
    fetchDataPromise = new Promise((res2, rej2) => {
      res = res2
      rej = rej2
    })
    setTimeout(() => {
      runFetchData().then(res, rej)
    }, 16)
  }

  if (fetchDataPromise) {
    return {
      fetchDataPromise,
    }
  }

  return null
}

const loadPageRestaurant: AsyncAction = async (om) => {
  const state = om.state.home.currentState
  if (state.type !== 'restaurant') return
  const slug = state.restaurantSlug
  const restaurant = await resolved(() => {
    const [{ location, id }] = query.restaurant({
      where: { slug: { _eq: slug } },
    })
    location?.coordinates
    return { location, id }
  })
  om.state.home.allRestaurants[restaurant.id] = restaurant
  if (state && restaurant) {
    state.restaurantId = restaurant.id
    state.center = {
      lng: restaurant.location.coordinates[0],
      lat: restaurant.location.coordinates[1],
    }
    // zoom in a bit
    state.span = {
      lng: 0.008, // Math.max(0.010675285275539181, currentState.span.lng * 0.5),
      lat: 0.003, // Math.max(0.004697178346440012, currentState.span.lat * 0.5),
    }
  }
}

const loadPageSearch: AsyncAction = async (om) => {
  const state = om.state.home.currentState
  if (state.type !== 'search' && state.type !== 'userSearch') return
  om.actions.home.runSearch({ force: true })
}

let currentAction: PageAction

const refresh: AsyncAction = async (om) => {
  if (!currentAction) return
  await currentAction()
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

  // we can just use router history directly, no? and go back?
  const prevPage = om.state.router.prevPage
  console.log({ type, prevPage })
  if (prevPage?.name === type && prevPage.type === 'push') {
    console.log('history matches, testing going back directly')
    om.actions.router.back()
    return
  }

  const stateItem = _.findLast(om.state.router.history, (x) => x.name == type)
  nextPushIsReallyAPop = true
  om.actions.router.navigate({
    name: type,
    params: stateItem?.params ?? {},
  })
}

const popHomeState: Action<HistoryItem> = (om, item) => {
  if (om.state.home.states.length > 1) {
    om.actions.home.setShowAutocomplete(false)
    om.state.home.states = _.dropRight(om.state.home.states)
  }
}

const loadHomeDishes: AsyncAction = async (om) => {
  const all = await getHomeDishes(
    om.state.home.currentState.center.lat,
    om.state.home.currentState.center.lng,
    // TODO span
    om.state.home.currentState.span.lat
  )

  if (!all) {
    console.warn('none!!')
    return
  }

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
        id: dish.name ?? '',
        name: dish.name ?? '',
        type: 'dish',
      }
      om.actions.home.addTagToCache(tag)
    }
  }

  const chunks: TopCuisine[][] = _.chunk(all, 4)

  if (isWorker) {
    let now: TopCuisine[] = []
    for (const chunk of chunks) {
      await sleep(300)
      now = [...now, ...chunk]
      om.state.home.topDishes = now
    }
  } else {
    om.state.home.topDishes = all
  }
}

const DEBOUNCE_AUTOCOMPLETE = 120

let lastRunAt = Date.now()
let curQuery = ''
const setSearchQuery: AsyncAction<string> = async (om, query: string) => {
  // also reset runSearch! hacky!
  lastSearchAt = Date.now()
  lastRunAt = Date.now()
  curQuery = query
  let id = lastRunAt
  const state = om.state.home.currentState
  const isDeleting = query.length < state.searchQuery.length
  // AUTOCOMPLETE
  const delayByX = isDeleting ? 2 : 1
  await sleep(DEBOUNCE_AUTOCOMPLETE * delayByX)
  if (id != lastRunAt) return
  // fast actions
  om.actions.home.setShowAutocomplete('search')
  runAutocomplete(om, query)
}

const runAutocomplete: AsyncAction<string> = async (om, query) => {
  const state = om.state.home.currentState

  if (query === '') {
    om.state.home.autocompleteResults = defaultAutocompleteResults ?? []
    om.state.home.locationAutocompleteResults = defaultLocationAutocompleteResults
    return
  }

  const [restaurantsResults, locationResults] = await Promise.all([
    search({
      center: state.center,
      span: padSpan(state.span),
      query,
      limit: 5,
    }),
    searchLocations(state.searchQuery),
  ])

  const autocompleteDishes = om.state.home.autocompleteDishes
  let found = await fuzzyFind(query, autocompleteDishes)
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

  om.actions.home.setAutocompleteResults(results)
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
const runSearch: AsyncAction<{
  quiet?: boolean
  force?: boolean
} | void> = async (om, opts) => {
  opts = opts || { quiet: false }
  lastSearchAt = Date.now()
  let curId = lastSearchAt

  if (om.state.home.currentState.searchQuery !== curQuery) {
    om.state.home.currentState.searchQuery = curQuery
  }

  if (await om.actions.home.navigateToCurrentState()) {
    // navigate will trigger new search
    return
  }

  const state = om.state.home.currentState

  if (!isSearchState(state)) {
    console.warn('NO SEARCH?')
    return
  }

  const tags = getActiveTags(om.state.home)

  const shouldCancel = () => {
    const answer = !state || lastSearchAt != curId
    if (answer) console.log('search: cancel')
    return answer
  }

  // dont be so eager if started
  if (!opts.force && om.state.home.started) {
    await Promise.all([sleep(10), requestIdle()])
    if (shouldCancel()) return
  }

  const searchArgs: RestaurantSearchArgs = {
    center: roundLngLat(state.center),
    span: roundLngLat(padSpan(state.span)),
    query: state.searchQuery,
    tags: tags.map((tag) => getTagId(tag)),
  }

  // prevent duplicate searches
  const searchKey = JSON.stringify(searchArgs)
  if (!opts.force && searchKey === lastSearchKey) return

  if (!opts?.quiet) {
    state.hasMovedMap = false
    state.results = {
      // preserve last results
      results: state.results.results,
      status: 'loading',
    }
  }

  // fetch
  let restaurants = await search(searchArgs)
  console.log('searched', searchArgs, restaurants)
  if (shouldCancel()) return

  // update denormalized dictionary
  const { allRestaurants } = om.state.home
  for (const restaurant of restaurants) {
    const existing = allRestaurants[restaurant.id]
    if (!existing || existing.updated_at !== restaurant.updated_at) {
      allRestaurants[restaurant.id] = restaurant as any
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
    om.actions.home.popTo('home')
  }
}

const setHoveredRestaurant: Action<Restaurant> = (om, val) => {
  om.state.home.hoveredRestaurant = { ...val }
}

const setShowUserMenu: Action<boolean> = (om, val) => {
  om.state.home.showUserMenu = val
}

const suggestTags: AsyncAction<string> = async (om, tags) => {
  let state = om.state.home.currentState
  if (!isRestaurantState(state)) return
  // let restaurant = new Restaurant(
  //   om.state.home.allRestaurants[state.restaurantId]
  // )
  // await restaurant.upsertOrphanTags(tags.split(','))
  // om.state.home.allRestaurants[state.restaurantId] = restaurant
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
  if (span.lat < 0.07) {
    return place.subLocality // Mission Dolores
  }
  return place.locality // San Francisco
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

  console.log('handleRouteChange', { type, name, item })

  const promises = new Set<Promise<any>>()

  // actions per-route
  switch (name) {
    case 'home':
    case 'search':
    case 'user':
    case 'gallery':
    case 'userSearch':
    case 'restaurant': {
      if (type === 'push' || type === 'replace') {
        const res = await pushHomeState(om, item)
        if (res?.fetchDataPromise) {
          promises.add(res.fetchDataPromise)
        }
      } else {
        om.actions.home.popHomeState(item)
      }
      break
    }
    default: {
      console.log('not handled by home', name)
      return
    }
  }

  om.actions.home.updateBreadcrumbs()
  currentStates = om.state.home.states
  await Promise.all([...promises])
}

export let currentStates: HomeStateItem[] = []

// for use in avoiding autofocus focus on focus
let justFocusedWindow = false
if (typeof window !== 'undefined') {
  window.addEventListener('focus', () => {
    justFocusedWindow = true
    setTimeout(() => {
      justFocusedWindow = false
    }, 100)
  })
}

const setShowAutocomplete: Action<ShowAutocomplete> = (om, val) => {
  if (justFocusedWindow) {
    return
  }
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
  const locationSearch = new window.mapkit.Search({ region: mapView?.region })
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
  om.actions.home.setAutocompleteIndex(cur + val)
}

// see setSearchBarFocusedTag
const setAutocompleteIndex: Action<number> = (om, val) => {
  const tags = om.state.home.searchBarTags
  const min = 0 - tags.length
  const next = Math.min(
    Math.max(min, val),
    om.state.home.autocompleteResults.length - 1
  )
  om.state.home.autocompleteIndex = next
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

const requestLocation: Action = (om) => {}

const setSearchBarFocusedTag: Action<Tag | null> = (om, val) => {
  if (!val) {
    om.state.home.autocompleteIndex = 0
    return
  }
  const tags = om.state.home.searchBarTags
  const tagIndex = tags.findIndex((x) => getTagId(x) === getTagId(val))
  om.state.home.autocompleteIndex = -tags.length + tagIndex
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
function padSpan(val: LngLat, by = 0.9): LngLat {
  return {
    lng: val.lng * by,
    lat: val.lat * by,
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

const setHasMovedMap: Action<boolean | void> = (om, val = true) => {
  const next = !!val
  const { lastSearchState } = om.state.home
  if (lastSearchState && lastSearchState.hasMovedMap !== next) {
    lastSearchState.hasMovedMap = next
  }
}

const updateBreadcrumbs: Action = (om) => {
  const next = createBreadcrumbs(om.state.home)
  if (!isEqual(next, om.state.home.breadcrumbStates)) {
    om.state.home.breadcrumbStates = next
  }
}

const createBreadcrumbs = (state: HomeState) => {
  let crumbs: HomeStateItemSimple[] = []
  // reverse loop to find latest
  for (let i = state.states.length - 1; i >= 0; i--) {
    const cur = state.states[i]
    switch (cur.type) {
      case 'home': {
        crumbs.unshift(cur)
        return crumbs.map((x) => ({
          id: x.id,
          type: x.type,
        }))
      }
      case 'search':
      case 'userSearch':
      case 'user':
      case 'restaurant': {
        if (crumbs.some((x) => x.type === cur.type)) {
          break
        }
        if (
          (cur.type === 'restaurant' ||
            cur.type === 'user' ||
            cur.type == 'userSearch') &&
          crumbs.some(isSearchState)
        ) {
          break
        }
        if (isSearchState(cur) && crumbs.some(isSearchState)) {
          break
        }
        crumbs.unshift(cur)
        break
      }
    }
  }
}

function createAutocomplete(x: Partial<AutocompleteItem>): AutocompleteItem {
  return {
    name: x.name ?? '',
    type: x.type ?? 'dish',
    ...x,
    tagId: getTagId({ name: x.name ?? '', type: x.type ?? 'dish' }),
  }
}

const setIsScrolling: Action<boolean> = (om, val) => {
  om.state.home.isScrolling = val
}

const updateActiveTags: AsyncAction<HomeStateTagNavigable, boolean> = async (
  om,
  next
) => {
  const state = om.state.home.currentState
  if (state.type === next.type) {
    if (
      !isEqual(state['activeTagIds'], next['activeTagIds']) ||
      !isEqual(state.searchQuery, next.searchQuery)
    ) {
      if ('activeTagIds' in state) {
        state.activeTagIds = next.activeTagIds
      }
      state.searchQuery = next.searchQuery
    }
  }
  return await syncStateToRoute(om, next)
}

// this is useful for search where we mutate the current state while you type,
// but then later you hit "enter" and we need to navigate to search (or home)
// we definitely can clean up / name better some of this once things settle
const navigateToCurrentState: AsyncAction<undefined, boolean> = async (om) => {
  const nextState = getNextStateWithTags(om, {
    tags: [],
  })
  return await om.actions.home.updateActiveTags(nextState)
}

// adds to allTags + allTagsNameToID
const addTagToCache: Action<Tag> = (om, tag) => {
  const id = getTagId(tag)
  om.state.home.allTags[id] = tag
  om.state.home.allTagsNameToID[tag.name.toLowerCase()] = id
}

const setAutocompleteResults: Action<AutocompleteItem[]> = (om, results) => {
  om.state.home.autocompleteResults = results
}

export const actions = {
  setIsScrolling,
  navigateToTag,
  setHasMovedMap,
  getNavigateToTags,
  startAutocomplete,
  runHomeSearch,
  updateCurrentMapAreaInformation,
  clearSearch,
  forkCurrentList,
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
  setAutocompleteIndex,
  setShowAutocomplete,
  setShowUserMenu,
  start,
  refresh,
  suggestTags,
  updateBreadcrumbs,
  loadPageSearch,
  loadPageRestaurant,
  popHomeState,
  updateActiveTags,
  addTagToCache,
  setAutocompleteResults,
  navigateToCurrentState,
}
