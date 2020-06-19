import { graphql, query, restaurantPhotosForCarousel } from '@dish/graph'
import {
  Divider,
  HStack,
  LoadingItems,
  SmallTitle,
  Spacer,
  Text,
  VStack,
  ZStack,
} from '@dish/ui'
import React, { Suspense, memo } from 'react'

import { drawerBorderRadius } from '../../constants'
import { HomeStateItemRestaurant } from '../../state/home'
import { PageTitleTag } from '../ui/PageTitleTag'
import { DishView } from './DishView'
import { HomeScrollView } from './HomeScrollView'
import { RestaurantAddressLinksRow } from './RestaurantAddressLinksRow'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantFavoriteStar } from './RestaurantFavoriteStar'
import { restaurantQuery } from './restaurantQuery'
import { RestaurantRatingViewPopover } from './RestaurantRatingViewPopover'
import { RestaurantTagsRow } from './RestaurantTagsRow'
import { RestaurantTopReviews } from './RestaurantTopReviews'
import { StackViewCloseButton } from './StackViewCloseButton'
import { useHomeDrawerWidthInner } from './useHomeDrawerWidth'

export default memo(
  graphql(function HomePageRestaurant({
    state,
  }: {
    state: HomeStateItemRestaurant
  }) {
    if (!state) {
      return null
    }
    const slug = state.restaurantSlug
    const [restaurant] = query.restaurant({
      where: {
        slug: {
          _eq: slug,
        },
      },
    })
    const isLoading = !restaurant?.name
    // const isCanTag =
    //   om.state.user.isLoggedIn &&
    //   (om.state.user.user.role == 'admin' ||
    //     om.state.user.user.role == 'contributor')

    return (
      <VStack
        flex={1}
        backgroundColor="rgba(255,255,255,0.5)"
        borderRadius={drawerBorderRadius}
        overflow="hidden"
      >
        <PageTitleTag>
          Dish - {restaurant?.name ?? ''} has the best [...tags] dishes.
        </PageTitleTag>

        <StackViewCloseButton />

        {isLoading && (
          <ZStack
            fullscreen
            backgroundColor="white"
            zIndex={1000}
            borderRadius={drawerBorderRadius}
          >
            <LoadingItems />
          </ZStack>
        )}

        <>
          <VStack
            backgroundColor="#fff"
            width="100%"
            padding={18}
            paddingBottom={0}
            paddingRight={16}
            flex={1}
          >
            <HomeScrollView>
              <HStack position="relative">
                <RestaurantRatingViewPopover size="lg" restaurantSlug={slug} />

                <Spacer size={16} />

                <HStack>
                  <VStack flex={1}>
                    <Text
                      selectable
                      fontSize={26}
                      fontWeight="bold"
                      paddingRight={30}
                    >
                      {restaurant.name}
                    </Text>
                    <Spacer size={6} />
                    <RestaurantAddressLinksRow
                      currentLocationInfo={state.currentLocationInfo}
                      showMenu
                      size="lg"
                      restaurantSlug={slug}
                    />
                    <Spacer size={10} />
                    <HStack>
                      <Text selectable color="#777" fontSize={14}>
                        {restaurant.address}
                      </Text>
                    </HStack>
                    <Spacer size={6} />
                  </VStack>
                </HStack>
              </HStack>

              <RestaurantTagsRow size="lg" restaurantSlug={slug} />

              <Spacer />
              <Divider />
              <Spacer />

              <VStack alignItems="center" paddingVertical={20}>
                <Spacer flex />
                <RestaurantFavoriteStar
                  restaurantId={restaurant.id}
                  size="lg"
                />
              </VStack>

              <Spacer />

              <VStack spacing="md" alignItems="center">
                <HStack paddingVertical={8} minWidth={400}>
                  <RestaurantDetailRow
                    centered
                    justifyContent="center"
                    restaurantSlug={slug}
                    flex={1}
                  />
                </HStack>

                <Divider />

                <VStack spacing={10}>
                  <SmallTitle divider="center">Reviews</SmallTitle>
                  <RestaurantTopReviews
                    expandTopComments
                    restaurantId={restaurant.id}
                  />
                </VStack>

                <Suspense fallback={null}>
                  <RestaurantPhotos restaurantSlug={slug} />
                </Suspense>

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
            </HomeScrollView>
          </VStack>
        </>
      </VStack>
    )
  })
)

const RestaurantPhotos = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const restaurant = restaurantQuery(restaurantSlug)
    const photos = restaurantPhotosForCarousel({ restaurant })
    const drawerWidth = useHomeDrawerWidthInner()
    const spacing = 20
    const perRow = Math.round(drawerWidth / 250)

    return (
      <>
        {!!photos?.length && (
          <VStack spacing="xl">
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
              spacing={spacing}
            >
              {photos.map((photo, index) => {
                return (
                  <DishView
                    key={index}
                    size={(drawerWidth - perRow * spacing) / perRow - 15}
                    restaurantSlug={restaurantSlug}
                    marginBottom={30}
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
