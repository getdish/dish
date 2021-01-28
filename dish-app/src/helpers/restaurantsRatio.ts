import { RestaurantQuery } from '@dish/graph'

export const restaurantRatio = (restaurant: RestaurantQuery) => {
  return Math.min(5, restaurant.rating) / 5.0
  // not working, returning empty for most
  // const ups = restaurant.upvotes ?? 1
  // const downs = restaurant.downvotes ?? 1
  // return ups / (ups + downs)
}
