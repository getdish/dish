import React, { memo, useCallback, useRef } from 'react'

import { useForceUpdate } from '../hooks/useForceUpdate'
import { AnimatedVStack } from './AnimatedStack'
import { AbsoluteVStack, VStack } from './Stacks'
import { Text } from './Text'

let show: (text: string, duration: number) => void = (text) => {
  console.warn('NO SHOW', text)
}

export const Toast = {
  show: (text: string, duration = 2500) => show(text, duration),
}

if (typeof window !== 'undefined') {
  window['Toast'] = Toast
}

export const ToastRoot = memo(function ToastRoot() {
  const forceUpdate = useForceUpdate()
  const stateRef = useRef({
    show: false,
    text: '',
    timeout: null,
  })
  const setState = (x: any) => {
    stateRef.current = x
    forceUpdate()
  }

  show = useCallback(
    (text: string, duration = 2500) => {
      clearTimeout(stateRef.current.timeout ?? 0)
      const timeout = setTimeout(() => {
        setState({
          show: false,
          text: '',
          timeout: null,
        })
      }, duration)
      setState({
        show: true,
        text,
        timeout,
      })
    },
    [stateRef]
  )

  return (
    <AbsoluteVStack
      pointerEvents="none"
      fullscreen
      alignItems="center"
      justifyContent="flex-end"
      zIndex={10000000000}
      padding="5%"
    >
      {stateRef.current.show && !!stateRef.current.text && (
        <AnimatedVStack>
          <VStack
            backgroundColor="rgba(20,180,120,0.95)"
            shadowColor="rgba(0,0,0,0.25)"
            shadowOffset={{ height: 10, width: 0 }}
            shadowRadius={40}
            borderRadius={10}
            padding={12}
          >
            <Text color="white" fontSize={16} fontWeight="600">
              {stateRef.current.text}
            </Text>
          </VStack>
        </AnimatedVStack>
      )}
    </AbsoluteVStack>
  )
})
