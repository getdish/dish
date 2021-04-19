import { fullyIdle, sleep } from '@dish/async'
import {
  HomeMeta,
  LngLat,
  MapPosition,
  RestaurantSearchArgs,
  RestaurantSearchItem,
  search,
} from '@dish/graph'
import { isPresent, stringify } from '@dish/helpers'
import { Store, createStore, useStoreInstance } from '@dish/use-store'

import { initialPosition } from '../../../constants/initialHomeState'
import { allTags } from '../../../helpers/allTags'
import { getActiveTags } from '../../../helpers/getActiveTags'
import { HomeStateNav } from '../../../types/homeTypes'
import { appMapStore } from '../../AppMapStore'
import { homeStore } from '../../homeStore'

export type ActiveEvent = 'key' | 'pin' | 'hover' | null

class SearchPageStore extends Store {
  index = -1
  event: ActiveEvent = null
  status: 'loading' | 'complete' = 'complete'
  results: RestaurantSearchItem[] = []
  meta: HomeMeta | null = null
  searchPosition = initialPosition
  searchRegion = false
  searchArgs: RestaurantSearchArgs | null = null
  private lastSearchKey = ''
  private lastSearchAt = 0

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
  }

  async runSearch({
    searchQuery = homeStore.lastHomeOrSearchState?.searchQuery ?? '',
    force,
  }: {
    searchQuery?: string
    force?: boolean
  }) {
    const wasSearching = this.lastSearchAt !== 0
    this.lastSearchAt = Date.now()
    this.status = 'loading'
    let curId = this.lastSearchAt

    const shouldCancel = () => {
      const val = this.lastSearchAt != curId || homeStore.currentStateType !== 'search' || false
      if (val) console.log('cancelling')
      return val
    }

    // prevent searching back to back quickly
    if (!force) {
      await sleep(wasSearching ? 250 : 50)
      await fullyIdle({ max: 200 })
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
    const searchArgs: RestaurantSearchArgs = {
      center: roundLngLat(center),
      span: roundLngLat(span),
      query: state!.searchQuery,
      tags: otherTags,
      main_tag: mainTag,
    }
    console.log('search', this.searchArgs, tags, mainTag)

    // prevent duplicate searches
    const searchKey = stringify(this.searchArgs)
    if (force || searchKey !== this.lastSearchKey || !this.results.length) {
      // SEARCH
      this.searchArgs = searchArgs
      const res = await search(searchArgs)
      console.log('search res', res)
      if (shouldCancel()) return
      if (!res) {
        console.log('no res', res)
        this.status = 'complete'
        return
      }
      // only update searchkey once finished
      this.lastSearchKey = searchKey
      this.results = (res.restaurants ?? []).filter(isPresent).slice(0, 80)
      this.meta = res.meta
    } else {
      console.warn('same saerch again?')
    }

    // ok
    this.status = 'complete'
    // set this at very end of search
    const searchedPosition = {
      center: appMapStore.nextPosition.center,
      span: appMapStore.nextPosition.span,
    }
    this.searchPosition = searchedPosition

    // clear it so we can check if any currently running already at start
    if (this.lastSearchAt === curId) {
      this.lastSearchAt = 0
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

export const searchPageStore = createStore(SearchPageStore)
export const useSearchPageStore = (debug?: boolean) => useStoreInstance(searchPageStore, debug)

// used to help prevent duplicate searches on slight diff in map move
const roundLngLat = (val: LngLat): LngLat => {
  // 4 decimal precision is good to a few meters
  return {
    lng: Math.round(val.lng * 100000) / 100000,
    lat: Math.round(val.lat * 100000) / 100000,
  }
}
