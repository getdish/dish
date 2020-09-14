import React, { useMemo, useRef } from 'react'
import {
  Platform,
  Text as ReactText,
  TextProps as ReactTextProps,
  TextStyle,
} from 'react-native'

import { useAttachClassName } from '../hooks/useAttachClassName'

export type TextProps = Omit<ReactTextProps, 'style'> &
  Omit<TextStyle, 'display'> & {
    display?: TextStyle['display'] | 'inherit'
    ellipse?: boolean
    selectable?: boolean
    children?: any
    className?: string
    pointerEvents?: string
    cursor?: string
    userSelect?: string
  }

const defaultStyle: TextStyle = {
  // fixes transforms not working on web
  display: 'inline-block' as any,
}

const selectableStyle = {
  userSelect: 'text',
}

const ellipseStyle = {
  display: 'inline-block',
  maxWidth: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

export const Text = (allProps: TextProps) => {
  const [props, style] = useTextStyle(allProps)
  const textRef = useRef(null)
  useAttachClassName(allProps.className, textRef)
  return <ReactText ref={textRef} style={style} {...props} />
}

Text.staticConfig = {
  defaultStyle,
  styleExpansionProps: {
    selectable: selectableStyle,
    ellipse: ellipseStyle,
  },
}

const textNonStylePropReg = /^(allow.*|on[A-Z].*|.*[Mm]ode)/
const isWeb = Platform.OS === 'web'
const webOnlyStyleKeys = {
  className: true,
  textOverflow: true,
  whiteSpace: true,
  cursor: true,
  ellipse: true, // for now, can implement
}

const useTextStyle = (allProps: TextProps) => {
  return useMemo(() => {
    const props: ReactTextProps = {}
    const style: TextStyle = {
      ...defaultStyle,
    }
    for (const key in allProps) {
      if (!isWeb && webOnlyStyleKeys[key]) {
        continue
      }
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
      const isProp = textNonStyleProps[key] ?? textNonStylePropReg.test(key)
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
