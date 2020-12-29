import { order_by } from '@dish/graph'

import { selectTagButtonProps } from '../../helpers/selectTagButtonProps'
import { useRestaurantQuery } from './useRestaurantQuery'

export const useRestaurantTags = ({
  restaurantSlug,
  limit = 20,
}: {
  restaurantSlug: string
  limit?: number
}) => {
  const restaurant = useRestaurantQuery(restaurantSlug)
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
