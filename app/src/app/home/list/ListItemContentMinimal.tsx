import { fullyIdle, series } from '@dish/async'
import { graphql } from '@dish/graph'
import { MessageSquare, Plus } from '@dish/react-feather'
import React, { Suspense, memo, useEffect } from 'react'
import { Circle, HStack, Spacer, Text, VStack, useMedia, useTheme } from 'snackui'

import { green, red } from '../../../constants/colors'
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
import { ListItemContentProps } from './ListItemProps'
import { useRestaurantReviewListProps } from './useRestaurantReviewListProps'

export const ListItemContentMinimal = memo(
  graphql((props: ListItemContentProps) => {
    const {
      rank,
      restaurant,
      editable,
      reviewQuery,
      isEditing,
      list,
      setIsEditing,
      onUpdate,
      isExternalReview,
    } = props
    const review = reviewQuery?.[0]
    const media = useMedia()
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

    const titleFontSize = Math.round((media.sm ? 24 : 30) * titleFontScale)
    const theme = useTheme()
    const imgSize = 100

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

    if (!restaurant) {
      return null
    }

    console.log('review?.user_id', review?.user_id)

    return (
      <HoverToZoom id={restaurant.id} slug={restaurant.slug || ''}>
        <HStack
          paddingVertical={25}
          paddingHorizontal={20}
          hoverStyle={{ backgroundColor: theme.backgroundColorTransluscent }}
          maxWidth="100%"
          width="100%"
          overflow="hidden"
        >
          <HStack paddingLeft={10} flex={1}>
            <VStack flex={1} width={media.xs ? 300 : media.sm ? 450 : 550}>
              <HStack>
                <VStack flex={1}>
                  <HStack
                    className="hover-faded-in-parent"
                    alignItems="center"
                    flexGrow={1}
                    position="relative"
                  >
                    <VStack opacity={0.5} y={3} marginLeft={-35} marginRight={10} width={35}>
                      <RankView rank={rank} />
                    </VStack>

                    <HStack marginHorizontal={-10} alignItems="center" marginBottom={5}>
                      <Link name="restaurant" params={{ slug: restaurant.slug || '' }}>
                        <HStack
                          paddingVertical={8}
                          marginVertical={-8}
                          borderRadius={8}
                          alignItems="center"
                          hoverStyle={{
                            backgroundColor: theme.backgroundColorSecondary,
                          }}
                          pressStyle={{
                            backgroundColor: theme.backgroundColorTertiary,
                          }}
                          flex={1}
                          overflow="hidden"
                        >
                          <Text
                            fontSize={titleFontSize}
                            color={theme.color}
                            fontWeight="400"
                            letterSpacing={-0.25}
                            paddingHorizontal={10} // prevents clipping due to letter-spacing
                            ellipse
                            maxWidth="100%"
                          >
                            {restaurantName}
                          </Text>
                        </HStack>
                      </Link>
                    </HStack>

                    <HStack paddingHorizontal={20}>
                      <ReviewTagsRow
                        list={list}
                        review={review}
                        restaurantSlug={restaurant.slug || ''}
                      />
                    </HStack>
                  </HStack>
                </VStack>
              </HStack>

              {/* START CONTENT ROW */}
              <HStack
                alignItems="center"
                // below the add comment button
                zIndex={0}
                position="relative"
              >
                {/* ROW: OVERVIEW */}
                <VStack
                  maxWidth={media.sm ? '100%' : '100%'}
                  justifyContent="center"
                  flex={1}
                  position="relative"
                >
                  <Suspense fallback={null}>
                    {/* {!isEditing && !review && (
                      <RestaurantOverallAndTagReviews
                        borderless
                        showScoreTable
                        id={restaurant.slug || ''}
                        restaurant={restaurant}
                      />
                    )} */}

                    {(review || isEditing) && (
                      <VStack paddingRight={10}>
                        <RestaurantReview
                          hideTagsRow
                          wrapTagsRow
                          expandable={false}
                          ellipseContentAbove={Infinity}
                          listTheme="minimal"
                          isEditing={isEditing}
                          hideMeta={!isExternalReview}
                          {...restaurantReviewListProps}
                          hideRestaurantName
                          restaurantSlug={restaurant.slug || ''}
                          review={review}
                          listSlug={props.listSlug}
                        />
                      </VStack>
                    )}
                  </Suspense>
                </VStack>
              </HStack>
              {/* END CONTENT ROW */}

              <Spacer size="xs" />

              <HStack alignItems="center" spacing="lg">
                {!!editable && !isEditing && (
                  <SmallButton
                    icon={<MessageSquare size={14} color="#888" />}
                    onPress={() => setIsEditing(true)}
                  ></SmallButton>
                )}

                {!!editable && isEditing && (
                  <SmallButton elevation={1} onPress={() => setIsEditing(false)}>
                    Cancel
                  </SmallButton>
                )}

                {/* <RestaurantRatingView restaurant={restaurant} size={34} /> */}

                <HStack paddingVertical={0} paddingRight={10} alignItems="center" spacing>
                  {!!restaurant.address && (
                    <RestaurantAddress size={'xs'} address={restaurant.address} />
                  )}

                  <Circle size={4} backgroundColor={open.isOpen ? green : `${red}55`} />

                  <Text
                    paddingHorizontal={5}
                    opacity={0.8}
                    fontSize={13}
                    color={theme.colorTertiary}
                  >
                    {price_range ?? '?'}
                  </Text>

                  {!!open.nextTime && (
                    <Link name="restaurantHours" params={{ slug: restaurant.slug || '' }}>
                      <Text
                        paddingHorizontal={5}
                        opacity={0.8}
                        fontSize={13}
                        color={theme.colorTertiary}
                      >
                        {open.nextTime || ''}
                      </Text>
                    </Link>
                  )}
                </HStack>
                {/* 
                <Link
                  name="restaurant"
                  flexShrink={1}
                  params={{
                    slug: restaurant.slug || '',
                    section: 'reviews',
                  }}
                >
                  <SmallButton
                    backgroundColor="transparent"
                    tooltip={`Rating Breakdown (${totalReviews} reviews)`}
                    icon={
                      <MessageSquare
                        style={{
                          opacity: 0.5,
                        }}
                        size={12}
                        color={isWeb ? 'var(--colorTertiary)' : 'rgba(150,150,150,0.3)'}
                      />
                    }
                  >
                    {numberFormat(restaurant.reviews_aggregate().aggregate?.count() ?? 0, 'sm')}
                  </SmallButton>
                </Link> */}

                {/* <RestaurantFavoriteButton
                  backgroundColor="transparent"
                  size="md"
                  restaurantSlug={restaurant.slug || ''}
                /> */}

                <Suspense fallback={null}>
                  <RestaurantDeliveryButtons
                    showLabels={false}
                    label={false}
                    restaurantSlug={restaurant.slug || ''}
                  />
                </Suspense>
              </HStack>
            </VStack>

            {/* <VStack x={-40}>
              <RestaurantPhotosRow
                restaurant={restaurant}
                // spacing="md"
                floating
                width={230}
                max={2}
                height={290}
              />
            </VStack> */}
          </HStack>
        </HStack>
      </HoverToZoom>
    )
  })
)
