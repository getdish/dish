import React, { forwardRef } from 'react'
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

export const ZStack = forwardRef<View, StackBaseProps>(
  ({ children, fullscreen, pointerEvents, style = null, ...props }, ref) => {
    return (
      <View
        ref={ref}
        pointerEvents={pointerEvents}
        style={[
          {
            position: 'absolute',
            ...(fullscreen && fsStyle),
            ...props,
          },
          style,
        ]}
      >
        {children}
      </View>
    )
  }
)

export const HStack = forwardRef<View, StackBaseProps>(
  ({ children, fullscreen, pointerEvents, style = null, ...props }, ref) => {
    return (
      <View
        ref={ref}
        pointerEvents={pointerEvents}
        style={[
          {
            flexDirection: 'row',
            ...(fullscreen && fsStyle),
            ...props,
          },
          style,
        ]}
      >
        {children}
      </View>
    )
  }
)

export const VStack = forwardRef<View, StackBaseProps>(
  ({ children, fullscreen, pointerEvents, style = null, ...props }, ref) => {
    return (
      <View
        ref={ref}
        pointerEvents={pointerEvents}
        style={[
          {
            flexDirection: 'column',
            ...(fullscreen && fsStyle),
            ...props,
          },
          style,
        ]}
      >
        {children}
      </View>
    )
  }
)
