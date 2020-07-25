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
  useGet,
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

  return (
    <HStack
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      alignItems="center"
      position="relative"
    >
      {/* dont remove overflow HIDDEN causes flex issues down */}
      <VStack overflow="hidden" className="ease-in-out-fast" flex={1}>
        <RestaurantListItemContent {...props} />
      </VStack>
      <AbsoluteVStack fullscreen top={-10} zIndex={10} pointerEvents="none">
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

    const paddingTop = 25
    const restaurantName = (restaurant.name ?? '').slice(0, 300)

    const curState = omStatic.state.home.currentState
    const tagIds = 'activeTagIds' in curState ? curState.activeTagIds : null

    const [isActive, setIsActive] = useState(false)
    const getIsActive = useGet(isActive)
    useEffect(() => {
      return omStatic.reaction(
        (state) => props.rank == state.home.activeIndex + 1,
        (isActive) => {
          if (getIsActive() !== isActive) {
            setIsActive(isActive)
          }
        }
      )
    }, [props.rank])

    console.warn(`RestaurantListItemContent.${props.rank}`)

    return (
      <HStack
        alignItems="flex-start"
        justifyContent="flex-start"
        contain="layout paint"
        // prevent jitter/layout moving until loaded
        display={restaurant.name === null ? 'none' : 'flex'}
        backgroundColor={isActive ? 'transparent' : '#fcfcfc'}
        borderTopWidth={1}
        borderTopColor={isActive ? '#eee' : 'transparent'}
        borderBottomWidth={1}
        borderBottomColor={isActive ? '#eee' : 'transparent'}
      >
        <VStack
          paddingHorizontal={pad + 6}
          width={isSmall ? '60%' : '100%'}
          minWidth={isSmall ? '50%' : 320}
          maxWidth={isSmall ? '90vw' : '62%'}
          position="relative"
          overflow="hidden"
        >
          <VStack flex={1} alignItems="flex-start" maxWidth="100%">
            {/* ROW: TITLE */}
            <VStack
              // backgroundColor={bgLightLight}
              // hoverStyle={{ backgroundColor: bgLightLight }}
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
                <AbsoluteVStack position="absolute" top={20} left={10}>
                  <RestaurantUpVoteDownVote
                    restaurantId={restaurantId}
                    activeTagIds={tagIds ?? {}}
                  />
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
                        (isSmall ? 20 : 22) *
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
                          fontWeight="500"
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
                      showMore
                      restaurantSlug={restaurantSlug}
                      restaurantId={restaurantId}
                    />
                    <RestaurantLenseVote restaurantId={restaurantId} />
                  </HStack>
                </VStack>
              </Link>
            </VStack>

            <Spacer size="sm" />

            {/* ROW: Overview / Reviews / Comment */}
            <VStack
              flex={1}
              maxWidth="100%"
              overflow="hidden"
              paddingBottom={10}
              marginBottom={-10}
            >
              <VStack flex={1} paddingLeft={0}>
                <Text fontSize={16} lineHeight={21}>
                  <Suspense fallback={<LoadingItems />}>
                    <RestaurantOverview />
                  </Suspense>
                </Text>
              </VStack>
              <Spacer size="xs" />
              <Suspense fallback={<LoadingItems />}>
                <RestaurantTopReviews
                  restaurantId={restaurantId}
                  afterTopCommentButton={
                    // comments
                    <Suspense fallback={null}>
                      <HStack
                        flex={1}
                        spacing
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        <RestaurantDeliveryButton
                          restaurantSlug={restaurantSlug}
                        />
                        <VStack flex={1} />
                        <RestaurantDetailRow
                          size="sm"
                          restaurantSlug={restaurantSlug}
                        />
                      </HStack>
                    </Suspense>
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
        const isActive = searchState?.activeTagIds[x]
        if (!isActive) {
          return false
        }
        const type = omStatic.state.home.allTags[x].type
        return type != 'lense' && type != 'filter' && type != 'outlier'
      }),
    ].filter(Boolean)
    const spacing = size == 'lg' ? 16 : 12
    const restaurant = useRestaurantQuery(props.restaurantSlug)
    const photos = restaurantPhotosForCarousel({
      restaurant,
      tag_names,
      max: 5,
    })
    const dishSize = size === 'lg' ? 150 : 140
    const [isLoaded, setIsLoaded] = useState(false)
    const paddingLeftSmall =
      (0.75 + (1 / (drawerWidth / 950 + 0.0001)) * 0.1) * drawerWidth
    const paddingLeft =
      drawerWidth < 600 ? paddingLeftSmall : 0.65 * drawerWidth

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
          paddingLeft={paddingLeft}
          // className="ease-in-out"
          contain="paint layout"
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
