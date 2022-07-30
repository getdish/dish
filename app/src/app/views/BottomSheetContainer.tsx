import { drawerBorderRadius } from '../../constants/constants'
import { DrawerPortalProvider } from '../Portal'
import { YStack, YStackProps } from '@dish/ui'
import React from 'react'

export const BottomSheetContainer = ({ children, ...props }: YStackProps) => {
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
      position="relative"
      zIndex={10}
      className="blur"
      {...props}
    >
      <DrawerPortalProvider />
      {children}
    </YStack>
  )
}
