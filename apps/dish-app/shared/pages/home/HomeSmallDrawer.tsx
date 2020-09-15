import { useStore } from '@dish/use-store'
import React, { useEffect } from 'react'

import { omStatic } from '../../state/om'
import { BottomDrawerStore } from './BottomDrawerStore'
import { HomeSmallDrawerView } from './HomeSmallDrawerView'
import {
  useMediaQueryIsReallySmall,
  useMediaQueryIsShort,
} from './useMediaQueryIs'

export const HomeSmallDrawer = (props: { children: any }) => {
  const drawerStore = useStore(BottomDrawerStore)
  const isReallySmall = useMediaQueryIsReallySmall()
  const isShort = useMediaQueryIsShort()
  const defaultSnapPoint = isShort && isReallySmall ? 0 : 1

  useEffect(() => {
    // let lastIndex: number
    let lastAutocomplete = omStatic.state.home.showAutocomplete
    return omStatic.reaction(
      (state) => state.home.showAutocomplete,
      (show) => {
        if (!!show) {
          // lastIndex = snapIndex
          drawerStore.setSnapPoint(0)
        } else {
          if (lastAutocomplete === 'search') {
            drawerStore.setSnapPoint(defaultSnapPoint)
          }
        }
        lastAutocomplete = show
      }
    )
  }, [])

  return <HomeSmallDrawerView {...props} />
}
