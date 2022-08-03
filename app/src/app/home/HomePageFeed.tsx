import { tagLenses } from '../../constants/localTags'
import { getRestaurantIdentifiers } from '../../helpers/getRestaurantIdentifiers'
import { queryRestaurant } from '../../queries/queryRestaurant'
import { UseSetAppMapProps, appMapStore, useSetAppMap } from '../appMapStore'
import { useHomeStore } from '../homeStore'
import { setLocation } from '../setLocation'
import { ContentScrollView } from '../views/ContentScrollView'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'
import { Link } from '../views/Link'
import { SlantedTitle } from '../views/SlantedTitle'
import { ListCard } from '../views/list/ListCard'
import { FeedCard } from './FeedCard'
import { HomeRegionTitle } from './HomeRegionTitle'
import { HomeTopSearches } from './HomeTopSearches'
import { homePageStore } from './homePageStore'
import { RestaurantListItem } from './restaurant/RestaurantListItem'
import { useTopCuisines } from './useTopCuisines'
import { RestaurantOnlyIds, graphql, order_by, query, resolved, useRefetch } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import {
  AbsoluteYStack,
  Button,
  Grid,
  H1,
  H2,
  Paragraph,
  Spacer,
  Square,
  XStack,
  YStack,
  isWeb,
  useDebounce,
  useDebounceEffect,
} from '@dish/ui'
import { Plus } from '@tamagui/feather-icons'
import getCenter from '@turf/center'
import { capitalize } from 'lodash'
import React, { memo, useCallback, useState } from 'react'
import { Pressable, ScrollView } from 'react-native'
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist'
import SwipeableItem from 'react-native-swipeable-item'

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

const items = [
  {
    name: `Helena's Hawaiian BBQ`,
  },
  {
    name: `Sasabune`,
  },
  {
    name: `Taqueria Gallardo Rosa`,
  },
  {
    name: `Senia`,
  },
  {
    name: `Adela's Country Eatery`,
  },
  {
    name: `The Pig and the Lady`,
  },
  {
    name: `Pho 77`,
  },
]

export const HomePageFeed = memo(
  graphql(
    ({ region, center, ...useSetAppMapProps }: UseSetAppMapProps & { region: string }) => {
      const [hovered, setHovered] = useState<null | RestaurantOnlyIds[]>(null)
      const refetch = useRefetch()
      const setHoveredDbc = useDebounce(setHovered, 400)
      const homeStore = useHomeStore()
      const topCuisines = useTopCuisines(homeStore.currentState.center)
      console.log('topCuisines', topCuisines)
      const restaurants = query.restaurant({
        limit: 10,
        order_by: [
          {
            created_at: order_by.asc,
          },
        ],
      })
      const setHoverCancel = () => {
        setHoveredDbc.cancel()
      }

      console.log('topCuisines', topCuisines.data, restaurants)

      useSetAppMap({
        showRank: !!hovered,
        center,
        ...useSetAppMapProps,
        fitToResults: true,
        // zoomOnHover: true,
        hideRegions: false,
        results: hovered ?? restaurants,
      })

      return (
        <>
          {restaurants.map((item, index) => {
            return (
              <SwipeableItem
                key={item.id}
                item={item}
                snapPointsRight={[100]}
                overSwipe={20}
                renderUnderlayRight={() => <Square size={50} bc="red" />}
              >
                <RestaurantListItem
                  // list={list
                  curLocInfo={null}
                  rank={0}
                  restaurant={item}
                />
              </SwipeableItem>
            )
          })}
        </>
      )

      return (
        <>
          {/* <ContentScrollViewHorizontal>
            <XStack pe="auto" ai="center" space="$5" py="$2" px="$4">
              {topCuisines.data?.map((cuisine, i) => {
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
          </ContentScrollViewHorizontal> */}

          {/* <YStack p="$4">
            <XStack>
              <H1 fontFamily="$stylish">
                Kailua{' '}
                <Paragraph ff="$stylish" fos="$10" fow="200" color="$colorMid">
                  Hawaii
                </Paragraph>
              </H1>

              <Spacer flex />

              <YStack>
                <Spacer flex />
                <Paragraph>Popular here</Paragraph>
              </YStack>
            </XStack>
          </YStack> */}

          {/* <ScrollView
            showsHorizontalScrollIndicator={false}
            bounces
            horizontal
            style={{ width: '100%' }}
          >
            
          </ScrollView> */}

          <XStack $sm={{ display: 'none' }}>
            <ContentScrollViewHorizontal>
              <XStack px="$4">
                <HomeTopSearches />
              </XStack>
            </ContentScrollViewHorizontal>
          </XStack>

          <Spacer />

          {/* <HomeRegionTitle /> */}

          {/* <YStack>
            {.map(({ name }, index) => {
              return (
                <Link
                  key={name + index}
                  name="restaurant"
                  params={{
                    slug: 'mau',
                  }}
                >
                  <XStack
                    p="$4"
                    ai="center"
                    hoverStyle={{
                      backgroundColor: '$backgroundTransparent',
                    }}
                    pressStyle={{
                      backgroundColor: '$backgroundSoft',
                    }}
                  >
                    <Paragraph cursor="default" fontFamily="$stylish">
                      {index + 1}
                    </Paragraph>
                    <Spacer size="$2" />
                    <H2 size="$9" ellipse cursor="default" fontFamily="$stylish">
                      {name}
                    </H2>
                  </XStack>
                </Link>
              )
            })}
          </YStack> */}

          {/* <DraggableFlatList
            keyExtractor={(item, index) => `draggable-item-${item?.name}`}
            data={restaurants}
            renderItem={useCallback(
              ({ item, drag, isActive }: RenderItemParams<any>, index) => {
                const content = (
                  <SwipeableItem
                    key={item.id}
                    item={item}
                    snapPointsRight={[100]}
                    overSwipe={20}
                    renderUnderlayRight={() => <Square size={50} bc="red" />}
                  >
                    <RestaurantListItem
                      // list={list
                      curLocInfo={null}
                      rank={0}
                      restaurant={item}
                    />
                  </SwipeableItem>
                )
                return (
                  <Pressable
                    style={
                      isActive
                        ? {
                            shadowColor: '#000',
                            shadowRadius: 10,
                            shadowOffset: { height: 4, width: 0 },
                            shadowOpacity: 0.2,
                          }
                        : null
                    }
                    // style={{
                    //   // height: 100,
                    //   // backgroundColor: isActive ? 'red' : undefined,
                    // }}
                    delayLongPress={200}
                    onLongPress={drag}
                  >
                    {content}
                  </Pressable>
                )
              },
              [restaurants.length]
            )}
            onDragBegin={() => {
              if (isWeb) {
                window.getSelection?.()?.empty?.()
                window.getSelection?.()?.removeAllRanges?.()
                document.body.classList.add('unselectable-all')
              }
            }}
            onDragEnd={(items) => {
              // listItems.sort(items)
              if (isWeb) {
                document.body.classList.remove('unselectable-all')
              }
            }}
          /> */}

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
