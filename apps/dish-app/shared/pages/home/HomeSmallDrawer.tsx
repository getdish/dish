import { useStore } from '@dish/use-store'
import React, { useEffect } from 'react'

import { omStatic } from '../../state/omStatic'
import { BottomDrawerStore } from './BottomDrawerStore'
import { HomeSmallDrawerView } from './HomeSmallDrawerView'
import { getIs } from './useIs'

export const HomeSmallDrawer = (props: { children: any }) => {
  const drawerStore = useStore(BottomDrawerStore)

  useEffect(() => {
    // let lastIndex: number
    let lastAutocomplete = omStatic.state.home.showAutocomplete
    return omStatic.reaction(
      (state) => state.home.showAutocomplete,
      (show) => {
        const isReallySmall = getIs('xs')
        const isShort = getIs('sm')
        const defaultSnapPoint = isShort && isReallySmall ? 0 : 1
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
