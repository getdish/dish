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
import { useMediaQueryIsSmall } from './useMediaQueryIs'
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
          height="98%"
          maxHeight="95vh"
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

          <VStack width="100%" height="100%" flex={1}>
            <HStack
              alignItems="center"
              justifyContent="space-between"
              marginBottom={-10}
              position="relative"
              zIndex={100}
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
        </VStack>
      </AbsoluteVStack>
    )
  }

  return null
})

const HomePageGalleryContent = memo(
  graphql(function HomePageGalleryContent({
    state,
  }: {
    state: HomeStateItemGallery
  }) {
    const isSmall = useMediaQueryIsSmall()
    // const dish = state.dishId
    //   ? query.tag({
    //       where: {
    //         type: { _eq: 'dish' },
    //         name: { _ilike: `%${state.dishId.replace(/-/g, '%')}%` },
    //       },
    //       limit: 1,
    //     })[0]
    //   : null
    const restaurant = useRestaurantQuery(state.restaurantSlug)
    const tag_names = state.dishId ? [state.dishId] : []
    const photos = restaurantPhotosForCarousel({
      restaurant,
      max: 100,
      tag_names,
      // turned off for now it excludes dish images and we want those
      // also most are empty
      // gallery: true,
    })

    console.log('gallery', photos)

    return (
      <VStack flex={1} overflow="hidden">
        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={{
            width: '100%',
            height: '100%',
          }}
        >
          <HStack flex={10} flexWrap="wrap" maxWidth="100%">
            {photos.map((photo, i) => {
              return (
                <HStack key={i} width="33%" height="33%">
                  <Image
                    source={{ uri: photo.image }}
                    resizeMode="cover"
                    style={{
                      width: 'calc(100% - 4px)',
                      height: 300,
                      margin: 2,
                    }}
                  />
                </HStack>
              )
            })}

            {!photos.length && <Text>No photos found!</Text>}
          </HStack>
        </ScrollView>

        <VStack paddingVertical={10} borderTopColor={'#eee'} borderTopWidth={1}>
          <Suspense fallback={null}>
            <RestaurantDishPhotos
              size={isSmall ? 100 : 150}
              restaurantSlug={state.restaurantSlug}
              selectable
              defaultSelectedId={state.dishId}
              onSelect={(selected) => {
                console.log('got em', selected)
              }}
            />
          </Suspense>
        </VStack>
      </VStack>
    )
  })
)
