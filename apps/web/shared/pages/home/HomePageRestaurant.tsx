import { graphql, restaurantPhotosForCarousel } from '@dish/graph'
import {
  AbsoluteVStack,
  HStack,
  LoadingItems,
  SmallTitle,
  Spacer,
  Text,
  VStack,
} from '@dish/ui'
import React, { Suspense, memo } from 'react'

import { drawerBorderRadius, searchBarHeight } from '../../constants'
import { HomeStateItemRestaurant } from '../../state/home'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { DishView } from './DishView'
import { HomePagePaneProps } from './HomePage'
import { HomeScrollView } from './HomeScrollView'
import { useMediaQueryIsSmall } from './HomeViewDrawer'
import { RestaurantHeader } from './RestaurantHeader'
import { RestaurantTagsRow } from './RestaurantTagsRow'
import { RestaurantTopReviews } from './RestaurantTopReviews'
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

            <VStack alignItems="center">
              <Spacer />
              <Spacer />

              <HStack flexWrap="wrap">
                <VStack flex={1} minWidth={340}>
                  <SmallTitle fontSize={22} divider="off">
                    Overview
                  </SmallTitle>
                  <Spacer />
                  <RestaurantTopReviews
                    expandTopComments={2}
                    restaurantId={restaurant.id}
                  />

                  <Spacer />
                  <Spacer />

                  <SmallTitle>Menu</SmallTitle>
                  <Spacer />
                  <Suspense fallback={null}>
                    <RestaurantMenu restaurantSlug={slug} />
                  </Suspense>
                </VStack>
                <VStack flex={1} minWidth={340}>
                  <VStack
                    padding={10}
                    margin={10}
                    borderRadius={20}
                    borderWidth={1}
                    borderColor="#ccc"
                  >
                    <SmallTitle divider="center">Top tags</SmallTitle>
                    <Spacer />
                    <RestaurantTagsRow size="lg" restaurantSlug={slug} />

                    <Spacer />
                    <Spacer />

                    <SmallTitle divider="center">Top dishes</SmallTitle>
                    <Spacer />
                    <Suspense fallback={null}>
                      <RestaurantPhotos restaurantSlug={slug} />
                    </Suspense>
                  </VStack>
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
    const photos = restaurantPhotosForCarousel({ restaurant })
    const drawerWidth = useHomeDrawerWidthInner()
    const spacing = 12
    const perRow = drawerWidth > 800 ? 3 : 2

    return (
      <>
        {!!photos?.length && (
          <VStack>
            {/* <HStack justifyContent="center" spacing>
              <LinkButton {...flatButtonStyleActive}>Top Dishes</LinkButton>
              <LinkButton {...flatButtonStyle}>Menu</LinkButton>
              <LinkButton {...flatButtonStyle}>Inside</LinkButton>
              <LinkButton {...flatButtonStyle}>Outside</LinkButton>
            </HStack> */}

            <HStack
              flexWrap="wrap"
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
          </VStack>
        )}
      </>
    )
  })
)

const RestaurantMenu = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const items = restaurant.menu_items({ limit: 20 })
    return (
      <>
        {!items?.length && (
          <VStack>
            <Text>No menu found.</Text>
          </VStack>
        )}
        {!!items?.length && (
          <VStack>
            {items.map((item, i) => (
              <VStack paddingVertical={4} key={i}>
                <Text>{item.name}</Text>
                <Text fontSize={13} opacity={0.5}>
                  {item.description}
                </Text>
              </VStack>
            ))}
          </VStack>
        )}
      </>
    )
  })
)
