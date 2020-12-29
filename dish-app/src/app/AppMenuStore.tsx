import { Store, createStore } from '@dish/use-store'

class AppMenuStore extends Store {
  showMenu = false

  setShowMenu(val: boolean) {
    this.showMenu = val
  }

  hide() {
    this.showMenu = false
  }

  show() {
    this.showMenu = true
  }
}

export const appMenuStore = createStore(AppMenuStore)
