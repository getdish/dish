import { MapPin, Navigation } from '@dish/react-feather'
import { Button, HStack, VStack, prevent } from '@dish/ui'
import { useStore } from '@dish/use-store'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { TextInput, TouchableOpacity } from 'react-native'

import { AppAutocompleteHoverableInput } from './AppAutocompleteHoverableInput'
import { inputTextStyles } from './AppSearchInput'
import { inputClearSelection, inputIsTextSelected } from './helpers/input'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'
import { InputStore } from './InputStore'
import { useOvermind } from './state/om'

const paddingHorizontal = 16

export const AppSearchLocationInput = memo(() => {
  const locationInputStore = useStore(InputStore, { name: 'location' })
  const om = useOvermind()
  const { theme, color, background } = useSearchBarTheme()
  const [locationSearch, setLocationSearch] = useState('')
  const { currentLocationName } = om.state.home.currentState

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
        if (inputIsTextSelected(locationInputStore.node)) {
          inputClearSelection()
          return
        }
        if (om.state.home.showAutocomplete) {
          om.actions.home.setShowAutocomplete(false)
        }
        locationInputStore.node.blur()
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
    <VStack
      position="relative"
      flex={1}
      backgroundColor={theme === 'dark' ? 'rgba(255,255,255,0.15)' : background}
      borderRadius={100}
      justifyContent="center"
    >
      <AppAutocompleteHoverableInput
        input={locationInputStore.node}
        autocompleteTarget="location"
      >
        <HStack alignItems="center" paddingHorizontal={3}>
          <TouchableOpacity
            onPress={(e) => {
              prevent(e)
              locationInputStore.node?.focus()
            }}
          >
            <MapPin
              color={color}
              size={18}
              opacity={0.5}
              style={{ marginLeft: 10, marginRight: -5 }}
            />
          </TouchableOpacity>
          <HStack
            flex={1}
            onPressOut={() => {
              om.actions.home.setShowAutocomplete('location')
            }}
          >
            <TextInput
              ref={locationInputStore.setNode}
              value={locationSearch}
              placeholder={currentLocationName ?? 'San Francisco'}
              style={[
                inputTextStyles.textInput,
                { color, paddingHorizontal, fontSize: 16 },
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
      </AppAutocompleteHoverableInput>
    </VStack>
  )
})
