import { Store, createStore } from '@tamagui/use-store'

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

  toggle() {
    this.isVisible = !this.isVisible
  }
}

export const appMenuStore = createStore(AppMenuStore)
