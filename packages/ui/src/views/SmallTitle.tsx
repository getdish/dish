import React, { memo } from 'react'

import { Divider } from './Divider'
import { Spacer } from './Spacer'
import { HStack, StackProps, VStack } from './Stacks'
import { Text } from './Text'

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
            paddingHorizontal={30}
            letterSpacing={-1}
            opacity={isActive ? 1 : 0.5}
            fontSize={16}
            fontWeight="400"
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
        <Text opacity={0.5} fontSize={14} fontWeight="500">
          {children}
        </Text>
        {!hideDivider && <Divider flex />}
      </HStack>
    )
  }
)
