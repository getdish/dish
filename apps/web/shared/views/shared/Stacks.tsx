import React from 'react'
import { View, StyleSheet, ViewStyle, ViewProps } from 'react-native'

// TODO spacing

const fsStyle = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

export type StackBaseProps = Omit<
  ViewStyle &
    ViewProps & {
      fullscreen?: boolean
      children?: any
    },
  // because who tf uses alignContent
  'alignContent'
>

export function ZStack({
  children,
  fullscreen,
  pointerEvents,
  ...props
}: StackBaseProps) {
  return (
    <View
      pointerEvents={pointerEvents}
      style={{ position: 'absolute', ...(fullscreen && fsStyle), ...props }}
    >
      {children}
    </View>
  )
}

export function HStack({
  children,
  fullscreen,
  pointerEvents,
  ...props
}: StackBaseProps) {
  return (
    <View
      pointerEvents={pointerEvents}
      style={{ flexDirection: 'row', ...(fullscreen && fsStyle), ...props }}
    >
      {children}
    </View>
  )
}

export function VStack({
  children,
  fullscreen,
  pointerEvents,
  ...props
}: StackBaseProps) {
  return (
    <View
      pointerEvents={pointerEvents}
      style={{ flexDirection: 'column', ...(fullscreen && fsStyle), ...props }}
    >
      {children}
    </View>
  )
}
