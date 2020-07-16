import React, { memo, useCallback, useRef } from 'react'

import { useForceUpdate } from '../hooks/useForceUpdate'
import { AbsoluteVStack, VStack } from './Stacks'
import { Text } from './Text'

let show: (text: string, duration: number) => void = (text) => {
  console.warn('NO SHOW', text)
}

export const Toast = {
  show: (text: string, duration = 1000) => show(text, duration),
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
    (text: string, duration = 1000) => {
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
      alignItems="flex-end"
      justifyContent="center"
    >
      {stateRef.current.show && (
        <VStack
          backgroundColor="rgba(0,0,0,0.95)"
          shadowColor="rgba(0,0,0,0.4)"
          shadowRadius={50}
          borderRadius={9}
          padding={10}
        >
          <Text color="white" fontSize={16}>
            {stateRef.current.text}
          </Text>
        </VStack>
      )}
    </AbsoluteVStack>
  )
})
