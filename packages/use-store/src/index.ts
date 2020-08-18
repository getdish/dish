import { useEffect, useLayoutEffect, useRef } from 'react'
import create, { UseStore } from 'zustand'
import shallow from 'zustand/shallow'

import { Store } from './Store'

export * from './Store'

export function get<A>(
  _: A,
  b?: any
): A extends new (props?: any) => infer B ? B : A {
  return _ as any
}

type StoreInfo = {
  klass: any
  getters: { [key: string]: Function }
  useStore: UseStore<any>
  mount: Function
}

const keys = new Set<string>()
const cache = new WeakMap<any, { [key: string]: StoreInfo }>()
const getKey = (props: Object) =>
  Object.keys(props)
    .sort()
    .map((x) => `${x}${props[x]}`)
    .join('')

export function useStore<A extends Store<B>, B>(
  StoreKlass: new (props: B) => A | (new () => A),
  props?: B
): A {
  const isMountedRef = useIsMountedRef()
  const propsKey = props ? getKey(props) : ''
  if (propsKey) {
    const cachedStore = cache.get(StoreKlass)
    const cachedStoreInstance = cachedStore?.[propsKey]
    if (cachedStoreInstance) {
      return useStoreInstance(cachedStoreInstance)
    }
  }
  // create store on first use
  const storeName = StoreKlass.name
  if (keys.has(storeName)) {
    throw new Error(`Store name already used`)
  }
  let storeInstance = new StoreKlass(props!)
  let storeProxy: any
  const getters = {}
  const actions = {}

  const useStore = create<any>((set, get) => {
    const zustandStore = {}

    storeProxy = new Proxy(storeInstance, {
      get(target, key) {
        if (typeof key == 'string') {
          if (getters[key]) {
            return getters[key]()
          }
          if (actions[key]) {
            return actions[key]
          }
          return get()[key]
        }
        return Reflect.get(target, key)
      },
      set(target, key, value, receiver) {
        if (isMountedRef.current === false) return true
        if (typeof key === 'string') {
          set({ [key]: value })
        }
        return Reflect.set(target, key, value, receiver)
      },
    })

    const descriptors = getStoreDescriptors(storeInstance)
    for (const key in descriptors) {
      const descriptor = descriptors[key]
      if (typeof descriptor.value === 'function') {
        actions[key] = descriptor.value.bind(storeProxy)
      } else if (typeof descriptor.get === 'function') {
        getters[key] = descriptor.get.bind(storeProxy)
      } else {
        zustandStore[key] = descriptor.value
      }
    }

    return zustandStore
  })

  if (!cache.get(StoreKlass)) {
    cache.set(StoreKlass, {})
  }
  const cacheByProps = cache.get(StoreKlass)!
  const value: StoreInfo = {
    klass: storeProxy,
    useStore,
    getters,
    mount: storeProxy.mount,
  }
  cacheByProps[propsKey] = value
  return useStoreInstance(value)
}

const idFn = (x) => x
function useStoreInstance(info: StoreInfo): any {
  const store = info.useStore(idFn, shallow)

  useLayoutEffect(() => {
    info.klass.mount?.()
  }, [])

  return new Proxy(info.klass, {
    get(_, key) {
      if (typeof store[key] !== 'undefined') {
        return store[key]
      }
      return info.klass[key]
    },
    set(a, b, c, d) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          'Not recommended to mutate directly as it can lead to confusing code. Create a function instead.'
        )
      }
      return Reflect.set(a, b, c, d)
    },
  })
}

function useIsMountedRef() {
  const isMounted = useRef(true)
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])
  return isMounted
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
