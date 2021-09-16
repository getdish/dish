import { graphql } from '@dish/graph'
import React, { memo } from 'react'
import { HStack, VStack, getMedia } from 'snackui'

import { getRestaurantDishes } from '../../../helpers/getRestaurantDishes'
import { selectRishDishViewSimple } from '../../../helpers/selectDishViewSimple'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { DishView } from '../../views/dish/DishView'
import { SkewedCardCarousel } from '../SimpleCard'
import { EditRestaurantTagsButton } from './EditRestaurantTagsButton'

const media = getMedia()
const showInitial = media.xs ? 1 : media.sm ? 2 : 3

export const RestaurantPeekDishes = memo(
  graphql(function RestaurantPeekDishes(props: {
    size?: 'lg' | 'md'
    restaurantSlug: string
    restaurantId: string
    activeTagSlugs?: string[]
    isLoaded: boolean
    tagSlugs?: string[]
    editable?: boolean
    onChangeTags?: (slugs: string[]) => void
  }) {
    const { isLoaded, size = 'md' } = props
    const restaurant = queryRestaurant(props.restaurantSlug)[0]
    const dishes = props.tagSlugs
      ? restaurant
          ?.tags({
            where: {
              tag: {
                slug: {
                  _in: props.tagSlugs,
                },
              },
            },
          })
          .map(selectRishDishViewSimple) ?? []
      : getRestaurantDishes({
          restaurant,
          tagSlugs: props.activeTagSlugs,
          max: 5,
        })

    const foundMatchingSearchedDish = props.activeTagSlugs?.includes(dishes?.[0]?.slug)
    const dishSize = size === 'lg' ? 130 : 110

    return (
      <>
        <HStack
          position="relative"
          pointerEvents="none"
          paddingHorizontal={20}
          paddingVertical={0}
          // this is to pull it up near title
          marginTop={-35}
          x={-15}
          alignItems="center"
        >
          {props.editable && (
            <EditRestaurantTagsButton
              restaurantSlug={props.restaurantSlug}
              tagSlugs={props.tagSlugs ?? dishes.map((x) => x.slug)}
              onChange={props.onChangeTags}
            />
          )}
          <SkewedCardCarousel>
            {!!dishes[0]?.name &&
              dishes.map((dish, i) => {
                // const isEven = i % 2 === 0
                const baseSize = foundMatchingSearchedDish
                  ? i == 0
                    ? dishSize
                    : dishSize * 0.95
                  : dishSize

                const preventLoad = !isLoaded && i > showInitial
                return (
                  <VStack marginRight={2} key={dish.slug} zIndex={100 - i}>
                    <DishView
                      preventLoad={preventLoad}
                      size={baseSize}
                      restaurant={restaurant || undefined}
                      {...dish}
                      showSearchButton={!props.editable}
                    />
                  </VStack>
                )
              })}
          </SkewedCardCarousel>
        </HStack>
      </>
    )
  })
)
