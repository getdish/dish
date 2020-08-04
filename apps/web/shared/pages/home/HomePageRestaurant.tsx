import { graphql } from '@dish/graph'
import {
  Box,
  Divider,
  HStack,
  LoadingItems,
  SmallTitle,
  Spacer,
  VStack,
} from '@dish/ui'
import React, { Suspense, memo, useEffect } from 'react'
import { Divide } from 'react-feather'
import { ScrollView } from 'react-native'

import { HomeStateItemRestaurant } from '../../state/home-types'
import { omStatic } from '../../state/om'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { getMinLngLat } from './getLngLat'
import { HomePagePaneProps } from './HomePagePaneProps'
import { HomeScrollView } from './HomeScrollView'
import { HomeStackDrawer } from './HomeStackDrawer'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantDishPhotos } from './RestaurantDishPhotos'
// deliverybutton
// favoritestar
import { RestaurantHeader } from './RestaurantHeader'
import { RestaurantMenu } from './RestaurantMenu'
import { RestaurantOverview } from './RestaurantOverview'
import { RestaurantRatingBreakdown } from './RestaurantRatingBreakdown'
import { RestaurantTagsRow } from './RestaurantTagsRow'
import { RestaurantTopReviews } from './RestaurantTopReviews'
import { useRestaurantQuery } from './useRestaurantQuery'

type Props = HomePagePaneProps<HomeStateItemRestaurant>

export default memo(function HomePageRestaurantContainer(props: Props) {
  return (
    <HomeStackDrawer closable>
      <HomePageRestaurant {...props} />
    </HomeStackDrawer>
  )
})

const HomePageRestaurant = memo(
  graphql(({ item }: Props) => {
    if (!item) {
      return null
    }
    const slug = item.restaurantSlug
    const restaurant = useRestaurantQuery(slug)
    const coords = restaurant?.location?.coordinates

    const nextState = {
      restaurantId: restaurant.id,
      center: {
        lng: coords?.[0],
        lat: coords?.[1],
      },
      span: getMinLngLat(item.span, 0.0025),
    }
    console.log('nextState', nextState)

    useEffect(() => {
      if (!nextState.restaurantId) return
      omStatic.actions.home.updateCurrentState(nextState)
    }, [JSON.stringify(nextState)])
    // const isCanTag =
    //   om.state.user.isLoggedIn &&
    //   (om.state.user.user.role == 'admin' ||
    //     om.state.user.user.role == 'contributor')

    return (
      <>
        <PageTitleTag>
          Dish - {restaurant?.name ?? ''} has the best [...tags] dishes.
        </PageTitleTag>

        <HomeScrollView paddingTop={0}>
          {/* HEADER */}
          <RestaurantHeader restaurantSlug={slug} />

          <Spacer size="xl" />
          <Spacer size="sm" />

          <Suspense fallback={<LoadingItems />}>
            <VStack alignItems="center">
              <HStack minWidth={380} paddingBottom={20}>
                <RestaurantDetailRow
                  centered
                  justifyContent="center"
                  restaurantSlug={slug}
                  flex={1}
                />
              </HStack>
            </VStack>

            <Divider />

            <HStack
              padding={20}
              flexWrap="wrap"
              alignItems="center"
              justifyContent="center"
            >
              <RestaurantTagsRow
                size="sm"
                restaurantSlug={slug}
                restaurantId={restaurant.id}
                spacing={10}
                grid
                max={9}
              />
            </HStack>

            <Box
              borderWidth={1}
              borderColor="#eee"
              padding={0}
              marginHorizontal={20}
              position="relative"
              overflow="visible"
            >
              <VStack
                paddingVertical={5}
                paddingHorizontal={6}
                shadowColor={'rgba(0,0,0,0.1)'}
                shadowRadius={8}
                shadowOffset={{ height: 2, width: 0 }}
                backgroundColor="#fff"
                borderRadius={8}
                transform={[{ rotate: '-4deg' }]}
                position="absolute"
                zIndex={100}
                top={-10}
                left={-5}
              >
                Ratings
              </VStack>
              <ScrollView
                style={{ width: '100%' }}
                contentContainerStyle={{
                  minWidth: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                <RestaurantRatingBreakdown restaurantSlug={slug} />
              </ScrollView>
            </Box>

            <Spacer size="lg" />

            <VStack width="100%">
              <Suspense fallback={null}>
                <RestaurantDishPhotos
                  size={160}
                  restaurantSlug={slug}
                  restaurantId={restaurant.id ?? undefined}
                />
              </Suspense>
            </VStack>

            <HStack padding={20} maxWidth="100%" flexWrap="wrap">
              <RestaurantOverview restaurantSlug={slug} />
              <RestaurantOverview restaurantSlug={slug} />
              <RestaurantOverview restaurantSlug={slug} />
            </HStack>

            <Spacer size="xl" />

            <VStack flex={1} marginBottom={20} width="100%">
              <VStack
                margin={3}
                borderWidth={1}
                borderColor="#eee"
                borderRadius={10}
                padding={10}
              >
                <SmallTitle divider="off">Menu</SmallTitle>
                <Spacer />
                <Suspense fallback={null}>
                  <RestaurantMenu restaurantSlug={slug} />
                </Suspense>
              </VStack>

              <Spacer size="xl" />

              <SmallTitle>Tips</SmallTitle>
              <Suspense fallback={null}>
                <RestaurantTopReviews
                  expandTopComments={2}
                  restaurantId={restaurant.id}
                />
              </Suspense>
            </VStack>

            {/* <VStack width="100%">
                <SmallTitle>Images</SmallTitle>
                <HStack
                  width="100%"
                  flexWrap="wrap"
                  alignItems="center"
                  justifyContent="center"
                >
                  {(restaurant.photos() ?? [])
                    .slice(0, 10)
                    .map((photo, key) => (
                      <Image
                        key={key}
                        source={{ uri: photo }}
                        style={{
                          height: 180,
                          width: '31%',
                          marginRight: 10,
                          marginBottom: 10,
                          borderRadius: 12,
                        }}
                        resizeMode="cover"
                      />
                    ))}
                </HStack>
              </VStack> */}
          </Suspense>

          {/* bottom space */}
          <VStack height={200} />
        </HomeScrollView>
      </>
    )
  })
)
