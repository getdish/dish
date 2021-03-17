import { createStoreContext } from '@o/use-store'

export const HeaderContext = createStoreContext(
  class HeaderStore {
    shown = true
    setShown(next: boolean) {
      this.shown = next
    }
  }
)
