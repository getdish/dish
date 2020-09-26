import React, { useRef } from 'react'

import { HStack, VStack } from './Stacks'

export const LoadingItems = () => (
  <VStack spacing="sm">
    <LoadingItem />
    <LoadingItem />
    <LoadingItem />
  </VStack>
)

export const LoadingItemsSmall = () => (
  <VStack spacing="xs">
    <LoadingItem size="sm" />
    <LoadingItem size="sm" />
    <LoadingItem size="sm" />
  </VStack>
)

// same across all instances, less flickers
const seed = Math.max(3, Math.min(6, Math.round(Math.random() * 10)))

export const LoadingItem = ({ size = 'md' }: { size?: 'sm' | 'md' }) => {
  const scale = size === 'sm' ? 0.5 : 1
  return (
    <VStack
      overflow="hidden"
      className="shine"
      padding={20 * scale}
      spacing={10 * scale}
    >
      <HStack
        width={`${seed * 12 * scale}%`}
        height={28 * scale}
        backgroundColor="rgba(0,0,0,0.05)"
        borderRadius={7}
      />
      <VStack spacing={6 * scale}>
        {[1, 2, 3].map((index) => (
          <HStack
            key={index}
            width={`${
              scale * seed * (15 - (2 - index > -1 ? index : -index) * 4)
            }%`}
            height={20 * scale}
            maxWidth="100%"
            backgroundColor="rgba(0,0,0,0.025)"
            borderRadius={5}
          />
        ))}
      </VStack>
    </VStack>
  )
}
