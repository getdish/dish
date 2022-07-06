import { drawerBorderRadius } from '../../constants/constants'
import { DrawerPortalProvider } from '../Portal'
import { Square, YStack, isWeb, useTheme } from '@dish/ui'
import React from 'react'
import { View } from 'react-native'

// only renders on small views

export const BottomSheetContainer = (props: { children: any }) => {
  return (
    <YStack
      width="100%"
      height="100%"
      flex={1}
      boc="$borderColor"
      bw={1}
      borderTopRightRadius={drawerBorderRadius}
      borderTopLeftRadius={drawerBorderRadius}
      pointerEvents="auto"
      bc="$background"
      elevation="$4"
      // overflow="hidden"
      position="relative"
      zIndex={10}
      className="blur"
    >
      <DrawerPortalProvider />
      {props.children}
    </YStack>
  )
}
