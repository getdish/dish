import { order_by } from '@dish/graph'

import { queryRestaurant } from './queryRestaurant'

export const queryRestaurantTags = ({
  restaurantSlug,
  limit = 20,
  exclude = 'orphan',
}: {
  restaurantSlug: string
  limit?: number
  exclude?: 'orphan' | 'dish' | 'category'
}) => {
  const [restaurant] = queryRestaurant(restaurantSlug)
  if (!restaurant) {
    return []
  }
  const cuisineTags = restaurant.tags({
    limit: 1,
    where: {
      tag: {
        type: {
          _eq: 'country',
        },
      },
    },
    order_by: [{ rating: order_by.desc_nulls_last }, { votes_ratio: order_by.desc_nulls_last }],
  })
  const lenseTags = restaurant.tags({
    limit: 2,
    where: {
      tag: {
        type: {
          _eq: 'lense',
        },
      },
    },
    order_by: [{ rating: order_by.desc_nulls_last }, { votes_ratio: order_by.desc_nulls_last }],
  })
  const catTags = restaurant.tags({
    limit: 10,
    where: {
      tag: {
        type: {
          _eq: 'category',
        },
      },
    },
    order_by: [{ rating: order_by.desc_nulls_last }, { votes_ratio: order_by.desc_nulls_last }],
  })
  return [...lenseTags, ...cuisineTags, ...catTags]
}
