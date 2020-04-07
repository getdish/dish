import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

import {
  drawerBorderRadius,
  drawerPadLeft,
  isWorker,
  searchBarHeight,
  searchBarTopOffset,
} from '../../constants'
import { useOvermind } from '../../state/om'
import { BlurView } from '../shared/BlurView'
import { Divider } from '../shared/Divider'
import Hoverable from '../shared/Hoverable'
import { Icon } from '../shared/Icon'
import { LinkButton } from '../shared/Link'
import { Spacer } from '../shared/Spacer'
import { HStack, VStack, ZStack } from '../shared/Stacks'
import { CloseButton } from './CloseButton'
import { DishLogoButton } from './DishLogoButton'
import HomeAutocomplete from './HomeAutocomplete'
import { HomeUserMenu } from './HomeUserMenu'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

const extraWidth = 36

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

  // use local for a little better perf
  const [search, setSearch] = useState('')
  const [locationSearch, setLocationSearch] = useState('')

  // one way sync down for more perf
  useEffect(() => {
    const offSearch = om.reaction(
      (state) => state.home.currentState.searchQuery,
      (val) => setSearch(val)
    )
    const offLoc = om.reaction(
      (state) => state.home.locationSearchQuery,
      (val) => setLocationSearch(val)
    )
    return () => {
      offSearch()
      offLoc()
    }
  })

  // ONE way sync this state so we can control it programatically (but blurring gets annoying)
  const { showAutocomplete } = om.state.home

  // @ts-ignore
  const input: HTMLInputElement | null = inputRef.current?.['_node'] ?? null
  const locationInput: HTMLInputElement | null =
    // @ts-ignore
    locationInputRef.current?.['_node'] ?? null

  const handleCancel = useCallback(() => {
    setTimeout(() => {
      input.focus()
    }, 100)
  }, [input])

  useEffect(() => {
    if (!input) return
    const isFocused = document.activeElement === input
    if (isFocused) return // ONE way sync
    if (showAutocomplete !== isFocused) {
      const target = showAutocomplete == 'location' ? locationInput : input
      if (!isWorker) {
        if (showAutocomplete) target.focus()
        else target.blur()
      }
    }
  }, [input, locationInput, showAutocomplete])

  useEffect(() => {
    if (!input || !locationInput) return
    const prev = () => {
      om.actions.home.moveAutocompleteIndex(-1)
    }
    const next = () => {
      om.actions.home.moveAutocompleteIndex(1)
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
      const isAutocompleteActive = om.state.home.isAutocompleteActive
      const isCaretAtEnd =
        focusedInput.value.length == focusedInput.selectionEnd
      switch (code) {
        case 39: // right
          if (isAutocompleteActive && isCaretAtEnd) {
            // at end
            next()
          }
          return
        case 37: // left
          if (
            isAutocompleteActive &&
            om.state.home.autocompleteIndex > 0 &&
            isCaretAtEnd
          ) {
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
          om.actions.home.moveActiveUp()
          return
        case 40: // down
          e.preventDefault()
          om.actions.home.moveActiveDown()
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

  const tm = useRef<any>(0)
  const tm2 = useRef<any>(0)
  const tmInputBlur = useRef<any>(0)

  const divider = <Divider vertical flexLine={1} />

  return (
    <>
      <HomeAutocomplete />
      <View style={[styles.container, { height: searchBarHeight }]}>
        <View style={styles.containerInner}>
          {/* <ZStack fullscreen>
            <BlurView />
          </ZStack> */}
          <DishLogoButton />

          {divider}

          <LinkButton
            flexDirection="row"
            pointerEvents="auto"
            padding={15}
            opacity={om.state.home.currentStateType === 'home' ? 0.2 : 1}
            onPress={() => om.actions.home.popTo(om.state.home.lastHomeState)}
          >
            <VStack spacing={2} alignItems="center">
              <Icon name="home" size={26} opacity={0.5} />
            </VStack>
          </LinkButton>

          {divider}

          <VStack flex={0.5} />

          <HStack flex={20} maxWidth={450} alignItems="center">
            <Icon name="search" size={18} opacity={0.5} />
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
                style={[styles.textInput, { fontSize: 19, paddingRight: 42 }]}
              />
            </Hoverable>
            <SearchCancelButton onCancel={handleCancel} />
          </HStack>

          {divider}

          <VStack flex={10} maxWidth={320}>
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
          {divider}

          <VStack flex={1} />

          {/* <Divider vertical /> */}

          <HomeUserMenu />
        </View>
      </View>
    </>
  )
})

const SearchCancelButton = memo(({ onCancel }: { onCancel: Function }) => {
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
            opacity={om.state.home.currentStateSearchQuery === '' ? 0 : 1}
            disabled={om.state.home.currentStateSearchQuery === ''}
            onPress={() => {
              om.actions.home.setSearchQuery('')
              onCancel()
              // if (om.state.home.currentState.type === 'search') {
              //   om.actions.home.popTo(om.state.home.lastHomeState)
              // }
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
    position: 'absolute',
    marginTop: searchBarTopOffset,
    left: searchBarTopOffset,
    right: searchBarTopOffset,
    alignItems: 'center',
  },
  containerInner: {
    flex: 1,
    maxWidth: 1100,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,1)',
    height: '100%',
    flexDirection: 'row',
    borderRadius: drawerBorderRadius,
    shadowColor: 'rgba(0,0,0,0.135)',
    shadowRadius: 12,
    shadowOffset: { height: 4, width: 0 },
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    padding: 11,
    paddingHorizontal: 16,
    flex: 1,
    fontSize: 22,
  },
})
