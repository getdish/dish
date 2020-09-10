import { fullyIdle, idle, series } from '@dish/async'
import { Loader, Search } from '@dish/react-feather'
import { HStack, Spacer, Toast, VStack, useGet, useOnMount } from '@dish/ui'
import { useStore } from '@dish/use-store'
import _ from 'lodash'
import React, { memo, useEffect, useState } from 'react'
import { Platform, ScrollView, StyleSheet, TextInput } from 'react-native'

import { searchBarHeight } from '../../constants'
import { inputClearSelection, inputIsTextSelected } from '../../helpers/input'
import { getTagId } from '../../state/getTagId'
import { omStatic, useOvermind } from '../../state/om'
import { router } from '../../state/router'
import { CloseButton } from './CloseButton'
import { HomeAutocompleteHoverableInput } from './HomeAutocompleteHoverableInput'
import { InputStore } from './InputStore'
import { isIOS } from './isIOS'
import { TagButton } from './TagButton'
import { getMediaQueryMatch } from './useMediaQueryIs'
import { useSearchBarTheme } from './useSearchBarTheme'

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

const placeHolder = `Find the best ${
  placeholders[Math.floor(placeholders.length * Math.random())]
}`

// avoid first one on iniital focus
let avoidNextFocus = true
export function setAvoidNextAutocompleteShowOnFocus() {
  avoidNextFocus = true
  console.log('avoid next')
}

export const onFocusAnyInput = () => {
  if (omStatic.state.home.searchbarFocusedTag) {
    omStatic.actions.home.setSearchBarFocusedTag(null)
  }
}

let searchBar: HTMLInputElement | null = null
export function focusSearchInput() {
  if (isIOS) return
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

export const HomeSearchInput = memo(() => {
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
        if (!getMediaQueryMatch('sm')) {
          focusSearchInput()
        }
      },
    ])
  })

  // useEffect(() => {
  //   const onFocus = () => {
  //     setAvoidNextAutocompleteShowOnFocus()
  //     focusSearchInput()
  //   }
  //   window.addEventListener('focus', onFocus)
  //   return () => {
  //     window.removeEventListener('focus', onFocus)
  //   }
  // }, [])

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
  useEffect(() => {
    const handleClick = () => {
      om.actions.home.setShowAutocomplete('search')
    }

    const node = inputStore.node
    if (node) {
      node.addEventListener('click', handleClick)
      return () => {
        node.removeEventListener('click', handleClick)
      }
    }
  }, [])

  // disabled because it steals focus from autocomplete rn
  // focus/blur search on show autocomplete
  // useEffect(() => {
  //   if (!input) return
  //   const isFocused = document.activeElement === input
  //   // on focus change
  //   if (isFocused) return
  //   // when changed
  //   if (showAutocomplete === isFocused) return
  //   const targetInput =
  //     showAutocomplete == 'location' ? inputRef.current : input
  //   if (!isWorker) {
  //     if (showAutocomplete) {
  //       targetInput?.focus()
  //     } else {
  //       // targetInput?.blur()
  //     }
  //   }
  // }, [input, inputRef, showAutocomplete])

  useEffect(() => {
    if (inputStore.node) {
      return searchInputEffect(inputStore.node)
    }
  }, [inputStore.node])

  const handleFocus = (e) => {
    e.preventDefault()
    // onFocusAnyInput()
    // console.log('avoidNextFocus', avoidNextFocus)
    // if (avoidNextFocus) {
    //   avoidNextFocus = false
    // } else {
    //   om.actions.home.setShowAutocomplete('search')
    // }
  }

  const input = inputStore.node

  return (
    <HStack flex={1} overflow="hidden">
      <HomeAutocompleteHoverableInput input={input} autocompleteTarget="search">
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
            {om.state.home.isLoading ? (
              <VStack className="rotating" opacity={1}>
                <Loader color={color} size={18} onClick={focusSearchInput} />
              </VStack>
            ) : (
              <Search
                color={color}
                size={18}
                opacity={0.8}
                onClick={focusSearchInput}
              />
            )}
          </VStack>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: 'center',
              width: '100%', // stretch content to full width
            }}
            style={{
              paddingRight: 10,
            }}
          >
            <HomeSearchBarTags input={input} />
            <TextInput
              ref={inputStore.setNode}
              // leave uncontrolled for perf?
              value={search ?? ''}
              onFocus={handleFocus}
              onBlur={() => {
                avoidNextFocus = false
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
                  fontSize: 18,
                  paddingRight: 0,
                },
              ]}
            />
          </ScrollView>
          <SearchCancelButton />
          <Spacer direction="horizontal" size={10} />
        </HStack>
      </HomeAutocompleteHoverableInput>
    </HStack>
  )
})

function searchInputEffect(input: HTMLInputElement) {
  const om = omStatic
  const prev = () => {
    om.actions.home.moveSearchBarTagIndex(-1)
  }
  const next = () => {
    om.actions.home.moveSearchBarTagIndex(1)
  }
  const handleKeyPress = async (e) => {
    // @ts-ignore
    const code = e.keyCode
    const focusedInput = document.activeElement
    if (!(focusedInput instanceof HTMLInputElement)) {
      return
    }
    console.log('key', code)
    const {
      isAutocompleteActive,
      autocompleteIndex,
      searchBarTagIndex,
    } = om.state.home
    const isSelecting =
      focusedInput.selectionStart !== focusedInput.selectionEnd
    const isCaretAtEnd =
      !isSelecting && focusedInput.selectionEnd === focusedInput.value.length
    const isCaretAtStart = focusedInput.selectionEnd == 0

    switch (code) {
      case 13: {
        // enter
        // just searching normal
        const item = om.state.home.autocompleteResults[autocompleteIndex - 1]
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
            om.actions.home.clearSearch()
            om.actions.home.navigate({
              tags: [item],
            })
          }
        } else {
          om.actions.home.runSearch({
            searchQuery: e.target.value,
            force: true,
          })
          await idle(40)
        }
        om.actions.home.setShowAutocomplete(false)
        focusedInput.blur()
        return
      }
      case 8: {
        // delete
        if (om.state.home.searchbarFocusedTag) {
          // will remove it if active
          om.actions.home.navigate({
            tags: [om.state.home.searchbarFocusedTag],
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
        if (inputIsTextSelected(focusedInput)) {
          inputClearSelection(focusedInput)
          return
        }
        if (om.state.home.showAutocomplete) {
          om.actions.home.setShowAutocomplete(false)
        }
        focusedInput.blur()
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
  }
  const handleClick = () => {
    if (om.state.home.searchbarFocusedTag) {
      om.actions.home.setSearchBarTagIndex(0)
    } else {
      showAutocomplete()
    }
  }
  const showAutocomplete = () => {
    if (input.value === '') return
    if (!om.state.home.showAutocomplete) {
      om.actions.home.setShowAutocomplete('search')
    }
  }
  // debounce so it happens after location if location input is next active
  const hideAutocomplete = _.debounce(() => {
    if (om.state.home.showAutocomplete === 'search') {
      om.actions.home.setShowAutocomplete(false)
    }
  }, 100)
  const handleBlur = () => {
    hideAutocomplete()
    isFocused = false
  }
  input.addEventListener('keydown', handleKeyPress)
  input.addEventListener('click', handleClick)
  input.addEventListener('blur', handleBlur)
  return () => {
    input.removeEventListener('keydown', handleKeyPress)
    input.removeEventListener('click', handleClick)
    input.removeEventListener('blur', handleBlur)
  }
}

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
        om.actions.home.clearSearch()
      }}
    />
  )
})

//

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
