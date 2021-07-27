import { graphql, order_by } from '@dish/graph'
import React, { memo } from 'react'
import { VStack } from 'snackui'

import { queryRestaurant } from '../../../queries/queryRestaurant'
import { ListCard } from '../../views/list/ListCard'
import { SlantedTitle } from '../../views/SlantedTitle'
import { SimpleCard, SkewedCardCarousel } from '../SimpleCard'

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
        <SlantedTitle size="md" marginBottom={-26} alignSelf="center" fontWeight="700">
          Lists
        </SlantedTitle>
        <SkewedCardCarousel>
          {lists.map(({ list }, i) => {
            return (
              <SimpleCard zIndex={1000 - i} key={list.id || i}>
                <ListCard
                  isBehind={i > 0}
                  hoverable={false}
                  slug={list.slug}
                  userSlug={list.user?.username ?? 'no-user'}
                  region={list.region ?? 'no-region'}
                />
              </SimpleCard>
            )
          })}
        </SkewedCardCarousel>
      </VStack>
    )
  })
)
