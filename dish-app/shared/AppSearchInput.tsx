import { fullyIdle, idle, series } from '@dish/async'
import { Loader, Search, X } from '@dish/react-feather'
import { useStore } from '@dish/use-store'
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
  Toast,
  VStack,
  getMedia,
  useGet,
  useMedia,
  useOnMount,
} from 'snackui'

import { AppAutocompleteHoverableInput } from './AppAutocompleteHoverableInput'
import { isWeb, searchBarHeight } from './constants'
import { DishHorizonView } from './DishHorizonView'
import { isWebIOS } from './helpers/isIOS'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'
import { InputStore } from './InputStore'
import { SearchInputNativeDragFix } from './SearchInputNativeDragFix'
import { getTagSlug } from './state/getTagSlug'
import { tagsToNavigableTags } from './state/NavigableTag'
import { omStatic } from './state/omStatic'
import { router } from './state/router'
import { useOvermind } from './state/useOvermind'
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
  if (omStatic.state.home.searchbarFocusedTag) {
    omStatic.actions.home.setSearchBarFocusedTag(null)
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
  const inputStore = useStore(InputStore, { name: 'search' })
  const om = useOvermind()
  const { color, backgroundRgb } = useSearchBarTheme()
  const media = useMedia()
  const [search, setSearch] = useState('')
  const getSearch = useGet(search)
  const isSearchingCuisine = !!om.state.home.searchBarTags.length
  // const { showAutocomplete } = om.state.home

  const height = searchBarHeight - 2
  const outerHeight = height - 5
  const innerHeight = height - 5

  useOnMount(() => {
    searchBar = inputStore.node

    setSearch(om.state.home.currentStateSearchQuery)

    return series([
      () => fullyIdle({ max: 1000 }),
      () => {
        if (!getMedia().sm) {
          focusSearchInput()
        }
      },
    ])
  })

  const showAutocomplete = om.state.home.showAutocomplete === 'search'
  useEffect(() => {
    if (showAutocomplete) {
      const tm = setTimeout(() => {
        inputStore.node?.focus()
      }, 100)
      return () => {
        clearTimeout(tm)
      }
    }
    return undefined
  }, [showAutocomplete])

  // one way sync down for more perf
  useEffect(() => {
    return om.reaction(
      (state) => state.home.currentStateSearchQuery,
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
        om.actions.home.setShowAutocomplete('search')
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
      <HStack
        alignItems="center"
        borderRadius={180}
        borderWidth={2}
        borderColor="rgba(0,0,0,0.3)"
        shadowColor="#000"
        shadowRadius={15}
        shadowOpacity={0.2}
        flex={1}
        maxWidth="100%"
        paddingLeft={10}
        overflow="hidden"
        position="relative"
        hoverStyle={{
          borderColor: 'rgba(255,255,255,0.08)',
          backgroundColor: 'rgba(255,255,255,0.05)',
        }}
        focusStyle={{
          borderColor: 'rgba(255,255,255,0.1)',
          backgroundColor: 'rgba(255,255,255,0.02)',
          shadowColor: '#000',
          shadowRadius: 15,
          shadowOpacity: 0.1,
        }}
      >
        <AbsoluteVStack
          fullscreen
          borderRadius={1000}
          borderWidth={1}
          borderColor="rgba(255,255,255,0.2)"
        />
        <AbsoluteVStack
          top={-90}
          bottom={-90}
          right={-90}
          left={90}
          transform={[{ translateY: 40 }, { scale: 0.75 }]}
          // opacity={0.8}
        >
          <DishHorizonView />
        </AbsoluteVStack>
        {/* Loading / Search Icon */}
        <VStack
          width={16}
          marginLeft={3}
          transform={[{ scale: om.state.home.isLoading ? 1.2 : 1 }]}
        >
          <TouchableOpacity onPress={focusSearchInput}>
            {om.state.home.isLoading ? (
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
                  ref={inputStore.setNode}
                  // leave uncontrolled for perf?
                  value={search ?? ''}
                  onBlur={(e) => {
                    avoidNextFocus = false
                  }}
                  onKeyPress={handleKeyPressInner}
                  onFocus={() => {
                    if (omStatic.state.home.searchbarFocusedTag) {
                      omStatic.actions.home.setSearchBarTagIndex(0)
                    } else {
                      omStatic.actions.home.setShowAutocomplete('search')
                    }
                  }}
                  onChangeText={(text) => {
                    if (getSearch() == '' && text !== '') {
                      om.actions.home.setShowAutocomplete('search')
                    }
                    setSearch(text)
                    om.actions.home.setSearchQuery(text)
                  }}
                  placeholder={isSearchingCuisine ? '...' : `${placeHolder}...`}
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
      </HStack>
    </AppAutocompleteHoverableInput>
  )
})

const SearchCancelButton = memo(() => {
  const om = useOvermind()
  const hasSearch = om.state.home.currentStateSearchQuery !== ''
  const hasSearchTags = !!om.state.home.searchBarTags.length
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
        if (om.state.home.showAutocomplete) {
          om.actions.home.setShowAutocomplete(false)
        } else {
          om.actions.home.clearSearch()
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
  omStatic.actions.home.moveSearchBarTagIndex(-1)
}
const next = () => {
  omStatic.actions.home.moveSearchBarTagIndex(1)
}

const handleKeyPress = async (e: any, inputStore: InputStore) => {
  // @ts-ignore
  const code = e.keyCode
  console.log('key', code)
  const { isAutocompleteActive, autocompleteIndex } = omStatic.state.home

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
      const item =
        omStatic.state.home.autocompleteResults[autocompleteIndex - 1]
      if (isAutocompleteActive && item && autocompleteIndex !== 0) {
        if (item.type === 'restaurant') {
          if (!item.slug) {
            Toast.show(`No slug, err`)
            return
          }
          router.navigate({
            name: 'restaurant',
            params: { slug: item.slug },
          })
        } else if ('tagId' in item) {
          omStatic.actions.home.clearSearch()
          omStatic.actions.home.navigate({
            tags: [item],
          })
        }
      } else {
        //@ts-expect-error overmind type error
        omStatic.actions.home.runSearch({
          searchQuery: e.target.value,
          force: true,
        })
        await idle(40)
      }
      omStatic.actions.home.setShowAutocomplete(false)
      focusedInput?.blur()
      return
    }
    case 8: {
      // delete
      if (omStatic.state.home.searchbarFocusedTag) {
        // will remove it if active
        omStatic.actions.home.navigate({
          tags: tagsToNavigableTags([omStatic.state.home.searchbarFocusedTag]),
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
      omStatic.actions.home.moveActive(-1)
      return
    }
    case 40: {
      // down
      e.preventDefault()
      omStatic.actions.home.moveActive(1)
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
    const om = useOvermind()
    const tags = om.state.home.searchBarTags
    const focusedTag = om.state.home.searchbarFocusedTag

    return (
      <>
        {!!tags.length && (
          <HStack marginLeft={10} marginTop={-1} spacing={4}>
            {tags.map((tag) => {
              const isActive = focusedTag === tag
              return (
                <TagButton
                  className="no-transition"
                  key={getTagSlug(tag)}
                  subtleIcon
                  backgroundColor="rgba(150,150,150,0.25)"
                  color={'#fff'}
                  shadowColor="#00000022"
                  fontWeight="600"
                  shadowRadius={10}
                  shadowOffset={{ height: 2, width: 0 }}
                  borderColor={'transparent'}
                  borderRadius={100}
                  hoverStyle={{
                    backgroundColor: 'rgba(150,150,150,0.3)',
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
                  size="lg"
                  {...getTagButtonProps(tag)}
                  onPress={() => {
                    om.actions.home.setSearchBarFocusedTag(tag)
                  }}
                  closable
                  onClose={async () => {
                    om.actions.home.navigate({ tags: [tag] })
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
