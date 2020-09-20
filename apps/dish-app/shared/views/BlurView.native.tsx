import { StackProps, VStack } from '@dish/ui'
import {
  BlurViewProperties,
  BlurView as NativeBlurView,
} from '@react-native-community/blur'
import React from 'react'
import { StyleSheet } from 'react-native'

export function BlurView({
  blurType = 'light',
  blurAmount = 10,
  reducedTransparencyFallbackColor,
  downsampleFactor,
  overlayColor,
  children,
  borderRadius,
  ...props
}: StackProps & BlurViewProperties) {
  return (
    <VStack borderRadius={borderRadius} {...props}>
      <NativeBlurView
        style={[StyleSheet.absoluteFill, { borderRadius, zIndex: -1 }]}
        {...{
          blurType,
          blurAmount,
          reducedTransparencyFallbackColor,
          downsampleFactor,
          overlayColor,
        }}
      />
      {children}
    </VStack>
  )
}
