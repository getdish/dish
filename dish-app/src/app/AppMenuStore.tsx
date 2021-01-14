import { Store, createStore } from '@dish/use-store'

class AppMenuStore extends Store {
  isVisible = false

  setIsVisible(val: boolean) {
    this.isVisible = val
  }

  hide() {
    this.isVisible = false
  }

  show() {
    this.isVisible = true
  }
}

export const appMenuStore = createStore(AppMenuStore)
