import React, { memo } from 'react'
import { Text } from 'react-native'

import { Divider } from './Divider'
import { Spacer } from './Spacer'
import { HStack, VStack } from './Stacks'

export const Title = memo((props: { children: any }) => {
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
})

export const SmallTitle = memo((props: { children: any }) => {
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
})

export const SmallerTitle = memo((props: { children: any }) => {
  return (
    <HStack alignItems="center" spacing>
      <Divider flex />
      <Text
        style={{
          opacity: 0.5,
          fontSize: 14,
          fontWeight: '400',
        }}
      >
        {props.children}
      </Text>
      <Divider flex />
    </HStack>
  )
})
