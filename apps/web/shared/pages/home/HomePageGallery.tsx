import { graphql, query, restaurantPhotosForCarousel } from '@dish/graph'
import { AbsoluteVStack, HStack, VStack } from '@dish/ui'
import React, { memo } from 'react'
import { Image, ScrollView } from 'react-native'

import { pageWidthMax } from '../../constants'
import { HomeStateItemGallery } from '../../state/home'
import { useOvermind } from '../../state/useOvermind'
import { RestaurantHeader } from './RestaurantHeader'
import { StackViewCloseButton } from './StackViewCloseButton'
import { useRestaurantQuery } from './useRestaurantQuery'

export default memo(function HomePageGallery() {
  const om = useOvermind()
  const state = om.state.home.currentState

  if (state.type === 'gallery') {
    return <HomePageGalleryContent state={state} />
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
    const photos = restaurantPhotosForCarousel({ restaurant, max: 100 })

    console.log('dish.default_images()', dish?.default_images())

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
          backgroundColor="#fff"
          borderRadius={15}
          maxWidth={pageWidthMax}
          alignItems="center"
          paddingVertical={20}
          position="relative"
        >
          <AbsoluteVStack top={20} right={10}>
            <StackViewCloseButton />
          </AbsoluteVStack>

          <ScrollView style={{ flex: 1 }}>
            <VStack>
              <HStack
                paddingRight={40}
                paddingLeft={20}
                alignItems="center"
                justifyContent="space-between"
              >
                <RestaurantHeader restaurantSlug={slug} />
              </HStack>
              <HStack flexWrap="wrap">
                {dish?.default_images()?.map((dish, i) => {
                  return (
                    <Image
                      key={i}
                      source={{ uri: dish.image }}
                      style={{
                        // maxWidth: 405,
                        // maxHeight: 405,
                        width: 300,
                        height: 300,
                        marginVertical: 2,
                        marginHorizontal: 2,
                      }}
                    />
                  )
                })}
              </HStack>

              <HStack paddingVertical={20} flexWrap="wrap">
                {photos.map((photo, i) => {
                  return (
                    <HStack
                      key={i}
                      width="33%"
                      height="33%"
                      minWidth={100}
                      minHeight={100}
                    >
                      <Image
                        source={{ uri: photo.image }}
                        resizeMode="cover"
                        style={{
                          width: '100%',
                          height: 300,
                          margin: 2,
                        }}
                      />
                    </HStack>
                  )
                })}
              </HStack>
            </VStack>
          </ScrollView>
        </VStack>
      </AbsoluteVStack>
    )
  })
)
