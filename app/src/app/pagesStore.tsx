import { Store, createStore } from '@tamagui/use-store'

class PagesStore extends Store {
  refreshVersion = 0

  refresh() {
    this.refreshVersion = Math.random()
  }
}

export const pagesStore = createStore(PagesStore)
