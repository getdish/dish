import React, { memo } from 'react'
import { Text } from 'react-native'

import { Divider } from './Divider'
import { Spacer } from './Spacer'
import { HStack, VStack, StackBaseProps } from './Stacks'

export const PageTitle = memo(({ children, ...rest }: StackBaseProps) => {
  return (
    <>
      <VStack
        width="100%"
        alignItems="center"
        paddingTop={10}
        paddingVertical={12}
        {...rest}
      >
        <Text
          style={{
            // textTransform: 'uppercase',
            // letterSpacing: 4,
            // opacity: 0.6,
            fontSize: 16,
            fontWeight: '600',
            paddingBottom: 8,
          }}
        >
          {children}
        </Text>
        <Divider />
      </VStack>
    </>
  )
})

export const SmallTitle = memo(({ children, ...rest }: StackBaseProps) => {
  return (
    <VStack width="100%" alignItems="center" paddingBottom={4} {...rest}>
      <Text
        style={{
          textTransform: 'uppercase',
          letterSpacing: 2,
          opacity: 0.5,
          fontSize: 15,
          fontWeight: '400',
        }}
      >
        {children}
      </Text>
      <Spacer size="sm" />
      <Divider />
    </VStack>
  )
})

export const SmallerTitle = memo(({ children, ...rest }: StackBaseProps) => {
  return (
    <HStack alignItems="center" spacing {...rest}>
      <Divider flex />
      <Text
        style={{
          opacity: 0.5,
          fontSize: 14,
          fontWeight: '400',
        }}
      >
        {children}
      </Text>
      <Divider flex />
    </HStack>
  )
})
