import React, { useState } from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { ScrollView } from 'react-native'
import { AbsoluteVStack, Button, Text, VStack } from 'snackui'

export function ErrorBoundary({
  children,
  name,
}: {
  children: any
  name: string
}) {
  const [errorState, setErrorState] = useState<{
    error: Error
    componentStack: any
  } | null>(null)
  return (
    <ReactErrorBoundary
      onError={(error, stack) => {
        setErrorState({ error, componentStack: stack?.componentStack })
      }}
      onReset={() => {
        setErrorState(null)
      }}
      fallbackRender={({ error, resetErrorBoundary }) => {
        const tryButton = (
          <Button
            backgroundColor="red"
            onPress={() => {
              resetErrorBoundary()
              setErrorState(null)
            }}
          >
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
                  {errorState?.componentStack}
                  {error?.stack}
                </Text>
                {tryButton}
              </ScrollView>
            </VStack>
          </AbsoluteVStack>
        )
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}
