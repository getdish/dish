import { graphql, restaurantPhotosForCarousel } from '@dish/graph'
import { HStack } from '@dish/ui'
import React, { memo } from 'react'
import { ScrollView } from 'react-native'

import { DishView } from './DishView'
import { useHomeDrawerWidthInner } from './useHomeDrawerWidth'
import { useRestaurantQuery } from './useRestaurantQuery'

export const RestaurantDishPhotos = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const photos = restaurantPhotosForCarousel({ restaurant, max: 30 })
    const drawerWidth = useHomeDrawerWidthInner()
    const spacing = 12
    const perRow = drawerWidth > 800 ? 3 : 2

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          width: 'calc(100% + 30px)',
          marginHorizontal: -15,
        }}
      >
        {!!photos?.length && (
          <HStack
            paddingHorizontal={60}
            marginTop={10}
            alignItems="center"
            justifyContent="center"
          >
            {photos.map((photo, index) => {
              return (
                <DishView
                  key={index}
                  size={(drawerWidth / 2 - perRow * spacing) / perRow}
                  restaurantSlug={restaurantSlug}
                  margin={spacing / 2}
                  marginBottom={16}
                  dish={photo}
                />
              )
            })}
          </HStack>
        )}
      </ScrollView>
    )
  })
)
