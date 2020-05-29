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

  update = _.debounce(() => {
    this.size = getWindowSize()
    console.log('go')
    this.listeners.forEach((x) => x())
  }, 350)
}

const store = new WindowSizeStore()

export function useWindowSize({
  debounce = 0,
  adjust = idFn,
}: { debounce?: number; adjust?: (x: Size) => Size } = {}): Size {
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
