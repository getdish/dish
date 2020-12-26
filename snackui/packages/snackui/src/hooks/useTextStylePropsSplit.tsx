import { stylePropsText } from '@snackui/helpers'
import { useMemo } from 'react'
import { TextProps, TextStyle } from 'react-native'

export const useTextStylePropsSplit = (
  props: TextStyle & { [key: string]: any }
) => {
  return useMemo(() => {
    const styleProps: TextStyle = {}
    const textProps: TextProps = {}
    for (const key in props) {
      if (stylePropsText[key]) {
        styleProps[key] = props[key]
      } else {
        textProps[key] = props[key]
      }
    }
    return { styleProps, textProps }
  }, [props])
}
