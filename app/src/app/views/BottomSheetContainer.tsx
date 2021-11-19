import { YStack, useTheme } from '@dish/ui'
import React from 'react'

import { drawerBorderRadius } from '../../constants/constants'
import { DrawerPortalProvider } from '../Portal'

// only renders on small views

export const BottomSheetContainer = (props: { children: any }) => {
  const theme = useTheme()
  return (
    <YStack
      width="100%"
      height="100%"
      flex={1}
      shadowColor={theme.shadowColor}
      shadowRadius={28}
      borderTopRightRadius={drawerBorderRadius}
      borderTopLeftRadius={drawerBorderRadius}
      pointerEvents="auto"
      backgroundColor={theme.cardBackgroundColor}
      overflow="hidden"
      position="relative"
    >
      <DrawerPortalProvider />
      {props.children}
    </YStack>
  )
}
