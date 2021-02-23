import { sleep } from '@dish/async'
import { useOnMount } from 'snackui'

import { drawerStore } from '../../drawerStore'
import { homeStore } from '../../homeStore'

const snapToTopTypes = {}
const disposes = new Set<Function>()

export const useSnapToFullscreenOnMount = () => {
  useOnMount(() => {
    disposes.forEach((x) => x())
    disposes.clear()

    const myType = homeStore.currentStateType
    snapToTopTypes[myType] = true

    const prevIndex = drawerStore.snapIndex
    if (prevIndex === 0) {
      return
    }
    const tm = setTimeout(() => {
      drawerStore.setSnapIndex(0)
    }, 500)
    return () => {
      clearTimeout(tm)

      const promise = sleep(400)
      disposes.add(promise.cancel)
      promise.then(() => {
        if (!snapToTopTypes[homeStore.currentStateType]) {
          drawerStore.setSnapIndex(prevIndex)
        }
      })
    }
  })
}
