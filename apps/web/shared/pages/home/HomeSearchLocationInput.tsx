import {
  AbsoluteVStack,
  Button,
  HStack,
  Spacer,
  VStack,
  prevent,
} from '@dish/ui'
import React, { memo, useEffect, useRef, useState } from 'react'
import { MapPin, Navigation } from 'react-feather'
import { TextInput } from 'react-native'

import {
  inputClearSelection,
  inputGetNode,
  inputIsTextSelected,
} from '../../helpers/input'
import { useOvermind } from '../../state/useOvermind'
import { HomeAutocompleteHoverableInput } from './HomeAutocomplete'
import { useSearchBarTheme } from './HomeSearchBar'
import { inputTextStyles, onFocusAnyInput } from './HomeSearchInput'

const paddingHorizontal = 16

export const HomeSearchLocationInput = memo(() => {
  const om = useOvermind()
  const { theme, color, background } = useSearchBarTheme()
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
    const handleFocus = () => {
      om.actions.home.setSearchFocusLocationInput(true)
    }
    const handleBlur = () => {
      om.actions.home.setSearchFocusLocationInput(false)
    }
    locationInput.addEventListener('keydown', handleKeyPress)
    locationInput.addEventListener('focus', showLocationAutocomplete)
    locationInput.addEventListener('click', showLocationAutocomplete)
    locationInput.addEventListener('focus', handleFocus)
    locationInput.addEventListener('blur', handleBlur)
    return () => {
      locationInput.removeEventListener('keydown', handleKeyPress)
      locationInput.addEventListener('focus', showLocationAutocomplete)
      locationInput.removeEventListener('click', showLocationAutocomplete)
      locationInput.removeEventListener('focus', handleFocus)
      locationInput.removeEventListener('blur', handleBlur)
    }
  }, [locationInput])

  return (
    <VStack
      // contain="paint"
      position="relative"
      // flex={1}
      // minWidth={100}
      backgroundColor={theme === 'dark' ? 'rgba(255,255,255,0.1)' : background}
      borderRadius={8}
      justifyContent="center"
    >
      <HomeAutocompleteHoverableInput
        input={locationInput}
        autocompleteTarget="location"
      >
        <HStack alignItems="center">
          <MapPin
            color={color}
            size={18}
            opacity={0.5}
            style={{ marginLeft: 10, marginRight: -5 }}
            onClick={(e) => {
              prevent(e)
              locationInput?.focus()
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
            onFocus={() => {
              onFocusAnyInput()
              om.actions.home.setShowAutocomplete('location')
            }}
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
