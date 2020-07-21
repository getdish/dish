import React, { forwardRef } from 'react'
import { StyleSheet, TextInput, TextInputProps } from 'react-native'

export const Input = forwardRef(
  (
    {
      style,
      ...props
    }: TextInputProps & {
      name?: string
    },
    ref
  ) => {
    return (
      <TextInput
        ref={ref as any}
        style={[textStyles.textField, style]}
        {...props}
      />
    )
  }
)

const textStyles = StyleSheet.create({
  textField: {
    fontSize: 18,
    borderWidth: 0,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    overflow: 'hidden',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: '0.5em',
  },
})
