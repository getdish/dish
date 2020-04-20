import React, { useEffect } from 'react'
import * as Icons from 'react-feather'
import { TextStyle, ViewStyle } from 'react-native'

import { fuzzyFind } from '../../helpers/fuzzy'
import { useForceUpdate } from '../../hooks/useForceUpdate'

console.log('Icons', Icons)
const names = Object.keys(Icons).map((x) => x.toLowerCase())
const found = {}

const findIcon = async (name: string) => {
  const res = await fuzzyFind(name, names)
  console.log('res', res)
  found[name] = res
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
  const Element = found[name]
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    if (!Element) {
      findIcon(name).then(() => forceUpdate())
    }
  }, [])

  if (!Element) {
    return null
  }

  return <Element size={size} style={style} />
}
