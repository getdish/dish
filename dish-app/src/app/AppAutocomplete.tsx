import { series, sleep } from '@dish/async'
import { order_by, query, resolved } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { Plus } from '@dish/react-feather'
import { Store, createStore, useStore, useStoreInstance } from '@dish/use-store'
import { clamp, debounce, groupBy, uniqBy } from 'lodash'
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { Image, Keyboard, ScrollView } from 'react-native'
import {
  AbsoluteVStack,
  AnimatedVStack,
  BlurView,
  HStack,
  Spacer,
  Text,
  Theme,
  VStack,
  prevent,
  useDebounce,
  useDebounceValue,
  useMedia,
  useTheme,
} from 'snackui'

import { bgLight } from '../constants/colors'
import { isNative, isWeb, searchBarHeight } from '../constants/constants'
import { defaultLocationAutocompleteResults } from '../constants/defaultLocationAutocompleteResults'
import { tagDefaultAutocomplete } from '../constants/localTags'
import { tagDisplayName } from '../constants/tagMeta'
import {
  AutocompleteItem,
  AutocompleteItemFull,
  createAutocomplete,
} from '../helpers/createAutocomplete'
import { fuzzySearch } from '../helpers/fuzzySearch'
import { getFuzzyMatchQuery } from '../helpers/getFuzzyMatchQuery'
import {
  locationToAutocomplete,
  searchLocations,
} from '../helpers/searchLocations'
import { searchRestaurants } from '../helpers/searchRestaurants'
import { tagsToNavigableTags } from '../helpers/tagHelpers'
import { useRouterCurPage } from '../router'
import { LngLat } from '../types/homeTypes'
import { appMapStore } from './AppMapStore'
import { drawerStore } from './drawerStore'
import { useHomeStore } from './homeStore'
import { useInputStoreLocation } from './inputStore'
import { useUserStore } from './userStore'
import { CloseButton, SmallCircleButton } from './views/CloseButton'
import { LinkButton } from './views/LinkButton'
import { PaneControlButtons } from './views/PaneControlButtons'

let curPagePos = { x: 0, y: 0 }

export type ShowAutocomplete = 'search' | 'location' | false

type AutocompleteTarget = 'search' | 'location'

class AutocompletesStore extends Store {
  visible = false
  target: AutocompleteTarget = 'search'

  setVisible(n: boolean) {
    this.visible = n
  }

  setTarget(n: AutocompleteTarget) {
    this.visible = true
    this.target = n
  }

  get active() {
    if (!this.visible) return null
    if (this.target === 'location') return autocompleteLocationStore
    return autocompleteSearchStore
  }
}

export const autocompletesStore = createStore(AutocompletesStore)

export class AutocompleteStore extends Store<{ target: AutocompleteTarget }> {
  index = 0
  results: AutocompleteItem[] = []
  isLoading = false

  get activeResult() {
    return this.results[this.index]
  }

  setIsLoading(n: boolean) {
    this.isLoading = n
  }

  setResults(results: AutocompleteItem[]) {
    this.index = 0
    this.results = results ?? []
  }

  move(val: -1 | 1) {
    this.setIndex(this.index + val)
  }

  setIndex(val: number) {
    this.index = clamp(val, 0, this.results.length)
  }
}

export const autocompleteLocationStore = createStore(AutocompleteStore, {
  target: 'location',
})

export const autocompleteSearchStore = createStore(AutocompleteStore, {
  target: 'search',
})

export default memo(function AppAutocomplete() {
  const autocompletes = useStoreInstance(autocompletesStore)
  const theme = useTheme()

  if (isWeb) {
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
    }, [])
  }

  if (isNative) {
    useEffect(() => {
      // debounce to go after press event
      const handleHide = debounce(() => {
        console.log('handleHideKeyboard')
        if (autocompletes.visible) {
          autocompletes.setVisible(false)
        }
        if (drawerStore.snapIndex === 0) {
          drawerStore.setSnapPoint(1)
        }
      }, 100)
      const handleShow = () => {
        console.log('handleShowKeyboard')
        handleHide.cancel()
      }
      Keyboard.addListener('keyboardDidHide', handleHide)
      Keyboard.addListener('keyboardWillShow', handleShow)
      return () => {
        Keyboard.removeListener('keyboardDidHide', handleHide)
        Keyboard.removeListener('keyboardWillShow', handleShow)
      }
    }, [])
  }

  const curPage = useRouterCurPage()
  useEffect(() => {
    autocompletes.setVisible(false)
  }, [curPage])

  return (
    <Theme
      name={theme.name === 'light' ? 'lightTranslucent' : 'darkTranslucent'}
    >
      <AbsoluteVStack
        fullscreen
        opacity={autocompletes.target === 'search' ? 1 : 0}
      >
        <AutocompleteSearch />
      </AbsoluteVStack>
      <AbsoluteVStack
        fullscreen
        opacity={autocompletes.target === 'location' ? 1 : 0}
      >
        <AutocompleteLocation />
      </AbsoluteVStack>
    </Theme>
  )
})

const AutocompleteSearch = memo(() => {
  const home = useHomeStore()
  const store = useStoreInstance(autocompleteSearchStore)
  const { currentSearchQuery, lastActiveTags } = home
  const searchState = useMemo(
    () => [currentSearchQuery.trim(), lastActiveTags] as const,
    [currentSearchQuery, lastActiveTags]
  )
  const [query, activeTags] = useDebounceValue(searchState, 250)

  useEffect(() => {
    query && store.setIsLoading(true)
  }, [query])

  useEffect(() => {
    let results: AutocompleteItemFull[] = []
    const state = home.currentState
    const tags = tagsToNavigableTags(activeTags)
    const countryTag =
      tags.length === 2 ? tags.find((x) => x.type === 'country') : null
    const cuisineName = countryTag?.name

    return series([
      async () => {
        if (cuisineName) {
          results = await resolved(() => {
            return [
              ...searchDishTags(query, cuisineName),
              ...searchRestaurants(
                query,
                state.center,
                state.span,
                cuisineName
              ),
            ]
          })
        } else {
          results = await searchAutocomplete(query, state.center!, state.span!)
        }
      },
      // allow cancel
      () => sleep(30),
      async () => {
        results = await filterAutocompletes(query, results)
      },
      setResults,
      () => {
        store.setIsLoading(false)
      },
    ])

    function setResults() {
      // add in a deduped entry
      // if multiple countries have "steak" we show a single "generic steak" entry at top
      const dishes = results.filter((x) => x.type === 'dish')
      const groupedDishes = groupBy(dishes, (x) => x.name)
      for (const [name, group] of Object.keys(groupedDishes).map(
        (x) => [x, groupedDishes[x]] as const
      )) {
        // more than one cuisine with same dish name, lets make a generic entry
        if (group.length > 1) {
          const firstIndexOfGroup = results.findIndex((x) => x.name === name)
          results.splice(
            firstIndexOfGroup,
            0,
            createAutocomplete({
              name,
              type: 'dish',
              icon: group.find((x) => x.icon)?.icon ?? '',
              slug: group[0]?.['slug'] ?? '',
            })
          )
        }
      }

      // countries that match name startsWith go to top
      const sqlower = query.toLowerCase()
      const partialCountryMatches = results
        .map((item, index) => {
          return item.type === 'country' &&
            item.name.toLowerCase().startsWith(sqlower)
            ? index
            : -1
        })
        .filter((x) => x > 0)
      for (const index of partialCountryMatches) {
        const countryTag = results[index]
        results.splice(index, 1) // remove from cur pos
        results.splice(0, 0, countryTag) // insert into higher place
      }

      store.setResults(results)
    }
  }, [query])

  return (
    <AutocompleteFrame>
      <AutocompleteResults
        target="search"
        emptyContent={<HomeAutocompleteDefault />}
        prefixResults={[
          {
            name: 'Enter to search',
            icon: '🔍',
            tagId: '',
            type: 'orphan' as const,
            description: '',
          },
        ]}
        onSelect={(result) => {
          // clear query
          if (result.type === 'orphan') {
            home.clearTags()
            home.setSearchQuery(home.currentSearchQuery)
          } else if (result.type !== 'restaurant') {
            home.setSearchQuery('')
          }
        }}
      />
    </AutocompleteFrame>
  )
})

const AutocompleteLocation = memo(() => {
  const home = useHomeStore()
  const autocompletes = useStoreInstance(autocompletesStore)
  const store = useStoreInstance(autocompleteLocationStore)
  const inputStore = useInputStoreLocation()
  const query = useDebounceValue(inputStore.value, 250)

  useEffect(() => {
    query && store.setIsLoading(true)
  }, [query])

  useEffect(() => {
    store.setResults(defaultLocationAutocompleteResults)
  }, [])

  useEffect(() => {
    if (!query) return

    let results: AutocompleteItemFull[] = []
    const state = home.currentState

    return series([
      async () => {
        const locationResults = await searchLocations(query, state.center)
        results = [
          ...locationResults.map(locationToAutocomplete).filter(isPresent),
          ...defaultLocationAutocompleteResults,
        ]
      },
      // allow cancel
      () => sleep(30),
      async () => {
        results = await filterAutocompletes(query, results)
      },
      () => {
        store.setResults(results)
      },
      () => {
        store.setIsLoading(false)
      },
    ])
  }, [query])

  const handleSelect = useCallback((result: AutocompleteItem) => {
    appMapStore.setLocation(result.name)
    autocompletes.setVisible(false)
    // changing location = change drawer to show
    if (drawerStore.snapIndex === 0) {
      drawerStore.setSnapPoint(1)
    }
  }, [])

  return (
    <AutocompleteFrame>
      <AutocompleteResults target="location" onSelect={handleSelect} />
    </AutocompleteFrame>
  )
})

const AutocompleteFrame = ({ children }: { children: any }) => {
  const autocompletes = useStoreInstance(autocompletesStore)
  const isShowing = autocompletes.visible
  const media = useMedia()
  const theme = useTheme()

  const content = (
    <AbsoluteVStack
      zIndex={100000000}
      opacity={isShowing ? 1 : 0}
      pointerEvents={isShowing ? 'auto' : 'none'}
      fullscreen
      alignItems="center"
      top={media.sm ? searchBarHeight : 10}
      onPress={() => autocompletes.setVisible(false)}
    >
      <AbsoluteVStack backgroundColor={theme.backgroundColor} fullscreen />
      <BlurView
        fallbackBackgroundColor="transparent"
        blurRadius={20}
        blurType="light"
        position="absolute"
        fullscreen
      />
      <PaneControlButtons>
        <CloseButton
          size={20}
          onPressOut={prevent}
          zIndex={1000}
          onPress={(e) => {
            e.stopPropagation()
            autocompletes.setVisible(false)
          }}
        />
      </PaneControlButtons>
      <VStack
        className="ease-in-out"
        position="relative"
        width="100%"
        height="100%"
        minHeight={200}
        padding={5}
        borderRadius={media.sm ? 0 : 10}
        flex={media.sm ? 1 : 0}
        onPress={() => {
          autocompletes.setVisible(false)
        }}
      >
        <ScrollView keyboardShouldPersistTaps="always">{children}</ScrollView>
      </VStack>
    </AbsoluteVStack>
  )

  if (!isWeb) {
    return (
      <AnimatedVStack
        position="absolute"
        pointerEvents="none"
        fullscreen
        height="100%"
        zIndex={100000000}
        flex={1}
      >
        {content}
      </AnimatedVStack>
    )
  }

  return content
}

type AutocompleteSelectCb = (result: AutocompleteItem, index: number) => void

const AutocompleteResults = memo(
  ({
    target,
    emptyContent = null,
    prefixResults = [],
    onSelect,
  }: {
    target: AutocompleteTarget
    prefixResults?: any[]
    emptyContent?: any
    onSelect: AutocompleteSelectCb
  }) => {
    const media = useMedia()
    const autocompleteStore = useStore(AutocompleteStore, { target })
    const activeIndex = autocompleteStore.index
    const results = [...prefixResults, ...autocompleteStore.results]
    return (
      <VStack paddingTop={media.sm ? 30 : 0}>
        {!results.length && emptyContent}
        {results.map((result, index) => {
          const isActive = activeIndex === index
          return (
            <React.Fragment key={`${result.id}${index}`}>
              <Theme name={isActive ? 'active' : null}>
                <AutocompleteItemView
                  target={target}
                  index={index}
                  result={result}
                  onSelect={onSelect}
                />
              </Theme>
              <Spacer size={1} />
            </React.Fragment>
          )
        })}
      </VStack>
    )
  }
)

const AutocompleteItemView = memo(
  ({
    target,
    onSelect,
    result,
    index,
  }: {
    result: AutocompleteItem
    index: number
    target: ShowAutocomplete
    onSelect: AutocompleteSelectCb
  }) => {
    const userStore = useUserStore()
    const showLocation = target === 'location'
    const theme = useTheme()
    const hideAutocompleteSlow = useDebounce(
      () => autocompletesStore.setVisible(false),
      50
    )
    const plusButtonEl =
      result.type === 'dish' && index !== 0 && userStore.isLoggedIn ? (
        <AutocompleteAddButton />
      ) : null

    const icon =
      result.icon?.indexOf('http') === 0 ? (
        <Image
          source={{ uri: result.icon }}
          style={{
            width: 26,
            height: 26,
            borderRadius: 100,
          }}
        />
      ) : result.icon ? (
        <Text fontSize={22}>{result.icon} </Text>
      ) : null

    return (
      <LinkButton
        width="100%"
        justifyContent={target === 'location' ? 'flex-end' : 'flex-start'}
        onPressOut={() => {
          hideAutocompleteSlow()
          onSelect(result, index)
        }}
        {...(!showLocation &&
          result?.type !== 'orphan' && {
            tag: result,
          })}
        {...(result.type == 'restaurant' && {
          tag: null,
          name: 'restaurant',
          params: {
            slug: result.slug,
          },
        })}
      >
        <VStack width="100%">
          <HStack>
            {icon}
            {!!icon && <Spacer size="lg" />}
            <Text
              textAlign={showLocation ? 'right' : 'center'}
              fontWeight="600"
              ellipse
              color={theme.color}
              fontSize={22}
              lineHeight={25}
            >
              {result.name} {plusButtonEl}
            </Text>
          </HStack>
          {!!result.description && (
            <>
              <Spacer size="xs" />
              <Text ellipse color={theme.colorSecondary} fontSize={15}>
                {result.description}
              </Text>
            </>
          )}
        </VStack>
      </LinkButton>
    )
  }
)

const HomeAutocompleteDefault = memo(() => {
  const theme = useTheme()
  return (
    <HStack
      width="100%"
      flexWrap="wrap"
      alignItems="center"
      justifyContent="center"
    >
      {tagDefaultAutocomplete.map((tag) => {
        return (
          <VStack
            width={120}
            height={120}
            borderRadius={12}
            paddingHorizontal={5}
            margin={5}
            key={tag.name}
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            hoverStyle={{
              backgroundColor: bgLight,
            }}
          >
            <LinkButton
              flexDirection="column"
              disallowDisableWhenActive
              tag={tag}
            >
              <VStack>
                <Text textAlign="center" width="100%" fontSize={56}>
                  {tag.icon}
                </Text>
                <Spacer size="md" />
                <Text
                  ellipse
                  textAlign="center"
                  fontSize={14}
                  width="100%"
                  fontWeight="300"
                  color={theme.color}
                >
                  {tagDisplayName(tag)}
                </Text>
              </VStack>
            </LinkButton>
          </VStack>
        )
      })}
    </HStack>
  )
})

function AutocompleteAddButton() {
  const home = useHomeStore()
  if (home.currentStateType !== 'userSearch') {
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

async function filterAutocompletes(
  query: string,
  results: AutocompleteItemFull[]
) {
  let matched: AutocompleteItemFull[] = []
  if (results.length) {
    matched = await fuzzySearch({
      items: results,
      query,
      keys: ['name', 'description'],
    })
  }
  return uniqBy([...matched, ...results].filter(isPresent), (x) => x.id)
}

function searchAutocomplete(searchQuery: string, center: LngLat, span: LngLat) {
  return resolved(() => {
    return [
      ...searchDishTags(searchQuery),
      ...searchRestaurants(searchQuery, center, span),
      ...searchCuisines(searchQuery),
    ]
  })
}

function searchCuisines(searchQuery: string) {
  return query
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
    .map((r) => {
      return 'autocomplete' in r
        ? r
        : createAutocomplete({
            name: r.name,
            type: 'country',
            icon: r.icon ?? '🌎',
            description: 'Cuisine',
            slug: r.slug ?? '',
          })
    })
}

function searchDishTags(searchQuery: string, cuisine?: string) {
  return [
    ...searchDishes(
      {
        ...(searchQuery && {
          name: {
            _ilike: `${searchQuery}%`,
          },
        }),
        ...(cuisine && {
          parent: {
            name: {
              _eq: cuisine,
            },
          },
        }),
      },
      searchQuery
        ? null
        : {
            order_by: [
              {
                popularity: order_by.desc,
              },
            ],
          }
    ),
    ...(searchQuery
      ? searchDishes({
          name: {
            _ilike: getFuzzyMatchQuery(searchQuery),
          },
          ...(cuisine && {
            parent: {
              name: {
                _eq: cuisine,
              },
            },
          }),
        })
      : []),
  ].map((r) =>
    createAutocomplete({
      name: r.name,
      icon: r.icon ?? '🍽',
      type: 'dish',
      description: r.parent?.name ?? '',
      slug: r.slug,
    })
  )
}

const searchDishes = (whereCondition: any, extraQuery: any = {}, limit = 5) => {
  return query.tag({
    ...extraQuery,
    where: {
      ...whereCondition,
      type: {
        _eq: 'dish',
      },
    },
    limit,
  })
}
