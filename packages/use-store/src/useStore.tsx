// @ts-ignore
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
// @ts-ignore
// prettier-ignore
import { unstable_createMutableSource as createMutableSource, unstable_useMutableSource as useMutableSource } from 'react'

import { configureOpts } from './configureUseStore'
import { UNWRAP_PROXY, defaultOptions } from './constants'
import { UNWRAP_STORE_INFO, cache, getStoreDescriptors, getStoreUid, simpleStr } from './helpers'
import { Selector, StoreInfo, UseStoreOptions } from './interfaces'
import { isEqualSubsetShallow } from './isEqualShallow'
import {
  ADD_TRACKER,
  SHOULD_DEBUG,
  Store,
  StoreTracker,
  TRACK,
  TRIGGER_UPDATE,
  disableTracking,
  setDisableStoreTracking,
} from './Store'
// import { createMutableSource, useMutableSource } from './useMutableSource'
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
// const useStoreSelectorTest = createUseStoreSelector(StoreTest, (s) => s.props.id)
// const num = useStoreSelectorTest({ id: 0 })
// const ya = useStoreTest({ id: 1 })
// const yb = useStoreTest({ id: 1 }, (x) => x.props.id)
// const z = useStore(StoreTest)
// const abc = useStoreInstance(storeTest)
// const abc2 = useStoreInstance(storeTest)
// const abcSel = useStoreInstanceSelector(storeTest, (x) => x.props.id)

const idFn = (_) => _

// no singleton, just react
export function useStore<A extends Store<B>, B>(
  StoreKlass: (new (props: B) => A) | (new () => A),
  props?: B,
  options: UseStoreOptions<A, any> = defaultOptions
): A {
  const selectorCb = useCallback(options.selector || idFn, [])
  const selector = options.selector ? selectorCb : options.selector

  if (options.debug) {
    useDebugStoreComponent(StoreKlass)
  }

  // if (options.once) {
  //   const key = props ? getKey(props) : ''
  //   const info = useMemo(() => {
  //     return getOrCreateStoreInfo(StoreKlass, props, { avoidCache: true }, key)
  //   }, [key])
  //   return useStoreFromInfo(info, selector)
  // }

  const info = getOrCreateStoreInfo(StoreKlass, props)
  return useStoreFromInfo(info, selector)
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

export function useStoreInstance<A extends Store<B>, B>(instance: A, debug?: boolean): A {
  const store = instance[UNWRAP_PROXY]
  const uid = getStoreUid(store.constructor, store.props)
  const info = cache.get(uid)
  if (!info) {
    throw new Error(`This store not created using createStore()`)
  }
  if (debug) {
    useDebugStoreComponent(store.constructor)
  }
  return useStoreFromInfo(info)
}

export function useStoreInstanceSelector<A extends Store<B>, B, Selector extends (store: A) => any>(
  instance: A,
  selector: Selector,
  memo?: any[],
  debug?: boolean
): Selector extends (a: A) => infer C ? C : unknown {
  const store = instance[UNWRAP_PROXY]
  const uid = getStoreUid(store.constructor, store.props)
  const info = cache.get(uid)
  if (!info) {
    throw new Error(`This store not created using createStore()`)
  }
  if (debug) {
    useDebugStoreComponent(store.constructor)
  }
  return useStoreFromInfo(info, useCallback(selector, memo || []))
}

// for creating a usable store hook
export function createUseStore<Props, Store>(
  StoreKlass: (new (props: Props) => Store) | (new () => Store)
) {
  return function <Res, C extends Selector<Store, Res>>(
    props?: Props,
    options?: UseStoreOptions
    // super hacky workaround for now, ts is unknown to me tbh
  ): C extends Selector<any, infer B> ? (B extends Object ? B : Store) : Store {
    // @ts-expect-error
    return useStore(StoreKlass, props, options)
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
>(StoreKlass: (new (props: B) => A) | (new () => A), selector: S, props?: B): Selected {
  return useStore(StoreKlass, props, { selector }) as any
}

type StoreAccessTracker = (store: any) => void
const storeAccessTrackers = new Set<StoreAccessTracker>()
export function trackStoresAccess(cb: StoreAccessTracker) {
  storeAccessTrackers.add(cb)
  return () => {
    storeAccessTrackers.delete(cb)
  }
}

// TODO deprecate and replace with usePortal
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
      if (cached.storeInstance.constructor.toString() !== StoreKlass.toString()) {
        console.warn('Error: Stores must have a unique name (ignore if this is a hot reload)')
      } else {
        return cached
      }
    }
  }

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
      if (key !== 'props' && key[0] !== '_') {
        stateKeys.push(key)
      }
    }
  }

  let version = 0

  const storeInfo = {
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

  // uses more memory when on
  if (process.env.NODE_ENV === 'development') {
    allStores[uid] = store
  }

  // if has a mount function call it
  store.mount?.()

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
export const subscribe = (store: Store, callback: () => any) => {
  return store.subscribe(callback)
}

const emptyObj = {}
const selectKeys = (obj: any, keys: string[]) => {
  if (!keys.length) {
    return emptyObj
  }
  const res = {}
  for (const key of keys) {
    res[key] = obj[key]
  }
  return res
}

function useStoreFromInfo(info: StoreInfo, userSelector?: Selector<any> | undefined): any {
  if (!info.store) {
    return null
  }
  const internal = useRef<StoreTracker>()
  const component = useCurrentComponent()
  if (!internal.current) {
    internal.current = {
      component,
      isTracking: false,
      firstRun: true,
      tracked: new Set<string>(),
      dispose: null as any,
      last: null,
    }
    const dispose = info.store[ADD_TRACKER](internal.current)
    internal.current.dispose = dispose
  }
  const curInternal = internal.current!
  const selector = userSelector ?? selectKeys

  const shouldPrintDebug =
    !!process.env.LOG_LEVEL && (configureOpts.logLevel === 'debug' || shouldDebug(component, info))

  const getSnapshot =
    userSelector ||
    useCallback(
      (store) => {
        const keys = curInternal.firstRun ? info.stateKeys : [...curInternal.tracked]
        // dont track during selector
        setDisableStoreTracking(store, true)
        const snap = selector(store, keys)
        setDisableStoreTracking(store, false)
        if (isEqualSubsetShallow(snap, internal.current!.last)) {
          return internal.current!.last
        }
        if (shouldPrintDebug) {
          console.log('💰 getSnapshot', info.stateKeys, { component, keys, snap })
        }
        internal.current!.last = snap
        return snap
      },
      [selector]
    )

  const state = useMutableSource(info.source, getSnapshot, subscribe)

  // dispose tracker on unmount
  useEffect(() => {
    return curInternal.dispose
  }, [])

  // we never allow removing selector
  if (!userSelector) {
    // before each render
    curInternal.isTracking = true

    // track access, runs after each render
    useLayoutEffect(() => {
      curInternal.isTracking = false
      curInternal.firstRun = false
      if (shouldPrintDebug) {
        console.log('💰 finish render, tracking', [...curInternal.tracked])
      }
    })
  }

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

  let didSet = false
  let isInAction = false
  const wrappedActions = {}

  // pre-setup actions
  for (const key in actions) {
    // wrap action and call didSet after
    const actionFn = actions[key]
    // fix bug in router for now, need to look at it!!
    const isGetFn = key.startsWith('get')

    // wrap actions for tracking
    wrappedActions[key] = function useStoreAction(...args: any[]) {
      if (isGetFn || gettersState.isGetting) {
        return Reflect.apply(actionFn, proxiedStore, args)
      }
      // dumb for now
      isInAction = true
      let res: any

      try {
        res = Reflect.apply(actionFn, proxiedStore, args)
        return res
      } catch (err: any) {
        console.error(err.message, err.stack)
      } finally {
        if (res instanceof Promise) {
          return res.then(finishAction)
        } else {
          return finishAction()
        }
      }
    }

    // dev mode do nice logging
    if (process.env.NODE_ENV === 'development' && !isGetFn && !key.startsWith('_')) {
      const ogAction = wrappedActions[key]
      wrappedActions[key] = new Proxy(ogAction, {
        apply(target, thisArg, args) {
          const isDebugging = DebugStores.has(constr)
          const shouldLog =
            process.env.LOG_LEVEL !== '0' && (isDebugging || configureOpts.logLevel !== 'error')

          if (!shouldLog) {
            return Reflect.apply(target, thisArg, args)
          }

          setters = new Set()
          const curSetters = setters
          const isTopLevelLogger = logStack.size == 0
          const logs = new Set<any[]>()
          logStack.add(logs)
          let res
          try {
            // 🏃‍♀️ run action here now
            res = Reflect.apply(target, thisArg, args)
          } finally {
            logStack.add('end')

            const name = constr.name
            const color = strColor(name)
            const simpleArgs = args.map(simpleStr)
            logs.add([
              `💰 %c${name.padStart(18)}%c.${key}(${simpleArgs.join(', ')})${
                isTopLevelLogger && logStack.size > 1 ? ` (+${logStack.size - 1})` : ''
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
              } catch (err: any) {
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
          }
        },
      })
    }
  }

  const finishAction = () => {
    isInAction = false
    if (didSet) {
      storeInfo.triggerUpdate()
      didSet = false
    }
  }

  const proxiedStore = new Proxy(storeInstance, {
    // GET
    get(_, key) {
      // setup action one time
      if (key in wrappedActions) {
        return wrappedActions[key]
      }
      if (passThroughKeys[key]) {
        return Reflect.get(storeInstance, key)
      }

      if (typeof key !== 'string') {
        if (key === UNWRAP_PROXY) {
          return storeInstance
        }
        if (key === UNWRAP_STORE_INFO) {
          return storeInfo
        }
        return Reflect.get(storeInstance, key)
      }
      if (disableTracking.get(storeInstance)) {
        return Reflect.get(storeInstance, key)
      }
      // non-actions
      else {
        if (storeAccessTrackers.size && !storeAccessTrackers.has(storeInstance)) {
          storeAccessTrackers.forEach((t) => {
            t(storeInstance)
          })
        }

        if (gettersState.isGetting) {
          gettersState.curGetKeys.add(key)
        }

        if (key in getters) {
          if (!gettersState.isGetting) {
            if (process.env.NODE_ENV === 'development') {
              if (DebugStores.has(constr)) {
                console.log('useStore TRACKING', key)
              }
            }
            storeInstance[TRACK](key)
          }
          if (getCache.has(key)) {
            return getCache.get(key)
          }
          // track get deps
          curGetKeys.clear()
          const isSubGetter = gettersState.isGetting
          gettersState.isGetting = true
          const res = getters[key].call(proxiedStore)
          if (!isSubGetter) {
            gettersState.isGetting = false
          }
          // store inverse lookup
          curGetKeys.forEach((gk) => {
            if (!depsToGetter.has(gk)) {
              depsToGetter.set(gk, new Set())
            }
            const cur = depsToGetter.get(gk)!
            cur.add(key)
          })
          // TODO i added this !isSubGetter, seems logical but haven't validated
          // has diff performance tradeoffs, not sure whats desirable
          // if (!isSubGetter) {
          getCache.set(key, res)
          // }
          return res
        }

        if (!gettersState.isGetting) {
          if (process.env.NODE_ENV === 'development') {
            if (DebugStores.has(constr)) {
              console.log('useStore TRACKING', key)
            }
          }
          storeInstance[TRACK](key)
        }
      }

      return Reflect.get(storeInstance, key)
    },

    // SET
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
          if (storeInstance[SHOULD_DEBUG]()) {
            console.log('(debug) SET', res, key, value)
          }
        }
        if (isInAction) {
          didSet = true
        } else {
          storeInfo.triggerUpdate()
        }
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

const passThroughKeys = {
  _trackers: true,
  $$typeof: true,
  _listeners: true,
  _enableTracking: true,
}
