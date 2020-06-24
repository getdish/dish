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
import { Image } from 'react-native'

import {
  GeocodePlace,
  HomeStateItemSearch,
  isEditingUserPage,
} from '../../state/home'
import {
  omStatic,
  useOvermind,
  useOvermindStatic,
} from '../../state/useOvermind'
import { Link } from '../ui/Link'
import { bgLight, bgLightLight } from './colors'
import { DishView } from './DishView'
import { HomeScrollViewHorizontal } from './HomeScrollView'
import { useMediaQueryIsMedium, useMediaQueryIsSmall } from './HomeViewDrawer'
import { RankingView } from './RankingView'
import { CommentBubble, RestaurantAddComment } from './RestaurantAddComment'
import { getAddressText } from './RestaurantAddressLinksRow'
import { RestaurantDeliveryButton } from './RestaurantDeliveryButton'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantFavoriteStar } from './RestaurantFavoriteStar'
import { RestaurantLenseVote } from './RestaurantLenseVote'
import { restaurantQuery } from './restaurantQuery'
import { RestaurantRatingViewPopover } from './RestaurantRatingViewPopover'
import { RestaurantTagsRow } from './RestaurantTagsRow'
import { RestaurantTopReviews } from './RestaurantTopReviews'
import { RestaurantUpVoteDownVote } from './RestaurantUpVoteDownVote'
import { SmallButton } from './SmallButton'
import { Squircle } from './Squircle'
import { thirdPartyCrawlSources } from './thirdPartyCrawlSources'
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
  const om = useOvermindStatic()
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
        console.log('setting is hovered via active index...')
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
    const pad = 18
    const isSmall = useMediaQueryIsSmall()
    // note static for now... caused big perf issue
    isEditingUserPage(props.searchState, omStatic.state)
    const adjustRankingLeft = 36
    const leftPad = 25
    const restaurant = restaurantQuery(restaurantSlug)

    useEffect(() => {
      if (!!restaurant.name && props.onFinishRender) {
        props.onFinishRender!()
      }
    }, [restaurant.name])

    const paddingTop = 35

    console.log('RestaurantListItemContent.render', props.rank)

    return (
      <HStack
        alignItems="flex-start"
        justifyContent="flex-start"
        contain="layout paint"
      >
        <VStack
          paddingHorizontal={pad + 6}
          width={isSmall ? '80%' : '100%'}
          minWidth={isSmall ? '50%' : 380}
          maxWidth={isSmall ? '90vw' : '50%'}
          position="relative"
        >
          <VStack flex={1} alignItems="flex-start" width="100%">
            {/* ROW: TITLE */}
            <VStack
              paddingTop={paddingTop}
              hoverStyle={{ backgroundColor: bgLightLight }}
              pressStyle={{ backgroundColor: bgLight }}
              marginLeft={-adjustRankingLeft}
              width={950}
            >
              {/* VOTE */}
              <ZStack
                fullscreen
                zIndex={100}
                left={-1}
                top={paddingTop - 8}
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
                        borderBottomColor="transparent"
                        borderBottomWidth={2}
                        // @ts-ignore
                        hoverStyle={{
                          borderBottomColor: '#000',
                        }}
                      >
                        {restaurant.name}
                      </Text>
                    </Link>
                  </HStack>

                  <Spacer size={12} />

                  {/* TITLE ROW: Ranking + TAGS */}
                  <HStack paddingLeft={leftPad + 18} alignItems="center">
                    <RestaurantRatingViewPopover
                      size="sm"
                      restaurantSlug={restaurantSlug}
                    />
                    <Spacer size={16} />
                    <RestaurantFavoriteStar restaurantId={restaurantId} />
                    <Spacer size={12} />
                    <RestaurantTagsRow
                      subtle
                      showMore={true}
                      restaurantSlug={restaurantSlug}
                    />
                    <RestaurantLenseVote />
                  </HStack>
                </VStack>

                {/* <Divider noGap zIndex={-1} /> */}
              </Link>
            </VStack>

            <Spacer />

            {/* ROW: COMMENT */}
            <VStack>
              <RestaurantTopReviews
                restaurantId={restaurantId}
                afterTopCommentButton={
                  <HStack flex={1} spacing alignItems="center" flexWrap="wrap">
                    <RestaurantDeliveryButton restaurantId={restaurantId} />

                    <Divider vertical />

                    <RestaurantDetailRow
                      size="sm"
                      restaurantSlug={restaurantSlug}
                    />

                    {!!restaurant.address && (
                      <Text fontSize={12} selectable color="#999">
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
                }
              />
            </VStack>
          </VStack>
        </VStack>
      </HStack>
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
    const isSmall = useMediaQueryIsSmall()
    const restaurant = restaurantQuery(props.restaurantSlug)
    const photos = restaurantPhotosForCarousel({
      restaurant,
      tag_names,
      max: 5,
    })
    const dishSize = size === 'lg' ? 220 : 180
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
          paddingLeft={isSmall ? '55vw' : 0.63 * drawerWidth}
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
