import React from 'react'
import { View, StyleSheet, ViewStyle, ViewProps } from 'react-native'

// TODO spacing

const fsStyle = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

export type StackBaseProps = { children: any } & ViewStyle &
  ViewProps & { fullscreen?: boolean }

export function ZStack({ children, fullscreen, ...props }: StackBaseProps) {
  return (
    <View
      style={{ position: 'absolute', ...(fullscreen && fsStyle), ...props }}
    >
      {children}
    </View>
  )
}

export function HStack({ children, fullscreen, ...props }: StackBaseProps) {
  return (
    <View
      style={{ flexDirection: 'row', ...(fullscreen && fsStyle), ...props }}
    >
      {children}
    </View>
  )
}

export function VStack({ children, fullscreen, ...props }: StackBaseProps) {
  return (
    <View
      style={{ flexDirection: 'column', ...(fullscreen && fsStyle), ...props }}
    >
      {children}
    </View>
  )
}
