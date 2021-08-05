import { graphql } from '@dish/graph'
import { partition } from 'lodash'
import React, { Suspense, memo, useMemo, useState } from 'react'
import { Pressable } from 'react-native'
import { HStack, LoadingItem, Spacer, Theme, VStack } from 'snackui'

import { isWeb } from '../../../constants/constants'
import { getRestaurantDishes } from '../../../helpers/getRestaurantDishes'
import { getTagSlug } from '../../../helpers/getTagSlug'
import { DishTagItemSimple } from '../../../helpers/selectDishViewSimple'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
import { TagButtonSlanted } from '../../views/dish/TagButtonSlanted'
import { ScalingPressable } from '../../views/ScalingPressable'

const withIndex = (fn) => {
  let index = 0
  return (thing) => fn(thing, index++)
}

type Props = {
  restaurantSlug: string
  restaurantId?: string
  selectable?: boolean
  onSelect?: (dish: string) => any
  selected?: string | null
  max?: number
  themeName?: string
}

export const RestaurantDishRow = (props: Props) => {
  return (
    <Suspense
      fallback={
        <VStack height={150}>
          <LoadingItem />
        </VStack>
      }
    >
      <RestaurantDishRowContent {...props} />
    </Suspense>
  )
}

export const RestaurantDishRowContent = memo(
  graphql(
    ({
      restaurantSlug,
      restaurantId,
      selectable,
      onSelect,
      selected,
      max = 30,
      themeName,
    }: Props) => {
      const [restaurant] = queryRestaurant(restaurantSlug)
      const dishes = getRestaurantDishes({ restaurant, max })
      const [hasScrolled, setHasScrolled] = useState(false)
      const hasDishes = !!dishes?.length
      const dishGroups = partition(
        dishes,
        withIndex((_, idx) => idx % 2)
      )

      const handleScroll = useMemo(() => {
        return !hasScrolled
          ? () => {
              setHasScrolled(true)
            }
          : undefined
      }, [hasScrolled])

      if (!hasDishes) {
        return null
      }

      const getDishRow = (dishes: DishTagItemSimple[]) => {
        return dishes.map((dish, index) => {
          const isSelected = selected === getTagSlug(dish.slug)
          return (
            <React.Fragment key={dish.name}>
              <Pressable
                {...(!!selectable && {
                  onPress() {
                    onSelect?.(getTagSlug(dish.slug))
                  },
                })}
              >
                <TagButtonSlanted
                  isActive={isSelected}
                  noLink
                  restaurantSlug={restaurantSlug}
                  restaurantId={restaurantId}
                  showSearchButton
                  {...dish}
                />
              </Pressable>
            </React.Fragment>
          )
        })
      }

      return (
        <ContentScrollViewHorizontal
          onScroll={handleScroll}
          style={{
            marginHorizontal: -20,
          }}
        >
          {hasDishes ? (
            <VStack paddingHorizontal={40} paddingVertical={10}>
              <HStack spacing="sm">
                <Theme name={themeName && selected === '' ? themeName : null}>
                  <ScalingPressable
                    onPress={() => {
                      onSelect?.('')
                    }}
                  >
                    <TagButtonSlanted noLink bold name="Overall" selected={selected === ''} />
                  </ScalingPressable>
                </Theme>
                {getDishRow(dishGroups[0])}
              </HStack>
              <Spacer size="sm" />
              <HStack marginLeft={24} spacing="sm">
                {getDishRow(dishGroups[1])}
              </HStack>
            </VStack>
          ) : (
            <Spacer size="xl" />
          )}
        </ContentScrollViewHorizontal>
      )
    }
  )
)
