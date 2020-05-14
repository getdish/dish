import React from 'react'
import {
  FallbackProps,
  ErrorBoundary as ReactErrorBoundary,
} from 'react-error-boundary'
import { Button, Text } from 'react-native'

import { VStack, ZStack } from './ui/Stacks'

function ErrorFallback({
  error,
  componentStack,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <ZStack
      fullscreen
      alignItems="center"
      justifyContent="center"
      backgroundColor="darkred"
      padding={20}
      overflow="hidden"
    >
      <VStack left={50} flex={1} overflow="hidden">
        <Text style={{ color: '#fff' }}>
          <pre>{error.message}</pre>
          <pre>{componentStack}</pre>
          <pre>{error.stack}</pre>
        </Text>
      </VStack>
      <Button title="Try Again" onPress={resetErrorBoundary}></Button>
    </ZStack>
  )
}

export function ErrorBoundary({
  children,
  name,
}: {
  children: any
  name: string
}) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        console.log('reset', name)
        // can reset some app state here
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}
