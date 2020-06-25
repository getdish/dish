import { AbsoluteVStack, Text, VStack } from '@dish/ui'
import React from 'react'
import {
  FallbackProps,
  ErrorBoundary as ReactErrorBoundary,
} from 'react-error-boundary'

function ErrorFallback({
  error,
  componentStack,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <AbsoluteVStack
      fullscreen
      alignItems="center"
      justifyContent="center"
      backgroundColor="darkred"
      padding={20}
      overflow="hidden"
    >
      <VStack left={50} flex={1} overflow="hidden">
        <Text color="#fff">
          <pre>{error?.message}</pre>
          <pre>{componentStack}</pre>
          <pre>{error?.stack}</pre>
        </Text>
      </VStack>
      <VStack padding={10} backgroundColor="red" onPress={resetErrorBoundary}>
        <Text>Try Again</Text>
      </VStack>
    </AbsoluteVStack>
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
