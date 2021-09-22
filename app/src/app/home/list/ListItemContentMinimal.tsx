import { fullyIdle, series } from '@dish/async'
import { graphql } from '@dish/graph'
import { MessageSquare, PenTool, Upload, X } from '@dish/react-feather'
import React, { Suspense, memo, useEffect, useState } from 'react'
import { Circle, HStack, Spacer, Text, VStack, useMedia, useTheme } from 'snackui'

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
import { RestaurantPhotosRow } from '../restaurant/RestaurantPhotosRow'
import { RestaurantReview } from '../restaurant/RestaurantReview'
import { ReviewTagsRow } from '../restaurant/ReviewTagsRow'
import { useTotalReviews } from '../restaurant/useTotalReviews'
import { RestaurantRatingView } from '../RestaurantRatingView'
import { Column } from './Column'
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

            <HStack spacing="lg" alignItems="center" marginTop={media.sm ? -12 : -4} marginLeft={0}>
              <HStack alignItems="center">
                <Circle size={4} backgroundColor={open.isOpen ? green : `${red}55`} />

                {!!restaurant.address && (
                  <RestaurantAddress size={'xs'} address={restaurant.address} />
                )}
              </HStack>

              <VStack opacity={0.5}>
                <RestaurantRatingView restaurant={restaurant} size={28} />
              </VStack>

              <Text opacity={0.5} fontSize={14} color={theme.colorTertiary}>
                {price_range ?? '?'}
              </Text>

              {!!open.nextTime && (
                <Link opacity={0.5} name="restaurantHours" params={{ slug: restaurant.slug || '' }}>
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
                    <VStack>
                      <RestaurantReview
                        size="lg"
                        marginTop={0}
                        marginBottom={10}
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
                        list={list}
                        listSlug={props.listSlug}
                      />
                    </VStack>
                  )}
                </Suspense>
              </VStack>
            </HStack>
            {/* END CONTENT ROW */}

            <VStack flex={1} />

            <HStack alignItems="center" spacing="sm">
              {!isFocused && !!editable && (
                <SmallButton icon={<X size={15} color="#888" />} onPress={onDelete as any} />
              )}

              {!isFocused && !!editable && !isEditing && (
                <SmallButton
                  tooltip="Write comment"
                  icon={<PenTool size={14} color="#888" />}
                  onPress={() => setIsEditing(true)}
                />
              )}

              {!!editable && isEditing && (
                <SmallButton onPress={() => setIsEditing(false)}>Cancel</SmallButton>
              )}

              <ReviewTagsRow
                hideGeneralTags
                wrapTagsRow
                list={list}
                review={review}
                restaurantSlug={restaurant.slug || ''}
                onFocusChange={setIsFocused}
              />
            </HStack>

            <VStack maxWidth="100%" overflow="hidden">
              <RestaurantPhotosRow
                restaurant={restaurant}
                // spacing="xxl"
                floating
                max={5}
                width={180}
                height={140}
              />
            </VStack>
          </VStack>

          {/* <VStack
            marginTop={-30}
            marginBottom={-30}
            display={media.sm ? 'none' : 'flex'}
            marginRight={-200}
            x={-60}
          >
            <RestaurantPhotosRow
              restaurant={restaurant}
              // spacing="xxl"
              floating
              max={2}
              width={100}
              height={120}
            />
          </VStack> */}
        </HStack>
      </HoverToZoom>
    )
  })
)
