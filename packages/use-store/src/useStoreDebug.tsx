import React, { useLayoutEffect } from 'react'

import { StoreInfo } from './interfaces'

const {
  ReactCurrentOwner,
} = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
export const useCurrentComponent = () => {
  return ReactCurrentOwner &&
    ReactCurrentOwner.current &&
    ReactCurrentOwner.current.elementType
    ? ReactCurrentOwner.current.elementType
    : {}
}

export function useDebugStoreComponent(StoreCons: any) {
  const cmp = useCurrentComponent()
  useLayoutEffect(() => {
    DebugStores.add(StoreCons)
    if (!DebugComponents.has(cmp)) {
      DebugComponents.set(cmp, new Set())
    }
    const stores = DebugComponents.get(cmp)!
    stores.add(StoreCons)
    return () => {
      DebugStores.delete(StoreCons)
      stores.delete(StoreCons)
    }
  }, [])
}

export const shouldDebug = (component: any, storeInstance: any) => {
  return DebugComponents.get(component)?.has(storeInstance.constructor)
}

export const DebugComponents = new WeakMap<any, Set<any>>()
export const DebugStores = new Set<any>()
