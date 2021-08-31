import { fullyIdle, series } from '@dish/async'
import { RestaurantItemMeta, graphql, order_by } from '@dish/graph'
import { MessageSquare } from '@dish/react-feather'
import { useStoreInstanceSelector } from '@dish/use-store'
import React, { Suspense, memo, useCallback, useEffect, useState } from 'react'
import { Dimensions } from 'react-native'
import {
  AbsoluteVStack,
  Button,
  Circle,
  HStack,
  InteractiveContainer,
  LoadingItem,
  Spacer,
  StackProps,
  Text,
  VStack,
  useMedia,
  useTheme,
} from 'snackui'

import { brandColor, green, red } from '../../../constants/colors'
import { isWeb } from '../../../constants/constants'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { getRestaurantDishes } from '../../../helpers/getRestaurantDishes'
import { numberFormat } from '../../../helpers/numberFormat'
import { selectRishDishViewSimple } from '../../../helpers/selectDishViewSimple'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { QueryRestaurantTagsProps } from '../../../queries/queryRestaurantTags'
import { Image } from '../../views/Image'
import { Link } from '../../views/Link'
import { RestaurantTagsRow } from '../../views/restaurant/RestaurantTagsRow'
import { SmallButton } from '../../views/SmallButton'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { EditRestaurantTagsButton } from '../restaurant/EditRestaurantTagsButton'
import { HoverToZoom } from '../restaurant/HoverToZoom'
import { RankView } from '../restaurant/RankView'
import { RestaurantAddress } from '../restaurant/RestaurantAddress'
import { RestaurantAddToListButton } from '../restaurant/RestaurantAddToListButton'
import { RestaurantDeliveryButtons } from '../restaurant/RestaurantDeliveryButtons'
import { openingHours, priceRange } from '../restaurant/RestaurantDetailRow'
import { RestaurantFavoriteStar } from '../restaurant/RestaurantFavoriteButton'
import { RestaurantReview } from '../restaurant/RestaurantReview'
import { useTotalReviews } from '../restaurant/useTotalReviews'
import { RestaurantRatingView } from '../RestaurantRatingView'
import { getSearchPageStore } from '../search/SearchPageStore'

type ListItemProps = {
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

export const ListItem = (props: ListItemProps) => {
  const theme = useTheme()

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
      <ListItemContent {...props} />
    </Suspense>
  )
}

const excludeTags: QueryRestaurantTagsProps['exclude'] = ['dish']

const ListItemContent = memo(
  graphql(function ListItemContent(props: ListItemProps) {
    const {
      rank,
      restaurantId,
      restaurantSlug,
      dishSize,
      activeTagSlugs,
      hideRate,
      meta,
      hideTagRow,
      beforeBottomRow,
      description = null,
      dishSlugs,
      flexibleHeight,
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

    const titleFontSize = Math.round((media.sm ? 20 : 23) * titleFontScale)
    const titleHeight = titleFontSize + 8 * 2
    const theme = useTheme()

    const imgSize = 180

    return (
      <HoverToZoom id={props.restaurantId} slug={props.restaurantSlug}>
        <HStack
          overflow="hidden"
          className="hover-faded-in-parent"
          alignItems="flex-start"
          justifyContent="flex-start"
          borderTopColor={theme.borderColor}
          borderTopWidth={1}
          flexGrow={1}
          maxWidth="100%"
          // turn this off breaks something? but hides the rest of title hover?
          // overflow="hidden"
          // prevent jitter/layout moving until loaded
          display={restaurant.name === null ? 'none' : 'flex'}
          position="relative"
        >
          {/* active indicator */}
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

          <AbsoluteVStack top={0} left={imgSize} y={15} x={-20} zIndex={10000}>
            <RestaurantRatingView slug={restaurantSlug} floating size={52} />
          </AbsoluteVStack>

          {/* first column */}

          <VStack
            backgroundColor={theme.backgroundColorSecondary}
            width={imgSize}
            height={imgSize}
            margin={16}
            overflow="hidden"
          >
            <Image
              source={{ uri: getImageUrl(restaurant.image ?? '', imgSize, imgSize) }}
              style={{
                width: imgSize,
                height: imgSize,
              }}
            />
          </VStack>

          {/* second column */}

          <VStack flex={1} overflow="hidden" paddingLeft={20} marginLeft={-20}>
            <HoverToZoom id={props.restaurantId} slug={props.restaurantSlug}>
              <VStack
                hoverStyle={{ backgroundColor: theme.backgroundColorTransluscent }}
                marginLeft={-200}
                paddingLeft={200}
                position="relative"
              >
                {/* LINK */}
                <Link
                  flex={2}
                  tagName="div"
                  name="restaurant"
                  params={{ slug: restaurantSlug }}
                  zIndex={2}
                >
                  <Spacer />
                  <HStack position="relative" alignItems="center">
                    <VStack marginRight={-10} marginLeft={-8} y={2}>
                      <RankView rank={rank} />
                    </VStack>

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
                  <Spacer size="sm" />
                </Link>
              </VStack>
            </HoverToZoom>

            {/* ROW: META */}

            <HStack position="relative" className="safari-fix-overflow" alignItems="center" spacing>
              <HStack alignItems="center" overflow="hidden" spacing>
                {beforeBottomRow}

                {!!editableDescription && !state.editing && (
                  <SmallButton onPress={() => setState((prev) => ({ ...prev, editing: true }))}>
                    Edit
                  </SmallButton>
                )}

                {!!restaurant.address && (
                  <RestaurantAddress size={'xs'} address={restaurant.address} />
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
                      width={90}
                      icon={
                        <MessageSquare
                          style={{
                            opacity: 0.5,
                            marginLeft: -8,
                          }}
                          size={12}
                          color={isWeb ? 'var(--colorTertiary)' : 'rgba(150,150,150,0.3)'}
                        />
                      }
                    >
                      {numberFormat(restaurant.reviews_aggregate().aggregate?.count() ?? 0, 'sm')}
                    </SmallButton>
                  </Link>

                  <Suspense fallback={<Spacer size={44} />}>
                    <VStack marginRight={-2}>
                      <RestaurantFavoriteStar
                        borderRadius={0}
                        size="md"
                        restaurantId={restaurantId}
                      />
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

                <Text
                  width={42}
                  textAlign="center"
                  fontSize={14}
                  fontWeight="700"
                  color={theme.colorTertiary}
                >
                  {price_range ?? '-'}
                </Text>

                <Circle size={8} backgroundColor={open.isOpen ? green : `${red}55`} />

                <Link name="restaurantHours" params={{ slug: restaurantSlug }}>
                  <SmallButton minWidth={120} textProps={{ opacity: 0.6 }}>
                    {open.nextTime || '~~'}
                  </SmallButton>
                </Link>

                <Suspense fallback={null}>
                  <RestaurantDeliveryButtons showLabels={false} restaurantSlug={restaurantSlug} />
                </Suspense>
              </HStack>
            </HStack>

            <Spacer />

            {/* ROW: OVERVIEW */}
            <VStack
              overflow="hidden"
              className="fix-safari-shrink-height"
              justifyContent="center"
              flex={1}
              paddingLeft={9}
              marginLeft={-22}
            >
              {restaurant
                .reviews({
                  where: {
                    text: {
                      _is_null: false,
                    },
                  },
                  limit: 2,
                  order_by: [{ updated_at: order_by.asc }],
                })
                .map((review) => (
                  <VStack key={review.id}>
                    <RestaurantReview
                      hideRestaurantName
                      refetchKey={review.text || ''}
                      reviewId={review.id}
                    />
                    <Spacer />
                  </VStack>
                ))}
            </VStack>

            <Spacer />

            {!hideTagRow && (
              <>
                <Spacer size="xxl" />
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
              </>
            )}

            <Spacer size="lg" />

            {/* PEEK / TAGS (RIGHT SIDE) */}
            {/* margin top: negative the titles second row height */}
            <Suspense fallback={null}>
              <ListItemDishTagRow
                restaurantSlug={props.restaurantSlug}
                restaurantId={props.restaurantId}
                activeTagSlugs={activeTagSlugs}
                tagSlugs={dishSlugs}
                editable={editableDishes}
                onChangeTags={handleChangeDishes}
                size={dishSize}
                isLoaded
              />
            </Suspense>

            <Spacer size={10} />

            <Spacer size="lg" />
          </VStack>
        </HStack>
      </HoverToZoom>
    )
  })
)

const ListItemDishTagRow = memo(
  graphql(function ListItemDishTagRow(props: {
    size?: 'lg' | 'md'
    restaurantSlug: string
    restaurantId: string
    activeTagSlugs?: string[]
    isLoaded: boolean
    tagSlugs?: string[]
    editable?: boolean
    onChangeTags?: (slugs: string[]) => void
  }) {
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

    return (
      <HStack position="relative" alignItems="center">
        {props.editable && (
          <EditRestaurantTagsButton
            restaurantSlug={props.restaurantSlug}
            tagSlugs={props.tagSlugs ?? dishes.map((x) => x.slug)}
            onChange={props.onChangeTags}
          />
        )}
        <HStack spacing>
          {!!dishes[0]?.name &&
            dishes.map((dish, i) => {
              return (
                <VStack key={dish.slug} marginRight={-2} zIndex={100 - i}>
                  <TagButton
                    restaurantSlug={props.restaurantSlug}
                    {...getTagButtonProps(dish)}
                    showSearchButton={!props.editable}
                  />
                </VStack>
              )
            })}
        </HStack>
      </HStack>
    )
  })
)
