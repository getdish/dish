import { Store, createStore, useGlobalStore, useGlobalStoreSelector } from '@tamagui/use-store'

class AppStore extends Store {
  show = {
    // map: true,
    // slants: true,
    // images: true,
    // svg: true,
    // emoji: true,
    // ratings: true,
    // peek: true,
  }
}

export const appStore = createStore(AppStore)
export const useAppStore = () => useGlobalStore(appStore)
export const useAppShouldShow = (key: keyof AppStore['show']) =>
  useGlobalStoreSelector(appStore, (x) => x.show[key])
