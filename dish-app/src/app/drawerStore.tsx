import { Store, createStore } from '@dish/use-store'
import { Animated } from 'react-native'

import { isWeb } from '../constants/constants'
import { getWindowHeight } from '../helpers/getWindow'
import { autocompletesStore } from './AutocompletesStore'

class DrawerStore extends Store {
  snapPoints = [isWeb ? 0.02 : 0.05, 0.28, 0.8]
  snapIndex = 1
  isDragging = false
  pan = new Animated.Value(this.getSnapPointOffset())
  spring: Animated.CompositeAnimation | null = null
  lastSnapAt = Date.now()

  get currentSnapPoint() {
    console.log('currentSnapPoint', this.snapPoints[this.snapIndex])
    return this.snapPoints[this.snapIndex]
  }

  get currentHeight() {
    return getWindowHeight() - this.currentSnapPoint * getWindowHeight()
  }

  get currentMapHeight() {
    return getWindowHeight() - this.currentHeight
  }

  get snapIndices() {
    return this.snapPoints.map((_, i) => this.getSnapPointOffset(i))
  }

  get bottomOccludedIgnoreFullyClosed() {
    return getWindowHeight() - getWindowHeight() * this.snapPoints[Math.max(1, this.snapIndex)]
  }

  setIsDragging(val: boolean) {
    this.isDragging = val
    this.spring?.stop()
  }

  setSnapIndex(point: number) {
    this.snapIndex = point
    this.animateDrawerToPx(this.getSnapPointOffset(), 2, true)
  }

  animateDrawerToPx(
    px: number = this.getSnapPointOffset(),
    velocity: number = 0,
    avoidSnap = false
  ) {
    this.lastSnapAt = Date.now()
    this.isDragging = true
    if (!avoidSnap) {
      this.snapIndex = this.getSnapIndex(px, velocity)
    }
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

  private getSnapPointOffset(index = this.snapIndex) {
    return this.snapPoints[index] * getWindowHeight()
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
