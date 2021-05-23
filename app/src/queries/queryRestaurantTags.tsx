import { order_by } from '@dish/graph'

import { queryRestaurant } from './queryRestaurant'

export type QueryRestaurantTagsProps = {
  restaurantSlug: string
  limit?: number
  exclude?: ('lense' | 'country' | 'dish' | 'category')[]
}

export const queryRestaurantTags = ({
  restaurantSlug,
  limit = 20,
  exclude = [],
}: QueryRestaurantTagsProps) => {
  const [restaurant] = queryRestaurant(restaurantSlug)
  if (!restaurant) {
    return []
  }
  const dishTags = exclude.includes('dish')
    ? []
    : restaurant.tags({
        limit,
        where: {
          tag: {
            type: {
              _eq: 'dish',
            },
          },
        },
        order_by: [{ rating: order_by.desc_nulls_last }, { votes_ratio: order_by.desc_nulls_last }],
      })
  const countryTags = exclude.includes('country')
    ? []
    : restaurant.tags({
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
  const lenseTags = exclude.includes('lense')
    ? []
    : restaurant.tags({
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
  const catTags = exclude.includes('category')
    ? []
    : restaurant.tags({
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
  return [...dishTags, ...lenseTags, ...countryTags, ...catTags]
}
