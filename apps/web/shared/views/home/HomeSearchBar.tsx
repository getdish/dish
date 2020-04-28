import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import {
  isWorker,
  pageWidthMax,
  searchBarHeight,
  searchBarTopOffset,
} from '../../constants'
import { useOnMount } from '../../hooks/useOnMount'
import { useOvermind } from '../../state/om'
import { getTagId } from '../../state/Tag'
import { Circle } from '../ui/Circle'
import { Divider } from '../ui/Divider'
import Hoverable from '../ui/Hoverable'
import { Icon } from '../ui/Icon'
import { LinkButton } from '../ui/Link'
import { MediaQuery, mediaQueries } from '../ui/MediaQuery'
import { Spacer } from '../ui/Spacer'
import { HStack, VStack, ZStack } from '../ui/Stacks'
import { CloseButton } from './CloseButton'
import { DishLogoButton } from './DishLogoButton'
import HomeAutocomplete from './HomeAutocomplete'
import { HomeUserMenu } from './HomeUserMenu'
import { TagButton } from './TagButton'

const divider = <Divider vertical flexLine={1} marginHorizontal={4} />

const isTextSelected = (node?: any) => {
  const selection = window.getSelection()
  if (node && selection?.anchorNode?.firstChild !== node) return
  return !selection?.empty
}

const selectActiveInput = () => {
  const input = document.activeElement
  if (input instanceof HTMLInputElement) {
    input.select()
  }
}

const clearTextSelection = () => {
  if (window.getSelection) {
    if (window.getSelection().empty) {
      // Chrome
      window.getSelection().empty()
    } else if (window.getSelection().removeAllRanges) {
      // Firefox
      window.getSelection().removeAllRanges()
    }
  }
}

export const getInputNode = (instance: any): HTMLInputElement | null => {
  return instance?.['_node'] ?? null
}

export default memo(() => {
  const om = useOvermind()
  const inputRef = useRef()
  const locationInputRef = useRef()

  // use local for a little better perf
  const [search, setSearch] = useState('')
  const [locationSearch, setLocationSearch] = useState('')

  useOnMount(() => {
    setSearch(om.state.home.currentStateSearchQuery)

    setTimeout(() => {
      const input = getInputNode(inputRef.current)
      input.focus()
    }, 100)
  })

  // one way sync down for more perf
  useEffect(() => {
    const offSearch = om.reaction(
      (state) => state.home.currentState.searchQuery,
      (val) => {
        setSearch(val)
      }
    )
    const offLoc = om.reaction(
      (state) => state.home.locationSearchQuery,
      (val) => setLocationSearch(val)
    )
    return () => {
      offSearch()
      offLoc()
    }
  }, [])

  // ONE way sync this state so we can control it programatically (but blurring gets annoying)
  const { showAutocomplete } = om.state.home
  const input = getInputNode(inputRef.current)
  const locationInput = getInputNode(locationInputRef.current)

  const onFocusAnyInput = () => {
    if (om.state.home.searchbarFocusedTag) {
      om.actions.home.setSearchBarFocusedTag(null)
    }
  }

  const handleCancel = useCallback(() => {
    om.actions.home.setShowAutocomplete(false)
    // setTimeout(() => {
    //   input.focus()
    // }, 100)
  }, [input])

  useEffect(() => {
    if (!input) return
    const isFocused = document.activeElement === input
    if (isFocused) return // ONE way sync
    if (showAutocomplete !== isFocused) {
      const target = showAutocomplete == 'location' ? locationInput : input
      if (!isWorker) {
        if (showAutocomplete) target.focus()
        else target.blur()
      }
    }
  }, [input, locationInput, showAutocomplete])

  useEffect(() => {
    if (!input || !locationInput) return
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
        console.warn('not a valid input')
        return
      }
      const { isAutocompleteActive, autocompleteIndex } = om.state.home
      const isCaretAtEnd =
        focusedInput.value.length == focusedInput.selectionEnd
      const isCaretAtStart = focusedInput.selectionEnd == 0

      switch (code) {
        case 13: {
          // enter
          if (om.state.home.autocompleteFocusedTag) {
            om.actions.home.navigateToTag({
              tag: om.state.home.autocompleteFocusedTag,
            })
          } else {
            om.actions.home.runSearch({ force: true })
            om.actions.home.setShowAutocomplete(false)
            focusedInput.blur()
          }
          return
        }
        case 8: {
          // delete
          if (!isAutocompleteActive) return
          // if selected onto a tag, we can send remove command
          if (autocompleteIndex < 0) {
            if (om.state.home.searchbarFocusedTag) {
              om.actions.home.navigateToTag({
                tag: om.state.home.searchbarFocusedTag,
              })
            }
            next()
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
            if (isAutocompleteActive && autocompleteIndex === 0) {
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
          if (isTextSelected(focusedInput)) {
            clearTextSelection()
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
      const focusedInput = document.activeElement
      if (!om.state.home.showAutocomplete) {
        om.actions.home.setShowAutocomplete(
          focusedInput === locationInput ? 'location' : 'search'
        )
      }
    }
    input.addEventListener('keydown', handleKeyPress)
    locationInput.addEventListener('keydown', handleKeyPress)
    input.addEventListener('click', handleClick)
    locationInput.addEventListener('click', handleClick)
    return () => {
      input.removeEventListener('keydown', handleKeyPress)
      locationInput.removeEventListener('keydown', handleKeyPress)
      input.removeEventListener('click', handleClick)
      locationInput.removeEventListener('click', handleClick)
    }
  }, [input, locationInput])

  const tm = useRef<any>(0)
  const tm2 = useRef<any>(0)
  const tmInputBlur = useRef<any>(0)

  const isSearchingCuisine = !!om.state.home.searchBarTags.length

  return (
    <>
      <HomeAutocomplete />
      <View style={[styles.container, { height: searchBarHeight }]}>
        <View style={styles.containerInner}>
          <DishLogoButton />
          <HomeSearchBarHomeButton />
          <HStack
            flex={15}
            maxWidth={450}
            alignItems="center"
            spacing
            overflow="hidden"
          >
            <>
              <MediaQuery query={mediaQueries.sm} style={{ display: 'none' }}>
                {om.state.home.isLoading ? (
                  <VStack className="rotating" opacity={0.5}>
                    <Icon name="Loader" size={18} />
                  </VStack>
                ) : (
                  <Icon name="Search" size={18} opacity={0.5} />
                )}
              </MediaQuery>
              <Hoverable
                // show even if moving after some time
                onHoverIn={() => {
                  tm2.current = setTimeout(() => {
                    if (document.activeElement == input) {
                      om.actions.home.setShowAutocomplete('search')
                    }
                  }, 300)
                }}
                onHoverOut={() => {
                  clearTimeout(tm.current)
                  clearTimeout(tm2.current)
                }}
                onHoverMove={() => {
                  clearTimeout(tm.current)
                  if (om.state.home.currentState.searchQuery) {
                    tm.current = setTimeout(() => {
                      if (document.activeElement == input) {
                        om.actions.home.setShowAutocomplete('search')
                      }
                    }, 150)
                  }
                }}
              >
                <Text
                  style={{
                    fontSize: 19,
                    display: 'flex',
                    flex: 1,
                    overflow: 'hidden',
                  }}
                >
                  <HStack
                    spacing={0}
                    alignItems="center"
                    flex={1}
                    overflow="hidden"
                  >
                    <HomeSearchBarTags input={input} />
                    <TextInput
                      ref={inputRef}
                      // leave uncontrolled for perf?
                      value={search}
                      onFocus={() => {
                        onFocusAnyInput()
                        clearTimeout(tmInputBlur.current)
                        om.actions.home.setShowAutocomplete('search')
                        if (search.length > 0) {
                          selectActiveInput()
                        }
                      }}
                      onBlur={() => {
                        tmInputBlur.current = setTimeout(() => {
                          // om.actions.home.setShowAutocomplete(false)
                        }, 150)
                      }}
                      onChangeText={(text) => {
                        if (text === '') {
                          om.actions.home.setShowAutocomplete(false)
                        }
                        setSearch(text)
                        om.actions.home.setSearchQuery(text ?? '')
                      }}
                      placeholder={
                        isSearchingCuisine ? '...' : 'Search dish, cuisine'
                      }
                      style={[
                        styles.textInput,
                        { flex: 1, fontSize: 19, paddingRight: 0 },
                      ]}
                    />
                  </HStack>
                </Text>
              </Hoverable>
            </>

            <SearchCancelButton onCancel={handleCancel} />

            <Spacer size={1} />
          </HStack>

          {/* IN */}
          <HomeSearchBarSeparator />

          <VStack flex={12} maxWidth={320}>
            <TextInput
              ref={locationInputRef}
              value={locationSearch}
              placeholder="San Francisco"
              style={[styles.textInput, { paddingRight: 32, fontSize: 16 }]}
              onFocus={() => {
                onFocusAnyInput()
                clearTimeout(tmInputBlur.current)
                om.actions.home.setShowAutocomplete('location')
                if (locationSearch.length > 0) {
                  selectActiveInput()
                }
              }}
              onBlur={() => {
                tmInputBlur.current = setTimeout(() => {
                  // om.actions.home.setShowAutocomplete(false)
                }, 150)
              }}
              onChangeText={(text) => {
                setLocationSearch(text)
                om.actions.home.setLocationSearchQuery(text)
              }}
            />
            <SearchLocationButton />
          </VStack>
          {divider}

          <MediaQuery query={mediaQueries.md} style={{ display: 'none' }}>
            <VStack flex={1} />
          </MediaQuery>

          <HomeUserMenu />
        </View>
      </View>
    </>
  )
})

const HomeSearchBarHomeButton = memo(() => {
  const om = useOvermind()
  return (
    <MediaQuery query={mediaQueries.md} style={{ display: 'none' }}>
      <LinkButton
        flexDirection="row"
        pointerEvents="auto"
        padding={13}
        marginLeft={-8} //undo spacing
        opacity={om.state.home.currentStateType === 'home' ? 0.2 : 1}
        onPress={() => om.actions.home.popTo('home')}
      >
        <VStack spacing={2} alignItems="center">
          <Icon
            name={
              om.state.home.breadcrumbStates.length <= 2
                ? 'Home'
                : 'ChevronLeft'
            }
            size={22}
            opacity={0.5}
          />
        </VStack>
      </LinkButton>
      {divider}
      <VStack flex={0.5} />
    </MediaQuery>
  )
})

const HomeSearchBarSeparator = memo(() => {
  return (
    <HStack alignItems="center" justifyContent="center" spacing={3} width={40}>
      <Divider flex opacity={0.1} />
      <Circle
        size={26}
        backgroundColor="##fff"
        borderColor="#eee"
        borderWidth={1}
      >
        <Text style={{ color: '#000', fontSize: 15, fontWeight: '600' }}>
          in
        </Text>
      </Circle>
      <Divider flex opacity={0.1} />
    </HStack>
  )
})

const SearchCancelButton = memo(({ onCancel }: { onCancel?: Function }) => {
  const om = useOvermind()
  return (
    <CloseButton
      opacity={om.state.home.currentStateSearchQuery === '' ? 0 : 1}
      disabled={om.state.home.currentStateSearchQuery === ''}
      onPress={() => {
        om.actions.home.setSearchQuery('')
        onCancel?.()
      }}
    />
  )
})

const SearchLocationButton = memo(() => {
  const om = useOvermind()
  return (
    <ZStack fullscreen pointerEvents="none">
      <HStack flex={1} alignItems="center" justifyContent="center">
        <Spacer flex={1} />
        <VStack
          pointerEvents="auto"
          alignItems="center"
          justifyContent="center"
        >
          <TouchableOpacity
            style={{
              padding: 10,
            }}
            onPress={() => {
              om.actions.home.popTo('home')
            }}
          >
            <Icon size={18} name="Navigation" color="blue" opacity={0.5} />
          </TouchableOpacity>
        </VStack>
      </HStack>
    </ZStack>
  )
})

const HomeSearchBarTags = memo(
  ({ input }: { input: HTMLInputElement | null }) => {
    const om = useOvermind()

    return (
      <>
        {!!om.state.home.searchBarTags.length && (
          <HStack marginLeft={10} marginTop={-1}>
            {om.state.home.searchBarTags.map((tag) => {
              const isActive = om.state.home.searchbarFocusedTag === tag
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  key={getTagId(tag)}
                  onPress={() => {
                    om.actions.home.setSearchBarFocusedTag(tag)
                  }}
                >
                  <TagButton
                    subtleIcon
                    {...(!isActive && {
                      backgroundColor: '#eee',
                      borderColor: '#eee',
                      color: '#444',
                    })}
                    size="lg"
                    fontSize={18}
                    tag={tag}
                    closable
                    onClose={() => {
                      om.actions.home.navigateToTag({ tag })
                      requestIdleCallback(() => {
                        input?.focus()
                      })
                      if (
                        om.state.home.lastActiveTags.filter(
                          (x) => x.type !== 'lense'
                        ).length === 0
                      ) {
                        om.actions.home.popTo('home')
                      }
                    }}
                  />
                </TouchableOpacity>
              )
            })}
          </HStack>
        )}
      </>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    zIndex: 22,
    position: 'absolute',
    marginTop: searchBarTopOffset,
    left: searchBarTopOffset,
    right: searchBarTopOffset,
    alignItems: 'center',
  },
  containerInner: {
    flex: 1,
    maxWidth: pageWidthMax + 30,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,1)',
    height: '100%',
    flexDirection: 'row',
    borderRadius: 14,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowRadius: 10,
    shadowOffset: { height: 4, width: 0 },
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#cfcfcf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    padding: 11,
    paddingHorizontal: 16,
    flex: 1,
    fontSize: 22,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})
