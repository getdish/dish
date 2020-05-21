import {
  dish,
  restaurant,
  restaurant_tag,
  review,
  tag,
  tag_tag,
  user,
} from './graphql'

export type Restaurant = Partial<Omit<restaurant, '__typename'>>
export type Tag = Partial<Omit<tag, '__typename'>>
export type RestaurantTag = Partial<Omit<restaurant_tag, '__typename'>>
export type TagTag = Partial<Omit<tag_tag, '__typename'>>
export type User = Partial<Omit<user, '__typename'>>
export type Review = Partial<Omit<review, '__typename'>>
export type Dish = Partial<Omit<dish, '__typename'>>
