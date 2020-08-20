import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import * as React from 'react'

import { Store, TRIGGER_UPDATE } from './Store'

// @ts-ignore
const createMutableSource = React.unstable_createMutableSource
// @ts-ignore
const useMutableSource = React.unstable_useMutableSource

export * from './Store'

type StoreInfo = {
  source: any
  hasMounted: boolean
  storeInstance: any
  getters: { [key: string]: any }
  actions: any
  version: number
}

const uniqueStoreNames = new Set<string>()
const cache = new WeakMap<any, { [key: string]: StoreInfo }>()

export function useStore<A extends Store<B>, B, Selector extends Function>(
  StoreKlass: new (props: B) => A | (new () => A),
  props?: B,
  selector?: (x: any) => any
): Selector extends (x: any) => infer B ? B : A {
  const storeName = StoreKlass.name
  const propsKey = props ? getKey(props) : ''
  const cached = cache.get(StoreKlass)
  const uid = `${storeName}_${propsKey}_`

  // ensure unique name
  if (!cached) {
    if (uniqueStoreNames.has(storeName)) {
      throw new Error(`Store name already used`)
    }
    uniqueStoreNames.add(storeName)
  }

  // avoid work after init
  const info = cached?.[uid]
  if (info) {
    return useStoreInstance(info, selector)
  }

  // init
  const storeInstance = new StoreKlass(props!)
  const getters = {}
  const actions = {}

  const descriptors = getStoreDescriptors(storeInstance)
  for (const key in descriptors) {
    const descriptor = descriptors[key]
    if (typeof descriptor.value === 'function') {
      // actions
      actions[key] = descriptor.value
    } else if (typeof descriptor.get === 'function') {
      getters[key] = descriptor.get
    } else {
      // state
    }
  }

  if (!cache.get(StoreKlass)) {
    cache.set(StoreKlass, {})
  }
  const propCache = cache.get(StoreKlass)!
  const value: StoreInfo = {
    hasMounted: false,
    version: 0,
    storeInstance,
    getters,
    actions,
    source: createMutableSource(storeInstance, () => value.version),
  }
  propCache[uid] = value
  return useStoreInstance(value, selector)
}

const subscribe = (store: Store, callback: Function) =>
  store.subscribe(callback)

const selectKeys = (obj: any, keys: string[] = []) => {
  const res = {}
  for (const key of keys) {
    res[key] = obj[key]
  }
  return res
}

function useStoreInstance(
  info: StoreInfo,
  userSelector?: (x: any) => any
): any {
  const internal = useRef({
    isRendering: false,
    tracked: new Set<string>(),
  })
  const selector = userSelector ?? selectKeys
  const getSnapshot = useCallback(
    (store) => {
      // console.log('returning snapshot', store, internal.current.tracked)
      return selector(store, [...internal.current.tracked])
    }, // can use selector here
    [selector]
  )
  const state = useMutableSource(info.source, getSnapshot, subscribe)
  const curState = useRef(state)

  // mount
  useLayoutEffect(() => {
    storeProxy.mount()
    return () => {}
  }, [])

  // after render
  useLayoutEffect(() => {
    curState.current = state
    internal.current.isRendering = false
  })

  const storeProxy = useConstant(() => {
    let tm
    const proxiedStore = new Proxy(info.storeInstance, {
      get(target, key) {
        // console.log('getting', key, target[key])
        if (typeof key === 'string') {
          if (info.getters[key]) {
            return info.getters[key].call(proxiedStore)
          }
          if (info.actions[key]) {
            return info.actions[key]
          }
          if (internal.current.isRendering) {
            internal.current.tracked.add(key)
          }
        }
        return Reflect.get(target, key)
      },
      set(target, key, value, receiver) {
        const res = Reflect.set(target, key, value, receiver)
        // console.log('setting', target, key, value, target[key])
        info.version++
        info.storeInstance[TRIGGER_UPDATE]()
        return res
      },
    })
    return proxiedStore
  })

  internal.current.isRendering = true

  return storeProxy
}

function getStoreDescriptors(storeInstance: any) {
  const proto = Object.getPrototypeOf(storeInstance)
  const instanceDescriptors = Object.getOwnPropertyDescriptors(storeInstance)
  const protoDescriptors = Object.getOwnPropertyDescriptors(proto)
  const descriptors = {
    ...protoDescriptors,
    ...instanceDescriptors,
  }
  // @ts-ignore
  delete descriptors.constructor
  return descriptors
}

export function get<A>(
  _: A,
  b?: any
): A extends new (props?: any) => infer B ? B : A {
  return _ as any
}

const getKey = (props: Object) => {
  let s = ''
  const sorted = Object.keys(props).sort()
  for (const key of sorted) {
    s += `${key}-${props[key]}_`
  }
  return s
}

type ResultBox<T> = { v: T }
export default function useConstant<T>(fn: () => T): T {
  const ref = useRef<ResultBox<T>>()
  if (!ref.current) {
    ref.current = { v: fn() }
  }
  return ref.current.v
}
