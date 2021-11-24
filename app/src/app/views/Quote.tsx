import { Text, TextProps, XStack, YStack } from '@dish/ui'
import React, { memo } from 'react'

export const Quote = memo(
  ({
    by,
    ...props
  }: TextProps & {
    by?: string
  }) => {
    return (
      <XStack space={10}>
        <Text fontSize={40} color="#ccc" marginTop={-10} marginBottom={0}>
          “
        </Text>
        <YStack space={6} flex={1}>
          <Text fontSize={props.fontSize ?? 16} color={props.color ?? '#999'}>
            “
          </Text>
          {!!by && (
            <Text fontWeight="bold" fontSize={13} color="#999" {...props}>
              {by}
            </Text>
          )}
        </YStack>
      </XStack>
    )
  }
)
