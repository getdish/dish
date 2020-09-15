import { StackProps, VStack } from '@dish/ui'
import { BlurView } from '@react-native-community/blur'
import React from 'react'

import { drawerBorderRadius } from '../../constants'
import { styles } from '../../styles'

export const BottomSheetContainer = ({ children, ...props }: StackProps) => {
  return (
    <VStack
      width="100%"
      height="100%"
      shadowColor="rgba(0,0,0,0.4)"
      shadowRadius={34}
      borderTopRightRadius={drawerBorderRadius}
      borderTopLeftRadius={drawerBorderRadius}
      backgroundColor="rgba(255,255,255,0.9)"
      {...props}
    >
      <BlurView
        style={[styles.fullscreen, { borderRadius: drawerBorderRadius }]}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      >
        {children}
      </BlurView>
    </VStack>
  )
}
