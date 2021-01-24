import { MapPin, Navigation } from '@dish/react-feather'
import React, { memo, useCallback } from 'react'
import { TextInput } from 'react-native'
import { AbsoluteVStack, Button, HStack, VStack, useMedia } from 'snackui'

import { blue } from '../constants/colors'
import { isWeb } from '../constants/constants'
import {
  autocompleteLocationStore,
  autocompletesStore,
} from './AppAutocomplete'
import { AppAutocompleteHoverableInput } from './AppAutocompleteHoverableInput'
import { appMapStore } from './AppMapStore'
import { inputTextStyles } from './AppSearchInput'
import { useHomeStore } from './homeStore'
import { useAutocompleteInputFocus } from './hooks/useAutocompleteInputFocus'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'
import { setNodeOnInputStore, useInputStoreLocation } from './inputStore'
import { SearchInputNativeDragFix } from './SearchInputNativeDragFix'

export const AppSearchInputLocation = memo(() => {
  const media = useMedia()
  const inputStore = useInputStoreLocation()
  const home = useHomeStore()
  const { color } = useSearchBarTheme()
  const { curLocName } = home.currentState

  // focus on visible
  useAutocompleteInputFocus(inputStore)

  const handleKeyPress = useCallback((e) => {
    // @ts-ignore
    const code = e.keyCode
    console.log('code', code)

    switch (code) {
      case 13: {
        // enter
        const result = autocompleteLocationStore.activeResult
        if (result) {
          appMapStore.setLocation(result.name)
          autocompletesStore.setVisible(false)
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
      <AppAutocompleteHoverableInput
        input={inputStore.node}
        autocompleteTarget="location"
      >
        <HStack
          flex={1}
          minHeight={44}
          alignItems="center"
          backgroundColor="rgba(0,0,0,0.7)"
          justifyContent="center"
          paddingHorizontal={8}
          position="relative"
          borderRadius={12}
          overflow="hidden"
          hoverStyle={{
            backgroundColor: 'rgba(155,155,155,0.1)',
          }}
          focusStyle={{
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}
          {...(media.sm && {
            backgroundColor: '#eee',
            hoverStyle: {
              backgroundColor: '#eee',
            },
            focusStyle: {
              backgroundColor: '#eee',
            },
          })}
        >
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
            padding={8}
            alignSelf="center"
            marginRight={5}
            borderRadius={1000}
            onPress={appMapStore.moveToUserLocation}
          >
            <Navigation
              size={20}
              opacity={0.5}
              color={color === '#fff' ? '#fff' : blue}
            />
          </Button>
        </HStack>
      </AppAutocompleteHoverableInput>
    </VStack>
  )
})
