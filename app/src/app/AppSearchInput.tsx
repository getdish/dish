import { isWeb, searchBarHeight } from '../constants/constants'
import { isTouchDevice } from '../constants/platforms'
import { filterToNavigable } from '../helpers/tagHelpers'
import { router } from '../router'
import { AppSearchInputTagsRow } from './AppSearchInputTagsRow'
import {
  AutocompleteStore,
  autocompleteSearchStore,
  autocompletesStore,
} from './AutocompletesStore'
import { InputFrame } from './InputFrame'
import { SearchInputNativeDragFix } from './SearchInputNativeDragFix'
import { drawerStore } from './drawerStore'
import { runSearch } from './home/search/SearchPageStore'
import { homeStore, useHomeStoreSelector } from './homeStore'
import { InputStore, setNodeOnInputStore, useInputStoreSearch } from './inputStore'
import {
  focusSearchInput,
  setAvoidNextAutocompleteShowOnFocus,
  setSearchBar,
} from './searchInputActions'
import { useAutocompleteFocusWebNonTouch } from './useAutocompleteFocusWeb'
import { fullyIdle, idle, series } from '@dish/async'
import { supportsTouchWeb } from '@dish/helpers'
import {
  SearchInput,
  Spacer,
  XStack,
  YStack,
  getMedia,
  useDebounce,
  useMedia,
  useOnMount,
  useTheme,
} from '@dish/ui'
import { getStore, selector } from '@dish/use-store'
import { Loader, Search, X } from '@tamagui/feather-icons'
import React, { memo, useCallback, useEffect, useRef } from 'react'
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native'

const isWebTouch = isWeb && supportsTouchWeb

export const AppSearchInput = memo(() => {
  const inputStore = useInputStoreSearch()
  const isSearchingCuisine = useHomeStoreSelector((x) => !!x.searchBarTags.length)
  const theme = useTheme()
  const isEditingList = false // useRouterSelector((x) => x.curPage.name === 'list' && x.curPage.params.state === 'edit')
  const textInput$ = useRef<TextInput | null>(null)
  const setSearch = useDebounce(autocompleteSearchStore.setQuery, 100)

  const height = searchBarHeight - 6
  const outerHeight = height - 1
  const innerHeight = height - 1

  const setSearchInputValue = (value: string) => {
    const input = textInput$.current
    if (!input) return
    if (input.setNativeProps) {
      input.setNativeProps({
        value: homeStore.currentSearchQuery,
      })
    } else if (input) {
      input['value'] = value
    }
  }

  useOnMount(() => {
    setSearchBar(inputStore.node)
    setSearchInputValue(homeStore.currentSearchQuery)
    return series([
      () => fullyIdle({ checks: 3, max: 100 }),
      () => {
        if (!getMedia().$sm) {
          focusSearchInput()
        }
      },
    ])
  })

  // one way sync down for more perf
  useEffect(() => {
    return selector(function searchQuerySync() {
      const value = homeStore.currentSearchQuery
      setSearch(value)
      setSearchInputValue(value)
    })
  }, [])

  // const input = inputStore.node
  const searchInputContainer = useRef<View>()

  // focus for web
  const isDesktop = isWeb && !isWebTouch
  if (isDesktop) {
    useAutocompleteFocusWebNonTouch(inputStore)
  }

  const handleKeyPressInner = useCallback((e) => {
    handleKeyPress(e, inputStore)
  }, [])

  const setInputNode = useCallback((view) => setNodeOnInputStore(inputStore, view), [])

  if (!theme.color) {
    console.log('wut the', theme)
    return null
  }

  return (
    <InputFrame>
      {/* Loading / Search Icon */}
      <SearchInputIcon color={theme.color.toString()} />

      <Spacer size="$2" />

      <YStack
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
          <XStack alignSelf="center" alignItems="center" minWidth="100%" height={innerHeight}>
            <AppSearchInputTagsRow />
            <XStack
              height={innerHeight}
              maxWidth="100%"
              position="relative"
              flex={1}
              alignItems="center"
            >
              {isTouchDevice && <SearchInputNativeDragFix name="search" />}
              <SearchInput
                ref={(view) => {
                  textInput$.current = view
                  setInputNode(view)
                }}
                onBlur={(e) => {
                  inputStore.setIsFocused(true)
                  setAvoidNextAutocompleteShowOnFocus(false)
                  // dont because it hides during autocomplete click
                  // and event is before mousedown even
                  // if (isWeb && !getMedia().sm) {
                  //   if (autocompletesStore.target === 'search') {
                  //     autocompletesStore.setVisible(false)
                  //   }
                  // }
                }}
                onKeyPress={handleKeyPressInner}
                placeholderTextColor={theme.color.toString()}
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
                    : `Search...`
                }
              />
            </XStack>
          </XStack>
        </ScrollView>
      </YStack>

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
    <YStack width={10} marginLeft={0} scale={loading ? 1.2 : 1}>
      <TouchableOpacity onPress={focusSearchInput}>
        {loading ? (
          // DO NOT ROTATE THIS ON MOBILE WEB IT SLOWS THINGS DOWN *INCREDIBLY*
          <YStack className={supportsTouchWeb ? '' : 'rotating'} opacity={1}>
            <Loader color={color} size={16} />
          </YStack>
        ) : (
          <Search
            color={color}
            size={media.xs ? 14 : 16}
            style={{
              opacity: 0.7,
            }}
          />
        )}
      </TouchableOpacity>
    </YStack>
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
    <YStack
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
    </YStack>
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
            state: {
              ...homeStore.currentState,
              searchQuery: '',
            },
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
