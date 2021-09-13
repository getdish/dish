import { fullyIdle, series } from '@dish/async'
import { graphql } from '@dish/graph'
import { MessageSquare } from '@dish/react-feather'
import React, { Suspense, memo, useEffect } from 'react'
import {
  AbsoluteVStack,
  Circle,
  HStack,
  InteractiveContainer,
  Spacer,
  Text,
  VStack,
  useMedia,
  useTheme,
} from 'snackui'

import { green, red } from '../../../constants/colors'
import { isWeb } from '../../../constants/constants'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { getWindowWidth } from '../../../helpers/getWindow'
import { numberFormat } from '../../../helpers/numberFormat'
import { Image } from '../../views/Image'
import { Link } from '../../views/Link'
import { SmallButton } from '../../views/SmallButton'
import { HoverToZoom } from '../restaurant/HoverToZoom'
import { RankView } from '../restaurant/RankView'
import { RestaurantAddress } from '../restaurant/RestaurantAddress'
import { RestaurantDeliveryButtons } from '../restaurant/RestaurantDeliveryButtons'
import { openingHours, priceRange } from '../restaurant/RestaurantDetailRow'
import { RestaurantFavoriteButton } from '../restaurant/RestaurantFavoriteButton'
import { RestaurantReview } from '../restaurant/RestaurantReview'
import { ReviewTagsRow } from '../restaurant/ReviewTagsRow'
import { useTotalReviews } from '../restaurant/useTotalReviews'
import { RestaurantRatingView } from '../RestaurantRatingView'
import { Column } from './Column'
import { ListItemContentProps } from './ListItemProps'
import { useRestaurantReviewListProps } from './useRestaurantReviewListProps'

export const ListItemContentModern = memo(
  graphql((props: ListItemContentProps) => {
    const { rank, restaurant, editable, reviewQuery, isEditing, setIsEditing, onUpdate } = props
    // modern default
    const review = reviewQuery?.[0]
    const media = useMedia()

    const restaurantReviewListProps = useRestaurantReviewListProps({
      restaurantId: restaurant?.id,
      listSlug: props.listSlug || '',
      reviewQuery,
      onEdit(text) {
        onUpdate()
        setIsEditing(false)
      },
    })

    useEffect(() => {
      if (!!restaurant.name && props.onFinishRender) {
        return series([() => fullyIdle({ min: 16 }), props.onFinishRender!])
      }
    }, [restaurant.name])

    const restaurantName = (restaurant.name ?? '').slice(0, 300)
    const open = openingHours(restaurant)
    const [price_label, price_color, price_range] = priceRange(restaurant)
    const totalReviews = useTotalReviews(restaurant)
    const nameLen = restaurantName.length
    const titleFontScale =
      nameLen > 30
        ? 0.65
        : nameLen > 25
        ? 0.75
        : nameLen > 20
        ? 0.8
        : nameLen > 15
        ? 0.85
        : nameLen > 10
        ? 0.9
        : 1

    const titleFontSize = Math.round((media.sm ? 18 : 22) * titleFontScale)
    const theme = useTheme()
    const imgSize = 120

    if (!restaurant) {
      return null
    }

    return (
      <HoverToZoom id={restaurant.id} slug={restaurant.slug || ''}>
        <VStack
          borderTopColor={theme.borderColor}
          borderTopWidth={0.5}
          hoverStyle={{ backgroundColor: theme.backgroundColorTransluscent }}
          maxWidth="100%"
          width="100%"
          paddingVertical={16}
          paddingLeft={30}
        >
          <AbsoluteVStack
            backgroundColor={theme.backgroundColorSecondary}
            width={imgSize}
            height={imgSize}
            borderRadius={1000}
            x={-100}
            zIndex={0}
            overflow="hidden"
          >
            <Image
              source={{ uri: getImageUrl(restaurant.image ?? '', imgSize, imgSize) }}
              style={{
                width: imgSize,
                height: imgSize,
                // borderRadius: 1000,
              }}
            />
          </AbsoluteVStack>

          <HStack flex={1} marginLeft={-15} alignItems="center" flexGrow={1} position="relative">
            <HStack zIndex={100} position="relative" alignItems="center">
              <VStack marginTop={-5}>
                <RestaurantRatingView restaurant={restaurant} floating size={38} />
              </VStack>
            </HStack>

            <Column width={210} flexDirection="row" justifyContent="flex-start">
              <VStack y={3} marginRight={-12} marginLeft={-8}>
                <RankView rank={rank} />
              </VStack>
              <Link name="restaurant" params={{ slug: restaurant.slug || '' }}>
                <HStack
                  paddingHorizontal={10}
                  paddingVertical={8}
                  borderRadius={8}
                  alignItems="center"
                  hoverStyle={{
                    backgroundColor: theme.backgroundColorSecondary,
                  }}
                  pressStyle={{
                    backgroundColor: theme.backgroundColorTertiary,
                  }}
                  overflow="hidden"
                >
                  <Text
                    fontSize={titleFontSize}
                    color={theme.color}
                    fontWeight="600"
                    letterSpacing={-0.25}
                    paddingHorizontal={1} // prevents clipping due to letter-spacing
                    ellipse
                    maxWidth="100%"
                  >
                    {restaurantName}
                  </Text>
                </HStack>
              </Link>
            </Column>

            <ReviewTagsRow restaurantSlug={restaurant.slug || ''} />
          </HStack>

          <HStack
            paddingVertical={10}
            paddingLeft={60}
            alignItems="center"
            spacing="lg"
            // below the add comment button
            zIndex={0}
            position="relative"
          >
            {/* ROW: OVERVIEW */}
            <VStack justifyContent="center" flex={1} position="relative">
              <Suspense fallback={null}>
                <RestaurantReview
                  hideTagsRow
                  expandable={false}
                  ellipseContentAbove={Infinity}
                  listTheme="modern"
                  isEditing={isEditing}
                  hideMeta
                  {...restaurantReviewListProps}
                  hideRestaurantName
                  restaurantSlug={restaurant.slug || ''}
                  review={review}
                  maxWidth={media.sm ? getWindowWidth() - 95 : 650}
                  listSlug={props.listSlug}
                />
              </Suspense>
            </VStack>
          </HStack>

          <HStack paddingLeft={20} alignItems="center">
            <Column flexDirection="row" width={!!editable && isEditing ? 220 : 180}>
              {!!editable && !isEditing && (
                <SmallButton
                  elevation={1}
                  icon={<MessageSquare size={16} color="#777" />}
                  onPress={() => setIsEditing(true)}
                ></SmallButton>
              )}

              {!!editable && isEditing && (
                <SmallButton elevation={1} onPress={() => setIsEditing(false)}>
                  Cancel
                </SmallButton>
              )}

              <Spacer />

              <InteractiveContainer>
                <Link
                  name="restaurant"
                  flexShrink={1}
                  params={{
                    slug: restaurant.slug || '',
                    section: 'reviews',
                  }}
                >
                  <SmallButton
                    borderRadius={0}
                    tooltip={`Rating Breakdown (${totalReviews} reviews)`}
                    icon={
                      <MessageSquare
                        style={{
                          opacity: 0.5,
                          marginLeft: -4,
                        }}
                        size={12}
                        color={isWeb ? 'var(--colorTertiary)' : 'rgba(150,150,150,0.3)'}
                      />
                    }
                  >
                    {numberFormat(restaurant.reviews_aggregate().aggregate?.count() ?? 0, 'sm')}
                  </SmallButton>
                </Link>
                <RestaurantFavoriteButton
                  borderRadius={0}
                  size="md"
                  restaurantSlug={restaurant.slug || ''}
                />
              </InteractiveContainer>
            </Column>

            <Column width={160} alignItems="flex-start">
              {!!restaurant.address && (
                <RestaurantAddress size={'xs'} address={restaurant.address} />
              )}
            </Column>

            <Column width={20}>
              <Circle size={8} backgroundColor={open.isOpen ? green : `${red}55`} />
            </Column>

            <Column width={60}>
              <Text fontSize={14} color={theme.colorTertiary}>
                {price_range ?? '?'}
              </Text>
            </Column>

            <Column width={100}>
              <Link name="restaurantHours" params={{ slug: restaurant.slug || '' }}>
                <Text fontSize={12} color={theme.colorTertiary}>
                  {open.nextTime || '~~'}
                </Text>
              </Link>
            </Column>

            <Column flexDirection="row" width={75}>
              <Suspense fallback={null}>
                <RestaurantDeliveryButtons
                  showLabels={false}
                  restaurantSlug={restaurant.slug || ''}
                />
              </Suspense>
            </Column>
          </HStack>
        </VStack>
      </HoverToZoom>
    )
  })
)
