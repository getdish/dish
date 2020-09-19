import { allTags } from '../state/allTags'
import { HomeActiveTagsRecord } from '../state/home-types'
import { useRestaurantQuery } from './useRestaurantQuery'

export function useRestaurantTagScores(
  restaurantSlug: string,
  activeTagIds: HomeActiveTagsRecord
) {
  const restaurant = useRestaurantQuery(restaurantSlug)
  const scores = Object.keys(activeTagIds ?? {})
    .map((tagId) => {
      const tagName = allTags[tagId].name
      if (!tagName) {
        console.warn('no tag name', tagName)
        return null
      }
      const rtag = restaurant.tags({
        limit: 1,
        where: {
          tag: {
            name: {
              _eq: tagName,
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
    .filter(Boolean) as [
    {
      name: string
      icon: string
      score: number
    }
  ]

  return scores
}
