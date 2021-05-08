import React from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { useTheme } from '../hooks/useTheme'
import { getSizedTextProps } from './getSizedTextProps'
import { SizableTextProps } from './Size'
import { Text } from './Text'

export type ParagraphProps = SizableTextProps

const defaultProps: ParagraphProps = {
  fontWeight: '400',
  selectable: true,
  size: 'md',
}

export const Paragraph = (props: SizableTextProps) => {
  const theme = useTheme()
  return <Text {...defaultProps} color={theme.color} {...getSizedTextProps(props)} {...props} />
}

if (process.env.IS_STATIC) {
  // @ts-ignore
  Paragraph.staticConfig = extendStaticConfig(Text, {
    defaultProps,
    neverFlatten: true,
  })
}
