import { searchBarHeight } from '../../constants/constants'
import { AppSearchBarInline } from '../AppSearchBarInline'
import { StackDrawerControlsPortal } from '../views/StackDrawer'
import { DrawerFrame, DrawerFrameBg } from './HomeDrawerFrame'
import { Spacer, YStack } from '@dish/ui'
import React from 'react'

export const HomeDrawerSmall = (props: any) => {
  return (
    <YStack f={1} bc="green" h="100%" pe="none" pos="relative" zi={100000000000}>
      <Spacer pointerEvents="none" size={400} />
      <DrawerFrame bc="red">
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
