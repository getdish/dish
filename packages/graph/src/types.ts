import {
  menu_item,
  mutation_root,
  photo,
  photo_xref,
  restaurant,
  restaurant_tag,
  review,
  scrape,
  setting,
  tag,
  tag_tag,
  user,
} from './graphql'

// i had this "smarter" where it inferred returns from functions
// but the problme is extensions... they should be excluded
// most of the stuff in this file could be folded into gqless and fixed
export type FlatResolvedModel<O> = {
  [K in keyof O]?: K extends '__typename'
    ? any
    : O[K] extends { __typename: string }
    ? FlatResolvedModel<O[K]>
    : O[K] extends (...args: any[]) => any
    ? any
    : O[K]
}

// BE SURE TO ADD TO ALL SECTIONS!

// SECTION 0
// this fixes our type explosion, i think
// we can use this to represent values returned by `query`

export interface RestaurantQuery extends restaurant {}
export interface TagQuery extends tag {}
export interface RestaurantTagQuery extends restaurant_tag {}
export interface TagTagQuery extends tag_tag {}
export interface UserQuery extends user {}
export interface ReviewQuery extends review {}
export interface MenuItemQuery extends menu_item {}
export interface ScrapeQuery extends scrape {}
export interface SettingQuery extends setting {}
export interface PhotoBaseQuery extends photo {}
export interface PhotoXrefQuery extends photo_xref {}

// SECTION 1
// this flattens them to a partial of all resolved values, minus sub-nodes

export interface Restaurant extends FlatResolvedModel<RestaurantQuery> {}
export interface Tag extends FlatResolvedModel<TagQuery> {}
export interface RestaurantTag extends FlatResolvedModel<RestaurantTagQuery> {}
export interface TagTag extends FlatResolvedModel<TagTagQuery> {}
export interface User extends FlatResolvedModel<UserQuery> {}
export interface Review extends FlatResolvedModel<ReviewQuery> {}
export interface MenuItem extends FlatResolvedModel<MenuItemQuery> {}
export interface Scrape extends FlatResolvedModel<ScrapeQuery> {}
export interface Setting extends FlatResolvedModel<SettingQuery> {}
export interface PhotoBase extends FlatResolvedModel<PhotoBaseQuery> {}
export interface PhotoXref extends FlatResolvedModel<PhotoXrefQuery> {}

// SECTION 3
// this just adds a requirement on the id being present, for things like update()

export interface RestaurantWithId extends WithID<Restaurant> {}
export interface TagWithId extends WithID<Tag> {}
export interface RestaurantTagWithId extends WithID<RestaurantTag> {}
export interface TagTagWithId extends WithID<TagTag> {}
export interface UserWithId extends WithID<User> {}
export interface ReviewWithId extends WithID<Review> {}
export interface MenuItemWithId extends WithID<MenuItem> {}
export interface ScrapeWithId extends WithID<Scrape> {}
export interface SettingWithId extends WithID<Setting> {}

// SECTION 4
// a nice union so we can limit what we accept in our various helpers
export type ModelType =
  | Restaurant
  | Tag
  | RestaurantTag
  | TagTag
  | User
  | Review
  | MenuItem
  | PhotoBase
  | PhotoXref
  | Setting
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

export type NonNullObject<A extends Object> = {
  [K in keyof A]: Exclude<A[K], null>
}
