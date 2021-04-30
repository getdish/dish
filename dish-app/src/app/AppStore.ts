import { Store, createStore, useStoreInstance, useStoreInstanceSelector } from '@dish/use-store'

class AppStore extends Store {
  show = {
    map: true,
    slants: true,
    images: true,
    svg: true,
    emoji: true,
  }
}

export const appStore = createStore(AppStore)
export const useAppStore = () => useStoreInstance(appStore)
export const useAppShouldShow = (key: keyof AppStore['show']) =>
  useStoreInstanceSelector(appStore, (x) => x.show[key])
