import React from 'react'
import {
  FallbackProps,
  ErrorBoundary as ReactErrorBoundary,
} from 'react-error-boundary'
import { ScrollView } from 'react-native'
import { AbsoluteVStack, Button, Text, VStack } from 'snackui'

import { SmallButton } from './ui/SmallButton'

function ErrorFallback({
  error,
  componentStack,
  resetErrorBoundary,
}: FallbackProps) {
  const tryButton = (
    <Button backgroundColor="red" onPress={resetErrorBoundary}>
      <Text color="white">Try Again</Text>
    </Button>
  )
  return (
    <AbsoluteVStack
      fullscreen
      alignItems="center"
      justifyContent="center"
      backgroundColor="darkred"
      padding={15}
      overflow="hidden"
    >
      <VStack maxWidth="100%" flex={1} overflow="hidden">
        <ScrollView>
          {tryButton}
          <Text color="#fff">
            {error?.message}
            {componentStack}
            {error?.stack}
          </Text>
          {tryButton}
        </ScrollView>
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
      // onReset={() => {
      //   console.log('reset', name)
      //   // can reset some app state here
      // }}
    >
      {children}
    </ReactErrorBoundary>
  )
}
