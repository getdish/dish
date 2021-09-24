import { fullyIdle, series } from '@dish/async'
import { graphql, useRefetch } from '@dish/graph'
import { PenTool, X } from '@dish/react-feather'
import React, { Suspense, memo, useEffect, useState } from 'react'
import {
  Circle,
  HStack,
  LoadingItem,
  Spacer,
  Text,
  VStack,
  useMedia,
  useTheme,
  useThemeName,
} from 'snackui'

import { green, red } from '../../../constants/colors'
import { isWeb } from '../../../constants/constants'
import { getWindowWidth } from '../../../helpers/getWindow'
import { useAppDrawerWidth } from '../../hooks/useAppDrawerWidth'
import { ContentScrollViewHorizontalFitted } from '../../views/ContentScrollViewHorizontalFitted'
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

export const ListItemContentMinimal = (props: ListItemContentProps) => {
  // const [isLoaded, setIsLoaded] = useState(false)
  // const handleScrollMemo = useCallback(() => {
  //   setIsLoaded(true)
  // }, [])
  // const handleScroll = isLoaded ? undefined : handleScrollMemo
  const [width, setWidth] = useState(getWindowWidth())

  return (
    <ContentScrollViewHorizontalFitted
      width={width}
      setWidth={setWidth}
      // onScroll={handleScroll}
      scrollEventThrottle={100}
    >
      <Suspense fallback={<LoadingItem size="lg" />}>
        <ListItemContentMinimalContent {...props} />
      </Suspense>
    </ContentScrollViewHorizontalFitted>
  )
}

export const ListItemContentMinimalContent = memo(
  graphql((props: ListItemContentProps) => {
    const {
      listColors,
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

    const titleFontSize = Math.round((media.sm ? 28 : 34) * titleFontScale)
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

    const drawerWidth = useAppDrawerWidth()
    const themeName = useThemeName()
    const isDark = themeName === 'dark'

    if (!restaurant) {
      return null
    }

    return (
      <HoverToZoom id={restaurant.id} slug={restaurant.slug || ''}>
        <HStack backgroundColor={theme.backgroundColor} overflow="hidden" flex={1}>
          <VStack
            hoverStyle={{ backgroundColor: `${listColors.backgroundColor}11` }}
            paddingVertical={25}
            paddingHorizontal={18}
            maxWidth="100%"
            flex={1}
          >
            <HStack
              className="hover-faded-in-parent"
              alignItems="center"
              flexGrow={1}
              position="relative"
            >
              <VStack opacity={0.5} y={3} marginLeft={-35} marginRight={3} width={35}>
                <RankView rank={rank} />
              </VStack>

              <Link name="restaurant" params={{ slug: restaurant.slug || '' }}>
                <HStack alignItems="center" flexDirection="row" flexWrap="nowrap" flex={1}>
                  <HStack
                    marginVertical={-4}
                    alignItems="center"
                    // hoverStyle={{
                    //   backgroundColor: theme.backgroundColorSecondary,
                    // }}
                    // pressStyle={{
                    //   backgroundColor: theme.backgroundColorTertiary,
                    // }}
                    overflow="hidden"
                    // ⚠️ note block necessary
                    display={isWeb ? 'block' : 'flex'}
                  >
                    <TitleStyled
                      fontSize={titleFontSize}
                      lineHeight={titleFontSize * 1.56}
                      backgroundColor={`${listColors.backgroundColor}55`}
                      color={isDark ? listColors.lightColor : listColors.darkColor}
                      hoverStyle={{
                        backgroundColor: `${listColors.backgroundColor}22`,
                        color: theme.color,
                      }}
                      fontWeight="700"
                      paddingHorizontal={3} // prevents clipping due to letter-spacing
                      ellipse
                      maxWidth="100%"
                    >
                      {restaurantName}
                    </TitleStyled>
                  </HStack>
                  <Spacer />
                  <ReviewTagsRow
                    hideGeneralTags={!editable}
                    // wrapTagsRow
                    list={list}
                    review={review}
                    restaurantSlug={restaurant.slug || ''}
                    onFocusChange={setIsFocused}
                  />
                </HStack>
              </Link>
            </HStack>

            {!minimal && (
              <HStack spacing="xs" alignItems="center" marginTop={4}>
                {!isFocused && !!editable && (
                  <SmallButton
                    tooltip="Remove"
                    icon={<X size={15} color="#888" />}
                    onPress={onDelete as any}
                  />
                )}

                {!minimal && !isFocused && !!editable && !isEditing && (
                  <SmallButton
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

                <HStack marginHorizontal={10}>
                  <Circle size={4} backgroundColor={open.isOpen ? green : `${red}55`} />
                </HStack>

                <VStack marginHorizontal={10} opacity={0.5}>
                  <RestaurantRatingView restaurant={restaurant} size={28} />
                </VStack>

                <Text marginHorizontal={10} opacity={0.5} fontSize={14} color={theme.colorTertiary}>
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
                <VStack maxWidth={drawerWidth - 20} className="hide-while-unselectable">
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
                <ReviewImagesRow
                  restaurantId={restaurant?.id}
                  isEditing={editable}
                  marginTop={20}
                  list={list}
                  review={review}
                />
              </VStack>
            )}
          </VStack>
        </HStack>
      </HoverToZoom>
    )
  })
)
