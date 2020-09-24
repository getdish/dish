import React from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { Text, TextProps } from './Text'

const defaultProps: TextProps = {
  fontWeight: '600',
}

export const TextStrong = (props: TextProps) => {
  return <Text {...defaultProps} {...props} />
}

if (process.env.IS_STATIC) {
  TextStrong.staticConfig = extendStaticConfig(Text, {
    defaultProps,
  })
}
