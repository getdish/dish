import { Store } from '@dish/use-store'
import { debounce } from 'lodash'
import { Animated } from 'react-native'

import { isWeb } from '../../constants'
import { getWindowHeight } from '../../helpers/getWindow'
import { omStatic } from '../../state/omStatic'

export class BottomDrawerStore extends Store {
  snapPoints = [isWeb ? 0.02 : 0.05, 0.25, 0.75]
  snapIndex = 1
  pan = new Animated.Value(this.getSnapPointOffset())
  spring: any

  get currentSnapPoint() {
    return this.snapPoints[this.snapIndex]
  }

  setSnapPoint(point: number) {
    this.setSnapIndex(point)
    this.animateDrawerToPx()
  }

  animateDrawerToPx(px: number = this.getSnapPointOffset(), velocity?: number) {
    this.snapIndex = this.getSnapIndex(px)
    console.log('animating to', px)
    this.spring = Animated.spring(this.pan, {
      useNativeDriver: true,
      velocity: velocity ?? 0,
      toValue: px,
    })
    this.spring.start(() => {
      this.spring = null
    })
  }

  private getSnapPointOffset() {
    return this.snapPoints[this.snapIndex] * getWindowHeight()
  }

  private setSnapIndex(x: number) {
    this.snapIndex = x
    omStatic.actions.home.setDrawerSnapPoint(x)
  }

  private getSnapIndex(px: number) {
    for (const [index, point] of this.snapPoints.entries()) {
      const cur = point * getWindowHeight()
      const next = (this.snapPoints[index + 1] ?? 1) * getWindowHeight()
      const midWayToNext = cur + (next - cur) / 2
      if (px < midWayToNext) {
        return index
      }
    }
    return 2
  }
}
