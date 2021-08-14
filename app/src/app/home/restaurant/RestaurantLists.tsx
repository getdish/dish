import { graphql, order_by } from '@dish/graph'
import React, { memo } from 'react'
import { VStack } from 'snackui'

import { queryRestaurant } from '../../../queries/queryRestaurant'
import { ListCard } from '../../views/list/ListCard'
import { SlantedTitle } from '../../views/SlantedTitle'
import { CardCarousel } from '../user/CardCarousel'

export const RestaurantLists = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const [restaurant] = queryRestaurant(restaurantSlug)

    if (!restaurant) {
      return null
    }

    const lists = restaurant.lists({
      limit: 10,
      order_by: [{ list: { created_at: order_by.asc } }],
    })

    if (lists.length === 0) {
      return null
    }

    return (
      <VStack marginTop={-15} marginBottom={15}>
        <SlantedTitle size="xs" marginBottom={-26} alignSelf="center" fontWeight="700">
          Lists
        </SlantedTitle>
        <CardCarousel>
          {lists.map(({ list }, i) => {
            return (
              <ListCard
                // zIndex={1000 - i}
                key={list.id || i}
                slug={list.slug || ''}
                userSlug={list.user?.username ?? 'no-user'}
              />
            )
          })}
        </CardCarousel>
      </VStack>
    )
  })
)
