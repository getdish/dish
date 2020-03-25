import React from 'react'

import { Feather, SimpleLineIcons } from '@expo/vector-icons'
import { ViewStyle, TextStyle } from 'react-native'

export const Icon = ({
  type = 'feather',
  ...props
}: {
  type?: 'feather' | 'simple'
  name: string
  size: number
  style?: ViewStyle & TextStyle
}) => {
  const Element = type == 'feather' ? Feather : SimpleLineIcons
  return <Element {...props} />
}
