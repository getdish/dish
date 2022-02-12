import { drawerBorderRadius, isWeb, searchBarHeight } from '../../../constants/constants'
import { getColorsForName } from '../../../helpers/getColorsForName'
import { getMinLngLat } from '../../../helpers/mapHelpers'
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
import { SmallButton } from '../../views/SmallButton'
import { StackDrawer } from '../../views/StackDrawer'
import { RestaurantOverview } from '../../views/restaurant/RestaurantOverview'
import { RestaurantTagsList } from '../../views/restaurant/RestaurantTagsList'
import { HomeStackViewProps } from '../HomeStackViewProps'
import { PageContentWithFooter } from '../PageContentWithFooter'
import { RestaurantRatingView } from '../RestaurantRatingView'
import { getSearchPageStore } from '../search/SearchPageStore'
import { RestaurantAddCommentButton } from './RestaurantAddCommentReviewButton'
import { RestaurantAddToListButton } from './RestaurantAddToListButton'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantAddressLinksRow } from './RestaurantAddressLinksRow'
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
import { fullyIdle, series, sleep } from '@dish/async'
import { graphql } from '@dish/graph'
import { H1, LoadingItems, Spacer, Theme, XStack, YStack, useThemeName } from '@dish/ui'
import { Clock } from '@tamagui/feather-icons'
import React, { Suspense, memo, useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'

type Props = HomeStackViewProps<HomeStateItemRestaurant>

export default function RestaurantPageContainer(props: Props) {
  const colors = getColorsForName(props.item.restaurantSlug)
  return (
    <Theme name={colors}>
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
    </Theme>
  )
}

const RestaurantPage = memo(
  graphql(
    (props: Props & { colors: any }) => {
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

      useAsyncEffect(async (signal) => {
        await sleep(500)
        if (signal.aborted) return
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

      if (!restaurant) {
        return <NotFoundPage />
      }

      const restaurantName = (restaurant.name || '').trim()

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
              <RestaurantFavoriteButton floating size="$6" restaurantSlug={restaurantSlug} />
            </Suspense>
          </PaneControlButtonsLeft>
          <YStack
            paddingTop={0}
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
                      <RestaurantRatingView floating size={66} restaurant={restaurant} />
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
                    >
                      <XStack
                        display={isWeb ? 'block' : 'flex'}
                        maxWidth={280}
                        marginRight={30}
                        paddingTop={50}
                      >
                        <H1
                          className="font-title"
                          fontFamily="$title"
                          color="$color4"
                          maxWidth={500}
                          alignSelf="flex-start"
                        >
                          {restaurantName}
                        </H1>
                      </XStack>
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
                <XStack flexShrink={0} px="$3">
                  <RestaurantTagsList
                    exclude={['dish']}
                    restaurant={restaurant}
                    spacing={10}
                    maxItems={5}
                    size="$7"
                    tagButtonProps={{
                      hideRank: false,
                      hideRating: false,
                      backgroundColor: 'transparent',
                      borderWidth: 0,
                      votable: true,
                    }}
                  />
                </XStack>
              </ContentScrollViewHorizontal>

              <ContentScrollViewHorizontal>
                <XStack flexShrink={0} marginBottom={20}>
                  <YStack
                    flex={1}
                    maxWidth={440}
                    marginBottom={10}
                    pointerEvents="auto"
                    $sm={{ maxWidth: 340 }}
                  >
                    <RestaurantOverview
                      isDishBot
                      maxLines={5}
                      size="lg"
                      restaurantSlug={restaurantSlug}
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

      const pageTitle = `${restaurant.name} has the best ${topTags.join(', ')}`

      return (
        <>
          <PageHead isActive={props.isActive}>{pageTitle}</PageHead>
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
              <YStack backgroundColor="$bg4" borderBottomColor="$bg3" borderBottomWidth={1}>
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
