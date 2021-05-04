import { MapPin, Navigation } from '@dish/react-feather'
import React, { memo, useCallback } from 'react'
import { TextInput } from 'react-native'
import { AbsoluteVStack, Button, HStack, VStack, getMedia } from 'snackui'

import { isWeb } from '../constants/constants'
import { supportsTouchWeb } from '../constants/platforms'
import { AppAutocompleteHoverableInput } from './AppAutocompleteHoverableInput'
import { appMapStore } from './AppMapStore'
import { inputTextStyles } from './AppSearchInput'
import { autocompleteLocationStore, autocompletesStore } from './AutocompletesStore'
import { useHomeStoreSelector } from './homeStore'
import { useAutocompleteInputFocus } from './hooks/useAutocompleteInputFocus'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'
import { InputFrame } from './InputFrame'
import { setNodeOnInputStore, useInputStoreLocation } from './inputStore'
import { SearchInputNativeDragFix } from './SearchInputNativeDragFix'
import { setLocation } from './setLocation'
import { useAutocompleteFocusWebNonTouch } from './useAutocompleteFocusWeb'

const isWebTouch = supportsTouchWeb

export const AppSearchInputLocation = memo(function AppSearchInputLocation() {
  // const theme = useTheme()
  // const media = useMedia()
  const inputStore = useInputStoreLocation()
  const input = inputStore.node
  const curLocName = useHomeStoreSelector((x) => x.currentState.curLocName)
  const { color } = useSearchBarTheme()

  // focus on visible
  useAutocompleteInputFocus(inputStore)

  // focus for web
  if (isWeb && !isWebTouch) {
    useAutocompleteFocusWebNonTouch({ input, target: 'search' })
  }

  const handleKeyPress = useCallback((e) => {
    // @ts-ignore
    const code = e.keyCode
    console.log('code', code)

    switch (code) {
      case 13: {
        // enter
        const result = autocompleteLocationStore.activeResult
        if (result?.type === 'place') {
          setLocation(result.name, result.slug)
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

  return (
    // needs overflow hidden or else search box expands past edge on media.sm
    // while searching location
    <VStack position="relative" flex={1} overflow="hidden">
      <AppAutocompleteHoverableInput input={inputStore.node} autocompleteTarget="location">
        <InputFrame>
          <HStack
            position="relative"
            minWidth="78.7%" // this is the hackiest ever fix for react native width issue for now
            flex={1}
            onPressOut={() => {
              autocompletesStore.setTarget('location')
            }}
          >
            <AbsoluteVStack
              top={0}
              left={0}
              bottom={0}
              alignItems="center"
              justifyContent="center"
              pointerEvents="none"
            >
              <MapPin color={color} size={18} opacity={0.35} />
            </AbsoluteVStack>
            {!isWeb && <SearchInputNativeDragFix name="location" />}
            <TextInput
              ref={(view) => setNodeOnInputStore(inputStore, view)}
              value={inputStore.value ?? ''}
              placeholder={curLocName ?? '...'}
              onBlur={() => {
                if (isWeb && !getMedia().sm) {
                  if (autocompletesStore.target === 'location') {
                    autocompletesStore.setVisible(false)
                  }
                }
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
          </HStack>
          <Button
            backgroundColor="transparent"
            // padding={10}
            // does nothing on native
            marginRight={2}
            borderRadius={1000}
            onPress={appMapStore.moveToUserLocation}
            transform={[{ translateY: isWeb ? 2 : 0 }]}
            noTextWrap
          >
            <Navigation size={20} opacity={0.5} color={color} />
          </Button>
        </InputFrame>
      </AppAutocompleteHoverableInput>
    </VStack>
  )
})
