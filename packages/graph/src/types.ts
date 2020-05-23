import { ArgsFn } from 'gqless'

import {
  dish,
  mutation_root,
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
export type RestaurantWithId = WithID<Restaurant>
export type TagWithId = WithID<Tag>
export type RestaurantTagWithId = WithID<RestaurantTag>
export type TagTagWithId = WithID<TagTag>
export type UserWithId = WithID<User>
export type ReviewWithId = WithID<Review>
export type DishWithId = WithID<Dish>
export type ScrapeWithId = WithID<Scrape>

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

// mutation
interface MutationFull extends mutation_root {}
export type Mutation = Omit<MutationFull, '__typename'>

// helpers for this file

export type WithID<A extends ModelType> = A & { id: string }

type GetModelTypeName<U> = U extends ModelType ? U['__typename'] : never

export type RestaurantTagWithID = Partial<RestaurantTag> &
  Pick<RestaurantTag, 'tag_id'>

export type ResolvedArgs<A> = A extends Function ? Exclude<any, Function> : A
export type ResolvedModel<O> = {
  [K in keyof O]?: ResolvedArgs<O[K]>
}
