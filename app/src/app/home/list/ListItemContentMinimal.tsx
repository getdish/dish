import { graphql, useRefetch } from '@dish/graph'
import { LoadingItem, Text, XStack, YStack, useMedia, useTheme, useThemeName } from '@dish/ui'
import { PenTool, X } from '@tamagui/feather-icons'
import React, { Suspense, memo, useState } from 'react'

import { isWeb } from '../../../constants/constants'
import { getWindowWidth } from '../../../helpers/getWindow'
import { useAppDrawerWidth } from '../../hooks/useAppDrawerWidth'
import { ContentScrollViewHorizontalFitted } from '../../views/ContentScrollViewHorizontalFitted'
import { Link } from '../../views/Link'
import { SmallButton } from '../../views/SmallButton'
import { TitleStyled, getListFontTheme } from '../../views/TitleStyled'
import { ensureFlexText } from '../restaurant/ensureFlexText'
import { HoverToZoom } from '../restaurant/HoverToZoom'
import { RankView } from '../restaurant/RankView'
import { RestaurantAddress } from '../restaurant/RestaurantAddress'
import { RestaurantDeliveryButtons } from '../restaurant/RestaurantDeliveryButtons'
import { openingHours, priceRange } from '../restaurant/RestaurantDetailRow'
import { RestaurantFavoriteButton } from '../restaurant/RestaurantFavoriteButton'
import { RestaurantReview } from '../restaurant/RestaurantReview'
import { ReviewImagesRow } from '../restaurant/ReviewImagesRow'
import { ReviewTagsRow } from '../restaurant/ReviewTagsRow'
import { ListItemContentProps } from './ListItemProps'
import { useRestaurantReviewListProps } from './useRestaurantReviewListProps'

export const ListItemContentMinimal = (props: ListItemContentProps) => {
  const [width, setWidth] = useState(getWindowWidth())
  return (
    <YStack overflow="hidden" flex={1}>
      <Suspense fallback={<LoadingItem size="lg" />}>
        <ContentScrollViewHorizontalFitted
          width={width}
          setWidth={setWidth}
          // onScroll={handleScroll}
          scrollEventThrottle={100}
        >
          <Header {...props} />
        </ContentScrollViewHorizontalFitted>
        <Body {...props} />
      </Suspense>
    </YStack>
  )
}

const Header = memo(
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
      minimal,
    } = props
    const review = reviewQuery?.[0]
    const media = useMedia()
    const restaurantName = (restaurant.name ?? '').slice(0, 300)
    const open = openingHours(restaurant)
    const [price_label, price_color, price_range] = priceRange(restaurant)
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

    const titleFontSize = Math.round((media.sm ? 32 : 36) * titleFontScale)
    const theme = useTheme()
    const [isFocused, setIsFocused] = useState(false)
    const drawerWidth = useAppDrawerWidth()
    const themeName = useThemeName()
    const isDark = themeName === 'dark'

    if (!restaurant) {
      return null
    }

    const colors = {
      color: 'white', //isDark ? listColors.lightColor : listColors.darkColor,
      backgroundColor: 'red', //`${isDark ? listColors.lightColor : listColors.darkColor}11`,
    }

    return (
      <HoverToZoom id={restaurant.id} slug={restaurant.slug || ''}>
        <YStack
          // hoverStyle={{ backgroundColor: `${listColors.backgroundColor}11` }}
          hoverStyle={{
            backgroundColor: '$bgTransparent',
          }}
          paddingVertical={20}
          paddingHorizontal={24}
          maxWidth="100%"
          pointerEvents="auto"
          flex={1}
        >
          <XStack>
            <YStack maxWidth={Math.min(drawerWidth - 100, 680)}>
              {ensureFlexText}
              <XStack
                className="hover-faded-in-parent"
                alignItems="center"
                flexGrow={1}
                position="relative"
              >
                <YStack y={3} marginLeft={-35} marginRight={3} width={35}>
                  <RankView rank={rank} />
                </YStack>

                <Link name="restaurant" params={{ slug: restaurant.slug || '' }}>
                  <XStack
                    marginVertical={-4}
                    alignItems="center"
                    maxWidth="100%"
                    // hoverStyle={{
                    //   backgroundColor: theme.bg2,
                    // }}
                    // pressStyle={{
                    //   backgroundColor: theme.bg3,
                    // }}
                    overflow="hidden"
                    // ⚠️ note block necessary
                    display={isWeb ? 'block' : 'flex'}
                  >
                    <TitleStyled
                      fontSize={titleFontSize}
                      fontTheme={getListFontTheme(list?.font)}
                      lineHeight={titleFontSize * 1.35}
                      color={colors.color}
                      hoverStyle={{
                        backgroundColor: colors.backgroundColor,
                      }}
                      fontWeight="200"
                      paddingHorizontal={3} // prevents clipping due to letter-spacing
                      maxWidth="100%"
                    >
                      {restaurantName}
                    </TitleStyled>
                  </XStack>
                </Link>
              </XStack>

              {!minimal && (
                <XStack space="$1" alignItems="center" marginVertical={-7} marginLeft={-10}>
                  {!isFocused && !!editable && (
                    <SmallButton
                      backgroundColor="transparent"
                      borderWidth={0}
                      tooltip="Remove"
                      icon={<X size={15} color="#888" />}
                      onPress={onDelete as any}
                    />
                  )}

                  {!minimal && !isFocused && !!editable && !isEditing && (
                    <SmallButton
                      backgroundColor="transparent"
                      borderWidth={0}
                      icon={<PenTool size={14} color="#888" />}
                      onPress={() => setIsEditing(true)}
                    >
                      Review
                    </SmallButton>
                  )}

                  {!!editable && isEditing && (
                    <SmallButton
                      backgroundColor="transparent"
                      borderWidth={0}
                      onPress={() => setIsEditing(false)}
                    >
                      Cancel
                    </SmallButton>
                  )}

                  {!!restaurant.address && (
                    <RestaurantAddress size={'xs'} address={restaurant.address} />
                  )}

                  {/* 
                  <XStack marginHorizontal={10}>
                    <Circle size={4} backgroundColor={open.isOpen ? green : `${red}55`} />
                  </XStack>

                  <YStack marginHorizontal={10} opacity={0.5}>
                    <RestaurantRatingView restaurant={restaurant} size={28} />
                  </YStack> */}

                  <Text marginHorizontal={10} opacity={0.5} fontSize={14} color={theme.color3}>
                    {price_range ?? '?'}
                  </Text>

                  {!!open.nextTime && (
                    <Link
                      opacity={0.5}
                      name="restaurantHours"
                      params={{ slug: restaurant.slug || '' }}
                    >
                      <Text paddingHorizontal={5} opacity={0.8} fontSize={13} color={theme.color3}>
                        {open.nextTime || ''}
                      </Text>
                    </Link>
                  )}

                  {!isFocused && (
                    <RestaurantFavoriteButton
                      backgroundColor="transparent"
                      borderWidth={0}
                      size="sm"
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
                </XStack>
              )}
            </YStack>

            {!minimal && !!review && (
              <YStack marginTop={-20}>
                <ReviewImagesRow
                  marginTop={10}
                  showGenericImages
                  restaurantSlug={restaurant.slug || ''}
                  isEditing={editable}
                  imgWidth={140}
                  imgHeight={100}
                  list={list}
                  review={review}
                />
              </YStack>
            )}
          </XStack>

          {!minimal && (
            <ReviewTagsRow
              size="lg"
              hideGeneralTags={!editable}
              // wrapTagsRow
              list={list}
              review={review}
              restaurantSlug={restaurant.slug || ''}
              onFocusChange={setIsFocused}
              marginTop={10}
            />
          )}
        </YStack>
      </HoverToZoom>
    )
  })
)

export const Body = memo(
  graphql((props: ListItemContentProps) => {
    const { restaurant, reviewQuery, isEditing, list, setIsEditing, onUpdate, minimal } = props
    const refetch = useRefetch()
    const media = useMedia()
    const review = reviewQuery?.[0]
    const restaurantReviewListProps = useRestaurantReviewListProps({
      restaurantId: restaurant?.id,
      listSlug: props.listSlug || '',
      reviewQuery,
      onEdit(text) {
        onUpdate()
        setIsEditing(false)
      },
    })

    if (!(review || isEditing)) {
      return null
    }
    if (!restaurant || minimal) {
      return null
    }

    return (
      <YStack
        zIndex={100}
        position="relative"
        paddingHorizontal={media.sm ? 0 : 25}
        marginHorizontal={media.sm ? -10 : 0}
        className="hide-while-unselectable"
      >
        <Suspense fallback={null}>
          <RestaurantReview
            hideMeta
            size="lg"
            marginTop={-20}
            marginLeft={-10}
            hideImagesRow
            hideTagsRow
            expandable={false}
            ellipseContentAbove={Infinity}
            isEditing={isEditing}
            {...restaurantReviewListProps}
            hideRestaurantName
            restaurantSlug={restaurant.slug || ''}
            review={review}
            list={list}
            listSlug={props.listSlug}
          />
        </Suspense>
      </YStack>
    )
  })
)
