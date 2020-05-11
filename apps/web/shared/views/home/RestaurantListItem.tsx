import { Restaurant, query } from '@dish/graph'
import { graphql } from '@gqless/react'
import React, { Suspense, memo, useEffect, useState } from 'react'
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
            <Suspense fallback={null}>
              <RestaurantUpVoteDownVote restaurant={props.restaurant} />
            </Suspense>
          </ZStack>

          <RestaurantListItemContent {...props} />
        </HStack>
      </ScrollView>
      <Divider opacity={0.025} />
    </VStack>
  )
})

const RestaurantListItemContent = memo(
  graphql(
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
        restaurantSlug: restaurant.slug,
        divider: <>,&nbsp;</>,
      })

      const showAddComment = state.showAddComment || isEditingUserPage(om.state)

      const adjustRankingLeft = 36
      const verticalPad = 24
      const leftPad = 6

      return (
        <HStack>
          <VStack
            paddingHorizontal={pad + 6}
            paddingBottom={verticalPad}
            width={isSmall ? '50vw' : '66%'}
            minWidth={isSmall ? '50%' : 500}
            maxWidth={isSmall ? '80vw' : '30%'}
            spacing={5}
          >
            <VStack alignItems="flex-start" width="100%">
              {/* ROW: TITLE */}
              <VStack
                paddingTop={verticalPad}
                // backgroundColor={bgLightLight}
                hoverStyle={{ backgroundColor: bgLightLight }}
                marginLeft={-adjustRankingLeft}
                width={900}
              >
                <Link name="restaurant" params={{ slug: restaurant.slug }}>
                  <VStack>
                    <HStack alignItems="center" marginVertical={-3}>
                      <RankingView
                        marginRight={-6 + leftPad}
                        marginTop={-10}
                        rank={rank}
                      />

                      <SelectableText
                        style={{
                          fontSize: 22,
                          fontWeight: '700',
                          textDecorationColor: 'transparent',
                        }}
                      >
                        {restaurant.name}
                      </SelectableText>
                    </HStack>

                    <Spacer size={10} />

                    {/* ROW: Ranking + TAGS */}
                    <HStack
                      paddingLeft={adjustRankingLeft + leftPad}
                      spacing={12}
                      alignItems="center"
                      marginBottom={-3}
                    >
                      <RestaurantRatingViewPopover
                        size="sm"
                        restaurantSlug={restaurant.slug}
                      />
                      <HStack spacing>
                        {tagElements}
                        <RestaurantAddTagButton restaurant={restaurant} />
                      </HStack>
                    </HStack>
                  </VStack>
                </Link>
              </VStack>

              <Spacer size={14} />

              {/* ROW: COMMENT */}
              <VStack maxWidth="90%" marginLeft={-2}>
                <Suspense fallback={null}>
                  <RestaurantTopReview restaurantId={restaurant.id} />
                </Suspense>
              </VStack>

              <Spacer size={6} />

              {/* ROW: BOTTOM INFO */}
              <HStack
                marginRight={-15}
                marginBottom={-10}
                alignItems="center"
                spacing
              >
                <RestaurantFavoriteStar restaurantId={restaurant.id} />
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

                <RestaurantDetailRow
                  size="sm"
                  restaurantSlug={restaurant.slug}
                />

                <HoverablePopover
                  contents={
                    <SelectableText>{restaurant.address}</SelectableText>
                  }
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
                <RestaurantAddComment restaurantId={restaurant.id} />
              </>
            )}
          </VStack>

          <VStack padding={10} paddingTop={45} width={600}>
            <RestaurantPeek
              size={isShowingComment ? 'lg' : 'md'}
              restaurantSlug={restaurant.slug}
            />
          </VStack>
        </HStack>
      )
    }
  )
)

const RestaurantTopReview = graphql(
  ({ restaurantId }: { restaurantId: string }) => {
    const [topReview] = query.review({
      limit: 1,
      where: {
        restaurant_id: {
          _eq: restaurantId,
        },
      },
    })
    return (
      <CommentBubble user={{ username: topReview?.user?.username ?? 'Peach' }}>
        <SelectableText
          style={{
            opacity: 0.8,
            lineHeight: 20,
            fontSize: 15,
            marginVertical: 5,
          }}
        >
          {topReview?.text ||
            `Lorem ipsu dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit ipsum sit amet. Lorem ipsum dolor sit amet sit amet. Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.`}
        </SelectableText>
      </CommentBubble>
    )
  }
)

export const RestaurantPeek = memo(
  graphql(
    ({
      restaurantSlug,
      size = 'md',
    }: {
      size?: 'lg' | 'md'
      restaurantSlug: string
    }) => {
      const spacing = size == 'lg' ? 12 : 18
      const isMedium = useMediaQueryIsMedium()
      const [isMounted, setIsMounted] = useState(false)
      const [restaurant] = query.restaurant({
        where: {
          slug: {
            _eq: restaurantSlug,
          },
        },
      })
      const allPhotos = restaurant?.photosForCarousel()
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
                  size={(size === 'lg' ? 200 : 170) * (isMedium ? 0.85 : 1)}
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
)
