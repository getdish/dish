import { default as React } from 'react'
import { StyleSheet, TextInput, TextInputProps } from 'react-native'

import { HStack, StackProps } from './Stacks'

export const Input = (
  props: TextInputProps & {
    name?: string
  }
) => {
  return (
    <InteractiveContainer>
      <TextInput {...props} style={[sheet.inputStyle, props.style]} />
    </InteractiveContainer>
  )
}

const sheet = StyleSheet.create({
  inputStyle: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: 'rgb(100, 100, 100)',
  },
})

export const InteractiveContainer = (props: StackProps) => {
  return (
    <HStack
      borderRadius={10}
      borderWidth={1}
      borderColor="rgba(150,150,150,0.5)"
      hoverStyle={{
        borderColor: 'rgba(150,150,150,0.8)',
      }}
      overflow="hidden"
      {...props}
    />
  )
}
