import { Restaurant } from '@dish/models'
import React, { memo, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'

import { HomeStateItemRestaurant } from '../../state/home'
import { useOvermind } from '../../state/om'
import { NotFoundPage } from '../NotFoundPage'
import { Divider } from '../ui/Divider'
import { LinkButton } from '../ui/Link'
import { PageTitleTag } from '../ui/PageTitleTag'
import { SmallTitle } from '../ui/SmallTitle'
import { Spacer } from '../ui/Spacer'
import { HStack, VStack, ZStack } from '../ui/Stacks'
import { flatButtonStyle, flatButtonStyleActive } from './baseButtonStyle'
import { CloseButton } from './CloseButton'
import { DishView } from './DishView'
import { LoadingItems } from './LoadingItems'
import { RestaurantAddressLinksRow } from './RestaurantAddressLinksRow'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantFavoriteStar } from './RestaurantFavoriteStar'
import { RestaurantRatingViewPopover } from './RestaurantRatingViewPopover'
import { RestaurantTagButton } from './RestaurantTagButton'
import { RestaurantTagsRow } from './RestaurantTagsRow'
import { useHomeDrawerWidthInner } from './useHomeDrawerWidth'

export default memo(({ stateIndex }: { stateIndex: number }) => {
  const om = useOvermind()
  const state = om.state.home.states[stateIndex] as HomeStateItemRestaurant
  if (!state) return <NotFoundPage />
  if (!state?.restaurantId) return <NotFoundPage />
  const restaurant = om.state.home.allRestaurants[state.restaurantId]
  const isLoading = (restaurant?.name ?? '') === ''
  const isCanTag =
    om.state.user.isLoggedIn &&
    (om.state.user.user.role == 'admin' ||
      om.state.user.user.role == 'contributor')

  return (
    <>
      <PageTitleTag>
        Dish - {restaurant?.name ?? ''} has the best [...tags] dishes.
      </PageTitleTag>

      <ZStack right={10} top={10} pointerEvents="auto" zIndex={100}>
        <CloseButton onPress={() => om.actions.home.up()} />
      </ZStack>

      {isLoading && <LoadingItems />}

      {!isLoading && (
        <>
          <ScrollView style={{ flex: 1 }}>
            <VStack padding={18} paddingBottom={0} paddingRight={16}>
              <HStack position="relative">
                <RestaurantRatingViewPopover
                  size="lg"
                  restaurant={restaurant}
                />
                <Spacer size={20} />
                <VStack flex={1}>
                  <Text
                    style={{
                      fontSize: 30,
                      fontWeight: 'bold',
                      paddingRight: 30,
                    }}
                  >
                    {restaurant.name}
                  </Text>
                  <Spacer size={4} />
                  <RestaurantAddressLinksRow
                    currentLocationInfo={state.currentLocationInfo}
                    showMenu
                    size="lg"
                    restaurant={restaurant}
                  />
                  <Spacer size={8} />
                  <Text style={{ color: '#777', fontSize: 14 }}>
                    {restaurant.address}
                  </Text>
                  <Spacer size={12} />
                </VStack>
              </HStack>

              <HStack width="100%" alignItems="center">
                <Divider flex />
                <RestaurantFavoriteStar restaurant={restaurant} size="lg" />
                <Divider flex />
              </HStack>
            </VStack>

            <VStack spacing="lg">
              <HStack paddingVertical={0}>
                <RestaurantDetailRow
                  centered
                  justifyContent="center"
                  restaurant={restaurant}
                  flex={1}
                />
              </HStack>

              <HStack>
                {isCanTag && (
                  <ZStack top={3} right={-5}>
                    <RestaurantTagButton size="lg" restaurant={restaurant} />
                  </ZStack>
                )}
              </HStack>

              <Divider />

              <RestaurantPhotos restaurant={restaurant} />

              {/* <VStack>
                <SmallTitle>Images</SmallTitle>
                <HStack
                  flexWrap="wrap"
                  height={100}
                  marginLeft={-10}
                  marginRight={-20}
                  alignItems="center"
                  justifyContent="center"
                >
                  {(restaurant.photos ?? []).map((photo, key) => (
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
          </ScrollView>
        </>
      )}
    </>
  )
})

const RestaurantPhotos = ({ restaurant }: { restaurant: Restaurant }) => {
  const drawerWidth = useHomeDrawerWidthInner()
  const spacing = 20
  return (
    <>
      {!!restaurant.photos?.length && (
        <VStack spacing="xl">
          <HStack justifyContent="center" spacing>
            <LinkButton {...flatButtonStyleActive}>Top Dishes</LinkButton>
            <LinkButton {...flatButtonStyle}>Menu</LinkButton>
            <LinkButton {...flatButtonStyle}>Inside</LinkButton>
            <LinkButton {...flatButtonStyle}>Outside</LinkButton>
          </HStack>

          <HStack
            flexWrap="wrap"
            marginTop={10}
            alignItems="center"
            justifyContent="center"
            spacing={spacing}
          >
            {[
              'Pho',
              'Banh Mi',
              'Banh Xeo',
              'Bho Kho',
              'Thit Kho',
              'Banh Xeo',
              'Bho Kho',
              'Thit Kho',
            ].map((dish, index) => (
              <DishView
                key={index}
                size={(drawerWidth - 3 * spacing) / 3 - 15}
                marginBottom={10}
                dish={
                  {
                    name: dish,
                    image: restaurant.photos[index] ?? restaurant.image,
                    price: 1000,
                  } as any
                }
              />
            ))}
          </HStack>
        </VStack>
      )}
    </>
  )
}
