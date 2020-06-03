import { atomic } from 'react-native-web/dist/cjs/exports/StyleSheet/compile'
import createCompileableStyle from 'react-native-web/dist/cjs/exports/StyleSheet/createCompileableStyle'
import i18Style from 'react-native-web/dist/cjs/exports/StyleSheet/i18nStyle'

import { StyleObject } from '../types'

export function getStylesAtomic(style: any, classList?: string[]) {
  const filteredStyle = Object.keys(style ?? {}).reduce((acc, cur) => {
    if (cur) {
      acc[cur] = style[cur]
    }
    return acc
  }, {})
  const all = atomic(createCompileableStyle(i18Style(filteredStyle)))
  for (const key in all) {
    all[key].className = `.${all[key].identifier}`
  }
  return Object.keys(all).map((key) => all[key]) as StyleObject[]
}
