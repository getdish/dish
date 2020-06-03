import React from 'react'
import { Text as ReactNativeText, TextProps } from 'react-native'

// TODO make it used in app + work with ui-static extract + remove <SelectableText
export type TextProps = Omit<TextProps, 'style'> &
  TextProps['style'] & {
    selectable?: boolean
  }
export const Text = (props: TextProps) => {
  return <ReactNativeText {...props} />
}
Text.staticConfig = {
  styleExpansionProps: {
    selectable: {
      userSelect: 'text',
    },
  },
}

export const SelectableText = (props: TextProps & { children: any }) => {
  return (
    <Text
      selectable
      {...props}
      style={[{ userSelect: 'text' } as any, props.style]}
    />
  )
}
