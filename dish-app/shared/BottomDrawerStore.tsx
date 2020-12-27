import { Store, createStore } from '@dish/use-store'
import { Animated } from 'react-native'

import { isWeb } from './constants'
import { getWindowHeight } from './helpers/getWindow'

export class DrawerStore extends Store {
  snapPoints = [isWeb ? 0.02 : 0.05, 0.28, 0.75]
  snapIndex = 1
  isDragging = false
  pan = new Animated.Value(this.getSnapPointOffset())
  spring: Animated.CompositeAnimation

  get currentSnapPoint() {
    return this.snapPoints[this.snapIndex]
  }

  get currentHeight() {
    return (
      getWindowHeight() - this.snapPoints[this.snapIndex] * getWindowHeight()
    )
  }

  get snapIndices() {
    return this.snapPoints.map((_, i) => this.getSnapPointOffset(i))
  }

  setIsDragging(val: boolean) {
    this.isDragging = val
    this.spring?.stop()
  }

  setSnapPoint(point: number) {
    this.setSnapIndex(point)
    this.animateDrawerToPx()
  }

  animateDrawerToPx(
    px: number = this.getSnapPointOffset(),
    velocity: number = 0
  ) {
    this.isDragging = true
    this.setSnapIndex(this.getSnapIndex(px, velocity))
    const toValue = this.getSnapPointOffset()
    this.spring = Animated.spring(this.pan, {
      useNativeDriver: true,
      velocity,
      toValue,
    })
    this.spring.start(() => {
      this.isDragging = false
      this.pan.flattenOffset()
      this.pan.setValue(toValue)
      this.spring = null
    })
  }

  private getSnapPointOffset(index = this.snapIndex) {
    return this.snapPoints[index] * getWindowHeight()
  }

  private setSnapIndex(x: number) {
    this.snapIndex = x
  }

  private getSnapIndex(px: number, velocity: number) {
    const estFinalPx = px + velocity * 50
    for (const [index, point] of this.snapPoints.entries()) {
      const cur = point * getWindowHeight()
      const next = (this.snapPoints[index + 1] ?? 1) * getWindowHeight()
      const midWayToNext = cur + (next - cur) / 2
      if (estFinalPx < midWayToNext) {
        return index
      }
    }
    return 2
  }
}

export const drawerStore = createStore(DrawerStore)
