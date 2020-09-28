import { BlurView, StackProps, VStack } from '@dish/ui'
import React from 'react'

import { drawerBorderRadius } from './constants'

export const BottomSheetContainer = ({ children, ...props }: StackProps) => {
  return (
    <VStack
      width="100%"
      height="100%"
      shadowColor="rgba(0,0,0,0.15)"
      shadowRadius={20}
      borderTopRightRadius={drawerBorderRadius}
      borderTopLeftRadius={drawerBorderRadius}
      backgroundColor="rgba(255,255,255,0.64)"
      {...props}
    >
      <BlurView
        borderRadius={drawerBorderRadius}
        position="absolute"
        bottom={0}
        top={0}
        left={0}
        right={0}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      >
        {children}
      </BlurView>
    </VStack>
  )
}
