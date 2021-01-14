import { RestaurantQuery } from '@dish/graph'

export function getRestaurantIdentifiers(r: RestaurantQuery) {
  return {
    id: r.id,
    slug: r.slug,
  }
}
