import { series, sleep } from '@dish/async'
import { useSelector } from '@dish/use-store'
import React from 'react'
import { PanResponder, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { VStack, useConstant, useGet } from 'snackui'

import { autocompletesStore } from './AutocompletesStore'
import { drawerStore } from './drawerStore'
import { inputStoreLocation, inputStoreSearch } from './inputStore'

export let isTouchingSearchBar = false

export const SearchInputNativeDragFix = ({ name }: { name: 'search' | 'location' }) => {
  const getName = useGet(name)
  const getInputStore = () => (getName() == 'search' ? inputStoreSearch : inputStoreLocation)
  const panResponder = useConstant(() => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => {
        isTouchingSearchBar = true
        return true
      },
      onPanResponderTerminate: () => {
        isTouchingSearchBar = false
      },
      onPanResponderReject: () => {
        getInputStore().focusNode()
        isTouchingSearchBar = false
      },
      onPanResponderRelease: (e, gestureState) => {
        isTouchingSearchBar = false
      },
    })
  })

  useSelector(() => {
    const hasSpring = drawerStore.spring
    const visible = autocompletesStore.visible
    const onTarget = autocompletesStore.target === name
    if (visible && onTarget && !hasSpring) {
      return series([
        () => sleep(200),
        () => {
          console.warn('now... focus', hasSpring, visible, onTarget)
          getInputStore().focusNode()
        },
      ])
    }
  })

  return (
    <VStack position="absolute" top={-2} left={0} right={0} bottom={-2} zIndex={1000000}>
      <TouchableWithoutFeedback
        style={StyleSheet.absoluteFill}
        onPressIn={() => {
          isTouchingSearchBar = true
        }}
        onPressOut={() => {
          isTouchingSearchBar = false
        }}
        onPress={(e) => {
          e.preventDefault()
          e.stopPropagation()
          console.log('did press', drawerStore.isDragging)
          autocompletesStore.setTarget(name)
        }}
      >
        <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} />
      </TouchableWithoutFeedback>
    </VStack>
  )
}
