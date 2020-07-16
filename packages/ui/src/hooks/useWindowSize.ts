import * as _ from 'lodash'
import { useEffect, useState } from 'react'

import { useForceUpdate } from './useForceUpdate'

/** [width, height] */
type Size = [number, number]

const idFn = (_) => _
const getWindowSize = (): Size => [window.innerWidth, window.innerHeight]

class WindowSizeStore {
  listeners = new Set<Function>()
  size = getWindowSize()

  constructor() {
    window.addEventListener('resize', this.update)
  }

  update = _.throttle(() => {
    this.size = getWindowSize()
    this.listeners.forEach((x) => x())
  }, 350)
}

let store: any | null = null

export function useWindowSize({
  adjust = idFn,
}: {
  adjust?: (x: Size) => Size
} = {}): Size {
  store = store || new WindowSizeStore()
  const size = store.size
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    store.listeners.add(forceUpdate)
    return () => {
      store.listeners.delete(forceUpdate)
    }
  }, [adjust])

  return adjust(size)
}
