import { atomic } from 'react-native-web/dist/cjs/exports/StyleSheet/compile'
import createCompileableStyle from 'react-native-web/dist/cjs/exports/StyleSheet/createCompileableStyle'
import i18Style from 'react-native-web/dist/cjs/exports/StyleSheet/i18nStyle'

import { StyleObject } from '../types'

export function getStylesAtomic(style: any, classList?: string[]) {
  const all = atomic(createCompileableStyle(i18Style(style)))

  for (const key in all) {
    all[key].className = `.${all[key].identifier}`
  }
  return Object.keys(all).map((key) => all[key]) as StyleObject[]
}
