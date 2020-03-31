import { Restaurant } from '@dish/models'
import React, { memo, useEffect, useState } from 'react'
import { Image, Text, TouchableOpacity } from 'react-native'

import { useOvermind } from '../../state/om'
import { Divider } from '../shared/Divider'
import Hoverable from '../shared/Hoverable'
import { Icon } from '../shared/Icon'
import { Link } from '../shared/Link'
import { Spacer } from '../shared/Spacer'
import { HStack, VStack, ZStack } from '../shared/Stacks'
import { RankingView } from './RankingView'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantMetaRow } from './RestaurantMetaRow'
import { RestaurantRatingDetail } from './RestaurantRatingDetail'
import { RestaurantRatingPopover } from './RestaurantRatingPopover'
import { RestaurantTagsRow } from './RestaurantTagsRow'

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

  const [isMounted, setIsMounted] = useState(false)
  const [disablePress, setDisablePress] = useState(false)

  useEffect(() => {
    let tm = setTimeout(() => {
      setIsMounted(true)
    }, Math.min(rank * 100, 2000))
    return () => {
      clearTimeout(tm)
    }
  }, [])

  return (
    <Hoverable
      onHoverIn={() => {
        onHover(restaurant)
        setIsHovered(true)
      }}
      onHoverOut={() => {
        setIsHovered(false)
      }}
    >
      <TouchableOpacity
        disabled={disablePress}
        onPress={() => {
          om.actions.router.navigate({
            name: 'restaurant',
            params: { slug: restaurant.slug },
          })
        }}
      >
        <HStack
          alignItems="center"
          backgroundColor={isHovered ? '#B8E0F322' : 'transparent'}
          position="relative"
        >
          <ZStack fullscreen top={40} justifyContent="center">
            <RestaurantRatingPopover
              isHovered={isHovered}
              restaurant={restaurant}
            />
          </ZStack>

          <VStack padding={18} paddingLeft={24} width="76%" maxWidth={525}>
            <Link name="restaurant" params={{ slug: restaurant.slug }}>
              <HStack alignItems="center" marginVertical={-2}>
                <RankingView rank={rank} />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textDecorationColor: 'transparent',
                  }}
                >
                  {restaurant.name}
                </Text>
              </HStack>
            </Link>

            <Spacer />

            <HStack alignItems="center" marginVertical={-10}>
              <HStack alignItems="center" paddingLeft={18}>
                <FavoriteStar isHovered={isHovered} restaurant={restaurant} />
                <Spacer />
                <RestaurantTagsRow showMore restaurant={restaurant} />
              </HStack>
            </HStack>

            <Spacer />

            <HStack alignItems="center" paddingLeft={22}>
              <RestaurantMetaRow showMenu showAddress restaurant={restaurant} />
            </HStack>
            <Spacer size="sm" />
            <RestaurantDetailRow size="sm" restaurant={restaurant} />
          </VStack>

          <Spacer size="lg" />

          <RestaurantPeek restaurant={restaurant} />
        </HStack>
        <Divider />
      </TouchableOpacity>
    </Hoverable>
  )
}

export const RestaurantPeek = memo(
  ({ restaurant }: { restaurant: Restaurant }) => {
    const photos = Restaurant.allPhotos(restaurant).slice(0, 5)
    return (
      <HStack flexWrap="wrap" maxWidth={120} spacing={10}>
        <VStack position="absolute" top={-11} left={-25} zIndex={100}>
          <RestaurantRatingDetail restaurant={restaurant} />
        </VStack>
        {[...photos, photos[0], photos[0], photos[0]]
          .slice(0, 4)
          .map((photo, i) => {
            return (
              <Image
                key={i}
                source={{ uri: photo }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 10,
                  marginBottom: 10,
                }}
                resizeMode="cover"
              />
            )
          })}
      </HStack>
    )
  }
)

export const FavoriteStar = memo(
  ({
    size,
    isHovered,
    restaurant,
  }: {
    isHovered?: boolean
    size?: 'lg' | 'sm'
    restaurant: Restaurant
  }) => {
    const [isStarHovered, setIsHovered] = useState(false)
    return (
      <VStack opacity={isHovered ? 1 : 0.5}>
        <Hoverable
          onHoverIn={() => setIsHovered(true)}
          onHoverOut={() => setIsHovered(false)}
        >
          <div style={{ filter: `grayscale(${isStarHovered ? 0 : 100}%)` }}>
            <Icon
              size={size == 'lg' ? 26 : 22}
              name="thumbs-up"
              color={isStarHovered ? 'goldenrod' : '#555'}
            />
          </div>
        </Hoverable>
      </VStack>
    )
  }
)

// TODO hoverablebutton
