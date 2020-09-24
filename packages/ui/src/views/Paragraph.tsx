import React from 'react'
import { TextStyle } from 'react-native'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { SizableTextProps, getSize } from './Size'
import { Text } from './Text'

export type ParagraphProps = SizableTextProps

export const Paragraph = (props: SizableTextProps) => {
  return <Text {...defaultProps} {...getParagraphProps(props)} {...props} />
}

const defaultProps: ParagraphProps = {
  color: 'rgba(0,0,0,0.85)',
  fontWeight: '400',
  selectable: true,
}

const getParagraphProps = ({
  size = 1,
  sizeLineHeight = 1,
}: ParagraphProps): TextStyle => {
  const sizeAmt = getSize(size)
  // get a little less spaced as we go higher
  const lineHeightScaleWithSize = -(2 - sizeAmt) * 0.6
  const lineHeight = (26.5 + lineHeightScaleWithSize) * sizeAmt * sizeLineHeight
  return {
    fontSize: 16 * sizeAmt,
    lineHeight,
    marginVertical: -lineHeight * 0.08,
  }
}

if (process.env.IS_STATIC) {
  Paragraph.staticConfig = extendStaticConfig(Text, {
    defaultProps,
    expansionProps: {
      size: getParagraphProps,
      sizeLineHeight: getParagraphProps,
    },
  })
}
