import { HStack, Hoverable, useOnMount } from '@dish/ui'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, TextInput } from 'react-native'

import { fullyIdle } from '../../../../../packages/async/src'
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

export const HomeSearchInput = memo(() => {
  const om = useOvermind()
  const inputRef = useRef<any>()
  const [search, setSearch] = useState('')
  const isSearchingCuisine = !!om.state.home.searchBarTags.length
  const input = inputGetNode(inputRef.current)

  useOnMount(() => {
    setSearch(om.state.home.currentStateSearchQuery)

    setTimeout(() => {
      const input = inputGetNode(inputRef.current)
      input?.focus()
    }, 100)
  })

  // one way sync down for more perf
  useEffect(() => {
    return om.reaction(
      (state) => state.home.currentState.searchQuery,
      (val) => {
        setSearch(val)
      }
    )
  }, [])

  // useEffect(() => {
  //   if (!input) return
  //   const isFocused = document.activeElement === input
  //   if (isFocused) return // ONE way sync
  //   if (showAutocomplete !== isFocused) {
  //     const target = showAutocomplete == 'location' ? locationInput : input
  //     if (!isWorker) {
  //       if (showAutocomplete) {
  //         target?.focus()
  //       } else {
  //         target?.blur()
  //       }
  //     }
  //   }
  // }, [input, locationInput, showAutocomplete])

  useEffect(() => {
    if (!input) return
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
    const showAutocomplete = () => {
      if (!om.state.home.showAutocomplete) {
        om.actions.home.setShowAutocomplete('search')
      }
    }
    input.addEventListener('keydown', handleKeyPress)
    input.addEventListener('click', showAutocomplete)
    input.addEventListener('focus', showAutocomplete)
    return () => {
      input.removeEventListener('keydown', handleKeyPress)
      input.removeEventListener('click', showAutocomplete)
      input.removeEventListener('focus', showAutocomplete)
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
              om.actions.home.setSearchQuery(text ?? '')
            }}
            placeholder={
              isSearchingCuisine ? '...' : 'Search dish, cuisine, restaurant'
            }
            style={[
              inputTextStyles.textInput,
              { flex: 1, fontSize: 19, paddingRight: 0 },
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
          <HStack marginLeft={10} marginTop={-1} spacing={5}>
            {om.state.home.searchBarTags.map((tag) => {
              const isActive = om.state.home.searchbarFocusedTag === tag
              return (
                <TagButton
                  className="no-transition"
                  key={getTagId(tag)}
                  subtleIcon
                  backgroundColor="#eee"
                  color="#666"
                  borderColor={'transparent'}
                  {...(isActive && {
                    backgroundColor: '#777',
                    color: '#fff',
                    transform: [{ scale: 1.05 }, { rotate: '-1.3deg' }],
                  })}
                  hoverStyle={{
                    backgroundColor: '#f2f2f2',
                    // transform: [{ scale: 1.02 }],
                  }}
                  size="lg"
                  fontSize={16}
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
    padding: 11,
    paddingHorizontal: 16,
    flex: 1,
    fontSize: 18,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})
