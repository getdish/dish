import { fullyIdle, series } from '@dish/async'
import { graphql, useRefetch } from '@dish/graph'
import { PenTool, X } from '@dish/react-feather'
import React, { Suspense, memo, useEffect, useState } from 'react'
import { Circle, HStack, Text, VStack, useMedia, useTheme } from 'snackui'

import { green, red } from '../../../constants/colors'
import { Link } from '../../views/Link'
import { SmallButton } from '../../views/SmallButton'
import { TitleStyled } from '../../views/TitleStyled'
import { HoverToZoom } from '../restaurant/HoverToZoom'
import { RankView } from '../restaurant/RankView'
import { RestaurantAddress } from '../restaurant/RestaurantAddress'
import { RestaurantDeliveryButtons } from '../restaurant/RestaurantDeliveryButtons'
import { openingHours, priceRange } from '../restaurant/RestaurantDetailRow'
import { RestaurantFavoriteButton } from '../restaurant/RestaurantFavoriteButton'
import { RestaurantReview } from '../restaurant/RestaurantReview'
import { ReviewImagesRow } from '../restaurant/ReviewImagesRow'
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
      onDelete,
      onUpdate,
      isExternalReview,
      minimal,
    } = props
    const refetch = useRefetch()
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

    const titleFontSize = Math.round((media.sm ? 26 : 32) * titleFontScale)
    const theme = useTheme()

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

    const [isFocused, setIsFocused] = useState(false)

    if (!restaurant) {
      return null
    }

    return (
      <HoverToZoom id={restaurant.id} slug={restaurant.slug || ''}>
        <HStack
          paddingVertical={25}
          paddingHorizontal={18}
          paddingLeft={28}
          backgroundColor={theme.backgroundColor}
          hoverStyle={{ backgroundColor: theme.backgroundColorTransluscent }}
          maxWidth="100%"
          width="100%"
          overflow="hidden"
          flex={1}
        >
          <VStack maxWidth="100%" flex={1}>
            <HStack
              className="hover-faded-in-parent"
              alignItems="center"
              flexGrow={1}
              position="relative"
            >
              <VStack opacity={0.5} y={3} marginLeft={-38} marginRight={10} width={35}>
                <RankView rank={rank} />
              </VStack>

              <HStack marginHorizontal={-10} alignItems="center">
                <Link name="restaurant" params={{ slug: restaurant.slug || '' }}>
                  <HStack
                    paddingVertical={4}
                    marginVertical={-4}
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
                    <TitleStyled
                      fontSize={titleFontSize}
                      lineHeight={titleFontSize * 1.2}
                      color={theme.color}
                      fontWeight="700"
                      letterSpacing={-0.5}
                      paddingHorizontal={10} // prevents clipping due to letter-spacing
                      ellipse
                      maxWidth="100%"
                    >
                      {restaurantName}
                    </TitleStyled>
                  </HStack>
                </Link>
              </HStack>
            </HStack>

            {!minimal && (
              <HStack spacing="md" alignItems="center" marginTop={media.sm ? -12 : -2}>
                {!isFocused && !!editable && (
                  <SmallButton icon={<X size={15} color="#888" />} onPress={onDelete as any} />
                )}

                {!minimal && !isFocused && !!editable && !isEditing && (
                  <SmallButton
                    tooltip="Write comment"
                    icon={<PenTool size={14} color="#888" />}
                    onPress={() => setIsEditing(true)}
                  >
                    Review
                  </SmallButton>
                )}

                {!!editable && isEditing && (
                  <SmallButton onPress={() => setIsEditing(false)}>Cancel</SmallButton>
                )}

                {!!restaurant.address && (
                  <RestaurantAddress size={'xs'} address={restaurant.address} />
                )}

                <HStack marginRight={10}>
                  <Circle size={4} backgroundColor={open.isOpen ? green : `${red}55`} />
                </HStack>

                <VStack opacity={0.5}>
                  <RestaurantRatingView restaurant={restaurant} size={28} />
                </VStack>

                <Text opacity={0.5} fontSize={14} color={theme.colorTertiary}>
                  {price_range ?? '?'}
                </Text>

                {!!open.nextTime && (
                  <Link
                    opacity={0.5}
                    name="restaurantHours"
                    params={{ slug: restaurant.slug || '' }}
                  >
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

                {!isFocused && (
                  <RestaurantFavoriteButton
                    backgroundColor="transparent"
                    size="sm"
                    borderWidth={0}
                    opacity={0.5}
                    restaurantSlug={restaurant.slug || ''}
                  />
                )}

                <Suspense fallback={null}>
                  <RestaurantDeliveryButtons
                    showLabels={false}
                    label={false}
                    restaurantSlug={restaurant.slug || ''}
                  />
                </Suspense>
              </HStack>
            )}

            {/* ROW: review */}
            {!minimal && (review || isEditing) && (
              <Suspense fallback={null}>
                <VStack className="hide-while-unselectable">
                  <RestaurantReview
                    size="lg"
                    marginTop={0}
                    marginBottom={10}
                    hideImagesRow
                    hideTagsRow
                    expandable={false}
                    ellipseContentAbove={Infinity}
                    listTheme="minimal"
                    isEditing={isEditing}
                    hideMeta={!isExternalReview}
                    {...restaurantReviewListProps}
                    hideRestaurantName
                    restaurantSlug={restaurant.slug || ''}
                    review={review}
                    list={list}
                    listSlug={props.listSlug}
                    onEdit={(text) => {
                      if (review) review.text = text
                      refetch(reviewQuery)
                      restaurantReviewListProps.onEdit?.(text)
                    }}
                  />
                </VStack>
              </Suspense>
            )}
            {/* END CONTENT ROW */}

            <VStack flex={1} />

            {!minimal && (
              <VStack>
                <HStack alignItems="center" spacing="sm">
                  <ReviewTagsRow
                    hideGeneralTags
                    wrapTagsRow
                    list={list}
                    review={review}
                    restaurantSlug={restaurant.slug || ''}
                    onFocusChange={setIsFocused}
                  />
                </HStack>

                <ReviewImagesRow isEditing={editable} marginTop={20} list={list} review={review} />
              </VStack>
            )}
          </VStack>
        </HStack>
      </HoverToZoom>
    )
  })
)
