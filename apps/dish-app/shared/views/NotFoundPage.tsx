import { Text, VStack } from '@dish/ui'
import React from 'react'

export function NotFoundPage(props: { title?: string }) {
  return (
    <VStack alignItems="center" justifyContent="center">
      <Text fontSize={30}>{props.title ?? 'Not found!'} 😞</Text>
    </VStack>
  )
}
