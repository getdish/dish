import {
  EnumType,
  FieldsType,
  FieldsTypeArg,
  ScalarType,
  TypeData,
} from 'gqless'

import * as extensions from '../extensions'

type Extension<TName extends string> = TName extends keyof typeof extensions
  ? typeof extensions[TName]
  : any

/**
 * @name Boolean
 * @type SCALAR
 */
type t_Boolean<T extends boolean = boolean> = ScalarType<
  T,
  Extension<'Boolean'>
>

/**
 * @name Float
 * @type SCALAR
 */
type t_Float<T extends number = number> = ScalarType<T, Extension<'Float'>>

/**
 * @name ID
 * @type SCALAR
 */
type t_ID<T extends string = string> = ScalarType<T, Extension<'ID'>>

/**
 * @name Int
 * @type SCALAR
 */
type t_Int<T extends number = number> = ScalarType<T, Extension<'Int'>>

/**
 * @name Int_comparison_exp
 * @type INPUT_OBJECT
 */
export type Int_comparison_exp = {
  _eq: number | null
  _gt: number | null
  _gte: number | null
  _in: number[] | null
  _is_null: boolean | null
  _lt: number | null
  _lte: number | null
  _neq: number | null
  _nin: number[] | null
}

/**
 * @name String
 * @type SCALAR
 */
type t_String<T extends string = string> = ScalarType<T, Extension<'String'>>

/**
 * @name String_comparison_exp
 * @type INPUT_OBJECT
 */
export type String_comparison_exp = {
  _eq: string | null
  _gt: string | null
  _gte: string | null
  _ilike: string | null
  _in: string[] | null
  _is_null: boolean | null
  _like: string | null
  _lt: string | null
  _lte: string | null
  _neq: string | null
  _nilike: string | null
  _nin: string[] | null
  _nlike: string | null
  _nsimilar: string | null
  _similar: string | null
}

/**
 * @name __Directive
 * @type OBJECT
 */
type t___Directive = FieldsType<
  {
    __typename: t_String<'__Directive'>
    args: t___InputValue[]
    description: t_String | null
    locations: t___DirectiveLocation[]
    name: t_String
  },
  Extension<'__Directive'>
>

/**
 * @name __DirectiveLocation
 * @type ENUM
 */
type t___DirectiveLocation = EnumType<
  | 'ARGUMENT_DEFINITION'
  | 'ENUM'
  | 'ENUM_VALUE'
  | 'FIELD'
  | 'FIELD_DEFINITION'
  | 'FRAGMENT_DEFINITION'
  | 'FRAGMENT_SPREAD'
  | 'INLINE_FRAGMENT'
  | 'INPUT_FIELD_DEFINITION'
  | 'INPUT_OBJECT'
  | 'INTERFACE'
  | 'MUTATION'
  | 'OBJECT'
  | 'QUERY'
  | 'SCALAR'
  | 'SCHEMA'
  | 'SUBSCRIPTION'
  | 'UNION'
>

/**
 * @name __EnumValue
 * @type OBJECT
 */
type t___EnumValue = FieldsType<
  {
    __typename: t_String<'__EnumValue'>
    deprecationReason: t_String | null
    description: t_String | null
    isDeprecated: t_Boolean
    name: t_String
  },
  Extension<'__EnumValue'>
>

/**
 * @name __Field
 * @type OBJECT
 */
type t___Field = FieldsType<
  {
    __typename: t_String<'__Field'>
    args: t___InputValue[]
    deprecationReason: t_String | null
    description: t_String | null
    isDeprecated: t_Boolean
    name: t_String
    type: t___Type
  },
  Extension<'__Field'>
>

/**
 * @name __InputValue
 * @type OBJECT
 */
type t___InputValue = FieldsType<
  {
    __typename: t_String<'__InputValue'>
    defaultValue: t_String | null
    description: t_String | null
    name: t_String
    type: t___Type
  },
  Extension<'__InputValue'>
>

/**
 * @name __Schema
 * @type OBJECT
 */
type t___Schema = FieldsType<
  {
    __typename: t_String<'__Schema'>
    directives: t___Directive[]
    mutationType: t___Type | null
    queryType: t___Type
    subscriptionType: t___Type | null
    types: t___Type[]
  },
  Extension<'__Schema'>
>

/**
 * @name __Type
 * @type OBJECT
 */
type t___Type = FieldsType<
  {
    __typename: t_String<'__Type'>
    description: t_String | null
    enumValues: FieldsTypeArg<
      { includeDeprecated?: boolean | null },
      t___EnumValue[] | null
    >
    fields: FieldsTypeArg<
      { includeDeprecated?: boolean | null },
      t___Field[] | null
    >
    inputFields: t___InputValue[] | null
    interfaces: t___Type[] | null
    kind: t___TypeKind
    name: t_String | null
    ofType: t___Type | null
    possibleTypes: t___Type[] | null
  },
  Extension<'__Type'>
>

/**
 * @name __TypeKind
 * @type ENUM
 */
type t___TypeKind = EnumType<
  | 'ENUM'
  | 'INPUT_OBJECT'
  | 'INTERFACE'
  | 'LIST'
  | 'NON_NULL'
  | 'OBJECT'
  | 'SCALAR'
  | 'UNION'
>

/**
 * @name bigint
 * @type SCALAR
 */
type t_bigint<T extends any = any> = ScalarType<T, Extension<'bigint'>>

/**
 * @name bigint_comparison_exp
 * @type INPUT_OBJECT
 */
export type bigint_comparison_exp = {
  _eq: any | null
  _gt: any | null
  _gte: any | null
  _in: any[] | null
  _is_null: boolean | null
  _lt: any | null
  _lte: any | null
  _neq: any | null
  _nin: any[] | null
}

/**
 * @name dish
 * @type OBJECT
 */
type t_dish = FieldsType<
  {
    __typename: t_String<'dish'>
    description: t_String | null
    id: t_uuid
    image: t_String | null
    name: t_String
    price: t_Int | null

    /**
     * An object relationship
     */
    restaurant: t_restaurant
    restaurant_id: t_uuid

    /**
     * An array relationship
     */
    restaurant_parent: FieldsTypeArg<
      {
        distinct_on?: restaurant_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_order_by[] | null
        where?: restaurant_bool_exp | null
      },
      t_restaurant[]
    >
  },
  Extension<'dish'>
>

/**
 * @name dish_bool_exp
 * @type INPUT_OBJECT
 */
export type dish_bool_exp = {
  _and: (dish_bool_exp | null)[] | null
  _not: dish_bool_exp | null
  _or: (dish_bool_exp | null)[] | null
  description: String_comparison_exp | null
  id: uuid_comparison_exp | null
  image: String_comparison_exp | null
  name: String_comparison_exp | null
  price: Int_comparison_exp | null
  restaurant: restaurant_bool_exp | null
  restaurant_id: uuid_comparison_exp | null
  restaurant_parent: restaurant_bool_exp | null
}

/**
 * @name dish_order_by
 * @type INPUT_OBJECT
 */
export type dish_order_by = {
  description: order_by | null
  id: order_by | null
  image: order_by | null
  name: order_by | null
  price: order_by | null
  restaurant: restaurant_order_by | null
  restaurant_id: order_by | null
}

/**
 * @name dish_select_column
 * @type ENUM
 */
type t_dish_select_column = EnumType<
  'description' | 'id' | 'image' | 'name' | 'price' | 'restaurant_id'
>

/**
 * @name geography
 * @type SCALAR
 */
type t_geography<T extends any = any> = ScalarType<T, Extension<'geography'>>

/**
 * @name geography_cast_exp
 * @type INPUT_OBJECT
 */
export type geography_cast_exp = { geometry: geometry_comparison_exp | null }

/**
 * @name geography_comparison_exp
 * @type INPUT_OBJECT
 */
export type geography_comparison_exp = {
  _cast: geography_cast_exp | null
  _eq: any | null
  _gt: any | null
  _gte: any | null
  _in: any[] | null
  _is_null: boolean | null
  _lt: any | null
  _lte: any | null
  _neq: any | null
  _nin: any[] | null
  _st_d_within: st_d_within_geography_input | null
  _st_intersects: any | null
}

/**
 * @name geometry
 * @type SCALAR
 */
type t_geometry<T extends any = any> = ScalarType<T, Extension<'geometry'>>

/**
 * @name geometry_cast_exp
 * @type INPUT_OBJECT
 */
export type geometry_cast_exp = { geography: geography_comparison_exp | null }

/**
 * @name geometry_comparison_exp
 * @type INPUT_OBJECT
 */
export type geometry_comparison_exp = {
  _cast: geometry_cast_exp | null
  _eq: any | null
  _gt: any | null
  _gte: any | null
  _in: any[] | null
  _is_null: boolean | null
  _lt: any | null
  _lte: any | null
  _neq: any | null
  _nin: any[] | null
  _st_contains: any | null
  _st_crosses: any | null
  _st_d_within: st_d_within_input | null
  _st_equals: any | null
  _st_intersects: any | null
  _st_overlaps: any | null
  _st_touches: any | null
  _st_within: any | null
}

/**
 * @name jsonb
 * @type SCALAR
 */
type t_jsonb<T extends any = any> = ScalarType<T, Extension<'jsonb'>>

/**
 * @name jsonb_comparison_exp
 * @type INPUT_OBJECT
 */
export type jsonb_comparison_exp = {
  _contained_in: any | null
  _contains: any | null
  _eq: any | null
  _gt: any | null
  _gte: any | null
  _has_key: string | null
  _has_keys_all: string[] | null
  _has_keys_any: string[] | null
  _in: any[] | null
  _is_null: boolean | null
  _lt: any | null
  _lte: any | null
  _neq: any | null
  _nin: any[] | null
}

/**
 * @name numeric
 * @type SCALAR
 */
type t_numeric<T extends any = any> = ScalarType<T, Extension<'numeric'>>

/**
 * @name numeric_comparison_exp
 * @type INPUT_OBJECT
 */
export type numeric_comparison_exp = {
  _eq: any | null
  _gt: any | null
  _gte: any | null
  _in: any[] | null
  _is_null: boolean | null
  _lt: any | null
  _lte: any | null
  _neq: any | null
  _nin: any[] | null
}

/**
 * @name order_by
 * @type ENUM
 */
type t_order_by = EnumType<
  | 'asc'
  | 'asc_nulls_first'
  | 'asc_nulls_last'
  | 'desc'
  | 'desc_nulls_first'
  | 'desc_nulls_last'
>

/**
 * @name query_root
 * @type OBJECT
 */
type t_query_root = FieldsType<
  {
    __typename: t_String<'query_root'>

    /**
     * fetch data from the table: "dish"
     */
    dish: FieldsTypeArg<
      {
        distinct_on?: dish_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: dish_order_by[] | null
        where?: dish_bool_exp | null
      },
      t_dish[]
    >

    /**
     * fetch data from the table: "dish" using primary key columns
     */
    dish_by_pk: FieldsTypeArg<{ id: any }, t_dish | null>

    /**
     * fetch data from the table: "restaurant"
     */
    restaurant: FieldsTypeArg<
      {
        distinct_on?: restaurant_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_order_by[] | null
        where?: restaurant_bool_exp | null
      },
      t_restaurant[]
    >

    /**
     * fetch data from the table: "restaurant" using primary key columns
     */
    restaurant_by_pk: FieldsTypeArg<{ id: any }, t_restaurant | null>

    /**
     * fetch data from the table: "restaurant_taxonomy"
     */
    restaurant_taxonomy: FieldsTypeArg<
      {
        distinct_on?: restaurant_taxonomy_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_taxonomy_order_by[] | null
        where?: restaurant_taxonomy_bool_exp | null
      },
      t_restaurant_taxonomy[]
    >

    /**
     * fetch data from the table: "restaurant_taxonomy" using primary key columns
     */
    restaurant_taxonomy_by_pk: FieldsTypeArg<
      { restaurant_id: any; taxonomy_id: any },
      t_restaurant_taxonomy | null
    >

    /**
     * fetch data from the table: "review"
     */
    review: FieldsTypeArg<
      {
        distinct_on?: review_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_order_by[] | null
        where?: review_bool_exp | null
      },
      t_review[]
    >

    /**
     * fetch data from the table: "review" using primary key columns
     */
    review_by_pk: FieldsTypeArg<{ id: any }, t_review | null>

    /**
     * fetch data from the table: "taxonomy"
     */
    taxonomy: FieldsTypeArg<
      {
        distinct_on?: taxonomy_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: taxonomy_order_by[] | null
        where?: taxonomy_bool_exp | null
      },
      t_taxonomy[]
    >

    /**
     * fetch data from the table: "taxonomy" using primary key columns
     */
    taxonomy_by_pk: FieldsTypeArg<{ id: any }, t_taxonomy | null>

    /**
     * execute function "top_dishes" which returns "top_dishes_results"
     */
    top_dishes: FieldsTypeArg<
      {
        args: top_dishes_args
        distinct_on?: top_dishes_results_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: top_dishes_results_order_by[] | null
        where?: top_dishes_results_bool_exp | null
      },
      t_top_dishes_results[]
    >

    /**
     * fetch data from the table: "top_dishes_results"
     */
    top_dishes_results: FieldsTypeArg<
      {
        distinct_on?: top_dishes_results_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: top_dishes_results_order_by[] | null
        where?: top_dishes_results_bool_exp | null
      },
      t_top_dishes_results[]
    >

    /**
     * fetch data from the table: "user"
     */
    user: FieldsTypeArg<
      {
        distinct_on?: user_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: user_order_by[] | null
        where?: user_bool_exp | null
      },
      t_user[]
    >

    /**
     * fetch data from the table: "user" using primary key columns
     */
    user_by_pk: FieldsTypeArg<{ id: any }, t_user | null>
  },
  Extension<'query_root'>
>

/**
 * @name restaurant
 * @type OBJECT
 */
type t_restaurant = FieldsType<
  {
    __typename: t_String<'restaurant'>
    address: t_String | null
    city: t_String | null
    description: t_String | null

    /**
     * An array relationship
     */
    dishes: FieldsTypeArg<
      {
        distinct_on?: dish_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: dish_order_by[] | null
        where?: dish_bool_exp | null
      },
      t_dish[]
    >
    hours: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    id: t_uuid
    image: t_String | null

    /**
     * A computed field, executes function "is_restaurant_open"
     */
    is_open_now: t_Boolean | null
    location: t_geometry
    name: t_String
    photos: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    price_range: t_String | null
    rating: t_numeric | null

    /**
     * An array relationship
     */
    reviews: FieldsTypeArg<
      {
        distinct_on?: review_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_order_by[] | null
        where?: review_bool_exp | null
      },
      t_review[]
    >
    slug: t_String
    sources: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    state: t_String | null
    tag_rankings: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>

    /**
     * An array relationship
     */
    tags: FieldsTypeArg<
      {
        distinct_on?: restaurant_taxonomy_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_taxonomy_order_by[] | null
        where?: restaurant_taxonomy_bool_exp | null
      },
      t_restaurant_taxonomy[]
    >
    telephone: t_String | null
    website: t_String | null
    zip: t_numeric | null
  },
  Extension<'restaurant'>
>

/**
 * @name restaurant_bool_exp
 * @type INPUT_OBJECT
 */
export type restaurant_bool_exp = {
  _and: (restaurant_bool_exp | null)[] | null
  _not: restaurant_bool_exp | null
  _or: (restaurant_bool_exp | null)[] | null
  address: String_comparison_exp | null
  city: String_comparison_exp | null
  description: String_comparison_exp | null
  dishes: dish_bool_exp | null
  hours: jsonb_comparison_exp | null
  id: uuid_comparison_exp | null
  image: String_comparison_exp | null
  location: geometry_comparison_exp | null
  name: String_comparison_exp | null
  photos: jsonb_comparison_exp | null
  price_range: String_comparison_exp | null
  rating: numeric_comparison_exp | null
  reviews: review_bool_exp | null
  slug: String_comparison_exp | null
  sources: jsonb_comparison_exp | null
  state: String_comparison_exp | null
  tag_rankings: jsonb_comparison_exp | null
  tags: restaurant_taxonomy_bool_exp | null
  telephone: String_comparison_exp | null
  website: String_comparison_exp | null
  zip: numeric_comparison_exp | null
}

/**
 * @name restaurant_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_order_by = {
  address: order_by | null
  city: order_by | null
  description: order_by | null
  hours: order_by | null
  id: order_by | null
  image: order_by | null
  location: order_by | null
  name: order_by | null
  photos: order_by | null
  price_range: order_by | null
  rating: order_by | null
  slug: order_by | null
  sources: order_by | null
  state: order_by | null
  tag_rankings: order_by | null
  telephone: order_by | null
  website: order_by | null
  zip: order_by | null
}

/**
 * @name restaurant_select_column
 * @type ENUM
 */
type t_restaurant_select_column = EnumType<
  | 'address'
  | 'city'
  | 'description'
  | 'hours'
  | 'id'
  | 'image'
  | 'location'
  | 'name'
  | 'photos'
  | 'price_range'
  | 'rating'
  | 'slug'
  | 'sources'
  | 'state'
  | 'tag_rankings'
  | 'telephone'
  | 'website'
  | 'zip'
>

/**
 * @name restaurant_taxonomy
 * @type OBJECT
 */
type t_restaurant_taxonomy = FieldsType<
  {
    __typename: t_String<'restaurant_taxonomy'>

    /**
     * An object relationship
     */
    restaurant: t_restaurant
    restaurant_id: t_uuid

    /**
     * An object relationship
     */
    taxonomy: t_taxonomy
    taxonomy_id: t_uuid
  },
  Extension<'restaurant_taxonomy'>
>

/**
 * @name restaurant_taxonomy_bool_exp
 * @type INPUT_OBJECT
 */
export type restaurant_taxonomy_bool_exp = {
  _and: (restaurant_taxonomy_bool_exp | null)[] | null
  _not: restaurant_taxonomy_bool_exp | null
  _or: (restaurant_taxonomy_bool_exp | null)[] | null
  restaurant: restaurant_bool_exp | null
  restaurant_id: uuid_comparison_exp | null
  taxonomy: taxonomy_bool_exp | null
  taxonomy_id: uuid_comparison_exp | null
}

/**
 * @name restaurant_taxonomy_order_by
 * @type INPUT_OBJECT
 */
export type restaurant_taxonomy_order_by = {
  restaurant: restaurant_order_by | null
  restaurant_id: order_by | null
  taxonomy: taxonomy_order_by | null
  taxonomy_id: order_by | null
}

/**
 * @name restaurant_taxonomy_select_column
 * @type ENUM
 */
type t_restaurant_taxonomy_select_column = EnumType<
  'restaurant_id' | 'taxonomy_id'
>

/**
 * @name review
 * @type OBJECT
 */
type t_review = FieldsType<
  {
    __typename: t_String<'review'>
    categories: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    created_at: t_timestamptz
    id: t_uuid
    rating: t_numeric

    /**
     * An object relationship
     */
    restaurant: t_restaurant
    restaurant_id: t_uuid
    text: t_String | null
    updated_at: t_timestamptz

    /**
     * An object relationship
     */
    user: t_user
    user_id: t_uuid
  },
  Extension<'review'>
>

/**
 * @name review_bool_exp
 * @type INPUT_OBJECT
 */
export type review_bool_exp = {
  _and: (review_bool_exp | null)[] | null
  _not: review_bool_exp | null
  _or: (review_bool_exp | null)[] | null
  categories: jsonb_comparison_exp | null
  created_at: timestamptz_comparison_exp | null
  id: uuid_comparison_exp | null
  rating: numeric_comparison_exp | null
  restaurant: restaurant_bool_exp | null
  restaurant_id: uuid_comparison_exp | null
  text: String_comparison_exp | null
  updated_at: timestamptz_comparison_exp | null
  user: user_bool_exp | null
  user_id: uuid_comparison_exp | null
}

/**
 * @name review_order_by
 * @type INPUT_OBJECT
 */
export type review_order_by = {
  categories: order_by | null
  created_at: order_by | null
  id: order_by | null
  rating: order_by | null
  restaurant: restaurant_order_by | null
  restaurant_id: order_by | null
  text: order_by | null
  updated_at: order_by | null
  user: user_order_by | null
  user_id: order_by | null
}

/**
 * @name review_select_column
 * @type ENUM
 */
type t_review_select_column = EnumType<
  | 'categories'
  | 'created_at'
  | 'id'
  | 'rating'
  | 'restaurant_id'
  | 'text'
  | 'updated_at'
  | 'user_id'
>

/**
 * @name st_d_within_geography_input
 * @type INPUT_OBJECT
 */
export type st_d_within_geography_input = {
  distance: number
  from: any
  use_spheroid: boolean | null
}

/**
 * @name st_d_within_input
 * @type INPUT_OBJECT
 */
export type st_d_within_input = { distance: number; from: any }

/**
 * @name subscription_root
 * @type OBJECT
 */
type t_subscription_root = FieldsType<
  {
    __typename: t_String<'subscription_root'>

    /**
     * fetch data from the table: "dish"
     */
    dish: FieldsTypeArg<
      {
        distinct_on?: dish_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: dish_order_by[] | null
        where?: dish_bool_exp | null
      },
      t_dish[]
    >

    /**
     * fetch data from the table: "dish" using primary key columns
     */
    dish_by_pk: FieldsTypeArg<{ id: any }, t_dish | null>

    /**
     * fetch data from the table: "restaurant"
     */
    restaurant: FieldsTypeArg<
      {
        distinct_on?: restaurant_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_order_by[] | null
        where?: restaurant_bool_exp | null
      },
      t_restaurant[]
    >

    /**
     * fetch data from the table: "restaurant" using primary key columns
     */
    restaurant_by_pk: FieldsTypeArg<{ id: any }, t_restaurant | null>

    /**
     * fetch data from the table: "restaurant_taxonomy"
     */
    restaurant_taxonomy: FieldsTypeArg<
      {
        distinct_on?: restaurant_taxonomy_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_taxonomy_order_by[] | null
        where?: restaurant_taxonomy_bool_exp | null
      },
      t_restaurant_taxonomy[]
    >

    /**
     * fetch data from the table: "restaurant_taxonomy" using primary key columns
     */
    restaurant_taxonomy_by_pk: FieldsTypeArg<
      { restaurant_id: any; taxonomy_id: any },
      t_restaurant_taxonomy | null
    >

    /**
     * fetch data from the table: "review"
     */
    review: FieldsTypeArg<
      {
        distinct_on?: review_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_order_by[] | null
        where?: review_bool_exp | null
      },
      t_review[]
    >

    /**
     * fetch data from the table: "review" using primary key columns
     */
    review_by_pk: FieldsTypeArg<{ id: any }, t_review | null>

    /**
     * fetch data from the table: "taxonomy"
     */
    taxonomy: FieldsTypeArg<
      {
        distinct_on?: taxonomy_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: taxonomy_order_by[] | null
        where?: taxonomy_bool_exp | null
      },
      t_taxonomy[]
    >

    /**
     * fetch data from the table: "taxonomy" using primary key columns
     */
    taxonomy_by_pk: FieldsTypeArg<{ id: any }, t_taxonomy | null>

    /**
     * execute function "top_dishes" which returns "top_dishes_results"
     */
    top_dishes: FieldsTypeArg<
      {
        args: top_dishes_args
        distinct_on?: top_dishes_results_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: top_dishes_results_order_by[] | null
        where?: top_dishes_results_bool_exp | null
      },
      t_top_dishes_results[]
    >

    /**
     * fetch data from the table: "top_dishes_results"
     */
    top_dishes_results: FieldsTypeArg<
      {
        distinct_on?: top_dishes_results_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: top_dishes_results_order_by[] | null
        where?: top_dishes_results_bool_exp | null
      },
      t_top_dishes_results[]
    >

    /**
     * fetch data from the table: "user"
     */
    user: FieldsTypeArg<
      {
        distinct_on?: user_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: user_order_by[] | null
        where?: user_bool_exp | null
      },
      t_user[]
    >

    /**
     * fetch data from the table: "user" using primary key columns
     */
    user_by_pk: FieldsTypeArg<{ id: any }, t_user | null>
  },
  Extension<'subscription_root'>
>

/**
 * @name taxonomy
 * @type OBJECT
 */
type t_taxonomy = FieldsType<
  {
    __typename: t_String<'taxonomy'>
    alternates: FieldsTypeArg<{ path?: string | null }, t_jsonb | null>
    created_at: t_timestamptz
    icon: t_String | null
    id: t_uuid
    name: t_String
    order: t_Int
    parentId: t_uuid | null
    parentType: t_String | null

    /**
     * An array relationship
     */
    restaurant_taxonomies: FieldsTypeArg<
      {
        distinct_on?: restaurant_taxonomy_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: restaurant_taxonomy_order_by[] | null
        where?: restaurant_taxonomy_bool_exp | null
      },
      t_restaurant_taxonomy[]
    >
    type: t_String | null
    updated_at: t_timestamptz
  },
  Extension<'taxonomy'>
>

/**
 * @name taxonomy_bool_exp
 * @type INPUT_OBJECT
 */
export type taxonomy_bool_exp = {
  _and: (taxonomy_bool_exp | null)[] | null
  _not: taxonomy_bool_exp | null
  _or: (taxonomy_bool_exp | null)[] | null
  alternates: jsonb_comparison_exp | null
  created_at: timestamptz_comparison_exp | null
  icon: String_comparison_exp | null
  id: uuid_comparison_exp | null
  name: String_comparison_exp | null
  order: Int_comparison_exp | null
  parentId: uuid_comparison_exp | null
  parentType: String_comparison_exp | null
  restaurant_taxonomies: restaurant_taxonomy_bool_exp | null
  type: String_comparison_exp | null
  updated_at: timestamptz_comparison_exp | null
}

/**
 * @name taxonomy_order_by
 * @type INPUT_OBJECT
 */
export type taxonomy_order_by = {
  alternates: order_by | null
  created_at: order_by | null
  icon: order_by | null
  id: order_by | null
  name: order_by | null
  order: order_by | null
  parentId: order_by | null
  parentType: order_by | null
  type: order_by | null
  updated_at: order_by | null
}

/**
 * @name taxonomy_select_column
 * @type ENUM
 */
type t_taxonomy_select_column = EnumType<
  | 'alternates'
  | 'created_at'
  | 'icon'
  | 'id'
  | 'name'
  | 'order'
  | 'parentId'
  | 'parentType'
  | 'type'
  | 'updated_at'
>

/**
 * @name timestamptz
 * @type SCALAR
 */
type t_timestamptz<T extends any = any> = ScalarType<
  T,
  Extension<'timestamptz'>
>

/**
 * @name timestamptz_comparison_exp
 * @type INPUT_OBJECT
 */
export type timestamptz_comparison_exp = {
  _eq: any | null
  _gt: any | null
  _gte: any | null
  _in: any[] | null
  _is_null: boolean | null
  _lt: any | null
  _lte: any | null
  _neq: any | null
  _nin: any[] | null
}

/**
 * @name top_dishes_args
 * @type INPUT_OBJECT
 */
export type top_dishes_args = {
  lat: any | null
  lon: any | null
  radius: any | null
}

/**
 * @name top_dishes_results
 * @type OBJECT
 */
type t_top_dishes_results = FieldsType<
  {
    __typename: t_String<'top_dishes_results'>
    dish: t_String | null
    frequency: t_bigint | null
  },
  Extension<'top_dishes_results'>
>

/**
 * @name top_dishes_results_bool_exp
 * @type INPUT_OBJECT
 */
export type top_dishes_results_bool_exp = {
  _and: (top_dishes_results_bool_exp | null)[] | null
  _not: top_dishes_results_bool_exp | null
  _or: (top_dishes_results_bool_exp | null)[] | null
  dish: String_comparison_exp | null
  frequency: bigint_comparison_exp | null
}

/**
 * @name top_dishes_results_order_by
 * @type INPUT_OBJECT
 */
export type top_dishes_results_order_by = {
  dish: order_by | null
  frequency: order_by | null
}

/**
 * @name top_dishes_results_select_column
 * @type ENUM
 */
type t_top_dishes_results_select_column = EnumType<'dish' | 'frequency'>

/**
 * @name user
 * @type OBJECT
 */
type t_user = FieldsType<
  {
    __typename: t_String<'user'>
    created_at: t_timestamptz
    id: t_uuid

    /**
     * An array relationship
     */
    reviews: FieldsTypeArg<
      {
        distinct_on?: review_select_column[] | null
        limit?: number | null
        offset?: number | null
        order_by?: review_order_by[] | null
        where?: review_bool_exp | null
      },
      t_review[]
    >
    role: t_String | null
    updated_at: t_timestamptz
    username: t_String
  },
  Extension<'user'>
>

/**
 * @name user_bool_exp
 * @type INPUT_OBJECT
 */
export type user_bool_exp = {
  _and: (user_bool_exp | null)[] | null
  _not: user_bool_exp | null
  _or: (user_bool_exp | null)[] | null
  created_at: timestamptz_comparison_exp | null
  id: uuid_comparison_exp | null
  reviews: review_bool_exp | null
  role: String_comparison_exp | null
  updated_at: timestamptz_comparison_exp | null
  username: String_comparison_exp | null
}

/**
 * @name user_order_by
 * @type INPUT_OBJECT
 */
export type user_order_by = {
  created_at: order_by | null
  id: order_by | null
  role: order_by | null
  updated_at: order_by | null
  username: order_by | null
}

/**
 * @name user_select_column
 * @type ENUM
 */
type t_user_select_column = EnumType<
  'created_at' | 'id' | 'role' | 'updated_at' | 'username'
>

/**
 * @name uuid
 * @type SCALAR
 */
type t_uuid<T extends any = any> = ScalarType<T, Extension<'uuid'>>

/**
 * @name uuid_comparison_exp
 * @type INPUT_OBJECT
 */
export type uuid_comparison_exp = {
  _eq: any | null
  _gt: any | null
  _gte: any | null
  _in: any[] | null
  _is_null: boolean | null
  _lt: any | null
  _lte: any | null
  _neq: any | null
  _nin: any[] | null
}

/**
 * @name Boolean
 * @type SCALAR
 */
export type Boolean = TypeData<t_Boolean>

/**
 * @name Float
 * @type SCALAR
 */
export type Float = TypeData<t_Float>

/**
 * @name ID
 * @type SCALAR
 */
export type ID = TypeData<t_ID>

/**
 * @name Int
 * @type SCALAR
 */
export type Int = TypeData<t_Int>

/**
 * @name String
 * @type SCALAR
 */
export type String = TypeData<t_String>

/**
 * @name __Directive
 * @type OBJECT
 */
export type __Directive = TypeData<t___Directive>

/**
 * @name __DirectiveLocation
 * @type ENUM
 */
export type __DirectiveLocation = TypeData<t___DirectiveLocation>

/**
 * @name __EnumValue
 * @type OBJECT
 */
export type __EnumValue = TypeData<t___EnumValue>

/**
 * @name __Field
 * @type OBJECT
 */
export type __Field = TypeData<t___Field>

/**
 * @name __InputValue
 * @type OBJECT
 */
export type __InputValue = TypeData<t___InputValue>

/**
 * @name __Schema
 * @type OBJECT
 */
export type __Schema = TypeData<t___Schema>

/**
 * @name __Type
 * @type OBJECT
 */
export type __Type = TypeData<t___Type>

/**
 * @name __TypeKind
 * @type ENUM
 */
export type __TypeKind = TypeData<t___TypeKind>

/**
 * @name bigint
 * @type SCALAR
 */
//export type bigint = TypeData<t_bigint>

/**
 * @name dish
 * @type OBJECT
 */
export type dish = TypeData<t_dish>

/**
 * @name dish_select_column
 * @type ENUM
 */
export type dish_select_column = TypeData<t_dish_select_column>

/**
 * @name geography
 * @type SCALAR
 */
export type geography = TypeData<t_geography>

/**
 * @name geometry
 * @type SCALAR
 */
export type geometry = TypeData<t_geometry>

/**
 * @name jsonb
 * @type SCALAR
 */
export type jsonb = TypeData<t_jsonb>

/**
 * @name numeric
 * @type SCALAR
 */
export type numeric = TypeData<t_numeric>

/**
 * @name order_by
 * @type ENUM
 */
export type order_by = TypeData<t_order_by>

/**
 * @name query_root
 * @type OBJECT
 */
export type query_root = TypeData<t_query_root>

/**
 * @name restaurant
 * @type OBJECT
 */
export type restaurant = TypeData<t_restaurant>

/**
 * @name restaurant_select_column
 * @type ENUM
 */
export type restaurant_select_column = TypeData<t_restaurant_select_column>

/**
 * @name restaurant_taxonomy
 * @type OBJECT
 */
export type restaurant_taxonomy = TypeData<t_restaurant_taxonomy>

/**
 * @name restaurant_taxonomy_select_column
 * @type ENUM
 */
export type restaurant_taxonomy_select_column = TypeData<
  t_restaurant_taxonomy_select_column
>

/**
 * @name review
 * @type OBJECT
 */
export type review = TypeData<t_review>

/**
 * @name review_select_column
 * @type ENUM
 */
export type review_select_column = TypeData<t_review_select_column>

/**
 * @name subscription_root
 * @type OBJECT
 */
export type subscription_root = TypeData<t_subscription_root>

/**
 * @name taxonomy
 * @type OBJECT
 */
export type taxonomy = TypeData<t_taxonomy>

/**
 * @name taxonomy_select_column
 * @type ENUM
 */
export type taxonomy_select_column = TypeData<t_taxonomy_select_column>

/**
 * @name timestamptz
 * @type SCALAR
 */
export type timestamptz = TypeData<t_timestamptz>

/**
 * @name top_dishes_results
 * @type OBJECT
 */
export type top_dishes_results = TypeData<t_top_dishes_results>

/**
 * @name top_dishes_results_select_column
 * @type ENUM
 */
export type top_dishes_results_select_column = TypeData<
  t_top_dishes_results_select_column
>

/**
 * @name user
 * @type OBJECT
 */
export type user = TypeData<t_user>

/**
 * @name user_select_column
 * @type ENUM
 */
export type user_select_column = TypeData<t_user_select_column>

/**
 * @name uuid
 * @type SCALAR
 */
export type uuid = TypeData<t_uuid>
