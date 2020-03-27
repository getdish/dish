import React from 'react'
import { Text } from 'react-native'
import { VStack } from './Stacks'
import { Spacer } from './Spacer'
import { Divider } from './Divider'

export function Title(props: { children: any }) {
  return (
    <VStack width="100%" alignItems="center" paddingTop={12} paddingBottom={6}>
      <Text
        style={{
          opacity: 0.7,
          fontSize: 18,
          fontWeight: '500',
        }}
      >
        {props.children}
      </Text>
      <Spacer />
      <Divider />
    </VStack>
  )
}

export function SmallTitle(props: { children: any }) {
  return (
    <VStack width="100%" alignItems="center" paddingVertical={8}>
      <Text
        style={{
          textTransform: 'uppercase',
          letterSpacing: 2,
          opacity: 0.5,
          fontSize: 15,
          fontWeight: '400',
        }}
      >
        {props.children}
      </Text>
      <Spacer />
      <Divider />
    </VStack>
  )
}
