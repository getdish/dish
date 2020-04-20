import React, { memo } from 'react'
import { Text } from 'react-native'

import { Divider } from './Divider'
import { Spacer } from './Spacer'
import { HStack, StackProps, VStack } from './Stacks'

export const SmallTitle = memo(
  ({
    children,
    isActive,
    divider = 'bottom',
    after,
    ...rest
  }: StackProps & {
    after?: any
    isActive?: boolean
    divider?: 'center' | 'bottom' | 'off'
  }) => {
    return (
      <VStack alignItems="center" {...rest}>
        <HStack width="100%" alignItems="center" justifyContent="center">
          {divider === 'center' && <Divider flex />}
          <Text
            style={{
              paddingHorizontal: 30,
              textTransform: 'uppercase',
              letterSpacing: 1,
              opacity: isActive ? 1 : 0.5,
              fontSize: 15,
              fontWeight: '500',
              marginVertical: 3,
            }}
          >
            {children}
          </Text>
          {divider === 'center' && <Divider flex />}
          {after && (
            <>
              <Spacer size="xs" />
              {after}
            </>
          )}
        </HStack>
        {divider === 'bottom' && (
          <>
            <Spacer size="sm" />
            <Divider />
          </>
        )}
      </VStack>
    )
  }
)

export const SmallerTitle = memo(
  ({
    children,
    hideDivider,
    ...rest
  }: StackProps & { hideDivider?: boolean }) => {
    return (
      <HStack alignItems="center" justifyContent="center" spacing {...rest}>
        {!hideDivider && <Divider flex />}
        <Text
          style={{
            opacity: 0.5,
            fontSize: 14,
            fontWeight: '400',
          }}
        >
          {children}
        </Text>
        {!hideDivider && <Divider flex />}
      </HStack>
    )
  }
)
