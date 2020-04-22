import { Restaurant } from '@dish/models'
import React, { memo, useEffect, useRef, useState } from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'

import { GeocodePlace, isEditingUserPage } from '../../state/home'
import { useOvermind } from '../../state/om'
import { Divider } from '../ui/Divider'
import Hoverable from '../ui/Hoverable'
import { Link } from '../ui/Link'
import { Spacer } from '../ui/Spacer'
import { HStack, VStack, ZStack } from '../ui/Stacks'
import { bgLightLight } from './colors'
import { DishView } from './DishView'
import { RankingView } from './RankingView'
import { RestaurantAddComment } from './RestaurantAddComment'
import { RestaurantAddressLinksRow } from './RestaurantAddressLinksRow'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantFavoriteStar } from './RestaurantFavoriteStar'
import { RestaurantRatingViewPopover } from './RestaurantRatingViewPopover'
import { RestaurantTagsRow } from './RestaurantTagsRow'
import { RestaurantUpVoteDownVote } from './RestaurantUpVoteDownVote'

export const RestaurantListItem = memo(
  ({
    currentLocationInfo,
    restaurant,
    rank,
  }: {
    currentLocationInfo: GeocodePlace
    restaurant: Restaurant
    rank: number
  }) => {
    const om = useOvermind()
    const [isHovered, setIsHovered] = useState(false)
    const [disablePress, setDisablePress] = useState(false)
    const hoverTm = useRef<any>(0)
    const userReview = om.state.user.allReviews[restaurant.id]

    useEffect(() => {
      return om.reaction(
        (state) => state.home.activeIndex,
        (activeIndex) => {
          setIsHovered(rank == activeIndex + 1)
        }
      )
    }, [])

    const pad = 18
    const padLeft = 20

    const isShowingComment = isEditingUserPage(om.state)

    return (
      <Hoverable
        onHoverIn={() => {
          setIsHovered(true)
          hoverTm.current = setTimeout(() => {
            om.actions.home.setHoveredRestaurant(restaurant)
          }, 100)
        }}
        onHoverOut={() => {
          clearTimeout(hoverTm.current)
          setIsHovered(false)
        }}
      >
        <TouchableOpacity
          disabled={disablePress}
          activeOpacity={0.8}
          onPress={() => {
            om.actions.router.navigate({
              name: 'restaurant',
              params: { slug: restaurant.slug },
            })
          }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <HStack
              alignItems="center"
              backgroundColor={isHovered ? bgLightLight : 'transparent'}
              position="relative"
            >
              <ZStack
                fullscreen
                zIndex={100}
                top={20}
                bottom={0}
                left={-13}
                justifyContent="center"
                pointerEvents="none"
                opacity={isHovered ? 1 : 0}
              >
                <RestaurantUpVoteDownVote restaurant={restaurant} />
              </ZStack>

              <VStack
                padding={pad}
                paddingVertical={22}
                paddingRight={90}
                width="78%"
                maxWidth={525}
                spacing={5}
              >
                <Link name="restaurant" params={{ slug: restaurant.slug }}>
                  <HStack alignItems="center" marginVertical={-3}>
                    <RankingView rank={rank} />
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        textDecorationColor: 'transparent',
                      }}
                    >
                      {restaurant.name}
                    </Text>
                  </HStack>
                </Link>

                <HStack
                  alignItems="center"
                  paddingLeft={padLeft}
                  spacing
                  overflow="hidden"
                >
                  <RestaurantAddressLinksRow
                    currentLocationInfo={currentLocationInfo}
                    showAddress="sm"
                    restaurant={restaurant}
                  />
                </HStack>

                <HStack paddingTop={6} paddingLeft={padLeft}>
                  <RestaurantTagsRow showMore restaurant={restaurant} />
                </HStack>

                {isEditingUserPage(om.state) && (
                  <>
                    <Spacer />
                    <RestaurantAddComment restaurant={restaurant} />
                    <Spacer size="xl" />
                  </>
                )}

                <Spacer />

                <HStack alignItems="center" marginTop={-5}>
                  <HStack alignItems="center" paddingLeft={padLeft}></HStack>
                </HStack>

                {/* <Spacer size="sm" /> */}
                <HStack
                  paddingLeft={padLeft - 3}
                  alignItems="center"
                  // justifyContent="center"
                >
                  <RestaurantRatingViewPopover restaurant={restaurant} />
                  <Spacer size="lg" />
                  <Divider vertical />
                  <RestaurantFavoriteStar restaurant={restaurant} />
                  <Spacer size="xl" />
                  <RestaurantDetailRow size="sm" restaurant={restaurant} />
                </HStack>
              </VStack>

              <VStack width={500} marginLeft={-60}>
                <RestaurantPeek
                  size={isShowingComment ? 'lg' : 'md'}
                  restaurant={restaurant}
                />
              </VStack>
            </HStack>
          </ScrollView>
          <Divider />
        </TouchableOpacity>
      </Hoverable>
    )
  }
)

export const RestaurantPeek = memo(
  ({
    restaurant,
    size = 'md',
  }: {
    size?: 'lg' | 'md'
    restaurant: Restaurant
  }) => {
    const spacing = size == 'lg' ? 12 : 18
    const photos = Restaurant.allPhotos(restaurant).slice(0, 5)
    return (
      <VStack
        position="relative"
        marginRight={-spacing}
        marginBottom={-spacing}
      >
        <HStack spacing={spacing}>
          {[...photos, photos[0], photos[0], photos[0]]
            .slice(0, 4)
            .map((photo, i) => {
              return (
                <DishView
                  key={i}
                  size={size === 'lg' ? 140 : 100}
                  dish={
                    {
                      name: 'Bun bo hue',
                      image: photo,
                      price: (20 - i) * 30 + 200,
                    } as any
                  }
                />
              )
            })}
        </HStack>
      </VStack>
    )
  }
)
