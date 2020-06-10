import { requestIdle, series, sleep } from '@dish/async'
import {
  Restaurant,
  RestaurantSearchResult,
  graphql,
  query,
  restaurantPhotosForCarousel,
} from '@dish/graph'
import {
  Divider,
  HStack,
  HoverablePopover,
  Spacer,
  Text,
  VStack,
  ZStack,
  useDebounceEffect,
} from '@dish/ui'
import React, { memo, useEffect, useState } from 'react'
import { MessageSquare } from 'react-feather'
import { ScrollView, TouchableOpacity } from 'react-native'

import {
  GeocodePlace,
  HomeStateItemSearch,
  isEditingUserPage,
} from '../../state/home'
import { useOvermind } from '../../state/useOvermind'
import { Link } from '../ui/Link'
import { bgLightLight } from './colors'
import { DishView } from './DishView'
import { HomeScrollViewHorizontal } from './HomeScrollView'
import { useMediaQueryIsMedium, useMediaQueryIsSmall } from './HomeViewDrawer'
import { RankingView } from './RankingView'
import { CommentBubble, RestaurantAddComment } from './RestaurantAddComment'
import { getAddressText } from './RestaurantAddressLinksRow'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantFavoriteStar } from './RestaurantFavoriteStar'
import { RestaurantLenseVote } from './RestaurantLenseVote'
import { restaurantQuery } from './restaurantQuery'
import { RestaurantRatingViewPopover } from './RestaurantRatingViewPopover'
import { RestaurantTagsRow } from './RestaurantTagsRow'
import { RestaurantUpVoteDownVote } from './RestaurantUpVoteDownVote'

type RestaurantListItemProps = {
  currentLocationInfo: GeocodePlace | null
  restaurantId: string
  restaurantSlug: string
  rank: number
  searchState?: HomeStateItemSearch
  onFinishRender?: Function
}

/**
 * NOTE
 *
 * use slug for anything NOT logged in
 *
 * for logged in calls, we often need to user restaurant_id
 */

export const RestaurantListItem = memo(function RestaurantListItem(
  props: RestaurantListItemProps
) {
  const om = useOvermind()
  const [isHovered, setIsHovered] = useState(false)

  useDebounceEffect(
    () => {
      if (isHovered) {
        om.actions.home.setHoveredRestaurant({
          id: props.restaurantId,
          slug: props.restaurantSlug,
        })
      }
    },
    60,
    [isHovered]
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
      contain="paint"
    >
      <HomeScrollViewHorizontal>
        <HStack
          alignItems="center"
          position="relative"
          width="calc(100% + 25px)"
        >
          <RestaurantListItemContent {...props} />
        </HStack>
      </HomeScrollViewHorizontal>
    </VStack>
  )
})

const RestaurantListItemContent = memo(
  graphql((props: RestaurantListItemProps) => {
    const { rank, restaurantId, restaurantSlug, currentLocationInfo } = props
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
    const restaurant = restaurantQuery(restaurantSlug)

    useEffect(() => {
      if (props.onFinishRender) {
        return series([
          () => sleep(process.env.NODE_ENV === 'development' ? 500 : 50),
          () => requestIdle(),
          () => requestIdle(),
          () => requestIdle(),
          () => requestIdle(),
          () => props.onFinishRender!(),
        ])
      }
    }, [])

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
              {/* VOTE */}
              <ZStack
                fullscreen
                zIndex={100}
                top="auto"
                bottom={-59}
                height={120}
                left={14}
                justifyContent="center"
                pointerEvents="none"
              >
                <RestaurantUpVoteDownVote restaurantId={restaurantId} />
              </ZStack>

              {/* LINK */}
              <Link
                tagName="div"
                name="restaurant"
                params={{ slug: restaurantSlug }}
              >
                <VStack>
                  <HStack alignItems="center" marginVertical={-3}>
                    <RankingView
                      marginRight={-6 + leftPad}
                      marginTop={-10}
                      rank={rank}
                    />

                    {/* SECOND LINK WITH actual <a /> */}
                    <Link name="restaurant" params={{ slug: restaurantSlug }}>
                      <Text
                        selectable
                        color="#000"
                        fontSize={24}
                        fontWeight="300"
                        textDecorationColor="transparent"
                      >
                        {restaurant.name}
                      </Text>
                    </Link>
                  </HStack>

                  <Spacer size={12} />

                  {/* TITLE ROW: Ranking + TAGS */}
                  <HStack
                    paddingLeft={adjustRankingLeft + leftPad + 4}
                    spacing={12}
                    alignItems="center"
                    marginBottom={-2}
                  >
                    <RestaurantRatingViewPopover
                      size="xs"
                      restaurantSlug={restaurantSlug}
                    />
                    <RestaurantTagsRow
                      subtle
                      showMore={true}
                      restaurantSlug={restaurantSlug}
                      divider={<></>}
                    />
                  </HStack>
                </VStack>

                {/* <Divider noGap zIndex={-1} /> */}
              </Link>
            </VStack>

            <Spacer size={14} />

            {/* ROW: COMMENT */}
            <VStack maxWidth="90%" marginLeft={-2}>
              <RestaurantTopReview restaurantId={restaurantId} />
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
              <RestaurantFavoriteStar restaurantId={restaurantId} />

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

              <RestaurantDetailRow size="sm" restaurantSlug={restaurantSlug} />

              <HoverablePopover
                contents={<Text selectable>{restaurant.address}</Text>}
              >
                <Text selectable color="#888">
                  {getAddressText(
                    currentLocationInfo,
                    restaurant.address ?? '',
                    'xs'
                  )}
                </Text>
              </HoverablePopover>
            </HStack>
          </VStack>

          {showAddComment && (
            <>
              <Spacer size="lg" />
              <RestaurantAddComment restaurantId={restaurantId} />
            </>
          )}
        </VStack>

        <VStack padding={10} paddingTop={65} width={0}>
          <RestaurantPeek
            restaurantSlug={restaurantSlug}
            searchState={props.searchState}
            size={isShowingComment ? 'lg' : 'md'}
          />
        </VStack>
      </HStack>
    )
  })
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
        <Text
          selectable
          opacity={0.8}
          lineHeight={20}
          fontSize={14}
          marginVertical={5}
        >
          {topReview?.text ||
            `Lorem ipsu dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit ipsum sit amet. Lorem ipsum dolor sit amet sit amet. Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.`}
        </Text>
      </CommentBubble>
    )
  })
)

export const RestaurantPeek = memo(
  graphql(function RestaurantPeek(props: {
    size?: 'lg' | 'md'
    restaurantSlug: string
    searchState: HomeStateItemSearch
  }) {
    const { searchState, size = 'md' } = props
    const tag_names = Object.keys(searchState?.activeTagIds || {})
    const spacing = size == 'lg' ? 16 : 24
    const isMedium = useMediaQueryIsMedium()
    const restaurant = restaurantQuery(props.restaurantSlug)
    const allPhotos = restaurantPhotosForCarousel({
      restaurant,
      tag_names,
    })
    const photos = allPhotos.slice(0, 5)

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
                size={(size === 'lg' ? 190 : 150) * (isMedium ? 0.85 : 1)}
                restaurantSlug={props.restaurantSlug}
                dish={photo}
              />
            )
          })}
        </HStack>
      </VStack>
    )
  })
)
