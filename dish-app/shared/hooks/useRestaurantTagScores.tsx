import { isPresent } from '@dish/helpers'

import { selectTagButtonProps } from '../views/restaurant/selectTagButtonProps'
import { useRestaurantQuery } from './useRestaurantQuery'

export function useRestaurantTagScores({
  restaurantSlug,
  tagSlugs,
}: {
  restaurantSlug: string
  tagSlugs: string[]
}) {
  const restaurant = useRestaurantQuery(restaurantSlug)
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
      return selectTagButtonProps(rtag)
    })
    .filter(isPresent)
}
