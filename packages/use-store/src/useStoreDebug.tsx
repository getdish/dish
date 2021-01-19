import React, { useLayoutEffect } from 'react'

import { StoreInfo } from './interfaces'
import { Store } from './Store'
import { useStore } from './useStore'

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

export function useStoreDebug<A extends Store<B>, B>(
  StoreKlass: (new (props: B) => A) | (new () => A),
  props?: B,
  selector?: any
): A {
  useDebugStoreComponent(StoreKlass)
  return useStore(StoreKlass, props, selector)
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

export const shouldDebug = (component: any, info: StoreInfo) => {
  return DebugComponents.get(component)?.has(info.storeInstance.constructor)
}

export const DebugComponents = new WeakMap<any, Set<any>>()
export const DebugStores = new Set<any>()
