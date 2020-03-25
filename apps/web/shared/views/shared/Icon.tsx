import React from 'react'

import { Feather, SimpleLineIcons } from '@expo/vector-icons'
import { ViewStyle, TextStyle } from 'react-native'

export const Icon = ({
  type = 'feather',
  name,
  size,
  ...style
}: {
  type?: 'feather' | 'simple'
  name: string
  size: number
} & ViewStyle &
  TextStyle) => {
  const Element = type == 'feather' ? Feather : SimpleLineIcons
  return <Element name={name} size={size} style={style} />
}
