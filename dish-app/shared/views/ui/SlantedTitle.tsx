// TODO useTheme here and fix bugs
import React from 'react'
import { BoxProps, SizableTextProps, Title, useTextStyle } from 'snackui'

import { SlantedBox } from './SlantedBox'

export const SlantedTitle = ({
  size,
  sizeLineHeight,
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
  const [{ children, ...rest }, textProps] = useTextStyle(props as any, true)
  return (
    <SlantedBox alignSelf="flex-start" {...(rest as any)}>
      <Title
        fontWeight="900"
        size={size}
        sizeLineHeight={sizeLineHeight}
        {...textProps}
      >
        {children}
      </Title>
    </SlantedBox>
  )
}
