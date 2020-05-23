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

export type FlatResolvedModel<O> = {
  [K in keyof O]?: O[K] extends (...args: any[]) => infer X
    ? X | undefined
    : O[K]
}

// BE SURE TO ADD TO ALL SECTIONS!

// SECTION 0
// this fixes our type explosion, i think

export interface RestaurantBase extends restaurant {}
export interface TagBase extends tag {}
export interface RestaurantTagBase extends restaurant_tag {}
export interface TagTagBase extends tag_tag {}
export interface UserBase extends user {}
export interface ReviewBase extends review {}
export interface DishBase extends dish {}
export interface ScrapeBase extends scrape {}

// SECTION 1

export interface Restaurant extends FlatResolvedModel<RestaurantBase> {}
export interface Tag extends FlatResolvedModel<TagBase> {}
export interface RestaurantTag extends FlatResolvedModel<RestaurantTagBase> {}
export interface TagTag extends FlatResolvedModel<TagTagBase> {}
export interface User extends FlatResolvedModel<UserBase> {}
export interface Review extends FlatResolvedModel<ReviewBase> {}
export interface Dish extends FlatResolvedModel<DishBase> {}
export interface Scrape extends FlatResolvedModel<ScrapeBase> {}

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
