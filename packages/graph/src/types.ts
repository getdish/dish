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

// SECTION 1
// using interfaces here *fixes* all our speed issues with typescript!
export interface RestaurantFull extends restaurant {}
export interface TagFull extends tag {}
export interface RestaurantTagFull extends restaurant_tag {}
export interface TagTagFull extends tag_tag {}
export interface UserFull extends user {}
export interface ReviewFull extends review {}
export interface DishFull extends dish {}
export interface ScrapeFull extends scrape {}

// SECTION 2
// this is the main nicely typed thing you use
export type Restaurant = ResolvedModel<RestaurantFull>
export type Tag = ResolvedModel<TagFull>
export type RestaurantTag = ResolvedModel<RestaurantTagFull>
export type TagTag = ResolvedModel<TagTagFull>
export type User = ResolvedModel<UserFull>
export type Review = ResolvedModel<ReviewFull>
export type Dish = ResolvedModel<DishFull>
export type Scrape = ResolvedModel<ScrapeFull>

// SECTION 3
// this just adds a requirement on the id being present, for things like update()
export type RestaurantWithId = IDRequired<Restaurant>
export type TagWithId = IDRequired<Tag>
export type RestaurantTagWithId = IDRequired<RestaurantTag>
export type TagTagWithId = IDRequired<TagTag>
export type UserWithId = IDRequired<User>
export type ReviewWithId = IDRequired<Review>
export type DishWithId = IDRequired<Dish>
export type ScrapeWithId = IDRequired<Scrape>

// SECTION 4
// a nice union so we can limit what we accept in our various helpers
export type ModelType =
  | Restaurant
  | Tag
  | RestaurantTag
  | TagTag
  | User
  | Review
  | Dish
  | Scrape

// DONE

// nice names
export type ModelName = GetModelTypeName<ModelType>

// helpers for this file

export type IDRequired<A extends ModelType> = A & { id: string }

type GetModelTypeName<U> = U extends ModelType ? U['__typename'] : never

export type RestaurantTagWithID = Partial<RestaurantTag> &
  Pick<RestaurantTag, 'tag_id'>

type ResolvedArgs<A> = A extends Function
  ? any
  : A extends Object
  ? {
      [K in keyof A]: ResolvedArgs<A[K]>
    }
  : A
type ResolvedModel<O> = {
  [K in keyof O]?: ResolvedArgs<O[K]>
}
