import { fullyIdle, idle, sleep } from '@dish/async'
import { isEqual } from '@dish/fast-compare'
import {
  RestaurantOnlyIds,
  RestaurantSearchArgs,
  Tag,
  search,
  slugify,
} from '@dish/graph'
import {
  assert,
  handleAssertionError,
  isPresent,
  stringify,
} from '@dish/helpers'
import { HistoryItem, NavigateItem } from '@dish/router'
import _, { clamp, cloneDeep, findLast, isPlainObject, last } from 'lodash'
import { Action, AsyncAction, Config, IContext, derived } from 'overmind'
import { Keyboard } from 'react-native'
import { Toast } from 'snackui'

import { getBreadcrumbs, isBreadcrumbState } from '../helpers/getBreadcrumbs'
import { allTags } from './allTags'
import { defaultLocationAutocompleteResults } from './defaultLocationAutocompleteResults'
import { getActiveTags } from './getActiveTags'
import { setDefaultLocation } from './getDefaultLocation'
import { getNavigateItemForState } from './getNavigateItemForState'
import { getNextState } from './getNextState'
import { getTagSlug } from './getTagSlug'
import { isHomeState, isRestaurantState, isSearchState } from './home-helpers'
import {
  ActiveEvent,
  AutocompleteItem,
  HomeState,
  HomeStateItem,
  HomeStateItemHome,
  HomeStateItemRestaurant,
  HomeStateItemSearch,
  HomeStateNav,
  HomeStateTagNavigable,
  LngLat,
  OmState,
  ShowAutocomplete,
} from './home-types'
import { initialHomeState } from './initialHomeState'
import { isSearchBarTag } from './isSearchBarTag'
import { tagLenses } from './localTags'
import { NavigableTag } from './NavigableTag'
import { reverseGeocode } from './reverseGeocode'
import { router } from './router'

export const state: HomeState = {
  started: false,
  isLoading: false,
  skipNextPageFetchData: false,
  activeEvent: null,
  activeIndex: -1,
  selectedRestaurant: null,
  showUserMenu: false,
  searchBarTagIndex: 0,
  centerToResults: 0,
  refreshCurrentPage: 0,
  allUsers: {},
  showAutocomplete: false,
  drawerSnapPoint: 1,
  searchBarY: 25,
  autocompleteIndex: 0,
  autocompleteResults: [],
  locationAutocompleteResults: defaultLocationAutocompleteResults,
  location: null,
  locationSearchQuery: '',
  hoveredRestaurant: null,
  isHoveringRestaurant: false,
  isOptimisticUpdating: false,
  stateIndex: 0,
  stateIds: ['0'],
  allStates: {
    '0': initialHomeState,
  },
  userLocation: null,
  currentNavItem: derived<HomeState, OmState, NavigateItem>((state, om) =>
    getNavigateItemForState(om, last(state.states)!)
  ),

  lastHomeState: derived<HomeState, OmState, HomeStateItemHome>(
    (state) => findLast(state.states, isHomeState)!
  ),
  lastRestaurantState: derived<
    HomeState,
    any,
    HomeStateItemRestaurant | undefined
  >((state) => findLast(state.states, isRestaurantState)),
  lastSearchState: derived<HomeState, OmState, HomeStateItemSearch | undefined>(
    (state) => findLast(state.states, isSearchState)
  ),
  currentState: derived<HomeState, OmState, HomeStateItem>((state) => {
    return state.states[state.stateIndex]
  }),
  currentStateSearchQuery: derived<
    HomeState,
    any,
    HomeStateItem['searchQuery']
  >((state) => state.currentState.searchQuery),
  currentStateType: derived<HomeState, OmState, HomeStateItem['type']>(
    (state) => state.currentState.type
  ),
  isAutocompleteActive: derived<HomeState, OmState, boolean>(
    (state) => !!state.showAutocomplete
  ),
  activeAutocompleteResults: derived<HomeState, OmState, AutocompleteItem[]>(
    (state) =>
      state.showAutocomplete === 'location'
        ? state.locationAutocompleteResults
        : state.showAutocomplete === 'search'
        ? state.autocompleteResults
        : []
  ),
  previousState: derived<HomeState, OmState, HomeStateItem>((state) => {
    const curState = state.states[state.stateIndex]
    for (let i = state.stateIndex - 1; i >= 0; i--) {
      const next = state.states[i]
      if (next?.type !== curState?.type) {
        return next
      }
    }
    return state.states[0]
  }),
  searchBarTags: derived<HomeState, OmState, NavigableTag[]>((state) => {
    const curState = state.states[state.stateIndex]
    return getActiveTags(curState).filter(isSearchBarTag)
  }),
  //@ts-expect-error
  lastActiveTags: derived<HomeState, OmState, Tag[]>((state) => {
    const lastTaggable = _.findLast(
      state.states,
      (x) => isHomeState(x) || isSearchState(x)
    ) as HomeStateItemSearch | HomeStateItemHome
    return getActiveTags(lastTaggable)
  }),
  //@ts-expect-error
  searchbarFocusedTag: derived<HomeState, OmState, Tag | null>((state) => {
    const { searchBarTagIndex } = state
    if (searchBarTagIndex > -1) return null
    const index = state.searchBarTags.length + searchBarTagIndex
    return state.searchBarTags[index]
  }),
  states: derived<HomeState, OmState, HomeStateItem[]>((state) => {
    return state.stateIds
      .map((x) => state.allStates[x])
      .slice(0, state.stateIndex + 1)
  }),
  currentStateLense: derived<HomeState, OmState, NavigableTag | null>(
    (state) => {
      if ('activeTags' in state.currentState) {
        for (const id in state.currentState.activeTags) {
          const tag = allTags[id]
          if (tag?.type == 'lense') {
            return tag
          }
        }
      }
      return tagLenses[0]
    }
  ),
}

export const isOnOwnProfile = (state: OmState) => {
  const username = state.user?.user?.username
  return username && slugify(username) === router.curPage.params?.username
}

export const isEditingUserPage = (
  state: HomeStateItemSearch,
  omState: OmState
) => {
  return state.type === 'userSearch' && isOnOwnProfile(omState)
}

type PageAction = () => Promise<void>

const refresh: AsyncAction = async (om) => {
  om.state.home.refreshCurrentPage = Date.now()
}

const getUpType = (om: IContext<Config>) => {
  const curType = om.state.home.currentState.type
  const crumbs = getBreadcrumbs(om.state.home.states)
  if (!isBreadcrumbState(curType)) {
    return _.last(crumbs)?.type
  }
  return findLast(crumbs, (x) => x.type !== curType)?.type ?? 'home'
}

const up: Action = (om) => {
  om.actions.home.popTo(getUpType(om))
}

const popBack: Action = (om) => {
  const cur = om.state.home.currentState
  const next = findLast(om.state.home.states, (x) => x.type !== cur.type)
  om.actions.home.popTo(next?.type ?? 'home')
}

const popTo: Action<HomeStateItem['type']> = (om, type) => {
  const currentState = om.state.home.currentState

  if (currentState.type === 'home') {
    return
  }

  // we can just use router history directly, no? and go back?
  if (
    om.state.home.previousState?.type === type &&
    router.prevHistory?.name === type &&
    router.curPage?.type !== 'pop'
  ) {
    router.back()
    return
  }

  const states = om.state.home.states
  const prevStates = states.slice(0, states.length - 1)
  const stateItem = _.findLast(prevStates, (x) => x.type === type)
  const routerItem =
    router.history.find((x) => x.id === stateItem?.id) ??
    _.findLast(router.history, (x) => x.name === type)
  if (routerItem) {
    router.navigate({
      name: type,
      params: routerItem?.params ?? {},
    })
  } else {
    console.warn('no match')
    router.navigate({
      name: 'home',
    })
  }
}

let lastSearchKey = ''
let lastSearchAt = Date.now()
const runSearch: AsyncAction<{
  searchQuery?: string
  quiet?: boolean
  force?: boolean
}> = async (om, opts) => {
  opts = opts || { quiet: false }
  lastSearchAt = Date.now()
  let curId = lastSearchAt

  const curState = om.state.home.currentState
  const searchQuery = opts.searchQuery ?? curState.searchQuery ?? ''
  const navItem = {
    state: {
      ...curState,
      searchQuery,
    },
  }

  if (await om.actions.home.navigate(navItem)) {
    console.log('did nav from search', navItem)
    // nav will trigger search
    return
  }

  let state = om.state.home.lastSearchState
  const tags = getActiveTags(curState)

  const shouldCancel = () => {
    const state = om.state.home.lastSearchState
    const answer = !state || lastSearchAt != curId
    if (answer) console.log('search: cancel')
    return answer
  }

  // dont be so eager if started
  if (!opts.force && om.state.home.started) {
    await fullyIdle()
    if (shouldCancel()) return
  }

  state = om.state.home.lastSearchState
  if (shouldCancel()) return
  state = state!

  // overmind seems unhappy to just let us mutate
  const center = state.mapAt?.center ?? state!.center
  const span = state.mapAt?.span ?? state!.span

  om.actions.home.updateHomeState({
    id: state.id,
    center,
    span,
    mapAt: null,
  })

  const activeTags = state.activeTags ?? {}
  const dishSearchedTag = Object.keys(activeTags).find(
    (k) => allTags[k]?.type === 'dish'
  )
  let otherTags = [
    ...tags
      .map((tag) =>
        getTagSlug(tag).replace('lenses__', '').replace('filters__', '')
      )
      .filter((t) => !t.includes(dishSearchedTag)),
  ]

  const searchArgs: RestaurantSearchArgs = {
    center: roundLngLat(center),
    span: roundLngLat(span),
    query: state!.searchQuery,
    tags: otherTags,
    main_tag: dishSearchedTag ?? otherTags[0],
  }

  // prevent duplicate searches
  const searchKey = stringify(searchArgs)
  if (!opts.force && searchKey === lastSearchKey) {
    console.warn('same saerch again?')
  }

  // fetch
  let res = await search(searchArgs)
  if (shouldCancel() || !res) return

  // temp code to handle both types of api response at once
  if (!res.restaurants) {
    console.log('no restaurants', res)
  }
  let restaurants = res.restaurants ?? []

  // only update searchkey once finished
  lastSearchKey = searchKey
  state = om.state.home.lastSearchState
  if (!state) return

  // console.log('search found restaurants', restaurants)
  om.actions.home.updateHomeState({
    id: state.id,
    status: 'complete',
    // limit to 80 for now
    results: restaurants.filter(isPresent).slice(0, 80),
    meta: res.meta,
  })
}

// doesn't delete
const deepAssign = (a: Object, b: Object) => {
  for (const key in b) {
    if (a[key] != b[key]) {
      // WARNING, overmind got totally confused when recursing and broke things in subtle ways
      // do not recurse objects and deep assign, just flat assign for now...
      if (a[key] && b[key] && isEqual(a[key], b[key])) {
        continue
      }
      const val = b[key]
      if (val) {
        a[key] = Array.isArray(val)
          ? [...val]
          : isPlainObject(val)
          ? { ...val }
          : val
      } else {
        a[key] = val
      }
    }
  }
}

const updateHomeState: Action<{ id: string; [key: string]: any }> = (
  om,
  val
) => {
  if (!val.id) {
    throw new Error(`Must have id`)
  }
  const state = om.state.home.allStates[val.id]
  if (state) {
    if (val.type && state.type !== val.type) {
      throw new Error(`Cant change the type`)
    }
    // sanity checks
    if (process.env.NODE_ENV === 'development') {
      if (val['activeTags']) {
        if (
          Object.keys(val['activeTags']).some(
            (x) => x === '' || x === 'no-slug'
          )
        ) {
          debugger
        }
      }
    }
    deepAssign(state, val)
  } else {
    om.state.home.allStates[val.id] = { ...val } as any
    // cleanup old from backward
    if (om.state.home.stateIds.length - 1 > om.state.home.stateIndex) {
      om.state.home.stateIds = om.state.home.stateIds.slice(
        0,
        om.state.home.stateIndex + 1
      )
    }
    om.state.home.stateIds = [...new Set([...om.state.home.stateIds, val.id])]
    const nextIndex = om.state.home.stateIds.length - 1
    om.state.home.stateIndex = nextIndex
  }
}

const clearSearch: AsyncAction = async (om) => {
  const hasQuery = !!om.state.home.currentStateSearchQuery
  if (!hasQuery) {
    om.actions.home.clearTags()
  } else {
    om.actions.home.setSearchQuery('')
  }
}

const setHoveredRestaurant: Action<RestaurantOnlyIds | null | false> = (
  om,
  val
) => {
  om.state.home.hoveredRestaurant = val
}

const suggestTags: AsyncAction<string> = async (om, tags) => {
  let state = om.state.home.currentState
  if (!isRestaurantState(state)) return
  // none
}

const getUserPosition = () => {
  return new Promise<any>((res, rej) => {
    navigator.geolocation.getCurrentPosition(res, rej)
  })
}

const moveMapToUserLocation: AsyncAction = async (om) => {
  const position = await getUserPosition()
  const location: LngLat = {
    lng: position.coords.longitude,
    lat: position.coords.latitude,
  }
  om.state.home.userLocation = location
  const state = om.state.home.currentState
  state.center = { ...location }
  // om.actions.home.updateHomeState({
  //   ...state,
  //   center: { ...location },
  // })
}

const updateCurrentMapAreaInformation: AsyncAction = async (om) => {
  const { center, span } =
    om.state.home.currentState.mapAt ?? om.state.home.currentState
  const res = await reverseGeocode(center, span)
  if (res) {
    const name = res.fullName ?? res.name ?? res.country
    om.state.home.currentState.currentLocationInfo = res
    om.state.home.currentState.currentLocationName = name
  }
}

let isClearingCache = false

const handleRouteChange: AsyncAction<HistoryItem> = async (om, item) => {
  // happens on *any* route push or pop
  if (om.state.home.hoveredRestaurant) {
    om.state.home.hoveredRestaurant = null
  }

  if (item.type === 'pop') {
    switch (item.direction) {
      case 'forward': {
        om.state.home.stateIndex += 1
        return
      }
      case 'backward': {
        om.state.home.stateIndex -= 1
        return
      }
      default: {
        console.error('NO DIRECTION FOR A POP??', item)
      }
    }
  }

  const promises = new Set<Promise<any>>()

  // actions per-route
  if (item.type === 'push' || item.type === 'replace') {
    // if (!isClearingCache) {
    // isClearingCache = true
    // requestIdleCallback(() => {
    // isClearingCache = false
    // resetQueryCache({ ifAbove: 15 })
    // })
    // }

    switch (item.name) {
      case 'homeRegion':
      case 'home':
      case 'about':
      case 'blog':
      case 'search':
      case 'user':
      case 'userEdit':
      case 'gallery':
      case 'restaurantReview':
      case 'restaurantHours':
      case 'userSearch':
      case 'restaurant': {
        if (item.type === 'push') {
          // clear future states past current index
          const stateIndex = om.state.home.stateIndex
          if (stateIndex < om.state.home.states.length - 1) {
            console.warn('clearing future states as were rewriting history')
            const nextStateIds = om.state.home.states.map((x) => x.id)
            // can garbage collect here if wanted, likely want to do in a deferred way
            // const toClearStates = nextStateIds.slice(stateIndex)
            // for (const id of toClearStates) {
            //   delete om.state.home.allStates[id]
            // }
            const next = nextStateIds.slice(0, stateIndex)
            om.state.home.stateIds = next
            debugger
          }
        }
        const res = await pushHomeState(om, item)
        if (res?.fetchDataPromise) {
          promises.add(res.fetchDataPromise)
        }
        break
      }
      default: {
        return
      }
    }
  }

  await Promise.all([...promises])
}

const uid = () => `${Math.random()}`.replace('.', '')

export const findLastHomeOrSearch = (states: HomeStateItem[]) => {
  const prev: HomeStateItemHome | HomeStateItemSearch = _.findLast(
    states,
    (x) => isHomeState(x) || isSearchState(x)
  ) as any
  return prev
}

/*
 *
 * TODO: move this all into usePageLoadEffect and remove this
 *
 */
const pushHomeState: AsyncAction<
  HistoryItem,
  {
    fetchDataPromise: Promise<any>
  } | null
> = async (om, item) => {
  if (!item) {
    console.warn('no item?')
    return null
  }

  // start loading
  om.actions.home.setIsLoading(true)

  const { currentState } = om.state.home
  const searchQuery = item?.params?.query ?? currentState?.searchQuery ?? ''

  let nextState: Partial<HomeStateItem> | null = null
  let fetchData: PageAction | null = null
  const type = item.name

  switch (type) {
    // home
    case 'homeRegion':
    case 'home': {
      const prev = _.findLast(om.state.home.states, isHomeState)
      nextState = {
        type: 'home',
        searchQuery: '',
        activeTags: {},
        mapAt: prev?.mapAt,
        region: item.params?.region,
      }
      break
    }

    case 'blog': {
      nextState = {
        slug: item.params.slug,
      }
      break
    }

    case 'userEdit':
    case 'about': {
      break
    }

    // search or userSearch
    case 'userSearch':
    case 'search': {
      const username =
        type == 'userSearch' ? router.curPage.params.username : ''
      const prev = findLastHomeOrSearch(om.state.home.states)
      if (!prev) {
        throw new Error('unreachable')
      }
      nextState = {
        type: 'search',
        status: 'loading',
        results: [],
        region: router.curPage.params.region ?? prev.region,
        username,
        activeTags: prev.activeTags ?? {},
        center: prev.mapAt?.center ?? prev.center,
        span: prev.mapAt?.span ?? prev.span,
      }
      break
    }

    // restaurant
    case 'restaurant': {
      const prev = om.state.home.states[om.state.home.states.length - 1]
      nextState = {
        section: item.params.section,
        sectionSlug: item.params.sectionSlug,
        restaurantSlug: item.params.slug,
        center: prev.mapAt?.center ?? prev.center,
        span: prev.mapAt?.span ?? prev.span,
        mapAt: null,
      }
      break
    }

    case 'user': {
      nextState = {
        username: item.params.username,
        results: [],
      }
      break
    }

    case 'gallery': {
      nextState = {
        restaurantSlug: item.params.restaurantSlug,
        dishId: item.params.dishId,
      }
      break
    }

    case 'restaurantReview': {
      nextState = {
        restaurantSlug: item.params.slug,
      }
      break
    }

    case 'restaurantHours': {
      nextState = {
        restaurantSlug: item.params.slug,
      }
      break
    }
  }

  const finalState = {
    currentLocationName: currentState?.currentLocationName,
    currentLocationInfo: currentState?.currentLocationInfo,
    center: currentState?.mapAt?.center ?? currentState?.center,
    span: currentState?.mapAt?.span ?? currentState?.span,
    searchQuery,
    type,
    ...nextState,
    id: nextState?.id ?? item.id ?? uid(),
  } as HomeStateItem

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

  om.actions.home.updateHomeState(finalState)

  if (!om.state.home.started) {
    om.state.home.started = true
  }

  const shouldSkip = om.state.home.skipNextPageFetchData
  om.state.home.skipNextPageFetchData = false

  let fetchDataPromise: Promise<any> | null = null
  if (!shouldSkip && fetchData) {
    // start
    let res: any
    let rej: any
    fetchDataPromise = new Promise((res2, rej2) => {
      res = res2
      rej = rej2
    })
    runFetchData()
      .finally(() => {
        om.actions.home.setIsLoading(false)
        res()
      })
      .catch(rej)
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

const setShowAutocomplete: Action<ShowAutocomplete> = (om, val) => {
  om.state.home.showAutocomplete = val
}

// TODO this sort of duplicates HomeStateItem.center... we should move it there
const setLocation: AsyncAction<string> = async (om, val) => {
  const current = [
    ...om.state.home.locationAutocompleteResults,
    ...defaultLocationAutocompleteResults,
  ]
  om.actions.home.setLocationSearchQuery(val)
  const exact = current.find((x) => x.name === val)
  if (exact?.center) {
    om.actions.home.updateCurrentState({
      center: { ...exact.center },
      currentLocationName: val,
      mapAt: null,
    })
    const curState = om.state.home.currentState
    const navItem = getNavigateItemForState(om, curState)
    if (router.getShouldNavigate(navItem)) {
      router.navigate(navItem)
    }
    setDefaultLocation({
      center: exact.center,
      span: curState.span,
    })
  } else {
    console.warn('No center found?')
  }
}

const setLocationSearchQuery: AsyncAction<string> = async (om, val) => {
  om.state.home.locationSearchQuery = val
}

const setActiveIndex: Action<{ index: number; event: ActiveEvent }> = (
  om,
  { index, event }
) => {
  om.state.home.activeIndex = Math.min(Math.max(-1, index), 1000) // TODO
  om.state.home.activeEvent = event
}

const moveActive: Action<number> = (om, num) => {
  if (om.state.home.isAutocompleteActive) {
    om.actions.home.moveAutocompleteIndex(num)
  } else {
    om.actions.home.setActiveIndex({
      index: om.state.home.activeIndex + num,
      event: 'key',
    })
  }
}

const requestLocation: Action = (om) => {}

const setSearchBarFocusedTag: Action<NavigableTag | null> = (om, val) => {
  if (!val) {
    om.state.home.searchBarTagIndex = 0
    return
  }
  const tags = om.state.home.searchBarTags
  const tagIndex = tags.findIndex((x) => getTagSlug(x) === getTagSlug(val))
  om.state.home.autocompleteIndex = -tags.length + tagIndex
}

const forkCurrentList: Action = (om) => {
  const username = om.state.user.user?.username
  if (!username) {
    Toast.show(`Login please`)
    return
  }
  const { curPage } = router
  if (curPage.name !== 'search') {
    Toast.show(`Can't fork a non-search page`)
    return
  }
  router.navigate({
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

// used to help prevent duplicate searches on slight diff in map move
const roundLngLat = (val: LngLat): LngLat => {
  // 4 decimal precision is good to a few meters
  return {
    lng: Math.round(val.lng * 10000) / 10000,
    lat: Math.round(val.lat * 10000) / 10000,
  }
}

const updateActiveTags: Action<HomeStateTagNavigable> = (om, next) => {
  const state = _.findLast(
    om.state.home.states,
    (state) => isSearchState(state) || isHomeState(state)
  )
  if (!state) return
  try {
    assert(!!next['activeTags'])
    const ids = 'activeTags' in state ? state.activeTags : null
    const sameTagIds = stringify(ids) === stringify(next.activeTags)
    const sameSearchQuery = isEqual(state.searchQuery, next.searchQuery)
    assert(!sameTagIds || !sameSearchQuery)
    const nextState = {
      ...state,
      ...next,
      id: om.state.home.currentState.id,
    }
    // @ts-ignore
    om.actions.home.updateHomeState(nextState)
  } catch (err) {
    handleAssertionError(err)
  }
}

const setAutocompleteResults: Action<AutocompleteItem[] | null> = (
  om,
  results
) => {
  om.state.home.autocompleteIndex = 0
  om.state.home.autocompleteResults = results ?? []
}

const setLocationAutocompleteResults: Action<AutocompleteItem[] | null> = (
  om,
  results
) => {
  om.state.home.autocompleteIndex = 0
  om.state.home.locationAutocompleteResults =
    results ?? defaultLocationAutocompleteResults ?? []
}

const setSearchQuery: Action<string> = (om, val) => {
  const last = om.state.home.states[om.state.home.states.length - 1]
  last.searchQuery = val
}

const clearTags: AsyncAction = async (om) => {
  await om.actions.home.navigate({
    state: {
      ...om.state.home.currentState,
      activeTags: {},
    },
  })
}

const clearTag: AsyncAction<NavigableTag> = async (om, tag) => {
  const state = om.state.home.currentState
  if ('activeTags' in state) {
    const nextState = {
      ...state,
      activeTags: {
        ...state.activeTags,
        [getTagSlug(tag)]: false,
      },
    }
    await om.actions.home.navigate({
      state: nextState,
    })
  }
}

let tm: NodeJS.Timeout | null = null
const setIsLoading: Action<boolean> = (om, val) => {
  om.state.home.isLoading = val
  // prevent infinite spinners
  clearTimeout(tm)
  tm = setTimeout(() => {
    if (val) {
      om.actions.home.setIsLoading(false)
    }
  }, 3000)
}

// this is useful for search where we mutate the current state while you type,
// but then later you hit "enter" and we need to navigate to search (or home)
// we definitely can clean up / name better some of this once things settle
let lastNav = Date.now()
const navigate: AsyncAction<HomeStateNav, boolean> = async (
  om,
  { state, ...rest }
) => {
  const navState = { state: state ?? om.state.home.currentState, ...rest }
  const nextState = getNextState(navState)
  const curState = om.state.home.currentState

  const updateTags = () => {
    const type = curState.type as any
    om.actions.home.updateActiveTags({
      id: curState.id,
      type,
      searchQuery: nextState.searchQuery,
      activeTags: nextState['activeTags'],
    })
  }

  if (!om.actions.home.getShouldNavigate(nextState)) {
    updateTags()
    return false
  }

  Keyboard.dismiss()

  lastNav = Date.now()
  let curNav = lastNav
  om.state.home.isOptimisticUpdating = false

  // do a quick update first
  const curType = curState.type
  const nextType = nextState.type
  if (
    nextType !== curType ||
    (isSearchState(curState) && nextType === 'search')
  ) {
    om.state.home.isOptimisticUpdating = true
    om.state.home.isLoading = true
    // optimistic update active tags
    updateTags()
    await sleep(40)
    await idle(30)
    if (curNav !== lastNav) return false
    om.state.home.isOptimisticUpdating = false
  }

  const didNav = await om.actions.home.syncStateToRoute(nextState)
  if (curNav !== lastNav) return false
  om.actions.home.updateActiveTags(nextState)
  return didNav
}

const moveSearchBarTagIndex: Action<number> = (om, val) => {
  om.actions.home.setSearchBarTagIndex(om.state.home.searchBarTagIndex + val)
}

const setSearchBarTagIndex: Action<number> = (om, val) => {
  om.state.home.searchBarTagIndex = clamp(
    val,
    -om.state.home.searchBarTags.length,
    0
  )
}

const moveAutocompleteIndex: Action<number> = (om, val) => {
  om.actions.home.setAutocompleteIndex(om.state.home.autocompleteIndex + val)
}

const setAutocompleteIndex: Action<number> = (om, val) => {
  om.state.home.autocompleteIndex = clamp(
    val,
    0,
    // not -1 because we show a fake "search" entry first
    om.state.home.activeAutocompleteResults.length
  )
}

const setSearchBarY: Action<number> = (om, val) => {
  om.state.home.searchBarY = val
}

const setIsHoveringRestaurant: Action<boolean> = (om, val) => {
  om.state.home.isHoveringRestaurant = val
}

const setSelectedRestaurant: Action<RestaurantOnlyIds | null> = (om, val) => {
  om.state.home.selectedRestaurant = val
}

const setShowUserMenu: Action<boolean> = (om, val) => {
  om.state.home.showUserMenu = val
}

const promptLogin: Action<undefined, boolean> = (om) => {
  const user = om.state.user.user
  if (!user || !om.state.user.isLoggedIn) {
    om.actions.home.setShowUserMenu(true)
    Toast.show(`Signup/login to do this`)
    return true
  }
  return false
}

const getShouldNavigate: Action<HomeStateTagNavigable, boolean> = (
  om,
  state
) => {
  const navItem = getNavigateItemForState(om, state)
  return router.getShouldNavigate(navItem)
}

// avoid nasty two way sync bugs as much as possible
let recentTries = 0
let synctm
const syncStateToRoute: AsyncAction<HomeStateTagNavigable, boolean> = async (
  om,
  state
) => {
  const should = getShouldNavigate(om, state)
  if (should) {
    recentTries++
    clearTimeout(synctm)
    if (recentTries > 3) {
      console.warn('bailing loop')
      recentTries = 0
      // break loop
      return false
    }
    synctm = setTimeout(() => {
      recentTries = 0
    }, 200)
    const navItem = getNavigateItemForState(om, state)
    router.navigate(navItem)
    return true
  }
  return false
}

const updateCurrentState: Action<Partial<Omit<HomeStateItem, 'type'>>> = (
  om,
  val
) => {
  om.actions.home.updateHomeState({
    id: om.state.home.currentState.id,
    ...val,
  })
}

const setDrawerSnapPoint: Action<number> = (om, val) => {
  om.state.home.drawerSnapPoint = val
}

const setCenterToResults: Action<number | void> = (om, val) => {
  // @ts-ignore
  om.state.home.centerToResults = val ?? Date.now()
}

export const actions = {
  getShouldNavigate,
  syncStateToRoute,
  updateCurrentState,
  getNavigateItemForState,
  moveAutocompleteIndex,
  setAutocompleteIndex,
  setLocationAutocompleteResults,
  setCenterToResults,
  setSearchQuery,
  updateCurrentMapAreaInformation,
  clearSearch,
  forkCurrentList,
  handleRouteChange,
  moveActive,
  up,
  clearTag,
  popTo,
  requestLocation,
  runSearch,
  setActiveIndex,
  setHoveredRestaurant,
  setLocation,
  setLocationSearchQuery,
  setSearchBarFocusedTag,
  moveSearchBarTagIndex,
  setSearchBarTagIndex,
  setShowAutocomplete,
  popBack,
  refresh,
  suggestTags,
  updateActiveTags,
  setAutocompleteResults,
  clearTags,
  setIsLoading,
  updateHomeState,
  navigate,
  moveMapToUserLocation,
  setSearchBarY,
  setIsHoveringRestaurant,
  setSelectedRestaurant,
  setShowUserMenu,
  promptLogin,
  setDrawerSnapPoint,
}
