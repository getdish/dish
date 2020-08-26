import { Text } from '@dish/ui'
import React from 'react'

import { SizableTextProps, getSize } from './Size'

export const Paragraph = ({
  size = 1,
  sizeLineHeight = 1,
  ...props
}: SizableTextProps) => {
  return (
    <Text
      fontSize={16 * getSize(size)}
      lineHeight={26 * getSize(size) * sizeLineHeight}
      color="rgba(0,0,0,0.85)"
      fontWeight="400"
      selectable
      {...props}
    />
  )
}
