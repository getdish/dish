import React, { useState } from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { ScrollView } from 'react-native'
import { AbsoluteVStack, Button, Spacer, Text, VStack } from 'snackui'

export function ErrorBoundary({
  children,
  name,
}: {
  children: any
  name: string
}) {
  const [errorState, setErrorState] = useState<{
    error: Error
    componentStack?: string
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
            theme="error"
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
            backgroundColor="#000"
            padding={15}
            overflow="hidden"
          >
            <VStack maxWidth="100%" flex={1} overflow="hidden">
              <ScrollView style={{ width: '100%' }}>
                <VStack spacing>
                  {tryButton}
                  <Text
                    fontWeight="400"
                    className="white-space-pre font-mono"
                    color="#fff"
                  >
                    {error?.message}
                    <Spacer />
                    <Text fontWeight="900">Stack</Text>
                    <Spacer />
                    {error?.stack}
                    <Spacer />
                    <Text fontWeight="900">Component Stack</Text>
                    <Spacer />
                    {errorState?.componentStack}
                  </Text>
                  {tryButton}
                  <VStack height={400} />
                </VStack>
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
