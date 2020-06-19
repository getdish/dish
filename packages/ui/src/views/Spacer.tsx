import React, { memo } from 'react'
import { View, ViewStyle } from 'react-native'

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

const defaultProps: SpacerProps = {
  size: 'md',
  direction: 'both',
}

export const Spacer = memo((props: SpacerProps) => {
  return <View style={getStyle(props)} />
})

const getStyle = (props: SpacerProps = defaultProps): ViewStyle => {
  return {
    ...getFlex(props),
    ...getSize(props),
  }
}

const getFlex = ({ flex }: SpacerProps = defaultProps): ViewStyle => {
  return {
    flex: flex === true ? 1 : flex === false ? 0 : flex ?? 0,
  }
}

const getSize = ({ flex, size, direction } = defaultProps): ViewStyle => {
  const sizePx = spaceToPx(size ?? 0)
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
  defaultStyle: getStyle(),
  styleExpansionProps: {
    flex: getFlex,
    size: getSize,
  },
}

function spaceToPx(space: Spacing) {
  if (space === 'md' || space === true) return 12
  if (space == 'sm') return 8
  if (space == 'xs') return 4
  if (space == 'lg') return 16
  if (space == 'xl') return 24
  if (typeof space === 'number') return space
  if (typeof space === 'string') return space
  return 0
}
