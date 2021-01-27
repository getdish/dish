import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'

import { configureOpts } from './configureUseStore'
import { UNWRAP_PROXY, defaultOptions } from './constants'
import useConstant, {
  UNWRAP_STORE_INFO,
  cache,
  getKey,
  getStoreDescriptors,
  getStoreUid,
  simpleStr,
} from './helpers'
import { Selector, StoreInfo, UseStoreOptions } from './interfaces'
import {
  ADD_TRACKER,
  SHOULD_DEBUG,
  Store,
  StoreTracker,
  TRACK,
  TRIGGER_UPDATE,
} from './Store'
import { createMutableSource, useMutableSource } from './useMutableSource'
import {
  DebugStores,
  shouldDebug,
  useCurrentComponent,
  useDebugStoreComponent,
} from './useStoreDebug'

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
// no singleton, just react

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

export function useStoreDebug<A extends Store<B>, B>(
  StoreKlass: (new (props: B) => A) | (new () => A),
  props?: B,
  selector?: any
): A {
  useDebugStoreComponent(StoreKlass)
  return useStore(StoreKlass, props, selector)
}

// singleton
export function createStore<A extends Store<B>, B>(
  StoreKlass: new (props: B) => A | (new () => A),
  props?: B
): A {
  return getOrCreateStoreInfo(StoreKlass, props).store
}
// use singleton with react
// TODO selector support with types...

export function useStoreInstance<A extends Store<B>, B>(instance: A): A {
  const store = instance[UNWRAP_PROXY]
  const uid = getStoreUid(store.constructor, store.props)
  const info = cache.get(uid)
  if (!info) {
    throw new Error(`This store not created using createStore()`)
  }
  if (arguments[3]) {
    useDebugStoreComponent(store.constructor)
  }
  const selector = arguments[1]
    ? useCallback(arguments[1], arguments[2] ?? [])
    : undefined
  return useStoreFromInfo(info, selector)
}

// super hack! but it works!
// putting this below the above function is technically incorrect
// as TS expected override types to be above, but it still works!
// and its the only way i can get the type to properly narrow...
// but requires the @ts-expect-error on the next function def :/

export function useStoreInstance<
  A extends Store<any>,
  Selector extends ((a: A) => any) | void
>(
  instance: A,
  selector?: Selector,
  memoArgs?: any[],
  debug?: boolean
): Selector extends (a: A) => infer C ? C : A
// for creating a usable store hook
// @ts-expect-error

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
  return getOrCreateStoreInfo(StoreKlass, props).store
}

function getOrCreateStoreInfo(
  StoreKlass: any,
  props: any,
  opts?: { avoidCache: boolean },
  propsKeyCalculated?: string
) {
  const uid = getStoreUid(StoreKlass, propsKeyCalculated ?? props)

  if (!opts?.avoidCache) {
    const cached = cache.get(uid)
    if (cached) {
      // warn if creating an already existing store!
      // need to detect HMR more cleanly if possible
      if (
        cached?.storeInstance.constructor.toString() !== StoreKlass.toString()
      ) {
        console.warn(
          'Error: Stores must have a unique name (ignore if this is a hot reload)'
        )
      }
      return cached
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

  let version = 0

  const storeInfo = {
    hasMounted: false,
    storeInstance,
    getVersion() {
      return version
    },
    triggerUpdate() {
      version = (version + 1) % Number.MAX_SAFE_INTEGER
      storeInstance[TRIGGER_UPDATE]()
    },
    getters,
    stateKeys,
    actions,
    gettersState: {
      getCache: new Map<string, any>(),
      depsToGetter: new Map<string, Set<string>>(),
      curGetKeys: new Set<string>(),
      isGetting: false,
    },
  }
  const store = createProxiedStore(storeInfo)
  const value: StoreInfo = {
    ...storeInfo,
    store,
    source: createMutableSource(store, () => version),
  }

  if (!opts?.avoidCache) {
    cache.set(uid, value)
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

export const subscribe = (store: Store, callback: () => any) => {
  return store.subscribe(callback)
}

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
  const internal = useRef<StoreTracker>()
  const component = useCurrentComponent()
  if (!internal.current) {
    internal.current = {
      component,
      isTracking: false,
      tracked: new Set<string>(),
      dispose: null as any,
    }
    const dispose = info.store[ADD_TRACKER](internal.current)
    internal.current.dispose = dispose
  }
  const curInternal = internal.current!
  const selector = userSelector ?? selectKeys
  const getSnapshot = useCallback(
    (store) => {
      const keys = [...curInternal.tracked]
      const snap = selector(store, keys)
      if (
        process.env.LOG_LEVEL &&
        (shouldDebug(component, info) || configureOpts.logLevel === 'debug')
      ) {
        console.log('💰 getSnapshot', keys, snap)
      }
      return snap
    },
    [selector]
  )

  const state = useMutableSource(info.source, getSnapshot, subscribe)

  // before each render
  curInternal.isTracking = true

  // dispose tracker on unmount
  useEffect(() => {
    return curInternal.dispose
  }, [])

  // track access, runs after each render
  useLayoutEffect(() => {
    // curInternal.isTracking = false
    mountStore(info, info.store)
    if (
      process.env.LOG_LEVEL &&
      (shouldDebug(component, info) || configureOpts.logLevel === 'debug')
    ) {
      console.log('💰 finish render, tracking', [...curInternal.tracked])
    }
  })

  if (userSelector) {
    return state
  }

  return info.store
}

let setters = new Set<any>()
const logStack = new Set<Set<any[]> | 'end'>()

function createProxiedStore(storeInfo: Omit<StoreInfo, 'store' | 'source'>) {
  const { actions, storeInstance, getters, gettersState } = storeInfo
  const { getCache, curGetKeys, depsToGetter } = gettersState
  const constr = storeInstance.constructor

  const proxiedStore = new Proxy(storeInstance, {
    get(target, key) {
      const isDebugging = DebugStores.has(constr)
      if (typeof key === 'string') {
        if (gettersState.isGetting) {
          gettersState.curGetKeys.add(key)
        }
        if (key in getters) {
          if (!gettersState.isGetting) {
            storeInstance[TRACK](key)
          }
          if (getCache.has(key)) {
            return getCache.get(key)
          }
          // track get deps
          curGetKeys.clear()
          gettersState.isGetting = true
          const res = getters[key].call(proxiedStore)
          gettersState.isGetting = false
          // store inverse lookup
          curGetKeys.forEach((gk) => {
            if (!depsToGetter.has(gk)) {
              depsToGetter.set(gk, new Set())
            }
            const cur = depsToGetter.get(gk)!
            cur.add(key)
          })
          getCache.set(key, res)
          return res
        }
        if (key in actions) {
          let action = actions[key].bind(proxiedStore)
          if (
            process.env.LOG_LEVEL &&
            (isDebugging || configureOpts.logLevel !== 'error') &&
            !key.startsWith('get')
          ) {
            const ogAction = action
            action = (...args: any[]) => {
              setters = new Set()
              const curSetters = setters

              if (process.env.LOG_LEVEL) {
                // dev mode do a lot of nice logging
                const isTopLevelLogger = logStack.size == 0
                const logs = new Set<any[]>()
                logStack.add(logs)

                // 🏃‍♀️ run action here now
                const res = ogAction(...args)

                logStack.add('end')

                const name = constr.name
                const color = strColor(name)
                const simpleArgs = args.map(simpleStr)
                logs.add([
                  `💰 %c${name}%c.${key}(${simpleArgs.join(', ')})${
                    isTopLevelLogger && logStack.size > 1
                      ? ` (+${logStack.size - 1})`
                      : ''
                  }`,
                  `color: ${color};`,
                  'color: black;',
                ])
                logs.add([` ARGS`, ...args])
                if (curSetters.size) {
                  curSetters.forEach(({ key, value }) => {
                    logs.add([` SET`, key, '=', value])
                  })
                }
                if (typeof res !== 'undefined') {
                  logs.add([' =>', res])
                }

                if (isTopLevelLogger) {
                  let error = null
                  try {
                    for (const item of [...logStack]) {
                      if (item === 'end') {
                        console.groupEnd()
                        continue
                      }
                      const [head, ...rest] = item
                      if (head) {
                        console.groupCollapsed(...head)
                        console.groupCollapsed('trace >')
                        console.trace()
                        console.groupEnd()
                        for (const log of rest) {
                          console.log(...log)
                        }
                      } else {
                        console.log('Weird log', head, ...rest)
                      }
                    }
                  } catch (err) {
                    error = err
                  }
                  for (const _ of [...logStack]) {
                    console.groupEnd()
                  }
                  if (error) {
                    console.error(`error loggin`, error)
                  }
                  logStack.clear()
                }

                return res

                // dev-mode colored output
                function hashCode(str: string) {
                  let hash = 0
                  for (var i = 0; i < str.length; i++) {
                    hash = str.charCodeAt(i) + ((hash << 5) - hash)
                  }
                  return hash
                }
                function strColor(str: string) {
                  return `hsl(${hashCode(str) % 360}, 90%, 40%)`
                }
              } else {
                // otherwise just run it
                return ogAction(...args)
              }
            }
          }
          return action
        }
        if (!gettersState.isGetting) {
          storeInstance[TRACK](key)
          return Reflect.get(target, key)
        }
      }
      if (key === UNWRAP_PROXY) {
        return storeInstance
      }
      if (key === UNWRAP_STORE_INFO) {
        return storeInfo
      }
      return Reflect.get(target, key)
    },
    set(target, key, value, receiver) {
      const cur = Reflect.get(target, key)
      const res = Reflect.set(target, key, value, receiver)
      // only update if changed, simple compare
      if (res && cur !== value) {
        // clear getters cache that rely on this
        if (typeof key === 'string') {
          clearGetterCache(key)
        }
        if (process.env.LOG_LEVEL && configureOpts.logLevel !== 'error') {
          setters.add({ key, value })
          if (storeInfo.storeInstance[SHOULD_DEBUG]()) {
            console.log('SET', res, key, value)
          }
        }
        // TODO option to enforce actions only mutations
        storeInfo.triggerUpdate()
      }
      return res
    },
  })

  function clearGetterCache(setKey: string) {
    const getters = depsToGetter.get(setKey)
    getCache.delete(setKey)
    if (!getters) {
      return
    }
    getters.forEach((gk) => {
      getCache.delete(gk)
      if (depsToGetter.has(gk)) {
        clearGetterCache(gk)
      }
    })
  }

  return proxiedStore
}
