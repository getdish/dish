import React from 'react'
import { Spacer, XStack, YStack } from 'tamagui'

export const LoadingItems = () => (
  <YStack spacing="sm" width="100%">
    <LoadingItem />
    <LoadingItem />
    <LoadingItem />
  </YStack>
)

export const LoadingItemsSmall = () => (
  <YStack spacing="xs" width="100%">
    <LoadingItem size="sm" />
    <LoadingItem size="sm" />
    <LoadingItem size="sm" />
  </YStack>
)

// same across all instances, less flickers
const seed = Math.max(3, Math.min(6, Math.round(Math.random() * 10)))

export const LoadingItem = ({
  size = 'md',
  lines = 3,
}: {
  size?: 'sm' | 'md' | 'lg'
  lines?: number
}) => {
  return (
    <YStack width="100%" overflow="hidden" padding={16}>
      <XStack
        width={`${seed * 12}%`}
        height={size === 'sm' ? 14 : size === 'lg' ? 36 : 28}
        backgroundColor="rgba(150,150,150,0.085)"
        borderRadius={12}
      />
      <Spacer size={size === 'sm' ? 6 : size === 'lg' ? 16 : 12} />
      {new Array(lines).fill(0).map((_, index) => (
        <React.Fragment key={index}>
          <XStack
            className="shine"
            width={`${seed * (15 - (2 - index > -1 ? index : -index) * 4)}%`}
            height={size === 'sm' ? 14 : size === 'lg' ? 22 : 16}
            maxWidth="100%"
            backgroundColor="rgba(150,150,150,0.015)"
            borderRadius={8}
          />
          <Spacer size={size === 'sm' ? 6 : 12} />
        </React.Fragment>
      ))}
    </YStack>
  )
}
