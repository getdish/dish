import { isEqual } from '@dish/fast-compare'
import { assert, handleAssertionError, stringify } from '@dish/helpers'
import { HistoryItem } from '@dish/router'
import { Store, createStore, useStoreInstance, useStoreInstanceSelector } from '@dish/use-store'
import _, { clamp, findLast } from 'lodash'
import { Keyboard } from 'react-native'

import { initialHomeState } from '../constants/initialHomeState'
import { tagLenses } from '../constants/localTags'
import { addTagsToCache, allTags } from '../helpers/allTags'
import { ensureLenseTag } from '../helpers/ensureLenseTag'
import { getActiveTags } from '../helpers/getActiveTags'
import { getBreadcrumbs, isBreadcrumbState } from '../helpers/getBreadcrumbs'
import { getNavigateItemForState } from '../helpers/getNavigateItemForState'
import { getNextHomeState } from '../helpers/getNextHomeState'
import { getShouldNavigate } from '../helpers/getShouldNavigate'
import { getTagSlug } from '../helpers/getTagSlug'
import { isHomeState, isSearchState } from '../helpers/homeStateHelpers'
import { isSearchBarTag } from '../helpers/isSearchBarTag'
import { syncStateFromRoute } from '../helpers/syncStateFromRoute'
import { syncStateToRoute } from '../helpers/syncStateToRoute'
import { router } from '../router'
import {
  HomeStateItem,
  HomeStateItemHome,
  HomeStateItemSearch,
  HomeStateNav,
  HomeStateTagNavigable,
  HomeStatesByType,
} from '../types/homeTypes'
import { NavigableTag } from '../types/tagTypes'
import { appMapStore } from './AppMap'
import { searchPageStore } from './home/search/SearchPageStore'

class HomeStore extends Store {
  searchBarTagIndex = 0
  stateIndex = 0
  stateIds = ['0']
  allStates: {
    [key: string]: HomeStateItem
  } = {
    '0': initialHomeState,
  }
  loading = false

  get lastHomeState() {
    return findLast(this.states, isHomeState)!
  }

  get lastSearchState() {
    return findLast(this.states, isSearchState)
  }

  get lastHomeOrSearchState() {
    return findLast(this.states, (x) => isSearchState(x) || isHomeState(x)) as
      | HomeStateItemSearch
      | HomeStateItemHome
  }

  getLastStateByType<Type extends keyof HomeStatesByType>(type: Type) {
    return findLast(this.states, (x) => x.type === type) as any as HomeStatesByType[Type]
  }

  get currentStates() {
    return this.states.slice(0, this.stateIndex + 1)
  }

  get breadcrumbs() {
    return getBreadcrumbs(this.currentStates)
  }

  get currentState() {
    return this.states[this.stateIndex]
  }

  get currentSearchQuery() {
    return this.currentState.searchQuery || ''
  }

  get currentStateType() {
    return this.currentState.type
  }

  get previousState() {
    const curState = this.states[this.stateIndex]
    for (let i = this.stateIndex - 1; i >= 0; i--) {
      const next = this.states[i]
      if (next?.type !== curState?.type) {
        return next
      }
    }
    return this.states[0]
  }

  get searchBarTags(): NavigableTag[] {
    const curState = this.states[this.stateIndex]
    return getActiveTags(curState).filter(isSearchBarTag)
  }

  get lastActiveTags(): NavigableTag[] {
    const lastTaggable = _.findLast(this.states, (x) => isHomeState(x) || isSearchState(x)) as
      | HomeStateItemSearch
      | HomeStateItemHome
    return getActiveTags(lastTaggable)
  }

  get searchbarFocusedTag(): NavigableTag | null {
    const { searchBarTagIndex } = this
    if (searchBarTagIndex > -1) return null
    const index = this.searchBarTags.length + searchBarTagIndex
    return this.searchBarTags[index]
  }

  get states(): HomeStateItem[] {
    return this.stateIds.map((x) => this.allStates[x])
  }

  get currentStateLense(): NavigableTag | null {
    if ('activeTags' in this.currentState) {
      for (const id in this.currentState.activeTags) {
        const tag = allTags[id]
        if (tag?.type == 'lense') {
          return tag
        }
      }
    }
    return tagLenses[0]
  }

  get lastRegionSlug() {
    const states = this.states
    for (let i = states.length - 1; i >= 0; i--) {
      const state = states[i]
      if ('region' in state && state.region) {
        return state.region
      }
    }
    return initialHomeState.region
  }

  private tm: any = null
  setLoading(n: boolean) {
    clearTimeout(this.tm)
    this.loading = n
    if (n) {
      // max time to show loading in case stuck somehow
      this.tm = setTimeout(() => {
        this.setLoading(false)
      }, 1000)
    }
  }

  get upType() {
    const curType = this.currentState.type
    const crumbs = this.breadcrumbs
    // if (crumbs.length === 2) {
    //   return findLast(crumbs, (x) => x.type.startsWith('home'))?.type ?? 'home'
    // }
    if (!isBreadcrumbState(curType)) {
      return _.last(crumbs)?.type ?? 'home'
    }
    return findLast(crumbs, (x) => x.type !== curType)?.type ?? 'home'
  }

  up() {
    this.popTo(this.upType)
  }

  popBack() {
    const cur = this.currentState
    const next = findLast(this.states, (x) => x.type !== cur.type)
    this.popTo(next?.type ?? 'home')
  }

  get upRoute() {
    const cur = this.currentState
    return this.getUpRouteForType(findLast(this.states, (x) => x.type !== cur.type)?.type ?? 'home')
  }

  getIsUpBack(type: HomeStateItem['type']) {
    // we can just use router history directly, no? and go back?
    const lastRouterName = router.prevHistory?.name
    const lastRouterType = normalizeItemName[lastRouterName] ?? lastRouterName
    return (
      this.previousState?.type === type && lastRouterType === type && router.curPage?.type !== 'pop'
    )
  }

  getUpRouteForType(type: HomeStateItem['type']) {
    const currentState = this.currentState
    if (currentState.type === 'home') {
      return null
    }
    const states = this.states
    const prevStates = states.slice(0, states.length - 1)
    const stateItem = _.findLast(prevStates, (x) => x.type === type)
    const routerItem =
      router.history.find((x) => x.id === stateItem?.id) ??
      _.findLast(router.history, (x) => x.name === type)
    const homeRegionParams = {
      region: stateItem?.['region'] ?? this.lastHomeState.region ?? 'ca-san-francisco',
    }
    if (routerItem) {
      return {
        name: type == 'home' ? 'homeRegion' : type,
        params:
          type == 'home' ? { ...homeRegionParams, ...routerItem?.params } : routerItem?.params,
      } as const
    }
    return {
      name: 'homeRegion',
      params: homeRegionParams,
    } as const
  }

  popTo(type: HomeStateItem['type']) {
    console.log('we need better popping')
    if (this.getIsUpBack(type)) {
      router.back()
      return
    }
    const n = this.getUpRouteForType(type)
    if (!n) return
    router.navigate(n)
  }

  updateHomeState(via: string, val: { id: string; [key: string]: any }) {
    if (!val.id) {
      throw new Error(`Must have id`)
    }
    let state = this.allStates[val.id] ?? null
    // disable: should be explicit
    // default to replace the current state if type doesn't change
    // if (!state) {
    //   if (val.type && this.currentState.type === val.type) {
    //     state = this.currentState
    //     val.id = state.id
    //   }
    // }
    if (
      val.id !== this.currentState.id &&
      val.type === 'search' &&
      val.type &&
      this.currentState.type === val.type
    ) {
      console.warn('pushing a new state thats the same type as the last state... desired?')
      debugger
    }
    if (state) {
      if (val.type && state.type !== val.type) {
        throw new Error(`Cant change the type`)
      }
    }
    this.allStates = {
      ...this.allStates,
      [val.id]: { ...state, ...val },
    }
    if (!state) {
      this.stateIds = [...new Set([...this.stateIds, val.id])]
      this.stateIndex = this.stateIds.length - 1
    }
  }

  clearSearch() {
    const hasQuery = !!this.currentSearchQuery
    if (!hasQuery) {
      this.clearTags()
    } else {
      this.setSearchQuery('')
    }
  }

  getHomeState(item: HistoryItem) {
    if (!item) {
      console.warn('no item?')
      return null
    }

    const { currentState } = this
    const searchQuery = item?.params?.query ?? currentState?.searchQuery ?? ''

    let nextState: Partial<HomeStateItem> | null = null
    const type = item.name

    switch (item.name) {
      // home
      case 'homeRegion':
      case 'home': {
        const prev = _.findLast(this.states, isHomeState)
        const region = item.params.region ?? prev?.region
        nextState = {
          type: 'home', // region ? 'homeRegion' : 'home',
          searchQuery: '',
          activeTags: {},
          curLocInfo: null,
          curLocName: '',
          region,
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

      case 'list': {
        nextState = {
          slug: item.params.slug,
          userSlug: item.params.userSlug,
          region: item.params.region,
          state: item.params.state,
        }
        break
      }

      case 'userEdit':
      case 'about': {
        break
      }

      case 'search': {
        searchPageStore.resetResults()
        const prev = findLastHomeOrSearch(this.states)
        if (!prev) {
          throw new Error('unreachable')
        }
        const routeState = syncStateFromRoute(router.curPage as HistoryItem<'search'>)
        const activeTags = routeState.tags.reduce((acc, cur) => {
          acc[cur.slug!] = true
          return acc
        }, {})

        addTagsToCache(routeState.tags)

        const region = routeState.region ?? router.curPage.params.region ?? prev.region
        const isChangingRegion = region !== prev.region
        const state: Partial<HomeStateItemSearch> = {
          type: 'search',
          center: routeState.center,
          span: routeState.span,
          region,
          activeTags,
          searchQuery,
          ...(isChangingRegion && {
            curLocInfo: null,
            curLocName: `${router.curPage.data?.name ?? ''}`,
          }),
        }
        nextState = state
        break
      }

      // restaurant
      case 'restaurant': {
        nextState = {
          section: item.params.section,
          sectionSlug: item.params.sectionSlug,
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

    return {
      center: item.data?.center ?? appMapStore.currentPosition.center,
      span: item.data?.span ?? appMapStore.currentPosition.span,
      curLocName: currentState?.curLocName,
      curLocInfo: currentState?.curLocInfo,
      searchQuery,
      type,
      ...nextState,
      id: item.id ?? uid(),
    } as HomeStateItem
  }

  handleRouteChange(item: HistoryItem) {
    if (item.name === 'notFound') {
      return
    }

    // happens on *any* route push or pop
    if (appMapStore.hovered) {
      appMapStore.setHovered(null)
    }

    if (item.type === 'pop') {
      const curIndex = this.stateIndex
      const lastIndex = this.states.length - 1
      switch (item.direction) {
        case 'forward': {
          this.stateIndex = Math.min(lastIndex, curIndex + 1)
          return
        }
        case 'backward': {
          this.stateIndex = Math.max(0, curIndex - 1)
          return
        }
        default: {
          console.error('NO DIRECTION FOR A POP??', item)
        }
      }
      return
    } else {
      if (item.type !== 'replace') {
        // remove future states no longer accessible
        this.stateIds = this.stateIds.slice(0, this.stateIndex + 1)
      }
    }

    const next = this.getHomeState(item)

    if (next) {
      if (item.type === 'replace') {
        if (item.name !== this.currentState.type) {
          // for now allow homeRegion to replace home,
          // TODO make homeRegion/home the same route but fix issues with router
          // to support that
          if (item.name !== 'homeRegion') {
            console.warn('replace with diff type ⚠️⚠️⚠️⚠️')
          }
        }
        // ensure same id
        next.id = this.currentState.id
      }

      this.updateHomeState('handleRouteChange', next)
    }
  }

  setSearchBarFocusedTag(val: NavigableTag | null) {
    if (!val) {
      this.searchBarTagIndex = 0
      return
    }
    const tags = this.searchBarTags
    const tagIndex = tags.findIndex((x) => getTagSlug(x.slug) === getTagSlug(val.slug))
    console.warn('todo comented out')
    this.searchBarTagIndex = tagIndex
    // this.autocompleteIndex = -tags.length + tagIndex
  }

  setSearchQuery(searchQuery: string) {
    this.updateCurrentState('setSearchQuery', {
      searchQuery,
    })
  }

  async clearTags() {
    await this.navigate({
      state: {
        ...this.currentState,
        activeTags: {},
      },
    })
  }

  async clearTag(tag: NavigableTag) {
    const state = this.currentState
    if ('activeTags' in state) {
      const nextState = {
        ...state,
        activeTags: {
          ...state.activeTags,
          [getTagSlug(tag.slug)]: false,
        },
      }
      await this.navigate({
        state: nextState,
      })
    }
  }

  // this is useful for search where we mutate the current state while you type,
  // but then later you hit "enter" and we need to navigate to search (or home)
  // we definitely can clean up / name better some of this once things settle
  private lastNav = Date.now()

  getShouldNavigate({ state, ...rest }: HomeStateNav) {
    const navState = { state: state ?? this.currentState, ...rest }
    const nextState = getNextHomeState(navState)
    const navItem = getNavigateItemForState(nextState)
    return getShouldNavigate(navItem)
  }

  async navigate({ state, ...rest }: HomeStateNav) {
    const curState = this.currentState
    const navState = { state: state ?? curState, ...rest }
    const nextState = getNextHomeState(navState)
    const navItem = getNavigateItemForState(nextState)
    const shouldNav = getShouldNavigate(navItem)
    if (!shouldNav) {
      return false
    }

    Keyboard.dismiss()

    this.lastNav = Date.now()
    let curNav = this.lastNav

    const didNav = await syncStateToRoute(nextState)
    if (curNav !== this.lastNav) {
      return false
    }

    return didNav
  }

  moveSearchBarTagIndex(val: number) {
    this.setSearchBarTagIndex(this.searchBarTagIndex + val)
  }

  setSearchBarTagIndex(val: number) {
    this.searchBarTagIndex = clamp(val, -this.searchBarTags.length, 0)
  }

  updateCurrentState<A extends HomeStateItem>(via: string, val: Partial<Omit<A, 'type'>>) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🏡 updateCurrentState ${via}`, val)
    }
    this.updateHomeState(`updateCurrentState(${via})`, {
      id: this.currentState.id,
      ...val,
    })
  }
}

const normalizeItemName = {
  homeRegion: 'home',
}

export const homeStore = createStore(HomeStore)

export const useHomeStore = (debug?: boolean): HomeStore => {
  return useStoreInstance(homeStore, debug)
}

export const useHomeStoreSelector = <A extends (store: HomeStore) => any>(
  selector: A,
  debug?: boolean
): A extends (store: HomeStore) => infer B ? B : unknown => {
  return useStoreInstanceSelector(homeStore, selector, [], debug)
}

export const useLastHomeState = <Type extends HomeStateItem['type']>(type: Type) => {
  return useStoreInstanceSelector(homeStore, (x) => _.findLast(x.states, (s) => s.type === type), [
    type,
  ])
}

export const useHomeCurrentHomeType = () => {
  return useStoreInstanceSelector(homeStore, (x) => x.currentState.type)
}

export const useIsHomeTypeActive = (type?: HomeStateItem['type']) => {
  return useStoreInstanceSelector(homeStore, (x) => x.currentState.type === type, [type])
}

export const useHomeStateById = <Type extends HomeStateItem>(id: string) => {
  return useStoreInstanceSelector(homeStore, (x) => x.allStates[id], [id]) as Type
}

const uid = () => `${Math.random()}`.replace('.', '')

export const findLastHomeOrSearch = (states: HomeStateItem[]) => {
  const prev: HomeStateItemHome | HomeStateItemSearch = _.findLast(
    states,
    (x) => isHomeState(x) || isSearchState(x)
  ) as any
  return prev
}
