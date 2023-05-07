import { getInitialHomeState } from '../../../constants/initialHomeState'
import { allTags } from '../../../helpers/allTags'
import { getActiveTags } from '../../../helpers/getActiveTags'
import { HomeStateNav } from '../../../types/homeTypes'
import { appMapStore } from '../../appMapStore'
import { homeStore } from '../../homeStore'
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
import { Store, createStore, createUseStore, useGlobalStore } from '@tamagui/use-store'

export type ActiveEvent = 'key' | 'pin' | 'hover' | null

type RunSearchProps = {
  searchQuery?: string
  force?: boolean
}

class SearchPageStore extends Store<{ id: string }> {
  index = -1
  event: ActiveEvent = null
  status: 'loading' | 'complete' = 'loading'
  results: RestaurantSearchItem[] = []
  meta: HomeMeta | null = null
  searchPosition: MapPosition | null = null
  searchRegion = false
  private lastSearchArgs: RestaurantSearchArgs | null = null

  async mount() {
    this.searchPosition = (await getInitialHomeState()).initialPosition
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
    appMapStore.setPositionToNextPosition()
    homeStore.updateHomeState(`SearchPage.refresh`, {
      id: this.props.id,
      // set new position span before refreshing search
      center: appMapStore.nextPosition.center,
      span: appMapStore.nextPosition.span,
    })
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
  }: RunSearchProps) {
    const wasSearching = this.isSearching
    const state = homeStore.lastHomeOrSearchState
    if (!state) {
      console.log('no search state')
      return
    }
    const tags = state ? getActiveTags(state) : []
    const center = appMapStore.position.center
    const span = appMapStore.position.span
    const dishSearchedTag = tags.find((k) => allTags[k.slug!]?.type === 'dish')?.slug
    const otherTags = tags
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
      if (fail && process.env.NODE_ENV === 'development') {
        console.warn('cancelling search')
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
      this.results = []
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

export const runSearch = (props: RunSearchProps) => {
  current.runSearch(props)
}
