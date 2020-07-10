import { fullyIdle, series } from '@dish/async'
import { query, resolved } from '@dish/graph'
import {
  AbsoluteVStack,
  Circle,
  HStack,
  Hoverable,
  Spacer,
  Text,
  VStack,
  useDebounce,
} from '@dish/ui'
import FlexSearch from 'flexsearch'
import { uniqBy } from 'lodash'
import React, { memo, useEffect, useRef } from 'react'
import { Plus } from 'react-feather'
import { ScrollView } from 'react-native'

import { searchBarHeight, searchBarTopOffset } from '../../constants'
import {
  AutocompleteItem,
  LngLat,
  ShowAutocomplete,
  createAutocomplete,
  locationToAutocomplete,
  searchLocations,
} from '../../state/home'
import { omStatic, useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../../views/ui/LinkButton'
import { LinkButtonProps } from '../../views/ui/LinkProps'
import { SmallCircleButton } from './CloseButton'
import { useMediaQueryIsSmall } from './HomeViewDrawer'

const flexSearch = FlexSearch.create<number>({
  profile: 'speed',
})

export const useShowAutocomplete = () => {
  const om = useOvermind()
  const { showAutocomplete } = om.state.home
  const showLocation = showAutocomplete == 'location'
  const showSearch = showAutocomplete == 'search'
  return showSearch || showLocation
}

export default memo(function HomeAutocomplete() {
  return (
    <>
      <HomeAutocompleteEffects />
      <HomeAutoCompleteContents />
    </>
  )
})

const HomeAutocompleteEffects = memo(() => {
  const om = useOvermind()
  const { showAutocomplete, currentStateSearchQuery } = om.state.home

  useEffect(() => runAutocomplete(showAutocomplete, currentStateSearchQuery), [
    showAutocomplete,
    currentStateSearchQuery,
  ])

  return null
})

const HomeAutoCompleteContents = memo(() => {
  const isSmall = useMediaQueryIsSmall()
  const om = useOvermind()
  const {
    showAutocomplete,
    autocompleteIndex,
    autocompleteResultsActive,
  } = om.state.home
  const showLocation = showAutocomplete == 'location'
  const showSearch = showAutocomplete == 'search'
  const isShowing = showSearch || showLocation
  const hideAutocomplete = useDebounce(
    () => om.actions.home.setShowAutocomplete(false),
    400
  )

  // hide when moused away, show when moved back!
  useEffect(() => {
    let tmOff
    const handleMove = (e) => {
      const y = e.pageY
      const showAutocomplete = om.state.home.showAutocomplete
      if (showAutocomplete) {
        if (y > 140) {
          tmOff = setTimeout(() => {
            // if > 0 dont autohide
            if (om.state.home.autocompleteIndex >= 0) {
              om.actions.home.setShowAutocomplete(false)
            }
          }, 80)
        }
      } else {
        if (y < 140) {
          clearTimeout(tmOff)
        }
      }
    }
    window.addEventListener('mousemove', handleMove)
    return () => {
      window.removeEventListener('mousemove', handleMove)
    }
  }, [isShowing])

  const resultsElements = autocompleteResultsActive.map((result, index) => {
    const plusButtonEl =
      result.type === 'dish' && index !== 0 && om.state.user.isLoggedIn ? (
        <AutocompleteAddButton />
      ) : null

    const isActive = autocompleteIndex === index

    const iconElement = (
      <>
        {!!result.icon && (
          <VStack marginVertical={-2}>
            {result.icon?.indexOf('http') === 0 ? (
              <img
                src={result.icon}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 100,
                }}
              />
            ) : result.icon ? (
              <Circle size={26} backgroundColor="rgba(150,150,150,0.1)">
                <Text>{result.icon} </Text>
              </Circle>
            ) : null}
          </VStack>
        )}
      </>
    )

    const spacerElement = !!(result.icon && result.name) && <Spacer size={6} />

    return (
      <React.Fragment key={`${result.tagId}${index}`}>
        <LinkButton
          className="no-transition"
          onPress={() => {
            hideAutocomplete()
            om.actions.home.setAutocompleteIndex(index)

            if (showLocation) {
              om.actions.home.setLocation(result.name)
            } else {
              // SEE BELOW, tag={tag}
              // clear query
              console.warn('CLEAR SEARCH', result)
              om.actions.home.setSearchQuery('')
            }
          }}
          {...(!showLocation && {
            tag: result,
          })}
          {...(result.type == 'restaurant' && {
            tag: null,
            name: 'restaurant',
            params: {
              slug: result.slug,
            },
          })}
          navigateAfterPress
          alignItems="center"
          justifyContent="center"
          lineHeight={24}
          height={38}
          paddingHorizontal={3}
          fontSize={15}
          fontWeight="500"
          {...(isSmall && {
            width: '100%',
          })}
          {...(!isSmall && {
            maxWidth: '17vw',
            textAlign: 'left',
          })}
          borderBottomWidth={4}
          borderTopWidth={4}
          borderTopColor="transparent"
          borderBottomColor="transparent"
          hoverStyle={{
            borderBottomColor: 'rgba(100,100,100,0.65)',
          }}
          {...(isActive && {
            borderBottomColor: '#fff',
            hoverStyle: {
              borderBottomColor: '#fff',
            },
          })}
        >
          {iconElement}
          {spacerElement}
          <Text ellipse color={'#fff'}>
            {result.name} {plusButtonEl}
          </Text>
        </LinkButton>
        <Spacer size={10} />
      </React.Fragment>
    )
  })

  const contentElements = isSmall ? (
    <VStack
      borderRadius={isSmall ? 0 : 100}
      shadowColor="rgba(0,0,0,0.28)"
      shadowRadius={18}
      maxHeight="70vh"
      width="100%"
    >
      <ScrollView>
        <VStack paddingVertical={10}>{resultsElements}</VStack>
      </ScrollView>
    </VStack>
  ) : (
    <HStack
      backgroundColor="rgba(0,0,0,0.9)"
      borderRadius={100}
      height={49}
      paddingBottom={1} // looks better 1px up
      shadowColor="rgba(0,0,0,0.28)"
      shadowRadius={18}
      overflow="hidden"
      shadowOffset={{ width: 0, height: 3 }}
      position="relative"
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack
          height="100%"
          paddingLeft={100}
          flex={1}
          alignItems="center"
          paddingHorizontal={10}
        >
          {resultsElements}
        </HStack>
      </ScrollView>
    </HStack>
  )

  return (
    <AbsoluteVStack
      className="ease-in-out-faster"
      position="absolute"
      top={searchBarTopOffset + searchBarHeight}
      left="2%"
      right="2%"
      zIndex={3000}
      paddingBottom={30}
      paddingHorizontal={15}
      opacity={isShowing ? 1 : 0}
      transform={isShowing ? [] : [{ translateY: -10 }]}
      disabled={!isShowing}
    >
      {contentElements}
    </AbsoluteVStack>
  )
})

export const HomeAutocompleteHoverableInput = ({
  children,
  input,
  autocompleteTarget,
}: {
  children: any
  input?: HTMLInputElement | null
  autocompleteTarget: 'search' | 'location'
}) => {
  const om = useOvermind()
  const tm = useRef(null)
  const tm2 = useRef(null)

  return (
    <Hoverable
      onHoverOut={() => {
        clearTimeout(tm.current)
        clearTimeout(tm2.current)
      }}
      onHoverMove={() => {
        clearTimeout(tm.current)
        if (om.state.home.currentState.searchQuery) {
          tm.current = setTimeout(() => {
            if (document.activeElement == input) {
              om.actions.home.setShowAutocomplete(autocompleteTarget)
            }
          }, 150)
        }
      }}
    >
      {children}
    </Hoverable>
  )
}

function AutocompleteAddButton() {
  const om = useOvermind()
  if (om.state.home.currentStateType !== 'userSearch') {
    return null
  }
  return (
    <SmallCircleButton
      onPressOut={(e) => {
        console.log('e', e)
        alert('add to current search results')
      }}
    >
      <Plus size={12} />
    </SmallCircleButton>
  )
}

function runAutocomplete(
  showAutocomplete: ShowAutocomplete,
  searchQuery: string
) {
  const om = omStatic
  const state = om.state.home.currentState

  let results: AutocompleteItem[] = []

  return series([
    () => fullyIdle(),
    async () => {
      if (showAutocomplete === 'location') {
        results = (await searchLocations(searchQuery)).map(
          locationToAutocomplete
        )
      }
      if (showAutocomplete === 'search') {
        results = await searchAutocomplete(searchQuery, state.center)
      }
    },
    () => fullyIdle(),
    async () => {
      if (results.length) {
        flexSearch.clear()
        for (const [index, res] of results.entries()) {
          flexSearch.add(index, res.name)
        }
        const foundIndices = await flexSearch.search(searchQuery, 10)
        const found = foundIndices.map((index) => results[index])
        const all = uniqBy([...found, ...results], (x) => x.id)
        if (showAutocomplete === 'location') {
          om.actions.home.setLocationAutocompleteResults(all)
        }
        if (showAutocomplete === 'search') {
          om.actions.home.setAutocompleteResults(all)
        }
      }
    },
  ])
}

function searchAutocomplete(searchQuery: string, center: LngLat) {
  const iLikeQuery = `%${searchQuery.split(' ').join('%')}%`
  return resolved(() => {
    return [
      ...query
        .restaurant({
          where: {
            location: {
              _st_d_within: {
                distance: 0.015,
                from: {
                  type: 'Point',
                  coordinates: [center.lat, center.lng],
                },
              },
            },
            name: {
              _ilike: iLikeQuery,
            },
          },
          limit: 5,
        })
        .map((r) =>
          createAutocomplete({
            id: r.id,
            name: r.name,
            slug: r.slug,
            type: 'restaurant',
          })
        ),
      ...query
        .tag({
          where: {
            name: {
              _ilike: iLikeQuery,
            },
            type: {
              _eq: 'dish',
            },
          },
          limit: 5,
        })
        .map((r) =>
          createAutocomplete({
            id: r.id,
            name: r.name,
            icon: r.icon,
            type: 'dish',
          })
        ),
      ...query
        .tag({
          where: {
            name: {
              _ilike: iLikeQuery,
            },
            type: {
              _eq: 'country',
            },
          },
          limit: 3,
        })
        .map((r) =>
          createAutocomplete({
            id: r.id,
            name: r.name,
            type: 'country',
            icon: r.icon,
          })
        ),
    ]
  })
}
