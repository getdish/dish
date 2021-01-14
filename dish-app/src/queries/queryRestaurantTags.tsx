import { order_by } from '@dish/graph'

import { selectTagButtonProps } from '../helpers/selectTagButtonProps'
import { queryRestaurant } from './queryRestaurant'

export const queryRestaurantTags = ({
  restaurantSlug,
  limit = 20,
}: {
  restaurantSlug: string
  limit?: number
}) => {
  const restaurant = queryRestaurant(restaurantSlug)
  const restaurantTags = restaurant.tags({
    limit,
    where: {
      tag: {
        type: {
          _neq: 'dish',
        },
      },
    },
    order_by: [{ score: order_by.desc }],
  })
  return restaurantTags.map(selectTagButtonProps)
}
