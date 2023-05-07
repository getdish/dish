import { autocompletesStore } from './AutocompletesStore'
import { drawerStore } from './drawerStore'
import { inputStoreLocation, inputStoreSearch } from './inputStore'
import { series, sleep } from '@dish/async'
import { isSafari } from '@dish/helpers'
import { YStack, useConstant, useGet } from '@dish/ui'
import { useSelector } from '@tamagui/use-store'
import React from 'react'
import { PanResponder, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

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

  // return null

  return (
    <YStack position="absolute" top={-2} left={0} right={0} bottom={-2} zIndex={1000000}>
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

          if (isSafari) {
            // create invisible dummy input to receive the focus first
            const fakeInput = document.createElement('input')
            fakeInput.setAttribute('type', 'text')
            fakeInput.style.position = 'absolute'
            fakeInput.style.opacity = '0'
            fakeInput.style.height = '0'
            fakeInput.style.fontSize = '16px' // disable auto zoom

            // you may need to append to another element depending on the browser's auto
            // zoom/scroll behavior
            document.body.prepend(fakeInput)

            // focus so that subsequent async focus will work
            fakeInput.focus?.()
            setTimeout(() => {
              document.body.removeChild(fakeInput)
            }, 1000)
          }

          console.log('did press', drawerStore.isDragging)
          autocompletesStore.setTarget(name)
        }}
      >
        <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} />
      </TouchableWithoutFeedback>
    </YStack>
  )
}
