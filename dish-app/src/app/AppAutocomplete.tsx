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
  Toast,
  VStack,
  prevent,
  useDebounce,
  useDebounceValue,
  useMedia,
  useTheme,
} from 'snackui'

import { drawerWidthMax, isNative, isWeb, searchBarHeight } from '../constants/constants'
import { defaultLocationAutocompleteResults } from '../constants/defaultLocationAutocompleteResults'
import { tagDefaultAutocomplete } from '../constants/localTags'
import { tagDisplayName } from '../constants/tagDisplayName'
import {
  AutocompleteItem,
  AutocompleteItemFull,
  createAutocomplete,
} from '../helpers/createAutocomplete'
import { fuzzySearch } from '../helpers/fuzzySearch'
import { getFuzzyMatchQuery } from '../helpers/getFuzzyMatchQuery'
import { locationToAutocomplete, searchLocations } from '../helpers/searchLocations'
import { searchRestaurants } from '../helpers/searchRestaurants'
import { filterToNavigable } from '../helpers/tagHelpers'
import { useRouterCurPage } from '../router'
import { LngLat } from '../types/homeTypes'
import { appMapStore } from './AppMapStore'
import { drawerStore } from './drawerStore'
import { CircleButton } from './home/restaurant/CircleButton'
import { useHomeStore } from './homeStore'
import { useInputStoreLocation } from './inputStore'
import { setLocation } from './setLocation'
import { CloseButton } from './views/CloseButton'
import { Link } from './views/Link'
import { LinkButton } from './views/LinkButton'

export type ShowAutocomplete = 'search' | 'location' | false

export type AutocompleteTarget = 'search' | 'location'

class AutocompletesStore extends Store {
  visible: 'partial' | true | false = false
  target: AutocompleteTarget = 'search'

  setVisible(n: boolean) {
    this.visible = n
  }

  setTarget(n: AutocompleteTarget, fullyVisible = !!n) {
    this.visible = fullyVisible == false ? 'partial' : true
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
  query = ''
  results: AutocompleteItem[] = []
  isLoading = false

  get activeResult() {
    return this.results[this.index]
  }

  setQuery(next: string) {
    this.query = next
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

export const useAppAutocompleteEffects = () => {
  const autocompletes = useStoreInstance(autocompletesStore)

  useEffect(() => {
    // debounce to go after press event
    const handleHide = debounce(() => {
      if (autocompletes.visible) {
        autocompletes.setVisible(false)
      }
      if (drawerStore.snapIndex === 0) {
        drawerStore.setSnapIndex(1)
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

  const curPage = useRouterCurPage()
  useEffect(() => {
    autocompletes.setVisible(false)
  }, [curPage])
}

// const ThemeTranslucent = (props: { children: any }) => {
//   const theme = useTheme()
//   return (
//     <Theme
//       name={theme.name === 'light' ? 'lightTranslucent' : 'darkTranslucent'}
//     >
//       {props.children}
//     </Theme>
//   )
// }

export const AppAutocompleteSearch = () => {
  const autocompletes = useStoreInstance(autocompletesStore)
  return (
    <Theme name="darkTranslucent">
      <AbsoluteVStack fullscreen opacity={autocompletes.target === 'search' ? 1 : 0}>
        <AutocompleteSearchInner />
      </AbsoluteVStack>
    </Theme>
  )
}

export const AppAutocompleteLocation = () => {
  const autocompletes = useStoreInstance(autocompletesStore)
  return (
    <Theme name="darkTranslucent">
      <AbsoluteVStack fullscreen opacity={autocompletes.target === 'location' ? 1 : 0}>
        <AutocompleteLocationInner />
      </AbsoluteVStack>
    </Theme>
  )
}

const AutocompleteSearchInner = memo(() => {
  const home = useHomeStore()
  const store = useStoreInstance(autocompleteSearchStore)
  const { lastActiveTags } = home
  const searchState = useMemo(() => [store.query.trim(), lastActiveTags] as const, [
    store.query,
    lastActiveTags,
  ])
  const [query, activeTags] = useDebounceValue(searchState, 250)

  useEffect(() => {
    query && store.setIsLoading(true)
  }, [query])

  useEffect(() => {
    if (!query) {
      store.setResults(homeDefaultResults)
      return
    }
    let results: AutocompleteItemFull[] = []
    const postion = appMapStore.position
    const tags = filterToNavigable(activeTags)
    const countryTag = tags.length === 2 ? tags.find((x) => x.type === 'country') : null
    const cuisineName = countryTag?.name

    return series([
      async () => {
        if (cuisineName) {
          results = await resolved(() => {
            return [
              ...searchDishTags(query, cuisineName),
              ...searchRestaurants(query, postion.center, postion.span, cuisineName),
            ]
          })
        } else {
          try {
            results = await searchAutocomplete(query, postion.center, postion.span)
          } catch (err) {
            Toast.error(`Error searching ${err.message}`)
            console.error(err)
          }
        }
      },
      // allow cancel
      () => sleep(1),
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
          return item.type === 'country' && item.name.toLowerCase().startsWith(sqlower) ? index : -1
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
            home.setSearchQuery(query)
          } else if (result.type !== 'restaurant') {
            home.setSearchQuery('')
          }
        }}
      />
    </AutocompleteFrame>
  )
})

const homeDefaultResults = tagDefaultAutocomplete.map((tag) => {
  return createAutocomplete({
    type: 'dish',
    slug: tag.slug,
    icon: tag.icon,
    name: tag.name,
    namePrefix: 'The best',
  })
})

const AutocompleteLocationInner = memo(() => {
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
    const position = appMapStore.position
    return series([
      async () => {
        const locationResults = await searchLocations(query, position.center)
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
    setLocation(result.name)
    autocompletes.setVisible(false)
    // changing location = change drawer to show
    if (drawerStore.snapIndex === 0) {
      drawerStore.setSnapIndex(1)
    }
  }, [])

  return (
    <AutocompleteFrame>
      <AutocompleteResults target="location" onSelect={handleSelect} />
    </AutocompleteFrame>
  )
})

const hideAutocompletes = (e) => {
  e.stopPropagation()
  autocompletesStore.setVisible(false)
}

const AutocompleteFrame = ({ children }: { children: any }) => {
  const autocompletes = useStoreInstance(autocompletesStore)
  const isShowing = autocompletes.visible
  const media = useMedia()
  const theme = useTheme()
  const topOffsetSm = searchBarHeight

  const content = (
    <AbsoluteVStack
      zIndex={100000000}
      opacity={isShowing ? 1 : 0}
      pointerEvents={isShowing ? 'auto' : 'none'}
      fullscreen
      alignItems="flex-end"
      marginTop={5}
      borderRadius={12}
      overflow="hidden"
      top={media.sm ? topOffsetSm : 0}
      onPress={() => autocompletes.setVisible(false)}
    >
      <VStack width="100%" height="100%" maxWidth={drawerWidthMax}>
        <AbsoluteVStack backgroundColor={theme.backgroundColor} fullscreen />
        <AbsoluteVStack
          fullscreen
          backgroundColor="rgba(20,20,20,0.85)"
          display={media.sm ? 'flex' : 'none'}
        />
        <AbsoluteVStack fullscreen display={media.sm ? 'none' : 'flex'}>
          <BlurView
            fallbackBackgroundColor="transparent"
            blurRadius={100}
            blurType="dark"
            position="absolute"
            fullscreen
          />
        </AbsoluteVStack>
        <AbsoluteVStack top={10} right={10}>
          <CloseButton size={20} onPressOut={prevent} zIndex={1000} onPress={hideAutocompletes} />
        </AbsoluteVStack>
        <VStack
          className="ease-in-out"
          position="relative"
          width="100%"
          height="100%"
          overflow="hidden"
          minHeight={200}
          padding={5}
          borderRadius={media.sm ? 0 : 10}
          flex={media.sm ? 1 : 0}
          onPress={() => {
            autocompletes.setVisible(false)
          }}
        >
          <ScrollView style={{ maxHeight: '100%' }} keyboardShouldPersistTaps="always">
            {children}

            {/* pad bottom to scroll */}
            <VStack height={100} />
          </ScrollView>
        </VStack>
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

const AutocompleteResults = ({
  target,
  prefixResults = [],
  onSelect,
}: {
  target: AutocompleteTarget
  prefixResults?: any[]
  onSelect: AutocompleteSelectCb
  emptyResults?: AutocompleteItem[]
}) => {
  const autocompleteStore = useStore(AutocompleteStore, { target })
  const activeIndex = autocompleteStore.index
  const ogResults = autocompleteStore.results
  const results = [...prefixResults, ...ogResults]
  return (
    <VStack paddingVertical={10}>
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
                isActive={isActive}
              />
            </Theme>
            <Spacer size={1} />
          </React.Fragment>
        )
      })}
    </VStack>
  )
}

export const AutocompleteItemView = memo(
  ({
    target,
    onSelect,
    result,
    showAddButton,
    onAdd,
    hideBackground,
    preventNavigate,
    isActive,
    index,
  }: {
    result: AutocompleteItem
    index: number
    target: ShowAutocomplete
    preventNavigate?: boolean
    showAddButton?: boolean
    onSelect: AutocompleteSelectCb
    hideBackground?: boolean
    onAdd?: () => any
    isActive?: boolean
  }) => {
    const showLocation = target === 'location'
    const theme = useTheme()
    const hideAutocompleteSlow = useDebounce(() => autocompletesStore.setVisible(false), 50)
    const plusButtonEl = showAddButton ? (
      <>
        <VStack flex={1} />
        <VStack padding={8} flexShrink={0}>
          <CircleButton onPressOut={onAdd}>
            <Plus size={16} />
          </CircleButton>
        </VStack>
      </>
    ) : null

    const icon =
      result.icon?.indexOf('http') === 0 ? (
        <Image
          source={{ uri: result.icon }}
          style={{
            width: 32,
            height: 32,
            borderRadius: 100,
          }}
        />
      ) : result.icon ? (
        <Text fontSize={32}>{result.icon} </Text>
      ) : null

    return (
      <LinkButton
        width="100%"
        justifyContent={target === 'location' ? 'flex-end' : 'flex-start'}
        minHeight={58}
        backgroundColor={isActive ? theme.backgroundColor : 'transparent'}
        hoverStyle={{
          backgroundColor: theme.backgroundColor,
        }}
        onPressOut={() => {
          hideAutocompleteSlow()
          onSelect(result, index)
        }}
        preventNavigate={preventNavigate}
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
        <HStack width="100%">
          <VStack flex={1}>
            <HStack flex={1} alignItems="center">
              {icon}
              {!!icon && <Spacer size="lg" />}
              <Text
                textAlign={showLocation ? 'right' : 'center'}
                fontWeight="700"
                ellipse
                color={theme.color}
                fontSize={24}
                lineHeight={24}
              >
                {!!result.namePrefix && (
                  <>
                    <Text fontWeight="300">{result.namePrefix}</Text>{' '}
                  </>
                )}
                {result.name}
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
          {plusButtonEl}
        </HStack>
      </LinkButton>
    )
  }
)

const HomeAutocompleteDefault = memo(() => {
  const media = useMedia()
  const theme = useTheme()
  return (
    <VStack
      width="100%"
      flexWrap="wrap"
      alignItems="center"
      justifyContent="center"
      maxWidth={700}
      alignSelf="center"
    >
      {tagDefaultAutocomplete.map((tag) => {
        return (
          <VStack
            width={110}
            height={110}
            borderRadius={12}
            paddingHorizontal={5}
            margin={5}
            key={tag.name}
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            hoverStyle={{
              backgroundColor: theme.backgroundColorTertiary,
            }}
          >
            <Link disallowDisableWhenActive tag={tag}>
              <VStack>
                <Text textAlign="center" width="100%" fontSize={media.sm ? 42 : 58}>
                  {tag.icon}
                </Text>
                <Spacer size="sm" />
                <Text
                  ellipse
                  textAlign="center"
                  fontSize={15}
                  width="100%"
                  fontWeight="400"
                  color={theme.color}
                >
                  {tagDisplayName(tag)}
                </Text>
              </VStack>
            </Link>
          </VStack>
        )
      })}
    </VStack>
  )
})

async function filterAutocompletes(query: string, results: AutocompleteItemFull[]) {
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
            name: r.name || '',
            type: 'country',
            icon: r.icon || '🌎',
            description: 'Cuisine',
            slug: r.slug || '',
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
      name: r.name ?? '',
      icon: r.icon ?? '🍽',
      type: 'dish',
      description: r.parent?.name ?? '',
      slug: r.slug ?? '',
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
    order_by: [{ popularity: order_by.desc }],
    limit,
  })
}
