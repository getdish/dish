import React from 'react'
import { View } from 'react-native'

export function ZStack(props: { children: any }) {
  return <View style={{ position: 'absolute' }}>{props.children}</View>
}
