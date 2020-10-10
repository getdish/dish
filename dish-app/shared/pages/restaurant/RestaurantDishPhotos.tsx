import { graphql, slugify } from '@dish/graph'
import { HStack } from '@dish/ui'
import React, { memo, useState } from 'react'
import { ScrollView } from 'react-native'

import { isWeb } from '../../constants'
import { getRestuarantDishes } from '../../helpers/getRestaurantDishes'
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
      max = 30,
    }: {
      restaurantSlug: string
      restaurantId?: string
      selectable?: boolean
      onSelect?: (dish: string) => any
      defaultSelectedId?: string
      size?: number
      max?: number
    }) => {
      const dishes = getRestuarantDishes({ restaurantSlug, max })
      const spacing = 12
      const [hasScrolled, setHasScrolled] = useState(false)
      const [selected, setSelected] = useState(
        selectable
          ? defaultSelectedId
            ? dishes.findIndex(
                (x) => slugify(x.name ?? '') === defaultSelectedId
              )
            : 0
          : 1
      )

      const allPhotos = hasScrolled ? dishes : dishes.slice(0, 6)

      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={
            !hasScrolled
              ? () => {
                  setHasScrolled(true)
                }
              : null
          }
          scrollEventThrottle={200}
          style={{
            width: isWeb ? 'calc(100% + 30px)' : '98%',
            marginHorizontal: -15,
          }}
        >
          {!!dishes?.length && (
            <HStack
              paddingHorizontal={60}
              paddingVertical={20}
              alignItems="center"
              justifyContent="center"
            >
              {allPhotos.map((photo, index) => {
                return (
                  <DishView
                    key={index}
                    size={size}
                    restaurantSlug={restaurantSlug}
                    restaurantId={restaurantId}
                    margin={spacing / 2}
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
