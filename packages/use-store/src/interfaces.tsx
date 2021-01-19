export type Selector<A = unknown, B = unknown> = (x: A) => B

export type UseStoreSelector<Store, Res> = (store: Store) => Res
export type UseStoreOptions<Store = any, SelectorRes = any> = {
  selector?: UseStoreSelector<Store, SelectorRes>
  once?: boolean
}

export type StoreInfo = {
  source: any
  hasMounted: boolean
  storeInstance: any
  getters: { [key: string]: any }
  actions: any
  version: number
  stateKeys: string[]
  gettersState: {
    getCache: Map<string, any>
    getterToDeps: Map<string, Set<string>>
    depsToGetter: Map<string, Set<string>>
    curGetKeys: Set<string>
    isGetting: boolean
  }
}

export type UseStoreConfig = {
  logLevel?: 'debug' | 'info' | 'error'
}
