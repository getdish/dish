import { fullyIdle, idle, sleep } from '@dish/async'
import {
  RestaurantOnlyIds,
  RestaurantSearchArgs,
  Tag,
  search,
  slugify,
} from '@dish/graph'
import { assert, handleAssertionError, stringify } from '@dish/helpers'
import { HistoryItem, NavigateItem } from '@dish/router'
import { Toast } from '@dish/ui'
import { isEqual } from '@o/fast-compare'
import _, { clamp, cloneDeep, findLast, isPlainObject, last } from 'lodash'
import { Action, AsyncAction, derived } from 'overmind'

import { getBreadcrumbs, isBreadcrumbState } from '../pages/home/getBreadcrumbs'
import { defaultLocationAutocompleteResults } from './defaultLocationAutocompleteResults'
import { setDefaultLocation } from './getDefaultLocation'
import { getNextState } from './getNextState'
import { getTagId } from './getTagId'
import { isHomeState, isRestaurantState, isSearchState } from './home-helpers'
import {
  HomeStateNav,
  allTags,
  cleanTagName,
  getActiveTags,
  getRouteFromTags,
  isSearchBarTag,
} from './home-tag-helpers'
import {
  ActiveEvent,
  AutocompleteItem,
  HomeActiveTagsRecord,
  HomeState,
  HomeStateItem,
  HomeStateItemHome,
  HomeStateItemRestaurant,
  HomeStateItemSearch,
  HomeStateTagNavigable,
  LngLat,
  OmState,
  ShowAutocomplete,
} from './home-types'
import { initialHomeState } from './initialHomeState'
import { NavigableTag } from './NavigableTag'
import { omStatic } from './om'
import { reverseGeocode } from './reverseGeocode'
import { router } from './router'
import { shouldBeOnHome } from './shouldBeOnHome'
import { tagFilters } from './tagFilters'
import { tagLenses } from './tagLenses'

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
  allTags,
  allTagsNameToID: {},
  allUsers: {},
  allLenseTags: tagLenses,
  allFilterTags: tagFilters,
  showAutocomplete: false,
  drawerSnapPoint: 0,
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
  topDishes: [],
  userLocation: null,
  currentNavItem: derived<HomeState, OmState, NavigateItem>((state, om) =>
    // @ts-ignore
    getNavigateItemForState(omStatic, last(state.states)!)
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
  currentState: derived<HomeState, OmState, HomeStateItem>(
    (state) => _.last(state.states)!
  ),
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
  searchBarTags: derived<HomeState, OmState, Tag[]>((state) =>
    state.lastActiveTags.filter(isSearchBarTag)
  ),
  lastActiveTags: derived<HomeState, OmState, Tag[]>((state) => {
    const lastTaggable = _.findLast(
      state.states,
      (x) => isHomeState(x) || isSearchState(x)
    ) as HomeStateItemSearch | HomeStateItemHome
    return getActiveTags(lastTaggable)
  }),
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
      if ('activeTagIds' in state.currentState) {
        for (const id in state.currentState.activeTagIds) {
          const tag = state.allTags[id]
          if (tag?.type == 'lense') {
            return tag
          }
        }
      }
      return null
    }
  ),
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

type PageAction = () => Promise<void>

const refresh: AsyncAction = async (om) => {
  om.state.home.refreshCurrentPage = Date.now()
}

const up: Action = (om) => {
  const curType = om.state.home.currentStateType
  if (isBreadcrumbState(curType)) {
    const crumbs = getBreadcrumbs(om.state.home.states)
    const prevCrumb = _.findLast(crumbs, (x) => x.type !== curType)
    om.actions.home.popTo(prevCrumb?.type ?? 'home')
  } else {
    const prev = om.state.home.previousState?.type
    om.actions.home.popTo(prev ?? 'home')
  }
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
    (router.prevHistory?.type === 'push' ||
      router.prevHistory?.type === 'replace') &&
    router.prevHistory?.name === type
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
    console.log('did nav from search')
    // nav will trigger search
    return
  }

  let state = om.state.home.lastSearchState
  const tags = getActiveTags()

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

  const hasSearchBarTag = tags.some(isSearchBarTag)
  const searchArgs: RestaurantSearchArgs = {
    center: roundLngLat(state.mapAt?.center ?? state.center),
    span: roundLngLat(padSpan(state.mapAt?.span ?? state.span)),
    query: state.searchQuery,
    tags: [
      ...tags.map((tag) => getTagId(tag).replace(/[a-z]+_/g, '')),
      ...(!hasSearchBarTag
        ? [getTagId({ name: state.searchQuery, type: 'dish' })]
        : []),
    ],
  }

  // prevent duplicate searches
  const searchKey = stringify(searchArgs)
  if (!opts.force && searchKey === lastSearchKey) {
    console.log('same searchkey as last, ignore')
    return
  }

  // fetch
  let restaurants = await search(searchArgs)
  if (shouldCancel()) return

  // only update searchkey once finished
  lastSearchKey = searchKey
  state = om.state.home.lastSearchState
  if (!state) return

  // console.log('search found restaurants', restaurants)
  state.status = 'complete'
  state.results = restaurants.filter(Boolean)

  // overmind seems unhappy to just let us mutate
  om.actions.home.updateHomeState({
    ...state,
    mapAt: null,
  })
}

const deepAssign = (a: Object, b: Object) => {
  for (const key in b) {
    if (a[key] != b[key]) {
      // WARNING, overmind got totally confused when recursing and broke things in subtle ways
      // do not recurse objects and deep assign, just flat assign for now...
      if (a[key] && b[key] && isEqual(a[key], b[key])) {
        continue
      }
      a[key] = isPlainObject(b[key]) ? { ...b[key] } : b[key]
    }
  }
  for (const key in a) {
    if (!(key in b)) {
      delete a[key]
    }
  }
}

const updateHomeState: Action<HomeStateItem> = (om, val) => {
  const state = om.state.home.allStates[val.id]
  if (state) {
    if (state.type !== val.type) {
      console.warn('shouldnt update the type...')
      return
    }
    deepAssign(state, val)
  } else {
    om.state.home.allStates[val.id] = { ...val }
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
  om.state.home.isHoveringRestaurant = true
}

const suggestTags: AsyncAction<string> = async (om, tags) => {
  let state = om.state.home.currentState
  if (!isRestaurantState(state)) return
  // none
}

const getUserPosition = () => {
  return new Promise<Position>((res, rej) => {
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
    switch (item.name) {
      case 'home':
      case 'about':
      case 'search':
      case 'user':
      case 'gallery':
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

  currentStates = om.state.home.states
  await Promise.all([...promises])
}

const uid = () => `${Math.random()}`.replace('.', '')

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
  let activeTagIds: HomeActiveTagsRecord
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
        searchQuery: '',
        activeTagIds,
      }
      break
    }

    case 'about': {
      break
    }

    // search or userSearch
    case 'userSearch':
    case 'search': {
      let lastHomeOrSearch: HomeStateItemHome | HomeStateItemSearch = null
      for (const id of _.reverse([...om.state.home.stateIds])) {
        const state = om.state.home.allStates[id]
        if (isHomeState(state) || isSearchState(state)) {
          lastHomeOrSearch = state
          break
        }
      }
      if (!lastHomeOrSearch) {
        throw new Error('unreachable')
      }

      // use last home or search to get most up to date
      activeTagIds = lastHomeOrSearch.activeTagIds

      const username =
        type == 'userSearch' ? om.state.router.curPage.params.username : ''

      // preserve results if staying on search
      const results =
        om.state.home.previousState?.type === 'search'
          ? om.state.home.lastSearchState?.results ?? []
          : []

      nextState = {
        status: 'loading',
        results,
        username,
        activeTagIds,
      }
      break
    }

    // restaurant
    case 'restaurant': {
      nextState = {
        restaurantId: null,
        restaurantSlug: item.params.slug,
      }
      break
    }

    case 'user': {
      nextState = {
        username: item.params.username,
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
  }

  const finalState = {
    center: currentState?.center ?? initialHomeState.center,
    span: currentState?.span ?? initialHomeState.span,
    searchQuery,
    ...nextState,
    type,
    id: item.id ?? uid(),
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

  // is going back
  // we are going back to a prev state!
  // hacky for now
  // if (nextPushIsReallyAPop) {
  //   console.log('nextPushIsReallyAPop', nextPushIsReallyAPop, item)
  //   nextPushIsReallyAPop = false
  //   const prev = _.findLast(om.state.home.states, (x) => x.type === item.name)
  //   if (prev) {
  //     om.actions.home.updateHomeState(prev)
  //     om.actions.home.setIsLoading(false)
  //     currentAction = runFetchData
  //     return { fetchDataPromise: Promise.resolve(null) }
  //   }
  // }

  // if (true) {
  //   console.log(
  //     'pushHomeState',
  //     JSON.stringify({ shouldReplace, item, finalState, id }, null, 2)
  //   )
  // }

  console.log('pushState finalState', finalState)
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

export let currentStates: HomeStateItem[] = []

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
    om.state.home.currentState.center = { ...exact.center }
    setDefaultLocation({
      center: exact.center,
      span: om.state.home.currentState.span,
    })
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
      id: om.state.home.currentState.id,
    }
    // @ts-ignore
    om.actions.home.updateHomeState(nextState)
  } catch (err) {
    handleAssertionError(err)
  }
}

// adds to allTags + allTagsNameToID
const addTagsToCache: Action<NavigableTag[] | null> = (om, tags) => {
  for (const tag of tags ?? []) {
    if (tag.name) {
      const id = getTagId(tag)
      const existing = om.state.home.allTags[id]
      om.state.home.allTags[id] = { ...existing, ...tag }
      om.state.home.allTagsNameToID[cleanTagName(tag.name)] = id
    }
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
  const nextState = {
    ...om.state.home.currentState,
    activeTagIds: {
      [getTagId(tagLenses[0])]: true,
    },
  }
  console.log('clear tags', nextState)
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

let tm
const setIsLoading: Action<boolean> = (om, val) => {
  om.state.home.isLoading = val
  // prevent infinite spinners
  clearTimeout(tm)
  tm = setTimeout(() => {
    if (val) {
      om.state.home.isLoading = false
    }
  }, 2000)
}

// this is useful for search where we mutate the current state while you type,
// but then later you hit "enter" and we need to navigate to search (or home)
// we definitely can clean up / name better some of this once things settle
let lastNav = Date.now()
const navigate: AsyncAction<HomeStateNav, boolean> = async (om, navState) => {
  navState.state = navState.state ?? om.state.home.currentState
  const nextState = getNextState(navState)
  const curState = om.state.home.currentState

  const updateTags = () => {
    const type = curState.type as any
    om.actions.home.updateActiveTags({
      id: curState.id,
      type,
      searchQuery: nextState.searchQuery,
      activeTagIds: nextState.activeTagIds,
      ...(type === 'search' && {
        status: 'loading',
        results: [],
      }),
    })
  }

  if (!om.actions.home.getShouldNavigate(nextState)) {
    updateTags()
    return false
  }

  lastNav = Date.now()
  let curNav = lastNav
  om.state.home.isOptimisticUpdating = false
  if (navState.tags) {
    om.actions.home.addTagsToCache(navState.tags)
  }

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

  console.warn('home.navigate', navState, nextState)
  const didNav = await syncStateToRoute(om, nextState)
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
    Toast.show(`Please signup or login to do this`)
    return true
  }
  return false
}

export const getNavigateItemForState: Action<
  HomeStateTagNavigable,
  NavigateItem
> = (om, _state): NavigateItem => {
  const { home, router } = om.state
  const state = _state || home.currentState
  const isHome = isHomeState(state)
  const isSearch = isSearchState(state)
  const curParams = router.curPage.params

  // we only handle "special" states here (home/search)
  if (!isHome && !isSearch) {
    return {
      name: state.type,
      params: curParams,
    }
  }
  // if going home, just go there
  const shouldBeHome = shouldBeOnHome(state)

  let name = state.type
  if (name === 'home' && !shouldBeHome) {
    name = 'search'
  } else if (name === 'search' && shouldBeHome) {
    name = 'home'
  }

  const curName = router.curPage.name
  const isChangingType = name !== curName
  const replace = !isChangingType

  if (shouldBeHome) {
    return {
      name: 'home',
      replace,
    }
  }

  // build params
  const params = getRouteFromTags(state)
  // TODO wtf is this doing here
  if (state.searchQuery) {
    params.search = state.searchQuery
  }
  if (state.type === 'userSearch') {
    // @ts-ignore
    params.username = curParams.username
  }

  return {
    name,
    params,
    replace,
  }
}

const getShouldNavigate: Action<HomeStateTagNavigable, boolean> = (
  om,
  state
) => {
  const navItem = om.actions.home.getNavigateItemForState(state)
  return router.getShouldNavigate(navItem)
}

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
    const navItem = om.actions.home.getNavigateItemForState(state)
    if (process.env.NODE_ENV === 'development') {
      console.log(
        'syncStateToRoute',
        cloneDeep({ should, navItem, state, recentTries })
      )
    }
    router.navigate(navItem)
    return true
  }
  return false
}

const updateCurrentState: Action<Partial<HomeStateItem>> = (om, val) => {
  om.actions.home.updateHomeState({
    ...om.state.home.currentState,
    ...(val as any),
  })
}

const setDrawerSnapPoint: Action<number> = (om, val) => {
  om.state.home.drawerSnapPoint = val
}

const setTopDishes: Action<any> = (om, val) => {
  om.state.home.topDishes = val
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
  addTagsToCache,
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
  setTopDishes,
}
