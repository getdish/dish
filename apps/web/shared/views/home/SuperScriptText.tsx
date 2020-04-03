import React from 'react'
import { Text, TextProps } from 'react-native'

export function SuperScriptText({
  style,
  ...rest
}: TextProps & {
  children: any
}) {
  return (
    <Text
      style={[{ fontSize: 12, textAlignVertical: 'top', opacity: 0.5 }, style]}
      {...rest}
    />
  )
}
