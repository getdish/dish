import { AbsoluteYStack, Button, Paragraph, Spacer, Text, YStack } from '@dish/ui'
import React, { useState } from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { ScrollView } from 'react-native'

export function ErrorBoundary({ children, name }: { children: any; name: string }) {
  const [errorState, setErrorState] = useState<{
    error: Error
    componentStack?: string
  } | null>(null)

  return (
    <ReactErrorBoundary
      onError={(error, stack) => {
        console.error(error)
        console.error(stack)
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
          <AbsoluteYStack
            fullscreen
            alignItems="center"
            justifyContent="center"
            backgroundColor="#000"
            padding={15}
            overflow="hidden"
          >
            {process.env.NODE_ENV === 'production' && <Paragraph size="$8">😭😭😭 err</Paragraph>}

            {process.env.NODE_ENV === 'development' && (
              <YStack maxWidth="100%" flex={1} overflow="hidden">
                <ScrollView style={{ width: '100%' }}>
                  <YStack spacing>
                    {tryButton}
                    <Text fontWeight="400" className="white-space-pre font-mono" color="#fff">
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
                    <YStack height={400} />
                  </YStack>
                </ScrollView>
              </YStack>
            )}
          </AbsoluteYStack>
        )
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}
