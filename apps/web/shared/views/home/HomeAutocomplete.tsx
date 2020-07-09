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
} from '@dish/ui'
import FlexSearch from 'flexsearch'
import React, { memo, useEffect, useRef } from 'react'
import { Plus } from 'react-feather'
import { ScrollView } from 'react-native'

import { searchBarHeight, searchBarTopOffset } from '../../constants'
import {
  AutocompleteItem,
  LngLat,
  ShowAutocomplete,
  locationToAutocomplete,
  searchLocations,
} from '../../state/home'
import { omStatic, useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../ui/LinkButton'
import { LinkButtonProps } from '../ui/LinkProps'
import { SmallCircleButton } from './CloseButton'
import { setAvoidNextAutocompleteShowOnFocus } from './HomeSearchInput'
import { useMediaQueryIsSmall } from './HomeViewDrawer'

const flexSearch = new FlexSearch('speed')
console.log('FlexSearch', FlexSearch)

export const useShowAutocomplete = () => {
  const om = useOvermind()
  const { showAutocomplete } = om.state.home
  const showLocation = showAutocomplete == 'location'
  const showSearch = showAutocomplete == 'search'
  return showSearch || showLocation
}

export default memo(function HomeAutocomplete() {
  const om = useOvermind()
  const { showAutocomplete, currentStateSearchQuery } = om.state.home

  useEffect(() => runAutocomplete(showAutocomplete, currentStateSearchQuery), [
    showAutocomplete,
    currentStateSearchQuery,
  ])

  return <HomeAutoCompleteContents />
})

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
        for (const res of results) {
          flexSearch.scan(res.id, res)
        }
        const filtered = await flexSearch.search(searchQuery, 10)
        console.log('got', filtered)

        if (showAutocomplete === 'location') {
          om.actions.home.setLocationAutocompleteResults(filtered)
        }
        if (showAutocomplete === 'search') {
          om.actions.home.setAutocompleteResults(filtered)
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
        })
        .map((r) => ({
          id: r.id,
          name: r.name,
        })),
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
        })
        .map((r) => ({
          id: r.id,
          name: r.name,
        })),
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
        })
        .map((r) => ({
          id: r.id,
          name: r.name,
        })),
    ]
  })
}

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

  // hide when moused away, show when moved back!
  useEffect(() => {
    let tmOff
    const handleMove = (e) => {
      const y = e.pageY
      const showAutocomplete = om.state.home.showAutocomplete
      if (showAutocomplete) {
        if (y > 140) {
          tmOff = setTimeout(() => {
            om.actions.home.setShowAutocomplete(false)
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

  const resultsElements = autocompleteResultsActive.map((tag, index) => {
    const restaurantLinkProps: LinkButtonProps | null =
      tag.type == 'restaurant'
        ? {
            tag: null,
            name: 'restaurant',
            params: {
              slug: tag.tagId,
            },
          }
        : null

    const plusButtonEl =
      tag.type === 'dish' && index !== 0 && om.state.user.isLoggedIn ? (
        <AutocompleteAddButton />
      ) : null

    const isActive = autocompleteIndex === index

    const iconElement = (
      <VStack marginVertical={-2}>
        {tag.icon?.indexOf('http') === 0 ? (
          <img
            src={tag.icon}
            style={{
              width: 26,
              height: 26,
              borderRadius: 100,
            }}
          />
        ) : tag.icon ? (
          <Circle size={26} backgroundColor="rgba(150,150,150,0.1)">
            <Text>{tag.icon} </Text>
          </Circle>
        ) : null}
      </VStack>
    )

    return (
      <React.Fragment key={`${tag.tagId}${index}`}>
        <LinkButton
          className="no-transition"
          onPress={() => {
            setAvoidNextAutocompleteShowOnFocus()
            om.actions.home.setShowAutocomplete(false)
            om.actions.home.setAutocompleteIndex(index)

            if (showLocation) {
              om.actions.home.setLocation(tag.name)
            } else {
              console.log('not location should be handled by tag={}')
            }
          }}
          {...(!showLocation && {
            tag,
          })}
          navigateAfterPress
          alignItems="center"
          justifyContent="center"
          lineHeight={24}
          paddingVertical={5}
          paddingHorizontal={10}
          borderRadius={isSmall ? 0 : 100}
          backgroundColor={'transparent'}
          fontSize={14}
          hoverStyle={{
            backgroundColor: 'rgba(100,100,100,0.65)',
          }}
          {...(isActive && {
            backgroundColor: '#fff',
          })}
          {...(isSmall && {
            width: '100%',
          })}
          {...(!isSmall && {
            maxWidth: '17vw',
            textAlign: 'left',
          })}
          {...restaurantLinkProps}
        >
          <HStack>
            {iconElement}
            {!!iconElement && <Spacer size={6} />}
            <Text ellipse color={isActive ? '#000' : '#fff'}>
              {tag.name} {plusButtonEl}
            </Text>
          </HStack>
        </LinkButton>
        <Spacer size={3} />
      </React.Fragment>
    )
  })

  const contentElements = isSmall ? (
    <VStack
      backgroundColor="rgba(0,0,0,0.9)"
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
      backgroundColor="rgba(0,0,0,0.95)"
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
  const tm = useRef(0)
  const tm2 = useRef(0)

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
