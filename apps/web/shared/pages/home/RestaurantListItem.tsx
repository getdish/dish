import { fullyIdle, series } from '@dish/async'
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
import { omStatic, useOvermindStatic } from '../../state/useOvermind'
import { Link } from '../../views/ui/Link'
import { DishView } from './DishView'
import { HomeScrollViewHorizontal } from './HomeScrollView'
import { RankingView } from './RankingView'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantDeliveryButton } from './RestaurantDeliveryButton'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantFavoriteStar } from './RestaurantFavoriteStar'
import { RestaurantLenseVote } from './RestaurantLenseVote'
import { RestaurantOverview } from './RestaurantOverview'
import { RestaurantRatingViewPopover } from './RestaurantRatingViewPopover'
import { RestaurantTagsRow } from './RestaurantTagsRow'
import { RestaurantTopReviews } from './RestaurantTopReviews'
import { RestaurantUpVoteDownVote } from './RestaurantUpVoteDownVote'
import { Squircle } from './Squircle'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'
import { useMediaQueryIsSmall } from './useMediaQueryIs'
import { useRestaurantQuery } from './useRestaurantQuery'

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
      <AbsoluteVStack fullscreen top={14} zIndex={10} pointerEvents="none">
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
    const restaurant = useRestaurantQuery(restaurantSlug)

    useEffect(() => {
      if (!!restaurant.name && props.onFinishRender) {
        return series([() => fullyIdle({ min: 50 }), props.onFinishRender!])
      }
    }, [restaurant.name])

    const paddingTop = 30
    const restaurantName = (restaurant.name ?? '').slice(0, 300)

    return (
      <HStack
        alignItems="flex-start"
        justifyContent="flex-start"
        contain="layout paint"
        // prevent jitter/layout moving until loaded
        display={restaurant.name === null ? 'none' : 'flex'}
      >
        <VStack
          paddingHorizontal={pad + 6}
          width={isSmall ? '60%' : '100%'}
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
                left={4}
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
                  <HStack paddingLeft={40} alignItems="center" maxWidth="40%">
                    {/* SECOND LINK WITH actual <a /> */}
                    <Text
                      selectable
                      maxWidth="100%"
                      fontSize={
                        (isSmall ? 22 : 26) *
                        (restaurantName.length > 20 ? 0.85 : 1)
                      }
                      fontWeight="600"
                      lineHeight={26}
                      marginVertical={-4}
                      textDecorationColor="transparent"
                    >
                      <Link
                        color="#000"
                        name="restaurant"
                        params={{ slug: restaurantSlug }}
                      >
                        <Text
                          marginRight={10}
                          borderBottomColor="transparent"
                          borderBottomWidth={2}
                          // @ts-ignore
                          hoverStyle={{
                            borderBottomColor: '#f2f2f2',
                          }}
                          pressStyle={{
                            borderBottomColor: brandColor,
                          }}
                        >
                          {restaurantName}
                        </Text>
                      </Link>
                      {!!restaurant.address && (
                        <RestaurantAddress
                          size="xs"
                          currentLocationInfo={currentLocationInfo}
                          address={restaurant.address}
                        />
                      )}
                    </Text>
                  </HStack>

                  <Spacer size={8} />

                  {/* TITLE ROW: Ranking + TAGS */}
                  <HStack paddingLeft={leftPad + 24} alignItems="center">
                    <RestaurantRatingViewPopover
                      size="sm"
                      restaurantSlug={restaurantSlug}
                    />
                    <Spacer size={10} />
                    <RestaurantFavoriteStar restaurantId={restaurantId} />
                    <Spacer size={6} />
                    <RestaurantTagsRow
                      subtle
                      showMore={true}
                      restaurantSlug={restaurantSlug}
                    />
                    <RestaurantLenseVote />
                  </HStack>
                </VStack>
              </Link>
            </VStack>

            <Spacer />

            {/* ROW: Overview / Reviews / Comment */}
            <VStack>
              <Text fontSize={14} lineHeight={21}>
                <Suspense fallback={<LoadingItems />}>
                  <RestaurantOverview />
                </Suspense>
              </Text>
              <Spacer />
              <Suspense fallback={<LoadingItems />}>
                <RestaurantTopReviews
                  restaurantId={restaurantId}
                  afterTopCommentButton={
                    // comments
                    <HStack
                      flex={1}
                      spacing
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      <Suspense fallback={null}>
                        <RestaurantDeliveryButton restaurantId={restaurantId} />
                        <Spacer size={8} />
                        <RestaurantDetailRow
                          size="sm"
                          restaurantSlug={restaurantSlug}
                        />
                      </Suspense>
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
    const tag_names = [
      searchState.searchQuery.toLowerCase(),
      ...Object.keys(searchState?.activeTagIds || {}).filter((x) => {
        const type = omStatic.state.home.allTags[x].type
        return type != 'lense' && type != 'filter' && type != 'outlier'
      }),
    ]
    const spacing = size == 'lg' ? 16 : 12
    const isSmall = useMediaQueryIsSmall()
    const restaurant = useRestaurantQuery(props.restaurantSlug)
    const photos = restaurantPhotosForCarousel({
      restaurant,
      tag_names,
      max: 5,
    })
    const dishSize = size === 'lg' ? 200 : 150
    const [isLoaded, setIsLoaded] = useState(false)

    return (
      <HomeScrollViewHorizontal
        onScroll={
          isLoaded
            ? null
            : async (e) => {
                await fullyIdle()
                setIsLoaded(true)
              }
        }
        scrollEventThrottle={100}
      >
        <VStack
          position="relative"
          marginRight={-spacing}
          marginBottom={-spacing}
          paddingLeft={isSmall ? '73vw' : 0.63 * drawerWidth}
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
