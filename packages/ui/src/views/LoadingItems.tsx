import React, { useRef } from 'react'

import { HStack, VStack } from './Stacks'

export const LoadingItems = () => (
  <VStack spacing="sm">
    <LoadingItem />
    <LoadingItem />
    <LoadingItem />
  </VStack>
)

// same across all instances, less flickers
const seed = Math.max(3, Math.min(6, Math.round(Math.random() * 10)))

export const LoadingItem = () => {
  return (
    <VStack overflow="hidden" className="shine" padding={20} spacing={10}>
      <HStack
        width={`${seed * 12}%`}
        height={28}
        backgroundColor="rgba(0,0,0,0.05)"
        borderRadius={7}
        // casued bug with filters, if we contain maybe wont
        // className="shine"
      />
      <VStack spacing={6}>
        {[1, 2, 3].map((index) => (
          <HStack
            key={index}
            width={`${seed * (15 - (2 - index > -1 ? index : -index) * 4)}%`}
            height={20}
            maxWidth="100%"
            backgroundColor="rgba(0,0,0,0.025)"
            borderRadius={5}
          />
        ))}
      </VStack>
    </VStack>
  )
}
