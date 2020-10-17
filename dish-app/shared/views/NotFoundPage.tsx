import React from 'react'
import { Text, VStack } from 'snackui'

export function NotFoundPage(props: { title?: string }) {
  return (
    <VStack alignItems="center" justifyContent="center">
      <Text fontSize={30}>{props.title ?? 'Not found!'} 😞</Text>
    </VStack>
  )
}
