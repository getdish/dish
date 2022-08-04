import { brandColor, isWeb } from '../../../constants/constants'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { getWindowWidth } from '../../../helpers/getWindow'
import { numberFormat } from '../../../helpers/numberFormat'
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
import { Restaurant, RestaurantItemMeta, RestaurantQuery, graphql } from '@dish/graph'
import {
  AbsoluteYStack,
  Button,
  Circle,
  H2,
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
import { Heart, MessageCircle, MessageSquare, Tag } from '@tamagui/feather-icons'
import React, { Suspense, memo, useCallback, useEffect, useState } from 'react'
import { Dimensions } from 'react-native'

export const ITEM_HEIGHT = 130

export type RestaurantListItemProps = {
  curLocInfo: GeocodePlace | null
  restaurantSlug?: string
  restaurant?: RestaurantQuery
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
  dishSize?: 'md' | 'lg'
  shouldShowOneLine?: boolean
}

function error<Item>(msg: string) {
  throw new Error(msg)
  return null as any as Item
}

export const RestaurantListItem = memo(
  graphql(function RestaurantListItemContent(props: RestaurantListItemProps) {
    const {
      rank,
      restaurant: restaurantProp,
      restaurantSlug: restaurantSlugProp,
      dishSize,
      curLocInfo,
      activeTagSlugs,
      shouldShowOneLine,
      hideRate,
      meta,
      hideTagRow,
      description = null,
      dishSlugs,
      editableDishes,
      onChangeDishes,
      onChangeDescription,
      editableDescription,
    } = props
    // const media = useMedia()
    const restaurant =
      restaurantProp ??
      (restaurantSlugProp
        ? queryRestaurant(restaurantSlugProp)[0]
        : error<RestaurantQuery>(`needs restaurant or restaurantSlug prop`))

    const restaurantSlug = restaurant?.slug ?? ''

    const [state, setState] = useState({
      editing: false,
      description: null as null | string,
    })
    // const handleChangeDishes = useCallback(onChangeDishes as any, [])
    // const isActive = useStoreInstanceSelector(
    //   getSearchPageStore(),
    //   (x) => x.index === rank - 1
    // )
    // const totalReviews = useTotalReviews(restaurant)

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
    const open = openingHours(restaurant)
    const [price_label, price_color, price_range] = priceRange(restaurant)

    return (
      <HoverToZoom slug={restaurantSlug}>
        <XStack
          flexGrow={1}
          position="relative"
          pb="$3"
          hoverStyle={{
            backgroundColor: 'rgba(100,100,100,0.1)',
          }}
        >
          {/* border left */}
          {/* <AbsoluteYStack
            top={0}
            bottom={0}
            zIndex={-1}
            width={18}
            left={-13}
            backgroundColor={isActive ? brandColor : 'transparent'}
            borderTopRightRadius={8}
            borderBottomRightRadius={8}
          /> */}

          {/* vote button and score */}
          <YStack t={0} b={0} ai="center" jc="center" px="$2">
            {/* just swipe to like on mobile, or tiny heart on desktop */}
            <Heart opacity={0.3} size={12} />
            {/* {!hideRate && (
              <RestaurantUpVoteDownVote
                rounded
                score={score}
                restaurant={restaurant}
                activeTags={activeTagSlugs}
                onClickPoints={toggleSetExpanded}
              />
            )} */}
          </YStack>

          {/* ROW: TITLE */}

          <YStack width="100%" position="relative">
            {/* LINK */}
            <Link
              // flex={2} // messes up native
              name="restaurant"
              params={{ slug: restaurantSlug }}
              zIndex={2}
              noWrapText
              disableDisplayContents
            >
              <XStack px="$4" pt="$4" position="relative" alignItems="center">
                {/* SECOND LINK WITH actual <a /> */}
                <H2 fontFamily="$stylish" selectable={false} size="$9" ellipse fow="300">
                  {restaurantName}
                </H2>
              </XStack>
            </Link>

            <XStack position="relative" alignItems="center">
              <XStack paddingLeft={20} alignItems="center" space="$6">
                {/* <XStack display={media.sm ? 'none' : 'flex'}>
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
                      {numberFormat(
                        restaurant.reviews_aggregate().aggregate?.count() ?? 0,
                        'sm'
                      )}
                    </SmallButton>
                  </Link>

                  <Suspense fallback={<Spacer size={44} />}>
                    <RestaurantFavoriteButton size="$3" restaurantSlug={restaurantSlug} />
                  </Suspense>

                  <Suspense fallback={<Spacer size={44} />}>
                    <RestaurantAddToListButton restaurantSlug={restaurantSlug} noLabel />
                  </Suspense>
                </Group>
              </XStack> */}

                <XStack marginLeft={-5} alignItems="center">
                  <Paragraph
                    o={0.5}
                    width={42}
                    textAlign="center"
                    fontWeight="500"
                    selectable={false}
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
                      size="xs"
                      curLocInfo={curLocInfo!}
                      address={restaurant.address}
                    />
                  )}
                </XStack>

                {!!editableDescription && !state.editing && (
                  <SmallButton
                    onPress={() => setState((prev) => ({ ...prev, editing: true }))}
                  >
                    Edit
                  </SmallButton>
                )}

                {/* <Suspense fallback={null}>
                <RestaurantDeliveryButtons
                  showLabels={!shouldShowOneLine}
                  restaurantSlug={restaurantSlug}
                />
              </Suspense> */}

                {/* <RestaurantOverallAndTagReviews
                borderless
                hideDescription
                size="sm"
                showScoreTable
                key={restaurantSlug}
                restaurant={restaurant}
              /> */}

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

                {/* {!hideTagRow && (
                <Suspense fallback={null}>
                  <RestaurantTagsList
                    size="$3"
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
              )} */}
              </XStack>
            </XStack>
          </YStack>

          {/* ROW: BOTTOM ROW */}

          <XStack
            $sm={{ dsp: 'none' }}
            space
            fullscreen
            left="auto"
            ai="center"
            jc="center"
            m="$4"
          >
            <Button icon={MessageCircle} size="$6" circular />
            {/* <Button icon={Tag} size="$6" circular /> */}
          </XStack>

          {/* bottom spacing */}
          <Spacer size={10} />
        </XStack>
      </HoverToZoom>
    )
  })
)

// {/* ROW: CENTER CONTENT AREA */}
// {/* zindex must be above title/bottom so hovers work on dishview voting/search */}
// {!shouldShowOneLine && (
//   <XStack
//     y={-10}
//     pointerEvents="none"
//     zIndex={10}
//     paddingLeft={hideRate ? 0 : 65}
//     paddingRight={10}
//     flex={1}
//     maxHeight={flexibleHeight ? 1000 : 66}
//   >
//     {/* ROW: OVERVIEW */}

//     {/* <RestaurantOverview
//       isDishBot
//       isEditingDescription={state.editing}
//       text={state.description}
//       onEditCancel={() => {
//         setState((prev) => ({ ...prev, editing: false }))
//       }}
//       onEditDescription={(description) => {
//         setState((prev) => ({ ...prev, description }))
//       }}
//       fullHeight
//       restaurantSlug={restaurantSlug}
//       maxLines={flexibleHeight ? 2000 : 2}
//     /> */}

//     {/* {flexibleHeight ? <YStack flex={1} /> : null} */}

//     {/* <Suspense fallback={null}>
//       <RestaurantPeekDishes
//         restaurantSlug={props.restaurantSlug}
//         restaurantId={props.restaurantId}
//         activeTagSlugs={activeTagSlugs}
//         tagSlugs={dishSlugs}
//         editable={editableDishes}
//         onChangeTags={handleChangeDishes}
//         size={dishSize}
//         isLoaded={isLoaded}
//       />
//     </Suspense> */}
//   </XStack>
// )}
