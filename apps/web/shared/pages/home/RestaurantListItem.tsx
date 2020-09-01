import { fullyIdle, series } from '@dish/async'
import { graphql, restaurantPhotosForCarousel } from '@dish/graph'
import {
  HStack,
  LoadingItems,
  SmallTitle,
  Spacer,
  Text,
  VStack,
  useDebounce,
  useGet,
} from '@dish/ui'
import { sortBy } from 'lodash'
import React, { Suspense, memo, useEffect, useState } from 'react'
import { HelpCircle } from 'react-feather'
import { Image, ScrollView } from 'react-native'

import { bgLight, bgLightLight, brandColor } from '../../colors'
import { GeocodePlace, HomeStateItemSearch } from '../../state/home-types'
import { omStatic, useOvermindStatic } from '../../state/om'
import { tagDisplayName } from '../../state/tagDisplayName'
import { Link } from '../../views/ui/Link'
import { SmallButton, smallButtonBaseStyle } from '../../views/ui/SmallButton'
import { flatButtonStyle } from './baseButtonStyle'
import { DishView } from './DishView'
import { HomeScrollViewHorizontal } from './HomeScrollView'
import { isIOS } from './isIOS'
import { RankingView } from './RankingView'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantDeliveryButtons } from './RestaurantDeliveryButtons'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantFavoriteButton } from './RestaurantFavoriteButton'
import { RestaurantLenseVote } from './RestaurantLenseVote'
import { RestaurantOverview } from './RestaurantOverview'
import { RestaurantRatingBreakdown } from './RestaurantRatingBreakdown'
import { RestaurantRatingViewPopover } from './RestaurantRatingViewPopover'
import { RestaurantTopReviews } from './RestaurantTopReviews'
import { RestaurantUpVoteDownVote } from './RestaurantUpVoteDownVote'
import { SlantedBox } from './SlantedBox'
import { Squircle } from './Squircle'
import { TextStrong } from './TextStrong'
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
    <HStack
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
      className="hover-to-reveal-parent restaurant-list-item"
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
        <RestaurantPeek
          restaurantSlug={props.restaurantSlug}
          searchState={props.searchState}
          isLoaded={isLoaded}
        />
      </HomeScrollViewHorizontal>
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
    const restaurant = useRestaurantQuery(restaurantSlug)
    const [showBreakdown, setShowBreakdown] = useState(false)

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
            paddingBottom={20}
            marginBottom={-20}
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
                  {/* <RankingView rank={rank} /> */}

                  <RestaurantRatingViewPopover
                    size="sm"
                    restaurantSlug={restaurantSlug}
                  />

                  <Spacer />

                  {/* SECOND LINK WITH actual <a /> */}
                  <Text
                    selectable
                    maxWidth="100%"
                    fontSize={
                      (isSmall ? 18 : 24) *
                      (restaurantName.length > 25 ? 0.85 : 1)
                    }
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
              </VStack>
            </Link>
          </VStack>

          <Spacer />

          {/* RANKING ROW */}
          <HStack marginLeft={-3} alignItems="center">
            <VStack>
              <HStack alignItems="center">
                <VStack marginVertical={-14}>
                  <RestaurantUpVoteDownVote
                    restaurantId={restaurantId}
                    activeTagIds={tagIds ?? {}}
                  />
                </VStack>
                <Spacer />

                <Spacer size="xs" />

                {/* <ScrollView
                  style={{ flex: 1 }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                > */}
                <VStack marginTop={-4}>
                  <HStack>
                    <Text fontSize={12} opacity={0.5}>
                      <Text fontSize={14}>
                        <TextStrong>#{rank}</TextStrong> in
                      </Text>{' '}
                      <Text fontSize={14}>
                        {sortBy(
                          tags.filter((tag) => tag.name !== 'Gems'),
                          (a) =>
                            a.type === 'lense' ? 0 : a.type === 'dish' ? 2 : 1
                        ).map((tag, i) => {
                          return (
                            <>
                              <VStack
                                padding={2}
                                margin={-2}
                                marginRight={6}
                                borderRadius={5}
                                backgroundColor="#eee"
                                display="inline-flex"
                              >
                                {tagDisplayName(tag)}
                              </VStack>
                            </>
                          )
                        })}
                      </Text>
                      <Text marginLeft={-8} fontSize={14}>
                        {' '}
                        (152 reviews){' '}
                        <HelpCircle
                          size={14}
                          color="rgba(0,0,0,0.5)"
                          style={{ marginBottom: -2 }}
                          onClick={() => setShowBreakdown((x) => !x)}
                        />
                      </Text>
                    </Text>
                  </HStack>
                  <Spacer size="sm" />
                  <HStack paddingLeft={10} paddingRight={20}>
                    <RestaurantScoreBreakdownSmall
                      restaurantSlug={restaurantSlug}
                    />
                  </HStack>
                </VStack>
                {/* </ScrollView> */}
              </HStack>
            </VStack>
          </HStack>

          {/* RANKING BREAKDOWN ROW */}

          <Spacer size="sm" />

          {/* ROW: Overview / Reviews / Comment */}
          <VStack
            flex={1}
            maxWidth="100%"
            overflow="hidden"
            paddingBottom={10}
            marginBottom={-10}
          >
            <VStack flex={1} paddingLeft={isSmall ? 10 : 0}>
              {showBreakdown ? (
                <RestaurantScoreBreakdown restaurantSlug={restaurantSlug} />
              ) : (
                <Text fontSize={16} lineHeight={21}>
                  <VStack
                    marginTop={4}
                    marginBottom={12}
                    maxWidth="100%"
                    flex={1}
                  >
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
              )}
            </VStack>

            {/* BOTTOM ROW */}
            <Suspense fallback={null}>
              <RestaurantTopReviews
                restaurantId={restaurantId}
                afterTopCommentButton={
                  // comments
                  <Suspense fallback={null}>
                    <HStack flex={1} alignItems="center" flexWrap="wrap">
                      <VStack>
                        <RestaurantLenseVote restaurantId={restaurantId} />
                      </VStack>

                      <Spacer size="xs" />

                      <HStack
                        alignItems="center"
                        {...smallButtonBaseStyle}
                        height={36}
                        cursor="initial"
                      >
                        <VStack marginVertical={-5} marginRight={-7}>
                          <RestaurantDeliveryButtons
                            label="Delivers"
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
                }
              />
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
    const sources = restaurant?.sources?.() ?? {}
    return (
      <HStack alignItems="center">
        <Text fontSize={12} opacity={0.5}>
          via&nbsp;
        </Text>
        <HStack spacing={6}>
          {Object.keys(sources).map((source, i) => {
            const item = sources[source]
            if (!item) {
              return null
            }
            const info = thirdPartyCrawlSources[source]
            return (
              <HStack
                key={source}
                alignItems="center"
                padding={4}
                borderRadius={100}
                backgroundColor={bgLight}
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

export const RestaurantScoreBreakdown = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const headlines = restaurant.headlines() ?? []
    const sources = restaurant?.sources?.() ?? {}
    return (
      <HStack paddingVertical={12}>
        <VStack>
          <VStack spacing={8}>
            <Text color="rgba(0,0,0,0.5)">
              <TextStrong color="#000">+421</TextStrong> points from 280
              reviews:
            </Text>

            <VStack paddingLeft={10}>
              {headlines.slice(0, 3).map((item, i) => {
                return (
                  <li style={{ display: 'flex' }} key={i}>
                    <HStack key={i} flex={1} overflow="hidden">
                      <Text fontSize={14} color="rgba(0,0,0,0.7)" ellipse>
                        {item.sentence}
                      </Text>
                    </HStack>
                  </li>
                )
              })}
            </VStack>
          </VStack>

          <Spacer />

          <VStack spacing={10}>
            <Text color="rgba(0,0,0,0.5)">
              <TextStrong color="#000">+1893</TextStrong> points from 280
              reviews:
            </Text>

            <VStack>
              {Object.keys(sources).map((source, i) => {
                const item = sources[source]
                if (!item) {
                  return null
                }
                const info = thirdPartyCrawlSources[source]
                return (
                  <HStack
                    key={source}
                    padding={3}
                    paddingLeft={18}
                    alignItems="center"
                    flex={1}
                    hoverStyle={{
                      backgroundColor: '#f2f2f2',
                    }}
                    spacing={10}
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
                    <Text fontSize={12} opacity={0.5}>
                      {info?.name ?? source}
                    </Text>
                    <Text fontSize={13}>{+(item.rating ?? 0) * 10}</Text>
                    <Text>
                      Falafel Super Wrap, tasted great, the person who took
                    </Text>
                  </HStack>
                )
              })}
            </VStack>
          </VStack>
        </VStack>
      </HStack>
    )
  })
)

const TableHead = (props) => (
  <Text
    className="el-th"
    display="flex"
    alignSelf="flex-end"
    backgroundColor="#eee"
    padding={2}
    paddingHorizontal={8}
    marginVertical={-2}
    borderRadius={10}
    maxWidth={52}
    ellipse
    fontSize={12}
    {...props}
  />
)

const RestaurantPeek = memo(
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
