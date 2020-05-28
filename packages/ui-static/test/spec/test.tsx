import { HStack, VStack } from '@dish/ui'
import React from 'react'

export function Test1() {
  return (
    <VStack flex={1} borderRadius={100} backgroundColor="red">
      <div>hi</div>
    </VStack>
  )
}

export function Test2() {
  return (
    <HStack className="who" onHoverIn={() => {}} overflow="hidden">
      <div>hi</div>
    </HStack>
  )
}

export { default as React } from 'react'
