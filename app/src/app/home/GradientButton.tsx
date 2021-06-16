import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { AbsoluteVStack, HStack, LinearGradient } from 'snackui'

import { RGB, rgbString } from '../../helpers/rgb'

export function GradientButton({
  rgb,
  children,
  bordered,
}: {
  rgb: RGB
  children?: any
  bordered?: boolean
}) {
  // const themeName = useThemeName()
  // const isDark = themeName === 'dark'
  return (
    <HStack
      paddingVertical={12}
      paddingHorizontal={25}
      alignItems="center"
      justifyContent="center"
      borderRadius={50}
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
      {useMemo(() => {
        return (
          <AbsoluteVStack opacity={0.35} className="hover-50-opacity-child" fullscreen>
            <LinearGradient
              colors={[rgbString(rgb, 0.35), rgbString(rgb, 0.5)]}
              start={[0, 1]}
              end={[0, 0]}
              style={StyleSheet.absoluteFill}
            />
          </AbsoluteVStack>
        )
      }, [rgb])}
      {children}
    </HStack>
  )
}