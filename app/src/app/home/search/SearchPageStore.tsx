import { fullyIdle, sleep } from '@dish/async'
import { isEqual } from '@dish/fast-compare'
import {
  HomeMeta,
  LngLat,
  MapPosition,
  RestaurantSearchArgs,
  RestaurantSearchItem,
  search,
} from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { Store, createStore, createUseStore, useStoreInstance } from '@dish/use-store'

import { initialPosition } from '../../../constants/initialHomeState'
import { allTags } from '../../../helpers/allTags'
import { getActiveTags } from '../../../helpers/getActiveTags'
import { HomeStateNav } from '../../../types/homeTypes'
import { appMapStore } from '../../AppMap'
import { homeStore } from '../../homeStore'

export type ActiveEvent = 'key' | 'pin' | 'hover' | null

class SearchPageStore extends Store<{ id: string }> {
  index = -1
  event: ActiveEvent = null
  status: 'loading' | 'complete' = 'loading'
  results: RestaurantSearchItem[] = []
  meta: HomeMeta | null = null
  searchPosition = initialPosition
  searchRegion = false
  children = null
  private lastSearchArgs: RestaurantSearchArgs | null = null

  setChildren(next: any) {
    this.children = next
  }

  setIndex(index: number, event: ActiveEvent) {
    this.index = Math.min(Math.max(-1, index), this.max)
    this.event = event
  }

  setSearchRegion(val: boolean) {
    this.searchRegion = val
  }

  toggleSearchRegion() {
    this.setSearchRegion(!this.searchRegion)
    this.runSearch({})
  }

  get max() {
    return this.results.length
  }

  refresh() {
    this.results = []
    this.runSearch({ force: true })
  }

  resetResults() {
    this.results = []
    this.status = 'loading'
  }

  private isSearching = false

  async runSearch({
    searchQuery = homeStore.lastHomeOrSearchState?.searchQuery ?? '',
    force,
  }: {
    searchQuery?: string
    force?: boolean
  }) {
    const wasSearching = this.isSearching
    const state = homeStore.lastHomeOrSearchState
    if (!state) {
      console.log('no search state')
      return
    }
    const tags = state ? getActiveTags(state) : []
    const center = appMapStore.nextPosition.center
    const span = appMapStore.nextPosition.span
    const dishSearchedTag = tags.find((k) => allTags[k.slug!]?.type === 'dish')?.slug
    let otherTags = tags
      .map((tag) => tag.slug?.replace('lenses__', '').replace('filters__', '') ?? '')
      .filter((t) => (dishSearchedTag ? !t.includes(dishSearchedTag) : true))
    const mainTag = dishSearchedTag ?? otherTags[0]

    const nextSearchArgs = {
      center: roundLngLat(center),
      span: roundLngLat(span),
      query: state.searchQuery,
      tags: otherTags,
      main_tag: mainTag,
    }

    if (!force && isEqual(nextSearchArgs, this.lastSearchArgs)) {
      console.warn('no change')
      return
    }

    this.lastSearchArgs = nextSearchArgs
    this.isSearching = true
    this.status = 'loading'

    const shouldCancel = () => {
      const fail = !isEqual(this.lastSearchArgs, nextSearchArgs)
      if (homeStore.currentStateType !== 'search') {
        console.warn('not right type?')
        return
      }
      if (process.env.NODE_ENV === 'development') {
        if (fail) console.warn('cancelling search')
      }
      if (fail) {
        this.isSearching = false
      }
      return fail
    }

    // prevent searching back to back quickly
    if (!force) {
      await sleep(wasSearching ? 120 : 20)
      await fullyIdle({ checks: 2, max: 40 })
      if (shouldCancel()) return
    }

    const navItem: HomeStateNav = {
      state: {
        ...homeStore.lastHomeOrSearchState,
        searchQuery,
      },
    }

    if (await homeStore.navigate(navItem)) {
      console.log('did nav from search', navItem)
      // nav will trigger search
      return
    }

    console.log('🔦🔦  search', nextSearchArgs, tags, mainTag)
    const res = await search(nextSearchArgs)
    console.log('search res', res)
    if (shouldCancel()) return
    if (!res) {
      console.log('no res', res)
      this.status = 'complete'
      return
    }
    // only update searchkey once finished
    this.results = (res.restaurants ?? []).filter(isPresent).slice(0, 80)
    this.meta = res.meta
    this.isSearching = false
    this.status = 'complete'
    // set this at very end of search
    this.searchPosition = {
      center: appMapStore.nextPosition.center,
      span: appMapStore.nextPosition.span,
    }
    return {
      center,
      span,
    }
  }

  setSearchPosition(pos: MapPosition) {
    this.searchPosition = pos
  }
}

// export const searchPageStore = createStore(SearchPageStore)
export const useSearchPageStore = createUseStore(SearchPageStore)

// used to help prevent duplicate searches on slight diff in map move
const roundLngLat = (val: LngLat): LngLat => {
  // 4 decimal precision is good to a few meters
  return {
    lng: Math.round(val.lng * 100000) / 100000,
    lat: Math.round(val.lat * 100000) / 100000,
  }
}

const initial = createStore(SearchPageStore, { id: '000' })
let current = initial

export function setStore(next: SearchPageStore) {
  current = next
}

export function getSearchPageStore() {
  return current
}

export function resetResults() {
  current.resetResults()
}
