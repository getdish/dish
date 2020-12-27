import { Store, createStore } from '@dish/use-store'

import { ActiveEvent } from './SearchPage'

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
}

export const searchPageStore = createStore(SearchPageStore)
