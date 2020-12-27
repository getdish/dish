import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react'

import { DebugComponents, DebugStores, shouldDebug } from './shouldDebug'
import { Store, TRIGGER_UPDATE } from './Store'
import { StoreInfo } from './types'

// @ts-ignore
const createMutableSource = React.unstable_createMutableSource
// @ts-ignore
const useMutableSource = React.unstable_useMutableSource

export * from './Store'

export type UseStoreSelector<Store, Res> = (store: Store) => Res
export type UseStoreOptions<Store = any, SelectorRes = any> = {
  selector?: UseStoreSelector<Store, SelectorRes>
  once?: boolean
}

const UNWRAP_PROXY = Symbol('unwrap_proxy')
const StoreInstanceToInfo = new WeakMap<any, StoreInfo>()
const cache = new WeakMap<any, { [key: string]: StoreInfo }>()
const defaultOptions = {
  once: false,
  selector: undefined,
}

type Selector<A = unknown, B = unknown> = (x: A) => B

// sanity check types here
// class StoreTest extends Store<{ id: number }> {}
// const storeTest = createStore(StoreTest, { id: 3 })
// const useStoreTest = createUseStore(StoreTest)
// const useStoreSelectorTest = createUseStoreSelector(
//   StoreTest,
//   (s) => s.props.id
// )
// const num = useStoreSelectorTest({ id: 0 })
// const ya = useStoreTest({ id: 1 })
// const yb = useStoreTest({ id: 1 }, (x) => x.props.id)
// const z = useStore(StoreTest)
// const abc = useStoreInstance(storeTest)
// const abcSel = useStoreInstance(storeTest, (x) => x.props.id)

// singleton
export function createStore<A extends Store<B>, B>(
  StoreKlass: new (props: B) => A | (new () => A),
  props?: B
): A {
  const info = getOrCreateStoreInfo(StoreKlass, props)
  const storeInstance = createProxiedStore(info)
  storeInstance.mount?.()
  return storeInstance
}

// use singleton with react
export function useStoreInstance<A extends Store<B>, B>(instance: A): A {
  const info = StoreInstanceToInfo.get(instance[UNWRAP_PROXY])
  if (!info) {
    throw new Error(`This store not created using createStore()`)
  }
  return useStoreFromInfo(info, arguments[1])
}
// super hack! but it works!
// putting this below the above function is technically incorrect
// as TS expected override types to be above, but it still works!
// and its the only way i can get the type to properly narrow...
// but requires the @ts-expect-error on the next function def :/
export function useStoreInstance<
  A extends Store<any>,
  Selector extends ((a: A) => any) | void
>(instance: A, selector?: Selector): Selector extends (a: A) => infer C ? C : A

// no singleton, just react
// @ts-expect-error
export function useStore<A extends Store<B>, B>(
  StoreKlass: (new (props: B) => A) | (new () => A),
  props?: B,
  options: UseStoreOptions<A, any> = defaultOptions
): A {
  const cachedSelector = options.selector
    ? useCallback(options.selector, [])
    : undefined

  if (options.once) {
    const key = props ? getKey(props) : ''
    const info = useMemo(() => {
      return getOrCreateStoreInfo(StoreKlass, props, { avoidCache: true }, key)
    }, [key])
    return useStoreFromInfo(info, cachedSelector)
  }

  const info = getOrCreateStoreInfo(StoreKlass, props)
  return useStoreFromInfo(info, cachedSelector)
}

// for creating a usable store hook
export function createUseStore<Props, Store>(
  StoreKlass: (new (props: Props) => Store) | (new () => Store)
) {
  return function <Res, C extends Selector<Store, Res>>(
    props?: Props,
    selector?: C
    // super hacky workaround for now, ts is unknown to me tbh
  ): C extends Selector<any, infer B> ? (B extends Object ? B : Store) : Store {
    // @ts-expect-error
    return useStore(StoreKlass, props, { selector })
  }
}

// for creating a usable selector hook
export function createUseStoreSelector<A extends Store<Props>, Props, Selected>(
  StoreKlass: (new (props: Props) => A) | (new () => A),
  selector: Selector<A, Selected>
): (props?: Props) => Selected {
  return (props?: Props) => {
    return useStore(StoreKlass, props, { selector }) as any
  }
}

// selector hook
export function useStoreSelector<
  A extends Store<B>,
  B,
  S extends Selector<any, Selected>,
  Selected
>(
  StoreKlass: (new (props: B) => A) | (new () => A),
  selector: S,
  props?: B
): Selected {
  return useStore(StoreKlass, props, { selector }) as any
}

// for ephemeral stores (alpha, not working correctly yet)
export function useStoreOnce<A extends Store<B>, B>(
  StoreKlass: (new (props: B) => A) | (new () => A),
  props?: B,
  selector?: any
): A {
  return useStore(StoreKlass, props, { selector, once: true })
}

// get non-singleton outside react (weird)
export function getStore<A extends Store<B>, B>(
  StoreKlass: (new (props: B) => A) | (new () => A),
  props?: B
): A {
  const info = getOrCreateStoreInfo(StoreKlass, props)
  return createProxiedStore(info)
}

function getOrCreateStoreInfo(
  StoreKlass: any,
  props: any,
  opts?: { avoidCache: boolean },
  propsKeyCalculated?: string
) {
  const storeName = StoreKlass.name
  const propsKey = propsKeyCalculated ?? (props ? getKey(props) : '')
  const uid = `${storeName}${propsKey}`

  if (!opts?.avoidCache) {
    const cached = cache.get(StoreKlass)
    const info = cached?.[uid]
    if (info) {
      return info
    }
  }

  // init
  const storeInstance = new StoreKlass(props!)

  allStores[uid] = storeInstance

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

  if (!opts?.avoidCache) {
    StoreInstanceToInfo.set(storeInstance, value)
    if (!cache.get(StoreKlass)) {
      cache.set(StoreKlass, {})
    }
    cache.get(StoreKlass)![uid] = value
  }

  return value
}

export const allStores = {}

export function mountStore(info: StoreInfo, store: any) {
  if (!info.hasMounted) {
    info.hasMounted = true
    store.mount?.()
  }
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

function useStoreFromInfo(
  info: StoreInfo,
  userSelector?: Selector<any> | undefined
): any {
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
        console.log('🏪 selected', selected)
      }
      return selected
    },
    [selector]
  )
  const state = useMutableSource(info.source, getSnapshot, subscribe)
  const storeProxy = useConstant(() =>
    createProxiedStore(info, { internal, component })
  )

  // before each render
  internal.current.isRendering = true

  // track access, runs after each render
  useLayoutEffect(() => {
    internal.current.isRendering = false
    mountStore(info, storeProxy)

    if (
      process.env.NODE_ENV === 'development' &&
      shouldDebug(component, info)
    ) {
      console.log('🏪 finish render, tracking', [...internal.current.tracked])
    }
  })

  if (userSelector) {
    return state
  }

  return storeProxy
}

function createProxiedStore(
  info: StoreInfo,
  renderOpts?: {
    internal: { current: { isRendering: boolean; tracked: Set<string> } }
    component: any
  }
) {
  const proxiedStore = new Proxy(info.storeInstance, {
    get(target, key) {
      if (typeof key === 'string') {
        if (info.getters[key]) {
          return info.getters[key].call(proxiedStore)
        }
        if (info.actions[key]) {
          if (
            process.env.NODE_ENV === 'development' &&
            renderOpts &&
            shouldDebug(renderOpts.component, info)
          ) {
            return new Proxy(info.actions[key], {
              apply(a, b, c) {
                console.log(`🏪 ACTION ${key}`, c)
                return Reflect.apply(a, b, c)
              },
            })
          }
          return info.actions[key].bind(proxiedStore)
        }
        if (renderOpts) {
          if (renderOpts.internal.current.isRendering) {
            renderOpts.internal.current.tracked.add(key)
            const val = info.storeInstance[key]
            if (typeof val !== 'undefined') {
              return val
            }
          }
        }
      }
      if (key === UNWRAP_PROXY) {
        return info.storeInstance
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
          console.log(`🏪 SET ${String(key)}`, value)
        }
        info.version++
        info.storeInstance[TRIGGER_UPDATE]()
      }
      return res
    },
  })

  return proxiedStore
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
  StoreKlass: (new (props: B) => A) | (new () => A),
  props?: B,
  selector?: any
): A {
  const cmp = useCurrentComponent()

  useLayoutEffect(() => {
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

function getKey(props: Object) {
  let s = ''
  const sorted = Object.keys(props).sort()
  for (const key of sorted) {
    s += `-${key}-${props[key]}`
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
