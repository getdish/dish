import { Store, createStore } from '@dish/use-store'
import { Animated } from 'react-native'

import { isWeb } from '../constants/constants'
import { getWindowHeight } from '../helpers/getWindow'
import { autocompletesStore } from './AutocompletesStore'

class DrawerStore extends Store {
  snapPoints = [isWeb ? 0.02 : 0.05, 0.28, 0.8]
  // 0 = top, 1 = middle, 2 = bottom
  snapIndex = 1
  isDragging = false
  pan = new Animated.Value(this.getSnapPointOffset())
  spring: Animated.CompositeAnimation | null = null
  lastSnapAt = Date.now()

  get snapIndexName() {
    return this.snapIndex === 0 ? 'top' : this.snapIndex === 2 ? 'bottom' : 'middle'
  }

  get currentSnapPoint() {
    return this.snapPoints[this.snapIndex]
  }

  get currentSnapPx() {
    return this.currentSnapPoint * getWindowHeight()
  }

  get currentHeight() {
    return getWindowHeight() - this.currentSnapPx
  }

  get currentMapHeight() {
    // todo this can just be this.currentSnapPx
    return getWindowHeight() - this.currentHeight
  }

  get snapIndices() {
    return this.snapPoints.map((_, i) => this.getSnapPointOffset(i))
  }

  get snapPointIgnoringFullyOpen() {
    return this.snapPoints[Math.max(1, this.snapIndex)]
  }

  get heightIgnoringFullyOpen() {
    return getWindowHeight() - this.snapPointIgnoringFullyOpen * getWindowHeight()
  }

  setIsDragging(val: boolean) {
    this.isDragging = val
    this.spring?.stop()
  }

  setSnapIndex(point: number) {
    if (this.isDragging) {
      console.log('AVOID SNAP WHILE DRAGGING')
      return
    }
    this.snapIndex = point
    this.animateDrawerToPx(this.getSnapPointOffset(), 4, true)
  }

  animateDrawerToPx(
    px: number = this.getSnapPointOffset(),
    velocity: number = 0,
    avoidSnap = false
  ) {
    if (this.isDragging) {
      console.log('AVOID SNAP WHILE DRAGGING')
      return
    }
    this.lastSnapAt = Date.now()
    // this.isDragging = true
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
    const direction = velocity > 0 ? 'down' : 'up'
    const estFinalPx = px + velocity * 5
    for (const [index, point] of this.snapPoints.entries()) {
      const cur = point * getWindowHeight()
      const next = (this.snapPoints[index + 1] ?? 1) * getWindowHeight()
      const halfDif = next - cur
      const partWayThere = cur + halfDif * (direction === 'up' ? 0.66 : 0.33)
      console.log('get snap index', cur, next, halfDif, partWayThere, estFinalPx < partWayThere)
      if (estFinalPx < partWayThere) {
        return index
      }
    }
    return 2
  }
}

export const drawerStore = createStore(DrawerStore)
