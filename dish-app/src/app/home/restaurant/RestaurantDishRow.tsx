import { graphql } from '@dish/graph'
import { partition, unzip } from 'lodash'
import React, { memo, useMemo, useState } from 'react'
import { HStack, Spacer, Theme, VStack } from 'snackui'

import { bgLightHover, blue } from '../../../constants/colors'
import { isWeb } from '../../../constants/constants'
import { getRestaurantDishes } from '../../../helpers/getRestaurantDishes'
import { getTagSlug } from '../../../helpers/getTagSlug'
import { DishTagItemSimple } from '../../../helpers/selectDishViewSimple'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
import { TagButtonSlanted } from '../../views/dish/TagButtonSlanted'
import { ScalingPressable } from '../../views/ScalingPressable'

const withIndex = (fn) => {
  let index = 0
  return (thing) => fn(thing, index++)
}

export const RestaurantDishRow = memo(
  graphql(
    ({
      restaurantSlug,
      restaurantId,
      selectable,
      onSelect,
      selected,
      max = 30,
      themeName,
    }: {
      restaurantSlug: string
      restaurantId?: string
      selectable?: boolean
      onSelect?: (dish: string) => any
      selected?: string | null
      max?: number
      themeName?: string
    }) => {
      const dishes = getRestaurantDishes({ restaurantSlug, max })
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

      const getDishRow = (dishes: DishTagItemSimple[]) => {
        return (
          <>
            {dishes.map((dish, index) => {
              const isSelected = selected === getTagSlug(dish.slug)
              return (
                <React.Fragment key={dish.name}>
                  <ScalingPressable
                    {...(!!selectable && {
                      onPress() {
                        onSelect?.(getTagSlug(dish.slug))
                      },
                    })}
                  >
                    <SectionTab isSelected={isSelected}>
                      <Theme name={isSelected && themeName ? themeName : null}>
                        <TagButtonSlanted
                          noLink
                          restaurantSlug={restaurantSlug}
                          restaurantId={restaurantId}
                          {...dish}
                        />
                      </Theme>
                    </SectionTab>
                  </ScalingPressable>
                </React.Fragment>
              )
            })}
          </>
        )
      }

      return (
        <ContentScrollViewHorizontal
          onScroll={handleScroll}
          style={{
            width: isWeb ? 'calc(100% + 30px)' : '98%',
            marginHorizontal: -5,
          }}
        >
          {hasDishes ? (
            <VStack paddingHorizontal={30} paddingVertical={20}>
              <HStack>
                <SectionTab isSelected={selected === ''}>
                  <Theme name={themeName && selected === '' ? themeName : null}>
                    <ScalingPressable
                      onPress={() => {
                        onSelect?.('')
                      }}
                    >
                      <TagButtonSlanted
                        noLink
                        bold
                        name="Overall"
                        selected={selected === ''}
                      />
                    </ScalingPressable>
                  </Theme>
                </SectionTab>
                {getDishRow(dishGroups[0])}
              </HStack>
              <Spacer size="sm" />
              <HStack>{getDishRow(dishGroups[1])}</HStack>
            </VStack>
          ) : (
            <Spacer size="xl" />
          )}
        </ContentScrollViewHorizontal>
      )
    }
  )
)

function SectionTab({
  children,
  isSelected,
}: {
  children: any
  isSelected?: boolean
}) {
  return (
    <VStack
      borderRadius={1000}
      shadowColor={blue}
      borderWidth={2}
      borderColor="transparent"
      marginRight={5}
      // padding={20 / 2}
      // marginRight={-20 / 4}
      // paddingBottom={30}
      // borderTopLeftRadius={28}
      // borderTopRightRadius={28}
      // borderWidth={1}
      // borderColor="transparent"
      {...(isSelected && {
        backgroundColor: '#fff',
        borderColor: bgLightHover,
        borderBottomColor: '#fff',
      })}
    >
      {children}
    </VStack>
  )
}
