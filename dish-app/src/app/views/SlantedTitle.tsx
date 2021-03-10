// TODO useTheme here and fix bugs
import React from 'react'
import { BoxProps, SizableTextProps, Title, useTextStyle } from 'snackui'

import { SlantedBox } from './SlantedBox'

export type SlantedTitleProps = Omit<BoxProps, 'color'> &
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
  >

export const SlantedTitle = ({
  size,
  sizeLineHeight,
  ...props
}: SlantedTitleProps) => {
  const [{ children, ...rest }, textProps] = useTextStyle(props as any, true)
  return (
    <SlantedBox alignSelf="flex-start" {...(rest as any)}>
      <Title
        fontWeight="800"
        size={size}
        sizeLineHeight={sizeLineHeight}
        textAlign="center"
        {...textProps}
      >
        {children}
      </Title>
    </SlantedBox>
  )
}
