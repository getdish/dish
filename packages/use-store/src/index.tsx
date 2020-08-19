import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import { createContainer, getUntrackedObject } from 'react-tracked'

import { Store } from './Store'

export * from './Store'

const useValue = ({ reducer, initialState }) =>
  useReducer(reducer, initialState)
const { Provider, useTracked } = createContainer<any, any, any>(useValue)

const initialState = {}
export const UseStoreRoot = (props: { children: any }) => {
  return (
    <Provider reducer={reducer} initialState={initialState}>
      {props.children}
    </Provider>
  )
}

type StoreInfo = {
  storeInstance: any
  initialState: Object
  keyMap: { [key: string]: string }
  getters: { [key: string]: any }
}
const cache = new WeakMap<any, { [key: string]: StoreInfo }>()

const reducer = (state: any, action: any) => {
  // console.log('DISPATCH', action)
  switch (action.type) {
    case 'update': {
      return {
        ...state,
        ...action.value,
      }
    }
    case 'updateOne': {
      return {
        ...state,
        [action.key]: action.value,
      }
    }
  }
  return state
}

const uniqueStoreNames = new Set<string>()

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

  // avoid work next uses
  const cachedStoreInstance = cached?.[uid]
  if (cachedStoreInstance) {
    return useStoreInstance(cachedStoreInstance, selector)
  }

  // create store on first use

  const storeInstance = new StoreKlass(props!)
  const initialState = {}
  const keyMap = {}
  const getters = {}

  const descriptors = getStoreDescriptors(storeInstance)
  for (const key in descriptors) {
    // our two special keys
    if (key === 'props' || key === 'mount') {
      continue
    }
    const descriptor = descriptors[key]
    if (typeof descriptor.value === 'function') {
      // actions
    } else if (typeof descriptor.get === 'function') {
      getters[key] = descriptor.get
    } else {
      const reducerKey = `${uid}${key}`
      initialState[key] = descriptor.value
      keyMap[key] = reducerKey
    }
  }

  if (!cache.get(StoreKlass)) {
    cache.set(StoreKlass, {})
  }
  const subCache = cache.get(StoreKlass)!
  const value: StoreInfo = {
    storeInstance,
    initialState,
    getters,
    keyMap,
  }
  subCache[uid] = value
  return useStoreInstance(value, selector)
}

function useStoreInstance(info: StoreInfo, selector?: (x: any) => any): any {
  const [state, dispatch] = useTracked()
  const stateRef = useRef(state)
  stateRef.current = state

  // useLayoutEffect(() => {
  //   stateRef.current = state
  // }, [state])

  // set initial state into reducer

  useLayoutEffect(() => {
    const { initialState } = info
    if (initialState && Object.keys(initialState).length) {
      dispatch({
        type: 'update',
        value: initialState,
      })
    }

    storeProxy.mount()
  }, [])

  const storeProxy = useMemo(() => {
    const proxiedStore = new Proxy(info.storeInstance, {
      get(_, key) {
        if (typeof key === 'string') {
          if (info.getters[key]) {
            return info.getters[key].call(proxiedStore)
          }
          const stateKey = info.keyMap[key]
          const value = stateRef.current[stateKey]
          if (typeof value !== 'undefined') {
            return value
          }
        }
        return Reflect.get(info.storeInstance, key)
      },
      set(target, key, value, receiver) {
        if (typeof key === 'string') {
          dispatch({
            type: 'updateOne',
            key: info.keyMap[key],
            value,
          })
        }
        return Reflect.set(target, key, value, receiver)
      },
    })
    return proxiedStore
  }, [])

  return storeProxy
}

// function useIsMountedRef() {
//   const isMounted = useRef<'mounting' | 'mounted' | 'unmounted'>('mounting')
//   useLayoutEffect(() => {
//     isMounted.current = 'mounted'
//     return () => {
//       isMounted.current = 'unmounted'
//     }
//   }, [])
//   return isMounted
// }

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
