import { fullyIdle, idle, series } from '@dish/async'
import { Loader, Search } from '@dish/react-feather'
import {
  AbsoluteVStack,
  HStack,
  Spacer,
  Toast,
  VStack,
  useGet,
  useOnMount,
} from '@dish/ui'
import { useStore } from '@dish/use-store'
import _ from 'lodash'
import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import {
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import { AppAutocompleteHoverableInput } from './AppAutocompleteHoverableInput'
import { isWeb, searchBarHeight } from './constants'
import { inputClearSelection, inputIsTextSelected } from './helpers/input'
import { isWebIOS } from './helpers/isIOS'
import { getIs } from './hooks/useIs'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'
import { InputStore } from './InputStore'
import { getTagId } from './state/getTagId'
import { useOvermind } from './state/om'
import { omStatic } from './state/omStatic'
import { router } from './state/router'
import { TagButton } from './views/TagButton'
import { CloseButton } from './views/ui/CloseButton'

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

const placeHolder = `The best ${
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

export let isTouchingSearchBar

export const AppSearchInput = memo(() => {
  const inputStore = useStore(InputStore, { name: 'search' })
  const om = useOvermind()
  const { color, background } = useSearchBarTheme()
  const [search, setSearch] = useState('')
  const getSearch = useGet(search)
  const isSearchingCuisine = !!om.state.home.searchBarTags.length
  // const { showAutocomplete } = om.state.home

  useOnMount(() => {
    searchBar = inputStore.node

    setSearch(om.state.home.currentStateSearchQuery)

    return series([
      () => fullyIdle({ max: 1000 }),
      () => {
        if (!getIs('sm')) {
          focusSearchInput()
        }
      },
    ])
  })

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
      node.addEventListener('click', handleClick)
      return () => {
        node.removeEventListener('click', handleClick)
      }
    }, [])
  }

  const panResponder = useMemo(() => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => {
        console.log('waht is')
        isTouchingSearchBar = true
        return true
      },
      onPanResponderTerminate: () => {
        console.log(123)
      },
      onPanResponderReject: () => {
        console.log('inputStore.node', inputStore.node.focus())
        isTouchingSearchBar = false
      },
      onPanResponderRelease: (e, gestureState) => {
        console.log('inputStore.node', inputStore.node.focus())
        isTouchingSearchBar = false
      },
    })
  }, [])

  const input = inputStore.node

  return (
    <HStack flex={1} overflow="hidden">
      <AppAutocompleteHoverableInput input={input} autocompleteTarget="search">
        <HStack
          // contain="paint"
          alignItems="center"
          borderRadius={10}
          flex={1}
          maxWidth="100%"
          paddingLeft={10}
          overflow="hidden"
          backgroundColor={background}
        >
          {/* Loading / Search Icon */}
          <VStack
            width={18}
            transform={[{ scale: om.state.home.isLoading ? 1.2 : 1 }]}
          >
            <TouchableOpacity onPress={focusSearchInput}>
              {om.state.home.isLoading ? (
                <VStack className="rotating" opacity={1}>
                  <Loader color={color} size={18} />
                </VStack>
              ) : (
                <Search
                  color={color}
                  size={18}
                  style={{
                    opacity: 0.8,
                  }}
                />
              )}
            </TouchableOpacity>
          </VStack>

          <VStack flex={1} height={searchBarHeight - 8}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: 'center',
              }}
              style={{
                paddingRight: 10,
                flex: 1,
              }}
            >
              <HStack
                alignSelf="center"
                alignItems="center"
                height={searchBarHeight - 23}
              >
                <HomeSearchBarTags input={input} />
                <HStack position="relative" flex={1}>
                  {!isWeb && (
                    // this helps native with dragging conflicts
                    <TouchableWithoutFeedback
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 40,
                        bottom: 0,
                        zIndex: 10000,
                      }}
                      onPress={() => {
                        inputStore.node?.focus()
                      }}
                    >
                      <View
                        style={StyleSheet.absoluteFill}
                        {...panResponder.panHandlers}
                      />
                    </TouchableWithoutFeedback>
                  )}
                  <TextInput
                    ref={inputStore.setNode}
                    // leave uncontrolled for perf?
                    value={search ?? ''}
                    onBlur={(e) => {
                      avoidNextFocus = false
                    }}
                    onKeyPress={handleKeyPress}
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
                    placeholder={
                      isSearchingCuisine ? '...' : `${placeHolder}...`
                    }
                    style={[
                      inputTextStyles.textInput,
                      {
                        color,
                        flex: 1,
                        fontSize: 18,
                        paddingHorizontal: 20,
                      },
                    ]}
                  />
                </HStack>
              </HStack>
            </ScrollView>
          </VStack>

          <SearchCancelButton />

          <Spacer direction="horizontal" size={8} />
        </HStack>
      </AppAutocompleteHoverableInput>
    </HStack>
  )
})

// function searchInputEffect(input: HTMLInputElement) {
//   // debounce so it happens after location if location input is next active
//   const hideAutocomplete = _.debounce(() => {
//     if (omStatic.state.home.showAutocomplete === 'search') {
//       omStatic.actions.home.setShowAutocomplete(false)
//     }
//   }, 100)
//   const handleBlur = () => {
//     hideAutocomplete()
//     isFocused = false
//   }

//   if ('addEventListener' in input) {
//     input.addEventListener('keydown', handleKeyPress)
//     input.addEventListener('click', handleClick)
//     input.addEventListener('blur', handleBlur)
//     return () => {
//       input.removeEventListener('keydown', handleKeyPress)
//       input.removeEventListener('click', handleClick)
//       input.removeEventListener('blur', handleBlur)
//     }
//   }
// }

const SearchCancelButton = memo(() => {
  const om = useOvermind()
  const hasSearch = om.state.home.currentStateSearchQuery !== ''
  const hasSearchTags = !!om.state.home.searchBarTags.length
  const isActive = hasSearch || hasSearchTags
  return (
    <CloseButton
      opacity={isActive ? 1 : 0}
      disabled={!isActive}
      onPress={() => {
        if (om.state.home.showAutocomplete) {
          om.actions.home.setShowAutocomplete(false)
        } else {
          om.actions.home.clearSearch()
        }
      }}
    />
  )
})

const prev = () => {
  omStatic.actions.home.moveSearchBarTagIndex(-1)
}
const next = () => {
  omStatic.actions.home.moveSearchBarTagIndex(1)
}

const handleKeyPress = async (e) => {
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
    isSelecting = focusedInput.selectionStart !== focusedInput.selectionEnd
    isCaretAtEnd =
      !isSelecting && focusedInput.selectionEnd === focusedInput.value.length
    isCaretAtStart = focusedInput.selectionEnd == 0
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
          tags: [omStatic.state.home.searchbarFocusedTag],
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
      // esc
      if (focusedInput) {
        focusedInput.blur()
        if (inputIsTextSelected(focusedInput)) {
          inputClearSelection(focusedInput)
          return
        }
      }
      if (omStatic.state.home.showAutocomplete) {
        omStatic.actions.home.setShowAutocomplete(false)
      }
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

const HomeSearchBarTags = memo(
  ({ input }: { input: HTMLInputElement | null }) => {
    const om = useOvermind()

    return (
      <>
        {!!om.state.home.searchBarTags.length && (
          <HStack marginLeft={10} marginTop={-1} spacing={4}>
            {om.state.home.searchBarTags.map((tag) => {
              const isActive = om.state.home.searchbarFocusedTag === tag
              return (
                <TagButton
                  className="no-transition"
                  key={getTagId(tag)}
                  subtleIcon
                  backgroundColor="rgba(0,0,0,0.3)"
                  color={'#fff'}
                  shadowColor="#00000022"
                  fontWeight="500"
                  shadowRadius={10}
                  shadowOffset={{ height: 2, width: 0 }}
                  borderColor={'transparent'}
                  hoverStyle={{
                    backgroundColor: 'rgba(0,0,0,0.4)',
                  }}
                  {...(isActive && {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    hoverStyle: {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                    // transform: [{ rotate: '-1.5deg' }],
                  })}
                  size="lg"
                  // @ts-ignore
                  name={tag.name}
                  // @ts-ignore
                  type={tag.type}
                  icon={tag.icon ?? ''}
                  rgb={tag.rgb}
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
