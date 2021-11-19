import { Divider, Spacer, StackProps, Text, TextProps, XStack, YStack } from '@dish/ui'
import React, { memo } from 'react'

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
      <YStack width="100%" alignItems="center" {...rest}>
        <XStack width="100%" alignItems="center">
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
        </XStack>

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
      </YStack>
    )
  }
)

export const SmallerTitle = memo(
  ({ children, hideDivider, ...rest }: StackProps & { hideDivider?: boolean }) => {
    return (
      <XStack alignItems="center" justifyContent="center" spacing {...rest}>
        {!hideDivider && <Divider flex />}
        <Text opacity={0.5} fontSize={14} fontWeight="500">
          {children}
        </Text>
        {!hideDivider && <Divider flex />}
      </XStack>
    )
  }
)
