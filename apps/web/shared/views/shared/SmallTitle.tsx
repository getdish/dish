import React from 'react'
import { Text } from 'react-native'
import { VStack } from './Stacks'
import { Spacer } from './Spacer'
import { Divider } from './Divider'

export function SmallTitle(props: { children: any }) {
  return (
    <VStack width="100%" alignItems="center" paddingTop={14} paddingBottom={6}>
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
      <Spacer />
      <Divider />
    </VStack>
  )
}
