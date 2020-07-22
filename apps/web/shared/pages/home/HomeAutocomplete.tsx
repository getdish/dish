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
import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import { Plus } from 'react-feather'
import { ScrollView } from 'react-native'

import {
  pageWidthMax,
  searchBarHeight,
  searchBarTopOffset,
} from '../../constants'
import {
  AutocompleteItem,
  GeocodePlace,
  LngLat,
  ShowAutocomplete,
  createAutocomplete,
  defaultLocationAutocompleteResults,
} from '../../state/home'
import { mapView } from '../../state/mapView'
import { omStatic, useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../../views/ui/LinkButton'
import { SmallCircleButton } from './CloseButton'
import { getAddressText } from './RestaurantAddressLinksRow'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

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
  const [isLoading, setIsLoading] = useState(false)

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
      <HomeAutocompleteEffects onChangeStatus={setIsLoading} />
      <HomeAutoCompleteContents isLoading={isLoading} />
    </>
  )
})

const HomeAutocompleteEffects = memo(
  ({ onChangeStatus }: { onChangeStatus: (isLoading: boolean) => void }) => {
    const om = useOvermind()

    const { curPage } = om.state.router
    useEffect(() => {
      om.actions.home.setShowAutocomplete(false)
    }, [curPage])

    const {
      showAutocomplete,
      locationSearchQuery,
      currentStateSearchQuery,
    } = om.state.home
    const query =
      showAutocomplete === 'location'
        ? locationSearchQuery
        : currentStateSearchQuery

    useEffect(() => {
      if (showAutocomplete) {
        onChangeStatus(true)
        const cancel = runAutocomplete(showAutocomplete, query, () => {
          onChangeStatus(false)
        })
        return () => {
          cancel?.()
          onChangeStatus(false)
        }
      }
    }, [query])

    return null
  }
)

const HomeAutoCompleteContents = memo(
  ({ isLoading }: { isLoading: boolean }) => {
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
        left="2%"
        right="2%"
        overflow="hidden"
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
          maxHeight={`calc(100vh - ${searchYEnd + 20}px)`}
          // @ts-ignore
          onMouseLeave={() => {
            console.log('curPagePos.y', curPagePos.y, searchYEnd)
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
            className="ease-in-out"
            position="relative"
            left={isSmall ? 0 : showLocation ? 150 : -150}
            shadowColor="rgba(0,0,0,0.4)"
            shadowRadius={18}
            width="100%"
            flex={1}
            backgroundColor="rgba(0,0,0,0.93)"
            padding={5}
            borderRadius={10}
          >
            <ScrollView style={{ opacity: isLoading ? 0.5 : 1 }}>
              <AutocompleteResults />
            </ScrollView>
          </VStack>
        </VStack>
      </AbsoluteVStack>
    )
  }
)

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
              om.actions.home.setSearchQuery(
                om.state.home.currentStateSearchQuery
              )
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
  searchQuery: string,
  onFinish?: Function
) {
  const om = omStatic

  if (searchQuery === '') {
    console.log('clear')
    if (showAutocomplete === 'location') {
      om.actions.home.setLocationAutocompleteResults(null)
    } else if (showAutocomplete === 'search') {
      // leave last one
      // om.actions.home.setAutocompleteResults([])
    }
    onFinish?.()
    return
  }

  const state = om.state.home.currentState
  let results: AutocompleteItem[] = []

  return series([
    () => fullyIdle({ max: 100, min: 50 }),
    async () => {
      console.log('runAutocomplete', showAutocomplete, searchQuery)
      if (showAutocomplete === 'location') {
        results = [
          ...(await searchLocations(searchQuery))
            .map(locationToAutocomplete)
            .filter(Boolean),
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
      console.log('runAutocomplete.results', results)
    },
    () => fullyIdle({ max: 30 }),
    async () => {
      let matched: AutocompleteItem[] = []

      if (results.length) {
        flexSearch.clear()
        let foundIndices: number[] = []
        for (const [index, res] of results.entries()) {
          if (!res.name) {
            continue
          }
          // for some reason flexsearch not pulling exact matches to front?
          if (res.name.toLowerCase() === searchQuery) {
            foundIndices.unshift(index)
            continue
          }
          const searchable = `${res.name} ${res.description ?? ''}`.trim()
          flexSearch.add(index, searchable)
        }
        foundIndices = [
          ...foundIndices,
          ...(await flexSearch.search(searchQuery, 10)),
        ]
        matched = foundIndices.map((index) => results[index])
      }

      matched = uniqBy([...matched, ...results], (x) => x.name)
      console.log('autocomplete', results, matched)

      if (showAutocomplete === 'location') {
        om.actions.home.setLocationAutocompleteResults(matched)
      } else if (showAutocomplete === 'search') {
        om.actions.home.setAutocompleteResults(matched)
      }
    },
    () => {
      onFinish?.()
    },
  ])
}

const getFuzzyMatchQuery = (searchQuery: string) => {
  return `%${searchQuery.split(' ').join('%')} %`.replace(/%%+/g, '%')
}

function searchAutocomplete(searchQuery: string, center: LngLat, span: LngLat) {
  return resolved(() => {
    return [
      ...searchRestaurants(searchQuery, center, span),
      ...searchDishTags(searchQuery),
      ...query
        .tag({
          where: {
            _or: [
              {
                name: {
                  _ilike: searchQuery,
                },
              },
              {
                name: {
                  _ilike: getFuzzyMatchQuery(searchQuery),
                },
              },
            ],
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

function searchDishTags(searchQuery: string) {
  const search = (whereCondition: any) => {
    return query.tag({
      where: {
        ...whereCondition,
        type: {
          _eq: 'dish',
        },
      },
      limit: 5,
    })
  }
  return [
    ...search({
      name: {
        _ilike: searchQuery,
      },
    }),
    ...search({
      name: {
        _ilike: getFuzzyMatchQuery(searchQuery),
      },
    }),
  ].map((r) =>
    createAutocomplete({
      id: r.id,
      name: r.name,
      icon: r.icon ?? '🍽',
      type: 'dish',
      description: r.parent?.name ?? '',
    })
  )
}

function searchRestaurants(searchQuery: string, center: LngLat, span: LngLat) {
  const search = (whereCondition: any) => {
    return query.restaurant({
      where: {
        ...whereCondition,
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
      },
      limit: 5,
    })
  }

  return [
    ...search({
      name: {
        _ilike: searchQuery,
      },
    }),
    ...search({
      name: {
        _ilike: getFuzzyMatchQuery(searchQuery),
      },
    }),
  ].map((r) =>
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
  )
}

export function searchLocations(query: string) {
  if (!query) {
    return Promise.resolve([])
  }
  const locationSearch = new mapkit.Search({
    region: mapView?.region,

    // includePointsOfInterest: false,
    // includeAddresses: false,
  })
  return new Promise<
    { name: string; formattedAddress: string; coordinate: any }[]
  >((res, rej) => {
    locationSearch.autocomplete(query, (err, data) => {
      console.log('got', data)
      if (err) {
        console.log('network failure')
        return res([])
      }
      res(data.results)
    })
  })
}

const locationToAutocomplete = (place: GeocodePlace) => {
  const name = (place.displayLines?.[0] ?? place.locality).replace(
    ', United States',
    ''
  )
  if (!name || !place.coordinate || name.includes('Airport')) {
    return null
  }
  return createAutocomplete({
    name,
    type: 'country',
    icon: '📍',
    center: {
      lat: place.coordinate.latitude,
      lng: place.coordinate.longitude,
    },
  })
}
