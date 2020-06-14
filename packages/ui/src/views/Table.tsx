import React from 'react'
import { TextStyle } from 'react-native'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { HStack, StackProps, VStack } from './Stacks'
import { Text } from './Text'

export const TableRow = (props: StackProps) => {
  return <HStack {...props} />
}

TableRow.staticConfig = extendStaticConfig(HStack, {})

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
