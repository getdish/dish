import { RestaurantQuery } from '@dish/graph'

export const restaurantRatio = (restaurant: RestaurantQuery) => {
  const ups = restaurant.upvotes ?? 1
  const downs = restaurant.downvotes ?? 1
  return ups / (ups + downs)
}
