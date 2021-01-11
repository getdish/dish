import { graphql } from '@dish/graph'
import React, { memo, useMemo, useState } from 'react'
import { SectionList } from 'react-native'
import { HStack, Spacer, VStack } from 'snackui'

import { bgLightHover } from '../../../constants/colors'
import { isWeb } from '../../../constants/constants'
import { getRestaurantDishes } from '../../../helpers/getRestaurantDishes'
import { getTagSlug } from '../../../helpers/getTagSlug'
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
              paddingTop={20}
              alignItems="center"
              justifyContent="center"
            >
              <SectionTab isSelected={selected === null}>
                <DishView
                  noLink
                  size={size}
                  dish={{
                    name: 'Overall',
                    image: '',
                    icon: '',
                    id: '',
                  }}
                  selected={selected === null}
                  {...(!!selectable && {
                    onPress() {
                      onSelect?.(null)
                    },
                  })}
                />
              </SectionTab>
              {dishes.map((dish, index) => {
                const isSelected = selected === getTagSlug(dish)
                return (
                  <React.Fragment key={dish.name}>
                    <SectionTab isSelected={isSelected}>
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
                    </SectionTab>
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
      padding={20 / 2}
      marginRight={-20 / 4}
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
      {children}
    </VStack>
  )
}
