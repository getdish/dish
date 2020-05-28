import { ViewStyle } from 'react-native'
import { atomic } from 'react-native-web/dist/exports/StyleSheet/compile'

import { ClassNameToStyleObj } from '../types'

export { ViewStyle } from 'react-native'

export function getStylesAtomic(style: ViewStyle) {
  const all = atomic(style)
  for (const key in all) {
    all[key].className = `.${all[key].identifier}`
  }
  return all as ClassNameToStyleObj
}

export function getStyleAtomic(style: ViewStyle) {
  const styles = getStylesAtomic(style)
  const keys = Object.keys(styles)
  if (keys.length > 1) {
    throw new Error(`More than one style`)
  }
  return styles[keys[0]]
}
