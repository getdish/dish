import React from 'react'

import { Paragraph } from './Paragraph'
import { SizableTextProps, getSize } from './Size'

export type TitleProps = SizableTextProps

export const Title = (props: TitleProps) => {
  const size = getSize(props.size) * 2.5
  return (
    <Paragraph
      fontWeight={size > 3.5 ? '200' : '300'}
      {...props}
      marginVertical={0}
      size={size}
      sizeLineHeight={0.7}
    />
  )
}
