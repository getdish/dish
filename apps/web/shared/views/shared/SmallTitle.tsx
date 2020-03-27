import React from 'react'
import { Text } from 'react-native'
import { VStack } from './Stacks'
import { Spacer } from './Spacer'
import { Divider } from './Divider'

export function SmallTitle(props: { children: any; bold?: boolean }) {
  return (
    <VStack width="100%" alignItems="center" paddingTop={12} paddingBottom={6}>
      <Text
        style={{
          // textTransform: 'uppercase',
          // letterSpacing: 2,
          opacity: 0.7,
          fontSize: 18,
          fontWeight: props.bold ? '800' : '500',
        }}
      >
        {props.children}
      </Text>
      <Spacer />
      <Divider />
    </VStack>
  )
}
