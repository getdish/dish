import { RestaurantQuery } from '@dish/graph'

import { isNative } from '../../constants'

export const useTotalReviews = (restaurant: RestaurantQuery) => {
  if (isNative) {
    return 0
  }
  const agg = restaurant.reviews_aggregate
  return agg().aggregate.count() ?? 0
}
