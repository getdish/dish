import { RestaurantQuery } from '@dish/graph'

export const restaurantRatio = (restaurant: RestaurantQuery) => {
  return restaurant.rating * 20
  // not working, returning empty for most
  // const ups = restaurant.upvotes ?? 1
  // const downs = restaurant.downvotes ?? 1
  // return ups / (ups + downs)
}
