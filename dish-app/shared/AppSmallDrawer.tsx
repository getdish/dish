import { useStore } from '@dish/use-store'
import React, { useEffect } from 'react'

import { AppSmallDrawerView } from './AppSmallDrawerView'
import { BottomDrawerStore } from './BottomDrawerStore'
import { omStatic } from './state/omStatic'

export const AppSmallDrawer = (props: { children: any }) => {
  const drawerStore = useStore(BottomDrawerStore)

  useEffect(() => {
    // let lastIndex: number
    let lastAutocomplete = omStatic.state.home.showAutocomplete
    return omStatic.reaction(
      (state) => state.home.showAutocomplete,
      (show) => {
        if (!!show) {
          drawerStore.setSnapPoint(0)
        } else {
          drawerStore.setSnapPoint(1)
        }
        lastAutocomplete = show
      }
    )
  }, [])

  return (
    <>
      <AppSmallDrawerView {...props} />
    </>
  )
}
