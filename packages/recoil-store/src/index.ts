import { useMemo } from 'react'
import { selectorFamily, useRecoilInterface } from 'recoil'

type Descriptor =
  | { type: 'value'; value: any }
  | { type: 'action'; value: Function }
  | { type: 'selector'; value: Function }

const keys = new Set<string>()
const storeToRecoilStore = new WeakMap<any, any>()
const storeToDescriptors = new WeakMap<any, Descriptor[]>()

export function useRecoilStore<A extends Object>(store: new () => A): A {
  let recoilStore = storeToRecoilStore.get(store)
  if (recoilStore) {
    return useRecoilStoreInstance(recoilStore, storeToDescriptors.get(store)!)
  }
  const key = store.name
  if (keys.has(key)) throw new Error(`Store name already used`)
  const storeInstance = new store()
  console.log('name', store.name)
  const descriptors = getStoreDescriptors(storeInstance).map<Descriptor>(
    (descriptor) => {
      if (typeof descriptor.value === 'function') {
        return {
          type: 'action',
          value: descriptor.value,
          // value: selectorFamily({ key, get: (...args) => ({ get }) => {
          //   return descriptor.value.call(interceptor, ...args)
          // } })
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
