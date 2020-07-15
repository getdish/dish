import { fullyIdle, series } from '@dish/async'
import { HStack, Toast, useGet, useOnMount } from '@dish/ui'
import React, { memo, useEffect, useRef, useState } from 'react'
import { StyleSheet, TextInput } from 'react-native'

import { searchBarHeight } from '../../constants'
import {
  inputClearSelection,
  inputGetNode,
  inputIsTextSelected,
} from '../../helpers/input'
import { getTagId } from '../../state/Tag'
import { omStatic, useOvermind } from '../../state/useOvermind'
import { CloseButton } from './CloseButton'
import { HomeAutocompleteHoverableInput } from './HomeAutocomplete'
import { TagButton } from './TagButton'

// avoid first one on iniital focus
let avoidNextShowautocompleteOnFocus = true
export function setAvoidNextAutocompleteShowOnFocus() {
  avoidNextShowautocompleteOnFocus = true
}

export const onFocusAnyInput = () => {
  if (omStatic.state.home.searchbarFocusedTag) {
    omStatic.actions.home.setSearchBarFocusedTag(null)
  }
}

let searchBar: HTMLInputElement | null = null
export function focusSearchInput() {
  searchBar?.focus()
}

export const HomeSearchInput = memo(() => {
  const om = useOvermind()
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
        const input = inputGetNode(inputRef.current)
        input?.focus()
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
  useEffect(() => {
    const handleKeyUp = (e) => {
      const input = inputGetNode(inputRef.current)
      if (document.activeElement !== input) {
        if (e.keyCode == 191) {
          // forward-slash (/)
          input.focus()
        }
      }
    }

    const handleClick = () => {
      om.actions.home.setShowAutocomplete('search')
    }

    window.addEventListener('keyup', handleKeyUp)
    inputRef.current.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('keyup', handleKeyUp)
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

  const input = inputGetNode(inputRef.current)
  return (
    <>
      <HomeAutocompleteHoverableInput input={input} autocompleteTarget="search">
        <HStack alignItems="center" flex={1} overflow="hidden">
          <HomeSearchBarTags input={input} />
          <TextInput
            ref={inputRef}
            // leave uncontrolled for perf?
            value={search}
            onFocus={() => {
              onFocusAnyInput()
              if (avoidNextShowautocompleteOnFocus) {
                avoidNextShowautocompleteOnFocus = false
              } else {
                om.actions.home.setShowAutocomplete('search')
              }
            }}
            onBlur={() => {
              avoidNextShowautocompleteOnFocus = false
            }}
            onChangeText={(text) => {
              if (getSearch() == '' && text !== '') {
                om.actions.home.setShowAutocomplete('search')
              }
              setSearch(text)
              om.actions.home.setSearchQuery(text)
            }}
            placeholder={
              isSearchingCuisine
                ? '...'
                : 'Find the best dishes and restaurants'
            }
            style={[
              inputTextStyles.textInput,
              { flex: 1, fontSize: 18, paddingRight: 0 },
            ]}
          />
        </HStack>
      </HomeAutocompleteHoverableInput>
      <SearchCancelButton />
    </>
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
  const handleKeyPress = (e) => {
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
        const item = om.state.home.autocompleteResults[autocompleteIndex - 1]
        if (isAutocompleteActive && item && autocompleteIndex !== 0) {
          if (item.type === 'restaurant') {
            if (!item.slug) {
              Toast.show(`No slug, err`)
              return
            }
            om.actions.router.navigate({
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
        }
        om.actions.home.setShowAutocomplete(false)
        focusedInput.blur()
        return
      }
      case 8: {
        // delete
        if (isAutocompleteActive) {
          // if selected onto a tag, we can send remove command
          if (om.state.home.searchbarFocusedTag) {
            om.actions.home.navigate({
              tags: [om.state.home.searchbarFocusedTag],
            })
            next()
            return
          }
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
    if (input.value === '') {
      return
    }
    if (!om.state.home.showAutocomplete) {
      om.actions.home.setShowAutocomplete('search')
    }
  }
  input.addEventListener('keydown', handleKeyPress)
  input.addEventListener('click', handleClick)
  input.addEventListener('focus', showAutocomplete)
  return () => {
    input.removeEventListener('keydown', handleKeyPress)
    input.removeEventListener('click', handleClick)
    input.removeEventListener('focus', showAutocomplete)
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
                  color="#fff"
                  fontWeight="600"
                  borderColor={'transparent'}
                  hoverStyle={{
                    backgroundColor: 'rgba(0,0,0,0.2)',
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
                    input?.focus()
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
    paddingHorizontal: 16,
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})
