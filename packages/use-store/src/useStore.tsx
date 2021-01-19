import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'

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
import { Store, TRIGGER_UPDATE } from './Store'
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
// singleton

export function createStore<A extends Store<B>, B>(
  StoreKlass: new (props: B) => A | (new () => A),
  props?: B
): A {
  const info = getOrCreateStoreInfo(StoreKlass, props)
  const storeInstance = createProxiedStore(info)
  mountStore(info, storeInstance)
  return storeInstance
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
  if (arguments[2]) {
    useDebugStoreComponent(store.constructor)
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
  const info = getOrCreateStoreInfo(StoreKlass, props)
  return createProxiedStore(info)
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
  const value: StoreInfo = {
    hasMounted: false,
    version: 0,
    storeInstance,
    getters,
    stateKeys,
    actions,
    source: createMutableSource(storeInstance, () => value.version),
    gettersState: {
      getCache: new Map<string, any>(),
      // two maps, track both directions for fast lookup/clear w slightly more memory
      getterToDeps: new Map<string, Set<string>>(),
      depsToGetter: new Map<string, Set<string>>(),
      curGetKeys: new Set<string>(),
      isGetting: false,
    },
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
  const internal = useRef({
    isRendering: false,
    tracked: new Set<string>(),
  })
  const component = useCurrentComponent()
  const selector = userSelector ?? selectKeys
  const getSnapshot = useCallback(
    (store) => {
      const snap = selector(store, [...internal.current.tracked])
      if (
        process.env.NODE_ENV === 'development' &&
        (shouldDebug(component, info) || configureOpts.logLevel === 'debug')
      ) {
        console.log('💰 getSnapshot', [...internal.current.tracked], snap)
      }
      return snap
    },
    [selector.toString()]
  )
  // TODO selector should not be memoed automatically?
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
      (shouldDebug(component, info) || configureOpts.logLevel === 'debug')
    ) {
      console.log('💰 finish render, tracking', [...internal.current.tracked])
    }
  })

  if (userSelector) {
    return state
  }

  return storeProxy
}

let setters = new Set<any>()
const logStack = new Set<Set<any[]>>()

function createProxiedStore(
  storeInfo: StoreInfo,
  renderOpts?: {
    internal: { current: { isRendering: boolean; tracked: Set<string> } }
    component: any
  }
) {
  const { actions, storeInstance, getters, gettersState } = storeInfo
  const { getCache, curGetKeys, getterToDeps, depsToGetter } = gettersState
  const constr = storeInstance.constructor

  const proxiedStore = new Proxy(storeInstance, {
    get(target, key) {
      if (typeof key === 'string') {
        if (gettersState.isGetting) {
          gettersState.curGetKeys.add(key)
        }
        if (key in getters) {
          if (
            !gettersState.isGetting &&
            renderOpts?.internal.current.isRendering
          ) {
            renderOpts.internal.current.tracked.add(key)
          }
          if (getCache.has(key)) {
            // console.log('using getter cahce', key)
            return getCache.get(key)
          }
          // track get deps
          curGetKeys.clear()
          gettersState.isGetting = true
          const res = getters[key].call(proxiedStore)
          gettersState.isGetting = false
          getterToDeps.set(key, new Set(curGetKeys))
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
            process.env.NODE_ENV === 'development' &&
            ((renderOpts && DebugStores.has(constr)) ||
              configureOpts.logLevel !== 'error') &&
            !key.startsWith('get')
          ) {
            const ogAction = action
            action = (...args: any[]) => {
              setters = new Set()
              const curSetters = setters

              if (process.env.NODE_ENV === 'development') {
                // dev mode do a lot of nice logging
                const isTopLevelLogger = logStack.size == 0
                const logs = new Set<any[]>()
                logStack.add(logs)

                // run action here now
                const res = ogAction(...args)

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
                    for (const [head, ...rest] of [...logStack]) {
                      if (head) {
                        console.groupCollapsed(...head)
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
        if (
          !gettersState.isGetting &&
          renderOpts?.internal.current.isRendering
        ) {
          renderOpts.internal.current.tracked.add(key)
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
        if (
          process.env.NODE_ENV === 'development' &&
          configureOpts.logLevel !== 'error'
        ) {
          setters.add({ key, value })
          if (shouldDebug(renderOpts?.component, storeInfo)) {
            console.log('SET', res, key, value)
          }
        }

        // clear getters cache that rely on this
        if (typeof key === 'string') {
          clearGetterCache(key)
        }

        // TODO could potentially enforce actions + batch
        storeInfo.version++
        storeInstance[TRIGGER_UPDATE]()
      }
      return res
    },
  })

  function clearGetterCache(setKey: string) {
    const getters = depsToGetter.get(setKey)
    if (!getters) {
      // console.log('No getters?', setKey, depsToGetter)
      return
    }
    getters.forEach((gk) => {
      getCache.delete(gk)
      // console.log('clearing cache for', gk)
      if (depsToGetter.has(gk)) {
        clearGetterCache(gk)
      }
    })
  }

  return proxiedStore
}
