import React from 'react'
import { Text } from 'react-native'
import { HStack, VStack } from './Stacks'
export function SmallTitle(props: { children: any }) {
  return (
    <VStack width="100%" alignItems="center" paddingVertical={5}>
      <Text
        style={{
          textTransform: 'uppercase',
          letterSpacing: 2,
          opacity: 0.5,
          fontSize: 16,
        }}
      >
        {props.children}
      </Text>
    </VStack>
  )
}
