// debug
import { MapPin, Navigation } from '@dish/react-feather'
import { useStore } from '@dish/use-store'
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

import { AppAutocompleteHoverableInput } from './AppAutocompleteHoverableInput'
import { inputTextStyles } from './AppSearchInput'
import { blue } from './colors'
import { isWeb } from './constants'
import { DishHorizonView } from './DishHorizonView'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'
import { InputStore } from './InputStore'
import { SearchInputNativeDragFix } from './SearchInputNativeDragFix'
import { useOvermind } from './state/useOvermind'

const paddingHorizontal = 16

export const AppSearchLocationInput = memo(() => {
  const media = useMedia()
  const inputStore = useStore(InputStore, { name: 'location' })
  const om = useOvermind()
  const { color } = useSearchBarTheme()
  const [locationSearch, setLocationSearch] = useState('')
  const { currentLocationName } = om.state.home.currentState

  const showAutocomplete = om.state.home.showAutocomplete === 'location'
  useEffect(() => {
    if (showAutocomplete) {
      const tm = setTimeout(() => {
        console.log('focusing')
        inputStore.node?.focus()
      }, 100)
      return () => {
        clearTimeout(tm)
      }
    }
    return undefined
  }, [showAutocomplete])

  // one way sync down for more perf
  useEffect(() => {
    return om.reaction(
      (state) => state.home.locationSearchQuery,
      (val) => setLocationSearch(val)
    )
  }, [])

  const handleKeyPress = useCallback((e) => {
    // @ts-ignore
    const code = e.keyCode
    console.log('code', code)

    switch (code) {
      case 13: {
        // enter
        const result =
          om.state.home.locationAutocompleteResults[
            om.state.home.autocompleteIndex
          ]
        if (result) {
          om.actions.home.setLocation(result.name)
          om.actions.home.setShowAutocomplete(false)
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
        om.actions.home.moveActive(-1)
        return
      }
      case 40: {
        // down
        e.preventDefault()
        om.actions.home.moveActive(1)
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
          <TouchableOpacity
            onPress={(e) => {
              prevent(e)
              inputStore.node?.focus()
            }}
          >
            <MapPin
              color={color}
              size={18}
              opacity={0.35}
              style={{ marginLeft: 10, marginRight: -5 }}
            />
          </TouchableOpacity>
          <HStack
            position="relative"
            minWidth="78.7%" // this is the hackiest ever fix for react native width issue for now
            flex={1}
            onPressOut={() => {
              om.actions.home.setShowAutocomplete('location')
            }}
          >
            {!isWeb && <SearchInputNativeDragFix name="location" />}
            <TextInput
              ref={inputStore.setNode}
              value={locationSearch}
              placeholder={currentLocationName ?? '...'}
              style={[
                inputTextStyles.textInput,
                { flex: 1, color, paddingHorizontal, fontSize: 16 },
              ]}
              onKeyPress={handleKeyPress}
              onChangeText={(text) => {
                setLocationSearch(text)
                om.actions.home.setLocationSearchQuery(text)
                if (text && om.state.home.showAutocomplete === false) {
                  om.actions.home.setShowAutocomplete('location')
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
