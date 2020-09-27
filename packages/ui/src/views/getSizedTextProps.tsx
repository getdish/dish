import { TextStyle } from 'react-native'

import { ParagraphProps } from './Paragraph'
import { getSize } from './Size'

export const getSizedTextProps = ({
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
