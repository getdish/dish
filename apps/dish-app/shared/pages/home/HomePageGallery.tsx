import { graphql, query, restaurantPhotosForCarousel } from '@dish/graph'
import { AbsoluteVStack, HStack, LoadingItems, Text, VStack } from '@dish/ui'
import React, { Suspense, memo } from 'react'
import { Image, ScrollView } from 'react-native'

import { pageWidthMax, zIndexGallery } from '../../constants'
import { HomeStateItemGallery } from '../../state/home-types'
import { useOvermind } from '../../state/om'
import { RestaurantDishPhotos } from './RestaurantDishPhotos'
import { RestaurantHeader } from './RestaurantHeader'
import { StackViewCloseButton } from './StackViewCloseButton'
import { useMediaQueryIsSmall } from './useMediaQueryIs'
import { useRestaurantQuery } from './useRestaurantQuery'

export default memo(function HomePageGallery() {
  const om = useOvermind()
  const state = om.state.home.currentState
  const isSmall = useMediaQueryIsSmall()

  if (state.type === 'gallery') {
    const dishPhotosElement = (
      <Suspense fallback={null}>
        <RestaurantDishPhotos
          size={100}
          restaurantSlug={state.restaurantSlug}
          selectable
          defaultSelectedId={state.dishId}
          onSelect={(selected) => {
            console.log('got em', selected)
          }}
        />
      </Suspense>
    )

    return (
      <AbsoluteVStack
        fullscreen
        backgroundColor="rgba(0,0,0,0.75)"
        alignItems="center"
        justifyContent="center"
        zIndex={zIndexGallery}
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
          shadowColor="rgba(0,0,0,0.75)"
          shadowRadius={40}
        >
          <VStack width="100%" height="100%" flex={1}>
            <AbsoluteVStack top={5} right={26}>
              <StackViewCloseButton />
            </AbsoluteVStack>
            <Suspense fallback={<LoadingItems />}>
              <HomePageGalleryContent
                state={state}
                header={
                  <HStack
                    alignItems="center"
                    justifyContent="space-between"
                    position="relative"
                    zIndex={100}
                  >
                    <RestaurantHeader
                      size="sm"
                      restaurantSlug={state.restaurantSlug}
                      after={
                        <VStack marginVertical={-15}>
                          {isSmall ? null : dishPhotosElement}
                        </VStack>
                      }
                    />
                  </HStack>
                }
              />
              {isSmall ? (
                <AbsoluteVStack
                  backgroundColor="#fff"
                  padding={0}
                  bottom={0}
                  left={0}
                  right={0}
                >
                  {dishPhotosElement}
                </AbsoluteVStack>
              ) : null}
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
    header,
  }: {
    state: HomeStateItemGallery
    header?: any
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
      gallery: true,
    })

    return (
      <VStack flex={1} overflow="hidden">
        <ScrollView style={{ width: '100%' }}>
          {header}
          <HStack
            flex={10}
            flexWrap="wrap"
            maxWidth="100%"
            // add for carousel bottom
            paddingBottom={300}
            alignItems="flex-start"
            justifyContent="flex-start"
            backgroundColor="#eee"
          >
            {photos.map((photo, i) => {
              return (
                <HStack key={i} width={isSmall ? '100%' : '50%'}>
                  <Image
                    source={{ uri: photo.image }}
                    resizeMode="cover"
                    style={{
                      width: 'calc(100% - 4px)',
                      height: isSmall ? 250 : 380,
                      marginTop: 2,
                      marginLeft: 2,
                    }}
                  />
                </HStack>
              )
            })}

            {!photos.length && <Text>No photos found!</Text>}
          </HStack>
        </ScrollView>
      </VStack>
    )
  })
)
