import { graphql, query, restaurantPhotosForCarousel } from '@dish/graph'
import { HStack, Text, VStack, ZStack } from '@dish/ui'
import React, { memo } from 'react'
import { Image, ScrollView } from 'react-native'

import { pageWidthMax } from '../../constants'
import { HomeStateItemGallery } from '../../state/home'
import { useOvermind } from '../../state/useOvermind'
import { CloseButton } from './CloseButton'
import { StackViewCloseButton } from './StackViewCloseButton'

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
    const om = useOvermind()
    const [restaurant] = query.restaurant({
      where: {
        slug: {
          _eq: props.state.restaurantSlug ?? '',
        },
      },
    })
    const photos = restaurantPhotosForCarousel({ restaurant, max: 20 })
    console.log('photos', photos)
    // const [dish] = query.restaurant({
    //   where: {
    //     id: {
    //       _eq: props.state.dishId ?? ''
    //     }
    //   }
    // })
    // const images = dish.tags().map(tag => tag.photos())
    return (
      <ZStack
        fullscreen
        backgroundColor="rgba(0,0,0,0.5)"
        alignItems="center"
        justifyContent="center"
        zIndex={10000000000}
      >
        <VStack
          width="98%"
          height="100%"
          maxWidth={pageWidthMax}
          alignItems="center"
          paddingVertical={20}
        >
          <StackViewCloseButton />

          <Text fontSize={30} fontWeight="bold" color="#fff">
            {restaurant.name}
          </Text>

          <ScrollView>
            <HStack paddingVertical={20} flexWrap="wrap">
              {photos.map((photo, i) => {
                return (
                  <Image
                    key={i}
                    source={{ uri: photo.image }}
                    style={{
                      width: 200,
                      height: 200,
                      marginVertical: 10,
                      marginHorizontal: 10,
                    }}
                  />
                )
              })}
            </HStack>
          </ScrollView>
        </VStack>
      </ZStack>
    )
  })
)
