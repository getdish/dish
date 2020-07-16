import { graphql, restaurantPhotosForCarousel } from '@dish/graph'
import {
  AbsoluteVStack,
  Button,
  Divider,
  HStack,
  LinearGradient,
  LoadingItems,
  SmallTitle,
  Spacer,
  Text,
  VStack,
} from '@dish/ui'
import React, { Suspense, memo, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { drawerBorderRadius, searchBarHeight } from '../../constants'
import { HomeStateItemRestaurant } from '../../state/home'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { DishView } from './DishView'
import { HomePagePaneProps } from './HomePage'
import { HomeScrollView } from './HomeScrollView'
import { useMediaQueryIsSmall } from './HomeViewDrawer'
import { RestaurantHeader } from './RestaurantHeader'
import { RestaurantTagsRow } from './RestaurantTagsRow'
import {
  RestaurantOverview,
  RestaurantTopReviews,
} from './RestaurantTopReviews'
import { StackViewCloseButton } from './StackViewCloseButton'
import { useHomeDrawerWidthInner } from './useHomeDrawerWidth'
import { useRestaurantQuery } from './useRestaurantQuery'

type Props = HomePagePaneProps<HomeStateItemRestaurant>

export default memo(
  graphql(function HomePageRestaurant({ item }: Props) {
    if (!item) {
      return null
    }
    const isSmall = useMediaQueryIsSmall()
    const slug = item.restaurantSlug
    const restaurant = useRestaurantQuery(slug)
    const isLoading = !restaurant?.name
    // const isCanTag =
    //   om.state.user.isLoggedIn &&
    //   (om.state.user.user.role == 'admin' ||
    //     om.state.user.user.role == 'contributor')

    return (
      <VStack
        flex={1}
        borderRadius={drawerBorderRadius}
        position="relative"
        backgroundColor="#fff"
        overflow="hidden"
        shadowRadius={10}
        shadowColor="rgba(0,0,0,0.1)"
        marginTop={isSmall ? 0 : searchBarHeight}
      >
        <PageTitleTag>
          Dish - {restaurant?.name ?? ''} has the best [...tags] dishes.
        </PageTitleTag>

        <StackViewCloseButton />

        {isLoading && (
          <AbsoluteVStack
            fullscreen
            backgroundColor="white"
            zIndex={1000}
            borderRadius={drawerBorderRadius}
          >
            <LoadingItems />
          </AbsoluteVStack>
        )}

        <HomeScrollView paddingTop={0}>
          <VStack paddingHorizontal={14} paddingTop={30}>
            {/* HEADER */}
            <RestaurantHeader restaurantSlug={restaurant.slug} />

            <Spacer size="xl" />
            <RestaurantTagsRow size="md" restaurantSlug={slug} />

            <VStack alignItems="center">
              <Spacer />
              <Spacer />

              <HStack flexWrap="wrap">
                <VStack flex={1} minWidth={370} marginBottom={20}>
                  <SmallTitle divider="center">Top dishes</SmallTitle>
                  <Spacer />
                  <Suspense fallback={null}>
                    <RestaurantPhotos restaurantSlug={slug} />
                  </Suspense>
                </VStack>

                <VStack flex={1} minWidth={370} marginBottom={20}>
                  <SmallTitle divider="center">Menu</SmallTitle>
                  <Spacer />
                  <Suspense fallback={null}>
                    <RestaurantMenu restaurantSlug={slug} />
                  </Suspense>

                  <Spacer size="xl" />

                  <SmallTitle>Tips</SmallTitle>
                  <Suspense fallback={<LoadingItems />}>
                    <RestaurantTopReviews
                      expandTopComments={2}
                      restaurantId={restaurant.id}
                    />
                  </Suspense>
                </VStack>
              </HStack>

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
        </HomeScrollView>
      </VStack>
    )
  })
)

const RestaurantPhotos = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const photos = restaurantPhotosForCarousel({ restaurant, max: 30 })
    const drawerWidth = useHomeDrawerWidthInner()
    const spacing = 12
    const perRow = drawerWidth > 800 ? 3 : 2

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          marginHorizontal: -20,
        }}
      >
        {!!photos?.length && (
          <HStack
            paddingHorizontal={20}
            marginTop={10}
            alignItems="center"
            justifyContent="center"
          >
            {photos.map((photo, index) => {
              return (
                <DishView
                  key={index}
                  size={(drawerWidth / 2 - perRow * spacing) / perRow}
                  restaurantSlug={restaurantSlug}
                  margin={spacing / 2}
                  marginBottom={16}
                  dish={photo}
                />
              )
            })}
          </HStack>
        )}
      </ScrollView>
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
              height={isExpanded ? 'auto' : 60}
              overflow="hidden"
              spacing={3}
            >
              {items.slice(0, isExpanded ? Infinity : 4).map((item, i) => (
                <VStack
                  minWidth={isExpanded ? 200 : 140}
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
