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
import { SquareDebug } from './views/SquareDebug'
import { fullyIdle, idle, series } from '@dish/async'
import { supportsTouchWeb } from '@dish/helpers'
import {
  Button,
  SearchInput,
  Spacer,
  Square,
  XStack,
  YStack,
  getMedia,
  useDebounce,
  useOnMount,
  useTheme,
} from '@dish/ui'
import { getStore, selector, useReaction } from '@dish/use-store'
import { Loader, Search, X } from '@tamagui/feather-icons'
import React, { memo, useCallback, useEffect, useRef } from 'react'
import { ScrollView, TextInput, View } from 'react-native'

const isWebTouch = isWeb && supportsTouchWeb

export const AppSearchInput = memo(({ floating }: { floating?: boolean }) => {
  const inputStore = useInputStoreSearch()
  const isSearchingCuisine = useHomeStoreSelector((x) => !!x.searchBarTags.length)
  const theme = useTheme()
  const isEditingList = false // useRouterSelector((x) => x.curPage.name === 'list' && x.curPage.params.state === 'edit')
  const textInput$ = useRef<TextInput | null>(null)
  const setSearch = useDebounce(autocompleteSearchStore.setQuery, 100)

  const height = searchBarHeight
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

  // focus for web
  const isDesktop = isWeb && !isWebTouch
  if (isDesktop) {
    useAutocompleteFocusWebNonTouch(inputStore)
  }

  const handleKeyPressInner = useCallback((e) => {
    handleKeyPress(e, inputStore)
  }, [])

  const setInputNode = useCallback((view) => setNodeOnInputStore(inputStore, view), [])

  // useReaction(
  //   autocompletesStore,
  //   (x) => x.visible,
  //   (visible) => {
  //     if (!visible) {
  //       inputStore.node?.blur()
  //     }
  //   }
  // )

  // {/* <ScrollView
  //   horizontal
  //   showsHorizontalScrollIndicator={false}
  //   contentContainerStyle={{
  //     alignItems: 'center',
  //     minHeight: 100000,
  //     minWidth: '100%',
  //     height: innerHeight,
  //   }}
  //   style={{
  //     minWidth: '100%',
  //     height: innerHeight,
  //     flex: 1,
  //   }}
  // > */}

  return (
    <XStack ai="center" pe="auto" f={1} height={innerHeight}>
      <AppSearchInputTagsRow />
      <XStack height={innerHeight} position="relative" flex={1} alignItems="center">
        <SearchInput
          placeholderTextColor="#777"
          flex={1}
          height={searchBarHeight}
          floating={floating}
          ref={(view) => {
            textInput$.current = view
            setInputNode(view)
          }}
          onBlur={(e) => {
            // inputStore.setIsFocused(true)
            // setAvoidNextAutocompleteShowOnFocus(false)
            // dont because it hides during autocomplete click
            // and event is before mousedown even
            // if (isWeb && !getMedia().sm) {
            //   if (autocompletesStore.target === 'search') {
            //     autocompletesStore.setVisible(false)
            //   }
            // }
          }}
          onKeyPress={handleKeyPressInner}
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
            isEditingList ? 'Add restaurant to list...' : isSearchingCuisine ? '...' : `Kailua`
          }
        />
      </XStack>

      {/* </ScrollView> */}
      <SearchLoadingIcon color={theme.color.toString()} />

      <SearchCancelButton />
    </XStack>
  )
})

// TODO not happy with logical structure here
const SearchLoadingIcon = memo(({ color }: { color: string }) => {
  const isHomeLoading = useHomeStoreSelector((x) => x.loading)
  // const search = useSearchPageStore()
  // const isOnSearch = useIsRouteActive('search')
  const loading = isHomeLoading
  return (
    <YStack onPress={focusSearchInput} width={10} marginLeft={0} scale={loading ? 1.2 : 1}>
      {loading ? (
        // DO NOT ROTATE THIS ON MOBILE WEB IT SLOWS THINGS DOWN *INCREDIBLY*
        <YStack className={supportsTouchWeb ? '' : 'rotating'} opacity={1}>
          <Loader color={color} size={16} />
        </YStack>
      ) : (
        <Spacer size={16} />
        // <Search
        //   color={color}
        //   size={media.xs ? 14 : 16}
        //   style={{
        //     opacity: 0.7,
        //   }}
        // />
      )}
    </YStack>
  )
})

const SearchCancelButton = memo(function SearchCancelButton() {
  const isActive = useHomeStoreSelector((x) => {
    const hasSearch = x.currentSearchQuery !== ''
    const hasSearchTags = !!x.searchBarTags.length
    return hasSearch || hasSearchTags
  })
  return (
    <Button
      size="$4"
      circular
      icon={X}
      disabled={!isActive}
      opacity={isActive ? 1 : 0}
      onPress={() => {
        if (autocompletesStore.visible) {
          autocompletesStore.setVisible(false)
        } else {
          homeStore.clearSearch()
        }
      }}
    />
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
