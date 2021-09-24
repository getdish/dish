import { useCallback, useMemo } from 'react'

import { createMutableSource, useMutableSource } from './useMutableSource'

const mutableSources = new WeakMap()

export const useSyncExternalStore = (store: any, getSnapshot: any) => {
  if (!mutableSources.has(store)) {
    mutableSources.set(
      store,
      createMutableSource(store, () => store['_version'])
    )
  }
  const mutableSource = mutableSources.get(store)!
  const subscribe = useCallback((store, cb) => store.subscribe(cb), [store])
  return useMutableSource(mutableSource, getSnapshot, subscribe)
}
