import { HStack, StackProps, Text, VStack } from '@dish/ui'
import React from 'react'
import { TextStyle } from 'react-native'

export function TableRow(props: StackProps) {
  return <HStack {...props} />
}

export function TableCell({
  color,
  fontSize,
  fontWeight,
  fontStyle,
  fontFamily,
  textAlign,
  fontVariant,
  children,
  ...props
}: StackProps & TextStyle) {
  return (
    <VStack paddingVertical={10} {...props}>
      <Text
        color={color}
        fontSize={fontSize}
        fontWeight={fontWeight}
        fontStyle={fontStyle}
        fontFamily={fontFamily}
        fontVariant={fontVariant}
        textAlign={textAlign}
      >
        {children}
      </Text>
    </VStack>
  )
}
