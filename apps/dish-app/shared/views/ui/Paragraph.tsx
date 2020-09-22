import { Text } from '@dish/ui'
import React from 'react'

import { SizableTextProps, getSize } from './Size'

export type ParagraphProps = SizableTextProps

export const Paragraph = ({
  size = 1,
  sizeLineHeight = 1,
  ...props
}: SizableTextProps) => {
  const sizeAmt = getSize(size)
  // get a little less spaced as we go higher
  const lineHeightScaleWithSize = -(2 - sizeAmt) * 0.6
  const lineHeight = (26.5 + lineHeightScaleWithSize) * sizeAmt * sizeLineHeight
  return (
    <Text
      fontSize={16 * sizeAmt}
      lineHeight={lineHeight}
      marginVertical={-lineHeight * 0.08}
      color="rgba(0,0,0,0.85)"
      fontWeight="400"
      selectable
      {...props}
    />
  )
}
