import { MapPin, Navigation } from '@dish/react-feather'
import { useStoreInstance } from '@dish/use-store'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { TextInput, TouchableOpacity } from 'react-native'
import {
  AbsoluteVStack,
  Button,
  HStack,
  VStack,
  prevent,
  useMedia,
} from 'snackui'

import {
  autocompleteLocationStore,
  autocompletesStore,
} from './AppAutocomplete'
import { AppAutocompleteHoverableInput } from './AppAutocompleteHoverableInput'
import { inputTextStyles } from './AppSearchInput'
import { blue } from './colors'
import { isWeb } from './constants'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'
import { setNodeOnInputStore, useInputStoreLocation } from './InputStore'
import { SearchInputNativeDragFix } from './SearchInputNativeDragFix'
import { setLocation } from './setLocation'
import { useOvermind } from './state/useOvermind'

export const AppSearchInputLocation = memo(() => {
  const media = useMedia()
  const inputStore = useInputStoreLocation()
  const om = useOvermind()
  const { color } = useSearchBarTheme()
  const { currentLocationName } = om.state.home.currentState
  const locationAutocomplete = useStoreInstance(autocompleteLocationStore)
  const autocompletes = useStoreInstance(autocompletesStore)
  const showLocationAutocomplete =
    autocompletes.visible && autocompletes.target === 'location'

  useEffect(() => {
    if (showLocationAutocomplete) {
      const tm = setTimeout(() => {
        inputStore.focusNode()
      }, 100)
      return () => {
        clearTimeout(tm)
      }
    }
    return undefined
  }, [showLocationAutocomplete])

  const handleKeyPress = useCallback((e) => {
    // @ts-ignore
    const code = e.keyCode
    console.log('code', code)

    switch (code) {
      case 13: {
        // enter
        const result = locationAutocomplete.activeResult
        if (result) {
          setLocation(result.name)
          autocompletes.setVisible(false)
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
    <VStack position="relative" flex={1}>
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
            backgroundColor: 'rgba(0,0,0,0.8)',
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
              autocompletes.setTarget('location')
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
              placeholder={currentLocationName ?? '...'}
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
                if (text && !autocompletes.visible) {
                  autocompletes.setTarget('location')
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
            onPress={() => {
              om.actions.home.moveMapToUserLocation()
            }}
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
