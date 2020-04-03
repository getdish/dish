import React, { memo, useEffect, useRef, useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

import {
  drawerPadLeft,
  searchBarHeight,
  searchBarTopOffset,
} from '../../constants'
import { useOvermind } from '../../state/om'
import Hoverable from '../shared/Hoverable'
import { Icon } from '../shared/Icon'
import { Spacer } from '../shared/Spacer'
import { HStack, VStack, ZStack } from '../shared/Stacks'
import { CloseButton } from './CloseButton'
import { DishLogoButton } from './DishLogoButton'
import HomeAutocomplete from './HomeAutocomplete'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

const extraWidth = 22

const isTextSelected = (node?: any) => {
  const selection = window.getSelection()
  if (node && selection?.anchorNode?.firstChild !== node) return
  return !selection?.empty
}

const selectActiveInput = () => {
  const input = document.activeElement
  if (input instanceof HTMLInputElement) {
    input.select()
  }
}

const clearTextSelection = () => {
  if (window.getSelection) {
    if (window.getSelection().empty) {
      // Chrome
      window.getSelection().empty()
    } else if (window.getSelection().removeAllRanges) {
      // Firefox
      window.getSelection().removeAllRanges()
    }
  }
}

export default memo(function HomeSearchBar() {
  const om = useOvermind()
  const inputRef = useRef()
  const locationInputRef = useRef()
  const globalSearch = om.state.home.currentState.searchQuery
  const width = useHomeDrawerWidth()
  const [active, setActive] = useState(0)

  // todo - for hook
  const curActive = useRef(0)
  curActive.current = active

  // use local for a little better perf
  const [search, setSearch] = useState('')
  const [locationSearch, setLocationSearch] = useState('')

  useEffect(() => {
    setSearch(globalSearch)
  }, [globalSearch])

  // ONE way sync this state so we can control it programatically (but blurring gets annoying)
  const { showAutocomplete } = om.state.home

  // @ts-ignore
  const input: HTMLInputElement | null = inputRef.current?.['_node'] ?? null
  const locationInput: HTMLInputElement | null =
    // @ts-ignore
    locationInputRef.current?.['_node'] ?? null

  useEffect(() => {
    if (!input) return
    const isFocused = document.activeElement === input
    if (isFocused) return // ONE way sync
    if (showAutocomplete !== isFocused) {
      const target = showAutocomplete == 'location' ? locationInput : input
      if (showAutocomplete) target.focus()
      else target.blur()
    }
  }, [input, locationInput, showAutocomplete])

  useEffect(() => {
    if (!input || !locationInput) return

    const prev = () => setActive((x) => Math.max(0, x - 1))
    const next = () => {
      const autocompleteResults = om.state.home.autocompleteResults
      setActive((x) => Math.min(autocompleteResults.length - 1, x + 1))
    }

    const handleKeyPress = (e) => {
      // @ts-ignore
      const code = e.keyCode
      console.log('code', code)
      const focusedInput = document.activeElement
      if (!(focusedInput instanceof HTMLInputElement)) {
        console.warn('not a valid input')
        return
      }
      const isCaretAtEnd =
        focusedInput.value.length == focusedInput.selectionEnd
      switch (code) {
        case 39: // right
          if (isCaretAtEnd) {
            // at end
            next()
          }
          return
        case 37: // left
          if (curActive.current > 0 && isCaretAtEnd) {
            e.preventDefault()
            prev()
          }
          return
        case 27: // esc
          if (isTextSelected(focusedInput)) {
            clearTextSelection()
            return
          }
          if (om.state.home.showAutocomplete) {
            om.actions.home.setShowAutocomplete(false)
          } else {
            focusedInput.blur()
          }
          return
        case 38: // up
          e.preventDefault()
          prev()
          return
        case 40: // down
          e.preventDefault()
          next()
          return
      }
    }

    const handleClick = () => {
      const focusedInput = document.activeElement
      if (!om.state.home.showAutocomplete) {
        om.actions.home.setShowAutocomplete(
          focusedInput === locationInput ? 'location' : 'search'
        )
      }
    }

    input.addEventListener('keydown', handleKeyPress)
    locationInput.addEventListener('keydown', handleKeyPress)
    input.addEventListener('click', handleClick)
    locationInput.addEventListener('click', handleClick)

    return () => {
      input.removeEventListener('keydown', handleKeyPress)
      locationInput.removeEventListener('keydown', handleKeyPress)
      input.removeEventListener('click', handleClick)
      locationInput.removeEventListener('click', handleClick)
    }
  }, [input, locationInput])

  const tm = useRef(0)
  const tm2 = useRef(0)
  const tmInputBlur = useRef(0)

  return (
    <>
      <HomeAutocomplete active={active} />
      <View
        style={[
          styles.container,
          { width: width + extraWidth, height: searchBarHeight },
        ]}
      >
        <HStack>
          <DishLogoButton />
          <VStack flex={1.7} style={styles.searchArea}>
            <Hoverable
              // show even if moving after some time
              onHoverIn={() => {
                tm2.current = setTimeout(() => {
                  if (document.activeElement == input) {
                    om.actions.home.setShowAutocomplete('search')
                  }
                }, 300)
              }}
              onHoverOut={() => {
                clearTimeout(tm.current)
                clearTimeout(tm2.current)
              }}
              onHoverMove={() => {
                clearTimeout(tm.current)
                if (om.state.home.currentState.searchQuery) {
                  tm.current = setTimeout(() => {
                    if (document.activeElement == input) {
                      om.actions.home.setShowAutocomplete('search')
                    }
                  }, 150)
                }
              }}
            >
              <TextInput
                ref={inputRef}
                // leave uncontrolled for perf?
                value={search}
                onFocus={() => {
                  clearTimeout(tmInputBlur.current)
                  om.actions.home.setShowAutocomplete('search')
                  if (search.length > 0) {
                    selectActiveInput()
                  }
                }}
                onBlur={() => {
                  tmInputBlur.current = setTimeout(() => {
                    om.actions.home.setShowAutocomplete(false)
                  }, 150)
                }}
                onChangeText={(text) => {
                  setSearch(text)
                  om.actions.home.setSearchQuery(text)
                }}
                placeholder="Search dish, cuisine"
                style={[styles.textInput, { fontSize: 18, paddingRight: 42 }]}
              />
            </Hoverable>
            <SearchCancelButton />
          </VStack>
          <VStack flex={1} style={styles.searchArea}>
            <TextInput
              ref={locationInputRef}
              value={locationSearch}
              placeholder="in San Francisco"
              style={[styles.textInput, { paddingRight: 32, fontSize: 16 }]}
              onFocus={() => {
                clearTimeout(tmInputBlur.current)
                om.actions.home.setShowAutocomplete('location')
                if (locationSearch.length > 0) {
                  selectActiveInput()
                }
              }}
              onBlur={() => {
                tmInputBlur.current = setTimeout(() => {
                  om.actions.home.setShowAutocomplete(false)
                }, 150)
              }}
              onChangeText={(text) => {
                setLocationSearch(text)
                om.actions.home.setLocationSearchQuery(text)
              }}
            />
            <SearchLocationButton />
          </VStack>
        </HStack>
      </View>
    </>
  )
})

const SearchCancelButton = memo(() => {
  const om = useOvermind()
  return (
    <ZStack fullscreen pointerEvents="none">
      <HStack flex={1} alignItems="center" justifyContent="center">
        <Spacer flex={1} />
        <VStack
          pointerEvents="auto"
          alignItems="center"
          justifyContent="center"
          paddingRight={10}
        >
          <CloseButton
            opacity={om.state.home.currentState.searchQuery === '' ? 0 : 1}
            disabled={om.state.home.currentState.searchQuery === ''}
            onPress={() => {
              om.actions.home.setSearchQuery('')
              if (om.state.home.currentState.type === 'search') {
                om.actions.home.popTo(om.state.home.lastHomeState)
              }
            }}
            size={12}
          />
        </VStack>
      </HStack>
    </ZStack>
  )
})

const SearchLocationButton = memo(() => {
  const om = useOvermind()
  return (
    <ZStack fullscreen pointerEvents="none">
      <HStack flex={1} alignItems="center" justifyContent="center">
        <Spacer flex={1} />
        <VStack
          pointerEvents="auto"
          alignItems="center"
          justifyContent="center"
        >
          <TouchableOpacity
            style={{
              padding: 10,
            }}
            onPress={() => {
              om.actions.home.popTo(om.state.home.lastHomeState)
            }}
          >
            <Icon size={18} name="navigation" color="blue" opacity={0.5} />
          </TouchableOpacity>
        </VStack>
      </HStack>
    </ZStack>
  )
})

const styles = StyleSheet.create({
  container: {
    zIndex: 22,
    borderRadius: 16,
    shadowColor: 'rgba(0,0,0,0.12)',
    shadowRadius: 7,
    shadowOffset: { height: 2, width: 0 },
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'absolute',
    marginTop: searchBarTopOffset,
    left: drawerPadLeft - extraWidth / 2,
  },
  searchArea: {
    borderLeftWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  textInput: {
    padding: 11,
    paddingHorizontal: 16,
    flex: 1,
    fontSize: 18,
  },
})
