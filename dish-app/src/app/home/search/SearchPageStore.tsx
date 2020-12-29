import { fullyIdle } from '@dish/async'
import { LngLat, RestaurantSearchArgs, search } from '@dish/graph'
import { isPresent, stringify } from '@dish/helpers'
import { Store, createStore } from '@dish/use-store'

import { appMapStore } from '../../AppMapStore'
import { allTags } from '../../state/allTags'
import { getActiveTags } from '../../state/getActiveTags'
import { getTagSlug } from '../../../helpers/getTagSlug'
import { om } from '../../state/om'

export type ActiveEvent = 'key' | 'pin' | 'hover' | null

class SearchPageStore extends Store {
  index = -1
  max = 0
  event: ActiveEvent = null

  setIndex(index: number, event: ActiveEvent) {
    this.index = Math.min(Math.max(-1, index), this.max)
    this.event = event
  }

  setMax(n: number) {
    this.max = n
  }

  private lastSearchKey = ''
  private lastSearchAt = Date.now()

  refresh() {
    this.runSearch({ force: true })
  }

  async runSearch(opts: {
    searchQuery?: string
    quiet?: boolean
    force?: boolean
  }) {
    opts = opts || { quiet: false }
    this.lastSearchAt = Date.now()
    let curId = this.lastSearchAt

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
      const answer = !state || this.lastSearchAt != curId
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

    const center = appMapStore.position.center ?? state!.center
    const span = appMapStore.position.span ?? state!.span
    om.actions.home.updateHomeState({
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
}

export const searchPageStore = createStore(SearchPageStore)

// used to help prevent duplicate searches on slight diff in map move
const roundLngLat = (val: LngLat): LngLat => {
  // 4 decimal precision is good to a few meters
  return {
    lng: Math.round(val.lng * 10000) / 10000,
    lat: Math.round(val.lat * 10000) / 10000,
  }
}
