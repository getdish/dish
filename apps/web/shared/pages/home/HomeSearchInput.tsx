import { fullyIdle, series } from '@dish/async'
import { HStack, useDebounce, useGet, useOnMount } from '@dish/ui'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, TextInput } from 'react-native'

import { searchBarHeight } from '../../constants'
import {
  inputCaretPosition,
  inputClearSelection,
  inputGetNode,
  inputIsTextSelected,
} from '../../helpers/input'
import { getTagId } from '../../state/Tag'
import { omStatic, useOvermind } from '../../state/useOvermind'
import { CloseButton } from './CloseButton'
import { HomeAutocompleteHoverableInput } from './HomeAutocomplete'
import { TagButton } from './TagButton'

let avoidNextShowautocompleteOnFocus = true
export function setAvoidNextAutocompleteShowOnFocus() {
  avoidNextShowautocompleteOnFocus = true
}

export const onFocusAnyInput = () => {
  if (omStatic.state.home.searchbarFocusedTag) {
    omStatic.actions.home.setSearchBarFocusedTag(null)
  }
}

function searchInputEffect(input: HTMLInputElement) {
  const om = omStatic
  const prev = () => {
    om.actions.home.moveAutocompleteIndex(-1)
  }
  const next = () => {
    om.actions.home.moveAutocompleteIndex(1)
  }
  const handleKeyPress = (e) => {
    // @ts-ignore
    const code = e.keyCode
    console.log('code', code)
    const focusedInput = document.activeElement
    if (!(focusedInput instanceof HTMLInputElement)) {
      return
    }
    const { isAutocompleteActive, autocompleteIndex } = om.state.home
    const isCaretAtEnd = inputCaretPosition() == focusedInput.selectionEnd
    const isCaretAtStart = focusedInput.selectionEnd == 0

    switch (code) {
      case 13: {
        // enter
        if (isAutocompleteActive) {
          const item = om.state.home.autocompleteResults[autocompleteIndex]
          if (item && 'tagId' in item) {
            om.actions.home.navigateToTag({
              tags: [{ id: item.tagId, name: item.name, type: item.type }],
            })
            return
          }
        }
        om.actions.home.runSearch({
          searchQuery: e.target.value,
          force: true,
        })
        om.actions.home.setShowAutocomplete(false)
        focusedInput.blur()
        return
      }
      case 8: {
        // delete
        console.log('delete', autocompleteIndex)
        if (isAutocompleteActive) {
          // if selected onto a tag, we can send remove command
          if (om.state.home.searchbarFocusedTag) {
            console.log('delete tag', om.state.home.searchbarFocusedTag)
            om.actions.home.navigateToTag({
              tags: [om.state.home.searchbarFocusedTag],
            })
            next()
          }
        }
        if (autocompleteIndex === 0) {
          prev()
        }
        return
      }
      case 39: {
        // right
        if (isAutocompleteActive && isCaretAtEnd) {
          // at end
          next()
        }
        return
      }
      case 37: {
        // left
        if (isCaretAtStart) {
          // at start, go into selecting searchbar tags if we have em
          if (isAutocompleteActive) {
            prev()
            return
          }
        }
        if (isAutocompleteActive && autocompleteIndex > 0 && isCaretAtEnd) {
          e.preventDefault()
          prev()
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
        om.actions.home.moveActiveUp()
        return
      }
      case 40: {
        // down
        e.preventDefault()
        om.actions.home.moveActiveDown()
        return
      }
    }
  }
  const handleClick = () => {
    if (om.state.home.searchbarFocusedTag) {
      om.actions.home.setAutocompleteIndex(0)
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

export const HomeSearchInput = memo(() => {
  const om = useOvermind()
  const inputRef = useRef<any>()
  const [search, setSearch] = useState('')
  const getSearch = useGet(search)
  const isSearchingCuisine = !!om.state.home.searchBarTags.length
  const runAutocomplete = useDebounce(() => {
    om.actions.homegetSearch()
  }, 50)
  // const { showAutocomplete } = om.state.home

  useOnMount(() => {
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
        setSearch(val)
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
    window.addEventListener('keyup', handleKeyUp)
    return () => window.removeEventListener('keyup', handleKeyUp)
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

  const input = inputGetNode(inputRef.current)
  useEffect(() => {
    if (input) {
      return searchInputEffect(input)
    }
  }, [input])

  const handleCancel = useCallback(() => {
    om.actions.home.setShowAutocomplete(false)
    om.actions.home.clearSearch()
  }, [input])

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
              if (text === '') {
                om.actions.home.setShowAutocomplete(false)
              }
              setSearch(text)
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
      <SearchCancelButton onCancel={handleCancel} />
    </>
  )
})

const SearchCancelButton = memo(({ onCancel }: { onCancel?: Function }) => {
  const om = useOvermind()
  return (
    <CloseButton
      opacity={om.state.home.currentStateSearchQuery === '' ? 0 : 1}
      disabled={om.state.home.currentStateSearchQuery === ''}
      onPress={() => {
        om.actions.home.clearSearch()
        onCancel?.()
      }}
    />
  )
})

const HomeSearchBarTags = memo(
  ({ input }: { input: HTMLInputElement | null }) => {
    const om = useOvermind()

    return (
      <>
        {!!om.state.home.searchBarTags.length && (
          <HStack marginLeft={10} marginTop={-1} spacing={8}>
            {om.state.home.searchBarTags.map((tag) => {
              const isActive = om.state.home.searchbarFocusedTag === tag
              return (
                <TagButton
                  className="no-transition"
                  key={getTagId(tag)}
                  subtleIcon
                  backgroundColor="rgba(0,0,0,0.3)"
                  color="#fff"
                  borderColor={'transparent'}
                  hoverStyle={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
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
                  name={tag.name}
                  type={tag.type}
                  icon={tag.icon ?? ''}
                  rgb={tag.rgb}
                  onPress={() => {
                    om.actions.home.setSearchBarFocusedTag(tag)
                  }}
                  closable
                  onClose={async () => {
                    om.actions.home.navigateToTag({ tags: [tag] })
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
