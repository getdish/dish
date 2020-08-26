import { Button, HStack, VStack, prevent } from '@dish/ui'
import React, { memo, useEffect, useRef, useState } from 'react'
import { MapPin, Navigation } from 'react-feather'
import { TextInput } from 'react-native'

import {
  inputClearSelection,
  inputGetNode,
  inputIsTextSelected,
} from '../../helpers/input'
import { useOvermind } from '../../state/om'
import { HomeAutocompleteHoverableInput } from './HomeAutocompleteHoverableInput'
import { inputTextStyles } from './HomeSearchInput'
import { useSearchBarTheme } from './useSearchBarTheme'

const paddingHorizontal = 16

export const HomeSearchLocationInput = memo(() => {
  const om = useOvermind()
  const { theme, color, background } = useSearchBarTheme()
  const [locationSearch, setLocationSearch] = useState('')
  const locationInputRef = useRef<any>()
  const { currentLocationName } = om.state.home.currentState

  // one way sync down for more perf
  useEffect(() => {
    return om.reaction(
      (state) => state.home.locationSearchQuery,
      (val) => setLocationSearch(val)
    )
  }, [])

  useEffect(() => {
    if (!locationInputRef.current) return
    const locationInput = inputGetNode(locationInputRef.current)
    const handleKeyPress = (e) => {
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
      om.actions.home.setShowAutocomplete('location')
    }
    locationInput.addEventListener('keydown', handleKeyPress)
    // locationInput.addEventListener('focus', showLocationAutocomplete)
    locationInput.addEventListener('click', showLocationAutocomplete)
    return () => {
      locationInput.removeEventListener('keydown', handleKeyPress)
      // locationInput.addEventListener('focus', showLocationAutocomplete)
      locationInput.removeEventListener('click', showLocationAutocomplete)
    }
  }, [])

  return (
    <VStack
      // contain="paint"
      position="relative"
      // flex={1}
      // minWidth={100}
      backgroundColor={theme === 'dark' ? 'rgba(255,255,255,0.1)' : background}
      borderRadius={100}
      justifyContent="center"
    >
      <HomeAutocompleteHoverableInput
        input={locationInputRef.current}
        autocompleteTarget="location"
      >
        <HStack alignItems="center" paddingHorizontal={3}>
          <MapPin
            color={color}
            size={18}
            opacity={0.5}
            style={{ marginLeft: 10, marginRight: -5 }}
            onClick={(e) => {
              prevent(e)
              locationInputRef.current?.focus()
            }}
          />
          <TextInput
            ref={locationInputRef}
            value={locationSearch}
            placeholder={currentLocationName ?? 'San Francisco'}
            style={[
              inputTextStyles.textInput,
              { color, paddingHorizontal, fontSize: 16 },
            ]}
            // onFocus={(e) => {
            //   debugger
            //   // e.preventDefault()
            //   // onFocusAnyInput()
            //   // om.actions.home.setShowAutocomplete('location')
            // }}
            onChangeText={(text) => {
              setLocationSearch(text)
              om.actions.home.setLocationSearchQuery(text)
              if (text && om.state.home.showAutocomplete === false) {
                om.actions.home.setShowAutocomplete('location')
              }
            }}
          />
          <Button
            padding={8}
            alignSelf="center"
            marginRight={5}
            borderRadius={1000}
            onPress={() => {
              om.actions.home.moveMapToUserLocation()
            }}
          >
            <Navigation size={20} opacity={0.7} color={color} />
          </Button>
        </HStack>
      </HomeAutocompleteHoverableInput>
    </VStack>
  )
})
