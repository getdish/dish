import React from 'react'
import { BoxProps, SizableTextProps, Title, useTextProps } from 'snackui'

import { isStringChild } from '../../helpers/isStringChild'
import { SlantedBox } from './SlantedBox'

export type SlantedTitleProps = Omit<BoxProps, 'color'> &
  Partial<
    Pick<
      SizableTextProps,
      'size' | 'sizeLineHeight' | 'color' | 'lineHeight' | 'fontSize' | 'fontWeight'
    >
  >

export const SlantedTitle = ({ size, sizeLineHeight, ...props }: SlantedTitleProps) => {
  const [{ children, ...rest }, textStyle] = useTextProps(props as any, true)

  return (
    <SlantedBox alignSelf="flex-start" {...(rest as any)}>
      {isStringChild(children) ? (
        <Title
          fontWeight="800"
          size={size}
          sizeLineHeight={sizeLineHeight}
          textAlign="center"
          {...textStyle}
        >
          {children}
        </Title>
      ) : (
        children
      )}
    </SlantedBox>
  )
}
