export function useRecoilStore<A>(store: new () => A): A {
  return useCreateRecoilStore(store)
}

const storeToRecoilStore = new WeakMap<any, any>()
const storeToRecoilHooks = new WeakMap<any, Function[]>()

function useCreateRecoilStore<A extends Object>(store: new () => A): A {
  let recoilStore = storeToRecoilStore.get(store)
  if (recoilStore) {
    const hooks = storeToRecoilHooks.get(store)!
    useRecoilStoreUpdateHooks(store, hooks)
    return recoilStore
  }
  const storeInstance = new store()
  const descriptors = getStoreDescriptors(storeInstance)
  const recoilObjects = {}

  for (const key in descriptors) {
    const descriptor = descriptors[key]
    if (typeof descriptor.value === 'function') {
    }
    recoilObjects[key]
  }

  const proxy = new Proxy(storeInstance, {
    get(target, val) {
      return Reflect.get(target, val)
    },
    set(target, key, value, receiver) {
      return Reflect.set(target, key, value, receiver)
    },
  })
  return proxy
}

function useRecoilStoreUpdateHooks(store: any, hooks: Function[]) {
  if (hooks) {
    for (const hook of hooks) {
      hook()
    }
  }
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
