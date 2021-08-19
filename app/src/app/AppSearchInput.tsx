import { fullyIdle, idle, series } from '@dish/async'
import { supportsTouchWeb } from '@dish/helpers'
import { Loader, Search, X } from '@dish/react-feather'
import { getStore, reaction } from '@dish/use-store'
import React, { memo, useCallback, useEffect, useRef } from 'react'
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { HStack, Spacer, VStack, getMedia, useDebounce, useMedia, useOnMount } from 'snackui'

import { isWeb, searchBarHeight } from '../constants/constants'
import { isTouchDevice } from '../constants/platforms'
import { isWebIOS } from '../helpers/isIOS'
import { filterToNavigable } from '../helpers/tagHelpers'
import { router } from '../router'
import { AppSearchInputTagsRow } from './AppSearchInputTagsRow'
import {
  AutocompleteStore,
  autocompleteSearchStore,
  autocompletesStore,
} from './AutocompletesStore'
import { drawerStore } from './drawerStore'
import { getSearchPageStore, runSearch } from './home/search/SearchPageStore'
import { homeStore, useHomeStoreSelector } from './homeStore'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'
import { InputFrame } from './InputFrame'
import { InputStore, setNodeOnInputStore, useInputStoreSearch } from './inputStore'
import { SearchInputNativeDragFix } from './SearchInputNativeDragFix'
import { useAutocompleteFocusWebNonTouch } from './useAutocompleteFocusWeb'

const isWebTouch = isWeb && supportsTouchWeb

const placeholders = [
  'pho',
  'tacos',
  'dim sum',
  'gyro',
  'bibimbap',
  'poke',
  'dosa',
  'onigiri',
  'banh mi',
  'bbq',
  'ceasar salad',
  'sushi',
  'sisig',
  'szechuan',
  'italian',
]

const placeHolder = `Search ${placeholders[Math.floor(placeholders.length * Math.random())]}`

// avoid first one on iniital focus
let avoidNextFocus = true
export function setAvoidNextAutocompleteShowOnFocus() {
  avoidNextFocus = true
}

export const onFocusAnyInput = () => {
  if (homeStore.searchbarFocusedTag) {
    homeStore.setSearchBarFocusedTag(null)
  }
}

let searchBar: HTMLInputElement | null = null
export function focusSearchInput() {
  if (isWebIOS) return
  if (avoidNextFocus) {
    avoidNextFocus = false
    return
  }
  searchBar?.focus()
}

export function blurSearchInput() {
  if (typeof document === 'undefined' || document.activeElement === searchBar) {
    searchBar?.blur()
  }
}

export const getSearchInput = () => {
  return searchBar
}

export const AppSearchInput = memo(() => {
  const inputStore = useInputStoreSearch()
  const isSearchingCuisine = useHomeStoreSelector((x) => !!x.searchBarTags.length)
  const { color } = useSearchBarTheme()
  const media = useMedia()
  const isEditingList = false // useRouterSelector((x) => x.curPage.name === 'list' && x.curPage.params.state === 'edit')
  const textInput$ = useRef<TextInput | null>(null)
  const setSearch = useDebounce(autocompleteSearchStore.setQuery, 100)

  const height = searchBarHeight - 6
  const outerHeight = height - 1
  const innerHeight = height - 1

  useOnMount(() => {
    searchBar = inputStore.node
    textInput$.current?.setNativeProps({
      value: homeStore.currentSearchQuery,
    })
    return series([
      () => fullyIdle({ checks: 3, max: 100 }),
      () => {
        if (!getMedia().sm) {
          focusSearchInput()
        }
      },
    ])
  })

  // one way sync down for more perf
  useEffect(() => {
    return reaction(
      homeStore,
      (x) => x.currentSearchQuery,
      function searchQuerySync(value) {
        setSearch(value)
        textInput$.current?.setNativeProps({
          value,
        })
      }
    )
  }, [])

  const input = inputStore.node
  const searchInputContainer = useRef<View>()

  // focus for web
  const isDesktop = isWeb && !isWebTouch
  if (isDesktop) {
    useAutocompleteFocusWebNonTouch(inputStore)
  }

  const handleKeyPressInner = useCallback((e) => {
    handleKeyPress(e, inputStore)
  }, [])

  const setInputNode = useCallback((view) => setNodeOnInputStore(inputStore)(view), [])

  return (
    <InputFrame>
      {/* Loading / Search Icon */}
      <SearchInputIcon color={color} />

      <Spacer size="xs" />

      <VStack
        // @ts-ignore
        ref={searchInputContainer}
        minWidth="50%"
        flex={2}
        height={outerHeight}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
            minWidth: '100%',
          }}
          style={{
            minWidth: '100%',
            paddingRight: 10,
            flex: 1,
          }}
        >
          <HStack alignSelf="center" alignItems="center" minWidth="100%" height={innerHeight}>
            <AppSearchInputTagsRow input={input} />
            <HStack
              height={innerHeight}
              maxWidth="100%"
              position="relative"
              flex={1}
              alignItems="center"
            >
              {isTouchDevice && <SearchInputNativeDragFix name="search" />}
              <TextInput
                key={0}
                ref={(view) => {
                  textInput$.current = view
                  setInputNode(view)
                }}
                onBlur={(e) => {
                  inputStore.setIsFocused(true)
                  avoidNextFocus = false
                  // dont because it hides during autocomplete click
                  // and event is before mousedown even
                  // if (isWeb && !getMedia().sm) {
                  //   if (autocompletesStore.target === 'search') {
                  //     autocompletesStore.setVisible(false)
                  //   }
                  // }
                }}
                onKeyPress={handleKeyPressInner}
                {...(!isWeb && {
                  placeholderTextColor: '#999',
                })}
                onFocus={(e) => {
                  inputStore.setIsFocused(true)
                  if (isDesktop) {
                    console.log('ignore focus')
                    // see above, we handle better for text selection
                    return
                  }
                  if (drawerStore.isDragging) {
                    return
                  }
                  if (homeStore.searchbarFocusedTag) {
                    homeStore.setSearchBarTagIndex(0)
                  } else {
                    console.log('open autocomplete search', e.currentTarget)
                    autocompletesStore.setTarget('search')
                  }
                }}
                onChangeText={(text) => {
                  if (text !== '') {
                    if (autocompletesStore.target !== 'search') {
                      autocompletesStore.setTarget('search')
                    }
                  }
                  setSearch(text)
                }}
                placeholder={
                  isEditingList
                    ? 'Add restaurant to list...'
                    : isSearchingCuisine
                    ? '...'
                    : `${placeHolder}...`
                }
                style={[
                  inputTextStyles.textInput,
                  {
                    color,
                    flex: 1,
                    fontSize: media.sm ? 18 : 18,
                    fontWeight: '500',
                    height,
                    lineHeight: height * 0.45,
                    paddingHorizontal: 15,
                  },
                ]}
              />
            </HStack>
          </HStack>
        </ScrollView>
      </VStack>

      <SearchCancelButton />

      <Spacer size={8} />
    </InputFrame>
  )
})

// TODO not happy with logical structure here
const SearchInputIcon = memo(({ color }: { color: string }) => {
  const media = useMedia()
  const isHomeLoading = useHomeStoreSelector((x) => x.loading)
  // const search = useSearchPageStore()
  // const isOnSearch = useIsRouteActive('search')
  const loading = isHomeLoading
  return (
    <VStack width={16} marginLeft={0} scale={loading ? 1.2 : 1}>
      <TouchableOpacity onPress={focusSearchInput}>
        {loading ? (
          // DO NOT ROTATE THIS ON MOBILE WEB IT SLOWS THINGS DOWN *INCREDIBLY*
          <VStack className={supportsTouchWeb ? '' : 'rotating'} opacity={1}>
            <Loader color={color} size={16} />
          </VStack>
        ) : (
          <Search
            color={color}
            size={media.xs ? 18 : 20}
            style={{
              opacity: 0.7,
            }}
          />
        )}
      </TouchableOpacity>
    </VStack>
  )
})

const SearchCancelButton = memo(function SearchCancelButton() {
  const isActive = useHomeStoreSelector((x) => {
    const hasSearch = x.currentSearchQuery !== ''
    const hasSearchTags = !!x.searchBarTags.length
    return hasSearch || hasSearchTags
  })
  const media = useMedia()
  return (
    <VStack
      opacity={isActive ? 0.6 : 0}
      disabled={!isActive}
      width={34}
      height={34}
      borderRadius={100}
      alignItems="center"
      justifyContent="center"
      backgroundColor="rgba(220,220,220,0.1)"
      onPress={() => {
        if (autocompletesStore.visible) {
          autocompletesStore.setVisible(false)
        } else {
          homeStore.clearSearch()
        }
      }}
    >
      <X size={16} color={media.sm ? '#888' : '#fff'} style={{ marginTop: 1 }} />
    </VStack>
  )
})

const prev = () => {
  homeStore.moveSearchBarTagIndex(-1)
}
const next = () => {
  homeStore.moveSearchBarTagIndex(1)
}

const handleKeyPress = async (e: any, inputStore: InputStore) => {
  console.log('key press', e)

  // @ts-ignore
  const code = e.keyCode
  const isAutocompleteActive = autocompletesStore.visible
  const autocomplete = getStore(AutocompleteStore, {
    target: autocompletesStore.target,
  })
  const { index, results } = autocomplete

  autocompletesStore.setTarget(inputStore.props.name)
  autocompletesStore.setVisible(true)

  let focusedInput: HTMLInputElement | null = null
  let isSelecting = false
  let isCaretAtEnd = false
  let isCaretAtStart = false

  if (isWeb) {
    if (document.activeElement instanceof HTMLInputElement) {
      focusedInput = document.activeElement
    }
    isSelecting = focusedInput?.selectionStart !== focusedInput?.selectionEnd
    isCaretAtEnd = !isSelecting && focusedInput?.selectionEnd === focusedInput?.value.length
    isCaretAtStart = focusedInput?.selectionEnd == 0
  }

  switch (code) {
    case 13: {
      // enter
      // autocomplete
      const item = results[index]
      const isSelectingFromList = isAutocompleteActive && item && index !== 0

      if (isSelectingFromList) {
        if (item.type === 'restaurant') {
          router.navigate({
            name: 'restaurant',
            params: { slug: item.slug },
          })
        } else if ('slug' in item) {
          homeStore.clearSearch()
          homeStore.navigate({
            tags: [item],
          })
        }
      }
      // if searching with text
      else {
        // TODO move this to top-down approach
        // inputStore.setValue(e.target.value)
        // and have SearchPage useEffect() listen to inputStore.value
        runSearch({
          searchQuery: e.target.value,
          force: true,
        })
        await idle(40)
      }
      autocompletesStore.setVisible(false)
      focusedInput?.blur()
      return
    }
    case 8: {
      // delete
      if (homeStore.searchbarFocusedTag) {
        // will remove it if active
        homeStore.navigate({
          tags: filterToNavigable([homeStore.searchbarFocusedTag]),
        })
        next()
        focusSearchInput()
        return
      }
      if (isCaretAtStart) {
        prev()
      }
      return
    }
    case 39: {
      // right
      if (isCaretAtEnd) {
        next()
      }
      return
    }
    case 37: {
      // left
      if (isCaretAtStart) {
        // at start, go into selecting searchbar tags if we have em
        prev()
        return
      }
      return
    }
    case 27: {
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
}

export const inputTextStyles = StyleSheet.create({
  textInput: {
    color: '#fff',
    height: searchBarHeight - 6,
    paddingHorizontal: 12,
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    overflow: 'hidden',
    ...(isWeb && {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }),
  },
})
