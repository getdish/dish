import {
  dish,
  restaurant,
  restaurant_tag,
  review,
  scrape,
  tag,
  tag_tag,
  user,
} from './graphql'

export type Restaurant = Partial<Omit<restaurant, '__typename'>> | any
export type Tag = Partial<Omit<tag, '__typename'>> | any
export type RestaurantTag = Partial<Omit<restaurant_tag, '__typename'>> | any
export type TagTag = Partial<Omit<tag_tag, '__typename'>> | any
export type User = Partial<Omit<user, '__typename'>> | any
export type Review = Partial<Omit<review, '__typename'>> | any
export type Dish = Partial<Omit<dish, '__typename'>> | any
export type Scrape = Partial<Omit<scrape, '__typename'>> | any

export type ModelType =
  | Restaurant
  | Tag
  | RestaurantTag
  | TagTag
  | User
  | Review
  | Dish
  | Scrape

export type RestaurantTagWithID = Partial<RestaurantTag> &
  Pick<RestaurantTag, 'tag_id'>
