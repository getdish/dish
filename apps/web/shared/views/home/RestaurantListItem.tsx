import { Restaurant } from '@dish/models'
import React, { memo, useEffect, useState } from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'

import { GeocodePlace, isEditingUserPage } from '../../state/home'
import { useOvermind } from '../../state/om'
import { Divider } from '../ui/Divider'
import { Link } from '../ui/Link'
import { Spacer } from '../ui/Spacer'
import { HStack, VStack, ZStack } from '../ui/Stacks'
import { SelectableText } from '../ui/Text'
import { bgLightLight } from './colors'
import { DishView } from './DishView'
import { useMediaQueryIsSmall } from './HomeViewDrawer'
import { RankingView } from './RankingView'
import { CommentBubble, RestaurantAddComment } from './RestaurantAddComment'
import {
  RestaurantAddressLinksRow,
  getAddressText,
} from './RestaurantAddressLinksRow'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantFavoriteStar } from './RestaurantFavoriteStar'
import { RestaurantRatingViewPopover } from './RestaurantRatingViewPopover'
import { RestaurantTagsRow, getTagElements } from './RestaurantTagsRow'
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
      {/* <VStack
        position="absolute"
        bottom={20}
        left={36}
        right={isHovered ? 40 : '40%'}
        zIndex={100000000}
        alignItems="flex-start"
        maxWidth={isHovered ? '100%' : 380}
      >

      </VStack> */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack
          alignItems="center"
          position="relative"
          width="calc(100% + 200px)"
        >
          <ZStack
            fullscreen
            zIndex={100}
            top={60}
            bottom={0}
            left={21}
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
    </VStack>
  )
})

const RestaurantListItemContent = memo(
  ({ rank, restaurant, currentLocationInfo }: RestaurantListItemProps) => {
    const om = useOvermind()
    const pad = 18
    const padLeft = 0
    const isShowingComment = isEditingUserPage(om.state)
    const isSmall = useMediaQueryIsSmall()
    return (
      <>
        <VStack
          padding={pad}
          paddingVertical={32}
          width="62%"
          overflow="hidden"
          maxWidth={isSmall ? '85vw' : '47vw'}
          spacing={5}
        >
          <HStack alignItems="flex-start" width="100%">
            <VStack marginTop={-3} marginLeft={-10}>
              <RestaurantRatingViewPopover restaurant={restaurant} />
            </VStack>
            <Spacer />
            <VStack spacing="sm">
              <Link name="restaurant" params={{ slug: restaurant.slug }}>
                <HStack alignItems="center" marginVertical={-3}>
                  <RankingView
                    marginLeft={-13}
                    marginRight={-2}
                    marginTop={-5}
                    rank={rank}
                  />
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

              <Text style={{ color: '#888', marginLeft: 7 }}>
                {getTagElements({
                  showMore: true,
                  restaurant,
                  divider: <>,&nbsp;</>,
                })}
              </Text>

              <CommentBubble user={{ username: 'Peach' }} marginLeft={-6}>
                <SelectableText style={{ opacity: 0.8, margin: 'auto' }}>
                  Lorem ipsum dolor sit amet.
                </SelectableText>
              </CommentBubble>

              <HStack
                marginBottom={-10}
                paddingLeft={padLeft + 9}
                alignItems="center"
              >
                <RestaurantFavoriteStar restaurant={restaurant} />
                <Spacer size="xl" />
                <RestaurantDetailRow size="sm" restaurant={restaurant} />
                <Spacer size="xl" />
                <Text style={{ color: '#888' }}>
                  {getAddressText(
                    currentLocationInfo,
                    restaurant.address,
                    'xs'
                  )}
                </Text>
              </HStack>
            </VStack>
          </HStack>

          {isEditingUserPage(om.state) && (
            <>
              <Spacer />
              <RestaurantAddComment restaurant={restaurant} />
              <Spacer size="xl" />
            </>
          )}
        </VStack>

        <VStack width={500}>
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
                  size={size === 'lg' ? 140 : 130}
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
