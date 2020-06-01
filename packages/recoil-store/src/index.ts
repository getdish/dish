import {
  RecoilState,
  RecoilValueReadOnly,
  atom,
  selector,
  selectorFamily,
  useRecoilInterface,
} from '@o/recoil'
import { useMemo } from 'react'

export { RecoilRoot } from '@o/recoil'

type StoreAttribute =
  | { type: 'value'; key: string; value: RecoilState<any> }
  | { type: 'action'; key: string; value: Function }
  | { type: 'selector'; key: string; value: RecoilValueReadOnly<any> }

type StoreAttributes = { [key: string]: StoreAttribute }

const keys = new Set<string>()
const storeToRecoilStore = new WeakMap<any, any>()
const storeToAttributes = new WeakMap<any, StoreAttributes>()

export function useRecoilStore<A extends Object>(
  store: new () => A,
  props?: any
): A {
  let recoilStore = storeToRecoilStore.get(store)
  if (recoilStore) {
    return useRecoilStoreInstance(recoilStore, storeToAttributes.get(store)!)
  }
  const storeName = store.name
  if (keys.has(storeName)) {
    throw new Error(`Store name already used`)
  }
  const storeInstance = new store()
  const descriptors = getStoreDescriptors(storeInstance)
  const attrs: StoreAttributes = {}
  for (const prop in descriptors) {
    attrs[prop] = getDescription(`${storeName}/${prop}`, descriptors[prop])
  }
  storeToRecoilStore.set(store, storeInstance)
  storeToAttributes.set(store, attrs)
  return useRecoilStoreInstance(storeInstance, attrs)
}

function getDescription(
  key: string,
  descriptor: TypedPropertyDescriptor<any>
): StoreAttribute {
  if (typeof descriptor.value === 'function') {
    return {
      type: 'action',
      key,
      value: descriptor.value,
      // selectorFamily({
      //   key,
      //   get: (...args) => ({ get }) => {
      //     console.log('calling get with', { args })
      //     return descriptor.value.call(interceptor(get), ...args)
      //   },
      // }),
    }
  } else if (typeof descriptor.get === 'function') {
    return {
      type: 'selector',
      key,
      value: selector({
        key,
        get: descriptor.get,
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
        if (typeof key === 'string') {
          switch (attrs[key].type) {
            case 'action':
              return attrs[key].value
            case 'value':
              return getRecoilValue(attrs[key].value)
          }
        }
        return Reflect.get(target, key)
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
