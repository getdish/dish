import { fullyIdle, series } from '@dish/async'
import { graphql } from '@dish/graph'
import { MessageSquare } from '@dish/react-feather'
import React, { Suspense, memo, useEffect } from 'react'
import {
  Circle,
  HStack,
  InteractiveContainer,
  Spacer,
  Text,
  Toast,
  VStack,
  useMedia,
  useTheme,
} from 'snackui'

import { green, red } from '../../../constants/colors'
import { isWeb } from '../../../constants/constants'
import { getImageUrl } from '../../../helpers/getImageUrl'
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
import { RestaurantOverallAndTagReviews } from '../restaurant/RestaurantOverallAndTagReviews'
import { RestaurantPhotosRow } from '../restaurant/RestaurantPhotosRow'
import { RestaurantReview } from '../restaurant/RestaurantReview'
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

    const titleFontSize = Math.round((media.sm ? 22 : 26) * titleFontScale)
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

    return (
      <HoverToZoom id={restaurant.id} slug={restaurant.slug}>
        <HStack
          paddingVertical={20}
          paddingHorizontal={20}
          hoverStyle={{ backgroundColor: theme.backgroundColorTransluscent }}
          maxWidth="100%"
          width="100%"
          overflow="hidden"
        >
          <HStack flex={1}>
            <VStack flex={1} width={media.xs ? 300 : media.sm ? 450 : 550}>
              <HStack>
                <VStack
                  backgroundColor={theme.backgroundColorSecondary}
                  width={imgSize}
                  height={imgSize}
                  position="relative"
                  borderRadius={1000}
                  overflow="hidden"
                  marginLeft={-70}
                >
                  <Link
                    name="gallery"
                    params={{ restaurantSlug: restaurant.slug || '', offset: 0 }}
                  >
                    <Image
                      source={{ uri: getImageUrl(restaurant.image ?? '', imgSize, imgSize) }}
                      style={{
                        width: imgSize,
                        height: imgSize,
                        // borderRadius: 1000,
                      }}
                    />
                  </Link>
                </VStack>

                <VStack flex={1}>
                  <HStack
                    className="hover-faded-in-parent"
                    alignItems="center"
                    flexGrow={1}
                    position="relative"
                  >
                    <HStack zIndex={100} position="relative" alignItems="center">
                      <VStack marginLeft={-15} marginTop={-5}>
                        <RestaurantRatingView restaurant={restaurant} floating size={42} />
                      </VStack>
                    </HStack>

                    <HStack alignItems="center" marginTop={-5} marginBottom={5}>
                      <VStack y={3} marginRight={-10} marginLeft={-10}>
                        <RankView rank={rank} />
                      </VStack>
                      <Link name="restaurant" params={{ slug: restaurant.slug || '' }}>
                        <HStack
                          paddingHorizontal={10}
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
                            paddingHorizontal={1} // prevents clipping due to letter-spacing
                            ellipse
                            maxWidth="100%"
                          >
                            {restaurantName}
                          </Text>
                        </HStack>
                      </Link>
                    </HStack>
                  </HStack>

                  <HStack
                    marginTop={-3}
                    paddingVertical={0}
                    paddingHorizontal={20}
                    borderTopColor={theme.borderColor}
                    borderTopWidth={0.5}
                    alignItems="center"
                    spacing
                  >
                    {!!restaurant.address && (
                      <RestaurantAddress size={'xs'} address={restaurant.address} />
                    )}
                    <Circle size={8} backgroundColor={open.isOpen ? green : `${red}55`} />
                    <Text fontSize={14} color={theme.colorTertiary}>
                      {price_range ?? '?'}
                    </Text>
                    <Link name="restaurantHours" params={{ slug: restaurant.slug || '' }}>
                      <Text fontSize={12} color={theme.colorTertiary}>
                        {open.nextTime || '~~'}
                      </Text>
                    </Link>
                  </HStack>
                </VStack>
              </HStack>

              {/* START CONTENT ROW */}
              <HStack
                alignItems="center"
                spacing="lg"
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
                    {!isEditing && !review && (
                      <RestaurantOverallAndTagReviews
                        borderless
                        showScoreTable
                        id={restaurant.slug || ''}
                        restaurant={restaurant}
                      />
                    )}

                    {(review || isEditing) && (
                      <VStack paddingRight={10}>
                        <RestaurantReview
                          // hideTagsRow
                          wrapTagsRow
                          expandable={false}
                          ellipseContentAbove={Infinity}
                          listTheme="minimal"
                          isEditing={isEditing}
                          hideMeta={!isExternalReview}
                          {...restaurantReviewListProps}
                          hideRestaurantName
                          restaurantSlug={restaurant.slug}
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
                    elevation={1}
                    icon={<MessageSquare size={16} color="#777" />}
                    onPress={() => setIsEditing(true)}
                  >
                    Edit
                  </SmallButton>
                )}

                {!!editable && isEditing && (
                  <SmallButton elevation={1} onPress={() => setIsEditing(false)}>
                    Cancel
                  </SmallButton>
                )}

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
                  <RestaurantFavoriteButton
                    borderRadius={0}
                    size="md"
                    restaurantSlug={restaurant.slug || ''}
                  />
                </InteractiveContainer>

                <Suspense fallback={null}>
                  <RestaurantDeliveryButtons
                    showLabels={false}
                    restaurantSlug={restaurant.slug || ''}
                  />
                </Suspense>
              </HStack>
            </VStack>

            <VStack x={-40}>
              <RestaurantPhotosRow
                restaurant={restaurant}
                // spacing="md"
                floating
                width={230}
                max={2}
                height={290}
              />
            </VStack>
          </HStack>
        </HStack>
      </HoverToZoom>
    )
  })
)
