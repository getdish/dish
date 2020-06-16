import { fullyIdle, series, sleep } from '@dish/async'
import { graphql, query, restaurantPhotosForCarousel } from '@dish/graph'
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
import { when } from 'overmind'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { MessageSquare } from 'react-feather'

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
import { Squircle } from './Squircle'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

type RestaurantListItemProps = {
  currentLocationInfo: GeocodePlace | null
  restaurantId: string
  restaurantSlug: string
  rank: number
  searchState: HomeStateItemSearch
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

  console.log('RestaurantListItem.render', props.rank)

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
    <HStack
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      alignItems="center"
      position="relative"
    >
      <VStack className="ease-in-out-fast" flex={1}>
        <RestaurantListItemContent {...props} />
      </VStack>
      <ZStack fullscreen top={12} zIndex={10} pointerEvents="none">
        <RestaurantPeek
          restaurantSlug={props.restaurantSlug}
          searchState={props.searchState}
        />
      </ZStack>
    </HStack>
  )
})

const RestaurantListItemContent = memo(
  graphql((props: RestaurantListItemProps) => {
    const { rank, restaurantId, restaurantSlug, currentLocationInfo } = props
    const om = useOvermind()
    const pad = 18
    const isSmall = useMediaQueryIsSmall()
    const [state, setState] = useState({
      showAddComment: false,
    })
    const showAddComment =
      state.showAddComment || isEditingUserPage(props.searchState, om.state)
    const adjustRankingLeft = 36
    const leftPad = 25
    const restaurant = restaurantQuery(restaurantSlug)

    useEffect(() => {
      if (!!restaurant.name && props.onFinishRender) {
        props.onFinishRender!()
      }
    }, [restaurant.name])

    const contentWidth = '40%'
    const paddingTop = 25
    const paddingBottom = 5

    console.log('RestaurantListItemContent.render')

    return (
      <HStack alignItems="flex-start" justifyContent="flex-start">
        <VStack
          className="123"
          paddingHorizontal={pad + 6}
          paddingBottom={paddingBottom}
          width={isSmall ? '50vw' : contentWidth}
          minWidth={isSmall ? '50%' : 500}
          maxWidth={isSmall ? '80vw' : contentWidth}
          position="relative"
          spacing={5}
        >
          <VStack alignItems="flex-start" width="100%">
            {/* ROW: TITLE */}
            <VStack
              paddingTop={paddingTop}
              // backgroundColor={bgLightLight}
              hoverStyle={{ backgroundColor: bgLightLight }}
              marginLeft={-adjustRankingLeft}
              width={900}
            >
              {/* VOTE */}
              <ZStack
                fullscreen
                zIndex={100}
                left={-1}
                top={-paddingTop + 3}
                height={120}
                justifyContent="center"
                pointerEvents="none"
              >
                <ZStack position="absolute" top={24} left={17}>
                  <RestaurantUpVoteDownVote restaurantId={restaurantId} />
                </ZStack>

                <RankingView rank={rank} />
              </ZStack>

              {/* LINK */}
              <Link
                tagName="div"
                name="restaurant"
                params={{ slug: restaurantSlug }}
              >
                <VStack>
                  <HStack
                    paddingLeft={40}
                    alignItems="center"
                    marginVertical={-3}
                  >
                    {/* SECOND LINK WITH actual <a /> */}
                    <Link name="restaurant" params={{ slug: restaurantSlug }}>
                      <Text
                        selectable
                        ellipse
                        color="#000"
                        fontSize={22}
                        fontWeight="500"
                        textDecorationColor="transparent"
                      >
                        {restaurant.name}
                      </Text>
                    </Link>
                  </HStack>

                  <Spacer size={12} />

                  {/* TITLE ROW: Ranking + TAGS */}
                  <HStack
                    paddingLeft={leftPad + 18}
                    spacing={12}
                    alignItems="center"
                    marginBottom={-2}
                  >
                    <RestaurantRatingViewPopover
                      size="sm"
                      restaurantSlug={restaurantSlug}
                    />
                    <RestaurantTagsRow
                      subtle
                      showMore={true}
                      restaurantSlug={restaurantSlug}
                      divider={<></>}
                    />
                    <RestaurantLenseVote />
                  </HStack>
                </VStack>

                {/* <Divider noGap zIndex={-1} /> */}
              </Link>
            </VStack>

            <Spacer size={14} />

            {/* ROW: COMMENT */}
            <VStack
              paddingLeft={3}
              paddingRight={20}
              borderLeftColor="#eee"
              borderLeftWidth={2}
            >
              <RestaurantTopReview restaurantId={restaurantId} />
            </VStack>

            <Spacer size={20} />

            {/* ROW: BOTTOM INFO */}
            <HStack paddingLeft={10} alignItems="center" spacing>
              <RestaurantFavoriteStar restaurantId={restaurantId} />

              <VStack
                pressStyle={{
                  opacity: 0.6,
                }}
                onPressOut={() =>
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
              </VStack>

              <Divider vertical />

              <RestaurantDetailRow size="sm" restaurantSlug={restaurantSlug} />

              {!!restaurant.address && (
                <Text fontSize={13} selectable color="#555">
                  <Link
                    inline
                    target="_blank"
                    href={`https://www.google.com/maps/search/?api=1&${encodeURIComponent(
                      restaurant.address
                    )}`}
                  >
                    {getAddressText(
                      currentLocationInfo,
                      restaurant.address,
                      'xs'
                    )}
                  </Link>
                </Text>
              )}
            </HStack>
          </VStack>

          {showAddComment && (
            <>
              <Spacer size="lg" />
              <RestaurantAddComment restaurantId={restaurantId} />
            </>
          )}
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

const RestaurantPeek = memo(
  graphql(function RestaurantPeek(props: {
    size?: 'lg' | 'md'
    restaurantSlug: string
    searchState: HomeStateItemSearch
  }) {
    const drawerWidth = useHomeDrawerWidth()
    const { searchState, size = 'md' } = props
    const tag_names = Object.keys(searchState?.activeTagIds || {})
    const spacing = size == 'lg' ? 8 : 6
    const isMedium = useMediaQueryIsMedium()
    const restaurant = restaurantQuery(props.restaurantSlug)
    const allPhotos = restaurantPhotosForCarousel({
      restaurant,
      tag_names,
    })
    const photos = allPhotos.slice(0, 5)
    const dishSize = (size === 'lg' ? 220 : 180) * (isMedium ? 0.85 : 1)
    const [isLoaded, setIsLoaded] = useState(false)

    return (
      <HomeScrollViewHorizontal
        onScroll={async (e) => {
          if (!isLoaded) {
            await fullyIdle()
            setIsLoaded(true)
          }
          console.log('e', e, e.target)
        }}
        scrollEventThrottle={100}
      >
        <VStack
          position="relative"
          marginRight={-spacing}
          marginBottom={-spacing}
          paddingLeft={0.63 * drawerWidth}
        >
          <HStack
            pointerEvents="auto"
            padding={20}
            paddingTop={40}
            paddingBottom={50}
            height={dishSize + 50 + 40}
            spacing={spacing}
          >
            {photos.map((photo, i) => {
              if (!isLoaded) {
                if (i > 1) {
                  return (
                    <Squircle size={dishSize} key={i}>
                      <Text>...</Text>
                    </Squircle>
                  )
                }
              }
              return (
                <DishView
                  key={i}
                  size={dishSize}
                  restaurantSlug={props.restaurantSlug}
                  dish={photo}
                />
              )
            })}
          </HStack>
        </VStack>
      </HomeScrollViewHorizontal>
    )
  })
)
