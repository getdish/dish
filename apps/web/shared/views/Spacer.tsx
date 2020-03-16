import React from 'react'
import { View } from 'react-native'

export function Spacer({
  size = 'md',
  flex,
}: {
  size?: 'sm' | 'md' | 'lg'
  flex?: boolean
}) {
  if (flex) {
    return <View style={{ flex: 1 }} />
  }
  const sizePx = size == 'sm' ? 8 : size == 'lg' ? 16 : 12
  return <View style={{ width: sizePx, height: sizePx }} />
}
