import { Restaurant } from '@dish/models'
import React, { memo, useEffect, useRef, useState } from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'

import { GeocodePlace, isEditingUserPage } from '../../state/home'
import { useOvermind } from '../../state/om'
import { Divider } from '../ui/Divider'
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

type RestaurantListItemProps = {
  currentLocationInfo: GeocodePlace
  restaurant: Restaurant
  rank: number
}

export const RestaurantListItem = memo((props: RestaurantListItemProps) => {
  const om = useOvermind()
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    return om.reaction(
      (state) => state.home.activeIndex,
      (activeIndex) => {
        setIsHovered(props.rank == activeIndex + 1)
      }
    )
  }, [props.rank])

  return (
    <VStack
      hoverStyle={{
        backgroundColor: bgLightLight,
      }}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          om.actions.router.navigate({
            name: 'restaurant',
            params: { slug: props.restaurant.slug },
          })
        }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack alignItems="center" position="relative">
            <ZStack
              fullscreen
              zIndex={100}
              top={20}
              bottom={0}
              left={10}
              justifyContent="center"
              pointerEvents="none"
              opacity={isHovered ? 1 : 0}
            >
              <RestaurantUpVoteDownVote restaurant={props.restaurant} />
            </ZStack>

            <RestaurantListItemContent {...props} />
          </HStack>
        </ScrollView>
        <Divider />
      </TouchableOpacity>
    </VStack>
  )
})

const RestaurantListItemContent = memo(
  ({ rank, restaurant, currentLocationInfo }: RestaurantListItemProps) => {
    const om = useOvermind()
    const pad = 18
    const padLeft = 18
    const isShowingComment = isEditingUserPage(om.state)
    return (
      <>
        <VStack
          padding={pad}
          paddingVertical={22}
          paddingRight={90}
          width="78%"
          maxWidth={525}
          spacing={5}
        >
          <HStack alignItems="flex-start">
            <RankingView
              marginLeft={-32}
              marginRight={-4}
              marginTop={14}
              rank={rank}
            />
            <RestaurantRatingViewPopover restaurant={restaurant} />
            <Spacer />
            <VStack spacing="sm">
              <Link name="restaurant" params={{ slug: restaurant.slug }}>
                <HStack alignItems="center" marginVertical={-3}>
                  <Text
                    style={{
                      marginLeft: -1,
                      fontSize: 20,
                      fontWeight: 'bold',
                      textDecorationColor: 'transparent',
                    }}
                  >
                    {restaurant.name}
                  </Text>
                </HStack>
              </Link>

              <HStack alignItems="center" spacing overflow="hidden">
                <RestaurantAddressLinksRow
                  currentLocationInfo={currentLocationInfo}
                  size="sm"
                  showAddress="sm"
                  restaurant={restaurant}
                />
              </HStack>

              <RestaurantTagsRow showMore restaurant={restaurant} />
            </VStack>
          </HStack>

          {isEditingUserPage(om.state) && (
            <>
              <Spacer />
              <RestaurantAddComment restaurant={restaurant} />
              <Spacer size="xl" />
            </>
          )}

          <Spacer size="xs" />
          <HStack paddingLeft={padLeft + 9} alignItems="center">
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
      </>
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
