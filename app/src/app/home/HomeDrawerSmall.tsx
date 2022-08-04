import { AppMapHeader } from '../AppMapHeader'
import { AppSearchBarInline } from '../AppSearchBarInline'
import { DrawerFrameBg } from './HomeDrawerFrame'
import { DrawerFrame, Spacer, YStack } from '@dish/ui'
import React from 'react'

export const HomeDrawerSmall = (props: any) => {
  return (
    <YStack pe="none" pos="relative" zi={100000000000}>
      <Spacer pe="none" size={400} />
      <AppMapHeader />
      <DrawerFrame>
        <DrawerFrameBg />
        <AppSearchBarInline />
        {props.children}
      </DrawerFrame>
    </YStack>
  )
}
