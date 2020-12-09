import { RestaurantQuery } from '@dish/graph'

export const restaurantRatio = (restaurant: RestaurantQuery) => {
  const ups = restaurant.upvotes ?? 0
  const downs = restaurant.downvotes ?? 0
  return ups / (ups + downs)
}
