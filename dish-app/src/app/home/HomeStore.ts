import { Store, createStore, useStoreInstance } from '@dish/use-store'

class HomeStore extends Store {
  loading = false

  setLoading(n: boolean) {
    this.loading = n
  }
}

export const homeStore = createStore(HomeStore)
export const useHomeStore = () => useStoreInstance(homeStore)
