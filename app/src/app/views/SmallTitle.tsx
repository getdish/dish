import { Separator, Spacer, StackProps, Text, TextProps, Title, XStack, YStack } from '@dish/ui'
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
    const dividerElement = color ? (
      <Separator flex={1} backgroundColor={color} opacity={0.1} />
    ) : (
      <Separator flex={1} />
    )

    return (
      <YStack width="100%" alignItems="center" {...rest}>
        <XStack width="100%" alignItems="center">
          {divider === 'center' && dividerElement}
          <Title
            paddingHorizontal={20}
            {...{
              color,
              letterSpacing,
              fontSize,
              fontWeight,
              lineHeight,
              textAlign,
            }}
          >
            {children}
          </Title>
          {divider === 'center' && dividerElement}
        </XStack>

        {after && (
          <>
            <Spacer size="$1" />
            {after}
          </>
        )}

        {divider === 'bottom' && (
          <>
            <Spacer size="$2" />
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
      <XStack alignItems="center" justifyContent="center" space {...rest}>
        {!hideDivider && <Separator flex />}
        <Text opacity={0.5} fontSize={14} fontWeight="500">
          {children}
        </Text>
        {!hideDivider && <Separator flex />}
      </XStack>
    )
  }
)
