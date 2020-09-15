import { Store } from '@dish/use-store'
import { debounce } from 'lodash'
import { Animated } from 'react-native'

import { getWindowHeight } from '../../helpers/getWindow'
import { omStatic } from '../../state/omStatic'

export class BottomDrawerStore extends Store {
  snapPoints = [0.03, 0.25, 0.6]
  snapIndex = 1
  pan = new Animated.Value(this.getSnapPoint())
  spring: any

  get currentSnapPoint() {
    return this.snapPoints[this.snapIndex]
  }

  setSnapPoint(point: number) {
    this.updateSnapIndex(point)
    this.animateDrawerToPx()
  }

  animateDrawerToPx(px?: number) {
    this.spring = Animated.spring(this.pan, {
      useNativeDriver: true,
      toValue: this.getSnapPoint(typeof px === 'number' ? px : undefined),
    })
    this.spring.start(() => {
      this.spring = null
    })
  }

  getSnapPoint(px?: number) {
    if (typeof px === 'number') {
      // weird here
      this.checkUpdateSnapIndex(px)
    }
    return this.snapPoints[this.snapIndex] * getWindowHeight()
  }

  private setDrawer = debounce(
    (val) => omStatic.actions.home.setDrawerSnapPoint(val),
    100
  )

  private updateSnapIndex(x: number) {
    this.snapIndex = x
    this.setDrawer(x)
  }

  private checkUpdateSnapIndex(px: number) {
    for (const [index, point] of this.snapPoints.entries()) {
      const cur = point * getWindowHeight()
      const next = (this.snapPoints[index + 1] ?? 1) * getWindowHeight()
      const midWayToNext = cur + (next - cur) / 2
      if (px < midWayToNext) {
        this.updateSnapIndex(index)
        return
      }
    }
    this.updateSnapIndex(0)
  }
}
