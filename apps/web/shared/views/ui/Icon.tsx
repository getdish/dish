import React from 'react'
import * as Icons from 'react-feather'
import { TextStyle, ViewStyle } from 'react-native'

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
  const Element = Icons[name]
  if (!Element) {
    return null
  }
  return <Element size={size} style={style} />
}
