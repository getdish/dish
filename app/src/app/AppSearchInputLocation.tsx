import { AbsoluteXStack, AbsoluteYStack, Button, XStack, YStack } from '@dish/ui'
import { MapPin, Navigation } from '@tamagui/feather-icons'
import React, { memo, useCallback } from 'react'
import { TextInput } from 'react-native'

import { isWeb } from '../constants/constants'
import { isTouchDevice, supportsTouchWeb } from '../constants/platforms'
import { appMapStore } from './appMapStore'
import { inputTextStyles } from './AppSearchInput'
import { autocompleteLocationStore, autocompletesStore } from './AutocompletesStore'
import { useHomeStoreSelector } from './homeStore'
import { useAutocompleteInputFocus } from './hooks/useAutocompleteInputFocus'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'
import { InputFrame } from './InputFrame'
import { setNodeOnInputStore, useInputStoreLocation } from './inputStore'
import { InputTagButton } from './InputTagButton'
import { SearchInputNativeDragFix } from './SearchInputNativeDragFix'
import { setLocationFromAutocomplete } from './setLocation'
import { useAutocompleteFocusWebNonTouch } from './useAutocompleteFocusWeb'

const isWebTouch = supportsTouchWeb

export const AppSearchInputLocation = memo(function AppSearchInputLocation() {
  const inputStore = useInputStoreLocation()
  const curLocName = useHomeStoreSelector((x) => x.currentState.curLocName)
  const { color } = useSearchBarTheme()

  // focus on visible
  useAutocompleteInputFocus(inputStore)

  // focus for web
  if (isWeb && !isWebTouch) {
    useAutocompleteFocusWebNonTouch(inputStore)
  }

  const handleKeyPress = useCallback((e) => {
    // @ts-ignore
    const code = e.keyCode

    switch (code) {
      case 13: {
        // enter
        const result = autocompleteLocationStore.activeResult
        if (result?.type === 'place') {
          setLocationFromAutocomplete(result.name, result.slug)
          autocompletesStore.setVisible(false)
        } else {
          console.warn('not a place?')
        }
        return
      }
      case 27: {
        // esc
        inputStore.handleEsc()
        return
      }
      case 38: {
        // up
        e.preventDefault()
        inputStore.moveActive(-1)
        return
      }
      case 40: {
        // down
        e.preventDefault()
        inputStore.moveActive(1)
        return
      }
    }
  }, [])

  const setInputNode = useCallback((view) => setNodeOnInputStore(inputStore, view), [])
  const showLocationTag = !inputStore.isFocused && !!curLocName

  return (
    // needs overflow hidden or else search box expands past edge on media.sm
    // while searching location
    <YStack position="relative" flex={1} overflow="hidden">
      <InputFrame>
        <XStack
          position="relative"
          minWidth="78.7%" // this is the hackiest ever fix for react native width issue for now
          flexShrink={1}
          flex={1}
          onPressOut={() => {
            autocompletesStore.setTarget('location')
          }}
          flexWrap="nowrap"
        >
          <AbsoluteYStack
            top={0}
            left={0}
            bottom={0}
            alignItems="center"
            justifyContent="center"
            pointerEvents="none"
          >
            <MapPin color={color} size={18} opacity={0.35} />
          </AbsoluteYStack>

          {isTouchDevice && <SearchInputNativeDragFix name="location" />}

          {showLocationTag && (
            <AbsoluteXStack
              alignItems="center"
              justifyContent="center"
              pointerEvents="none"
              top={0}
              left={28}
              bottom={0}
              zIndex={100}
            >
              <InputTagButton noLink name={curLocName} />
            </AbsoluteXStack>
          )}

          <TextInput
            selectTextOnFocus
            ref={setInputNode}
            value={showLocationTag ? '' : inputStore.value ?? ''}
            // placeholder={curLocName ?? '...'}
            onFocus={() => {
              inputStore.setIsFocused(true)
            }}
            onBlur={() => {
              inputStore.setIsFocused(false)
              // no action here it will go away
            }}
            style={[
              inputTextStyles.textInput,
              {
                flex: 1,
                color,
                paddingLeft: 16 + 10,
                paddingRight: 16,
                fontSize: 16,
              },
            ]}
            onKeyPress={handleKeyPress}
            onChangeText={(text) => {
              inputStore.setValue(text)
              if (text && !autocompletesStore.visible) {
                autocompletesStore.setTarget('location')
              }
            }}
          />
        </XStack>
        <Button
          alignSelf="center"
          backgroundColor="transparent"
          opacity={0.5}
          marginRight={4}
          hoverStyle={{
            opacity: 1,
          }}
          icon={<Navigation size={20} color={color} />}
          borderRadius={1000}
          onPress={appMapStore.moveToUserLocation}
          noTextWrap
        />
      </InputFrame>
    </YStack>
  )
})
