import { fullyIdle, series } from '@dish/async'
import { RestaurantItemMeta, graphql } from '@dish/graph'
import { MessageSquare } from '@dish/react-feather'
import { useStoreInstanceSelector } from '@dish/use-store'
import { debounce } from 'lodash'
import React, { Suspense, memo, useCallback, useEffect, useState } from 'react'
import { Dimensions } from 'react-native'
import {
  AbsoluteVStack,
  Button,
  Circle,
  HStack,
  Hoverable,
  InteractiveContainer,
  LoadingItem,
  LoadingItemsSmall,
  Spacer,
  StackProps,
  Text,
  VStack,
  getMedia,
  useMedia,
  useTheme,
} from 'snackui'

import { brandColor, green } from '../../../constants/colors'
import { isWeb } from '../../../constants/constants'
import { getImageUrl } from '../../../helpers/getImageUrl'
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
import { Image } from '../../views/Image'
import { Link } from '../../views/Link'
import { RestaurantOverview } from '../../views/restaurant/RestaurantOverview'
import { RestaurantTagsRow } from '../../views/restaurant/RestaurantTagsRow'
import { RestaurantUpVoteDownVote } from '../../views/restaurant/RestaurantUpVoteDownVote'
import { SlantedTitle } from '../../views/SlantedTitle'
import { SmallButton } from '../../views/SmallButton'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { getSearchPageStore } from '../search/SearchPageStore'
import { SkewedCardCarousel } from '../SimpleCard'
import { EditRestaurantTagsButton } from './EditRestaurantTagsButton'
import { RankView } from './RankView'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantAddToListButton } from './RestaurantAddToListButton'
import { RestaurantDeliveryButtons } from './RestaurantDeliveryButtons'
import { openingHours, priceRange } from './RestaurantDetailRow'
import { RestaurantFavoriteStar } from './RestaurantFavoriteButton'
import { useTotalReviews } from './useTotalReviews'

export const ITEM_HEIGHT = 180

type RestaurantListItemProps = {
  curLocInfo: GeocodePlace | null
  restaurantId: string
  restaurantSlug: string
  hideRate?: boolean
  hideDescription?: boolean
  rank: number
  meta?: RestaurantItemMeta
  activeTagSlugs?: string[]
  onFinishRender?: Function
  description?: string | null
  editableDescription?: boolean
  onChangeDescription?: (next: string) => void
  dishSlugs?: string[]
  editableDishes?: boolean
  onChangeDishes?: (slugs: string[]) => void
  hideTagRow?: boolean
  flexibleHeight?: boolean
  above?: any
  beforeBottomRow?: any
  dishSize?: 'md' | 'lg'
}

/**
 * NOTE
 *
 * use slug for anything NOT logged in
 *
 * for logged in calls, we often need to user restaurant_id
 */

const setHoveredSlow = debounce(appMapStore.setHovered, 400)

export const RestaurantListItem = (props: RestaurantListItemProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const theme = useTheme()
  const handleScrollMemo = useCallback(() => {
    setIsLoaded(true)
  }, [])
  const handleScroll = isLoaded ? undefined : handleScrollMemo

  return (
    <Suspense
      fallback={
        props.hideDescription ? (
          <VStack
            className="shine"
            height={61}
            backgroundColor={theme.backgroundColorTransluscent}
            borderWidth={2}
            borderColor={theme.backgroundColorTransparent}
            width="100%"
          />
        ) : (
          <LoadingItem size="lg" />
        )
      }
    >
      <ContentScrollViewHorizontal onScroll={handleScroll} scrollEventThrottle={100}>
        <RestaurantListItemContent isLoaded={isLoaded} {...props} />
      </ContentScrollViewHorizontal>
    </Suspense>
  )
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
      dishSize,
      curLocInfo,
      activeTagSlugs,
      isLoaded,
      hideRate,
      meta,
      hideTagRow,
      beforeBottomRow,
      description = null,
      dishSlugs,
      flexibleHeight,
      hideDescription,
      above,
      editableDishes,
      onChangeDishes,
      onChangeDescription,
      editableDescription,
    } = props
    const media = useMedia()
    const [restaurant] = queryRestaurant(restaurantSlug)
    const [state, setState] = useState({
      editing: false,
      description: null as null | string,
    })

    useEffect(() => {
      setState((prev) => ({
        ...prev,
        description,
      }))
    }, [description])

    if (!restaurant) {
      return null
    }

    useEffect(() => {
      if (!!restaurant.name && props.onFinishRender) {
        return series([() => fullyIdle({ min: 16 }), props.onFinishRender!])
      }
    }, [restaurant.name])

    const restaurantName = (restaurant.name ?? '').slice(0, 300)
    const isActive = useStoreInstanceSelector(getSearchPageStore(), (x) => x.index === rank - 1)
    const [isExpanded, setIsExpanded] = useState(false)

    const contentSideProps: StackProps = {
      width: media.sm ? '70%' : '60%',
      minWidth: media.sm ? (isWeb ? '55vw' : Dimensions.get('window').width * 0.65) : 320,
      maxWidth: Math.min(
        Dimensions.get('window').width * 0.5,
        // flexibleHeight here should really be allowMoreWidth or something
        media.sm ? 360 : flexibleHeight ? 560 : 480
      ),
    }

    const handleChangeDishes = useCallback(onChangeDishes as any, [])
    const open = openingHours(restaurant)
    const [price_label, price_color, price_range] = priceRange(restaurant)
    const totalReviews = useTotalReviews(restaurant)
    const nameLen = restaurantName.length
    const titleFontScale =
      nameLen > 50
        ? 0.8
        : nameLen > 40
        ? 0.85
        : nameLen > 30
        ? 0.95
        : nameLen > 25
        ? 0.975
        : nameLen > 15
        ? 1
        : 1
    const titleFontSize =
      Math.round((media.sm ? 20 : 23) * titleFontScale) * (hideDescription ? 0.8 : 1)
    const titleHeight = titleFontSize + 8 * 2
    const score = Math.round((meta?.effective_score ?? 0) / 20)
    const theme = useTheme()

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
          spacingHorizontal={0}
          maxItems={4}
        />
      </Suspense>
    )

    const shouldShowOneLine = hideDescription && !description && !state.editing

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
        <VStack
          className="hover-faded-in-parent"
          alignItems="flex-start"
          justifyContent="flex-start"
          flex={1}
          // turn this off breaks something? but hides the rest of title hover?
          // overflow="hidden"
          // prevent jitter/layout moving until loaded
          display={restaurant.name === null ? 'none' : 'flex'}
          position="relative"
          {...(!flexibleHeight && {
            height: ITEM_HEIGHT,
            minHeight: ITEM_HEIGHT,
            maxHeight: ITEM_HEIGHT,
          })}
          {...(isExpanded && {
            transform: [{ translateX: 300 }],
          })}
          {...(shouldShowOneLine && {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 5,
            hoverStyle: {
              backgroundColor: theme.backgroundColorTransluscent,
            },
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
            {above}
            {!hideRate && (
              <RestaurantUpVoteDownVote
                rounded
                score={score}
                restaurantSlug={restaurantSlug}
                activeTagSlugs={activeTagSlugs}
                onClickPoints={toggleSetExpanded}
              />
            )}
          </AbsoluteVStack>

          {/* ROW: TITLE */}

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
            <VStack
              hoverStyle={{ backgroundColor: theme.backgroundColorTransluscent }}
              width={950}
              {...(shouldShowOneLine && {
                width: 'auto',
                hoverStyle: {
                  backgroundColor: 'transparent',
                },
              })}
              position="relative"
            >
              {/* LINK */}
              <Link
                flex={1}
                tagName="div"
                name="restaurant"
                params={{ slug: restaurantSlug }}
                zIndex={2}
              >
                <HStack
                  paddingLeft={hideRate ? 10 : 64}
                  paddingTop={15}
                  position="relative"
                  alignItems="center"
                >
                  <AbsoluteVStack x={-28} y={3} zIndex={-1}>
                    <RankView rank={rank} />
                  </AbsoluteVStack>

                  <Spacer size="xs" />

                  {shouldShowOneLine && (
                    <Image
                      source={{ uri: getImageUrl(restaurant.image ?? '', 42, 42) }}
                      style={{
                        marginVertical: -15,
                        marginRight: 2,
                        marginLeft: 8,
                        width: 42,
                        height: 42,
                        borderRadius: 42,
                      }}
                    />
                  )}

                  {/* SECOND LINK WITH actual <a /> */}
                  <Link name="restaurant" params={{ slug: restaurantSlug }}>
                    <HStack
                      paddingHorizontal={8}
                      borderRadius={8}
                      alignItems="center"
                      marginVertical={-5}
                      maxWidth={contentSideProps.maxWidth}
                      hoverStyle={{
                        backgroundColor: theme.backgroundColorSecondary,
                      }}
                      pressStyle={{
                        backgroundColor: theme.backgroundColorTertiary,
                      }}
                      {...(shouldShowOneLine && {
                        width: 200,
                        overflow: 'hidden',
                      })}
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

              <Spacer size="md" />
            </VStack>
          </Hoverable>

          {/* ROW: CENTER CONTENT AREA */}
          {/* zindex must be above title/bottom so hovers work on dishview voting/search */}
          {!shouldShowOneLine && (
            <HStack
              y={-10}
              pointerEvents="none"
              zIndex={10}
              paddingLeft={hideRate ? 0 : 65}
              paddingRight={10}
              flex={1}
              maxHeight={flexibleHeight ? 1000 : 66}
            >
              <VStack
                {...contentSideProps}
                className="fix-safari-shrink-height"
                justifyContent="center"
                flex={1}
                zIndex={100}
              >
                {/* ROW: OVERVIEW */}
                <RestaurantOverview
                  isDishBot
                  isEditingDescription={state.editing}
                  text={state.description}
                  onEditCancel={() => {
                    setState((prev) => ({ ...prev, editing: false }))
                  }}
                  onEditDescription={(description) => {
                    setState((prev) => ({ ...prev, description }))
                  }}
                  fullHeight
                  restaurantSlug={restaurantSlug}
                  maxLines={flexibleHeight ? 2000 : 2}
                />
                {flexibleHeight ? <VStack flex={1} /> : null}
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
                  size={dishSize}
                  isLoaded={isLoaded}
                />
              </Suspense>
            </HStack>
          )}

          {/* ROW: BOTTOM ROW */}

          <HStack
            paddingLeft={20}
            height={46}
            className="safari-fix-overflow"
            position="relative"
            alignItems="center"
            width="100%"
            overflow="hidden"
            spacing
          >
            {beforeBottomRow}

            {!!editableDescription && !state.editing && (
              <Button onPress={() => setState((prev) => ({ ...prev, editing: true }))}>Edit</Button>
            )}

            {!!editableDescription && state.editing && (
              <Button
                themeInverse
                onPress={() => {
                  setState((prev) => ({ ...prev, editing: false }))
                  onChangeDescription?.(state.description ?? '')
                }}
              >
                Save
              </Button>
            )}

            <InteractiveContainer borderColor="transparent">
              <Link
                name="restaurant"
                params={{
                  slug: props.restaurantSlug,
                  section: 'reviews',
                }}
              >
                <SmallButton
                  marginRight={-2}
                  borderRadius={0}
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

              <Suspense fallback={<Spacer size={44} />}>
                <VStack marginRight={-2}>
                  <RestaurantFavoriteStar borderRadius={0} size="md" restaurantId={restaurantId} />
                </VStack>
              </Suspense>

              <Suspense fallback={<Spacer size={44} />}>
                <RestaurantAddToListButton
                  borderRadius={0}
                  restaurantSlug={restaurantSlug}
                  noLabel
                />
              </Suspense>
            </InteractiveContainer>

            {!!price_range && (
              <>
                <Text fontSize={14} fontWeight="700" color={theme.colorTertiary}>
                  {price_range}
                </Text>
              </>
            )}

            {!!open.isOpen && (
              <>
                <Circle size={8} backgroundColor={green} />
              </>
            )}

            {!!open.text && (
              <>
                <Link name="restaurantHours" params={{ slug: restaurantSlug }}>
                  <SmallButton textProps={{ opacity: 0.6 }}>{open.nextTime || '~~'}</SmallButton>
                </Link>
              </>
            )}

            {!!restaurant.address && (
              <RestaurantAddress
                size={hideDescription ? 'xxs' : 'xs'}
                curLocInfo={curLocInfo!}
                address={restaurant.address}
              />
            )}

            <Suspense fallback={null}>
              <RestaurantDeliveryButtons showLabels restaurantSlug={restaurantSlug} />
            </Suspense>

            {tagsRowContent}
          </HStack>

          {/* bottom spacing */}
          {!hideDescription && <Spacer size={10} />}
        </VStack>
      </Hoverable>
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
    const dishSize = size === 'lg' ? 150 : 130

    return (
      <>
        <HStack
          position="relative"
          pointerEvents="none"
          paddingHorizontal={20}
          paddingVertical={0}
          // this is to pull it up near title
          marginTop={-35}
          x={-15}
          alignItems="center"
        >
          {props.editable && (
            <EditRestaurantTagsButton
              restaurantSlug={props.restaurantSlug}
              tagSlugs={props.tagSlugs ?? dishes.map((x) => x.slug)}
              onChange={props.onChangeTags}
            />
          )}
          <SkewedCardCarousel>
            {!!dishes[0]?.name &&
              dishes.map((dish, i) => {
                // const isEven = i % 2 === 0
                const baseSize = foundMatchingSearchedDish
                  ? i == 0
                    ? dishSize
                    : dishSize * 0.95
                  : dishSize

                const preventLoad = !isLoaded && i > showInitial
                return (
                  <VStack key={dish.slug} marginRight={-2} zIndex={100 - i}>
                    <DishView
                      preventLoad={preventLoad}
                      size={baseSize}
                      restaurantSlug={props.restaurantSlug}
                      restaurantId={props.restaurantId}
                      {...dish}
                      showSearchButton={!props.editable}
                    />
                  </VStack>
                )
              })}
          </SkewedCardCarousel>
        </HStack>
      </>
    )
  })
)
