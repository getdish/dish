import { fullyIdle, series } from '@dish/async'
import { graphql, restaurantPhotosForCarousel } from '@dish/graph'
import {
  AbsoluteVStack,
  HStack,
  LoadingItems,
  Spacer,
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
import { RestaurantRatingViewPopover } from './RestaurantRatingViewPopover'
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
  const setHoveredSlow = useDebounce(om.actions.home.setHoveredRestaurant, 200)
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
        <RestaurantListItemContent {...props} />
        <RestaurantPeekDishes
          restaurantSlug={props.restaurantSlug}
          searchState={props.searchState}
          isLoaded={isLoaded}
        />
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
  graphql((props: RestaurantListItemProps) => {
    const { rank, restaurantId, restaurantSlug, currentLocationInfo } = props
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

    const tags = omStatic.state.home.lastActiveTags
    const reviewTags = sortBy(
      tags.filter((tag) => tag.name !== 'Gems'),
      (a) => (a.type === 'lense' ? 0 : a.type === 'dish' ? 2 : 1)
    )

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
        width={isSmall ? '60%' : '100%'}
        minWidth={isSmall ? '52vw' : 320}
        maxWidth={isSmall ? '60vw' : 450}
        position="relative"
      >
        <VStack flex={1} alignItems="flex-start" maxWidth="100%">
          {/* ROW: TITLE */}
          <VStack
            // backgroundColor={bgLightLight}
            hoverStyle={{ backgroundColor: bgLightLight }}
            marginLeft={-pad}
            paddingLeft={pad}
            paddingBottom={28}
            marginBottom={-28}
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
                      bottom={-4}
                      right={-12}
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
                        <Text fontSize={16} fontWeight="700" color="#444">
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
                          borderBottomColor: '#f2f2f2',
                        }}
                        pressStyle={{
                          borderBottomColor: brandColor,
                        }}
                      >
                        {restaurantName}
                      </Text>
                      <Spacer />
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
              </VStack>
            </Link>
          </VStack>

          <Spacer size={12} />

          {/* RANKING ROW */}
          <HStack zIndex={1000} marginLeft={8} alignItems="center">
            <VStack>
              <HStack alignItems="center">
                <Spacer size="xxl" />

                {/* <ScrollView
                  style={{ flex: 1 }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                > */}
                <VStack marginTop={-6}>
                  <HStack>
                    <Text
                      className="ellipse"
                      fontSize={12}
                      color="rgba(0,0,0,0.5)"
                    >
                      <Text fontSize={12}>in</Text>{' '}
                      <HStack
                        // @ts-ignore
                        display="inline-flex"
                        paddingVertical={2}
                        paddingHorizontal={4}
                        borderRadius={100}
                        borderWidth={1}
                        borderColor="#f2f2f2"
                      >
                        {reviewTags.map((tag, i) => {
                          return (
                            <React.Fragment key={i}>
                              <VStack
                                // @ts-ignore
                                display="inline-flex"
                              >
                                <Text>{tagDisplayName(tag)}</Text>
                              </VStack>
                              {i < reviewTags.length - 1 && (
                                <Text
                                  marginHorizontal={3}
                                  fontSize={10}
                                  opacity={0.5}
                                >
                                  +
                                </Text>
                              )}
                            </React.Fragment>
                          )
                        })}
                      </HStack>
                      <Text fontSize={12}> (152 reviews) </Text>
                    </Text>
                    <VStack
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
                          reviewDisplayStore.showComments
                            ? '#000'
                            : 'rgba(0,0,0,0.5)'
                        }
                      />
                    </VStack>
                  </HStack>
                  <Spacer size={6} />
                  <HStack
                    paddingLeft={10}
                    paddingRight={20}
                    cursor="pointer"
                    onPress={reviewDisplayStore.toggleShowComments}
                  >
                    <RestaurantScoreBreakdownSmall
                      restaurantSlug={restaurantSlug}
                    />
                  </HStack>
                </VStack>
                {/* </ScrollView> */}
              </HStack>
            </VStack>
          </HStack>

          <Spacer size="sm" />

          {/* ROW: Overview / Reviews / Comment */}
          <VStack
            flex={1}
            maxWidth="100%"
            overflow="hidden"
            paddingBottom={10}
            marginBottom={-10}
          >
            <VStack width="100%" paddingLeft={isSmall ? 10 : 0}>
              <Text fontSize={16} lineHeight={24}>
                <VStack marginTop={4} maxWidth="100%" flex={1}>
                  <Text opacity={0} lineHeight={0}>
                    wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
                  </Text>
                  <Text>
                    <Suspense fallback={<LoadingItems />}>
                      <RestaurantOverview
                        restaurantSlug={restaurantSlug}
                        inline
                      />
                    </Suspense>
                  </Text>
                </VStack>
              </Text>
            </VStack>

            <Spacer size="lg" />

            {/* BOTTOM ROW */}

            <Suspense fallback={null}>
              <HStack flex={1} alignItems="center" flexWrap="wrap">
                <VStack>
                  <Tooltip contents={`Rating Breakdown (152 reviews)`}>
                    <SmallButton
                      isActive={reviewDisplayStore.showComments}
                      onPress={reviewDisplayStore.toggleShowComments}
                    >
                      <HStack alignItems="center">
                        <VStack marginVertical={-10}>
                          <RestaurantRatingView
                            size="xs"
                            restaurantSlug={restaurantSlug}
                          />
                        </VStack>
                        <Spacer size="sm" />
                        <Activity size={14} />
                        <Spacer size="sm" />
                        <Text fontSize={16} opacity={0.5}>
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
                  <VStack marginVertical={-5} marginRight={-7}>
                    <RestaurantDeliveryButtons
                      label="Order"
                      restaurantSlug={restaurantSlug}
                    />
                  </VStack>
                </HStack>

                <VStack flex={1} />
                <RestaurantDetailRow
                  size="sm"
                  restaurantSlug={restaurantSlug}
                />
                <RestaurantFavoriteButton
                  size="md"
                  restaurantId={restaurantId}
                />
              </HStack>
            </Suspense>
          </VStack>

          <Spacer />
        </VStack>
      </VStack>
    )
  })
)

export const RestaurantScoreBreakdownSmall = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const sources = {
      dish: {
        rating: 3,
      },
      ...(restaurant?.sources?.() ?? {}),
    }
    return (
      <HStack position="relative" alignItems="center">
        <AbsoluteVStack
          top={-16}
          left={-40}
          width={30}
          height={30}
          overflow="hidden"
        >
          <AbsoluteVStack
            top={-18}
            left={3}
            width={44}
            height={44}
            transform={[{ rotate: '45deg' }]}
            className="dotted-line"
            borderRadius={100}
          />
        </AbsoluteVStack>

        <Text fontSize={12} opacity={0.5}>
          via&nbsp;
        </Text>
        <HStack spacing={4}>
          {Object.keys(sources)
            .filter(
              (source) => thirdPartyCrawlSources[source]?.delivery === false
            )
            .map((source, i) => {
              const item = sources[source]
              const info = thirdPartyCrawlSources[source]
              return (
                <HStack
                  key={source}
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
                        width: 16,
                        height: 16,
                        borderRadius: 100,
                      }}
                    />
                  ) : null}
                  <Text fontSize={12} opacity={0.75}>
                    {info?.name ?? source}
                  </Text>
                  <Text fontSize={13} opacity={0.5}>
                    {+(item.rating ?? 0) * 10}
                  </Text>
                </HStack>
              )
            })}
        </HStack>
      </HStack>
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
    const dishSize = 160
    return (
      <HStack
        contain="paint layout"
        pointerEvents="auto"
        padding={20}
        paddingTop={50}
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
    )
  })
)
