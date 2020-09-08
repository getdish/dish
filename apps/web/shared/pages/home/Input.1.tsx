import { HStack } from '@dish/ui'
import { default as React } from 'react'
import { TextInput, TextInputProps } from 'react-native'

export const Input = (props: TextInputProps) => {
  return (
    <HStack
      borderRadius={10}
      borderWidth={1}
      borderColor="rgba(150,150,150,0.3)"
      hoverStyle={{
        borderColor: 'rgba(150,150,150,0.5)',
      }}
      overflow="hidden"
    >
      <TextInput
        {...props}
        style={[
          { paddingHorizontal: 14, paddingVertical: 10, fontSize: 16 },
          props.style,
        ]}
      />
    </HStack>
  )
}
