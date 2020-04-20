import React, { useEffect } from 'react'
import * as Icons from 'react-feather'
import { TextStyle, ViewStyle, findNodeHandle } from 'react-native'

import { fuzzyFind, fuzzyFindSync, fuzzyMatchSimple } from '../../helpers/fuzzy'
import { useForceUpdate } from '../../hooks/useForceUpdate'

const names = Object.keys(Icons)
console.log('Icons', Icons, names)
const found = {}

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
  const foundName = found[name] || fuzzyFindSync(name, names, null)
  const Element = Icons[foundName]

  if (!Element) {
    console.warn('not found', name, foundName)
    return null
  }

  return <Element size={size} style={style} />
}
