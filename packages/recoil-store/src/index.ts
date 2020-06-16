import {
  RecoilState,
  RecoilValueReadOnly,
  atom,
  selector,
  useRecoilInterface,
} from '@o/recoil'
import { useMemo } from 'react'

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
  | { type: 'value'; key: string; value: RecoilState<any> }
  | { type: 'action'; key: string; value: Function }
  | { type: 'selector'; key: string; value: RecoilValueReadOnly<any> }

type StoreAttributes = { [key: string]: StoreAttribute }

const keys = new Set<string>()
const storeToRecoilStore = new WeakMap<any, any>()
const storeToAttributes = new WeakMap<any, StoreAttributes>()

export function useRecoilStore<A extends Store<B>, B>(
  StoreKlass: new (props?: B) => A,
  props?: B
): A {
  let recoilStore = storeToRecoilStore.get(StoreKlass)
  if (recoilStore) {
    return useRecoilStoreInstance(
      recoilStore,
      storeToAttributes.get(StoreKlass)!
    )
  }
  const storeName = StoreKlass.name
  if (keys.has(storeName)) {
    throw new Error(`Store name already used`)
  }
  const storeInstance = new StoreKlass(props as any)
  const descriptors = getStoreDescriptors(storeInstance)
  const attrs: StoreAttributes = {}
  const storeProxy = new Proxy(storeInstance, {
    get(target, key) {
      return getProxyValue(target, key, attrs, curGetter)
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
  return useRecoilStoreInstance(storeInstance, attrs)
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
      value: selector({
        key,
        get: ({ get }) => {
          curGetter = get
          const res = descriptor.get!.call(target)
          curGetter = null
          return res
        },
      }),
    }
  }
  return {
    type: 'value',
    key,
    value: atom({
      key,
      default: descriptor.value,
    }),
  }
}

function useRecoilStoreInstance(store: any, attrs: StoreAttributes) {
  const { getSetRecoilState, getRecoilValue } = useRecoilInterface()
  return useMemo(() => {
    return new Proxy(store, {
      get(target, key) {
        return getProxyValue(target, key, attrs, getRecoilValue)
      },
      set(target, key, value, receiver) {
        if (typeof key === 'string') {
          const setter = getSetRecoilState(attrs[key].value)
          setter(value)
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
  getter: Function
) {
  if (typeof key === 'string') {
    switch (attrs[key].type) {
      case 'action':
        return attrs[key].value
      case 'value':
      case 'selector':
        return getter(attrs[key].value)
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
  delete descriptors.constructor
  return descriptors
}
