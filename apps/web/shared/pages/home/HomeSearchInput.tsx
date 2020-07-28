import { fullyIdle, idle, series } from '@dish/async'
import {
  HStack,
  Toast,
  VStack,
  useDebounce,
  useGet,
  useOnMount,
} from '@dish/ui'
import React, { memo, useEffect, useRef, useState } from 'react'
import { Loader, Search } from 'react-feather'
import { StyleSheet, TextInput } from 'react-native'

import { searchBarHeight } from '../../constants'
import {
  inputClearSelection,
  inputGetNode,
  inputIsTextSelected,
} from '../../helpers/input'
import { getTagId } from '../../state/getTagId'
import { router } from '../../state/router'
import { omStatic, useOvermind } from '../../state/useOvermind'
import { CloseButton } from './CloseButton'
import { HomeAutocompleteHoverableInput } from './HomeAutocomplete'
import { TagButton } from './TagButton'
import { useMediaQueryIsReallySmall } from './useMediaQueryIs'

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

const placeHolder = `${
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

export const isIOS =
  (/iPad|iPhone|iPod/.test(navigator.platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
  !window.MSStream

let searchBar: HTMLInputElement | null = null
export function focusSearchInput() {
  if (isIOS) return
  searchBar?.focus()
}

export const getSearchInput = () => {
  return searchBar
}

let isFocused = false
export const isSearchInputFocused = () => {
  return isFocused
}

export const HomeSearchInput = memo(() => {
  const om = useOvermind()
  const isReallySmall = useMediaQueryIsReallySmall()
  const inputRef = useRef<any>()
  const [search, setSearch] = useState('')
  const getSearch = useGet(search)
  const isSearchingCuisine = !!om.state.home.searchBarTags.length
  // const { showAutocomplete } = om.state.home

  useOnMount(() => {
    searchBar = inputGetNode(inputRef.current)

    setSearch(om.state.home.currentStateSearchQuery)

    series([
      () => fullyIdle({ max: 1000 }),
      () => {
        focusSearchInput()
      },
    ])
  })

  useEffect(() => {
    const onFocus = () => {
      setAvoidNextAutocompleteShowOnFocus()
      focusSearchInput()
    }
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  }, [])

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

    inputRef.current.addEventListener('click', handleClick)
    return () => {
      inputRef.current.removeEventListener('click', handleClick)
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
    const input = inputGetNode(inputRef.current)
    if (input) {
      return searchInputEffect(input)
    }
  }, [inputRef.current])

  const handleFocus = useDebounce(() => {
    onFocusAnyInput()
    console.log('avoidNextFocus', avoidNextFocus)
    if (avoidNextFocus) {
      avoidNextFocus = false
    } else {
      om.actions.home.setShowAutocomplete('search')
    }
  }, 100)

  const input = inputGetNode(inputRef.current)

  return (
    <HStack flex={1} overflow="hidden">
      <HomeAutocompleteHoverableInput input={input} autocompleteTarget="search">
        <HStack
          contain="paint"
          // backgroundColor="rgba(255,255,255,0.1)"
          alignItems="center"
          // paddingHorizontal={15}
          borderRadius={100}
          flex={1}
          maxWidth="100%"
          paddingRight={6}
          overflow="hidden"
        >
          {/* Loading / Search Icon */}
          {!isReallySmall && (
            <>
              {om.state.home.isLoading ? (
                <VStack className="rotating" opacity={0.9}>
                  <Loader color="#fff" size={18} />
                </VStack>
              ) : (
                <Search
                  color="#fff"
                  size={18}
                  opacity={0.6}
                  onClick={focusSearchInput}
                />
              )}
            </>
          )}
          <HomeSearchBarTags input={input} />
          <TextInput
            ref={inputRef}
            // leave uncontrolled for perf?
            value={search}
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
              { flex: 1, fontSize: 18, paddingRight: 0 },
            ]}
          />
          <SearchCancelButton />
        </HStack>
      </HomeAutocompleteHoverableInput>
    </HStack>
  )
})

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
        } else {
          focusedInput.blur()
        }
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
  const hideAutocomplete = () => {
    om.actions.home.setShowAutocomplete(false)
  }
  const handleFocus = () => {
    showAutocomplete()
    isFocused = true
  }
  const handleBlur = () => {
    hideAutocomplete()
    isFocused = false
  }
  input.addEventListener('keydown', handleKeyPress)
  input.addEventListener('click', handleClick)
  input.addEventListener('focus', handleFocus)
  input.addEventListener('blur', handleBlur)
  return () => {
    input.removeEventListener('keydown', handleKeyPress)
    input.removeEventListener('click', handleClick)
    input.removeEventListener('focus', handleFocus)
    input.removeEventListener('blur', handleBlur)
  }
}

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
                  fontWeight="400"
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
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})
