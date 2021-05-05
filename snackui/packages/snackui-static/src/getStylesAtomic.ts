import { getNiceKey, getOrCreateStylePrefix } from '@snackui/node'
import _ from 'lodash'
import { ViewStyle } from 'react-native'
import { atomic } from 'react-native-web/dist/cjs/exports/StyleSheet/compile'
import createCompileableStyle from 'react-native-web/dist/cjs/exports/StyleSheet/createCompileableStyle'
import createReactDOMStyle from 'react-native-web/dist/cjs/exports/StyleSheet/createReactDOMStyle'
import i18Style from 'react-native-web/dist/cjs/exports/StyleSheet/i18nStyle'

import { simpleHash } from './simpleHash'
import { StyleObject } from './types'

export const pseudos = {
  focusWithinStyle: {
    name: 'focus-within',
    priority: 4,
  },
  focusStyle: {
    name: 'focus',
    priority: 3,
  },
  pressStyle: {
    name: 'active',
    priority: 2,
  },
  hoverStyle: {
    name: 'hover',
    priority: 1,
  },
}

const borderDefaults = {
  borderWidth: 'borderStyle',
  borderBottomWidth: 'borderBottomStyle',
  borderTopWidth: 'borderTopStyle',
  borderLeftWidth: 'borderLeftStyle',
  borderRightWidth: 'borderRightStyle',
}

export function getStylesAtomic(style: any) {
  const styles: { [key: string]: ViewStyle } = {
    base: {},
  }
  // split psuedos
  for (const key in style) {
    if (!!pseudos[key]) {
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
}

const importantRegex = /\!important*/g

function getAtomicStyle(
  style: ViewStyle,
  pseudo?: { name: string; priority: number }
): StyleObject[] {
  if (style == null || typeof style !== 'object') {
    throw new Error(`Wrong style type: "${typeof style}": ${style}`)
  }
  // why is this diff from react-native-web!? need to figure out
  for (const key in borderDefaults) {
    if (key in style) {
      style[borderDefaults[key]] = style[borderDefaults[key]] ?? 'solid'
    }
  }
  const all = _.cloneDeep(atomic(createCompileableStyle(createReactDOMStyle(i18Style(style)))))
  return Object.keys(all).map((key) => {
    const val = all[key]
    const prefix = `_${getOrCreateStylePrefix(val.property)}`
    const hash = (() => {
      let s = `${val.value}`.replace(/[^a-z0-9]/gi, '_').replace(/\s/, '-')
      if (s.length < 16) return s
      return simpleHash(val.identifier)
    })()

    // pseudos have a `--` to be easier to find with concatClassNames
    const psuedoPrefix = pseudo ? `-${pseudo.name}-` : ''
    const identifier = `${prefix}-${psuedoPrefix}${hash}`
    const className = `.${identifier}`
    const rules = val.rules.map((rule) => {
      if (pseudo) {
        const psuedoPrefixSelect = [...Array(pseudo.priority)].map(() => ':root').join('') + ' '
        let res = rule
          .replace(`.${val.identifier}`, `${psuedoPrefixSelect} ${className}`)
          .replace('{', `:${pseudo.name}{`)

        if (pseudo.name === 'hover') {
          // hover styles need to be conditional
          // perhaps this can be generalized but for now lets just shortcut
          // and hardcode for hover styles, if we need to later we can
          // WEIRD SYNTAX, SEE:
          //   https://stackoverflow.com/questions/40532204/media-query-for-devices-supporting-hover
          res = `@media not all and (hover: none) { ${res} }`
        }
        return res
      }
      return rule.replace(`.${val.identifier}`, className).replace(importantRegex, '')
    })
    return {
      ...val,
      identifier,
      className,
      rules,
    } as StyleObject
  })
}
