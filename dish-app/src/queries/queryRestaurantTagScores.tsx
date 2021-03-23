import { isPresent } from '@dish/helpers'

import { selectRishDishViewSimple } from '../helpers/selectDishViewSimple'
import { queryRestaurant } from './queryRestaurant'

export function queryRestaurantTagScores({
  restaurantSlug,
  tagSlugs,
}: {
  restaurantSlug: string
  tagSlugs: string[]
}) {
  const [restaurant] = queryRestaurant(restaurantSlug)
  if (!restaurant) {
    return []
  }
  return tagSlugs
    .map((slug) => {
      const rtag = restaurant.tags({
        limit: 1,
        where: {
          tag: {
            slug: {
              _eq: slug,
            },
          },
        },
      })[0]
      if (!rtag) {
        return null
      }
      return selectRishDishViewSimple(rtag)
    })
    .filter(isPresent)
}
