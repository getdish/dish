import { Restaurant, graphql, query, useQuery } from '@dish/graph'
import React, { Suspense, memo, useEffect, useState } from 'react'
import { MessageSquare } from 'react-feather'
import { ScrollView, TouchableOpacity } from 'react-native'

import { useDebounceEffect } from '../../hooks/useDebounceEffect'
import { GeocodePlace, isEditingUserPage } from '../../state/home'
import { useOvermind } from '../../state/useOvermind'
import { Divider } from '../ui/Divider'
import { HoverablePopover } from '../ui/HoverablePopover'
import { Link } from '../ui/Link'
import { Spacer } from '../ui/Spacer'
import { HStack, VStack, ZStack } from '../ui/Stacks'
import { SelectableText } from '../ui/Text'
import { bgLightLight } from './colors'
import { DishView } from './DishView'
import { useMediaQueryIsMedium, useMediaQueryIsSmall } from './HomeViewDrawer'
import { RankingView } from './RankingView'
import { CommentBubble, RestaurantAddComment } from './RestaurantAddComment'
import { getAddressText } from './RestaurantAddressLinksRow'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantFavoriteStar } from './RestaurantFavoriteStar'
import { RestaurantLenseVote } from './RestaurantLenseVote'
import { RestaurantRatingViewPopover } from './RestaurantRatingViewPopover'
import { RestaurantTagsRow, useGetTagElements } from './RestaurantTagsRow'
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

  console.log(`RestaurantListItem.render.${props.rank}.`)

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
        <Suspense fallback={null}>
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
              <RestaurantUpVoteDownVote restaurantId={props.restaurant.id} />
            </ZStack>

            <RestaurantListItemContent {...props} />
          </HStack>
        </Suspense>
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
                <Link
                  tagName="div"
                  name="restaurant"
                  params={{ slug: restaurant.slug }}
                >
                  <VStack>
                    <HStack alignItems="center" marginVertical={-3}>
                      <RankingView
                        marginRight={-6 + leftPad}
                        marginTop={-10}
                        rank={rank}
                      />

                      <Link
                        name="restaurant"
                        params={{ slug: restaurant.slug }}
                      >
                        <SelectableText
                          style={{
                            color: '#000',
                            fontSize: 24,
                            fontWeight: '700',
                            textDecorationColor: 'transparent',
                          }}
                        >
                          {restaurant.name}
                        </SelectableText>
                      </Link>
                    </HStack>

                    <Spacer size={10} />

                    {/* ROW: Ranking + TAGS */}
                    <HStack
                      paddingLeft={adjustRankingLeft + leftPad}
                      spacing={12}
                      alignItems="center"
                      marginBottom={-3}
                    >
                      <Suspense fallback={null}>
                        <RestaurantRatingViewPopover
                          size="sm"
                          restaurantSlug={restaurant.slug}
                        />
                      </Suspense>
                      <Suspense fallback={null}>
                        <RestaurantTagsRow
                          tags={restaurant.tags.map((tag) => tag.tag)}
                          showMore={true}
                          restaurantSlug={restaurant.slug}
                          divider={<>,&nbsp;</>}
                        />
                      </Suspense>
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
                <RestaurantLenseVote />
                <Suspense fallback={null}>
                  <RestaurantFavoriteStar restaurantId={restaurant.id} />
                </Suspense>

                <TouchableOpacity
                  onPress={() =>
                    setState((state) => ({
                      ...state,
                      showAddComment: !state.showAddComment,
                    }))
                  }
                >
                  <MessageSquare
                    size={16}
                    color={state.showAddComment ? 'blue' : '#999'}
                  />
                </TouchableOpacity>

                <Divider vertical />

                <Suspense fallback={null}>
                  <RestaurantDetailRow
                    size="sm"
                    restaurantSlug={restaurant.slug}
                  />
                </Suspense>

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

          <VStack padding={10} paddingTop={45} width={0}>
            <Suspense fallback={null}>
              <RestaurantPeek
                size={isShowingComment ? 'lg' : 'md'}
                restaurantSlug={restaurant.slug}
              />
            </Suspense>
          </VStack>
        </HStack>
      )
    }
  )
)

const RestaurantTopReview = memo(
  graphql(({ restaurantId }: { restaurantId: string }) => {
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
  })
)

export const RestaurantPeek = memo(
  graphql(function RestaurantPeek({
    restaurantSlug,
    size = 'md',
  }: {
    size?: 'lg' | 'md'
    restaurantSlug: string
  }) {
    const spacing = size == 'lg' ? 12 : 18
    const isMedium = useMediaQueryIsMedium()
    const [restaurant] = query.restaurant({
      where: {
        slug: {
          _eq: restaurantSlug,
        },
      },
    })
    const allPhotos = restaurant?.photosForCarousel()
    const photos = allPhotos

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
                size={(size === 'lg' ? 220 : 190) * (isMedium ? 0.85 : 1)}
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
  })
)
