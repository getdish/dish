import { brandColor, isWeb } from '../../../constants/constants'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { getWindowWidth } from '../../../helpers/getWindow'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { QueryRestaurantTagsProps } from '../../../queries/queryRestaurantTags'
import { GeocodePlace } from '../../../types/homeTypes'
import { ContentScrollViewHorizontalFitted } from '../../views/ContentScrollViewHorizontalFitted'
import { Image } from '../../views/Image'
import { Link } from '../../views/Link'
import { SlantedTitle } from '../../views/SlantedTitle'
import { SmallButton } from '../../views/SmallButton'
import { RestaurantOverview } from '../../views/restaurant/RestaurantOverview'
import { RestaurantTagsList } from '../../views/restaurant/RestaurantTagsList'
import { RestaurantUpVoteDownVote } from '../../views/restaurant/RestaurantUpVoteDownVote'
import { getSearchPageStore } from '../search/SearchPageStore'
import { HoverToZoom } from './HoverToZoom'
import { RankView } from './RankView'
import { RestaurantAddToListButton } from './RestaurantAddToListButton'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantDeliveryButtons } from './RestaurantDeliveryButtons'
import { openingHours, priceRange } from './RestaurantDetailRow'
import { RestaurantFavoriteButton } from './RestaurantFavoriteButton'
import { RestaurantListItemScoreBreakdown } from './RestaurantListItemScoreBreakdown'
import { RestaurantOverallAndTagReviews } from './RestaurantOverallAndTagReviews'
import { RestaurantPeekDishes } from './RestaurantPeekDishes'
import { useTotalReviews } from './useTotalReviews'
import { RestaurantItemMeta, graphql } from '@dish/graph'
import {
  AbsoluteYStack,
  Button,
  Circle,
  Group,
  LoadingItem,
  LoadingItemsSmall,
  Paragraph,
  Spacer,
  Text,
  XStack,
  YStack,
  YStackProps,
  useMedia,
} from '@dish/ui'
import { useStoreInstanceSelector } from '@dish/use-store'
import { MessageSquare } from '@tamagui/feather-icons'
import React, { Suspense, memo, useCallback, useEffect, useState } from 'react'
import { Dimensions } from 'react-native'

export const ITEM_HEIGHT = 180

export type RestaurantListItemProps = {
  curLocInfo: GeocodePlace | null
  restaurantId: string
  restaurantSlug: string
  hideRate?: boolean
  rank: number
  meta?: RestaurantItemMeta
  activeTagSlugs?: string[]
  description?: string | null
  editableDescription?: boolean
  onChangeDescription?: (next: string) => void
  dishSlugs?: string[]
  editableDishes?: boolean
  onChangeDishes?: (slugs: string[]) => void
  hideTagRow?: boolean
  flexibleHeight?: boolean
  above?: any
  beforeBottomRow?: any
  dishSize?: 'md' | 'lg'
  shouldShowOneLine?: boolean
}

export const RestaurantListItem = (props: RestaurantListItemProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const handleScrollMemo = useCallback(() => {
    setIsLoaded(true)
  }, [])
  const handleScroll = isLoaded ? undefined : handleScrollMemo
  const [width, setWidth] = useState(getWindowWidth())

  return (
    <ContentScrollViewHorizontalFitted
      width={width}
      setWidth={setWidth}
      onScroll={handleScroll}
      scrollEventThrottle={100}
    >
      <Suspense fallback={<LoadingItem size="lg" />}>
        <RestaurantListItemContent isLoaded={isLoaded} {...props} />
      </Suspense>
    </ContentScrollViewHorizontalFitted>
  )
}

const excludeTags: QueryRestaurantTagsProps['exclude'] = ['dish']

const RestaurantListItemContent = memo(
  graphql(function RestaurantListItemContent(
    props: RestaurantListItemProps & { isLoaded: boolean }
  ) {
    const {
      rank,
      restaurantId,
      restaurantSlug,
      dishSize,
      curLocInfo,
      activeTagSlugs,
      shouldShowOneLine,
      isLoaded,
      hideRate,
      meta,
      hideTagRow,
      beforeBottomRow,
      description = null,
      dishSlugs,
      flexibleHeight,
      above,
      editableDishes,
      onChangeDishes,
      onChangeDescription,
      editableDescription,
    } = props
    const media = useMedia()
    const [restaurant] = queryRestaurant(restaurantSlug)
    const [state, setState] = useState({
      editing: false,
      description: null as null | string,
    })
    const handleChangeDishes = useCallback(onChangeDishes as any, [])
    const isActive = useStoreInstanceSelector(
      getSearchPageStore(),
      (x) => x.index === rank - 1
    )
    const [isExpanded, setIsExpanded] = useState(false)
    const toggleSetExpanded = useCallback(() => {
      setIsExpanded((x) => !x)
    }, [])
    const totalReviews = useTotalReviews(restaurant)

    useEffect(() => {
      setState((prev) => ({
        ...prev,
        description,
      }))
    }, [description])

    if (!restaurant) {
      return <Paragraph>missing restaurant {restaurantSlug}</Paragraph>
    }

    const restaurantName = (restaurant.name ?? '').slice(0, 300)
    const contentSideProps: YStackProps = {
      width: media.sm ? '70%' : '60%',
      minWidth: media.sm ? (isWeb ? '55vw' : Dimensions.get('window').width * 0.65) : 320,
      maxWidth: Math.min(
        Dimensions.get('window').width * 0.5,
        // flexibleHeight here should really be allowMoreWidth or something
        media.sm ? 360 : flexibleHeight ? 560 : 480
      ),
    }
    const open = openingHours(restaurant)
    const [price_label, price_color, price_range] = priceRange(restaurant)
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
    const titleFontSize =
      Math.round((media.sm ? 20 : 24) * titleFontScale) * (shouldShowOneLine ? 0.8 : 1)
    const titleHeight = titleFontSize + 8 * 2
    const score = Math.round((meta?.effective_score ?? 0) / 20)
    const imgSize = shouldShowOneLine ? 44 : 58

    return (
      <HoverToZoom id={props.restaurantId} slug={props.restaurantSlug}>
        <YStack
          className="hover-faded-in-parent"
          alignItems="flex-start"
          justifyContent="flex-start"
          flexGrow={1}
          // turn this off breaks something? but hides the rest of title hover?
          // overflow="hidden"
          // prevent jitter/layout moving until loaded
          display={restaurant.name === null ? 'none' : 'flex'}
          position="relative"
          {...(!flexibleHeight && {
            height: ITEM_HEIGHT,
            minHeight: ITEM_HEIGHT,
            maxHeight: ITEM_HEIGHT,
          })}
          {...(isExpanded && {
            transform: [{ translateX: 300 }],
          })}
          {...(shouldShowOneLine && {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 5,
            hoverStyle: {
              backgroundColor: '$backgroundPress',
            },
          })}
        >
          {/* expanded content */}
          {meta && isExpanded && (
            <AbsoluteYStack
              backgroundColor="$backgroundStrong"
              width={300 - 40}
              x={-320}
              height="100%"
              padding={20}
              overflow="hidden"
            >
              <SlantedTitle alignSelf="center">Breakdown</SlantedTitle>
              <Spacer />
              <Suspense fallback={<LoadingItemsSmall />}>
                <RestaurantListItemScoreBreakdown
                  activeTagSlugs={props.activeTagSlugs}
                  restaurant={restaurant}
                  meta={meta}
                />
              </Suspense>
            </AbsoluteYStack>
          )}

          {/* border left */}
          <AbsoluteYStack
            top={0}
            bottom={0}
            zIndex={-1}
            width={18}
            left={-13}
            backgroundColor={isActive ? brandColor : 'transparent'}
            borderTopRightRadius={8}
            borderBottomRightRadius={8}
          />

          {/* vote button and score */}
          <AbsoluteYStack top={34} left={-5} zIndex={200000000}>
            {above}

            {!hideRate && (
              <RestaurantUpVoteDownVote
                rounded
                score={score}
                restaurant={restaurant}
                activeTags={activeTagSlugs}
                onClickPoints={toggleSetExpanded}
              />
            )}
          </AbsoluteYStack>

          {/* ROW: TITLE */}

          <YStack
            hoverStyle={{ backgroundColor: '$backgroundPress' }}
            width={950}
            {...(shouldShowOneLine && {
              width: 'auto',
              hoverStyle: {
                backgroundColor: 'transparent',
              },
            })}
            position="relative"
          >
            {/* LINK */}
            <Link
              flex={2}
              tagName="div"
              name="restaurant"
              params={{ slug: restaurantSlug }}
              zIndex={2}
            >
              <XStack
                paddingLeft={hideRate ? 10 : 64}
                paddingTop={shouldShowOneLine ? 10 : 15}
                position="relative"
                alignItems="center"
              >
                <YStack
                  backgroundColor="$backgroundHover"
                  borderRadius={1000}
                  width={imgSize}
                  height={imgSize}
                  marginLeft={shouldShowOneLine ? 0 : hideRate ? -20 : -40}
                  marginVertical={-18}
                  marginRight={2}
                  overflow="hidden"
                >
                  <Image
                    source={{ uri: getImageUrl(restaurant.image ?? '', imgSize, imgSize) }}
                    style={{
                      width: imgSize,
                      height: imgSize,
                    }}
                  />
                </YStack>

                <YStack opacity={0.25} marginRight={-10} y={3} marginLeft={-5}>
                  <RankView rank={rank} />
                </YStack>

                {/* SECOND LINK WITH actual <a /> */}

                <Link name="restaurant" params={{ slug: restaurantSlug }}>
                  <XStack
                    paddingHorizontal={8}
                    borderRadius={8}
                    alignItems="center"
                    marginVertical={-5}
                    maxWidth={contentSideProps.maxWidth}
                    hoverStyle={{
                      backgroundColor: '$backgroundHover',
                    }}
                    pressStyle={{
                      backgroundColor: '$backgroundPress',
                    }}
                    {...(shouldShowOneLine && {
                      width: 200,
                      overflow: 'hidden',
                    })}
                  >
                    <Paragraph
                      fontSize={titleFontSize}
                      lineHeight={titleHeight}
                      height={titleHeight}
                      color="$color"
                      fontWeight="600"
                      letterSpacing={-0.5}
                      paddingHorizontal={1} // prevents clipping due to letter-spacing
                      ellipse
                    >
                      {restaurantName}
                    </Paragraph>
                  </XStack>
                </Link>
              </XStack>
            </Link>

            <Spacer size="$4" />
          </YStack>

          {/* ROW: CENTER CONTENT AREA */}
          {/* zindex must be above title/bottom so hovers work on dishview voting/search */}
          {!shouldShowOneLine && (
            <XStack
              y={-10}
              pointerEvents="none"
              zIndex={10}
              paddingLeft={hideRate ? 0 : 65}
              paddingRight={10}
              flex={1}
              maxHeight={flexibleHeight ? 1000 : 66}
            >
              <YStack
                {...contentSideProps}
                className="fix-safari-shrink-height"
                justifyContent="center"
                flex={1}
                zIndex={100}
                paddingHorizontal={20}
                opacity={0.65}
                {...(media.notSm && {
                  y: -12,
                })}
              >
                {/* ROW: OVERVIEW */}

                <RestaurantOverview
                  isDishBot
                  isEditingDescription={state.editing}
                  text={state.description}
                  onEditCancel={() => {
                    setState((prev) => ({ ...prev, editing: false }))
                  }}
                  onEditDescription={(description) => {
                    setState((prev) => ({ ...prev, description }))
                  }}
                  fullHeight
                  restaurantSlug={restaurantSlug}
                  maxLines={flexibleHeight ? 2000 : 2}
                />
                {flexibleHeight ? <YStack flex={1} /> : null}
              </YStack>

              {/* PEEK / TAGS (RIGHT SIDE) */}
              {/* margin top: negative the titles second row height */}
              <Suspense fallback={null}>
                <RestaurantPeekDishes
                  restaurantSlug={props.restaurantSlug}
                  restaurantId={props.restaurantId}
                  activeTagSlugs={activeTagSlugs}
                  tagSlugs={dishSlugs}
                  editable={editableDishes}
                  onChangeTags={handleChangeDishes}
                  size={dishSize}
                  isLoaded={isLoaded}
                />
              </Suspense>
            </XStack>
          )}

          {/* ROW: BOTTOM ROW */}

          <XStack
            position="relative"
            height={50}
            marginTop={-5}
            paddingBottom={20}
            marginLeft={-30}
            alignItems="center"
            space="$6"
          >
            <XStack
              paddingLeft={20}
              alignItems="center"
              space="$6"
              {...(shouldShowOneLine && {
                paddingLeft: 0,
                minWidth: 460,
                justifyContent: 'flex-start',
              })}
            >
              {beforeBottomRow}

              <XStack display={media.sm ? 'none' : 'flex'}>
                <Group paddingLeft={10}>
                  <Link
                    name="restaurant"
                    params={{
                      slug: props.restaurantSlug,
                      section: 'reviews',
                    }}
                  >
                    <SmallButton
                      tooltip={`Rating Breakdown (${totalReviews} reviews)`}
                      icon={
                        <MessageSquare
                          size={14}
                          color={isWeb ? 'var(--colorPress)' : 'rgba(150,150,150,0.3)'}
                        />
                      }
                    >
                      {/* {numberFormat(restaurant.reviews_aggregate().aggregate?.count() ?? 0, 'sm')} */}
                    </SmallButton>
                  </Link>

                  <Suspense fallback={<Spacer size={44} />}>
                    <RestaurantFavoriteButton size="$3" restaurantSlug={restaurantSlug} />
                  </Suspense>

                  <Suspense fallback={<Spacer size={44} />}>
                    <RestaurantAddToListButton restaurantSlug={restaurantSlug} noLabel />
                  </Suspense>
                </Group>
              </XStack>

              <XStack marginLeft={-5} alignItems="center">
                <Paragraph
                  width={42}
                  textAlign="center"
                  fontSize={14}
                  fontWeight="500"
                  color="$colorPress"
                >
                  {price_range ?? '-'}
                </Paragraph>

                <Circle
                  size="$0.5"
                  marginHorizontal={4}
                  backgroundColor={open.isOpen ? '$green9' : '$red9'}
                />

                {!!restaurant.address && (
                  <RestaurantAddress
                    size={shouldShowOneLine ? 'xxs' : 'xs'}
                    curLocInfo={curLocInfo!}
                    address={restaurant.address}
                  />
                )}
              </XStack>

              {!!editableDescription && !state.editing && (
                <SmallButton onPress={() => setState((prev) => ({ ...prev, editing: true }))}>
                  Edit
                </SmallButton>
              )}

              <Suspense fallback={null}>
                <RestaurantDeliveryButtons
                  showLabels={!shouldShowOneLine}
                  restaurantSlug={restaurantSlug}
                />
              </Suspense>

              <RestaurantOverallAndTagReviews
                borderless
                hideDescription
                size="sm"
                showScoreTable
                key={restaurantSlug}
                restaurant={restaurant}
              />

              {!!editableDescription && state.editing && (
                <Button
                  themeInverse
                  onPress={() => {
                    setState((prev) => ({ ...prev, editing: false }))
                    onChangeDescription?.(state.description ?? '')
                  }}
                >
                  Save
                </Button>
              )}

              {!!open.nextTime && (
                <Link name="restaurantHours" params={{ slug: restaurantSlug }}>
                  <SmallButton textProps={{ opacity: 0.6 }}>
                    {open.nextTime || '~~'}
                  </SmallButton>
                </Link>
              )}

              {!hideTagRow && (
                <Suspense fallback={null}>
                  <RestaurantTagsList
                    exclude={excludeTags}
                    excludeOverall
                    restaurant={restaurant}
                    spacing={0}
                    spacingHorizontal={0}
                    maxItems={4}
                    tagButtonProps={{
                      votable: true,
                      borderWidth: 0,
                      hideIcon: true,
                      hideRating: false,
                      backgroundColor: 'transparent',
                    }}
                  />
                </Suspense>
              )}
            </XStack>
          </XStack>

          {/* bottom spacing */}
          {!shouldShowOneLine && <Spacer size={10} />}
        </YStack>
      </HoverToZoom>
    )
  })
)
