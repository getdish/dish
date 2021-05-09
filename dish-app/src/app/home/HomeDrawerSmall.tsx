import { reaction } from '@dish/use-store'
import React, { useEffect } from 'react'
import { Keyboard } from 'react-native'

import { autocompletesStore } from '../AutocompletesStore'
import { drawerStore } from '../drawerStore'
import { HomeDrawerSmallView } from './HomeDrawerSmallView'

export const HomeDrawerSmall = (props: { children: any }) => {
  useEffect(() => {
    return reaction(
      autocompletesStore,
      (x) => x.visible,
      function autocompleteVisibleToSnapAndKeyboard(visible) {
        if (visible === true) {
          if (drawerStore.snapIndex !== 0) {
            drawerStore.setSnapIndex(0)
          }
        } else {
          if (drawerStore.snapIndex !== 1) {
            drawerStore.setSnapIndex(1)
          }
          Keyboard.dismiss()
        }
      }
    )
  }, [])

  return (
    <>
      <HomeDrawerSmallView {...props} />
    </>
  )
}
