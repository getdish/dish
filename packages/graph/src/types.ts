import { FieldsTypeArg, Type } from 'gqless'

import {
  mutation_root,
  query,
  t_dish,
  t_restaurant,
  t_restaurant_tag,
  t_review,
  t_scrape,
  t_tag,
  t_tag_tag,
  t_user,
} from './graphql'

type InferType<A> = A extends Array<infer X>
  ? Array<ResolvedModel<InferType<X>>>
  : A extends Type<any, infer B>
  ? B
  : A
export type ResolvedArgs<A> = A extends FieldsTypeArg<any, infer B>
  ? InferType<B>
  : InferType<A>
export type ResolvedModel<O> = {
  [K in keyof O]?: Exclude<ResolvedArgs<O[K]>, null>
}

type x = t_restaurant['data'][]

query.restaurant({})[0].photos

// BE SURE TO ADD TO ALL SECTIONS!

// SECTION 0
// this fixes our type explosion, i think

export interface RestaurantBase extends t_restaurant {}
export interface TagBase extends t_tag {}
export interface RestaurantTagBase extends t_restaurant_tag {}
export interface TagTagBase extends t_tag_tag {}
export interface UserBase extends t_user {}
export interface ReviewBase extends t_review {}
export interface DishBase extends t_dish {}
export interface ScrapeBase extends t_scrape {}

// SECTION 1
// using interfaces here *fixes* all our speed issues with typescript!

export interface Restaurant extends ResolvedModel<RestaurantBase['data']> {}
export interface Tag extends ResolvedModel<TagBase['data']> {}
export interface RestaurantTag
  extends ResolvedModel<RestaurantTagBase['data']> {}
export interface TagTag extends ResolvedModel<TagTagBase['data']> {}
export interface User extends ResolvedModel<UserBase['data']> {}
export interface Review extends ResolvedModel<ReviewBase['data']> {}
export interface Dish extends ResolvedModel<DishBase['data']> {}
export interface Scrape extends ResolvedModel<ScrapeBase['data']> {}

// SECTION 3
// this just adds a requirement on the id being present, for things like update()
export interface RestaurantWithId extends WithID<Restaurant> {}
export interface TagWithId extends WithID<Tag> {}
export interface RestaurantTagWithId extends WithID<RestaurantTag> {}
export interface TagTagWithId extends WithID<TagTag> {}
export interface UserWithId extends WithID<User> {}
export interface ReviewWithId extends WithID<Review> {}
export interface DishWithId extends WithID<Dish> {}
export interface ScrapeWithId extends WithID<Scrape> {}

type a = Restaurant['photos']
type b = Restaurant['name']

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
export type ModelName = Exclude<GetModelTypeName<ModelType>, undefined>
type GetModelTypeName<U> = U extends ModelType ? U['__typename'] : never

// mutation
interface MutationFull extends mutation_root {}
export type Mutation = Omit<MutationFull, '__typename'>

// helpers for this file

export type WithID<A> = A & { id: string }

export type RestaurantTagWithID = Partial<RestaurantTag> &
  Pick<RestaurantTag, 'tag_id'>

type JSONBType = any
