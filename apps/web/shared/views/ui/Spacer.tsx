import React, { memo } from 'react'
import { View } from 'react-native'

export type Spacing =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | number
  | boolean
  | string

export const Spacer = memo(
  ({
    size = 'md',
    direction = 'both',
    flex,
  }: {
    size?: Spacing
    flex?: boolean | number
    direction?: 'vertical' | 'horizontal' | 'both'
  }) => {
    const sizePx = spaceToPx(size)
    const width = direction == 'vertical' ? 1 : sizePx
    const height = direction == 'horizontal' ? 1 : sizePx
    if (flex) {
      return (
        <View
          style={{
            flex: flex === true ? 1 : flex,
            minWidth: width,
            minHeight: height,
          }}
        />
      )
    }
    return <View style={{ width, height }} />
  }
)

export const spaceToPx = (space: Spacing) => {
  if (space === 'md' || space === true) return 12
  if (space == 'sm') return 8
  if (space == 'xs') return 4
  if (space == 'lg') return 16
  if (space == 'xl') return 24
  if (typeof space === 'number') return space
  if (typeof space === 'string') return space
  return 0
}
