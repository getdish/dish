import { fullyIdle, series } from '@dish/async'
import { graphql, restaurantPhotosForCarousel } from '@dish/graph'
import { Activity } from '@dish/react-feather'
import {
  AbsoluteVStack,
  HStack,
  Spacer,
  StackProps,
  SuperScriptText,
  Text,
  Tooltip,
  VStack,
  useDebounce,
  useGet,
} from '@dish/ui'
import { useStore } from '@dish/use-store'
import React, { Suspense, memo, useEffect, useState } from 'react'
import { Dimensions } from 'react-native'

import { bgLight, bgLightLight, brandColor, lightBlue } from '../../colors'
import { isWeb } from '../../constants'
import { isWebIOS } from '../../helpers/isIOS'
import { useIsNarrow } from '../../hooks/useIs'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { allTags } from '../../state/allTags'
import { GeocodePlace, HomeStateItemSearch } from '../../state/home-types'
import { omStatic } from '../../state/omStatic'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollView'
import { DishView } from '../../views/dish/DishView'
import { RestaurantOverview } from '../../views/restaurant/RestaurantOverview'
import { RestaurantUpVoteDownVote } from '../../views/restaurant/RestaurantUpVoteDownVote'
import { Link } from '../../views/ui/Link'
import { SmallButton, smallButtonBaseStyle } from '../../views/ui/SmallButton'
import { Squircle } from '../../views/ui/Squircle'
import { ensureFlexText } from './ensureFlexText'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantDeliveryButtons } from './RestaurantDeliveryButtons'
import { openingHours, priceRange } from './RestaurantDetailRow'
import { RestaurantFavoriteButton } from './RestaurantFavoriteButton'
import {
  RestaurantRatingBreakdown,
  RestaurantReviewsDisplayStore,
} from './RestaurantRatingBreakdown'
import RestaurantRatingView from './RestaurantRatingView'
import { RestaurantScoreBreakdownSmall } from './RestaurantScoreBreakdownSmall'
import { RestaurantSourcesBreakdownRow } from './RestaurantSourcesBreakdownRow'
import { useTotalReviews } from './useTotalReviews'

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
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const setHoveredSlow = useDebounce(
    omStatic.actions.home.setHoveredRestaurant,
    50
  )
  const store = useStore(RestaurantReviewsDisplayStore, {
    id: props.restaurantId,
  })

  useEffect(() => {
    if (isHovered) {
      setHoveredSlow({
        id: props.restaurantId,
        slug: props.restaurantSlug,
      })
    } else {
      if (
        omStatic.state.home.hoveredRestaurant &&
        omStatic.state.home.hoveredRestaurant?.slug === props.restaurantSlug
      ) {
        omStatic.actions.home.setIsHoveringRestaurant(false)
      }
    }
  }, [isHovered])

  return (
    <VStack
      {...(!isWebIOS && {
        onHoverIn: () => setIsHovered(true),
        onHoverOut: () => {
          setIsHovered(false)
          setHoveredSlow.cancel()
        },
      })}
      alignItems="center"
      overflow="hidden"
      maxWidth="100%"
      position="relative"
      className="restaurant-list-item"
      marginBottom={5}
    >
      <ContentScrollViewHorizontal
        onScroll={
          isLoaded
            ? undefined
            : async (e) => {
                await fullyIdle()
                setIsLoaded(true)
              }
        }
        scrollEventThrottle={100}
      >
        <RestaurantListItemContent isLoaded={isLoaded} {...props} />
      </ContentScrollViewHorizontal>

      {store.showComments && (
        <VStack>
          <RestaurantRatingBreakdown closable {...props} />
        </VStack>
      )}
    </VStack>
  )
})

const RestaurantListItemContent = memo(
  graphql((props: RestaurantListItemProps & { isLoaded: boolean }) => {
    const {
      rank,
      restaurantId,
      restaurantSlug,
      currentLocationInfo,
      isLoaded,
    } = props
    const pad = 18
    const isSmall = useIsNarrow()
    const reviewDisplayStore = useStore(RestaurantReviewsDisplayStore, {
      id: restaurantId,
    })
    const restaurant = useRestaurantQuery(restaurantSlug)

    useEffect(() => {
      if (!!restaurant.name && props.onFinishRender) {
        return series([() => fullyIdle({ min: 50 }), props.onFinishRender!])
      }
    }, [restaurant.name])

    const restaurantName = (restaurant.name ?? '').slice(0, 300)
    const curState = omStatic.state.home.currentState
    const tagIds = 'activeTagIds' in curState ? curState.activeTagIds : {}
    const score = restaurant.score ?? 0
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

    const contentSideWidthProps: StackProps = {
      width: isSmall ? '90%' : '60%',
      minWidth: isSmall
        ? isWeb
          ? '52vw'
          : Dimensions.get('screen').width * 0.75
        : 320,
      maxWidth: isSmall
        ? isWeb
          ? '80vw'
          : Dimensions.get('screen').width * 0.75
        : 430,
    }

    const [open_text, open_color, opening_hours] = openingHours(restaurant)
    const [price_label, price_color, price_range] = priceRange(restaurant)
    const totalReviews = useTotalReviews(restaurant)

    return (
      <VStack
        className="hover-faded-in-parent"
        alignItems="flex-start"
        justifyContent="flex-start"
        flex={1}
        // turn this off breaks something? but hides the rest of title hover?
        // overflow="hidden"
        // prevent jitter/layout moving until loaded
        display={restaurant.name === null ? 'none' : 'flex'}
        borderLeftWidth={2}
        borderLeftColor={isActive ? brandColor : 'transparent'}
        paddingHorizontal={pad}
        position="relative"
      >
        <VStack flex={1} alignItems="flex-start" maxWidth="100%">
          {/* ROW: TITLE */}
          <VStack
            // backgroundColor={bgLightLight}
            hoverStyle={{ backgroundColor: bgLightLight }}
            marginLeft={-pad}
            paddingLeft={pad}
            paddingBottom={4}
            marginBottom={-4}
            width={950}
            position="relative"
          >
            {/* LINK */}
            <Link
              tagName="div"
              name="restaurant"
              params={{ slug: restaurantSlug }}
            >
              <VStack paddingTop={20}>
                <HStack marginLeft={-8} alignItems="center" maxWidth="40%">
                  <VStack position="relative" marginVertical={-14} zIndex={10}>
                    <RestaurantUpVoteDownVote
                      score={score}
                      restaurantId={restaurantId}
                      restaurantSlug={restaurantSlug}
                      activeTagIds={tagIds ?? {}}
                    />
                  </VStack>
                  <Spacer />

                  {/* SECOND LINK WITH actual <a /> */}
                  <Text
                    selectable
                    maxWidth="100%"
                    width="100%"
                    fontWeight="500"
                    lineHeight={26}
                    textDecorationColor="transparent"
                    {...(!isWeb && {
                      minWidth: contentSideWidthProps.minWidth,
                    })}
                  >
                    <Link
                      color="#000"
                      name="restaurant"
                      params={{ slug: restaurantSlug }}
                    >
                      <HStack>
                        <VStack
                          width={38}
                          height={38}
                          {...(isWeb && {
                            marginLeft: -18,
                            marginTop: -10,
                            marginRight: -4,
                          })}
                          {...(!isWeb && {
                            marginLeft: -6,
                            marginTop: -10,
                            marginRight: 0,
                          })}
                          marginBottom={-22}
                          position="relative"
                          backgroundColor={bgLight}
                          borderRadius={1000}
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text
                            color="#777"
                            transform={[{ translateY: -0 }]}
                            textAlign="center"
                            lineHeight={38}
                          >
                            <SuperScriptText
                              transform={[{ translateY: -4 }]}
                              fontSize={11}
                            >
                              #
                            </SuperScriptText>
                            <Text
                              fontSize={+rank > 9 ? 14 : 24}
                              fontWeight="300"
                              color="#000"
                            >
                              {rank}
                            </Text>
                          </Text>
                        </VStack>
                        <Spacer size="md" />
                        <Text
                          fontSize={
                            1.3 *
                            (isSmall ? 20 : 22) *
                            (restaurantName.length > 25 ? 0.85 : 1)
                          }
                          fontWeight="600"
                          marginRight={10}
                          borderBottomColor="transparent"
                          borderBottomWidth={1}
                          // @ts-ignore
                          hoverStyle={{
                            borderBottomColor: lightBlue,
                          }}
                          pressStyle={{
                            borderBottomColor: brandColor,
                          }}
                        >
                          {restaurantName}
                        </Text>
                      </HStack>
                      <Spacer size="xs" />
                    </Link>
                  </Text>
                </HStack>
              </VStack>
            </Link>

            {/* RANKING ROW */}
            <VStack
              {...contentSideWidthProps}
              zIndex={1000}
              paddingLeft={30}
              paddingRight={20}
            >
              <Spacer size={10} />

              <HStack
                alignItems="center"
                cursor="pointer"
                onPress={reviewDisplayStore.toggleShowComments}
                spacing="lg"
              >
                {!!restaurant.address && (
                  <RestaurantAddress
                    size="sm"
                    currentLocationInfo={currentLocationInfo!}
                    address={restaurant.address}
                  />
                )}

                <Text fontSize={14} color={`rgba(0,0,0,0.6)`}>
                  {price_range}
                </Text>

                <Link
                  name="restaurantHours"
                  params={{ slug: restaurantSlug }}
                  color={open_color}
                  ellipse
                >
                  {opening_hours}
                </Link>
              </HStack>

              {/* <HStack position="relative">
                <AbsoluteVStack
                  top={-12}
                  left={-34}
                  width={26}
                  height={26}
                  overflow="hidden"
                >
                  <AbsoluteVStack
                    top={-18}
                    left={3}
                    width={40}
                    height={40}
                    transform={[{ rotate: '45deg' }]}
                    className="dotted-line"
                    borderRadius={100}
                  />
                </AbsoluteVStack>

                <HStack flex={1} alignItems="center">
                  <VStack flex={1} />
                  <RestaurantScoreBreakdownSmall
                    restaurantId={restaurantId}
                    restaurantSlug={restaurantSlug}
                  />
                </HStack>
              </HStack> */}
            </VStack>
          </VStack>

          <Spacer size="lg" />

          {/* ROW: OVERVIEW / PEEK */}
          <HStack flex={1} maxWidth="100%">
            <VStack
              {...contentSideWidthProps}
              className="fix-safari-shrink-height"
              justifyContent="center"
              flexShrink={0}
              marginRight={20}
              paddingLeft={10}
            >
              {/* ensures it always flexes all the way even if short text */}
              {ensureFlexText}
              <RestaurantOverview restaurantSlug={restaurantSlug} inline />
            </VStack>

            <RestaurantPeekDishes
              restaurantSlug={props.restaurantSlug}
              searchState={props.searchState}
              isLoaded={isLoaded}
            />
          </HStack>

          <Spacer size="sm" />

          {/* BOTTOM ROW */}

          <Suspense fallback={null}>
            <HStack
              flex={1}
              alignItems="center"
              flexWrap="wrap"
              minWidth={contentSideWidthProps.minWidth}
            >
              <VStack>
                <Tooltip
                  contents={`Rating Breakdown (${totalReviews} reviews)`}
                >
                  <SmallButton
                    isActive={reviewDisplayStore.showComments}
                    onPress={reviewDisplayStore.toggleShowComments}
                  >
                    <HStack alignItems="center">
                      <VStack marginVertical={-10} marginRight={8}>
                        <RestaurantRatingView
                          size="xs"
                          restaurantSlug={props.restaurantSlug}
                        />
                      </VStack>
                      <Text color="rgba(0,0,0,0.5)" fontSize={14}>
                        {totalReviews}
                      </Text>
                    </HStack>
                  </SmallButton>
                </Tooltip>
              </VStack>

              <Spacer />

              <RestaurantFavoriteButton size="md" restaurantId={restaurantId} />

              <Spacer />

              <RestaurantDeliveryButtons
                {...smallButtonBaseStyle}
                label="Delivery"
                restaurantSlug={restaurantSlug}
              />

              <Spacer />
              <VStack flex={1} />

              <RestaurantSourcesBreakdownRow
                size="sm"
                restaurantId={restaurantId}
                restaurantSlug={restaurantSlug}
              />
            </HStack>
          </Suspense>
          <Spacer />
        </VStack>
      </VStack>
    )
  })
)

const RestaurantPeekDishes = memo(
  graphql(function RestaurantPeek(props: {
    size?: 'lg' | 'md'
    restaurantSlug: string
    searchState: HomeStateItemSearch
    isLoaded: boolean
  }) {
    const { isLoaded, searchState, size = 'md' } = props
    const tag_names = [
      searchState.searchQuery.toLowerCase(),
      ...Object.keys(searchState?.activeTagIds || {}).filter((x) => {
        const isActive = searchState?.activeTagIds[x]
        if (!isActive) {
          return false
        }
        const type = allTags[x].type
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
    const dishSize = 150
    return (
      <HStack
        contain="paint layout"
        pointerEvents="auto"
        padding={20}
        marginTop={-60}
        marginBottom={-40}
        height={dishSize + 40}
        spacing={spacing}
        width={dishSize * 5}
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
    )
  })
)
