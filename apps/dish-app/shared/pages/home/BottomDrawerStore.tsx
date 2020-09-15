import { Store } from '@dish/use-store'
import { debounce } from 'lodash'
import { Animated } from 'react-native'

import { isWeb } from '../../constants'
import { getWindowHeight } from '../../helpers/getWindow'
import { omStatic } from '../../state/omStatic'

export class BottomDrawerStore extends Store {
  snapPoints = [isWeb ? 0.02 : 0.05, 0.25, 0.75]
  snapIndex = 1
  pan = new Animated.Value(this.getSnapPoint())
  spring: any

  get currentSnapPoint() {
    return this.snapPoints[this.snapIndex]
  }

  setSnapPoint(point: number) {
    this.setSnapIndex(point)
    this.animateDrawerToPx()
  }

  animateDrawerToPx(px?: number, velocity?: number) {
    this.snapIndex = this.getSnapIndex(px)
    const toValue = this.getSnapPoint()
    this.spring = Animated.spring(this.pan, {
      useNativeDriver: true,
      velocity: velocity ?? 1,
      toValue,
    })
    this.spring.start(() => {
      this.spring = null
    })
  }

  getSnapPoint() {
    return this.snapPoints[this.snapIndex] * getWindowHeight()
  }

  private setDrawer = debounce(
    (val) => omStatic.actions.home.setDrawerSnapPoint(val),
    100
  )

  private setSnapIndex(x: number) {
    this.snapIndex = x
    this.setDrawer(x)
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
