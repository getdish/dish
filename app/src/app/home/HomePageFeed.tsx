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
import { Plus } from '@tamagui/feather-icons'
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

export const HomePageFeed = memo(
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

      if (!topCuisines.data) {
        return null
      }

      console.log('topCuisines', topCuisines.data)

      // useSetAppMap({
      //   showRank: !!hovered,
      //   center,
      //   ...useSetAppMapProps,
      //   hideRegions: false,
      //   results: hovered ?? useSetAppMapProps.results,
      // })

      return (
        <>
          <ContentScrollViewHorizontal>
            <XStack pe="auto" ai="center" space="$5" py="$2" px="$4">
              {topCuisines.data.map((cuisine, i) => {
                return (
                  <Link key={i} tag={{ type: 'country', slug: cuisine.tag_slug }}>
                    <H2
                      cursor="pointer"
                      px="$2"
                      size="$8"
                      py="$1"
                      hoverStyle={{
                        color: '$colorHover',
                      }}
                    >
                      {cuisine.country}
                    </H2>
                  </Link>
                )
              })}
            </XStack>
          </ContentScrollViewHorizontal>

          {/* <HomeTagLenses /> */}
          {/* <HomeNearbyRegions lng={center?.lng} lat={center?.lat} /> */}
          {/* <Spacer size="$6" /> */}

          <YStack paddingHorizontal="$4" position="relative">
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
                color="$colorMid"
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
