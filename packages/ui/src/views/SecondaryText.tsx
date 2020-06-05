import React from 'react'
import { TextStyle } from 'react-native'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { Text, TextProps } from './Text'

const defaultStyle: TextStyle = {
  color: '#777',
  fontSize: 13,
}

export const SecondaryText = (props: TextProps) => {
  return <Text {...defaultStyle} {...props} />
}

SecondaryText.staticConfig = extendStaticConfig(Text, {
  defaultStyle,
})
