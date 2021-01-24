import { fullyIdle, idle, series } from '@dish/async'
import { Loader, Search, X } from '@dish/react-feather'
import { useRouterSelector } from '@dish/router'
import { getStore, reaction } from '@dish/use-store'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import {
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  Spacer,
  VStack,
  getMedia,
  useGet,
  useMedia,
  useOnMount,
  useTheme,
} from 'snackui'

import { isWeb, searchBarHeight } from '../constants/constants'
import { getTagSlug } from '../helpers/getTagSlug'
import { isWebIOS } from '../helpers/isIOS'
import { tagsToNavigableTags } from '../helpers/tagHelpers'
import { router } from '../router'
import { AutocompleteStore, autocompletesStore } from './AppAutocomplete'
import { AppAutocompleteHoverableInput } from './AppAutocompleteHoverableInput'
import { searchPageStore } from './home/search/SearchPageStore'
import { homeStore, useHomeStore } from './homeStore'
import { useAutocompleteInputFocus } from './hooks/useAutocompleteInputFocus'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'
import {
  InputStore,
  setNodeOnInputStore,
  useInputStoreSearch,
} from './inputStore'
import { SearchInputNativeDragFix } from './SearchInputNativeDragFix'
import { TagButton, getTagButtonProps } from './views/TagButton'

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
  'barbeque',
  'ceasar salad',
  'sushi',
  'sisig',
  'szechuan chicken',
  'italian',
]

const placeHolder = `Search ${
  placeholders[Math.floor(placeholders.length * Math.random())]
}`

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
  searchBar?.blur()
}

export const getSearchInput = () => {
  return searchBar
}

let isFocused = false
export const isSearchInputFocused = () => {
  return isFocused
}

export const AppSearchInput = memo(() => {
  const inputStore = useInputStoreSearch()
  const home = useHomeStore()
  const { loading } = home
  const { color, backgroundRgb } = useSearchBarTheme()
  const media = useMedia()
  const [search, setSearch] = useState('')
  const getSearch = useGet(search)
  const isSearchingCuisine = !!home.searchBarTags.length
  const isEditingList = false // useRouterSelector((x) => x.curPage.name === 'list' && x.curPage.params.state === 'edit')

  // focus on visible
  useAutocompleteInputFocus(inputStore)

  const height = searchBarHeight - 2
  const outerHeight = height - 1
  const innerHeight = height - 1

  useOnMount(() => {
    searchBar = inputStore.node

    setSearch(home.currentSearchQuery)

    return series([
      () => fullyIdle({ max: 1000 }),
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
      (val) => {
        if (val !== getSearch()) {
          setSearch(val)
        }
      }
    )
  }, [])

  // shortcuts
  if (Platform.OS === 'web') {
    useEffect(() => {
      const handleClick = () => {
        autocompletesStore.setTarget('search')
      }
      const node = inputStore.node
      node?.addEventListener('click', handleClick)
      return () => {
        node?.removeEventListener('click', handleClick)
      }
    }, [])
  }

  const input = inputStore.node
  const searchInputContainer = useRef<View>()

  const handleKeyPressInner = useCallback((e) => {
    handleKeyPress(e, inputStore)
  }, [])

  return (
    <AppAutocompleteHoverableInput input={input} autocompleteTarget="search">
      <InputFrame>
        <AbsoluteVStack
          fullscreen
          borderRadius={1000}
          borderWidth={1}
          borderColor="rgba(255,255,255,0.2)"
        />

        {/* Loading / Search Icon */}
        <VStack
          width={16}
          marginLeft={3}
          transform={[{ scale: loading ? 1.2 : 1 }]}
        >
          <TouchableOpacity onPress={focusSearchInput}>
            {loading ? (
              <VStack className="rotating" opacity={1}>
                <Loader color={color} size={16} />
              </VStack>
            ) : (
              <Search
                color={color}
                size={media.xs ? 16 : 20}
                style={{
                  opacity: 0.8,
                }}
              />
            )}
          </TouchableOpacity>
        </VStack>

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
            <HStack
              alignSelf="center"
              alignItems="center"
              minWidth="100%"
              height={innerHeight}
            >
              <AppSearchInputTags input={input} />
              <HStack
                height={innerHeight}
                maxWidth="100%"
                position="relative"
                flex={1}
                alignItems="center"
              >
                {!isWeb && <SearchInputNativeDragFix name="search" />}
                <TextInput
                  ref={(view) => setNodeOnInputStore(inputStore, view)}
                  // leave uncontrolled for perf?
                  value={search ?? ''}
                  onBlur={(e) => {
                    avoidNextFocus = false
                  }}
                  onKeyPress={handleKeyPressInner}
                  onFocus={() => {
                    if (home.searchbarFocusedTag) {
                      home.setSearchBarTagIndex(0)
                    } else {
                      autocompletesStore.setTarget('search')
                    }
                  }}
                  onChangeText={(text) => {
                    if (getSearch() == '' && text !== '') {
                      autocompletesStore.setTarget('search')
                    }
                    setSearch(text)
                    home.setSearchQuery(text)
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
                      fontSize: media.sm ? 18 : 20,
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
    </AppAutocompleteHoverableInput>
  )
})

function InputFrame({ children }: { children: any }) {
  const theme = useTheme()
  const media = useMedia()
  return (
    <HStack
      alignItems="center"
      borderRadius={180}
      backgroundColor={theme.backgroundColorSecondary}
      borderWidth={2}
      borderColor={theme.borderColor}
      shadowColor="#333"
      shadowRadius={15}
      shadowOpacity={0.2}
      flex={1}
      maxWidth="100%"
      paddingLeft={10}
      overflow="hidden"
      position="relative"
      hoverStyle={{
        borderColor: theme.backgroundColorTertiary,
        backgroundColor: theme.backgroundColorTertiary,
      }}
      focusStyle={{
        borderColor: theme.backgroundColorQuartenary,
        backgroundColor: theme.backgroundColorQuartenary,
      }}
      {...(media.sm && {
        backgroundColor: theme.backgroundColorSecondary,
        borderRadius: 12,
        borderWidth: 0,
        shadowRadius: 0,
        shadowColor: 'transparent',
        hoverStyle: {
          backgroundColor: theme.backgroundColorTertiary,
        },
        focusStyle: {
          backgroundColor: theme.backgroundColorSecondary,
        },
      })}
    >
      {children}
    </HStack>
  )
}

const SearchCancelButton = memo(() => {
  const home = useHomeStore()
  const hasSearch = home.currentSearchQuery !== ''
  const hasSearchTags = !!home.searchBarTags.length
  const isActive = hasSearch || hasSearchTags
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
          home.clearSearch()
        }
      }}
    >
      <X
        size={16}
        color={media.sm ? '#888' : '#fff'}
        style={{ marginTop: 1 }}
      />
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
  // @ts-ignore
  const code = e.keyCode
  console.log('key', code)
  const isAutocompleteActive = autocompletesStore.visible
  const autocomplete = getStore(AutocompleteStore, {
    target: autocompletesStore.target,
  })
  const { index, results } = autocomplete

  let focusedInput: HTMLInputElement | null = null
  let isSelecting = false
  let isCaretAtEnd = false
  let isCaretAtStart = false

  if (isWeb) {
    if (document.activeElement instanceof HTMLInputElement) {
      focusedInput = document.activeElement
    }
    isSelecting = focusedInput?.selectionStart !== focusedInput?.selectionEnd
    isCaretAtEnd =
      !isSelecting && focusedInput?.selectionEnd === focusedInput?.value.length
    isCaretAtStart = focusedInput?.selectionEnd == 0
  }

  switch (code) {
    case 13: {
      // enter
      // just searching normal
      const item = results[index - 1]
      if (isAutocompleteActive && item && index !== 0) {
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
      } else {
        // TODO move this to top-down approach
        // inputStore.setValue(e.target.value)
        // and have SearchPage useEffect() listen to inputStore.value
        searchPageStore.runSearch({
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
          tags: tagsToNavigableTags([homeStore.searchbarFocusedTag]),
        })
        next()
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
    ...(Platform.OS === 'web' && {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }),
  },
})

const AppSearchInputTags = memo(
  ({ input }: { input: HTMLInputElement | null }) => {
    const home = useHomeStore()
    const tags = home.searchBarTags
    const focusedTag = home.searchbarFocusedTag

    return (
      <>
        {!!tags.length && (
          <HStack marginLeft={10} marginTop={-1} spacing={4}>
            {tags.map((tag) => {
              const isActive = focusedTag === tag
              return (
                <TagButton
                  key={getTagSlug(tag)}
                  size="lg"
                  subtleIcon
                  backgroundColor="rgba(150,150,150,0.65)"
                  color={'#fff'}
                  shadowColor="#00000022"
                  fontWeight="600"
                  shadowRadius={10}
                  shadowOffset={{ height: 2, width: 0 }}
                  borderColor={'transparent'}
                  borderRadius={100}
                  hoverStyle={{
                    backgroundColor: 'rgba(150,150,150,0.7)',
                  }}
                  {...(isActive && {
                    backgroundColor: 'rgba(150,150,150,0.1)',
                    color: '#fff',
                    hoverStyle: {
                      backgroundColor: 'rgba(150,150,150,0.1)',
                    },
                  })}
                  {...(!isWeb && {
                    transform: [{ translateY: 2 }],
                  })}
                  {...getTagButtonProps(tag)}
                  onPressOut={() => {
                    home.setSearchBarFocusedTag(tag)
                  }}
                  closable
                  onClose={async () => {
                    console.log('navigate to close', tag)
                    home.navigate({ tags: [tag] })
                    await fullyIdle()
                    setAvoidNextAutocompleteShowOnFocus()
                    focusSearchInput()
                  }}
                />
              )
            })}
          </HStack>
        )}
      </>
    )
  }
)
