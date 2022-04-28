import { isWeb } from '../../../constants/constants'
import { getWindowWidth } from '../../../helpers/getWindow'
import { numberFormat } from '../../../helpers/numberFormat'
import { Link } from '../../views/Link'
import { SmallButton } from '../../views/SmallButton'
import { RestaurantRatingView } from '../RestaurantRatingView'
import { HoverToZoom } from '../restaurant/HoverToZoom'
import { RankView } from '../restaurant/RankView'
import { RestaurantAddress } from '../restaurant/RestaurantAddress'
import { RestaurantDeliveryButtons } from '../restaurant/RestaurantDeliveryButtons'
import { openingHours, priceRange } from '../restaurant/RestaurantDetailRow'
import { RestaurantFavoriteButton } from '../restaurant/RestaurantFavoriteButton'
import { RestaurantReview } from '../restaurant/RestaurantReview'
import { ReviewTagsRow } from '../restaurant/ReviewTagsRow'
import { useTotalReviews } from '../restaurant/useTotalReviews'
import { Column } from './Column'
import { ListItemContentProps } from './ListItemProps'
import { useRestaurantReviewListProps } from './useRestaurantReviewListProps'
import { graphql } from '@dish/graph'
import { Circle, Spacer, Text, XStack, YStack, useMedia } from '@dish/ui'
import { MessageSquare } from '@tamagui/feather-icons'
import React, { Suspense, memo } from 'react'

export const ListItemContentModern = memo(
  graphql((props: ListItemContentProps) => {
    const { rank, restaurant, editable, reviewQuery, isEditing, setIsEditing, onUpdate, list } =
      props
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

    const titleFontSize = Math.round((media.sm ? 26 : 28) * titleFontScale)
    // const imgSize = 120

    if (!restaurant) {
      return null
    }

    return (
      <HoverToZoom id={restaurant.id} slug={restaurant.slug || ''}>
        <YStack
          hoverStyle={{ backgroundColor: '$backgroundTransparent' }}
          maxWidth="100%"
          width="100%"
          paddingVertical={16}
          paddingLeft={30}
        >
          <XStack flex={1} marginLeft={-15} alignItems="center" flexGrow={1} position="relative">
            <Column width={320} flexDirection="row" justifyContent="flex-start">
              <YStack y={3} marginRight={-12} marginLeft={-8}>
                <RankView rank={rank} />
              </YStack>
              <Link name="restaurant" params={{ slug: restaurant.slug || '' }}>
                <XStack
                  paddingHorizontal={10}
                  paddingVertical={8}
                  borderRadius={8}
                  alignItems="center"
                  hoverStyle={{
                    backgroundColor: '$backgroundHover',
                  }}
                  pressStyle={{
                    backgroundColor: '$backgroundPress',
                  }}
                  overflow="hidden"
                >
                  <Text
                    fontSize={titleFontSize}
                    color="$color"
                    fontWeight="600"
                    letterSpacing={-0.25}
                    paddingHorizontal={1} // prevents clipping due to letter-spacing
                    ellipse
                    maxWidth="100%"
                  >
                    {restaurantName}
                  </Text>
                </XStack>
              </Link>
            </Column>

            <ReviewTagsRow list={list} review={review} restaurantSlug={restaurant.slug || ''} />
          </XStack>

          <XStack
            alignItems="center"
            space="$6"
            // below the add comment button
            zIndex={0}
            position="relative"
          >
            {/* ROW: OVERVIEW */}
            <YStack justifyContent="center" flex={1} position="relative">
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
                  list={list}
                />
              </Suspense>
            </YStack>
          </XStack>

          <XStack paddingLeft={20} alignItems="center">
            <Column flexDirection="row" width={!editable ? 0 : isEditing ? 300 : 230}>
              {!!editable && !isEditing && (
                <SmallButton
                  icon={<MessageSquare size={16} color="#777" />}
                  onPress={() => setIsEditing(true)}
                ></SmallButton>
              )}

              {!!editable && isEditing && (
                <SmallButton elevation="$1" onPress={() => setIsEditing(false)}>
                  Cancel
                </SmallButton>
              )}

              <Spacer />

              <XStack zIndex={100} position="relative" alignItems="center">
                <RestaurantRatingView restaurant={restaurant} floating size={38} />
              </XStack>

              <Spacer />

              {!!editable && (
                <>
                  <Link
                    name="restaurant"
                    flexShrink={1}
                    params={{
                      slug: restaurant.slug || '',
                      section: 'reviews',
                    }}
                  >
                    <SmallButton
                      tooltip={`Rating Breakdown (${totalReviews} reviews)`}
                      icon={
                        <MessageSquare
                          style={{
                            opacity: 0.5,
                            marginLeft: -4,
                          }}
                          size={12}
                          color={isWeb ? 'var(--color3)' : 'rgba(150,150,150,0.3)'}
                        />
                      }
                    >
                      {numberFormat(restaurant.reviews_aggregate().aggregate?.count() ?? 0, 'sm')}
                    </SmallButton>
                  </Link>
                  <Spacer />
                </>
              )}

              <RestaurantFavoriteButton size="$4" restaurantSlug={restaurant.slug || ''} />
            </Column>

            <Column width={160} alignItems="flex-start">
              {!!restaurant.address && (
                <RestaurantAddress size={'xs'} address={restaurant.address} />
              )}
            </Column>

            <Column width={20}>
              <Circle size={8} backgroundColor={open.isOpen ? '$green8' : '$red8'} />
            </Column>

            <Column width={60}>
              <Text fontSize={14} color="$colorPress">
                {price_range ?? '?'}
              </Text>
            </Column>

            <Column width={100}>
              <Link name="restaurantHours" params={{ slug: restaurant.slug || '' }}>
                <Text fontSize={12} color="$colorPress">
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
          </XStack>
        </YStack>
      </HoverToZoom>
    )
  })
)
