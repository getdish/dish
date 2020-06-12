import { ViewStyle } from 'react-native'
import { atomic } from 'react-native-web/dist/cjs/exports/StyleSheet/compile'
import createCompileableStyle from 'react-native-web/dist/cjs/exports/StyleSheet/createCompileableStyle'
import createReactDOMStyle from 'react-native-web/dist/cjs/exports/StyleSheet/createReactDOMStyle'
import i18Style from 'react-native-web/dist/cjs/exports/StyleSheet/i18nStyle'

import { StyleObject } from '../types'

export function getStylesAtomic(style: any, classList?: string[]) {
  const filteredStyle: ViewStyle = Object.keys(style ?? {}).reduce(
    (acc, cur) => {
      if (cur) {
        acc[cur] = style[cur]
      }
      return acc
    },
    {}
  )

  // why is this diff from react-native-web!? we need to figure out
  if (Object.keys(style).some((k) => k.includes('borderWidth'))) {
    filteredStyle.borderStyle = filteredStyle.borderStyle ?? 'solid'
  }

  const all = atomic(
    createCompileableStyle(createReactDOMStyle(i18Style(filteredStyle)))
  )
  for (const key in all) {
    all[key].className = `.${all[key].identifier}`
  }
  return Object.keys(all).map((key) => all[key]) as StyleObject[]
}
