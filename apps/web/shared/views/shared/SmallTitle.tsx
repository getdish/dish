import React from 'react'
import { Text } from 'react-native'

import { Divider } from './Divider'
import { Spacer } from './Spacer'
import { VStack } from './Stacks'

export function Title(props: { children: any }) {
  return (
    <>
      <VStack
        width="100%"
        alignItems="center"
        paddingTop={10}
        paddingVertical={12}
      >
        <Text
          style={{
            // textTransform: 'uppercase',
            // letterSpacing: 4,
            // opacity: 0.6,
            fontSize: 17,
            fontWeight: '400',
            paddingBottom: 8,
          }}
        >
          {props.children}
        </Text>
        <Divider />
      </VStack>
    </>
  )
}

export function SmallTitle(props: { children: any }) {
  return (
    <VStack width="100%" alignItems="center" paddingBottom={4}>
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
      <Spacer size="sm" />
      <Divider />
    </VStack>
  )
}
