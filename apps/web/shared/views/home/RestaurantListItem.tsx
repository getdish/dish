import { Restaurant, slugify } from '@dish/models'
import React, { memo, useEffect, useRef, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity } from 'react-native'

import { isEditingUserPage } from '../../state/home'
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

export const RestaurantListItem = ({
  restaurant,
  rank,
  onHover,
}: {
  restaurant: Restaurant
  rank: number
  onHover: (r: Restaurant) => void
}) => {
  const om = useOvermind()
  const [isHovered, setIsHovered] = useState(false)
  const [disablePress, setDisablePress] = useState(false)
  const hoverTm = useRef<any>(0)
  const userReview = om.state.user.allReviews[restaurant.id]

  console.log('userReview', userReview)

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
        hoverTm.current = setTimeout(() => onHover(restaurant), 100)
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
              paddingRight={118}
              width="75%"
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
                paddingTop={4}
                spacing
                overflow="hidden"
              >
                <RestaurantAddressLinksRow
                  showAddress
                  restaurant={restaurant}
                />
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
              <HStack paddingHorizontal={20}>
                <RestaurantRatingViewPopover restaurant={restaurant} />
                <Spacer size="lg" />
                <Divider vertical />
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

/// <VStack
///                   key={i}
///                   borderRadius={10}
///                   shadowColor="rgba(0,0,0,0.2)"
///                   shadowRadius={4}
///                   shadowOffset={{ height: 2, width: 0 }}
///                   marginBottom={spacing}
///                   overflow="hidden"
///                 >
///                   <Image
///                     source={{ uri: photo }}
///                     style={{
///                       width: 100,
///                       height: 100,
///                     }}
///                     resizeMode="cover"
///                   />
///                 </VStack>
