import { fullyIdle } from '@dish/async'
import { graphql, restaurantPhotosForCarousel } from '@dish/graph'
import {
  AbsoluteVStack,
  HStack,
  LoadingItems,
  Spacer,
  Text,
  VStack,
  useDebounceEffect,
} from '@dish/ui'
import React, { Suspense, memo, useEffect, useState } from 'react'

import { bgLight, bgLightLight, brandColor } from '../../colors'
import { GeocodePlace, HomeStateItemSearch } from '../../state/home'
import { useOvermindStatic } from '../../state/useOvermind'
import { Link } from '../../views/ui/Link'
import { DishView } from './DishView'
import { HomeScrollViewHorizontal } from './HomeScrollView'
import { useMediaQueryIsSmall } from './HomeViewDrawer'
import { RankingView } from './RankingView'
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
  const om = useOvermindStatic()
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
      <AbsoluteVStack fullscreen top={12} zIndex={10} pointerEvents="none">
        <RestaurantPeek
          restaurantSlug={props.restaurantSlug}
          searchState={props.searchState}
        />
      </AbsoluteVStack>
    </HStack>
  )
})

const RestaurantListItemContent = memo(
  graphql((props: RestaurantListItemProps) => {
    const { rank, restaurantId, restaurantSlug, currentLocationInfo } = props
    const pad = 18
    const isSmall = useMediaQueryIsSmall()
    // note static for now... caused big perf issue
    // const isEditing = isEditingUserPage(props.searchState, omStatic.state)
    const adjustRankingLeft = 36
    const leftPad = 25
    const restaurant = restaurantQuery(restaurantSlug)

    useEffect(() => {
      if (!!restaurant.name && props.onFinishRender) {
        props.onFinishRender!()
      }
    }, [restaurant.name])

    const paddingTop = 30

    return (
      <HStack
        alignItems="flex-start"
        justifyContent="flex-start"
        contain="layout paint"
      >
        <VStack
          paddingHorizontal={pad + 6}
          width={isSmall ? '80%' : '100%'}
          minWidth={isSmall ? '50%' : 320}
          maxWidth={isSmall ? '90vw' : '50%'}
          position="relative"
        >
          <VStack flex={1} alignItems="flex-start" width="100%">
            {/* ROW: TITLE */}
            <VStack
              // backgroundColor={bgLightLight}
              hoverStyle={{ backgroundColor: bgLightLight }}
              pressStyle={{ backgroundColor: bgLight }}
              marginLeft={-adjustRankingLeft}
              width={950}
              position="relative"
            >
              {/* VOTE */}
              <AbsoluteVStack
                zIndex={100}
                left={-1}
                height={120}
                bottom={-40}
                justifyContent="center"
                pointerEvents="none"
              >
                <AbsoluteVStack position="absolute" top={24} left={17}>
                  <RestaurantUpVoteDownVote restaurantId={restaurantId} />
                </AbsoluteVStack>

                <RankingView rank={rank} />
              </AbsoluteVStack>

              {/* LINK */}
              <Link
                tagName="div"
                name="restaurant"
                params={{ slug: restaurantSlug }}
              >
                <VStack paddingTop={paddingTop}>
                  <HStack paddingLeft={40} alignItems="center" maxWidth="50%">
                    {/* SECOND LINK WITH actual <a /> */}
                    <Text
                      selectable
                      maxWidth="100%"
                      fontSize={20}
                      fontWeight="500"
                      lineHeight={27}
                      marginVertical={-4}
                      textDecorationColor="transparent"
                    >
                      <Link
                        inline
                        color="#000"
                        name="restaurant"
                        params={{ slug: restaurantSlug }}
                      >
                        <Text
                          marginRight={10}
                          borderBottomColor="#f2f2f2"
                          borderBottomWidth={2}
                          // @ts-ignore
                          hoverStyle={{
                            borderBottomColor: '#000',
                          }}
                          pressStyle={{
                            borderBottomColor: brandColor,
                          }}
                        >
                          {(restaurant.name ?? '').slice(0, 1000)}
                        </Text>
                      </Link>
                      {!!restaurant.address && (
                        <Text fontSize={14} fontWeight="300" selectable>
                          <Link
                            inline
                            color="#999"
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
                    </Text>
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

            <Spacer size={8} />

            {/* ROW: COMMENT */}
            <VStack>
              <Suspense fallback={<LoadingItems />}>
                <RestaurantTopReviews
                  restaurantId={restaurantId}
                  afterTopCommentButton={
                    <HStack
                      flex={1}
                      spacing
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      <RestaurantDeliveryButton restaurantId={restaurantId} />
                      <Spacer size={8} />
                      <RestaurantDetailRow
                        size="sm"
                        restaurantSlug={restaurantSlug}
                      />
                    </HStack>
                  }
                />
              </Suspense>
            </VStack>

            <Spacer />
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
    const spacing = size == 'lg' ? 16 : 12
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
          paddingLeft={isSmall ? '63vw' : 0.63 * drawerWidth}
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
                    <Squircle width={dishSize * 0.8} height={dishSize} key={i}>
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
