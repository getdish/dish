// TODO useTheme here and fix bugs
import React from 'react'
import { BoxProps, SizableTextProps, Title } from 'snackui'

import { SlantedBox } from './SlantedBox'

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
