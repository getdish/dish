import { default as React, useLayoutEffect, useRef } from 'react'
import { StyleSheet, TextInput, TextInputProps, TextStyle } from 'react-native'

import { isWeb } from '../constants'
import { useTextStylePropsSplit } from '../hooks/useTextStylePropsSplit'
import { InteractiveContainer } from './InteractiveContainer'

export const Input = (
  props: Omit<TextInputProps, 'style'> &
    TextStyle & {
      name?: string
    }
) => {
  const { textProps, styleProps } = useTextStylePropsSplit(props)
  const textRef = useRef<HTMLInputElement>()

  if (isWeb) {
    useLayoutEffect(() => {
      if (props.name) {
        textRef.current?.setAttribute('name', props.name)
      }
    }, [props.name])
  }

  return (
    <InteractiveContainer {...styleProps}>
      <TextInput
        ref={textRef as any}
        {...textProps}
        style={[
          sheet.inputStyle,
          {
            fontSize: styleProps.fontSize ?? 16,
            lineHeight: styleProps.lineHeight,
            fontWeight: styleProps.fontWeight,
            textAlign: styleProps.textAlign,
          },
        ]}
      />
    </InteractiveContainer>
  )
}

const sheet = StyleSheet.create({
  inputStyle: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: 'rgb(100, 100, 100)',
  },
})
