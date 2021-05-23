import { RestaurantOnlyIds, RestaurantQuery } from '@dish/graph'

export function getRestaurantIdentifiers(r: RestaurantQuery | RestaurantOnlyIds) {
  return {
    id: r.id,
    slug: r.slug || '',
  }
}
