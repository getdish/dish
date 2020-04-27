import { Restaurant } from '@dish/models'
import React, { memo, useEffect, useState } from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'

import { useDebounceEffect } from '../../hooks/useDebounceEffect'
import { GeocodePlace, isEditingUserPage } from '../../state/home'
import { useOvermind } from '../../state/om'
import { Divider } from '../ui/Divider'
import { Icon } from '../ui/Icon'
import { Link } from '../ui/Link'
import { Spacer } from '../ui/Spacer'
import { HStack, VStack, ZStack } from '../ui/Stacks'
import { SelectableText } from '../ui/Text'
import { SmallCircleButton } from './CloseButton'
import { bgLightLight } from './colors'
import { DishView } from './DishView'
import { useMediaQueryIsMedium, useMediaQueryIsSmall } from './HomeViewDrawer'
import { RankingView } from './RankingView'
import { CommentBubble, RestaurantAddComment } from './RestaurantAddComment'
import { getAddressText } from './RestaurantAddressLinksRow'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantFavoriteStar } from './RestaurantFavoriteStar'
import { RestaurantRatingViewPopover } from './RestaurantRatingViewPopover'
import { getTagElements } from './RestaurantTagsRow'
import { RestaurantUpVoteDownVote } from './RestaurantUpVoteDownVote'

type RestaurantListItemProps = {
  currentLocationInfo: GeocodePlace
  restaurant: Restaurant
  rank: number
}

let lastHover: any

export const RestaurantListItem = memo(function RestaurantListItem(
  props: RestaurantListItemProps
) {
  const om = useOvermind()
  const [isHovered, setIsHovered] = useState(false)

  useDebounceEffect(
    () => {
      if (isHovered) {
        om.actions.home.setHoveredRestaurant(props.restaurant)
      }
    },
    100,
    [props.restaurant, isHovered]
  )

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
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack
          alignItems="center"
          position="relative"
          width="calc(100% + 200px)"
        >
          <ZStack
            fullscreen
            zIndex={100}
            top={0}
            height={120}
            left={2}
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
    const isShowingComment = isEditingUserPage(om.state)
    const isSmall = useMediaQueryIsSmall()
    return (
      <>
        <VStack
          padding={pad}
          paddingLeft={pad + 4}
          paddingVertical={32}
          width={isSmall ? '50vw' : '62%'}
          minWidth={isSmall ? '60%' : 500}
          overflow="hidden"
          maxWidth={isSmall ? '80vw' : '47vw'}
          spacing={5}
        >
          <HStack alignItems="flex-start" width="100%">
            <VStack spacing="sm" maxWidth="100%" overflow="hidden">
              <Link name="restaurant" params={{ slug: restaurant.slug }}>
                <HStack alignItems="center" marginVertical={-3}>
                  <RankingView
                    marginLeft={-15}
                    marginRight={-2}
                    marginTop={-5}
                    rank={rank}
                  />
                  <SelectableText
                    style={{
                      marginLeft: -1,
                      fontSize: 20,
                      fontWeight: 'bold',
                      textDecorationColor: 'transparent',
                    }}
                  >
                    {restaurant.name}
                  </SelectableText>
                </HStack>
              </Link>

              <HStack
                marginTop={4}
                marginLeft={7}
                spacing={12}
                alignItems="center"
              >
                <RestaurantRatingViewPopover
                  size="xs"
                  restaurant={restaurant}
                />
                <Text style={{ color: '#888' }}>
                  {getTagElements({
                    showMore: true,
                    restaurant,
                    divider: <>,&nbsp;</>,
                  })}
                </Text>
                <HStack>
                  <Icon name="Plus" size={12} color="#555" />
                </HStack>
              </HStack>

              <HStack maxWidth="90%">
                <CommentBubble user={{ username: 'Peach' }}>
                  <SelectableText
                    style={{
                      opacity: 0.8,
                      lineHeight: 17,
                      fontSize: 13,
                      marginBottom: 5,
                    }}
                  >
                    Lorem ipsu dolor sit amet. Lorem ipsum dolor sit amet.
                  </SelectableText>
                  <SelectableText
                    style={{
                      opacity: 0.8,
                      lineHeight: 17,
                      fontSize: 13,
                      marginBottom: 5,
                    }}
                  >
                    Lorem ipsum dolor sit ipsum sit amet. Lorem ipsum dolor sit
                    amet sit amet. Lorem ipsum dolor sit amet.Lorem ipsum dolor
                    sit amet.
                  </SelectableText>
                </CommentBubble>
              </HStack>

              <HStack marginRight={-15} alignItems="center" spacing>
                <RestaurantFavoriteStar restaurant={restaurant} />
                <Icon name="MessageSquare" size={16} color="blue" />
                <RestaurantDetailRow size="sm" restaurant={restaurant} />
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
    const isMedium = useMediaQueryIsMedium()
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
                  size={(size === 'lg' ? 140 : 130) * (isMedium ? 0.85 : 1)}
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
