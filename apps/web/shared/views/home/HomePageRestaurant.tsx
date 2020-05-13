import { query, useQuery } from '@dish/graph'
import { graphql } from '@gqless/react'
import React, { memo } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'

import { drawerBorderRadius } from '../../constants'
import { HomeStateItemRestaurant } from '../../state/home'
import { useOvermind } from '../../state/om'
import { Color } from '../ui/Color'
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

export default graphql(function HomePageRestaurant({
  stateIndex,
}: {
  stateIndex: number
}) {
  const om = useOvermind()
  const state = om.state.home.states[stateIndex] as HomeStateItemRestaurant
  if (!state) {
    return null
  }
  const slug = state.restaurantSlug
  // const query = useQuery()
  const [restaurant] = query.restaurant({
    where: {
      slug: {
        _eq: slug,
      },
    },
  })
  const isLoading = !restaurant?.name
  const isCanTag =
    om.state.user.isLoggedIn &&
    (om.state.user.user.role == 'admin' ||
      om.state.user.user.role == 'contributor')

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

      <MediaQuery query={mediaQueries.sm} style={{ display: 'none' }}>
        <ZStack right={10} top={10} pointerEvents="auto" zIndex={1000}>
          <CloseButton onPress={() => om.actions.home.up()} />
        </ZStack>
      </MediaQuery>

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
          // className="blur"
          backgroundColor="rgba(255,255,255,0.98)"
          width="100%"
          padding={18}
          paddingBottom={0}
          paddingRight={16}
          position="absolute"
          top={0}
          left={0}
          right={0}
          zIndex={100}
        >
          <HStack position="relative">
            <RestaurantRatingViewPopover size="lg" restaurantSlug={slug} />

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
                  restaurantSlug={slug}
                />
                <Spacer size={10} />
                <Text style={{ color: '#777', fontSize: 14 }}>
                  {restaurant.address}
                </Text>
                <Spacer size={6} />
              </VStack>

              <RestaurantFavoriteStar restaurantId={restaurant.id} size="lg" />
            </HStack>
          </HStack>
        </VStack>

        <VStack
          backgroundColor="white"
          position="absolute"
          top={120}
          left={0}
          right={0}
          bottom={0}
        />

        <ScrollView style={{ flex: 1, paddingTop: 120 + 20 }}>
          <RestaurantTagsRow size="lg" restaurantSlug={slug} />
          <Spacer />
          <Divider />
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

            <RestaurantPhotos restaurantSlug={slug} />

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
    </VStack>
  )
})

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
