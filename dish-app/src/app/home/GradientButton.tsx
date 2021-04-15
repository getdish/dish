import React from 'react'
import { StyleSheet } from 'react-native'
import { AbsoluteVStack, HStack, LinearGradient } from 'snackui'

import { rgbString } from '../../helpers/rgbString'

export function GradientButton({
  rgb,
  children,
  bordered,
}: {
  rgb: readonly [number, number, number]
  children?: any
  bordered?: boolean
}) {
  // const themeName = useThemeName()
  // const isDark = themeName === 'dark'
  return (
    <HStack
      paddingVertical={12}
      paddingHorizontal={35}
      alignItems="center"
      justifyContent="center"
      borderRadius={10}
      borderWidth={bordered ? 1 : 0}
      backgroundColor="transparent"
      className="hover-parent ease-in-out-faster safari-fix-overflow"
      position="relative"
      overflow="hidden"
      // flexShrink={1}
      pressStyle={{
        transform: [{ scale: 0.98 }],
      }}
    >
      <AbsoluteVStack opacity={0.35} className="hover-50-opacity-child" fullscreen>
        <LinearGradient
          colors={[rgbString(rgb, 0.35), rgbString(rgb, 0.5)]}
          start={[0, 1]}
          end={[0, 0]}
          style={StyleSheet.absoluteFill}
        />
      </AbsoluteVStack>
      {children}
    </HStack>
  )
}
