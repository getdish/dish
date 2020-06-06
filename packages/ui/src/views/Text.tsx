import React, { useMemo } from 'react'
import {
  Text as ReactText,
  TextProps as ReactTextProps,
  TextStyle,
} from 'react-native'

export type TextProps = Omit<ReactTextProps, 'style'> &
  TextStyle & {
    ellipse?: boolean
    selectable?: boolean
    children?: any
  }

const selectableStyle = {
  userSelect: 'text',
}

const ellipseStyle = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

export const Text = (allProps: TextProps) => {
  const [props, style] = useTextStyle(allProps)
  return <ReactText style={style} {...props} />
}

Text.staticConfig = {
  styleExpansionProps: {
    selectable: selectableStyle,
    ellipse: ellipseStyle,
  },
}

const useTextStyle = (allProps: TextProps) => {
  return useMemo(() => {
    const props: ReactTextProps = {}
    const style: TextStyle = {}
    for (const key in allProps) {
      const val = allProps[key]
      if (val === undefined) continue
      if (val) {
        if (key === 'selectable') {
          Object.assign(style, selectableStyle as any)
          continue
        }
        if (key === 'ellipse') {
          Object.assign(style, ellipseStyle as any)
          continue
        }
      }
      const isProp =
        textNonStyleProps[key] ?? /^(allow.*|on[A-Z].*|.*[Mm]ode)/.test(key)
      if (isProp) {
        props[key] = val
      } else {
        style[key] = val
      }
    }
    return [props, style]
  }, [allProps])
}

const textNonStyleProps = {
  allowFontScaling: true,
  ellipsizeMode: true,
  lineBreakMode: true,
  numberOfLines: true,
  onLayout: true,
  onPress: true,
  onLongPress: true,
  style: true,
  children: true,
  testID: true,
  nativeID: true,
  maxFontSizeMultiplier: true,
}
