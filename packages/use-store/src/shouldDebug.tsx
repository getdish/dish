import { StoreInfo } from './types'

export const shouldDebug = (component: any, info: StoreInfo) => {
  return DebugComponents.get(component)?.has(info.storeInstance.constructor)
}

export const DebugComponents = new WeakMap<any, Set<any>>()
export const DebugStores = new Set<any>()
