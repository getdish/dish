import { graphql, query, restaurantPhotosForCarousel } from '@dish/graph'
import { AbsoluteVStack, HStack, Text, VStack } from '@dish/ui'
import React, { memo } from 'react'
import { Image, ScrollView } from 'react-native'

import { pageWidthMax } from '../../constants'
import { HomeStateItemGallery } from '../../state/home'
import { useOvermind } from '../../state/useOvermind'
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
    const [restaurant] = query.restaurant({
      where: {
        slug: {
          _eq: props.state.restaurantSlug ?? '',
        },
      },
    })
    const photos = restaurantPhotosForCarousel({ restaurant, max: 100 })
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
          height="100%"
          maxWidth={pageWidthMax}
          alignItems="center"
          paddingVertical={20}
          position="relative"
        >
          <StackViewCloseButton />

          <Text fontSize={30} fontWeight="bold" color="#fff">
            {restaurant.name}
          </Text>

          <ScrollView style={{ flex: 1 }}>
            <HStack paddingVertical={20} flexWrap="wrap">
              {photos.map((photo, i) => {
                return (
                  <Image
                    key={i}
                    source={{ uri: photo.image }}
                    style={{
                      maxWidth: 335,
                      maxHeight: 335,
                      width: 'calc(24.5vw - 20px)',
                      height: 'calc(24.5vw - 20px)',
                      marginVertical: 2,
                      marginHorizontal: 2,
                    }}
                  />
                )
              })}
            </HStack>
          </ScrollView>
        </VStack>
      </AbsoluteVStack>
    )
  })
)
