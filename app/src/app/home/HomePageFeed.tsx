import { graphql, order_by, query } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { Plus } from '@dish/react-feather'
import React, { memo } from 'react'
import { AbsoluteVStack, Grid, HStack, LoadingItems, VStack, useDebounceEffect } from 'snackui'

import { cardFrameWidth } from '../../constants/constants'
import { tagDefaultAutocomplete, tagLenses } from '../../constants/localTags'
import { getColorsForName } from '../../helpers/getColorsForName'
import { getRestaurantIdentifiers } from '../../helpers/getRestaurantIdentifiers'
import { rgbString } from '../../helpers/rgb'
import { selectTagDishViewSimple } from '../../helpers/selectDishViewSimple'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'
import { Link } from '../views/Link'
import { SlantedTitle } from '../views/SlantedTitle'
import { TagButton } from '../views/TagButton'
import { FeedCard } from './FeedCard'
import { FIBase } from './FIBase'
import { getListPhoto } from './getListPhoto'
import { FICuisine } from './HomeFeedCuisineItem'
import { FIList } from './HomeFeedLists'
import { HomeFeedProps } from './HomeFeedProps'
import { FIHotNew } from './HomeFeedTrendingNew'
import { homePageStore } from './homePageStore'

type FI =
  | FICuisine
  | FIList
  | FIHotNew
  | (FIBase & {
      type: 'space' | 'dish-restaurants' | 'categories'
    })

export const HomePageFeed = memo(
  graphql(
    (props: HomeFeedProps) => {
      const { regionName, item } = props
      const isLoading = !regionName

      // const [hovered, setHovered] = useState<null | MapHoveredRestaurant>(null)
      // useDebounceEffect(
      //   () => {
      //     appMapStore.setHovered(hovered)
      //   },
      //   80,
      //   [hovered]
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

      // const cuisinesQuery = query.tag({
      //   where: {
      //     type: {
      //       _eq: 'country',
      //     },
      //   },
      //   limit: 10,
      // })
      // const cuisines = cuisinesQuery.map(selectTagDishViewSimple)
      // const topCuisines = useTopCuisines(props.item.center || initialLocation.center)

      const tagLists = query.list({
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

      const allRestaurants = [...tagLists, ...lenseLists, ...trendingLists].flatMap((list) => {
        return list.restaurants({ limit: 20 }).map((x) => getRestaurantIdentifiers(x.restaurant))
      })

      useDebounceEffect(
        () => {
          if (!allRestaurants[0]?.id) {
            return
          }
          homePageStore.setResults(allRestaurants)
        },
        100,
        [allRestaurants.map((x) => x.id).join('')]
      )

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
                      // const foundList = lenseLists[i]
                      return (
                        <VStack alignItems="center" flex={1} key={i} marginBottom={20}>
                          <Link
                            // {...(foundList && {
                            //   name: 'list',
                            //   params: {
                            //     slug: foundList?.slug ?? '',
                            //     userSlug: foundList?.user?.username ?? '',
                            //   },
                            // })}
                            // {...(!foundList && {
                            //   tag: lense,
                            // })}
                            tag={lense}
                          >
                            <FeedCard
                              variant="flat"
                              chromeless
                              size="xs"
                              // size={foundList?.name ? 'sm' : 'xs'}
                              square
                              // title={foundList?.name}
                              tags={[lense]}
                              // photo={getListPhoto(foundList)}
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
                <AbsoluteVStack zIndex={10} top={-10} left={10}>
                  <SlantedTitle size="xxs">Trending tags</SlantedTitle>
                </AbsoluteVStack>

                <ContentScrollViewHorizontal>
                  <HStack
                    spacing="xs"
                    paddingVertical={10}
                    marginBottom={20}
                    paddingHorizontal={16}
                  >
                    {/* shuffle([...tagDefaultAutocomplete, ...cuisines]) */}
                    {tagLists.map((list, i) => {
                      const tags = list
                        .tags({ limit: 2 })
                        .map((x) => (x.tag ? selectTagDishViewSimple(x.tag) : null))
                        .filter(isPresent)
                      return (
                        <VStack alignItems="center" flex={1} key={i}>
                          <Link tags={tags}>
                            <FeedCard
                              variant="flat"
                              chromeless
                              square
                              title={
                                <VStack pointerEvents="none">
                                  {tags.map((tag) => (
                                    <TagButton key={tag.id} {...tag} />
                                  ))}
                                </VStack>
                              }
                              photo={restaurants[i]?.image}
                              emphasizeTag
                            />
                          </Link>
                        </VStack>
                      )
                    })}
                    {!tagLists.length &&
                      tagDefaultAutocomplete.map((tag, i) => (
                        <VStack alignItems="center" flex={1} key={i}>
                          <Link tag={tag}>
                            <FeedCard variant="flat" chromeless square tags={[tag]} emphasizeTag />
                          </Link>
                        </VStack>
                      ))}
                  </HStack>
                </ContentScrollViewHorizontal>
              </HStack>

              <VStack paddingHorizontal={16} position="relative">
                <AbsoluteVStack top={-10} left={10}>
                  <SlantedTitle size="xxs">Top Playlists</SlantedTitle>
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
