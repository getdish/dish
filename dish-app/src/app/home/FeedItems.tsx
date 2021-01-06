import { RestaurantOnlyIds, TopCuisine } from '@dish/graph'

import { DishTagItem } from '../../helpers/getRestaurantDishes'

export type FeedItems =
  | FeedItemDish
  | FeedItemRestaurant
  | FeedItemCuisine
  | FeedItemDishRestaurants

type FeedItemBase = {
  id: string
  rank: number
  expandable: boolean
  transparent?: boolean
}
export type FeedItemDish = FeedItemBase & {
  type: 'dish'
  dish: DishTagItem
  restaurant: RestaurantOnlyIds
}
export type FeedItemDishRestaurants = FeedItemBase & {
  type: 'dish-restaurants'
  dish: DishTagItem
  restaurants: RestaurantOnlyIds[]
}
export type FeedItemCuisine = FeedItemBase &
  TopCuisine & {
    type: 'cuisine'
  }
export type FeedItemRestaurant = FeedItemBase & {
  type: 'restaurant'
  restaurant: RestaurantOnlyIds
}
