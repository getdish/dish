import { graphql } from '@dish/graph'
import React, { Suspense, memo, useState } from 'react'
import { Image, ScrollView } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  LoadingItems,
  Modal,
  Text,
  VStack,
} from 'snackui'

import { isWeb, pageWidthMax } from '../../constants'
import { getImageUrl } from '../../helpers/getImageUrl'
import { getRestuarantDishes } from '../../helpers/getRestaurantDishes'
import { useIsNarrow, useIsShort } from '../../hooks/useIs'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { HomeStateItemGallery } from '../../state/home-types'
import { useOvermind } from '../../state/om'
import { StackViewCloseButton } from '../../views/StackViewCloseButton'
import { RestaurantHeader } from '../restaurant/RestaurantHeader'

export default memo(function GalleryPage() {
  const om = useOvermind()
  const state = om.state.home.currentState
  const isSmall = useIsNarrow()

  if (state.type === 'gallery') {
    const dishPhotosElement = null
    // (
    //   <Suspense fallback={null}>
    //     <RestaurantDishPhotos
    //       size={100}
    //       restaurantSlug={state.restaurantSlug}
    //       selectable
    //       defaultSelectedId={state.dishId}
    //       onSelect={(selected) => {
    //         console.log('got em', selected)
    //       }}
    //     />
    //   </Suspense>
    // )

    return (
      <Modal maxWidth={pageWidthMax} width="98%" height="98%" maxHeight="98%">
        <AbsoluteVStack top={5} right={30} zIndex={100000}>
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
                paddingHorizontal={20}
                paddingBottom={10}
              >
                <RestaurantHeader
                  size="sm"
                  restaurantSlug={state.restaurantSlug}
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
      </Modal>
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
    const [hasScrolled, setHasScrolled] = useState(false)
    const isSmall = useIsNarrow()
    const isShort = useIsShort()
    // const dish = state.dishId
    //   ? query.tag({
    //       where: {
    //         type: { _eq: 'dish' },
    //         name: { _ilike: `%${state.dishId.replace(/-/g, '%')}%` },
    //       },
    //       limit: 1,
    //     })[0]
    //   : null
    const tag_names = state.dishId ? [state.dishId] : []

    // TODO replace, need to split into two things
    const photos = getRestuarantDishes({
      restaurantSlug: state.restaurantSlug,
      max: hasScrolled ? 50 : 20,
      tag_names,
    })

    return (
      <>
        <ScrollView
          {...(!hasScrolled && {
            onScroll: () => setHasScrolled(true),
            scrollEventThrottle: 100,
          })}
          style={{ width: '100%', height: '100%' }}
        >
          {header}
          <HStack
            flex={10}
            marginTop={-12}
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
                    source={{ uri: getImageUrl(photo.image, 900, 800, 100) }}
                    resizeMode="cover"
                    style={{
                      width: isWeb ? 'calc(100% - 4px)' : '99%',
                      height: isShort ? 250 : 400,
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
      </>
    )
  })
)
