import { HStack, StackProps, VStack } from '@dish/ui'
import React from 'react'
import { Text, TextStyle } from 'react-native'

export function TableRow(props: StackProps) {
  return <HStack {...props} />
}

export function TableCell({
  color,
  fontSize,
  fontWeight,
  fontStyle,
  fontFamily,
  fontVariant,
  children,
  ...props
}: StackProps & TextStyle) {
  return (
    <VStack paddingVertical={10} {...props}>
      <Text
        style={{
          color,
          fontSize,
          fontWeight,
          fontStyle,
          fontFamily,
          fontVariant,
        }}
      >
        {children}
      </Text>
    </VStack>
  )
}
