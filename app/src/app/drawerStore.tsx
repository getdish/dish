import { getWindowHeight } from '../helpers/getWindow'
import { autocompletesStore } from './AutocompletesStore'
import { Store, createStore } from '@tamagui/use-store'
import { Animated } from 'react-native'
import { SharedValue } from 'react-native-reanimated'

const positionNames = ['bottom', 'middle', 'top'] as const

class DrawerStore extends Store {
  snapPoints = [0.18, 0.5, 0.95] // bottom, middle, top
  snapIndex = 1
  isDragging = false
  spring: Animated.CompositeAnimation | null = null
  position: SharedValue<number> | null = null

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
  }
}

export const drawerStore = createStore(DrawerStore)
