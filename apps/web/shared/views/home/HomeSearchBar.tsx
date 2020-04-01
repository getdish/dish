import React, { memo, useEffect, useReducer, useRef, useState } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import { useOvermind } from '../../state/om'
import Hoverable from '../shared/Hoverable'
import { Icon } from '../shared/Icon'
import { Spacer } from '../shared/Spacer'
import { HStack, VStack, ZStack } from '../shared/Stacks'
import { CloseButton } from './CloseButton'
import { DishLogoButton } from './DishLogoButton'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

export const searchBarTopOffset = 25
export const searchBarHeight = 53
export let homeSearchBarEl = {
  current: null as HTMLInputElement | null,
}

export default memo(function HomeSearchBar() {
  const om = useOvermind()
  const inputRef = useRef()
  const globalSearch = om.state.home.currentState.searchQuery
  const width = useHomeDrawerWidth()

  // use local for a little better perf
  const [search, setSearch] = useState('')

  useEffect(() => {
    setSearch(globalSearch)
  }, [globalSearch])

  // ONE way sync this state so we can control it programatically (but blurring gets annoying)
  const { showAutocomplete } = om.state.home
  // @ts-ignore
  const node: HTMLInputElement | null = inputRef.current?.['_node'] ?? null
  useEffect(() => {
    homeSearchBarEl.current = node
    const isFocused = document.activeElement === node
    if (isFocused) return // ONE way sync
    if (showAutocomplete !== isFocused) {
      if (showAutocomplete) node.focus()
      else node.blur()
    }
  }, [node, showAutocomplete])

  const tm = useRef(0)
  const tm2 = useRef(0)

  return (
    <View
      style={[styles.container, { width: width + 30, height: searchBarHeight }]}
    >
      <HStack>
        <DishLogoButton />
        <VStack flex={1.7} style={styles.searchArea}>
          <Hoverable
            // show even if moving after some time
            onHoverIn={() => {
              tm2.current = setTimeout(() => {
                if (document.activeElement == node) {
                  om.actions.home.setShowAutocomplete(true)
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
                  if (document.activeElement == node) {
                    om.actions.home.setShowAutocomplete(true)
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
                om.actions.home.setShowAutocomplete(true)
              }}
              onBlur={() => {
                om.actions.home.setShowAutocomplete(false)
              }}
              onChangeText={(text) => {
                setSearch(text)
                om.actions.home.setSearchQuery(text)
              }}
              placeholder="Search dish, cuisine"
              style={[styles.textInput, { fontSize: 20, paddingRight: 42 }]}
            />
          </Hoverable>
          <SearchCancelButton />
        </VStack>
        <VStack flex={1} style={styles.searchArea}>
          <TextInput
            // value=""
            onChangeText={() => {}}
            placeholder="in San Francisco"
            style={[styles.textInput, { paddingRight: 32, fontSize: 16 }]}
          />
          <SearchLocationButton />
        </VStack>
      </HStack>

      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `input { outline: 0 }`,
        }}
      />
    </View>
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
            onPress={() => om.actions.home.popTo(om.state.home.lastHomeState)}
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
    borderRadius: 14,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowRadius: 8,
    shadowOffset: { height: 2, width: 0 },
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'absolute',
    marginTop: searchBarTopOffset,
    left: 5,
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
