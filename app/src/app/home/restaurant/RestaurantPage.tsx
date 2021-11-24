import { fullyIdle, series, sleep } from '@dish/async'
import { graphql } from '@dish/graph'
import {
  LoadingItems,
  Spacer,
  Text,
  Theme,
  ThemeInverse,
  XStack,
  YStack,
  useTheme,
  useThemeName,
} from '@dish/ui'
import { Clock } from '@tamagui/feather-icons'
import React, { Suspense, memo, useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'

import { drawerBorderRadius, isWeb, searchBarHeight } from '../../../constants/constants'
import { getColorsForName } from '../../../helpers/getColorsForName'
import { getMinLngLat } from '../../../helpers/mapHelpers'
import { UseColors, useColorsFor } from '../../../helpers/useColorsFor'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { queryRestaurantTags } from '../../../queries/queryRestaurantTags'
import { router } from '../../../router'
import { HomeStateItemRestaurant } from '../../../types/homeTypes'
import { appMapStore, useSetAppMap } from '../../appMapStore'
import { drawerStore } from '../../drawerStore'
import { useAsyncEffect } from '../../hooks/useAsync'
import { ContentScrollView } from '../../views/ContentScrollView'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
import { Link } from '../../views/Link'
import { NotFoundPage } from '../../views/NotFoundPage'
import { PageHead } from '../../views/PageHead'
import { PaneControlButtonsLeft } from '../../views/PaneControlButtons'
import { RestaurantOverview } from '../../views/restaurant/RestaurantOverview'
import { RestaurantTagsList } from '../../views/restaurant/RestaurantTagsList'
import { SmallButton } from '../../views/SmallButton'
import { StackDrawer } from '../../views/StackDrawer'
import { HomeStackViewProps } from '../HomeStackViewProps'
import { PageContentWithFooter } from '../PageContentWithFooter'
import { RestaurantRatingView } from '../RestaurantRatingView'
import { getSearchPageStore } from '../search/SearchPageStore'
import { RestaurantAddCommentButton } from './RestaurantAddCommentReviewButton'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantAddressLinksRow } from './RestaurantAddressLinksRow'
import { RestaurantAddToListButton } from './RestaurantAddToListButton'
import { RestaurantDeliveryButtons } from './RestaurantDeliveryButtons'
import { openingHours } from './RestaurantDetailRow'
import { RestaurantDishRow } from './RestaurantDishRow'
import { RestaurantFavoriteButton } from './RestaurantFavoriteButton'
import { RestaurantLists } from './RestaurantLists'
import { RestaurantMenu } from './RestaurantMenu'
import { RestaurantOverallAndTagReviews } from './RestaurantOverallAndTagReviews'
import { RestaurantPhotosRow } from './RestaurantPhotosRow'
import { RestaurantReviewsList } from './RestaurantReviewsList'
import { RestaurantTagPhotos } from './RestaurantTagPhotos'
import { useSelectedDish } from './useSelectedDish'

type Props = HomeStackViewProps<HomeStateItemRestaurant>

export default function RestaurantPageContainer(props: Props) {
  const theme = useTheme()
  const colors = getColorsForName(props.item.restaurantSlug)
  console.log('TODO theme', colors)
  return (
    <StackDrawer
      closable
      fallback={
        <YStack
          // backgroundColor={colors.themeColor}
          // borderBottomColor={theme.borderColor}
          borderBottomWidth={1}
          minHeight={450}
        >
          <PageContentWithFooter>
            <LoadingItems />
          </PageContentWithFooter>
        </YStack>
      }
    >
      <RestaurantPage {...props} colors={colors} />
    </StackDrawer>
  )
}

const RestaurantPage = memo(
  graphql(
    (props: Props & { colors: UseColors }) => {
      const { item } = props
      const { restaurantSlug, section, sectionSlug } = item
      const [restaurant] = queryRestaurant(restaurantSlug)
      const coords = restaurant?.location?.coordinates ?? []
      const { selectedDish, setSelectedDishToggle } = useSelectedDish(
        section === 'reviews' ? sectionSlug : null
      )
      const [scrollView, setScrollView] = useState<ScrollView | null>(null)
      const [reviewsSection, setReviewsSection] = useState<View | HTMLElement | null>(null)
      const [dishesSection, setDishesSection] = useState<View | null>(null)
      const [hasLoadedAboveFold, setHasLoadedAboveFold] = useState(false)
      const open = openingHours(restaurant!)
      const spacer = <Spacer size={30} />
      const nameLen = restaurant?.name?.length ?? 10
      const scale = 1
      const fontScale = 1.5
      const fontSizeBase =
        nameLen > 40 ? 18 : nameLen > 30 ? 22 : nameLen > 24 ? 24 : nameLen > 16 ? 26 : 32
      const fontSize = Math.round(scale * fontSizeBase * fontScale)
      // const restaurantId = restaurant.id
      const [hasScrolled, setHasScrolled] = useState(false)
      const colors = getColorsForName(restaurantSlug)

      useAsyncEffect(async (mounted) => {
        await sleep(500)
        if (!mounted()) return
        setHasLoadedAboveFold(true)
      }, [])

      // preload from search
      const restaurantFromSearch = getSearchPageStore().results.find(
        (x) => x.slug === item.restaurantSlug
      )

      const position = useMemo(() => {
        return {
          center: {
            lng: coords?.[0],
            lat: coords?.[1],
          },
          span: getMinLngLat(appMapStore.position.span, {
            lng: 0.006,
            lat: 0.006,
          }),
        }
      }, [JSON.stringify(coords)])

      // console.log('RestaurantPage.render', { props, position })

      useSetAppMap({
        id: props.item.id,
        hideRegions: true,
        zoomOnHover: false,
        isActive: props.isActive,
        results: [
          {
            slug: restaurantSlug,
            id: restaurantFromSearch?.id ?? restaurant?.id,
          },
        ],
        ...position,
      })

      // useSnapToFullscreenOnMount()

      useEffect(() => {
        if (!scrollView) return
        const view = item.sectionSlug
          ? dishesSection
          : item.section === 'reviews'
          ? reviewsSection
          : null
        if (!view) return
        if (router.prevPage?.name === 'restaurant') {
          // already on restaurant page, don't scroll
          return
        }
        // only scroll if not scrolled already
        if (scrollY.current !== 0) return
        return series([
          () => fullyIdle({ checks: 3, min: 50 }),
          () => {
            return new Promise((res) => {
              // @ts-expect-error
              view.measure((_x, _y, _w, _h, _pX, pY) => {
                const y = pY - drawerStore.currentMapHeight - searchBarHeight
                res(y)
              })
            })
          },
          (offsetY) => {
            scrollView.scrollTo({ y: offsetY, animated: true })
          },
        ])
      }, [scrollView, item.sectionSlug])

      const scrollY = useRef(0)
      const topTags = queryRestaurantTags({
        restaurant,
        limit: 3,
        exclude: ['category', 'country', 'lense'],
      }).map((x) => x.tag.name)

      const themeName = useThemeName()
      const headerThemeName = colors

      if (!restaurant) {
        return <NotFoundPage />
      }

      const headerEl = (
        <>
          <PaneControlButtonsLeft>
            <Suspense fallback={null}>
              <RestaurantAddCommentButton restaurantSlug={restaurantSlug} />
            </Suspense>
            <Suspense fallback={null}>
              <RestaurantAddToListButton floating restaurantSlug={restaurantSlug} />
            </Suspense>
            <Suspense fallback={null}>
              <RestaurantFavoriteButton floating size="lg" restaurantSlug={restaurantSlug} />
            </Suspense>
          </PaneControlButtonsLeft>
          <YStack
            paddingTop={0}
            // minWidth={minWidth}
            // maxWidth={width}
            borderTopRightRadius={drawerBorderRadius - 1}
            borderTopLeftRadius={drawerBorderRadius - 1}
            width="100%"
            position="relative"
            pointerEvents="none"
            zIndex={10}
          >
            <YStack flex={1}>
              {/* below title row */}
              <ContentScrollViewHorizontal>
                <YStack>
                  {/* title row */}
                  <XStack paddingLeft={20} alignItems="flex-end" position="relative">
                    <YStack width={66} height={66} marginRight={-15} marginBottom={0} zIndex={200}>
                      <Theme name={themeName}>
                        <RestaurantRatingView floating size={66} restaurant={restaurant} />
                      </Theme>
                    </YStack>

                    <XStack
                      y={10}
                      marginRight={-25}
                      pointerEvents="auto"
                      paddingHorizontal={25}
                      paddingVertical={9}
                      alignItems="center"
                      position="relative"
                      zIndex={199}
                      justifyContent="center"
                      minWidth={100}
                      // skewX="-12deg"
                    >
                      {/* <AbsoluteYStack
                    fullscreen
                    backgroundColor={colors.themeColorAlt}
                    zIndex={-1}
                    opacity={0.96}
                    borderRadius={6}
                    shadowColor="#000"
                    shadowOpacity={0.1}
                    shadowRadius={5}
                    skewX="-12deg"
                    shadowOffset={{ height: 3, width: 0 }}
                  /> */}
                      <ThemeInverse>
                        <XStack
                          display={isWeb ? 'block' : 'flex'}
                          maxWidth={280}
                          marginRight={30}
                          paddingTop={50}
                        >
                          <Text
                            className="font-title"
                            fontFamily="$title"
                            color="$color"
                            maxWidth={500}
                            alignSelf="flex-start"
                            selectable
                            letterSpacing={-1}
                            fontSize={fontSize}
                            lineHeight={fontSize}
                            fontWeight="900"
                          >
                            {(restaurant.name || '').trim()}
                          </Text>
                        </XStack>
                      </ThemeInverse>
                    </XStack>

                    <YStack paddingTop={10}>
                      <RestaurantPhotosRow
                        // slanted
                        restaurant={restaurant}
                        space="$2"
                        floating
                        width={130}
                        height={150}
                        showEscalated={hasScrolled}
                      />
                    </YStack>
                  </XStack>

                  <Spacer size="$4" />

                  <XStack pointerEvents="auto" flex={1} alignItems="center" minWidth={280}>
                    {spacer}
                    <YStack flex={10}>
                      <YStack pointerEvents="auto" overflow="hidden" paddingRight={20}>
                        <XStack alignItems="center" maxWidth="100%" minHeight={55}>
                          <>
                            <Suspense fallback={null}>
                              <XStack>
                                <RestaurantAddressLinksRow
                                  size="lg"
                                  restaurantSlug={restaurantSlug}
                                />
                              </XStack>

                              <Spacer size="$2" />

                              <YStack>
                                <RestaurantAddress size="xs" address={restaurant?.address ?? ''} />
                              </YStack>

                              <Spacer size="$2" />

                              <Link name="restaurantHours" params={{ slug: restaurantSlug }}>
                                <SmallButton
                                  backgroundColor="transparent"
                                  borderWidth={0}
                                  icon={
                                    <Clock
                                      size={14}
                                      color={isWeb ? 'var(--color)' : '#999'}
                                      style={{ marginRight: 5 }}
                                    />
                                  }
                                >
                                  {`${open.text}${open.nextTime ? ` (${open.nextTime})` : ''}`}
                                </SmallButton>
                              </Link>

                              <Spacer size="$4" />

                              <RestaurantDeliveryButtons
                                showLabels
                                restaurantSlug={restaurantSlug}
                              />
                            </Suspense>
                          </>
                        </XStack>

                        <Spacer size="$2" />
                      </YStack>
                    </YStack>
                  </XStack>
                </YStack>
              </ContentScrollViewHorizontal>

              <ContentScrollViewHorizontal>
                <XStack flexShrink={0} marginBottom={20}>
                  <YStack flex={1} maxWidth={340} marginBottom={10} pointerEvents="auto">
                    <RestaurantOverview
                      isDishBot
                      maxLines={3}
                      size="lg"
                      restaurantSlug={restaurantSlug}
                    />
                  </YStack>

                  <YStack maxHeight={195} flexWrap="wrap" overflow="hidden" flex={1} maxWidth={200}>
                    <RestaurantTagsList
                      exclude={['dish']}
                      restaurant={restaurant}
                      space={0}
                      maxItems={5}
                      tagButtonProps={{
                        // borderWidth: 0,
                        hideRank: false,
                        hideRating: false,
                        borderWidth: 0,
                        votable: true,
                      }}
                    />
                  </YStack>

                  <YStack
                    maxHeight={195}
                    flexWrap="wrap"
                    overflow="hidden"
                    flex={1}
                    maxWidth={200}
                    ref={setDishesSection as any}
                  >
                    <RestaurantDishRow
                      max={15}
                      restaurantSlug={restaurantSlug}
                      restaurantId={restaurant.id ?? undefined}
                      selectable
                      selected={selectedDish}
                      onSelect={setSelectedDishToggle}
                      // themeName={`${colors.name}-dark`}
                    />
                  </YStack>
                </XStack>
              </ContentScrollViewHorizontal>
            </YStack>
          </YStack>
        </>
      )

      return (
        <>
          <PageHead isActive={props.isActive}>{`${restaurant.name} has the best ${topTags.join(
            ', '
          )}`}</PageHead>
          <ContentScrollView
            ref={setScrollView}
            onScrollYThrottled={(y) => {
              scrollY.current = y
            }}
            id="restaurant"
          >
            <PageContentWithFooter>
              {/* HEADER */}
              {/* -1 margin bottom to overlap bottom border */}
              <Theme name={headerThemeName}>
                <YStack
                  backgroundColor={colors.themeColor}
                  // borderBottomColor={theme.borderColor}
                  // borderBottomWidth={1}
                >
                  {headerEl}
                  {/* <RestaurantHeader
                    themeName={themeName}
                    minHeight={450}
                    restaurantSlug={restaurantSlug}
                  /> */}

                  <YStack marginHorizontal={-15} zIndex={0}>
                    <RestaurantOverallAndTagReviews
                      tagSlug={selectedDish}
                      borderless
                      showScoreTable
                      key={restaurantSlug}
                      restaurant={restaurant}
                    />
                  </YStack>

                  <RestaurantTagPhotos tagSlug={selectedDish} restaurantSlug={restaurantSlug} />

                  <Spacer />

                  <Suspense fallback={null}>
                    <RestaurantLists restaurantSlug={restaurantSlug} />
                  </Suspense>

                  <Spacer size="$8" />

                  {/* END head color AREA */}
                </YStack>
              </Theme>

              <Spacer />

              <YStack ref={setReviewsSection}>
                <Suspense fallback={null}>
                  {hasLoadedAboveFold ? (
                    <RestaurantReviewsList restaurantSlug={restaurantSlug} />
                  ) : (
                    <LoadingItems />
                  )}
                </Suspense>
              </YStack>

              <Spacer size="$8" />

              <YStack flex={1} marginBottom={20} width="100%" alignSelf="center">
                <Suspense fallback={null}>
                  <RestaurantMenu restaurantSlug={restaurantSlug} />
                </Suspense>
              </YStack>
            </PageContentWithFooter>
          </ContentScrollView>
        </>
      )
    },
    {
      // anywhere you use useSetAppMap
      // so it loads the map location right away
      suspense: false,
    }
  )
)
