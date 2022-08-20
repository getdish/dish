import { searchBarHeight } from '../../constants/constants'
import { AppMapHeader } from '../AppMapHeader'
import { AppSearchBarInline } from '../AppSearchBarInline'
import { StackDrawerControlsPortal } from '../views/StackDrawer'
import { DrawerFrame, DrawerFrameBg } from './HomeDrawerFrame'
import { Spacer, YStack } from '@dish/ui'
import React from 'react'

export const HomeDrawerSmall = (props: any) => {
  return (
    <YStack pe="none" pos="relative" zi={100000000000}>
      <Spacer pe="none" size={400} />
      <AppMapHeader />
      <DrawerFrame>
        <YStack pos="relative" top={searchBarHeight}>
          <StackDrawerControlsPortal />
        </YStack>
        <DrawerFrameBg />
        <AppSearchBarInline />
        {props.children}
      </DrawerFrame>
    </YStack>
  )
}
