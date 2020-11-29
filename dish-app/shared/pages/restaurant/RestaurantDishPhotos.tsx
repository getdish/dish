import { graphql } from '@dish/graph'
import React, { memo, useMemo, useState } from 'react'
import { HStack, VStack } from 'snackui'

import { bgLightHover } from '../../colors'
import { isWeb } from '../../constants'
import { getRestuarantDishes } from '../../helpers/getRestaurantDishes'
import { getTagSlug } from '../../state/getTagSlug'
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
      selected?: string | null
      size?: number
      max?: number
    }) => {
      const dishes = getRestuarantDishes({ restaurantSlug, max })
      const spacing = 20
      const [hasScrolled, setHasScrolled] = useState(false)

      const handleScroll = useMemo(() => {
        return !hasScrolled
          ? () => {
              setHasScrolled(true)
            }
          : undefined
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
              {dishes.map((dish, index) => {
                const isSelected = selected === getTagSlug(dish)
                return (
                  <VStack
                    key={dish.name}
                    padding={spacing / 2}
                    marginRight={-spacing / 4}
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
                      preventLoad={index > 5 && !hasScrolled}
                      size={size}
                      restaurantSlug={restaurantSlug}
                      restaurantId={restaurantId}
                      dish={dish}
                      selected={isSelected}
                      {...(!!selectable && {
                        onPress() {
                          onSelect?.(getTagSlug(dish))
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
