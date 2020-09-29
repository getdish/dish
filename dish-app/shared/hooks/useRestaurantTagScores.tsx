import { isPresent } from '@dish/helpers'

import { useRestaurantQuery } from './useRestaurantQuery'

export function useRestaurantTagScores({
  restaurantSlug,
  tagNames,
}: {
  restaurantSlug: string
  tagNames: string[]
}) {
  const restaurant = useRestaurantQuery(restaurantSlug)
  return tagNames
    .map((tagName) => {
      const rtag = restaurant.tags({
        limit: 1,
        where: {
          tag: {
            name: {
              _eq: tagName,
            },
            type: {
              _neq: 'country',
            },
          },
        },
      })[0]
      if (!rtag) {
        return null
      }
      return {
        name: rtag.tag.name,
        icon: rtag.tag.icon,
        score: rtag.score,
      }
    })
    .filter(isPresent)
}
