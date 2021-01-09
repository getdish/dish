import { idle, sleep } from '@dish/async'
import { isEqual } from '@dish/fast-compare'
import { assert, handleAssertionError, stringify } from '@dish/helpers'
import { HistoryItem } from '@dish/router'
import { Store, createStore, useStoreInstance } from '@dish/use-store'
import _, { clamp, findLast, isPlainObject } from 'lodash'
import { Keyboard } from 'react-native'

import { initialHomeState } from '../constants/initialHomeState'
import { tagLenses } from '../constants/localTags'
import { allTags } from '../helpers/allTags'
import { getActiveTags } from '../helpers/getActiveTags'
import { getBreadcrumbs, isBreadcrumbState } from '../helpers/getBreadcrumbs'
import { getNextState } from '../helpers/getNextState'
import { getShouldNavigate } from '../helpers/getShouldNavigate'
import { getTagSlug } from '../helpers/getTagSlug'
import { isHomeState, isSearchState } from '../helpers/homeStateHelpers'
import { isSearchBarTag } from '../helpers/isSearchBarTag'
import { syncStateToRoute } from '../helpers/syncStateToRoute'
import { router } from '../router'
import {
  HomeStateItem,
  HomeStateItemHome,
  HomeStateItemSearch,
  HomeStateNav,
  HomeStateTagNavigable,
} from '../types/homeTypes'
import { NavigableTag } from '../types/tagTypes'
import { appMapStore } from './AppMapStore'

class HomeStore extends Store {
  showUserMenu = false
  searchBarTagIndex = 0
  isOptimisticUpdating = false
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
    return findLast(this.states, (x) => isSearchState(x) || isHomeState(x))
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
    return this.currentState.searchQuery
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
    const lastTaggable = _.findLast(
      this.states,
      (x) => isHomeState(x) || isSearchState(x)
    ) as HomeStateItemSearch | HomeStateItemHome
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

  setLoading(n: boolean) {
    this.loading = n
  }

  private getUpType = () => {
    const curType = this.currentState.type
    const crumbs = this.breadcrumbs
    if (!isBreadcrumbState(curType)) {
      return _.last(crumbs)?.type
    }
    return findLast(crumbs, (x) => x.type !== curType)?.type ?? 'home'
  }

  up() {
    this.popTo(this.getUpType())
  }

  popBack() {
    const cur = this.currentState
    const next = findLast(this.states, (x) => x.type !== cur.type)
    this.popTo(next?.type ?? 'home')
  }

  popTo(type: HomeStateItem['type']) {
    const currentState = this.currentState
    if (currentState.type === 'home') {
      return
    }

    // we can just use router history directly, no? and go back?
    const lastRouterName = router.prevHistory?.name
    const lastRouterType = normalizeItemName[lastRouterName] ?? lastRouterName
    if (
      this.previousState?.type === type &&
      lastRouterType === type &&
      router.curPage?.type !== 'pop'
    ) {
      console.warn('go back')
      router.back()
      return
    }

    const states = this.states
    const prevStates = states.slice(0, states.length - 1)
    const stateItem = _.findLast(prevStates, (x) => x.type === type)
    const routerItem =
      router.history.find((x) => x.id === stateItem?.id) ??
      _.findLast(router.history, (x) => x.name === type)
    const homeRegionParams = {
      region:
        stateItem?.['region'] ??
        this.lastHomeState.region ??
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

  updateHomeState(via: string, val: { id: string; [key: string]: any }) {
    if (!val.id) {
      throw new Error(`Must have id`)
    }
    const state = this.allStates[val.id]

    if (state) {
      if (val.type && state.type !== val.type) {
        throw new Error(`Cant change the type`)
      }
      this.allStates = {
        ...this.allStates,
        [val.id]: { ...state, ...val },
      }
    } else {
      // @ts-expect-error
      this.allStates = {
        ...this.allStates,
        [val.id]: { ...val },
      }
      // cleanup old from backward
      const stateIds = this.stateIds
      const lastIndex = stateIds.length - 1
      if (lastIndex > this.stateIndex) {
        this.stateIds = stateIds.slice(0, this.stateIndex + 1)
      }
      this.stateIds = [...new Set([...stateIds, val.id])]
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

  pushHomeState(item: HistoryItem) {
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

      case 'list': {
        nextState = {
          slug: item.params.slug,
          userSlug: item.params.userSlug,
          state: item.params.state,
        }
        break
      }

      case 'userEdit':
      case 'about': {
        break
      }

      case 'search': {
        const prev = findLastHomeOrSearch(this.states)
        if (!prev) {
          throw new Error('unreachable')
        }
        nextState = {
          type: 'search',
          region: router.curPage.params.region ?? prev.region,
          activeTags: prev.activeTags ?? {},
          center: appMapStore.position.center,
          span: appMapStore.position.span,
        }
        break
      }

      // restaurant
      case 'restaurant': {
        const prev = this.states[this.states.length - 1]
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
      curLocName: currentState?.curLocName,
      curLocInfo: currentState?.curLocInfo,
      center: currentState?.center,
      span: currentState?.span,
      searchQuery,
      type,
      ...nextState,
      id: item.id ?? uid(),
    } as HomeStateItem

    this.updateHomeState('pushHomeState', finalState)
    return null
  }

  async handleRouteChange(item: HistoryItem) {
    // happens on *any* route push or pop
    if (appMapStore.hovered) {
      appMapStore.setHovered(null)
    }

    if (item.type === 'pop') {
      const curIndex = this.stateIndex
      const total = this.states.length
      switch (item.direction) {
        case 'forward': {
          this.stateIndex = Math.min(total, curIndex + 1)
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
        case 'list':
        case 'user':
        case 'userEdit':
        case 'gallery':
        case 'restaurantReview':
        case 'restaurantHours':
        case 'restaurant': {
          const prevState = findLast(this.states, (x) => x.type === name)
          const res = await this.pushHomeState({
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

  setSearchBarFocusedTag(val: NavigableTag | null) {
    if (!val) {
      this.searchBarTagIndex = 0
      return
    }
    const tags = this.searchBarTags
    const tagIndex = tags.findIndex((x) => getTagSlug(x) === getTagSlug(val))
    console.warn('todo comented out')
    // this.autocompleteIndex = -tags.length + tagIndex
  }

  updateActiveTags(next: HomeStateTagNavigable) {
    const state = _.findLast(
      this.states,
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
        id: this.currentState.id,
      }
      this.updateHomeState('homeStore.updateActiveTags', nextState)
    } catch (err) {
      handleAssertionError(err)
    }
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
          [getTagSlug(tag)]: false,
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
  lastNav = Date.now()

  getShouldNavigate({ state, ...rest }: HomeStateNav) {
    const navState = { state: state ?? this.currentState, ...rest }
    const nextState = getNextState(navState)
    return getShouldNavigate(nextState)
  }

  async navigate({ state, ...rest }: HomeStateNav) {
    const navState = { state: state ?? this.currentState, ...rest }
    const nextState = getNextState(navState)
    const curState = this.currentState
    const updateTags = () => {
      const type = curState.type as any
      this.updateActiveTags({
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

    this.lastNav = Date.now()
    let curNav = this.lastNav
    this.isOptimisticUpdating = false

    // do a quick update first
    const curType = curState.type
    const nextType = nextState.type
    if (
      nextType !== curType ||
      (isSearchState(curState) && nextType === 'search')
    ) {
      this.isOptimisticUpdating = true
      // optimistic update active tags
      updateTags()
      await sleep(20)
      await idle(30)
      if (curNav !== this.lastNav) return false
      this.isOptimisticUpdating = false
    }

    const didNav = await syncStateToRoute(nextState)
    if (curNav !== this.lastNav) return false
    this.updateActiveTags(nextState)
    return didNav
  }

  moveSearchBarTagIndex(val: number) {
    this.setSearchBarTagIndex(this.searchBarTagIndex + val)
  }

  setSearchBarTagIndex(val: number) {
    this.searchBarTagIndex = clamp(val, -this.searchBarTags.length, 0)
  }

  updateCurrentState(via: string, val: Partial<Omit<HomeStateItem, 'type'>>) {
    this.updateHomeState(`updateCurrentState(${via})`, {
      id: this.currentState.id,
      ...val,
    })
  }
}

export const homeStore = createStore(HomeStore)

export const useHomeStore = (debug?: boolean): HomeStore => {
  // @ts-ignore
  return useStoreInstance(homeStore, undefined, debug)
}

const normalizeItemName = {
  homeRegion: 'home',
}

const uid = () => `${Math.random()}`.replace('.', '')

export const findLastHomeOrSearch = (states: HomeStateItem[]) => {
  const prev: HomeStateItemHome | HomeStateItemSearch = _.findLast(
    states,
    (x) => isHomeState(x) || isSearchState(x)
  ) as any
  return prev
}
