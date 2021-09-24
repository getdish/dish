import * as USES from 'use-sync-external-store'

export const useSyncExternalStore = (store: any, getSnapshot: any) => {
  return USES.useSyncExternalStore(store.subscribe.bind(store), getSnapshot)
}
