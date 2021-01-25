import { fullyIdle } from '@dish/async'
import {
  HomeMeta,
  LngLat,
  RestaurantSearchArgs,
  RestaurantSearchItem,
  search,
} from '@dish/graph'
import { isPresent, stringify } from '@dish/helpers'
import { Store, createStore, useStoreInstance } from '@dish/use-store'

import { allTags } from '../../../helpers/allTags'
import { getActiveTags } from '../../../helpers/getActiveTags'
import { getTagSlug } from '../../../helpers/getTagSlug'
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

  setIndex(index: number, event: ActiveEvent) {
    this.index = Math.min(Math.max(-1, index), this.max)
    this.event = event
  }

  get max() {
    return this.results.length
  }

  private lastSearchKey = ''
  private lastSearchAt = Date.now()

  refresh() {
    this.results = []
    this.runSearch({ force: true })
  }

  resetResults() {
    this.results = []
  }

  async runSearch(opts: {
    searchQuery?: string
    quiet?: boolean
    force?: boolean
  }) {
    opts = opts || { quiet: false }
    this.lastSearchAt = Date.now()
    this.status = 'loading'
    let curId = this.lastSearchAt

    const curState = homeStore.lastSearchState
    const searchQuery = opts.searchQuery ?? curState?.searchQuery ?? ''
    const navItem: HomeStateNav = {
      state: {
        id: '',
        type: 'home',
        ...curState,
        searchQuery,
      },
    }

    if (await homeStore.navigate(navItem)) {
      console.log('did nav from search', navItem)
      // nav will trigger search
      return
    }

    let state = homeStore.lastSearchState
    const tags = curState ? getActiveTags(curState) : []

    const shouldCancel = () => {
      const isntOnSearch = homeStore.currentStateType !== 'search'
      if (isntOnSearch) return true
      const state = homeStore.lastSearchState
      const answer = !state || this.lastSearchAt != curId
      // if (answer) console.log('search: cancel')
      return answer
    }

    if (!opts.force) {
      await fullyIdle()
      if (shouldCancel()) return
    }

    state = homeStore.lastSearchState
    if (shouldCancel()) return
    state = state!

    const center = appMapStore.position.center ?? state!.center
    const span = appMapStore.position.span ?? state!.span
    homeStore.updateHomeState('SearchPageStore.runSearch', {
      id: state.id,
      center,
      span,
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
        .filter((t) => !t.includes(dishSearchedTag ?? '')),
    ]

    const main_tag = dishSearchedTag ?? otherTags[0]
    console.log('main tag', main_tag)
    const searchArgs: RestaurantSearchArgs = {
      center: roundLngLat(center),
      span: roundLngLat(span),
      query: state!.searchQuery,
      tags: otherTags,
      main_tag,
    }

    // prevent duplicate searches
    const searchKey = stringify(searchArgs)
    if (!opts.force && searchKey === this.lastSearchKey) {
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
    this.lastSearchKey = searchKey
    state = homeStore.lastSearchState
    if (!state) return

    this.status = 'complete'
    this.results = restaurants.filter(isPresent).slice(0, 80)
    this.meta = res.meta
  }
}

export const searchPageStore = createStore(SearchPageStore)
export const useSearchPageStore = () => useStoreInstance(searchPageStore)

// used to help prevent duplicate searches on slight diff in map move
const roundLngLat = (val: LngLat): LngLat => {
  // 4 decimal precision is good to a few meters
  return {
    lng: Math.round(val.lng * 10000) / 10000,
    lat: Math.round(val.lat * 10000) / 10000,
  }
}
