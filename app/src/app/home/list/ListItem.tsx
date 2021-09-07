import { fullyIdle, series } from '@dish/async'
import { graphql, listFindOne, refetch, restaurant, review } from '@dish/graph'
import { MessageSquare } from '@dish/react-feather'
import { useStoreInstanceSelector } from '@dish/use-store'
import React, { Suspense, memo, useEffect, useState } from 'react'
import {
  AbsoluteVStack,
  Circle,
  HStack,
  InteractiveContainer,
  StackProps,
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

export type ListItemProps = {
  listTheme?: 'modern' | 'minimal'
  reviewQuery?: review[] | null
  username?: string
  restaurant: restaurant
  listSlug?: string
  hideRate?: boolean
  rank: number
  activeTagSlugs?: string[]
  onFinishRender?: Function
  editable?: boolean
  hideTagRow?: boolean
  above?: any
}

type ColumnProps = StackProps & { allowOverflow?: boolean }

const Column = (props: ColumnProps) => {
  // const theme = useTheme()
  return (
    <VStack
      width={150}
      // borderLeftColor={theme.borderColor}
      // borderLeftWidth={2}
      height={46}
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      {...(props.allowOverflow && {
        overflow: 'visible',
      })}
      {...props}
    />
  )
}

export const ListItem = graphql((props: ListItemProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const listItemContentProps = {
    ...props,
    isEditing,
    setIsEditing,
    onUpdate: () => {
      if (props.reviewQuery) refetch(props.reviewQuery)
    },
  }

  // controlled
  if (props.reviewQuery) {
    return <ListItemContent {...listItemContentProps} />
  }

  // otherwise determine the right review to show (first list-specific, then user, then generic)
  const listReview = props.listSlug
    ? props.restaurant.reviews({
        where: {
          username: {
            _eq: props.username,
          },
          list: {
            slug: {
              _eq: props.listSlug,
            },
          },
          text: {
            _neq: '',
          },
        },
        limit: 1,
      })
    : null

  const userReview = props.restaurant.reviews({
    where: {
      username: {
        _eq: props.username,
      },
      text: {
        _neq: '',
      },
    },
    limit: 1,
  })

  // const topReview = isEditing
  //   ? null
  //   : props.restaurant.reviews({
  //       where: {
  //         text: {
  //           _neq: '',
  //         },
  //       },
  //       limit: 1,
  //       order_by: [{ vote: order_by.desc }],
  //     })

  const hasListReview = !!listReview?.[0]?.text
  const hasUserReview = !!userReview?.[0]?.text

  const isLoading = listReview?.[0] && listReview?.[0].text === undefined

  listItemContentProps.onUpdate = () => {
    // if (topReview) refetch(topReview)
    if (userReview) refetch(userReview)
    if (listReview) refetch(listReview)
  }

  // we need to be sure to render them all first pass so they fetch once,
  // then second pass it will hide all but one

  if (isEditing || hasListReview) {
    return <ListItemContent {...listItemContentProps} reviewQuery={listReview} />
  }
  if (hasUserReview) {
    return <ListItemContent {...listItemContentProps} reviewQuery={userReview} />
  }
  if (isLoading) {
    return (
      <>
        {/* <ListItemContent {...listItemContentProps} reviewQuery={topReview} /> */}
        <ListItemContent {...listItemContentProps} reviewQuery={userReview} />
        <ListItemContent {...listItemContentProps} reviewQuery={listReview} />
      </>
    )
  }
  return <ListItemContent {...listItemContentProps} />
})

const ListItemContent = memo(
  graphql(function ListItemContent(
    props: ListItemProps & {
      onUpdate: Function
      isEditing: boolean
      setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
    }
  ) {
    const {
      listTheme,
      rank,
      restaurant,
      editable,
      reviewQuery,
      isEditing,
      setIsEditing,
      onUpdate,
    } = props
    // modern default
    const isMinimal = listTheme === 'minimal'
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
    const isActive = useStoreInstanceSelector(getSearchPageStore(), (x) => x.index === rank - 1)
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
    const imgSize = isMinimal ? 400 : 110

    if (!restaurant) {
      return null
    }

    return (
      <HoverToZoom id={restaurant.id} slug={restaurant.slug}>
        <VStack
          {...(!isMinimal && {
            borderTopColor: theme.borderColor,
            borderTopWidth: 0.5,
          })}
          {...(isMinimal && {
            paddingVertical: 20,
          })}
          hoverStyle={{ backgroundColor: theme.backgroundColorTransluscent }}
          maxWidth="100%"
          width="100%"
        >
          {/* {isMinimal && (
            <>
              <VStack
                maxWidth={500}
                marginHorizontal="auto"
                flex={2}
                width="100%"
                height={imgSize / 2}
                position="relative"
                overflow="hidden"
              >
                <Link name="gallery" params={{ restaurantSlug: restaurant.slug || '', offset: 0 }}>
                  <Image
                    source={{ uri: getImageUrl(restaurant.image ?? '', imgSize, imgSize) }}
                    style={{
                      width: '100%',
                      height: '100%',
                      // borderRadius: 1000,
                    }}
                  />
                </Link>
              </VStack>
            </>
          )} */}

          <HStack
            className="hover-faded-in-parent"
            alignItems="center"
            flexGrow={1}
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

            <HStack
              zIndex={100}
              position="relative"
              paddingVertical={10}
              alignItems="center"
              {...(!isMinimal && {
                marginBottom: -40,
                marginLeft: -20,
              })}
            >
              {!isMinimal && (
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
              )}

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
            paddingLeft={isMinimal ? 40 : 90}
            alignItems="center"
            spacing="lg"
          >
            {/* ROW: OVERVIEW */}
            <VStack justifyContent="center" flex={1} position="relative">
              <Suspense fallback={null}>
                <RestaurantReview
                  listTheme={listTheme}
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
                  // refetchKey={shownReview.text || ''}
                />
              </Suspense>
            </VStack>
          </HStack>
        </VStack>
      </HoverToZoom>
    )
  })
)
