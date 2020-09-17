import { graphql, restaurantPhotosForCarousel, slugify } from '@dish/graph'
import { HStack } from '@dish/ui'
import React, { memo, useState } from 'react'
import { ScrollView } from 'react-native'

import { isWeb } from '../../constants'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { DishView } from '../../views/dish/DishView'

export const RestaurantDishPhotos = memo(
  graphql(
    ({
      restaurantSlug,
      restaurantId,
      selectable,
      onSelect,
      defaultSelectedId,
      size = 180,
    }: {
      restaurantSlug: string
      restaurantId?: string
      selectable?: boolean
      onSelect?: (dish: string) => any
      defaultSelectedId?: string
      size?: number
    }) => {
      const restaurant = useRestaurantQuery(restaurantSlug)
      const photos = restaurantPhotosForCarousel({ restaurant, max: 30 })
      const spacing = 12
      const [selected, setSelected] = useState(
        selectable
          ? defaultSelectedId
            ? photos.findIndex(
                (x) => slugify(x.name ?? '') === defaultSelectedId
              )
            : 0
          : 1
      )

      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            width: isWeb ? 'calc(100% + 30px)' : '98%',
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
                    size={size}
                    restaurantSlug={restaurantSlug}
                    // restaurantId={restaurantId}
                    margin={spacing / 2}
                    marginBottom={16}
                    dish={photo}
                    selected={selected === index}
                    {...(!!selectable && {
                      onPress() {
                        console.warn('ok')
                        setSelected(index)
                        onSelect?.(photo.name)
                      },
                    })}
                  />
                )
              })}
            </HStack>
          )}
        </ScrollView>
      )
    }
  )
)
