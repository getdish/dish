import { VStack } from '@dish/ui'
import { useStore } from '@dish/use-store'
import React, { useMemo } from 'react'
import {
  PanResponder,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import { InputStore } from './InputStore'

export let isTouchingSearchBar = false

export const SearchInputNativeDragFix = ({
  name,
}: {
  name: 'search' | 'location'
}) => {
  const inputStore = useStore(InputStore, { name })
  const panResponder = useMemo(() => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => {
        isTouchingSearchBar = true
        return true
      },
      onPanResponderTerminate: () => {
        console.log(123)
      },
      onPanResponderReject: () => {
        console.log('inputStore.node', inputStore.node?.focus())
        isTouchingSearchBar = false
      },
      onPanResponderRelease: (e, gestureState) => {
        console.log('inputStore.node', inputStore.node?.focus())
        isTouchingSearchBar = false
      },
    })
  }, [])

  return (
    <VStack
      position="absolute"
      top={-2}
      left={0}
      right={0}
      bottom={-2}
      zIndex={1000000}
    >
      <TouchableWithoutFeedback
        style={StyleSheet.absoluteFill}
        onPress={(e) => {
          e.preventDefault()
          e.stopPropagation()
          inputStore.node?.focus()
        }}
      >
        <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} />
      </TouchableWithoutFeedback>
    </VStack>
  )
}
