import { sleep } from '@dish/async'
import { useOnMount } from 'snackui'

import { isWeb } from '../../../constants/constants'
import { supportsTouchWeb } from '../../../constants/platforms'
import { drawerStore } from '../../drawerStore'
import { homeStore } from '../../homeStore'

const snapToTopTypes = {}
const disposes = new Set<Function>()

export const useSnapToFullscreenOnMount = () => {
  if (isWeb && !supportsTouchWeb) {
    console.log('disable useSnapToFullscreenOnMount')
    return
  }
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
    }, 350)

    // return () => {
    //   clearTimeout(tm)

    //   const promise = sleep(400)
    //   disposes.add(promise.cancel)
    //   promise.then(() => {
    //     if (!snapToTopTypes[homeStore.currentStateType]) {
    //       drawerStore.setSnapIndex(prevIndex)
    //     }
    //   })
    // }
  })
}
