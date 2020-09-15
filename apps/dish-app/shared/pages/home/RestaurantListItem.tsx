import { fullyIdle, series } from '@dish/async'
import { graphql, restaurantPhotosForCarousel } from '@dish/graph'
import { Activity } from '@dish/react-feather'
import {
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

import { bgLightLight, brandColor, lightBlue } from '../../colors'
import { isWeb } from '../../constants'
import { allTags } from '../../state/allTags'
import { GeocodePlace, HomeStateItemSearch } from '../../state/home-types'
import { omStatic } from '../../state/omStatic'
import { Link } from '../../views/ui/Link'
import { SmallButton, smallButtonBaseStyle } from '../../views/ui/SmallButton'
import { DishView } from './DishView'
import { HomeScrollViewHorizontal } from './HomeScrollView'
import { isWebIOS } from './isIOS'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantDeliveryButtons } from './RestaurantDeliveryButtons'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantFavoriteButton } from './RestaurantFavoriteButton'
import { RestaurantOverview } from './RestaurantOverview'
import {
  RestaurantRatingBreakdown,
  RestaurantReviewsDisplayStore,
} from './RestaurantRatingBreakdown'
import RestaurantRatingView from './RestaurantRatingView'
import { RestaurantScoreBreakdownSmall } from './RestaurantScoreBreakdownSmall'
import { RestaurantUpVoteDownVote } from './RestaurantUpVoteDownVote'
import { Squircle } from './Squircle'
import { useIsNarrow } from './useIs'
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
      <HomeScrollViewHorizontal
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
      </HomeScrollViewHorizontal>

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

    const contentSideWidthProps: StackProps = {
      width: isSmall ? '90%' : '60%',
      minWidth: isSmall ? (isWeb ? '52vw' : '52%') : 320,
      maxWidth: isSmall ? (isWeb ? '80vw' : '80%') : 450,
    }

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
              <VStack paddingTop={30}>
                <HStack marginLeft={-5} alignItems="center" maxWidth="40%">
                  <VStack position="relative" marginVertical={-14}>
                    <RestaurantUpVoteDownVote
                      restaurantId={restaurantId}
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
                  >
                    <Link
                      color="#000"
                      name="restaurant"
                      params={{ slug: restaurantSlug }}
                    >
                      <Text
                        fontSize={
                          (isSmall ? 20 : 22) *
                          (restaurantName.length > 25 ? 0.85 : 1)
                        }
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
                      <Spacer size="xs" />
                    </Link>
                    {!!restaurant.address && (
                      <RestaurantAddress
                        size="xs"
                        currentLocationInfo={currentLocationInfo!}
                        address={restaurant.address}
                      />
                    )}
                  </Text>
                </HStack>
              </VStack>
            </Link>

            {/* RANKING ROW */}
            <HStack
              {...contentSideWidthProps}
              zIndex={1000}
              marginLeft={8}
              alignItems="center"
              paddingLeft={30}
              paddingRight={20}
              cursor="pointer"
              onPress={reviewDisplayStore.toggleShowComments}
            >
              <Text lineBreakMode="clip" numberOfLines={1} color="#777">
                <SuperScriptText fontSize={11}>#</SuperScriptText>
                <Text
                  fontSize={+rank > 9 ? 12 : 22}
                  fontWeight="700"
                  color="#000"
                >
                  {rank}
                </Text>
              </Text>
              <Spacer size="sm" />
              <RestaurantScoreBreakdownSmall
                restaurantId={restaurantId}
                restaurantSlug={restaurantSlug}
              />
            </HStack>
          </VStack>

          <Spacer size="md" />

          {/* ROW: OVERVIEW / PEEK */}
          <HStack flex={1} maxWidth="100%">
            <VStack
              {...contentSideWidthProps}
              justifyContent="center"
              marginRight={20}
            >
              <Text opacity={0} lineHeight={0}>
                wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
              </Text>
              <Text fontSize={16} lineHeight={24}>
                <Suspense fallback={null}>
                  <RestaurantOverview restaurantSlug={restaurantSlug} inline />
                </Suspense>
              </Text>
            </VStack>

            <RestaurantPeekDishes
              restaurantSlug={props.restaurantSlug}
              searchState={props.searchState}
              isLoaded={isLoaded}
            />
          </HStack>

          <Spacer size="lg" />

          {/* BOTTOM ROW */}

          <Suspense fallback={null}>
            <HStack flex={1} alignItems="center" flexWrap="wrap" minWidth={450}>
              <VStack>
                <Tooltip contents={`Rating Breakdown (152 reviews)`}>
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
                      <HStack className="hide-when-small">
                        <Activity color="rgba(0,0,0,0.2)" size={14} />
                        <Spacer size="sm" />
                      </HStack>
                      <Text color="rgba(0,0,0,0.5)" fontSize={14}>
                        152
                      </Text>
                    </HStack>
                  </SmallButton>
                </Tooltip>
              </VStack>

              <Spacer size="sm" />

              <HStack
                alignItems="center"
                {...smallButtonBaseStyle}
                {...{
                  // for ui-static to behave :(
                  ...{},
                  alignSelf: 'center',
                  height: 36,
                  cursor: 'initial',
                }}
              >
                <VStack marginVertical={-7} marginRight={-7}>
                  <RestaurantDeliveryButtons
                    label="Delivery"
                    restaurantSlug={restaurantSlug}
                  />
                </VStack>
              </HStack>

              <VStack flex={1} />
              <RestaurantDetailRow size="sm" restaurantSlug={restaurantSlug} />
              <RestaurantFavoriteButton size="md" restaurantId={restaurantId} />
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
    const dishSize = 130
    return (
      <HStack
        contain="paint layout"
        pointerEvents="auto"
        padding={20}
        marginTop={-60}
        marginBottom={-40}
        height={dishSize + 40}
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
    )
  })
)
