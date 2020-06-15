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

export type SpacerProps = {
  size?: Spacing
  flex?: boolean | number
  direction?: 'vertical' | 'horizontal' | 'both'
}

export const Spacer = memo((props: SpacerProps) => {
  const flexProps = getFlex(props)
  const sizeProps = getSize(props)
  // @ts-ignore
  return <View style={{ ...flexProps, ...sizeProps }} />
})

const getFlex = ({ flex }: SpacerProps) => {
  return { flex: flex === true ? 1 : flex }
}

const getSize = ({ flex, size = 'md', direction = 'both' }: SpacerProps) => {
  const sizePx = spaceToPx(size)
  const width = direction == 'vertical' ? 1 : sizePx
  const height = direction == 'horizontal' ? 1 : sizePx
  if (flex) {
    return {
      minWidth: width,
      minHeight: height,
    }
  }
  return { width, height }
}

// @ts-ignore
Spacer.staticConfig = {
  styleExpansionProps: {
    flex: getFlex,
    size: getSize,
  },
}

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
