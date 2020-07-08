import {
  RecoilState,
  RecoilValueReadOnly,
  atomFamily,
  selectorFamily,
  useRecoilInterface,
} from '@o/recoil'
import { useEffect, useMemo, useRef } from 'react'

import { Store } from './Store'

export { RecoilRoot } from '@o/recoil'
export * from './Store'

export function get<A>(
  _: A,
  b?: any
): A extends new (props?: any) => infer B ? B : A {
  return _ as any
}

type StoreAttribute =
  | { type: 'value'; key: string; value: (params: unknown) => RecoilState<any> }
  | { type: 'action'; key: string; value: Function }
  | {
      type: 'selector'
      key: string
      value: (params: { get: any }) => RecoilValueReadOnly<unknown>
    }

type StoreAttributes = { [key: string]: StoreAttribute }

const keys = new Set<string>()
const storeToRecoilStore = new WeakMap<any, any>()
const storeToAttributes = new WeakMap<any, StoreAttributes>()

export function useRecoilStore<A extends Store<B>, B>(
  StoreKlass: new (props: B) => A | (new () => A),
  props?: B
): A {
  let recoilStore = storeToRecoilStore.get(StoreKlass)
  if (recoilStore) {
    return useRecoilStoreInstance(
      recoilStore,
      storeToAttributes.get(StoreKlass)!,
      props
    )
  }
  const storeName = StoreKlass.name
  if (keys.has(storeName)) {
    throw new Error(`Store name already used`)
  }
  const storeInstance = new StoreKlass(props as any)
  const descriptors = getStoreDescriptors(storeInstance)
  const attrs: StoreAttributes = {}
  const storeProxy = new Proxy(storeInstance as any, {
    get(target, key) {
      return getProxyValue(target, key, attrs, curGetter, props)
    },
  })
  for (const prop in descriptors) {
    attrs[prop] = getDescription(
      storeProxy,
      `${storeName}/${prop}`,
      descriptors[prop]
    )
  }
  storeToRecoilStore.set(StoreKlass, storeInstance)
  storeToAttributes.set(StoreKlass, attrs)
  return useRecoilStoreInstance(storeInstance, attrs, props)
}

let curGetter: any = null

function getDescription(
  target: any,
  key: string,
  descriptor: TypedPropertyDescriptor<any>
): StoreAttribute {
  if (typeof descriptor.value === 'function') {
    return {
      type: 'action',
      key,
      value: descriptor.value,
    }
  } else if (typeof descriptor.get === 'function') {
    return {
      type: 'selector',
      key,
      value: selectorFamily({
        key,
        get: (props) => ({ get }) => {
          curGetter = get
          const res = descriptor.get!.call(target)
          console.log('returning now', props, res)
          curGetter = null
          return res
        },
      }),
    }
  }
  return {
    type: 'value',
    key,
    value: atomFamily({
      key,
      default: descriptor.value,
    }),
  }
}

function useRecoilStoreInstance(
  store: any,
  attrs: StoreAttributes,
  props: any
) {
  const { getSetRecoilState, getRecoilValue } = useRecoilInterface()
  const isMounted = useRef(false)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  return useMemo(() => {
    return new Proxy(store, {
      get(target, key) {
        return getProxyValue(target, key, attrs, getRecoilValue, props)
      },
      set(target, key, value, receiver) {
        if (isMounted.current === false) {
          return true
        }
        if (typeof key === 'string') {
          const prev = getRecoilValue(attrs[key].value(props))
          if (prev !== value) {
            console.log('setting', key, value)
            const setter = getSetRecoilState(attrs[key].value(props))
            setter(value)
          }
          return true
        }
        return Reflect.set(target, key, value, receiver)
      },
    })
  }, [])
}

function getProxyValue(
  target: any,
  key: string | number | symbol,
  attrs: StoreAttributes,
  getter: Function,
  props?: any
) {
  if (!getter) {
    console.log('no getter!?')
    return Reflect.get(target, key)
  }
  if (typeof key === 'string') {
    console.log('getProxyValue', props, getter, attrs[key].value)
    switch (attrs[key].type) {
      case 'action':
        return attrs[key].value
      case 'value':
      case 'selector':
        return getter(attrs[key].value(props))
    }
  }
  return Reflect.get(target, key)
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
