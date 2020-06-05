import React from 'react'
import { TextStyle } from 'react-native'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { Text, TextProps } from './Text'

const defaultStyle: TextStyle = {
  fontSize: 12,
  textAlignVertical: 'top',
  opacity: 0.5,
}

export function SuperScriptText(props: TextProps) {
  return <Text {...props} />
}

SuperScriptText.staticConfig = extendStaticConfig(Text, {
  defaultStyle,
})
