import { createStoreContext } from '@o/use-store'

class SiteStore {
  screenSize = 'large'
  codeCollapsed = false
  maxHeight = null
  showSidebar = false

  windowHeight = window.innerHeight

  toggleSidebar = () => {
    this.showSidebar = !this.showSidebar
  }

  toggleCodeCollapsed = () => {
    this.codeCollapsed = !this.codeCollapsed
  }

  setMaxHeight = (val: any) => {
    this.maxHeight = val
  }

  get sectionHeight() {
    let maxHeight = 1200
    let desiredHeight = this.windowHeight
    // // taller on mobile
    // if (this.screenSize === 'small') {
    //   maxHeight = 950
    // }
    return Math.max(
      // min-height
      1020,
      Math.min(
        desiredHeight,
        // max-height
        maxHeight
      )
    )
  }
}

export const SiteStoreContext = createStoreContext(SiteStore)
export const useSiteStore = SiteStoreContext.useStore
