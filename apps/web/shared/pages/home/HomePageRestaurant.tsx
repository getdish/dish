import { graphql } from '@dish/graph'
import {
  Button,
  HStack,
  LinearGradient,
  LoadingItems,
  SmallTitle,
  Spacer,
  Text,
  VStack,
} from '@dish/ui'
import React, { Suspense, memo, useState } from 'react'
import { StyleSheet } from 'react-native'

import { HomeStateItemRestaurant } from '../../state/home'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { HomePagePaneProps } from './HomePagePane'
import { HomeScrollView } from './HomeScrollView'
import { HomeStackDrawer } from './HomeStackDrawer'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantDishPhotos } from './RestaurantDishPhotos'
// deliverybutton
// favoritestar
import { RestaurantHeader } from './RestaurantHeader'
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
    const isLoading = !restaurant?.name
    // const isCanTag =
    //   om.state.user.isLoggedIn &&
    //   (om.state.user.user.role == 'admin' ||
    //     om.state.user.user.role == 'contributor')

    return (
      <VStack flex={1} overflow="hidden">
        <PageTitleTag>
          Dish - {restaurant?.name ?? ''} has the best [...tags] dishes.
        </PageTitleTag>

        <HomeScrollView paddingTop={0}>
          {/* HEADER */}
          <RestaurantHeader restaurantSlug={slug} />
          <Spacer size="xl" />

          <Suspense fallback={<LoadingItems />}>
            <VStack alignItems="center">
              <HStack minWidth={400}>
                <RestaurantDetailRow
                  centered
                  justifyContent="center"
                  restaurantSlug={slug}
                  flex={1}
                />
              </HStack>
            </VStack>

            <VStack paddingHorizontal={14}>
              <VStack alignItems="center">
                <Spacer size="xl" />

                <Suspense fallback={null}>
                  <RestaurantDishPhotos restaurantSlug={slug} />
                </Suspense>

                <Spacer size="xl" />

                <RestaurantTagsRow
                  size="sm"
                  restaurantSlug={slug}
                  restaurantId={restaurant.id}
                />

                <Spacer size="xl" />

                <VStack flex={1} marginBottom={20}>
                  <SmallTitle divider="center">Menu</SmallTitle>
                  <Spacer />
                  <Suspense fallback={null}>
                    <RestaurantMenu restaurantSlug={slug} />
                  </Suspense>

                  <Spacer size="xl" />

                  <SmallTitle>Tips</SmallTitle>
                  <RestaurantTopReviews
                    expandTopComments={2}
                    restaurantId={restaurant.id}
                  />
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
      </VStack>
    )
  })
)

const RestaurantMenu = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const restaurant = useRestaurantQuery(restaurantSlug)
    const items = restaurant.menu_items({ limit: 25 })
    return (
      <>
        {!items?.length && (
          <VStack>
            <Text>No menu found.</Text>
          </VStack>
        )}
        {!!items?.length && (
          <VStack position="relative">
            <HStack
              height={isExpanded ? 'auto' : 120}
              overflow="hidden"
              spacing={3}
              flexWrap="wrap"
            >
              {items.slice(0, isExpanded ? Infinity : 8).map((item, i) => (
                <VStack
                  minWidth={200}
                  paddingBottom={10}
                  borderBottomWidth={1}
                  marginBottom={10}
                  borderBottomColor="#f2f2f2"
                  flex={1}
                  overflow="hidden"
                  paddingVertical={4}
                  key={i}
                >
                  <Text>{item.name}</Text>
                  <Text fontSize={13} opacity={0.5}>
                    {item.description}
                  </Text>
                </VStack>
              ))}
            </HStack>
            {!isExpanded && (
              <LinearGradient
                colors={['rgba(255,255,255,0)', '#fff']}
                style={[StyleSheet.absoluteFill]}
              />
            )}
            <Button
              marginTop={-5}
              zIndex={100}
              position="relative"
              alignSelf="center"
              onPress={() => {
                setIsExpanded((x) => !x)
              }}
            >
              <Text fontWeight="800" fontSize={13}>
                {isExpanded ? 'Close' : 'Expand'}
              </Text>
            </Button>
          </VStack>
        )}
      </>
    )
  })
)
