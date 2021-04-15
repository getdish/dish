import { order_by } from '@dish/graph'

import { queryRestaurant } from './queryRestaurant'

export const queryRestaurantTags = ({
  restaurantSlug,
  limit = 20,
}: {
  restaurantSlug: string
  limit?: number
}) => {
  const [restaurant] = queryRestaurant(restaurantSlug)
  if (!restaurant) {
    return []
  }
  const restaurantTags = restaurant.tags({
    limit,
    where: {
      tag: {
        type: {
          _neq: 'category',
        },
      },
    },
    order_by: [{ votes_ratio: order_by.desc }],
  })
  return restaurantTags
}
