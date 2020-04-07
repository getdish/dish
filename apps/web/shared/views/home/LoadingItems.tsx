import React from 'react'

import { HStack, VStack } from '../shared/Stacks'

export const LoadingItems = () => (
  <VStack spacing="lg">
    <LoadingItem />
    <LoadingItem />
    <LoadingItem />
  </VStack>
)

export const LoadingItem = () => {
  return (
    <VStack padding={20} spacing={20}>
      <HStack
        width="60%"
        height={40}
        backgroundColor="#ddd"
        className="shine"
      />
      <VStack spacing={10}>
        {[1, 2, 3, 4].map((index) => (
          <HStack
            key={index}
            width={60 - (2 - index > 0 ? index : -index) * 10}
            height={20}
            backgroundColor="#ddd"
            className="shine"
          />
        ))}
      </VStack>
    </VStack>
  )
}
