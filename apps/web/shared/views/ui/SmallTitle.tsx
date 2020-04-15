import React, { memo } from 'react'
import { Text } from 'react-native'

import { Divider } from './Divider'
import { Spacer } from './Spacer'
import { HStack, StackBaseProps, VStack } from './Stacks'

export const SmallTitle = memo(
  ({
    children,
    isActive,
    centerDivider,
    after,
    ...rest
  }: StackBaseProps & {
    after?: any
    isActive?: boolean
    centerDivider?: boolean
  }) => {
    return (
      <VStack alignItems="center" {...rest}>
        <HStack width="100%" alignItems="center" justifyContent="center">
          {centerDivider && <Divider flex />}
          <Text
            style={{
              paddingHorizontal: 30,
              textTransform: 'uppercase',
              letterSpacing: 1,
              opacity: isActive ? 1 : 0.5,
              fontSize: 15,
              fontWeight: '400',
              marginVertical: 3,
            }}
          >
            {children}
          </Text>
          {centerDivider && <Divider flex />}
          {after && (
            <>
              <Spacer size="xs" />
              {after}
            </>
          )}
        </HStack>
        {!centerDivider && (
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
