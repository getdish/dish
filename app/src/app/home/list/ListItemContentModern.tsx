import { fullyIdle, series } from '@dish/async'
import { graphql, listFindOne } from '@dish/graph'
import { MessageSquare } from '@dish/react-feather'
import { useStoreInstanceSelector } from '@dish/use-store'
import React, { Suspense, memo, useEffect } from 'react'
import {
  AbsoluteVStack,
  Circle,
  HStack,
  InteractiveContainer,
  Text,
  Toast,
  VStack,
  useMedia,
  useTheme,
} from 'snackui'

import { brandColor, green, red } from '../../../constants/colors'
import { isWeb } from '../../../constants/constants'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { getWindowWidth } from '../../../helpers/getWindow'
import { numberFormat } from '../../../helpers/numberFormat'
import { getUserReviewQueryMutations } from '../../hooks/useUserReview'
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
import { useTotalReviews } from '../restaurant/useTotalReviews'
import { RestaurantRatingView } from '../RestaurantRatingView'
import { getSearchPageStore } from '../search/SearchPageStore'
import { Column } from './Column'
import { ListItemContentProps, ListItemProps } from './ListItem'

export const ListItemContentModern = memo(
  graphql((props: ListItemContentProps) => {
    const { rank, restaurant, editable, reviewQuery, isEditing, setIsEditing, onUpdate } = props
    // modern default
    const review = reviewQuery?.[0]
    const reviewMutations = getUserReviewQueryMutations({
      restaurantId: restaurant?.id,
      reviewQuery,
    })
    const media = useMedia()

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

    const titleFontSize = Math.round((media.sm ? 20 : 26) * titleFontScale)
    const theme = useTheme()
    const imgSize = 70

    if (!restaurant) {
      return null
    }

    return (
      <HoverToZoom id={restaurant.id} slug={restaurant.slug}>
        <VStack
          borderTopColor={theme.borderColor}
          borderTopWidth={0.5}
          hoverStyle={{ backgroundColor: theme.backgroundColorTransluscent }}
          maxWidth="100%"
          width="100%"
          paddingTop={16}
        >
          <HStack
            className="hover-faded-in-parent"
            alignItems="center"
            flexGrow={1}
            position="relative"
          >
            <HStack
              zIndex={100}
              position="relative"
              paddingVertical={10}
              alignItems="center"
              marginBottom={-40}
              marginLeft={-20}
            >
              <VStack
                backgroundColor={theme.backgroundColorSecondary}
                width={imgSize}
                height={imgSize}
                position="relative"
                borderRadius={1000}
                overflow="hidden"
                marginRight={-20}
                marginLeft={-5}
              >
                <Link name="gallery" params={{ restaurantSlug: restaurant.slug || '', offset: 0 }}>
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

              <VStack marginTop={-5}>
                <RestaurantRatingView restaurant={restaurant} floating size={42} />
              </VStack>
              <AbsoluteVStack bottom="-1%" right="10%">
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
              </AbsoluteVStack>
            </HStack>

            <HStack alignItems="center" marginTop={-5} marginBottom={5}>
              <Column width={190} flexDirection="row" alignItems="flex-start">
                <VStack marginRight={-10} marginLeft={-10}>
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
                <Link
                  backgroundColor="red"
                  name="restaurantHours"
                  params={{ slug: restaurant.slug || '' }}
                >
                  <Text fontSize={12} color={theme.colorTertiary}>
                    {open.nextTime || '~~'}
                  </Text>
                </Link>
              </Column>

              <Column width={150}>
                {!!restaurant.address && (
                  <RestaurantAddress size={'xs'} address={restaurant.address} />
                )}
              </Column>

              <Column flexDirection="row" width={75}>
                <Suspense fallback={null}>
                  <RestaurantDeliveryButtons
                    showLabels={false}
                    restaurantSlug={restaurant.slug || ''}
                  />
                </Suspense>
              </Column>

              <Column flexDirection="row" width={150}>
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
              </Column>
            </HStack>
          </HStack>

          <HStack
            marginTop={-20}
            marginBottom={15}
            paddingLeft={90}
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
                  expandable={false}
                  ellipseContentAbove={Infinity}
                  listTheme="modern"
                  isEditing={isEditing}
                  hideMeta
                  onEdit={async (text) => {
                    if (review) {
                      review.text = text
                      reviewMutations.upsertReview(review)
                    } else {
                      // never reviewed before
                      const list = await listFindOne(
                        {
                          slug: props.listSlug,
                        },
                        {
                          keys: ['id'],
                        }
                      )
                      if (!list) {
                        Toast.error('no list')
                        return
                      }
                      reviewMutations.upsertReview({
                        type: 'comment',
                        list_id: list.id,
                        text,
                      })
                    }
                    onUpdate()
                    setIsEditing(false)
                  }}
                  onDelete={() => {
                    reviewMutations.deleteReview()
                  }}
                  hideRestaurantName
                  restaurantSlug={restaurant.slug}
                  review={review}
                  maxWidth={media.sm ? getWindowWidth() - 95 : 650}
                  listSlug={props.listSlug}
                />
              </Suspense>
            </VStack>
          </HStack>
        </VStack>
      </HoverToZoom>
    )
  })
)
