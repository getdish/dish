import { fullyIdle, series } from '@dish/async'
import { graphql } from '@dish/graph'
import React, { Suspense, memo, useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { LoadingItems, Spacer, Theme, VStack, useTheme, useThemeName } from 'snackui'

import { searchBarHeight } from '../../../constants/constants'
import { getMinLngLat } from '../../../helpers/mapHelpers'
import { UseColors, useColorsFor } from '../../../helpers/useColorsFor'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { queryRestaurantTags } from '../../../queries/queryRestaurantTags'
import { router } from '../../../router'
import { HomeStateItemRestaurant } from '../../../types/homeTypes'
import { appMapStore, useSetAppMap } from '../../AppMapStore'
import { drawerStore } from '../../drawerStore'
import { ContentScrollView } from '../../views/ContentScrollView'
import { NotFoundPage } from '../../views/NotFoundPage'
import { PageTitleTag } from '../../views/PageTitleTag'
import { RestaurantOverview } from '../../views/restaurant/RestaurantOverview'
import { StackDrawer } from '../../views/StackDrawer'
import { HomeStackViewProps } from '../HomeStackViewProps'
import { PageContentWithFooter } from '../PageContentWithFooter'
import { RestaurantDeliveryButtons } from './RestaurantDeliveryButtons'
import { RestaurantDishRow } from './RestaurantDishRow'
import { RestaurantHeader } from './RestaurantHeader'
import { RestaurantLists } from './RestaurantLists'
import { RestaurantMenu } from './RestaurantMenu'
import { RestaurantReviewsList } from './RestaurantReviewsList'
import { RestaurantTagPhotos } from './RestaurantTagPhotos'
import { RestaurantOverallAndTagReviews } from './RestaurantTagReviews'
import { useSelectedDish } from './useSelectedDish'
import { useSnapToFullscreenOnMount } from './useSnapToFullscreenOnMount'

type Props = HomeStackViewProps<HomeStateItemRestaurant>

export default function RestaurantPageContainer(props: Props) {
  const theme = useTheme()
  const colors = useColorsFor(props.item.restaurantSlug)
  return (
    <StackDrawer
      closable
      fallback={
        <VStack
          backgroundColor={colors.themeColor}
          borderBottomColor={theme.borderColor}
          borderBottomWidth={1}
          minHeight={450}
        >
          <PageContentWithFooter>
            <LoadingItems />
          </PageContentWithFooter>
        </VStack>
      }
    >
      <RestaurantPage {...props} colors={colors} />
    </StackDrawer>
  )
}

const RestaurantPage = memo(
  graphql((props: Props & { colors: UseColors }) => {
    const { item, colors } = props
    const { restaurantSlug, section, sectionSlug } = item
    const theme = useTheme()
    const [restaurant] = queryRestaurant(restaurantSlug)
    const coords = restaurant?.location?.coordinates ?? []
    const { selectedDish, setSelectedDishToggle } = useSelectedDish(
      section === 'reviews' ? sectionSlug : null
    )
    const [scrollView, setScrollView] = useState<ScrollView | null>(null)
    const [reviewsSection, setReviewsSection] = useState<View | HTMLElement | null>(null)
    const [dishesSection, setDishesSection] = useState<View | null>(null)

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

    useSetAppMap({
      hideRegions: true,
      isActive: props.isActive,
      results: [
        {
          slug: restaurantSlug,
          id: restaurant?.id,
        },
      ],
      ...position,
    })

    useSnapToFullscreenOnMount()

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
    const themeName = useThemeName()
    const topTags = queryRestaurantTags({
      restaurantSlug,
      limit: 3,
      exclude: ['category', 'country', 'lense'],
    }).map((x) => x.tag.name)

    if (!restaurant) {
      return <NotFoundPage />
    }

    return (
      <>
        <PageTitleTag>{`${restaurant.name} has the best ${topTags.join(', ')}`}</PageTitleTag>
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
            <VStack
              backgroundColor={colors.themeColor}
              borderBottomColor={theme.borderColor}
              borderBottomWidth={1}
            >
              <RestaurantHeader minHeight={450} restaurantSlug={restaurantSlug} />

              <View ref={setDishesSection}>
                <RestaurantDishRow
                  max={35}
                  restaurantSlug={restaurantSlug}
                  restaurantId={restaurant.id ?? undefined}
                  selectable
                  selected={selectedDish}
                  onSelect={setSelectedDishToggle}
                  // themeName={`${colors.name}-dark`}
                />
              </View>

              <VStack marginHorizontal={-20} marginBottom={-36} marginTop={-20}>
                <RestaurantOverallAndTagReviews
                  tagSlug={selectedDish}
                  borderless
                  showScoreTable
                  restaurantSlug={restaurantSlug}
                  restaurantId={restaurant.id}
                />
              </VStack>

              <RestaurantTagPhotos tagSlug={selectedDish} restaurantSlug={restaurantSlug} />

              <Spacer />

              {/* END head color AREA */}
            </VStack>

            <VStack paddingTop={15}>
              <RestaurantOverview
                isDishBot
                maxLines={6}
                size="lg"
                restaurantSlug={restaurantSlug}
              />
            </VStack>

            <Spacer size="xl" />

            <Suspense fallback={null}>
              <RestaurantLists restaurantSlug={restaurantSlug} />
            </Suspense>

            <VStack ref={setReviewsSection} paddingVertical={20}>
              <Suspense fallback={null}>
                <RestaurantReviewsList
                  restaurantSlug={restaurantSlug}
                  restaurantId={restaurant.id}
                />
              </Suspense>
            </VStack>

            <Spacer size="xl" />

            <VStack flex={1} marginBottom={20} width="100%" alignSelf="center">
              <Suspense fallback={null}>
                <RestaurantMenu restaurantSlug={restaurantSlug} />
              </Suspense>
            </VStack>
          </PageContentWithFooter>
        </ContentScrollView>
      </>
    )
  })
)
