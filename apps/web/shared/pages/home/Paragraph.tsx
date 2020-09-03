import { Text } from '@dish/ui'
import React from 'react'

import { SizableTextProps, getSize, sizes } from './Size'

export const Paragraph = ({
  size = 1,
  sizeLineHeight = 1,
  ...props
}: SizableTextProps) => {
  const sizeAmt = getSize(size)
  const lineHeightScaleWithSize = 1
  const lineHeight = 26.5 * sizeAmt * sizeLineHeight * lineHeightScaleWithSize
  return (
    <Text
      fontSize={16 * sizeAmt}
      lineHeight={lineHeight}
      marginVertical={-lineHeight * 0.1}
      color="rgba(0,0,0,0.85)"
      fontWeight="400"
      selectable
      {...props}
    />
  )
}
