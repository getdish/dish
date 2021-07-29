import { RestaurantQuery } from '@dish/graph'

export const ratingCount = (restaurant: RestaurantQuery) => {
  return restaurant.reviews_aggregate({}).aggregate?.count({}) ?? 0
}
