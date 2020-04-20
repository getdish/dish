import React from 'react'
import * as Icons from 'react-feather'
import { TextStyle, ViewStyle } from 'react-native'

import { fuzzyFindSync } from '../../helpers/fuzzy'

const names = Object.keys(Icons)
const found = {}

const findIcon = (name: string) => {
  const res = fuzzyFindSync(name, names, null)
  found[name] = res[0]
  return res[0]
}

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
  const foundName = found[name] || findIcon(name)
  const Element = Icons[foundName]

  if (!Element) {
    console.warn('not found', name, foundName)
    return null
  }

  return <Element size={size} style={style} />
}
