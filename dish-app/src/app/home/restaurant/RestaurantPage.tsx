import { fullyIdle, series } from '@dish/async'
import { graphql } from '@dish/graph'
import React, {
  Suspense,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ScrollView, View } from 'react-native'
import { LoadingItem, LoadingItems, Spacer, VStack, useTheme } from 'snackui'

import { isWeb } from '../../../constants/constants'
import { getMinLngLat } from '../../../helpers/getLngLat'
import { useColorsFor } from '../../../helpers/useColorsFor'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { HomeStateItemRestaurant } from '../../../types/homeTypes'
import { appMapStore, useSetAppMap } from '../../AppMapStore'
import { homeStore } from '../../homeStore'
import { usePageLoadEffect } from '../../hooks/usePageLoadEffect'
import { ContentScrollView } from '../../views/ContentScrollView'
import { PageTitleTag } from '../../views/PageTitleTag'
import { StackDrawer } from '../../views/StackDrawer'
import { HomeStackViewProps } from '../HomeStackViewProps'
import { RestaurantDishPhotos } from './RestaurantDishPhotos'
import { RestaurantHeader } from './RestaurantHeader'
import { RestaurantMenu } from './RestaurantMenu'
import { RestaurantReviewsList } from './RestaurantReviewsList'
import { RestaurantReviewsTopSources } from './RestaurantReviewsTopSources'
import { useSelectedDish } from './useSelectedDish'

type Props = HomeStackViewProps<HomeStateItemRestaurant>

export default function RestaurantPageContainer(props: Props) {
  return (
    <StackDrawer closable>
      <RestaurantPage {...props} />
    </StackDrawer>
  )
}

const RestaurantPage = memo(
  graphql((props: Props) => {
    const { item } = props
    const { restaurantSlug, section, sectionSlug } = item
    const [restaurant] = queryRestaurant(restaurantSlug)
    const coords = restaurant?.location?.coordinates
    const { selectedDish, setSelectedDishToggle } = useSelectedDish(
      section === 'reviews' ? sectionSlug : null
    )
    const colors = useColorsFor(restaurant.name)
    const [scrollView, setScrollView] = useState<ScrollView | null>(null)
    // refs break and capture old values, i think gqless related
    // todo pablo
    const [reviewsSection, setReviewsSection] = useState<View | null>(null)
    const [dishesSection, setDishesSection] = useState<View | null>(null)

    const position = useMemo(() => {
      return {
        center: {
          lng: coords?.[0],
          lat: coords?.[1],
        },
        span: getMinLngLat(appMapStore.position.span, 0.004, 0.004),
      }
    }, [...coords])

    useSetAppMap({
      isActive: props.isActive,
      results: [
        {
          slug: restaurantSlug,
          id: restaurant.id,
        },
      ],
      ...position,
    })

    const view = item.sectionSlug
      ? dishesSection
      : item.section === 'reviews'
      ? reviewsSection
      : null
    useEffect(() => {
      if (!scrollView) return
      if (!view) return
      return series([
        () => fullyIdle({ min: 500 }),
        () => {
          return new Promise((res) => {
            view.measure((_x, _y, _w, _h, _pX, pY) => {
              console.log('measure', view, _x, _y, _w, _h, _pX, pY, pY)
              res(pY)
            })
          })
        },
        (offsetY) => {
          scrollView.scrollTo({ y: offsetY, animated: true })
        },
      ])
    }, [scrollView, view, item.section, item.sectionSlug])

    const theme = useTheme()

    return (
      <>
        <PageTitleTag>
          Dish - {restaurant?.name ?? ''} has the best [...tags] dishes.
        </PageTitleTag>

        <ContentScrollView ref={setScrollView} id="restaurant">
          {/* HEADER */}
          {/* -1 margin bottom to overlap bottom border */}
          <VStack
            backgroundColor={colors.themeColor}
            borderBottomColor={colors.lightColor}
            borderBottomWidth={1}
          >
            <Suspense
              fallback={
                <VStack height={600} width="100%">
                  <LoadingItem size="lg" />
                </VStack>
              }
            >
              <RestaurantHeader
                minHeight={450}
                showImages
                restaurantSlug={restaurantSlug}
              />
            </Suspense>

            <Spacer />

            <VStack marginBottom={-1} position="relative" zIndex={1}>
              <View ref={setDishesSection}>
                <Suspense
                  fallback={
                    <VStack height={150}>
                      <LoadingItem />
                    </VStack>
                  }
                >
                  <RestaurantDishPhotos
                    size={130}
                    max={35}
                    restaurantSlug={restaurantSlug}
                    restaurantId={restaurant.id ?? undefined}
                    selectable
                    selected={selectedDish}
                    onSelect={setSelectedDishToggle}
                  />
                </Suspense>
              </View>
            </VStack>
          </VStack>

          <Spacer size="xl" />

          <VStack marginTop={-35}>
            <Suspense fallback={<LoadingItems />}>
              <RestaurantReviewsTopSources
                tagSlug={selectedDish}
                borderless
                showScoreTable
                restaurantSlug={restaurantSlug}
                restaurantId={restaurant.id}
              />
            </Suspense>
          </VStack>

          <Spacer size="xl" />

          <VStack
            backgroundColor={theme.backgroundColorSecondary}
            borderColor={theme.backgroundColorSecondary}
            borderTopWidth={1}
            borderBottomWidth={1}
            paddingVertical={20}
          >
            <View ref={setReviewsSection}>
              <Suspense fallback={null}>
                <RestaurantReviewsList
                  restaurantSlug={restaurantSlug}
                  restaurantId={restaurant.id}
                />
              </Suspense>
            </View>
          </VStack>

          <Spacer size="xl" />

          <VStack flex={1} marginBottom={20} width="100%" alignSelf="center">
            <Suspense fallback={null}>
              <RestaurantMenu restaurantSlug={restaurantSlug} />
            </Suspense>
          </VStack>
        </ContentScrollView>
      </>
    )
  })
)
