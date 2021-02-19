import { sleep } from '@dish/async'
import { useOnMount } from 'snackui'

import { drawerStore } from '../../drawerStore'
import { homeStore } from '../../homeStore'

const activeTypes = {}
const disposes = new Set<Function>()

export const useSnapToFullscreenOnMount = () => {
  useOnMount(() => {
    disposes.forEach((x) => x())
    const myType = homeStore.currentStateType
    activeTypes[myType] = true

    const prevIndex = drawerStore.snapIndex
    if (prevIndex === 0) {
      return
    }
    const tm = setTimeout(() => {
      drawerStore.setSnapIndex(0)
    }, 350)
    return () => {
      clearTimeout(tm)

      // const promise = sleep(300)
      // disposes.add(promise.cancel)
      // promise.then(() => {
      //   if (activeTypes[homeStore.currentStateType]) {
      //     drawerStore.setSnapIndex(prevIndex)
      //   }
      // })
    }
  })
}
