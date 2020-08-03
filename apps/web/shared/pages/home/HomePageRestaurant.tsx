import { graphql } from '@dish/graph'
import { Box, HStack, LoadingItems, SmallTitle, Spacer, VStack } from '@dish/ui'
import React, { Suspense, memo } from 'react'
import { ScrollView } from 'react-native'

import { HomeStateItemRestaurant } from '../../state/home-types'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
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
          <RestaurantHeader
            restaurantSlug={slug}
            afterAddress={
              <HStack paddingLeft={20} marginTop={-2}>
                <RestaurantTagsRow
                  subtle
                  size="sm"
                  restaurantSlug={slug}
                  restaurantId={restaurant.id}
                />
                <Spacer direction="horizontal" size={70} />
              </HStack>
            }
          />

          <Spacer size="xl" />
          <Spacer size="sm" />

          <Suspense fallback={<LoadingItems />}>
            <VStack alignItems="center">
              <HStack minWidth={380}>
                <RestaurantDetailRow
                  centered
                  justifyContent="center"
                  restaurantSlug={slug}
                  flex={1}
                />
              </HStack>
            </VStack>

            <Spacer size="lg" />

            <Box
              borderWidth={1}
              borderColor="#eee"
              padding={0}
              paddingTop={5}
              marginHorizontal={20}
            >
              <SmallTitle>Rating</SmallTitle>
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

            <HStack padding={20} maxWidth="100%" flexWrap="wrap">
              <RestaurantOverview restaurantSlug={slug} />
              <RestaurantOverview restaurantSlug={slug} />
              <RestaurantOverview restaurantSlug={slug} />
            </HStack>

            <Spacer size="lg" />

            <VStack paddingHorizontal={14}>
              <VStack alignItems="center">
                <VStack width="100%">
                  <Suspense fallback={null}>
                    <RestaurantDishPhotos
                      size={160}
                      restaurantSlug={slug}
                      restaurantId={restaurant.id ?? undefined}
                    />
                  </Suspense>
                </VStack>

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
              </VStack>
            </VStack>
          </Suspense>

          {/* bottom space */}
          <VStack height={200} />
        </HomeScrollView>
      </>
    )
  })
)
