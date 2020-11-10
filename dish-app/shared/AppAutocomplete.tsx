import { order_by, query, resolved } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { Plus } from '@dish/react-feather'
import { useStore } from '@dish/use-store'
import { fullyIdle, series, sleep } from '@o/async'
import { debounce, groupBy, uniqBy } from 'lodash'
import React, { memo, useEffect, useState } from 'react'
import { Image, Keyboard, ScrollView } from 'react-native'
import {
  AbsoluteVStack,
  AnimatedVStack,
  BlurView,
  HStack,
  Spacer,
  Text,
  VStack,
  prevent,
  useDebounce,
} from 'snackui'

import { BottomDrawerStore } from './BottomDrawerStore'
import {
  isNative,
  isWeb,
  searchBarHeight,
  searchBarTopOffset,
} from './constants'
import { fuzzySearch } from './helpers/fuzzySearch'
import { getFuzzyMatchQuery } from './helpers/getFuzzyMatchQuery'
import { getWindowHeight } from './helpers/getWindow'
import {
  locationToAutocomplete,
  searchLocations,
} from './helpers/searchLocations'
import { searchRestaurants } from './helpers/searchRestaurants'
import { useIsNarrow } from './hooks/useIs'
import { createAutocomplete } from './state/createAutocomplete'
import { defaultLocationAutocompleteResults } from './state/defaultLocationAutocompleteResults'
import { AutocompleteItem, LngLat, ShowAutocomplete } from './state/home-types'
import { tagDefaultAutocomplete } from './state/localTags.json'
import { NavigableTag } from './state/NavigableTag'
import { useOvermind } from './state/om'
import { omStatic } from './state/omStatic'
import { tagDisplayName } from './state/tagMeta'
import { CloseButton, SmallCircleButton } from './views/ui/CloseButton'
import { LinkButton } from './views/ui/LinkButton'

let curPagePos = { x: 0, y: 0 }

export default memo(function AppAutocomplete() {
  const [isLoading, setIsLoading] = useState(false)
  const drawerStore = useStore(BottomDrawerStore)

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
        if (omStatic.state.home.showAutocomplete) {
          omStatic.actions.home.setShowAutocomplete(false)
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

    useEffect(() => {
      let cancel: Function | null = null

      const dispose = om.reaction(
        (state) => {
          const query =
            state.home.showAutocomplete === 'location'
              ? state.home.locationSearchQuery
              : state.home.currentStateSearchQuery
          return [query, state.home.lastActiveTags] as const
        },
        ([query, tags]) => {
          cancel?.()
          if (om.state.home.showAutocomplete) {
            onChangeStatus(true)
            cancel = runAutocomplete(
              om.state.home.showAutocomplete,
              query.trim(),
              tags,
              () => {
                onChangeStatus(false)
              }
            )
          }
        }
      )

      return () => {
        dispose()
        cancel?.()
        onChangeStatus(false)
      }
    }, [])

    return null
  }
)

const HomeAutoCompleteContents = memo(
  ({ isLoading }: { isLoading: boolean }) => {
    const om = useOvermind()
    const { showAutocomplete } = om.state.home
    const showLocation = showAutocomplete == 'location'
    const showSearch = showAutocomplete == 'search'
    const isShowing = showSearch || showLocation

    if (!isShowing) {
      return null
    }
    return <AutocompleteContentsInner isLoading={isLoading} />
  }
)

const AutocompleteContentsInner = memo(
  ({ isLoading }: { isLoading: boolean }) => {
    const drawerStore = useStore(BottomDrawerStore)
    const om = useOvermind()
    const { showAutocomplete } = om.state.home
    const isSmall = useIsNarrow()
    const showLocation = showAutocomplete == 'location'
    const hideAutocomplete = useDebounce(
      () => om.actions.home.setShowAutocomplete(false),
      200
    )
    const top =
      searchBarTopOffset +
      searchBarHeight +
      (isSmall ? getWindowHeight() * drawerStore.snapPoints[0] : 0)

    return (
      <AnimatedVStack
        position="absolute"
        className="animate-delay-some"
        pointerEvents="none"
        fullscreen
        height="100%"
        zIndex={10000}
        flex={1}
      >
        <AbsoluteVStack
          backgroundColor={'transparent'}
          width="100%"
          height="100%"
          overflow="hidden"
          alignItems="center"
          pointerEvents="none"
          top={top}
          paddingTop={isSmall ? 0 : 10}
          paddingHorizontal={isSmall ? 0 : 15}
          onPress={() => {
            om.actions.home.setShowAutocomplete(false)
          }}
        >
          <BlurView
            maxWidth="100%"
            width="100%"
            height="100%"
            position="relative"
            pointerEvents="auto"
            {...(!isSmall && {
              maxWidth: 540,
              maxHeight: `calc(100vh - ${top + 20}px)`,
              // @ts-ignore
              onMouseLeave: () => {
                if (curPagePos.y > top) {
                  hideAutocomplete()
                }
              },
              // @ts-ignore
              onMouseEnter: () => {
                hideAutocomplete.cancel()
              },
            })}
          >
            <VStack
              width="100%"
              height="100%"
              maxWidth="100%"
              pointerEvents="auto"
            >
              <VStack
                className="ease-in-out"
                position="relative"
                left={isSmall ? 0 : showLocation ? 250 : -160}
                shadowColor="rgba(0,0,0,0.27)"
                shadowRadius={22}
                width="100%"
                backgroundColor={isWeb ? '#fff' : 'rgba(255,255,255,0.5)'}
                height={isWeb ? 'auto' : '100%'}
                minHeight={200}
                padding={5}
                borderRadius={isSmall ? 0 : 10}
                flex={isSmall ? 1 : 0}
                onPress={() => {
                  om.actions.home.setShowAutocomplete(false)
                }}
              >
                <CloseButton
                  position="absolute"
                  top={-6}
                  right={-6}
                  onPressOut={prevent}
                  zIndex={1000}
                  onPress={(e) => {
                    e.stopPropagation()
                    omStatic.actions.home.setShowAutocomplete(false)
                  }}
                />
                <ScrollView
                  keyboardShouldPersistTaps="always"
                  style={{ opacity: isLoading ? 0.5 : 1 }}
                >
                  <AutocompleteResults />
                </ScrollView>
              </VStack>
            </VStack>
          </BlurView>
        </AbsoluteVStack>
      </AnimatedVStack>
    )
  }
)

const AutocompleteResults = memo(() => {
  const om = useOvermind()
  const drawerStore = useStore(BottomDrawerStore)
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

  if (showAutocomplete === 'search' && !autocompleteResults.length) {
    return <HomeAutocompleteDefault />
  }

  const autocompleteResultsActive =
    showAutocomplete === 'location'
      ? locationAutocompleteResults
      : [
          {
            name: 'Enter to search',
            icon: '🔍',
            tagId: '',
            type: 'orphan' as const,
            description: '',
          },
          ...(autocompleteResults ?? []),
        ].slice(0, 13)

  if (!autocompleteResultsActive.length) {
    return null
  }

  return (
    <>
      {autocompleteResultsActive.map((result, index) => {
        const plusButtonEl =
          result.type === 'dish' && index !== 0 && om.state.user.isLoggedIn ? (
            <AutocompleteAddButton />
          ) : null

        const isActive = autocompleteIndex === index

        return (
          <React.Fragment key={`${result.tagId}${index}`}>
            <LinkButton
              className="no-transition"
              pointerEvents="auto"
              onPressOut={() => {
                hideAutocomplete()
                if (showLocation) {
                  om.actions.home.setLocation(result.name)
                  om.actions.home.setShowAutocomplete(false)

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
              lineHeight={20}
              paddingHorizontal={8}
              paddingVertical={6}
              fontWeight="600"
              borderRadius={5}
              hoverStyle={{
                backgroundColor: 'rgba(0,0,0,0.025)',
              }}
              {...(isActive && {
                backgroundColor: 'rgba(0,0,0,0.05)',
                hoverStyle: {
                  backgroundColor: 'rgba(0,0,0,0.05)',
                },
              })}
            >
              <HStack alignItems="center">
                <VStack height={22} width={22} marginRight={10}>
                  {result.icon?.indexOf('http') === 0 ? (
                    <Image
                      source={{ uri: result.icon }}
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
                  <Text fontWeight="600" ellipse color={'#000'} fontSize={16}>
                    {result.name} {plusButtonEl}
                  </Text>
                  <Spacer size="xs" />
                  {!!result.description && (
                    <Text ellipse color="rgba(0,0,0,0.5)" fontSize={12}>
                      {result.description}
                    </Text>
                  )}
                </VStack>
              </HStack>
            </LinkButton>
            <Spacer size={1} />
          </React.Fragment>
        )
      })}
    </>
  )
})

const HomeAutocompleteDefault = memo(() => {
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
              backgroundColor: 'rgba(0,0,0,0.1)',
            }}
          >
            <LinkButton
              flexDirection="column"
              disallowDisableWhenActive
              tag={tag}
              pointerEvents="auto"
            >
              <VStack>
                <Text textAlign="center" width="100%" fontSize={40}>
                  {tag.icon}
                </Text>
                <Spacer size="sm" />
                <Text
                  ellipse
                  textAlign="center"
                  fontSize={12}
                  width="100%"
                  color="#000"
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
  tags?: NavigableTag[],
  onFinish?: Function
) {
  const om = omStatic
  let results: AutocompleteItem[] = []
  const state = om.state.home.currentState

  // cuisine tag autocomplete
  if (showAutocomplete === 'search') {
    if (tags.length === 2) {
      const countryTag = tags.find((x) => x.type === 'country')
      if (countryTag) {
        const cuisineName = countryTag.name
        if (cuisineName) {
          return series([
            () => fullyIdle({ max: 350, min: 200 }),
            async () => {
              results = await resolved(() => {
                return [
                  ...searchDishTags(searchQuery, cuisineName),
                  ...searchRestaurants(
                    searchQuery,
                    state.center,
                    state.span,
                    cuisineName
                  ),
                ]
              })
            },
            // allow cancel
            () => sleep(30),
            async () => {
              await setAutocompleteResults(
                showAutocomplete,
                searchQuery,
                results
              )
            },
            () => {
              onFinish?.()
            },
          ])
        }
      }
    }
  }

  if (searchQuery === '') {
    if (showAutocomplete === 'location') {
      om.actions.home.setLocationAutocompleteResults(null)
    } else if (showAutocomplete === 'search') {
      // leave last one
      // om.actions.home.setAutocompleteResults([])
    }
    onFinish?.()
    return
  }

  return series([
    () => fullyIdle({ max: 350, min: 200 }),
    async () => {
      if (showAutocomplete === 'location') {
        const locationResults = await searchLocations(searchQuery, state.center)
        results = [
          ...locationResults.map(locationToAutocomplete).filter(isPresent),
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
    // allow cancel
    () => sleep(30),
    async () => {
      await setAutocompleteResults(showAutocomplete, searchQuery, results)
    },
    () => {
      onFinish?.()
    },
  ])
}

async function setAutocompleteResults(
  showAutocomplete: ShowAutocomplete,
  searchQuery: string,
  results: AutocompleteItem[]
) {
  let matched: AutocompleteItem[] = []
  console.log('starts with', results)
  if (results.length) {
    matched = await fuzzySearch({
      items: results,
      query: searchQuery,
      keys: ['name', 'description'],
    })
  }
  matched = uniqBy([...matched, ...results].filter(isPresent), (x) => x.id)
  if (showAutocomplete === 'location') {
    omStatic.actions.home.setLocationAutocompleteResults(matched)
  } else if (showAutocomplete === 'search') {
    // add in a deduped entry
    // if multiple countries have "steak" we show a single "generic steak" entry at top
    const dishes = matched.filter((x) => x.type === 'dish')
    const groupedDishes = groupBy(dishes, (x) => x.name)
    for (const [name, group] of Object.keys(groupedDishes).map(
      (x) => [x, groupedDishes[x]] as const
    )) {
      // more than one cuisine with same dish name, lets make a generic entry
      if (group.length > 1) {
        const firstIndexOfGroup = matched.findIndex((x) => x.name === name)
        matched.splice(
          firstIndexOfGroup,
          0,
          createAutocomplete({
            name,
            type: 'dish',
            icon: group.find((x) => x.icon)?.icon ?? '',
          })
        )
      }
    }

    // countries that match name startsWith go to top
    const sqlower = searchQuery.toLowerCase()
    const partialCountryMatches = matched
      .map((item, index) => {
        return item.type === 'country' &&
          item.name.toLowerCase().startsWith(sqlower)
          ? index
          : -1
      })
      .filter((x) => x > 0)
    for (const index of partialCountryMatches) {
      const countryTag = matched[index]
      matched.splice(index, 1) // remove from cur pos
      matched.splice(0, 0, countryTag) // insert into higher place
    }

    omStatic.actions.home.setAutocompleteResults(matched)
  }
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
            id: r.id,
            name: r.name,
            type: 'country',
            icon: r.icon ?? '🌎',
            description: 'Cuisine',
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
      id: r.id,
      name: r.name,
      icon: r.icon ?? '🍽',
      type: 'dish',
      description: r.parent?.name ?? '',
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
