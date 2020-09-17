import { allTags } from '../state/allTags'
import { HomeActiveTagsRecord } from '../state/home-types'
import { useRestaurantQuery } from './useRestaurantQuery'

export function useRestaurantTagScores(
  restaurantSlug: string,
  activeTagIds: HomeActiveTagsRecord
) {
  const restaurant = useRestaurantQuery(restaurantSlug)
  const scores = Object.keys(activeTagIds).map((tagId) => {
    const tagName = allTags[tagId].name
    return restaurant
      .tags({
        limit: 1,
        where: {
          tag: {
            name: {
              _eq: tagName,
            },
          },
        },
      })
      .map((rtag) => {
        return {
          name: rtag.tag.name,
          icon: rtag.tag.icon,
          score: rtag.score,
          score_breakdown: rtag.score_breakdown,
        }
      })[0]
  })
  return scores
}
