import { idle, sleep } from '@dish/async'
import { isEqual } from '@dish/fast-compare'
import { Tag } from '@dish/graph'
import { assert, handleAssertionError, stringify } from '@dish/helpers'
import { HistoryItem } from '@dish/router'
import _, { clamp, findLast, isPlainObject } from 'lodash'
import { Action, AsyncAction, Config, IContext, derived } from 'overmind'
import { Keyboard } from 'react-native'
import { Toast } from 'snackui'

import { appMapStore } from '../AppMapStore'
import { getBreadcrumbs, isBreadcrumbState } from '../helpers/getBreadcrumbs'
import { allTags } from './allTags'
import { getActiveTags } from './getActiveTags'
import { getNextState } from './getNextState'
import { getShouldNavigate } from './getShouldNavigate'
import { getTagSlug } from './getTagSlug'
import { isHomeState, isSearchState } from './home-helpers'
import {
  HomeState,
  HomeStateItem,
  HomeStateItemHome,
  HomeStateItemSearch,
  HomeStateNav,
  HomeStateTagNavigable,
  OmState,
} from './home-types'
import { initialHomeState } from './initialHomeState'
import { isSearchBarTag } from './isSearchBarTag'
import { tagLenses } from './localTags'
import { NavigableTag } from './NavigableTag'
import { router } from './router'
import { syncStateToRoute } from './syncStateToRoute'

export const state: HomeState = {
  started: false,
  isLoading: false,
  skipNextPageFetchData: false,
  showUserMenu: false,
  searchBarTagIndex: 0,
  allUsers: {},
  isOptimisticUpdating: false,
  stateIndex: 0,
  stateIds: ['0'],
  allStates: {
    '0': initialHomeState,
  },
  lastHomeState: derived<HomeState, OmState, HomeStateItemHome>(
    (state) => findLast(state.states, isHomeState)!
  ),
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
  >((state) => {
    return state.currentState.searchQuery
  }),
  currentStateType: derived<HomeState, OmState, HomeStateItem['type']>(
    (state) => state.currentState.type
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
    return state.stateIds.map((x) => state.allStates[x])
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

type PageAction = () => Promise<void>

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

const normalizeItemName = {
  homeRegion: 'home',
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
  const lastRouterName = router.prevHistory?.name
  const lastRouterType = normalizeItemName[lastRouterName] ?? lastRouterName
  if (
    om.state.home.previousState?.type === type &&
    lastRouterType === type &&
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
  const homeRegionParams = {
    region:
      stateItem?.['region'] ??
      om.state.home.lastHomeState.region ??
      'ca-san-francisco',
  }

  if (routerItem) {
    router.navigate({
      name: type == 'home' ? 'homeRegion' : type,
      params:
        type == 'home'
          ? { ...homeRegionParams, ...routerItem?.params }
          : routerItem?.params,
    })
  } else {
    console.warn('no match')
    router.navigate({
      name: 'homeRegion',
      params: homeRegionParams,
    })
  }
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
    deepAssign(state, val)
  } else {
    om.state.home.allStates[val.id] = { ...val } as any
    // cleanup old from backward
    const stateIds = om.state.home.stateIds
    const lastIndex = stateIds.length - 1
    if (lastIndex > om.state.home.stateIndex) {
      om.state.home.stateIds = stateIds.slice(0, om.state.home.stateIndex + 1)
    }
    om.state.home.stateIds = [...new Set([...stateIds, val.id])]
    om.state.home.stateIndex = om.state.home.stateIds.length - 1
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

const handleRouteChange: AsyncAction<HistoryItem> = async (om, item) => {
  // happens on *any* route push or pop
  if (appMapStore.hovered) {
    appMapStore.setHovered(null)
  }

  if (item.type === 'pop') {
    const curIndex = om.state.home.stateIndex
    const total = om.state.home.states.length
    switch (item.direction) {
      case 'forward': {
        om.state.home.stateIndex = Math.min(total, curIndex + 1)
        return
      }
      case 'backward': {
        om.state.home.stateIndex = Math.max(0, curIndex - 1)
        return
      }
      default: {
        console.error('NO DIRECTION FOR A POP??', item)
      }
    }
  }

  const promises = new Set<Promise<any>>()
  const name = normalizeItemName[item.name] ?? item.name

  // actions per-route
  if (item.type === 'push' || item.type === 'replace') {
    switch (name) {
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
        const prevState = findLast(om.state.home.states, (x) => x.type === name)
        const res = await pushHomeState(om, {
          ...item,
          name,
          id: item.type === 'replace' ? prevState.id : item.id,
        })
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

  switch (item.name) {
    // home
    case 'homeRegion':
    case 'home': {
      const prev = _.findLast(om.state.home.states, isHomeState)
      nextState = {
        type: 'home',
        searchQuery: '',
        activeTags: {},
        region: item.params.region ?? prev.region,
        section: item.params.section ?? '',
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
        center: appMapStore.position.center,
        span: appMapStore.position.span,
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
        center: appMapStore.position.center,
        span: appMapStore.position.span,
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
    center: currentState?.center,
    span: currentState?.span,
    searchQuery,
    type,
    ...nextState,
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

const requestLocation: Action = (om) => {}

const setSearchBarFocusedTag: Action<NavigableTag | null> = (om, val) => {
  if (!val) {
    om.state.home.searchBarTagIndex = 0
    return
  }
  const tags = om.state.home.searchBarTags
  const tagIndex = tags.findIndex((x) => getTagSlug(x) === getTagSlug(val))
  console.warn('todo comented out')
  // om.state.home.autocompleteIndex = -tags.length + tagIndex
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
      activeTags: next.activeTags,
      id: om.state.home.currentState.id,
    }
    // @ts-ignore
    om.actions.home.updateHomeState(nextState)
  } catch (err) {
    handleAssertionError(err)
  }
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

  if (!getShouldNavigate(nextState)) {
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
    await sleep(20)
    await idle(30)
    if (curNav !== lastNav) return false
    om.state.home.isOptimisticUpdating = false
  }

  const didNav = await syncStateToRoute(nextState)
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

const updateCurrentState: Action<Partial<Omit<HomeStateItem, 'type'>>> = (
  om,
  val
) => {
  om.actions.home.updateHomeState({
    id: om.state.home.currentState.id,
    ...val,
  })
}

export const actions = {
  updateCurrentState,
  setSearchQuery,
  clearSearch,
  handleRouteChange,
  up,
  clearTag,
  popTo,
  requestLocation,
  setSearchBarFocusedTag,
  moveSearchBarTagIndex,
  setSearchBarTagIndex,
  popBack,
  updateActiveTags,
  clearTags,
  setIsLoading,
  updateHomeState,
  navigate,
  setShowUserMenu,
  promptLogin,
}
