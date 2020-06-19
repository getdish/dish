import React, { memo, useEffect, useRef, useState } from 'react'
import { TextInput } from 'react-native'

import { HStack } from '../../../../../packages/ui/src'
import {
  inputCaretPosition,
  inputClearSelection,
  inputGetNode,
  inputIsTextSelected,
} from '../../helpers/input'
import { useOvermind } from '../../state/useOvermind'
import { HomeAutocompleteHoverableInput } from './HomeAutocomplete'
import { inputTextStyles, onFocusAnyInput } from './HomeSearchInput'

export const HomeSearchLocationInput = memo(() => {
  const om = useOvermind()
  const [locationSearch, setLocationSearch] = useState('')
  const locationInputRef = useRef<any>()
  const locationInput = inputGetNode(locationInputRef.current)

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
      const { isAutocompleteActive, autocompleteIndex } = om.state.home

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
    <HomeAutocompleteHoverableInput
      input={locationInput}
      autocompleteTarget="location"
    >
      <HStack>
        <TextInput
          ref={locationInputRef}
          value={locationSearch}
          placeholder="San Francisco"
          style={[
            inputTextStyles.textInput,
            { paddingRight: 32, fontSize: 16 },
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
  )
})
