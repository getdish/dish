import { RestaurantOnlyIds, graphql, order_by, query, resolved, useRefetch } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { Plus } from '@dish/react-feather'
import getCenter from '@turf/center'
import { capitalize } from 'lodash'
import React, { memo, useState } from 'react'
import {
  AbsoluteVStack,
  Button,
  Grid,
  HStack,
  Spacer,
  Title,
  VStack,
  useDebounce,
  useDebounceEffect,
} from 'snackui'

import { tagLenses } from '../../constants/localTags'
import { getRestaurantIdentifiers } from '../../helpers/getRestaurantIdentifiers'
import { rgbString } from '../../helpers/rgb'
import { UseSetAppMapProps, appMapStore, useSetAppMap } from '../appMapStore'
import { setLocation } from '../setLocation'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'
import { Link } from '../views/Link'
import { ListCard } from '../views/list/ListCard'
import { SlantedTitle } from '../views/SlantedTitle'
import { TitleStyled } from '../views/TitleStyled'
import { FeedCard } from './FeedCard'
import { homePageStore } from './homePageStore'
import { RestaurantCard } from './restaurant/RestaurantCard'

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
    ({ region, center, ...useSetAppMapProps }: UseSetAppMapProps & { region: string }) => {
      const [hovered, setHovered] = useState<null | RestaurantOnlyIds[]>(null)
      const refetch = useRefetch()
      const setHoveredDbc = useDebounce(setHovered, 400)
      const setHoverCancel = () => {
        setHoveredDbc.cancel()
      }

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

      const numAddButtons = Math.max(0, 8 - trendingLists.length)

      return (
        <>
          <HomeTagLenses />

          <HomeNearbyRegions lng={center?.lng} lat={center?.lat} />

          <Spacer size="xxl" />

          <VStack paddingHorizontal={10} position="relative">
            <AbsoluteVStack zIndex={100} top={-15} left={10}>
              <SlantedTitle size="xs">Top Playlists</SlantedTitle>
            </AbsoluteVStack>

            <Grid itemMinWidth={220}>
              {trendingLists.map((list, i) => {
                const listSlug = list.slug
                return (
                  <HStack
                    alignItems="center"
                    flexShrink={0}
                    key={`${list.id ?? i}`}
                    marginBottom={5}
                  >
                    <Spacer size="xxs" />
                    <ListCard
                      onDelete={refetch}
                      query={trendingLists}
                      list={list}
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
                    <Spacer size="xxs" />
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

            <Spacer size="xxxl" />

            {!window.location.search.includes('disable_trending') && (
              <HomeTrendingSpots region={region} />
            )}
          </VStack>
        </>
      )
    },
    {
      suspense: false,
    }
  )
)

const HomeTrendingSpots = memo(({ region }: { region: string }) => {
  const trendingSpots = query.restaurant_trending({
    args: {
      region_slug: region,
    },
    limit: 8,
  })
  console.log('trendingSpots', trendingSpots)

  return (
    <>
      <VStack position="relative">
        <AbsoluteVStack zIndex={100} top={-15} left={0}>
          <SlantedTitle size="xs">Trending Spots</SlantedTitle>
        </AbsoluteVStack>
        <ContentScrollViewHorizontal>
          <HStack alignItems="center" spacing="md" paddingVertical={10}>
            {trendingSpots.map((spot) => {
              return <RestaurantCard size="sm" key={spot.id} restaurant={spot} />
            })}
          </HStack>
        </ContentScrollViewHorizontal>
      </VStack>
    </>
  )
})

const HomeTagLenses = memo(() => {
  return (
    <ContentScrollViewHorizontal>
      <HStack alignItems="center" spacing="xxl" paddingHorizontal={16}>
        {tagLenses.map((lense, i) => {
          return (
            <Link key={i} tag={lense}>
              <TitleStyled
                color={rgbString(lense.rgb as any)}
                hoverStyle={{
                  color: rgbString(lense.rgb as any, 0.6),
                }}
                fontSize={26}
                lineHeight={40}
                paddingVertical={5}
              >
                {lense.icon}
                &nbsp;&nbsp;
                {lense.name}
              </TitleStyled>
            </Link>
          )
        })}
      </HStack>
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
        {!!nearbyRegions.length && <Spacer size="sm" />}

        <ContentScrollViewHorizontal>
          <HStack alignItems="center" spacing="sm" paddingHorizontal={16}>
            {nearbyRegions.map((r, i) => {
              const regionName = capitalize(r.hrrcity?.replace(/[a-z]+\-\s*/i, '') || '')
              const center = r.wkb_geometry ? getCenter(r.wkb_geometry) : null
              const region = r.slug || ''
              console.log('geo', r.wkb_geometry, center)
              return (
                <Button
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
                  key={i}
                >
                  <Title size="xs" key={i} paddingVertical={5}>
                    {regionName}
                  </Title>
                </Button>
              )
            })}
          </HStack>
        </ContentScrollViewHorizontal>
      </>
    )
  })
)
