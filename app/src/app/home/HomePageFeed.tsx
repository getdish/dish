import { RestaurantOnlyIds, graphql, order_by, query } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { Plus } from '@dish/react-feather'
import { shuffle } from 'lodash'
import React, { memo, useState } from 'react'
import { AbsoluteVStack, Grid, HStack, LoadingItems, VStack } from 'snackui'

import { cardFrameWidth } from '../../constants/constants'
import { tagDefaultAutocomplete, tagLenses } from '../../constants/localTags'
import { getColorsForName } from '../../helpers/getColorsForName'
import { rgbString } from '../../helpers/rgb'
import { selectTagDishViewSimple } from '../../helpers/selectDishViewSimple'
import { homeStore } from '../homeStore'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'
import { Link } from '../views/Link'
import { SlantedTitle } from '../views/SlantedTitle'
import { FeedCard } from './FeedCard'
import { FIBase } from './FIBase'
import { FICuisine } from './HomeFeedCuisineItem'
import { FIList } from './HomeFeedLists'
import { HomeFeedProps } from './HomeFeedProps'
import { FIHotNew } from './HomeFeedTrendingNew'

type FI =
  | FICuisine
  | FIList
  | FIHotNew
  | (FIBase & {
      type: 'space' | 'dish-restaurants' | 'categories'
    })

export const HomePageFeed = memo(
  graphql(
    function HomePageFeed(props: HomeFeedProps) {
      const { regionName, item } = props

      const isLoading = !regionName
      const [hovered, setHovered] = useState<null | string>(null)
      const [hoveredResults, setHoveredResults] = useState<null | {
        via: FI['type']
        results: RestaurantOnlyIds[]
      }>(null)

      // useDebounceEffect(
      //   () => {
      //     const results = items.flatMap((x) => {
      //       if (hovered && hovered !== x.id) {
      //         return []
      //       }
      //       if (hoveredResults?.via === x.type) {
      //         return hoveredResults?.results
      //       }
      //       return []
      //     })
      //     // set results
      //     homePageStore.setResults(results)
      //   },
      //   150,
      //   [items, hoveredResults]
      // )

      const restaurants = query
        .restaurant({
          order_by: [{ upvotes: order_by.desc }],
          where: {
            image: {
              _is_null: false,
            },
          },
          limit: 10,
        })
        .map((r) => ({ image: r.image, name: r.name }))

      const cuisinesQuery = query.tag({
        where: {
          type: {
            _eq: 'country',
          },
        },
        limit: 10,
      })

      // const topCuisines = useTopCuisines(props.item.center || initialLocation.center)
      const cuisineLists = query.list({
        where: {
          region: {
            _eq: item.region,
          },
          tags: {
            tag: {
              type: {
                _in: ['country', 'dish'],
              },
            },
          },
        },
        order_by: [{ updated_at: order_by.asc }],
        limit: 12,
      })

      console.log(
        'what is',
        cuisineLists.map((x) => x.name)
        // topCuisines
      )

      const cuisines = cuisinesQuery.map(selectTagDishViewSimple)

      const trendingLists = query.list({
        where: {
          region: {
            _eq: item.region,
          },
        },
        order_by: [{ updated_at: order_by.asc }],
        limit: 16,
      })

      const lenseLists = query.list({
        where: {
          tags: {
            tag: {
              slug: {
                _in: tagLenses.map((x) => x.slug),
              },
            },
          },
          region: {
            _eq: item.region,
          },
        },
        order_by: [{ updated_at: order_by.asc }],
        limit: 8,
      })

      return (
        <>
          {isLoading && (
            <AbsoluteVStack pointerEvents="none" zIndex={100} fullscreen>
              <LoadingItems />
            </AbsoluteVStack>
          )}

          {!isLoading && (
            <VStack>
              <HStack position="relative">
                <ContentScrollViewHorizontal>
                  <HStack spacing="xs" paddingHorizontal={16}>
                    {tagLenses.map((lense, i) => {
                      const foundList = lenseLists[i]
                      return (
                        <VStack alignItems="center" flex={1} key={i} marginBottom={20}>
                          <Link
                            name="list"
                            params={{
                              slug: foundList?.slug ?? '',
                              region: item.region,
                              userSlug: foundList?.user?.username ?? '',
                            }}
                          >
                            <FeedCard
                              variant="flat"
                              chromeless
                              square
                              title={foundList?.name}
                              tags={[lense]}
                              photo={
                                foundList?.restaurants({
                                  where: {
                                    restaurant: {
                                      image: {
                                        _is_null: false,
                                      },
                                    },
                                  },
                                  order_by: [{ position: order_by.asc }],
                                  limit: 1,
                                })[0]?.restaurant?.image
                              }
                              backgroundColor={rgbString(lense.rgb, 0.2)}
                              emphasizeTag
                            />
                          </Link>
                        </VStack>
                      )
                    })}
                  </HStack>
                </ContentScrollViewHorizontal>
              </HStack>

              <HStack position="relative">
                <AbsoluteVStack top={-10} left={10}>
                  <SlantedTitle size="xs">Tags</SlantedTitle>
                </AbsoluteVStack>

                <ContentScrollViewHorizontal>
                  <HStack
                    spacing="xs"
                    paddingVertical={10}
                    marginBottom={20}
                    paddingHorizontal={16}
                  >
                    {shuffle([...tagDefaultAutocomplete, ...cuisines]).map((lense, i) => (
                      <VStack alignItems="center" flex={1} key={i}>
                        <FeedCard
                          variant="flat"
                          chromeless
                          square
                          title={
                            i % 2 === 0 ? (
                              <>San&nbsp;Francisco gems.</>
                            ) : (
                              <>Best places in SF for drinks.</>
                            )
                          }
                          tags={[{ rgb: [200, 100, 200], ...lense }]}
                          photo={restaurants[i]?.image}
                          emphasizeTag
                        />
                      </VStack>
                    ))}
                  </HStack>
                </ContentScrollViewHorizontal>
              </HStack>

              <VStack paddingHorizontal={16} position="relative">
                <AbsoluteVStack top={-10} left={10}>
                  <SlantedTitle size="xs">Top Lists</SlantedTitle>
                </AbsoluteVStack>
                <Grid itemMinWidth={cardFrameWidth}>
                  {trendingLists.map((list, i) => {
                    // getListColor(list?.color) ?? '#999'
                    const color = getColorsForName(list?.name || '').altPastelColor
                    return (
                      <VStack alignItems="center" flex={1} key={i} marginBottom={26}>
                        <Link
                          name="list"
                          params={{
                            region: list?.region || '',
                            slug: list?.slug || '',
                            userSlug: list?.user?.username || '',
                          }}
                        >
                          <FeedCard
                            chromeless
                            author={` by ${list?.user?.username}`}
                            size="lg"
                            backgroundColor={`${color}25`}
                            variant="flat"
                            title={list?.name}
                            tags={
                              list
                                ?.tags({ limit: 2 })
                                .map((x) => (x.tag ? selectTagDishViewSimple(x.tag) : null))
                                .filter(isPresent) ?? []
                            }
                            photo={restaurants[i]?.image}
                          />
                        </Link>
                      </VStack>
                    )
                  })}
                  {trendingLists.length < 8 &&
                    [...new Array(8 - trendingLists.length)].map((_, index) => (
                      <VStack alignItems="center" flex={1} key={index + 100} marginBottom={20}>
                        <Link
                          name="list"
                          params={{
                            userSlug: 'me',
                            slug: 'create',
                            region: homeStore.lastRegionSlug,
                          }}
                        >
                          <FeedCard chromeless size="lg" variant="flat">
                            <Plus color="#eeeeee" />
                          </FeedCard>
                        </Link>
                      </VStack>
                    ))}
                </Grid>
              </VStack>
            </VStack>
          )}
        </>
      )
    },
    {
      suspense: false,
    }
  )
)
