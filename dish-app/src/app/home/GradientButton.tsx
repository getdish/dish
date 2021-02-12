import React from 'react'
import { StyleSheet } from 'react-native'
import { HStack, LinearGradient } from 'snackui'

import { rgbString } from '../../helpers/rgbString'

export function GradientButton({
  rgb,
  children,
}: {
  rgb: number[]
  children?: any
}) {
  return (
    <HStack
      paddingVertical={12}
      paddingHorizontal={18}
      alignItems="center"
      justifyContent="center"
      borderRadius={60}
      backgroundColor="transparent"
      className="ease-in-out-fast safari-fix-overflow"
      position="relative"
      overflow="hidden"
      flexShrink={1}
      pressStyle={{
        transform: [{ scale: 0.95 }],
      }}
      hoverStyle={{
        transform: [{ scale: 1.025 }],
      }}
    >
      <LinearGradient
        colors={[rgbString(rgb, 0.15), rgbString(rgb, 0.07)]}
        start={[1, 1]}
        end={[-1, 1]}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </HStack>
  )
}
