import React from 'react'
import { TextStyle } from 'react-native'

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

// TODO should we rework this a bit because size + sizeLineHeight may be a weird use case
// Paragraph.staticConfig = extendStaticConfig(Text, {
//   defaultStyle: defaultProps,
//   styleExpansionProps: {
//     size: getParagraphProps,
//   }
// })
