import { fullyIdle } from '@dish/async'
import {
  Circle,
  Divider,
  HStack,
  Hoverable,
  MediaQuery,
  Spacer,
  Text,
  VStack,
  ZStack,
  mediaQueries,
  useOnMount,
} from '@dish/ui'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, Loader, MapPin, Navigation, Search } from 'react-feather'
import { StyleSheet, TextInput } from 'react-native'

import {
  isWorker,
  pageWidthMax,
  searchBarHeight,
  searchBarTopOffset,
} from '../../constants'
import { getTagId } from '../../state/Tag'
import { useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../ui/LinkButton'
import { CloseButton } from './CloseButton'
import { DishLogoButton } from './DishLogoButton'
import HomeAutocomplete from './HomeAutocomplete'
import { HomeAutocompleteBackground } from './HomeAutocompleteBackground'
import { HomeUserMenu } from './HomeUserMenu'
import { useMediaQueryIsSmall } from './HomeViewDrawer'
import { TagButton } from './TagButton'

const divider = <Divider vertical flexLine={1} marginHorizontal={4} />
let avoidNextShowautocompleteOnFocus = true
export function setAvoidNextAutocompleteShowOnFocus() {
  avoidNextShowautocompleteOnFocus = true
}

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
  if (window.getSelection()?.empty) {
    // Chrome
    window.getSelection()?.empty()
  } else if (window.getSelection()?.removeAllRanges) {
    // Firefox
    window.getSelection()?.removeAllRanges()
  }
}

export const getInputNode = (instance: any): HTMLInputElement | null => {
  return instance?.['_node'] ?? null
}

export default memo(function HomeSearchBar() {
  const [showLocation, setShowLocation] = useState(false)
  const isSmall = useMediaQueryIsSmall()
  const om = useOvermind()
  const inputRef = useRef<any>()
  const locationInputRef = useRef<any>()

  // use local for a little better perf
  const [search, setSearch] = useState('')
  const [locationSearch, setLocationSearch] = useState('')

  useOnMount(() => {
    setSearch(om.state.home.currentStateSearchQuery)

    setTimeout(() => {
      const input = getInputNode(inputRef.current)
      input?.focus()
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
    om.actions.home.clearSearch()
  }, [input])

  useEffect(() => {
    if (!input) return
    const isFocused = document.activeElement === input
    if (isFocused) return // ONE way sync
    if (showAutocomplete !== isFocused) {
      console.log('showAutocomplete', showAutocomplete)
      const target = showAutocomplete == 'location' ? locationInput : input
      if (!isWorker) {
        if (showAutocomplete) {
          target?.focus()
        } else {
          target?.blur()
        }
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
            if (autocompleteIndex < 0) {
              if (om.state.home.searchbarFocusedTag) {
                om.actions.home.navigateToTag({
                  tags: [om.state.home.searchbarFocusedTag],
                })
              }
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

  const locationSearchElement = (
    <VStack
      position="relative"
      flex={65}
      minWidth={180}
      borderColor="#eee"
      borderWidth={1}
      borderRadius={100}
    >
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
  )

  const searchElement = (
    <>
      <Hoverable
        // show even if moving after some time
        // onHoverIn={() => {
        //   tm2.current = setTimeout(() => {
        //     if (document.activeElement == input) {
        //       om.actions.home.setShowAutocomplete('search')
        //     }
        //   }, 300)
        // }}
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
        <HStack alignItems="center" flex={1} overflow="hidden">
          <HomeSearchBarTags input={input} />
          <TextInput
            ref={inputRef}
            // leave uncontrolled for perf?
            value={search}
            onFocus={() => {
              onFocusAnyInput()
              clearTimeout(tmInputBlur.current)
              if (avoidNextShowautocompleteOnFocus) {
                avoidNextShowautocompleteOnFocus = false
              } else {
                om.actions.home.setShowAutocomplete('search')
                if (search.length > 0) {
                  selectActiveInput()
                }
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
              styles.textInput,
              { flex: 1, fontSize: 19, paddingRight: 0 },
            ]}
          />
        </HStack>
      </Hoverable>
      <SearchCancelButton onCancel={handleCancel} />
    </>
  )

  const borderRadius = 54

  return (
    <VStack
      zIndex={2000}
      position="absolute"
      marginTop={searchBarTopOffset}
      left={16}
      right={16}
      alignItems="center"
      height={searchBarHeight}
    >
      <HomeAutocompleteBackground />
      <VStack
        maxWidth={pageWidthMax - 90}
        zIndex={12}
        position="relative"
        width="100%"
        height="100%"
        borderRadius={borderRadius}
        shadowColor="rgba(0,0,0,0.07)"
        shadowOffset={{ height: 5, width: 0 }}
        shadowRadius={60}
      >
        <VStack
          position="relative"
          zIndex={100}
          flex={1}
          backgroundColor="#fff"
          paddingHorizontal={8}
          flexDirection="row"
          borderRadius={borderRadius}
          shadowColor="rgba(0,0,0,0.065)"
          shadowRadius={3}
          shadowOffset={{ height: 3, width: 0 }}
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
        >
          <DishLogoButton />

          <MediaQuery query={mediaQueries.md} style={{ display: 'none' }}>
            <HomeSearchBarHomeButton />
          </MediaQuery>

          <HStack
            flex={145}
            maxWidth={550}
            alignItems="center"
            spacing
            overflow="hidden"
          >
            {/* Loading / Search Icon */}
            <MediaQuery query={mediaQueries.sm} style={{ display: 'none' }}>
              {om.state.home.isLoading ? (
                <VStack className="rotating" opacity={0.5}>
                  <Loader size={18} />
                </VStack>
              ) : (
                <Search size={18} opacity={0.5} />
              )}
            </MediaQuery>

            {/* Search Input Start */}
            {isSmall && (
              <>
                {/* keep both in dom so we have access to ref */}
                <VStack display={showLocation ? 'contents' : 'none'}>
                  {locationSearchElement}
                </VStack>
                <VStack display={!showLocation ? 'contents' : 'none'}>
                  {searchElement}
                </VStack>
              </>
            )}
            {!isSmall && <>{searchElement}</>}
            <Spacer size={1} />
          </HStack>

          {!isSmall && (
            <>
              {locationSearchElement}
              {divider}
              <MediaQuery query={mediaQueries.md} style={{ display: 'none' }}>
                <VStack flex={1} />
              </MediaQuery>
            </>
          )}

          {isSmall && (
            <LinkButton onPress={() => setShowLocation((x) => !x)} padding={15}>
              <MapPin size={22} opacity={0.5} />
            </LinkButton>
          )}

          <HomeUserMenu />
        </VStack>
        <HomeAutocomplete />
      </VStack>
    </VStack>
  )
})

const HomeSearchBarHomeButton = memo(() => {
  const om = useOvermind()
  return (
    <MediaQuery query={mediaQueries.md} style={{ display: 'none' }}>
      <LinkButton
        justifyContent="center"
        alignItems="center"
        pointerEvents="auto"
        paddingHorizontal={4}
        marginRight={20}
        opacity={om.state.home.currentStateType === 'home' ? 0 : 1}
        onPress={() => om.actions.home.popTo(-1)}
        pressStyle={{
          opacity: 0.6,
        }}
      >
        <ChevronLeft size={22} opacity={0.6} style={{ marginTop: 4 }} />
      </LinkButton>
    </MediaQuery>
  )
})

const HomeSearchBarSeparator = memo(() => {
  return (
    <HStack alignItems="center" justifyContent="center" spacing={3} width={40}>
      <Circle size={26} backgroundColor="#fff">
        <Text color="#000" fontSize={15} fontWeight="600">
          in
        </Text>
      </Circle>
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
        om.actions.home.clearSearch()
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
          padding={10}
          opacity={0.5}
          pressStyle={{
            opacity: 0.4,
          }}
          onPressOut={() => {
            om.actions.home.popTo('home')
          }}
        >
          <Navigation size={18} color="blue" />
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

const styles = StyleSheet.create({
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
