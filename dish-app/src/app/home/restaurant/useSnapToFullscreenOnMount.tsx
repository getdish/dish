import { useOnMount } from 'snackui'

import { drawerStore } from '../../drawerStore'

export const useSnapToFullscreenOnMount = () => {
  useOnMount(() => {
    const prevIndex = drawerStore.snapIndex
    if (prevIndex === 0) {
      return
    }
    const tm = setTimeout(() => {
      drawerStore.setSnapIndex(0)
    }, 350)
    return () => {
      clearTimeout(tm)
      drawerStore.setSnapIndex(prevIndex)
    }
  })
}
