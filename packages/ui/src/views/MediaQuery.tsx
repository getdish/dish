import React from 'react'
import { useLayoutEffect, useRef } from 'react'
import { ViewStyle } from 'react-native'
import { classic } from 'react-native-web/dist/cjs/exports/StyleSheet/compile'
import compileStyle from 'react-native-web/dist/cjs/exports/StyleSheet/createCompileableStyle'
import i18nStyle from 'react-native-web/dist/cjs/exports/StyleSheet/i18nStyle'

// TODO remove? remove stylesheet possible?

export function MediaQuery({
  children,
  query,
  style = { display: 'none' },
}: {
  children: any
  query: string
  style?: ViewStyle
}) {
  if (isNative) {
    return children
  }

  const className = useRef(`media-${Math.round(Math.random() * 1000000000)}`)

  useLayoutEffect(() => {
    if (!style) return
    const tag = document.createElement('style')
    tag.innerHTML = `${query} { ${getCSS(`.${className.current}`, style)} }`
    document.body.append(tag)
    return () => {
      document.body.removeChild(tag)
    }
  }, [JSON.stringify(style ?? null)])

  return (
    <div className={`display-contents ${className.current}`}>{children}</div>
  )
}

const isNative = false

const getCSS = (selector: string, styles: ViewStyle): string => {
  const out = classic(compileStyle(i18nStyle(styles)))
  const key = Object.keys(out)[0]
  const rulesStr = out[key].rules[0]
  return rulesStr.replace(`.${key}`, selector)
}

export const mediaQueries = {
  xs: '@media screen and (max-width: 640px)',
  sm: '@media screen and (max-width: 800px)',
  md: '@media screen and (max-width: 980px)',
  lg: '@media screen and (max-width: 1160px)',
}
