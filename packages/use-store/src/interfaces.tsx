export type Selector<A = unknown, B = unknown> = (x: A) => B

export type UseStoreSelector<Store, Res> = (store: Store) => Res
export type UseStoreOptions<Store = any, SelectorRes = any> = {
  debug?: boolean
  selector?: UseStoreSelector<Store, SelectorRes>
  once?: boolean
}

export type StoreInfo<A = any> = {
  // proxied store
  store: A
  source: any
  storeInstance: any
  getters: { [key: string]: any }
  actions: any
  getVersion(): number
  triggerUpdate(): void
  stateKeys: string[]
  gettersState: {
    getCache: Map<string, any>
    depsToGetter: Map<string, Set<string>>
    curGetKeys: Set<string>
    isGetting: boolean
  }
}

export type UseStoreConfig = {
  logLevel?: 'debug' | 'info' | 'error'
}
