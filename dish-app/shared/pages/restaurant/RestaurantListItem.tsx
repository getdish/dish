import { fullyIdle, series } from '@dish/async'
import { graphql, restaurantPhotosForCarousel } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { MessageSquare } from '@dish/react-feather'
import {
  AbsoluteVStack,
  HStack,
  Spacer,
  StackProps,
  Text,
  TextSuperScript,
  Tooltip,
  VStack,
  useDebounce,
  useGet,
} from '@dish/ui'
import React, {
  Suspense,
  memo,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import { Dimensions } from 'react-native'

import { bgLight, bgLightLight, brandColor, lightBlue } from '../../colors'
import { isWeb } from '../../constants'
import { isWebIOS } from '../../helpers/isIOS'
import { useIsNarrow } from '../../hooks/useIs'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { allTags } from '../../state/allTags'
import { GeocodePlace, HomeStateItemSearch } from '../../state/home-types'
import { omStatic } from '../../state/omStatic'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
import { DishView } from '../../views/dish/DishView'
import { RestaurantOverview } from '../../views/restaurant/RestaurantOverview'
import { RestaurantUpVoteDownVote } from '../../views/restaurant/RestaurantUpVoteDownVote'
import { Link } from '../../views/ui/Link'
import {
  SmallLinkButton,
  smallButtonBaseStyle,
} from '../../views/ui/SmallButton'
import { Squircle } from '../../views/ui/Squircle'
import { ensureFlexText } from './ensureFlexText'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantDeliveryButtons } from './RestaurantDeliveryButtons'
import { priceRange } from './RestaurantDetailRow'
import { RestaurantFavoriteButton } from './RestaurantFavoriteButton'
import RestaurantRatingView from './RestaurantRatingView'
import { RestaurantSourcesBreakdownRow } from './RestaurantSourcesBreakdownRow'
import { useTotalReviews } from './useTotalReviews'

export const ITEM_HEIGHT = 300

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
    useLayoutEffect(() => {
      const getIsActiveNow = (state) => props.rank == state.home.activeIndex + 1

      if (getIsActiveNow(omStatic.state)) {
        setIsActive(true)
      }

      return omStatic.reaction(getIsActiveNow, (isActive) => {
        console.log('setting active', isActive)
        if (getIsActive() !== isActive) {
          setIsActive(isActive)
        }
      })
    }, [props.rank])

    const contentSideWidthProps: StackProps = {
      width: isSmall ? '80%' : '60%',
      minWidth: isSmall
        ? isWeb
          ? '38vw'
          : Dimensions.get('screen').width * 0.75
        : 320,
      maxWidth: isSmall
        ? isWeb
          ? '50vw'
          : Dimensions.get('screen').width * 0.75
        : 430,
    }

    const opening_hours = ''
    // const [open_text, open_color, opening_hours] = openingHours(restaurant)
    const [price_label, price_color, price_range] = priceRange(restaurant)
    const totalReviews = useTotalReviews(restaurant)
    const titleFontSize =
      1.3 *
      (isSmall ? 18 : 22) *
      (restaurantName.length > 20 ? 0.9 : restaurantName.length > 25 ? 0.85 : 1)

    return (
      <VStack
        className="hover-faded-in-parent"
        alignItems="flex-start"
        justifyContent="flex-start"
        height={ITEM_HEIGHT}
        flex={1}
        // turn this off breaks something? but hides the rest of title hover?
        // overflow="hidden"
        // prevent jitter/layout moving until loaded
        display={restaurant.name === null ? 'none' : 'flex'}
        paddingHorizontal={pad}
        position="relative"
      >
        {/* border left */}
        <AbsoluteVStack
          top={0}
          bottom={0}
          zIndex={-1}
          width={8}
          backgroundColor={isActive ? brandColor : 'transparent'}
        />

        <VStack flex={1} alignItems="flex-start" maxWidth="100%">
          {/* ROW: TITLE */}
          <VStack
            // backgroundColor={bgLightLight}
            hoverStyle={{ backgroundColor: bgLightLight }}
            // pressStyle={{ backgroundColor: bgHover }}
            marginLeft={-pad}
            paddingLeft={pad}
            paddingBottom={12}
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
                <HStack marginLeft={-4} alignItems="center" maxWidth="40%">
                  <VStack position="relative" marginVertical={-14} zIndex={10}>
                    <RestaurantUpVoteDownVote
                      score={score}
                      restaurantId={restaurantId}
                      restaurantSlug={restaurantSlug}
                      activeTagIds={tagIds ?? {}}
                    />
                  </VStack>
                  <Spacer size="sm" />

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
                            marginTop: -14,
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
                            <TextSuperScript
                              transform={[{ translateY: -4 }]}
                              fontSize={11}
                            >
                              #
                            </TextSuperScript>
                            <Text
                              fontSize={+rank > 9 ? 14 : 20}
                              fontWeight="500"
                              color="#000"
                            >
                              {rank}
                            </Text>
                          </Text>
                        </VStack>
                        <Spacer size="md" />
                        <Text
                          ellipse
                          fontSize={titleFontSize}
                          lineHeight={titleFontSize * 1.2}
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
                    </Link>
                  </Text>
                </HStack>
              </VStack>
            </Link>

            <Spacer size="sm" />

            {/* RANKING ROW */}
            <VStack
              {...contentSideWidthProps}
              zIndex={1000}
              paddingLeft={40}
              paddingRight={20}
              marginTop={isSmall ? -6 : 0}
              marginBottom={isSmall ? -12 : 0}
            >
              <Spacer size={2} />

              <HStack alignItems="center" cursor="pointer" spacing="lg">
                {!!price_range && (
                  <Text
                    fontSize={14}
                    fontWeight="500"
                    color={`rgba(0,0,0,0.6)`}
                  >
                    {price_range}
                  </Text>
                )}

                {!!opening_hours && (
                  <Link
                    name="restaurantHours"
                    params={{ slug: restaurantSlug }}
                    color="rgba(0,0,0,0.6)"
                    ellipse
                  >
                    {opening_hours}
                  </Link>
                )}

                {!!restaurant.address && (
                  <RestaurantAddress
                    size="sm"
                    currentLocationInfo={currentLocationInfo!}
                    address={restaurant.address}
                  />
                )}
              </HStack>
            </VStack>
          </VStack>

          <Spacer size="md" />

          {/* ROW: OVERVIEW / PEEK */}
          <HStack flex={1} maxWidth="100%" minHeight={120}>
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
              restaurantId={props.restaurantId}
              searchState={props.searchState}
              isLoaded={isLoaded}
            />
          </HStack>

          <Spacer size="sm" />

          {/* BOTTOM ROW */}

          <Suspense fallback={null}>
            <HStack
              width="100%"
              flex={1}
              alignItems="center"
              flexWrap="wrap"
              minWidth={contentSideWidthProps.minWidth}
            >
              <VStack>
                <Tooltip
                  contents={`Rating Breakdown (${totalReviews} reviews)`}
                >
                  <SmallLinkButton
                    name="restaurantReviews"
                    params={{
                      id: props.restaurantId,
                      slug: props.restaurantSlug,
                    }}
                  >
                    <HStack alignItems="center">
                      <VStack marginVertical={-12} marginRight={10}>
                        <RestaurantRatingView
                          size="xs"
                          restaurantSlug={props.restaurantSlug}
                        />
                      </VStack>
                      <MessageSquare size={18} color="rgba(0,0,0,0.3)" />
                    </HStack>
                  </SmallLinkButton>
                </Tooltip>
              </VStack>

              <Spacer />

              <Suspense fallback={<Spacer size={44} />}>
                <RestaurantFavoriteButton
                  size="md"
                  restaurantId={restaurantId}
                />
              </Suspense>

              <Spacer />

              <RestaurantDeliveryButtons
                {...smallButtonBaseStyle}
                label="Delivery"
                restaurantSlug={restaurantSlug}
              />

              <Spacer />

              <VStack>
                <RestaurantSourcesBreakdownRow
                  size="sm"
                  restaurantId={restaurantId}
                  restaurantSlug={restaurantSlug}
                />
              </VStack>

              <Spacer size="xl" />

              <VStack
                flex={1}
                borderBottomColor="#eee"
                borderBottomWidth={1}
                transform={[{ translateY: -0.5 }]}
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
    restaurantId: string
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
    ].filter(isPresent)
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
              restaurantId={props.restaurantId}
              dish={photo}
            />
          )
        })}
      </HStack>
    )
  })
)
