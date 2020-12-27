import React, { useMemo } from 'react'
import {
  PanResponder,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { VStack, useGet } from 'snackui'

import { inputStoreLocation, inputStoreSearch } from './InputStore'

export let isTouchingSearchBar = false

export const SearchInputNativeDragFix = ({
  name,
}: {
  name: 'search' | 'location'
}) => {
  const getName = useGet(name)
  const getInputStore = () =>
    getName() == 'search' ? inputStoreSearch : inputStoreLocation
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
        getInputStore().node?.focus()
        isTouchingSearchBar = false
      },
      onPanResponderRelease: (e, gestureState) => {
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
          getInputStore().node?.focus()
        }}
      >
        <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} />
      </TouchableWithoutFeedback>
    </VStack>
  )
}
