import { fullyIdle, series } from '@dish/async'
import { graphql, listFindOne, order_by, refetch, restaurant, review } from '@dish/graph'
import { MessageSquare } from '@dish/react-feather'
import { useStoreInstanceSelector } from '@dish/use-store'
import React, { Suspense, memo, useEffect, useState } from 'react'
import {
  AbsoluteVStack,
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
import { RestaurantAddToListButton } from '../restaurant/RestaurantAddToListButton'
import { RestaurantDeliveryButtons } from '../restaurant/RestaurantDeliveryButtons'
import { openingHours, priceRange } from '../restaurant/RestaurantDetailRow'
import { RestaurantFavoriteButton } from '../restaurant/RestaurantFavoriteButton'
import { RestaurantReview } from '../restaurant/RestaurantReview'
import { useTotalReviews } from '../restaurant/useTotalReviews'
import { RestaurantRatingView } from '../RestaurantRatingView'
import { getSearchPageStore } from '../search/SearchPageStore'

export type ListItemProps = {
  reviewQuery?: review[] | null
  username?: string
  restaurant: restaurant
  listSlug?: string
  hideRate?: boolean
  hideDescription?: boolean
  rank: number
  activeTagSlugs?: string[]
  onFinishRender?: Function
  editable?: boolean
  hideTagRow?: boolean
  above?: any
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

  const topReview = isEditing
    ? null
    : props.restaurant.reviews({
        where: {
          text: {
            _neq: '',
          },
        },
        limit: 1,
        order_by: [{ vote: order_by.desc }],
      })

  const hasListReview = !!listReview?.[0]?.text
  const hasUserReview = !!userReview?.[0]?.text

  const isLoading = listReview?.[0] && listReview?.[0].text === undefined

  listItemContentProps.onUpdate = () => {
    if (topReview) refetch(topReview)
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
        <ListItemContent {...listItemContentProps} reviewQuery={topReview} />
        <ListItemContent {...listItemContentProps} reviewQuery={userReview} />
        <ListItemContent {...listItemContentProps} reviewQuery={listReview} />
      </>
    )
  }

  return <ListItemContent {...listItemContentProps} reviewQuery={topReview} />
})

const ListItemContent = memo(
  graphql(function ListItemContent(
    props: ListItemProps & {
      onUpdate: Function
      isEditing: boolean
      setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
    }
  ) {
    const { rank, restaurant, editable, reviewQuery, isEditing, setIsEditing, onUpdate } = props
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
      nameLen > 50
        ? 0.8
        : nameLen > 40
        ? 0.85
        : nameLen > 30
        ? 0.95
        : nameLen > 25
        ? 0.975
        : nameLen > 15
        ? 1
        : 1

    const titleFontSize = Math.round((media.sm ? 20 : 23) * titleFontScale)
    const titleHeight = titleFontSize + 8 * 2
    const theme = useTheme()
    const imgSize = 160

    if (!restaurant) {
      return null
    }

    return (
      <HoverToZoom id={restaurant.id} slug={restaurant.slug}>
        <HStack
          overflow="hidden"
          className="hover-faded-in-parent"
          alignItems="flex-start"
          justifyContent="flex-start"
          borderTopColor={theme.borderColor}
          borderTopWidth={1}
          flexGrow={1}
          maxWidth="100%"
          // this is the height that keeps the <InteractiveCOntainer> from overflowing
          minHeight={280}
          // turn this off breaks something? but hides the rest of title hover?
          // overflow="hidden"
          // prevent jitter/layout moving until loaded
          display={restaurant.name === null ? 'none' : 'flex'}
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

          {/* first column */}

          <VStack
            backgroundColor={theme.backgroundColorSecondary}
            width={imgSize}
            height={imgSize}
            margin={16}
            marginLeft={media.sm ? -90 : -20}
            position="relative"
            // borderRadius={1000}
          >
            <AbsoluteVStack top={0} right={0} y={-10} x={15} zIndex={10000}>
              <RestaurantRatingView restaurant={restaurant} floating size={52} />
            </AbsoluteVStack>
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

            <Spacer />

            <Suspense fallback={null}>
              <VStack
                width={70}
                marginLeft={media.sm ? 90 : 20}
                x={10}
                // so it doesnt get hidden at the bottom
                marginTop={-50}
                zIndex={1000}
              >
                <InteractiveContainer flexDirection="column">
                  <Link
                    name="restaurant"
                    params={{
                      slug: restaurant.slug || '',
                      section: 'reviews',
                    }}
                  >
                    <SmallButton
                      width="100%"
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
                    width="100%"
                    borderRadius={0}
                    size="md"
                    restaurantSlug={restaurant.slug || ''}
                  />

                  <RestaurantAddToListButton
                    width="100%"
                    borderRadius={0}
                    restaurantSlug={restaurant.slug || ''}
                    noLabel
                  />
                </InteractiveContainer>
              </VStack>
            </Suspense>
          </VStack>

          {/* second column */}

          <VStack flex={1} overflow="hidden" paddingLeft={20} marginLeft={-20}>
            {/* <HoverToZoom id={props.restaurantId} slug={props.restaurantSlug}> */}
            <VStack
              hoverStyle={{ backgroundColor: theme.backgroundColorTransluscent }}
              marginLeft={-200}
              paddingLeft={200}
              paddingTop={5}
              position="relative"
            >
              {/* LINK */}
              <Link
                flex={2}
                tagName="div"
                name="restaurant"
                params={{ slug: restaurant.slug || '' }}
                zIndex={2}
              >
                <Spacer />
                <HStack position="relative" alignItems="center">
                  <VStack marginRight={-10} marginLeft={-8} y={2}>
                    <RankView rank={rank} />
                  </VStack>

                  {/* SECOND LINK WITH actual <a /> */}
                  <Link name="restaurant" params={{ slug: restaurant.slug || '' }}>
                    <HStack
                      paddingHorizontal={8}
                      borderRadius={8}
                      alignItems="center"
                      marginVertical={-5}
                      hoverStyle={{
                        backgroundColor: theme.backgroundColorSecondary,
                      }}
                      pressStyle={{
                        backgroundColor: theme.backgroundColorTertiary,
                      }}
                    >
                      <Text
                        fontSize={titleFontSize}
                        lineHeight={titleHeight}
                        height={titleHeight}
                        color={theme.color}
                        fontWeight="400"
                        letterSpacing={-0.25}
                        paddingHorizontal={1} // prevents clipping due to letter-spacing
                        ellipse
                      >
                        {restaurantName}
                      </Text>
                    </HStack>
                  </Link>
                </HStack>
                <Spacer size="xs" />
              </Link>
            </VStack>
            {/* </HoverToZoom> */}

            {/* ROW: META */}

            <HStack position="relative" className="safari-fix-overflow" alignItems="center" spacing>
              <HStack alignItems="center" overflow="hidden" spacing>
                {!!editable && !isEditing && (
                  <SmallButton themeInverse onPress={() => setIsEditing(true)}>
                    Edit
                  </SmallButton>
                )}

                {!!editable && isEditing && (
                  <SmallButton onPress={() => setIsEditing(false)}>Cancel</SmallButton>
                )}

                {!!restaurant.address && (
                  <RestaurantAddress size={'xs'} address={restaurant.address} />
                )}

                <Text
                  width={42}
                  textAlign="center"
                  fontSize={14}
                  fontWeight="700"
                  color={theme.colorTertiary}
                >
                  {price_range ?? '-'}
                </Text>

                <Circle size={8} backgroundColor={open.isOpen ? green : `${red}55`} />

                <Link name="restaurantHours" params={{ slug: restaurant.slug || '' }}>
                  <SmallButton minWidth={120} textProps={{ opacity: 0.6 }}>
                    {open.nextTime || '~~'}
                  </SmallButton>
                </Link>

                <Suspense fallback={null}>
                  <RestaurantDeliveryButtons
                    showLabels={false}
                    restaurantSlug={restaurant.slug || ''}
                  />
                </Suspense>
              </HStack>
            </HStack>

            <Spacer size="xs" />

            {/* ROW: OVERVIEW */}
            <VStack
              overflow="hidden"
              className="fix-safari-shrink-height"
              justifyContent="center"
              flex={1}
              paddingLeft={9}
              marginLeft={-16}
              position="relative"
            >
              <Suspense fallback={null}>
                <RestaurantReview
                  isEditing={isEditing}
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
              <Spacer />
            </VStack>
          </VStack>
        </HStack>
      </HoverToZoom>
    )
  })
)
