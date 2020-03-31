import React from 'react'
import { View } from 'react-native'

export type Spacing = 'sm' | 'md' | 'lg' | 'xl' | number | boolean

export function Spacer({
  size = 'md',
  flex,
}: {
  size?: Spacing
  flex?: boolean | number
}) {
  const sizePx = spaceToPx(size)
  if (flex) {
    return (
      <View
        style={{
          flex: flex === true ? 1 : flex,
          minWidth: sizePx,
          minHeight: sizePx,
        }}
      />
    )
  }
  return <View style={{ width: sizePx, height: sizePx }} />
}

export const spaceToPx = (space: Spacing) => {
  if (typeof space === 'boolean') return true ? 12 : 0
  return typeof space === 'number'
    ? space
    : space == 'sm'
    ? 8
    : space == 'lg'
    ? 16
    : space == 'xl'
    ? 24
    : 12
}
