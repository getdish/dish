import React from 'react'
import { View } from 'react-native'

export function Spacer({
  size = 'md',
  flex,
}: {
  size?: 'sm' | 'md' | 'lg' | number
  flex?: boolean | number
}) {
  if (flex) {
    return <View style={{ flex: flex === true ? 1 : flex }} />
  }
  const sizePx =
    typeof size === 'number' ? size : size == 'sm' ? 8 : size == 'lg' ? 16 : 12
  return <View style={{ width: sizePx, height: sizePx }} />
}
