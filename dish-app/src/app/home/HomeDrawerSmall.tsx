import { reaction } from '@dish/use-store'
import React, { useEffect } from 'react'

import { autocompletesStore } from '../AutocompletesStore'
import { drawerStore } from '../drawerStore'
import { HomeDrawerSmallView } from './HomeDrawerSmallView'

export const HomeDrawerSmall = (props: { children: any }) => {
  useEffect(() => {
    return reaction(
      autocompletesStore,
      (x) => x.visible,
      (visible) => {
        if (visible === true) {
          drawerStore.setSnapIndex(0)
        } else {
          drawerStore.setSnapIndex(1)
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
