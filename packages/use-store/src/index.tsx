import * as React from 'react'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'

import { DebugComponents, DebugStores, shouldDebug } from './shouldDebug'
import { Store, TRIGGER_UPDATE } from './Store'
import { StoreInfo } from './types'

// sanity check types here
// class StoreTest extends Store<{ id: number }> {}
// const useStoreTest = createUseStore(StoreTest)
// const useStoreSelectorTest = createUseStoreSelector(
//   StoreTest,
//   (s) => s.props.id
// )
// const num = useStoreSelectorTest({ id: 0 })
// const ya = useStoreTest({ id: 1 })
// const yb = useStoreTest({ id: 1 }, (x) => x.props.id)
// const z = useStore(StoreTest)

// @ts-ignore
const createMutableSource = React.unstable_createMutableSource
// @ts-ignore
const useMutableSource = React.unstable_useMutableSource

export * from './Store'

type Selector<A = unknown, B = unknown> = (x: A) => B
export function createUseStore<Props, Store>(
  StoreKlass: new (props: Props) => Store | (new () => Store)
) {
  return function <Res, C extends Selector<Store, Res>>(
    props?: Props,
    selector?: C
    // super hacky workaround for now, ts is unknown to me tbh
  ): C extends Selector<any, infer B> ? (B extends Object ? B : Store) : Store {
    // @ts-ignore
    return useStore(StoreKlass, props, { selector })
  }
}

export function createUseStoreSelector<A extends Store<Props>, Props, Selected>(
  StoreKlass: new (props: Props) => A | (new () => A),
  selector: Selector<A, Selected>
): (props?: Props) => Selected {
  return (props?: Props) => {
    return useStore(StoreKlass, props, { selector }) as any
  }
}

export function useStoreSelector<
  A extends Store<B>,
  B,
  S extends Selector<any, Selected>,
  Selected
>(
  StoreKlass: new (props: B) => A | (new () => A),
  selector: S,
  props?: B
): Selected {
  return useStore(StoreKlass, props, { selector }) as any
}

const cache = new WeakMap<any, { [key: string]: StoreInfo }>()
const defaultOptions = {
  once: false,
  selector: undefined,
}

export function useStoreOnce<A extends Store<B>, B>(
  StoreKlass: new (props: B) => A | (new () => A),
  props?: B,
  selector?: any
): A {
  return useStore(StoreKlass, props, { selector, once: true })
}

export function useStore<A extends Store<B>, B>(
  StoreKlass: new (props: B) => A | (new () => A),
  props?: B,
  options: { selector?: any; once?: boolean } = defaultOptions
): A {
  const cachedSelector = options.selector
    ? useCallback(options.selector, [])
    : undefined

  if (options.once) {
    const info = useMemo(() => createStoreInstance(StoreKlass, props), [
      JSON.stringify(props),
    ])
    return useStoreInstance(info, cachedSelector)
  }

  const storeName = StoreKlass.name
  const propsKey = props ? getKey(props) : ''
  const cached = cache.get(StoreKlass)
  const uid = `${storeName}_${propsKey}_`

  // avoid work after init
  const info = cached?.[uid]
  if (info) {
    return useStoreInstance(info, cachedSelector)
  }

  const value = createStoreInstance(StoreKlass, props)
  if (!cache.get(StoreKlass)) {
    cache.set(StoreKlass, {})
  }
  cache.get(StoreKlass)![uid] = value

  return useStoreInstance(value, cachedSelector)
}

function createStoreInstance(StoreKlass: any, props: any) {
  // init
  const storeInstance = new StoreKlass(props!)
  const getters = {}
  const actions = {}
  const stateKeys: string[] = []
  const descriptors = getStoreDescriptors(storeInstance)
  for (const key in descriptors) {
    const descriptor = descriptors[key]
    if (typeof descriptor.value === 'function') {
      // actions
      actions[key] = descriptor.value
    } else if (typeof descriptor.get === 'function') {
      getters[key] = descriptor.get
    } else {
      if (key !== 'props') {
        stateKeys.push(key)
      }
    }
  }
  const value: StoreInfo = {
    hasMounted: false,
    version: 0,
    storeInstance,
    getters,
    stateKeys,
    actions,
    source: createMutableSource(storeInstance, () => value.version),
  }
  return value
}

const subscribe = (store: Store, callback: Function) =>
  store.subscribe(callback)

const emptyObj = {}
const selectKeys = (obj: any, keys: string[] = []) => {
  if (!keys.length) {
    return emptyObj
  }
  const res = {}
  for (const key of keys) {
    res[key] = obj[key]
  }
  return res
}

function useStoreInstance(info: StoreInfo, userSelector?: Selector<any>): any {
  const internal = useRef({
    isRendering: false,
    tracked: new Set<string>(),
  })
  const component = useCurrentComponent()
  const selector = userSelector ?? selectKeys
  const getSnapshot = useCallback(
    (store) => {
      const selected = selector(store, [...internal.current.tracked])
      if (
        process.env.NODE_ENV === 'development' &&
        shouldDebug(component, info)
      ) {
        console.log('📤 selected', selected)
      }
      return selected
    },
    [selector]
  )
  const state = useMutableSource(info.source, getSnapshot, subscribe)

  // after each render
  useLayoutEffect(() => {
    internal.current.isRendering = false
    if (
      process.env.NODE_ENV === 'development' &&
      shouldDebug(component, info)
    ) {
      console.log('📤 finish render, tracking', [...internal.current.tracked])
    }
  })

  // mount once
  useLayoutEffect(() => {
    if (!info.hasMounted) {
      info.hasMounted = true

      try {
        return storeProxy.mount()
      } finally {
        if (
          process.env.NODE_ENV === 'development' &&
          shouldDebug(component, info)
        ) {
          console.log('📤 mounted, info:', info)
        }
      }
    }
  }, [])

  const storeProxy = useConstant(() => {
    const proxiedStore = new Proxy(info.storeInstance, {
      get(target, key) {
        if (typeof key === 'string') {
          if (info.getters[key]) {
            return info.getters[key].call(proxiedStore)
          }
          if (info.actions[key]) {
            if (
              process.env.NODE_ENV === 'development' &&
              shouldDebug(component, info)
            ) {
              return new Proxy(info.actions[key], {
                apply(a, b, c) {
                  console.log(`📤 ACTION ${key}`, c)
                  return Reflect.apply(a, b, c)
                },
              })
            }
            return info.actions[key].bind(proxiedStore)
          }
          if (internal.current.isRendering) {
            internal.current.tracked.add(key)
            const val = state[key]
            if (typeof val !== 'undefined') {
              return val
            }
          }
        }
        return Reflect.get(target, key)
      },
      set(target, key, value, receiver) {
        const cur = Reflect.get(target, key)
        const res = Reflect.set(target, key, value, receiver)
        // only update if changed, simple compare
        if (res && cur !== value) {
          if (
            process.env.NODE_ENV === 'development' &&
            DebugStores.has(info.storeInstance.constructor)
          ) {
            console.log(`📤 SET ${String(key)}`, value)
          }
          info.version++
          info.storeInstance[TRIGGER_UPDATE]()
        }
        return res
      },
    })
    return proxiedStore
  })

  internal.current.isRendering = true

  if (userSelector) {
    return state
  }

  return storeProxy
}

const {
  ReactCurrentOwner,
} = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
const useCurrentComponent = () => {
  return ReactCurrentOwner &&
    ReactCurrentOwner.current &&
    ReactCurrentOwner.current.elementType
    ? ReactCurrentOwner.current.elementType
    : {}
}

export function useStoreDebug<A extends Store<B>, B>(
  StoreKlass: new (props: B) => A | (new () => A),
  props?: B,
  selector?: any
): A {
  const cmp = useCurrentComponent()
  React.useLayoutEffect(() => {
    DebugStores.add(StoreKlass)
    if (!DebugComponents.has(cmp)) {
      DebugComponents.set(cmp, new Set())
    }
    const stores = DebugComponents.get(cmp)!
    stores.add(StoreKlass)
    return () => {
      DebugStores.delete(StoreKlass)
      stores.delete(StoreKlass)
    }
  }, [])
  return useStore(StoreKlass, props, selector)
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
