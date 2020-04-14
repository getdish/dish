import React from 'react'
import { Text, TextStyle } from 'react-native'

import { HStack, StackBaseProps, VStack } from '../ui/Stacks'

export function TableRow(props: StackBaseProps) {
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
}: StackBaseProps & TextStyle) {
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
