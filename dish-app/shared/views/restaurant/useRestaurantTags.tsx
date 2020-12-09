import { order_by } from '@dish/graph'

import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'

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
  return restaurantTags.map((tag) => ({
    rank: tag.rank,
    rgb: tag.tag.rgb,
    name: tag.tag.name,
    icon: tag.tag.icon,
    slug: tag.tag.slug,
    type: tag.tag.type,
    score: tag.score,
  }))
}
