import { RestaurantQuery } from '@dish/graph'

export const useTotalReviews = (restaurant: RestaurantQuery) => {
  return restaurant.reviews_aggregate.aggregate.count() ?? 0
}
