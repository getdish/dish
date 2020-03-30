import { Restaurant } from '@dish/models'
import React, { useEffect, useState } from 'react'
import { Image, Text, TouchableOpacity } from 'react-native'

import { useOvermind } from '../../state/om'
import { Divider } from '../shared/Divider'
import { Link } from '../shared/Link'
import { Spacer } from '../shared/Spacer'
import { HStack, VStack } from '../shared/Stacks'
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
  const photos = Restaurant.allPhotos(restaurant).slice(0, isMounted ? 10 : 1)
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
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => {
        onHover(restaurant)
        setIsHovered(true)
      }}
      onMouseLeave={() => {
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
          overflow="scroll"
          backgroundColor={isHovered ? '#B8E0F322' : 'transparent'}
        >
          <VStack padding={18} width="76%" maxWidth={525}>
            <Link name="restaurant" params={{ slug: restaurant.slug }}>
              <HStack alignItems="center" marginVertical={-2}>
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

            <Spacer />

            <HStack marginVertical={-7}>
              <Spacer size={20} />
              <HStack alignItems="center">
                <RestaurantRatingPopover restaurant={restaurant} />
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

          <HStack>
            <VStack position="absolute" top={-11} left={-25} zIndex={100}>
              <RestaurantRatingDetail restaurant={restaurant} />
            </VStack>

            {photos.slice(0, 3).map((photo, i) => {
              return (
                <React.Fragment key={i}>
                  <Image
                    source={{ uri: photo }}
                    style={{ width: 140, height: 140, borderRadius: 20 }}
                    resizeMode="cover"
                  />
                  <Spacer />
                </React.Fragment>
              )
            })}
          </HStack>
        </HStack>
        <Divider />
      </TouchableOpacity>
    </div>
  )
}
