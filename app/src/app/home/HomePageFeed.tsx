import { RestaurantOnlyIds, graphql, order_by, query, resolved, useRefetch } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { Plus } from '@dish/react-feather'
import React, { memo, useCallback, useMemo, useState } from 'react'
import {
  AbsoluteVStack,
  Grid,
  HStack,
  Spacer,
  VStack,
  useDebounce,
  useDebounceEffect,
} from 'snackui'

import { cardFrameWidthLg } from '../../constants/constants'
import { tagLenses } from '../../constants/localTags'
import { getRestaurantIdentifiers } from '../../helpers/getRestaurantIdentifiers'
import { rgbString } from '../../helpers/rgb'
import { selectTagDishViewSimple } from '../../helpers/selectDishViewSimple'
import { UseSetAppMapProps, useSetAppMap } from '../AppMap'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'
import { Link } from '../views/Link'
import { ListCard } from '../views/list/ListCard'
import { SlantedTitle } from '../views/SlantedTitle'
import { FeedCard } from './FeedCard'
import { getListPhoto } from './getListPhoto'
import { homePageStore } from './homePageStore'

const getListPlaces = async (listSlug: string) => {
  return await resolved(() =>
    query
      .list({
        where: {
          slug: {
            _eq: listSlug,
          },
        },
        limit: 1,
      })[0]
      ?.restaurants()
      ?.map((lr) => getRestaurantIdentifiers(lr.restaurant))
  )
}

export const HomePageFeed = memo(
  graphql(
    ({ region, ...useSetAppMapProps }: UseSetAppMapProps & { region: string }) => {
      const [hovered, setHovered] = useState<null | RestaurantOnlyIds[]>(null)
      const refetch = useRefetch()
      const setHoveredDbc = useDebounce(setHovered, 400)
      const setHoverCancel = () => {
        setHoveredDbc.cancel()
      }

      const props = {
        ...useSetAppMapProps,
        hideRegions: false,
        results: hovered ?? useSetAppMapProps.results,
      }
      // console.log('props are', props)
      useSetAppMap(props)

      // useDebounceEffect(
      //   () => {
      //     appMapStore.setHoveredDbc(hovered)
      //   },
      //   80,
      //   [hovered]
      // )

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

      const queryOneList = (tagSlug: string) => {
        return query.list_populated({
          args: {
            min_items: 5,
          },
          where: {
            tags: {
              tag: {
                slug: {
                  _eq: tagSlug,
                },
              },
            },
            region: {
              _eq: region,
            },
          },
          order_by: [{ updated_at: order_by.asc }],
          limit: 1,
        })?.[0]
      }

      const lenseLists = [
        queryOneList('lenses__gems'),
        queryOneList('lenses__veg'),
        queryOneList('lenses__drinks'),
        queryOneList('lenses__vibe'),
      ]

      const allRestaurants = [
        ...[...tagLists, ...lenseLists.filter(isPresent), ...trendingLists].flatMap((list) => {
          return list?.restaurants({ limit: 20 }).map((x) => getRestaurantIdentifiers(x.restaurant))
        }),
      ]

      const allRestaurantsKey = allRestaurants.map((x) => x.id).join('')

      useDebounceEffect(
        () => {
          if (!allRestaurants[0]?.id) return
          homePageStore.setResults(allRestaurants)
        },
        100,
        [allRestaurantsKey]
      )

      const numAddButtons = Math.max(1, 10 - trendingLists.length)

      return (
        <>
          <HStack position="relative">
            <ContentScrollViewHorizontal>
              <HStack spacing="xs" paddingHorizontal={16}>
                {tagLenses.map((lense, i) => {
                  const list = lenseLists[i]
                  const listSlug = list?.slug
                  return (
                    <VStack alignItems="center" flex={1} key={i} marginBottom={20}>
                      <Link
                        {...(list && {
                          name: 'list',
                          params: {
                            slug: list?.slug ?? '',
                            userSlug: list?.user?.username ?? '',
                          },
                        })}
                        {...(!list && {
                          tag: lense,
                        })}
                      >
                        <FeedCard
                          flat
                          chromeless
                          size="xs"
                          // size={foundList?.name ? 'sm' : 'xs'}
                          square
                          tags={[lense]}
                          backgroundColor={rgbString(lense.rgb, 0.2)}
                          emphasizeTag
                          {...(!!listSlug && {
                            photo: getListPhoto(list),
                            title: list.name,
                            onHoverIn: async () => {
                              setHoveredDbc(await getListPlaces(listSlug))
                            },
                            onHoverOut: setHoverCancel,
                          })}
                        />
                      </Link>
                    </VStack>
                  )
                })}

                {tagLists.map((list, i) => {
                  const listSlug = list.slug
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
                          {...(!!listSlug && {
                            onHoverIn: async () => {
                              setHoveredDbc(await getListPlaces(listSlug))
                            },
                            onHoverOut: setHoverCancel,
                          })}
                        />
                      </Link>
                    </VStack>
                  )
                })}
              </HStack>
            </ContentScrollViewHorizontal>
          </HStack>

          <Spacer />

          <VStack paddingHorizontal={10} position="relative">
            <AbsoluteVStack zIndex={100} top={-15} left={10}>
              <SlantedTitle size="xs">Top Lists</SlantedTitle>
            </AbsoluteVStack>

            <Grid itemMinWidth={cardFrameWidthLg}>
              {trendingLists.map((list, i) => {
                const listSlug = list.slug
                return (
                  <HStack
                    alignItems="center"
                    flexShrink={0}
                    key={`${list.id ?? i}`}
                    marginBottom={10}
                  >
                    <Spacer size="xs" />
                    <ListCard
                      userSlug={list.user?.username ?? ''}
                      onDelete={refetch}
                      slug={list?.slug ?? ''}
                      size="lg"
                      colored
                      flexible
                      {...(!!listSlug && {
                        onHoverIn: async () => {
                          setHoveredDbc(await getListPlaces(listSlug))
                        },
                        onHoverOut: setHoverCancel,
                      })}
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
                      width="100%"
                      params={{
                        userSlug: 'me',
                        slug: 'create',
                      }}
                    >
                      <FeedCard flexible chromeless size="lg" flat>
                        <AbsoluteVStack
                          opacity={0.26}
                          hoverStyle={{ opacity: 1 }}
                          fullscreen
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Plus color="#eeeeee" />
                        </AbsoluteVStack>
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

{
  /* <HStack position="relative">
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
              </HStack> */
}

// getting from search we'd want this in graph
// const [lenseRestaurants, setLenseRestaurants] = useState<RestaurantSe/archItem[]>([])
// console.warn('TODO link to hover lense button etc', lenseRestaurants)
// useDebounceEffect(
//   () => {
//     const { currentState } = homeStore
//     search({
//       center: currentState.center!,
//       span: currentState.span!,
//       query: '',
//       limit: 20,
//       main_tag: 'lenses__gems',
//     }).then((res) => {
//       console.warn('res', res)
//       setLenseRestaurants(res.restaurants || [])
//     })
//   },
//   100,
//   []
// )
