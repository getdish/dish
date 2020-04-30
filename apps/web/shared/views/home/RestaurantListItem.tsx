import { Restaurant } from '@dish/models'
import React, { memo, useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'

import { useDebounceEffect } from '../../hooks/useDebounceEffect'
import { GeocodePlace, isEditingUserPage } from '../../state/home'
import { useOvermind } from '../../state/om'
import { Divider } from '../ui/Divider'
import { HoverablePopover } from '../ui/HoverablePopover'
import { Icon } from '../ui/Icon'
import { Link, LinkButton } from '../ui/Link'
import { Spacer } from '../ui/Spacer'
import { HStack, VStack, ZStack } from '../ui/Stacks'
import { SelectableText } from '../ui/Text'
import { useWaterfall } from '../ui/useWaterfall'
import { bgLightHover, bgLightLight } from './colors'
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
    60,
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
      backgroundColor={isHovered ? '#fff' : '#fff'}
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
            top={20}
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
    const showAddComment = state.showAddComment || isEditingUserPage(om.state)

    const adjustRankingLeft = 38
    const verticalPad = 22

    return (
      <HStack>
        <VStack
          paddingHorizontal={pad + 6}
          paddingBottom={verticalPad}
          width={isSmall ? '50vw' : '66%'}
          minWidth={isSmall ? '50%' : 500}
          maxWidth={isSmall ? '80vw' : '40vw'}
          spacing={5}
        >
          <VStack alignItems="flex-start" width="100%">
            {/* ROW: TITLE */}
            <VStack
              paddingTop={verticalPad}
              backgroundColor={bgLightLight}
              hoverStyle={{ backgroundColor: bgLightHover }}
              marginLeft={-adjustRankingLeft}
              width={900}
              // marginRight="-100%"
            >
              <Link name="restaurant" params={{ slug: restaurant.slug }}>
                <VStack>
                  <HStack alignItems="center" marginVertical={-3}>
                    <RankingView marginRight={-4} marginTop={-10} rank={rank} />
                    <SelectableText
                      style={{
                        fontSize: 22,
                        textDecorationColor: 'transparent',
                      }}
                    >
                      {restaurant.name}
                    </SelectableText>
                  </HStack>
                  <Spacer size={8} />

                  {/* ROW: Ranking + TAGS */}
                  <HStack
                    paddingLeft={adjustRankingLeft}
                    spacing={12}
                    alignItems="center"
                  >
                    <RestaurantRatingViewPopover
                      size="xs"
                      restaurant={restaurant}
                    />
                    <HStack spacing>
                      {tagElements}
                      <RestaurantAddTagButton restaurant={restaurant} />
                    </HStack>
                  </HStack>
                </VStack>
              </Link>
            </VStack>

            {/* ROW: COMMENT */}
            <Spacer size={8} />
            <VStack maxWidth="90%" marginLeft={-2}>
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
                  ipsum dolor sit ipsum sit amet. Lorem ipsum dolor sit amet sit
                  amet. Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.
                </SelectableText>
              </CommentBubble>
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
                <Icon
                  name="MessageSquare"
                  size={16}
                  color={state.showAddComment ? 'blue' : '#999'}
                />
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

          {showAddComment && (
            <>
              <Spacer size="lg" />
              <RestaurantAddComment restaurant={restaurant} />
            </>
          )}
        </VStack>

        <VStack padding={10} paddingTop={30} width={600} overflow="hidden">
          <RestaurantPeek
            size={isShowingComment ? 'lg' : 'md'}
            restaurant={restaurant}
          />
        </VStack>
      </HStack>
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
    const [isMounted, setIsMounted] = useState(false)
    const allPhotos = restaurant.photosForCarousel()
    const photos = isMounted ? allPhotos : allPhotos.slice(0, 1)

    //  only show the first two at firt
    useWaterfall(() => {
      setIsMounted(true)
    })

    return (
      <VStack
        position="relative"
        marginRight={-spacing}
        marginBottom={-spacing}
      >
        <HStack spacing={spacing}>
          {photos.map((photo, i) => {
            return (
              <DishView
                key={i}
                size={(size === 'lg' ? 140 : 130) * (isMedium ? 0.85 : 1)}
                dish={
                  {
                    name: photo.name,
                    image: photo.src,
                    rating: photo.rating,
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
