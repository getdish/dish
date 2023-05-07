import { tagLenses } from '../../constants/localTags'
import { getRestaurantIdentifiers } from '../../helpers/getRestaurantIdentifiers'
import { UseSetAppMapProps, appMapStore, useSetAppMap } from '../appMapStore'
import { useHomeStore } from '../homeStore'
import { setLocation } from '../setLocation'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'
import { Link } from '../views/Link'
import { SlantedTitle } from '../views/SlantedTitle'
import { ListCard } from '../views/list/ListCard'
import { FeedCard } from './FeedCard'
import { homePageStore } from './homePageStore'
import { useTopCuisines } from './useTopCuisines'
import { RestaurantOnlyIds, graphql, order_by, query, resolved, useRefetch } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import {
  AbsoluteYStack,
  Button,
  Grid,
  H2,
  Paragraph,
  Spacer,
  XStack,
  YStack,
  useDebounce,
  useDebounceEffect,
} from '@dish/ui'
import { Plus } from '@tamagui/lucide-icons'
import getCenter from '@turf/center'
import { capitalize } from 'lodash'
import React, { memo, useState } from 'react'

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

export const HomePageTopLists = memo(
  graphql(
    ({ region, center, ...useSetAppMapProps }: UseSetAppMapProps & { region: string }) => {
      const [hovered, setHovered] = useState<null | RestaurantOnlyIds[]>(null)
      const refetch = useRefetch()
      const setHoveredDbc = useDebounce(setHovered, 400)
      const homeStore = useHomeStore()
      const topCuisines = useTopCuisines(homeStore.currentState.center)
      const setHoverCancel = () => {
        setHoveredDbc.cancel()
      }

      console.log('topCuisines2', topCuisines.data)

      useSetAppMap({
        showRank: !!hovered,
        center,
        ...useSetAppMapProps,
        hideRegions: false,
        results: hovered ?? useSetAppMapProps.results,
      })

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
          return list
            ?.restaurants({ limit: 20 })
            .map((x) => getRestaurantIdentifiers(x.restaurant))
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

      const numAddButtons = Math.max(0, 9 - trendingLists.length)

      return (
        <>
          {/* <HomeTagLenses /> */}
          {/* <HomeNearbyRegions lng={center?.lng} lat={center?.lat} /> */}
          {/* <Spacer size="$6" /> */}

          <YStack paddingHorizontal={10} position="relative">
            <AbsoluteYStack zIndex={100} top={-15} left={10}>
              <SlantedTitle size="$4">Top Playlists</SlantedTitle>
            </AbsoluteYStack>

            <Grid itemMinWidth={220}>
              {trendingLists.map((list, i) => {
                const listSlug = list.slug
                return (
                  <XStack
                    alignItems="center"
                    flexShrink={0}
                    key={`${list.id ?? i}`}
                    marginBottom={5}
                  >
                    <Spacer size="$1" />
                    <ListCard
                      onDelete={refetch}
                      query={trendingLists}
                      list={list}
                      size="$6"
                      colored
                      flexible
                      {...(!!listSlug && {
                        onHoverIn: async () => {
                          setHoveredDbc(await getListPlaces(listSlug))
                        },
                        onHoverOut: setHoverCancel,
                      })}
                    />
                    <Spacer size="$1" />
                  </XStack>
                )
              })}

              {[...new Array(numAddButtons)].map((_, index) =>
                index > 6 ? null : (
                  <XStack
                    paddingHorizontal={2}
                    alignItems="center"
                    flex={1}
                    key={index}
                    marginBottom={5}
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
                      <FeedCard flexible chromeless size="$6" flat>
                        <AbsoluteYStack
                          opacity={0.26}
                          hoverStyle={{ opacity: 1 }}
                          fullscreen
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Plus color="#eeeeee" />
                        </AbsoluteYStack>
                      </FeedCard>
                    </Link>
                  </XStack>
                )
              )}
            </Grid>

            <Spacer size="$8" />

            {/* <HomeTrendingSpots region={region} /> */}
          </YStack>
        </>
      )
    },
    {
      suspense: false,
    }
  )
)

// const HomeTrendingSpots = memo(({ region }: { region: string }) => {
//   const trendingSpots = query.restaurant_trending({
//     args: {
//       region_slug: region,
//     },
//     limit: 8,
//   })

//   return (
//     <>
//       <YStack position="relative">
//         <AbsoluteYStack zIndex={100} top={-15} left={0}>
//           <SlantedTitle size="$2">Trending Spots</SlantedTitle>
//         </AbsoluteYStack>
//         <ContentScrollViewHorizontal>
//           <XStack alignItems="center" space="$4" paddingVertical={10}>
//             {trendingSpots.map((spot, index) => {
//               return <RestaurantCard key={spot.id || index} size="$4" restaurant={spot} />
//             })}
//           </XStack>
//         </ContentScrollViewHorizontal>
//       </YStack>
//     </>
//   )
// })

const HomeTagLenses = memo(() => {
  return (
    <ContentScrollViewHorizontal>
      <XStack pe="auto" ai="center" space="$5" px="$4">
        {tagLenses.map((lense, i) => {
          return (
            <Link key={i} tag={lense}>
              <H2
                theme={`${lense.color}_alt2`}
                color="$color6"
                cursor="pointer"
                px="$2"
                size="$8"
                py="$1"
                hoverStyle={{
                  color: '$colorHover',
                }}
              >
                {lense.name}
              </H2>
            </Link>
          )
        })}
      </XStack>
    </ContentScrollViewHorizontal>
  )
})

const HomeNearbyRegions = memo(
  graphql(({ lng, lat }: { lng?: number; lat?: number }) => {
    if (!lng || !lat) {
      return null
    }

    const nearbyRegions = query.hrr({
      limit: 10,
      where: {
        wkb_geometry: {
          _st_d_within: {
            // todo: if span is large, make this larger proportionally
            distance: 0.5,
            from: {
              type: 'Point',
              coordinates: [lng, lat],
            },
          },
        },
      },
    })

    return (
      <>
        {!!nearbyRegions.length && <Spacer size="$2" />}

        <ContentScrollViewHorizontal>
          <XStack alignItems="center" space="$2" paddingHorizontal={16}>
            {nearbyRegions.map((r, i) => {
              const regionName = capitalize(r.hrrcity?.replace(/[a-z]+\-\s*/i, '') || '')
              const center = r.wkb_geometry ? getCenter(r.wkb_geometry) : null
              const region = r.slug || ''
              return (
                <Button
                  key={i}
                  chromeless
                  noTextWrap
                  {...(center && {
                    onPress: () =>
                      setLocation({
                        region,
                        name: regionName,
                        center: {
                          lng: center.geometry.coordinates[1],
                          lat: center.geometry.coordinates[0],
                        },
                        span: appMapStore.nextPosition.span,
                      }),
                  })}
                >
                  <Paragraph ellipse size="$5" color="$colorPress">
                    {regionName}
                  </Paragraph>
                </Button>
              )
            })}
          </XStack>
        </ContentScrollViewHorizontal>
      </>
    )
  })
)
