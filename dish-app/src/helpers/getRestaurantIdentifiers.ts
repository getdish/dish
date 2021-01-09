import { RestaurantQuery } from '@dish/graph/src'

export function getRestaurantIdentifiers(r: RestaurantQuery) {
  return {
    id: r.id,
    slug: r.slug,
  }
}
