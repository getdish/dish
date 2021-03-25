import {
  list,
  menu_item,
  photo,
  photo_xref,
  restaurant,
  restaurant_tag,
  review,
  review_tag_sentence,
  setting,
  tag,
  tag_tag,
  user,
} from './graphql'

export type FlatResolvedModel<O> = {
  [K in keyof O]: O[K] extends (args: any) => any
    ? ReturnType<O[K]> extends object
      ? FlatResolvedModel<ReturnType<O[K]>>
      : ReturnType<O[K]>
    : O[K] extends object
    ? FlatResolvedModel<O[K]>
    : O[K]
}

// BE SURE TO ADD TO ALL SECTIONS!

// SECTION 0
// this fixes our type explosion, i think
// we can use this to represent values returned by `query`

export interface ReviewTagSentenceQuery extends review_tag_sentence {}
export interface RestaurantQuery extends restaurant {}
export interface TagQuery extends tag {}
export interface RestaurantTagQuery extends restaurant_tag {}
export interface TagTagQuery extends tag_tag {}
export interface UserQuery extends user {}
export interface ReviewQuery extends review {}
export interface MenuItemQuery extends menu_item {}
export interface SettingQuery extends setting {}
export interface PhotoBaseQuery extends photo {}
export interface PhotoXrefQuery extends photo_xref {}
export interface ListQuery extends list {}

// SECTION 1
// this flattens them to a partial of all resolved values, minus sub-nodes

export type ReviewTagSentence = FlatResolvedModel<review_tag_sentence>
export type Restaurant = FlatResolvedModel<RestaurantQuery>
export type Tag = FlatResolvedModel<TagQuery>
export type RestaurantTag = FlatResolvedModel<RestaurantTagQuery>
export type TagTag = FlatResolvedModel<TagTagQuery>
export type User = FlatResolvedModel<UserQuery>
export type Review = FlatResolvedModel<ReviewQuery>
export type MenuItem = FlatResolvedModel<MenuItemQuery>
export type Setting = FlatResolvedModel<SettingQuery>
export type PhotoBase = FlatResolvedModel<PhotoBaseQuery>
export type PhotoXref = FlatResolvedModel<PhotoXrefQuery>
export type List = FlatResolvedModel<ListQuery>

// SECTION 3
// this just adds a requirement on the id being present, for things like update()

export interface RestaurantWithId extends WithID<Restaurant> {}
export interface TagWithId extends WithID<Tag> {}
export interface RestaurantTagWithId extends WithID<RestaurantTag> {}
export interface TagTagWithId extends WithID<TagTag> {}
export interface UserWithId extends WithID<User> {}
export interface ReviewWithId extends WithID<Review> {}
export interface MenuItemWithId extends WithID<MenuItem> {}
export interface SettingWithId extends WithID<Setting> {}
export interface ListWithId extends WithID<List> {}

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
  | List
  | ReviewTagSentence

// DONE

// nice names
export type ModelName = Exclude<GetModelTypeName<ModelType>, undefined | null>
type GetModelTypeName<U> = U extends ModelType ? U['__typename'] : never

// helpers for this file

export type WithID<A> = A & { id: string }

export type RestaurantTagWithID = Partial<RestaurantTag> & Pick<RestaurantTag, 'tag_id'>

export type NonNullObject<A extends Object> = {
  [K in keyof A]: Exclude<A[K], null>
}

export type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? _DeepPartialArray<U>
  : T extends object
  ? _DeepPartialObject<T>
  : T | undefined

export interface _DeepPartialArray<T> extends Array<DeepPartial<T>> {}
export type _DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> }
