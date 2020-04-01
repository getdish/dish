import { Restaurant } from '@dish/models'
import React, { memo, useEffect, useState } from 'react'
import { Image, Text, TouchableOpacity } from 'react-native'

import { useOvermind } from '../../state/om'
import { Divider } from '../shared/Divider'
import Hoverable from '../shared/Hoverable'
import { Link } from '../shared/Link'
import { Spacer } from '../shared/Spacer'
import { HStack, VStack, ZStack } from '../shared/Stacks'
import { RankingView } from './RankingView'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantFavoriteStar } from './RestaurantFavoriteStar'
import { RestaurantMetaRow } from './RestaurantMetaRow'
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

          <VStack padding={18} paddingLeft={24} width="76%" maxWidth={525}>
            <Link name="restaurant" params={{ slug: restaurant.slug }}>
              <HStack alignItems="center" marginVertical={-3}>
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

            <HStack alignItems="center" marginTop={-8}>
              <HStack alignItems="center" paddingLeft={18}>
                <RestaurantFavoriteStar
                  isHovered={isHovered}
                  restaurant={restaurant}
                />
                <Spacer />
                <RestaurantTagsRow showMore restaurant={restaurant} />
              </HStack>
            </HStack>

            <Spacer size="sm" />

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
    const spacing = 5
    const photos = Restaurant.allPhotos(restaurant).slice(0, 5)
    return (
      <VStack
        position="relative"
        marginRight={-spacing}
        marginBottom={-spacing}
      >
        <VStack position="absolute" top={-11} left={-45} zIndex={100}>
          <RestaurantRatingDetail restaurant={restaurant} />
        </VStack>
        <HStack flexWrap="wrap" maxWidth={120} spacing={spacing}>
          {[...photos, photos[0], photos[0], photos[0]]
            .slice(0, 4)
            .map((photo, i) => {
              return (
                <Image
                  key={i}
                  source={{ uri: photo }}
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 10,
                    marginBottom: spacing,
                  }}
                  resizeMode="cover"
                />
              )
            })}
        </HStack>
      </VStack>
    )
  }
)
