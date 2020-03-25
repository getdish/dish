import React from 'react'
import { Text } from 'react-native'
import { HStack, VStack } from './Stacks'
export function SmallTitle(props: { children: any }) {
  return (
    <VStack width="100%" alignItems="center" paddingVertical={8}>
      <Text
        style={{
          textTransform: 'uppercase',
          letterSpacing: 3,
          opacity: 0.5,
          fontSize: 16,
          fontWeight: '300',
        }}
      >
        {props.children}
      </Text>
    </VStack>
  )
}
