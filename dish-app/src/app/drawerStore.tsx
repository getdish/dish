import { Store, createStore } from '@dish/use-store'
import { Animated } from 'react-native'

import { isWeb } from '../constants/constants'
import { getWindowHeight } from '../helpers/getWindow'
import { autocompletesStore } from './AutocompletesStore'

type DrawerSnapPoint = 'bottom' | 'middle' | 'top'

class DrawerStore extends Store {
  // 0 = top, 1 = middle, 2 = bottom
  snapPoints = [isWeb ? 0.02 : 0.05, 0.28, 0.8]
  snapIndex = 1
  isDragging = false
  pan = new Animated.Value(this.getSnapPointOffset())
  spring: Animated.CompositeAnimation | null = null
  lastSnapAt = Date.now()

  get snapIndexName(): DrawerSnapPoint {
    return this.snapIndex === 0 ? 'top' : this.snapIndex === 2 ? 'bottom' : 'middle'
  }

  get minY(): number {
    return this.snapHeights[0]
  }

  get maxY(): number {
    return this.snapHeights[2]
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

  get snapHeights() {
    return this.snapPoints.map((_, i) => this.getSnapPointOffset(i))
  }

  get snapPointIgnoringFullyOpen() {
    return this.snapPoints[Math.max(1, this.snapIndex)]
  }

  get heightIgnoringFullyOpen() {
    return getWindowHeight() - this.snapPointIgnoringFullyOpen * getWindowHeight()
  }

  setIsDragging(val: boolean) {
    if (this.isDragging === val) {
      return
    }
    this.isDragging = val
    // if (val === false) {
    //   this.finishSpring()
    // }
  }

  setSnapIndex(point: number) {
    this.snapIndex = point
    this.animateDrawerToPx(this.getSnapPointOffset(), 4, true)
  }

  animateDrawerToPx(
    px: number = this.getSnapPointOffset(),
    velocity: number = 0,
    avoidSnap = false
  ) {
    this.lastSnapAt = Date.now()
    this.isDragging = false
    if (!avoidSnap) {
      this.snapIndex = this.getSnapIndex(px, velocity)
    }
    const toValue = this.getSnapPointOffset()
    const y = this.pan['_value']
    const distanceToTravel = y > toValue ? y - toValue : toValue - y
    // you want to make it slower the longer the distance it has to travel to account for spring
    // lets first normalize to 0.1-1
    const distanceNormalized = Math.max(0.1, Math.min(1, distanceToTravel / 150))
    // now lets make further = slower
    const distanceSpeed = 1 / distanceNormalized
    const speed = Math.max(0.1, Math.abs(velocity) * distanceSpeed)
    console.log('animating to', toValue)
    this.springId = Math.random()
    const curId = this.springId
    this.spring = Animated.spring(this.pan, {
      useNativeDriver: true,
      stiffness: speed * 135,
      damping: speed * 14,
      mass: speed * 0.75,
      toValue,
    })
    this.toValue = toValue
    // may be able to avoid a lot of stuff here by just not .stop() in finishSpring unless explicitly starting again?
    this.spring.start(() => {
      if (curId == this.springId) {
        this.finishSpring()
      }
    })
  }

  private springId = 0
  private toValue = 0
  private finishSpring() {
    this.isDragging = false
    this.pan.flattenOffset()
    this.pan.setValue(this.toValue)
    this.spring?.stop()
    this.spring = null
  }

  private getSnapIndex(px: number, velocity: number) {
    const isNonTouchSnap = velocity === 0
    const direction = isNonTouchSnap
      ? px > this.currentSnapPx
        ? 'down'
        : 'up'
      : velocity > 0
      ? 'down'
      : 'up'
    const estFinalPx = px + velocity * 5
    console.log({ direction, estFinalPx })
    for (const [index, point] of this.snapPoints.entries()) {
      const cur = point * getWindowHeight()
      const next = (this.snapPoints[index + 1] ?? 1) * getWindowHeight()
      const halfDif = next - cur
      const partWayThere = cur + halfDif * (direction === 'up' ? 0.66 : 0.33)
      if (estFinalPx < partWayThere) {
        return index
      }
    }
    return 2
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
}

export const drawerStore = createStore(DrawerStore)
