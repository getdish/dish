import { useRecoilInterface } from 'recoil'

export function useRecoilStore<A>(store: new () => A): A {
  return useCreateRecoilStore(store)
}

const storeToRecoilStore = new WeakMap<any, any>()
const storeToRecoilRun = new WeakMap<any, Function>()

function useCreateRecoilStore<A extends Object>(store: new () => A): A {
  let recoilStore = storeToRecoilStore.get(store)
  if (recoilStore) {
    const run = storeToRecoilRun.get(store)!
    run()
    return recoilStore
  }
  const storeInstance = new store()
  const descriptors = getStoreDescriptors(storeInstance)
  type ClassPropertyType = 'value' | 'action' | 'selector'
  const keyToType: { [key: string]: ClassPropertyType } = {}

  for (const key in descriptors) {
    const descriptor = descriptors[key]
    const type: ClassPropertyType =
      typeof descriptor.value === 'function'
        ? 'action'
        : typeof descriptor.get === 'function'
        ? 'selector'
        : 'value'
    switch (type) {
      case 'action': {
        break
      }
      case 'selector': {
        break
      }
      case 'value': {
        break
      }
    }
  }

  let tracking = new Set<string>()

  const wrappedStore = new Proxy(storeInstance, {
    get(target, key) {
      if (typeof key === 'string') {
        tracking.add(key)
      }
      return Reflect.get(target, key)
    },
    set(target, key, value, receiver) {
      return Reflect.set(target, key, value, receiver)
    },
  })

  const run = () => {
    const {
      getRecoilValue,
      getRecoilState,
      getSetRecoilState,
    } = useRecoilInterface()
    tracking = new Set<string>()
  }

  storeToRecoilStore.set(store, wrappedStore)
  storeToRecoilRun.set(store, run)

  return wrappedStore
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
