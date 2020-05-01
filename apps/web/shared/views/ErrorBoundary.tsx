import React from 'react'
import {
  FallbackProps,
  ErrorBoundary as ReactErrorBoundary,
} from 'react-error-boundary'
import { Button } from 'react-native'

import { ZStack } from './ui/Stacks'

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
    >
      <pre>{error.message}</pre>
      <pre>{componentStack}</pre>
      <hr />
      <pre>{error.stack}</pre>
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
