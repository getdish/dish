import React, { memo } from 'react'
import { Divider, HStack, Spacer, StackProps, Text, TextProps, VStack } from 'snackui'

export const SmallTitle = memo(
  ({
    children,
    isActive,
    divider = 'bottom',
    after,
    color,
    fontSize = 16,
    fontWeight = '500',
    lineHeight,
    letterSpacing = -0.25,
    textAlign,
    ...rest
  }: StackProps &
    TextProps & {
      after?: any
      isActive?: boolean
      divider?: 'center' | 'bottom' | 'off'
    }) => {
    const dividerElement = color ? <Divider backgroundColor={color} opacity={0.1} /> : <Divider />
    return (
      <VStack width="100%" alignItems="center" {...rest}>
        <HStack width="100%" alignItems="center">
          {divider === 'center' && dividerElement}
          <Text
            paddingHorizontal={20}
            flexShrink={0}
            {...{
              color: color ?? (isActive ? '#000' : '#888'),
              letterSpacing,
              fontSize,
              fontWeight,
              lineHeight,
              textAlign,
            }}
            {...(divider === 'center' && {
              flexGrow: 10,
            })}
          >
            {children}
          </Text>
          {divider === 'center' && dividerElement}
        </HStack>

        {after && (
          <>
            <Spacer size="xs" />
            {after}
          </>
        )}

        {divider === 'bottom' && (
          <>
            <Spacer size="sm" />
            {dividerElement}
          </>
        )}
      </VStack>
    )
  }
)

export const SmallerTitle = memo(
  ({ children, hideDivider, ...rest }: StackProps & { hideDivider?: boolean }) => {
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
