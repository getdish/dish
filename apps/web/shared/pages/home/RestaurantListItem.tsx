import { fullyIdle, series } from '@dish/async'
import { graphql, restaurantPhotosForCarousel } from '@dish/graph'
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
import { sortBy } from 'lodash'
import React, { Suspense, memo, useEffect, useState } from 'react'
import { Activity, HelpCircle } from 'react-feather'
import { Image } from 'react-native'

import { bgLight, bgLightLight, brandColor } from '../../colors'
import { GeocodePlace, HomeStateItemSearch } from '../../state/home-types'
import { omStatic, useOvermindStatic } from '../../state/om'
import { tagDisplayName } from '../../state/tagDisplayName'
import { Link } from '../../views/ui/Link'
import { SmallButton, smallButtonBaseStyle } from '../../views/ui/SmallButton'
import { DishView } from './DishView'
import { HomeScrollViewHorizontal } from './HomeScrollView'
import { isIOS } from './isIOS'
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
import { RestaurantUpVoteDownVote } from './RestaurantUpVoteDownVote'
import { Squircle } from './Squircle'
import { thirdPartyCrawlSources } from './thirdPartyCrawlSources'
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
  const [isLoaded, setIsLoaded] = useState(false)
  const setHoveredSlow = useDebounce(om.actions.home.setHoveredRestaurant, 50)
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
        om.state.home.hoveredRestaurant &&
        om.state.home.hoveredRestaurant?.slug === props.restaurantSlug
      ) {
        om.actions.home.setIsHoveringRestaurant(false)
      }
    }
  }, [isHovered])

  return (
    <VStack
      {...(!isIOS && {
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
    const isSmall = useMediaQueryIsSmall()
    const reviewDisplayStore = useStore(RestaurantReviewsDisplayStore, {
      id: restaurantId,
    })
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

    const contentSideWidthProps: StackProps = {
      width: isSmall ? '90%' : '60%',
      minWidth: isSmall ? '52vw' : 320,
      maxWidth: isSmall ? '80vw' : 450,
    }

    return (
      <VStack
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
              <VStack paddingTop={paddingTop}>
                <HStack marginLeft={-5} alignItems="center" maxWidth="40%">
                  <VStack position="relative" marginVertical={-14}>
                    <RestaurantUpVoteDownVote
                      restaurantId={restaurantId}
                      activeTagIds={tagIds ?? {}}
                    />

                    <AbsoluteVStack
                      bottom={-10}
                      right={-14}
                      borderRadius={100}
                      width={24}
                      height={24}
                      zIndex={1000}
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor="#fff"
                      borderWidth={1}
                      borderColor="#eee"
                    >
                      <Text color="#999">
                        <SuperScriptText fontSize={10}>#</SuperScriptText>
                        <Text
                          fontSize={+rank > 9 ? 10 : 14}
                          fontWeight="700"
                          color="#777"
                        >
                          {rank}
                        </Text>
                      </Text>
                    </AbsoluteVStack>
                  </VStack>
                  <Spacer />

                  {/* SECOND LINK WITH actual <a /> */}
                  <Text
                    selectable
                    maxWidth="100%"
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
                          (isSmall ? 20 : 24) *
                          (restaurantName.length > 25 ? 0.85 : 1)
                        }
                        marginRight={10}
                        borderBottomColor="transparent"
                        borderBottomWidth={2}
                        // @ts-ignore
                        hoverStyle={{
                          borderBottomColor: '#999',
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
              paddingLeft={40}
              paddingRight={20}
              cursor="pointer"
              onPress={reviewDisplayStore.toggleShowComments}
            >
              <RestaurantScoreBreakdownSmall
                restaurantId={restaurantId}
                restaurantSlug={restaurantSlug}
              />
            </HStack>
          </VStack>

          <Spacer size="sm" />

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
                      <HStack className="hide-when-small">
                        <Activity size={14} />
                        <Spacer size="sm" />
                      </HStack>
                      <Text color="rgba(0,0,0,0.5)" fontSize={16}>
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
                    label="🚗"
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

export const RestaurantScoreBreakdownSmall = memo(
  graphql(
    ({
      restaurantSlug,
      restaurantId,
    }: {
      restaurantSlug: string
      restaurantId: string
    }) => {
      const reviewDisplayStore = useStore(RestaurantReviewsDisplayStore, {
        id: restaurantId,
      })
      const restaurant = useRestaurantQuery(restaurantSlug)
      const sources = {
        dish: {
          rating: 3,
        },
        ...(restaurant?.sources?.() ?? {}),
      }
      const tags = omStatic.state.home.lastActiveTags
      const reviewTags = sortBy(
        tags.filter((tag) => tag.name !== 'Gems'),
        (a) => (a.type === 'lense' ? 0 : a.type === 'dish' ? 2 : 1)
      )
      return (
        <HStack position="relative" alignItems="center" flexWrap="wrap">
          <Text
            className="ellipse"
            maxWidth="calc(min(100%, 170px))"
            fontSize={12}
            color="rgba(0,0,0,0.5)"
          >
            <Text fontSize={12}>
              in "
              <Text fontWeight="600">
                {reviewTags
                  .map((tag, i) => {
                    return tagDisplayName(tag)
                  })
                  .join(' ')}
              </Text>
              "
            </Text>{' '}
          </Text>

          <Spacer size={6} />

          {Object.keys(sources)
            .filter(
              (source) => thirdPartyCrawlSources[source]?.delivery === false
            )
            .map((source, i) => {
              const item = sources[source]
              const info = thirdPartyCrawlSources[source]
              return (
                <Tooltip
                  key={source}
                  contents={`${info.name} +${+(item.rating ?? 0) * 10} points`}
                >
                  <HStack
                    alignItems="center"
                    paddingHorizontal={5}
                    paddingVertical={3}
                    borderRadius={100}
                    // backgroundColor={bgLightLight}
                    spacing={3}
                  >
                    {info?.image ? (
                      <Image
                        source={info.image}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 100,
                        }}
                      />
                    ) : null}

                    <Text fontSize={13} opacity={0.5}>
                      {+(item.rating ?? 0) * 10}
                    </Text>
                  </HStack>
                </Tooltip>
              )
            })}

          <Spacer size="sm" />

          <VStack
            className="hide-when-small"
            padding={3}
            marginVertical={-1}
            marginLeft={3}
            borderRadius={100}
            hoverStyle={{
              backgroundColor: bgLight,
            }}
            onPress={reviewDisplayStore.toggleShowComments}
          >
            <HelpCircle
              size={14}
              color={
                reviewDisplayStore.showComments ? '#000' : 'rgba(0,0,0,0.5)'
              }
            />
          </VStack>
        </HStack>
      )
    }
  )
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
