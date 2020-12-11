import { fullyIdle, series } from '@dish/async'
import { graphql } from '@dish/graph'
import { MessageSquare } from '@dish/react-feather'
import { debounce } from 'lodash'
import React, {
  Suspense,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  LinearGradient,
  LoadingItemsSmall,
  Spacer,
  StackProps,
  Text,
  Tooltip,
  VStack,
  useGet,
} from 'snackui'

import { bgLight, bgLightHover, bgLightPress, brandColor } from '../../colors'
import { isWeb } from '../../constants'
import { getActiveTagSlugs } from '../../helpers/getActiveTagSlugs'
import { getRestaurantDishes } from '../../helpers/getRestaurantDishes'
import { isWebIOS } from '../../helpers/isIOS'
import { numberFormat } from '../../helpers/numberFormat'
import { useIsNarrow } from '../../hooks/useIs'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { useRestaurantTagScores } from '../../hooks/useRestaurantTagScores'
import { allTags } from '../../state/allTags'
import {
  GeocodePlace,
  HomeSearchItemMeta,
  HomeStateItemSearch,
} from '../../state/home-types'
import { omStatic } from '../../state/omStatic'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
import { DishView } from '../../views/dish/DishView'
import { RestaurantOverview } from '../../views/restaurant/RestaurantOverview'
import { RestaurantTagsRow } from '../../views/restaurant/RestaurantTagsRow'
import { RestaurantUpVoteDownVote } from '../../views/restaurant/RestaurantUpVoteDownVote'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { Link } from '../../views/ui/Link'
import { SlantedTitle } from '../../views/ui/SlantedTitle'
import { SmallButton } from '../../views/ui/SmallButton'
import { ensureFlexText } from './ensureFlexText'
import { RankView } from './RankView'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantDeliveryButtons } from './RestaurantDeliveryButtons'
import { openingHours, priceRange } from './RestaurantDetailRow'
import { RestaurantFavoriteStar } from './RestaurantFavoriteButton'
import { RestaurantSourcesBreakdownRow } from './RestaurantSourcesBreakdownRow'
import { useTotalReviews } from './useTotalReviews'

export const ITEM_HEIGHT = 290

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

const setHoveredSlow = debounce(omStatic.actions.home.setHoveredRestaurant, 250)

export const RestaurantListItem = memo(function RestaurantListItem(
  props: RestaurantListItemProps
) {
  const [isLoaded, setIsLoaded] = useState(false)

  const content = useMemo(() => {
    return <RestaurantListItemContent isLoaded={isLoaded} {...props} />
  }, [props, isLoaded])

  const handleScrollMemo = useCallback(() => {
    console.log('what')
    setIsLoaded(true)
  }, [])
  const handleScroll = isLoaded ? undefined : handleScrollMemo

  const contentInner = (
    <VStack
      alignItems="center"
      overflow="hidden"
      maxWidth="100%"
      position="relative"
      className="restaurant-list-item"
      marginBottom={5}
    >
      <ContentScrollViewHorizontal
        onScroll={handleScroll}
        scrollEventThrottle={100}
      >
        {content}
      </ContentScrollViewHorizontal>
    </VStack>
  )

  if (isWeb && !isWebIOS) {
    return (
      <div
        className="see-through"
        onMouseEnter={() => {
          setHoveredSlow({
            id: props.restaurantId,
            slug: props.restaurantSlug,
          })
        }}
        onMouseLeave={() => {
          setHoveredSlow.cancel()
          if (
            omStatic.state.home.hoveredRestaurant &&
            omStatic.state.home.hoveredRestaurant?.slug === props.restaurantSlug
          ) {
            omStatic.actions.home.setIsHoveringRestaurant(false)
          }
        }}
      >
        {contentInner}
      </div>
    )
  }

  return contentInner
})

const fadeOutWidth = 40
const fadeOutWidthHalf = 20

const RestaurantListItemContent = memo(
  graphql(function RestaurantListItemContent(
    props: RestaurantListItemProps & { isLoaded: boolean }
  ) {
    const {
      rank,
      restaurantId,
      restaurantSlug,
      currentLocationInfo,
      isLoaded,
      searchState,
    } = props
    const pad = 18
    const isSmall = useIsNarrow()
    const restaurant = useRestaurantQuery(restaurantSlug)

    restaurant.location

    useEffect(() => {
      if (!!restaurant.name && props.onFinishRender) {
        return series([() => fullyIdle({ min: 50 }), props.onFinishRender!])
      }
      return undefined
    }, [restaurant.name])

    const restaurantName = (restaurant.name ?? '').slice(0, 300)
    const curState = omStatic.state.home.currentState
    const tagIds = 'activeTags' in curState ? curState.activeTags : {}
    const score = restaurant.score ?? 0
    const [isActive, setIsActive] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const meta = searchState.results[rank]?.meta

    const getIsActive = useGet(isActive)
    useLayoutEffect(() => {
      const getIsActiveNow = (state) => props.rank == state.home.activeIndex + 1

      if (getIsActiveNow(omStatic.state)) {
        setIsActive(true)
      }

      return omStatic.reaction(getIsActiveNow, (isActive) => {
        if (getIsActive() !== isActive) {
          setIsActive(isActive)
        }
      })
    }, [props.rank])

    const contentSideProps: StackProps = {
      width: isSmall ? '75%' : '60%',
      minWidth: isSmall
        ? isWeb
          ? '40vw'
          : Dimensions.get('window').width * 0.65
        : 320,
      maxWidth: Math.min(
        Dimensions.get('window').width * 0.65,
        isSmall ? 360 : 420
      ),
    }

    const [open_text, open_color, opening_hours] = openingHours(restaurant)
    const [price_label, price_color, price_range] = priceRange(restaurant)
    const totalReviews = useTotalReviews(restaurant)
    const nameLen = restaurantName.length
    const titleFontScale =
      nameLen > 50
        ? 0.7
        : nameLen > 40
        ? 0.8
        : nameLen > 30
        ? 0.9
        : nameLen > 25
        ? 0.925
        : nameLen > 15
        ? 0.975
        : 1.15
    const titleFontSize = 1.2 * (isSmall ? 18 : 22) * titleFontScale
    const titleHeight = titleFontSize + 8 * 2

    return (
      <VStack
        className="ease-in-out-slow hover-faded-in-parent"
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
        {...(isExpanded && {
          transform: [{ translateX: 300 }],
        })}
      >
        {/* expanded content */}
        <AbsoluteVStack
          backgroundColor={bgLight}
          width={300 - 40}
          transform={[{ translateX: -320 }]}
          height="100%"
          padding={20}
          overflow="hidden"
        >
          <SlantedTitle alignSelf="center">Breakdown</SlantedTitle>
          <Spacer />
          {isExpanded && (
            <Suspense fallback={<LoadingItemsSmall />}>
              <RestaurantListItemScoreBreakdown {...props} meta={meta} />
            </Suspense>
          )}
        </AbsoluteVStack>

        {/* border left */}
        <AbsoluteVStack
          top={0}
          bottom={0}
          zIndex={-1}
          width={8}
          left={-2}
          backgroundColor={isActive ? brandColor : 'transparent'}
        />

        {tagIds && (
          <AbsoluteVStack top={34} left={-12} zIndex={1000}>
            <RestaurantUpVoteDownVote
              key={JSON.stringify(tagIds)}
              score={Math.round((meta?.effective_score ?? 0) / 10)}
              restaurantSlug={restaurantSlug}
              activeTags={tagIds}
              onClickPoints={() => {
                setIsExpanded((x) => !x)
              }}
            />
            <AbsoluteVStack top={-6} right={-20} zIndex={-1}>
              <RankView rank={rank} />
            </AbsoluteVStack>
          </AbsoluteVStack>
        )}

        <VStack flex={1} alignItems="flex-start" maxWidth="100%">
          {/* ROW: TITLE */}
          <VStack
            hoverStyle={{ backgroundColor: 'rgba(0,0,0,0.015)' }}
            paddingTop={10}
            marginLeft={-pad}
            paddingLeft={pad}
            width={950}
            position="relative"
          >
            {/* LINK */}
            <Link
              tagName="div"
              name="restaurant"
              params={{ slug: restaurantSlug }}
            >
              <VStack paddingLeft={50} paddingTop={25}>
                <HStack alignItems="center">
                  <Spacer size="xs" />

                  {/* SECOND LINK WITH actual <a /> */}
                  <Text
                    selectable
                    lineHeight={26}
                    textDecorationColor="transparent"
                    fontWeight="600"
                  >
                    <Link name="restaurant" params={{ slug: restaurantSlug }}>
                      <HStack
                        paddingHorizontal={8}
                        borderRadius={8}
                        alignItems="center"
                        marginVertical={-5}
                        maxWidth={contentSideProps.maxWidth}
                        hoverStyle={{
                          backgroundColor: bgLightHover,
                        }}
                        pressStyle={{
                          backgroundColor: bgLightPress,
                        }}
                      >
                        <Text
                          fontSize={titleFontSize}
                          lineHeight={titleHeight}
                          height={titleHeight}
                          color="#000"
                          ellipse
                        >
                          {restaurantName}
                        </Text>
                      </HStack>
                    </Link>
                  </Text>
                </HStack>
              </VStack>
            </Link>

            <Spacer size="md" />

            {/* SECOND ROW TITLE */}
            <VStack
              {...contentSideProps}
              overflow="hidden"
              zIndex={-1}
              paddingLeft={60}
              paddingRight={20}
              marginTop={isSmall ? -6 : 0}
              transform={[{ translateY: -10 }]}
            >
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
                    fontSize={14}
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

          <HStack flex={1}>
            <VStack
              {...contentSideProps}
              width="5%"
              className="fix-safari-shrink-height"
              justifyContent="center"
              flex={1}
            >
              {/* ROW: OVERVIEW */}
              {/* ensures it always flexes all the way even if short text */}
              {ensureFlexText}

              <VStack
                justifyContent="center"
                flex={1}
                paddingLeft={20}
                paddingRight={10}
              >
                <RestaurantOverview restaurantSlug={restaurantSlug} />
              </VStack>

              {/* BOTTOM ROW */}

              <Spacer />

              <Suspense fallback={null}>
                <HStack
                  position="relative"
                  alignItems="center"
                  overflow="hidden"
                >
                  <VStack>
                    <Tooltip
                      contents={`Rating Breakdown (${totalReviews} reviews)`}
                    >
                      <SmallButton
                        name="restaurantReviews"
                        params={{
                          id: props.restaurantId,
                          slug: props.restaurantSlug,
                        }}
                        before={
                          <MessageSquare
                            size={16}
                            color="rgba(0,0,0,0.3)"
                            style={{ marginRight: 6 }}
                          />
                        }
                        color="#999"
                        fontSize={14}
                        fontWeight="600"
                      >
                        {numberFormat(
                          restaurant.reviews_aggregate().aggregate.count() ?? 0,
                          'sm'
                        )}
                      </SmallButton>
                    </Tooltip>
                  </VStack>

                  <Spacer />

                  <Suspense fallback={<Spacer size={44} />}>
                    <RestaurantFavoriteStar
                      size="md"
                      restaurantId={restaurantId}
                    />
                  </Suspense>

                  <Spacer />

                  <RestaurantDeliveryButtons
                    label={isSmall ? '' : '🚗'}
                    restaurantSlug={restaurantSlug}
                  />

                  <VStack flex={1} minWidth={12} />

                  <VStack marginRight={fadeOutWidthHalf}>
                    <Suspense fallback={null}>
                      <RestaurantSourcesBreakdownRow
                        size="sm"
                        restaurantId={restaurantId}
                        restaurantSlug={restaurantSlug}
                      />
                    </Suspense>
                  </VStack>

                  {fadeOutRightElement}
                </HStack>
              </Suspense>
            </VStack>

            {/* PEEK / TAGS (RIGHT SIDE) */}
            {/* margin top: negative the titles second row height */}
            <VStack
              paddingLeft={10}
              position="relative"
              maxHeight={220}
              marginTop={-50}
              transform={[{ translateY: -8 }]}
            >
              <Suspense fallback={null}>
                <RestaurantPeekDishes
                  restaurantSlug={props.restaurantSlug}
                  restaurantId={props.restaurantId}
                  searchState={props.searchState}
                  isLoaded={isLoaded}
                />
              </Suspense>

              <VStack flex={1} />

              <HStack
                height={34}
                paddingTop={20}
                paddingLeft={25}
                overflow="hidden"
                alignItems="center"
              >
                <HStack marginBottom={-8}>
                  <RestaurantTagsRow
                    size="sm"
                    restaurantSlug={restaurantSlug}
                    restaurantId={restaurantId}
                    spacing={8}
                    grid
                    max={4}
                  />
                </HStack>
                <VStack
                  flex={1}
                  backgroundColor="#fafafa"
                  height={1}
                  transform={[{ translateY: -0.5 }]}
                />
              </HStack>
            </VStack>
          </HStack>
        </VStack>
        <Spacer size="lg" />
      </VStack>
    )
  })
)

const fadeOutRightElement = (
  <VStack
    width={fadeOutWidth}
    position="absolute"
    top={0}
    right={0}
    bottom={0}
    pointerEvents="none"
  >
    <LinearGradient
      style={StyleSheet.absoluteFill}
      colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
      start={[0, 0]}
      endPoint={[1, 0]}
    />
  </VStack>
)

const RestaurantListItemScoreBreakdown = memo(
  graphql(
    ({
      searchState,
      meta,
      restaurantSlug,
    }: RestaurantListItemProps & { meta: HomeSearchItemMeta }) => {
      const tagSlugs = getActiveTagSlugs(searchState.activeTags)
      const restaurant = useRestaurantQuery(restaurantSlug)
      const restaurantTags = useRestaurantTagScores({
        restaurantSlug,
        tagSlugs,
      })
      // console.log(
      //   'restaurantTags',
      //   tagSlugs,
      //   restaurantTags,
      //   restaurant.score_breakdown(),
      //   restaurant.source_breakdown()
      // )
      return (
        <VStack spacing>
          {restaurantTags.map((rtag) => {
            return (
              <TagButton
                key={rtag.slug}
                {...getTagButtonProps(rtag)}
                votable
                restaurantSlug={restaurantSlug}
              />
            )
          })}
          <Text fontSize={12}>{JSON.stringify(meta ?? null, null, 2)}</Text>
        </VStack>
      )
    }
  )
)

const RestaurantPeekDishes = memo(
  graphql(function RestaurantPeekDishes(props: {
    size?: 'lg' | 'md'
    restaurantSlug: string
    restaurantId: string
    searchState: HomeStateItemSearch
    isLoaded: boolean
  }) {
    // const activeTags = omStatic.state.home.lastSearchState?.activeTags ?? {}
    // const dishSearchedTag = Object.keys(activeTags).find(
    //   (k) => allTags[k]?.type === 'dish'
    // )
    const { isLoaded, searchState, size = 'md' } = props
    const tagSlugs = [
      searchState.searchQuery.toLowerCase(),
      ...Object.keys(searchState.activeTags || {}).filter((x) => {
        const isActive = searchState.activeTags[x]
        if (!isActive) {
          return false
        }
        const type = allTags[x]?.type ?? 'outlier'
        return type != 'lense' && type != 'filter' && type != 'outlier'
      }),
    ].filter((x) => !!x)
    // const restaurant = useRestaurantQuery(props.restaurantSlug)
    // // get them all as once to avoid double query limit on gqless
    const tagNames = tagSlugs
      .map((n) => allTags[n]?.name ?? null)
      .filter(Boolean)
    // const fullTags = tagSlugs.length
    //   ? restaurant
    //       .tags({
    //         limit: tagNames.length,
    //         where: {
    //           tag: {
    //             name: {
    //               _in: tagNames,
    //             },
    //           },
    //         },
    //         order_by: [
    //           {
    //             score: order_by.desc,
    //           },
    //         ],
    //       })
    //       .map((tag) => ({
    //         name: tag.tag.name,
    //         score: tag.score ?? 0,
    //         icon: tag.tag.icon,
    //         image: tag.tag.default_images()?.[0],
    //       }))
    //   : null
    const dishes = getRestaurantDishes({
      restaurantSlug: props.restaurantSlug,
      tag_slugs: tagSlugs,
      max: 5,
    })
    const firstDishName = dishes[0]?.name
    const foundMatchingSearchedDish = firstDishName
      ? tagNames.includes(firstDishName)
      : false
    const dishSize = 145
    return (
      <HStack
        contain="paint layout"
        pointerEvents="auto"
        padding={20}
        paddingVertical={40}
        alignItems="center"
        marginVertical={-40}
        height={dishSize + 80}
        width={dishSize * 5}
      >
        {!!dishes[0]?.name &&
          dishes.map((dish, i) => {
            const isEven = i % 2 === 0
            const baseSize = foundMatchingSearchedDish
              ? i == 0
                ? dishSize
                : dishSize * 0.95
              : dishSize
            return (
              <DishView
                key={i}
                preventLoad={!isLoaded && i > 2}
                size={baseSize * (isEven ? 1.2 : 1)}
                restaurantSlug={props.restaurantSlug}
                restaurantId={props.restaurantId}
                dish={dish}
                marginRight={-15}
                marginTop={isEven ? 0 : -15}
                showSearchButton
                // zIndex={100 - i}
              />
            )
          })}
      </HStack>
    )
  })
)
