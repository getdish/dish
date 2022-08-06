import { getWindowHeight } from '../helpers/getWindow'
import { autocompletesStore } from './AutocompletesStore'
import { Store, createStore } from '@dish/use-store'
import { Animated } from 'react-native'

const positionNames = ['bottom', 'middle', 'top'] as const

class DrawerStore extends Store {
  snapPoints = [0.18, 0.5, 0.95] // bottom, middle, top
  snapIndex = 1
  isDragging = false
  spring: Animated.CompositeAnimation | null = null
  private lastSnapAt = Date.now()

  private getHeightAt(index = this.snapIndex) {
    return this.snapPoints[index] * getWindowHeight()
  }

  get snapIndexName() {
    return positionNames[this.snapIndex]
  }

  get currentPosition() {
    return this.snapPoints[this.snapIndex]
  }

  get heights() {
    return this.snapPoints.map((_, i) => this.getHeightAt(i))
  }

  get height() {
    return getWindowHeight() * this.currentPosition
  }

  get mapHeight() {
    return getWindowHeight() - this.height
  }

  setSnapIndex(point: number) {
    this.snapIndex = point
    this.lastSnapAt = Date.now()
  }

  toggleDrawerPosition() {
    // when you release from drag it calls this
    // but in general if you *just* snapped, don't snap again
    if (Date.now() - this.lastSnapAt < 100) {
      console.log('avoid snap, just snapped')
      return
    }

    if (this.snapIndex === 0) {
      autocompletesStore.setVisible(false)
      this.setSnapIndex(1)
    } else if (this.snapIndex === 1) {
      this.setSnapIndex(2)
    } else if (this.snapIndex === 2) {
      this.setSnapIndex(1)
    }
  }
}

export const drawerStore = createStore(DrawerStore)
