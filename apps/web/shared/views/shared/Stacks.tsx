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
      style={{ ...props, position: 'absolute', ...(fullscreen && fsStyle) }}
    >
      {children}
    </View>
  )
}

export function HStack({ children, fullscreen, ...props }: StackBaseProps) {
  return (
    <View
      style={{ ...props, flexDirection: 'row', ...(fullscreen && fsStyle) }}
    >
      {children}
    </View>
  )
}

export function VStack({ children, fullscreen, ...props }: StackBaseProps) {
  return (
    <View
      style={{ ...props, flexDirection: 'column', ...(fullscreen && fsStyle) }}
    >
      {children}
    </View>
  )
}
