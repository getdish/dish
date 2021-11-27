import { drawerBorderRadius } from '../../constants/constants'
import { DrawerPortalProvider } from '../Portal'
import { YStack, useTheme } from '@dish/ui'
import React from 'react'

// only renders on small views

export const BottomSheetContainer = (props: { children: any }) => {
  return (
    <YStack
      width="100%"
      height="100%"
      flex={1}
      shadowColor="$shadowColor"
      shadowRadius={28}
      borderTopRightRadius={drawerBorderRadius}
      borderTopLeftRadius={drawerBorderRadius}
      pointerEvents="auto"
      overflow="hidden"
      position="relative"
      className="blur"
    >
      <YStack fullscreen backgroundColor="$bg" opacity={0.65} />
      <DrawerPortalProvider />
      {props.children}
    </YStack>
  )
}
