import { RestaurantSearchItem, graphql, order_by, query, search } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { Plus } from '@dish/react-feather'
import React, { memo, useEffect, useState } from 'react'
import { AbsoluteVStack, Grid, HStack, Spacer, VStack, useDebounceEffect } from 'snackui'

import { cardFrameWidthLg } from '../../constants/constants'
import { tagLenses } from '../../constants/localTags'
import { getRestaurantIdentifiers } from '../../helpers/getRestaurantIdentifiers'
import { rgbString } from '../../helpers/rgb'
import { selectTagDishViewSimple } from '../../helpers/selectDishViewSimple'
import { homeStore } from '../homeStore'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'
import { Link } from '../views/Link'
import { ListCardFrame } from '../views/list/ListCard'
import { SlantedTitle } from '../views/SlantedTitle'
import { FeedCard } from './FeedCard'
import { getListPhoto } from './getListPhoto'
import { homePageStore } from './homePageStore'
import { getListColor } from './list/listColors'

export const HomePageFeed = memo(
  graphql(
    ({ region }: { region: string }) => {
      // const [hovered, setHovered] = useState<null | MapHoveredRestaurant>(null)
      // useDebounceEffect(
      //   () => {
      //     appMapStore.setHovered(hovered)
      //   },
      //   80,
      //   [hovered]
      // )

      // const restaurants = query
      //   .restaurant({
      //     order_by: [{ upvotes: order_by.desc }],
      //     where: {
      //       image: {
      //         _is_null: false,
      //       },
      //     },
      //     limit: 10,
      //   })
      //   ?.map((r) => ({ image: r.image, name: r.name }))

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
            _eq: region,
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

      const trendingLists = query.list_populated({
        args: {
          min_items: 2,
        },
        where: {
          region: {
            _eq: region,
          },
        },
        order_by: [{ updated_at: order_by.asc }],
        limit: 16,
      })

      const [lenseRestaurants, setLenseRestaurants] = useState<RestaurantSearchItem[]>([])

      // console.warn('TODO link to hover lense button etc', lenseRestaurants)

      useDebounceEffect(
        () => {
          const { currentState } = homeStore
          search({
            center: currentState.center!,
            span: currentState.span!,
            query: '',
            limit: 20,
            main_tag: 'lenses__gems',
          }).then((res) => {
            console.warn('res', res)
            setLenseRestaurants(res.restaurants || [])
          })
        },
        100,
        []
      )

      const lenseLists = []
      // query.list({
      //   where: {
      //     tags: {
      //       tag: {
      //         slug: {
      //           _in: tagLenses.map((x) => x.slug),
      //         },
      //       },
      //     },
      //     region: {
      //       _eq: item.region,
      //     },
      //   },
      //   order_by: [{ updated_at: order_by.asc }],
      //   limit: 8,
      // })

      const allRestaurants = [
        ...lenseRestaurants.map((x) => getRestaurantIdentifiers(x)),
        ...[...tagLists, ...lenseLists, ...trendingLists].flatMap((list) => {
          return list.restaurants({ limit: 20 }).map((x) => getRestaurantIdentifiers(x.restaurant))
        }),
      ]

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

      const numAddButtons = Math.max(1, 10 - trendingLists.length)

      return (
        <>
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
                          flat
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

                {tagLists.map((list, i) => {
                  const tags = list
                    .tags({ limit: 2 })
                    .map((x) => (x.tag ? selectTagDishViewSimple(x.tag) : null))
                    .filter(isPresent)
                  return (
                    <VStack alignItems="center" flex={1} key={i}>
                      <Link tags={tags}>
                        <FeedCard
                          flat
                          chromeless
                          square
                          size="xs"
                          title={list.name}
                          tags={tags}
                          // photo={restaurants[i]?.image}
                          emphasizeTag
                        />
                      </Link>
                    </VStack>
                  )
                })}
              </HStack>
            </ContentScrollViewHorizontal>
          </HStack>

          <Spacer />

          {/* <HStack position="relative">
                <AbsoluteVStack zIndex={10} top={-10} left={10}>
                  <SlantedTitle size="xxs">Topics</SlantedTitle>
                </AbsoluteVStack>

                <ContentScrollViewHorizontal>
                  <HStack
                    spacing="xs"
                    paddingVertical={10}
                    marginBottom={20}
                    paddingHorizontal={16}
                  >
                    {tagLists.map((list, i) => {
                      const tags = list
                        .tags({ limit: 2 })
                        .map((x) => (x.tag ? selectTagDishViewSimple(x.tag) : null))
                        .filter(isPresent)
                      return (
                        <VStack alignItems="center" flex={1} key={i}>
                          <Link tags={tags}>
                            <FeedCard
                              flat
                              chromeless
                              square
                              size="sm"
                              title={list.name}
                              tags={tags}
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
                            <FeedCard flat chromeless square tags={[tag]} emphasizeTag />
                          </Link>
                        </VStack>
                      ))}
                  </HStack>
                </ContentScrollViewHorizontal>
              </HStack> */}

          <VStack paddingHorizontal={10} position="relative">
            <AbsoluteVStack zIndex={100} top={-15} left={10}>
              <SlantedTitle size="xs">Playlists</SlantedTitle>
            </AbsoluteVStack>

            <Grid itemMinWidth={cardFrameWidthLg}>
              {trendingLists.map((list, i) => {
                // getListColor(list?.color) ?? '#999'
                const color = getListColor(list?.color) ?? '#999999'
                const numItems = list.restaurants_aggregate().aggregate?.count() ?? 0
                return (
                  <HStack alignItems="center" flexShrink={0} key={i} marginBottom={10}>
                    <Spacer size="xs" />
                    <ListCardFrame
                      chromeless
                      hoverEffect="background"
                      flexible
                      author={` by ${list?.user?.username ?? ''}`}
                      numItems={numItems}
                      size="lg"
                      backgroundColor={`${color}25`}
                      flat
                      title={list?.name ?? ''}
                      userSlug={list.user?.username ?? ''}
                      slug={list?.slug ?? ''}
                      tags={
                        list
                          ?.tags({ limit: 2 })
                          ?.map((x) => (x.tag ? selectTagDishViewSimple(x.tag) : null))
                          .filter(isPresent) ?? []
                      }
                      photo={getListPhoto(list)}
                    />
                    <Spacer size="xs" />
                  </HStack>
                )
              })}

              {[...new Array(numAddButtons)].map((_, index) =>
                index > 6 ? null : (
                  <HStack
                    paddingHorizontal={2}
                    alignItems="center"
                    flex={1}
                    key={index}
                    marginBottom={10}
                  >
                    <Link
                      promptLogin
                      name="list"
                      params={{
                        userSlug: 'me',
                        slug: 'create',
                      }}
                    >
                      <FeedCard flexible chromeless size="lg" flat>
                        <Plus color="#eeeeee" />
                      </FeedCard>
                    </Link>
                  </HStack>
                )
              )}
            </Grid>
          </VStack>
        </>
      )
    },
    {
      suspense: false,
    }
  )
)
