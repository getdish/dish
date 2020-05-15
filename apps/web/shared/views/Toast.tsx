import { useCallback, useState } from 'react'
import React from 'react'
import { Text } from 'react-native'

import { VStack, ZStack } from './ui/Stacks'

let show: (text: string, duration: number) => void

export const Toast = {
  // @ts-ignore
  show: (...args) => show(...args),
}

export function ToastRoot({
  textStyle,
  style,
}: {
  style?: any
  position?: 'top' | 'center' | 'bottom'
  textStyle?: any
  positionValue?: number
  fadeInDuration?: number
  defaultCloseDelay?: number
  fadeOutDuration?: number
  opacity?: number
}) {
  const [{ isShow, text }, setState] = useState({
    isShow: false,
    text: '',
  })

  show = useCallback((text: string, duration: number = 1000) => {
    setState({
      isShow: true,
      text,
    })
  }, [])

  return (
    <ZStack fullscreen alignItems="flex-end" justifyContent="center">
      <VStack
        backgroundColor="rgba(0,0,0,0.95)"
        shadowColor="rgba(0,0,0,0.4)"
        shadowRadius={50}
        borderRadius={9}
        padding={10}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            ...textStyle,
          }}
        >
          {text}
        </Text>
      </VStack>
    </ZStack>
  )
}
