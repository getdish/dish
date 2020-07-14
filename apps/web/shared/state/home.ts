import { fullyIdle, sleep } from '@dish/async'
import {
  RestaurantOnlyIds,
  RestaurantSearchArgs,
  Tag,
  getHomeDishes,
  query,
  resolved,
  search,
  slugify,
} from '@dish/graph'
import { assert, handleAssertionError, stringify } from '@dish/helpers'
import { Toast } from '@dish/ui'
import { isEqual } from '@o/fast-compare'
import _, { clamp, cloneDeep, findLast, last, pick } from 'lodash'
import { Action, AsyncAction, derived } from 'overmind'

import { fuzzyFind, fuzzyFindIndices } from '../helpers/fuzzy'
import { memoize } from '../helpers/memoizeWeak'
import { timer } from '../helpers/timer'
import { LinkButtonProps } from '../views/ui/LinkProps'
import { isHomeState, isRestaurantState, isSearchState } from './home-helpers'
import {
  HomeStateNav,
  allTags,
  getActiveTags,
  getFullTags,
  getNavigateItemForState,
  getNextState,
  getTagsFromRoute,
  isSearchBarTag,
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
  Om,
  OmState,
  ShowAutocomplete,
} from './home-types'
import { HistoryItem, NavigateItem, RouteItem } from './router'
import { NavigableTag, getTagId, tagFilters, tagLenses } from './Tag'

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
  lastActiveTags: derived<HomeState, Tag[]>((state) => {
    const lastTaggable = _.findLast(
      state.states,
      (x) => isHomeState(x) || isSearchState(x)
    ) as HomeStateItemSearch | HomeStateItemHome
    return getActiveTags(state, lastTaggable)
  }),
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
  breadcrumbStates: derived<HomeState, HomeStateItemSimple[]>((state) => {
    return createBreadcrumbs(state)
  }),
  currentStateLense: derived<HomeState, NavigableTag | null>((state) => {
    if ('activeTagIds' in state.currentState) {
      for (const id in state.currentState.activeTagIds) {
        const tag = state.allTags[id]
        if (tag.type == 'lense') {
          return tag
        }
      }
    }
    return null
  }),
  autocompleteResultsActive: derived<HomeState, AutocompleteItem[]>((state) => {
    const prefix: AutocompleteItem[] = [
      {
        name: '',
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
}

export const state: HomeState = {
  started: false,
  isLoading: false,
  isScrolling: false,
  skipNextPageFetchData: false,
  activeIndex: -1,
  allTags,
  allTagsNameToID: {},
  allUsers: {},
  allLenseTags: tagLenses,
  allFilterTags: tagFilters,
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

export const isEditingUserPage = (
  state: HomeStateItemSearch,
  omState: OmState
) => {
  return state.type === 'userSearch' && isOnOwnProfile(omState)
}

// only await things that are required on first render
const start: AsyncAction = async (om) => {
  om.actions.home.updateCurrentMapAreaInformation()
  const fullyLoadedPromise = loadHomeDishes(om).then(async () => {
    await om.actions.home.startAutocomplete()
  })
  if (process.env.TARGET === 'ssr') {
    console.log('Server mode, waiting for top dishes to fully load...')
    await fullyLoadedPromise
  }
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
  const results = ([
    ...dishes.slice(0, 3),
    ..._.zip(countries, dishes.slice(3)).flat(),
  ] as AutocompleteItem[])
    .filter(Boolean)
    .slice(0, 20)
  defaultAutocompleteResults = results
  om.actions.home.setAutocompleteResults(results)
}

type PageAction = () => Promise<void>

let nextPushIsReallyAPop = false

const pushHomeState: AsyncAction<
  HistoryItem,
  {
    fetchDataPromise: Promise<any>
  } | null
> = async (om, item) => {
  om.state.home.isLoading = true

  const { started, currentState } = om.state.home
  const historyId = item.id
  const shouldReplace =
    !!item.replace &&
    // dont replace home with something else
    !(item.name !== 'home' && currentState.type === 'home')
  const id =
    item.name === 'home'
      ? '0'
      : shouldReplace
      ? currentState.id
      : `${Math.random()}`
  const base = {
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
      let activeTagIds = {}
      // be sure to remove all searchbar tags
      for (const tagId in om.state.home.lastHomeState.activeTagIds) {
        if (!isSearchBarTag(om.state.home.allTags[tagId])) {
          activeTagIds[tagId] = true
        }
      }
      nextState = {
        ...base,
        type,
        ...newState,
        searchQuery: '',
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

      const username =
        type == 'userSearch' ? om.state.router.curPage.params.username : ''
      const searchQuery = item.params.search ?? base.searchQuery
      const searchState: HomeStateItemSearch = {
        ...base,
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
        ...base,
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
        ...base,
        type: 'user',
        username: item.params.username,
        ...newState,
      }
      break
    }

    case 'gallery': {
      nextState = {
        ...base,
        type: 'gallery',
        restaurantSlug: item.params.restaurantSlug,
        dishId: item.params.dishId,
      }
      break
    }
  }

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
    console.log('nextPushIsReallyAPop', nextPushIsReallyAPop, item)
    nextPushIsReallyAPop = false
    const prev = _.findLast(om.state.home.states, (x) => x.type === item.name)
    if (prev) {
      om.actions.home.updateHomeState(prev)
      om.actions.home.setIsLoading(false)
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

  console.log(
    'pushHomeState',
    cloneDeep({ shouldReplace, item, nextState, id })
  )

  if (shouldReplace) {
    om.actions.home.replaceHomeState(nextState)
  } else {
    om.actions.home.updateHomeState(nextState)
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
    runFetchData().finally(() => {
      om.actions.home.setIsLoading(false)
    })
  }

  if (fetchDataPromise) {
    return {
      fetchDataPromise,
    }
  } else {
    om.actions.home.setIsLoading(false)
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

let hasLoadedSearchOnce = false

const loadPageSearch: AsyncAction = async (om) => {
  const state = om.state.home.currentState
  if (!isSearchState(state)) return

  if (!hasLoadedSearchOnce && om.state.router.history.length === 1) {
    hasLoadedSearchOnce = true
    const fakeTags = getTagsFromRoute(om.state.router.curPage)
    const tags = await getFullTags(fakeTags)
    console.log('full tags', tags)
    om.actions.home.addTagsToCache(tags)
    om.actions.home.updateActiveTags({
      ...state,
      activeTagIds: tags.reduce<any>((acc, tag) => {
        acc[getTagId(tag)] = true
        return acc
      }, {}),
    })
  }

  om.actions.home.runSearch({ force: true })
}

let currentAction: PageAction

const refresh: AsyncAction = async (om) => {
  if (!currentAction) return
  await currentAction()
}

const popBack: Action = (om, item) => {
  const cur = om.state.home.currentState
  const next = findLast(om.state.home.states, (x) => x.type !== cur.type)
  om.actions.home.popTo(next.type)
}

const popTo: Action<HomeStateItem['type']> = (om, item) => {
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

const loadHomeDishes: AsyncAction = async (om) => {
  if (om.state.home.topDishes.length) {
    // load only once
    return
  }

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

  let allDishTags: NavigableTag[] = []

  // update tags
  for (const topDishes of all) {
    // country tag
    const tag: NavigableTag = {
      id: `${topDishes.country}`,
      name: topDishes.country,
      type: 'country',
      icon: topDishes.icon,
    }
    om.state.home.allTags[getTagId(tag)] = tag

    // dish tags
    const dishTags: NavigableTag[] = (topDishes.dishes ?? []).map((dish) => ({
      id: dish.name ?? '',
      name: dish.name ?? '',
      type: 'dish',
    }))
    allDishTags = [...allDishTags, ...dishTags]
  }

  om.actions.home.addTagsToCache(allDishTags)

  console.warn('SET TOP DISHES')
  om.state.home.topDishes = all
}

export const locationToAutocomplete = (location: {
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
  searchQuery?: string
  quiet?: boolean
  force?: boolean
} | void> = async (om, opts) => {
  opts = opts || { quiet: false }
  lastSearchAt = Date.now()
  let curId = lastSearchAt

  const curState = om.state.home.currentState
  const searchQuery = opts.searchQuery ?? curState.searchQuery ?? ''
  if (
    await om.actions.home.navigate({
      state: {
        ...curState,
        searchQuery,
      },
    })
  ) {
    // nav will trigger search
    return
  }

  let state = om.state.home.lastSearchState
  const tags = getActiveTags(om.state.home)

  const shouldCancel = () => {
    const answer = !state || lastSearchAt != curId
    if (answer) console.log('search: cancel')
    return answer
  }

  // dont be so eager if started
  if (!opts.force && om.state.home.started) {
    await fullyIdle()
    if (shouldCancel()) return
  }

  console.log('runSearch', cloneDeep(state))

  const searchArgs: RestaurantSearchArgs = {
    center: roundLngLat(state.center),
    span: roundLngLat(padSpan(state.span)),
    query: state.searchQuery,
    tags: tags.map((tag) => getTagId(tag)),
  }

  // prevent duplicate searches
  const searchKey = stringify(searchArgs)
  if (!opts.force && searchKey === lastSearchKey) {
    console.log('same searchkey as last, ignore')
    return
  }

  state = om.state.home.lastSearchState

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
  if (shouldCancel()) return

  // only update searchkey once finished
  lastSearchKey = searchKey
  state = om.state.home.lastSearchState
  console.log('search found restaurants', restaurants)
  state.results = {
    status: 'complete',
    results: {
      restaurants: restaurants.filter(Boolean),
      dishes: [],
      locations: [],
    },
  }

  // overmind seems unhappy to just let us mutate
  om.actions.home.updateHomeState(state)
}

const popHomeState: Action<HistoryItem> = (om, item) => {
  console.log('popHomeState', item)
  assert(om.state.home.currentState.type !== 'home')
  assert(om.state.home.state.length > 1)
  const nextStates = _.dropRight(om.state.home.states)
  om.state.home.states = nextStates
  if (!nextStates.some((x) => x.type === 'home')) {
    debugger
  }
}

const updateHomeState: Action<HomeStateItem> = (om, val) => {
  let next = [...om.state.home.states]
  let index = next.findIndex((x) => x.id === val.id && x.type === val.type)
  if (index !== -1) {
    next.splice(index, 1)
  }
  next.push(val)
  if (!next.some((x) => x.type === 'home')) {
    debugger
  }
  om.state.home.states = next
}

const replaceHomeState: Action<HomeStateItem> = (om, val) => {
  // try granular update
  const lastState = om.state.home.states[om.state.home.states.length - 1]
  for (const key in val) {
    if (!isEqual(val[key], lastState[key])) {
      lastState[key] = _.isPlainObject(val[key]) ? { ...val[key] } : val[key]
    }
  }
}

const clearSearch: AsyncAction = async (om) => {
  om.actions.home.setShowAutocomplete(false)
  const hasQuery = !!om.state.home.currentStateSearchQuery
  if (!hasQuery) {
    om.actions.home.clearTags()
  } else {
    om.actions.home.setSearchQuery('')
  }
}

const setHoveredRestaurant: Action<RestaurantOnlyIds> = (om, val) => {
  om.state.home.hoveredRestaurant = val
}

const setShowUserMenu: Action<boolean> = (om, val) => {
  om.state.home.showUserMenu = val
}

const suggestTags: AsyncAction<string> = async (om, tags) => {
  let state = om.state.home.currentState
  if (!isRestaurantState(state)) return
  // none
}

function reverseGeocode(center: LngLat): Promise<GeocodePlace[]> {
  const mapGeocoder = new mapkit.Geocoder({
    language: 'en-GB',
    getsUserLocation: true,
  })
  return new Promise((res, rej) => {
    mapGeocoder.reverseLookup(
      new mapkit.Coordinate(center.lat, center.lng),
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
      currentState.currentLocationInfo = { ...firstResult }
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
      return
    }
  }

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
    console.log('just focused, ignore showing autocomplete')
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

export function searchLocations(query: string) {
  if (!query) {
    return Promise.resolve([])
  }
  const locationSearch = new mapkit.Search({ region: mapView?.region })
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
  const max = om.state.home.autocompleteResults.length - 1
  const next = clamp(val, min, max)
  console.log('setAutocompleteIndex', min, max, next)
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

const setSearchBarFocusedTag: Action<NavigableTag | null> = (om, val) => {
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
  const { states } = om.state.home
  if (states.length == 1) return
  const prev = states[states.length - 2]
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

const createBreadcrumbs = (state: HomeState) => {
  return createBreadcrumbsMemo(state.states)
}

const createBreadcrumbsMemo = memoize((states: HomeStateItem[]) => {
  let crumbs: HomeStateItemSimple[] = []
  // reverse loop to find latest
  for (let i = states.length - 1; i >= 0; i--) {
    const cur = states[i]
    switch (cur.type) {
      case 'home': {
        crumbs.unshift(cur)
        return crumbs.map((x) => pick(x, ['id', 'type']))
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
})

export function createAutocomplete(
  x: Partial<AutocompleteItem>
): AutocompleteItem {
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

const updateActiveTags: Action<HomeStateTagNavigable> = (om, next) => {
  const state = _.findLast(
    om.state.home.states,
    (state) => isSearchState(state) || isHomeState(state)
  )
  if (!state) return
  try {
    assert('activeTagIds' in next)
    const stateActiveTagIds =
      'activeTagIds' in state ? state.activeTagIds : null
    const sameTagIds =
      stringify(stateActiveTagIds) === stringify(next.activeTagIds)
    const sameSearchQuery = isEqual(state.searchQuery, next.searchQuery)
    assert(!sameTagIds || !sameSearchQuery)
    const nextState = {
      ...state,
      ...next,
      id: state.id,
    }
    console.log(
      'updating active tags...',
      nextState,
      cloneDeep(om.state.home.states)
    )
    om.actions.home.updateHomeState(nextState)
  } catch (err) {
    handleAssertionError(err)
  }
}

// adds to allTags + allTagsNameToID
const addTagsToCache: Action<NavigableTag[] | null> = (om, tags) => {
  for (const tag of tags) {
    const id = getTagId(tag)
    om.state.home.allTags[id] = { ...tag } as any
    om.state.home.allTagsNameToID[slugify(tag.name.toLowerCase(), ' ')] = id
    try {
      om.state.home.allTagsNameToID[tag.name] = id
    } catch (err) {
      // overmind blows up adding names with periods
    }
  }
}

const setAutocompleteResults: Action<AutocompleteItem[] | null> = (
  om,
  results
) => {
  om.state.home.autocompleteResults = results ?? defaultAutocompleteResults
}

const setLocationAutocompleteResults: Action<AutocompleteItem[] | null> = (
  om,
  results
) => {
  om.state.home.autocompleteResults =
    results ?? defaultLocationAutocompleteResults
}

const setSearchQuery: Action<string> = (om, val) => {
  const last = om.state.home.states[om.state.home.states.length - 1]
  last.searchQuery = val
}

const clearTags: AsyncAction = async (om, val) => {
  const nextState = {
    ...om.state.home.currentState,
    activeTagIds: {
      gems: true,
    },
  }
  await om.actions.home.navigate({
    state: nextState,
  })
}

const clearTag: AsyncAction<NavigableTag> = async (om, tag) => {
  const state = om.state.home.currentState
  if ('activeTagIds' in state) {
    const nextState = {
      ...state,
      activeTagIds: {
        ...state.activeTagIds,
        [getTagId(tag)]: false,
      },
    }
    await om.actions.home.navigate({
      state: nextState,
    })
  }
}

const setIsLoading: Action<boolean> = (om, val) => {
  om.state.home.isLoading = val
}

// for easy use with Link / LinkButton
export const getNavigateTo: Action<HomeStateNav, LinkButtonProps | null> = (
  om,
  props
) => {
  if (!props.tags?.length) {
    console.log('no tags for nav?', props)
    return null
  }
  let nextState = getNextState(om, props)
  if (nextState) {
    const navigateItem = getNavigateItemForState(om.state, nextState)
    return {
      ...navigateItem,
      preventNavigate: true,
      onPress() {
        om.actions.home.navigate({
          ...props,
          // use latest state
          state: om.state.home.currentState,
        })
      },
    }
  }
  return null
}

// this is useful for search where we mutate the current state while you type,
// but then later you hit "enter" and we need to navigate to search (or home)
// we definitely can clean up / name better some of this once things settle
const navigate: AsyncAction<HomeStateNav, boolean> = async (om, navState) => {
  if (navState.tags) {
    om.actions.home.addTagsToCache(navState.tags)
  }
  navState.state = navState.state ?? om.state.home.currentState
  const nextState = getNextState(om, navState)

  // do a quick update first
  const curState = om.state.home.currentState
  const curType = curState.type
  const nextType = nextState.type
  if (nextType !== curType || isSearchState(curState)) {
    om.actions.home.updateActiveTags({
      id: curState.id,
      // @ts-ignore
      type: curState.type,
      searchQuery: nextState.searchQuery,
      activeTagIds: nextState.activeTagIds,
    })
    await fullyIdle()
  }

  const didNav = await syncStateToRoute(om, nextState)
  om.actions.home.updateActiveTags(nextState)
  return didNav
}

export const actions = {
  loadHomeDishes,
  setIsScrolling,
  setLocationAutocompleteResults,
  setHasMovedMap,
  startAutocomplete,
  runHomeSearch,
  setSearchQuery,
  updateCurrentMapAreaInformation,
  clearSearch,
  forkCurrentList,
  handleRouteChange,
  moveActiveDown,
  moveActiveUp,
  up,
  clearTag,
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
  setAutocompleteIndex,
  setShowAutocomplete,
  setShowUserMenu,
  start,
  popBack,
  refresh,
  suggestTags,
  loadPageSearch,
  loadPageRestaurant,
  popHomeState,
  updateActiveTags,
  setAutocompleteResults,
  clearTags,
  addTagsToCache,
  setIsLoading,
  replaceHomeState,
  updateHomeState,
  navigate,
}
