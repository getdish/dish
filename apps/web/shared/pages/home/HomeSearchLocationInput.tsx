import { AbsoluteVStack, Button, HStack, Spacer, VStack } from '@dish/ui'
import React, { memo, useEffect, useRef, useState } from 'react'
import { Navigation } from 'react-feather'
import { TextInput } from 'react-native'

import {
  inputClearSelection,
  inputGetNode,
  inputIsTextSelected,
} from '../../helpers/input'
import { useOvermind } from '../../state/useOvermind'
import { HomeAutocompleteHoverableInput } from './HomeAutocomplete'
import { inputTextStyles, onFocusAnyInput } from './HomeSearchInput'

const paddingHorizontal = 16

export const HomeSearchLocationInput = memo(() => {
  const om = useOvermind()
  const [locationSearch, setLocationSearch] = useState('')
  const locationInputRef = useRef<any>()
  const locationInput = inputGetNode(locationInputRef.current)
  const { currentLocationName } = om.state.home.currentState

  // one way sync down for more perf
  useEffect(() => {
    return om.reaction(
      (state) => state.home.locationSearchQuery,
      (val) => setLocationSearch(val)
    )
  }, [])

  useEffect(() => {
    if (!locationInput) return
    const handleKeyPress = (e) => {
      // @ts-ignore
      const code = e.keyCode
      console.log('code', code)

      switch (code) {
        case 13: {
          // enter
          return
        }
        case 27: {
          // esc
          if (inputIsTextSelected(locationInput)) {
            inputClearSelection()
            return
          }
          if (om.state.home.showAutocomplete) {
            om.actions.home.setShowAutocomplete(false)
          }
          locationInput.blur()
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
    }
    const showLocationAutocomplete = () => {
      if (!om.state.home.showAutocomplete) {
        om.actions.home.setShowAutocomplete('location')
      }
    }
    locationInput.addEventListener('keydown', handleKeyPress)
    locationInput.addEventListener('focus', showLocationAutocomplete)
    locationInput.addEventListener('click', showLocationAutocomplete)
    return () => {
      locationInput.removeEventListener('keydown', handleKeyPress)
      locationInput.addEventListener('focus', showLocationAutocomplete)
      locationInput.removeEventListener('click', showLocationAutocomplete)
    }
  }, [locationInput])

  return (
    <VStack
      position="relative"
      flex={65}
      minWidth={180}
      backgroundColor="rgba(255,255,255,0.1)"
      borderRadius={8}
    >
      <HomeAutocompleteHoverableInput
        input={locationInput}
        autocompleteTarget="location"
      >
        <HStack>
          <TextInput
            ref={locationInputRef}
            value={locationSearch}
            placeholder={currentLocationName ?? 'San Francisco'}
            style={[
              inputTextStyles.textInput,
              { paddingHorizontal, fontSize: 16 },
            ]}
            onFocus={() => {
              onFocusAnyInput()
              om.actions.home.setShowAutocomplete('location')
            }}
            onChangeText={(text) => {
              setLocationSearch(text)
              om.actions.home.setLocationSearchQuery(text)
            }}
          />
        </HStack>
      </HomeAutocompleteHoverableInput>
      <SearchLocationButton />
    </VStack>
  )
})

const SearchLocationButton = memo(() => {
  const om = useOvermind()
  return (
    <AbsoluteVStack fullscreen pointerEvents="none">
      <HStack flex={1} alignItems="center" justifyContent="center">
        <Spacer flex={1} />
        <Button
          padding={8}
          marginRight={5}
          borderRadius={1000}
          onPress={() => {
            om.actions.home.moveMapToUserLocation()
          }}
        >
          <Navigation size={20} color="rgba(255,255,255,0.8)" />
        </Button>
      </HStack>
    </AbsoluteVStack>
  )
})
