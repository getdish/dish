import { RestaurantQuery } from '@dish/graph'

import { isNative } from '../../../constants/constants'

export const useTotalReviews = (restaurant?: RestaurantQuery | null) => {
  if (!restaurant) return 0
  if (isNative) {
    return 0
  }
  const agg = restaurant.reviews_aggregate
  return agg().aggregate?.count() ?? 0
}

export const useTotalNativeReviews = (restaurant: RestaurantQuery) => {
  if (isNative) {
    return 0
  }
  const agg = restaurant.reviews_aggregate
  return (
    agg({
      where: { source: { _eq: 'dish' } },
    }).aggregate?.count() ?? 0
  )
}

export const useTotalExternalReviews = (restaurant: RestaurantQuery) => {
  if (isNative) {
    return 0
  }
  const agg = restaurant.reviews_aggregate
  return (
    agg({
      where: { source: { _neq: 'dish' } },
    }).aggregate?.count() ?? 0
  )
}
