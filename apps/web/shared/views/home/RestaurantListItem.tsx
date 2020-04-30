import { Restaurant } from '@dish/models'
import React, { memo, useEffect, useState } from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'

import { useDebounceEffect } from '../../hooks/useDebounceEffect'
import { GeocodePlace, isEditingUserPage } from '../../state/home'
import { useOvermind } from '../../state/om'
import { Divider } from '../ui/Divider'
import { HoverablePopover } from '../ui/HoverablePopover'
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
import { RestaurantAddTagButton } from './RestaurantAddTagButton'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantFavoriteStar } from './RestaurantFavoriteStar'
import { RestaurantRatingViewPopover } from './RestaurantRatingViewPopover'
import { useGetTagElements } from './RestaurantTagsRow'
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
            top={26}
            height={120}
            left={0}
            justifyContent="center"
            pointerEvents="none"
            opacity={isHovered ? 1 : 0}
          >
            <RestaurantUpVoteDownVote restaurant={props.restaurant} />
          </ZStack>

          <RestaurantListItemContent {...props} />
        </HStack>
      </ScrollView>
      <Divider opacity={0.025} />
    </VStack>
  )
})

const RestaurantListItemContent = memo(
  ({ rank, restaurant, currentLocationInfo }: RestaurantListItemProps) => {
    const om = useOvermind()
    const pad = 18
    const isShowingComment = isEditingUserPage(om.state)
    const isSmall = useMediaQueryIsSmall()
    const [state, setState] = useState({
      showAddComment: false,
    })
    const tagElements = useGetTagElements({
      showMore: true,
      restaurant,
      divider: <>,&nbsp;</>,
    })
    const showAddEditComment =
      state.showAddComment || isEditingUserPage(om.state)

    return (
      <>
        <VStack
          padding={pad}
          paddingLeft={pad + 6}
          paddingVertical={22}
          width={isSmall ? '50vw' : '62%'}
          minWidth={isSmall ? '60%' : 500}
          maxWidth={isSmall ? '80vw' : '47vw'}
          spacing={5}
        >
          <VStack alignItems="flex-start" width="100%">
            {/* ROW: TITLE */}
            <Link name="restaurant" params={{ slug: restaurant.slug }}>
              <HStack alignItems="center" marginVertical={-3}>
                <RankingView
                  marginLeft={-38}
                  marginRight={-4}
                  marginTop={-10}
                  rank={rank}
                />
                <SelectableText
                  style={{
                    fontSize: 22,
                    textDecorationColor: 'transparent',
                  }}
                >
                  {restaurant.name}
                </SelectableText>
              </HStack>
            </Link>

            <Spacer size={8} />

            {/* ROW: Ranking + TAGS */}
            <HStack spacing={12} alignItems="center">
              <RestaurantRatingViewPopover size="xs" restaurant={restaurant} />
              <HStack spacing>
                {tagElements}
                <RestaurantAddTagButton restaurant={restaurant} />
              </HStack>
            </HStack>

            {/* ROW: COMMENT */}
            <Spacer size={2} />
            <VStack maxWidth="90%" marginLeft={-2}>
              {!showAddEditComment && (
                <CommentBubble user={{ username: 'Peach' }}>
                  <SelectableText
                    style={{
                      opacity: 0.8,
                      lineHeight: 19,
                      fontSize: 14,
                      marginBottom: 5,
                    }}
                  >
                    Lorem ipsu dolor sit amet. Lorem ipsum dolor sit amet. Lorem
                    ipsum dolor sit ipsum sit amet. Lorem ipsum dolor sit amet
                    sit amet. Lorem ipsum dolor sit amet.Lorem ipsum dolor sit
                    amet.
                  </SelectableText>
                </CommentBubble>
              )}
              {showAddEditComment && (
                <RestaurantAddComment restaurant={restaurant} />
              )}
            </VStack>

            {/* ROW: BOTTOM INFO */}
            <HStack
              marginRight={-15}
              marginBottom={-10}
              alignItems="center"
              spacing
            >
              <RestaurantFavoriteStar restaurant={restaurant} />
              <TouchableOpacity
                onPress={() =>
                  setState((state) => ({
                    ...state,
                    showAddComment: !state.showAddComment,
                  }))
                }
              >
                <Icon name="MessageSquare" size={16} color="#999" />
              </TouchableOpacity>

              <Divider vertical />

              <RestaurantDetailRow size="sm" restaurant={restaurant} />

              <HoverablePopover
                contents={<SelectableText>{restaurant.address}</SelectableText>}
              >
                <SelectableText style={{ color: '#888' }}>
                  {getAddressText(
                    currentLocationInfo,
                    restaurant.address,
                    'xs'
                  )}
                </SelectableText>
              </HoverablePopover>
            </HStack>
          </VStack>
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
    const isMedium = useMediaQueryIsMedium()
    return (
      <VStack
        position="relative"
        marginRight={-spacing}
        marginBottom={-spacing}
      >
        <HStack spacing={spacing}>
          {restaurant.photosForCarousel().map((photo, i) => {
            return (
              <DishView
                key={i}
                size={(size === 'lg' ? 140 : 130) * (isMedium ? 0.85 : 1)}
                dish={
                  {
                    name: photo.name,
                    image: photo.src,
                    price: photo.rating,
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
