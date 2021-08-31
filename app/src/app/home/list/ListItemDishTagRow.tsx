import { graphql } from '@dish/graph'
import React, { memo } from 'react'
import { HStack, VStack } from 'snackui'

import { getRestaurantDishes } from '../../../helpers/getRestaurantDishes'
import { selectRishDishViewSimple } from '../../../helpers/selectDishViewSimple'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { EditRestaurantTagsButton } from '../restaurant/EditRestaurantTagsButton'

const ListItemDishTagRow = memo(
  graphql(function ListItemDishTagRow(props: {
    size?: 'lg' | 'md'
    restaurantSlug: string
    restaurantId: string
    activeTagSlugs?: string[]
    isLoaded: boolean
    tagSlugs?: string[]
    editable?: boolean
    onChangeTags?: (slugs: string[]) => void
  }) {
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

    return (
      <HStack position="relative" alignItems="center" spacing>
        {props.editable && (
          <EditRestaurantTagsButton
            restaurantSlug={props.restaurantSlug}
            tagSlugs={props.tagSlugs ?? dishes.map((x) => x.slug)}
            onChange={props.onChangeTags}
          />
        )}
        {!!dishes[0]?.name &&
          dishes.map((dish, i) => {
            return (
              <VStack key={dish.slug} marginRight={-2} zIndex={100 - i}>
                <TagButton
                  restaurantSlug={props.restaurantSlug}
                  {...getTagButtonProps(dish)}
                  showSearchButton={!props.editable}
                />
              </VStack>
            )
          })}
      </HStack>
    )
  })
)
