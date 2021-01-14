import { fullyIdle, series } from '@dish/async'
import { RestaurantItemMeta, graphql, query, tagSlug } from '@dish/graph'
import {
  ChevronDown,
  ChevronUp,
  ChevronsUp,
  MessageSquare,
} from '@dish/react-feather'
import { useStoreInstance } from '@dish/use-store'
import { debounce, sortBy } from 'lodash'
import React, {
  Suspense,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Image } from 'react-native'
import { Dimensions, ScrollView, StyleSheet } from 'react-native'
import {
  AbsoluteVStack,
  Button,
  Circle,
  HStack,
  Input,
  LinearGradient,
  LoadingItem,
  LoadingItemsSmall,
  Modal,
  Spacer,
  StackProps,
  Text,
  Theme,
  Title,
  VStack,
  useMedia,
  useTheme,
} from 'snackui'

import {
  bgLight,
  bgLightHover,
  bgLightPress,
  brandColor,
} from '../../../constants/colors'
import { isWeb } from '../../../constants/constants'
import { getRestaurantDishes } from '../../../helpers/getRestaurantDishes'
import { isWebIOS } from '../../../helpers/isIOS'
import { numberFormat } from '../../../helpers/numberFormat'
import { selectRishDishViewSimple } from '../../../helpers/selectDishViewSimple'
import { GeocodePlace } from '../../../types/homeTypes'
import { appMapStore } from '../../AppMapStore'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { queryRestaurantTagScores } from '../../../queries/queryRestaurantTagScores'
import { CloseButton } from '../../views/CloseButton'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
import { DishView } from '../../views/dish/DishView'
import { DishViewButton } from '../../views/dish/DishViewButton'
import { Link } from '../../views/Link'
import { PaneControlButtons } from '../../views/PaneControlButtons'
import { RestaurantOverview } from '../../views/restaurant/RestaurantOverview'
import { RestaurantTagsRow } from '../../views/restaurant/RestaurantTagsRow'
import { RestaurantUpVoteDownVote } from '../../views/restaurant/RestaurantUpVoteDownVote'
import { SlantedTitle } from '../../views/SlantedTitle'
import { SmallButton } from '../../views/SmallButton'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { searchPageStore } from '../search/SearchPageStore'
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
  curLocInfo: GeocodePlace | null
  restaurantId: string
  restaurantSlug: string
  rank: number
  meta?: RestaurantItemMeta
  activeTagSlugs?: string[]
  onFinishRender?: Function
  description?: string
  editableDescription?: boolean
  onChangeDescription?: (next: string) => void
  editablePosition?: boolean
  onChangePosition?: (next: number) => void
  dishSlugs?: string[]
  editableDishes?: boolean
  onChangeDishes?: (slugs: string[]) => void
  hideTagRow?: boolean
  flexibleHeight?: boolean
}

/**
 * NOTE
 *
 * use slug for anything NOT logged in
 *
 * for logged in calls, we often need to user restaurant_id
 */

const setHoveredSlow = debounce(appMapStore.setHovered, 250)

export const RestaurantListItem = (props: RestaurantListItemProps) => {
  return (
    <Suspense fallback={<LoadingItem size="lg" />}>
      <RestaurantListItemMain {...props} />
    </Suspense>
  )
}

const RestaurantListItemMain = memo(function RestaurantListItemMain(
  props: RestaurantListItemProps
) {
  const [isLoaded, setIsLoaded] = useState(false)
  const content = useMemo(() => {
    return <RestaurantListItemContent isLoaded={isLoaded} {...props} />
  }, [props, isLoaded])

  const handleScrollMemo = useCallback(() => {
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
          if (appMapStore.hovered?.slug === props.restaurantSlug) {
            appMapStore.setHovered(null)
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
      curLocInfo,
      activeTagSlugs,
      isLoaded,
      meta,
      hideTagRow,
      description,
      dishSlugs,
      flexibleHeight,
      editableDishes,
      onChangeDishes,
      onChangeDescription,
      editableDescription,
      onChangePosition,
      editablePosition,
    } = props
    const media = useMedia()
    const restaurant = queryRestaurant(restaurantSlug)

    restaurant.location

    useEffect(() => {
      if (!!restaurant.name && props.onFinishRender) {
        return series([() => fullyIdle({ min: 50 }), props.onFinishRender!])
      }
      return undefined
    }, [restaurant.name])

    const restaurantName = (restaurant.name ?? '').slice(0, 300)
    const isActive = useStoreInstance(
      searchPageStore,
      (x) => x.index === rank - 1
    )
    const [isExpanded, setIsExpanded] = useState(false)

    const contentSideProps: StackProps = {
      width: media.sm ? '75%' : '60%',
      minWidth: media.sm
        ? isWeb
          ? '40vw'
          : Dimensions.get('window').width * 0.65
        : 320,
      maxWidth: Math.min(
        Dimensions.get('window').width * 0.65,
        media.sm ? 360 : 420
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
    const titleFontSize = Math.round((media.sm ? 20 : 28) * titleFontScale)
    const titleHeight = titleFontSize + 8 * 2
    const score = Math.round((meta?.effective_score ?? 0) / 10)
    const theme = useTheme()
    const showVote = !!activeTagSlugs

    const nextDescription = useRef<string>()
    const setDescription = (val: string) => {
      nextDescription.current = val
    }

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

        {showVote && (
          <AbsoluteVStack top={34} left={-5} zIndex={2000000}>
            <RestaurantUpVoteDownVote
              rounded
              score={score}
              restaurantSlug={restaurantSlug}
              activeTagSlugs={activeTagSlugs}
              onClickPoints={() => {
                setIsExpanded((x) => !x)
              }}
            />
          </AbsoluteVStack>
        )}

        <VStack flex={1} alignItems="flex-start" maxWidth="100%">
          {/* ROW: TITLE */}
          <VStack
            hoverStyle={{ backgroundColor: 'rgba(0,0,0,0.015)' }}
            paddingTop={4}
            paddingLeft={14}
            width={950}
            position="relative"
          >
            {/* LINK */}
            <Link
              tagName="div"
              name="restaurant"
              params={{ slug: restaurantSlug }}
            >
              <VStack paddingLeft={showVote ? 47 : 10} paddingTop={25}>
                <HStack position="relative" alignItems="center">
                  <AbsoluteVStack top={-16} left={-34} zIndex={-1}>
                    <RankView rank={rank} />
                  </AbsoluteVStack>

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
                          color={theme.color}
                          fontWeight="800"
                          letterSpacing={-1.25}
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

            <Spacer size={18} />

            {/* SECOND ROW TITLE */}
            <VStack {...contentSideProps}>
              <VStack
                overflow="hidden"
                zIndex={2}
                paddingLeft={showVote ? 60 : 22}
                paddingRight={20}
                marginTop={media.sm ? -6 : 0}
                transform={[{ translateY: -10 }]}
                pointerEvents="auto"
              >
                <HStack alignItems="center" cursor="pointer" spacing="xs">
                  {!!price_range && (
                    <Text
                      fontSize={14}
                      fontWeight="700"
                      color={theme.colorTertiary}
                      marginRight={4}
                    >
                      {price_range}
                    </Text>
                  )}

                  {!!opening_hours && (
                    <SmallButton
                      name="restaurantHours"
                      params={{ slug: restaurantSlug }}
                      borderWidth={0}
                    >
                      {opening_hours}
                    </SmallButton>
                  )}

                  {!!restaurant.address && (
                    <RestaurantAddress
                      size="sm"
                      curLocInfo={curLocInfo!}
                      address={restaurant.address}
                    />
                  )}
                </HStack>
              </VStack>
            </VStack>
          </VStack>

          {/* CENTER CONTENT AREA */}
          <HStack paddingLeft={10} marginTop={-15} flex={1}>
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
                marginTop={flexibleHeight ? 15 : 0}
                marginBottom={flexibleHeight ? 30 : 0}
              >
                <RestaurantOverview
                  fullHeight={flexibleHeight}
                  disableEllipse={flexibleHeight}
                  text={description}
                  editing={editableDescription}
                  onEdit={setDescription}
                  restaurantSlug={restaurantSlug}
                />
              </VStack>

              {/* BOTTOM ROW */}

              <Suspense fallback={null}>
                <HStack
                  minHeight={44} // prevents clipping in lg size
                  transform={[{ translateY: -15 }]}
                  position="relative"
                  alignItems="center"
                  overflow="hidden"
                >
                  <SmallButton
                    name="restaurant"
                    params={{
                      id: props.restaurantId,
                      slug: props.restaurantSlug,
                      section: 'reviews',
                    }}
                    textProps={{
                      color: '#999',
                      fontSize: 14,
                      fontWeight: '600',
                    }}
                    tooltip={`Rating Breakdown (${totalReviews} reviews)`}
                    icon={<MessageSquare size={16} color="rgba(0,0,0,0.3)" />}
                  >
                    {numberFormat(
                      restaurant.reviews_aggregate().aggregate.count() ?? 0,
                      'sm'
                    )}
                  </SmallButton>

                  <Spacer />

                  <Suspense fallback={<Spacer size={44} />}>
                    <RestaurantFavoriteStar
                      size="md"
                      restaurantId={restaurantId}
                    />
                  </Suspense>

                  <Spacer />

                  <RestaurantDeliveryButtons
                    label="🚗"
                    restaurantSlug={restaurantSlug}
                  />

                  <VStack flex={1} minWidth={12} />

                  {editableDescription && (
                    <>
                      {/* <Button>Cancel</Button> */}
                      {/* <Spacer size="sm" /> */}
                      <Theme name="active">
                        <Button
                          onPress={() => {
                            if (nextDescription.current) {
                              onChangeDescription(nextDescription.current)
                            }
                          }}
                        >
                          Save
                        </Button>
                      </Theme>
                    </>
                  )}

                  {!editableDescription && (
                    <>
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
                    </>
                  )}
                </HStack>
              </Suspense>
            </VStack>

            {/* PEEK / TAGS (RIGHT SIDE) */}
            {/* margin top: negative the titles second row height */}
            <VStack
              paddingLeft={10}
              position="relative"
              marginBottom={15}
              marginTop={-60}
              transform={[{ translateY: -8 }]}
            >
              <Suspense fallback={null}>
                <RestaurantPeekDishes
                  restaurantSlug={props.restaurantSlug}
                  restaurantId={props.restaurantId}
                  activeTagSlugs={activeTagSlugs}
                  tagSlugs={dishSlugs}
                  editable={editableDishes}
                  onChangeTags={onChangeDishes}
                  isLoaded={isLoaded}
                />
              </Suspense>

              <VStack flex={1} />

              {!hideTagRow && (
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
              )}
            </VStack>
          </HStack>
        </VStack>
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
      end={[1, 0]}
    />
  </VStack>
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
        tagSlugs: activeTagSlugs,
      })
      console.log('restaurantTags', restaurantTags)
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
    activeTagSlugs?: string[]
    isLoaded: boolean
    tagSlugs?: string[]
    editable?: boolean
    onChangeTags?: (slugs: string[]) => void
  }) {
    const { isLoaded, size = 'md' } = props
    const dishes = props.tagSlugs
      ? queryRestaurant(props.restaurantSlug)
          .tags({
            where: {
              tag: {
                slug: {
                  _in: props.tagSlugs,
                },
              },
            },
          })
          .map(selectRishDishViewSimple)
      : getRestaurantDishes({
          restaurantSlug: props.restaurantSlug,
          tagSlugs: props.activeTagSlugs,
          max: 5,
        })

    const foundMatchingSearchedDish = props.activeTagSlugs?.includes(
      dishes?.[0]?.slug
    )
    const dishSize = 165

    return (
      <>
        {props.editable && (
          <EditRestaurantTags
            restaurantSlug={props.restaurantSlug}
            tagSlugs={props.tagSlugs ?? []}
            onChange={props.onChangeTags}
          />
        )}
        <HStack
          contain="paint layout"
          pointerEvents="auto"
          padding={20}
          paddingVertical={10}
          alignItems="center"
          marginBottom={-35}
          height="100%"
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
                  showSearchButton={!props.editable}
                />
              )
            })}
        </HStack>
      </>
    )
  })
)

const EditRestaurantTags = graphql(
  ({
    restaurantSlug,
    tagSlugs,
    onChange,
  }: {
    restaurantSlug: string
    tagSlugs: string[]
    onChange: (slugs: string[]) => void
  }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [slugs, setSlugs] = useState<string[]>(tagSlugs)
    const restaurant = queryRestaurant(restaurantSlug)
    const theme = useTheme()
    const dishes = (() => {
      const items = slugs.map((slug) => {
        return restaurant.tags({
          where: {
            tag: {
              type: {
                _eq: 'dish',
              },
              slug: {
                _eq: slug,
              },
            },
          },
          limit: 1,
        })[0]
      })

      return sortBy(items, (x) => tagSlugs.indexOf(x.tag.slug))
    })()

    return (
      <>
        <AbsoluteVStack zIndex={100}>
          <Button onPress={() => setIsOpen(true)}>Edit</Button>
        </AbsoluteVStack>

        <Modal
          visible={isOpen}
          maxWidth={480}
          width="90%"
          maxHeight={480}
          onDismiss={() => setIsOpen(false)}
        >
          <PaneControlButtons>
            <CloseButton onPress={() => setIsOpen(false)} />
          </PaneControlButtons>

          <SlantedTitle alignSelf="center" marginTop={-10}>
            {restaurant.name}
          </SlantedTitle>

          <Spacer />

          <VStack width="100%">
            <Input
              backgroundColor={theme.backgroundColorSecondary}
              marginHorizontal={20}
              placeholder="Search dishes..."
            />
          </VStack>

          <ScrollView style={{ width: '100%' }}>
            <VStack padding={18}>
              {dishes.map((dish) => {
                console.log(dish.photos())
                return (
                  <HStack
                    key={dish.tag.slug}
                    spacing
                    padding={5}
                    alignItems="center"
                  >
                    <VStack alignItems="center" justifyContent="center">
                      <ChevronUp size={16} color="rgba(150,150,150,0.9)" />
                      <ChevronDown size={16} color="rgba(150,150,150,0.9)" />
                    </VStack>

                    {!!dish.photos()?.[0] ? (
                      <Image
                        source={{ uri: dish.photos()[0] }}
                        style={{ width: 40, height: 40, borderRadius: 100 }}
                      />
                    ) : (
                      <Circle
                        backgroundColor="rgba(150,150,150,0.29)"
                        size={40}
                      />
                    )}

                    <Title>{dish.tag.name}</Title>
                  </HStack>
                )
              })}
            </VStack>
          </ScrollView>

          <HStack>
            <Theme name="active">
              <Button onPress={() => onChange(slugs)}>Save</Button>
            </Theme>
          </HStack>

          <Spacer />
        </Modal>
      </>
    )
  }
)
