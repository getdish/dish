import { isSafari } from '@dish/helpers'
import { Store, createStore } from '@dish/use-store'
import { Animated } from 'react-native'

import { isWeb } from '../constants/constants'
import { getWindowHeight } from '../helpers/getWindow'
import { autocompletesStore } from './AutocompletesStore'
import { InputStore } from './inputStore'
import { ScrollStore } from './views/ContentScrollView'

type DrawerSnapPoint = 'bottom' | 'middle' | 'top'

class DrawerStore extends Store {
  // 0 = top, 1 = middle, 2 = bottom
  snapPoints = [isWeb ? 0.02 : 0.05, 0.28, 0.8]
  snapIndex = 1
  isDragging = false
  spring: Animated.CompositeAnimation | null = null
  toValue = 0
  pan = new Animated.Value(this.getSnapPointOffset())
  private lastSnapAt = Date.now()
  private springId = 0

  get snapIndexName(): DrawerSnapPoint {
    return this.snapIndex === 0 ? 'top' : this.snapIndex === 2 ? 'bottom' : 'middle'
  }

  get minY(): number {
    return this.snapHeights[0]
  }

  get maxY(): number {
    return this.snapHeights[2]
  }

  get isAtTop() {
    return this.y <= this.minY
  }

  get y() {
    return this.toValue
  }

  _setY(y: number) {
    this.toValue = y
    this.pan.setValue(y)
  }

  get currentSnapPoint() {
    return this.snapPoints[this.snapIndex]
  }

  get currentSnapPx() {
    return this.currentSnapPoint * getWindowHeight()
  }

  get currentSnapHeight() {
    return getWindowHeight() - this.currentSnapPx
  }

  get currentMapHeight() {
    // todo this can just be this.currentSnapPx
    return getWindowHeight() - this.currentSnapHeight
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

  setSnapIndex(point: number, animate = true) {
    this.snapIndex = point
    this.lastSnapAt = Date.now()
    this.isDragging = false
    if (animate) {
      this.animateDrawerToPx(this.getSnapPointOffset(), 2, true)
    }
  }

  animateDrawerToPx(
    px: number = this.getSnapPointOffset(),
    velocity: number = 0,
    avoidSnap = false
  ) {
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
    const speed = Math.max(0.01, Math.abs(velocity) * distanceSpeed)
    this.toValue = toValue
    this.springTo(toValue, speed)
  }

  private tm
  springTo(toValue: number, speed = 0.01) {
    clearTimeout(this.tm)
    this.springId = Math.random()
    const curId = this.springId
    this.spring = Animated.spring(this.pan, {
      useNativeDriver: !isWeb,
      stiffness: speed * 220,
      damping: speed * 22.5,
      mass: speed * 1.8,
      toValue,
    })
    // this controls when the input will focus after drawer animation
    // on safari we need to be more careful, it will drop frames and the cursor shows in a weird place
    // but on the other platforms it doesnt seem to have much effect
    this.tm = setTimeout(
      () => {
        this.spring = null
      },
      isSafari ? 380 : 0
    )
    // may be able to avoid a lot of stuff here by just not .stop() in finishSpring unless explicitly starting again?
    this.spring.start(() => {
      if (curId == this.springId) {
        this.finishSpring()
      }
    })
  }

  private finishSpring() {
    this.isDragging = false
    this.pan.flattenOffset()
    this.spring?.stop()
    this.spring = null
  }

  private getSnapIndex(px: number, velocity: number) {
    const isNonTouchSnap = velocity === 0
    const direction = isNonTouchSnap
      ? px < this.currentSnapPx
        ? 'down'
        : 'up'
      : velocity > 0
      ? 'down'
      : 'up'
    const estFinalPx = px + velocity * 5
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
