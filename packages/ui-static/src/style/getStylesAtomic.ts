import { ViewStyle } from 'react-native'
import { atomic } from 'react-native-web/dist/cjs/exports/StyleSheet/compile'

import { StyleObject } from '../types'

export { ViewStyle } from 'react-native'

export function getStylesAtomic(style: ViewStyle) {
  const all = atomic(style)
  for (const key in all) {
    all[key].className = `.${all[key].identifier}`
  }
  return Object.keys(all).map((key) => all[key]) as StyleObject[]
}
