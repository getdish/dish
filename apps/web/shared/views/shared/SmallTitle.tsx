import React, { memo } from 'react'
import { Text } from 'react-native'

import { Divider } from './Divider'
import { Spacer } from './Spacer'
import { HStack, StackBaseProps, VStack } from './Stacks'

export const SmallTitle = memo(
  ({ children, after, ...rest }: StackBaseProps & { after?: any }) => {
    return (
      <VStack width="100%" alignItems="center" paddingBottom={4} {...rest}>
        <HStack alignItems="center">
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
          {after && (
            <>
              <Spacer size="xs" />
              {after}
            </>
          )}
        </HStack>
        <Spacer size="sm" />
        <Divider />
      </VStack>
    )
  }
)

export const SmallerTitle = memo(
  ({
    children,
    hideDivider,
    ...rest
  }: StackBaseProps & { hideDivider?: boolean }) => {
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
