import { StackProps, VStack } from '@dish/ui'
import { BlurView as NativeBlurView } from '@react-native-community/blur'
import React from 'react'
import { StyleSheet } from 'react-native'

export function BlurView({ children, borderRadius, ...props }: StackProps) {
  return (
    <VStack borderRadius={borderRadius} {...props}>
      <NativeBlurView
        style={[StyleSheet.absoluteFill, { borderRadius, zIndex: -1 }]}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      />
      {children}
    </VStack>
  )
}
