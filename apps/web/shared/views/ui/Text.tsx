import React from 'react'
import { Text, TextProps } from 'react-native'

export const SelectableText = (props: TextProps & { children: any }) => {
  return (
    <Text
      selectable
      {...props}
      style={[{ userSelect: 'text' } as any, props.style ?? null]}
    />
  )
}
