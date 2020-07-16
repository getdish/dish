import { fullyIdle, series } from '@dish/async'
import { query, resolved } from '@dish/graph'
import {
  AbsoluteVStack,
  HStack,
  Hoverable,
  Spacer,
  Text,
  VStack,
  useDebounce,
} from '@dish/ui'
import FlexSearch from 'flexsearch'
import { uniqBy } from 'lodash'
import React, { memo, useEffect, useMemo, useRef } from 'react'
import { Plus } from 'react-feather'
import { ScrollView } from 'react-native'

import {
  pageWidthMax,
  searchBarHeight,
  searchBarTopOffset,
} from '../../constants'
import {
  AutocompleteItem,
  LngLat,
  ShowAutocomplete,
  createAutocomplete,
  defaultLocationAutocompleteResults,
  locationToAutocomplete,
  searchLocations,
} from '../../state/home'
import { omStatic, useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../../views/ui/LinkButton'
import { SmallCircleButton } from './CloseButton'
import { useMediaQueryIsSmall } from './HomeViewDrawer'
import { getAddressText } from './RestaurantAddressLinksRow'

const flexSearch = FlexSearch.create<number>({
  profile: 'speed',
})

let curPagePos = { x: 0, y: 0 }

export const useShowAutocomplete = () => {
  const om = useOvermind()
  const { showAutocomplete } = om.state.home
  const showLocation = showAutocomplete == 'location'
  const showSearch = showAutocomplete == 'search'
  return showSearch || showLocation
}

export default memo(function HomeAutocomplete() {
  useEffect(() => {
    const handleMove = (e) => {
      curPagePos.x = e.pageX
      curPagePos.y = e.pageY
    }
    document.addEventListener('mousemove', handleMove, {
      capture: false,
      passive: true,
    })
    return () => {
      document.removeEventListener('mousemove', handleMove)
    }
  })

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
  const om = useOvermind()
  const { showAutocomplete } = om.state.home
  const isSmall = useMediaQueryIsSmall()
  const showLocation = showAutocomplete == 'location'
  const showSearch = showAutocomplete == 'search'
  const isShowing = showSearch || showLocation
  const hideAutocomplete = useDebounce(
    () => om.actions.home.setShowAutocomplete(false),
    200
  )

  const searchYEnd = searchBarTopOffset + searchBarHeight

  return (
    <AbsoluteVStack
      className="ease-in-out-faster"
      pointerEvents="none"
      position="absolute"
      paddingTop={searchYEnd}
      maxHeight={`calc(100vh - ${searchYEnd}px)`}
      left="2%"
      right="2%"
      alignItems="center"
      justifyContent="center"
      zIndex={-1}
      paddingBottom={30}
      paddingHorizontal={15}
      opacity={isShowing ? 1 : 0}
      transform={isShowing ? [] : [{ translateY: -10 }]}
      disabled={!isShowing}
    >
      <VStack
        width="100%"
        pointerEvents={isShowing ? 'auto' : 'none'}
        maxWidth={pageWidthMax * 0.4}
        // @ts-ignore
        onMouseLeave={() => {
          if (curPagePos.y > searchYEnd) {
            hideAutocomplete()
          }
        }}
        // @ts-ignore
        onMouseEnter={() => {
          hideAutocomplete.cancel()
        }}
      >
        <VStack
          className="ease-in-out-slower"
          position="relative"
          left={isSmall ? 0 : showLocation ? 150 : -200}
          shadowColor="rgba(0,0,0,0.4)"
          shadowRadius={18}
          width="100%"
          backgroundColor="rgba(0,0,0,0.93)"
          padding={5}
          borderRadius={10}
        >
          <ScrollView>
            <AutocompleteResults />
          </ScrollView>
        </VStack>
      </VStack>
    </AbsoluteVStack>
  )
})

const AutocompleteResults = memo(() => {
  const om = useOvermind()
  const {
    showAutocomplete,
    autocompleteIndex,
    autocompleteResults,
    locationAutocompleteResults,
    // currentStateSearchQuery,
  } = om.state.home
  const showLocation = showAutocomplete == 'location'
  const hideAutocomplete = useDebounce(
    () => om.actions.home.setShowAutocomplete(false),
    50
  )
  const lastKey = useRef<any[]>([0, 0, 0, 0])
  const key = showAutocomplete
    ? [
        showAutocomplete,
        autocompleteResults,
        locationAutocompleteResults,
        autocompleteIndex,
      ]
    : lastKey.current

  const resultsElements = useMemo(() => {
    console.log('updating autocomplete', key)
    lastKey.current = key
    const autocompleteResultsActive =
      showAutocomplete === 'location'
        ? locationAutocompleteResults
        : [
            {
              name: 'Search',
              icon: '🔍',
              tagId: '',
              type: 'orphan' as const,
              description: '⏎',
            },
            ...(autocompleteResults ?? []),
          ].slice(0, 13)

    return autocompleteResultsActive.map((result, index) => {
      const plusButtonEl =
        result.type === 'dish' && index !== 0 && om.state.user.isLoggedIn ? (
          <AutocompleteAddButton />
        ) : null

      const isActive = autocompleteIndex === index

      const linkProps = {
        onPressOut: () => {
          hideAutocomplete()
          if (showLocation) {
            om.actions.home.setLocation(result.name)
          } else {
            // SEE BELOW, tag={tag}
            // clear query
            if (result.type === 'ophan') {
              om.actions.home.clearTags()
              om.actions.home.setSearchQuery(currentStateSearchQuery)
            } else if (result.type !== 'restaurant') {
              om.actions.home.setSearchQuery('')
            }
          }
        },
        ...(!showLocation &&
          result?.type !== 'orphan' && {
            tag: result,
          }),
        ...(result.type == 'restaurant' && {
          tag: null,
          name: 'restaurant',
          params: {
            slug: result.slug,
          },
        }),
      }

      return (
        <React.Fragment key={`${result.tagId}${index}`}>
          <LinkButton
            className="no-transition"
            {...linkProps}
            lineHeight={20}
            paddingHorizontal={4}
            paddingVertical={7}
            fontWeight="500"
            borderRadius={5}
            hoverStyle={{
              backgroundColor: 'rgba(255,255,255,0.1)',
            }}
            {...(isActive && {
              backgroundColor: 'rgba(255,255,255,0.2)',
              hoverStyle: {
                backgroundColor: 'rgba(255,255,255,0.2)',
              },
            })}
          >
            <HStack alignItems="center">
              <VStack height={22} width={22} marginRight={10}>
                {result.icon?.indexOf('http') === 0 ? (
                  <img
                    src={result.icon}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 100,
                    }}
                  />
                ) : result.icon ? (
                  <Text fontSize={20}>{result.icon} </Text>
                ) : null}
              </VStack>
              <VStack>
                <Text ellipse color={'#fff'} fontSize={16}>
                  {result.name} {plusButtonEl}
                </Text>
                {!!result.description && (
                  <Text ellipse color="rgba(255,255,255,0.5)" fontSize={12}>
                    {result.description}
                  </Text>
                )}
              </VStack>
            </HStack>
          </LinkButton>
          <Spacer size={1} />
        </React.Fragment>
      )
    })
  }, key)

  return <>{resultsElements}</>
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

  if (searchQuery === '') {
    if (showAutocomplete === 'location') {
      om.actions.home.setLocationAutocompleteResults(null)
    } else if (showAutocomplete === 'search') {
      om.actions.home.setAutocompleteResults(null)
    }
    return
  }

  const state = om.state.home.currentState
  let results: AutocompleteItem[] = []

  return series([
    () => fullyIdle(),
    async () => {
      if (showAutocomplete === 'location') {
        results = [
          ...(await searchLocations(searchQuery)).map(locationToAutocomplete),
          ...defaultLocationAutocompleteResults,
        ]
      }
      if (showAutocomplete === 'search') {
        results = await searchAutocomplete(
          searchQuery,
          state.center!,
          state.span!
        )
      }
    },
    () => fullyIdle(),
    async () => {
      let all: AutocompleteItem[] = []

      if (results.length) {
        flexSearch.clear()
        let foundIndices: number[] = []
        for (const [index, res] of results.entries()) {
          if (!res.name) {
            continue
          }
          // for some reason flexsearch not pulling exact matches to front?
          if (res.name.toLowerCase() === searchQuery) {
            foundIndices.push(index)
            continue
          }
          const searchable = `${res.name} ${res.description ?? ''}`.trim()
          flexSearch.add(index, searchable)
        }
        foundIndices = [
          ...foundIndices,
          ...(await flexSearch.search(searchQuery, 10)),
        ]
        const found = foundIndices.map((index) => results[index])
        all = uniqBy([...found, ...results], (x) => x.id)
      }

      if (showAutocomplete === 'location') {
        om.actions.home.setLocationAutocompleteResults(all)
      } else if (showAutocomplete === 'search') {
        om.actions.home.setAutocompleteResults(all)
      }
    },
  ])
}

function searchAutocomplete(searchQuery: string, center: LngLat, span: LngLat) {
  const iLikeQuery = `%${searchQuery.split(' ').join('%')}%`.replace(
    /%%+/g,
    '%'
  )
  return resolved(() => {
    return [
      ...query
        .restaurant({
          where: {
            location: {
              _st_d_within: {
                // search outside current bounds a bit
                distance: Math.max(span.lng, span.lat) * 3,
                from: {
                  type: 'Point',
                  coordinates: [center.lng, center.lat],
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
            icon: r.image || '📍',
            description:
              getAddressText(
                omStatic.state.home.currentState.currentLocationInfo ?? null,
                r.address ?? '',
                'xs'
              ) || 'No Address',
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
            icon: r.icon ?? '🍽',
            type: 'dish',
            description: r.parent?.name ?? '',
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
            icon: r.icon ?? '🌎',
            description: 'Cuisine',
          })
        ),
    ]
  })
}
