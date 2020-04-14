import React from 'react'
import { Text } from 'react-native'

import { VStack } from './ui/Stacks'

export function NotFoundPage() {
  return (
    <VStack alignItems="center" justifyContent="center">
      <Text style={{ fontSize: 30 }}>Not found! 😞</Text>
    </VStack>
  )
}
