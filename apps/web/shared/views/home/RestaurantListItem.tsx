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
import { RankingView } from './RankingView'
import { RestaurantAddComment } from './RestaurantAddComment'
import { RestaurantAddressLinksRow } from './RestaurantAddressLinksRow'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantFavoriteStar } from './RestaurantFavoriteStar'
import { RestaurantRatingDetail } from './RestaurantRatingDetail'
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

  useEffect(() => {
    return om.reaction(
      (state) => state.home.activeIndex,
      (activeIndex) => {
        setIsHovered(rank == activeIndex + 1)
      }
    )
  }, [])

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
              top={40}
              justifyContent="center"
              pointerEvents="none"
              opacity={isHovered ? 1 : 0}
            >
              <RestaurantUpVoteDownVote restaurant={restaurant} />
            </ZStack>

            <VStack
              padding={18}
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

              <HStack alignItems="center" paddingLeft={22} paddingTop={4}>
                <RestaurantAddressLinksRow
                  showAddress
                  restaurant={restaurant}
                />
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
                <HStack alignItems="center" paddingLeft={18}></HStack>
              </HStack>

              <RestaurantDetailRow size="sm" restaurant={restaurant} />
              {/* <Spacer size="sm" /> */}
            </VStack>

            <VStack width={500} marginLeft={-60}>
              <RestaurantPeek restaurant={restaurant} />
            </VStack>
          </HStack>
        </ScrollView>
        <Divider />
      </TouchableOpacity>
    </Hoverable>
  )
}

export const RestaurantPeek = memo(
  ({ restaurant }: { restaurant: Restaurant }) => {
    const spacing = 9
    const photos = Restaurant.allPhotos(restaurant).slice(0, 5)
    return (
      <VStack
        position="relative"
        marginRight={-spacing}
        marginBottom={-spacing}
      >
        <VStack position="absolute" top={-11} left={-38} zIndex={100}>
          <RestaurantRatingDetail restaurant={restaurant} />
        </VStack>
        <HStack spacing={spacing}>
          {[...photos, photos[0], photos[0], photos[0]]
            .slice(0, 4)
            .map((photo, i) => {
              return (
                <VStack
                  key={i}
                  borderRadius={10}
                  shadowColor="rgba(0,0,0,0.2)"
                  shadowRadius={4}
                  shadowOffset={{ height: 2, width: 0 }}
                  marginBottom={spacing}
                  overflow="hidden"
                >
                  <Image
                    source={{ uri: photo }}
                    style={{
                      width: 100,
                      height: 100,
                    }}
                    resizeMode="cover"
                  />
                </VStack>
              )
            })}
        </HStack>
      </VStack>
    )
  }
)
