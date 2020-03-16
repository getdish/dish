import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'

// TODO spacing

export function ZStack({ children, ...props }: { children: any } & ViewStyle) {
  return <View style={{ ...props, position: 'absolute' }}>{children}</View>
}

export function HStack({ children, ...props }: { children: any } & ViewStyle) {
  return <View style={{ ...props, flexDirection: 'row' }}>{children}</View>
}

export function VStack({ children, ...props }: { children: any } & ViewStyle) {
  return <View style={{ ...props, flexDirection: 'column' }}>{children}</View>
}
