import { drawerBorderRadius } from '../../constants/constants'
import { DrawerPortalProvider } from '../Portal'
import { YStack, isWeb, useTheme } from '@dish/ui'
import React from 'react'

// only renders on small views

export const BottomSheetContainer = (props: { children: any }) => {
  return (
    <YStack
      width="100%"
      height="100%"
      flex={1}
      shadowColor="$shadowColorFocus"
      boc="$borderColor"
      bw={1}
      shadowRadius={28}
      borderTopRightRadius={drawerBorderRadius}
      borderTopLeftRadius={drawerBorderRadius}
      pointerEvents="auto"
      overflow="hidden"
      position="relative"
      zIndex={10}
      className="blur"
    >
      <YStack fullscreen backgroundColor="$background" opacity={isWeb ? 0.65 : 1} />
      <DrawerPortalProvider />
      {props.children}
    </YStack>
  )
}
