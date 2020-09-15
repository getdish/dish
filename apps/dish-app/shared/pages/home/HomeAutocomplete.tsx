import { fullyIdle, series } from '@dish/async'
import { query, resolved } from '@dish/graph'
import { Plus } from '@dish/react-feather'
import {
  AbsoluteVStack,
  HStack,
  Spacer,
  Text,
  VStack,
  useDebounce,
} from '@dish/ui'
import { useStore } from '@dish/use-store'
import FlexSearch from 'flexsearch'
import { uniqBy } from 'lodash'
import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView } from 'react-native'

import {
  isWeb,
  pageWidthMax,
  searchBarHeight,
  searchBarTopOffset,
} from '../../constants'
import { getWindowHeight } from '../../helpers/getWindow'
import { createAutocomplete } from '../../state/createAutocomplete'
import { defaultLocationAutocompleteResults } from '../../state/defaultLocationAutocompleteResults'
import {
  AutocompleteItem,
  LngLat,
  ShowAutocomplete,
} from '../../state/home-types'
import { NavigableTag } from '../../state/NavigableTag'
import { omStatic, useOvermind } from '../../state/om'
import { tagDisplayName } from '../../state/tagDisplayName'
import { LinkButton } from '../../views/ui/LinkButton'
import { BottomDrawerStore } from './BottomDrawerStore'
import { SmallCircleButton } from './CloseButton'
import { getFuzzyMatchQuery } from './getFuzzyMatchQuery'
import { SearchBarStore } from './HomeSearchBar'
import { locationToAutocomplete, searchLocations } from './searchLocations'
import { searchRestaurants } from './searchRestaurants'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

const flexSearch = FlexSearch.create<number>({
  profile: 'speed',
})

let curPagePos = { x: 0, y: 0 }

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

export const useShowAutocomplete = () => {
  const om = useOvermind()
  const { showAutocomplete } = om.state.home
  const showLocation = showAutocomplete == 'location'
  const showSearch = showAutocomplete == 'search'
  return showSearch || showLocation
}

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
    const drawerStore = useStore(BottomDrawerStore)
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
    const top =
      searchBarTopOffset +
      searchBarHeight +
      (isSmall ? getWindowHeight() * drawerStore.snapPoints[0] : 0)

    return (
      <AbsoluteVStack
        className={`ease-in-out-fast ${
          isSmall && isShowing ? 'transition-delay-long' : ''
        }`}
        pointerEvents={isSmall && isShowing ? 'auto' : 'none'}
        backgroundColor={
          isSmall && isShowing ? 'rgba(0,0,0,0.1)' : 'transparent'
        }
        position="absolute"
        fullscreen
        top={top}
        paddingTop={10}
        overflow="hidden"
        alignItems="center"
        zIndex={10000}
        paddingBottom={30}
        paddingHorizontal={15}
        opacity={isShowing ? 1 : 0}
        transform={isShowing ? [] : [{ translateY: 5 }]}
        disabled={!isShowing}
        onPress={() => {
          om.actions.home.setShowAutocomplete(false)
        }}
      >
        <VStack
          width="100%"
          pointerEvents={isShowing ? 'auto' : 'none'}
          maxWidth={pageWidthMax * 0.45}
          maxHeight={isWeb ? `calc(100vh - ${top + 20}px)` : '90%'}
          // @ts-ignore
          onMouseLeave={() => {
            if (isSmall) {
              return
            }
            if (curPagePos.y > top) {
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
            backgroundColor="rgba(0,0,0,0.9)"
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
  const drawerStore = useStore(BottomDrawerStore)
  const searchBarStore = useStore(SearchBarStore)
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
              name: 'Enter to search',
              icon: '🔍',
              tagId: '',
              type: 'orphan' as const,
              // description: '⏎',
            },
            ...(autocompleteResults ?? []),
          ].slice(0, 13)

    if (!autocompleteResultsActive.length) {
      return null
    }

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

            // go back to showing search by default
            searchBarStore.setShowLocation(false)

            // changing location = change drawer to show
            if (om.state.home.drawerSnapPoint === 0) {
              drawerStore.setSnapPoint(1)
            }
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
            paddingHorizontal={8}
            paddingVertical={6}
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

  if (showAutocomplete !== 'location' && !autocompleteResults.length) {
    return <HomeAutocompleteDefault />
  }

  return <>{resultsElements}</>
})

const defaultAutocompleteTags: NavigableTag[] = [
  { name: 'Noodle Soup', type: 'dish', icon: '🍜' },
  { name: 'Taco', type: 'dish', icon: '🌮' },
  { name: 'BBQ', type: 'dish', icon: '🥩' },
  { name: 'Bowl', type: 'dish', icon: '🍲' },
  { name: 'Dim Sum', type: 'dish', icon: '🥟' },
  { name: 'Spicy', type: 'dish', icon: '🌶' },
  { name: 'price-low', displayName: 'Cheap', type: 'filter', icon: '🍕' },
  { name: 'Seafood', type: 'dish', icon: '🐟' },
  { name: 'Sandwich', type: 'dish', icon: '🥪' },
  { name: 'Salad', type: 'dish', icon: '🥗' },
  { name: 'Breakfast', type: 'dish', icon: '🥞' },
  { name: 'Curry', type: 'dish', icon: '🍛' },
  { name: 'Burger', type: 'dish', icon: '🍔' },
  { name: 'Drinks', type: 'dish', icon: '🥂' },
  { name: 'Sweets', type: 'dish', icon: '🍪' },
]

const HomeAutocompleteDefault = memo(() => {
  return (
    <HStack
      width="100%"
      flexWrap="wrap"
      alignItems="center"
      justifyContent="center"
    >
      {defaultAutocompleteTags.map((tag) => {
        return (
          <VStack
            width={80}
            height={80}
            borderRadius={10}
            paddingHorizontal={5}
            margin={5}
            key={tag.name}
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            hoverStyle={{
              backgroundColor: 'rgba(255,255,255,0.3)',
            }}
          >
            <LinkButton
              flexDirection="column"
              disallowDisableWhenActive
              tag={tag}
            >
              <Text textAlign="center" width="100%" fontSize={40}>
                {tag.icon}
              </Text>
              <Spacer size="sm" />
              <Text
                ellipse
                textAlign="center"
                fontSize={12}
                width="100%"
                color="#fff"
              >
                {tagDisplayName(tag)}
              </Text>
            </LinkButton>
          </VStack>
        )
      })}
    </HStack>
  )
})

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
      if (showAutocomplete === 'location') {
        const locationResults = await searchLocations(searchQuery, state.center)
        results = [
          ...locationResults.map(locationToAutocomplete).filter(Boolean),
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
