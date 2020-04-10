import { useLayoutEffect, useRef } from 'react'
import { ViewStyle } from 'react-native'
import { classic } from 'react-native-web/dist/exports/StyleSheet/compile'
import compileStyle from 'react-native-web/dist/exports/StyleSheet/createCompileableStyle'
import i18nStyle from 'react-native-web/dist/exports/StyleSheet/i18nStyle'

import { isNative } from '../../constants'

const getCSS = (selector: string, styles: ViewStyle): string => {
  const out = classic(compileStyle(i18nStyle(styles)))
  const key = Object.keys(out)[0]
  const rulesStr = out[key].rules[0]
  return rulesStr.replace(`.${key}`, selector)
}

export const mediaQueries = {
  sm: '@media screen and (max-width: 640px)',
  md: '@media screen and (max-width: 860px)',
  lg: '@media screen and (max-width: 1060px)',
}

export function MediaQuery({
  children,
  query,
  style,
}: {
  children: any
  query: string
  style: ViewStyle
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
