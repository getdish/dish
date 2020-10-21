import { graphql } from '@dish/graph'
import React, { memo, useMemo, useState } from 'react'
import { HStack, VStack } from 'snackui'

import { bgLightHover, blue } from '../../colors'
import { isWeb } from '../../constants'
import { getRestuarantDishes } from '../../helpers/getRestaurantDishes'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
import { DishView } from '../../views/dish/DishView'

export const RestaurantDishPhotos = memo(
  graphql(
    ({
      restaurantSlug,
      restaurantId,
      selectable,
      onSelect,
      selected,
      size = 170,
      max = 30,
    }: {
      restaurantSlug: string
      restaurantId?: string
      selectable?: boolean
      onSelect?: (dish: string) => any
      selected?: string
      size?: number
      max?: number
    }) => {
      const dishes = getRestuarantDishes({ restaurantSlug, max })
      const spacing = 20
      const [hasScrolled, setHasScrolled] = useState(false)

      const allPhotos = hasScrolled ? dishes : dishes.slice(0, 6)

      const handleScroll = useMemo(() => {
        return !hasScrolled
          ? () => {
              setHasScrolled(true)
            }
          : null
      }, [hasScrolled])

      return (
        <ContentScrollViewHorizontal
          onScroll={handleScroll}
          style={{
            width: isWeb ? 'calc(100% + 30px)' : '98%',
            marginHorizontal: -15,
          }}
        >
          {!!dishes?.length && (
            <HStack
              paddingHorizontal={60}
              paddingTop={20}
              alignItems="center"
              justifyContent="center"
            >
              {allPhotos.map((photo, index) => {
                const isSelected = selected === photo.name
                return (
                  <VStack
                    key={photo.name}
                    padding={spacing / 2}
                    paddingBottom={30}
                    borderTopLeftRadius={28}
                    borderTopRightRadius={28}
                    borderWidth={1}
                    borderColor="transparent"
                    {...(isSelected && {
                      backgroundColor: '#fff',
                      borderColor: bgLightHover,
                      borderBottomColor: '#fff',
                    })}
                  >
                    <DishView
                      noLink
                      size={size}
                      restaurantSlug={restaurantSlug}
                      restaurantId={restaurantId}
                      dish={photo}
                      selected={isSelected}
                      {...(!!selectable && {
                        onPress() {
                          console.warn('ok')
                          onSelect?.(photo.name)
                        },
                      })}
                    />
                  </VStack>
                )
              })}
            </HStack>
          )}
        </ContentScrollViewHorizontal>
      )
    }
  )
)
