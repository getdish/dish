import { selectorFamily, useRecoilInterface } from '@o/recoil'
import { useMemo } from 'react'

const logAll: any = (...args) => console.log(...args)

type Descriptor =
  | { type: 'value'; value: any }
  | { type: 'action'; value: Function }
  | { type: 'selector'; value: Function }

const keys = new Set<string>()
const storeToRecoilStore = new WeakMap<any, any>()
const storeToDescriptors = new WeakMap<any, Descriptor[]>()

export function useRecoilStore<A extends Object>(
  store: new () => A,
  props?: any
): A {
  let recoilStore = storeToRecoilStore.get(store)
  if (recoilStore) {
    return useRecoilStoreInstance(recoilStore, storeToDescriptors.get(store)!)
  }
  const key = store.name
  if (keys.has(key)) throw new Error(`Store name already used`)
  const storeInstance = new store()
  const interceptor = (get: Function) =>
    new Proxy({}, { get: logAll, set: logAll })
  const descriptors = getStoreDescriptors(storeInstance).map<Descriptor>(
    (descriptor) => {
      if (typeof descriptor.value === 'function') {
        return {
          type: 'action',
          value: selectorFamily({
            key,
            get: (...args) => ({ get }) => {
              console.log('calling get with', { args })
              return descriptor.value.call(interceptor(get), ...args)
            },
          }),
        }
      } else if (typeof descriptor.get === 'function') {
        return {
          type: 'selector',
          value: selectorFamily,
        }
      }
      return {
        type: 'value',
        value: descriptor.value,
      }
    }
  )
  storeToRecoilStore.set(store, storeInstance)
  storeToDescriptors.set(store, descriptors)
  return useRecoilStoreInstance(storeInstance, descriptors)
}

function useRecoilStoreInstance(store: any, descriptors: Descriptor[]) {
  const {
    getSetRecoilState,
    getRecoilValue,
    getRecoilState,
  } = useRecoilInterface()
  return useMemo(
    () =>
      new Proxy(store, {
        get(target, key) {
          // return getRecoilValue(key)
          return Reflect.get(target, key)
        },
        set(target, key, value, receiver) {
          // return getSetRecoilState(key, value)
          return Reflect.set(target, key, value, receiver)
        },
      }),
    []
  )
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
  return Object.keys(descriptors).map((key) => descriptors[key])
}
