import { graphql } from '@dish/graph'
import React, { memo, useMemo, useState } from 'react'
import { HStack, Spacer, VStack } from 'snackui'

import { bgLightHover, blue } from '../../../constants/colors'
import { isWeb } from '../../../constants/constants'
import { getRestaurantDishes } from '../../../helpers/getRestaurantDishes'
import { getTagSlug } from '../../../helpers/getTagSlug'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
import { DishButton } from '../../views/dish/DishButton'
import { ScalingPressable } from '../../views/ScalingPressable'

export const RestaurantTagsRow = memo(
  graphql(
    ({
      restaurantSlug,
      restaurantId,
      selectable,
      onSelect,
      selected,
      max = 30,
    }: {
      restaurantSlug: string
      restaurantId?: string
      selectable?: boolean
      onSelect?: (dish: string) => any
      selected?: string | null
      max?: number
    }) => {
      const dishes = getRestaurantDishes({ restaurantSlug, max })
      const [hasScrolled, setHasScrolled] = useState(false)
      const hasDishes = !!dishes?.length

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
            marginHorizontal: -5,
          }}
        >
          {hasDishes ? (
            <HStack
              paddingHorizontal={30}
              paddingVertical={20}
              alignItems="center"
              justifyContent="center"
            >
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
                        <DishButton
                          noLink
                          restaurantSlug={restaurantSlug}
                          restaurantId={restaurantId}
                          {...dish}
                          isActive={isSelected}
                        />
                      </SectionTab>
                    </ScalingPressable>
                  </React.Fragment>
                )
              })}
            </HStack>
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
