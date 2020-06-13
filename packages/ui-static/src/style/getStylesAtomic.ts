import _ from 'lodash'
import { ViewStyle } from 'react-native'
import { atomic } from 'react-native-web/dist/cjs/exports/StyleSheet/compile'
import createCompileableStyle from 'react-native-web/dist/cjs/exports/StyleSheet/createCompileableStyle'
import createReactDOMStyle from 'react-native-web/dist/cjs/exports/StyleSheet/createReactDOMStyle'
import i18Style from 'react-native-web/dist/cjs/exports/StyleSheet/i18nStyle'

import { StyleObject } from '../types'

export const pseudos = {
  activeStyle: 'active',
  pressStyle: 'focus',
  hoverStyle: 'hover',
}

export function getStylesAtomic(
  style: any,
  classList?: string[] | null,
  debug?: boolean
) {
  const styles: { [key: string]: ViewStyle } = {
    base: {},
  }

  // split psuedos
  for (const key in style) {
    if (pseudos[key]) {
      styles[key] = style[key]
    } else {
      styles.base[key] = style[key]
    }
  }

  return Object.keys(styles)
    .map((key) => {
      return getAtomicStyle(styles[key], pseudos[key])
    })
    .flat()

  function getAtomicStyle(style: ViewStyle, pseudoKey?: string) {
    // why is this diff from react-native-web!? we need to figure out
    if (Object.keys(style).some((k) => k.includes('borderWidth'))) {
      style.borderStyle = style.borderStyle ?? 'solid'
    }
    const all = _.cloneDeep(
      atomic(createCompileableStyle(createReactDOMStyle(i18Style(style))))
    )
    for (const key in all) {
      const styleObj = all[key]
      if (pseudoKey) {
        const ogId = styleObj.identifier
        styleObj.identifier = `${styleObj.identifier}-${pseudoKey.slice(0, 2)}`
        styleObj.rules = styleObj.rules.map((rule) =>
          rule.replace(ogId, styleObj.identifier).replace('{', `:${pseudoKey}{`)
        )
      }
      styleObj.className = `.${styleObj.identifier}`
    }
    return Object.keys(all).map((key) => all[key]) as StyleObject[]
  }
}
