import { ArgsFn } from 'gqless'

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

// BE SURE TO ADD TO ALL SECTIONS!

// using interfaces here *fixes* all our speed issues with typescript!
export interface RestaurantFull extends restaurant {}
export interface TagFull extends tag {}
export interface RestaurantTagFull extends restaurant_tag {}
export interface TagTagFull extends tag_tag {}
export interface UserFull extends user {}
export interface ReviewFull extends review {}
export interface DishFull extends dish {}
export interface ScrapeFull extends scrape {}

// TODO next step is make it recurse, see if its fast enough
type ResolveArgs<A> = A extends ArgsFn<any, any, any> ? any : A
type FullyResolved<O> = {
  [K in keyof O]?: ResolveArgs<O[K]>
}

export type Restaurant = FullyResolved<RestaurantFull>
export type Tag = FullyResolved<TagFull>
export type RestaurantTag = FullyResolved<RestaurantTagFull>
export type TagTag = FullyResolved<TagTagFull>
export type User = FullyResolved<UserFull>
export type Review = FullyResolved<ReviewFull>
export type Dish = FullyResolved<DishFull>
export type Scrape = FullyResolved<ScrapeFull>

export type ModelType =
  | Restaurant
  | Tag
  | RestaurantTag
  | TagTag
  | User
  | Review
  | Dish
  | Scrape

export type IDRequired<A extends ModelType> = A & { id: string }

export type RestaurantWithId = IDRequired<RestaurantFull>
export type TagWithId = IDRequired<TagFull>
export type RestaurantTagWithId = IDRequired<RestaurantTagFull>
export type TagTagWithId = IDRequired<TagTagFull>
export type UserWithId = IDRequired<UserFull>
export type ReviewWithId = IDRequired<ReviewFull>
export type DishWithId = IDRequired<DishFull>
export type ScrapeWithId = IDRequired<ScrapeFull>

export type RestaurantTagWithID = Partial<RestaurantTag> &
  Pick<RestaurantTag, 'tag_id'>
