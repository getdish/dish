import { fullyIdle, series } from '@dish/async'
import { RestaurantItemMeta, graphql } from '@dish/graph'
import { isSafari } from '@dish/helpers'
import { MessageSquare } from '@dish/react-feather'
import { useStoreInstanceSelector } from '@dish/use-store'
import { debounce } from 'lodash'
import React, { Suspense, memo, useCallback, useEffect, useState } from 'react'
import { Dimensions } from 'react-native'
import {
  AbsoluteVStack,
  Circle,
  HStack,
  Hoverable,
  LoadingItem,
  LoadingItemsSmall,
  Spacer,
  StackProps,
  Text,
  VStack,
  getMedia,
  isTouchDevice,
  useMedia,
  useTheme,
} from 'snackui'

import { brandColor, green } from '../../../constants/colors'
import { isWeb } from '../../../constants/constants'
import { getRestaurantDishes } from '../../../helpers/getRestaurantDishes'
import { numberFormat } from '../../../helpers/numberFormat'
import { selectRishDishViewSimple } from '../../../helpers/selectDishViewSimple'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { QueryRestaurantTagsProps } from '../../../queries/queryRestaurantTags'
import { queryRestaurantTagScores } from '../../../queries/queryRestaurantTagScores'
import { GeocodePlace } from '../../../types/homeTypes'
import { appMapStore } from '../../AppMap'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
import { DishView } from '../../views/dish/DishView'
import { Link } from '../../views/Link'
import { RestaurantOverview } from '../../views/restaurant/RestaurantOverview'
import { RestaurantTagsRow } from '../../views/restaurant/RestaurantTagsRow'
import { RestaurantUpVoteDownVote } from '../../views/restaurant/RestaurantUpVoteDownVote'
import { SlantedTitle } from '../../views/SlantedTitle'
import { SmallButton } from '../../views/SmallButton'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { searchPageStore } from '../search/SearchPageStore'
import { EditRestaurantTagsButton } from './EditRestaurantTagsButton'
import { ensureFlexText } from './ensureFlexText'
import { RankView } from './RankView'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantAddToListButton } from './RestaurantAddToListButton'
import { RestaurantDeliveryButtons } from './RestaurantDeliveryButtons'
import { openingHours, priceRange } from './RestaurantDetailRow'
import { RestaurantFavoriteStar } from './RestaurantFavoriteButton'
import { useTotalReviews } from './useTotalReviews'

export const ITEM_HEIGHT = 220

type RestaurantListItemProps = {
  curLocInfo: GeocodePlace | null
  restaurantId: string
  restaurantSlug: string
  rank: number
  meta?: RestaurantItemMeta
  activeTagSlugs?: string[]
  onFinishRender?: Function
  description?: string | null
  editableDescription?: boolean
  onChangeDescription?: (next: string) => void
  editablePosition?: boolean
  onChangePosition?: (next: number) => void
  dishSlugs?: string[]
  editableDishes?: boolean
  onChangeDishes?: (slugs: string[]) => void
  hideTagRow?: boolean
  flexibleHeight?: boolean
  above?: any
}

/**
 * NOTE
 *
 * use slug for anything NOT logged in
 *
 * for logged in calls, we often need to user restaurant_id
 */

const setHoveredSlow = debounce(appMapStore.setHovered, 300)

export const RestaurantListItem = (props: RestaurantListItemProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const handleScrollMemo = useCallback(() => {
    setIsLoaded(true)
  }, [])
  const handleScroll = isLoaded ? undefined : handleScrollMemo

  const contentInner = (
    <Suspense fallback={<LoadingItem size="lg" />}>
      <ContentScrollViewHorizontal
        height={ITEM_HEIGHT}
        onScroll={handleScroll}
        scrollEventThrottle={100}
      >
        <RestaurantListItemContent isLoaded={isLoaded} {...props} />
      </ContentScrollViewHorizontal>
    </Suspense>
  )

  if (isWeb && !isTouchDevice) {
    return (
      <Hoverable
        onHoverIn={() => {
          setHoveredSlow({
            id: props.restaurantId,
            slug: props.restaurantSlug,
            via: 'list',
          })
        }}
        onHoverOut={() => {
          setHoveredSlow.cancel()
        }}
      >
        {contentInner}
      </Hoverable>
    )
  }

  return contentInner
}

const excludeTags: QueryRestaurantTagsProps['exclude'] = ['dish']

const RestaurantListItemContent = memo(
  graphql(function RestaurantListItemContent(
    props: RestaurantListItemProps & { isLoaded: boolean }
  ) {
    const {
      rank,
      restaurantId,
      restaurantSlug,
      curLocInfo,
      activeTagSlugs,
      isLoaded,
      meta,
      hideTagRow,
      description,
      dishSlugs,
      flexibleHeight,
      above,
      editableDishes,
      onChangeDishes,
      onChangeDescription,
      editableDescription,
      onChangePosition,
      editablePosition,
    } = props
    const media = useMedia()
    const [restaurant] = queryRestaurant(restaurantSlug)

    if (!restaurant) {
      return null
    }

    useEffect(() => {
      if (!!restaurant.name && props.onFinishRender) {
        return series([() => fullyIdle({ min: 16 }), props.onFinishRender!])
      }
    }, [restaurant.name])

    const restaurantName = (restaurant.name ?? '').slice(0, 300)
    const isActive = useStoreInstanceSelector(searchPageStore, (x) => x.index === rank - 1)
    const [isExpanded, setIsExpanded] = useState(false)

    const contentSideProps: StackProps = {
      width: media.sm ? '70%' : '60%',
      minWidth: media.sm ? (isWeb ? '40vw' : Dimensions.get('window').width * 0.65) : 320,
      maxWidth: Math.min(Dimensions.get('window').width * 0.7, media.sm ? 360 : 540),
    }

    const handleChangeDishes = useCallback(onChangeDishes as any, [])
    const open = openingHours(restaurant)
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
    const titleFontSize = Math.round((media.sm ? 21 : 23) * titleFontScale)
    const titleHeight = titleFontSize + 8 * 2
    const score = Math.round((meta?.effective_score ?? 0) / 20)
    const theme = useTheme()
    const showAbove = !!above || !!activeTagSlugs
    const [editedDescription, setEditedDescription] = useState('')

    // const handleEdit = useCallback((next) => {
    //   setEditedDescription(next)
    //   onChangeDescription?.(next)
    // }, [])

    const toggleSetExpanded = useCallback(() => {
      setIsExpanded((x) => !x)
    }, [])

    const tagsRowContent = !hideTagRow && (
      <Suspense fallback={null}>
        <RestaurantTagsRow
          exclude={excludeTags}
          size="sm"
          restaurantSlug={restaurantSlug}
          restaurantId={restaurantId}
          spacing={0}
          spacingHorizontal={27}
          max={4}
        />
      </Suspense>
    )

    return (
      <VStack
        className="ease-in-out-slow hover-faded-in-parent"
        alignItems="flex-start"
        justifyContent="flex-start"
        minHeight={ITEM_HEIGHT}
        {...(!flexibleHeight && {
          maxHeight: ITEM_HEIGHT,
        })}
        flex={1}
        // turn this off breaks something? but hides the rest of title hover?
        // overflow="hidden"
        // prevent jitter/layout moving until loaded
        display={restaurant.name === null ? 'none' : 'flex'}
        position="relative"
        {...(isExpanded && {
          transform: [{ translateX: 300 }],
        })}
      >
        {/* expanded content */}
        {meta && isExpanded && (
          <AbsoluteVStack
            backgroundColor={theme.backgroundColorDarker}
            width={300 - 40}
            x={-320}
            height="100%"
            padding={20}
            overflow="hidden"
          >
            <SlantedTitle alignSelf="center">Breakdown</SlantedTitle>
            <Spacer />
            <Suspense fallback={<LoadingItemsSmall />}>
              <RestaurantListItemScoreBreakdown {...props} meta={meta} />
            </Suspense>
          </AbsoluteVStack>
        )}

        {/* border left */}
        <AbsoluteVStack
          top={0}
          bottom={0}
          zIndex={-1}
          width={18}
          left={-13}
          backgroundColor={isActive ? brandColor : 'transparent'}
          borderTopRightRadius={8}
          borderBottomRightRadius={8}
        />

        {/* vote button and score */}
        <AbsoluteVStack top={34} left={-5} zIndex={2000000}>
          {showAbove
            ? above ?? (
                // RANKING VIEW
                <RestaurantUpVoteDownVote
                  rounded
                  score={score}
                  restaurantSlug={restaurantSlug}
                  activeTagSlugs={activeTagSlugs}
                  onClickPoints={toggleSetExpanded}
                />
              )
            : null}
        </AbsoluteVStack>

        {/* ROW: TITLE */}
        <VStack
          hoverStyle={{ backgroundColor: theme.backgroundColorTransluscent }}
          paddingLeft={14}
          width={950}
          position="relative"
        >
          {/* LINK */}
          <Link tagName="div" name="restaurant" params={{ slug: restaurantSlug }} zIndex={2}>
            <HStack
              paddingLeft={showAbove ? 47 : 10}
              paddingTop={25}
              position="relative"
              alignItems="center"
            >
              <AbsoluteVStack
                x={-32}
                y={-4}
                zIndex={-1}
                {...(!showAbove && {
                  x: -36,
                  y: 16,
                })}
              >
                <RankView rank={rank} />
              </AbsoluteVStack>

              <Spacer size="xs" />

              {/* SECOND LINK WITH actual <a /> */}
              <Link name="restaurant" params={{ slug: restaurantSlug }}>
                <HStack
                  paddingHorizontal={8}
                  borderRadius={8}
                  alignItems="center"
                  marginVertical={-5}
                  maxWidth={contentSideProps.maxWidth}
                  hoverStyle={{
                    backgroundColor: theme.backgroundColorTertiary,
                  }}
                >
                  <Text
                    fontSize={titleFontSize}
                    lineHeight={titleHeight}
                    height={titleHeight}
                    color={theme.color}
                    fontWeight="400"
                    letterSpacing={-0.25}
                    paddingHorizontal={1} // prevents clipping due to letter-spacing
                    ellipse
                  >
                    {restaurantName}
                  </Text>
                </HStack>
              </Link>
            </HStack>
          </Link>

          <Spacer size={6} />

          {/* SECOND ROW TITLE */}
          <HStack
            zIndex={0}
            {...contentSideProps}
            className="safari-fix-overflow"
            overflow="hidden"
            paddingLeft={showAbove ? 85 : 22}
            paddingRight={20}
            y={-6}
            pointerEvents="auto"
            alignItems="center"
            cursor="pointer"
            spacing="sm"
          >
            {!!price_range && (
              <Text fontSize={14} fontWeight="700" color={theme.colorTertiary} marginRight={4}>
                {price_range}
              </Text>
            )}

            {!!open.isOpen && (
              <>
                <Circle size={8} backgroundColor={green} />
                <Spacer size="sm" />
              </>
            )}

            {!!open.text && (
              <>
                <Link name="restaurantHours" params={{ slug: restaurantSlug }}>
                  <SmallButton backgroundColor="transparent">{open.nextTime || '~~'}</SmallButton>
                </Link>
              </>
            )}

            {!!restaurant.address && (
              <RestaurantAddress size="sm" curLocInfo={curLocInfo!} address={restaurant.address} />
            )}
          </HStack>
        </VStack>

        <VStack flex={1} />

        {/* CENTER CONTENT AREA */}
        {/* zindex must be above title/bottom so hovers work on dishview voting/search */}
        <HStack pointerEvents="none" zIndex={10} paddingLeft={10} flex={1} maxHeight={69}>
          <VStack
            {...contentSideProps}
            className="fix-safari-shrink-height"
            justifyContent="center"
            flex={1}
            y={isSafari ? -5 : -15}
            zIndex={100}
          >
            <VStack width="110%">
              {/* ROW: OVERVIEW */}
              <RestaurantOverview
                isDishBot
                editableDescription={editableDescription}
                fullHeight
                restaurantSlug={restaurantSlug}
                maxLines={2}
              />
            </VStack>
          </VStack>

          {/* PEEK / TAGS (RIGHT SIDE) */}
          {/* margin top: negative the titles second row height */}
          <Suspense fallback={null}>
            <RestaurantPeekDishes
              restaurantSlug={props.restaurantSlug}
              restaurantId={props.restaurantId}
              activeTagSlugs={activeTagSlugs}
              tagSlugs={dishSlugs}
              editable={editableDishes}
              onChangeTags={handleChangeDishes}
              isLoaded={isLoaded}
            />
          </Suspense>
        </HStack>

        {/* BOTTOM ROW */}

        <HStack
          paddingLeft={20}
          height={44}
          className="safari-fix-overflow"
          position="relative"
          alignItems="center"
          width="100%"
          overflow="hidden"
        >
          <Link
            name="restaurant"
            params={{
              slug: props.restaurantSlug,
              section: 'reviews',
            }}
          >
            <SmallButton
              tooltip={`Rating Breakdown (${totalReviews} reviews)`}
              icon={
                <MessageSquare
                  size={16}
                  color={isWeb ? 'var(--colorTertiary)' : 'rgba(150,150,150,0.3)'}
                />
              }
            >
              {numberFormat(restaurant.reviews_aggregate().aggregate?.count() ?? 0, 'sm')}
            </SmallButton>
          </Link>

          <Spacer size="sm" />

          <Suspense fallback={<Spacer size={44} />}>
            <RestaurantFavoriteStar size="md" restaurantId={restaurantId} />
          </Suspense>

          <Spacer size="sm" />

          <Suspense fallback={<Spacer size={44} />}>
            <RestaurantAddToListButton restaurantSlug={restaurantSlug} noLabel />
          </Suspense>

          <Spacer size="sm" />

          <Suspense fallback={null}>
            <RestaurantDeliveryButtons label="" restaurantSlug={restaurantSlug} />
          </Suspense>

          <Spacer size="lg" />

          {tagsRowContent}
        </HStack>
      </VStack>
    )
  })
)

const RestaurantListItemScoreBreakdown = memo(
  graphql(
    ({
      activeTagSlugs,
      meta,
      restaurantSlug,
    }: RestaurantListItemProps & { meta: RestaurantItemMeta }) => {
      const restaurantTags = queryRestaurantTagScores({
        restaurantSlug,
        tagSlugs: activeTagSlugs ?? [],
      })
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
          {isWeb && process.env.NODE_ENV === 'development' && (
            <pre style={{ color: '#777' }}>{JSON.stringify(meta ?? null, null, 2)}</pre>
          )}
        </VStack>
      )
    }
  )
)

// dont re-render this one
const showInitial = getMedia().xs ? 1 : getMedia().sm ? 2 : 3

const RestaurantPeekDishes = memo(
  graphql(function RestaurantPeekDishes(props: {
    size?: 'lg' | 'md'
    restaurantSlug: string
    restaurantId: string
    activeTagSlugs?: string[]
    isLoaded: boolean
    tagSlugs?: string[]
    editable?: boolean
    onChangeTags?: (slugs: string[]) => void
  }) {
    const { isLoaded, size = 'md' } = props
    const restaurant = queryRestaurant(props.restaurantSlug)[0]
    const dishes = props.tagSlugs
      ? restaurant
          ?.tags({
            where: {
              tag: {
                slug: {
                  _in: props.tagSlugs,
                },
              },
            },
          })
          .map(selectRishDishViewSimple) ?? []
      : getRestaurantDishes({
          restaurant,
          tagSlugs: props.activeTagSlugs,
          max: 5,
        })

    const foundMatchingSearchedDish = props.activeTagSlugs?.includes(dishes?.[0]?.slug)
    const dishSize = 160

    return (
      <>
        {props.editable && (
          <EditRestaurantTagsButton
            restaurantSlug={props.restaurantSlug}
            tagSlugs={props.tagSlugs ?? dishes.map((x) => x.slug)}
            onChange={props.onChangeTags}
          />
        )}
        <HStack
          pointerEvents="none"
          padding={20}
          y={-40}
          x={20}
          alignItems="center"
          height="100%"
          width={dishSize * 0.7 * 5}
        >
          {!!dishes[0]?.name &&
            dishes.map((dish, i) => {
              const isEven = i % 2 === 0
              const baseSize = foundMatchingSearchedDish
                ? i == 0
                  ? dishSize
                  : dishSize * 0.95
                : dishSize

              const preventLoad = !isLoaded && i > showInitial
              return (
                <VStack key={dish.slug} marginRight={-35} marginTop={isEven ? 0 : -20}>
                  <DishView
                    preventLoad={preventLoad}
                    size={baseSize * (isEven ? 1 : 0.825)}
                    restaurantSlug={props.restaurantSlug}
                    restaurantId={props.restaurantId}
                    {...dish}
                    showSearchButton={!props.editable}
                  />
                </VStack>
              )
            })}
        </HStack>
      </>
    )
  })
)
