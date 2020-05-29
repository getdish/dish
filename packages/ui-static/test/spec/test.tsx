import { Box, VStack } from '@dish/ui'
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
    <Box className="who" onAccessibilityTap={() => {}} overflow="hidden">
      <div>hi</div>
    </Box>
  )
}

export function Test3(props: any) {
  return (
    <VStack overflow="hidden" {...props}>
      <div>hi</div>
    </VStack>
  )
}

export * from '@dish/ui'
