import { graphql, query, restaurantPhotosForCarousel } from '@dish/graph'
import { AbsoluteVStack, HStack, LoadingItems, Text, VStack } from '@dish/ui'
import React, { Suspense, memo } from 'react'
import { Image, ScrollView } from 'react-native'

import { pageWidthMax } from '../../constants'
import { HomeStateItemGallery } from '../../state/home'
import { useOvermind } from '../../state/useOvermind'
import { RestaurantDishPhotos } from './RestaurantDishPhotos'
import { RestaurantHeader } from './RestaurantHeader'
import { StackViewCloseButton } from './StackViewCloseButton'
import { useRestaurantQuery } from './useRestaurantQuery'

export default memo(function HomePageGallery() {
  const om = useOvermind()
  const state = om.state.home.currentState

  if (state.type === 'gallery') {
    return (
      <AbsoluteVStack
        fullscreen
        backgroundColor="rgba(0,0,0,0.75)"
        alignItems="center"
        justifyContent="center"
        zIndex={10000000000}
      >
        <VStack
          width="95%"
          height="95%"
          maxHeight="88vh"
          backgroundColor="#fff"
          borderRadius={15}
          maxWidth={pageWidthMax}
          alignItems="center"
          position="relative"
          overflow="hidden"
        >
          <AbsoluteVStack top={20} right={40}>
            <StackViewCloseButton />
          </AbsoluteVStack>

          <ScrollView
            style={{ width: '100%' }}
            contentContainerStyle={{
              width: '100%',
              height: '100%',
            }}
          >
            <VStack flex={1}>
              <HStack
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
              >
                <Suspense fallback={null}>
                  <RestaurantHeader
                    hideDetails
                    restaurantSlug={state.restaurantSlug}
                  />
                </Suspense>
              </HStack>

              <Suspense fallback={<LoadingItems />}>
                <HomePageGalleryContent state={state} />
              </Suspense>
            </VStack>
          </ScrollView>
        </VStack>
      </AbsoluteVStack>
    )
  }

  return null
})

const HomePageGalleryContent = memo(
  graphql(function HomePageGalleryContent(props: {
    state: HomeStateItemGallery
  }) {
    const { dishId } = props.state
    const dish = dishId
      ? query.tag({
          where: { type: { _eq: 'dish' }, id: { _eq: dishId } },
          limit: 1,
        })[0]
      : null
    const slug = props.state.restaurantSlug
    const restaurant = useRestaurantQuery(slug)
    const photos = restaurantPhotosForCarousel({
      restaurant,
      max: 100,
      gallery: true,
    })

    console.log('gallery', photos, dish?.default_images())

    return (
      <VStack flex={1}>
        <HStack flex={10} paddingVertical={20} flexWrap="wrap" maxWidth="100%">
          {photos.map((photo, i) => {
            return (
              <HStack key={i} width="33%" height="33%">
                <Image
                  source={{ uri: photo.image }}
                  resizeMode="cover"
                  style={{
                    width: '100%',
                    height: 250,
                    margin: 2,
                  }}
                />
              </HStack>
            )
          })}

          {!photos.length && <Text>No photos found!</Text>}
        </HStack>

        <VStack paddingVertical={20} borderTopColor={'#eee'} borderTopWidth={1}>
          <Suspense fallback={null}>
            <RestaurantDishPhotos restaurantSlug={slug} />
          </Suspense>
        </VStack>
      </VStack>
    )
  })
)
