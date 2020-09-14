import { BoxProps } from '@dish/ui'
import React from 'react'

import { SizableTextProps } from './Size'
import { SlantedBox, slantedBoxStyle } from './SlantedBox'
import { Title } from './Title'

export const SlantedTitle = ({
  children,
  size,
  sizeLineHeight,
  color,
  lineHeight,
  fontSize,
  fontWeight,
  ...props
}: Omit<BoxProps, 'color'> &
  Partial<
    Pick<
      SizableTextProps,
      | 'size'
      | 'sizeLineHeight'
      | 'color'
      | 'lineHeight'
      | 'fontSize'
      | 'fontWeight'
    >
  >) => {
  const textProps = {
    children,
    size,
    sizeLineHeight,
    color: color as any,
    lineHeight,
    fontSize,
    fontWeight,
  }
  return (
    <SlantedBox alignSelf="flex-start" {...props}>
      <Title {...textProps} />
    </SlantedBox>
  )
}
