import { idle } from '@dish/async'
import { isEqual } from '@dish/fast-compare'
import { assert, handleAssertionError, stringify } from '@dish/helpers'
import { HistoryItem } from '@dish/router'
import { Store, createStore, useStoreInstance } from '@dish/use-store'
import _, { clamp, findLast } from 'lodash'
import { Keyboard } from 'react-native'

import { initialHomeState } from '../constants/initialHomeState'
import { tagLenses } from '../constants/localTags'
import { addTagsToCache, allTags } from '../helpers/allTags'
import { ensureLenseTag } from '../helpers/ensureLenseTag'
import { getActiveTags } from '../helpers/getActiveTags'
import { getBreadcrumbs, isBreadcrumbState } from '../helpers/getBreadcrumbs'
import { getNextState } from '../helpers/getNextState'
import { getShouldNavigate } from '../helpers/getShouldNavigate'
import { getTagsFromRoute } from '../helpers/getTagsFromRoute'
import { getTagSlug } from '../helpers/getTagSlug'
import { isHomeState, isSearchState } from '../helpers/homeStateHelpers'
import { isSearchBarTag } from '../helpers/isSearchBarTag'
import { reverseGeocode } from '../helpers/reverseGeocode'
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
    return findLast(this.states, (x) => isSearchState(x) || isHomeState(x)) as
      | HomeStateItemSearch
      | HomeStateItemHome
  }

  getLastStateByType<Type extends HomeStateItem['type']>(type: Type) {
    return (findLast(
      this.states,
      (x) => x.type === type
    ) as any) as HomeStatesByType[Type]
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
    const to = this.getUpType()
    if (to) {
      this.popTo(to)
    }
  }

  popBack() {
    const cur = this.currentState
    const next = findLast(this.states, (x) => x.type !== cur.type)
    this.popTo(next?.type ?? 'home')
  }

  get upRoute() {
    const cur = this.currentState
    return this.getUpRouteForType(
      findLast(this.states, (x) => x.type !== cur.type)?.type ?? 'home'
    )
  }

  getIsUpBack(type: HomeStateItem['type']) {
    // we can just use router history directly, no? and go back?
    const lastRouterName = router.prevHistory?.name
    const lastRouterType = normalizeItemName[lastRouterName] ?? lastRouterName
    return (
      this.previousState?.type === type &&
      lastRouterType === type &&
      router.curPage?.type !== 'pop'
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
      region:
        stateItem?.['region'] ??
        this.lastHomeState.region ??
        'ca-san-francisco',
    }
    if (routerItem) {
      return {
        name: type == 'home' ? 'homeRegion' : type,
        params:
          type == 'home'
            ? { ...homeRegionParams, ...routerItem?.params }
            : routerItem?.params,
      } as const
    }
    console.warn('no match')
    return {
      name: 'homeRegion',
      params: homeRegionParams,
    } as const
  }

  popTo(type: HomeStateItem['type']) {
    if (this.getIsUpBack(type)) {
      router.back()
      return
    }
    const n = this.getUpRouteForType(type)
    if (!n) return
    router.navigate(n)
  }

  async updateAreaInfo() {
    const { center, span } = appMapStore.position
    const curLocInfo = await reverseGeocode(center, span)
    if (curLocInfo) {
      const curLocName =
        curLocInfo.fullName ?? curLocInfo.name ?? curLocInfo.country
      const cur = this.currentState
      if (
        !isEqual(cur.curLocInfo, curLocInfo) ||
        !isEqual(cur.curLocName, curLocName)
      ) {
        homeStore.updateCurrentState('appMapStore.updateAreaInfo', {
          curLocInfo,
          curLocName,
        })
      }
    }
  }

  updateHomeState(via: string, val: { id: string; [key: string]: any }) {
    if (!val.id) {
      throw new Error(`Must have id`)
    }
    const state = this.allStates[val.id] ?? null
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
        nextState = {
          type: 'home',
          searchQuery: '',
          activeTags: {},
          region: item.params.region ?? prev?.region,
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
        const prev = findLastHomeOrSearch(this.states)
        if (!prev) {
          throw new Error('unreachable')
        }
        const tags = getTagsFromRoute(router.curPage as HistoryItem<'search'>)
        const activeTags = tags.reduce((acc, cur) => {
          acc[cur.slug!] = true
          return acc
        }, {})

        addTagsToCache(tags)

        nextState = {
          type: 'search',
          region: router.curPage.params.region ?? prev.region,
          activeTags,
        }
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

    return {
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
      return
    }

    // remove future states no longer accessible
    this.stateIds = this.stateIds.slice(0, this.stateIndex + 1)
    const next = this.getHomeState(item)
    if (next) {
      this.updateHomeState('handleRouteChange', next)
    }
  }

  setSearchBarFocusedTag(val: NavigableTag | null) {
    if (!val) {
      this.searchBarTagIndex = 0
      return
    }
    const tags = this.searchBarTags
    const tagIndex = tags.findIndex(
      (x) => getTagSlug(x.slug) === getTagSlug(val.slug)
    )
    console.warn('todo comented out')
    this.searchBarTagIndex = tagIndex
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
        activeTags: ensureLenseTag(next.activeTags),
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
      if (!('activeTags' in curState)) return
      if (!('activeTags' in nextState)) return
      const curActive = curState.activeTags
      const nextActive = nextState.activeTags
      if (isEqual(curActive, nextActive)) {
        return
      }
      this.updateActiveTags({
        id: curState.id,
        type: curState.type,
        searchQuery: nextState.searchQuery,
        activeTags: nextActive,
      })
    }

    const shouldNav = getShouldNavigate(nextState)
    if (!shouldNav) {
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

const normalizeItemName = {
  homeRegion: 'home',
}

export const homeStore = createStore(HomeStore)

export const useHomeStore = (debug?: boolean): HomeStore => {
  // @ts-ignore
  return useStoreInstance(homeStore, undefined, [], debug)
}

export const useLastHomeState = <Type extends HomeStateItem['type']>(
  type: Type
) => {
  return useStoreInstance(
    homeStore,
    (x) => _.findLast(x.states, (s) => s.type === type),
    [type]
  )
}

export const useCurrentHomeType = () => {
  return useStoreInstance(homeStore, (x) => x.currentState.type)
}

export const useIsHomeTypeActive = (type?: HomeStateItem['type']) => {
  return useStoreInstance(homeStore, (x) => x.currentState.type === type, [
    type,
  ])
}

export const useHomeStateById = <Type extends HomeStateItem>(id: string) => {
  return useStoreInstance(homeStore, (x) => x.allStates[id], [id]) as Type
}

const uid = () => `${Math.random()}`.replace('.', '')

export const findLastHomeOrSearch = (states: HomeStateItem[]) => {
  const prev: HomeStateItemHome | HomeStateItemSearch = _.findLast(
    states,
    (x) => isHomeState(x) || isSearchState(x)
  ) as any
  return prev
}
