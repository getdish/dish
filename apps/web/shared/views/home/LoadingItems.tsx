import React, { useRef } from 'react'

import { HStack, VStack } from '../ui/Stacks'

export const LoadingItems = () => (
  <VStack spacing="lg">
    <LoadingItem />
    <LoadingItem />
    <LoadingItem />
  </VStack>
)

export const LoadingItem = () => {
  const seed = useRef(Math.max(2, Math.min(6, Math.round(Math.random() * 10))))
  return (
    <VStack padding={20} spacing={10}>
      <HStack
        width={`${seed.current * 10}%`}
        height={30}
        backgroundColor="#ddd"
        borderRadius={7}
        className="shine"
      />
      <VStack spacing={10}>
        {[1, 2, 3, 4].map((index) => (
          <HStack
            key={index}
            width={seed.current * (60 - (2 - index > -1 ? index : -index) * 5)}
            height={14}
            backgroundColor="#eee"
            borderRadius={3}
            className="shine"
          />
        ))}
      </VStack>
    </VStack>
  )
}
