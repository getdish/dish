import React, { memo, useCallback, useRef } from 'react'

import { useForceUpdate } from '../hooks/useForceUpdate'
import { VStack, ZStack } from './Stacks'
import { Text } from './Text'

let show: (text: string, duration: number) => void

export const Toast = {
  // @ts-ignore
  show: (...args) => show(...args),
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
    (text: string, duration: number = 1000) => {
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
    <ZStack fullscreen alignItems="flex-end" justifyContent="center">
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
    </ZStack>
  )
})
