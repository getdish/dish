import { query } from '@dish/graph'
import { graphql } from '@gqless/react'
import React, { memo } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'

import { HomeStateItemRestaurant } from '../../state/home'
import { useOvermind } from '../../state/om'
import { Divider } from '../ui/Divider'
import { LinkButton } from '../ui/Link'
import { MediaQuery, mediaQueries } from '../ui/MediaQuery'
import { PageTitleTag } from '../ui/PageTitleTag'
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
import { RestaurantTagsRow } from './RestaurantTagsRow'
import { useHomeDrawerWidthInner } from './useHomeDrawerWidth'

export default memo(
  graphql(function HomePageRestaurant({ stateIndex }: { stateIndex: number }) {
    const om = useOvermind()
    const state = om.state.home.states[stateIndex] as HomeStateItemRestaurant
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
    console.log('restaurant', restaurant)
    const isLoading = !restaurant?.name
    const isCanTag =
      om.state.user.isLoggedIn &&
      (om.state.user.user.role == 'admin' ||
        om.state.user.user.role == 'contributor')

    return (
      <>
        <PageTitleTag>
          Dish - {restaurant?.name ?? ''} has the best [...tags] dishes.
        </PageTitleTag>

        <MediaQuery query={mediaQueries.sm} style={{ display: 'none' }}>
          <ZStack right={10} top={10} pointerEvents="auto" zIndex={100}>
            <CloseButton onPress={() => om.actions.home.up()} />
          </ZStack>
        </MediaQuery>

        {isLoading && <LoadingItems />}

        {!isLoading && (
          <>
            <ScrollView style={{ flex: 1 }}>
              <VStack
                width="100%"
                padding={18}
                paddingBottom={0}
                paddingRight={16}
              >
                <HStack position="relative">
                  <RestaurantRatingViewPopover
                    size="lg"
                    restaurantSlug={restaurant.slug}
                  />

                  <Spacer size={20} />

                  <HStack width="80%">
                    <VStack flex={1}>
                      <Text
                        style={{
                          fontSize: 26,
                          fontWeight: 'bold',
                          paddingRight: 30,
                        }}
                      >
                        {restaurant.name}
                      </Text>
                      <Spacer size={6} />
                      <RestaurantAddressLinksRow
                        currentLocationInfo={state.currentLocationInfo}
                        showMenu
                        size="lg"
                        restaurantId={restaurant.id}
                      />
                      <Spacer size={10} />
                      <Text style={{ color: '#777', fontSize: 14 }}>
                        {restaurant.address}
                      </Text>
                      <Spacer size={6} />
                    </VStack>

                    <RestaurantFavoriteStar
                      restaurantId={restaurant.id}
                      size="lg"
                    />
                  </HStack>
                </HStack>
              </VStack>

              <Spacer />

              <RestaurantTagsRow size="lg" restaurantSlug={restaurant.slug} />
              <Spacer />
              <Divider />
              <Spacer />

              <VStack spacing="md" alignItems="center">
                <HStack paddingVertical={8} minWidth={400}>
                  <RestaurantDetailRow
                    centered
                    justifyContent="center"
                    restaurantSlug={restaurant.slug}
                    flex={1}
                  />
                </HStack>

                <Divider />

                <RestaurantPhotos restaurantSlug={restaurant.slug} />

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
)

const RestaurantPhotos = graphql(
  ({ restaurantSlug }: { restaurantSlug: string }) => {
    const [restaurant] = query.restaurant({
      where: {
        slug: {
          _eq: restaurantSlug,
        },
      },
    })

    const photos = restaurant.bestTagPhotos()
    console.log('photos', photos)

    const drawerWidth = useHomeDrawerWidthInner()
    const spacing = 20
    return (
      <>
        {!!photos?.length && (
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
              {restaurant.tags?.map((t, index) => {
                let tag_name = t.tag.name
                if (t.tag.icon) tag_name = t.tag.icon + tag_name
                return (
                  <DishView
                    key={index}
                    size={(drawerWidth - 3 * spacing) / 3 - 15}
                    marginBottom={10}
                    dish={
                      {
                        name: tag_name,
                        image: t.photos?.[0] ?? '',
                        rating: t.rating || 0,
                      } as any
                    }
                  />
                )
              })}
            </HStack>
          </VStack>
        )}
      </>
    )
  }
)
