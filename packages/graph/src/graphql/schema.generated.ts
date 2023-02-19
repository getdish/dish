/**
 * GQTY AUTO-GENERATED CODE: PLEASE DO NOT MODIFY MANUALLY
 */

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  geography: any
  geometry: any
  jsonb: any
  numeric: any
  restaurant_scalar: any
  timestamptz: any
  tsrange: any
  uuid: any
}

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export interface Boolean_comparison_exp {
  _eq?: InputMaybe<Scalars['Boolean']>
  _gt?: InputMaybe<Scalars['Boolean']>
  _gte?: InputMaybe<Scalars['Boolean']>
  _in?: InputMaybe<Array<Scalars['Boolean']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _lt?: InputMaybe<Scalars['Boolean']>
  _lte?: InputMaybe<Scalars['Boolean']>
  _neq?: InputMaybe<Scalars['Boolean']>
  _nin?: InputMaybe<Array<Scalars['Boolean']>>
}

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export interface Int_comparison_exp {
  _eq?: InputMaybe<Scalars['Int']>
  _gt?: InputMaybe<Scalars['Int']>
  _gte?: InputMaybe<Scalars['Int']>
  _in?: InputMaybe<Array<Scalars['Int']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _lt?: InputMaybe<Scalars['Int']>
  _lte?: InputMaybe<Scalars['Int']>
  _neq?: InputMaybe<Scalars['Int']>
  _nin?: InputMaybe<Array<Scalars['Int']>>
}

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export interface String_comparison_exp {
  _eq?: InputMaybe<Scalars['String']>
  _gt?: InputMaybe<Scalars['String']>
  _gte?: InputMaybe<Scalars['String']>
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>
  _in?: InputMaybe<Array<Scalars['String']>>
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>
  _is_null?: InputMaybe<Scalars['Boolean']>
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>
  _lt?: InputMaybe<Scalars['String']>
  _lte?: InputMaybe<Scalars['String']>
  _neq?: InputMaybe<Scalars['String']>
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>
  _nin?: InputMaybe<Array<Scalars['String']>>
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>
}

/** Boolean expression to filter rows from the table "boundaries_city". All fields are combined with a logical 'AND'. */
export interface boundaries_city_bool_exp {
  _and?: InputMaybe<Array<boundaries_city_bool_exp>>
  _not?: InputMaybe<boundaries_city_bool_exp>
  _or?: InputMaybe<Array<boundaries_city_bool_exp>>
  name?: InputMaybe<String_comparison_exp>
  ogc_fid?: InputMaybe<Int_comparison_exp>
  wkb_geometry?: InputMaybe<geometry_comparison_exp>
}

/** unique or primary key constraints on table "boundaries_city" */
export enum boundaries_city_constraint {
  /** unique or primary key constraint on columns "ogc_fid" */
  boundaries_city_pkey = 'boundaries_city_pkey',
}

/** input type for incrementing numeric columns in table "boundaries_city" */
export interface boundaries_city_inc_input {
  ogc_fid?: InputMaybe<Scalars['Int']>
}

/** input type for inserting data into table "boundaries_city" */
export interface boundaries_city_insert_input {
  name?: InputMaybe<Scalars['String']>
  ogc_fid?: InputMaybe<Scalars['Int']>
  wkb_geometry?: InputMaybe<Scalars['geometry']>
}

/** on_conflict condition type for table "boundaries_city" */
export interface boundaries_city_on_conflict {
  constraint: boundaries_city_constraint
  update_columns?: Array<boundaries_city_update_column>
  where?: InputMaybe<boundaries_city_bool_exp>
}

/** Ordering options when selecting data from "boundaries_city". */
export interface boundaries_city_order_by {
  name?: InputMaybe<order_by>
  ogc_fid?: InputMaybe<order_by>
  wkb_geometry?: InputMaybe<order_by>
}

/** primary key columns input for table: boundaries_city */
export interface boundaries_city_pk_columns_input {
  ogc_fid: Scalars['Int']
}

/** select columns of table "boundaries_city" */
export enum boundaries_city_select_column {
  /** column name */
  name = 'name',
  /** column name */
  ogc_fid = 'ogc_fid',
  /** column name */
  wkb_geometry = 'wkb_geometry',
}

/** input type for updating data in table "boundaries_city" */
export interface boundaries_city_set_input {
  name?: InputMaybe<Scalars['String']>
  ogc_fid?: InputMaybe<Scalars['Int']>
  wkb_geometry?: InputMaybe<Scalars['geometry']>
}

/** Streaming cursor of the table "boundaries_city" */
export interface boundaries_city_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: boundaries_city_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface boundaries_city_stream_cursor_value_input {
  name?: InputMaybe<Scalars['String']>
  ogc_fid?: InputMaybe<Scalars['Int']>
  wkb_geometry?: InputMaybe<Scalars['geometry']>
}

/** update columns of table "boundaries_city" */
export enum boundaries_city_update_column {
  /** column name */
  name = 'name',
  /** column name */
  ogc_fid = 'ogc_fid',
  /** column name */
  wkb_geometry = 'wkb_geometry',
}

export interface boundaries_city_updates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<boundaries_city_inc_input>
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<boundaries_city_set_input>
  where: boundaries_city_bool_exp
}

/** ordering argument of a cursor */
export enum cursor_ordering {
  /** ascending ordering of the cursor */
  ASC = 'ASC',
  /** descending ordering of the cursor */
  DESC = 'DESC',
}

export interface follow_aggregate_bool_exp {
  count?: InputMaybe<follow_aggregate_bool_exp_count>
}

export interface follow_aggregate_bool_exp_count {
  arguments?: InputMaybe<Array<follow_select_column>>
  distinct?: InputMaybe<Scalars['Boolean']>
  filter?: InputMaybe<follow_bool_exp>
  predicate: Int_comparison_exp
}

/** order by aggregate values of table "follow" */
export interface follow_aggregate_order_by {
  count?: InputMaybe<order_by>
  max?: InputMaybe<follow_max_order_by>
  min?: InputMaybe<follow_min_order_by>
}

/** input type for inserting array relation for remote table "follow" */
export interface follow_arr_rel_insert_input {
  data: Array<follow_insert_input>
  /** upsert condition */
  on_conflict?: InputMaybe<follow_on_conflict>
}

/** Boolean expression to filter rows from the table "follow". All fields are combined with a logical 'AND'. */
export interface follow_bool_exp {
  _and?: InputMaybe<Array<follow_bool_exp>>
  _not?: InputMaybe<follow_bool_exp>
  _or?: InputMaybe<Array<follow_bool_exp>>
  follower_id?: InputMaybe<uuid_comparison_exp>
  following_id?: InputMaybe<uuid_comparison_exp>
  id?: InputMaybe<uuid_comparison_exp>
  user?: InputMaybe<user_bool_exp>
}

/** unique or primary key constraints on table "follow" */
export enum follow_constraint {
  /** unique or primary key constraint on columns "following_id", "follower_id" */
  follow_follower_id_following_id_key = 'follow_follower_id_following_id_key',
  /** unique or primary key constraint on columns "id" */
  follow_pkey = 'follow_pkey',
}

/** input type for inserting data into table "follow" */
export interface follow_insert_input {
  follower_id?: InputMaybe<Scalars['uuid']>
  following_id?: InputMaybe<Scalars['uuid']>
  id?: InputMaybe<Scalars['uuid']>
  user?: InputMaybe<user_obj_rel_insert_input>
}

/** order by max() on columns of table "follow" */
export interface follow_max_order_by {
  follower_id?: InputMaybe<order_by>
  following_id?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
}

/** order by min() on columns of table "follow" */
export interface follow_min_order_by {
  follower_id?: InputMaybe<order_by>
  following_id?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
}

/** on_conflict condition type for table "follow" */
export interface follow_on_conflict {
  constraint: follow_constraint
  update_columns?: Array<follow_update_column>
  where?: InputMaybe<follow_bool_exp>
}

/** Ordering options when selecting data from "follow". */
export interface follow_order_by {
  follower_id?: InputMaybe<order_by>
  following_id?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  user?: InputMaybe<user_order_by>
}

/** primary key columns input for table: follow */
export interface follow_pk_columns_input {
  id: Scalars['uuid']
}

/** select columns of table "follow" */
export enum follow_select_column {
  /** column name */
  follower_id = 'follower_id',
  /** column name */
  following_id = 'following_id',
  /** column name */
  id = 'id',
}

/** input type for updating data in table "follow" */
export interface follow_set_input {
  follower_id?: InputMaybe<Scalars['uuid']>
  following_id?: InputMaybe<Scalars['uuid']>
  id?: InputMaybe<Scalars['uuid']>
}

/** Streaming cursor of the table "follow" */
export interface follow_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: follow_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface follow_stream_cursor_value_input {
  follower_id?: InputMaybe<Scalars['uuid']>
  following_id?: InputMaybe<Scalars['uuid']>
  id?: InputMaybe<Scalars['uuid']>
}

/** update columns of table "follow" */
export enum follow_update_column {
  /** column name */
  follower_id = 'follower_id',
  /** column name */
  following_id = 'following_id',
  /** column name */
  id = 'id',
}

export interface follow_updates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<follow_set_input>
  where: follow_bool_exp
}

export interface geography_cast_exp {
  geometry?: InputMaybe<geometry_comparison_exp>
}

/** Boolean expression to compare columns of type "geography". All fields are combined with logical 'AND'. */
export interface geography_comparison_exp {
  _cast?: InputMaybe<geography_cast_exp>
  _eq?: InputMaybe<Scalars['geography']>
  _gt?: InputMaybe<Scalars['geography']>
  _gte?: InputMaybe<Scalars['geography']>
  _in?: InputMaybe<Array<Scalars['geography']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _lt?: InputMaybe<Scalars['geography']>
  _lte?: InputMaybe<Scalars['geography']>
  _neq?: InputMaybe<Scalars['geography']>
  _nin?: InputMaybe<Array<Scalars['geography']>>
  /** is the column within a given distance from the given geography value */
  _st_d_within?: InputMaybe<st_d_within_geography_input>
  /** does the column spatially intersect the given geography value */
  _st_intersects?: InputMaybe<Scalars['geography']>
}

export interface geometry_cast_exp {
  geography?: InputMaybe<geography_comparison_exp>
}

/** Boolean expression to compare columns of type "geometry". All fields are combined with logical 'AND'. */
export interface geometry_comparison_exp {
  _cast?: InputMaybe<geometry_cast_exp>
  _eq?: InputMaybe<Scalars['geometry']>
  _gt?: InputMaybe<Scalars['geometry']>
  _gte?: InputMaybe<Scalars['geometry']>
  _in?: InputMaybe<Array<Scalars['geometry']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _lt?: InputMaybe<Scalars['geometry']>
  _lte?: InputMaybe<Scalars['geometry']>
  _neq?: InputMaybe<Scalars['geometry']>
  _nin?: InputMaybe<Array<Scalars['geometry']>>
  /** is the column within a given 3D distance from the given geometry value */
  _st_3d_d_within?: InputMaybe<st_d_within_input>
  /** does the column spatially intersect the given geometry value in 3D */
  _st_3d_intersects?: InputMaybe<Scalars['geometry']>
  /** does the column contain the given geometry value */
  _st_contains?: InputMaybe<Scalars['geometry']>
  /** does the column cross the given geometry value */
  _st_crosses?: InputMaybe<Scalars['geometry']>
  /** is the column within a given distance from the given geometry value */
  _st_d_within?: InputMaybe<st_d_within_input>
  /** is the column equal to given geometry value (directionality is ignored) */
  _st_equals?: InputMaybe<Scalars['geometry']>
  /** does the column spatially intersect the given geometry value */
  _st_intersects?: InputMaybe<Scalars['geometry']>
  /** does the column 'spatially overlap' (intersect but not completely contain) the given geometry value */
  _st_overlaps?: InputMaybe<Scalars['geometry']>
  /** does the column have atleast one point in common with the given geometry value */
  _st_touches?: InputMaybe<Scalars['geometry']>
  /** is the column contained in the given geometry value */
  _st_within?: InputMaybe<Scalars['geometry']>
}

/** Boolean expression to filter rows from the table "hrr". All fields are combined with a logical 'AND'. */
export interface hrr_bool_exp {
  _and?: InputMaybe<Array<hrr_bool_exp>>
  _not?: InputMaybe<hrr_bool_exp>
  _or?: InputMaybe<Array<hrr_bool_exp>>
  color?: InputMaybe<String_comparison_exp>
  hrrcity?: InputMaybe<String_comparison_exp>
  ogc_fid?: InputMaybe<Int_comparison_exp>
  slug?: InputMaybe<String_comparison_exp>
  wkb_geometry?: InputMaybe<geometry_comparison_exp>
}

/** unique or primary key constraints on table "hrr" */
export enum hrr_constraint {
  /** unique or primary key constraint on columns "ogc_fid" */
  hrr_pkey = 'hrr_pkey',
  /** unique or primary key constraint on columns "slug" */
  hrr_slug_key = 'hrr_slug_key',
}

/** input type for incrementing numeric columns in table "hrr" */
export interface hrr_inc_input {
  ogc_fid?: InputMaybe<Scalars['Int']>
}

/** input type for inserting data into table "hrr" */
export interface hrr_insert_input {
  color?: InputMaybe<Scalars['String']>
  hrrcity?: InputMaybe<Scalars['String']>
  ogc_fid?: InputMaybe<Scalars['Int']>
  slug?: InputMaybe<Scalars['String']>
  wkb_geometry?: InputMaybe<Scalars['geometry']>
}

/** on_conflict condition type for table "hrr" */
export interface hrr_on_conflict {
  constraint: hrr_constraint
  update_columns?: Array<hrr_update_column>
  where?: InputMaybe<hrr_bool_exp>
}

/** Ordering options when selecting data from "hrr". */
export interface hrr_order_by {
  color?: InputMaybe<order_by>
  hrrcity?: InputMaybe<order_by>
  ogc_fid?: InputMaybe<order_by>
  slug?: InputMaybe<order_by>
  wkb_geometry?: InputMaybe<order_by>
}

/** primary key columns input for table: hrr */
export interface hrr_pk_columns_input {
  ogc_fid: Scalars['Int']
}

/** select columns of table "hrr" */
export enum hrr_select_column {
  /** column name */
  color = 'color',
  /** column name */
  hrrcity = 'hrrcity',
  /** column name */
  ogc_fid = 'ogc_fid',
  /** column name */
  slug = 'slug',
  /** column name */
  wkb_geometry = 'wkb_geometry',
}

/** input type for updating data in table "hrr" */
export interface hrr_set_input {
  color?: InputMaybe<Scalars['String']>
  hrrcity?: InputMaybe<Scalars['String']>
  ogc_fid?: InputMaybe<Scalars['Int']>
  slug?: InputMaybe<Scalars['String']>
  wkb_geometry?: InputMaybe<Scalars['geometry']>
}

/** Streaming cursor of the table "hrr" */
export interface hrr_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: hrr_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface hrr_stream_cursor_value_input {
  color?: InputMaybe<Scalars['String']>
  hrrcity?: InputMaybe<Scalars['String']>
  ogc_fid?: InputMaybe<Scalars['Int']>
  slug?: InputMaybe<Scalars['String']>
  wkb_geometry?: InputMaybe<Scalars['geometry']>
}

/** update columns of table "hrr" */
export enum hrr_update_column {
  /** column name */
  color = 'color',
  /** column name */
  hrrcity = 'hrrcity',
  /** column name */
  ogc_fid = 'ogc_fid',
  /** column name */
  slug = 'slug',
  /** column name */
  wkb_geometry = 'wkb_geometry',
}

export interface hrr_updates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<hrr_inc_input>
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<hrr_set_input>
  where: hrr_bool_exp
}

export interface jsonb_cast_exp {
  String?: InputMaybe<String_comparison_exp>
}

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export interface jsonb_comparison_exp {
  _cast?: InputMaybe<jsonb_cast_exp>
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']>
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']>
  _eq?: InputMaybe<Scalars['jsonb']>
  _gt?: InputMaybe<Scalars['jsonb']>
  _gte?: InputMaybe<Scalars['jsonb']>
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']>
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']>>
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']>>
  _in?: InputMaybe<Array<Scalars['jsonb']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _lt?: InputMaybe<Scalars['jsonb']>
  _lte?: InputMaybe<Scalars['jsonb']>
  _neq?: InputMaybe<Scalars['jsonb']>
  _nin?: InputMaybe<Array<Scalars['jsonb']>>
}

export interface list_aggregate_bool_exp {
  bool_and?: InputMaybe<list_aggregate_bool_exp_bool_and>
  bool_or?: InputMaybe<list_aggregate_bool_exp_bool_or>
  count?: InputMaybe<list_aggregate_bool_exp_count>
}

export interface list_aggregate_bool_exp_bool_and {
  arguments: list_select_column_list_aggregate_bool_exp_bool_and_arguments_columns
  distinct?: InputMaybe<Scalars['Boolean']>
  filter?: InputMaybe<list_bool_exp>
  predicate: Boolean_comparison_exp
}

export interface list_aggregate_bool_exp_bool_or {
  arguments: list_select_column_list_aggregate_bool_exp_bool_or_arguments_columns
  distinct?: InputMaybe<Scalars['Boolean']>
  filter?: InputMaybe<list_bool_exp>
  predicate: Boolean_comparison_exp
}

export interface list_aggregate_bool_exp_count {
  arguments?: InputMaybe<Array<list_select_column>>
  distinct?: InputMaybe<Scalars['Boolean']>
  filter?: InputMaybe<list_bool_exp>
  predicate: Int_comparison_exp
}

/** order by aggregate values of table "list" */
export interface list_aggregate_order_by {
  avg?: InputMaybe<list_avg_order_by>
  count?: InputMaybe<order_by>
  max?: InputMaybe<list_max_order_by>
  min?: InputMaybe<list_min_order_by>
  stddev?: InputMaybe<list_stddev_order_by>
  stddev_pop?: InputMaybe<list_stddev_pop_order_by>
  stddev_samp?: InputMaybe<list_stddev_samp_order_by>
  sum?: InputMaybe<list_sum_order_by>
  var_pop?: InputMaybe<list_var_pop_order_by>
  var_samp?: InputMaybe<list_var_samp_order_by>
  variance?: InputMaybe<list_variance_order_by>
}

/** input type for inserting array relation for remote table "list" */
export interface list_arr_rel_insert_input {
  data: Array<list_insert_input>
  /** upsert condition */
  on_conflict?: InputMaybe<list_on_conflict>
}

/** order by avg() on columns of table "list" */
export interface list_avg_order_by {
  color?: InputMaybe<order_by>
  font?: InputMaybe<order_by>
  theme?: InputMaybe<order_by>
}

/** Boolean expression to filter rows from the table "list". All fields are combined with a logical 'AND'. */
export interface list_bool_exp {
  _and?: InputMaybe<Array<list_bool_exp>>
  _not?: InputMaybe<list_bool_exp>
  _or?: InputMaybe<Array<list_bool_exp>>
  color?: InputMaybe<Int_comparison_exp>
  created_at?: InputMaybe<timestamptz_comparison_exp>
  description?: InputMaybe<String_comparison_exp>
  font?: InputMaybe<Int_comparison_exp>
  id?: InputMaybe<uuid_comparison_exp>
  image?: InputMaybe<String_comparison_exp>
  list_reviews?: InputMaybe<review_bool_exp>
  list_reviews_aggregate?: InputMaybe<review_aggregate_bool_exp>
  location?: InputMaybe<geometry_comparison_exp>
  name?: InputMaybe<String_comparison_exp>
  public?: InputMaybe<Boolean_comparison_exp>
  region?: InputMaybe<String_comparison_exp>
  regions?: InputMaybe<list_region_bool_exp>
  regions_aggregate?: InputMaybe<list_region_aggregate_bool_exp>
  restaurants?: InputMaybe<list_restaurant_bool_exp>
  restaurants_aggregate?: InputMaybe<list_restaurant_aggregate_bool_exp>
  slug?: InputMaybe<String_comparison_exp>
  tags?: InputMaybe<list_tag_bool_exp>
  tags_aggregate?: InputMaybe<list_tag_aggregate_bool_exp>
  theme?: InputMaybe<Int_comparison_exp>
  updated_at?: InputMaybe<timestamptz_comparison_exp>
  user?: InputMaybe<user_bool_exp>
  user_id?: InputMaybe<uuid_comparison_exp>
}

/** unique or primary key constraints on table "list" */
export enum list_constraint {
  /** unique or primary key constraint on columns "id" */
  list_pkey = 'list_pkey',
  /** unique or primary key constraint on columns "slug", "user_id", "region" */
  list_slug_user_id_region_key = 'list_slug_user_id_region_key',
}

/** input type for incrementing numeric columns in table "list" */
export interface list_inc_input {
  color?: InputMaybe<Scalars['Int']>
  font?: InputMaybe<Scalars['Int']>
  theme?: InputMaybe<Scalars['Int']>
}

/** input type for inserting data into table "list" */
export interface list_insert_input {
  color?: InputMaybe<Scalars['Int']>
  created_at?: InputMaybe<Scalars['timestamptz']>
  description?: InputMaybe<Scalars['String']>
  font?: InputMaybe<Scalars['Int']>
  id?: InputMaybe<Scalars['uuid']>
  image?: InputMaybe<Scalars['String']>
  list_reviews?: InputMaybe<review_arr_rel_insert_input>
  location?: InputMaybe<Scalars['geometry']>
  name?: InputMaybe<Scalars['String']>
  public?: InputMaybe<Scalars['Boolean']>
  region?: InputMaybe<Scalars['String']>
  regions?: InputMaybe<list_region_arr_rel_insert_input>
  restaurants?: InputMaybe<list_restaurant_arr_rel_insert_input>
  slug?: InputMaybe<Scalars['String']>
  tags?: InputMaybe<list_tag_arr_rel_insert_input>
  theme?: InputMaybe<Scalars['Int']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
  user?: InputMaybe<user_obj_rel_insert_input>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** order by max() on columns of table "list" */
export interface list_max_order_by {
  color?: InputMaybe<order_by>
  created_at?: InputMaybe<order_by>
  description?: InputMaybe<order_by>
  font?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  image?: InputMaybe<order_by>
  name?: InputMaybe<order_by>
  region?: InputMaybe<order_by>
  slug?: InputMaybe<order_by>
  theme?: InputMaybe<order_by>
  updated_at?: InputMaybe<order_by>
  user_id?: InputMaybe<order_by>
}

/** order by min() on columns of table "list" */
export interface list_min_order_by {
  color?: InputMaybe<order_by>
  created_at?: InputMaybe<order_by>
  description?: InputMaybe<order_by>
  font?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  image?: InputMaybe<order_by>
  name?: InputMaybe<order_by>
  region?: InputMaybe<order_by>
  slug?: InputMaybe<order_by>
  theme?: InputMaybe<order_by>
  updated_at?: InputMaybe<order_by>
  user_id?: InputMaybe<order_by>
}

/** input type for inserting object relation for remote table "list" */
export interface list_obj_rel_insert_input {
  data: list_insert_input
  /** upsert condition */
  on_conflict?: InputMaybe<list_on_conflict>
}

/** on_conflict condition type for table "list" */
export interface list_on_conflict {
  constraint: list_constraint
  update_columns?: Array<list_update_column>
  where?: InputMaybe<list_bool_exp>
}

/** Ordering options when selecting data from "list". */
export interface list_order_by {
  color?: InputMaybe<order_by>
  created_at?: InputMaybe<order_by>
  description?: InputMaybe<order_by>
  font?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  image?: InputMaybe<order_by>
  list_reviews_aggregate?: InputMaybe<review_aggregate_order_by>
  location?: InputMaybe<order_by>
  name?: InputMaybe<order_by>
  public?: InputMaybe<order_by>
  region?: InputMaybe<order_by>
  regions_aggregate?: InputMaybe<list_region_aggregate_order_by>
  restaurants_aggregate?: InputMaybe<list_restaurant_aggregate_order_by>
  slug?: InputMaybe<order_by>
  tags_aggregate?: InputMaybe<list_tag_aggregate_order_by>
  theme?: InputMaybe<order_by>
  updated_at?: InputMaybe<order_by>
  user?: InputMaybe<user_order_by>
  user_id?: InputMaybe<order_by>
}

/** primary key columns input for table: list */
export interface list_pk_columns_input {
  id: Scalars['uuid']
}

export interface list_populated_args {
  min_items?: InputMaybe<Scalars['Int']>
}

export interface list_region_aggregate_bool_exp {
  count?: InputMaybe<list_region_aggregate_bool_exp_count>
}

export interface list_region_aggregate_bool_exp_count {
  arguments?: InputMaybe<Array<list_region_select_column>>
  distinct?: InputMaybe<Scalars['Boolean']>
  filter?: InputMaybe<list_region_bool_exp>
  predicate: Int_comparison_exp
}

/** order by aggregate values of table "list_region" */
export interface list_region_aggregate_order_by {
  count?: InputMaybe<order_by>
  max?: InputMaybe<list_region_max_order_by>
  min?: InputMaybe<list_region_min_order_by>
}

/** input type for inserting array relation for remote table "list_region" */
export interface list_region_arr_rel_insert_input {
  data: Array<list_region_insert_input>
  /** upsert condition */
  on_conflict?: InputMaybe<list_region_on_conflict>
}

/** Boolean expression to filter rows from the table "list_region". All fields are combined with a logical 'AND'. */
export interface list_region_bool_exp {
  _and?: InputMaybe<Array<list_region_bool_exp>>
  _not?: InputMaybe<list_region_bool_exp>
  _or?: InputMaybe<Array<list_region_bool_exp>>
  id?: InputMaybe<uuid_comparison_exp>
  list_id?: InputMaybe<uuid_comparison_exp>
  region?: InputMaybe<String_comparison_exp>
  restaurant_id?: InputMaybe<uuid_comparison_exp>
}

/** unique or primary key constraints on table "list_region" */
export enum list_region_constraint {
  /** unique or primary key constraint on columns "id" */
  list_region_pkey = 'list_region_pkey',
}

/** input type for inserting data into table "list_region" */
export interface list_region_insert_input {
  id?: InputMaybe<Scalars['uuid']>
  list_id?: InputMaybe<Scalars['uuid']>
  region?: InputMaybe<Scalars['String']>
  restaurant_id?: InputMaybe<Scalars['uuid']>
}

/** order by max() on columns of table "list_region" */
export interface list_region_max_order_by {
  id?: InputMaybe<order_by>
  list_id?: InputMaybe<order_by>
  region?: InputMaybe<order_by>
  restaurant_id?: InputMaybe<order_by>
}

/** order by min() on columns of table "list_region" */
export interface list_region_min_order_by {
  id?: InputMaybe<order_by>
  list_id?: InputMaybe<order_by>
  region?: InputMaybe<order_by>
  restaurant_id?: InputMaybe<order_by>
}

/** on_conflict condition type for table "list_region" */
export interface list_region_on_conflict {
  constraint: list_region_constraint
  update_columns?: Array<list_region_update_column>
  where?: InputMaybe<list_region_bool_exp>
}

/** Ordering options when selecting data from "list_region". */
export interface list_region_order_by {
  id?: InputMaybe<order_by>
  list_id?: InputMaybe<order_by>
  region?: InputMaybe<order_by>
  restaurant_id?: InputMaybe<order_by>
}

/** primary key columns input for table: list_region */
export interface list_region_pk_columns_input {
  id: Scalars['uuid']
}

/** select columns of table "list_region" */
export enum list_region_select_column {
  /** column name */
  id = 'id',
  /** column name */
  list_id = 'list_id',
  /** column name */
  region = 'region',
  /** column name */
  restaurant_id = 'restaurant_id',
}

/** input type for updating data in table "list_region" */
export interface list_region_set_input {
  id?: InputMaybe<Scalars['uuid']>
  list_id?: InputMaybe<Scalars['uuid']>
  region?: InputMaybe<Scalars['String']>
  restaurant_id?: InputMaybe<Scalars['uuid']>
}

/** Streaming cursor of the table "list_region" */
export interface list_region_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: list_region_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface list_region_stream_cursor_value_input {
  id?: InputMaybe<Scalars['uuid']>
  list_id?: InputMaybe<Scalars['uuid']>
  region?: InputMaybe<Scalars['String']>
  restaurant_id?: InputMaybe<Scalars['uuid']>
}

/** update columns of table "list_region" */
export enum list_region_update_column {
  /** column name */
  id = 'id',
  /** column name */
  list_id = 'list_id',
  /** column name */
  region = 'region',
  /** column name */
  restaurant_id = 'restaurant_id',
}

export interface list_region_updates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<list_region_set_input>
  where: list_region_bool_exp
}

export interface list_restaurant_aggregate_bool_exp {
  count?: InputMaybe<list_restaurant_aggregate_bool_exp_count>
}

export interface list_restaurant_aggregate_bool_exp_count {
  arguments?: InputMaybe<Array<list_restaurant_select_column>>
  distinct?: InputMaybe<Scalars['Boolean']>
  filter?: InputMaybe<list_restaurant_bool_exp>
  predicate: Int_comparison_exp
}

/** order by aggregate values of table "list_restaurant" */
export interface list_restaurant_aggregate_order_by {
  avg?: InputMaybe<list_restaurant_avg_order_by>
  count?: InputMaybe<order_by>
  max?: InputMaybe<list_restaurant_max_order_by>
  min?: InputMaybe<list_restaurant_min_order_by>
  stddev?: InputMaybe<list_restaurant_stddev_order_by>
  stddev_pop?: InputMaybe<list_restaurant_stddev_pop_order_by>
  stddev_samp?: InputMaybe<list_restaurant_stddev_samp_order_by>
  sum?: InputMaybe<list_restaurant_sum_order_by>
  var_pop?: InputMaybe<list_restaurant_var_pop_order_by>
  var_samp?: InputMaybe<list_restaurant_var_samp_order_by>
  variance?: InputMaybe<list_restaurant_variance_order_by>
}

/** input type for inserting array relation for remote table "list_restaurant" */
export interface list_restaurant_arr_rel_insert_input {
  data: Array<list_restaurant_insert_input>
  /** upsert condition */
  on_conflict?: InputMaybe<list_restaurant_on_conflict>
}

/** order by avg() on columns of table "list_restaurant" */
export interface list_restaurant_avg_order_by {
  position?: InputMaybe<order_by>
}

/** Boolean expression to filter rows from the table "list_restaurant". All fields are combined with a logical 'AND'. */
export interface list_restaurant_bool_exp {
  _and?: InputMaybe<Array<list_restaurant_bool_exp>>
  _not?: InputMaybe<list_restaurant_bool_exp>
  _or?: InputMaybe<Array<list_restaurant_bool_exp>>
  comment?: InputMaybe<String_comparison_exp>
  id?: InputMaybe<uuid_comparison_exp>
  list?: InputMaybe<list_bool_exp>
  list_id?: InputMaybe<uuid_comparison_exp>
  position?: InputMaybe<Int_comparison_exp>
  restaurant?: InputMaybe<restaurant_bool_exp>
  restaurant_id?: InputMaybe<uuid_comparison_exp>
  restaurants?: InputMaybe<restaurant_bool_exp>
  restaurants_aggregate?: InputMaybe<restaurant_aggregate_bool_exp>
  tags?: InputMaybe<list_restaurant_tag_bool_exp>
  tags_aggregate?: InputMaybe<list_restaurant_tag_aggregate_bool_exp>
  user?: InputMaybe<user_bool_exp>
  user_id?: InputMaybe<uuid_comparison_exp>
}

/** unique or primary key constraints on table "list_restaurant" */
export enum list_restaurant_constraint {
  /** unique or primary key constraint on columns "id" */
  list_restaurant_id_key = 'list_restaurant_id_key',
  /** unique or primary key constraint on columns "list_id", "restaurant_id" */
  list_restaurant_pkey = 'list_restaurant_pkey',
  /** unique or primary key constraint on columns "list_id", "position" */
  list_restaurant_position_list_id_key = 'list_restaurant_position_list_id_key',
}

/** input type for incrementing numeric columns in table "list_restaurant" */
export interface list_restaurant_inc_input {
  position?: InputMaybe<Scalars['Int']>
}

/** input type for inserting data into table "list_restaurant" */
export interface list_restaurant_insert_input {
  comment?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['uuid']>
  list?: InputMaybe<list_obj_rel_insert_input>
  list_id?: InputMaybe<Scalars['uuid']>
  position?: InputMaybe<Scalars['Int']>
  restaurant?: InputMaybe<restaurant_obj_rel_insert_input>
  restaurant_id?: InputMaybe<Scalars['uuid']>
  restaurants?: InputMaybe<restaurant_arr_rel_insert_input>
  tags?: InputMaybe<list_restaurant_tag_arr_rel_insert_input>
  user?: InputMaybe<user_obj_rel_insert_input>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** order by max() on columns of table "list_restaurant" */
export interface list_restaurant_max_order_by {
  comment?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  list_id?: InputMaybe<order_by>
  position?: InputMaybe<order_by>
  restaurant_id?: InputMaybe<order_by>
  user_id?: InputMaybe<order_by>
}

/** order by min() on columns of table "list_restaurant" */
export interface list_restaurant_min_order_by {
  comment?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  list_id?: InputMaybe<order_by>
  position?: InputMaybe<order_by>
  restaurant_id?: InputMaybe<order_by>
  user_id?: InputMaybe<order_by>
}

/** on_conflict condition type for table "list_restaurant" */
export interface list_restaurant_on_conflict {
  constraint: list_restaurant_constraint
  update_columns?: Array<list_restaurant_update_column>
  where?: InputMaybe<list_restaurant_bool_exp>
}

/** Ordering options when selecting data from "list_restaurant". */
export interface list_restaurant_order_by {
  comment?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  list?: InputMaybe<list_order_by>
  list_id?: InputMaybe<order_by>
  position?: InputMaybe<order_by>
  restaurant?: InputMaybe<restaurant_order_by>
  restaurant_id?: InputMaybe<order_by>
  restaurants_aggregate?: InputMaybe<restaurant_aggregate_order_by>
  tags_aggregate?: InputMaybe<list_restaurant_tag_aggregate_order_by>
  user?: InputMaybe<user_order_by>
  user_id?: InputMaybe<order_by>
}

/** primary key columns input for table: list_restaurant */
export interface list_restaurant_pk_columns_input {
  list_id: Scalars['uuid']
  restaurant_id: Scalars['uuid']
}

/** select columns of table "list_restaurant" */
export enum list_restaurant_select_column {
  /** column name */
  comment = 'comment',
  /** column name */
  id = 'id',
  /** column name */
  list_id = 'list_id',
  /** column name */
  position = 'position',
  /** column name */
  restaurant_id = 'restaurant_id',
  /** column name */
  user_id = 'user_id',
}

/** input type for updating data in table "list_restaurant" */
export interface list_restaurant_set_input {
  comment?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['uuid']>
  list_id?: InputMaybe<Scalars['uuid']>
  position?: InputMaybe<Scalars['Int']>
  restaurant_id?: InputMaybe<Scalars['uuid']>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** order by stddev() on columns of table "list_restaurant" */
export interface list_restaurant_stddev_order_by {
  position?: InputMaybe<order_by>
}

/** order by stddev_pop() on columns of table "list_restaurant" */
export interface list_restaurant_stddev_pop_order_by {
  position?: InputMaybe<order_by>
}

/** order by stddev_samp() on columns of table "list_restaurant" */
export interface list_restaurant_stddev_samp_order_by {
  position?: InputMaybe<order_by>
}

/** Streaming cursor of the table "list_restaurant" */
export interface list_restaurant_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: list_restaurant_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface list_restaurant_stream_cursor_value_input {
  comment?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['uuid']>
  list_id?: InputMaybe<Scalars['uuid']>
  position?: InputMaybe<Scalars['Int']>
  restaurant_id?: InputMaybe<Scalars['uuid']>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** order by sum() on columns of table "list_restaurant" */
export interface list_restaurant_sum_order_by {
  position?: InputMaybe<order_by>
}

export interface list_restaurant_tag_aggregate_bool_exp {
  count?: InputMaybe<list_restaurant_tag_aggregate_bool_exp_count>
}

export interface list_restaurant_tag_aggregate_bool_exp_count {
  arguments?: InputMaybe<Array<list_restaurant_tag_select_column>>
  distinct?: InputMaybe<Scalars['Boolean']>
  filter?: InputMaybe<list_restaurant_tag_bool_exp>
  predicate: Int_comparison_exp
}

/** order by aggregate values of table "list_restaurant_tag" */
export interface list_restaurant_tag_aggregate_order_by {
  avg?: InputMaybe<list_restaurant_tag_avg_order_by>
  count?: InputMaybe<order_by>
  max?: InputMaybe<list_restaurant_tag_max_order_by>
  min?: InputMaybe<list_restaurant_tag_min_order_by>
  stddev?: InputMaybe<list_restaurant_tag_stddev_order_by>
  stddev_pop?: InputMaybe<list_restaurant_tag_stddev_pop_order_by>
  stddev_samp?: InputMaybe<list_restaurant_tag_stddev_samp_order_by>
  sum?: InputMaybe<list_restaurant_tag_sum_order_by>
  var_pop?: InputMaybe<list_restaurant_tag_var_pop_order_by>
  var_samp?: InputMaybe<list_restaurant_tag_var_samp_order_by>
  variance?: InputMaybe<list_restaurant_tag_variance_order_by>
}

/** input type for inserting array relation for remote table "list_restaurant_tag" */
export interface list_restaurant_tag_arr_rel_insert_input {
  data: Array<list_restaurant_tag_insert_input>
  /** upsert condition */
  on_conflict?: InputMaybe<list_restaurant_tag_on_conflict>
}

/** order by avg() on columns of table "list_restaurant_tag" */
export interface list_restaurant_tag_avg_order_by {
  position?: InputMaybe<order_by>
}

/** Boolean expression to filter rows from the table "list_restaurant_tag". All fields are combined with a logical 'AND'. */
export interface list_restaurant_tag_bool_exp {
  _and?: InputMaybe<Array<list_restaurant_tag_bool_exp>>
  _not?: InputMaybe<list_restaurant_tag_bool_exp>
  _or?: InputMaybe<Array<list_restaurant_tag_bool_exp>>
  id?: InputMaybe<uuid_comparison_exp>
  list_id?: InputMaybe<uuid_comparison_exp>
  list_restaurant_id?: InputMaybe<uuid_comparison_exp>
  position?: InputMaybe<Int_comparison_exp>
  restaurant_tag?: InputMaybe<restaurant_tag_bool_exp>
  restaurant_tag_id?: InputMaybe<uuid_comparison_exp>
  user_id?: InputMaybe<uuid_comparison_exp>
}

/** unique or primary key constraints on table "list_restaurant_tag" */
export enum list_restaurant_tag_constraint {
  /** unique or primary key constraint on columns "id" */
  list_restaurant_tag_id_key = 'list_restaurant_tag_id_key',
  /** unique or primary key constraint on columns "list_id", "restaurant_tag_id", "list_restaurant_id" */
  list_restaurant_tag_list_id_list_restaurant_id_restaurant_tag_i = 'list_restaurant_tag_list_id_list_restaurant_id_restaurant_tag_i',
  /** unique or primary key constraint on columns "id" */
  list_restaurant_tag_pkey = 'list_restaurant_tag_pkey',
  /** unique or primary key constraint on columns "list_id", "list_restaurant_id", "position" */
  list_restaurant_tag_position_list_id_list_restaurant_id_key = 'list_restaurant_tag_position_list_id_list_restaurant_id_key',
}

/** input type for incrementing numeric columns in table "list_restaurant_tag" */
export interface list_restaurant_tag_inc_input {
  position?: InputMaybe<Scalars['Int']>
}

/** input type for inserting data into table "list_restaurant_tag" */
export interface list_restaurant_tag_insert_input {
  id?: InputMaybe<Scalars['uuid']>
  list_id?: InputMaybe<Scalars['uuid']>
  list_restaurant_id?: InputMaybe<Scalars['uuid']>
  position?: InputMaybe<Scalars['Int']>
  restaurant_tag?: InputMaybe<restaurant_tag_obj_rel_insert_input>
  restaurant_tag_id?: InputMaybe<Scalars['uuid']>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** order by max() on columns of table "list_restaurant_tag" */
export interface list_restaurant_tag_max_order_by {
  id?: InputMaybe<order_by>
  list_id?: InputMaybe<order_by>
  list_restaurant_id?: InputMaybe<order_by>
  position?: InputMaybe<order_by>
  restaurant_tag_id?: InputMaybe<order_by>
  user_id?: InputMaybe<order_by>
}

/** order by min() on columns of table "list_restaurant_tag" */
export interface list_restaurant_tag_min_order_by {
  id?: InputMaybe<order_by>
  list_id?: InputMaybe<order_by>
  list_restaurant_id?: InputMaybe<order_by>
  position?: InputMaybe<order_by>
  restaurant_tag_id?: InputMaybe<order_by>
  user_id?: InputMaybe<order_by>
}

/** on_conflict condition type for table "list_restaurant_tag" */
export interface list_restaurant_tag_on_conflict {
  constraint: list_restaurant_tag_constraint
  update_columns?: Array<list_restaurant_tag_update_column>
  where?: InputMaybe<list_restaurant_tag_bool_exp>
}

/** Ordering options when selecting data from "list_restaurant_tag". */
export interface list_restaurant_tag_order_by {
  id?: InputMaybe<order_by>
  list_id?: InputMaybe<order_by>
  list_restaurant_id?: InputMaybe<order_by>
  position?: InputMaybe<order_by>
  restaurant_tag?: InputMaybe<restaurant_tag_order_by>
  restaurant_tag_id?: InputMaybe<order_by>
  user_id?: InputMaybe<order_by>
}

/** primary key columns input for table: list_restaurant_tag */
export interface list_restaurant_tag_pk_columns_input {
  id: Scalars['uuid']
}

/** select columns of table "list_restaurant_tag" */
export enum list_restaurant_tag_select_column {
  /** column name */
  id = 'id',
  /** column name */
  list_id = 'list_id',
  /** column name */
  list_restaurant_id = 'list_restaurant_id',
  /** column name */
  position = 'position',
  /** column name */
  restaurant_tag_id = 'restaurant_tag_id',
  /** column name */
  user_id = 'user_id',
}

/** input type for updating data in table "list_restaurant_tag" */
export interface list_restaurant_tag_set_input {
  id?: InputMaybe<Scalars['uuid']>
  list_id?: InputMaybe<Scalars['uuid']>
  list_restaurant_id?: InputMaybe<Scalars['uuid']>
  position?: InputMaybe<Scalars['Int']>
  restaurant_tag_id?: InputMaybe<Scalars['uuid']>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** order by stddev() on columns of table "list_restaurant_tag" */
export interface list_restaurant_tag_stddev_order_by {
  position?: InputMaybe<order_by>
}

/** order by stddev_pop() on columns of table "list_restaurant_tag" */
export interface list_restaurant_tag_stddev_pop_order_by {
  position?: InputMaybe<order_by>
}

/** order by stddev_samp() on columns of table "list_restaurant_tag" */
export interface list_restaurant_tag_stddev_samp_order_by {
  position?: InputMaybe<order_by>
}

/** Streaming cursor of the table "list_restaurant_tag" */
export interface list_restaurant_tag_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: list_restaurant_tag_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface list_restaurant_tag_stream_cursor_value_input {
  id?: InputMaybe<Scalars['uuid']>
  list_id?: InputMaybe<Scalars['uuid']>
  list_restaurant_id?: InputMaybe<Scalars['uuid']>
  position?: InputMaybe<Scalars['Int']>
  restaurant_tag_id?: InputMaybe<Scalars['uuid']>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** order by sum() on columns of table "list_restaurant_tag" */
export interface list_restaurant_tag_sum_order_by {
  position?: InputMaybe<order_by>
}

/** update columns of table "list_restaurant_tag" */
export enum list_restaurant_tag_update_column {
  /** column name */
  id = 'id',
  /** column name */
  list_id = 'list_id',
  /** column name */
  list_restaurant_id = 'list_restaurant_id',
  /** column name */
  position = 'position',
  /** column name */
  restaurant_tag_id = 'restaurant_tag_id',
  /** column name */
  user_id = 'user_id',
}

export interface list_restaurant_tag_updates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<list_restaurant_tag_inc_input>
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<list_restaurant_tag_set_input>
  where: list_restaurant_tag_bool_exp
}

/** order by var_pop() on columns of table "list_restaurant_tag" */
export interface list_restaurant_tag_var_pop_order_by {
  position?: InputMaybe<order_by>
}

/** order by var_samp() on columns of table "list_restaurant_tag" */
export interface list_restaurant_tag_var_samp_order_by {
  position?: InputMaybe<order_by>
}

/** order by variance() on columns of table "list_restaurant_tag" */
export interface list_restaurant_tag_variance_order_by {
  position?: InputMaybe<order_by>
}

/** update columns of table "list_restaurant" */
export enum list_restaurant_update_column {
  /** column name */
  comment = 'comment',
  /** column name */
  id = 'id',
  /** column name */
  list_id = 'list_id',
  /** column name */
  position = 'position',
  /** column name */
  restaurant_id = 'restaurant_id',
  /** column name */
  user_id = 'user_id',
}

export interface list_restaurant_updates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<list_restaurant_inc_input>
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<list_restaurant_set_input>
  where: list_restaurant_bool_exp
}

/** order by var_pop() on columns of table "list_restaurant" */
export interface list_restaurant_var_pop_order_by {
  position?: InputMaybe<order_by>
}

/** order by var_samp() on columns of table "list_restaurant" */
export interface list_restaurant_var_samp_order_by {
  position?: InputMaybe<order_by>
}

/** order by variance() on columns of table "list_restaurant" */
export interface list_restaurant_variance_order_by {
  position?: InputMaybe<order_by>
}

/** select columns of table "list" */
export enum list_select_column {
  /** column name */
  color = 'color',
  /** column name */
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  font = 'font',
  /** column name */
  id = 'id',
  /** column name */
  image = 'image',
  /** column name */
  location = 'location',
  /** column name */
  name = 'name',
  /** column name */
  public = 'public',
  /** column name */
  region = 'region',
  /** column name */
  slug = 'slug',
  /** column name */
  theme = 'theme',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  user_id = 'user_id',
}

/** select "list_aggregate_bool_exp_bool_and_arguments_columns" columns of table "list" */
export enum list_select_column_list_aggregate_bool_exp_bool_and_arguments_columns {
  /** column name */
  public = 'public',
}

/** select "list_aggregate_bool_exp_bool_or_arguments_columns" columns of table "list" */
export enum list_select_column_list_aggregate_bool_exp_bool_or_arguments_columns {
  /** column name */
  public = 'public',
}

/** input type for updating data in table "list" */
export interface list_set_input {
  color?: InputMaybe<Scalars['Int']>
  created_at?: InputMaybe<Scalars['timestamptz']>
  description?: InputMaybe<Scalars['String']>
  font?: InputMaybe<Scalars['Int']>
  id?: InputMaybe<Scalars['uuid']>
  image?: InputMaybe<Scalars['String']>
  location?: InputMaybe<Scalars['geometry']>
  name?: InputMaybe<Scalars['String']>
  public?: InputMaybe<Scalars['Boolean']>
  region?: InputMaybe<Scalars['String']>
  slug?: InputMaybe<Scalars['String']>
  theme?: InputMaybe<Scalars['Int']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** order by stddev() on columns of table "list" */
export interface list_stddev_order_by {
  color?: InputMaybe<order_by>
  font?: InputMaybe<order_by>
  theme?: InputMaybe<order_by>
}

/** order by stddev_pop() on columns of table "list" */
export interface list_stddev_pop_order_by {
  color?: InputMaybe<order_by>
  font?: InputMaybe<order_by>
  theme?: InputMaybe<order_by>
}

/** order by stddev_samp() on columns of table "list" */
export interface list_stddev_samp_order_by {
  color?: InputMaybe<order_by>
  font?: InputMaybe<order_by>
  theme?: InputMaybe<order_by>
}

/** Streaming cursor of the table "list" */
export interface list_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: list_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface list_stream_cursor_value_input {
  color?: InputMaybe<Scalars['Int']>
  created_at?: InputMaybe<Scalars['timestamptz']>
  description?: InputMaybe<Scalars['String']>
  font?: InputMaybe<Scalars['Int']>
  id?: InputMaybe<Scalars['uuid']>
  image?: InputMaybe<Scalars['String']>
  location?: InputMaybe<Scalars['geometry']>
  name?: InputMaybe<Scalars['String']>
  public?: InputMaybe<Scalars['Boolean']>
  region?: InputMaybe<Scalars['String']>
  slug?: InputMaybe<Scalars['String']>
  theme?: InputMaybe<Scalars['Int']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** order by sum() on columns of table "list" */
export interface list_sum_order_by {
  color?: InputMaybe<order_by>
  font?: InputMaybe<order_by>
  theme?: InputMaybe<order_by>
}

export interface list_tag_aggregate_bool_exp {
  count?: InputMaybe<list_tag_aggregate_bool_exp_count>
}

export interface list_tag_aggregate_bool_exp_count {
  arguments?: InputMaybe<Array<list_tag_select_column>>
  distinct?: InputMaybe<Scalars['Boolean']>
  filter?: InputMaybe<list_tag_bool_exp>
  predicate: Int_comparison_exp
}

/** order by aggregate values of table "list_tag" */
export interface list_tag_aggregate_order_by {
  count?: InputMaybe<order_by>
  max?: InputMaybe<list_tag_max_order_by>
  min?: InputMaybe<list_tag_min_order_by>
}

/** input type for inserting array relation for remote table "list_tag" */
export interface list_tag_arr_rel_insert_input {
  data: Array<list_tag_insert_input>
  /** upsert condition */
  on_conflict?: InputMaybe<list_tag_on_conflict>
}

/** Boolean expression to filter rows from the table "list_tag". All fields are combined with a logical 'AND'. */
export interface list_tag_bool_exp {
  _and?: InputMaybe<Array<list_tag_bool_exp>>
  _not?: InputMaybe<list_tag_bool_exp>
  _or?: InputMaybe<Array<list_tag_bool_exp>>
  created_at?: InputMaybe<timestamptz_comparison_exp>
  id?: InputMaybe<uuid_comparison_exp>
  list?: InputMaybe<list_bool_exp>
  list_id?: InputMaybe<uuid_comparison_exp>
  tag?: InputMaybe<tag_bool_exp>
  tag_id?: InputMaybe<uuid_comparison_exp>
}

/** unique or primary key constraints on table "list_tag" */
export enum list_tag_constraint {
  /** unique or primary key constraint on columns "list_id", "tag_id", "id" */
  list_tag_list_id_tag_id_id_key = 'list_tag_list_id_tag_id_id_key',
  /** unique or primary key constraint on columns "id" */
  list_tag_pkey = 'list_tag_pkey',
}

/** input type for inserting data into table "list_tag" */
export interface list_tag_insert_input {
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  list?: InputMaybe<list_obj_rel_insert_input>
  list_id?: InputMaybe<Scalars['uuid']>
  tag?: InputMaybe<tag_obj_rel_insert_input>
  tag_id?: InputMaybe<Scalars['uuid']>
}

/** order by max() on columns of table "list_tag" */
export interface list_tag_max_order_by {
  created_at?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  list_id?: InputMaybe<order_by>
  tag_id?: InputMaybe<order_by>
}

/** order by min() on columns of table "list_tag" */
export interface list_tag_min_order_by {
  created_at?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  list_id?: InputMaybe<order_by>
  tag_id?: InputMaybe<order_by>
}

/** on_conflict condition type for table "list_tag" */
export interface list_tag_on_conflict {
  constraint: list_tag_constraint
  update_columns?: Array<list_tag_update_column>
  where?: InputMaybe<list_tag_bool_exp>
}

/** Ordering options when selecting data from "list_tag". */
export interface list_tag_order_by {
  created_at?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  list?: InputMaybe<list_order_by>
  list_id?: InputMaybe<order_by>
  tag?: InputMaybe<tag_order_by>
  tag_id?: InputMaybe<order_by>
}

/** primary key columns input for table: list_tag */
export interface list_tag_pk_columns_input {
  id: Scalars['uuid']
}

/** select columns of table "list_tag" */
export enum list_tag_select_column {
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  list_id = 'list_id',
  /** column name */
  tag_id = 'tag_id',
}

/** input type for updating data in table "list_tag" */
export interface list_tag_set_input {
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  list_id?: InputMaybe<Scalars['uuid']>
  tag_id?: InputMaybe<Scalars['uuid']>
}

/** Streaming cursor of the table "list_tag" */
export interface list_tag_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: list_tag_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface list_tag_stream_cursor_value_input {
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  list_id?: InputMaybe<Scalars['uuid']>
  tag_id?: InputMaybe<Scalars['uuid']>
}

/** update columns of table "list_tag" */
export enum list_tag_update_column {
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  list_id = 'list_id',
  /** column name */
  tag_id = 'tag_id',
}

export interface list_tag_updates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<list_tag_set_input>
  where: list_tag_bool_exp
}

/** update columns of table "list" */
export enum list_update_column {
  /** column name */
  color = 'color',
  /** column name */
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  font = 'font',
  /** column name */
  id = 'id',
  /** column name */
  image = 'image',
  /** column name */
  location = 'location',
  /** column name */
  name = 'name',
  /** column name */
  public = 'public',
  /** column name */
  region = 'region',
  /** column name */
  slug = 'slug',
  /** column name */
  theme = 'theme',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  user_id = 'user_id',
}

export interface list_updates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<list_inc_input>
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<list_set_input>
  where: list_bool_exp
}

/** order by var_pop() on columns of table "list" */
export interface list_var_pop_order_by {
  color?: InputMaybe<order_by>
  font?: InputMaybe<order_by>
  theme?: InputMaybe<order_by>
}

/** order by var_samp() on columns of table "list" */
export interface list_var_samp_order_by {
  color?: InputMaybe<order_by>
  font?: InputMaybe<order_by>
  theme?: InputMaybe<order_by>
}

/** order by variance() on columns of table "list" */
export interface list_variance_order_by {
  color?: InputMaybe<order_by>
  font?: InputMaybe<order_by>
  theme?: InputMaybe<order_by>
}

export interface menu_item_aggregate_bool_exp {
  count?: InputMaybe<menu_item_aggregate_bool_exp_count>
}

export interface menu_item_aggregate_bool_exp_count {
  arguments?: InputMaybe<Array<menu_item_select_column>>
  distinct?: InputMaybe<Scalars['Boolean']>
  filter?: InputMaybe<menu_item_bool_exp>
  predicate: Int_comparison_exp
}

/** order by aggregate values of table "menu_item" */
export interface menu_item_aggregate_order_by {
  avg?: InputMaybe<menu_item_avg_order_by>
  count?: InputMaybe<order_by>
  max?: InputMaybe<menu_item_max_order_by>
  min?: InputMaybe<menu_item_min_order_by>
  stddev?: InputMaybe<menu_item_stddev_order_by>
  stddev_pop?: InputMaybe<menu_item_stddev_pop_order_by>
  stddev_samp?: InputMaybe<menu_item_stddev_samp_order_by>
  sum?: InputMaybe<menu_item_sum_order_by>
  var_pop?: InputMaybe<menu_item_var_pop_order_by>
  var_samp?: InputMaybe<menu_item_var_samp_order_by>
  variance?: InputMaybe<menu_item_variance_order_by>
}

/** input type for inserting array relation for remote table "menu_item" */
export interface menu_item_arr_rel_insert_input {
  data: Array<menu_item_insert_input>
  /** upsert condition */
  on_conflict?: InputMaybe<menu_item_on_conflict>
}

/** order by avg() on columns of table "menu_item" */
export interface menu_item_avg_order_by {
  price?: InputMaybe<order_by>
}

/** Boolean expression to filter rows from the table "menu_item". All fields are combined with a logical 'AND'. */
export interface menu_item_bool_exp {
  _and?: InputMaybe<Array<menu_item_bool_exp>>
  _not?: InputMaybe<menu_item_bool_exp>
  _or?: InputMaybe<Array<menu_item_bool_exp>>
  created_at?: InputMaybe<timestamptz_comparison_exp>
  description?: InputMaybe<String_comparison_exp>
  id?: InputMaybe<uuid_comparison_exp>
  image?: InputMaybe<String_comparison_exp>
  location?: InputMaybe<geometry_comparison_exp>
  name?: InputMaybe<String_comparison_exp>
  price?: InputMaybe<Int_comparison_exp>
  restaurant?: InputMaybe<restaurant_bool_exp>
  restaurant_id?: InputMaybe<uuid_comparison_exp>
  updated_at?: InputMaybe<timestamptz_comparison_exp>
}

/** unique or primary key constraints on table "menu_item" */
export enum menu_item_constraint {
  /** unique or primary key constraint on columns "id" */
  menu_item_pkey = 'menu_item_pkey',
  /** unique or primary key constraint on columns "name", "restaurant_id" */
  menu_item_restaurant_id_name_key = 'menu_item_restaurant_id_name_key',
}

/** input type for incrementing numeric columns in table "menu_item" */
export interface menu_item_inc_input {
  price?: InputMaybe<Scalars['Int']>
}

/** input type for inserting data into table "menu_item" */
export interface menu_item_insert_input {
  created_at?: InputMaybe<Scalars['timestamptz']>
  description?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['uuid']>
  image?: InputMaybe<Scalars['String']>
  location?: InputMaybe<Scalars['geometry']>
  name?: InputMaybe<Scalars['String']>
  price?: InputMaybe<Scalars['Int']>
  restaurant?: InputMaybe<restaurant_obj_rel_insert_input>
  restaurant_id?: InputMaybe<Scalars['uuid']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
}

/** order by max() on columns of table "menu_item" */
export interface menu_item_max_order_by {
  created_at?: InputMaybe<order_by>
  description?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  image?: InputMaybe<order_by>
  name?: InputMaybe<order_by>
  price?: InputMaybe<order_by>
  restaurant_id?: InputMaybe<order_by>
  updated_at?: InputMaybe<order_by>
}

/** order by min() on columns of table "menu_item" */
export interface menu_item_min_order_by {
  created_at?: InputMaybe<order_by>
  description?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  image?: InputMaybe<order_by>
  name?: InputMaybe<order_by>
  price?: InputMaybe<order_by>
  restaurant_id?: InputMaybe<order_by>
  updated_at?: InputMaybe<order_by>
}

/** on_conflict condition type for table "menu_item" */
export interface menu_item_on_conflict {
  constraint: menu_item_constraint
  update_columns?: Array<menu_item_update_column>
  where?: InputMaybe<menu_item_bool_exp>
}

/** Ordering options when selecting data from "menu_item". */
export interface menu_item_order_by {
  created_at?: InputMaybe<order_by>
  description?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  image?: InputMaybe<order_by>
  location?: InputMaybe<order_by>
  name?: InputMaybe<order_by>
  price?: InputMaybe<order_by>
  restaurant?: InputMaybe<restaurant_order_by>
  restaurant_id?: InputMaybe<order_by>
  updated_at?: InputMaybe<order_by>
}

/** primary key columns input for table: menu_item */
export interface menu_item_pk_columns_input {
  id: Scalars['uuid']
}

/** select columns of table "menu_item" */
export enum menu_item_select_column {
  /** column name */
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  image = 'image',
  /** column name */
  location = 'location',
  /** column name */
  name = 'name',
  /** column name */
  price = 'price',
  /** column name */
  restaurant_id = 'restaurant_id',
  /** column name */
  updated_at = 'updated_at',
}

/** input type for updating data in table "menu_item" */
export interface menu_item_set_input {
  created_at?: InputMaybe<Scalars['timestamptz']>
  description?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['uuid']>
  image?: InputMaybe<Scalars['String']>
  location?: InputMaybe<Scalars['geometry']>
  name?: InputMaybe<Scalars['String']>
  price?: InputMaybe<Scalars['Int']>
  restaurant_id?: InputMaybe<Scalars['uuid']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
}

/** order by stddev() on columns of table "menu_item" */
export interface menu_item_stddev_order_by {
  price?: InputMaybe<order_by>
}

/** order by stddev_pop() on columns of table "menu_item" */
export interface menu_item_stddev_pop_order_by {
  price?: InputMaybe<order_by>
}

/** order by stddev_samp() on columns of table "menu_item" */
export interface menu_item_stddev_samp_order_by {
  price?: InputMaybe<order_by>
}

/** Streaming cursor of the table "menu_item" */
export interface menu_item_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: menu_item_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface menu_item_stream_cursor_value_input {
  created_at?: InputMaybe<Scalars['timestamptz']>
  description?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['uuid']>
  image?: InputMaybe<Scalars['String']>
  location?: InputMaybe<Scalars['geometry']>
  name?: InputMaybe<Scalars['String']>
  price?: InputMaybe<Scalars['Int']>
  restaurant_id?: InputMaybe<Scalars['uuid']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
}

/** order by sum() on columns of table "menu_item" */
export interface menu_item_sum_order_by {
  price?: InputMaybe<order_by>
}

/** update columns of table "menu_item" */
export enum menu_item_update_column {
  /** column name */
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  id = 'id',
  /** column name */
  image = 'image',
  /** column name */
  location = 'location',
  /** column name */
  name = 'name',
  /** column name */
  price = 'price',
  /** column name */
  restaurant_id = 'restaurant_id',
  /** column name */
  updated_at = 'updated_at',
}

export interface menu_item_updates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<menu_item_inc_input>
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<menu_item_set_input>
  where: menu_item_bool_exp
}

/** order by var_pop() on columns of table "menu_item" */
export interface menu_item_var_pop_order_by {
  price?: InputMaybe<order_by>
}

/** order by var_samp() on columns of table "menu_item" */
export interface menu_item_var_samp_order_by {
  price?: InputMaybe<order_by>
}

/** order by variance() on columns of table "menu_item" */
export interface menu_item_variance_order_by {
  price?: InputMaybe<order_by>
}

/** Boolean expression to filter rows from the table "nhood_labels". All fields are combined with a logical 'AND'. */
export interface nhood_labels_bool_exp {
  _and?: InputMaybe<Array<nhood_labels_bool_exp>>
  _not?: InputMaybe<nhood_labels_bool_exp>
  _or?: InputMaybe<Array<nhood_labels_bool_exp>>
  center?: InputMaybe<geometry_comparison_exp>
  name?: InputMaybe<String_comparison_exp>
  ogc_fid?: InputMaybe<Int_comparison_exp>
}

/** unique or primary key constraints on table "nhood_labels" */
export enum nhood_labels_constraint {
  /** unique or primary key constraint on columns "ogc_fid" */
  nhood_labels_pkey = 'nhood_labels_pkey',
}

/** input type for incrementing numeric columns in table "nhood_labels" */
export interface nhood_labels_inc_input {
  ogc_fid?: InputMaybe<Scalars['Int']>
}

/** input type for inserting data into table "nhood_labels" */
export interface nhood_labels_insert_input {
  center?: InputMaybe<Scalars['geometry']>
  name?: InputMaybe<Scalars['String']>
  ogc_fid?: InputMaybe<Scalars['Int']>
}

/** on_conflict condition type for table "nhood_labels" */
export interface nhood_labels_on_conflict {
  constraint: nhood_labels_constraint
  update_columns?: Array<nhood_labels_update_column>
  where?: InputMaybe<nhood_labels_bool_exp>
}

/** Ordering options when selecting data from "nhood_labels". */
export interface nhood_labels_order_by {
  center?: InputMaybe<order_by>
  name?: InputMaybe<order_by>
  ogc_fid?: InputMaybe<order_by>
}

/** primary key columns input for table: nhood_labels */
export interface nhood_labels_pk_columns_input {
  ogc_fid: Scalars['Int']
}

/** select columns of table "nhood_labels" */
export enum nhood_labels_select_column {
  /** column name */
  center = 'center',
  /** column name */
  name = 'name',
  /** column name */
  ogc_fid = 'ogc_fid',
}

/** input type for updating data in table "nhood_labels" */
export interface nhood_labels_set_input {
  center?: InputMaybe<Scalars['geometry']>
  name?: InputMaybe<Scalars['String']>
  ogc_fid?: InputMaybe<Scalars['Int']>
}

/** Streaming cursor of the table "nhood_labels" */
export interface nhood_labels_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: nhood_labels_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface nhood_labels_stream_cursor_value_input {
  center?: InputMaybe<Scalars['geometry']>
  name?: InputMaybe<Scalars['String']>
  ogc_fid?: InputMaybe<Scalars['Int']>
}

/** update columns of table "nhood_labels" */
export enum nhood_labels_update_column {
  /** column name */
  center = 'center',
  /** column name */
  name = 'name',
  /** column name */
  ogc_fid = 'ogc_fid',
}

export interface nhood_labels_updates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<nhood_labels_inc_input>
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<nhood_labels_set_input>
  where: nhood_labels_bool_exp
}

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export interface numeric_comparison_exp {
  _eq?: InputMaybe<Scalars['numeric']>
  _gt?: InputMaybe<Scalars['numeric']>
  _gte?: InputMaybe<Scalars['numeric']>
  _in?: InputMaybe<Array<Scalars['numeric']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _lt?: InputMaybe<Scalars['numeric']>
  _lte?: InputMaybe<Scalars['numeric']>
  _neq?: InputMaybe<Scalars['numeric']>
  _nin?: InputMaybe<Array<Scalars['numeric']>>
}

/** Boolean expression to filter rows from the table "opening_hours". All fields are combined with a logical 'AND'. */
export interface opening_hours_bool_exp {
  _and?: InputMaybe<Array<opening_hours_bool_exp>>
  _not?: InputMaybe<opening_hours_bool_exp>
  _or?: InputMaybe<Array<opening_hours_bool_exp>>
  hours?: InputMaybe<tsrange_comparison_exp>
  id?: InputMaybe<uuid_comparison_exp>
  restaurant?: InputMaybe<restaurant_bool_exp>
  restaurant_id?: InputMaybe<uuid_comparison_exp>
}

/** unique or primary key constraints on table "opening_hours" */
export enum opening_hours_constraint {
  /** unique or primary key constraint on columns "id" */
  opening_hours_pkey = 'opening_hours_pkey',
}

/** input type for inserting data into table "opening_hours" */
export interface opening_hours_insert_input {
  hours?: InputMaybe<Scalars['tsrange']>
  id?: InputMaybe<Scalars['uuid']>
  restaurant?: InputMaybe<restaurant_obj_rel_insert_input>
  restaurant_id?: InputMaybe<Scalars['uuid']>
}

/** on_conflict condition type for table "opening_hours" */
export interface opening_hours_on_conflict {
  constraint: opening_hours_constraint
  update_columns?: Array<opening_hours_update_column>
  where?: InputMaybe<opening_hours_bool_exp>
}

/** Ordering options when selecting data from "opening_hours". */
export interface opening_hours_order_by {
  hours?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  restaurant?: InputMaybe<restaurant_order_by>
  restaurant_id?: InputMaybe<order_by>
}

/** primary key columns input for table: opening_hours */
export interface opening_hours_pk_columns_input {
  id: Scalars['uuid']
}

/** select columns of table "opening_hours" */
export enum opening_hours_select_column {
  /** column name */
  hours = 'hours',
  /** column name */
  id = 'id',
  /** column name */
  restaurant_id = 'restaurant_id',
}

/** input type for updating data in table "opening_hours" */
export interface opening_hours_set_input {
  hours?: InputMaybe<Scalars['tsrange']>
  id?: InputMaybe<Scalars['uuid']>
  restaurant_id?: InputMaybe<Scalars['uuid']>
}

/** Streaming cursor of the table "opening_hours" */
export interface opening_hours_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: opening_hours_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface opening_hours_stream_cursor_value_input {
  hours?: InputMaybe<Scalars['tsrange']>
  id?: InputMaybe<Scalars['uuid']>
  restaurant_id?: InputMaybe<Scalars['uuid']>
}

/** update columns of table "opening_hours" */
export enum opening_hours_update_column {
  /** column name */
  hours = 'hours',
  /** column name */
  id = 'id',
  /** column name */
  restaurant_id = 'restaurant_id',
}

export interface opening_hours_updates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<opening_hours_set_input>
  where: opening_hours_bool_exp
}

/** column ordering options */
export enum order_by {
  /** in ascending order, nulls last */
  asc = 'asc',
  /** in ascending order, nulls first */
  asc_nulls_first = 'asc_nulls_first',
  /** in ascending order, nulls last */
  asc_nulls_last = 'asc_nulls_last',
  /** in descending order, nulls first */
  desc = 'desc',
  /** in descending order, nulls first */
  desc_nulls_first = 'desc_nulls_first',
  /** in descending order, nulls last */
  desc_nulls_last = 'desc_nulls_last',
}

/** append existing jsonb value of filtered columns with new jsonb value */
export interface photo_append_input {
  categories?: InputMaybe<Scalars['jsonb']>
}

/** Boolean expression to filter rows from the table "photo". All fields are combined with a logical 'AND'. */
export interface photo_bool_exp {
  _and?: InputMaybe<Array<photo_bool_exp>>
  _not?: InputMaybe<photo_bool_exp>
  _or?: InputMaybe<Array<photo_bool_exp>>
  categories?: InputMaybe<jsonb_comparison_exp>
  created_at?: InputMaybe<timestamptz_comparison_exp>
  id?: InputMaybe<uuid_comparison_exp>
  origin?: InputMaybe<String_comparison_exp>
  quality?: InputMaybe<numeric_comparison_exp>
  updated_at?: InputMaybe<timestamptz_comparison_exp>
  url?: InputMaybe<String_comparison_exp>
  user_id?: InputMaybe<uuid_comparison_exp>
}

/** unique or primary key constraints on table "photo" */
export enum photo_constraint {
  /** unique or primary key constraint on columns "origin" */
  photo_origin_key = 'photo_origin_key',
  /** unique or primary key constraint on columns "url" */
  photo_url_key = 'photo_url_key',
  /** unique or primary key constraint on columns "id" */
  photos_pkey = 'photos_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface photo_delete_at_path_input {
  categories?: InputMaybe<Array<Scalars['String']>>
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface photo_delete_elem_input {
  categories?: InputMaybe<Scalars['Int']>
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface photo_delete_key_input {
  categories?: InputMaybe<Scalars['String']>
}

/** input type for incrementing numeric columns in table "photo" */
export interface photo_inc_input {
  quality?: InputMaybe<Scalars['numeric']>
}

/** input type for inserting data into table "photo" */
export interface photo_insert_input {
  categories?: InputMaybe<Scalars['jsonb']>
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  origin?: InputMaybe<Scalars['String']>
  quality?: InputMaybe<Scalars['numeric']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
  url?: InputMaybe<Scalars['String']>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** input type for inserting object relation for remote table "photo" */
export interface photo_obj_rel_insert_input {
  data: photo_insert_input
  /** upsert condition */
  on_conflict?: InputMaybe<photo_on_conflict>
}

/** on_conflict condition type for table "photo" */
export interface photo_on_conflict {
  constraint: photo_constraint
  update_columns?: Array<photo_update_column>
  where?: InputMaybe<photo_bool_exp>
}

/** Ordering options when selecting data from "photo". */
export interface photo_order_by {
  categories?: InputMaybe<order_by>
  created_at?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  origin?: InputMaybe<order_by>
  quality?: InputMaybe<order_by>
  updated_at?: InputMaybe<order_by>
  url?: InputMaybe<order_by>
  user_id?: InputMaybe<order_by>
}

/** primary key columns input for table: photo */
export interface photo_pk_columns_input {
  id: Scalars['uuid']
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface photo_prepend_input {
  categories?: InputMaybe<Scalars['jsonb']>
}

/** select columns of table "photo" */
export enum photo_select_column {
  /** column name */
  categories = 'categories',
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  origin = 'origin',
  /** column name */
  quality = 'quality',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  url = 'url',
  /** column name */
  user_id = 'user_id',
}

/** input type for updating data in table "photo" */
export interface photo_set_input {
  categories?: InputMaybe<Scalars['jsonb']>
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  origin?: InputMaybe<Scalars['String']>
  quality?: InputMaybe<Scalars['numeric']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
  url?: InputMaybe<Scalars['String']>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** Streaming cursor of the table "photo" */
export interface photo_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: photo_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface photo_stream_cursor_value_input {
  categories?: InputMaybe<Scalars['jsonb']>
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  origin?: InputMaybe<Scalars['String']>
  quality?: InputMaybe<Scalars['numeric']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
  url?: InputMaybe<Scalars['String']>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** update columns of table "photo" */
export enum photo_update_column {
  /** column name */
  categories = 'categories',
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  origin = 'origin',
  /** column name */
  quality = 'quality',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  url = 'url',
  /** column name */
  user_id = 'user_id',
}

export interface photo_updates {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<photo_append_input>
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<photo_delete_at_path_input>
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<photo_delete_elem_input>
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<photo_delete_key_input>
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<photo_inc_input>
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<photo_prepend_input>
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<photo_set_input>
  where: photo_bool_exp
}

export interface photo_xref_aggregate_bool_exp {
  count?: InputMaybe<photo_xref_aggregate_bool_exp_count>
}

export interface photo_xref_aggregate_bool_exp_count {
  arguments?: InputMaybe<Array<photo_xref_select_column>>
  distinct?: InputMaybe<Scalars['Boolean']>
  filter?: InputMaybe<photo_xref_bool_exp>
  predicate: Int_comparison_exp
}

/** order by aggregate values of table "photo_xref" */
export interface photo_xref_aggregate_order_by {
  count?: InputMaybe<order_by>
  max?: InputMaybe<photo_xref_max_order_by>
  min?: InputMaybe<photo_xref_min_order_by>
}

/** input type for inserting array relation for remote table "photo_xref" */
export interface photo_xref_arr_rel_insert_input {
  data: Array<photo_xref_insert_input>
  /** upsert condition */
  on_conflict?: InputMaybe<photo_xref_on_conflict>
}

/** Boolean expression to filter rows from the table "photo_xref". All fields are combined with a logical 'AND'. */
export interface photo_xref_bool_exp {
  _and?: InputMaybe<Array<photo_xref_bool_exp>>
  _not?: InputMaybe<photo_xref_bool_exp>
  _or?: InputMaybe<Array<photo_xref_bool_exp>>
  id?: InputMaybe<uuid_comparison_exp>
  photo?: InputMaybe<photo_bool_exp>
  photo_id?: InputMaybe<uuid_comparison_exp>
  restaurant?: InputMaybe<restaurant_bool_exp>
  restaurant_id?: InputMaybe<uuid_comparison_exp>
  review_id?: InputMaybe<uuid_comparison_exp>
  tag_id?: InputMaybe<uuid_comparison_exp>
  type?: InputMaybe<String_comparison_exp>
  user_id?: InputMaybe<uuid_comparison_exp>
}

/** unique or primary key constraints on table "photo_xref" */
export enum photo_xref_constraint {
  /** unique or primary key constraint on columns "photo_id", "tag_id", "restaurant_id" */
  photos_xref_photos_id_restaurant_id_tag_id_key = 'photos_xref_photos_id_restaurant_id_tag_id_key',
  /** unique or primary key constraint on columns "id" */
  photos_xref_pkey = 'photos_xref_pkey',
}

/** input type for inserting data into table "photo_xref" */
export interface photo_xref_insert_input {
  id?: InputMaybe<Scalars['uuid']>
  photo?: InputMaybe<photo_obj_rel_insert_input>
  photo_id?: InputMaybe<Scalars['uuid']>
  restaurant?: InputMaybe<restaurant_obj_rel_insert_input>
  restaurant_id?: InputMaybe<Scalars['uuid']>
  review_id?: InputMaybe<Scalars['uuid']>
  tag_id?: InputMaybe<Scalars['uuid']>
  type?: InputMaybe<Scalars['String']>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** order by max() on columns of table "photo_xref" */
export interface photo_xref_max_order_by {
  id?: InputMaybe<order_by>
  photo_id?: InputMaybe<order_by>
  restaurant_id?: InputMaybe<order_by>
  review_id?: InputMaybe<order_by>
  tag_id?: InputMaybe<order_by>
  type?: InputMaybe<order_by>
  user_id?: InputMaybe<order_by>
}

/** order by min() on columns of table "photo_xref" */
export interface photo_xref_min_order_by {
  id?: InputMaybe<order_by>
  photo_id?: InputMaybe<order_by>
  restaurant_id?: InputMaybe<order_by>
  review_id?: InputMaybe<order_by>
  tag_id?: InputMaybe<order_by>
  type?: InputMaybe<order_by>
  user_id?: InputMaybe<order_by>
}

/** on_conflict condition type for table "photo_xref" */
export interface photo_xref_on_conflict {
  constraint: photo_xref_constraint
  update_columns?: Array<photo_xref_update_column>
  where?: InputMaybe<photo_xref_bool_exp>
}

/** Ordering options when selecting data from "photo_xref". */
export interface photo_xref_order_by {
  id?: InputMaybe<order_by>
  photo?: InputMaybe<photo_order_by>
  photo_id?: InputMaybe<order_by>
  restaurant?: InputMaybe<restaurant_order_by>
  restaurant_id?: InputMaybe<order_by>
  review_id?: InputMaybe<order_by>
  tag_id?: InputMaybe<order_by>
  type?: InputMaybe<order_by>
  user_id?: InputMaybe<order_by>
}

/** primary key columns input for table: photo_xref */
export interface photo_xref_pk_columns_input {
  id: Scalars['uuid']
}

/** select columns of table "photo_xref" */
export enum photo_xref_select_column {
  /** column name */
  id = 'id',
  /** column name */
  photo_id = 'photo_id',
  /** column name */
  restaurant_id = 'restaurant_id',
  /** column name */
  review_id = 'review_id',
  /** column name */
  tag_id = 'tag_id',
  /** column name */
  type = 'type',
  /** column name */
  user_id = 'user_id',
}

/** input type for updating data in table "photo_xref" */
export interface photo_xref_set_input {
  id?: InputMaybe<Scalars['uuid']>
  photo_id?: InputMaybe<Scalars['uuid']>
  restaurant_id?: InputMaybe<Scalars['uuid']>
  review_id?: InputMaybe<Scalars['uuid']>
  tag_id?: InputMaybe<Scalars['uuid']>
  type?: InputMaybe<Scalars['String']>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** Streaming cursor of the table "photo_xref" */
export interface photo_xref_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: photo_xref_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface photo_xref_stream_cursor_value_input {
  id?: InputMaybe<Scalars['uuid']>
  photo_id?: InputMaybe<Scalars['uuid']>
  restaurant_id?: InputMaybe<Scalars['uuid']>
  review_id?: InputMaybe<Scalars['uuid']>
  tag_id?: InputMaybe<Scalars['uuid']>
  type?: InputMaybe<Scalars['String']>
  user_id?: InputMaybe<Scalars['uuid']>
}

/** update columns of table "photo_xref" */
export enum photo_xref_update_column {
  /** column name */
  id = 'id',
  /** column name */
  photo_id = 'photo_id',
  /** column name */
  restaurant_id = 'restaurant_id',
  /** column name */
  review_id = 'review_id',
  /** column name */
  tag_id = 'tag_id',
  /** column name */
  type = 'type',
  /** column name */
  user_id = 'user_id',
}

export interface photo_xref_updates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<photo_xref_set_input>
  where: photo_xref_bool_exp
}

export interface restaurant_aggregate_bool_exp {
  bool_and?: InputMaybe<restaurant_aggregate_bool_exp_bool_and>
  bool_or?: InputMaybe<restaurant_aggregate_bool_exp_bool_or>
  count?: InputMaybe<restaurant_aggregate_bool_exp_count>
}

export interface restaurant_aggregate_bool_exp_bool_and {
  arguments: restaurant_select_column_restaurant_aggregate_bool_exp_bool_and_arguments_columns
  distinct?: InputMaybe<Scalars['Boolean']>
  filter?: InputMaybe<restaurant_bool_exp>
  predicate: Boolean_comparison_exp
}

export interface restaurant_aggregate_bool_exp_bool_or {
  arguments: restaurant_select_column_restaurant_aggregate_bool_exp_bool_or_arguments_columns
  distinct?: InputMaybe<Scalars['Boolean']>
  filter?: InputMaybe<restaurant_bool_exp>
  predicate: Boolean_comparison_exp
}

export interface restaurant_aggregate_bool_exp_count {
  arguments?: InputMaybe<Array<restaurant_select_column>>
  distinct?: InputMaybe<Scalars['Boolean']>
  filter?: InputMaybe<restaurant_bool_exp>
  predicate: Int_comparison_exp
}

/** order by aggregate values of table "restaurant" */
export interface restaurant_aggregate_order_by {
  avg?: InputMaybe<restaurant_avg_order_by>
  count?: InputMaybe<order_by>
  max?: InputMaybe<restaurant_max_order_by>
  min?: InputMaybe<restaurant_min_order_by>
  stddev?: InputMaybe<restaurant_stddev_order_by>
  stddev_pop?: InputMaybe<restaurant_stddev_pop_order_by>
  stddev_samp?: InputMaybe<restaurant_stddev_samp_order_by>
  sum?: InputMaybe<restaurant_sum_order_by>
  var_pop?: InputMaybe<restaurant_var_pop_order_by>
  var_samp?: InputMaybe<restaurant_var_samp_order_by>
  variance?: InputMaybe<restaurant_variance_order_by>
}

/** append existing jsonb value of filtered columns with new jsonb value */
export interface restaurant_append_input {
  external_source_info?: InputMaybe<Scalars['jsonb']>
  headlines?: InputMaybe<Scalars['jsonb']>
  hours?: InputMaybe<Scalars['jsonb']>
  og_source_ids?: InputMaybe<Scalars['jsonb']>
  photos?: InputMaybe<Scalars['jsonb']>
  rating_factors?: InputMaybe<Scalars['jsonb']>
  score_breakdown?: InputMaybe<Scalars['jsonb']>
  scrape_metadata?: InputMaybe<Scalars['jsonb']>
  source_breakdown?: InputMaybe<Scalars['jsonb']>
  sources?: InputMaybe<Scalars['jsonb']>
  tag_names?: InputMaybe<Scalars['jsonb']>
}

/** input type for inserting array relation for remote table "restaurant" */
export interface restaurant_arr_rel_insert_input {
  data: Array<restaurant_insert_input>
  /** upsert condition */
  on_conflict?: InputMaybe<restaurant_on_conflict>
}

/** order by avg() on columns of table "restaurant" */
export interface restaurant_avg_order_by {
  downvotes?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  score?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
  zip?: InputMaybe<order_by>
}

/** Boolean expression to filter rows from the table "restaurant". All fields are combined with a logical 'AND'. */
export interface restaurant_bool_exp {
  _and?: InputMaybe<Array<restaurant_bool_exp>>
  _not?: InputMaybe<restaurant_bool_exp>
  _or?: InputMaybe<Array<restaurant_bool_exp>>
  address?: InputMaybe<String_comparison_exp>
  city?: InputMaybe<String_comparison_exp>
  created_at?: InputMaybe<timestamptz_comparison_exp>
  description?: InputMaybe<String_comparison_exp>
  downvotes?: InputMaybe<numeric_comparison_exp>
  external_source_info?: InputMaybe<jsonb_comparison_exp>
  geocoder_id?: InputMaybe<String_comparison_exp>
  headlines?: InputMaybe<jsonb_comparison_exp>
  hours?: InputMaybe<jsonb_comparison_exp>
  id?: InputMaybe<uuid_comparison_exp>
  image?: InputMaybe<String_comparison_exp>
  is_open_now?: InputMaybe<Boolean_comparison_exp>
  is_out_of_business?: InputMaybe<Boolean_comparison_exp>
  lists?: InputMaybe<list_restaurant_bool_exp>
  lists_aggregate?: InputMaybe<list_restaurant_aggregate_bool_exp>
  location?: InputMaybe<geometry_comparison_exp>
  menu_items?: InputMaybe<menu_item_bool_exp>
  menu_items_aggregate?: InputMaybe<menu_item_aggregate_bool_exp>
  name?: InputMaybe<String_comparison_exp>
  og_source_ids?: InputMaybe<jsonb_comparison_exp>
  oldest_review_date?: InputMaybe<timestamptz_comparison_exp>
  photo_table?: InputMaybe<photo_xref_bool_exp>
  photo_table_aggregate?: InputMaybe<photo_xref_aggregate_bool_exp>
  photos?: InputMaybe<jsonb_comparison_exp>
  price_range?: InputMaybe<String_comparison_exp>
  rating?: InputMaybe<numeric_comparison_exp>
  rating_factors?: InputMaybe<jsonb_comparison_exp>
  reviews?: InputMaybe<review_bool_exp>
  reviews_aggregate?: InputMaybe<review_aggregate_bool_exp>
  score?: InputMaybe<numeric_comparison_exp>
  score_breakdown?: InputMaybe<jsonb_comparison_exp>
  scrape_metadata?: InputMaybe<jsonb_comparison_exp>
  slug?: InputMaybe<String_comparison_exp>
  source_breakdown?: InputMaybe<jsonb_comparison_exp>
  sources?: InputMaybe<jsonb_comparison_exp>
  state?: InputMaybe<String_comparison_exp>
  summary?: InputMaybe<String_comparison_exp>
  tag_names?: InputMaybe<jsonb_comparison_exp>
  tags?: InputMaybe<restaurant_tag_bool_exp>
  tags_aggregate?: InputMaybe<restaurant_tag_aggregate_bool_exp>
  telephone?: InputMaybe<String_comparison_exp>
  updated_at?: InputMaybe<timestamptz_comparison_exp>
  upvotes?: InputMaybe<numeric_comparison_exp>
  votes_ratio?: InputMaybe<numeric_comparison_exp>
  website?: InputMaybe<String_comparison_exp>
  zip?: InputMaybe<numeric_comparison_exp>
}

/** unique or primary key constraints on table "restaurant" */
export enum restaurant_constraint {
  /** unique or primary key constraint on columns "geocoder_id" */
  restaurant_geocoder_id_key = 'restaurant_geocoder_id_key',
  /** unique or primary key constraint on columns "name", "address" */
  restaurant_name_address_key = 'restaurant_name_address_key',
  /** unique or primary key constraint on columns "id" */
  restaurant_pkey = 'restaurant_pkey',
  /** unique or primary key constraint on columns "slug" */
  restaurant_slug_key = 'restaurant_slug_key',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface restaurant_delete_at_path_input {
  external_source_info?: InputMaybe<Array<Scalars['String']>>
  headlines?: InputMaybe<Array<Scalars['String']>>
  hours?: InputMaybe<Array<Scalars['String']>>
  og_source_ids?: InputMaybe<Array<Scalars['String']>>
  photos?: InputMaybe<Array<Scalars['String']>>
  rating_factors?: InputMaybe<Array<Scalars['String']>>
  score_breakdown?: InputMaybe<Array<Scalars['String']>>
  scrape_metadata?: InputMaybe<Array<Scalars['String']>>
  source_breakdown?: InputMaybe<Array<Scalars['String']>>
  sources?: InputMaybe<Array<Scalars['String']>>
  tag_names?: InputMaybe<Array<Scalars['String']>>
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface restaurant_delete_elem_input {
  external_source_info?: InputMaybe<Scalars['Int']>
  headlines?: InputMaybe<Scalars['Int']>
  hours?: InputMaybe<Scalars['Int']>
  og_source_ids?: InputMaybe<Scalars['Int']>
  photos?: InputMaybe<Scalars['Int']>
  rating_factors?: InputMaybe<Scalars['Int']>
  score_breakdown?: InputMaybe<Scalars['Int']>
  scrape_metadata?: InputMaybe<Scalars['Int']>
  source_breakdown?: InputMaybe<Scalars['Int']>
  sources?: InputMaybe<Scalars['Int']>
  tag_names?: InputMaybe<Scalars['Int']>
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface restaurant_delete_key_input {
  external_source_info?: InputMaybe<Scalars['String']>
  headlines?: InputMaybe<Scalars['String']>
  hours?: InputMaybe<Scalars['String']>
  og_source_ids?: InputMaybe<Scalars['String']>
  photos?: InputMaybe<Scalars['String']>
  rating_factors?: InputMaybe<Scalars['String']>
  score_breakdown?: InputMaybe<Scalars['String']>
  scrape_metadata?: InputMaybe<Scalars['String']>
  source_breakdown?: InputMaybe<Scalars['String']>
  sources?: InputMaybe<Scalars['String']>
  tag_names?: InputMaybe<Scalars['String']>
}

/** input type for incrementing numeric columns in table "restaurant" */
export interface restaurant_inc_input {
  downvotes?: InputMaybe<Scalars['numeric']>
  rating?: InputMaybe<Scalars['numeric']>
  score?: InputMaybe<Scalars['numeric']>
  upvotes?: InputMaybe<Scalars['numeric']>
  votes_ratio?: InputMaybe<Scalars['numeric']>
  zip?: InputMaybe<Scalars['numeric']>
}

/** input type for inserting data into table "restaurant" */
export interface restaurant_insert_input {
  address?: InputMaybe<Scalars['String']>
  city?: InputMaybe<Scalars['String']>
  created_at?: InputMaybe<Scalars['timestamptz']>
  description?: InputMaybe<Scalars['String']>
  downvotes?: InputMaybe<Scalars['numeric']>
  external_source_info?: InputMaybe<Scalars['jsonb']>
  geocoder_id?: InputMaybe<Scalars['String']>
  headlines?: InputMaybe<Scalars['jsonb']>
  hours?: InputMaybe<Scalars['jsonb']>
  id?: InputMaybe<Scalars['uuid']>
  image?: InputMaybe<Scalars['String']>
  is_out_of_business?: InputMaybe<Scalars['Boolean']>
  lists?: InputMaybe<list_restaurant_arr_rel_insert_input>
  location?: InputMaybe<Scalars['geometry']>
  menu_items?: InputMaybe<menu_item_arr_rel_insert_input>
  name?: InputMaybe<Scalars['String']>
  og_source_ids?: InputMaybe<Scalars['jsonb']>
  oldest_review_date?: InputMaybe<Scalars['timestamptz']>
  photo_table?: InputMaybe<photo_xref_arr_rel_insert_input>
  photos?: InputMaybe<Scalars['jsonb']>
  price_range?: InputMaybe<Scalars['String']>
  rating?: InputMaybe<Scalars['numeric']>
  rating_factors?: InputMaybe<Scalars['jsonb']>
  reviews?: InputMaybe<review_arr_rel_insert_input>
  score?: InputMaybe<Scalars['numeric']>
  score_breakdown?: InputMaybe<Scalars['jsonb']>
  scrape_metadata?: InputMaybe<Scalars['jsonb']>
  slug?: InputMaybe<Scalars['String']>
  source_breakdown?: InputMaybe<Scalars['jsonb']>
  sources?: InputMaybe<Scalars['jsonb']>
  state?: InputMaybe<Scalars['String']>
  summary?: InputMaybe<Scalars['String']>
  tag_names?: InputMaybe<Scalars['jsonb']>
  tags?: InputMaybe<restaurant_tag_arr_rel_insert_input>
  telephone?: InputMaybe<Scalars['String']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
  upvotes?: InputMaybe<Scalars['numeric']>
  votes_ratio?: InputMaybe<Scalars['numeric']>
  website?: InputMaybe<Scalars['String']>
  zip?: InputMaybe<Scalars['numeric']>
}

/** order by max() on columns of table "restaurant" */
export interface restaurant_max_order_by {
  address?: InputMaybe<order_by>
  city?: InputMaybe<order_by>
  created_at?: InputMaybe<order_by>
  description?: InputMaybe<order_by>
  downvotes?: InputMaybe<order_by>
  geocoder_id?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  image?: InputMaybe<order_by>
  name?: InputMaybe<order_by>
  oldest_review_date?: InputMaybe<order_by>
  price_range?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  score?: InputMaybe<order_by>
  slug?: InputMaybe<order_by>
  state?: InputMaybe<order_by>
  summary?: InputMaybe<order_by>
  telephone?: InputMaybe<order_by>
  updated_at?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
  website?: InputMaybe<order_by>
  zip?: InputMaybe<order_by>
}

/** order by min() on columns of table "restaurant" */
export interface restaurant_min_order_by {
  address?: InputMaybe<order_by>
  city?: InputMaybe<order_by>
  created_at?: InputMaybe<order_by>
  description?: InputMaybe<order_by>
  downvotes?: InputMaybe<order_by>
  geocoder_id?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  image?: InputMaybe<order_by>
  name?: InputMaybe<order_by>
  oldest_review_date?: InputMaybe<order_by>
  price_range?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  score?: InputMaybe<order_by>
  slug?: InputMaybe<order_by>
  state?: InputMaybe<order_by>
  summary?: InputMaybe<order_by>
  telephone?: InputMaybe<order_by>
  updated_at?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
  website?: InputMaybe<order_by>
  zip?: InputMaybe<order_by>
}

export interface restaurant_new_args {
  region_slug?: InputMaybe<Scalars['String']>
}

/** input type for inserting object relation for remote table "restaurant" */
export interface restaurant_obj_rel_insert_input {
  data: restaurant_insert_input
  /** upsert condition */
  on_conflict?: InputMaybe<restaurant_on_conflict>
}

/** on_conflict condition type for table "restaurant" */
export interface restaurant_on_conflict {
  constraint: restaurant_constraint
  update_columns?: Array<restaurant_update_column>
  where?: InputMaybe<restaurant_bool_exp>
}

/** Ordering options when selecting data from "restaurant". */
export interface restaurant_order_by {
  address?: InputMaybe<order_by>
  city?: InputMaybe<order_by>
  created_at?: InputMaybe<order_by>
  description?: InputMaybe<order_by>
  downvotes?: InputMaybe<order_by>
  external_source_info?: InputMaybe<order_by>
  geocoder_id?: InputMaybe<order_by>
  headlines?: InputMaybe<order_by>
  hours?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  image?: InputMaybe<order_by>
  is_open_now?: InputMaybe<order_by>
  is_out_of_business?: InputMaybe<order_by>
  lists_aggregate?: InputMaybe<list_restaurant_aggregate_order_by>
  location?: InputMaybe<order_by>
  menu_items_aggregate?: InputMaybe<menu_item_aggregate_order_by>
  name?: InputMaybe<order_by>
  og_source_ids?: InputMaybe<order_by>
  oldest_review_date?: InputMaybe<order_by>
  photo_table_aggregate?: InputMaybe<photo_xref_aggregate_order_by>
  photos?: InputMaybe<order_by>
  price_range?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  rating_factors?: InputMaybe<order_by>
  reviews_aggregate?: InputMaybe<review_aggregate_order_by>
  score?: InputMaybe<order_by>
  score_breakdown?: InputMaybe<order_by>
  scrape_metadata?: InputMaybe<order_by>
  slug?: InputMaybe<order_by>
  source_breakdown?: InputMaybe<order_by>
  sources?: InputMaybe<order_by>
  state?: InputMaybe<order_by>
  summary?: InputMaybe<order_by>
  tag_names?: InputMaybe<order_by>
  tags_aggregate?: InputMaybe<restaurant_tag_aggregate_order_by>
  telephone?: InputMaybe<order_by>
  updated_at?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
  website?: InputMaybe<order_by>
  zip?: InputMaybe<order_by>
}

/** primary key columns input for table: restaurant */
export interface restaurant_pk_columns_input {
  id: Scalars['uuid']
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface restaurant_prepend_input {
  external_source_info?: InputMaybe<Scalars['jsonb']>
  headlines?: InputMaybe<Scalars['jsonb']>
  hours?: InputMaybe<Scalars['jsonb']>
  og_source_ids?: InputMaybe<Scalars['jsonb']>
  photos?: InputMaybe<Scalars['jsonb']>
  rating_factors?: InputMaybe<Scalars['jsonb']>
  score_breakdown?: InputMaybe<Scalars['jsonb']>
  scrape_metadata?: InputMaybe<Scalars['jsonb']>
  source_breakdown?: InputMaybe<Scalars['jsonb']>
  sources?: InputMaybe<Scalars['jsonb']>
  tag_names?: InputMaybe<Scalars['jsonb']>
}

/** select columns of table "restaurant" */
export enum restaurant_select_column {
  /** column name */
  address = 'address',
  /** column name */
  city = 'city',
  /** column name */
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  downvotes = 'downvotes',
  /** column name */
  external_source_info = 'external_source_info',
  /** column name */
  geocoder_id = 'geocoder_id',
  /** column name */
  headlines = 'headlines',
  /** column name */
  hours = 'hours',
  /** column name */
  id = 'id',
  /** column name */
  image = 'image',
  /** column name */
  is_out_of_business = 'is_out_of_business',
  /** column name */
  location = 'location',
  /** column name */
  name = 'name',
  /** column name */
  og_source_ids = 'og_source_ids',
  /** column name */
  oldest_review_date = 'oldest_review_date',
  /** column name */
  photos = 'photos',
  /** column name */
  price_range = 'price_range',
  /** column name */
  rating = 'rating',
  /** column name */
  rating_factors = 'rating_factors',
  /** column name */
  score = 'score',
  /** column name */
  score_breakdown = 'score_breakdown',
  /** column name */
  scrape_metadata = 'scrape_metadata',
  /** column name */
  slug = 'slug',
  /** column name */
  source_breakdown = 'source_breakdown',
  /** column name */
  sources = 'sources',
  /** column name */
  state = 'state',
  /** column name */
  summary = 'summary',
  /** column name */
  tag_names = 'tag_names',
  /** column name */
  telephone = 'telephone',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  upvotes = 'upvotes',
  /** column name */
  votes_ratio = 'votes_ratio',
  /** column name */
  website = 'website',
  /** column name */
  zip = 'zip',
}

/** select "restaurant_aggregate_bool_exp_bool_and_arguments_columns" columns of table "restaurant" */
export enum restaurant_select_column_restaurant_aggregate_bool_exp_bool_and_arguments_columns {
  /** column name */
  is_out_of_business = 'is_out_of_business',
}

/** select "restaurant_aggregate_bool_exp_bool_or_arguments_columns" columns of table "restaurant" */
export enum restaurant_select_column_restaurant_aggregate_bool_exp_bool_or_arguments_columns {
  /** column name */
  is_out_of_business = 'is_out_of_business',
}

/** input type for updating data in table "restaurant" */
export interface restaurant_set_input {
  address?: InputMaybe<Scalars['String']>
  city?: InputMaybe<Scalars['String']>
  created_at?: InputMaybe<Scalars['timestamptz']>
  description?: InputMaybe<Scalars['String']>
  downvotes?: InputMaybe<Scalars['numeric']>
  external_source_info?: InputMaybe<Scalars['jsonb']>
  geocoder_id?: InputMaybe<Scalars['String']>
  headlines?: InputMaybe<Scalars['jsonb']>
  hours?: InputMaybe<Scalars['jsonb']>
  id?: InputMaybe<Scalars['uuid']>
  image?: InputMaybe<Scalars['String']>
  is_out_of_business?: InputMaybe<Scalars['Boolean']>
  location?: InputMaybe<Scalars['geometry']>
  name?: InputMaybe<Scalars['String']>
  og_source_ids?: InputMaybe<Scalars['jsonb']>
  oldest_review_date?: InputMaybe<Scalars['timestamptz']>
  photos?: InputMaybe<Scalars['jsonb']>
  price_range?: InputMaybe<Scalars['String']>
  rating?: InputMaybe<Scalars['numeric']>
  rating_factors?: InputMaybe<Scalars['jsonb']>
  score?: InputMaybe<Scalars['numeric']>
  score_breakdown?: InputMaybe<Scalars['jsonb']>
  scrape_metadata?: InputMaybe<Scalars['jsonb']>
  slug?: InputMaybe<Scalars['String']>
  source_breakdown?: InputMaybe<Scalars['jsonb']>
  sources?: InputMaybe<Scalars['jsonb']>
  state?: InputMaybe<Scalars['String']>
  summary?: InputMaybe<Scalars['String']>
  tag_names?: InputMaybe<Scalars['jsonb']>
  telephone?: InputMaybe<Scalars['String']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
  upvotes?: InputMaybe<Scalars['numeric']>
  votes_ratio?: InputMaybe<Scalars['numeric']>
  website?: InputMaybe<Scalars['String']>
  zip?: InputMaybe<Scalars['numeric']>
}

/** order by stddev() on columns of table "restaurant" */
export interface restaurant_stddev_order_by {
  downvotes?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  score?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
  zip?: InputMaybe<order_by>
}

/** order by stddev_pop() on columns of table "restaurant" */
export interface restaurant_stddev_pop_order_by {
  downvotes?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  score?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
  zip?: InputMaybe<order_by>
}

/** order by stddev_samp() on columns of table "restaurant" */
export interface restaurant_stddev_samp_order_by {
  downvotes?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  score?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
  zip?: InputMaybe<order_by>
}

/** Streaming cursor of the table "restaurant" */
export interface restaurant_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: restaurant_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface restaurant_stream_cursor_value_input {
  address?: InputMaybe<Scalars['String']>
  city?: InputMaybe<Scalars['String']>
  created_at?: InputMaybe<Scalars['timestamptz']>
  description?: InputMaybe<Scalars['String']>
  downvotes?: InputMaybe<Scalars['numeric']>
  external_source_info?: InputMaybe<Scalars['jsonb']>
  geocoder_id?: InputMaybe<Scalars['String']>
  headlines?: InputMaybe<Scalars['jsonb']>
  hours?: InputMaybe<Scalars['jsonb']>
  id?: InputMaybe<Scalars['uuid']>
  image?: InputMaybe<Scalars['String']>
  is_out_of_business?: InputMaybe<Scalars['Boolean']>
  location?: InputMaybe<Scalars['geometry']>
  name?: InputMaybe<Scalars['String']>
  og_source_ids?: InputMaybe<Scalars['jsonb']>
  oldest_review_date?: InputMaybe<Scalars['timestamptz']>
  photos?: InputMaybe<Scalars['jsonb']>
  price_range?: InputMaybe<Scalars['String']>
  rating?: InputMaybe<Scalars['numeric']>
  rating_factors?: InputMaybe<Scalars['jsonb']>
  score?: InputMaybe<Scalars['numeric']>
  score_breakdown?: InputMaybe<Scalars['jsonb']>
  scrape_metadata?: InputMaybe<Scalars['jsonb']>
  slug?: InputMaybe<Scalars['String']>
  source_breakdown?: InputMaybe<Scalars['jsonb']>
  sources?: InputMaybe<Scalars['jsonb']>
  state?: InputMaybe<Scalars['String']>
  summary?: InputMaybe<Scalars['String']>
  tag_names?: InputMaybe<Scalars['jsonb']>
  telephone?: InputMaybe<Scalars['String']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
  upvotes?: InputMaybe<Scalars['numeric']>
  votes_ratio?: InputMaybe<Scalars['numeric']>
  website?: InputMaybe<Scalars['String']>
  zip?: InputMaybe<Scalars['numeric']>
}

/** order by sum() on columns of table "restaurant" */
export interface restaurant_sum_order_by {
  downvotes?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  score?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
  zip?: InputMaybe<order_by>
}

export interface restaurant_tag_aggregate_bool_exp {
  count?: InputMaybe<restaurant_tag_aggregate_bool_exp_count>
}

export interface restaurant_tag_aggregate_bool_exp_count {
  arguments?: InputMaybe<Array<restaurant_tag_select_column>>
  distinct?: InputMaybe<Scalars['Boolean']>
  filter?: InputMaybe<restaurant_tag_bool_exp>
  predicate: Int_comparison_exp
}

/** order by aggregate values of table "restaurant_tag" */
export interface restaurant_tag_aggregate_order_by {
  avg?: InputMaybe<restaurant_tag_avg_order_by>
  count?: InputMaybe<order_by>
  max?: InputMaybe<restaurant_tag_max_order_by>
  min?: InputMaybe<restaurant_tag_min_order_by>
  stddev?: InputMaybe<restaurant_tag_stddev_order_by>
  stddev_pop?: InputMaybe<restaurant_tag_stddev_pop_order_by>
  stddev_samp?: InputMaybe<restaurant_tag_stddev_samp_order_by>
  sum?: InputMaybe<restaurant_tag_sum_order_by>
  var_pop?: InputMaybe<restaurant_tag_var_pop_order_by>
  var_samp?: InputMaybe<restaurant_tag_var_samp_order_by>
  variance?: InputMaybe<restaurant_tag_variance_order_by>
}

/** append existing jsonb value of filtered columns with new jsonb value */
export interface restaurant_tag_append_input {
  photos?: InputMaybe<Scalars['jsonb']>
  score_breakdown?: InputMaybe<Scalars['jsonb']>
  source_breakdown?: InputMaybe<Scalars['jsonb']>
}

/** input type for inserting array relation for remote table "restaurant_tag" */
export interface restaurant_tag_arr_rel_insert_input {
  data: Array<restaurant_tag_insert_input>
  /** upsert condition */
  on_conflict?: InputMaybe<restaurant_tag_on_conflict>
}

/** order by avg() on columns of table "restaurant_tag" */
export interface restaurant_tag_avg_order_by {
  downvotes?: InputMaybe<order_by>
  rank?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  review_mentions_count?: InputMaybe<order_by>
  score?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
}

/** Boolean expression to filter rows from the table "restaurant_tag". All fields are combined with a logical 'AND'. */
export interface restaurant_tag_bool_exp {
  _and?: InputMaybe<Array<restaurant_tag_bool_exp>>
  _not?: InputMaybe<restaurant_tag_bool_exp>
  _or?: InputMaybe<Array<restaurant_tag_bool_exp>>
  downvotes?: InputMaybe<numeric_comparison_exp>
  id?: InputMaybe<uuid_comparison_exp>
  photos?: InputMaybe<jsonb_comparison_exp>
  rank?: InputMaybe<Int_comparison_exp>
  rating?: InputMaybe<numeric_comparison_exp>
  restaurant?: InputMaybe<restaurant_bool_exp>
  restaurant_id?: InputMaybe<uuid_comparison_exp>
  review_mentions_count?: InputMaybe<numeric_comparison_exp>
  reviews?: InputMaybe<review_bool_exp>
  reviews_aggregate?: InputMaybe<review_aggregate_bool_exp>
  score?: InputMaybe<numeric_comparison_exp>
  score_breakdown?: InputMaybe<jsonb_comparison_exp>
  sentences?: InputMaybe<review_tag_sentence_bool_exp>
  sentences_aggregate?: InputMaybe<review_tag_sentence_aggregate_bool_exp>
  source_breakdown?: InputMaybe<jsonb_comparison_exp>
  tag?: InputMaybe<tag_bool_exp>
  tag_id?: InputMaybe<uuid_comparison_exp>
  upvotes?: InputMaybe<numeric_comparison_exp>
  votes_ratio?: InputMaybe<numeric_comparison_exp>
}

/** unique or primary key constraints on table "restaurant_tag" */
export enum restaurant_tag_constraint {
  /** unique or primary key constraint on columns "id" */
  restaurant_tag_id_key = 'restaurant_tag_id_key',
  /** unique or primary key constraint on columns "tag_id", "restaurant_id" */
  restaurant_tag_id_restaurant_id_pkey = 'restaurant_tag_id_restaurant_id_pkey',
  /** unique or primary key constraint on columns "tag_id", "restaurant_id" */
  restaurant_tag_pkey = 'restaurant_tag_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface restaurant_tag_delete_at_path_input {
  photos?: InputMaybe<Array<Scalars['String']>>
  score_breakdown?: InputMaybe<Array<Scalars['String']>>
  source_breakdown?: InputMaybe<Array<Scalars['String']>>
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface restaurant_tag_delete_elem_input {
  photos?: InputMaybe<Scalars['Int']>
  score_breakdown?: InputMaybe<Scalars['Int']>
  source_breakdown?: InputMaybe<Scalars['Int']>
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface restaurant_tag_delete_key_input {
  photos?: InputMaybe<Scalars['String']>
  score_breakdown?: InputMaybe<Scalars['String']>
  source_breakdown?: InputMaybe<Scalars['String']>
}

/** input type for incrementing numeric columns in table "restaurant_tag" */
export interface restaurant_tag_inc_input {
  downvotes?: InputMaybe<Scalars['numeric']>
  rank?: InputMaybe<Scalars['Int']>
  rating?: InputMaybe<Scalars['numeric']>
  review_mentions_count?: InputMaybe<Scalars['numeric']>
  score?: InputMaybe<Scalars['numeric']>
  upvotes?: InputMaybe<Scalars['numeric']>
  votes_ratio?: InputMaybe<Scalars['numeric']>
}

/** input type for inserting data into table "restaurant_tag" */
export interface restaurant_tag_insert_input {
  downvotes?: InputMaybe<Scalars['numeric']>
  id?: InputMaybe<Scalars['uuid']>
  photos?: InputMaybe<Scalars['jsonb']>
  rank?: InputMaybe<Scalars['Int']>
  rating?: InputMaybe<Scalars['numeric']>
  restaurant?: InputMaybe<restaurant_obj_rel_insert_input>
  restaurant_id?: InputMaybe<Scalars['uuid']>
  review_mentions_count?: InputMaybe<Scalars['numeric']>
  reviews?: InputMaybe<review_arr_rel_insert_input>
  score?: InputMaybe<Scalars['numeric']>
  score_breakdown?: InputMaybe<Scalars['jsonb']>
  sentences?: InputMaybe<review_tag_sentence_arr_rel_insert_input>
  source_breakdown?: InputMaybe<Scalars['jsonb']>
  tag?: InputMaybe<tag_obj_rel_insert_input>
  tag_id?: InputMaybe<Scalars['uuid']>
  upvotes?: InputMaybe<Scalars['numeric']>
  votes_ratio?: InputMaybe<Scalars['numeric']>
}

/** order by max() on columns of table "restaurant_tag" */
export interface restaurant_tag_max_order_by {
  downvotes?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  rank?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  restaurant_id?: InputMaybe<order_by>
  review_mentions_count?: InputMaybe<order_by>
  score?: InputMaybe<order_by>
  tag_id?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
}

/** order by min() on columns of table "restaurant_tag" */
export interface restaurant_tag_min_order_by {
  downvotes?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  rank?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  restaurant_id?: InputMaybe<order_by>
  review_mentions_count?: InputMaybe<order_by>
  score?: InputMaybe<order_by>
  tag_id?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
}

/** input type for inserting object relation for remote table "restaurant_tag" */
export interface restaurant_tag_obj_rel_insert_input {
  data: restaurant_tag_insert_input
  /** upsert condition */
  on_conflict?: InputMaybe<restaurant_tag_on_conflict>
}

/** on_conflict condition type for table "restaurant_tag" */
export interface restaurant_tag_on_conflict {
  constraint: restaurant_tag_constraint
  update_columns?: Array<restaurant_tag_update_column>
  where?: InputMaybe<restaurant_tag_bool_exp>
}

/** Ordering options when selecting data from "restaurant_tag". */
export interface restaurant_tag_order_by {
  downvotes?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  photos?: InputMaybe<order_by>
  rank?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  restaurant?: InputMaybe<restaurant_order_by>
  restaurant_id?: InputMaybe<order_by>
  review_mentions_count?: InputMaybe<order_by>
  reviews_aggregate?: InputMaybe<review_aggregate_order_by>
  score?: InputMaybe<order_by>
  score_breakdown?: InputMaybe<order_by>
  sentences_aggregate?: InputMaybe<review_tag_sentence_aggregate_order_by>
  source_breakdown?: InputMaybe<order_by>
  tag?: InputMaybe<tag_order_by>
  tag_id?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
}

/** primary key columns input for table: restaurant_tag */
export interface restaurant_tag_pk_columns_input {
  restaurant_id: Scalars['uuid']
  tag_id: Scalars['uuid']
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface restaurant_tag_prepend_input {
  photos?: InputMaybe<Scalars['jsonb']>
  score_breakdown?: InputMaybe<Scalars['jsonb']>
  source_breakdown?: InputMaybe<Scalars['jsonb']>
}

/** select columns of table "restaurant_tag" */
export enum restaurant_tag_select_column {
  /** column name */
  downvotes = 'downvotes',
  /** column name */
  id = 'id',
  /** column name */
  photos = 'photos',
  /** column name */
  rank = 'rank',
  /** column name */
  rating = 'rating',
  /** column name */
  restaurant_id = 'restaurant_id',
  /** column name */
  review_mentions_count = 'review_mentions_count',
  /** column name */
  score = 'score',
  /** column name */
  score_breakdown = 'score_breakdown',
  /** column name */
  source_breakdown = 'source_breakdown',
  /** column name */
  tag_id = 'tag_id',
  /** column name */
  upvotes = 'upvotes',
  /** column name */
  votes_ratio = 'votes_ratio',
}

/** input type for updating data in table "restaurant_tag" */
export interface restaurant_tag_set_input {
  downvotes?: InputMaybe<Scalars['numeric']>
  id?: InputMaybe<Scalars['uuid']>
  photos?: InputMaybe<Scalars['jsonb']>
  rank?: InputMaybe<Scalars['Int']>
  rating?: InputMaybe<Scalars['numeric']>
  restaurant_id?: InputMaybe<Scalars['uuid']>
  review_mentions_count?: InputMaybe<Scalars['numeric']>
  score?: InputMaybe<Scalars['numeric']>
  score_breakdown?: InputMaybe<Scalars['jsonb']>
  source_breakdown?: InputMaybe<Scalars['jsonb']>
  tag_id?: InputMaybe<Scalars['uuid']>
  upvotes?: InputMaybe<Scalars['numeric']>
  votes_ratio?: InputMaybe<Scalars['numeric']>
}

/** order by stddev() on columns of table "restaurant_tag" */
export interface restaurant_tag_stddev_order_by {
  downvotes?: InputMaybe<order_by>
  rank?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  review_mentions_count?: InputMaybe<order_by>
  score?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
}

/** order by stddev_pop() on columns of table "restaurant_tag" */
export interface restaurant_tag_stddev_pop_order_by {
  downvotes?: InputMaybe<order_by>
  rank?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  review_mentions_count?: InputMaybe<order_by>
  score?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
}

/** order by stddev_samp() on columns of table "restaurant_tag" */
export interface restaurant_tag_stddev_samp_order_by {
  downvotes?: InputMaybe<order_by>
  rank?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  review_mentions_count?: InputMaybe<order_by>
  score?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
}

/** Streaming cursor of the table "restaurant_tag" */
export interface restaurant_tag_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: restaurant_tag_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface restaurant_tag_stream_cursor_value_input {
  downvotes?: InputMaybe<Scalars['numeric']>
  id?: InputMaybe<Scalars['uuid']>
  photos?: InputMaybe<Scalars['jsonb']>
  rank?: InputMaybe<Scalars['Int']>
  rating?: InputMaybe<Scalars['numeric']>
  restaurant_id?: InputMaybe<Scalars['uuid']>
  review_mentions_count?: InputMaybe<Scalars['numeric']>
  score?: InputMaybe<Scalars['numeric']>
  score_breakdown?: InputMaybe<Scalars['jsonb']>
  source_breakdown?: InputMaybe<Scalars['jsonb']>
  tag_id?: InputMaybe<Scalars['uuid']>
  upvotes?: InputMaybe<Scalars['numeric']>
  votes_ratio?: InputMaybe<Scalars['numeric']>
}

/** order by sum() on columns of table "restaurant_tag" */
export interface restaurant_tag_sum_order_by {
  downvotes?: InputMaybe<order_by>
  rank?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  review_mentions_count?: InputMaybe<order_by>
  score?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
}

/** update columns of table "restaurant_tag" */
export enum restaurant_tag_update_column {
  /** column name */
  downvotes = 'downvotes',
  /** column name */
  id = 'id',
  /** column name */
  photos = 'photos',
  /** column name */
  rank = 'rank',
  /** column name */
  rating = 'rating',
  /** column name */
  restaurant_id = 'restaurant_id',
  /** column name */
  review_mentions_count = 'review_mentions_count',
  /** column name */
  score = 'score',
  /** column name */
  score_breakdown = 'score_breakdown',
  /** column name */
  source_breakdown = 'source_breakdown',
  /** column name */
  tag_id = 'tag_id',
  /** column name */
  upvotes = 'upvotes',
  /** column name */
  votes_ratio = 'votes_ratio',
}

export interface restaurant_tag_updates {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<restaurant_tag_append_input>
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<restaurant_tag_delete_at_path_input>
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<restaurant_tag_delete_elem_input>
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<restaurant_tag_delete_key_input>
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<restaurant_tag_inc_input>
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<restaurant_tag_prepend_input>
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<restaurant_tag_set_input>
  where: restaurant_tag_bool_exp
}

/** order by var_pop() on columns of table "restaurant_tag" */
export interface restaurant_tag_var_pop_order_by {
  downvotes?: InputMaybe<order_by>
  rank?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  review_mentions_count?: InputMaybe<order_by>
  score?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
}

/** order by var_samp() on columns of table "restaurant_tag" */
export interface restaurant_tag_var_samp_order_by {
  downvotes?: InputMaybe<order_by>
  rank?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  review_mentions_count?: InputMaybe<order_by>
  score?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
}

/** order by variance() on columns of table "restaurant_tag" */
export interface restaurant_tag_variance_order_by {
  downvotes?: InputMaybe<order_by>
  rank?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  review_mentions_count?: InputMaybe<order_by>
  score?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
}

export interface restaurant_top_tags_args {
  _restaurant?: InputMaybe<Scalars['restaurant_scalar']>
  _tag_types?: InputMaybe<Scalars['String']>
  tag_slugs?: InputMaybe<Scalars['String']>
}

export interface restaurant_trending_args {
  region_slug?: InputMaybe<Scalars['String']>
}

/** update columns of table "restaurant" */
export enum restaurant_update_column {
  /** column name */
  address = 'address',
  /** column name */
  city = 'city',
  /** column name */
  created_at = 'created_at',
  /** column name */
  description = 'description',
  /** column name */
  downvotes = 'downvotes',
  /** column name */
  external_source_info = 'external_source_info',
  /** column name */
  geocoder_id = 'geocoder_id',
  /** column name */
  headlines = 'headlines',
  /** column name */
  hours = 'hours',
  /** column name */
  id = 'id',
  /** column name */
  image = 'image',
  /** column name */
  is_out_of_business = 'is_out_of_business',
  /** column name */
  location = 'location',
  /** column name */
  name = 'name',
  /** column name */
  og_source_ids = 'og_source_ids',
  /** column name */
  oldest_review_date = 'oldest_review_date',
  /** column name */
  photos = 'photos',
  /** column name */
  price_range = 'price_range',
  /** column name */
  rating = 'rating',
  /** column name */
  rating_factors = 'rating_factors',
  /** column name */
  score = 'score',
  /** column name */
  score_breakdown = 'score_breakdown',
  /** column name */
  scrape_metadata = 'scrape_metadata',
  /** column name */
  slug = 'slug',
  /** column name */
  source_breakdown = 'source_breakdown',
  /** column name */
  sources = 'sources',
  /** column name */
  state = 'state',
  /** column name */
  summary = 'summary',
  /** column name */
  tag_names = 'tag_names',
  /** column name */
  telephone = 'telephone',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  upvotes = 'upvotes',
  /** column name */
  votes_ratio = 'votes_ratio',
  /** column name */
  website = 'website',
  /** column name */
  zip = 'zip',
}

export interface restaurant_updates {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<restaurant_append_input>
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<restaurant_delete_at_path_input>
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<restaurant_delete_elem_input>
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<restaurant_delete_key_input>
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<restaurant_inc_input>
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<restaurant_prepend_input>
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<restaurant_set_input>
  where: restaurant_bool_exp
}

/** order by var_pop() on columns of table "restaurant" */
export interface restaurant_var_pop_order_by {
  downvotes?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  score?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
  zip?: InputMaybe<order_by>
}

/** order by var_samp() on columns of table "restaurant" */
export interface restaurant_var_samp_order_by {
  downvotes?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  score?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
  zip?: InputMaybe<order_by>
}

/** order by variance() on columns of table "restaurant" */
export interface restaurant_variance_order_by {
  downvotes?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  score?: InputMaybe<order_by>
  upvotes?: InputMaybe<order_by>
  votes_ratio?: InputMaybe<order_by>
  zip?: InputMaybe<order_by>
}

export interface restaurant_with_tags_args {
  tag_slugs?: InputMaybe<Scalars['String']>
}

export interface review_aggregate_bool_exp {
  bool_and?: InputMaybe<review_aggregate_bool_exp_bool_and>
  bool_or?: InputMaybe<review_aggregate_bool_exp_bool_or>
  count?: InputMaybe<review_aggregate_bool_exp_count>
}

export interface review_aggregate_bool_exp_bool_and {
  arguments: review_select_column_review_aggregate_bool_exp_bool_and_arguments_columns
  distinct?: InputMaybe<Scalars['Boolean']>
  filter?: InputMaybe<review_bool_exp>
  predicate: Boolean_comparison_exp
}

export interface review_aggregate_bool_exp_bool_or {
  arguments: review_select_column_review_aggregate_bool_exp_bool_or_arguments_columns
  distinct?: InputMaybe<Scalars['Boolean']>
  filter?: InputMaybe<review_bool_exp>
  predicate: Boolean_comparison_exp
}

export interface review_aggregate_bool_exp_count {
  arguments?: InputMaybe<Array<review_select_column>>
  distinct?: InputMaybe<Scalars['Boolean']>
  filter?: InputMaybe<review_bool_exp>
  predicate: Int_comparison_exp
}

/** order by aggregate values of table "review" */
export interface review_aggregate_order_by {
  avg?: InputMaybe<review_avg_order_by>
  count?: InputMaybe<order_by>
  max?: InputMaybe<review_max_order_by>
  min?: InputMaybe<review_min_order_by>
  stddev?: InputMaybe<review_stddev_order_by>
  stddev_pop?: InputMaybe<review_stddev_pop_order_by>
  stddev_samp?: InputMaybe<review_stddev_samp_order_by>
  sum?: InputMaybe<review_sum_order_by>
  var_pop?: InputMaybe<review_var_pop_order_by>
  var_samp?: InputMaybe<review_var_samp_order_by>
  variance?: InputMaybe<review_variance_order_by>
}

/** append existing jsonb value of filtered columns with new jsonb value */
export interface review_append_input {
  categories?: InputMaybe<Scalars['jsonb']>
}

/** input type for inserting array relation for remote table "review" */
export interface review_arr_rel_insert_input {
  data: Array<review_insert_input>
  /** upsert condition */
  on_conflict?: InputMaybe<review_on_conflict>
}

/** order by avg() on columns of table "review" */
export interface review_avg_order_by {
  rating?: InputMaybe<order_by>
  vote?: InputMaybe<order_by>
}

/** Boolean expression to filter rows from the table "review". All fields are combined with a logical 'AND'. */
export interface review_bool_exp {
  _and?: InputMaybe<Array<review_bool_exp>>
  _not?: InputMaybe<review_bool_exp>
  _or?: InputMaybe<Array<review_bool_exp>>
  authored_at?: InputMaybe<timestamptz_comparison_exp>
  categories?: InputMaybe<jsonb_comparison_exp>
  favorited?: InputMaybe<Boolean_comparison_exp>
  id?: InputMaybe<uuid_comparison_exp>
  list?: InputMaybe<list_bool_exp>
  list_id?: InputMaybe<uuid_comparison_exp>
  location?: InputMaybe<geometry_comparison_exp>
  native_data_unique_key?: InputMaybe<String_comparison_exp>
  photos?: InputMaybe<photo_xref_bool_exp>
  photos_aggregate?: InputMaybe<photo_xref_aggregate_bool_exp>
  rating?: InputMaybe<numeric_comparison_exp>
  restaurant?: InputMaybe<restaurant_bool_exp>
  restaurant_id?: InputMaybe<uuid_comparison_exp>
  reviews?: InputMaybe<review_bool_exp>
  reviews_aggregate?: InputMaybe<review_aggregate_bool_exp>
  sentiments?: InputMaybe<review_tag_sentence_bool_exp>
  sentiments_aggregate?: InputMaybe<review_tag_sentence_aggregate_bool_exp>
  source?: InputMaybe<String_comparison_exp>
  tag?: InputMaybe<tag_bool_exp>
  tag_id?: InputMaybe<uuid_comparison_exp>
  text?: InputMaybe<String_comparison_exp>
  type?: InputMaybe<String_comparison_exp>
  updated_at?: InputMaybe<timestamptz_comparison_exp>
  user?: InputMaybe<user_bool_exp>
  user_id?: InputMaybe<uuid_comparison_exp>
  username?: InputMaybe<String_comparison_exp>
  vote?: InputMaybe<numeric_comparison_exp>
}

/** unique or primary key constraints on table "review" */
export enum review_constraint {
  /** unique or primary key constraint on columns "tag_id", "restaurant_id", "user_id" */
  review_native_data_unique_constraint = 'review_native_data_unique_constraint',
  /** unique or primary key constraint on columns "native_data_unique_key" */
  review_native_data_unique_key_key = 'review_native_data_unique_key_key',
  /** unique or primary key constraint on columns "id" */
  review_pkey = 'review_pkey',
  /** unique or primary key constraint on columns "type", "list_id", "restaurant_id", "user_id" */
  review_user_id_restaurant_id_list_id_type_key = 'review_user_id_restaurant_id_list_id_type_key',
  /** unique or primary key constraint on columns "type", "tag_id", "username", "restaurant_id" */
  review_username_restauarant_id_tag_id_type_key = 'review_username_restauarant_id_tag_id_type_key',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface review_delete_at_path_input {
  categories?: InputMaybe<Array<Scalars['String']>>
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface review_delete_elem_input {
  categories?: InputMaybe<Scalars['Int']>
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface review_delete_key_input {
  categories?: InputMaybe<Scalars['String']>
}

/** input type for incrementing numeric columns in table "review" */
export interface review_inc_input {
  rating?: InputMaybe<Scalars['numeric']>
  vote?: InputMaybe<Scalars['numeric']>
}

/** input type for inserting data into table "review" */
export interface review_insert_input {
  authored_at?: InputMaybe<Scalars['timestamptz']>
  categories?: InputMaybe<Scalars['jsonb']>
  favorited?: InputMaybe<Scalars['Boolean']>
  id?: InputMaybe<Scalars['uuid']>
  list?: InputMaybe<list_obj_rel_insert_input>
  list_id?: InputMaybe<Scalars['uuid']>
  location?: InputMaybe<Scalars['geometry']>
  native_data_unique_key?: InputMaybe<Scalars['String']>
  photos?: InputMaybe<photo_xref_arr_rel_insert_input>
  rating?: InputMaybe<Scalars['numeric']>
  restaurant?: InputMaybe<restaurant_obj_rel_insert_input>
  restaurant_id?: InputMaybe<Scalars['uuid']>
  reviews?: InputMaybe<review_arr_rel_insert_input>
  sentiments?: InputMaybe<review_tag_sentence_arr_rel_insert_input>
  source?: InputMaybe<Scalars['String']>
  tag?: InputMaybe<tag_obj_rel_insert_input>
  tag_id?: InputMaybe<Scalars['uuid']>
  text?: InputMaybe<Scalars['String']>
  type?: InputMaybe<Scalars['String']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
  user?: InputMaybe<user_obj_rel_insert_input>
  user_id?: InputMaybe<Scalars['uuid']>
  username?: InputMaybe<Scalars['String']>
  vote?: InputMaybe<Scalars['numeric']>
}

/** order by max() on columns of table "review" */
export interface review_max_order_by {
  authored_at?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  list_id?: InputMaybe<order_by>
  native_data_unique_key?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  restaurant_id?: InputMaybe<order_by>
  source?: InputMaybe<order_by>
  tag_id?: InputMaybe<order_by>
  text?: InputMaybe<order_by>
  type?: InputMaybe<order_by>
  updated_at?: InputMaybe<order_by>
  user_id?: InputMaybe<order_by>
  username?: InputMaybe<order_by>
  vote?: InputMaybe<order_by>
}

/** order by min() on columns of table "review" */
export interface review_min_order_by {
  authored_at?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  list_id?: InputMaybe<order_by>
  native_data_unique_key?: InputMaybe<order_by>
  rating?: InputMaybe<order_by>
  restaurant_id?: InputMaybe<order_by>
  source?: InputMaybe<order_by>
  tag_id?: InputMaybe<order_by>
  text?: InputMaybe<order_by>
  type?: InputMaybe<order_by>
  updated_at?: InputMaybe<order_by>
  user_id?: InputMaybe<order_by>
  username?: InputMaybe<order_by>
  vote?: InputMaybe<order_by>
}

/** input type for inserting object relation for remote table "review" */
export interface review_obj_rel_insert_input {
  data: review_insert_input
  /** upsert condition */
  on_conflict?: InputMaybe<review_on_conflict>
}

/** on_conflict condition type for table "review" */
export interface review_on_conflict {
  constraint: review_constraint
  update_columns?: Array<review_update_column>
  where?: InputMaybe<review_bool_exp>
}

/** Ordering options when selecting data from "review". */
export interface review_order_by {
  authored_at?: InputMaybe<order_by>
  categories?: InputMaybe<order_by>
  favorited?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  list?: InputMaybe<list_order_by>
  list_id?: InputMaybe<order_by>
  location?: InputMaybe<order_by>
  native_data_unique_key?: InputMaybe<order_by>
  photos_aggregate?: InputMaybe<photo_xref_aggregate_order_by>
  rating?: InputMaybe<order_by>
  restaurant?: InputMaybe<restaurant_order_by>
  restaurant_id?: InputMaybe<order_by>
  reviews_aggregate?: InputMaybe<review_aggregate_order_by>
  sentiments_aggregate?: InputMaybe<review_tag_sentence_aggregate_order_by>
  source?: InputMaybe<order_by>
  tag?: InputMaybe<tag_order_by>
  tag_id?: InputMaybe<order_by>
  text?: InputMaybe<order_by>
  type?: InputMaybe<order_by>
  updated_at?: InputMaybe<order_by>
  user?: InputMaybe<user_order_by>
  user_id?: InputMaybe<order_by>
  username?: InputMaybe<order_by>
  vote?: InputMaybe<order_by>
}

/** primary key columns input for table: review */
export interface review_pk_columns_input {
  id: Scalars['uuid']
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface review_prepend_input {
  categories?: InputMaybe<Scalars['jsonb']>
}

/** select columns of table "review" */
export enum review_select_column {
  /** column name */
  authored_at = 'authored_at',
  /** column name */
  categories = 'categories',
  /** column name */
  favorited = 'favorited',
  /** column name */
  id = 'id',
  /** column name */
  list_id = 'list_id',
  /** column name */
  location = 'location',
  /** column name */
  native_data_unique_key = 'native_data_unique_key',
  /** column name */
  rating = 'rating',
  /** column name */
  restaurant_id = 'restaurant_id',
  /** column name */
  source = 'source',
  /** column name */
  tag_id = 'tag_id',
  /** column name */
  text = 'text',
  /** column name */
  type = 'type',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  user_id = 'user_id',
  /** column name */
  username = 'username',
  /** column name */
  vote = 'vote',
}

/** select "review_aggregate_bool_exp_bool_and_arguments_columns" columns of table "review" */
export enum review_select_column_review_aggregate_bool_exp_bool_and_arguments_columns {
  /** column name */
  favorited = 'favorited',
}

/** select "review_aggregate_bool_exp_bool_or_arguments_columns" columns of table "review" */
export enum review_select_column_review_aggregate_bool_exp_bool_or_arguments_columns {
  /** column name */
  favorited = 'favorited',
}

/** input type for updating data in table "review" */
export interface review_set_input {
  authored_at?: InputMaybe<Scalars['timestamptz']>
  categories?: InputMaybe<Scalars['jsonb']>
  favorited?: InputMaybe<Scalars['Boolean']>
  id?: InputMaybe<Scalars['uuid']>
  list_id?: InputMaybe<Scalars['uuid']>
  location?: InputMaybe<Scalars['geometry']>
  native_data_unique_key?: InputMaybe<Scalars['String']>
  rating?: InputMaybe<Scalars['numeric']>
  restaurant_id?: InputMaybe<Scalars['uuid']>
  source?: InputMaybe<Scalars['String']>
  tag_id?: InputMaybe<Scalars['uuid']>
  text?: InputMaybe<Scalars['String']>
  type?: InputMaybe<Scalars['String']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
  user_id?: InputMaybe<Scalars['uuid']>
  username?: InputMaybe<Scalars['String']>
  vote?: InputMaybe<Scalars['numeric']>
}

/** order by stddev() on columns of table "review" */
export interface review_stddev_order_by {
  rating?: InputMaybe<order_by>
  vote?: InputMaybe<order_by>
}

/** order by stddev_pop() on columns of table "review" */
export interface review_stddev_pop_order_by {
  rating?: InputMaybe<order_by>
  vote?: InputMaybe<order_by>
}

/** order by stddev_samp() on columns of table "review" */
export interface review_stddev_samp_order_by {
  rating?: InputMaybe<order_by>
  vote?: InputMaybe<order_by>
}

/** Streaming cursor of the table "review" */
export interface review_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: review_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface review_stream_cursor_value_input {
  authored_at?: InputMaybe<Scalars['timestamptz']>
  categories?: InputMaybe<Scalars['jsonb']>
  favorited?: InputMaybe<Scalars['Boolean']>
  id?: InputMaybe<Scalars['uuid']>
  list_id?: InputMaybe<Scalars['uuid']>
  location?: InputMaybe<Scalars['geometry']>
  native_data_unique_key?: InputMaybe<Scalars['String']>
  rating?: InputMaybe<Scalars['numeric']>
  restaurant_id?: InputMaybe<Scalars['uuid']>
  source?: InputMaybe<Scalars['String']>
  tag_id?: InputMaybe<Scalars['uuid']>
  text?: InputMaybe<Scalars['String']>
  type?: InputMaybe<Scalars['String']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
  user_id?: InputMaybe<Scalars['uuid']>
  username?: InputMaybe<Scalars['String']>
  vote?: InputMaybe<Scalars['numeric']>
}

/** order by sum() on columns of table "review" */
export interface review_sum_order_by {
  rating?: InputMaybe<order_by>
  vote?: InputMaybe<order_by>
}

export interface review_tag_sentence_aggregate_bool_exp {
  count?: InputMaybe<review_tag_sentence_aggregate_bool_exp_count>
}

export interface review_tag_sentence_aggregate_bool_exp_count {
  arguments?: InputMaybe<Array<review_tag_sentence_select_column>>
  distinct?: InputMaybe<Scalars['Boolean']>
  filter?: InputMaybe<review_tag_sentence_bool_exp>
  predicate: Int_comparison_exp
}

/** order by aggregate values of table "review_tag_sentence" */
export interface review_tag_sentence_aggregate_order_by {
  avg?: InputMaybe<review_tag_sentence_avg_order_by>
  count?: InputMaybe<order_by>
  max?: InputMaybe<review_tag_sentence_max_order_by>
  min?: InputMaybe<review_tag_sentence_min_order_by>
  stddev?: InputMaybe<review_tag_sentence_stddev_order_by>
  stddev_pop?: InputMaybe<review_tag_sentence_stddev_pop_order_by>
  stddev_samp?: InputMaybe<review_tag_sentence_stddev_samp_order_by>
  sum?: InputMaybe<review_tag_sentence_sum_order_by>
  var_pop?: InputMaybe<review_tag_sentence_var_pop_order_by>
  var_samp?: InputMaybe<review_tag_sentence_var_samp_order_by>
  variance?: InputMaybe<review_tag_sentence_variance_order_by>
}

/** input type for inserting array relation for remote table "review_tag_sentence" */
export interface review_tag_sentence_arr_rel_insert_input {
  data: Array<review_tag_sentence_insert_input>
  /** upsert condition */
  on_conflict?: InputMaybe<review_tag_sentence_on_conflict>
}

/** order by avg() on columns of table "review_tag_sentence" */
export interface review_tag_sentence_avg_order_by {
  ml_sentiment?: InputMaybe<order_by>
  naive_sentiment?: InputMaybe<order_by>
}

/** Boolean expression to filter rows from the table "review_tag_sentence". All fields are combined with a logical 'AND'. */
export interface review_tag_sentence_bool_exp {
  _and?: InputMaybe<Array<review_tag_sentence_bool_exp>>
  _not?: InputMaybe<review_tag_sentence_bool_exp>
  _or?: InputMaybe<Array<review_tag_sentence_bool_exp>>
  id?: InputMaybe<uuid_comparison_exp>
  ml_sentiment?: InputMaybe<numeric_comparison_exp>
  naive_sentiment?: InputMaybe<numeric_comparison_exp>
  restaurant_id?: InputMaybe<uuid_comparison_exp>
  review?: InputMaybe<review_bool_exp>
  review_id?: InputMaybe<uuid_comparison_exp>
  sentence?: InputMaybe<String_comparison_exp>
  tag?: InputMaybe<tag_bool_exp>
  tag_id?: InputMaybe<uuid_comparison_exp>
}

/** unique or primary key constraints on table "review_tag_sentence" */
export enum review_tag_sentence_constraint {
  /** unique or primary key constraint on columns "id" */
  review_tag_pkey = 'review_tag_pkey',
  /** unique or primary key constraint on columns "tag_id", "sentence", "review_id" */
  review_tag_tag_id_review_id_sentence_key = 'review_tag_tag_id_review_id_sentence_key',
}

/** input type for incrementing numeric columns in table "review_tag_sentence" */
export interface review_tag_sentence_inc_input {
  ml_sentiment?: InputMaybe<Scalars['numeric']>
  naive_sentiment?: InputMaybe<Scalars['numeric']>
}

/** input type for inserting data into table "review_tag_sentence" */
export interface review_tag_sentence_insert_input {
  id?: InputMaybe<Scalars['uuid']>
  ml_sentiment?: InputMaybe<Scalars['numeric']>
  naive_sentiment?: InputMaybe<Scalars['numeric']>
  restaurant_id?: InputMaybe<Scalars['uuid']>
  review?: InputMaybe<review_obj_rel_insert_input>
  review_id?: InputMaybe<Scalars['uuid']>
  sentence?: InputMaybe<Scalars['String']>
  tag?: InputMaybe<tag_obj_rel_insert_input>
  tag_id?: InputMaybe<Scalars['uuid']>
}

/** order by max() on columns of table "review_tag_sentence" */
export interface review_tag_sentence_max_order_by {
  id?: InputMaybe<order_by>
  ml_sentiment?: InputMaybe<order_by>
  naive_sentiment?: InputMaybe<order_by>
  restaurant_id?: InputMaybe<order_by>
  review_id?: InputMaybe<order_by>
  sentence?: InputMaybe<order_by>
  tag_id?: InputMaybe<order_by>
}

/** order by min() on columns of table "review_tag_sentence" */
export interface review_tag_sentence_min_order_by {
  id?: InputMaybe<order_by>
  ml_sentiment?: InputMaybe<order_by>
  naive_sentiment?: InputMaybe<order_by>
  restaurant_id?: InputMaybe<order_by>
  review_id?: InputMaybe<order_by>
  sentence?: InputMaybe<order_by>
  tag_id?: InputMaybe<order_by>
}

/** on_conflict condition type for table "review_tag_sentence" */
export interface review_tag_sentence_on_conflict {
  constraint: review_tag_sentence_constraint
  update_columns?: Array<review_tag_sentence_update_column>
  where?: InputMaybe<review_tag_sentence_bool_exp>
}

/** Ordering options when selecting data from "review_tag_sentence". */
export interface review_tag_sentence_order_by {
  id?: InputMaybe<order_by>
  ml_sentiment?: InputMaybe<order_by>
  naive_sentiment?: InputMaybe<order_by>
  restaurant_id?: InputMaybe<order_by>
  review?: InputMaybe<review_order_by>
  review_id?: InputMaybe<order_by>
  sentence?: InputMaybe<order_by>
  tag?: InputMaybe<tag_order_by>
  tag_id?: InputMaybe<order_by>
}

/** primary key columns input for table: review_tag_sentence */
export interface review_tag_sentence_pk_columns_input {
  id: Scalars['uuid']
}

/** select columns of table "review_tag_sentence" */
export enum review_tag_sentence_select_column {
  /** column name */
  id = 'id',
  /** column name */
  ml_sentiment = 'ml_sentiment',
  /** column name */
  naive_sentiment = 'naive_sentiment',
  /** column name */
  restaurant_id = 'restaurant_id',
  /** column name */
  review_id = 'review_id',
  /** column name */
  sentence = 'sentence',
  /** column name */
  tag_id = 'tag_id',
}

/** input type for updating data in table "review_tag_sentence" */
export interface review_tag_sentence_set_input {
  id?: InputMaybe<Scalars['uuid']>
  ml_sentiment?: InputMaybe<Scalars['numeric']>
  naive_sentiment?: InputMaybe<Scalars['numeric']>
  restaurant_id?: InputMaybe<Scalars['uuid']>
  review_id?: InputMaybe<Scalars['uuid']>
  sentence?: InputMaybe<Scalars['String']>
  tag_id?: InputMaybe<Scalars['uuid']>
}

/** order by stddev() on columns of table "review_tag_sentence" */
export interface review_tag_sentence_stddev_order_by {
  ml_sentiment?: InputMaybe<order_by>
  naive_sentiment?: InputMaybe<order_by>
}

/** order by stddev_pop() on columns of table "review_tag_sentence" */
export interface review_tag_sentence_stddev_pop_order_by {
  ml_sentiment?: InputMaybe<order_by>
  naive_sentiment?: InputMaybe<order_by>
}

/** order by stddev_samp() on columns of table "review_tag_sentence" */
export interface review_tag_sentence_stddev_samp_order_by {
  ml_sentiment?: InputMaybe<order_by>
  naive_sentiment?: InputMaybe<order_by>
}

/** Streaming cursor of the table "review_tag_sentence" */
export interface review_tag_sentence_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: review_tag_sentence_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface review_tag_sentence_stream_cursor_value_input {
  id?: InputMaybe<Scalars['uuid']>
  ml_sentiment?: InputMaybe<Scalars['numeric']>
  naive_sentiment?: InputMaybe<Scalars['numeric']>
  restaurant_id?: InputMaybe<Scalars['uuid']>
  review_id?: InputMaybe<Scalars['uuid']>
  sentence?: InputMaybe<Scalars['String']>
  tag_id?: InputMaybe<Scalars['uuid']>
}

/** order by sum() on columns of table "review_tag_sentence" */
export interface review_tag_sentence_sum_order_by {
  ml_sentiment?: InputMaybe<order_by>
  naive_sentiment?: InputMaybe<order_by>
}

/** update columns of table "review_tag_sentence" */
export enum review_tag_sentence_update_column {
  /** column name */
  id = 'id',
  /** column name */
  ml_sentiment = 'ml_sentiment',
  /** column name */
  naive_sentiment = 'naive_sentiment',
  /** column name */
  restaurant_id = 'restaurant_id',
  /** column name */
  review_id = 'review_id',
  /** column name */
  sentence = 'sentence',
  /** column name */
  tag_id = 'tag_id',
}

export interface review_tag_sentence_updates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<review_tag_sentence_inc_input>
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<review_tag_sentence_set_input>
  where: review_tag_sentence_bool_exp
}

/** order by var_pop() on columns of table "review_tag_sentence" */
export interface review_tag_sentence_var_pop_order_by {
  ml_sentiment?: InputMaybe<order_by>
  naive_sentiment?: InputMaybe<order_by>
}

/** order by var_samp() on columns of table "review_tag_sentence" */
export interface review_tag_sentence_var_samp_order_by {
  ml_sentiment?: InputMaybe<order_by>
  naive_sentiment?: InputMaybe<order_by>
}

/** order by variance() on columns of table "review_tag_sentence" */
export interface review_tag_sentence_variance_order_by {
  ml_sentiment?: InputMaybe<order_by>
  naive_sentiment?: InputMaybe<order_by>
}

/** update columns of table "review" */
export enum review_update_column {
  /** column name */
  authored_at = 'authored_at',
  /** column name */
  categories = 'categories',
  /** column name */
  favorited = 'favorited',
  /** column name */
  id = 'id',
  /** column name */
  list_id = 'list_id',
  /** column name */
  location = 'location',
  /** column name */
  native_data_unique_key = 'native_data_unique_key',
  /** column name */
  rating = 'rating',
  /** column name */
  restaurant_id = 'restaurant_id',
  /** column name */
  source = 'source',
  /** column name */
  tag_id = 'tag_id',
  /** column name */
  text = 'text',
  /** column name */
  type = 'type',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  user_id = 'user_id',
  /** column name */
  username = 'username',
  /** column name */
  vote = 'vote',
}

export interface review_updates {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<review_append_input>
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<review_delete_at_path_input>
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<review_delete_elem_input>
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<review_delete_key_input>
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<review_inc_input>
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<review_prepend_input>
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<review_set_input>
  where: review_bool_exp
}

/** order by var_pop() on columns of table "review" */
export interface review_var_pop_order_by {
  rating?: InputMaybe<order_by>
  vote?: InputMaybe<order_by>
}

/** order by var_samp() on columns of table "review" */
export interface review_var_samp_order_by {
  rating?: InputMaybe<order_by>
  vote?: InputMaybe<order_by>
}

/** order by variance() on columns of table "review" */
export interface review_variance_order_by {
  rating?: InputMaybe<order_by>
  vote?: InputMaybe<order_by>
}

/** append existing jsonb value of filtered columns with new jsonb value */
export interface setting_append_input {
  value?: InputMaybe<Scalars['jsonb']>
}

/** Boolean expression to filter rows from the table "setting". All fields are combined with a logical 'AND'. */
export interface setting_bool_exp {
  _and?: InputMaybe<Array<setting_bool_exp>>
  _not?: InputMaybe<setting_bool_exp>
  _or?: InputMaybe<Array<setting_bool_exp>>
  created_at?: InputMaybe<timestamptz_comparison_exp>
  id?: InputMaybe<uuid_comparison_exp>
  key?: InputMaybe<String_comparison_exp>
  updated_at?: InputMaybe<timestamptz_comparison_exp>
  value?: InputMaybe<jsonb_comparison_exp>
}

/** unique or primary key constraints on table "setting" */
export enum setting_constraint {
  /** unique or primary key constraint on columns "id" */
  setting_id_key = 'setting_id_key',
  /** unique or primary key constraint on columns "key" */
  setting_pkey = 'setting_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface setting_delete_at_path_input {
  value?: InputMaybe<Array<Scalars['String']>>
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface setting_delete_elem_input {
  value?: InputMaybe<Scalars['Int']>
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface setting_delete_key_input {
  value?: InputMaybe<Scalars['String']>
}

/** input type for inserting data into table "setting" */
export interface setting_insert_input {
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  key?: InputMaybe<Scalars['String']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
  value?: InputMaybe<Scalars['jsonb']>
}

/** on_conflict condition type for table "setting" */
export interface setting_on_conflict {
  constraint: setting_constraint
  update_columns?: Array<setting_update_column>
  where?: InputMaybe<setting_bool_exp>
}

/** Ordering options when selecting data from "setting". */
export interface setting_order_by {
  created_at?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  key?: InputMaybe<order_by>
  updated_at?: InputMaybe<order_by>
  value?: InputMaybe<order_by>
}

/** primary key columns input for table: setting */
export interface setting_pk_columns_input {
  key: Scalars['String']
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface setting_prepend_input {
  value?: InputMaybe<Scalars['jsonb']>
}

/** select columns of table "setting" */
export enum setting_select_column {
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  key = 'key',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  value = 'value',
}

/** input type for updating data in table "setting" */
export interface setting_set_input {
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  key?: InputMaybe<Scalars['String']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
  value?: InputMaybe<Scalars['jsonb']>
}

/** Streaming cursor of the table "setting" */
export interface setting_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: setting_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface setting_stream_cursor_value_input {
  created_at?: InputMaybe<Scalars['timestamptz']>
  id?: InputMaybe<Scalars['uuid']>
  key?: InputMaybe<Scalars['String']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
  value?: InputMaybe<Scalars['jsonb']>
}

/** update columns of table "setting" */
export enum setting_update_column {
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  key = 'key',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  value = 'value',
}

export interface setting_updates {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<setting_append_input>
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<setting_delete_at_path_input>
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<setting_delete_elem_input>
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<setting_delete_key_input>
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<setting_prepend_input>
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<setting_set_input>
  where: setting_bool_exp
}

export interface st_d_within_geography_input {
  distance: Scalars['Float']
  from: Scalars['geography']
  use_spheroid?: InputMaybe<Scalars['Boolean']>
}

export interface st_d_within_input {
  distance: Scalars['Float']
  from: Scalars['geometry']
}

/** append existing jsonb value of filtered columns with new jsonb value */
export interface tag_append_input {
  alternates?: InputMaybe<Scalars['jsonb']>
  default_images?: InputMaybe<Scalars['jsonb']>
  misc?: InputMaybe<Scalars['jsonb']>
  rgb?: InputMaybe<Scalars['jsonb']>
}

/** Boolean expression to filter rows from the table "tag". All fields are combined with a logical 'AND'. */
export interface tag_bool_exp {
  _and?: InputMaybe<Array<tag_bool_exp>>
  _not?: InputMaybe<tag_bool_exp>
  _or?: InputMaybe<Array<tag_bool_exp>>
  alternates?: InputMaybe<jsonb_comparison_exp>
  categories?: InputMaybe<tag_tag_bool_exp>
  categories_aggregate?: InputMaybe<tag_tag_aggregate_bool_exp>
  created_at?: InputMaybe<timestamptz_comparison_exp>
  default_image?: InputMaybe<String_comparison_exp>
  default_images?: InputMaybe<jsonb_comparison_exp>
  description?: InputMaybe<String_comparison_exp>
  displayName?: InputMaybe<String_comparison_exp>
  frequency?: InputMaybe<Int_comparison_exp>
  icon?: InputMaybe<String_comparison_exp>
  id?: InputMaybe<uuid_comparison_exp>
  is_ambiguous?: InputMaybe<Boolean_comparison_exp>
  misc?: InputMaybe<jsonb_comparison_exp>
  name?: InputMaybe<String_comparison_exp>
  order?: InputMaybe<Int_comparison_exp>
  parent?: InputMaybe<tag_bool_exp>
  parentId?: InputMaybe<uuid_comparison_exp>
  popularity?: InputMaybe<Int_comparison_exp>
  restaurant_taxonomies?: InputMaybe<restaurant_tag_bool_exp>
  restaurant_taxonomies_aggregate?: InputMaybe<restaurant_tag_aggregate_bool_exp>
  reviews?: InputMaybe<review_bool_exp>
  reviews_aggregate?: InputMaybe<review_aggregate_bool_exp>
  rgb?: InputMaybe<jsonb_comparison_exp>
  slug?: InputMaybe<String_comparison_exp>
  type?: InputMaybe<String_comparison_exp>
  updated_at?: InputMaybe<timestamptz_comparison_exp>
}

/** unique or primary key constraints on table "tag" */
export enum tag_constraint {
  /** unique or primary key constraint on columns "id" */
  tag_id_key1 = 'tag_id_key1',
  /** unique or primary key constraint on columns "order" */
  tag_order_key = 'tag_order_key',
  /** unique or primary key constraint on columns "name", "parentId" */
  tag_parentId_name_key = 'tag_parentId_name_key',
  /** unique or primary key constraint on columns "id" */
  tag_pkey = 'tag_pkey',
  /** unique or primary key constraint on columns "slug" */
  tag_slug_key = 'tag_slug_key',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface tag_delete_at_path_input {
  alternates?: InputMaybe<Array<Scalars['String']>>
  default_images?: InputMaybe<Array<Scalars['String']>>
  misc?: InputMaybe<Array<Scalars['String']>>
  rgb?: InputMaybe<Array<Scalars['String']>>
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface tag_delete_elem_input {
  alternates?: InputMaybe<Scalars['Int']>
  default_images?: InputMaybe<Scalars['Int']>
  misc?: InputMaybe<Scalars['Int']>
  rgb?: InputMaybe<Scalars['Int']>
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface tag_delete_key_input {
  alternates?: InputMaybe<Scalars['String']>
  default_images?: InputMaybe<Scalars['String']>
  misc?: InputMaybe<Scalars['String']>
  rgb?: InputMaybe<Scalars['String']>
}

/** input type for incrementing numeric columns in table "tag" */
export interface tag_inc_input {
  frequency?: InputMaybe<Scalars['Int']>
  order?: InputMaybe<Scalars['Int']>
  popularity?: InputMaybe<Scalars['Int']>
}

/** input type for inserting data into table "tag" */
export interface tag_insert_input {
  alternates?: InputMaybe<Scalars['jsonb']>
  categories?: InputMaybe<tag_tag_arr_rel_insert_input>
  created_at?: InputMaybe<Scalars['timestamptz']>
  default_image?: InputMaybe<Scalars['String']>
  default_images?: InputMaybe<Scalars['jsonb']>
  description?: InputMaybe<Scalars['String']>
  displayName?: InputMaybe<Scalars['String']>
  frequency?: InputMaybe<Scalars['Int']>
  icon?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['uuid']>
  is_ambiguous?: InputMaybe<Scalars['Boolean']>
  misc?: InputMaybe<Scalars['jsonb']>
  name?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Scalars['Int']>
  parent?: InputMaybe<tag_obj_rel_insert_input>
  parentId?: InputMaybe<Scalars['uuid']>
  popularity?: InputMaybe<Scalars['Int']>
  restaurant_taxonomies?: InputMaybe<restaurant_tag_arr_rel_insert_input>
  reviews?: InputMaybe<review_arr_rel_insert_input>
  rgb?: InputMaybe<Scalars['jsonb']>
  slug?: InputMaybe<Scalars['String']>
  type?: InputMaybe<Scalars['String']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
}

/** input type for inserting object relation for remote table "tag" */
export interface tag_obj_rel_insert_input {
  data: tag_insert_input
  /** upsert condition */
  on_conflict?: InputMaybe<tag_on_conflict>
}

/** on_conflict condition type for table "tag" */
export interface tag_on_conflict {
  constraint: tag_constraint
  update_columns?: Array<tag_update_column>
  where?: InputMaybe<tag_bool_exp>
}

/** Ordering options when selecting data from "tag". */
export interface tag_order_by {
  alternates?: InputMaybe<order_by>
  categories_aggregate?: InputMaybe<tag_tag_aggregate_order_by>
  created_at?: InputMaybe<order_by>
  default_image?: InputMaybe<order_by>
  default_images?: InputMaybe<order_by>
  description?: InputMaybe<order_by>
  displayName?: InputMaybe<order_by>
  frequency?: InputMaybe<order_by>
  icon?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  is_ambiguous?: InputMaybe<order_by>
  misc?: InputMaybe<order_by>
  name?: InputMaybe<order_by>
  order?: InputMaybe<order_by>
  parent?: InputMaybe<tag_order_by>
  parentId?: InputMaybe<order_by>
  popularity?: InputMaybe<order_by>
  restaurant_taxonomies_aggregate?: InputMaybe<restaurant_tag_aggregate_order_by>
  reviews_aggregate?: InputMaybe<review_aggregate_order_by>
  rgb?: InputMaybe<order_by>
  slug?: InputMaybe<order_by>
  type?: InputMaybe<order_by>
  updated_at?: InputMaybe<order_by>
}

/** primary key columns input for table: tag */
export interface tag_pk_columns_input {
  id: Scalars['uuid']
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface tag_prepend_input {
  alternates?: InputMaybe<Scalars['jsonb']>
  default_images?: InputMaybe<Scalars['jsonb']>
  misc?: InputMaybe<Scalars['jsonb']>
  rgb?: InputMaybe<Scalars['jsonb']>
}

/** select columns of table "tag" */
export enum tag_select_column {
  /** column name */
  alternates = 'alternates',
  /** column name */
  created_at = 'created_at',
  /** column name */
  default_image = 'default_image',
  /** column name */
  default_images = 'default_images',
  /** column name */
  description = 'description',
  /** column name */
  displayName = 'displayName',
  /** column name */
  frequency = 'frequency',
  /** column name */
  icon = 'icon',
  /** column name */
  id = 'id',
  /** column name */
  is_ambiguous = 'is_ambiguous',
  /** column name */
  misc = 'misc',
  /** column name */
  name = 'name',
  /** column name */
  order = 'order',
  /** column name */
  parentId = 'parentId',
  /** column name */
  popularity = 'popularity',
  /** column name */
  rgb = 'rgb',
  /** column name */
  slug = 'slug',
  /** column name */
  type = 'type',
  /** column name */
  updated_at = 'updated_at',
}

/** input type for updating data in table "tag" */
export interface tag_set_input {
  alternates?: InputMaybe<Scalars['jsonb']>
  created_at?: InputMaybe<Scalars['timestamptz']>
  default_image?: InputMaybe<Scalars['String']>
  default_images?: InputMaybe<Scalars['jsonb']>
  description?: InputMaybe<Scalars['String']>
  displayName?: InputMaybe<Scalars['String']>
  frequency?: InputMaybe<Scalars['Int']>
  icon?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['uuid']>
  is_ambiguous?: InputMaybe<Scalars['Boolean']>
  misc?: InputMaybe<Scalars['jsonb']>
  name?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Scalars['Int']>
  parentId?: InputMaybe<Scalars['uuid']>
  popularity?: InputMaybe<Scalars['Int']>
  rgb?: InputMaybe<Scalars['jsonb']>
  slug?: InputMaybe<Scalars['String']>
  type?: InputMaybe<Scalars['String']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
}

/** Streaming cursor of the table "tag" */
export interface tag_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: tag_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface tag_stream_cursor_value_input {
  alternates?: InputMaybe<Scalars['jsonb']>
  created_at?: InputMaybe<Scalars['timestamptz']>
  default_image?: InputMaybe<Scalars['String']>
  default_images?: InputMaybe<Scalars['jsonb']>
  description?: InputMaybe<Scalars['String']>
  displayName?: InputMaybe<Scalars['String']>
  frequency?: InputMaybe<Scalars['Int']>
  icon?: InputMaybe<Scalars['String']>
  id?: InputMaybe<Scalars['uuid']>
  is_ambiguous?: InputMaybe<Scalars['Boolean']>
  misc?: InputMaybe<Scalars['jsonb']>
  name?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Scalars['Int']>
  parentId?: InputMaybe<Scalars['uuid']>
  popularity?: InputMaybe<Scalars['Int']>
  rgb?: InputMaybe<Scalars['jsonb']>
  slug?: InputMaybe<Scalars['String']>
  type?: InputMaybe<Scalars['String']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
}

export interface tag_tag_aggregate_bool_exp {
  count?: InputMaybe<tag_tag_aggregate_bool_exp_count>
}

export interface tag_tag_aggregate_bool_exp_count {
  arguments?: InputMaybe<Array<tag_tag_select_column>>
  distinct?: InputMaybe<Scalars['Boolean']>
  filter?: InputMaybe<tag_tag_bool_exp>
  predicate: Int_comparison_exp
}

/** order by aggregate values of table "tag_tag" */
export interface tag_tag_aggregate_order_by {
  count?: InputMaybe<order_by>
  max?: InputMaybe<tag_tag_max_order_by>
  min?: InputMaybe<tag_tag_min_order_by>
}

/** input type for inserting array relation for remote table "tag_tag" */
export interface tag_tag_arr_rel_insert_input {
  data: Array<tag_tag_insert_input>
  /** upsert condition */
  on_conflict?: InputMaybe<tag_tag_on_conflict>
}

/** Boolean expression to filter rows from the table "tag_tag". All fields are combined with a logical 'AND'. */
export interface tag_tag_bool_exp {
  _and?: InputMaybe<Array<tag_tag_bool_exp>>
  _not?: InputMaybe<tag_tag_bool_exp>
  _or?: InputMaybe<Array<tag_tag_bool_exp>>
  category?: InputMaybe<tag_bool_exp>
  category_tag_id?: InputMaybe<uuid_comparison_exp>
  main?: InputMaybe<tag_bool_exp>
  tag_id?: InputMaybe<uuid_comparison_exp>
}

/** unique or primary key constraints on table "tag_tag" */
export enum tag_tag_constraint {
  /** unique or primary key constraint on columns "tag_id", "category_tag_id" */
  tag_tag_pkey = 'tag_tag_pkey',
}

/** input type for inserting data into table "tag_tag" */
export interface tag_tag_insert_input {
  category?: InputMaybe<tag_obj_rel_insert_input>
  category_tag_id?: InputMaybe<Scalars['uuid']>
  main?: InputMaybe<tag_obj_rel_insert_input>
  tag_id?: InputMaybe<Scalars['uuid']>
}

/** order by max() on columns of table "tag_tag" */
export interface tag_tag_max_order_by {
  category_tag_id?: InputMaybe<order_by>
  tag_id?: InputMaybe<order_by>
}

/** order by min() on columns of table "tag_tag" */
export interface tag_tag_min_order_by {
  category_tag_id?: InputMaybe<order_by>
  tag_id?: InputMaybe<order_by>
}

/** on_conflict condition type for table "tag_tag" */
export interface tag_tag_on_conflict {
  constraint: tag_tag_constraint
  update_columns?: Array<tag_tag_update_column>
  where?: InputMaybe<tag_tag_bool_exp>
}

/** Ordering options when selecting data from "tag_tag". */
export interface tag_tag_order_by {
  category?: InputMaybe<tag_order_by>
  category_tag_id?: InputMaybe<order_by>
  main?: InputMaybe<tag_order_by>
  tag_id?: InputMaybe<order_by>
}

/** primary key columns input for table: tag_tag */
export interface tag_tag_pk_columns_input {
  category_tag_id: Scalars['uuid']
  tag_id: Scalars['uuid']
}

/** select columns of table "tag_tag" */
export enum tag_tag_select_column {
  /** column name */
  category_tag_id = 'category_tag_id',
  /** column name */
  tag_id = 'tag_id',
}

/** input type for updating data in table "tag_tag" */
export interface tag_tag_set_input {
  category_tag_id?: InputMaybe<Scalars['uuid']>
  tag_id?: InputMaybe<Scalars['uuid']>
}

/** Streaming cursor of the table "tag_tag" */
export interface tag_tag_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: tag_tag_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface tag_tag_stream_cursor_value_input {
  category_tag_id?: InputMaybe<Scalars['uuid']>
  tag_id?: InputMaybe<Scalars['uuid']>
}

/** update columns of table "tag_tag" */
export enum tag_tag_update_column {
  /** column name */
  category_tag_id = 'category_tag_id',
  /** column name */
  tag_id = 'tag_id',
}

export interface tag_tag_updates {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<tag_tag_set_input>
  where: tag_tag_bool_exp
}

/** update columns of table "tag" */
export enum tag_update_column {
  /** column name */
  alternates = 'alternates',
  /** column name */
  created_at = 'created_at',
  /** column name */
  default_image = 'default_image',
  /** column name */
  default_images = 'default_images',
  /** column name */
  description = 'description',
  /** column name */
  displayName = 'displayName',
  /** column name */
  frequency = 'frequency',
  /** column name */
  icon = 'icon',
  /** column name */
  id = 'id',
  /** column name */
  is_ambiguous = 'is_ambiguous',
  /** column name */
  misc = 'misc',
  /** column name */
  name = 'name',
  /** column name */
  order = 'order',
  /** column name */
  parentId = 'parentId',
  /** column name */
  popularity = 'popularity',
  /** column name */
  rgb = 'rgb',
  /** column name */
  slug = 'slug',
  /** column name */
  type = 'type',
  /** column name */
  updated_at = 'updated_at',
}

export interface tag_updates {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<tag_append_input>
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<tag_delete_at_path_input>
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<tag_delete_elem_input>
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<tag_delete_key_input>
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<tag_inc_input>
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<tag_prepend_input>
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<tag_set_input>
  where: tag_bool_exp
}

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export interface timestamptz_comparison_exp {
  _eq?: InputMaybe<Scalars['timestamptz']>
  _gt?: InputMaybe<Scalars['timestamptz']>
  _gte?: InputMaybe<Scalars['timestamptz']>
  _in?: InputMaybe<Array<Scalars['timestamptz']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _lt?: InputMaybe<Scalars['timestamptz']>
  _lte?: InputMaybe<Scalars['timestamptz']>
  _neq?: InputMaybe<Scalars['timestamptz']>
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>
}

export interface top_tags_restaurant_args {
  _tag_types?: InputMaybe<Scalars['String']>
  tag_slugs?: InputMaybe<Scalars['String']>
}

/** Boolean expression to compare columns of type "tsrange". All fields are combined with logical 'AND'. */
export interface tsrange_comparison_exp {
  _eq?: InputMaybe<Scalars['tsrange']>
  _gt?: InputMaybe<Scalars['tsrange']>
  _gte?: InputMaybe<Scalars['tsrange']>
  _in?: InputMaybe<Array<Scalars['tsrange']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _lt?: InputMaybe<Scalars['tsrange']>
  _lte?: InputMaybe<Scalars['tsrange']>
  _neq?: InputMaybe<Scalars['tsrange']>
  _nin?: InputMaybe<Array<Scalars['tsrange']>>
}

/** Boolean expression to filter rows from the table "user". All fields are combined with a logical 'AND'. */
export interface user_bool_exp {
  _and?: InputMaybe<Array<user_bool_exp>>
  _not?: InputMaybe<user_bool_exp>
  _or?: InputMaybe<Array<user_bool_exp>>
  about?: InputMaybe<String_comparison_exp>
  apple_email?: InputMaybe<String_comparison_exp>
  apple_refresh_token?: InputMaybe<String_comparison_exp>
  apple_token?: InputMaybe<String_comparison_exp>
  apple_uid?: InputMaybe<String_comparison_exp>
  avatar?: InputMaybe<String_comparison_exp>
  charIndex?: InputMaybe<Int_comparison_exp>
  created_at?: InputMaybe<timestamptz_comparison_exp>
  email?: InputMaybe<String_comparison_exp>
  followers?: InputMaybe<follow_bool_exp>
  followers_aggregate?: InputMaybe<follow_aggregate_bool_exp>
  following?: InputMaybe<follow_bool_exp>
  following_aggregate?: InputMaybe<follow_aggregate_bool_exp>
  has_onboarded?: InputMaybe<Boolean_comparison_exp>
  id?: InputMaybe<uuid_comparison_exp>
  lists?: InputMaybe<list_bool_exp>
  lists_aggregate?: InputMaybe<list_aggregate_bool_exp>
  location?: InputMaybe<String_comparison_exp>
  name?: InputMaybe<String_comparison_exp>
  password?: InputMaybe<String_comparison_exp>
  password_reset_date?: InputMaybe<timestamptz_comparison_exp>
  password_reset_token?: InputMaybe<String_comparison_exp>
  photo_xrefs?: InputMaybe<photo_xref_bool_exp>
  photo_xrefs_aggregate?: InputMaybe<photo_xref_aggregate_bool_exp>
  reviews?: InputMaybe<review_bool_exp>
  reviews_aggregate?: InputMaybe<review_aggregate_bool_exp>
  role?: InputMaybe<String_comparison_exp>
  updated_at?: InputMaybe<timestamptz_comparison_exp>
  username?: InputMaybe<String_comparison_exp>
}

/** unique or primary key constraints on table "user" */
export enum user_constraint {
  /** unique or primary key constraint on columns "email" */
  user_email_key = 'user_email_key',
  /** unique or primary key constraint on columns "id" */
  user_pkey = 'user_pkey',
  /** unique or primary key constraint on columns "username" */
  user_username_key = 'user_username_key',
}

/** input type for incrementing numeric columns in table "user" */
export interface user_inc_input {
  charIndex?: InputMaybe<Scalars['Int']>
}

/** input type for inserting data into table "user" */
export interface user_insert_input {
  about?: InputMaybe<Scalars['String']>
  apple_email?: InputMaybe<Scalars['String']>
  apple_refresh_token?: InputMaybe<Scalars['String']>
  apple_token?: InputMaybe<Scalars['String']>
  apple_uid?: InputMaybe<Scalars['String']>
  avatar?: InputMaybe<Scalars['String']>
  charIndex?: InputMaybe<Scalars['Int']>
  created_at?: InputMaybe<Scalars['timestamptz']>
  email?: InputMaybe<Scalars['String']>
  followers?: InputMaybe<follow_arr_rel_insert_input>
  following?: InputMaybe<follow_arr_rel_insert_input>
  has_onboarded?: InputMaybe<Scalars['Boolean']>
  id?: InputMaybe<Scalars['uuid']>
  lists?: InputMaybe<list_arr_rel_insert_input>
  location?: InputMaybe<Scalars['String']>
  name?: InputMaybe<Scalars['String']>
  password?: InputMaybe<Scalars['String']>
  password_reset_date?: InputMaybe<Scalars['timestamptz']>
  password_reset_token?: InputMaybe<Scalars['String']>
  photo_xrefs?: InputMaybe<photo_xref_arr_rel_insert_input>
  reviews?: InputMaybe<review_arr_rel_insert_input>
  role?: InputMaybe<Scalars['String']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
  username?: InputMaybe<Scalars['String']>
}

/** input type for inserting object relation for remote table "user" */
export interface user_obj_rel_insert_input {
  data: user_insert_input
  /** upsert condition */
  on_conflict?: InputMaybe<user_on_conflict>
}

/** on_conflict condition type for table "user" */
export interface user_on_conflict {
  constraint: user_constraint
  update_columns?: Array<user_update_column>
  where?: InputMaybe<user_bool_exp>
}

/** Ordering options when selecting data from "user". */
export interface user_order_by {
  about?: InputMaybe<order_by>
  apple_email?: InputMaybe<order_by>
  apple_refresh_token?: InputMaybe<order_by>
  apple_token?: InputMaybe<order_by>
  apple_uid?: InputMaybe<order_by>
  avatar?: InputMaybe<order_by>
  charIndex?: InputMaybe<order_by>
  created_at?: InputMaybe<order_by>
  email?: InputMaybe<order_by>
  followers_aggregate?: InputMaybe<follow_aggregate_order_by>
  following_aggregate?: InputMaybe<follow_aggregate_order_by>
  has_onboarded?: InputMaybe<order_by>
  id?: InputMaybe<order_by>
  lists_aggregate?: InputMaybe<list_aggregate_order_by>
  location?: InputMaybe<order_by>
  name?: InputMaybe<order_by>
  password?: InputMaybe<order_by>
  password_reset_date?: InputMaybe<order_by>
  password_reset_token?: InputMaybe<order_by>
  photo_xrefs_aggregate?: InputMaybe<photo_xref_aggregate_order_by>
  reviews_aggregate?: InputMaybe<review_aggregate_order_by>
  role?: InputMaybe<order_by>
  updated_at?: InputMaybe<order_by>
  username?: InputMaybe<order_by>
}

/** primary key columns input for table: user */
export interface user_pk_columns_input {
  id: Scalars['uuid']
}

/** select columns of table "user" */
export enum user_select_column {
  /** column name */
  about = 'about',
  /** column name */
  apple_email = 'apple_email',
  /** column name */
  apple_refresh_token = 'apple_refresh_token',
  /** column name */
  apple_token = 'apple_token',
  /** column name */
  apple_uid = 'apple_uid',
  /** column name */
  avatar = 'avatar',
  /** column name */
  charIndex = 'charIndex',
  /** column name */
  created_at = 'created_at',
  /** column name */
  email = 'email',
  /** column name */
  has_onboarded = 'has_onboarded',
  /** column name */
  id = 'id',
  /** column name */
  location = 'location',
  /** column name */
  name = 'name',
  /** column name */
  password = 'password',
  /** column name */
  password_reset_date = 'password_reset_date',
  /** column name */
  password_reset_token = 'password_reset_token',
  /** column name */
  role = 'role',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  username = 'username',
}

/** input type for updating data in table "user" */
export interface user_set_input {
  about?: InputMaybe<Scalars['String']>
  apple_email?: InputMaybe<Scalars['String']>
  apple_refresh_token?: InputMaybe<Scalars['String']>
  apple_token?: InputMaybe<Scalars['String']>
  apple_uid?: InputMaybe<Scalars['String']>
  avatar?: InputMaybe<Scalars['String']>
  charIndex?: InputMaybe<Scalars['Int']>
  created_at?: InputMaybe<Scalars['timestamptz']>
  email?: InputMaybe<Scalars['String']>
  has_onboarded?: InputMaybe<Scalars['Boolean']>
  id?: InputMaybe<Scalars['uuid']>
  location?: InputMaybe<Scalars['String']>
  name?: InputMaybe<Scalars['String']>
  password?: InputMaybe<Scalars['String']>
  password_reset_date?: InputMaybe<Scalars['timestamptz']>
  password_reset_token?: InputMaybe<Scalars['String']>
  role?: InputMaybe<Scalars['String']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
  username?: InputMaybe<Scalars['String']>
}

/** Streaming cursor of the table "user" */
export interface user_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: user_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface user_stream_cursor_value_input {
  about?: InputMaybe<Scalars['String']>
  apple_email?: InputMaybe<Scalars['String']>
  apple_refresh_token?: InputMaybe<Scalars['String']>
  apple_token?: InputMaybe<Scalars['String']>
  apple_uid?: InputMaybe<Scalars['String']>
  avatar?: InputMaybe<Scalars['String']>
  charIndex?: InputMaybe<Scalars['Int']>
  created_at?: InputMaybe<Scalars['timestamptz']>
  email?: InputMaybe<Scalars['String']>
  has_onboarded?: InputMaybe<Scalars['Boolean']>
  id?: InputMaybe<Scalars['uuid']>
  location?: InputMaybe<Scalars['String']>
  name?: InputMaybe<Scalars['String']>
  password?: InputMaybe<Scalars['String']>
  password_reset_date?: InputMaybe<Scalars['timestamptz']>
  password_reset_token?: InputMaybe<Scalars['String']>
  role?: InputMaybe<Scalars['String']>
  updated_at?: InputMaybe<Scalars['timestamptz']>
  username?: InputMaybe<Scalars['String']>
}

/** update columns of table "user" */
export enum user_update_column {
  /** column name */
  about = 'about',
  /** column name */
  apple_email = 'apple_email',
  /** column name */
  apple_refresh_token = 'apple_refresh_token',
  /** column name */
  apple_token = 'apple_token',
  /** column name */
  apple_uid = 'apple_uid',
  /** column name */
  avatar = 'avatar',
  /** column name */
  charIndex = 'charIndex',
  /** column name */
  created_at = 'created_at',
  /** column name */
  email = 'email',
  /** column name */
  has_onboarded = 'has_onboarded',
  /** column name */
  id = 'id',
  /** column name */
  location = 'location',
  /** column name */
  name = 'name',
  /** column name */
  password = 'password',
  /** column name */
  password_reset_date = 'password_reset_date',
  /** column name */
  password_reset_token = 'password_reset_token',
  /** column name */
  role = 'role',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  username = 'username',
}

export interface user_updates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<user_inc_input>
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<user_set_input>
  where: user_bool_exp
}

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export interface uuid_comparison_exp {
  _eq?: InputMaybe<Scalars['uuid']>
  _gt?: InputMaybe<Scalars['uuid']>
  _gte?: InputMaybe<Scalars['uuid']>
  _in?: InputMaybe<Array<Scalars['uuid']>>
  _is_null?: InputMaybe<Scalars['Boolean']>
  _lt?: InputMaybe<Scalars['uuid']>
  _lte?: InputMaybe<Scalars['uuid']>
  _neq?: InputMaybe<Scalars['uuid']>
  _nin?: InputMaybe<Array<Scalars['uuid']>>
}

/** Boolean expression to filter rows from the table "zcta5". All fields are combined with a logical 'AND'. */
export interface zcta5_bool_exp {
  _and?: InputMaybe<Array<zcta5_bool_exp>>
  _not?: InputMaybe<zcta5_bool_exp>
  _or?: InputMaybe<Array<zcta5_bool_exp>>
  color?: InputMaybe<String_comparison_exp>
  intptlat10?: InputMaybe<String_comparison_exp>
  intptlon10?: InputMaybe<String_comparison_exp>
  nhood?: InputMaybe<String_comparison_exp>
  ogc_fid?: InputMaybe<Int_comparison_exp>
  slug?: InputMaybe<String_comparison_exp>
  wkb_geometry?: InputMaybe<geometry_comparison_exp>
}

/** unique or primary key constraints on table "zcta5" */
export enum zcta5_constraint {
  /** unique or primary key constraint on columns "ogc_fid" */
  zcta5_pkey = 'zcta5_pkey',
  /** unique or primary key constraint on columns "slug" */
  zcta5_slug_key = 'zcta5_slug_key',
}

/** input type for incrementing numeric columns in table "zcta5" */
export interface zcta5_inc_input {
  ogc_fid?: InputMaybe<Scalars['Int']>
}

/** input type for inserting data into table "zcta5" */
export interface zcta5_insert_input {
  color?: InputMaybe<Scalars['String']>
  intptlat10?: InputMaybe<Scalars['String']>
  intptlon10?: InputMaybe<Scalars['String']>
  nhood?: InputMaybe<Scalars['String']>
  ogc_fid?: InputMaybe<Scalars['Int']>
  slug?: InputMaybe<Scalars['String']>
  wkb_geometry?: InputMaybe<Scalars['geometry']>
}

/** on_conflict condition type for table "zcta5" */
export interface zcta5_on_conflict {
  constraint: zcta5_constraint
  update_columns?: Array<zcta5_update_column>
  where?: InputMaybe<zcta5_bool_exp>
}

/** Ordering options when selecting data from "zcta5". */
export interface zcta5_order_by {
  color?: InputMaybe<order_by>
  intptlat10?: InputMaybe<order_by>
  intptlon10?: InputMaybe<order_by>
  nhood?: InputMaybe<order_by>
  ogc_fid?: InputMaybe<order_by>
  slug?: InputMaybe<order_by>
  wkb_geometry?: InputMaybe<order_by>
}

/** primary key columns input for table: zcta5 */
export interface zcta5_pk_columns_input {
  ogc_fid: Scalars['Int']
}

/** select columns of table "zcta5" */
export enum zcta5_select_column {
  /** column name */
  color = 'color',
  /** column name */
  intptlat10 = 'intptlat10',
  /** column name */
  intptlon10 = 'intptlon10',
  /** column name */
  nhood = 'nhood',
  /** column name */
  ogc_fid = 'ogc_fid',
  /** column name */
  slug = 'slug',
  /** column name */
  wkb_geometry = 'wkb_geometry',
}

/** input type for updating data in table "zcta5" */
export interface zcta5_set_input {
  color?: InputMaybe<Scalars['String']>
  intptlat10?: InputMaybe<Scalars['String']>
  intptlon10?: InputMaybe<Scalars['String']>
  nhood?: InputMaybe<Scalars['String']>
  ogc_fid?: InputMaybe<Scalars['Int']>
  slug?: InputMaybe<Scalars['String']>
  wkb_geometry?: InputMaybe<Scalars['geometry']>
}

/** Streaming cursor of the table "zcta5" */
export interface zcta5_stream_cursor_input {
  /** Stream column input with initial value */
  initial_value: zcta5_stream_cursor_value_input
  /** cursor ordering */
  ordering?: InputMaybe<cursor_ordering>
}

/** Initial value of the column from where the streaming should start */
export interface zcta5_stream_cursor_value_input {
  color?: InputMaybe<Scalars['String']>
  intptlat10?: InputMaybe<Scalars['String']>
  intptlon10?: InputMaybe<Scalars['String']>
  nhood?: InputMaybe<Scalars['String']>
  ogc_fid?: InputMaybe<Scalars['Int']>
  slug?: InputMaybe<Scalars['String']>
  wkb_geometry?: InputMaybe<Scalars['geometry']>
}

/** update columns of table "zcta5" */
export enum zcta5_update_column {
  /** column name */
  color = 'color',
  /** column name */
  intptlat10 = 'intptlat10',
  /** column name */
  intptlon10 = 'intptlon10',
  /** column name */
  nhood = 'nhood',
  /** column name */
  ogc_fid = 'ogc_fid',
  /** column name */
  slug = 'slug',
  /** column name */
  wkb_geometry = 'wkb_geometry',
}

export interface zcta5_updates {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<zcta5_inc_input>
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<zcta5_set_input>
  where: zcta5_bool_exp
}

export const scalarsEnumsHash: import('gqty').ScalarsEnumsHash = {
  Boolean: true,
  Float: true,
  Int: true,
  String: true,
  boundaries_city_constraint: true,
  boundaries_city_select_column: true,
  boundaries_city_update_column: true,
  cursor_ordering: true,
  follow_constraint: true,
  follow_select_column: true,
  follow_update_column: true,
  geography: true,
  geometry: true,
  hrr_constraint: true,
  hrr_select_column: true,
  hrr_update_column: true,
  jsonb: true,
  list_constraint: true,
  list_region_constraint: true,
  list_region_select_column: true,
  list_region_update_column: true,
  list_restaurant_constraint: true,
  list_restaurant_select_column: true,
  list_restaurant_tag_constraint: true,
  list_restaurant_tag_select_column: true,
  list_restaurant_tag_update_column: true,
  list_restaurant_update_column: true,
  list_select_column: true,
  list_select_column_list_aggregate_bool_exp_bool_and_arguments_columns: true,
  list_select_column_list_aggregate_bool_exp_bool_or_arguments_columns: true,
  list_tag_constraint: true,
  list_tag_select_column: true,
  list_tag_update_column: true,
  list_update_column: true,
  menu_item_constraint: true,
  menu_item_select_column: true,
  menu_item_update_column: true,
  nhood_labels_constraint: true,
  nhood_labels_select_column: true,
  nhood_labels_update_column: true,
  numeric: true,
  opening_hours_constraint: true,
  opening_hours_select_column: true,
  opening_hours_update_column: true,
  order_by: true,
  photo_constraint: true,
  photo_select_column: true,
  photo_update_column: true,
  photo_xref_constraint: true,
  photo_xref_select_column: true,
  photo_xref_update_column: true,
  restaurant_constraint: true,
  restaurant_scalar: true,
  restaurant_select_column: true,
  restaurant_select_column_restaurant_aggregate_bool_exp_bool_and_arguments_columns: true,
  restaurant_select_column_restaurant_aggregate_bool_exp_bool_or_arguments_columns: true,
  restaurant_tag_constraint: true,
  restaurant_tag_select_column: true,
  restaurant_tag_update_column: true,
  restaurant_update_column: true,
  review_constraint: true,
  review_select_column: true,
  review_select_column_review_aggregate_bool_exp_bool_and_arguments_columns: true,
  review_select_column_review_aggregate_bool_exp_bool_or_arguments_columns: true,
  review_tag_sentence_constraint: true,
  review_tag_sentence_select_column: true,
  review_tag_sentence_update_column: true,
  review_update_column: true,
  setting_constraint: true,
  setting_select_column: true,
  setting_update_column: true,
  tag_constraint: true,
  tag_select_column: true,
  tag_tag_constraint: true,
  tag_tag_select_column: true,
  tag_tag_update_column: true,
  tag_update_column: true,
  timestamptz: true,
  tsrange: true,
  user_constraint: true,
  user_select_column: true,
  user_update_column: true,
  uuid: true,
  zcta5_constraint: true,
  zcta5_select_column: true,
  zcta5_update_column: true,
}
export const generatedSchema = {
  Boolean_comparison_exp: {
    _eq: { __type: 'Boolean' },
    _gt: { __type: 'Boolean' },
    _gte: { __type: 'Boolean' },
    _in: { __type: '[Boolean!]' },
    _is_null: { __type: 'Boolean' },
    _lt: { __type: 'Boolean' },
    _lte: { __type: 'Boolean' },
    _neq: { __type: 'Boolean' },
    _nin: { __type: '[Boolean!]' },
  },
  Int_comparison_exp: {
    _eq: { __type: 'Int' },
    _gt: { __type: 'Int' },
    _gte: { __type: 'Int' },
    _in: { __type: '[Int!]' },
    _is_null: { __type: 'Boolean' },
    _lt: { __type: 'Int' },
    _lte: { __type: 'Int' },
    _neq: { __type: 'Int' },
    _nin: { __type: '[Int!]' },
  },
  String_comparison_exp: {
    _eq: { __type: 'String' },
    _gt: { __type: 'String' },
    _gte: { __type: 'String' },
    _ilike: { __type: 'String' },
    _in: { __type: '[String!]' },
    _iregex: { __type: 'String' },
    _is_null: { __type: 'Boolean' },
    _like: { __type: 'String' },
    _lt: { __type: 'String' },
    _lte: { __type: 'String' },
    _neq: { __type: 'String' },
    _nilike: { __type: 'String' },
    _nin: { __type: '[String!]' },
    _niregex: { __type: 'String' },
    _nlike: { __type: 'String' },
    _nregex: { __type: 'String' },
    _nsimilar: { __type: 'String' },
    _regex: { __type: 'String' },
    _similar: { __type: 'String' },
  },
  boundaries_city: {
    __typename: { __type: 'String!' },
    name: { __type: 'String' },
    ogc_fid: { __type: 'Int!' },
    wkb_geometry: { __type: 'geometry' },
  },
  boundaries_city_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'boundaries_city_aggregate_fields' },
    nodes: { __type: '[boundaries_city!]!' },
  },
  boundaries_city_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'boundaries_city_avg_fields' },
    count: {
      __type: 'Int!',
      __args: { columns: '[boundaries_city_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'boundaries_city_max_fields' },
    min: { __type: 'boundaries_city_min_fields' },
    stddev: { __type: 'boundaries_city_stddev_fields' },
    stddev_pop: { __type: 'boundaries_city_stddev_pop_fields' },
    stddev_samp: { __type: 'boundaries_city_stddev_samp_fields' },
    sum: { __type: 'boundaries_city_sum_fields' },
    var_pop: { __type: 'boundaries_city_var_pop_fields' },
    var_samp: { __type: 'boundaries_city_var_samp_fields' },
    variance: { __type: 'boundaries_city_variance_fields' },
  },
  boundaries_city_avg_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Float' },
  },
  boundaries_city_bool_exp: {
    _and: { __type: '[boundaries_city_bool_exp!]' },
    _not: { __type: 'boundaries_city_bool_exp' },
    _or: { __type: '[boundaries_city_bool_exp!]' },
    name: { __type: 'String_comparison_exp' },
    ogc_fid: { __type: 'Int_comparison_exp' },
    wkb_geometry: { __type: 'geometry_comparison_exp' },
  },
  boundaries_city_inc_input: { ogc_fid: { __type: 'Int' } },
  boundaries_city_insert_input: {
    name: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
    wkb_geometry: { __type: 'geometry' },
  },
  boundaries_city_max_fields: {
    __typename: { __type: 'String!' },
    name: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
  },
  boundaries_city_min_fields: {
    __typename: { __type: 'String!' },
    name: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
  },
  boundaries_city_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[boundaries_city!]!' },
  },
  boundaries_city_on_conflict: {
    constraint: { __type: 'boundaries_city_constraint!' },
    update_columns: { __type: '[boundaries_city_update_column!]!' },
    where: { __type: 'boundaries_city_bool_exp' },
  },
  boundaries_city_order_by: {
    name: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
    wkb_geometry: { __type: 'order_by' },
  },
  boundaries_city_pk_columns_input: { ogc_fid: { __type: 'Int!' } },
  boundaries_city_set_input: {
    name: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
    wkb_geometry: { __type: 'geometry' },
  },
  boundaries_city_stddev_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Float' },
  },
  boundaries_city_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Float' },
  },
  boundaries_city_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Float' },
  },
  boundaries_city_stream_cursor_input: {
    initial_value: { __type: 'boundaries_city_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  boundaries_city_stream_cursor_value_input: {
    name: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
    wkb_geometry: { __type: 'geometry' },
  },
  boundaries_city_sum_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Int' },
  },
  boundaries_city_updates: {
    _inc: { __type: 'boundaries_city_inc_input' },
    _set: { __type: 'boundaries_city_set_input' },
    where: { __type: 'boundaries_city_bool_exp!' },
  },
  boundaries_city_var_pop_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Float' },
  },
  boundaries_city_var_samp_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Float' },
  },
  boundaries_city_variance_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Float' },
  },
  follow: {
    __typename: { __type: 'String!' },
    follower_id: { __type: 'uuid!' },
    following_id: { __type: 'uuid!' },
    id: { __type: 'uuid!' },
    user: { __type: 'user!' },
  },
  follow_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'follow_aggregate_fields' },
    nodes: { __type: '[follow!]!' },
  },
  follow_aggregate_bool_exp: { count: { __type: 'follow_aggregate_bool_exp_count' } },
  follow_aggregate_bool_exp_count: {
    arguments: { __type: '[follow_select_column!]' },
    distinct: { __type: 'Boolean' },
    filter: { __type: 'follow_bool_exp' },
    predicate: { __type: 'Int_comparison_exp!' },
  },
  follow_aggregate_fields: {
    __typename: { __type: 'String!' },
    count: {
      __type: 'Int!',
      __args: { columns: '[follow_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'follow_max_fields' },
    min: { __type: 'follow_min_fields' },
  },
  follow_aggregate_order_by: {
    count: { __type: 'order_by' },
    max: { __type: 'follow_max_order_by' },
    min: { __type: 'follow_min_order_by' },
  },
  follow_arr_rel_insert_input: {
    data: { __type: '[follow_insert_input!]!' },
    on_conflict: { __type: 'follow_on_conflict' },
  },
  follow_bool_exp: {
    _and: { __type: '[follow_bool_exp!]' },
    _not: { __type: 'follow_bool_exp' },
    _or: { __type: '[follow_bool_exp!]' },
    follower_id: { __type: 'uuid_comparison_exp' },
    following_id: { __type: 'uuid_comparison_exp' },
    id: { __type: 'uuid_comparison_exp' },
    user: { __type: 'user_bool_exp' },
  },
  follow_insert_input: {
    follower_id: { __type: 'uuid' },
    following_id: { __type: 'uuid' },
    id: { __type: 'uuid' },
    user: { __type: 'user_obj_rel_insert_input' },
  },
  follow_max_fields: {
    __typename: { __type: 'String!' },
    follower_id: { __type: 'uuid' },
    following_id: { __type: 'uuid' },
    id: { __type: 'uuid' },
  },
  follow_max_order_by: {
    follower_id: { __type: 'order_by' },
    following_id: { __type: 'order_by' },
    id: { __type: 'order_by' },
  },
  follow_min_fields: {
    __typename: { __type: 'String!' },
    follower_id: { __type: 'uuid' },
    following_id: { __type: 'uuid' },
    id: { __type: 'uuid' },
  },
  follow_min_order_by: {
    follower_id: { __type: 'order_by' },
    following_id: { __type: 'order_by' },
    id: { __type: 'order_by' },
  },
  follow_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[follow!]!' },
  },
  follow_on_conflict: {
    constraint: { __type: 'follow_constraint!' },
    update_columns: { __type: '[follow_update_column!]!' },
    where: { __type: 'follow_bool_exp' },
  },
  follow_order_by: {
    follower_id: { __type: 'order_by' },
    following_id: { __type: 'order_by' },
    id: { __type: 'order_by' },
    user: { __type: 'user_order_by' },
  },
  follow_pk_columns_input: { id: { __type: 'uuid!' } },
  follow_set_input: {
    follower_id: { __type: 'uuid' },
    following_id: { __type: 'uuid' },
    id: { __type: 'uuid' },
  },
  follow_stream_cursor_input: {
    initial_value: { __type: 'follow_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  follow_stream_cursor_value_input: {
    follower_id: { __type: 'uuid' },
    following_id: { __type: 'uuid' },
    id: { __type: 'uuid' },
  },
  follow_updates: {
    _set: { __type: 'follow_set_input' },
    where: { __type: 'follow_bool_exp!' },
  },
  geography_cast_exp: { geometry: { __type: 'geometry_comparison_exp' } },
  geography_comparison_exp: {
    _cast: { __type: 'geography_cast_exp' },
    _eq: { __type: 'geography' },
    _gt: { __type: 'geography' },
    _gte: { __type: 'geography' },
    _in: { __type: '[geography!]' },
    _is_null: { __type: 'Boolean' },
    _lt: { __type: 'geography' },
    _lte: { __type: 'geography' },
    _neq: { __type: 'geography' },
    _nin: { __type: '[geography!]' },
    _st_d_within: { __type: 'st_d_within_geography_input' },
    _st_intersects: { __type: 'geography' },
  },
  geometry_cast_exp: { geography: { __type: 'geography_comparison_exp' } },
  geometry_comparison_exp: {
    _cast: { __type: 'geometry_cast_exp' },
    _eq: { __type: 'geometry' },
    _gt: { __type: 'geometry' },
    _gte: { __type: 'geometry' },
    _in: { __type: '[geometry!]' },
    _is_null: { __type: 'Boolean' },
    _lt: { __type: 'geometry' },
    _lte: { __type: 'geometry' },
    _neq: { __type: 'geometry' },
    _nin: { __type: '[geometry!]' },
    _st_3d_d_within: { __type: 'st_d_within_input' },
    _st_3d_intersects: { __type: 'geometry' },
    _st_contains: { __type: 'geometry' },
    _st_crosses: { __type: 'geometry' },
    _st_d_within: { __type: 'st_d_within_input' },
    _st_equals: { __type: 'geometry' },
    _st_intersects: { __type: 'geometry' },
    _st_overlaps: { __type: 'geometry' },
    _st_touches: { __type: 'geometry' },
    _st_within: { __type: 'geometry' },
  },
  hrr: {
    __typename: { __type: 'String!' },
    color: { __type: 'String' },
    hrrcity: { __type: 'String' },
    ogc_fid: { __type: 'Int!' },
    slug: { __type: 'String' },
    wkb_geometry: { __type: 'geometry' },
  },
  hrr_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'hrr_aggregate_fields' },
    nodes: { __type: '[hrr!]!' },
  },
  hrr_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'hrr_avg_fields' },
    count: {
      __type: 'Int!',
      __args: { columns: '[hrr_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'hrr_max_fields' },
    min: { __type: 'hrr_min_fields' },
    stddev: { __type: 'hrr_stddev_fields' },
    stddev_pop: { __type: 'hrr_stddev_pop_fields' },
    stddev_samp: { __type: 'hrr_stddev_samp_fields' },
    sum: { __type: 'hrr_sum_fields' },
    var_pop: { __type: 'hrr_var_pop_fields' },
    var_samp: { __type: 'hrr_var_samp_fields' },
    variance: { __type: 'hrr_variance_fields' },
  },
  hrr_avg_fields: { __typename: { __type: 'String!' }, ogc_fid: { __type: 'Float' } },
  hrr_bool_exp: {
    _and: { __type: '[hrr_bool_exp!]' },
    _not: { __type: 'hrr_bool_exp' },
    _or: { __type: '[hrr_bool_exp!]' },
    color: { __type: 'String_comparison_exp' },
    hrrcity: { __type: 'String_comparison_exp' },
    ogc_fid: { __type: 'Int_comparison_exp' },
    slug: { __type: 'String_comparison_exp' },
    wkb_geometry: { __type: 'geometry_comparison_exp' },
  },
  hrr_inc_input: { ogc_fid: { __type: 'Int' } },
  hrr_insert_input: {
    color: { __type: 'String' },
    hrrcity: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
    slug: { __type: 'String' },
    wkb_geometry: { __type: 'geometry' },
  },
  hrr_max_fields: {
    __typename: { __type: 'String!' },
    color: { __type: 'String' },
    hrrcity: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
    slug: { __type: 'String' },
  },
  hrr_min_fields: {
    __typename: { __type: 'String!' },
    color: { __type: 'String' },
    hrrcity: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
    slug: { __type: 'String' },
  },
  hrr_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[hrr!]!' },
  },
  hrr_on_conflict: {
    constraint: { __type: 'hrr_constraint!' },
    update_columns: { __type: '[hrr_update_column!]!' },
    where: { __type: 'hrr_bool_exp' },
  },
  hrr_order_by: {
    color: { __type: 'order_by' },
    hrrcity: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
    slug: { __type: 'order_by' },
    wkb_geometry: { __type: 'order_by' },
  },
  hrr_pk_columns_input: { ogc_fid: { __type: 'Int!' } },
  hrr_set_input: {
    color: { __type: 'String' },
    hrrcity: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
    slug: { __type: 'String' },
    wkb_geometry: { __type: 'geometry' },
  },
  hrr_stddev_fields: { __typename: { __type: 'String!' }, ogc_fid: { __type: 'Float' } },
  hrr_stddev_pop_fields: { __typename: { __type: 'String!' }, ogc_fid: { __type: 'Float' } },
  hrr_stddev_samp_fields: { __typename: { __type: 'String!' }, ogc_fid: { __type: 'Float' } },
  hrr_stream_cursor_input: {
    initial_value: { __type: 'hrr_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  hrr_stream_cursor_value_input: {
    color: { __type: 'String' },
    hrrcity: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
    slug: { __type: 'String' },
    wkb_geometry: { __type: 'geometry' },
  },
  hrr_sum_fields: { __typename: { __type: 'String!' }, ogc_fid: { __type: 'Int' } },
  hrr_updates: {
    _inc: { __type: 'hrr_inc_input' },
    _set: { __type: 'hrr_set_input' },
    where: { __type: 'hrr_bool_exp!' },
  },
  hrr_var_pop_fields: { __typename: { __type: 'String!' }, ogc_fid: { __type: 'Float' } },
  hrr_var_samp_fields: { __typename: { __type: 'String!' }, ogc_fid: { __type: 'Float' } },
  hrr_variance_fields: { __typename: { __type: 'String!' }, ogc_fid: { __type: 'Float' } },
  jsonb_cast_exp: { String: { __type: 'String_comparison_exp' } },
  jsonb_comparison_exp: {
    _cast: { __type: 'jsonb_cast_exp' },
    _contained_in: { __type: 'jsonb' },
    _contains: { __type: 'jsonb' },
    _eq: { __type: 'jsonb' },
    _gt: { __type: 'jsonb' },
    _gte: { __type: 'jsonb' },
    _has_key: { __type: 'String' },
    _has_keys_all: { __type: '[String!]' },
    _has_keys_any: { __type: '[String!]' },
    _in: { __type: '[jsonb!]' },
    _is_null: { __type: 'Boolean' },
    _lt: { __type: 'jsonb' },
    _lte: { __type: 'jsonb' },
    _neq: { __type: 'jsonb' },
    _nin: { __type: '[jsonb!]' },
  },
  list: {
    __typename: { __type: 'String!' },
    color: { __type: 'Int' },
    created_at: { __type: 'timestamptz!' },
    description: { __type: 'String' },
    font: { __type: 'Int' },
    id: { __type: 'uuid!' },
    image: { __type: 'String' },
    list_reviews: {
      __type: '[review!]!',
      __args: {
        distinct_on: '[review_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_order_by!]',
        where: 'review_bool_exp',
      },
    },
    list_reviews_aggregate: {
      __type: 'review_aggregate!',
      __args: {
        distinct_on: '[review_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_order_by!]',
        where: 'review_bool_exp',
      },
    },
    location: { __type: 'geometry' },
    name: { __type: 'String!' },
    public: { __type: 'Boolean!' },
    region: { __type: 'String' },
    regions: {
      __type: '[list_region!]!',
      __args: {
        distinct_on: '[list_region_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_region_order_by!]',
        where: 'list_region_bool_exp',
      },
    },
    regions_aggregate: {
      __type: 'list_region_aggregate!',
      __args: {
        distinct_on: '[list_region_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_region_order_by!]',
        where: 'list_region_bool_exp',
      },
    },
    restaurants: {
      __type: '[list_restaurant!]!',
      __args: {
        distinct_on: '[list_restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_restaurant_order_by!]',
        where: 'list_restaurant_bool_exp',
      },
    },
    restaurants_aggregate: {
      __type: 'list_restaurant_aggregate!',
      __args: {
        distinct_on: '[list_restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_restaurant_order_by!]',
        where: 'list_restaurant_bool_exp',
      },
    },
    slug: { __type: 'String!' },
    tags: {
      __type: '[list_tag!]!',
      __args: {
        distinct_on: '[list_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_tag_order_by!]',
        where: 'list_tag_bool_exp',
      },
    },
    tags_aggregate: {
      __type: 'list_tag_aggregate!',
      __args: {
        distinct_on: '[list_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_tag_order_by!]',
        where: 'list_tag_bool_exp',
      },
    },
    theme: { __type: 'Int!' },
    updated_at: { __type: 'timestamptz!' },
    user: { __type: 'user' },
    user_id: { __type: 'uuid!' },
  },
  list_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'list_aggregate_fields' },
    nodes: { __type: '[list!]!' },
  },
  list_aggregate_bool_exp: {
    bool_and: { __type: 'list_aggregate_bool_exp_bool_and' },
    bool_or: { __type: 'list_aggregate_bool_exp_bool_or' },
    count: { __type: 'list_aggregate_bool_exp_count' },
  },
  list_aggregate_bool_exp_bool_and: {
    arguments: {
      __type: 'list_select_column_list_aggregate_bool_exp_bool_and_arguments_columns!',
    },
    distinct: { __type: 'Boolean' },
    filter: { __type: 'list_bool_exp' },
    predicate: { __type: 'Boolean_comparison_exp!' },
  },
  list_aggregate_bool_exp_bool_or: {
    arguments: {
      __type: 'list_select_column_list_aggregate_bool_exp_bool_or_arguments_columns!',
    },
    distinct: { __type: 'Boolean' },
    filter: { __type: 'list_bool_exp' },
    predicate: { __type: 'Boolean_comparison_exp!' },
  },
  list_aggregate_bool_exp_count: {
    arguments: { __type: '[list_select_column!]' },
    distinct: { __type: 'Boolean' },
    filter: { __type: 'list_bool_exp' },
    predicate: { __type: 'Int_comparison_exp!' },
  },
  list_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'list_avg_fields' },
    count: {
      __type: 'Int!',
      __args: { columns: '[list_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'list_max_fields' },
    min: { __type: 'list_min_fields' },
    stddev: { __type: 'list_stddev_fields' },
    stddev_pop: { __type: 'list_stddev_pop_fields' },
    stddev_samp: { __type: 'list_stddev_samp_fields' },
    sum: { __type: 'list_sum_fields' },
    var_pop: { __type: 'list_var_pop_fields' },
    var_samp: { __type: 'list_var_samp_fields' },
    variance: { __type: 'list_variance_fields' },
  },
  list_aggregate_order_by: {
    avg: { __type: 'list_avg_order_by' },
    count: { __type: 'order_by' },
    max: { __type: 'list_max_order_by' },
    min: { __type: 'list_min_order_by' },
    stddev: { __type: 'list_stddev_order_by' },
    stddev_pop: { __type: 'list_stddev_pop_order_by' },
    stddev_samp: { __type: 'list_stddev_samp_order_by' },
    sum: { __type: 'list_sum_order_by' },
    var_pop: { __type: 'list_var_pop_order_by' },
    var_samp: { __type: 'list_var_samp_order_by' },
    variance: { __type: 'list_variance_order_by' },
  },
  list_arr_rel_insert_input: {
    data: { __type: '[list_insert_input!]!' },
    on_conflict: { __type: 'list_on_conflict' },
  },
  list_avg_fields: {
    __typename: { __type: 'String!' },
    color: { __type: 'Float' },
    font: { __type: 'Float' },
    theme: { __type: 'Float' },
  },
  list_avg_order_by: {
    color: { __type: 'order_by' },
    font: { __type: 'order_by' },
    theme: { __type: 'order_by' },
  },
  list_bool_exp: {
    _and: { __type: '[list_bool_exp!]' },
    _not: { __type: 'list_bool_exp' },
    _or: { __type: '[list_bool_exp!]' },
    color: { __type: 'Int_comparison_exp' },
    created_at: { __type: 'timestamptz_comparison_exp' },
    description: { __type: 'String_comparison_exp' },
    font: { __type: 'Int_comparison_exp' },
    id: { __type: 'uuid_comparison_exp' },
    image: { __type: 'String_comparison_exp' },
    list_reviews: { __type: 'review_bool_exp' },
    list_reviews_aggregate: { __type: 'review_aggregate_bool_exp' },
    location: { __type: 'geometry_comparison_exp' },
    name: { __type: 'String_comparison_exp' },
    public: { __type: 'Boolean_comparison_exp' },
    region: { __type: 'String_comparison_exp' },
    regions: { __type: 'list_region_bool_exp' },
    regions_aggregate: { __type: 'list_region_aggregate_bool_exp' },
    restaurants: { __type: 'list_restaurant_bool_exp' },
    restaurants_aggregate: { __type: 'list_restaurant_aggregate_bool_exp' },
    slug: { __type: 'String_comparison_exp' },
    tags: { __type: 'list_tag_bool_exp' },
    tags_aggregate: { __type: 'list_tag_aggregate_bool_exp' },
    theme: { __type: 'Int_comparison_exp' },
    updated_at: { __type: 'timestamptz_comparison_exp' },
    user: { __type: 'user_bool_exp' },
    user_id: { __type: 'uuid_comparison_exp' },
  },
  list_inc_input: {
    color: { __type: 'Int' },
    font: { __type: 'Int' },
    theme: { __type: 'Int' },
  },
  list_insert_input: {
    color: { __type: 'Int' },
    created_at: { __type: 'timestamptz' },
    description: { __type: 'String' },
    font: { __type: 'Int' },
    id: { __type: 'uuid' },
    image: { __type: 'String' },
    list_reviews: { __type: 'review_arr_rel_insert_input' },
    location: { __type: 'geometry' },
    name: { __type: 'String' },
    public: { __type: 'Boolean' },
    region: { __type: 'String' },
    regions: { __type: 'list_region_arr_rel_insert_input' },
    restaurants: { __type: 'list_restaurant_arr_rel_insert_input' },
    slug: { __type: 'String' },
    tags: { __type: 'list_tag_arr_rel_insert_input' },
    theme: { __type: 'Int' },
    updated_at: { __type: 'timestamptz' },
    user: { __type: 'user_obj_rel_insert_input' },
    user_id: { __type: 'uuid' },
  },
  list_max_fields: {
    __typename: { __type: 'String!' },
    color: { __type: 'Int' },
    created_at: { __type: 'timestamptz' },
    description: { __type: 'String' },
    font: { __type: 'Int' },
    id: { __type: 'uuid' },
    image: { __type: 'String' },
    name: { __type: 'String' },
    region: { __type: 'String' },
    slug: { __type: 'String' },
    theme: { __type: 'Int' },
    updated_at: { __type: 'timestamptz' },
    user_id: { __type: 'uuid' },
  },
  list_max_order_by: {
    color: { __type: 'order_by' },
    created_at: { __type: 'order_by' },
    description: { __type: 'order_by' },
    font: { __type: 'order_by' },
    id: { __type: 'order_by' },
    image: { __type: 'order_by' },
    name: { __type: 'order_by' },
    region: { __type: 'order_by' },
    slug: { __type: 'order_by' },
    theme: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    user_id: { __type: 'order_by' },
  },
  list_min_fields: {
    __typename: { __type: 'String!' },
    color: { __type: 'Int' },
    created_at: { __type: 'timestamptz' },
    description: { __type: 'String' },
    font: { __type: 'Int' },
    id: { __type: 'uuid' },
    image: { __type: 'String' },
    name: { __type: 'String' },
    region: { __type: 'String' },
    slug: { __type: 'String' },
    theme: { __type: 'Int' },
    updated_at: { __type: 'timestamptz' },
    user_id: { __type: 'uuid' },
  },
  list_min_order_by: {
    color: { __type: 'order_by' },
    created_at: { __type: 'order_by' },
    description: { __type: 'order_by' },
    font: { __type: 'order_by' },
    id: { __type: 'order_by' },
    image: { __type: 'order_by' },
    name: { __type: 'order_by' },
    region: { __type: 'order_by' },
    slug: { __type: 'order_by' },
    theme: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    user_id: { __type: 'order_by' },
  },
  list_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[list!]!' },
  },
  list_obj_rel_insert_input: {
    data: { __type: 'list_insert_input!' },
    on_conflict: { __type: 'list_on_conflict' },
  },
  list_on_conflict: {
    constraint: { __type: 'list_constraint!' },
    update_columns: { __type: '[list_update_column!]!' },
    where: { __type: 'list_bool_exp' },
  },
  list_order_by: {
    color: { __type: 'order_by' },
    created_at: { __type: 'order_by' },
    description: { __type: 'order_by' },
    font: { __type: 'order_by' },
    id: { __type: 'order_by' },
    image: { __type: 'order_by' },
    list_reviews_aggregate: { __type: 'review_aggregate_order_by' },
    location: { __type: 'order_by' },
    name: { __type: 'order_by' },
    public: { __type: 'order_by' },
    region: { __type: 'order_by' },
    regions_aggregate: { __type: 'list_region_aggregate_order_by' },
    restaurants_aggregate: { __type: 'list_restaurant_aggregate_order_by' },
    slug: { __type: 'order_by' },
    tags_aggregate: { __type: 'list_tag_aggregate_order_by' },
    theme: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    user: { __type: 'user_order_by' },
    user_id: { __type: 'order_by' },
  },
  list_pk_columns_input: { id: { __type: 'uuid!' } },
  list_populated_args: { min_items: { __type: 'Int' } },
  list_region: {
    __typename: { __type: 'String!' },
    id: { __type: 'uuid!' },
    list_id: { __type: 'uuid!' },
    region: { __type: 'String!' },
    restaurant_id: { __type: 'uuid!' },
  },
  list_region_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'list_region_aggregate_fields' },
    nodes: { __type: '[list_region!]!' },
  },
  list_region_aggregate_bool_exp: {
    count: { __type: 'list_region_aggregate_bool_exp_count' },
  },
  list_region_aggregate_bool_exp_count: {
    arguments: { __type: '[list_region_select_column!]' },
    distinct: { __type: 'Boolean' },
    filter: { __type: 'list_region_bool_exp' },
    predicate: { __type: 'Int_comparison_exp!' },
  },
  list_region_aggregate_fields: {
    __typename: { __type: 'String!' },
    count: {
      __type: 'Int!',
      __args: { columns: '[list_region_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'list_region_max_fields' },
    min: { __type: 'list_region_min_fields' },
  },
  list_region_aggregate_order_by: {
    count: { __type: 'order_by' },
    max: { __type: 'list_region_max_order_by' },
    min: { __type: 'list_region_min_order_by' },
  },
  list_region_arr_rel_insert_input: {
    data: { __type: '[list_region_insert_input!]!' },
    on_conflict: { __type: 'list_region_on_conflict' },
  },
  list_region_bool_exp: {
    _and: { __type: '[list_region_bool_exp!]' },
    _not: { __type: 'list_region_bool_exp' },
    _or: { __type: '[list_region_bool_exp!]' },
    id: { __type: 'uuid_comparison_exp' },
    list_id: { __type: 'uuid_comparison_exp' },
    region: { __type: 'String_comparison_exp' },
    restaurant_id: { __type: 'uuid_comparison_exp' },
  },
  list_region_insert_input: {
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    region: { __type: 'String' },
    restaurant_id: { __type: 'uuid' },
  },
  list_region_max_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    region: { __type: 'String' },
    restaurant_id: { __type: 'uuid' },
  },
  list_region_max_order_by: {
    id: { __type: 'order_by' },
    list_id: { __type: 'order_by' },
    region: { __type: 'order_by' },
    restaurant_id: { __type: 'order_by' },
  },
  list_region_min_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    region: { __type: 'String' },
    restaurant_id: { __type: 'uuid' },
  },
  list_region_min_order_by: {
    id: { __type: 'order_by' },
    list_id: { __type: 'order_by' },
    region: { __type: 'order_by' },
    restaurant_id: { __type: 'order_by' },
  },
  list_region_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[list_region!]!' },
  },
  list_region_on_conflict: {
    constraint: { __type: 'list_region_constraint!' },
    update_columns: { __type: '[list_region_update_column!]!' },
    where: { __type: 'list_region_bool_exp' },
  },
  list_region_order_by: {
    id: { __type: 'order_by' },
    list_id: { __type: 'order_by' },
    region: { __type: 'order_by' },
    restaurant_id: { __type: 'order_by' },
  },
  list_region_pk_columns_input: { id: { __type: 'uuid!' } },
  list_region_set_input: {
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    region: { __type: 'String' },
    restaurant_id: { __type: 'uuid' },
  },
  list_region_stream_cursor_input: {
    initial_value: { __type: 'list_region_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  list_region_stream_cursor_value_input: {
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    region: { __type: 'String' },
    restaurant_id: { __type: 'uuid' },
  },
  list_region_updates: {
    _set: { __type: 'list_region_set_input' },
    where: { __type: 'list_region_bool_exp!' },
  },
  list_restaurant: {
    __typename: { __type: 'String!' },
    comment: { __type: 'String' },
    id: { __type: 'uuid!' },
    list: { __type: 'list!' },
    list_id: { __type: 'uuid!' },
    position: { __type: 'Int' },
    restaurant: { __type: 'restaurant!' },
    restaurant_id: { __type: 'uuid!' },
    restaurants: {
      __type: '[restaurant!]!',
      __args: {
        distinct_on: '[restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_order_by!]',
        where: 'restaurant_bool_exp',
      },
    },
    restaurants_aggregate: {
      __type: 'restaurant_aggregate!',
      __args: {
        distinct_on: '[restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_order_by!]',
        where: 'restaurant_bool_exp',
      },
    },
    tags: {
      __type: '[list_restaurant_tag!]!',
      __args: {
        distinct_on: '[list_restaurant_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_restaurant_tag_order_by!]',
        where: 'list_restaurant_tag_bool_exp',
      },
    },
    tags_aggregate: {
      __type: 'list_restaurant_tag_aggregate!',
      __args: {
        distinct_on: '[list_restaurant_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_restaurant_tag_order_by!]',
        where: 'list_restaurant_tag_bool_exp',
      },
    },
    user: { __type: 'user!' },
    user_id: { __type: 'uuid!' },
  },
  list_restaurant_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'list_restaurant_aggregate_fields' },
    nodes: { __type: '[list_restaurant!]!' },
  },
  list_restaurant_aggregate_bool_exp: {
    count: { __type: 'list_restaurant_aggregate_bool_exp_count' },
  },
  list_restaurant_aggregate_bool_exp_count: {
    arguments: { __type: '[list_restaurant_select_column!]' },
    distinct: { __type: 'Boolean' },
    filter: { __type: 'list_restaurant_bool_exp' },
    predicate: { __type: 'Int_comparison_exp!' },
  },
  list_restaurant_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'list_restaurant_avg_fields' },
    count: {
      __type: 'Int!',
      __args: { columns: '[list_restaurant_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'list_restaurant_max_fields' },
    min: { __type: 'list_restaurant_min_fields' },
    stddev: { __type: 'list_restaurant_stddev_fields' },
    stddev_pop: { __type: 'list_restaurant_stddev_pop_fields' },
    stddev_samp: { __type: 'list_restaurant_stddev_samp_fields' },
    sum: { __type: 'list_restaurant_sum_fields' },
    var_pop: { __type: 'list_restaurant_var_pop_fields' },
    var_samp: { __type: 'list_restaurant_var_samp_fields' },
    variance: { __type: 'list_restaurant_variance_fields' },
  },
  list_restaurant_aggregate_order_by: {
    avg: { __type: 'list_restaurant_avg_order_by' },
    count: { __type: 'order_by' },
    max: { __type: 'list_restaurant_max_order_by' },
    min: { __type: 'list_restaurant_min_order_by' },
    stddev: { __type: 'list_restaurant_stddev_order_by' },
    stddev_pop: { __type: 'list_restaurant_stddev_pop_order_by' },
    stddev_samp: { __type: 'list_restaurant_stddev_samp_order_by' },
    sum: { __type: 'list_restaurant_sum_order_by' },
    var_pop: { __type: 'list_restaurant_var_pop_order_by' },
    var_samp: { __type: 'list_restaurant_var_samp_order_by' },
    variance: { __type: 'list_restaurant_variance_order_by' },
  },
  list_restaurant_arr_rel_insert_input: {
    data: { __type: '[list_restaurant_insert_input!]!' },
    on_conflict: { __type: 'list_restaurant_on_conflict' },
  },
  list_restaurant_avg_fields: {
    __typename: { __type: 'String!' },
    position: { __type: 'Float' },
  },
  list_restaurant_avg_order_by: { position: { __type: 'order_by' } },
  list_restaurant_bool_exp: {
    _and: { __type: '[list_restaurant_bool_exp!]' },
    _not: { __type: 'list_restaurant_bool_exp' },
    _or: { __type: '[list_restaurant_bool_exp!]' },
    comment: { __type: 'String_comparison_exp' },
    id: { __type: 'uuid_comparison_exp' },
    list: { __type: 'list_bool_exp' },
    list_id: { __type: 'uuid_comparison_exp' },
    position: { __type: 'Int_comparison_exp' },
    restaurant: { __type: 'restaurant_bool_exp' },
    restaurant_id: { __type: 'uuid_comparison_exp' },
    restaurants: { __type: 'restaurant_bool_exp' },
    restaurants_aggregate: { __type: 'restaurant_aggregate_bool_exp' },
    tags: { __type: 'list_restaurant_tag_bool_exp' },
    tags_aggregate: { __type: 'list_restaurant_tag_aggregate_bool_exp' },
    user: { __type: 'user_bool_exp' },
    user_id: { __type: 'uuid_comparison_exp' },
  },
  list_restaurant_inc_input: { position: { __type: 'Int' } },
  list_restaurant_insert_input: {
    comment: { __type: 'String' },
    id: { __type: 'uuid' },
    list: { __type: 'list_obj_rel_insert_input' },
    list_id: { __type: 'uuid' },
    position: { __type: 'Int' },
    restaurant: { __type: 'restaurant_obj_rel_insert_input' },
    restaurant_id: { __type: 'uuid' },
    restaurants: { __type: 'restaurant_arr_rel_insert_input' },
    tags: { __type: 'list_restaurant_tag_arr_rel_insert_input' },
    user: { __type: 'user_obj_rel_insert_input' },
    user_id: { __type: 'uuid' },
  },
  list_restaurant_max_fields: {
    __typename: { __type: 'String!' },
    comment: { __type: 'String' },
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    position: { __type: 'Int' },
    restaurant_id: { __type: 'uuid' },
    user_id: { __type: 'uuid' },
  },
  list_restaurant_max_order_by: {
    comment: { __type: 'order_by' },
    id: { __type: 'order_by' },
    list_id: { __type: 'order_by' },
    position: { __type: 'order_by' },
    restaurant_id: { __type: 'order_by' },
    user_id: { __type: 'order_by' },
  },
  list_restaurant_min_fields: {
    __typename: { __type: 'String!' },
    comment: { __type: 'String' },
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    position: { __type: 'Int' },
    restaurant_id: { __type: 'uuid' },
    user_id: { __type: 'uuid' },
  },
  list_restaurant_min_order_by: {
    comment: { __type: 'order_by' },
    id: { __type: 'order_by' },
    list_id: { __type: 'order_by' },
    position: { __type: 'order_by' },
    restaurant_id: { __type: 'order_by' },
    user_id: { __type: 'order_by' },
  },
  list_restaurant_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[list_restaurant!]!' },
  },
  list_restaurant_on_conflict: {
    constraint: { __type: 'list_restaurant_constraint!' },
    update_columns: { __type: '[list_restaurant_update_column!]!' },
    where: { __type: 'list_restaurant_bool_exp' },
  },
  list_restaurant_order_by: {
    comment: { __type: 'order_by' },
    id: { __type: 'order_by' },
    list: { __type: 'list_order_by' },
    list_id: { __type: 'order_by' },
    position: { __type: 'order_by' },
    restaurant: { __type: 'restaurant_order_by' },
    restaurant_id: { __type: 'order_by' },
    restaurants_aggregate: { __type: 'restaurant_aggregate_order_by' },
    tags_aggregate: { __type: 'list_restaurant_tag_aggregate_order_by' },
    user: { __type: 'user_order_by' },
    user_id: { __type: 'order_by' },
  },
  list_restaurant_pk_columns_input: {
    list_id: { __type: 'uuid!' },
    restaurant_id: { __type: 'uuid!' },
  },
  list_restaurant_set_input: {
    comment: { __type: 'String' },
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    position: { __type: 'Int' },
    restaurant_id: { __type: 'uuid' },
    user_id: { __type: 'uuid' },
  },
  list_restaurant_stddev_fields: {
    __typename: { __type: 'String!' },
    position: { __type: 'Float' },
  },
  list_restaurant_stddev_order_by: { position: { __type: 'order_by' } },
  list_restaurant_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    position: { __type: 'Float' },
  },
  list_restaurant_stddev_pop_order_by: { position: { __type: 'order_by' } },
  list_restaurant_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    position: { __type: 'Float' },
  },
  list_restaurant_stddev_samp_order_by: { position: { __type: 'order_by' } },
  list_restaurant_stream_cursor_input: {
    initial_value: { __type: 'list_restaurant_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  list_restaurant_stream_cursor_value_input: {
    comment: { __type: 'String' },
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    position: { __type: 'Int' },
    restaurant_id: { __type: 'uuid' },
    user_id: { __type: 'uuid' },
  },
  list_restaurant_sum_fields: {
    __typename: { __type: 'String!' },
    position: { __type: 'Int' },
  },
  list_restaurant_sum_order_by: { position: { __type: 'order_by' } },
  list_restaurant_tag: {
    __typename: { __type: 'String!' },
    id: { __type: 'uuid!' },
    list_id: { __type: 'uuid!' },
    list_restaurant_id: { __type: 'uuid!' },
    position: { __type: 'Int!' },
    restaurant_tag: { __type: 'restaurant_tag' },
    restaurant_tag_id: { __type: 'uuid!' },
    user_id: { __type: 'uuid!' },
  },
  list_restaurant_tag_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'list_restaurant_tag_aggregate_fields' },
    nodes: { __type: '[list_restaurant_tag!]!' },
  },
  list_restaurant_tag_aggregate_bool_exp: {
    count: { __type: 'list_restaurant_tag_aggregate_bool_exp_count' },
  },
  list_restaurant_tag_aggregate_bool_exp_count: {
    arguments: { __type: '[list_restaurant_tag_select_column!]' },
    distinct: { __type: 'Boolean' },
    filter: { __type: 'list_restaurant_tag_bool_exp' },
    predicate: { __type: 'Int_comparison_exp!' },
  },
  list_restaurant_tag_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'list_restaurant_tag_avg_fields' },
    count: {
      __type: 'Int!',
      __args: { columns: '[list_restaurant_tag_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'list_restaurant_tag_max_fields' },
    min: { __type: 'list_restaurant_tag_min_fields' },
    stddev: { __type: 'list_restaurant_tag_stddev_fields' },
    stddev_pop: { __type: 'list_restaurant_tag_stddev_pop_fields' },
    stddev_samp: { __type: 'list_restaurant_tag_stddev_samp_fields' },
    sum: { __type: 'list_restaurant_tag_sum_fields' },
    var_pop: { __type: 'list_restaurant_tag_var_pop_fields' },
    var_samp: { __type: 'list_restaurant_tag_var_samp_fields' },
    variance: { __type: 'list_restaurant_tag_variance_fields' },
  },
  list_restaurant_tag_aggregate_order_by: {
    avg: { __type: 'list_restaurant_tag_avg_order_by' },
    count: { __type: 'order_by' },
    max: { __type: 'list_restaurant_tag_max_order_by' },
    min: { __type: 'list_restaurant_tag_min_order_by' },
    stddev: { __type: 'list_restaurant_tag_stddev_order_by' },
    stddev_pop: { __type: 'list_restaurant_tag_stddev_pop_order_by' },
    stddev_samp: { __type: 'list_restaurant_tag_stddev_samp_order_by' },
    sum: { __type: 'list_restaurant_tag_sum_order_by' },
    var_pop: { __type: 'list_restaurant_tag_var_pop_order_by' },
    var_samp: { __type: 'list_restaurant_tag_var_samp_order_by' },
    variance: { __type: 'list_restaurant_tag_variance_order_by' },
  },
  list_restaurant_tag_arr_rel_insert_input: {
    data: { __type: '[list_restaurant_tag_insert_input!]!' },
    on_conflict: { __type: 'list_restaurant_tag_on_conflict' },
  },
  list_restaurant_tag_avg_fields: {
    __typename: { __type: 'String!' },
    position: { __type: 'Float' },
  },
  list_restaurant_tag_avg_order_by: { position: { __type: 'order_by' } },
  list_restaurant_tag_bool_exp: {
    _and: { __type: '[list_restaurant_tag_bool_exp!]' },
    _not: { __type: 'list_restaurant_tag_bool_exp' },
    _or: { __type: '[list_restaurant_tag_bool_exp!]' },
    id: { __type: 'uuid_comparison_exp' },
    list_id: { __type: 'uuid_comparison_exp' },
    list_restaurant_id: { __type: 'uuid_comparison_exp' },
    position: { __type: 'Int_comparison_exp' },
    restaurant_tag: { __type: 'restaurant_tag_bool_exp' },
    restaurant_tag_id: { __type: 'uuid_comparison_exp' },
    user_id: { __type: 'uuid_comparison_exp' },
  },
  list_restaurant_tag_inc_input: { position: { __type: 'Int' } },
  list_restaurant_tag_insert_input: {
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    list_restaurant_id: { __type: 'uuid' },
    position: { __type: 'Int' },
    restaurant_tag: { __type: 'restaurant_tag_obj_rel_insert_input' },
    restaurant_tag_id: { __type: 'uuid' },
    user_id: { __type: 'uuid' },
  },
  list_restaurant_tag_max_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    list_restaurant_id: { __type: 'uuid' },
    position: { __type: 'Int' },
    restaurant_tag_id: { __type: 'uuid' },
    user_id: { __type: 'uuid' },
  },
  list_restaurant_tag_max_order_by: {
    id: { __type: 'order_by' },
    list_id: { __type: 'order_by' },
    list_restaurant_id: { __type: 'order_by' },
    position: { __type: 'order_by' },
    restaurant_tag_id: { __type: 'order_by' },
    user_id: { __type: 'order_by' },
  },
  list_restaurant_tag_min_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    list_restaurant_id: { __type: 'uuid' },
    position: { __type: 'Int' },
    restaurant_tag_id: { __type: 'uuid' },
    user_id: { __type: 'uuid' },
  },
  list_restaurant_tag_min_order_by: {
    id: { __type: 'order_by' },
    list_id: { __type: 'order_by' },
    list_restaurant_id: { __type: 'order_by' },
    position: { __type: 'order_by' },
    restaurant_tag_id: { __type: 'order_by' },
    user_id: { __type: 'order_by' },
  },
  list_restaurant_tag_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[list_restaurant_tag!]!' },
  },
  list_restaurant_tag_on_conflict: {
    constraint: { __type: 'list_restaurant_tag_constraint!' },
    update_columns: { __type: '[list_restaurant_tag_update_column!]!' },
    where: { __type: 'list_restaurant_tag_bool_exp' },
  },
  list_restaurant_tag_order_by: {
    id: { __type: 'order_by' },
    list_id: { __type: 'order_by' },
    list_restaurant_id: { __type: 'order_by' },
    position: { __type: 'order_by' },
    restaurant_tag: { __type: 'restaurant_tag_order_by' },
    restaurant_tag_id: { __type: 'order_by' },
    user_id: { __type: 'order_by' },
  },
  list_restaurant_tag_pk_columns_input: { id: { __type: 'uuid!' } },
  list_restaurant_tag_set_input: {
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    list_restaurant_id: { __type: 'uuid' },
    position: { __type: 'Int' },
    restaurant_tag_id: { __type: 'uuid' },
    user_id: { __type: 'uuid' },
  },
  list_restaurant_tag_stddev_fields: {
    __typename: { __type: 'String!' },
    position: { __type: 'Float' },
  },
  list_restaurant_tag_stddev_order_by: { position: { __type: 'order_by' } },
  list_restaurant_tag_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    position: { __type: 'Float' },
  },
  list_restaurant_tag_stddev_pop_order_by: { position: { __type: 'order_by' } },
  list_restaurant_tag_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    position: { __type: 'Float' },
  },
  list_restaurant_tag_stddev_samp_order_by: { position: { __type: 'order_by' } },
  list_restaurant_tag_stream_cursor_input: {
    initial_value: { __type: 'list_restaurant_tag_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  list_restaurant_tag_stream_cursor_value_input: {
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    list_restaurant_id: { __type: 'uuid' },
    position: { __type: 'Int' },
    restaurant_tag_id: { __type: 'uuid' },
    user_id: { __type: 'uuid' },
  },
  list_restaurant_tag_sum_fields: {
    __typename: { __type: 'String!' },
    position: { __type: 'Int' },
  },
  list_restaurant_tag_sum_order_by: { position: { __type: 'order_by' } },
  list_restaurant_tag_updates: {
    _inc: { __type: 'list_restaurant_tag_inc_input' },
    _set: { __type: 'list_restaurant_tag_set_input' },
    where: { __type: 'list_restaurant_tag_bool_exp!' },
  },
  list_restaurant_tag_var_pop_fields: {
    __typename: { __type: 'String!' },
    position: { __type: 'Float' },
  },
  list_restaurant_tag_var_pop_order_by: { position: { __type: 'order_by' } },
  list_restaurant_tag_var_samp_fields: {
    __typename: { __type: 'String!' },
    position: { __type: 'Float' },
  },
  list_restaurant_tag_var_samp_order_by: { position: { __type: 'order_by' } },
  list_restaurant_tag_variance_fields: {
    __typename: { __type: 'String!' },
    position: { __type: 'Float' },
  },
  list_restaurant_tag_variance_order_by: { position: { __type: 'order_by' } },
  list_restaurant_updates: {
    _inc: { __type: 'list_restaurant_inc_input' },
    _set: { __type: 'list_restaurant_set_input' },
    where: { __type: 'list_restaurant_bool_exp!' },
  },
  list_restaurant_var_pop_fields: {
    __typename: { __type: 'String!' },
    position: { __type: 'Float' },
  },
  list_restaurant_var_pop_order_by: { position: { __type: 'order_by' } },
  list_restaurant_var_samp_fields: {
    __typename: { __type: 'String!' },
    position: { __type: 'Float' },
  },
  list_restaurant_var_samp_order_by: { position: { __type: 'order_by' } },
  list_restaurant_variance_fields: {
    __typename: { __type: 'String!' },
    position: { __type: 'Float' },
  },
  list_restaurant_variance_order_by: { position: { __type: 'order_by' } },
  list_set_input: {
    color: { __type: 'Int' },
    created_at: { __type: 'timestamptz' },
    description: { __type: 'String' },
    font: { __type: 'Int' },
    id: { __type: 'uuid' },
    image: { __type: 'String' },
    location: { __type: 'geometry' },
    name: { __type: 'String' },
    public: { __type: 'Boolean' },
    region: { __type: 'String' },
    slug: { __type: 'String' },
    theme: { __type: 'Int' },
    updated_at: { __type: 'timestamptz' },
    user_id: { __type: 'uuid' },
  },
  list_stddev_fields: {
    __typename: { __type: 'String!' },
    color: { __type: 'Float' },
    font: { __type: 'Float' },
    theme: { __type: 'Float' },
  },
  list_stddev_order_by: {
    color: { __type: 'order_by' },
    font: { __type: 'order_by' },
    theme: { __type: 'order_by' },
  },
  list_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    color: { __type: 'Float' },
    font: { __type: 'Float' },
    theme: { __type: 'Float' },
  },
  list_stddev_pop_order_by: {
    color: { __type: 'order_by' },
    font: { __type: 'order_by' },
    theme: { __type: 'order_by' },
  },
  list_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    color: { __type: 'Float' },
    font: { __type: 'Float' },
    theme: { __type: 'Float' },
  },
  list_stddev_samp_order_by: {
    color: { __type: 'order_by' },
    font: { __type: 'order_by' },
    theme: { __type: 'order_by' },
  },
  list_stream_cursor_input: {
    initial_value: { __type: 'list_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  list_stream_cursor_value_input: {
    color: { __type: 'Int' },
    created_at: { __type: 'timestamptz' },
    description: { __type: 'String' },
    font: { __type: 'Int' },
    id: { __type: 'uuid' },
    image: { __type: 'String' },
    location: { __type: 'geometry' },
    name: { __type: 'String' },
    public: { __type: 'Boolean' },
    region: { __type: 'String' },
    slug: { __type: 'String' },
    theme: { __type: 'Int' },
    updated_at: { __type: 'timestamptz' },
    user_id: { __type: 'uuid' },
  },
  list_sum_fields: {
    __typename: { __type: 'String!' },
    color: { __type: 'Int' },
    font: { __type: 'Int' },
    theme: { __type: 'Int' },
  },
  list_sum_order_by: {
    color: { __type: 'order_by' },
    font: { __type: 'order_by' },
    theme: { __type: 'order_by' },
  },
  list_tag: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamptz!' },
    id: { __type: 'uuid!' },
    list: { __type: 'list' },
    list_id: { __type: 'uuid!' },
    tag: { __type: 'tag' },
    tag_id: { __type: 'uuid!' },
  },
  list_tag_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'list_tag_aggregate_fields' },
    nodes: { __type: '[list_tag!]!' },
  },
  list_tag_aggregate_bool_exp: { count: { __type: 'list_tag_aggregate_bool_exp_count' } },
  list_tag_aggregate_bool_exp_count: {
    arguments: { __type: '[list_tag_select_column!]' },
    distinct: { __type: 'Boolean' },
    filter: { __type: 'list_tag_bool_exp' },
    predicate: { __type: 'Int_comparison_exp!' },
  },
  list_tag_aggregate_fields: {
    __typename: { __type: 'String!' },
    count: {
      __type: 'Int!',
      __args: { columns: '[list_tag_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'list_tag_max_fields' },
    min: { __type: 'list_tag_min_fields' },
  },
  list_tag_aggregate_order_by: {
    count: { __type: 'order_by' },
    max: { __type: 'list_tag_max_order_by' },
    min: { __type: 'list_tag_min_order_by' },
  },
  list_tag_arr_rel_insert_input: {
    data: { __type: '[list_tag_insert_input!]!' },
    on_conflict: { __type: 'list_tag_on_conflict' },
  },
  list_tag_bool_exp: {
    _and: { __type: '[list_tag_bool_exp!]' },
    _not: { __type: 'list_tag_bool_exp' },
    _or: { __type: '[list_tag_bool_exp!]' },
    created_at: { __type: 'timestamptz_comparison_exp' },
    id: { __type: 'uuid_comparison_exp' },
    list: { __type: 'list_bool_exp' },
    list_id: { __type: 'uuid_comparison_exp' },
    tag: { __type: 'tag_bool_exp' },
    tag_id: { __type: 'uuid_comparison_exp' },
  },
  list_tag_insert_input: {
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    list: { __type: 'list_obj_rel_insert_input' },
    list_id: { __type: 'uuid' },
    tag: { __type: 'tag_obj_rel_insert_input' },
    tag_id: { __type: 'uuid' },
  },
  list_tag_max_fields: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    tag_id: { __type: 'uuid' },
  },
  list_tag_max_order_by: {
    created_at: { __type: 'order_by' },
    id: { __type: 'order_by' },
    list_id: { __type: 'order_by' },
    tag_id: { __type: 'order_by' },
  },
  list_tag_min_fields: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    tag_id: { __type: 'uuid' },
  },
  list_tag_min_order_by: {
    created_at: { __type: 'order_by' },
    id: { __type: 'order_by' },
    list_id: { __type: 'order_by' },
    tag_id: { __type: 'order_by' },
  },
  list_tag_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[list_tag!]!' },
  },
  list_tag_on_conflict: {
    constraint: { __type: 'list_tag_constraint!' },
    update_columns: { __type: '[list_tag_update_column!]!' },
    where: { __type: 'list_tag_bool_exp' },
  },
  list_tag_order_by: {
    created_at: { __type: 'order_by' },
    id: { __type: 'order_by' },
    list: { __type: 'list_order_by' },
    list_id: { __type: 'order_by' },
    tag: { __type: 'tag_order_by' },
    tag_id: { __type: 'order_by' },
  },
  list_tag_pk_columns_input: { id: { __type: 'uuid!' } },
  list_tag_set_input: {
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    tag_id: { __type: 'uuid' },
  },
  list_tag_stream_cursor_input: {
    initial_value: { __type: 'list_tag_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  list_tag_stream_cursor_value_input: {
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    tag_id: { __type: 'uuid' },
  },
  list_tag_updates: {
    _set: { __type: 'list_tag_set_input' },
    where: { __type: 'list_tag_bool_exp!' },
  },
  list_updates: {
    _inc: { __type: 'list_inc_input' },
    _set: { __type: 'list_set_input' },
    where: { __type: 'list_bool_exp!' },
  },
  list_var_pop_fields: {
    __typename: { __type: 'String!' },
    color: { __type: 'Float' },
    font: { __type: 'Float' },
    theme: { __type: 'Float' },
  },
  list_var_pop_order_by: {
    color: { __type: 'order_by' },
    font: { __type: 'order_by' },
    theme: { __type: 'order_by' },
  },
  list_var_samp_fields: {
    __typename: { __type: 'String!' },
    color: { __type: 'Float' },
    font: { __type: 'Float' },
    theme: { __type: 'Float' },
  },
  list_var_samp_order_by: {
    color: { __type: 'order_by' },
    font: { __type: 'order_by' },
    theme: { __type: 'order_by' },
  },
  list_variance_fields: {
    __typename: { __type: 'String!' },
    color: { __type: 'Float' },
    font: { __type: 'Float' },
    theme: { __type: 'Float' },
  },
  list_variance_order_by: {
    color: { __type: 'order_by' },
    font: { __type: 'order_by' },
    theme: { __type: 'order_by' },
  },
  menu_item: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamptz!' },
    description: { __type: 'String' },
    id: { __type: 'uuid!' },
    image: { __type: 'String' },
    location: { __type: 'geometry' },
    name: { __type: 'String!' },
    price: { __type: 'Int' },
    restaurant: { __type: 'restaurant!' },
    restaurant_id: { __type: 'uuid!' },
    updated_at: { __type: 'timestamptz!' },
  },
  menu_item_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'menu_item_aggregate_fields' },
    nodes: { __type: '[menu_item!]!' },
  },
  menu_item_aggregate_bool_exp: { count: { __type: 'menu_item_aggregate_bool_exp_count' } },
  menu_item_aggregate_bool_exp_count: {
    arguments: { __type: '[menu_item_select_column!]' },
    distinct: { __type: 'Boolean' },
    filter: { __type: 'menu_item_bool_exp' },
    predicate: { __type: 'Int_comparison_exp!' },
  },
  menu_item_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'menu_item_avg_fields' },
    count: {
      __type: 'Int!',
      __args: { columns: '[menu_item_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'menu_item_max_fields' },
    min: { __type: 'menu_item_min_fields' },
    stddev: { __type: 'menu_item_stddev_fields' },
    stddev_pop: { __type: 'menu_item_stddev_pop_fields' },
    stddev_samp: { __type: 'menu_item_stddev_samp_fields' },
    sum: { __type: 'menu_item_sum_fields' },
    var_pop: { __type: 'menu_item_var_pop_fields' },
    var_samp: { __type: 'menu_item_var_samp_fields' },
    variance: { __type: 'menu_item_variance_fields' },
  },
  menu_item_aggregate_order_by: {
    avg: { __type: 'menu_item_avg_order_by' },
    count: { __type: 'order_by' },
    max: { __type: 'menu_item_max_order_by' },
    min: { __type: 'menu_item_min_order_by' },
    stddev: { __type: 'menu_item_stddev_order_by' },
    stddev_pop: { __type: 'menu_item_stddev_pop_order_by' },
    stddev_samp: { __type: 'menu_item_stddev_samp_order_by' },
    sum: { __type: 'menu_item_sum_order_by' },
    var_pop: { __type: 'menu_item_var_pop_order_by' },
    var_samp: { __type: 'menu_item_var_samp_order_by' },
    variance: { __type: 'menu_item_variance_order_by' },
  },
  menu_item_arr_rel_insert_input: {
    data: { __type: '[menu_item_insert_input!]!' },
    on_conflict: { __type: 'menu_item_on_conflict' },
  },
  menu_item_avg_fields: { __typename: { __type: 'String!' }, price: { __type: 'Float' } },
  menu_item_avg_order_by: { price: { __type: 'order_by' } },
  menu_item_bool_exp: {
    _and: { __type: '[menu_item_bool_exp!]' },
    _not: { __type: 'menu_item_bool_exp' },
    _or: { __type: '[menu_item_bool_exp!]' },
    created_at: { __type: 'timestamptz_comparison_exp' },
    description: { __type: 'String_comparison_exp' },
    id: { __type: 'uuid_comparison_exp' },
    image: { __type: 'String_comparison_exp' },
    location: { __type: 'geometry_comparison_exp' },
    name: { __type: 'String_comparison_exp' },
    price: { __type: 'Int_comparison_exp' },
    restaurant: { __type: 'restaurant_bool_exp' },
    restaurant_id: { __type: 'uuid_comparison_exp' },
    updated_at: { __type: 'timestamptz_comparison_exp' },
  },
  menu_item_inc_input: { price: { __type: 'Int' } },
  menu_item_insert_input: {
    created_at: { __type: 'timestamptz' },
    description: { __type: 'String' },
    id: { __type: 'uuid' },
    image: { __type: 'String' },
    location: { __type: 'geometry' },
    name: { __type: 'String' },
    price: { __type: 'Int' },
    restaurant: { __type: 'restaurant_obj_rel_insert_input' },
    restaurant_id: { __type: 'uuid' },
    updated_at: { __type: 'timestamptz' },
  },
  menu_item_max_fields: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamptz' },
    description: { __type: 'String' },
    id: { __type: 'uuid' },
    image: { __type: 'String' },
    name: { __type: 'String' },
    price: { __type: 'Int' },
    restaurant_id: { __type: 'uuid' },
    updated_at: { __type: 'timestamptz' },
  },
  menu_item_max_order_by: {
    created_at: { __type: 'order_by' },
    description: { __type: 'order_by' },
    id: { __type: 'order_by' },
    image: { __type: 'order_by' },
    name: { __type: 'order_by' },
    price: { __type: 'order_by' },
    restaurant_id: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
  },
  menu_item_min_fields: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamptz' },
    description: { __type: 'String' },
    id: { __type: 'uuid' },
    image: { __type: 'String' },
    name: { __type: 'String' },
    price: { __type: 'Int' },
    restaurant_id: { __type: 'uuid' },
    updated_at: { __type: 'timestamptz' },
  },
  menu_item_min_order_by: {
    created_at: { __type: 'order_by' },
    description: { __type: 'order_by' },
    id: { __type: 'order_by' },
    image: { __type: 'order_by' },
    name: { __type: 'order_by' },
    price: { __type: 'order_by' },
    restaurant_id: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
  },
  menu_item_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[menu_item!]!' },
  },
  menu_item_on_conflict: {
    constraint: { __type: 'menu_item_constraint!' },
    update_columns: { __type: '[menu_item_update_column!]!' },
    where: { __type: 'menu_item_bool_exp' },
  },
  menu_item_order_by: {
    created_at: { __type: 'order_by' },
    description: { __type: 'order_by' },
    id: { __type: 'order_by' },
    image: { __type: 'order_by' },
    location: { __type: 'order_by' },
    name: { __type: 'order_by' },
    price: { __type: 'order_by' },
    restaurant: { __type: 'restaurant_order_by' },
    restaurant_id: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
  },
  menu_item_pk_columns_input: { id: { __type: 'uuid!' } },
  menu_item_set_input: {
    created_at: { __type: 'timestamptz' },
    description: { __type: 'String' },
    id: { __type: 'uuid' },
    image: { __type: 'String' },
    location: { __type: 'geometry' },
    name: { __type: 'String' },
    price: { __type: 'Int' },
    restaurant_id: { __type: 'uuid' },
    updated_at: { __type: 'timestamptz' },
  },
  menu_item_stddev_fields: { __typename: { __type: 'String!' }, price: { __type: 'Float' } },
  menu_item_stddev_order_by: { price: { __type: 'order_by' } },
  menu_item_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    price: { __type: 'Float' },
  },
  menu_item_stddev_pop_order_by: { price: { __type: 'order_by' } },
  menu_item_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    price: { __type: 'Float' },
  },
  menu_item_stddev_samp_order_by: { price: { __type: 'order_by' } },
  menu_item_stream_cursor_input: {
    initial_value: { __type: 'menu_item_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  menu_item_stream_cursor_value_input: {
    created_at: { __type: 'timestamptz' },
    description: { __type: 'String' },
    id: { __type: 'uuid' },
    image: { __type: 'String' },
    location: { __type: 'geometry' },
    name: { __type: 'String' },
    price: { __type: 'Int' },
    restaurant_id: { __type: 'uuid' },
    updated_at: { __type: 'timestamptz' },
  },
  menu_item_sum_fields: { __typename: { __type: 'String!' }, price: { __type: 'Int' } },
  menu_item_sum_order_by: { price: { __type: 'order_by' } },
  menu_item_updates: {
    _inc: { __type: 'menu_item_inc_input' },
    _set: { __type: 'menu_item_set_input' },
    where: { __type: 'menu_item_bool_exp!' },
  },
  menu_item_var_pop_fields: { __typename: { __type: 'String!' }, price: { __type: 'Float' } },
  menu_item_var_pop_order_by: { price: { __type: 'order_by' } },
  menu_item_var_samp_fields: { __typename: { __type: 'String!' }, price: { __type: 'Float' } },
  menu_item_var_samp_order_by: { price: { __type: 'order_by' } },
  menu_item_variance_fields: { __typename: { __type: 'String!' }, price: { __type: 'Float' } },
  menu_item_variance_order_by: { price: { __type: 'order_by' } },
  mutation: {
    __typename: { __type: 'String!' },
    delete_boundaries_city: {
      __type: 'boundaries_city_mutation_response',
      __args: { where: 'boundaries_city_bool_exp!' },
    },
    delete_boundaries_city_by_pk: { __type: 'boundaries_city', __args: { ogc_fid: 'Int!' } },
    delete_follow: {
      __type: 'follow_mutation_response',
      __args: { where: 'follow_bool_exp!' },
    },
    delete_follow_by_pk: { __type: 'follow', __args: { id: 'uuid!' } },
    delete_hrr: { __type: 'hrr_mutation_response', __args: { where: 'hrr_bool_exp!' } },
    delete_hrr_by_pk: { __type: 'hrr', __args: { ogc_fid: 'Int!' } },
    delete_list: { __type: 'list_mutation_response', __args: { where: 'list_bool_exp!' } },
    delete_list_by_pk: { __type: 'list', __args: { id: 'uuid!' } },
    delete_list_region: {
      __type: 'list_region_mutation_response',
      __args: { where: 'list_region_bool_exp!' },
    },
    delete_list_region_by_pk: { __type: 'list_region', __args: { id: 'uuid!' } },
    delete_list_restaurant: {
      __type: 'list_restaurant_mutation_response',
      __args: { where: 'list_restaurant_bool_exp!' },
    },
    delete_list_restaurant_by_pk: {
      __type: 'list_restaurant',
      __args: { list_id: 'uuid!', restaurant_id: 'uuid!' },
    },
    delete_list_restaurant_tag: {
      __type: 'list_restaurant_tag_mutation_response',
      __args: { where: 'list_restaurant_tag_bool_exp!' },
    },
    delete_list_restaurant_tag_by_pk: {
      __type: 'list_restaurant_tag',
      __args: { id: 'uuid!' },
    },
    delete_list_tag: {
      __type: 'list_tag_mutation_response',
      __args: { where: 'list_tag_bool_exp!' },
    },
    delete_list_tag_by_pk: { __type: 'list_tag', __args: { id: 'uuid!' } },
    delete_menu_item: {
      __type: 'menu_item_mutation_response',
      __args: { where: 'menu_item_bool_exp!' },
    },
    delete_menu_item_by_pk: { __type: 'menu_item', __args: { id: 'uuid!' } },
    delete_nhood_labels: {
      __type: 'nhood_labels_mutation_response',
      __args: { where: 'nhood_labels_bool_exp!' },
    },
    delete_nhood_labels_by_pk: { __type: 'nhood_labels', __args: { ogc_fid: 'Int!' } },
    delete_opening_hours: {
      __type: 'opening_hours_mutation_response',
      __args: { where: 'opening_hours_bool_exp!' },
    },
    delete_opening_hours_by_pk: { __type: 'opening_hours', __args: { id: 'uuid!' } },
    delete_photo: { __type: 'photo_mutation_response', __args: { where: 'photo_bool_exp!' } },
    delete_photo_by_pk: { __type: 'photo', __args: { id: 'uuid!' } },
    delete_photo_xref: {
      __type: 'photo_xref_mutation_response',
      __args: { where: 'photo_xref_bool_exp!' },
    },
    delete_photo_xref_by_pk: { __type: 'photo_xref', __args: { id: 'uuid!' } },
    delete_restaurant: {
      __type: 'restaurant_mutation_response',
      __args: { where: 'restaurant_bool_exp!' },
    },
    delete_restaurant_by_pk: { __type: 'restaurant', __args: { id: 'uuid!' } },
    delete_restaurant_tag: {
      __type: 'restaurant_tag_mutation_response',
      __args: { where: 'restaurant_tag_bool_exp!' },
    },
    delete_restaurant_tag_by_pk: {
      __type: 'restaurant_tag',
      __args: { restaurant_id: 'uuid!', tag_id: 'uuid!' },
    },
    delete_review: {
      __type: 'review_mutation_response',
      __args: { where: 'review_bool_exp!' },
    },
    delete_review_by_pk: { __type: 'review', __args: { id: 'uuid!' } },
    delete_review_tag_sentence: {
      __type: 'review_tag_sentence_mutation_response',
      __args: { where: 'review_tag_sentence_bool_exp!' },
    },
    delete_review_tag_sentence_by_pk: {
      __type: 'review_tag_sentence',
      __args: { id: 'uuid!' },
    },
    delete_setting: {
      __type: 'setting_mutation_response',
      __args: { where: 'setting_bool_exp!' },
    },
    delete_setting_by_pk: { __type: 'setting', __args: { key: 'String!' } },
    delete_tag: { __type: 'tag_mutation_response', __args: { where: 'tag_bool_exp!' } },
    delete_tag_by_pk: { __type: 'tag', __args: { id: 'uuid!' } },
    delete_tag_tag: {
      __type: 'tag_tag_mutation_response',
      __args: { where: 'tag_tag_bool_exp!' },
    },
    delete_tag_tag_by_pk: {
      __type: 'tag_tag',
      __args: { category_tag_id: 'uuid!', tag_id: 'uuid!' },
    },
    delete_user: { __type: 'user_mutation_response', __args: { where: 'user_bool_exp!' } },
    delete_user_by_pk: { __type: 'user', __args: { id: 'uuid!' } },
    delete_zcta5: { __type: 'zcta5_mutation_response', __args: { where: 'zcta5_bool_exp!' } },
    delete_zcta5_by_pk: { __type: 'zcta5', __args: { ogc_fid: 'Int!' } },
    insert_boundaries_city: {
      __type: 'boundaries_city_mutation_response',
      __args: {
        objects: '[boundaries_city_insert_input!]!',
        on_conflict: 'boundaries_city_on_conflict',
      },
    },
    insert_boundaries_city_one: {
      __type: 'boundaries_city',
      __args: {
        object: 'boundaries_city_insert_input!',
        on_conflict: 'boundaries_city_on_conflict',
      },
    },
    insert_follow: {
      __type: 'follow_mutation_response',
      __args: { objects: '[follow_insert_input!]!', on_conflict: 'follow_on_conflict' },
    },
    insert_follow_one: {
      __type: 'follow',
      __args: { object: 'follow_insert_input!', on_conflict: 'follow_on_conflict' },
    },
    insert_hrr: {
      __type: 'hrr_mutation_response',
      __args: { objects: '[hrr_insert_input!]!', on_conflict: 'hrr_on_conflict' },
    },
    insert_hrr_one: {
      __type: 'hrr',
      __args: { object: 'hrr_insert_input!', on_conflict: 'hrr_on_conflict' },
    },
    insert_list: {
      __type: 'list_mutation_response',
      __args: { objects: '[list_insert_input!]!', on_conflict: 'list_on_conflict' },
    },
    insert_list_one: {
      __type: 'list',
      __args: { object: 'list_insert_input!', on_conflict: 'list_on_conflict' },
    },
    insert_list_region: {
      __type: 'list_region_mutation_response',
      __args: {
        objects: '[list_region_insert_input!]!',
        on_conflict: 'list_region_on_conflict',
      },
    },
    insert_list_region_one: {
      __type: 'list_region',
      __args: { object: 'list_region_insert_input!', on_conflict: 'list_region_on_conflict' },
    },
    insert_list_restaurant: {
      __type: 'list_restaurant_mutation_response',
      __args: {
        objects: '[list_restaurant_insert_input!]!',
        on_conflict: 'list_restaurant_on_conflict',
      },
    },
    insert_list_restaurant_one: {
      __type: 'list_restaurant',
      __args: {
        object: 'list_restaurant_insert_input!',
        on_conflict: 'list_restaurant_on_conflict',
      },
    },
    insert_list_restaurant_tag: {
      __type: 'list_restaurant_tag_mutation_response',
      __args: {
        objects: '[list_restaurant_tag_insert_input!]!',
        on_conflict: 'list_restaurant_tag_on_conflict',
      },
    },
    insert_list_restaurant_tag_one: {
      __type: 'list_restaurant_tag',
      __args: {
        object: 'list_restaurant_tag_insert_input!',
        on_conflict: 'list_restaurant_tag_on_conflict',
      },
    },
    insert_list_tag: {
      __type: 'list_tag_mutation_response',
      __args: { objects: '[list_tag_insert_input!]!', on_conflict: 'list_tag_on_conflict' },
    },
    insert_list_tag_one: {
      __type: 'list_tag',
      __args: { object: 'list_tag_insert_input!', on_conflict: 'list_tag_on_conflict' },
    },
    insert_menu_item: {
      __type: 'menu_item_mutation_response',
      __args: { objects: '[menu_item_insert_input!]!', on_conflict: 'menu_item_on_conflict' },
    },
    insert_menu_item_one: {
      __type: 'menu_item',
      __args: { object: 'menu_item_insert_input!', on_conflict: 'menu_item_on_conflict' },
    },
    insert_nhood_labels: {
      __type: 'nhood_labels_mutation_response',
      __args: {
        objects: '[nhood_labels_insert_input!]!',
        on_conflict: 'nhood_labels_on_conflict',
      },
    },
    insert_nhood_labels_one: {
      __type: 'nhood_labels',
      __args: {
        object: 'nhood_labels_insert_input!',
        on_conflict: 'nhood_labels_on_conflict',
      },
    },
    insert_opening_hours: {
      __type: 'opening_hours_mutation_response',
      __args: {
        objects: '[opening_hours_insert_input!]!',
        on_conflict: 'opening_hours_on_conflict',
      },
    },
    insert_opening_hours_one: {
      __type: 'opening_hours',
      __args: {
        object: 'opening_hours_insert_input!',
        on_conflict: 'opening_hours_on_conflict',
      },
    },
    insert_photo: {
      __type: 'photo_mutation_response',
      __args: { objects: '[photo_insert_input!]!', on_conflict: 'photo_on_conflict' },
    },
    insert_photo_one: {
      __type: 'photo',
      __args: { object: 'photo_insert_input!', on_conflict: 'photo_on_conflict' },
    },
    insert_photo_xref: {
      __type: 'photo_xref_mutation_response',
      __args: {
        objects: '[photo_xref_insert_input!]!',
        on_conflict: 'photo_xref_on_conflict',
      },
    },
    insert_photo_xref_one: {
      __type: 'photo_xref',
      __args: { object: 'photo_xref_insert_input!', on_conflict: 'photo_xref_on_conflict' },
    },
    insert_restaurant: {
      __type: 'restaurant_mutation_response',
      __args: {
        objects: '[restaurant_insert_input!]!',
        on_conflict: 'restaurant_on_conflict',
      },
    },
    insert_restaurant_one: {
      __type: 'restaurant',
      __args: { object: 'restaurant_insert_input!', on_conflict: 'restaurant_on_conflict' },
    },
    insert_restaurant_tag: {
      __type: 'restaurant_tag_mutation_response',
      __args: {
        objects: '[restaurant_tag_insert_input!]!',
        on_conflict: 'restaurant_tag_on_conflict',
      },
    },
    insert_restaurant_tag_one: {
      __type: 'restaurant_tag',
      __args: {
        object: 'restaurant_tag_insert_input!',
        on_conflict: 'restaurant_tag_on_conflict',
      },
    },
    insert_review: {
      __type: 'review_mutation_response',
      __args: { objects: '[review_insert_input!]!', on_conflict: 'review_on_conflict' },
    },
    insert_review_one: {
      __type: 'review',
      __args: { object: 'review_insert_input!', on_conflict: 'review_on_conflict' },
    },
    insert_review_tag_sentence: {
      __type: 'review_tag_sentence_mutation_response',
      __args: {
        objects: '[review_tag_sentence_insert_input!]!',
        on_conflict: 'review_tag_sentence_on_conflict',
      },
    },
    insert_review_tag_sentence_one: {
      __type: 'review_tag_sentence',
      __args: {
        object: 'review_tag_sentence_insert_input!',
        on_conflict: 'review_tag_sentence_on_conflict',
      },
    },
    insert_setting: {
      __type: 'setting_mutation_response',
      __args: { objects: '[setting_insert_input!]!', on_conflict: 'setting_on_conflict' },
    },
    insert_setting_one: {
      __type: 'setting',
      __args: { object: 'setting_insert_input!', on_conflict: 'setting_on_conflict' },
    },
    insert_tag: {
      __type: 'tag_mutation_response',
      __args: { objects: '[tag_insert_input!]!', on_conflict: 'tag_on_conflict' },
    },
    insert_tag_one: {
      __type: 'tag',
      __args: { object: 'tag_insert_input!', on_conflict: 'tag_on_conflict' },
    },
    insert_tag_tag: {
      __type: 'tag_tag_mutation_response',
      __args: { objects: '[tag_tag_insert_input!]!', on_conflict: 'tag_tag_on_conflict' },
    },
    insert_tag_tag_one: {
      __type: 'tag_tag',
      __args: { object: 'tag_tag_insert_input!', on_conflict: 'tag_tag_on_conflict' },
    },
    insert_user: {
      __type: 'user_mutation_response',
      __args: { objects: '[user_insert_input!]!', on_conflict: 'user_on_conflict' },
    },
    insert_user_one: {
      __type: 'user',
      __args: { object: 'user_insert_input!', on_conflict: 'user_on_conflict' },
    },
    insert_zcta5: {
      __type: 'zcta5_mutation_response',
      __args: { objects: '[zcta5_insert_input!]!', on_conflict: 'zcta5_on_conflict' },
    },
    insert_zcta5_one: {
      __type: 'zcta5',
      __args: { object: 'zcta5_insert_input!', on_conflict: 'zcta5_on_conflict' },
    },
    update_boundaries_city: {
      __type: 'boundaries_city_mutation_response',
      __args: {
        _inc: 'boundaries_city_inc_input',
        _set: 'boundaries_city_set_input',
        where: 'boundaries_city_bool_exp!',
      },
    },
    update_boundaries_city_by_pk: {
      __type: 'boundaries_city',
      __args: {
        _inc: 'boundaries_city_inc_input',
        _set: 'boundaries_city_set_input',
        pk_columns: 'boundaries_city_pk_columns_input!',
      },
    },
    update_boundaries_city_many: {
      __type: '[boundaries_city_mutation_response]',
      __args: { updates: '[boundaries_city_updates!]!' },
    },
    update_follow: {
      __type: 'follow_mutation_response',
      __args: { _set: 'follow_set_input', where: 'follow_bool_exp!' },
    },
    update_follow_by_pk: {
      __type: 'follow',
      __args: { _set: 'follow_set_input', pk_columns: 'follow_pk_columns_input!' },
    },
    update_follow_many: {
      __type: '[follow_mutation_response]',
      __args: { updates: '[follow_updates!]!' },
    },
    update_hrr: {
      __type: 'hrr_mutation_response',
      __args: { _inc: 'hrr_inc_input', _set: 'hrr_set_input', where: 'hrr_bool_exp!' },
    },
    update_hrr_by_pk: {
      __type: 'hrr',
      __args: {
        _inc: 'hrr_inc_input',
        _set: 'hrr_set_input',
        pk_columns: 'hrr_pk_columns_input!',
      },
    },
    update_hrr_many: {
      __type: '[hrr_mutation_response]',
      __args: { updates: '[hrr_updates!]!' },
    },
    update_list: {
      __type: 'list_mutation_response',
      __args: { _inc: 'list_inc_input', _set: 'list_set_input', where: 'list_bool_exp!' },
    },
    update_list_by_pk: {
      __type: 'list',
      __args: {
        _inc: 'list_inc_input',
        _set: 'list_set_input',
        pk_columns: 'list_pk_columns_input!',
      },
    },
    update_list_many: {
      __type: '[list_mutation_response]',
      __args: { updates: '[list_updates!]!' },
    },
    update_list_region: {
      __type: 'list_region_mutation_response',
      __args: { _set: 'list_region_set_input', where: 'list_region_bool_exp!' },
    },
    update_list_region_by_pk: {
      __type: 'list_region',
      __args: { _set: 'list_region_set_input', pk_columns: 'list_region_pk_columns_input!' },
    },
    update_list_region_many: {
      __type: '[list_region_mutation_response]',
      __args: { updates: '[list_region_updates!]!' },
    },
    update_list_restaurant: {
      __type: 'list_restaurant_mutation_response',
      __args: {
        _inc: 'list_restaurant_inc_input',
        _set: 'list_restaurant_set_input',
        where: 'list_restaurant_bool_exp!',
      },
    },
    update_list_restaurant_by_pk: {
      __type: 'list_restaurant',
      __args: {
        _inc: 'list_restaurant_inc_input',
        _set: 'list_restaurant_set_input',
        pk_columns: 'list_restaurant_pk_columns_input!',
      },
    },
    update_list_restaurant_many: {
      __type: '[list_restaurant_mutation_response]',
      __args: { updates: '[list_restaurant_updates!]!' },
    },
    update_list_restaurant_tag: {
      __type: 'list_restaurant_tag_mutation_response',
      __args: {
        _inc: 'list_restaurant_tag_inc_input',
        _set: 'list_restaurant_tag_set_input',
        where: 'list_restaurant_tag_bool_exp!',
      },
    },
    update_list_restaurant_tag_by_pk: {
      __type: 'list_restaurant_tag',
      __args: {
        _inc: 'list_restaurant_tag_inc_input',
        _set: 'list_restaurant_tag_set_input',
        pk_columns: 'list_restaurant_tag_pk_columns_input!',
      },
    },
    update_list_restaurant_tag_many: {
      __type: '[list_restaurant_tag_mutation_response]',
      __args: { updates: '[list_restaurant_tag_updates!]!' },
    },
    update_list_tag: {
      __type: 'list_tag_mutation_response',
      __args: { _set: 'list_tag_set_input', where: 'list_tag_bool_exp!' },
    },
    update_list_tag_by_pk: {
      __type: 'list_tag',
      __args: { _set: 'list_tag_set_input', pk_columns: 'list_tag_pk_columns_input!' },
    },
    update_list_tag_many: {
      __type: '[list_tag_mutation_response]',
      __args: { updates: '[list_tag_updates!]!' },
    },
    update_menu_item: {
      __type: 'menu_item_mutation_response',
      __args: {
        _inc: 'menu_item_inc_input',
        _set: 'menu_item_set_input',
        where: 'menu_item_bool_exp!',
      },
    },
    update_menu_item_by_pk: {
      __type: 'menu_item',
      __args: {
        _inc: 'menu_item_inc_input',
        _set: 'menu_item_set_input',
        pk_columns: 'menu_item_pk_columns_input!',
      },
    },
    update_menu_item_many: {
      __type: '[menu_item_mutation_response]',
      __args: { updates: '[menu_item_updates!]!' },
    },
    update_nhood_labels: {
      __type: 'nhood_labels_mutation_response',
      __args: {
        _inc: 'nhood_labels_inc_input',
        _set: 'nhood_labels_set_input',
        where: 'nhood_labels_bool_exp!',
      },
    },
    update_nhood_labels_by_pk: {
      __type: 'nhood_labels',
      __args: {
        _inc: 'nhood_labels_inc_input',
        _set: 'nhood_labels_set_input',
        pk_columns: 'nhood_labels_pk_columns_input!',
      },
    },
    update_nhood_labels_many: {
      __type: '[nhood_labels_mutation_response]',
      __args: { updates: '[nhood_labels_updates!]!' },
    },
    update_opening_hours: {
      __type: 'opening_hours_mutation_response',
      __args: { _set: 'opening_hours_set_input', where: 'opening_hours_bool_exp!' },
    },
    update_opening_hours_by_pk: {
      __type: 'opening_hours',
      __args: {
        _set: 'opening_hours_set_input',
        pk_columns: 'opening_hours_pk_columns_input!',
      },
    },
    update_opening_hours_many: {
      __type: '[opening_hours_mutation_response]',
      __args: { updates: '[opening_hours_updates!]!' },
    },
    update_photo: {
      __type: 'photo_mutation_response',
      __args: {
        _append: 'photo_append_input',
        _delete_at_path: 'photo_delete_at_path_input',
        _delete_elem: 'photo_delete_elem_input',
        _delete_key: 'photo_delete_key_input',
        _inc: 'photo_inc_input',
        _prepend: 'photo_prepend_input',
        _set: 'photo_set_input',
        where: 'photo_bool_exp!',
      },
    },
    update_photo_by_pk: {
      __type: 'photo',
      __args: {
        _append: 'photo_append_input',
        _delete_at_path: 'photo_delete_at_path_input',
        _delete_elem: 'photo_delete_elem_input',
        _delete_key: 'photo_delete_key_input',
        _inc: 'photo_inc_input',
        _prepend: 'photo_prepend_input',
        _set: 'photo_set_input',
        pk_columns: 'photo_pk_columns_input!',
      },
    },
    update_photo_many: {
      __type: '[photo_mutation_response]',
      __args: { updates: '[photo_updates!]!' },
    },
    update_photo_xref: {
      __type: 'photo_xref_mutation_response',
      __args: { _set: 'photo_xref_set_input', where: 'photo_xref_bool_exp!' },
    },
    update_photo_xref_by_pk: {
      __type: 'photo_xref',
      __args: { _set: 'photo_xref_set_input', pk_columns: 'photo_xref_pk_columns_input!' },
    },
    update_photo_xref_many: {
      __type: '[photo_xref_mutation_response]',
      __args: { updates: '[photo_xref_updates!]!' },
    },
    update_restaurant: {
      __type: 'restaurant_mutation_response',
      __args: {
        _append: 'restaurant_append_input',
        _delete_at_path: 'restaurant_delete_at_path_input',
        _delete_elem: 'restaurant_delete_elem_input',
        _delete_key: 'restaurant_delete_key_input',
        _inc: 'restaurant_inc_input',
        _prepend: 'restaurant_prepend_input',
        _set: 'restaurant_set_input',
        where: 'restaurant_bool_exp!',
      },
    },
    update_restaurant_by_pk: {
      __type: 'restaurant',
      __args: {
        _append: 'restaurant_append_input',
        _delete_at_path: 'restaurant_delete_at_path_input',
        _delete_elem: 'restaurant_delete_elem_input',
        _delete_key: 'restaurant_delete_key_input',
        _inc: 'restaurant_inc_input',
        _prepend: 'restaurant_prepend_input',
        _set: 'restaurant_set_input',
        pk_columns: 'restaurant_pk_columns_input!',
      },
    },
    update_restaurant_many: {
      __type: '[restaurant_mutation_response]',
      __args: { updates: '[restaurant_updates!]!' },
    },
    update_restaurant_tag: {
      __type: 'restaurant_tag_mutation_response',
      __args: {
        _append: 'restaurant_tag_append_input',
        _delete_at_path: 'restaurant_tag_delete_at_path_input',
        _delete_elem: 'restaurant_tag_delete_elem_input',
        _delete_key: 'restaurant_tag_delete_key_input',
        _inc: 'restaurant_tag_inc_input',
        _prepend: 'restaurant_tag_prepend_input',
        _set: 'restaurant_tag_set_input',
        where: 'restaurant_tag_bool_exp!',
      },
    },
    update_restaurant_tag_by_pk: {
      __type: 'restaurant_tag',
      __args: {
        _append: 'restaurant_tag_append_input',
        _delete_at_path: 'restaurant_tag_delete_at_path_input',
        _delete_elem: 'restaurant_tag_delete_elem_input',
        _delete_key: 'restaurant_tag_delete_key_input',
        _inc: 'restaurant_tag_inc_input',
        _prepend: 'restaurant_tag_prepend_input',
        _set: 'restaurant_tag_set_input',
        pk_columns: 'restaurant_tag_pk_columns_input!',
      },
    },
    update_restaurant_tag_many: {
      __type: '[restaurant_tag_mutation_response]',
      __args: { updates: '[restaurant_tag_updates!]!' },
    },
    update_review: {
      __type: 'review_mutation_response',
      __args: {
        _append: 'review_append_input',
        _delete_at_path: 'review_delete_at_path_input',
        _delete_elem: 'review_delete_elem_input',
        _delete_key: 'review_delete_key_input',
        _inc: 'review_inc_input',
        _prepend: 'review_prepend_input',
        _set: 'review_set_input',
        where: 'review_bool_exp!',
      },
    },
    update_review_by_pk: {
      __type: 'review',
      __args: {
        _append: 'review_append_input',
        _delete_at_path: 'review_delete_at_path_input',
        _delete_elem: 'review_delete_elem_input',
        _delete_key: 'review_delete_key_input',
        _inc: 'review_inc_input',
        _prepend: 'review_prepend_input',
        _set: 'review_set_input',
        pk_columns: 'review_pk_columns_input!',
      },
    },
    update_review_many: {
      __type: '[review_mutation_response]',
      __args: { updates: '[review_updates!]!' },
    },
    update_review_tag_sentence: {
      __type: 'review_tag_sentence_mutation_response',
      __args: {
        _inc: 'review_tag_sentence_inc_input',
        _set: 'review_tag_sentence_set_input',
        where: 'review_tag_sentence_bool_exp!',
      },
    },
    update_review_tag_sentence_by_pk: {
      __type: 'review_tag_sentence',
      __args: {
        _inc: 'review_tag_sentence_inc_input',
        _set: 'review_tag_sentence_set_input',
        pk_columns: 'review_tag_sentence_pk_columns_input!',
      },
    },
    update_review_tag_sentence_many: {
      __type: '[review_tag_sentence_mutation_response]',
      __args: { updates: '[review_tag_sentence_updates!]!' },
    },
    update_setting: {
      __type: 'setting_mutation_response',
      __args: {
        _append: 'setting_append_input',
        _delete_at_path: 'setting_delete_at_path_input',
        _delete_elem: 'setting_delete_elem_input',
        _delete_key: 'setting_delete_key_input',
        _prepend: 'setting_prepend_input',
        _set: 'setting_set_input',
        where: 'setting_bool_exp!',
      },
    },
    update_setting_by_pk: {
      __type: 'setting',
      __args: {
        _append: 'setting_append_input',
        _delete_at_path: 'setting_delete_at_path_input',
        _delete_elem: 'setting_delete_elem_input',
        _delete_key: 'setting_delete_key_input',
        _prepend: 'setting_prepend_input',
        _set: 'setting_set_input',
        pk_columns: 'setting_pk_columns_input!',
      },
    },
    update_setting_many: {
      __type: '[setting_mutation_response]',
      __args: { updates: '[setting_updates!]!' },
    },
    update_tag: {
      __type: 'tag_mutation_response',
      __args: {
        _append: 'tag_append_input',
        _delete_at_path: 'tag_delete_at_path_input',
        _delete_elem: 'tag_delete_elem_input',
        _delete_key: 'tag_delete_key_input',
        _inc: 'tag_inc_input',
        _prepend: 'tag_prepend_input',
        _set: 'tag_set_input',
        where: 'tag_bool_exp!',
      },
    },
    update_tag_by_pk: {
      __type: 'tag',
      __args: {
        _append: 'tag_append_input',
        _delete_at_path: 'tag_delete_at_path_input',
        _delete_elem: 'tag_delete_elem_input',
        _delete_key: 'tag_delete_key_input',
        _inc: 'tag_inc_input',
        _prepend: 'tag_prepend_input',
        _set: 'tag_set_input',
        pk_columns: 'tag_pk_columns_input!',
      },
    },
    update_tag_many: {
      __type: '[tag_mutation_response]',
      __args: { updates: '[tag_updates!]!' },
    },
    update_tag_tag: {
      __type: 'tag_tag_mutation_response',
      __args: { _set: 'tag_tag_set_input', where: 'tag_tag_bool_exp!' },
    },
    update_tag_tag_by_pk: {
      __type: 'tag_tag',
      __args: { _set: 'tag_tag_set_input', pk_columns: 'tag_tag_pk_columns_input!' },
    },
    update_tag_tag_many: {
      __type: '[tag_tag_mutation_response]',
      __args: { updates: '[tag_tag_updates!]!' },
    },
    update_user: {
      __type: 'user_mutation_response',
      __args: { _inc: 'user_inc_input', _set: 'user_set_input', where: 'user_bool_exp!' },
    },
    update_user_by_pk: {
      __type: 'user',
      __args: {
        _inc: 'user_inc_input',
        _set: 'user_set_input',
        pk_columns: 'user_pk_columns_input!',
      },
    },
    update_user_many: {
      __type: '[user_mutation_response]',
      __args: { updates: '[user_updates!]!' },
    },
    update_zcta5: {
      __type: 'zcta5_mutation_response',
      __args: { _inc: 'zcta5_inc_input', _set: 'zcta5_set_input', where: 'zcta5_bool_exp!' },
    },
    update_zcta5_by_pk: {
      __type: 'zcta5',
      __args: {
        _inc: 'zcta5_inc_input',
        _set: 'zcta5_set_input',
        pk_columns: 'zcta5_pk_columns_input!',
      },
    },
    update_zcta5_many: {
      __type: '[zcta5_mutation_response]',
      __args: { updates: '[zcta5_updates!]!' },
    },
  },
  nhood_labels: {
    __typename: { __type: 'String!' },
    center: { __type: 'geometry!' },
    name: { __type: 'String!' },
    ogc_fid: { __type: 'Int!' },
  },
  nhood_labels_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'nhood_labels_aggregate_fields' },
    nodes: { __type: '[nhood_labels!]!' },
  },
  nhood_labels_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'nhood_labels_avg_fields' },
    count: {
      __type: 'Int!',
      __args: { columns: '[nhood_labels_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'nhood_labels_max_fields' },
    min: { __type: 'nhood_labels_min_fields' },
    stddev: { __type: 'nhood_labels_stddev_fields' },
    stddev_pop: { __type: 'nhood_labels_stddev_pop_fields' },
    stddev_samp: { __type: 'nhood_labels_stddev_samp_fields' },
    sum: { __type: 'nhood_labels_sum_fields' },
    var_pop: { __type: 'nhood_labels_var_pop_fields' },
    var_samp: { __type: 'nhood_labels_var_samp_fields' },
    variance: { __type: 'nhood_labels_variance_fields' },
  },
  nhood_labels_avg_fields: { __typename: { __type: 'String!' }, ogc_fid: { __type: 'Float' } },
  nhood_labels_bool_exp: {
    _and: { __type: '[nhood_labels_bool_exp!]' },
    _not: { __type: 'nhood_labels_bool_exp' },
    _or: { __type: '[nhood_labels_bool_exp!]' },
    center: { __type: 'geometry_comparison_exp' },
    name: { __type: 'String_comparison_exp' },
    ogc_fid: { __type: 'Int_comparison_exp' },
  },
  nhood_labels_inc_input: { ogc_fid: { __type: 'Int' } },
  nhood_labels_insert_input: {
    center: { __type: 'geometry' },
    name: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
  },
  nhood_labels_max_fields: {
    __typename: { __type: 'String!' },
    name: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
  },
  nhood_labels_min_fields: {
    __typename: { __type: 'String!' },
    name: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
  },
  nhood_labels_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[nhood_labels!]!' },
  },
  nhood_labels_on_conflict: {
    constraint: { __type: 'nhood_labels_constraint!' },
    update_columns: { __type: '[nhood_labels_update_column!]!' },
    where: { __type: 'nhood_labels_bool_exp' },
  },
  nhood_labels_order_by: {
    center: { __type: 'order_by' },
    name: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
  },
  nhood_labels_pk_columns_input: { ogc_fid: { __type: 'Int!' } },
  nhood_labels_set_input: {
    center: { __type: 'geometry' },
    name: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
  },
  nhood_labels_stddev_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Float' },
  },
  nhood_labels_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Float' },
  },
  nhood_labels_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Float' },
  },
  nhood_labels_stream_cursor_input: {
    initial_value: { __type: 'nhood_labels_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  nhood_labels_stream_cursor_value_input: {
    center: { __type: 'geometry' },
    name: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
  },
  nhood_labels_sum_fields: { __typename: { __type: 'String!' }, ogc_fid: { __type: 'Int' } },
  nhood_labels_updates: {
    _inc: { __type: 'nhood_labels_inc_input' },
    _set: { __type: 'nhood_labels_set_input' },
    where: { __type: 'nhood_labels_bool_exp!' },
  },
  nhood_labels_var_pop_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Float' },
  },
  nhood_labels_var_samp_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Float' },
  },
  nhood_labels_variance_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Float' },
  },
  numeric_comparison_exp: {
    _eq: { __type: 'numeric' },
    _gt: { __type: 'numeric' },
    _gte: { __type: 'numeric' },
    _in: { __type: '[numeric!]' },
    _is_null: { __type: 'Boolean' },
    _lt: { __type: 'numeric' },
    _lte: { __type: 'numeric' },
    _neq: { __type: 'numeric' },
    _nin: { __type: '[numeric!]' },
  },
  opening_hours: {
    __typename: { __type: 'String!' },
    hours: { __type: 'tsrange!' },
    id: { __type: 'uuid!' },
    restaurant: { __type: 'restaurant!' },
    restaurant_id: { __type: 'uuid!' },
  },
  opening_hours_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'opening_hours_aggregate_fields' },
    nodes: { __type: '[opening_hours!]!' },
  },
  opening_hours_aggregate_fields: {
    __typename: { __type: 'String!' },
    count: {
      __type: 'Int!',
      __args: { columns: '[opening_hours_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'opening_hours_max_fields' },
    min: { __type: 'opening_hours_min_fields' },
  },
  opening_hours_bool_exp: {
    _and: { __type: '[opening_hours_bool_exp!]' },
    _not: { __type: 'opening_hours_bool_exp' },
    _or: { __type: '[opening_hours_bool_exp!]' },
    hours: { __type: 'tsrange_comparison_exp' },
    id: { __type: 'uuid_comparison_exp' },
    restaurant: { __type: 'restaurant_bool_exp' },
    restaurant_id: { __type: 'uuid_comparison_exp' },
  },
  opening_hours_insert_input: {
    hours: { __type: 'tsrange' },
    id: { __type: 'uuid' },
    restaurant: { __type: 'restaurant_obj_rel_insert_input' },
    restaurant_id: { __type: 'uuid' },
  },
  opening_hours_max_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'uuid' },
    restaurant_id: { __type: 'uuid' },
  },
  opening_hours_min_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'uuid' },
    restaurant_id: { __type: 'uuid' },
  },
  opening_hours_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[opening_hours!]!' },
  },
  opening_hours_on_conflict: {
    constraint: { __type: 'opening_hours_constraint!' },
    update_columns: { __type: '[opening_hours_update_column!]!' },
    where: { __type: 'opening_hours_bool_exp' },
  },
  opening_hours_order_by: {
    hours: { __type: 'order_by' },
    id: { __type: 'order_by' },
    restaurant: { __type: 'restaurant_order_by' },
    restaurant_id: { __type: 'order_by' },
  },
  opening_hours_pk_columns_input: { id: { __type: 'uuid!' } },
  opening_hours_set_input: {
    hours: { __type: 'tsrange' },
    id: { __type: 'uuid' },
    restaurant_id: { __type: 'uuid' },
  },
  opening_hours_stream_cursor_input: {
    initial_value: { __type: 'opening_hours_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  opening_hours_stream_cursor_value_input: {
    hours: { __type: 'tsrange' },
    id: { __type: 'uuid' },
    restaurant_id: { __type: 'uuid' },
  },
  opening_hours_updates: {
    _set: { __type: 'opening_hours_set_input' },
    where: { __type: 'opening_hours_bool_exp!' },
  },
  photo: {
    __typename: { __type: 'String!' },
    categories: { __type: 'jsonb' },
    created_at: { __type: 'timestamptz!' },
    id: { __type: 'uuid!' },
    origin: { __type: 'String' },
    quality: { __type: 'numeric' },
    updated_at: { __type: 'timestamptz!' },
    url: { __type: 'String' },
    user_id: { __type: 'uuid' },
  },
  photo_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'photo_aggregate_fields' },
    nodes: { __type: '[photo!]!' },
  },
  photo_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'photo_avg_fields' },
    count: {
      __type: 'Int!',
      __args: { columns: '[photo_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'photo_max_fields' },
    min: { __type: 'photo_min_fields' },
    stddev: { __type: 'photo_stddev_fields' },
    stddev_pop: { __type: 'photo_stddev_pop_fields' },
    stddev_samp: { __type: 'photo_stddev_samp_fields' },
    sum: { __type: 'photo_sum_fields' },
    var_pop: { __type: 'photo_var_pop_fields' },
    var_samp: { __type: 'photo_var_samp_fields' },
    variance: { __type: 'photo_variance_fields' },
  },
  photo_append_input: { categories: { __type: 'jsonb' } },
  photo_avg_fields: { __typename: { __type: 'String!' }, quality: { __type: 'Float' } },
  photo_bool_exp: {
    _and: { __type: '[photo_bool_exp!]' },
    _not: { __type: 'photo_bool_exp' },
    _or: { __type: '[photo_bool_exp!]' },
    categories: { __type: 'jsonb_comparison_exp' },
    created_at: { __type: 'timestamptz_comparison_exp' },
    id: { __type: 'uuid_comparison_exp' },
    origin: { __type: 'String_comparison_exp' },
    quality: { __type: 'numeric_comparison_exp' },
    updated_at: { __type: 'timestamptz_comparison_exp' },
    url: { __type: 'String_comparison_exp' },
    user_id: { __type: 'uuid_comparison_exp' },
  },
  photo_delete_at_path_input: { categories: { __type: '[String!]' } },
  photo_delete_elem_input: { categories: { __type: 'Int' } },
  photo_delete_key_input: { categories: { __type: 'String' } },
  photo_inc_input: { quality: { __type: 'numeric' } },
  photo_insert_input: {
    categories: { __type: 'jsonb' },
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    origin: { __type: 'String' },
    quality: { __type: 'numeric' },
    updated_at: { __type: 'timestamptz' },
    url: { __type: 'String' },
    user_id: { __type: 'uuid' },
  },
  photo_max_fields: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    origin: { __type: 'String' },
    quality: { __type: 'numeric' },
    updated_at: { __type: 'timestamptz' },
    url: { __type: 'String' },
    user_id: { __type: 'uuid' },
  },
  photo_min_fields: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    origin: { __type: 'String' },
    quality: { __type: 'numeric' },
    updated_at: { __type: 'timestamptz' },
    url: { __type: 'String' },
    user_id: { __type: 'uuid' },
  },
  photo_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[photo!]!' },
  },
  photo_obj_rel_insert_input: {
    data: { __type: 'photo_insert_input!' },
    on_conflict: { __type: 'photo_on_conflict' },
  },
  photo_on_conflict: {
    constraint: { __type: 'photo_constraint!' },
    update_columns: { __type: '[photo_update_column!]!' },
    where: { __type: 'photo_bool_exp' },
  },
  photo_order_by: {
    categories: { __type: 'order_by' },
    created_at: { __type: 'order_by' },
    id: { __type: 'order_by' },
    origin: { __type: 'order_by' },
    quality: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    url: { __type: 'order_by' },
    user_id: { __type: 'order_by' },
  },
  photo_pk_columns_input: { id: { __type: 'uuid!' } },
  photo_prepend_input: { categories: { __type: 'jsonb' } },
  photo_set_input: {
    categories: { __type: 'jsonb' },
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    origin: { __type: 'String' },
    quality: { __type: 'numeric' },
    updated_at: { __type: 'timestamptz' },
    url: { __type: 'String' },
    user_id: { __type: 'uuid' },
  },
  photo_stddev_fields: { __typename: { __type: 'String!' }, quality: { __type: 'Float' } },
  photo_stddev_pop_fields: { __typename: { __type: 'String!' }, quality: { __type: 'Float' } },
  photo_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    quality: { __type: 'Float' },
  },
  photo_stream_cursor_input: {
    initial_value: { __type: 'photo_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  photo_stream_cursor_value_input: {
    categories: { __type: 'jsonb' },
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    origin: { __type: 'String' },
    quality: { __type: 'numeric' },
    updated_at: { __type: 'timestamptz' },
    url: { __type: 'String' },
    user_id: { __type: 'uuid' },
  },
  photo_sum_fields: { __typename: { __type: 'String!' }, quality: { __type: 'numeric' } },
  photo_updates: {
    _append: { __type: 'photo_append_input' },
    _delete_at_path: { __type: 'photo_delete_at_path_input' },
    _delete_elem: { __type: 'photo_delete_elem_input' },
    _delete_key: { __type: 'photo_delete_key_input' },
    _inc: { __type: 'photo_inc_input' },
    _prepend: { __type: 'photo_prepend_input' },
    _set: { __type: 'photo_set_input' },
    where: { __type: 'photo_bool_exp!' },
  },
  photo_var_pop_fields: { __typename: { __type: 'String!' }, quality: { __type: 'Float' } },
  photo_var_samp_fields: { __typename: { __type: 'String!' }, quality: { __type: 'Float' } },
  photo_variance_fields: { __typename: { __type: 'String!' }, quality: { __type: 'Float' } },
  photo_xref: {
    __typename: { __type: 'String!' },
    id: { __type: 'uuid!' },
    photo: { __type: 'photo!' },
    photo_id: { __type: 'uuid!' },
    restaurant: { __type: 'restaurant!' },
    restaurant_id: { __type: 'uuid!' },
    review_id: { __type: 'uuid' },
    tag_id: { __type: 'uuid!' },
    type: { __type: 'String' },
    user_id: { __type: 'uuid' },
  },
  photo_xref_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'photo_xref_aggregate_fields' },
    nodes: { __type: '[photo_xref!]!' },
  },
  photo_xref_aggregate_bool_exp: { count: { __type: 'photo_xref_aggregate_bool_exp_count' } },
  photo_xref_aggregate_bool_exp_count: {
    arguments: { __type: '[photo_xref_select_column!]' },
    distinct: { __type: 'Boolean' },
    filter: { __type: 'photo_xref_bool_exp' },
    predicate: { __type: 'Int_comparison_exp!' },
  },
  photo_xref_aggregate_fields: {
    __typename: { __type: 'String!' },
    count: {
      __type: 'Int!',
      __args: { columns: '[photo_xref_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'photo_xref_max_fields' },
    min: { __type: 'photo_xref_min_fields' },
  },
  photo_xref_aggregate_order_by: {
    count: { __type: 'order_by' },
    max: { __type: 'photo_xref_max_order_by' },
    min: { __type: 'photo_xref_min_order_by' },
  },
  photo_xref_arr_rel_insert_input: {
    data: { __type: '[photo_xref_insert_input!]!' },
    on_conflict: { __type: 'photo_xref_on_conflict' },
  },
  photo_xref_bool_exp: {
    _and: { __type: '[photo_xref_bool_exp!]' },
    _not: { __type: 'photo_xref_bool_exp' },
    _or: { __type: '[photo_xref_bool_exp!]' },
    id: { __type: 'uuid_comparison_exp' },
    photo: { __type: 'photo_bool_exp' },
    photo_id: { __type: 'uuid_comparison_exp' },
    restaurant: { __type: 'restaurant_bool_exp' },
    restaurant_id: { __type: 'uuid_comparison_exp' },
    review_id: { __type: 'uuid_comparison_exp' },
    tag_id: { __type: 'uuid_comparison_exp' },
    type: { __type: 'String_comparison_exp' },
    user_id: { __type: 'uuid_comparison_exp' },
  },
  photo_xref_insert_input: {
    id: { __type: 'uuid' },
    photo: { __type: 'photo_obj_rel_insert_input' },
    photo_id: { __type: 'uuid' },
    restaurant: { __type: 'restaurant_obj_rel_insert_input' },
    restaurant_id: { __type: 'uuid' },
    review_id: { __type: 'uuid' },
    tag_id: { __type: 'uuid' },
    type: { __type: 'String' },
    user_id: { __type: 'uuid' },
  },
  photo_xref_max_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'uuid' },
    photo_id: { __type: 'uuid' },
    restaurant_id: { __type: 'uuid' },
    review_id: { __type: 'uuid' },
    tag_id: { __type: 'uuid' },
    type: { __type: 'String' },
    user_id: { __type: 'uuid' },
  },
  photo_xref_max_order_by: {
    id: { __type: 'order_by' },
    photo_id: { __type: 'order_by' },
    restaurant_id: { __type: 'order_by' },
    review_id: { __type: 'order_by' },
    tag_id: { __type: 'order_by' },
    type: { __type: 'order_by' },
    user_id: { __type: 'order_by' },
  },
  photo_xref_min_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'uuid' },
    photo_id: { __type: 'uuid' },
    restaurant_id: { __type: 'uuid' },
    review_id: { __type: 'uuid' },
    tag_id: { __type: 'uuid' },
    type: { __type: 'String' },
    user_id: { __type: 'uuid' },
  },
  photo_xref_min_order_by: {
    id: { __type: 'order_by' },
    photo_id: { __type: 'order_by' },
    restaurant_id: { __type: 'order_by' },
    review_id: { __type: 'order_by' },
    tag_id: { __type: 'order_by' },
    type: { __type: 'order_by' },
    user_id: { __type: 'order_by' },
  },
  photo_xref_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[photo_xref!]!' },
  },
  photo_xref_on_conflict: {
    constraint: { __type: 'photo_xref_constraint!' },
    update_columns: { __type: '[photo_xref_update_column!]!' },
    where: { __type: 'photo_xref_bool_exp' },
  },
  photo_xref_order_by: {
    id: { __type: 'order_by' },
    photo: { __type: 'photo_order_by' },
    photo_id: { __type: 'order_by' },
    restaurant: { __type: 'restaurant_order_by' },
    restaurant_id: { __type: 'order_by' },
    review_id: { __type: 'order_by' },
    tag_id: { __type: 'order_by' },
    type: { __type: 'order_by' },
    user_id: { __type: 'order_by' },
  },
  photo_xref_pk_columns_input: { id: { __type: 'uuid!' } },
  photo_xref_set_input: {
    id: { __type: 'uuid' },
    photo_id: { __type: 'uuid' },
    restaurant_id: { __type: 'uuid' },
    review_id: { __type: 'uuid' },
    tag_id: { __type: 'uuid' },
    type: { __type: 'String' },
    user_id: { __type: 'uuid' },
  },
  photo_xref_stream_cursor_input: {
    initial_value: { __type: 'photo_xref_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  photo_xref_stream_cursor_value_input: {
    id: { __type: 'uuid' },
    photo_id: { __type: 'uuid' },
    restaurant_id: { __type: 'uuid' },
    review_id: { __type: 'uuid' },
    tag_id: { __type: 'uuid' },
    type: { __type: 'String' },
    user_id: { __type: 'uuid' },
  },
  photo_xref_updates: {
    _set: { __type: 'photo_xref_set_input' },
    where: { __type: 'photo_xref_bool_exp!' },
  },
  query: {
    __typename: { __type: 'String!' },
    boundaries_city: {
      __type: '[boundaries_city!]!',
      __args: {
        distinct_on: '[boundaries_city_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[boundaries_city_order_by!]',
        where: 'boundaries_city_bool_exp',
      },
    },
    boundaries_city_aggregate: {
      __type: 'boundaries_city_aggregate!',
      __args: {
        distinct_on: '[boundaries_city_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[boundaries_city_order_by!]',
        where: 'boundaries_city_bool_exp',
      },
    },
    boundaries_city_by_pk: { __type: 'boundaries_city', __args: { ogc_fid: 'Int!' } },
    follow: {
      __type: '[follow!]!',
      __args: {
        distinct_on: '[follow_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[follow_order_by!]',
        where: 'follow_bool_exp',
      },
    },
    follow_aggregate: {
      __type: 'follow_aggregate!',
      __args: {
        distinct_on: '[follow_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[follow_order_by!]',
        where: 'follow_bool_exp',
      },
    },
    follow_by_pk: { __type: 'follow', __args: { id: 'uuid!' } },
    hrr: {
      __type: '[hrr!]!',
      __args: {
        distinct_on: '[hrr_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[hrr_order_by!]',
        where: 'hrr_bool_exp',
      },
    },
    hrr_aggregate: {
      __type: 'hrr_aggregate!',
      __args: {
        distinct_on: '[hrr_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[hrr_order_by!]',
        where: 'hrr_bool_exp',
      },
    },
    hrr_by_pk: { __type: 'hrr', __args: { ogc_fid: 'Int!' } },
    list: {
      __type: '[list!]!',
      __args: {
        distinct_on: '[list_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_order_by!]',
        where: 'list_bool_exp',
      },
    },
    list_aggregate: {
      __type: 'list_aggregate!',
      __args: {
        distinct_on: '[list_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_order_by!]',
        where: 'list_bool_exp',
      },
    },
    list_by_pk: { __type: 'list', __args: { id: 'uuid!' } },
    list_populated: {
      __type: '[list!]!',
      __args: {
        args: 'list_populated_args!',
        distinct_on: '[list_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_order_by!]',
        where: 'list_bool_exp',
      },
    },
    list_populated_aggregate: {
      __type: 'list_aggregate!',
      __args: {
        args: 'list_populated_args!',
        distinct_on: '[list_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_order_by!]',
        where: 'list_bool_exp',
      },
    },
    list_region: {
      __type: '[list_region!]!',
      __args: {
        distinct_on: '[list_region_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_region_order_by!]',
        where: 'list_region_bool_exp',
      },
    },
    list_region_aggregate: {
      __type: 'list_region_aggregate!',
      __args: {
        distinct_on: '[list_region_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_region_order_by!]',
        where: 'list_region_bool_exp',
      },
    },
    list_region_by_pk: { __type: 'list_region', __args: { id: 'uuid!' } },
    list_restaurant: {
      __type: '[list_restaurant!]!',
      __args: {
        distinct_on: '[list_restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_restaurant_order_by!]',
        where: 'list_restaurant_bool_exp',
      },
    },
    list_restaurant_aggregate: {
      __type: 'list_restaurant_aggregate!',
      __args: {
        distinct_on: '[list_restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_restaurant_order_by!]',
        where: 'list_restaurant_bool_exp',
      },
    },
    list_restaurant_by_pk: {
      __type: 'list_restaurant',
      __args: { list_id: 'uuid!', restaurant_id: 'uuid!' },
    },
    list_restaurant_tag: {
      __type: '[list_restaurant_tag!]!',
      __args: {
        distinct_on: '[list_restaurant_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_restaurant_tag_order_by!]',
        where: 'list_restaurant_tag_bool_exp',
      },
    },
    list_restaurant_tag_aggregate: {
      __type: 'list_restaurant_tag_aggregate!',
      __args: {
        distinct_on: '[list_restaurant_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_restaurant_tag_order_by!]',
        where: 'list_restaurant_tag_bool_exp',
      },
    },
    list_restaurant_tag_by_pk: { __type: 'list_restaurant_tag', __args: { id: 'uuid!' } },
    list_tag: {
      __type: '[list_tag!]!',
      __args: {
        distinct_on: '[list_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_tag_order_by!]',
        where: 'list_tag_bool_exp',
      },
    },
    list_tag_aggregate: {
      __type: 'list_tag_aggregate!',
      __args: {
        distinct_on: '[list_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_tag_order_by!]',
        where: 'list_tag_bool_exp',
      },
    },
    list_tag_by_pk: { __type: 'list_tag', __args: { id: 'uuid!' } },
    menu_item: {
      __type: '[menu_item!]!',
      __args: {
        distinct_on: '[menu_item_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[menu_item_order_by!]',
        where: 'menu_item_bool_exp',
      },
    },
    menu_item_aggregate: {
      __type: 'menu_item_aggregate!',
      __args: {
        distinct_on: '[menu_item_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[menu_item_order_by!]',
        where: 'menu_item_bool_exp',
      },
    },
    menu_item_by_pk: { __type: 'menu_item', __args: { id: 'uuid!' } },
    nhood_labels: {
      __type: '[nhood_labels!]!',
      __args: {
        distinct_on: '[nhood_labels_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[nhood_labels_order_by!]',
        where: 'nhood_labels_bool_exp',
      },
    },
    nhood_labels_aggregate: {
      __type: 'nhood_labels_aggregate!',
      __args: {
        distinct_on: '[nhood_labels_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[nhood_labels_order_by!]',
        where: 'nhood_labels_bool_exp',
      },
    },
    nhood_labels_by_pk: { __type: 'nhood_labels', __args: { ogc_fid: 'Int!' } },
    opening_hours: {
      __type: '[opening_hours!]!',
      __args: {
        distinct_on: '[opening_hours_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[opening_hours_order_by!]',
        where: 'opening_hours_bool_exp',
      },
    },
    opening_hours_aggregate: {
      __type: 'opening_hours_aggregate!',
      __args: {
        distinct_on: '[opening_hours_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[opening_hours_order_by!]',
        where: 'opening_hours_bool_exp',
      },
    },
    opening_hours_by_pk: { __type: 'opening_hours', __args: { id: 'uuid!' } },
    photo: {
      __type: '[photo!]!',
      __args: {
        distinct_on: '[photo_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[photo_order_by!]',
        where: 'photo_bool_exp',
      },
    },
    photo_aggregate: {
      __type: 'photo_aggregate!',
      __args: {
        distinct_on: '[photo_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[photo_order_by!]',
        where: 'photo_bool_exp',
      },
    },
    photo_by_pk: { __type: 'photo', __args: { id: 'uuid!' } },
    photo_xref: {
      __type: '[photo_xref!]!',
      __args: {
        distinct_on: '[photo_xref_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[photo_xref_order_by!]',
        where: 'photo_xref_bool_exp',
      },
    },
    photo_xref_aggregate: {
      __type: 'photo_xref_aggregate!',
      __args: {
        distinct_on: '[photo_xref_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[photo_xref_order_by!]',
        where: 'photo_xref_bool_exp',
      },
    },
    photo_xref_by_pk: { __type: 'photo_xref', __args: { id: 'uuid!' } },
    restaurant: {
      __type: '[restaurant!]!',
      __args: {
        distinct_on: '[restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_order_by!]',
        where: 'restaurant_bool_exp',
      },
    },
    restaurant_aggregate: {
      __type: 'restaurant_aggregate!',
      __args: {
        distinct_on: '[restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_order_by!]',
        where: 'restaurant_bool_exp',
      },
    },
    restaurant_by_pk: { __type: 'restaurant', __args: { id: 'uuid!' } },
    restaurant_new: {
      __type: '[restaurant!]!',
      __args: {
        args: 'restaurant_new_args!',
        distinct_on: '[restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_order_by!]',
        where: 'restaurant_bool_exp',
      },
    },
    restaurant_new_aggregate: {
      __type: 'restaurant_aggregate!',
      __args: {
        args: 'restaurant_new_args!',
        distinct_on: '[restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_order_by!]',
        where: 'restaurant_bool_exp',
      },
    },
    restaurant_tag: {
      __type: '[restaurant_tag!]!',
      __args: {
        distinct_on: '[restaurant_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_tag_order_by!]',
        where: 'restaurant_tag_bool_exp',
      },
    },
    restaurant_tag_aggregate: {
      __type: 'restaurant_tag_aggregate!',
      __args: {
        distinct_on: '[restaurant_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_tag_order_by!]',
        where: 'restaurant_tag_bool_exp',
      },
    },
    restaurant_tag_by_pk: {
      __type: 'restaurant_tag',
      __args: { restaurant_id: 'uuid!', tag_id: 'uuid!' },
    },
    restaurant_top_tags: {
      __type: '[restaurant_tag!]!',
      __args: {
        args: 'restaurant_top_tags_args!',
        distinct_on: '[restaurant_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_tag_order_by!]',
        where: 'restaurant_tag_bool_exp',
      },
    },
    restaurant_top_tags_aggregate: {
      __type: 'restaurant_tag_aggregate!',
      __args: {
        args: 'restaurant_top_tags_args!',
        distinct_on: '[restaurant_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_tag_order_by!]',
        where: 'restaurant_tag_bool_exp',
      },
    },
    restaurant_trending: {
      __type: '[restaurant!]!',
      __args: {
        args: 'restaurant_trending_args!',
        distinct_on: '[restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_order_by!]',
        where: 'restaurant_bool_exp',
      },
    },
    restaurant_trending_aggregate: {
      __type: 'restaurant_aggregate!',
      __args: {
        args: 'restaurant_trending_args!',
        distinct_on: '[restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_order_by!]',
        where: 'restaurant_bool_exp',
      },
    },
    restaurant_with_tags: {
      __type: '[restaurant!]!',
      __args: {
        args: 'restaurant_with_tags_args!',
        distinct_on: '[restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_order_by!]',
        where: 'restaurant_bool_exp',
      },
    },
    restaurant_with_tags_aggregate: {
      __type: 'restaurant_aggregate!',
      __args: {
        args: 'restaurant_with_tags_args!',
        distinct_on: '[restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_order_by!]',
        where: 'restaurant_bool_exp',
      },
    },
    review: {
      __type: '[review!]!',
      __args: {
        distinct_on: '[review_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_order_by!]',
        where: 'review_bool_exp',
      },
    },
    review_aggregate: {
      __type: 'review_aggregate!',
      __args: {
        distinct_on: '[review_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_order_by!]',
        where: 'review_bool_exp',
      },
    },
    review_by_pk: { __type: 'review', __args: { id: 'uuid!' } },
    review_tag_sentence: {
      __type: '[review_tag_sentence!]!',
      __args: {
        distinct_on: '[review_tag_sentence_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_tag_sentence_order_by!]',
        where: 'review_tag_sentence_bool_exp',
      },
    },
    review_tag_sentence_aggregate: {
      __type: 'review_tag_sentence_aggregate!',
      __args: {
        distinct_on: '[review_tag_sentence_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_tag_sentence_order_by!]',
        where: 'review_tag_sentence_bool_exp',
      },
    },
    review_tag_sentence_by_pk: { __type: 'review_tag_sentence', __args: { id: 'uuid!' } },
    setting: {
      __type: '[setting!]!',
      __args: {
        distinct_on: '[setting_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[setting_order_by!]',
        where: 'setting_bool_exp',
      },
    },
    setting_aggregate: {
      __type: 'setting_aggregate!',
      __args: {
        distinct_on: '[setting_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[setting_order_by!]',
        where: 'setting_bool_exp',
      },
    },
    setting_by_pk: { __type: 'setting', __args: { key: 'String!' } },
    tag: {
      __type: '[tag!]!',
      __args: {
        distinct_on: '[tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[tag_order_by!]',
        where: 'tag_bool_exp',
      },
    },
    tag_aggregate: {
      __type: 'tag_aggregate!',
      __args: {
        distinct_on: '[tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[tag_order_by!]',
        where: 'tag_bool_exp',
      },
    },
    tag_by_pk: { __type: 'tag', __args: { id: 'uuid!' } },
    tag_tag: {
      __type: '[tag_tag!]!',
      __args: {
        distinct_on: '[tag_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[tag_tag_order_by!]',
        where: 'tag_tag_bool_exp',
      },
    },
    tag_tag_aggregate: {
      __type: 'tag_tag_aggregate!',
      __args: {
        distinct_on: '[tag_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[tag_tag_order_by!]',
        where: 'tag_tag_bool_exp',
      },
    },
    tag_tag_by_pk: {
      __type: 'tag_tag',
      __args: { category_tag_id: 'uuid!', tag_id: 'uuid!' },
    },
    user: {
      __type: '[user!]!',
      __args: {
        distinct_on: '[user_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[user_order_by!]',
        where: 'user_bool_exp',
      },
    },
    user_aggregate: {
      __type: 'user_aggregate!',
      __args: {
        distinct_on: '[user_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[user_order_by!]',
        where: 'user_bool_exp',
      },
    },
    user_by_pk: { __type: 'user', __args: { id: 'uuid!' } },
    zcta5: {
      __type: '[zcta5!]!',
      __args: {
        distinct_on: '[zcta5_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[zcta5_order_by!]',
        where: 'zcta5_bool_exp',
      },
    },
    zcta5_aggregate: {
      __type: 'zcta5_aggregate!',
      __args: {
        distinct_on: '[zcta5_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[zcta5_order_by!]',
        where: 'zcta5_bool_exp',
      },
    },
    zcta5_by_pk: { __type: 'zcta5', __args: { ogc_fid: 'Int!' } },
  },
  restaurant: {
    __typename: { __type: 'String!' },
    address: { __type: 'String' },
    city: { __type: 'String' },
    created_at: { __type: 'timestamptz!' },
    description: { __type: 'String' },
    downvotes: { __type: 'numeric' },
    external_source_info: { __type: 'jsonb' },
    geocoder_id: { __type: 'String' },
    headlines: { __type: 'jsonb' },
    hours: { __type: 'jsonb' },
    id: { __type: 'uuid!' },
    image: { __type: 'String' },
    is_open_now: { __type: 'Boolean' },
    is_out_of_business: { __type: 'Boolean' },
    lists: {
      __type: '[list_restaurant!]!',
      __args: {
        distinct_on: '[list_restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_restaurant_order_by!]',
        where: 'list_restaurant_bool_exp',
      },
    },
    lists_aggregate: {
      __type: 'list_restaurant_aggregate!',
      __args: {
        distinct_on: '[list_restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_restaurant_order_by!]',
        where: 'list_restaurant_bool_exp',
      },
    },
    location: { __type: 'geometry!' },
    menu_items: {
      __type: '[menu_item!]!',
      __args: {
        distinct_on: '[menu_item_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[menu_item_order_by!]',
        where: 'menu_item_bool_exp',
      },
    },
    menu_items_aggregate: {
      __type: 'menu_item_aggregate!',
      __args: {
        distinct_on: '[menu_item_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[menu_item_order_by!]',
        where: 'menu_item_bool_exp',
      },
    },
    name: { __type: 'String!' },
    og_source_ids: { __type: 'jsonb' },
    oldest_review_date: { __type: 'timestamptz' },
    photo_table: {
      __type: '[photo_xref!]!',
      __args: {
        distinct_on: '[photo_xref_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[photo_xref_order_by!]',
        where: 'photo_xref_bool_exp',
      },
    },
    photo_table_aggregate: {
      __type: 'photo_xref_aggregate!',
      __args: {
        distinct_on: '[photo_xref_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[photo_xref_order_by!]',
        where: 'photo_xref_bool_exp',
      },
    },
    photos: { __type: 'jsonb' },
    price_range: { __type: 'String' },
    rating: { __type: 'numeric' },
    rating_factors: { __type: 'jsonb' },
    reviews: {
      __type: '[review!]!',
      __args: {
        distinct_on: '[review_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_order_by!]',
        where: 'review_bool_exp',
      },
    },
    reviews_aggregate: {
      __type: 'review_aggregate!',
      __args: {
        distinct_on: '[review_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_order_by!]',
        where: 'review_bool_exp',
      },
    },
    score: { __type: 'numeric' },
    score_breakdown: { __type: 'jsonb' },
    scrape_metadata: { __type: 'jsonb' },
    slug: { __type: 'String' },
    source_breakdown: { __type: 'jsonb' },
    sources: { __type: 'jsonb' },
    state: { __type: 'String' },
    summary: { __type: 'String' },
    tag_names: { __type: 'jsonb' },
    tags: {
      __type: '[restaurant_tag!]!',
      __args: {
        distinct_on: '[restaurant_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_tag_order_by!]',
        where: 'restaurant_tag_bool_exp',
      },
    },
    tags_aggregate: {
      __type: 'restaurant_tag_aggregate!',
      __args: {
        distinct_on: '[restaurant_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_tag_order_by!]',
        where: 'restaurant_tag_bool_exp',
      },
    },
    telephone: { __type: 'String' },
    top_tags: {
      __type: '[restaurant_tag!]',
      __args: {
        args: 'top_tags_restaurant_args!',
        distinct_on: '[restaurant_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_tag_order_by!]',
        where: 'restaurant_tag_bool_exp',
      },
    },
    updated_at: { __type: 'timestamptz!' },
    upvotes: { __type: 'numeric' },
    votes_ratio: { __type: 'numeric' },
    website: { __type: 'String' },
    zip: { __type: 'numeric' },
  },
  restaurant_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'restaurant_aggregate_fields' },
    nodes: { __type: '[restaurant!]!' },
  },
  restaurant_aggregate_bool_exp: {
    bool_and: { __type: 'restaurant_aggregate_bool_exp_bool_and' },
    bool_or: { __type: 'restaurant_aggregate_bool_exp_bool_or' },
    count: { __type: 'restaurant_aggregate_bool_exp_count' },
  },
  restaurant_aggregate_bool_exp_bool_and: {
    arguments: {
      __type:
        'restaurant_select_column_restaurant_aggregate_bool_exp_bool_and_arguments_columns!',
    },
    distinct: { __type: 'Boolean' },
    filter: { __type: 'restaurant_bool_exp' },
    predicate: { __type: 'Boolean_comparison_exp!' },
  },
  restaurant_aggregate_bool_exp_bool_or: {
    arguments: {
      __type:
        'restaurant_select_column_restaurant_aggregate_bool_exp_bool_or_arguments_columns!',
    },
    distinct: { __type: 'Boolean' },
    filter: { __type: 'restaurant_bool_exp' },
    predicate: { __type: 'Boolean_comparison_exp!' },
  },
  restaurant_aggregate_bool_exp_count: {
    arguments: { __type: '[restaurant_select_column!]' },
    distinct: { __type: 'Boolean' },
    filter: { __type: 'restaurant_bool_exp' },
    predicate: { __type: 'Int_comparison_exp!' },
  },
  restaurant_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'restaurant_avg_fields' },
    count: {
      __type: 'Int!',
      __args: { columns: '[restaurant_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'restaurant_max_fields' },
    min: { __type: 'restaurant_min_fields' },
    stddev: { __type: 'restaurant_stddev_fields' },
    stddev_pop: { __type: 'restaurant_stddev_pop_fields' },
    stddev_samp: { __type: 'restaurant_stddev_samp_fields' },
    sum: { __type: 'restaurant_sum_fields' },
    var_pop: { __type: 'restaurant_var_pop_fields' },
    var_samp: { __type: 'restaurant_var_samp_fields' },
    variance: { __type: 'restaurant_variance_fields' },
  },
  restaurant_aggregate_order_by: {
    avg: { __type: 'restaurant_avg_order_by' },
    count: { __type: 'order_by' },
    max: { __type: 'restaurant_max_order_by' },
    min: { __type: 'restaurant_min_order_by' },
    stddev: { __type: 'restaurant_stddev_order_by' },
    stddev_pop: { __type: 'restaurant_stddev_pop_order_by' },
    stddev_samp: { __type: 'restaurant_stddev_samp_order_by' },
    sum: { __type: 'restaurant_sum_order_by' },
    var_pop: { __type: 'restaurant_var_pop_order_by' },
    var_samp: { __type: 'restaurant_var_samp_order_by' },
    variance: { __type: 'restaurant_variance_order_by' },
  },
  restaurant_append_input: {
    external_source_info: { __type: 'jsonb' },
    headlines: { __type: 'jsonb' },
    hours: { __type: 'jsonb' },
    og_source_ids: { __type: 'jsonb' },
    photos: { __type: 'jsonb' },
    rating_factors: { __type: 'jsonb' },
    score_breakdown: { __type: 'jsonb' },
    scrape_metadata: { __type: 'jsonb' },
    source_breakdown: { __type: 'jsonb' },
    sources: { __type: 'jsonb' },
    tag_names: { __type: 'jsonb' },
  },
  restaurant_arr_rel_insert_input: {
    data: { __type: '[restaurant_insert_input!]!' },
    on_conflict: { __type: 'restaurant_on_conflict' },
  },
  restaurant_avg_fields: {
    __typename: { __type: 'String!' },
    downvotes: { __type: 'Float' },
    rating: { __type: 'Float' },
    score: { __type: 'Float' },
    upvotes: { __type: 'Float' },
    votes_ratio: { __type: 'Float' },
    zip: { __type: 'Float' },
  },
  restaurant_avg_order_by: {
    downvotes: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    score: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
    zip: { __type: 'order_by' },
  },
  restaurant_bool_exp: {
    _and: { __type: '[restaurant_bool_exp!]' },
    _not: { __type: 'restaurant_bool_exp' },
    _or: { __type: '[restaurant_bool_exp!]' },
    address: { __type: 'String_comparison_exp' },
    city: { __type: 'String_comparison_exp' },
    created_at: { __type: 'timestamptz_comparison_exp' },
    description: { __type: 'String_comparison_exp' },
    downvotes: { __type: 'numeric_comparison_exp' },
    external_source_info: { __type: 'jsonb_comparison_exp' },
    geocoder_id: { __type: 'String_comparison_exp' },
    headlines: { __type: 'jsonb_comparison_exp' },
    hours: { __type: 'jsonb_comparison_exp' },
    id: { __type: 'uuid_comparison_exp' },
    image: { __type: 'String_comparison_exp' },
    is_open_now: { __type: 'Boolean_comparison_exp' },
    is_out_of_business: { __type: 'Boolean_comparison_exp' },
    lists: { __type: 'list_restaurant_bool_exp' },
    lists_aggregate: { __type: 'list_restaurant_aggregate_bool_exp' },
    location: { __type: 'geometry_comparison_exp' },
    menu_items: { __type: 'menu_item_bool_exp' },
    menu_items_aggregate: { __type: 'menu_item_aggregate_bool_exp' },
    name: { __type: 'String_comparison_exp' },
    og_source_ids: { __type: 'jsonb_comparison_exp' },
    oldest_review_date: { __type: 'timestamptz_comparison_exp' },
    photo_table: { __type: 'photo_xref_bool_exp' },
    photo_table_aggregate: { __type: 'photo_xref_aggregate_bool_exp' },
    photos: { __type: 'jsonb_comparison_exp' },
    price_range: { __type: 'String_comparison_exp' },
    rating: { __type: 'numeric_comparison_exp' },
    rating_factors: { __type: 'jsonb_comparison_exp' },
    reviews: { __type: 'review_bool_exp' },
    reviews_aggregate: { __type: 'review_aggregate_bool_exp' },
    score: { __type: 'numeric_comparison_exp' },
    score_breakdown: { __type: 'jsonb_comparison_exp' },
    scrape_metadata: { __type: 'jsonb_comparison_exp' },
    slug: { __type: 'String_comparison_exp' },
    source_breakdown: { __type: 'jsonb_comparison_exp' },
    sources: { __type: 'jsonb_comparison_exp' },
    state: { __type: 'String_comparison_exp' },
    summary: { __type: 'String_comparison_exp' },
    tag_names: { __type: 'jsonb_comparison_exp' },
    tags: { __type: 'restaurant_tag_bool_exp' },
    tags_aggregate: { __type: 'restaurant_tag_aggregate_bool_exp' },
    telephone: { __type: 'String_comparison_exp' },
    updated_at: { __type: 'timestamptz_comparison_exp' },
    upvotes: { __type: 'numeric_comparison_exp' },
    votes_ratio: { __type: 'numeric_comparison_exp' },
    website: { __type: 'String_comparison_exp' },
    zip: { __type: 'numeric_comparison_exp' },
  },
  restaurant_delete_at_path_input: {
    external_source_info: { __type: '[String!]' },
    headlines: { __type: '[String!]' },
    hours: { __type: '[String!]' },
    og_source_ids: { __type: '[String!]' },
    photos: { __type: '[String!]' },
    rating_factors: { __type: '[String!]' },
    score_breakdown: { __type: '[String!]' },
    scrape_metadata: { __type: '[String!]' },
    source_breakdown: { __type: '[String!]' },
    sources: { __type: '[String!]' },
    tag_names: { __type: '[String!]' },
  },
  restaurant_delete_elem_input: {
    external_source_info: { __type: 'Int' },
    headlines: { __type: 'Int' },
    hours: { __type: 'Int' },
    og_source_ids: { __type: 'Int' },
    photos: { __type: 'Int' },
    rating_factors: { __type: 'Int' },
    score_breakdown: { __type: 'Int' },
    scrape_metadata: { __type: 'Int' },
    source_breakdown: { __type: 'Int' },
    sources: { __type: 'Int' },
    tag_names: { __type: 'Int' },
  },
  restaurant_delete_key_input: {
    external_source_info: { __type: 'String' },
    headlines: { __type: 'String' },
    hours: { __type: 'String' },
    og_source_ids: { __type: 'String' },
    photos: { __type: 'String' },
    rating_factors: { __type: 'String' },
    score_breakdown: { __type: 'String' },
    scrape_metadata: { __type: 'String' },
    source_breakdown: { __type: 'String' },
    sources: { __type: 'String' },
    tag_names: { __type: 'String' },
  },
  restaurant_inc_input: {
    downvotes: { __type: 'numeric' },
    rating: { __type: 'numeric' },
    score: { __type: 'numeric' },
    upvotes: { __type: 'numeric' },
    votes_ratio: { __type: 'numeric' },
    zip: { __type: 'numeric' },
  },
  restaurant_insert_input: {
    address: { __type: 'String' },
    city: { __type: 'String' },
    created_at: { __type: 'timestamptz' },
    description: { __type: 'String' },
    downvotes: { __type: 'numeric' },
    external_source_info: { __type: 'jsonb' },
    geocoder_id: { __type: 'String' },
    headlines: { __type: 'jsonb' },
    hours: { __type: 'jsonb' },
    id: { __type: 'uuid' },
    image: { __type: 'String' },
    is_out_of_business: { __type: 'Boolean' },
    lists: { __type: 'list_restaurant_arr_rel_insert_input' },
    location: { __type: 'geometry' },
    menu_items: { __type: 'menu_item_arr_rel_insert_input' },
    name: { __type: 'String' },
    og_source_ids: { __type: 'jsonb' },
    oldest_review_date: { __type: 'timestamptz' },
    photo_table: { __type: 'photo_xref_arr_rel_insert_input' },
    photos: { __type: 'jsonb' },
    price_range: { __type: 'String' },
    rating: { __type: 'numeric' },
    rating_factors: { __type: 'jsonb' },
    reviews: { __type: 'review_arr_rel_insert_input' },
    score: { __type: 'numeric' },
    score_breakdown: { __type: 'jsonb' },
    scrape_metadata: { __type: 'jsonb' },
    slug: { __type: 'String' },
    source_breakdown: { __type: 'jsonb' },
    sources: { __type: 'jsonb' },
    state: { __type: 'String' },
    summary: { __type: 'String' },
    tag_names: { __type: 'jsonb' },
    tags: { __type: 'restaurant_tag_arr_rel_insert_input' },
    telephone: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    upvotes: { __type: 'numeric' },
    votes_ratio: { __type: 'numeric' },
    website: { __type: 'String' },
    zip: { __type: 'numeric' },
  },
  restaurant_max_fields: {
    __typename: { __type: 'String!' },
    address: { __type: 'String' },
    city: { __type: 'String' },
    created_at: { __type: 'timestamptz' },
    description: { __type: 'String' },
    downvotes: { __type: 'numeric' },
    geocoder_id: { __type: 'String' },
    id: { __type: 'uuid' },
    image: { __type: 'String' },
    name: { __type: 'String' },
    oldest_review_date: { __type: 'timestamptz' },
    price_range: { __type: 'String' },
    rating: { __type: 'numeric' },
    score: { __type: 'numeric' },
    slug: { __type: 'String' },
    state: { __type: 'String' },
    summary: { __type: 'String' },
    telephone: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    upvotes: { __type: 'numeric' },
    votes_ratio: { __type: 'numeric' },
    website: { __type: 'String' },
    zip: { __type: 'numeric' },
  },
  restaurant_max_order_by: {
    address: { __type: 'order_by' },
    city: { __type: 'order_by' },
    created_at: { __type: 'order_by' },
    description: { __type: 'order_by' },
    downvotes: { __type: 'order_by' },
    geocoder_id: { __type: 'order_by' },
    id: { __type: 'order_by' },
    image: { __type: 'order_by' },
    name: { __type: 'order_by' },
    oldest_review_date: { __type: 'order_by' },
    price_range: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    score: { __type: 'order_by' },
    slug: { __type: 'order_by' },
    state: { __type: 'order_by' },
    summary: { __type: 'order_by' },
    telephone: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
    website: { __type: 'order_by' },
    zip: { __type: 'order_by' },
  },
  restaurant_min_fields: {
    __typename: { __type: 'String!' },
    address: { __type: 'String' },
    city: { __type: 'String' },
    created_at: { __type: 'timestamptz' },
    description: { __type: 'String' },
    downvotes: { __type: 'numeric' },
    geocoder_id: { __type: 'String' },
    id: { __type: 'uuid' },
    image: { __type: 'String' },
    name: { __type: 'String' },
    oldest_review_date: { __type: 'timestamptz' },
    price_range: { __type: 'String' },
    rating: { __type: 'numeric' },
    score: { __type: 'numeric' },
    slug: { __type: 'String' },
    state: { __type: 'String' },
    summary: { __type: 'String' },
    telephone: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    upvotes: { __type: 'numeric' },
    votes_ratio: { __type: 'numeric' },
    website: { __type: 'String' },
    zip: { __type: 'numeric' },
  },
  restaurant_min_order_by: {
    address: { __type: 'order_by' },
    city: { __type: 'order_by' },
    created_at: { __type: 'order_by' },
    description: { __type: 'order_by' },
    downvotes: { __type: 'order_by' },
    geocoder_id: { __type: 'order_by' },
    id: { __type: 'order_by' },
    image: { __type: 'order_by' },
    name: { __type: 'order_by' },
    oldest_review_date: { __type: 'order_by' },
    price_range: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    score: { __type: 'order_by' },
    slug: { __type: 'order_by' },
    state: { __type: 'order_by' },
    summary: { __type: 'order_by' },
    telephone: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
    website: { __type: 'order_by' },
    zip: { __type: 'order_by' },
  },
  restaurant_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[restaurant!]!' },
  },
  restaurant_new_args: { region_slug: { __type: 'String' } },
  restaurant_obj_rel_insert_input: {
    data: { __type: 'restaurant_insert_input!' },
    on_conflict: { __type: 'restaurant_on_conflict' },
  },
  restaurant_on_conflict: {
    constraint: { __type: 'restaurant_constraint!' },
    update_columns: { __type: '[restaurant_update_column!]!' },
    where: { __type: 'restaurant_bool_exp' },
  },
  restaurant_order_by: {
    address: { __type: 'order_by' },
    city: { __type: 'order_by' },
    created_at: { __type: 'order_by' },
    description: { __type: 'order_by' },
    downvotes: { __type: 'order_by' },
    external_source_info: { __type: 'order_by' },
    geocoder_id: { __type: 'order_by' },
    headlines: { __type: 'order_by' },
    hours: { __type: 'order_by' },
    id: { __type: 'order_by' },
    image: { __type: 'order_by' },
    is_open_now: { __type: 'order_by' },
    is_out_of_business: { __type: 'order_by' },
    lists_aggregate: { __type: 'list_restaurant_aggregate_order_by' },
    location: { __type: 'order_by' },
    menu_items_aggregate: { __type: 'menu_item_aggregate_order_by' },
    name: { __type: 'order_by' },
    og_source_ids: { __type: 'order_by' },
    oldest_review_date: { __type: 'order_by' },
    photo_table_aggregate: { __type: 'photo_xref_aggregate_order_by' },
    photos: { __type: 'order_by' },
    price_range: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    rating_factors: { __type: 'order_by' },
    reviews_aggregate: { __type: 'review_aggregate_order_by' },
    score: { __type: 'order_by' },
    score_breakdown: { __type: 'order_by' },
    scrape_metadata: { __type: 'order_by' },
    slug: { __type: 'order_by' },
    source_breakdown: { __type: 'order_by' },
    sources: { __type: 'order_by' },
    state: { __type: 'order_by' },
    summary: { __type: 'order_by' },
    tag_names: { __type: 'order_by' },
    tags_aggregate: { __type: 'restaurant_tag_aggregate_order_by' },
    telephone: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
    website: { __type: 'order_by' },
    zip: { __type: 'order_by' },
  },
  restaurant_pk_columns_input: { id: { __type: 'uuid!' } },
  restaurant_prepend_input: {
    external_source_info: { __type: 'jsonb' },
    headlines: { __type: 'jsonb' },
    hours: { __type: 'jsonb' },
    og_source_ids: { __type: 'jsonb' },
    photos: { __type: 'jsonb' },
    rating_factors: { __type: 'jsonb' },
    score_breakdown: { __type: 'jsonb' },
    scrape_metadata: { __type: 'jsonb' },
    source_breakdown: { __type: 'jsonb' },
    sources: { __type: 'jsonb' },
    tag_names: { __type: 'jsonb' },
  },
  restaurant_set_input: {
    address: { __type: 'String' },
    city: { __type: 'String' },
    created_at: { __type: 'timestamptz' },
    description: { __type: 'String' },
    downvotes: { __type: 'numeric' },
    external_source_info: { __type: 'jsonb' },
    geocoder_id: { __type: 'String' },
    headlines: { __type: 'jsonb' },
    hours: { __type: 'jsonb' },
    id: { __type: 'uuid' },
    image: { __type: 'String' },
    is_out_of_business: { __type: 'Boolean' },
    location: { __type: 'geometry' },
    name: { __type: 'String' },
    og_source_ids: { __type: 'jsonb' },
    oldest_review_date: { __type: 'timestamptz' },
    photos: { __type: 'jsonb' },
    price_range: { __type: 'String' },
    rating: { __type: 'numeric' },
    rating_factors: { __type: 'jsonb' },
    score: { __type: 'numeric' },
    score_breakdown: { __type: 'jsonb' },
    scrape_metadata: { __type: 'jsonb' },
    slug: { __type: 'String' },
    source_breakdown: { __type: 'jsonb' },
    sources: { __type: 'jsonb' },
    state: { __type: 'String' },
    summary: { __type: 'String' },
    tag_names: { __type: 'jsonb' },
    telephone: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    upvotes: { __type: 'numeric' },
    votes_ratio: { __type: 'numeric' },
    website: { __type: 'String' },
    zip: { __type: 'numeric' },
  },
  restaurant_stddev_fields: {
    __typename: { __type: 'String!' },
    downvotes: { __type: 'Float' },
    rating: { __type: 'Float' },
    score: { __type: 'Float' },
    upvotes: { __type: 'Float' },
    votes_ratio: { __type: 'Float' },
    zip: { __type: 'Float' },
  },
  restaurant_stddev_order_by: {
    downvotes: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    score: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
    zip: { __type: 'order_by' },
  },
  restaurant_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    downvotes: { __type: 'Float' },
    rating: { __type: 'Float' },
    score: { __type: 'Float' },
    upvotes: { __type: 'Float' },
    votes_ratio: { __type: 'Float' },
    zip: { __type: 'Float' },
  },
  restaurant_stddev_pop_order_by: {
    downvotes: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    score: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
    zip: { __type: 'order_by' },
  },
  restaurant_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    downvotes: { __type: 'Float' },
    rating: { __type: 'Float' },
    score: { __type: 'Float' },
    upvotes: { __type: 'Float' },
    votes_ratio: { __type: 'Float' },
    zip: { __type: 'Float' },
  },
  restaurant_stddev_samp_order_by: {
    downvotes: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    score: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
    zip: { __type: 'order_by' },
  },
  restaurant_stream_cursor_input: {
    initial_value: { __type: 'restaurant_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  restaurant_stream_cursor_value_input: {
    address: { __type: 'String' },
    city: { __type: 'String' },
    created_at: { __type: 'timestamptz' },
    description: { __type: 'String' },
    downvotes: { __type: 'numeric' },
    external_source_info: { __type: 'jsonb' },
    geocoder_id: { __type: 'String' },
    headlines: { __type: 'jsonb' },
    hours: { __type: 'jsonb' },
    id: { __type: 'uuid' },
    image: { __type: 'String' },
    is_out_of_business: { __type: 'Boolean' },
    location: { __type: 'geometry' },
    name: { __type: 'String' },
    og_source_ids: { __type: 'jsonb' },
    oldest_review_date: { __type: 'timestamptz' },
    photos: { __type: 'jsonb' },
    price_range: { __type: 'String' },
    rating: { __type: 'numeric' },
    rating_factors: { __type: 'jsonb' },
    score: { __type: 'numeric' },
    score_breakdown: { __type: 'jsonb' },
    scrape_metadata: { __type: 'jsonb' },
    slug: { __type: 'String' },
    source_breakdown: { __type: 'jsonb' },
    sources: { __type: 'jsonb' },
    state: { __type: 'String' },
    summary: { __type: 'String' },
    tag_names: { __type: 'jsonb' },
    telephone: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    upvotes: { __type: 'numeric' },
    votes_ratio: { __type: 'numeric' },
    website: { __type: 'String' },
    zip: { __type: 'numeric' },
  },
  restaurant_sum_fields: {
    __typename: { __type: 'String!' },
    downvotes: { __type: 'numeric' },
    rating: { __type: 'numeric' },
    score: { __type: 'numeric' },
    upvotes: { __type: 'numeric' },
    votes_ratio: { __type: 'numeric' },
    zip: { __type: 'numeric' },
  },
  restaurant_sum_order_by: {
    downvotes: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    score: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
    zip: { __type: 'order_by' },
  },
  restaurant_tag: {
    __typename: { __type: 'String!' },
    downvotes: { __type: 'numeric' },
    id: { __type: 'uuid!' },
    photos: { __type: 'jsonb' },
    rank: { __type: 'Int' },
    rating: { __type: 'numeric' },
    restaurant: { __type: 'restaurant!' },
    restaurant_id: { __type: 'uuid!' },
    review_mentions_count: { __type: 'numeric' },
    reviews: {
      __type: '[review!]!',
      __args: {
        distinct_on: '[review_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_order_by!]',
        where: 'review_bool_exp',
      },
    },
    reviews_aggregate: {
      __type: 'review_aggregate!',
      __args: {
        distinct_on: '[review_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_order_by!]',
        where: 'review_bool_exp',
      },
    },
    score: { __type: 'numeric' },
    score_breakdown: { __type: 'jsonb' },
    sentences: {
      __type: '[review_tag_sentence!]!',
      __args: {
        distinct_on: '[review_tag_sentence_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_tag_sentence_order_by!]',
        where: 'review_tag_sentence_bool_exp',
      },
    },
    sentences_aggregate: {
      __type: 'review_tag_sentence_aggregate!',
      __args: {
        distinct_on: '[review_tag_sentence_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_tag_sentence_order_by!]',
        where: 'review_tag_sentence_bool_exp',
      },
    },
    source_breakdown: { __type: 'jsonb' },
    tag: { __type: 'tag!' },
    tag_id: { __type: 'uuid!' },
    upvotes: { __type: 'numeric' },
    votes_ratio: { __type: 'numeric' },
  },
  restaurant_tag_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'restaurant_tag_aggregate_fields' },
    nodes: { __type: '[restaurant_tag!]!' },
  },
  restaurant_tag_aggregate_bool_exp: {
    count: { __type: 'restaurant_tag_aggregate_bool_exp_count' },
  },
  restaurant_tag_aggregate_bool_exp_count: {
    arguments: { __type: '[restaurant_tag_select_column!]' },
    distinct: { __type: 'Boolean' },
    filter: { __type: 'restaurant_tag_bool_exp' },
    predicate: { __type: 'Int_comparison_exp!' },
  },
  restaurant_tag_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'restaurant_tag_avg_fields' },
    count: {
      __type: 'Int!',
      __args: { columns: '[restaurant_tag_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'restaurant_tag_max_fields' },
    min: { __type: 'restaurant_tag_min_fields' },
    stddev: { __type: 'restaurant_tag_stddev_fields' },
    stddev_pop: { __type: 'restaurant_tag_stddev_pop_fields' },
    stddev_samp: { __type: 'restaurant_tag_stddev_samp_fields' },
    sum: { __type: 'restaurant_tag_sum_fields' },
    var_pop: { __type: 'restaurant_tag_var_pop_fields' },
    var_samp: { __type: 'restaurant_tag_var_samp_fields' },
    variance: { __type: 'restaurant_tag_variance_fields' },
  },
  restaurant_tag_aggregate_order_by: {
    avg: { __type: 'restaurant_tag_avg_order_by' },
    count: { __type: 'order_by' },
    max: { __type: 'restaurant_tag_max_order_by' },
    min: { __type: 'restaurant_tag_min_order_by' },
    stddev: { __type: 'restaurant_tag_stddev_order_by' },
    stddev_pop: { __type: 'restaurant_tag_stddev_pop_order_by' },
    stddev_samp: { __type: 'restaurant_tag_stddev_samp_order_by' },
    sum: { __type: 'restaurant_tag_sum_order_by' },
    var_pop: { __type: 'restaurant_tag_var_pop_order_by' },
    var_samp: { __type: 'restaurant_tag_var_samp_order_by' },
    variance: { __type: 'restaurant_tag_variance_order_by' },
  },
  restaurant_tag_append_input: {
    photos: { __type: 'jsonb' },
    score_breakdown: { __type: 'jsonb' },
    source_breakdown: { __type: 'jsonb' },
  },
  restaurant_tag_arr_rel_insert_input: {
    data: { __type: '[restaurant_tag_insert_input!]!' },
    on_conflict: { __type: 'restaurant_tag_on_conflict' },
  },
  restaurant_tag_avg_fields: {
    __typename: { __type: 'String!' },
    downvotes: { __type: 'Float' },
    rank: { __type: 'Float' },
    rating: { __type: 'Float' },
    review_mentions_count: { __type: 'Float' },
    score: { __type: 'Float' },
    upvotes: { __type: 'Float' },
    votes_ratio: { __type: 'Float' },
  },
  restaurant_tag_avg_order_by: {
    downvotes: { __type: 'order_by' },
    rank: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    review_mentions_count: { __type: 'order_by' },
    score: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
  },
  restaurant_tag_bool_exp: {
    _and: { __type: '[restaurant_tag_bool_exp!]' },
    _not: { __type: 'restaurant_tag_bool_exp' },
    _or: { __type: '[restaurant_tag_bool_exp!]' },
    downvotes: { __type: 'numeric_comparison_exp' },
    id: { __type: 'uuid_comparison_exp' },
    photos: { __type: 'jsonb_comparison_exp' },
    rank: { __type: 'Int_comparison_exp' },
    rating: { __type: 'numeric_comparison_exp' },
    restaurant: { __type: 'restaurant_bool_exp' },
    restaurant_id: { __type: 'uuid_comparison_exp' },
    review_mentions_count: { __type: 'numeric_comparison_exp' },
    reviews: { __type: 'review_bool_exp' },
    reviews_aggregate: { __type: 'review_aggregate_bool_exp' },
    score: { __type: 'numeric_comparison_exp' },
    score_breakdown: { __type: 'jsonb_comparison_exp' },
    sentences: { __type: 'review_tag_sentence_bool_exp' },
    sentences_aggregate: { __type: 'review_tag_sentence_aggregate_bool_exp' },
    source_breakdown: { __type: 'jsonb_comparison_exp' },
    tag: { __type: 'tag_bool_exp' },
    tag_id: { __type: 'uuid_comparison_exp' },
    upvotes: { __type: 'numeric_comparison_exp' },
    votes_ratio: { __type: 'numeric_comparison_exp' },
  },
  restaurant_tag_delete_at_path_input: {
    photos: { __type: '[String!]' },
    score_breakdown: { __type: '[String!]' },
    source_breakdown: { __type: '[String!]' },
  },
  restaurant_tag_delete_elem_input: {
    photos: { __type: 'Int' },
    score_breakdown: { __type: 'Int' },
    source_breakdown: { __type: 'Int' },
  },
  restaurant_tag_delete_key_input: {
    photos: { __type: 'String' },
    score_breakdown: { __type: 'String' },
    source_breakdown: { __type: 'String' },
  },
  restaurant_tag_inc_input: {
    downvotes: { __type: 'numeric' },
    rank: { __type: 'Int' },
    rating: { __type: 'numeric' },
    review_mentions_count: { __type: 'numeric' },
    score: { __type: 'numeric' },
    upvotes: { __type: 'numeric' },
    votes_ratio: { __type: 'numeric' },
  },
  restaurant_tag_insert_input: {
    downvotes: { __type: 'numeric' },
    id: { __type: 'uuid' },
    photos: { __type: 'jsonb' },
    rank: { __type: 'Int' },
    rating: { __type: 'numeric' },
    restaurant: { __type: 'restaurant_obj_rel_insert_input' },
    restaurant_id: { __type: 'uuid' },
    review_mentions_count: { __type: 'numeric' },
    reviews: { __type: 'review_arr_rel_insert_input' },
    score: { __type: 'numeric' },
    score_breakdown: { __type: 'jsonb' },
    sentences: { __type: 'review_tag_sentence_arr_rel_insert_input' },
    source_breakdown: { __type: 'jsonb' },
    tag: { __type: 'tag_obj_rel_insert_input' },
    tag_id: { __type: 'uuid' },
    upvotes: { __type: 'numeric' },
    votes_ratio: { __type: 'numeric' },
  },
  restaurant_tag_max_fields: {
    __typename: { __type: 'String!' },
    downvotes: { __type: 'numeric' },
    id: { __type: 'uuid' },
    rank: { __type: 'Int' },
    rating: { __type: 'numeric' },
    restaurant_id: { __type: 'uuid' },
    review_mentions_count: { __type: 'numeric' },
    score: { __type: 'numeric' },
    tag_id: { __type: 'uuid' },
    upvotes: { __type: 'numeric' },
    votes_ratio: { __type: 'numeric' },
  },
  restaurant_tag_max_order_by: {
    downvotes: { __type: 'order_by' },
    id: { __type: 'order_by' },
    rank: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    restaurant_id: { __type: 'order_by' },
    review_mentions_count: { __type: 'order_by' },
    score: { __type: 'order_by' },
    tag_id: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
  },
  restaurant_tag_min_fields: {
    __typename: { __type: 'String!' },
    downvotes: { __type: 'numeric' },
    id: { __type: 'uuid' },
    rank: { __type: 'Int' },
    rating: { __type: 'numeric' },
    restaurant_id: { __type: 'uuid' },
    review_mentions_count: { __type: 'numeric' },
    score: { __type: 'numeric' },
    tag_id: { __type: 'uuid' },
    upvotes: { __type: 'numeric' },
    votes_ratio: { __type: 'numeric' },
  },
  restaurant_tag_min_order_by: {
    downvotes: { __type: 'order_by' },
    id: { __type: 'order_by' },
    rank: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    restaurant_id: { __type: 'order_by' },
    review_mentions_count: { __type: 'order_by' },
    score: { __type: 'order_by' },
    tag_id: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
  },
  restaurant_tag_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[restaurant_tag!]!' },
  },
  restaurant_tag_obj_rel_insert_input: {
    data: { __type: 'restaurant_tag_insert_input!' },
    on_conflict: { __type: 'restaurant_tag_on_conflict' },
  },
  restaurant_tag_on_conflict: {
    constraint: { __type: 'restaurant_tag_constraint!' },
    update_columns: { __type: '[restaurant_tag_update_column!]!' },
    where: { __type: 'restaurant_tag_bool_exp' },
  },
  restaurant_tag_order_by: {
    downvotes: { __type: 'order_by' },
    id: { __type: 'order_by' },
    photos: { __type: 'order_by' },
    rank: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    restaurant: { __type: 'restaurant_order_by' },
    restaurant_id: { __type: 'order_by' },
    review_mentions_count: { __type: 'order_by' },
    reviews_aggregate: { __type: 'review_aggregate_order_by' },
    score: { __type: 'order_by' },
    score_breakdown: { __type: 'order_by' },
    sentences_aggregate: { __type: 'review_tag_sentence_aggregate_order_by' },
    source_breakdown: { __type: 'order_by' },
    tag: { __type: 'tag_order_by' },
    tag_id: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
  },
  restaurant_tag_pk_columns_input: {
    restaurant_id: { __type: 'uuid!' },
    tag_id: { __type: 'uuid!' },
  },
  restaurant_tag_prepend_input: {
    photos: { __type: 'jsonb' },
    score_breakdown: { __type: 'jsonb' },
    source_breakdown: { __type: 'jsonb' },
  },
  restaurant_tag_set_input: {
    downvotes: { __type: 'numeric' },
    id: { __type: 'uuid' },
    photos: { __type: 'jsonb' },
    rank: { __type: 'Int' },
    rating: { __type: 'numeric' },
    restaurant_id: { __type: 'uuid' },
    review_mentions_count: { __type: 'numeric' },
    score: { __type: 'numeric' },
    score_breakdown: { __type: 'jsonb' },
    source_breakdown: { __type: 'jsonb' },
    tag_id: { __type: 'uuid' },
    upvotes: { __type: 'numeric' },
    votes_ratio: { __type: 'numeric' },
  },
  restaurant_tag_stddev_fields: {
    __typename: { __type: 'String!' },
    downvotes: { __type: 'Float' },
    rank: { __type: 'Float' },
    rating: { __type: 'Float' },
    review_mentions_count: { __type: 'Float' },
    score: { __type: 'Float' },
    upvotes: { __type: 'Float' },
    votes_ratio: { __type: 'Float' },
  },
  restaurant_tag_stddev_order_by: {
    downvotes: { __type: 'order_by' },
    rank: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    review_mentions_count: { __type: 'order_by' },
    score: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
  },
  restaurant_tag_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    downvotes: { __type: 'Float' },
    rank: { __type: 'Float' },
    rating: { __type: 'Float' },
    review_mentions_count: { __type: 'Float' },
    score: { __type: 'Float' },
    upvotes: { __type: 'Float' },
    votes_ratio: { __type: 'Float' },
  },
  restaurant_tag_stddev_pop_order_by: {
    downvotes: { __type: 'order_by' },
    rank: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    review_mentions_count: { __type: 'order_by' },
    score: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
  },
  restaurant_tag_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    downvotes: { __type: 'Float' },
    rank: { __type: 'Float' },
    rating: { __type: 'Float' },
    review_mentions_count: { __type: 'Float' },
    score: { __type: 'Float' },
    upvotes: { __type: 'Float' },
    votes_ratio: { __type: 'Float' },
  },
  restaurant_tag_stddev_samp_order_by: {
    downvotes: { __type: 'order_by' },
    rank: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    review_mentions_count: { __type: 'order_by' },
    score: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
  },
  restaurant_tag_stream_cursor_input: {
    initial_value: { __type: 'restaurant_tag_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  restaurant_tag_stream_cursor_value_input: {
    downvotes: { __type: 'numeric' },
    id: { __type: 'uuid' },
    photos: { __type: 'jsonb' },
    rank: { __type: 'Int' },
    rating: { __type: 'numeric' },
    restaurant_id: { __type: 'uuid' },
    review_mentions_count: { __type: 'numeric' },
    score: { __type: 'numeric' },
    score_breakdown: { __type: 'jsonb' },
    source_breakdown: { __type: 'jsonb' },
    tag_id: { __type: 'uuid' },
    upvotes: { __type: 'numeric' },
    votes_ratio: { __type: 'numeric' },
  },
  restaurant_tag_sum_fields: {
    __typename: { __type: 'String!' },
    downvotes: { __type: 'numeric' },
    rank: { __type: 'Int' },
    rating: { __type: 'numeric' },
    review_mentions_count: { __type: 'numeric' },
    score: { __type: 'numeric' },
    upvotes: { __type: 'numeric' },
    votes_ratio: { __type: 'numeric' },
  },
  restaurant_tag_sum_order_by: {
    downvotes: { __type: 'order_by' },
    rank: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    review_mentions_count: { __type: 'order_by' },
    score: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
  },
  restaurant_tag_updates: {
    _append: { __type: 'restaurant_tag_append_input' },
    _delete_at_path: { __type: 'restaurant_tag_delete_at_path_input' },
    _delete_elem: { __type: 'restaurant_tag_delete_elem_input' },
    _delete_key: { __type: 'restaurant_tag_delete_key_input' },
    _inc: { __type: 'restaurant_tag_inc_input' },
    _prepend: { __type: 'restaurant_tag_prepend_input' },
    _set: { __type: 'restaurant_tag_set_input' },
    where: { __type: 'restaurant_tag_bool_exp!' },
  },
  restaurant_tag_var_pop_fields: {
    __typename: { __type: 'String!' },
    downvotes: { __type: 'Float' },
    rank: { __type: 'Float' },
    rating: { __type: 'Float' },
    review_mentions_count: { __type: 'Float' },
    score: { __type: 'Float' },
    upvotes: { __type: 'Float' },
    votes_ratio: { __type: 'Float' },
  },
  restaurant_tag_var_pop_order_by: {
    downvotes: { __type: 'order_by' },
    rank: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    review_mentions_count: { __type: 'order_by' },
    score: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
  },
  restaurant_tag_var_samp_fields: {
    __typename: { __type: 'String!' },
    downvotes: { __type: 'Float' },
    rank: { __type: 'Float' },
    rating: { __type: 'Float' },
    review_mentions_count: { __type: 'Float' },
    score: { __type: 'Float' },
    upvotes: { __type: 'Float' },
    votes_ratio: { __type: 'Float' },
  },
  restaurant_tag_var_samp_order_by: {
    downvotes: { __type: 'order_by' },
    rank: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    review_mentions_count: { __type: 'order_by' },
    score: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
  },
  restaurant_tag_variance_fields: {
    __typename: { __type: 'String!' },
    downvotes: { __type: 'Float' },
    rank: { __type: 'Float' },
    rating: { __type: 'Float' },
    review_mentions_count: { __type: 'Float' },
    score: { __type: 'Float' },
    upvotes: { __type: 'Float' },
    votes_ratio: { __type: 'Float' },
  },
  restaurant_tag_variance_order_by: {
    downvotes: { __type: 'order_by' },
    rank: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    review_mentions_count: { __type: 'order_by' },
    score: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
  },
  restaurant_top_tags_args: {
    _restaurant: { __type: 'restaurant_scalar' },
    _tag_types: { __type: 'String' },
    tag_slugs: { __type: 'String' },
  },
  restaurant_trending_args: { region_slug: { __type: 'String' } },
  restaurant_updates: {
    _append: { __type: 'restaurant_append_input' },
    _delete_at_path: { __type: 'restaurant_delete_at_path_input' },
    _delete_elem: { __type: 'restaurant_delete_elem_input' },
    _delete_key: { __type: 'restaurant_delete_key_input' },
    _inc: { __type: 'restaurant_inc_input' },
    _prepend: { __type: 'restaurant_prepend_input' },
    _set: { __type: 'restaurant_set_input' },
    where: { __type: 'restaurant_bool_exp!' },
  },
  restaurant_var_pop_fields: {
    __typename: { __type: 'String!' },
    downvotes: { __type: 'Float' },
    rating: { __type: 'Float' },
    score: { __type: 'Float' },
    upvotes: { __type: 'Float' },
    votes_ratio: { __type: 'Float' },
    zip: { __type: 'Float' },
  },
  restaurant_var_pop_order_by: {
    downvotes: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    score: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
    zip: { __type: 'order_by' },
  },
  restaurant_var_samp_fields: {
    __typename: { __type: 'String!' },
    downvotes: { __type: 'Float' },
    rating: { __type: 'Float' },
    score: { __type: 'Float' },
    upvotes: { __type: 'Float' },
    votes_ratio: { __type: 'Float' },
    zip: { __type: 'Float' },
  },
  restaurant_var_samp_order_by: {
    downvotes: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    score: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
    zip: { __type: 'order_by' },
  },
  restaurant_variance_fields: {
    __typename: { __type: 'String!' },
    downvotes: { __type: 'Float' },
    rating: { __type: 'Float' },
    score: { __type: 'Float' },
    upvotes: { __type: 'Float' },
    votes_ratio: { __type: 'Float' },
    zip: { __type: 'Float' },
  },
  restaurant_variance_order_by: {
    downvotes: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    score: { __type: 'order_by' },
    upvotes: { __type: 'order_by' },
    votes_ratio: { __type: 'order_by' },
    zip: { __type: 'order_by' },
  },
  restaurant_with_tags_args: { tag_slugs: { __type: 'String' } },
  review: {
    __typename: { __type: 'String!' },
    authored_at: { __type: 'timestamptz!' },
    categories: { __type: 'jsonb' },
    favorited: { __type: 'Boolean' },
    id: { __type: 'uuid!' },
    list: { __type: 'list' },
    list_id: { __type: 'uuid' },
    location: { __type: 'geometry' },
    native_data_unique_key: { __type: 'String' },
    photos: {
      __type: '[photo_xref!]!',
      __args: {
        distinct_on: '[photo_xref_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[photo_xref_order_by!]',
        where: 'photo_xref_bool_exp',
      },
    },
    photos_aggregate: {
      __type: 'photo_xref_aggregate!',
      __args: {
        distinct_on: '[photo_xref_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[photo_xref_order_by!]',
        where: 'photo_xref_bool_exp',
      },
    },
    rating: { __type: 'numeric' },
    restaurant: { __type: 'restaurant' },
    restaurant_id: { __type: 'uuid' },
    reviews: {
      __type: '[review!]!',
      __args: {
        distinct_on: '[review_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_order_by!]',
        where: 'review_bool_exp',
      },
    },
    reviews_aggregate: {
      __type: 'review_aggregate!',
      __args: {
        distinct_on: '[review_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_order_by!]',
        where: 'review_bool_exp',
      },
    },
    sentiments: {
      __type: '[review_tag_sentence!]!',
      __args: {
        distinct_on: '[review_tag_sentence_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_tag_sentence_order_by!]',
        where: 'review_tag_sentence_bool_exp',
      },
    },
    sentiments_aggregate: {
      __type: 'review_tag_sentence_aggregate!',
      __args: {
        distinct_on: '[review_tag_sentence_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_tag_sentence_order_by!]',
        where: 'review_tag_sentence_bool_exp',
      },
    },
    source: { __type: 'String' },
    tag: { __type: 'tag' },
    tag_id: { __type: 'uuid' },
    text: { __type: 'String' },
    type: { __type: 'String' },
    updated_at: { __type: 'timestamptz!' },
    user: { __type: 'user!' },
    user_id: { __type: 'uuid!' },
    username: { __type: 'String' },
    vote: { __type: 'numeric' },
  },
  review_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'review_aggregate_fields' },
    nodes: { __type: '[review!]!' },
  },
  review_aggregate_bool_exp: {
    bool_and: { __type: 'review_aggregate_bool_exp_bool_and' },
    bool_or: { __type: 'review_aggregate_bool_exp_bool_or' },
    count: { __type: 'review_aggregate_bool_exp_count' },
  },
  review_aggregate_bool_exp_bool_and: {
    arguments: {
      __type: 'review_select_column_review_aggregate_bool_exp_bool_and_arguments_columns!',
    },
    distinct: { __type: 'Boolean' },
    filter: { __type: 'review_bool_exp' },
    predicate: { __type: 'Boolean_comparison_exp!' },
  },
  review_aggregate_bool_exp_bool_or: {
    arguments: {
      __type: 'review_select_column_review_aggregate_bool_exp_bool_or_arguments_columns!',
    },
    distinct: { __type: 'Boolean' },
    filter: { __type: 'review_bool_exp' },
    predicate: { __type: 'Boolean_comparison_exp!' },
  },
  review_aggregate_bool_exp_count: {
    arguments: { __type: '[review_select_column!]' },
    distinct: { __type: 'Boolean' },
    filter: { __type: 'review_bool_exp' },
    predicate: { __type: 'Int_comparison_exp!' },
  },
  review_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'review_avg_fields' },
    count: {
      __type: 'Int!',
      __args: { columns: '[review_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'review_max_fields' },
    min: { __type: 'review_min_fields' },
    stddev: { __type: 'review_stddev_fields' },
    stddev_pop: { __type: 'review_stddev_pop_fields' },
    stddev_samp: { __type: 'review_stddev_samp_fields' },
    sum: { __type: 'review_sum_fields' },
    var_pop: { __type: 'review_var_pop_fields' },
    var_samp: { __type: 'review_var_samp_fields' },
    variance: { __type: 'review_variance_fields' },
  },
  review_aggregate_order_by: {
    avg: { __type: 'review_avg_order_by' },
    count: { __type: 'order_by' },
    max: { __type: 'review_max_order_by' },
    min: { __type: 'review_min_order_by' },
    stddev: { __type: 'review_stddev_order_by' },
    stddev_pop: { __type: 'review_stddev_pop_order_by' },
    stddev_samp: { __type: 'review_stddev_samp_order_by' },
    sum: { __type: 'review_sum_order_by' },
    var_pop: { __type: 'review_var_pop_order_by' },
    var_samp: { __type: 'review_var_samp_order_by' },
    variance: { __type: 'review_variance_order_by' },
  },
  review_append_input: { categories: { __type: 'jsonb' } },
  review_arr_rel_insert_input: {
    data: { __type: '[review_insert_input!]!' },
    on_conflict: { __type: 'review_on_conflict' },
  },
  review_avg_fields: {
    __typename: { __type: 'String!' },
    rating: { __type: 'Float' },
    vote: { __type: 'Float' },
  },
  review_avg_order_by: { rating: { __type: 'order_by' }, vote: { __type: 'order_by' } },
  review_bool_exp: {
    _and: { __type: '[review_bool_exp!]' },
    _not: { __type: 'review_bool_exp' },
    _or: { __type: '[review_bool_exp!]' },
    authored_at: { __type: 'timestamptz_comparison_exp' },
    categories: { __type: 'jsonb_comparison_exp' },
    favorited: { __type: 'Boolean_comparison_exp' },
    id: { __type: 'uuid_comparison_exp' },
    list: { __type: 'list_bool_exp' },
    list_id: { __type: 'uuid_comparison_exp' },
    location: { __type: 'geometry_comparison_exp' },
    native_data_unique_key: { __type: 'String_comparison_exp' },
    photos: { __type: 'photo_xref_bool_exp' },
    photos_aggregate: { __type: 'photo_xref_aggregate_bool_exp' },
    rating: { __type: 'numeric_comparison_exp' },
    restaurant: { __type: 'restaurant_bool_exp' },
    restaurant_id: { __type: 'uuid_comparison_exp' },
    reviews: { __type: 'review_bool_exp' },
    reviews_aggregate: { __type: 'review_aggregate_bool_exp' },
    sentiments: { __type: 'review_tag_sentence_bool_exp' },
    sentiments_aggregate: { __type: 'review_tag_sentence_aggregate_bool_exp' },
    source: { __type: 'String_comparison_exp' },
    tag: { __type: 'tag_bool_exp' },
    tag_id: { __type: 'uuid_comparison_exp' },
    text: { __type: 'String_comparison_exp' },
    type: { __type: 'String_comparison_exp' },
    updated_at: { __type: 'timestamptz_comparison_exp' },
    user: { __type: 'user_bool_exp' },
    user_id: { __type: 'uuid_comparison_exp' },
    username: { __type: 'String_comparison_exp' },
    vote: { __type: 'numeric_comparison_exp' },
  },
  review_delete_at_path_input: { categories: { __type: '[String!]' } },
  review_delete_elem_input: { categories: { __type: 'Int' } },
  review_delete_key_input: { categories: { __type: 'String' } },
  review_inc_input: { rating: { __type: 'numeric' }, vote: { __type: 'numeric' } },
  review_insert_input: {
    authored_at: { __type: 'timestamptz' },
    categories: { __type: 'jsonb' },
    favorited: { __type: 'Boolean' },
    id: { __type: 'uuid' },
    list: { __type: 'list_obj_rel_insert_input' },
    list_id: { __type: 'uuid' },
    location: { __type: 'geometry' },
    native_data_unique_key: { __type: 'String' },
    photos: { __type: 'photo_xref_arr_rel_insert_input' },
    rating: { __type: 'numeric' },
    restaurant: { __type: 'restaurant_obj_rel_insert_input' },
    restaurant_id: { __type: 'uuid' },
    reviews: { __type: 'review_arr_rel_insert_input' },
    sentiments: { __type: 'review_tag_sentence_arr_rel_insert_input' },
    source: { __type: 'String' },
    tag: { __type: 'tag_obj_rel_insert_input' },
    tag_id: { __type: 'uuid' },
    text: { __type: 'String' },
    type: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    user: { __type: 'user_obj_rel_insert_input' },
    user_id: { __type: 'uuid' },
    username: { __type: 'String' },
    vote: { __type: 'numeric' },
  },
  review_max_fields: {
    __typename: { __type: 'String!' },
    authored_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    native_data_unique_key: { __type: 'String' },
    rating: { __type: 'numeric' },
    restaurant_id: { __type: 'uuid' },
    source: { __type: 'String' },
    tag_id: { __type: 'uuid' },
    text: { __type: 'String' },
    type: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    user_id: { __type: 'uuid' },
    username: { __type: 'String' },
    vote: { __type: 'numeric' },
  },
  review_max_order_by: {
    authored_at: { __type: 'order_by' },
    id: { __type: 'order_by' },
    list_id: { __type: 'order_by' },
    native_data_unique_key: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    restaurant_id: { __type: 'order_by' },
    source: { __type: 'order_by' },
    tag_id: { __type: 'order_by' },
    text: { __type: 'order_by' },
    type: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    user_id: { __type: 'order_by' },
    username: { __type: 'order_by' },
    vote: { __type: 'order_by' },
  },
  review_min_fields: {
    __typename: { __type: 'String!' },
    authored_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    native_data_unique_key: { __type: 'String' },
    rating: { __type: 'numeric' },
    restaurant_id: { __type: 'uuid' },
    source: { __type: 'String' },
    tag_id: { __type: 'uuid' },
    text: { __type: 'String' },
    type: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    user_id: { __type: 'uuid' },
    username: { __type: 'String' },
    vote: { __type: 'numeric' },
  },
  review_min_order_by: {
    authored_at: { __type: 'order_by' },
    id: { __type: 'order_by' },
    list_id: { __type: 'order_by' },
    native_data_unique_key: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    restaurant_id: { __type: 'order_by' },
    source: { __type: 'order_by' },
    tag_id: { __type: 'order_by' },
    text: { __type: 'order_by' },
    type: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    user_id: { __type: 'order_by' },
    username: { __type: 'order_by' },
    vote: { __type: 'order_by' },
  },
  review_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[review!]!' },
  },
  review_obj_rel_insert_input: {
    data: { __type: 'review_insert_input!' },
    on_conflict: { __type: 'review_on_conflict' },
  },
  review_on_conflict: {
    constraint: { __type: 'review_constraint!' },
    update_columns: { __type: '[review_update_column!]!' },
    where: { __type: 'review_bool_exp' },
  },
  review_order_by: {
    authored_at: { __type: 'order_by' },
    categories: { __type: 'order_by' },
    favorited: { __type: 'order_by' },
    id: { __type: 'order_by' },
    list: { __type: 'list_order_by' },
    list_id: { __type: 'order_by' },
    location: { __type: 'order_by' },
    native_data_unique_key: { __type: 'order_by' },
    photos_aggregate: { __type: 'photo_xref_aggregate_order_by' },
    rating: { __type: 'order_by' },
    restaurant: { __type: 'restaurant_order_by' },
    restaurant_id: { __type: 'order_by' },
    reviews_aggregate: { __type: 'review_aggregate_order_by' },
    sentiments_aggregate: { __type: 'review_tag_sentence_aggregate_order_by' },
    source: { __type: 'order_by' },
    tag: { __type: 'tag_order_by' },
    tag_id: { __type: 'order_by' },
    text: { __type: 'order_by' },
    type: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    user: { __type: 'user_order_by' },
    user_id: { __type: 'order_by' },
    username: { __type: 'order_by' },
    vote: { __type: 'order_by' },
  },
  review_pk_columns_input: { id: { __type: 'uuid!' } },
  review_prepend_input: { categories: { __type: 'jsonb' } },
  review_set_input: {
    authored_at: { __type: 'timestamptz' },
    categories: { __type: 'jsonb' },
    favorited: { __type: 'Boolean' },
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    location: { __type: 'geometry' },
    native_data_unique_key: { __type: 'String' },
    rating: { __type: 'numeric' },
    restaurant_id: { __type: 'uuid' },
    source: { __type: 'String' },
    tag_id: { __type: 'uuid' },
    text: { __type: 'String' },
    type: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    user_id: { __type: 'uuid' },
    username: { __type: 'String' },
    vote: { __type: 'numeric' },
  },
  review_stddev_fields: {
    __typename: { __type: 'String!' },
    rating: { __type: 'Float' },
    vote: { __type: 'Float' },
  },
  review_stddev_order_by: { rating: { __type: 'order_by' }, vote: { __type: 'order_by' } },
  review_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    rating: { __type: 'Float' },
    vote: { __type: 'Float' },
  },
  review_stddev_pop_order_by: { rating: { __type: 'order_by' }, vote: { __type: 'order_by' } },
  review_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    rating: { __type: 'Float' },
    vote: { __type: 'Float' },
  },
  review_stddev_samp_order_by: {
    rating: { __type: 'order_by' },
    vote: { __type: 'order_by' },
  },
  review_stream_cursor_input: {
    initial_value: { __type: 'review_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  review_stream_cursor_value_input: {
    authored_at: { __type: 'timestamptz' },
    categories: { __type: 'jsonb' },
    favorited: { __type: 'Boolean' },
    id: { __type: 'uuid' },
    list_id: { __type: 'uuid' },
    location: { __type: 'geometry' },
    native_data_unique_key: { __type: 'String' },
    rating: { __type: 'numeric' },
    restaurant_id: { __type: 'uuid' },
    source: { __type: 'String' },
    tag_id: { __type: 'uuid' },
    text: { __type: 'String' },
    type: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    user_id: { __type: 'uuid' },
    username: { __type: 'String' },
    vote: { __type: 'numeric' },
  },
  review_sum_fields: {
    __typename: { __type: 'String!' },
    rating: { __type: 'numeric' },
    vote: { __type: 'numeric' },
  },
  review_sum_order_by: { rating: { __type: 'order_by' }, vote: { __type: 'order_by' } },
  review_tag_sentence: {
    __typename: { __type: 'String!' },
    id: { __type: 'uuid!' },
    ml_sentiment: { __type: 'numeric' },
    naive_sentiment: { __type: 'numeric!' },
    restaurant_id: { __type: 'uuid' },
    review: { __type: 'review!' },
    review_id: { __type: 'uuid!' },
    sentence: { __type: 'String!' },
    tag: { __type: 'tag!' },
    tag_id: { __type: 'uuid!' },
  },
  review_tag_sentence_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'review_tag_sentence_aggregate_fields' },
    nodes: { __type: '[review_tag_sentence!]!' },
  },
  review_tag_sentence_aggregate_bool_exp: {
    count: { __type: 'review_tag_sentence_aggregate_bool_exp_count' },
  },
  review_tag_sentence_aggregate_bool_exp_count: {
    arguments: { __type: '[review_tag_sentence_select_column!]' },
    distinct: { __type: 'Boolean' },
    filter: { __type: 'review_tag_sentence_bool_exp' },
    predicate: { __type: 'Int_comparison_exp!' },
  },
  review_tag_sentence_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'review_tag_sentence_avg_fields' },
    count: {
      __type: 'Int!',
      __args: { columns: '[review_tag_sentence_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'review_tag_sentence_max_fields' },
    min: { __type: 'review_tag_sentence_min_fields' },
    stddev: { __type: 'review_tag_sentence_stddev_fields' },
    stddev_pop: { __type: 'review_tag_sentence_stddev_pop_fields' },
    stddev_samp: { __type: 'review_tag_sentence_stddev_samp_fields' },
    sum: { __type: 'review_tag_sentence_sum_fields' },
    var_pop: { __type: 'review_tag_sentence_var_pop_fields' },
    var_samp: { __type: 'review_tag_sentence_var_samp_fields' },
    variance: { __type: 'review_tag_sentence_variance_fields' },
  },
  review_tag_sentence_aggregate_order_by: {
    avg: { __type: 'review_tag_sentence_avg_order_by' },
    count: { __type: 'order_by' },
    max: { __type: 'review_tag_sentence_max_order_by' },
    min: { __type: 'review_tag_sentence_min_order_by' },
    stddev: { __type: 'review_tag_sentence_stddev_order_by' },
    stddev_pop: { __type: 'review_tag_sentence_stddev_pop_order_by' },
    stddev_samp: { __type: 'review_tag_sentence_stddev_samp_order_by' },
    sum: { __type: 'review_tag_sentence_sum_order_by' },
    var_pop: { __type: 'review_tag_sentence_var_pop_order_by' },
    var_samp: { __type: 'review_tag_sentence_var_samp_order_by' },
    variance: { __type: 'review_tag_sentence_variance_order_by' },
  },
  review_tag_sentence_arr_rel_insert_input: {
    data: { __type: '[review_tag_sentence_insert_input!]!' },
    on_conflict: { __type: 'review_tag_sentence_on_conflict' },
  },
  review_tag_sentence_avg_fields: {
    __typename: { __type: 'String!' },
    ml_sentiment: { __type: 'Float' },
    naive_sentiment: { __type: 'Float' },
  },
  review_tag_sentence_avg_order_by: {
    ml_sentiment: { __type: 'order_by' },
    naive_sentiment: { __type: 'order_by' },
  },
  review_tag_sentence_bool_exp: {
    _and: { __type: '[review_tag_sentence_bool_exp!]' },
    _not: { __type: 'review_tag_sentence_bool_exp' },
    _or: { __type: '[review_tag_sentence_bool_exp!]' },
    id: { __type: 'uuid_comparison_exp' },
    ml_sentiment: { __type: 'numeric_comparison_exp' },
    naive_sentiment: { __type: 'numeric_comparison_exp' },
    restaurant_id: { __type: 'uuid_comparison_exp' },
    review: { __type: 'review_bool_exp' },
    review_id: { __type: 'uuid_comparison_exp' },
    sentence: { __type: 'String_comparison_exp' },
    tag: { __type: 'tag_bool_exp' },
    tag_id: { __type: 'uuid_comparison_exp' },
  },
  review_tag_sentence_inc_input: {
    ml_sentiment: { __type: 'numeric' },
    naive_sentiment: { __type: 'numeric' },
  },
  review_tag_sentence_insert_input: {
    id: { __type: 'uuid' },
    ml_sentiment: { __type: 'numeric' },
    naive_sentiment: { __type: 'numeric' },
    restaurant_id: { __type: 'uuid' },
    review: { __type: 'review_obj_rel_insert_input' },
    review_id: { __type: 'uuid' },
    sentence: { __type: 'String' },
    tag: { __type: 'tag_obj_rel_insert_input' },
    tag_id: { __type: 'uuid' },
  },
  review_tag_sentence_max_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'uuid' },
    ml_sentiment: { __type: 'numeric' },
    naive_sentiment: { __type: 'numeric' },
    restaurant_id: { __type: 'uuid' },
    review_id: { __type: 'uuid' },
    sentence: { __type: 'String' },
    tag_id: { __type: 'uuid' },
  },
  review_tag_sentence_max_order_by: {
    id: { __type: 'order_by' },
    ml_sentiment: { __type: 'order_by' },
    naive_sentiment: { __type: 'order_by' },
    restaurant_id: { __type: 'order_by' },
    review_id: { __type: 'order_by' },
    sentence: { __type: 'order_by' },
    tag_id: { __type: 'order_by' },
  },
  review_tag_sentence_min_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'uuid' },
    ml_sentiment: { __type: 'numeric' },
    naive_sentiment: { __type: 'numeric' },
    restaurant_id: { __type: 'uuid' },
    review_id: { __type: 'uuid' },
    sentence: { __type: 'String' },
    tag_id: { __type: 'uuid' },
  },
  review_tag_sentence_min_order_by: {
    id: { __type: 'order_by' },
    ml_sentiment: { __type: 'order_by' },
    naive_sentiment: { __type: 'order_by' },
    restaurant_id: { __type: 'order_by' },
    review_id: { __type: 'order_by' },
    sentence: { __type: 'order_by' },
    tag_id: { __type: 'order_by' },
  },
  review_tag_sentence_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[review_tag_sentence!]!' },
  },
  review_tag_sentence_on_conflict: {
    constraint: { __type: 'review_tag_sentence_constraint!' },
    update_columns: { __type: '[review_tag_sentence_update_column!]!' },
    where: { __type: 'review_tag_sentence_bool_exp' },
  },
  review_tag_sentence_order_by: {
    id: { __type: 'order_by' },
    ml_sentiment: { __type: 'order_by' },
    naive_sentiment: { __type: 'order_by' },
    restaurant_id: { __type: 'order_by' },
    review: { __type: 'review_order_by' },
    review_id: { __type: 'order_by' },
    sentence: { __type: 'order_by' },
    tag: { __type: 'tag_order_by' },
    tag_id: { __type: 'order_by' },
  },
  review_tag_sentence_pk_columns_input: { id: { __type: 'uuid!' } },
  review_tag_sentence_set_input: {
    id: { __type: 'uuid' },
    ml_sentiment: { __type: 'numeric' },
    naive_sentiment: { __type: 'numeric' },
    restaurant_id: { __type: 'uuid' },
    review_id: { __type: 'uuid' },
    sentence: { __type: 'String' },
    tag_id: { __type: 'uuid' },
  },
  review_tag_sentence_stddev_fields: {
    __typename: { __type: 'String!' },
    ml_sentiment: { __type: 'Float' },
    naive_sentiment: { __type: 'Float' },
  },
  review_tag_sentence_stddev_order_by: {
    ml_sentiment: { __type: 'order_by' },
    naive_sentiment: { __type: 'order_by' },
  },
  review_tag_sentence_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    ml_sentiment: { __type: 'Float' },
    naive_sentiment: { __type: 'Float' },
  },
  review_tag_sentence_stddev_pop_order_by: {
    ml_sentiment: { __type: 'order_by' },
    naive_sentiment: { __type: 'order_by' },
  },
  review_tag_sentence_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    ml_sentiment: { __type: 'Float' },
    naive_sentiment: { __type: 'Float' },
  },
  review_tag_sentence_stddev_samp_order_by: {
    ml_sentiment: { __type: 'order_by' },
    naive_sentiment: { __type: 'order_by' },
  },
  review_tag_sentence_stream_cursor_input: {
    initial_value: { __type: 'review_tag_sentence_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  review_tag_sentence_stream_cursor_value_input: {
    id: { __type: 'uuid' },
    ml_sentiment: { __type: 'numeric' },
    naive_sentiment: { __type: 'numeric' },
    restaurant_id: { __type: 'uuid' },
    review_id: { __type: 'uuid' },
    sentence: { __type: 'String' },
    tag_id: { __type: 'uuid' },
  },
  review_tag_sentence_sum_fields: {
    __typename: { __type: 'String!' },
    ml_sentiment: { __type: 'numeric' },
    naive_sentiment: { __type: 'numeric' },
  },
  review_tag_sentence_sum_order_by: {
    ml_sentiment: { __type: 'order_by' },
    naive_sentiment: { __type: 'order_by' },
  },
  review_tag_sentence_updates: {
    _inc: { __type: 'review_tag_sentence_inc_input' },
    _set: { __type: 'review_tag_sentence_set_input' },
    where: { __type: 'review_tag_sentence_bool_exp!' },
  },
  review_tag_sentence_var_pop_fields: {
    __typename: { __type: 'String!' },
    ml_sentiment: { __type: 'Float' },
    naive_sentiment: { __type: 'Float' },
  },
  review_tag_sentence_var_pop_order_by: {
    ml_sentiment: { __type: 'order_by' },
    naive_sentiment: { __type: 'order_by' },
  },
  review_tag_sentence_var_samp_fields: {
    __typename: { __type: 'String!' },
    ml_sentiment: { __type: 'Float' },
    naive_sentiment: { __type: 'Float' },
  },
  review_tag_sentence_var_samp_order_by: {
    ml_sentiment: { __type: 'order_by' },
    naive_sentiment: { __type: 'order_by' },
  },
  review_tag_sentence_variance_fields: {
    __typename: { __type: 'String!' },
    ml_sentiment: { __type: 'Float' },
    naive_sentiment: { __type: 'Float' },
  },
  review_tag_sentence_variance_order_by: {
    ml_sentiment: { __type: 'order_by' },
    naive_sentiment: { __type: 'order_by' },
  },
  review_updates: {
    _append: { __type: 'review_append_input' },
    _delete_at_path: { __type: 'review_delete_at_path_input' },
    _delete_elem: { __type: 'review_delete_elem_input' },
    _delete_key: { __type: 'review_delete_key_input' },
    _inc: { __type: 'review_inc_input' },
    _prepend: { __type: 'review_prepend_input' },
    _set: { __type: 'review_set_input' },
    where: { __type: 'review_bool_exp!' },
  },
  review_var_pop_fields: {
    __typename: { __type: 'String!' },
    rating: { __type: 'Float' },
    vote: { __type: 'Float' },
  },
  review_var_pop_order_by: { rating: { __type: 'order_by' }, vote: { __type: 'order_by' } },
  review_var_samp_fields: {
    __typename: { __type: 'String!' },
    rating: { __type: 'Float' },
    vote: { __type: 'Float' },
  },
  review_var_samp_order_by: { rating: { __type: 'order_by' }, vote: { __type: 'order_by' } },
  review_variance_fields: {
    __typename: { __type: 'String!' },
    rating: { __type: 'Float' },
    vote: { __type: 'Float' },
  },
  review_variance_order_by: { rating: { __type: 'order_by' }, vote: { __type: 'order_by' } },
  setting: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid!' },
    key: { __type: 'String!' },
    updated_at: { __type: 'timestamptz' },
    value: { __type: 'jsonb!' },
  },
  setting_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'setting_aggregate_fields' },
    nodes: { __type: '[setting!]!' },
  },
  setting_aggregate_fields: {
    __typename: { __type: 'String!' },
    count: {
      __type: 'Int!',
      __args: { columns: '[setting_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'setting_max_fields' },
    min: { __type: 'setting_min_fields' },
  },
  setting_append_input: { value: { __type: 'jsonb' } },
  setting_bool_exp: {
    _and: { __type: '[setting_bool_exp!]' },
    _not: { __type: 'setting_bool_exp' },
    _or: { __type: '[setting_bool_exp!]' },
    created_at: { __type: 'timestamptz_comparison_exp' },
    id: { __type: 'uuid_comparison_exp' },
    key: { __type: 'String_comparison_exp' },
    updated_at: { __type: 'timestamptz_comparison_exp' },
    value: { __type: 'jsonb_comparison_exp' },
  },
  setting_delete_at_path_input: { value: { __type: '[String!]' } },
  setting_delete_elem_input: { value: { __type: 'Int' } },
  setting_delete_key_input: { value: { __type: 'String' } },
  setting_insert_input: {
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    key: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    value: { __type: 'jsonb' },
  },
  setting_max_fields: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    key: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
  },
  setting_min_fields: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    key: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
  },
  setting_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[setting!]!' },
  },
  setting_on_conflict: {
    constraint: { __type: 'setting_constraint!' },
    update_columns: { __type: '[setting_update_column!]!' },
    where: { __type: 'setting_bool_exp' },
  },
  setting_order_by: {
    created_at: { __type: 'order_by' },
    id: { __type: 'order_by' },
    key: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    value: { __type: 'order_by' },
  },
  setting_pk_columns_input: { key: { __type: 'String!' } },
  setting_prepend_input: { value: { __type: 'jsonb' } },
  setting_set_input: {
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    key: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    value: { __type: 'jsonb' },
  },
  setting_stream_cursor_input: {
    initial_value: { __type: 'setting_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  setting_stream_cursor_value_input: {
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    key: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    value: { __type: 'jsonb' },
  },
  setting_updates: {
    _append: { __type: 'setting_append_input' },
    _delete_at_path: { __type: 'setting_delete_at_path_input' },
    _delete_elem: { __type: 'setting_delete_elem_input' },
    _delete_key: { __type: 'setting_delete_key_input' },
    _prepend: { __type: 'setting_prepend_input' },
    _set: { __type: 'setting_set_input' },
    where: { __type: 'setting_bool_exp!' },
  },
  st_d_within_geography_input: {
    distance: { __type: 'Float!' },
    from: { __type: 'geography!' },
    use_spheroid: { __type: 'Boolean' },
  },
  st_d_within_input: { distance: { __type: 'Float!' }, from: { __type: 'geometry!' } },
  subscription: {
    __typename: { __type: 'String!' },
    boundaries_city: {
      __type: '[boundaries_city!]!',
      __args: {
        distinct_on: '[boundaries_city_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[boundaries_city_order_by!]',
        where: 'boundaries_city_bool_exp',
      },
    },
    boundaries_city_aggregate: {
      __type: 'boundaries_city_aggregate!',
      __args: {
        distinct_on: '[boundaries_city_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[boundaries_city_order_by!]',
        where: 'boundaries_city_bool_exp',
      },
    },
    boundaries_city_by_pk: { __type: 'boundaries_city', __args: { ogc_fid: 'Int!' } },
    boundaries_city_stream: {
      __type: '[boundaries_city!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[boundaries_city_stream_cursor_input]!',
        where: 'boundaries_city_bool_exp',
      },
    },
    follow: {
      __type: '[follow!]!',
      __args: {
        distinct_on: '[follow_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[follow_order_by!]',
        where: 'follow_bool_exp',
      },
    },
    follow_aggregate: {
      __type: 'follow_aggregate!',
      __args: {
        distinct_on: '[follow_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[follow_order_by!]',
        where: 'follow_bool_exp',
      },
    },
    follow_by_pk: { __type: 'follow', __args: { id: 'uuid!' } },
    follow_stream: {
      __type: '[follow!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[follow_stream_cursor_input]!',
        where: 'follow_bool_exp',
      },
    },
    hrr: {
      __type: '[hrr!]!',
      __args: {
        distinct_on: '[hrr_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[hrr_order_by!]',
        where: 'hrr_bool_exp',
      },
    },
    hrr_aggregate: {
      __type: 'hrr_aggregate!',
      __args: {
        distinct_on: '[hrr_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[hrr_order_by!]',
        where: 'hrr_bool_exp',
      },
    },
    hrr_by_pk: { __type: 'hrr', __args: { ogc_fid: 'Int!' } },
    hrr_stream: {
      __type: '[hrr!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[hrr_stream_cursor_input]!',
        where: 'hrr_bool_exp',
      },
    },
    list: {
      __type: '[list!]!',
      __args: {
        distinct_on: '[list_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_order_by!]',
        where: 'list_bool_exp',
      },
    },
    list_aggregate: {
      __type: 'list_aggregate!',
      __args: {
        distinct_on: '[list_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_order_by!]',
        where: 'list_bool_exp',
      },
    },
    list_by_pk: { __type: 'list', __args: { id: 'uuid!' } },
    list_populated: {
      __type: '[list!]!',
      __args: {
        args: 'list_populated_args!',
        distinct_on: '[list_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_order_by!]',
        where: 'list_bool_exp',
      },
    },
    list_populated_aggregate: {
      __type: 'list_aggregate!',
      __args: {
        args: 'list_populated_args!',
        distinct_on: '[list_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_order_by!]',
        where: 'list_bool_exp',
      },
    },
    list_region: {
      __type: '[list_region!]!',
      __args: {
        distinct_on: '[list_region_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_region_order_by!]',
        where: 'list_region_bool_exp',
      },
    },
    list_region_aggregate: {
      __type: 'list_region_aggregate!',
      __args: {
        distinct_on: '[list_region_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_region_order_by!]',
        where: 'list_region_bool_exp',
      },
    },
    list_region_by_pk: { __type: 'list_region', __args: { id: 'uuid!' } },
    list_region_stream: {
      __type: '[list_region!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[list_region_stream_cursor_input]!',
        where: 'list_region_bool_exp',
      },
    },
    list_restaurant: {
      __type: '[list_restaurant!]!',
      __args: {
        distinct_on: '[list_restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_restaurant_order_by!]',
        where: 'list_restaurant_bool_exp',
      },
    },
    list_restaurant_aggregate: {
      __type: 'list_restaurant_aggregate!',
      __args: {
        distinct_on: '[list_restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_restaurant_order_by!]',
        where: 'list_restaurant_bool_exp',
      },
    },
    list_restaurant_by_pk: {
      __type: 'list_restaurant',
      __args: { list_id: 'uuid!', restaurant_id: 'uuid!' },
    },
    list_restaurant_stream: {
      __type: '[list_restaurant!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[list_restaurant_stream_cursor_input]!',
        where: 'list_restaurant_bool_exp',
      },
    },
    list_restaurant_tag: {
      __type: '[list_restaurant_tag!]!',
      __args: {
        distinct_on: '[list_restaurant_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_restaurant_tag_order_by!]',
        where: 'list_restaurant_tag_bool_exp',
      },
    },
    list_restaurant_tag_aggregate: {
      __type: 'list_restaurant_tag_aggregate!',
      __args: {
        distinct_on: '[list_restaurant_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_restaurant_tag_order_by!]',
        where: 'list_restaurant_tag_bool_exp',
      },
    },
    list_restaurant_tag_by_pk: { __type: 'list_restaurant_tag', __args: { id: 'uuid!' } },
    list_restaurant_tag_stream: {
      __type: '[list_restaurant_tag!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[list_restaurant_tag_stream_cursor_input]!',
        where: 'list_restaurant_tag_bool_exp',
      },
    },
    list_stream: {
      __type: '[list!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[list_stream_cursor_input]!',
        where: 'list_bool_exp',
      },
    },
    list_tag: {
      __type: '[list_tag!]!',
      __args: {
        distinct_on: '[list_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_tag_order_by!]',
        where: 'list_tag_bool_exp',
      },
    },
    list_tag_aggregate: {
      __type: 'list_tag_aggregate!',
      __args: {
        distinct_on: '[list_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_tag_order_by!]',
        where: 'list_tag_bool_exp',
      },
    },
    list_tag_by_pk: { __type: 'list_tag', __args: { id: 'uuid!' } },
    list_tag_stream: {
      __type: '[list_tag!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[list_tag_stream_cursor_input]!',
        where: 'list_tag_bool_exp',
      },
    },
    menu_item: {
      __type: '[menu_item!]!',
      __args: {
        distinct_on: '[menu_item_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[menu_item_order_by!]',
        where: 'menu_item_bool_exp',
      },
    },
    menu_item_aggregate: {
      __type: 'menu_item_aggregate!',
      __args: {
        distinct_on: '[menu_item_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[menu_item_order_by!]',
        where: 'menu_item_bool_exp',
      },
    },
    menu_item_by_pk: { __type: 'menu_item', __args: { id: 'uuid!' } },
    menu_item_stream: {
      __type: '[menu_item!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[menu_item_stream_cursor_input]!',
        where: 'menu_item_bool_exp',
      },
    },
    nhood_labels: {
      __type: '[nhood_labels!]!',
      __args: {
        distinct_on: '[nhood_labels_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[nhood_labels_order_by!]',
        where: 'nhood_labels_bool_exp',
      },
    },
    nhood_labels_aggregate: {
      __type: 'nhood_labels_aggregate!',
      __args: {
        distinct_on: '[nhood_labels_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[nhood_labels_order_by!]',
        where: 'nhood_labels_bool_exp',
      },
    },
    nhood_labels_by_pk: { __type: 'nhood_labels', __args: { ogc_fid: 'Int!' } },
    nhood_labels_stream: {
      __type: '[nhood_labels!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[nhood_labels_stream_cursor_input]!',
        where: 'nhood_labels_bool_exp',
      },
    },
    opening_hours: {
      __type: '[opening_hours!]!',
      __args: {
        distinct_on: '[opening_hours_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[opening_hours_order_by!]',
        where: 'opening_hours_bool_exp',
      },
    },
    opening_hours_aggregate: {
      __type: 'opening_hours_aggregate!',
      __args: {
        distinct_on: '[opening_hours_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[opening_hours_order_by!]',
        where: 'opening_hours_bool_exp',
      },
    },
    opening_hours_by_pk: { __type: 'opening_hours', __args: { id: 'uuid!' } },
    opening_hours_stream: {
      __type: '[opening_hours!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[opening_hours_stream_cursor_input]!',
        where: 'opening_hours_bool_exp',
      },
    },
    photo: {
      __type: '[photo!]!',
      __args: {
        distinct_on: '[photo_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[photo_order_by!]',
        where: 'photo_bool_exp',
      },
    },
    photo_aggregate: {
      __type: 'photo_aggregate!',
      __args: {
        distinct_on: '[photo_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[photo_order_by!]',
        where: 'photo_bool_exp',
      },
    },
    photo_by_pk: { __type: 'photo', __args: { id: 'uuid!' } },
    photo_stream: {
      __type: '[photo!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[photo_stream_cursor_input]!',
        where: 'photo_bool_exp',
      },
    },
    photo_xref: {
      __type: '[photo_xref!]!',
      __args: {
        distinct_on: '[photo_xref_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[photo_xref_order_by!]',
        where: 'photo_xref_bool_exp',
      },
    },
    photo_xref_aggregate: {
      __type: 'photo_xref_aggregate!',
      __args: {
        distinct_on: '[photo_xref_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[photo_xref_order_by!]',
        where: 'photo_xref_bool_exp',
      },
    },
    photo_xref_by_pk: { __type: 'photo_xref', __args: { id: 'uuid!' } },
    photo_xref_stream: {
      __type: '[photo_xref!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[photo_xref_stream_cursor_input]!',
        where: 'photo_xref_bool_exp',
      },
    },
    restaurant: {
      __type: '[restaurant!]!',
      __args: {
        distinct_on: '[restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_order_by!]',
        where: 'restaurant_bool_exp',
      },
    },
    restaurant_aggregate: {
      __type: 'restaurant_aggregate!',
      __args: {
        distinct_on: '[restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_order_by!]',
        where: 'restaurant_bool_exp',
      },
    },
    restaurant_by_pk: { __type: 'restaurant', __args: { id: 'uuid!' } },
    restaurant_new: {
      __type: '[restaurant!]!',
      __args: {
        args: 'restaurant_new_args!',
        distinct_on: '[restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_order_by!]',
        where: 'restaurant_bool_exp',
      },
    },
    restaurant_new_aggregate: {
      __type: 'restaurant_aggregate!',
      __args: {
        args: 'restaurant_new_args!',
        distinct_on: '[restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_order_by!]',
        where: 'restaurant_bool_exp',
      },
    },
    restaurant_stream: {
      __type: '[restaurant!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[restaurant_stream_cursor_input]!',
        where: 'restaurant_bool_exp',
      },
    },
    restaurant_tag: {
      __type: '[restaurant_tag!]!',
      __args: {
        distinct_on: '[restaurant_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_tag_order_by!]',
        where: 'restaurant_tag_bool_exp',
      },
    },
    restaurant_tag_aggregate: {
      __type: 'restaurant_tag_aggregate!',
      __args: {
        distinct_on: '[restaurant_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_tag_order_by!]',
        where: 'restaurant_tag_bool_exp',
      },
    },
    restaurant_tag_by_pk: {
      __type: 'restaurant_tag',
      __args: { restaurant_id: 'uuid!', tag_id: 'uuid!' },
    },
    restaurant_tag_stream: {
      __type: '[restaurant_tag!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[restaurant_tag_stream_cursor_input]!',
        where: 'restaurant_tag_bool_exp',
      },
    },
    restaurant_top_tags: {
      __type: '[restaurant_tag!]!',
      __args: {
        args: 'restaurant_top_tags_args!',
        distinct_on: '[restaurant_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_tag_order_by!]',
        where: 'restaurant_tag_bool_exp',
      },
    },
    restaurant_top_tags_aggregate: {
      __type: 'restaurant_tag_aggregate!',
      __args: {
        args: 'restaurant_top_tags_args!',
        distinct_on: '[restaurant_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_tag_order_by!]',
        where: 'restaurant_tag_bool_exp',
      },
    },
    restaurant_trending: {
      __type: '[restaurant!]!',
      __args: {
        args: 'restaurant_trending_args!',
        distinct_on: '[restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_order_by!]',
        where: 'restaurant_bool_exp',
      },
    },
    restaurant_trending_aggregate: {
      __type: 'restaurant_aggregate!',
      __args: {
        args: 'restaurant_trending_args!',
        distinct_on: '[restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_order_by!]',
        where: 'restaurant_bool_exp',
      },
    },
    restaurant_with_tags: {
      __type: '[restaurant!]!',
      __args: {
        args: 'restaurant_with_tags_args!',
        distinct_on: '[restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_order_by!]',
        where: 'restaurant_bool_exp',
      },
    },
    restaurant_with_tags_aggregate: {
      __type: 'restaurant_aggregate!',
      __args: {
        args: 'restaurant_with_tags_args!',
        distinct_on: '[restaurant_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_order_by!]',
        where: 'restaurant_bool_exp',
      },
    },
    review: {
      __type: '[review!]!',
      __args: {
        distinct_on: '[review_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_order_by!]',
        where: 'review_bool_exp',
      },
    },
    review_aggregate: {
      __type: 'review_aggregate!',
      __args: {
        distinct_on: '[review_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_order_by!]',
        where: 'review_bool_exp',
      },
    },
    review_by_pk: { __type: 'review', __args: { id: 'uuid!' } },
    review_stream: {
      __type: '[review!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[review_stream_cursor_input]!',
        where: 'review_bool_exp',
      },
    },
    review_tag_sentence: {
      __type: '[review_tag_sentence!]!',
      __args: {
        distinct_on: '[review_tag_sentence_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_tag_sentence_order_by!]',
        where: 'review_tag_sentence_bool_exp',
      },
    },
    review_tag_sentence_aggregate: {
      __type: 'review_tag_sentence_aggregate!',
      __args: {
        distinct_on: '[review_tag_sentence_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_tag_sentence_order_by!]',
        where: 'review_tag_sentence_bool_exp',
      },
    },
    review_tag_sentence_by_pk: { __type: 'review_tag_sentence', __args: { id: 'uuid!' } },
    review_tag_sentence_stream: {
      __type: '[review_tag_sentence!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[review_tag_sentence_stream_cursor_input]!',
        where: 'review_tag_sentence_bool_exp',
      },
    },
    setting: {
      __type: '[setting!]!',
      __args: {
        distinct_on: '[setting_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[setting_order_by!]',
        where: 'setting_bool_exp',
      },
    },
    setting_aggregate: {
      __type: 'setting_aggregate!',
      __args: {
        distinct_on: '[setting_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[setting_order_by!]',
        where: 'setting_bool_exp',
      },
    },
    setting_by_pk: { __type: 'setting', __args: { key: 'String!' } },
    setting_stream: {
      __type: '[setting!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[setting_stream_cursor_input]!',
        where: 'setting_bool_exp',
      },
    },
    tag: {
      __type: '[tag!]!',
      __args: {
        distinct_on: '[tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[tag_order_by!]',
        where: 'tag_bool_exp',
      },
    },
    tag_aggregate: {
      __type: 'tag_aggregate!',
      __args: {
        distinct_on: '[tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[tag_order_by!]',
        where: 'tag_bool_exp',
      },
    },
    tag_by_pk: { __type: 'tag', __args: { id: 'uuid!' } },
    tag_stream: {
      __type: '[tag!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[tag_stream_cursor_input]!',
        where: 'tag_bool_exp',
      },
    },
    tag_tag: {
      __type: '[tag_tag!]!',
      __args: {
        distinct_on: '[tag_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[tag_tag_order_by!]',
        where: 'tag_tag_bool_exp',
      },
    },
    tag_tag_aggregate: {
      __type: 'tag_tag_aggregate!',
      __args: {
        distinct_on: '[tag_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[tag_tag_order_by!]',
        where: 'tag_tag_bool_exp',
      },
    },
    tag_tag_by_pk: {
      __type: 'tag_tag',
      __args: { category_tag_id: 'uuid!', tag_id: 'uuid!' },
    },
    tag_tag_stream: {
      __type: '[tag_tag!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[tag_tag_stream_cursor_input]!',
        where: 'tag_tag_bool_exp',
      },
    },
    user: {
      __type: '[user!]!',
      __args: {
        distinct_on: '[user_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[user_order_by!]',
        where: 'user_bool_exp',
      },
    },
    user_aggregate: {
      __type: 'user_aggregate!',
      __args: {
        distinct_on: '[user_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[user_order_by!]',
        where: 'user_bool_exp',
      },
    },
    user_by_pk: { __type: 'user', __args: { id: 'uuid!' } },
    user_stream: {
      __type: '[user!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[user_stream_cursor_input]!',
        where: 'user_bool_exp',
      },
    },
    zcta5: {
      __type: '[zcta5!]!',
      __args: {
        distinct_on: '[zcta5_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[zcta5_order_by!]',
        where: 'zcta5_bool_exp',
      },
    },
    zcta5_aggregate: {
      __type: 'zcta5_aggregate!',
      __args: {
        distinct_on: '[zcta5_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[zcta5_order_by!]',
        where: 'zcta5_bool_exp',
      },
    },
    zcta5_by_pk: { __type: 'zcta5', __args: { ogc_fid: 'Int!' } },
    zcta5_stream: {
      __type: '[zcta5!]!',
      __args: {
        batch_size: 'Int!',
        cursor: '[zcta5_stream_cursor_input]!',
        where: 'zcta5_bool_exp',
      },
    },
  },
  tag: {
    __typename: { __type: 'String!' },
    alternates: { __type: 'jsonb' },
    categories: {
      __type: '[tag_tag!]!',
      __args: {
        distinct_on: '[tag_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[tag_tag_order_by!]',
        where: 'tag_tag_bool_exp',
      },
    },
    categories_aggregate: {
      __type: 'tag_tag_aggregate!',
      __args: {
        distinct_on: '[tag_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[tag_tag_order_by!]',
        where: 'tag_tag_bool_exp',
      },
    },
    created_at: { __type: 'timestamptz!' },
    default_image: { __type: 'String' },
    default_images: { __type: 'jsonb' },
    description: { __type: 'String' },
    displayName: { __type: 'String' },
    frequency: { __type: 'Int' },
    icon: { __type: 'String' },
    id: { __type: 'uuid!' },
    is_ambiguous: { __type: 'Boolean!' },
    misc: { __type: 'jsonb' },
    name: { __type: 'String!' },
    order: { __type: 'Int!' },
    parent: { __type: 'tag' },
    parentId: { __type: 'uuid' },
    popularity: { __type: 'Int' },
    restaurant_taxonomies: {
      __type: '[restaurant_tag!]!',
      __args: {
        distinct_on: '[restaurant_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_tag_order_by!]',
        where: 'restaurant_tag_bool_exp',
      },
    },
    restaurant_taxonomies_aggregate: {
      __type: 'restaurant_tag_aggregate!',
      __args: {
        distinct_on: '[restaurant_tag_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[restaurant_tag_order_by!]',
        where: 'restaurant_tag_bool_exp',
      },
    },
    reviews: {
      __type: '[review!]!',
      __args: {
        distinct_on: '[review_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_order_by!]',
        where: 'review_bool_exp',
      },
    },
    reviews_aggregate: {
      __type: 'review_aggregate!',
      __args: {
        distinct_on: '[review_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_order_by!]',
        where: 'review_bool_exp',
      },
    },
    rgb: { __type: 'jsonb' },
    slug: { __type: 'String' },
    type: { __type: 'String' },
    updated_at: { __type: 'timestamptz!' },
  },
  tag_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'tag_aggregate_fields' },
    nodes: { __type: '[tag!]!' },
  },
  tag_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'tag_avg_fields' },
    count: {
      __type: 'Int!',
      __args: { columns: '[tag_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'tag_max_fields' },
    min: { __type: 'tag_min_fields' },
    stddev: { __type: 'tag_stddev_fields' },
    stddev_pop: { __type: 'tag_stddev_pop_fields' },
    stddev_samp: { __type: 'tag_stddev_samp_fields' },
    sum: { __type: 'tag_sum_fields' },
    var_pop: { __type: 'tag_var_pop_fields' },
    var_samp: { __type: 'tag_var_samp_fields' },
    variance: { __type: 'tag_variance_fields' },
  },
  tag_append_input: {
    alternates: { __type: 'jsonb' },
    default_images: { __type: 'jsonb' },
    misc: { __type: 'jsonb' },
    rgb: { __type: 'jsonb' },
  },
  tag_avg_fields: {
    __typename: { __type: 'String!' },
    frequency: { __type: 'Float' },
    order: { __type: 'Float' },
    popularity: { __type: 'Float' },
  },
  tag_bool_exp: {
    _and: { __type: '[tag_bool_exp!]' },
    _not: { __type: 'tag_bool_exp' },
    _or: { __type: '[tag_bool_exp!]' },
    alternates: { __type: 'jsonb_comparison_exp' },
    categories: { __type: 'tag_tag_bool_exp' },
    categories_aggregate: { __type: 'tag_tag_aggregate_bool_exp' },
    created_at: { __type: 'timestamptz_comparison_exp' },
    default_image: { __type: 'String_comparison_exp' },
    default_images: { __type: 'jsonb_comparison_exp' },
    description: { __type: 'String_comparison_exp' },
    displayName: { __type: 'String_comparison_exp' },
    frequency: { __type: 'Int_comparison_exp' },
    icon: { __type: 'String_comparison_exp' },
    id: { __type: 'uuid_comparison_exp' },
    is_ambiguous: { __type: 'Boolean_comparison_exp' },
    misc: { __type: 'jsonb_comparison_exp' },
    name: { __type: 'String_comparison_exp' },
    order: { __type: 'Int_comparison_exp' },
    parent: { __type: 'tag_bool_exp' },
    parentId: { __type: 'uuid_comparison_exp' },
    popularity: { __type: 'Int_comparison_exp' },
    restaurant_taxonomies: { __type: 'restaurant_tag_bool_exp' },
    restaurant_taxonomies_aggregate: { __type: 'restaurant_tag_aggregate_bool_exp' },
    reviews: { __type: 'review_bool_exp' },
    reviews_aggregate: { __type: 'review_aggregate_bool_exp' },
    rgb: { __type: 'jsonb_comparison_exp' },
    slug: { __type: 'String_comparison_exp' },
    type: { __type: 'String_comparison_exp' },
    updated_at: { __type: 'timestamptz_comparison_exp' },
  },
  tag_delete_at_path_input: {
    alternates: { __type: '[String!]' },
    default_images: { __type: '[String!]' },
    misc: { __type: '[String!]' },
    rgb: { __type: '[String!]' },
  },
  tag_delete_elem_input: {
    alternates: { __type: 'Int' },
    default_images: { __type: 'Int' },
    misc: { __type: 'Int' },
    rgb: { __type: 'Int' },
  },
  tag_delete_key_input: {
    alternates: { __type: 'String' },
    default_images: { __type: 'String' },
    misc: { __type: 'String' },
    rgb: { __type: 'String' },
  },
  tag_inc_input: {
    frequency: { __type: 'Int' },
    order: { __type: 'Int' },
    popularity: { __type: 'Int' },
  },
  tag_insert_input: {
    alternates: { __type: 'jsonb' },
    categories: { __type: 'tag_tag_arr_rel_insert_input' },
    created_at: { __type: 'timestamptz' },
    default_image: { __type: 'String' },
    default_images: { __type: 'jsonb' },
    description: { __type: 'String' },
    displayName: { __type: 'String' },
    frequency: { __type: 'Int' },
    icon: { __type: 'String' },
    id: { __type: 'uuid' },
    is_ambiguous: { __type: 'Boolean' },
    misc: { __type: 'jsonb' },
    name: { __type: 'String' },
    order: { __type: 'Int' },
    parent: { __type: 'tag_obj_rel_insert_input' },
    parentId: { __type: 'uuid' },
    popularity: { __type: 'Int' },
    restaurant_taxonomies: { __type: 'restaurant_tag_arr_rel_insert_input' },
    reviews: { __type: 'review_arr_rel_insert_input' },
    rgb: { __type: 'jsonb' },
    slug: { __type: 'String' },
    type: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
  },
  tag_max_fields: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamptz' },
    default_image: { __type: 'String' },
    description: { __type: 'String' },
    displayName: { __type: 'String' },
    frequency: { __type: 'Int' },
    icon: { __type: 'String' },
    id: { __type: 'uuid' },
    name: { __type: 'String' },
    order: { __type: 'Int' },
    parentId: { __type: 'uuid' },
    popularity: { __type: 'Int' },
    slug: { __type: 'String' },
    type: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
  },
  tag_min_fields: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamptz' },
    default_image: { __type: 'String' },
    description: { __type: 'String' },
    displayName: { __type: 'String' },
    frequency: { __type: 'Int' },
    icon: { __type: 'String' },
    id: { __type: 'uuid' },
    name: { __type: 'String' },
    order: { __type: 'Int' },
    parentId: { __type: 'uuid' },
    popularity: { __type: 'Int' },
    slug: { __type: 'String' },
    type: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
  },
  tag_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[tag!]!' },
  },
  tag_obj_rel_insert_input: {
    data: { __type: 'tag_insert_input!' },
    on_conflict: { __type: 'tag_on_conflict' },
  },
  tag_on_conflict: {
    constraint: { __type: 'tag_constraint!' },
    update_columns: { __type: '[tag_update_column!]!' },
    where: { __type: 'tag_bool_exp' },
  },
  tag_order_by: {
    alternates: { __type: 'order_by' },
    categories_aggregate: { __type: 'tag_tag_aggregate_order_by' },
    created_at: { __type: 'order_by' },
    default_image: { __type: 'order_by' },
    default_images: { __type: 'order_by' },
    description: { __type: 'order_by' },
    displayName: { __type: 'order_by' },
    frequency: { __type: 'order_by' },
    icon: { __type: 'order_by' },
    id: { __type: 'order_by' },
    is_ambiguous: { __type: 'order_by' },
    misc: { __type: 'order_by' },
    name: { __type: 'order_by' },
    order: { __type: 'order_by' },
    parent: { __type: 'tag_order_by' },
    parentId: { __type: 'order_by' },
    popularity: { __type: 'order_by' },
    restaurant_taxonomies_aggregate: { __type: 'restaurant_tag_aggregate_order_by' },
    reviews_aggregate: { __type: 'review_aggregate_order_by' },
    rgb: { __type: 'order_by' },
    slug: { __type: 'order_by' },
    type: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
  },
  tag_pk_columns_input: { id: { __type: 'uuid!' } },
  tag_prepend_input: {
    alternates: { __type: 'jsonb' },
    default_images: { __type: 'jsonb' },
    misc: { __type: 'jsonb' },
    rgb: { __type: 'jsonb' },
  },
  tag_set_input: {
    alternates: { __type: 'jsonb' },
    created_at: { __type: 'timestamptz' },
    default_image: { __type: 'String' },
    default_images: { __type: 'jsonb' },
    description: { __type: 'String' },
    displayName: { __type: 'String' },
    frequency: { __type: 'Int' },
    icon: { __type: 'String' },
    id: { __type: 'uuid' },
    is_ambiguous: { __type: 'Boolean' },
    misc: { __type: 'jsonb' },
    name: { __type: 'String' },
    order: { __type: 'Int' },
    parentId: { __type: 'uuid' },
    popularity: { __type: 'Int' },
    rgb: { __type: 'jsonb' },
    slug: { __type: 'String' },
    type: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
  },
  tag_stddev_fields: {
    __typename: { __type: 'String!' },
    frequency: { __type: 'Float' },
    order: { __type: 'Float' },
    popularity: { __type: 'Float' },
  },
  tag_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    frequency: { __type: 'Float' },
    order: { __type: 'Float' },
    popularity: { __type: 'Float' },
  },
  tag_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    frequency: { __type: 'Float' },
    order: { __type: 'Float' },
    popularity: { __type: 'Float' },
  },
  tag_stream_cursor_input: {
    initial_value: { __type: 'tag_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  tag_stream_cursor_value_input: {
    alternates: { __type: 'jsonb' },
    created_at: { __type: 'timestamptz' },
    default_image: { __type: 'String' },
    default_images: { __type: 'jsonb' },
    description: { __type: 'String' },
    displayName: { __type: 'String' },
    frequency: { __type: 'Int' },
    icon: { __type: 'String' },
    id: { __type: 'uuid' },
    is_ambiguous: { __type: 'Boolean' },
    misc: { __type: 'jsonb' },
    name: { __type: 'String' },
    order: { __type: 'Int' },
    parentId: { __type: 'uuid' },
    popularity: { __type: 'Int' },
    rgb: { __type: 'jsonb' },
    slug: { __type: 'String' },
    type: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
  },
  tag_sum_fields: {
    __typename: { __type: 'String!' },
    frequency: { __type: 'Int' },
    order: { __type: 'Int' },
    popularity: { __type: 'Int' },
  },
  tag_tag: {
    __typename: { __type: 'String!' },
    category: { __type: 'tag!' },
    category_tag_id: { __type: 'uuid!' },
    main: { __type: 'tag!' },
    tag_id: { __type: 'uuid!' },
  },
  tag_tag_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'tag_tag_aggregate_fields' },
    nodes: { __type: '[tag_tag!]!' },
  },
  tag_tag_aggregate_bool_exp: { count: { __type: 'tag_tag_aggregate_bool_exp_count' } },
  tag_tag_aggregate_bool_exp_count: {
    arguments: { __type: '[tag_tag_select_column!]' },
    distinct: { __type: 'Boolean' },
    filter: { __type: 'tag_tag_bool_exp' },
    predicate: { __type: 'Int_comparison_exp!' },
  },
  tag_tag_aggregate_fields: {
    __typename: { __type: 'String!' },
    count: {
      __type: 'Int!',
      __args: { columns: '[tag_tag_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'tag_tag_max_fields' },
    min: { __type: 'tag_tag_min_fields' },
  },
  tag_tag_aggregate_order_by: {
    count: { __type: 'order_by' },
    max: { __type: 'tag_tag_max_order_by' },
    min: { __type: 'tag_tag_min_order_by' },
  },
  tag_tag_arr_rel_insert_input: {
    data: { __type: '[tag_tag_insert_input!]!' },
    on_conflict: { __type: 'tag_tag_on_conflict' },
  },
  tag_tag_bool_exp: {
    _and: { __type: '[tag_tag_bool_exp!]' },
    _not: { __type: 'tag_tag_bool_exp' },
    _or: { __type: '[tag_tag_bool_exp!]' },
    category: { __type: 'tag_bool_exp' },
    category_tag_id: { __type: 'uuid_comparison_exp' },
    main: { __type: 'tag_bool_exp' },
    tag_id: { __type: 'uuid_comparison_exp' },
  },
  tag_tag_insert_input: {
    category: { __type: 'tag_obj_rel_insert_input' },
    category_tag_id: { __type: 'uuid' },
    main: { __type: 'tag_obj_rel_insert_input' },
    tag_id: { __type: 'uuid' },
  },
  tag_tag_max_fields: {
    __typename: { __type: 'String!' },
    category_tag_id: { __type: 'uuid' },
    tag_id: { __type: 'uuid' },
  },
  tag_tag_max_order_by: {
    category_tag_id: { __type: 'order_by' },
    tag_id: { __type: 'order_by' },
  },
  tag_tag_min_fields: {
    __typename: { __type: 'String!' },
    category_tag_id: { __type: 'uuid' },
    tag_id: { __type: 'uuid' },
  },
  tag_tag_min_order_by: {
    category_tag_id: { __type: 'order_by' },
    tag_id: { __type: 'order_by' },
  },
  tag_tag_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[tag_tag!]!' },
  },
  tag_tag_on_conflict: {
    constraint: { __type: 'tag_tag_constraint!' },
    update_columns: { __type: '[tag_tag_update_column!]!' },
    where: { __type: 'tag_tag_bool_exp' },
  },
  tag_tag_order_by: {
    category: { __type: 'tag_order_by' },
    category_tag_id: { __type: 'order_by' },
    main: { __type: 'tag_order_by' },
    tag_id: { __type: 'order_by' },
  },
  tag_tag_pk_columns_input: {
    category_tag_id: { __type: 'uuid!' },
    tag_id: { __type: 'uuid!' },
  },
  tag_tag_set_input: { category_tag_id: { __type: 'uuid' }, tag_id: { __type: 'uuid' } },
  tag_tag_stream_cursor_input: {
    initial_value: { __type: 'tag_tag_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  tag_tag_stream_cursor_value_input: {
    category_tag_id: { __type: 'uuid' },
    tag_id: { __type: 'uuid' },
  },
  tag_tag_updates: {
    _set: { __type: 'tag_tag_set_input' },
    where: { __type: 'tag_tag_bool_exp!' },
  },
  tag_updates: {
    _append: { __type: 'tag_append_input' },
    _delete_at_path: { __type: 'tag_delete_at_path_input' },
    _delete_elem: { __type: 'tag_delete_elem_input' },
    _delete_key: { __type: 'tag_delete_key_input' },
    _inc: { __type: 'tag_inc_input' },
    _prepend: { __type: 'tag_prepend_input' },
    _set: { __type: 'tag_set_input' },
    where: { __type: 'tag_bool_exp!' },
  },
  tag_var_pop_fields: {
    __typename: { __type: 'String!' },
    frequency: { __type: 'Float' },
    order: { __type: 'Float' },
    popularity: { __type: 'Float' },
  },
  tag_var_samp_fields: {
    __typename: { __type: 'String!' },
    frequency: { __type: 'Float' },
    order: { __type: 'Float' },
    popularity: { __type: 'Float' },
  },
  tag_variance_fields: {
    __typename: { __type: 'String!' },
    frequency: { __type: 'Float' },
    order: { __type: 'Float' },
    popularity: { __type: 'Float' },
  },
  timestamptz_comparison_exp: {
    _eq: { __type: 'timestamptz' },
    _gt: { __type: 'timestamptz' },
    _gte: { __type: 'timestamptz' },
    _in: { __type: '[timestamptz!]' },
    _is_null: { __type: 'Boolean' },
    _lt: { __type: 'timestamptz' },
    _lte: { __type: 'timestamptz' },
    _neq: { __type: 'timestamptz' },
    _nin: { __type: '[timestamptz!]' },
  },
  top_tags_restaurant_args: {
    _tag_types: { __type: 'String' },
    tag_slugs: { __type: 'String' },
  },
  tsrange_comparison_exp: {
    _eq: { __type: 'tsrange' },
    _gt: { __type: 'tsrange' },
    _gte: { __type: 'tsrange' },
    _in: { __type: '[tsrange!]' },
    _is_null: { __type: 'Boolean' },
    _lt: { __type: 'tsrange' },
    _lte: { __type: 'tsrange' },
    _neq: { __type: 'tsrange' },
    _nin: { __type: '[tsrange!]' },
  },
  user: {
    __typename: { __type: 'String!' },
    about: { __type: 'String' },
    apple_email: { __type: 'String' },
    apple_refresh_token: { __type: 'String' },
    apple_token: { __type: 'String' },
    apple_uid: { __type: 'String' },
    avatar: { __type: 'String' },
    charIndex: { __type: 'Int!' },
    created_at: { __type: 'timestamptz!' },
    email: { __type: 'String' },
    followers: {
      __type: '[follow!]!',
      __args: {
        distinct_on: '[follow_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[follow_order_by!]',
        where: 'follow_bool_exp',
      },
    },
    followers_aggregate: {
      __type: 'follow_aggregate!',
      __args: {
        distinct_on: '[follow_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[follow_order_by!]',
        where: 'follow_bool_exp',
      },
    },
    following: {
      __type: '[follow!]!',
      __args: {
        distinct_on: '[follow_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[follow_order_by!]',
        where: 'follow_bool_exp',
      },
    },
    following_aggregate: {
      __type: 'follow_aggregate!',
      __args: {
        distinct_on: '[follow_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[follow_order_by!]',
        where: 'follow_bool_exp',
      },
    },
    has_onboarded: { __type: 'Boolean!' },
    id: { __type: 'uuid!' },
    lists: {
      __type: '[list!]!',
      __args: {
        distinct_on: '[list_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_order_by!]',
        where: 'list_bool_exp',
      },
    },
    lists_aggregate: {
      __type: 'list_aggregate!',
      __args: {
        distinct_on: '[list_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[list_order_by!]',
        where: 'list_bool_exp',
      },
    },
    location: { __type: 'String' },
    name: { __type: 'String' },
    password: { __type: 'String!' },
    password_reset_date: { __type: 'timestamptz' },
    password_reset_token: { __type: 'String' },
    photo_xrefs: {
      __type: '[photo_xref!]!',
      __args: {
        distinct_on: '[photo_xref_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[photo_xref_order_by!]',
        where: 'photo_xref_bool_exp',
      },
    },
    photo_xrefs_aggregate: {
      __type: 'photo_xref_aggregate!',
      __args: {
        distinct_on: '[photo_xref_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[photo_xref_order_by!]',
        where: 'photo_xref_bool_exp',
      },
    },
    reviews: {
      __type: '[review!]!',
      __args: {
        distinct_on: '[review_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_order_by!]',
        where: 'review_bool_exp',
      },
    },
    reviews_aggregate: {
      __type: 'review_aggregate!',
      __args: {
        distinct_on: '[review_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[review_order_by!]',
        where: 'review_bool_exp',
      },
    },
    role: { __type: 'String' },
    updated_at: { __type: 'timestamptz!' },
    username: { __type: 'String!' },
  },
  user_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'user_aggregate_fields' },
    nodes: { __type: '[user!]!' },
  },
  user_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'user_avg_fields' },
    count: {
      __type: 'Int!',
      __args: { columns: '[user_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'user_max_fields' },
    min: { __type: 'user_min_fields' },
    stddev: { __type: 'user_stddev_fields' },
    stddev_pop: { __type: 'user_stddev_pop_fields' },
    stddev_samp: { __type: 'user_stddev_samp_fields' },
    sum: { __type: 'user_sum_fields' },
    var_pop: { __type: 'user_var_pop_fields' },
    var_samp: { __type: 'user_var_samp_fields' },
    variance: { __type: 'user_variance_fields' },
  },
  user_avg_fields: { __typename: { __type: 'String!' }, charIndex: { __type: 'Float' } },
  user_bool_exp: {
    _and: { __type: '[user_bool_exp!]' },
    _not: { __type: 'user_bool_exp' },
    _or: { __type: '[user_bool_exp!]' },
    about: { __type: 'String_comparison_exp' },
    apple_email: { __type: 'String_comparison_exp' },
    apple_refresh_token: { __type: 'String_comparison_exp' },
    apple_token: { __type: 'String_comparison_exp' },
    apple_uid: { __type: 'String_comparison_exp' },
    avatar: { __type: 'String_comparison_exp' },
    charIndex: { __type: 'Int_comparison_exp' },
    created_at: { __type: 'timestamptz_comparison_exp' },
    email: { __type: 'String_comparison_exp' },
    followers: { __type: 'follow_bool_exp' },
    followers_aggregate: { __type: 'follow_aggregate_bool_exp' },
    following: { __type: 'follow_bool_exp' },
    following_aggregate: { __type: 'follow_aggregate_bool_exp' },
    has_onboarded: { __type: 'Boolean_comparison_exp' },
    id: { __type: 'uuid_comparison_exp' },
    lists: { __type: 'list_bool_exp' },
    lists_aggregate: { __type: 'list_aggregate_bool_exp' },
    location: { __type: 'String_comparison_exp' },
    name: { __type: 'String_comparison_exp' },
    password: { __type: 'String_comparison_exp' },
    password_reset_date: { __type: 'timestamptz_comparison_exp' },
    password_reset_token: { __type: 'String_comparison_exp' },
    photo_xrefs: { __type: 'photo_xref_bool_exp' },
    photo_xrefs_aggregate: { __type: 'photo_xref_aggregate_bool_exp' },
    reviews: { __type: 'review_bool_exp' },
    reviews_aggregate: { __type: 'review_aggregate_bool_exp' },
    role: { __type: 'String_comparison_exp' },
    updated_at: { __type: 'timestamptz_comparison_exp' },
    username: { __type: 'String_comparison_exp' },
  },
  user_inc_input: { charIndex: { __type: 'Int' } },
  user_insert_input: {
    about: { __type: 'String' },
    apple_email: { __type: 'String' },
    apple_refresh_token: { __type: 'String' },
    apple_token: { __type: 'String' },
    apple_uid: { __type: 'String' },
    avatar: { __type: 'String' },
    charIndex: { __type: 'Int' },
    created_at: { __type: 'timestamptz' },
    email: { __type: 'String' },
    followers: { __type: 'follow_arr_rel_insert_input' },
    following: { __type: 'follow_arr_rel_insert_input' },
    has_onboarded: { __type: 'Boolean' },
    id: { __type: 'uuid' },
    lists: { __type: 'list_arr_rel_insert_input' },
    location: { __type: 'String' },
    name: { __type: 'String' },
    password: { __type: 'String' },
    password_reset_date: { __type: 'timestamptz' },
    password_reset_token: { __type: 'String' },
    photo_xrefs: { __type: 'photo_xref_arr_rel_insert_input' },
    reviews: { __type: 'review_arr_rel_insert_input' },
    role: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    username: { __type: 'String' },
  },
  user_max_fields: {
    __typename: { __type: 'String!' },
    about: { __type: 'String' },
    apple_email: { __type: 'String' },
    apple_refresh_token: { __type: 'String' },
    apple_token: { __type: 'String' },
    apple_uid: { __type: 'String' },
    avatar: { __type: 'String' },
    charIndex: { __type: 'Int' },
    created_at: { __type: 'timestamptz' },
    email: { __type: 'String' },
    id: { __type: 'uuid' },
    location: { __type: 'String' },
    name: { __type: 'String' },
    password: { __type: 'String' },
    password_reset_date: { __type: 'timestamptz' },
    password_reset_token: { __type: 'String' },
    role: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    username: { __type: 'String' },
  },
  user_min_fields: {
    __typename: { __type: 'String!' },
    about: { __type: 'String' },
    apple_email: { __type: 'String' },
    apple_refresh_token: { __type: 'String' },
    apple_token: { __type: 'String' },
    apple_uid: { __type: 'String' },
    avatar: { __type: 'String' },
    charIndex: { __type: 'Int' },
    created_at: { __type: 'timestamptz' },
    email: { __type: 'String' },
    id: { __type: 'uuid' },
    location: { __type: 'String' },
    name: { __type: 'String' },
    password: { __type: 'String' },
    password_reset_date: { __type: 'timestamptz' },
    password_reset_token: { __type: 'String' },
    role: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    username: { __type: 'String' },
  },
  user_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[user!]!' },
  },
  user_obj_rel_insert_input: {
    data: { __type: 'user_insert_input!' },
    on_conflict: { __type: 'user_on_conflict' },
  },
  user_on_conflict: {
    constraint: { __type: 'user_constraint!' },
    update_columns: { __type: '[user_update_column!]!' },
    where: { __type: 'user_bool_exp' },
  },
  user_order_by: {
    about: { __type: 'order_by' },
    apple_email: { __type: 'order_by' },
    apple_refresh_token: { __type: 'order_by' },
    apple_token: { __type: 'order_by' },
    apple_uid: { __type: 'order_by' },
    avatar: { __type: 'order_by' },
    charIndex: { __type: 'order_by' },
    created_at: { __type: 'order_by' },
    email: { __type: 'order_by' },
    followers_aggregate: { __type: 'follow_aggregate_order_by' },
    following_aggregate: { __type: 'follow_aggregate_order_by' },
    has_onboarded: { __type: 'order_by' },
    id: { __type: 'order_by' },
    lists_aggregate: { __type: 'list_aggregate_order_by' },
    location: { __type: 'order_by' },
    name: { __type: 'order_by' },
    password: { __type: 'order_by' },
    password_reset_date: { __type: 'order_by' },
    password_reset_token: { __type: 'order_by' },
    photo_xrefs_aggregate: { __type: 'photo_xref_aggregate_order_by' },
    reviews_aggregate: { __type: 'review_aggregate_order_by' },
    role: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    username: { __type: 'order_by' },
  },
  user_pk_columns_input: { id: { __type: 'uuid!' } },
  user_set_input: {
    about: { __type: 'String' },
    apple_email: { __type: 'String' },
    apple_refresh_token: { __type: 'String' },
    apple_token: { __type: 'String' },
    apple_uid: { __type: 'String' },
    avatar: { __type: 'String' },
    charIndex: { __type: 'Int' },
    created_at: { __type: 'timestamptz' },
    email: { __type: 'String' },
    has_onboarded: { __type: 'Boolean' },
    id: { __type: 'uuid' },
    location: { __type: 'String' },
    name: { __type: 'String' },
    password: { __type: 'String' },
    password_reset_date: { __type: 'timestamptz' },
    password_reset_token: { __type: 'String' },
    role: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    username: { __type: 'String' },
  },
  user_stddev_fields: { __typename: { __type: 'String!' }, charIndex: { __type: 'Float' } },
  user_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    charIndex: { __type: 'Float' },
  },
  user_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    charIndex: { __type: 'Float' },
  },
  user_stream_cursor_input: {
    initial_value: { __type: 'user_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  user_stream_cursor_value_input: {
    about: { __type: 'String' },
    apple_email: { __type: 'String' },
    apple_refresh_token: { __type: 'String' },
    apple_token: { __type: 'String' },
    apple_uid: { __type: 'String' },
    avatar: { __type: 'String' },
    charIndex: { __type: 'Int' },
    created_at: { __type: 'timestamptz' },
    email: { __type: 'String' },
    has_onboarded: { __type: 'Boolean' },
    id: { __type: 'uuid' },
    location: { __type: 'String' },
    name: { __type: 'String' },
    password: { __type: 'String' },
    password_reset_date: { __type: 'timestamptz' },
    password_reset_token: { __type: 'String' },
    role: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    username: { __type: 'String' },
  },
  user_sum_fields: { __typename: { __type: 'String!' }, charIndex: { __type: 'Int' } },
  user_updates: {
    _inc: { __type: 'user_inc_input' },
    _set: { __type: 'user_set_input' },
    where: { __type: 'user_bool_exp!' },
  },
  user_var_pop_fields: { __typename: { __type: 'String!' }, charIndex: { __type: 'Float' } },
  user_var_samp_fields: { __typename: { __type: 'String!' }, charIndex: { __type: 'Float' } },
  user_variance_fields: { __typename: { __type: 'String!' }, charIndex: { __type: 'Float' } },
  uuid_comparison_exp: {
    _eq: { __type: 'uuid' },
    _gt: { __type: 'uuid' },
    _gte: { __type: 'uuid' },
    _in: { __type: '[uuid!]' },
    _is_null: { __type: 'Boolean' },
    _lt: { __type: 'uuid' },
    _lte: { __type: 'uuid' },
    _neq: { __type: 'uuid' },
    _nin: { __type: '[uuid!]' },
  },
  zcta5: {
    __typename: { __type: 'String!' },
    color: { __type: 'String' },
    intptlat10: { __type: 'String' },
    intptlon10: { __type: 'String' },
    nhood: { __type: 'String' },
    ogc_fid: { __type: 'Int!' },
    slug: { __type: 'String' },
    wkb_geometry: { __type: 'geometry' },
  },
  zcta5_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'zcta5_aggregate_fields' },
    nodes: { __type: '[zcta5!]!' },
  },
  zcta5_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'zcta5_avg_fields' },
    count: {
      __type: 'Int!',
      __args: { columns: '[zcta5_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'zcta5_max_fields' },
    min: { __type: 'zcta5_min_fields' },
    stddev: { __type: 'zcta5_stddev_fields' },
    stddev_pop: { __type: 'zcta5_stddev_pop_fields' },
    stddev_samp: { __type: 'zcta5_stddev_samp_fields' },
    sum: { __type: 'zcta5_sum_fields' },
    var_pop: { __type: 'zcta5_var_pop_fields' },
    var_samp: { __type: 'zcta5_var_samp_fields' },
    variance: { __type: 'zcta5_variance_fields' },
  },
  zcta5_avg_fields: { __typename: { __type: 'String!' }, ogc_fid: { __type: 'Float' } },
  zcta5_bool_exp: {
    _and: { __type: '[zcta5_bool_exp!]' },
    _not: { __type: 'zcta5_bool_exp' },
    _or: { __type: '[zcta5_bool_exp!]' },
    color: { __type: 'String_comparison_exp' },
    intptlat10: { __type: 'String_comparison_exp' },
    intptlon10: { __type: 'String_comparison_exp' },
    nhood: { __type: 'String_comparison_exp' },
    ogc_fid: { __type: 'Int_comparison_exp' },
    slug: { __type: 'String_comparison_exp' },
    wkb_geometry: { __type: 'geometry_comparison_exp' },
  },
  zcta5_inc_input: { ogc_fid: { __type: 'Int' } },
  zcta5_insert_input: {
    color: { __type: 'String' },
    intptlat10: { __type: 'String' },
    intptlon10: { __type: 'String' },
    nhood: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
    slug: { __type: 'String' },
    wkb_geometry: { __type: 'geometry' },
  },
  zcta5_max_fields: {
    __typename: { __type: 'String!' },
    color: { __type: 'String' },
    intptlat10: { __type: 'String' },
    intptlon10: { __type: 'String' },
    nhood: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
    slug: { __type: 'String' },
  },
  zcta5_min_fields: {
    __typename: { __type: 'String!' },
    color: { __type: 'String' },
    intptlat10: { __type: 'String' },
    intptlon10: { __type: 'String' },
    nhood: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
    slug: { __type: 'String' },
  },
  zcta5_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[zcta5!]!' },
  },
  zcta5_on_conflict: {
    constraint: { __type: 'zcta5_constraint!' },
    update_columns: { __type: '[zcta5_update_column!]!' },
    where: { __type: 'zcta5_bool_exp' },
  },
  zcta5_order_by: {
    color: { __type: 'order_by' },
    intptlat10: { __type: 'order_by' },
    intptlon10: { __type: 'order_by' },
    nhood: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
    slug: { __type: 'order_by' },
    wkb_geometry: { __type: 'order_by' },
  },
  zcta5_pk_columns_input: { ogc_fid: { __type: 'Int!' } },
  zcta5_set_input: {
    color: { __type: 'String' },
    intptlat10: { __type: 'String' },
    intptlon10: { __type: 'String' },
    nhood: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
    slug: { __type: 'String' },
    wkb_geometry: { __type: 'geometry' },
  },
  zcta5_stddev_fields: { __typename: { __type: 'String!' }, ogc_fid: { __type: 'Float' } },
  zcta5_stddev_pop_fields: { __typename: { __type: 'String!' }, ogc_fid: { __type: 'Float' } },
  zcta5_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Float' },
  },
  zcta5_stream_cursor_input: {
    initial_value: { __type: 'zcta5_stream_cursor_value_input!' },
    ordering: { __type: 'cursor_ordering' },
  },
  zcta5_stream_cursor_value_input: {
    color: { __type: 'String' },
    intptlat10: { __type: 'String' },
    intptlon10: { __type: 'String' },
    nhood: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
    slug: { __type: 'String' },
    wkb_geometry: { __type: 'geometry' },
  },
  zcta5_sum_fields: { __typename: { __type: 'String!' }, ogc_fid: { __type: 'Int' } },
  zcta5_updates: {
    _inc: { __type: 'zcta5_inc_input' },
    _set: { __type: 'zcta5_set_input' },
    where: { __type: 'zcta5_bool_exp!' },
  },
  zcta5_var_pop_fields: { __typename: { __type: 'String!' }, ogc_fid: { __type: 'Float' } },
  zcta5_var_samp_fields: { __typename: { __type: 'String!' }, ogc_fid: { __type: 'Float' } },
  zcta5_variance_fields: { __typename: { __type: 'String!' }, ogc_fid: { __type: 'Float' } },
} as const

/**
 * columns and relationships of "boundaries_city"
 */
export interface boundaries_city {
  __typename?: 'boundaries_city'
  name?: Maybe<ScalarsEnums['String']>
  ogc_fid: ScalarsEnums['Int']
  wkb_geometry?: Maybe<ScalarsEnums['geometry']>
}

/**
 * aggregated selection of "boundaries_city"
 */
export interface boundaries_city_aggregate {
  __typename?: 'boundaries_city_aggregate'
  aggregate?: Maybe<boundaries_city_aggregate_fields>
  nodes: Array<boundaries_city>
}

/**
 * aggregate fields of "boundaries_city"
 */
export interface boundaries_city_aggregate_fields {
  __typename?: 'boundaries_city_aggregate_fields'
  avg?: Maybe<boundaries_city_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<boundaries_city_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<boundaries_city_max_fields>
  min?: Maybe<boundaries_city_min_fields>
  stddev?: Maybe<boundaries_city_stddev_fields>
  stddev_pop?: Maybe<boundaries_city_stddev_pop_fields>
  stddev_samp?: Maybe<boundaries_city_stddev_samp_fields>
  sum?: Maybe<boundaries_city_sum_fields>
  var_pop?: Maybe<boundaries_city_var_pop_fields>
  var_samp?: Maybe<boundaries_city_var_samp_fields>
  variance?: Maybe<boundaries_city_variance_fields>
}

/**
 * aggregate avg on columns
 */
export interface boundaries_city_avg_fields {
  __typename?: 'boundaries_city_avg_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate max on columns
 */
export interface boundaries_city_max_fields {
  __typename?: 'boundaries_city_max_fields'
  name?: Maybe<ScalarsEnums['String']>
  ogc_fid?: Maybe<ScalarsEnums['Int']>
}

/**
 * aggregate min on columns
 */
export interface boundaries_city_min_fields {
  __typename?: 'boundaries_city_min_fields'
  name?: Maybe<ScalarsEnums['String']>
  ogc_fid?: Maybe<ScalarsEnums['Int']>
}

/**
 * response of any mutation on the table "boundaries_city"
 */
export interface boundaries_city_mutation_response {
  __typename?: 'boundaries_city_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<boundaries_city>
}

/**
 * aggregate stddev on columns
 */
export interface boundaries_city_stddev_fields {
  __typename?: 'boundaries_city_stddev_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_pop on columns
 */
export interface boundaries_city_stddev_pop_fields {
  __typename?: 'boundaries_city_stddev_pop_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_samp on columns
 */
export interface boundaries_city_stddev_samp_fields {
  __typename?: 'boundaries_city_stddev_samp_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate sum on columns
 */
export interface boundaries_city_sum_fields {
  __typename?: 'boundaries_city_sum_fields'
  ogc_fid?: Maybe<ScalarsEnums['Int']>
}

/**
 * aggregate var_pop on columns
 */
export interface boundaries_city_var_pop_fields {
  __typename?: 'boundaries_city_var_pop_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate var_samp on columns
 */
export interface boundaries_city_var_samp_fields {
  __typename?: 'boundaries_city_var_samp_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate variance on columns
 */
export interface boundaries_city_variance_fields {
  __typename?: 'boundaries_city_variance_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * columns and relationships of "follow"
 */
export interface follow {
  __typename?: 'follow'
  follower_id: ScalarsEnums['uuid']
  following_id: ScalarsEnums['uuid']
  id: ScalarsEnums['uuid']
  /**
   * An object relationship
   */
  user: user
}

/**
 * aggregated selection of "follow"
 */
export interface follow_aggregate {
  __typename?: 'follow_aggregate'
  aggregate?: Maybe<follow_aggregate_fields>
  nodes: Array<follow>
}

/**
 * aggregate fields of "follow"
 */
export interface follow_aggregate_fields {
  __typename?: 'follow_aggregate_fields'
  count: (args?: {
    columns?: Maybe<Array<follow_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<follow_max_fields>
  min?: Maybe<follow_min_fields>
}

/**
 * aggregate max on columns
 */
export interface follow_max_fields {
  __typename?: 'follow_max_fields'
  follower_id?: Maybe<ScalarsEnums['uuid']>
  following_id?: Maybe<ScalarsEnums['uuid']>
  id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * aggregate min on columns
 */
export interface follow_min_fields {
  __typename?: 'follow_min_fields'
  follower_id?: Maybe<ScalarsEnums['uuid']>
  following_id?: Maybe<ScalarsEnums['uuid']>
  id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * response of any mutation on the table "follow"
 */
export interface follow_mutation_response {
  __typename?: 'follow_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<follow>
}

/**
 * columns and relationships of "hrr"
 */
export interface hrr {
  __typename?: 'hrr'
  color?: Maybe<ScalarsEnums['String']>
  hrrcity?: Maybe<ScalarsEnums['String']>
  ogc_fid: ScalarsEnums['Int']
  slug?: Maybe<ScalarsEnums['String']>
  wkb_geometry?: Maybe<ScalarsEnums['geometry']>
}

/**
 * aggregated selection of "hrr"
 */
export interface hrr_aggregate {
  __typename?: 'hrr_aggregate'
  aggregate?: Maybe<hrr_aggregate_fields>
  nodes: Array<hrr>
}

/**
 * aggregate fields of "hrr"
 */
export interface hrr_aggregate_fields {
  __typename?: 'hrr_aggregate_fields'
  avg?: Maybe<hrr_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<hrr_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<hrr_max_fields>
  min?: Maybe<hrr_min_fields>
  stddev?: Maybe<hrr_stddev_fields>
  stddev_pop?: Maybe<hrr_stddev_pop_fields>
  stddev_samp?: Maybe<hrr_stddev_samp_fields>
  sum?: Maybe<hrr_sum_fields>
  var_pop?: Maybe<hrr_var_pop_fields>
  var_samp?: Maybe<hrr_var_samp_fields>
  variance?: Maybe<hrr_variance_fields>
}

/**
 * aggregate avg on columns
 */
export interface hrr_avg_fields {
  __typename?: 'hrr_avg_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate max on columns
 */
export interface hrr_max_fields {
  __typename?: 'hrr_max_fields'
  color?: Maybe<ScalarsEnums['String']>
  hrrcity?: Maybe<ScalarsEnums['String']>
  ogc_fid?: Maybe<ScalarsEnums['Int']>
  slug?: Maybe<ScalarsEnums['String']>
}

/**
 * aggregate min on columns
 */
export interface hrr_min_fields {
  __typename?: 'hrr_min_fields'
  color?: Maybe<ScalarsEnums['String']>
  hrrcity?: Maybe<ScalarsEnums['String']>
  ogc_fid?: Maybe<ScalarsEnums['Int']>
  slug?: Maybe<ScalarsEnums['String']>
}

/**
 * response of any mutation on the table "hrr"
 */
export interface hrr_mutation_response {
  __typename?: 'hrr_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<hrr>
}

/**
 * aggregate stddev on columns
 */
export interface hrr_stddev_fields {
  __typename?: 'hrr_stddev_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_pop on columns
 */
export interface hrr_stddev_pop_fields {
  __typename?: 'hrr_stddev_pop_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_samp on columns
 */
export interface hrr_stddev_samp_fields {
  __typename?: 'hrr_stddev_samp_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate sum on columns
 */
export interface hrr_sum_fields {
  __typename?: 'hrr_sum_fields'
  ogc_fid?: Maybe<ScalarsEnums['Int']>
}

/**
 * aggregate var_pop on columns
 */
export interface hrr_var_pop_fields {
  __typename?: 'hrr_var_pop_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate var_samp on columns
 */
export interface hrr_var_samp_fields {
  __typename?: 'hrr_var_samp_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate variance on columns
 */
export interface hrr_variance_fields {
  __typename?: 'hrr_variance_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * columns and relationships of "list"
 */
export interface list {
  __typename?: 'list'
  color?: Maybe<ScalarsEnums['Int']>
  created_at: ScalarsEnums['timestamptz']
  description?: Maybe<ScalarsEnums['String']>
  font?: Maybe<ScalarsEnums['Int']>
  id: ScalarsEnums['uuid']
  image?: Maybe<ScalarsEnums['String']>
  /**
   * An array relationship
   */
  list_reviews: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<review_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<review_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<review_bool_exp>
  }) => Array<review>
  /**
   * An aggregate relationship
   */
  list_reviews_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<review_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<review_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<review_bool_exp>
  }) => review_aggregate
  location?: Maybe<ScalarsEnums['geometry']>
  name: ScalarsEnums['String']
  public: ScalarsEnums['Boolean']
  region?: Maybe<ScalarsEnums['String']>
  /**
   * An array relationship
   */
  regions: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<list_region_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<list_region_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<list_region_bool_exp>
  }) => Array<list_region>
  /**
   * An aggregate relationship
   */
  regions_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<list_region_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<list_region_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<list_region_bool_exp>
  }) => list_region_aggregate
  /**
   * An array relationship
   */
  restaurants: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<list_restaurant_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<list_restaurant_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<list_restaurant_bool_exp>
  }) => Array<list_restaurant>
  /**
   * An aggregate relationship
   */
  restaurants_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<list_restaurant_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<list_restaurant_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<list_restaurant_bool_exp>
  }) => list_restaurant_aggregate
  slug: ScalarsEnums['String']
  /**
   * An array relationship
   */
  tags: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<list_tag_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<list_tag_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<list_tag_bool_exp>
  }) => Array<list_tag>
  /**
   * An aggregate relationship
   */
  tags_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<list_tag_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<list_tag_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<list_tag_bool_exp>
  }) => list_tag_aggregate
  theme: ScalarsEnums['Int']
  updated_at: ScalarsEnums['timestamptz']
  /**
   * An object relationship
   */
  user?: Maybe<user>
  user_id: ScalarsEnums['uuid']
}

/**
 * aggregated selection of "list"
 */
export interface list_aggregate {
  __typename?: 'list_aggregate'
  aggregate?: Maybe<list_aggregate_fields>
  nodes: Array<list>
}

/**
 * aggregate fields of "list"
 */
export interface list_aggregate_fields {
  __typename?: 'list_aggregate_fields'
  avg?: Maybe<list_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<list_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<list_max_fields>
  min?: Maybe<list_min_fields>
  stddev?: Maybe<list_stddev_fields>
  stddev_pop?: Maybe<list_stddev_pop_fields>
  stddev_samp?: Maybe<list_stddev_samp_fields>
  sum?: Maybe<list_sum_fields>
  var_pop?: Maybe<list_var_pop_fields>
  var_samp?: Maybe<list_var_samp_fields>
  variance?: Maybe<list_variance_fields>
}

/**
 * aggregate avg on columns
 */
export interface list_avg_fields {
  __typename?: 'list_avg_fields'
  color?: Maybe<ScalarsEnums['Float']>
  font?: Maybe<ScalarsEnums['Float']>
  theme?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate max on columns
 */
export interface list_max_fields {
  __typename?: 'list_max_fields'
  color?: Maybe<ScalarsEnums['Int']>
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  description?: Maybe<ScalarsEnums['String']>
  font?: Maybe<ScalarsEnums['Int']>
  id?: Maybe<ScalarsEnums['uuid']>
  image?: Maybe<ScalarsEnums['String']>
  name?: Maybe<ScalarsEnums['String']>
  region?: Maybe<ScalarsEnums['String']>
  slug?: Maybe<ScalarsEnums['String']>
  theme?: Maybe<ScalarsEnums['Int']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
  user_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * aggregate min on columns
 */
export interface list_min_fields {
  __typename?: 'list_min_fields'
  color?: Maybe<ScalarsEnums['Int']>
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  description?: Maybe<ScalarsEnums['String']>
  font?: Maybe<ScalarsEnums['Int']>
  id?: Maybe<ScalarsEnums['uuid']>
  image?: Maybe<ScalarsEnums['String']>
  name?: Maybe<ScalarsEnums['String']>
  region?: Maybe<ScalarsEnums['String']>
  slug?: Maybe<ScalarsEnums['String']>
  theme?: Maybe<ScalarsEnums['Int']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
  user_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * response of any mutation on the table "list"
 */
export interface list_mutation_response {
  __typename?: 'list_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<list>
}

/**
 * columns and relationships of "list_region"
 */
export interface list_region {
  __typename?: 'list_region'
  id: ScalarsEnums['uuid']
  list_id: ScalarsEnums['uuid']
  region: ScalarsEnums['String']
  restaurant_id: ScalarsEnums['uuid']
}

/**
 * aggregated selection of "list_region"
 */
export interface list_region_aggregate {
  __typename?: 'list_region_aggregate'
  aggregate?: Maybe<list_region_aggregate_fields>
  nodes: Array<list_region>
}

/**
 * aggregate fields of "list_region"
 */
export interface list_region_aggregate_fields {
  __typename?: 'list_region_aggregate_fields'
  count: (args?: {
    columns?: Maybe<Array<list_region_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<list_region_max_fields>
  min?: Maybe<list_region_min_fields>
}

/**
 * aggregate max on columns
 */
export interface list_region_max_fields {
  __typename?: 'list_region_max_fields'
  id?: Maybe<ScalarsEnums['uuid']>
  list_id?: Maybe<ScalarsEnums['uuid']>
  region?: Maybe<ScalarsEnums['String']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * aggregate min on columns
 */
export interface list_region_min_fields {
  __typename?: 'list_region_min_fields'
  id?: Maybe<ScalarsEnums['uuid']>
  list_id?: Maybe<ScalarsEnums['uuid']>
  region?: Maybe<ScalarsEnums['String']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * response of any mutation on the table "list_region"
 */
export interface list_region_mutation_response {
  __typename?: 'list_region_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<list_region>
}

/**
 * columns and relationships of "list_restaurant"
 */
export interface list_restaurant {
  __typename?: 'list_restaurant'
  comment?: Maybe<ScalarsEnums['String']>
  id: ScalarsEnums['uuid']
  /**
   * An object relationship
   */
  list: list
  list_id: ScalarsEnums['uuid']
  position?: Maybe<ScalarsEnums['Int']>
  /**
   * An object relationship
   */
  restaurant: restaurant
  restaurant_id: ScalarsEnums['uuid']
  /**
   * An array relationship
   */
  restaurants: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<restaurant_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<restaurant_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<restaurant_bool_exp>
  }) => Array<restaurant>
  /**
   * An aggregate relationship
   */
  restaurants_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<restaurant_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<restaurant_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<restaurant_bool_exp>
  }) => restaurant_aggregate
  /**
   * An array relationship
   */
  tags: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<list_restaurant_tag_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<list_restaurant_tag_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<list_restaurant_tag_bool_exp>
  }) => Array<list_restaurant_tag>
  /**
   * An aggregate relationship
   */
  tags_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<list_restaurant_tag_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<list_restaurant_tag_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<list_restaurant_tag_bool_exp>
  }) => list_restaurant_tag_aggregate
  /**
   * An object relationship
   */
  user: user
  user_id: ScalarsEnums['uuid']
}

/**
 * aggregated selection of "list_restaurant"
 */
export interface list_restaurant_aggregate {
  __typename?: 'list_restaurant_aggregate'
  aggregate?: Maybe<list_restaurant_aggregate_fields>
  nodes: Array<list_restaurant>
}

/**
 * aggregate fields of "list_restaurant"
 */
export interface list_restaurant_aggregate_fields {
  __typename?: 'list_restaurant_aggregate_fields'
  avg?: Maybe<list_restaurant_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<list_restaurant_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<list_restaurant_max_fields>
  min?: Maybe<list_restaurant_min_fields>
  stddev?: Maybe<list_restaurant_stddev_fields>
  stddev_pop?: Maybe<list_restaurant_stddev_pop_fields>
  stddev_samp?: Maybe<list_restaurant_stddev_samp_fields>
  sum?: Maybe<list_restaurant_sum_fields>
  var_pop?: Maybe<list_restaurant_var_pop_fields>
  var_samp?: Maybe<list_restaurant_var_samp_fields>
  variance?: Maybe<list_restaurant_variance_fields>
}

/**
 * aggregate avg on columns
 */
export interface list_restaurant_avg_fields {
  __typename?: 'list_restaurant_avg_fields'
  position?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate max on columns
 */
export interface list_restaurant_max_fields {
  __typename?: 'list_restaurant_max_fields'
  comment?: Maybe<ScalarsEnums['String']>
  id?: Maybe<ScalarsEnums['uuid']>
  list_id?: Maybe<ScalarsEnums['uuid']>
  position?: Maybe<ScalarsEnums['Int']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  user_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * aggregate min on columns
 */
export interface list_restaurant_min_fields {
  __typename?: 'list_restaurant_min_fields'
  comment?: Maybe<ScalarsEnums['String']>
  id?: Maybe<ScalarsEnums['uuid']>
  list_id?: Maybe<ScalarsEnums['uuid']>
  position?: Maybe<ScalarsEnums['Int']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  user_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * response of any mutation on the table "list_restaurant"
 */
export interface list_restaurant_mutation_response {
  __typename?: 'list_restaurant_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<list_restaurant>
}

/**
 * aggregate stddev on columns
 */
export interface list_restaurant_stddev_fields {
  __typename?: 'list_restaurant_stddev_fields'
  position?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_pop on columns
 */
export interface list_restaurant_stddev_pop_fields {
  __typename?: 'list_restaurant_stddev_pop_fields'
  position?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_samp on columns
 */
export interface list_restaurant_stddev_samp_fields {
  __typename?: 'list_restaurant_stddev_samp_fields'
  position?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate sum on columns
 */
export interface list_restaurant_sum_fields {
  __typename?: 'list_restaurant_sum_fields'
  position?: Maybe<ScalarsEnums['Int']>
}

/**
 * columns and relationships of "list_restaurant_tag"
 */
export interface list_restaurant_tag {
  __typename?: 'list_restaurant_tag'
  id: ScalarsEnums['uuid']
  list_id: ScalarsEnums['uuid']
  list_restaurant_id: ScalarsEnums['uuid']
  position: ScalarsEnums['Int']
  /**
   * An object relationship
   */
  restaurant_tag?: Maybe<restaurant_tag>
  restaurant_tag_id: ScalarsEnums['uuid']
  user_id: ScalarsEnums['uuid']
}

/**
 * aggregated selection of "list_restaurant_tag"
 */
export interface list_restaurant_tag_aggregate {
  __typename?: 'list_restaurant_tag_aggregate'
  aggregate?: Maybe<list_restaurant_tag_aggregate_fields>
  nodes: Array<list_restaurant_tag>
}

/**
 * aggregate fields of "list_restaurant_tag"
 */
export interface list_restaurant_tag_aggregate_fields {
  __typename?: 'list_restaurant_tag_aggregate_fields'
  avg?: Maybe<list_restaurant_tag_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<list_restaurant_tag_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<list_restaurant_tag_max_fields>
  min?: Maybe<list_restaurant_tag_min_fields>
  stddev?: Maybe<list_restaurant_tag_stddev_fields>
  stddev_pop?: Maybe<list_restaurant_tag_stddev_pop_fields>
  stddev_samp?: Maybe<list_restaurant_tag_stddev_samp_fields>
  sum?: Maybe<list_restaurant_tag_sum_fields>
  var_pop?: Maybe<list_restaurant_tag_var_pop_fields>
  var_samp?: Maybe<list_restaurant_tag_var_samp_fields>
  variance?: Maybe<list_restaurant_tag_variance_fields>
}

/**
 * aggregate avg on columns
 */
export interface list_restaurant_tag_avg_fields {
  __typename?: 'list_restaurant_tag_avg_fields'
  position?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate max on columns
 */
export interface list_restaurant_tag_max_fields {
  __typename?: 'list_restaurant_tag_max_fields'
  id?: Maybe<ScalarsEnums['uuid']>
  list_id?: Maybe<ScalarsEnums['uuid']>
  list_restaurant_id?: Maybe<ScalarsEnums['uuid']>
  position?: Maybe<ScalarsEnums['Int']>
  restaurant_tag_id?: Maybe<ScalarsEnums['uuid']>
  user_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * aggregate min on columns
 */
export interface list_restaurant_tag_min_fields {
  __typename?: 'list_restaurant_tag_min_fields'
  id?: Maybe<ScalarsEnums['uuid']>
  list_id?: Maybe<ScalarsEnums['uuid']>
  list_restaurant_id?: Maybe<ScalarsEnums['uuid']>
  position?: Maybe<ScalarsEnums['Int']>
  restaurant_tag_id?: Maybe<ScalarsEnums['uuid']>
  user_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * response of any mutation on the table "list_restaurant_tag"
 */
export interface list_restaurant_tag_mutation_response {
  __typename?: 'list_restaurant_tag_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<list_restaurant_tag>
}

/**
 * aggregate stddev on columns
 */
export interface list_restaurant_tag_stddev_fields {
  __typename?: 'list_restaurant_tag_stddev_fields'
  position?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_pop on columns
 */
export interface list_restaurant_tag_stddev_pop_fields {
  __typename?: 'list_restaurant_tag_stddev_pop_fields'
  position?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_samp on columns
 */
export interface list_restaurant_tag_stddev_samp_fields {
  __typename?: 'list_restaurant_tag_stddev_samp_fields'
  position?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate sum on columns
 */
export interface list_restaurant_tag_sum_fields {
  __typename?: 'list_restaurant_tag_sum_fields'
  position?: Maybe<ScalarsEnums['Int']>
}

/**
 * aggregate var_pop on columns
 */
export interface list_restaurant_tag_var_pop_fields {
  __typename?: 'list_restaurant_tag_var_pop_fields'
  position?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate var_samp on columns
 */
export interface list_restaurant_tag_var_samp_fields {
  __typename?: 'list_restaurant_tag_var_samp_fields'
  position?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate variance on columns
 */
export interface list_restaurant_tag_variance_fields {
  __typename?: 'list_restaurant_tag_variance_fields'
  position?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate var_pop on columns
 */
export interface list_restaurant_var_pop_fields {
  __typename?: 'list_restaurant_var_pop_fields'
  position?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate var_samp on columns
 */
export interface list_restaurant_var_samp_fields {
  __typename?: 'list_restaurant_var_samp_fields'
  position?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate variance on columns
 */
export interface list_restaurant_variance_fields {
  __typename?: 'list_restaurant_variance_fields'
  position?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev on columns
 */
export interface list_stddev_fields {
  __typename?: 'list_stddev_fields'
  color?: Maybe<ScalarsEnums['Float']>
  font?: Maybe<ScalarsEnums['Float']>
  theme?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_pop on columns
 */
export interface list_stddev_pop_fields {
  __typename?: 'list_stddev_pop_fields'
  color?: Maybe<ScalarsEnums['Float']>
  font?: Maybe<ScalarsEnums['Float']>
  theme?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_samp on columns
 */
export interface list_stddev_samp_fields {
  __typename?: 'list_stddev_samp_fields'
  color?: Maybe<ScalarsEnums['Float']>
  font?: Maybe<ScalarsEnums['Float']>
  theme?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate sum on columns
 */
export interface list_sum_fields {
  __typename?: 'list_sum_fields'
  color?: Maybe<ScalarsEnums['Int']>
  font?: Maybe<ScalarsEnums['Int']>
  theme?: Maybe<ScalarsEnums['Int']>
}

/**
 * columns and relationships of "list_tag"
 */
export interface list_tag {
  __typename?: 'list_tag'
  created_at: ScalarsEnums['timestamptz']
  id: ScalarsEnums['uuid']
  /**
   * An object relationship
   */
  list?: Maybe<list>
  list_id: ScalarsEnums['uuid']
  /**
   * An object relationship
   */
  tag?: Maybe<tag>
  tag_id: ScalarsEnums['uuid']
}

/**
 * aggregated selection of "list_tag"
 */
export interface list_tag_aggregate {
  __typename?: 'list_tag_aggregate'
  aggregate?: Maybe<list_tag_aggregate_fields>
  nodes: Array<list_tag>
}

/**
 * aggregate fields of "list_tag"
 */
export interface list_tag_aggregate_fields {
  __typename?: 'list_tag_aggregate_fields'
  count: (args?: {
    columns?: Maybe<Array<list_tag_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<list_tag_max_fields>
  min?: Maybe<list_tag_min_fields>
}

/**
 * aggregate max on columns
 */
export interface list_tag_max_fields {
  __typename?: 'list_tag_max_fields'
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  id?: Maybe<ScalarsEnums['uuid']>
  list_id?: Maybe<ScalarsEnums['uuid']>
  tag_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * aggregate min on columns
 */
export interface list_tag_min_fields {
  __typename?: 'list_tag_min_fields'
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  id?: Maybe<ScalarsEnums['uuid']>
  list_id?: Maybe<ScalarsEnums['uuid']>
  tag_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * response of any mutation on the table "list_tag"
 */
export interface list_tag_mutation_response {
  __typename?: 'list_tag_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<list_tag>
}

/**
 * aggregate var_pop on columns
 */
export interface list_var_pop_fields {
  __typename?: 'list_var_pop_fields'
  color?: Maybe<ScalarsEnums['Float']>
  font?: Maybe<ScalarsEnums['Float']>
  theme?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate var_samp on columns
 */
export interface list_var_samp_fields {
  __typename?: 'list_var_samp_fields'
  color?: Maybe<ScalarsEnums['Float']>
  font?: Maybe<ScalarsEnums['Float']>
  theme?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate variance on columns
 */
export interface list_variance_fields {
  __typename?: 'list_variance_fields'
  color?: Maybe<ScalarsEnums['Float']>
  font?: Maybe<ScalarsEnums['Float']>
  theme?: Maybe<ScalarsEnums['Float']>
}

/**
 * columns and relationships of "menu_item"
 */
export interface menu_item {
  __typename?: 'menu_item'
  created_at: ScalarsEnums['timestamptz']
  description?: Maybe<ScalarsEnums['String']>
  id: ScalarsEnums['uuid']
  image?: Maybe<ScalarsEnums['String']>
  location?: Maybe<ScalarsEnums['geometry']>
  name: ScalarsEnums['String']
  price?: Maybe<ScalarsEnums['Int']>
  /**
   * An object relationship
   */
  restaurant: restaurant
  restaurant_id: ScalarsEnums['uuid']
  updated_at: ScalarsEnums['timestamptz']
}

/**
 * aggregated selection of "menu_item"
 */
export interface menu_item_aggregate {
  __typename?: 'menu_item_aggregate'
  aggregate?: Maybe<menu_item_aggregate_fields>
  nodes: Array<menu_item>
}

/**
 * aggregate fields of "menu_item"
 */
export interface menu_item_aggregate_fields {
  __typename?: 'menu_item_aggregate_fields'
  avg?: Maybe<menu_item_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<menu_item_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<menu_item_max_fields>
  min?: Maybe<menu_item_min_fields>
  stddev?: Maybe<menu_item_stddev_fields>
  stddev_pop?: Maybe<menu_item_stddev_pop_fields>
  stddev_samp?: Maybe<menu_item_stddev_samp_fields>
  sum?: Maybe<menu_item_sum_fields>
  var_pop?: Maybe<menu_item_var_pop_fields>
  var_samp?: Maybe<menu_item_var_samp_fields>
  variance?: Maybe<menu_item_variance_fields>
}

/**
 * aggregate avg on columns
 */
export interface menu_item_avg_fields {
  __typename?: 'menu_item_avg_fields'
  price?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate max on columns
 */
export interface menu_item_max_fields {
  __typename?: 'menu_item_max_fields'
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  description?: Maybe<ScalarsEnums['String']>
  id?: Maybe<ScalarsEnums['uuid']>
  image?: Maybe<ScalarsEnums['String']>
  name?: Maybe<ScalarsEnums['String']>
  price?: Maybe<ScalarsEnums['Int']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
}

/**
 * aggregate min on columns
 */
export interface menu_item_min_fields {
  __typename?: 'menu_item_min_fields'
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  description?: Maybe<ScalarsEnums['String']>
  id?: Maybe<ScalarsEnums['uuid']>
  image?: Maybe<ScalarsEnums['String']>
  name?: Maybe<ScalarsEnums['String']>
  price?: Maybe<ScalarsEnums['Int']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
}

/**
 * response of any mutation on the table "menu_item"
 */
export interface menu_item_mutation_response {
  __typename?: 'menu_item_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<menu_item>
}

/**
 * aggregate stddev on columns
 */
export interface menu_item_stddev_fields {
  __typename?: 'menu_item_stddev_fields'
  price?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_pop on columns
 */
export interface menu_item_stddev_pop_fields {
  __typename?: 'menu_item_stddev_pop_fields'
  price?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_samp on columns
 */
export interface menu_item_stddev_samp_fields {
  __typename?: 'menu_item_stddev_samp_fields'
  price?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate sum on columns
 */
export interface menu_item_sum_fields {
  __typename?: 'menu_item_sum_fields'
  price?: Maybe<ScalarsEnums['Int']>
}

/**
 * aggregate var_pop on columns
 */
export interface menu_item_var_pop_fields {
  __typename?: 'menu_item_var_pop_fields'
  price?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate var_samp on columns
 */
export interface menu_item_var_samp_fields {
  __typename?: 'menu_item_var_samp_fields'
  price?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate variance on columns
 */
export interface menu_item_variance_fields {
  __typename?: 'menu_item_variance_fields'
  price?: Maybe<ScalarsEnums['Float']>
}

export interface Mutation {
  __typename?: 'Mutation'
  delete_boundaries_city: (args: {
    where: boundaries_city_bool_exp
  }) => Maybe<boundaries_city_mutation_response>
  delete_boundaries_city_by_pk: (args: { ogc_fid: Scalars['Int'] }) => Maybe<boundaries_city>
  delete_follow: (args: { where: follow_bool_exp }) => Maybe<follow_mutation_response>
  delete_follow_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<follow>
  delete_hrr: (args: { where: hrr_bool_exp }) => Maybe<hrr_mutation_response>
  delete_hrr_by_pk: (args: { ogc_fid: Scalars['Int'] }) => Maybe<hrr>
  delete_list: (args: { where: list_bool_exp }) => Maybe<list_mutation_response>
  delete_list_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<list>
  delete_list_region: (args: {
    where: list_region_bool_exp
  }) => Maybe<list_region_mutation_response>
  delete_list_region_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<list_region>
  delete_list_restaurant: (args: {
    where: list_restaurant_bool_exp
  }) => Maybe<list_restaurant_mutation_response>
  delete_list_restaurant_by_pk: (args: {
    list_id: Scalars['uuid']
    restaurant_id: Scalars['uuid']
  }) => Maybe<list_restaurant>
  delete_list_restaurant_tag: (args: {
    where: list_restaurant_tag_bool_exp
  }) => Maybe<list_restaurant_tag_mutation_response>
  delete_list_restaurant_tag_by_pk: (args: {
    id: Scalars['uuid']
  }) => Maybe<list_restaurant_tag>
  delete_list_tag: (args: { where: list_tag_bool_exp }) => Maybe<list_tag_mutation_response>
  delete_list_tag_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<list_tag>
  delete_menu_item: (args: { where: menu_item_bool_exp }) => Maybe<menu_item_mutation_response>
  delete_menu_item_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<menu_item>
  delete_nhood_labels: (args: {
    where: nhood_labels_bool_exp
  }) => Maybe<nhood_labels_mutation_response>
  delete_nhood_labels_by_pk: (args: { ogc_fid: Scalars['Int'] }) => Maybe<nhood_labels>
  delete_opening_hours: (args: {
    where: opening_hours_bool_exp
  }) => Maybe<opening_hours_mutation_response>
  delete_opening_hours_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<opening_hours>
  delete_photo: (args: { where: photo_bool_exp }) => Maybe<photo_mutation_response>
  delete_photo_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<photo>
  delete_photo_xref: (args: {
    where: photo_xref_bool_exp
  }) => Maybe<photo_xref_mutation_response>
  delete_photo_xref_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<photo_xref>
  delete_restaurant: (args: {
    where: restaurant_bool_exp
  }) => Maybe<restaurant_mutation_response>
  delete_restaurant_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<restaurant>
  delete_restaurant_tag: (args: {
    where: restaurant_tag_bool_exp
  }) => Maybe<restaurant_tag_mutation_response>
  delete_restaurant_tag_by_pk: (args: {
    restaurant_id: Scalars['uuid']
    tag_id: Scalars['uuid']
  }) => Maybe<restaurant_tag>
  delete_review: (args: { where: review_bool_exp }) => Maybe<review_mutation_response>
  delete_review_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<review>
  delete_review_tag_sentence: (args: {
    where: review_tag_sentence_bool_exp
  }) => Maybe<review_tag_sentence_mutation_response>
  delete_review_tag_sentence_by_pk: (args: {
    id: Scalars['uuid']
  }) => Maybe<review_tag_sentence>
  delete_setting: (args: { where: setting_bool_exp }) => Maybe<setting_mutation_response>
  delete_setting_by_pk: (args: { key: Scalars['String'] }) => Maybe<setting>
  delete_tag: (args: { where: tag_bool_exp }) => Maybe<tag_mutation_response>
  delete_tag_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<tag>
  delete_tag_tag: (args: { where: tag_tag_bool_exp }) => Maybe<tag_tag_mutation_response>
  delete_tag_tag_by_pk: (args: {
    category_tag_id: Scalars['uuid']
    tag_id: Scalars['uuid']
  }) => Maybe<tag_tag>
  delete_user: (args: { where: user_bool_exp }) => Maybe<user_mutation_response>
  delete_user_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<user>
  delete_zcta5: (args: { where: zcta5_bool_exp }) => Maybe<zcta5_mutation_response>
  delete_zcta5_by_pk: (args: { ogc_fid: Scalars['Int'] }) => Maybe<zcta5>
  insert_boundaries_city: (args: {
    objects: Array<boundaries_city_insert_input>
    on_conflict?: Maybe<boundaries_city_on_conflict>
  }) => Maybe<boundaries_city_mutation_response>
  insert_boundaries_city_one: (args: {
    object: boundaries_city_insert_input
    on_conflict?: Maybe<boundaries_city_on_conflict>
  }) => Maybe<boundaries_city>
  insert_follow: (args: {
    objects: Array<follow_insert_input>
    on_conflict?: Maybe<follow_on_conflict>
  }) => Maybe<follow_mutation_response>
  insert_follow_one: (args: {
    object: follow_insert_input
    on_conflict?: Maybe<follow_on_conflict>
  }) => Maybe<follow>
  insert_hrr: (args: {
    objects: Array<hrr_insert_input>
    on_conflict?: Maybe<hrr_on_conflict>
  }) => Maybe<hrr_mutation_response>
  insert_hrr_one: (args: {
    object: hrr_insert_input
    on_conflict?: Maybe<hrr_on_conflict>
  }) => Maybe<hrr>
  insert_list: (args: {
    objects: Array<list_insert_input>
    on_conflict?: Maybe<list_on_conflict>
  }) => Maybe<list_mutation_response>
  insert_list_one: (args: {
    object: list_insert_input
    on_conflict?: Maybe<list_on_conflict>
  }) => Maybe<list>
  insert_list_region: (args: {
    objects: Array<list_region_insert_input>
    on_conflict?: Maybe<list_region_on_conflict>
  }) => Maybe<list_region_mutation_response>
  insert_list_region_one: (args: {
    object: list_region_insert_input
    on_conflict?: Maybe<list_region_on_conflict>
  }) => Maybe<list_region>
  insert_list_restaurant: (args: {
    objects: Array<list_restaurant_insert_input>
    on_conflict?: Maybe<list_restaurant_on_conflict>
  }) => Maybe<list_restaurant_mutation_response>
  insert_list_restaurant_one: (args: {
    object: list_restaurant_insert_input
    on_conflict?: Maybe<list_restaurant_on_conflict>
  }) => Maybe<list_restaurant>
  insert_list_restaurant_tag: (args: {
    objects: Array<list_restaurant_tag_insert_input>
    on_conflict?: Maybe<list_restaurant_tag_on_conflict>
  }) => Maybe<list_restaurant_tag_mutation_response>
  insert_list_restaurant_tag_one: (args: {
    object: list_restaurant_tag_insert_input
    on_conflict?: Maybe<list_restaurant_tag_on_conflict>
  }) => Maybe<list_restaurant_tag>
  insert_list_tag: (args: {
    objects: Array<list_tag_insert_input>
    on_conflict?: Maybe<list_tag_on_conflict>
  }) => Maybe<list_tag_mutation_response>
  insert_list_tag_one: (args: {
    object: list_tag_insert_input
    on_conflict?: Maybe<list_tag_on_conflict>
  }) => Maybe<list_tag>
  insert_menu_item: (args: {
    objects: Array<menu_item_insert_input>
    on_conflict?: Maybe<menu_item_on_conflict>
  }) => Maybe<menu_item_mutation_response>
  insert_menu_item_one: (args: {
    object: menu_item_insert_input
    on_conflict?: Maybe<menu_item_on_conflict>
  }) => Maybe<menu_item>
  insert_nhood_labels: (args: {
    objects: Array<nhood_labels_insert_input>
    on_conflict?: Maybe<nhood_labels_on_conflict>
  }) => Maybe<nhood_labels_mutation_response>
  insert_nhood_labels_one: (args: {
    object: nhood_labels_insert_input
    on_conflict?: Maybe<nhood_labels_on_conflict>
  }) => Maybe<nhood_labels>
  insert_opening_hours: (args: {
    objects: Array<opening_hours_insert_input>
    on_conflict?: Maybe<opening_hours_on_conflict>
  }) => Maybe<opening_hours_mutation_response>
  insert_opening_hours_one: (args: {
    object: opening_hours_insert_input
    on_conflict?: Maybe<opening_hours_on_conflict>
  }) => Maybe<opening_hours>
  insert_photo: (args: {
    objects: Array<photo_insert_input>
    on_conflict?: Maybe<photo_on_conflict>
  }) => Maybe<photo_mutation_response>
  insert_photo_one: (args: {
    object: photo_insert_input
    on_conflict?: Maybe<photo_on_conflict>
  }) => Maybe<photo>
  insert_photo_xref: (args: {
    objects: Array<photo_xref_insert_input>
    on_conflict?: Maybe<photo_xref_on_conflict>
  }) => Maybe<photo_xref_mutation_response>
  insert_photo_xref_one: (args: {
    object: photo_xref_insert_input
    on_conflict?: Maybe<photo_xref_on_conflict>
  }) => Maybe<photo_xref>
  insert_restaurant: (args: {
    objects: Array<restaurant_insert_input>
    on_conflict?: Maybe<restaurant_on_conflict>
  }) => Maybe<restaurant_mutation_response>
  insert_restaurant_one: (args: {
    object: restaurant_insert_input
    on_conflict?: Maybe<restaurant_on_conflict>
  }) => Maybe<restaurant>
  insert_restaurant_tag: (args: {
    objects: Array<restaurant_tag_insert_input>
    on_conflict?: Maybe<restaurant_tag_on_conflict>
  }) => Maybe<restaurant_tag_mutation_response>
  insert_restaurant_tag_one: (args: {
    object: restaurant_tag_insert_input
    on_conflict?: Maybe<restaurant_tag_on_conflict>
  }) => Maybe<restaurant_tag>
  insert_review: (args: {
    objects: Array<review_insert_input>
    on_conflict?: Maybe<review_on_conflict>
  }) => Maybe<review_mutation_response>
  insert_review_one: (args: {
    object: review_insert_input
    on_conflict?: Maybe<review_on_conflict>
  }) => Maybe<review>
  insert_review_tag_sentence: (args: {
    objects: Array<review_tag_sentence_insert_input>
    on_conflict?: Maybe<review_tag_sentence_on_conflict>
  }) => Maybe<review_tag_sentence_mutation_response>
  insert_review_tag_sentence_one: (args: {
    object: review_tag_sentence_insert_input
    on_conflict?: Maybe<review_tag_sentence_on_conflict>
  }) => Maybe<review_tag_sentence>
  insert_setting: (args: {
    objects: Array<setting_insert_input>
    on_conflict?: Maybe<setting_on_conflict>
  }) => Maybe<setting_mutation_response>
  insert_setting_one: (args: {
    object: setting_insert_input
    on_conflict?: Maybe<setting_on_conflict>
  }) => Maybe<setting>
  insert_tag: (args: {
    objects: Array<tag_insert_input>
    on_conflict?: Maybe<tag_on_conflict>
  }) => Maybe<tag_mutation_response>
  insert_tag_one: (args: {
    object: tag_insert_input
    on_conflict?: Maybe<tag_on_conflict>
  }) => Maybe<tag>
  insert_tag_tag: (args: {
    objects: Array<tag_tag_insert_input>
    on_conflict?: Maybe<tag_tag_on_conflict>
  }) => Maybe<tag_tag_mutation_response>
  insert_tag_tag_one: (args: {
    object: tag_tag_insert_input
    on_conflict?: Maybe<tag_tag_on_conflict>
  }) => Maybe<tag_tag>
  insert_user: (args: {
    objects: Array<user_insert_input>
    on_conflict?: Maybe<user_on_conflict>
  }) => Maybe<user_mutation_response>
  insert_user_one: (args: {
    object: user_insert_input
    on_conflict?: Maybe<user_on_conflict>
  }) => Maybe<user>
  insert_zcta5: (args: {
    objects: Array<zcta5_insert_input>
    on_conflict?: Maybe<zcta5_on_conflict>
  }) => Maybe<zcta5_mutation_response>
  insert_zcta5_one: (args: {
    object: zcta5_insert_input
    on_conflict?: Maybe<zcta5_on_conflict>
  }) => Maybe<zcta5>
  update_boundaries_city: (args: {
    _inc?: Maybe<boundaries_city_inc_input>
    _set?: Maybe<boundaries_city_set_input>
    where: boundaries_city_bool_exp
  }) => Maybe<boundaries_city_mutation_response>
  update_boundaries_city_by_pk: (args: {
    _inc?: Maybe<boundaries_city_inc_input>
    _set?: Maybe<boundaries_city_set_input>
    pk_columns: boundaries_city_pk_columns_input
  }) => Maybe<boundaries_city>
  update_boundaries_city_many: (args: {
    updates: Array<boundaries_city_updates>
  }) => Maybe<Array<Maybe<boundaries_city_mutation_response>>>
  update_follow: (args: {
    _set?: Maybe<follow_set_input>
    where: follow_bool_exp
  }) => Maybe<follow_mutation_response>
  update_follow_by_pk: (args: {
    _set?: Maybe<follow_set_input>
    pk_columns: follow_pk_columns_input
  }) => Maybe<follow>
  update_follow_many: (args: {
    updates: Array<follow_updates>
  }) => Maybe<Array<Maybe<follow_mutation_response>>>
  update_hrr: (args: {
    _inc?: Maybe<hrr_inc_input>
    _set?: Maybe<hrr_set_input>
    where: hrr_bool_exp
  }) => Maybe<hrr_mutation_response>
  update_hrr_by_pk: (args: {
    _inc?: Maybe<hrr_inc_input>
    _set?: Maybe<hrr_set_input>
    pk_columns: hrr_pk_columns_input
  }) => Maybe<hrr>
  update_hrr_many: (args: {
    updates: Array<hrr_updates>
  }) => Maybe<Array<Maybe<hrr_mutation_response>>>
  update_list: (args: {
    _inc?: Maybe<list_inc_input>
    _set?: Maybe<list_set_input>
    where: list_bool_exp
  }) => Maybe<list_mutation_response>
  update_list_by_pk: (args: {
    _inc?: Maybe<list_inc_input>
    _set?: Maybe<list_set_input>
    pk_columns: list_pk_columns_input
  }) => Maybe<list>
  update_list_many: (args: {
    updates: Array<list_updates>
  }) => Maybe<Array<Maybe<list_mutation_response>>>
  update_list_region: (args: {
    _set?: Maybe<list_region_set_input>
    where: list_region_bool_exp
  }) => Maybe<list_region_mutation_response>
  update_list_region_by_pk: (args: {
    _set?: Maybe<list_region_set_input>
    pk_columns: list_region_pk_columns_input
  }) => Maybe<list_region>
  update_list_region_many: (args: {
    updates: Array<list_region_updates>
  }) => Maybe<Array<Maybe<list_region_mutation_response>>>
  update_list_restaurant: (args: {
    _inc?: Maybe<list_restaurant_inc_input>
    _set?: Maybe<list_restaurant_set_input>
    where: list_restaurant_bool_exp
  }) => Maybe<list_restaurant_mutation_response>
  update_list_restaurant_by_pk: (args: {
    _inc?: Maybe<list_restaurant_inc_input>
    _set?: Maybe<list_restaurant_set_input>
    pk_columns: list_restaurant_pk_columns_input
  }) => Maybe<list_restaurant>
  update_list_restaurant_many: (args: {
    updates: Array<list_restaurant_updates>
  }) => Maybe<Array<Maybe<list_restaurant_mutation_response>>>
  update_list_restaurant_tag: (args: {
    _inc?: Maybe<list_restaurant_tag_inc_input>
    _set?: Maybe<list_restaurant_tag_set_input>
    where: list_restaurant_tag_bool_exp
  }) => Maybe<list_restaurant_tag_mutation_response>
  update_list_restaurant_tag_by_pk: (args: {
    _inc?: Maybe<list_restaurant_tag_inc_input>
    _set?: Maybe<list_restaurant_tag_set_input>
    pk_columns: list_restaurant_tag_pk_columns_input
  }) => Maybe<list_restaurant_tag>
  update_list_restaurant_tag_many: (args: {
    updates: Array<list_restaurant_tag_updates>
  }) => Maybe<Array<Maybe<list_restaurant_tag_mutation_response>>>
  update_list_tag: (args: {
    _set?: Maybe<list_tag_set_input>
    where: list_tag_bool_exp
  }) => Maybe<list_tag_mutation_response>
  update_list_tag_by_pk: (args: {
    _set?: Maybe<list_tag_set_input>
    pk_columns: list_tag_pk_columns_input
  }) => Maybe<list_tag>
  update_list_tag_many: (args: {
    updates: Array<list_tag_updates>
  }) => Maybe<Array<Maybe<list_tag_mutation_response>>>
  update_menu_item: (args: {
    _inc?: Maybe<menu_item_inc_input>
    _set?: Maybe<menu_item_set_input>
    where: menu_item_bool_exp
  }) => Maybe<menu_item_mutation_response>
  update_menu_item_by_pk: (args: {
    _inc?: Maybe<menu_item_inc_input>
    _set?: Maybe<menu_item_set_input>
    pk_columns: menu_item_pk_columns_input
  }) => Maybe<menu_item>
  update_menu_item_many: (args: {
    updates: Array<menu_item_updates>
  }) => Maybe<Array<Maybe<menu_item_mutation_response>>>
  update_nhood_labels: (args: {
    _inc?: Maybe<nhood_labels_inc_input>
    _set?: Maybe<nhood_labels_set_input>
    where: nhood_labels_bool_exp
  }) => Maybe<nhood_labels_mutation_response>
  update_nhood_labels_by_pk: (args: {
    _inc?: Maybe<nhood_labels_inc_input>
    _set?: Maybe<nhood_labels_set_input>
    pk_columns: nhood_labels_pk_columns_input
  }) => Maybe<nhood_labels>
  update_nhood_labels_many: (args: {
    updates: Array<nhood_labels_updates>
  }) => Maybe<Array<Maybe<nhood_labels_mutation_response>>>
  update_opening_hours: (args: {
    _set?: Maybe<opening_hours_set_input>
    where: opening_hours_bool_exp
  }) => Maybe<opening_hours_mutation_response>
  update_opening_hours_by_pk: (args: {
    _set?: Maybe<opening_hours_set_input>
    pk_columns: opening_hours_pk_columns_input
  }) => Maybe<opening_hours>
  update_opening_hours_many: (args: {
    updates: Array<opening_hours_updates>
  }) => Maybe<Array<Maybe<opening_hours_mutation_response>>>
  update_photo: (args: {
    _append?: Maybe<photo_append_input>
    _delete_at_path?: Maybe<photo_delete_at_path_input>
    _delete_elem?: Maybe<photo_delete_elem_input>
    _delete_key?: Maybe<photo_delete_key_input>
    _inc?: Maybe<photo_inc_input>
    _prepend?: Maybe<photo_prepend_input>
    _set?: Maybe<photo_set_input>
    where: photo_bool_exp
  }) => Maybe<photo_mutation_response>
  update_photo_by_pk: (args: {
    _append?: Maybe<photo_append_input>
    _delete_at_path?: Maybe<photo_delete_at_path_input>
    _delete_elem?: Maybe<photo_delete_elem_input>
    _delete_key?: Maybe<photo_delete_key_input>
    _inc?: Maybe<photo_inc_input>
    _prepend?: Maybe<photo_prepend_input>
    _set?: Maybe<photo_set_input>
    pk_columns: photo_pk_columns_input
  }) => Maybe<photo>
  update_photo_many: (args: {
    updates: Array<photo_updates>
  }) => Maybe<Array<Maybe<photo_mutation_response>>>
  update_photo_xref: (args: {
    _set?: Maybe<photo_xref_set_input>
    where: photo_xref_bool_exp
  }) => Maybe<photo_xref_mutation_response>
  update_photo_xref_by_pk: (args: {
    _set?: Maybe<photo_xref_set_input>
    pk_columns: photo_xref_pk_columns_input
  }) => Maybe<photo_xref>
  update_photo_xref_many: (args: {
    updates: Array<photo_xref_updates>
  }) => Maybe<Array<Maybe<photo_xref_mutation_response>>>
  update_restaurant: (args: {
    _append?: Maybe<restaurant_append_input>
    _delete_at_path?: Maybe<restaurant_delete_at_path_input>
    _delete_elem?: Maybe<restaurant_delete_elem_input>
    _delete_key?: Maybe<restaurant_delete_key_input>
    _inc?: Maybe<restaurant_inc_input>
    _prepend?: Maybe<restaurant_prepend_input>
    _set?: Maybe<restaurant_set_input>
    where: restaurant_bool_exp
  }) => Maybe<restaurant_mutation_response>
  update_restaurant_by_pk: (args: {
    _append?: Maybe<restaurant_append_input>
    _delete_at_path?: Maybe<restaurant_delete_at_path_input>
    _delete_elem?: Maybe<restaurant_delete_elem_input>
    _delete_key?: Maybe<restaurant_delete_key_input>
    _inc?: Maybe<restaurant_inc_input>
    _prepend?: Maybe<restaurant_prepend_input>
    _set?: Maybe<restaurant_set_input>
    pk_columns: restaurant_pk_columns_input
  }) => Maybe<restaurant>
  update_restaurant_many: (args: {
    updates: Array<restaurant_updates>
  }) => Maybe<Array<Maybe<restaurant_mutation_response>>>
  update_restaurant_tag: (args: {
    _append?: Maybe<restaurant_tag_append_input>
    _delete_at_path?: Maybe<restaurant_tag_delete_at_path_input>
    _delete_elem?: Maybe<restaurant_tag_delete_elem_input>
    _delete_key?: Maybe<restaurant_tag_delete_key_input>
    _inc?: Maybe<restaurant_tag_inc_input>
    _prepend?: Maybe<restaurant_tag_prepend_input>
    _set?: Maybe<restaurant_tag_set_input>
    where: restaurant_tag_bool_exp
  }) => Maybe<restaurant_tag_mutation_response>
  update_restaurant_tag_by_pk: (args: {
    _append?: Maybe<restaurant_tag_append_input>
    _delete_at_path?: Maybe<restaurant_tag_delete_at_path_input>
    _delete_elem?: Maybe<restaurant_tag_delete_elem_input>
    _delete_key?: Maybe<restaurant_tag_delete_key_input>
    _inc?: Maybe<restaurant_tag_inc_input>
    _prepend?: Maybe<restaurant_tag_prepend_input>
    _set?: Maybe<restaurant_tag_set_input>
    pk_columns: restaurant_tag_pk_columns_input
  }) => Maybe<restaurant_tag>
  update_restaurant_tag_many: (args: {
    updates: Array<restaurant_tag_updates>
  }) => Maybe<Array<Maybe<restaurant_tag_mutation_response>>>
  update_review: (args: {
    _append?: Maybe<review_append_input>
    _delete_at_path?: Maybe<review_delete_at_path_input>
    _delete_elem?: Maybe<review_delete_elem_input>
    _delete_key?: Maybe<review_delete_key_input>
    _inc?: Maybe<review_inc_input>
    _prepend?: Maybe<review_prepend_input>
    _set?: Maybe<review_set_input>
    where: review_bool_exp
  }) => Maybe<review_mutation_response>
  update_review_by_pk: (args: {
    _append?: Maybe<review_append_input>
    _delete_at_path?: Maybe<review_delete_at_path_input>
    _delete_elem?: Maybe<review_delete_elem_input>
    _delete_key?: Maybe<review_delete_key_input>
    _inc?: Maybe<review_inc_input>
    _prepend?: Maybe<review_prepend_input>
    _set?: Maybe<review_set_input>
    pk_columns: review_pk_columns_input
  }) => Maybe<review>
  update_review_many: (args: {
    updates: Array<review_updates>
  }) => Maybe<Array<Maybe<review_mutation_response>>>
  update_review_tag_sentence: (args: {
    _inc?: Maybe<review_tag_sentence_inc_input>
    _set?: Maybe<review_tag_sentence_set_input>
    where: review_tag_sentence_bool_exp
  }) => Maybe<review_tag_sentence_mutation_response>
  update_review_tag_sentence_by_pk: (args: {
    _inc?: Maybe<review_tag_sentence_inc_input>
    _set?: Maybe<review_tag_sentence_set_input>
    pk_columns: review_tag_sentence_pk_columns_input
  }) => Maybe<review_tag_sentence>
  update_review_tag_sentence_many: (args: {
    updates: Array<review_tag_sentence_updates>
  }) => Maybe<Array<Maybe<review_tag_sentence_mutation_response>>>
  update_setting: (args: {
    _append?: Maybe<setting_append_input>
    _delete_at_path?: Maybe<setting_delete_at_path_input>
    _delete_elem?: Maybe<setting_delete_elem_input>
    _delete_key?: Maybe<setting_delete_key_input>
    _prepend?: Maybe<setting_prepend_input>
    _set?: Maybe<setting_set_input>
    where: setting_bool_exp
  }) => Maybe<setting_mutation_response>
  update_setting_by_pk: (args: {
    _append?: Maybe<setting_append_input>
    _delete_at_path?: Maybe<setting_delete_at_path_input>
    _delete_elem?: Maybe<setting_delete_elem_input>
    _delete_key?: Maybe<setting_delete_key_input>
    _prepend?: Maybe<setting_prepend_input>
    _set?: Maybe<setting_set_input>
    pk_columns: setting_pk_columns_input
  }) => Maybe<setting>
  update_setting_many: (args: {
    updates: Array<setting_updates>
  }) => Maybe<Array<Maybe<setting_mutation_response>>>
  update_tag: (args: {
    _append?: Maybe<tag_append_input>
    _delete_at_path?: Maybe<tag_delete_at_path_input>
    _delete_elem?: Maybe<tag_delete_elem_input>
    _delete_key?: Maybe<tag_delete_key_input>
    _inc?: Maybe<tag_inc_input>
    _prepend?: Maybe<tag_prepend_input>
    _set?: Maybe<tag_set_input>
    where: tag_bool_exp
  }) => Maybe<tag_mutation_response>
  update_tag_by_pk: (args: {
    _append?: Maybe<tag_append_input>
    _delete_at_path?: Maybe<tag_delete_at_path_input>
    _delete_elem?: Maybe<tag_delete_elem_input>
    _delete_key?: Maybe<tag_delete_key_input>
    _inc?: Maybe<tag_inc_input>
    _prepend?: Maybe<tag_prepend_input>
    _set?: Maybe<tag_set_input>
    pk_columns: tag_pk_columns_input
  }) => Maybe<tag>
  update_tag_many: (args: {
    updates: Array<tag_updates>
  }) => Maybe<Array<Maybe<tag_mutation_response>>>
  update_tag_tag: (args: {
    _set?: Maybe<tag_tag_set_input>
    where: tag_tag_bool_exp
  }) => Maybe<tag_tag_mutation_response>
  update_tag_tag_by_pk: (args: {
    _set?: Maybe<tag_tag_set_input>
    pk_columns: tag_tag_pk_columns_input
  }) => Maybe<tag_tag>
  update_tag_tag_many: (args: {
    updates: Array<tag_tag_updates>
  }) => Maybe<Array<Maybe<tag_tag_mutation_response>>>
  update_user: (args: {
    _inc?: Maybe<user_inc_input>
    _set?: Maybe<user_set_input>
    where: user_bool_exp
  }) => Maybe<user_mutation_response>
  update_user_by_pk: (args: {
    _inc?: Maybe<user_inc_input>
    _set?: Maybe<user_set_input>
    pk_columns: user_pk_columns_input
  }) => Maybe<user>
  update_user_many: (args: {
    updates: Array<user_updates>
  }) => Maybe<Array<Maybe<user_mutation_response>>>
  update_zcta5: (args: {
    _inc?: Maybe<zcta5_inc_input>
    _set?: Maybe<zcta5_set_input>
    where: zcta5_bool_exp
  }) => Maybe<zcta5_mutation_response>
  update_zcta5_by_pk: (args: {
    _inc?: Maybe<zcta5_inc_input>
    _set?: Maybe<zcta5_set_input>
    pk_columns: zcta5_pk_columns_input
  }) => Maybe<zcta5>
  update_zcta5_many: (args: {
    updates: Array<zcta5_updates>
  }) => Maybe<Array<Maybe<zcta5_mutation_response>>>
}

/**
 * columns and relationships of "nhood_labels"
 */
export interface nhood_labels {
  __typename?: 'nhood_labels'
  center: ScalarsEnums['geometry']
  name: ScalarsEnums['String']
  ogc_fid: ScalarsEnums['Int']
}

/**
 * aggregated selection of "nhood_labels"
 */
export interface nhood_labels_aggregate {
  __typename?: 'nhood_labels_aggregate'
  aggregate?: Maybe<nhood_labels_aggregate_fields>
  nodes: Array<nhood_labels>
}

/**
 * aggregate fields of "nhood_labels"
 */
export interface nhood_labels_aggregate_fields {
  __typename?: 'nhood_labels_aggregate_fields'
  avg?: Maybe<nhood_labels_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<nhood_labels_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<nhood_labels_max_fields>
  min?: Maybe<nhood_labels_min_fields>
  stddev?: Maybe<nhood_labels_stddev_fields>
  stddev_pop?: Maybe<nhood_labels_stddev_pop_fields>
  stddev_samp?: Maybe<nhood_labels_stddev_samp_fields>
  sum?: Maybe<nhood_labels_sum_fields>
  var_pop?: Maybe<nhood_labels_var_pop_fields>
  var_samp?: Maybe<nhood_labels_var_samp_fields>
  variance?: Maybe<nhood_labels_variance_fields>
}

/**
 * aggregate avg on columns
 */
export interface nhood_labels_avg_fields {
  __typename?: 'nhood_labels_avg_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate max on columns
 */
export interface nhood_labels_max_fields {
  __typename?: 'nhood_labels_max_fields'
  name?: Maybe<ScalarsEnums['String']>
  ogc_fid?: Maybe<ScalarsEnums['Int']>
}

/**
 * aggregate min on columns
 */
export interface nhood_labels_min_fields {
  __typename?: 'nhood_labels_min_fields'
  name?: Maybe<ScalarsEnums['String']>
  ogc_fid?: Maybe<ScalarsEnums['Int']>
}

/**
 * response of any mutation on the table "nhood_labels"
 */
export interface nhood_labels_mutation_response {
  __typename?: 'nhood_labels_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<nhood_labels>
}

/**
 * aggregate stddev on columns
 */
export interface nhood_labels_stddev_fields {
  __typename?: 'nhood_labels_stddev_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_pop on columns
 */
export interface nhood_labels_stddev_pop_fields {
  __typename?: 'nhood_labels_stddev_pop_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_samp on columns
 */
export interface nhood_labels_stddev_samp_fields {
  __typename?: 'nhood_labels_stddev_samp_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate sum on columns
 */
export interface nhood_labels_sum_fields {
  __typename?: 'nhood_labels_sum_fields'
  ogc_fid?: Maybe<ScalarsEnums['Int']>
}

/**
 * aggregate var_pop on columns
 */
export interface nhood_labels_var_pop_fields {
  __typename?: 'nhood_labels_var_pop_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate var_samp on columns
 */
export interface nhood_labels_var_samp_fields {
  __typename?: 'nhood_labels_var_samp_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate variance on columns
 */
export interface nhood_labels_variance_fields {
  __typename?: 'nhood_labels_variance_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * columns and relationships of "opening_hours"
 */
export interface opening_hours {
  __typename?: 'opening_hours'
  hours: ScalarsEnums['tsrange']
  id: ScalarsEnums['uuid']
  /**
   * An object relationship
   */
  restaurant: restaurant
  restaurant_id: ScalarsEnums['uuid']
}

/**
 * aggregated selection of "opening_hours"
 */
export interface opening_hours_aggregate {
  __typename?: 'opening_hours_aggregate'
  aggregate?: Maybe<opening_hours_aggregate_fields>
  nodes: Array<opening_hours>
}

/**
 * aggregate fields of "opening_hours"
 */
export interface opening_hours_aggregate_fields {
  __typename?: 'opening_hours_aggregate_fields'
  count: (args?: {
    columns?: Maybe<Array<opening_hours_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<opening_hours_max_fields>
  min?: Maybe<opening_hours_min_fields>
}

/**
 * aggregate max on columns
 */
export interface opening_hours_max_fields {
  __typename?: 'opening_hours_max_fields'
  id?: Maybe<ScalarsEnums['uuid']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * aggregate min on columns
 */
export interface opening_hours_min_fields {
  __typename?: 'opening_hours_min_fields'
  id?: Maybe<ScalarsEnums['uuid']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * response of any mutation on the table "opening_hours"
 */
export interface opening_hours_mutation_response {
  __typename?: 'opening_hours_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<opening_hours>
}

/**
 * columns and relationships of "photo"
 */
export interface photo {
  __typename?: 'photo'
  categories?: Maybe<ScalarsEnums['jsonb']>
  created_at: ScalarsEnums['timestamptz']
  id: ScalarsEnums['uuid']
  origin?: Maybe<ScalarsEnums['String']>
  quality?: Maybe<ScalarsEnums['numeric']>
  updated_at: ScalarsEnums['timestamptz']
  url?: Maybe<ScalarsEnums['String']>
  user_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * aggregated selection of "photo"
 */
export interface photo_aggregate {
  __typename?: 'photo_aggregate'
  aggregate?: Maybe<photo_aggregate_fields>
  nodes: Array<photo>
}

/**
 * aggregate fields of "photo"
 */
export interface photo_aggregate_fields {
  __typename?: 'photo_aggregate_fields'
  avg?: Maybe<photo_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<photo_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<photo_max_fields>
  min?: Maybe<photo_min_fields>
  stddev?: Maybe<photo_stddev_fields>
  stddev_pop?: Maybe<photo_stddev_pop_fields>
  stddev_samp?: Maybe<photo_stddev_samp_fields>
  sum?: Maybe<photo_sum_fields>
  var_pop?: Maybe<photo_var_pop_fields>
  var_samp?: Maybe<photo_var_samp_fields>
  variance?: Maybe<photo_variance_fields>
}

/**
 * aggregate avg on columns
 */
export interface photo_avg_fields {
  __typename?: 'photo_avg_fields'
  quality?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate max on columns
 */
export interface photo_max_fields {
  __typename?: 'photo_max_fields'
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  id?: Maybe<ScalarsEnums['uuid']>
  origin?: Maybe<ScalarsEnums['String']>
  quality?: Maybe<ScalarsEnums['numeric']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
  url?: Maybe<ScalarsEnums['String']>
  user_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * aggregate min on columns
 */
export interface photo_min_fields {
  __typename?: 'photo_min_fields'
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  id?: Maybe<ScalarsEnums['uuid']>
  origin?: Maybe<ScalarsEnums['String']>
  quality?: Maybe<ScalarsEnums['numeric']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
  url?: Maybe<ScalarsEnums['String']>
  user_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * response of any mutation on the table "photo"
 */
export interface photo_mutation_response {
  __typename?: 'photo_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<photo>
}

/**
 * aggregate stddev on columns
 */
export interface photo_stddev_fields {
  __typename?: 'photo_stddev_fields'
  quality?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_pop on columns
 */
export interface photo_stddev_pop_fields {
  __typename?: 'photo_stddev_pop_fields'
  quality?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_samp on columns
 */
export interface photo_stddev_samp_fields {
  __typename?: 'photo_stddev_samp_fields'
  quality?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate sum on columns
 */
export interface photo_sum_fields {
  __typename?: 'photo_sum_fields'
  quality?: Maybe<ScalarsEnums['numeric']>
}

/**
 * aggregate var_pop on columns
 */
export interface photo_var_pop_fields {
  __typename?: 'photo_var_pop_fields'
  quality?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate var_samp on columns
 */
export interface photo_var_samp_fields {
  __typename?: 'photo_var_samp_fields'
  quality?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate variance on columns
 */
export interface photo_variance_fields {
  __typename?: 'photo_variance_fields'
  quality?: Maybe<ScalarsEnums['Float']>
}

/**
 * columns and relationships of "photo_xref"
 */
export interface photo_xref {
  __typename?: 'photo_xref'
  id: ScalarsEnums['uuid']
  /**
   * An object relationship
   */
  photo: photo
  photo_id: ScalarsEnums['uuid']
  /**
   * An object relationship
   */
  restaurant: restaurant
  restaurant_id: ScalarsEnums['uuid']
  review_id?: Maybe<ScalarsEnums['uuid']>
  tag_id: ScalarsEnums['uuid']
  type?: Maybe<ScalarsEnums['String']>
  user_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * aggregated selection of "photo_xref"
 */
export interface photo_xref_aggregate {
  __typename?: 'photo_xref_aggregate'
  aggregate?: Maybe<photo_xref_aggregate_fields>
  nodes: Array<photo_xref>
}

/**
 * aggregate fields of "photo_xref"
 */
export interface photo_xref_aggregate_fields {
  __typename?: 'photo_xref_aggregate_fields'
  count: (args?: {
    columns?: Maybe<Array<photo_xref_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<photo_xref_max_fields>
  min?: Maybe<photo_xref_min_fields>
}

/**
 * aggregate max on columns
 */
export interface photo_xref_max_fields {
  __typename?: 'photo_xref_max_fields'
  id?: Maybe<ScalarsEnums['uuid']>
  photo_id?: Maybe<ScalarsEnums['uuid']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  review_id?: Maybe<ScalarsEnums['uuid']>
  tag_id?: Maybe<ScalarsEnums['uuid']>
  type?: Maybe<ScalarsEnums['String']>
  user_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * aggregate min on columns
 */
export interface photo_xref_min_fields {
  __typename?: 'photo_xref_min_fields'
  id?: Maybe<ScalarsEnums['uuid']>
  photo_id?: Maybe<ScalarsEnums['uuid']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  review_id?: Maybe<ScalarsEnums['uuid']>
  tag_id?: Maybe<ScalarsEnums['uuid']>
  type?: Maybe<ScalarsEnums['String']>
  user_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * response of any mutation on the table "photo_xref"
 */
export interface photo_xref_mutation_response {
  __typename?: 'photo_xref_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<photo_xref>
}

export interface Query {
  __typename?: 'Query'
  boundaries_city: (args?: {
    distinct_on?: Maybe<Array<boundaries_city_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<boundaries_city_order_by>>
    where?: Maybe<boundaries_city_bool_exp>
  }) => Array<boundaries_city>
  boundaries_city_aggregate: (args?: {
    distinct_on?: Maybe<Array<boundaries_city_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<boundaries_city_order_by>>
    where?: Maybe<boundaries_city_bool_exp>
  }) => boundaries_city_aggregate
  boundaries_city_by_pk: (args: { ogc_fid: Scalars['Int'] }) => Maybe<boundaries_city>
  follow: (args?: {
    distinct_on?: Maybe<Array<follow_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<follow_order_by>>
    where?: Maybe<follow_bool_exp>
  }) => Array<follow>
  follow_aggregate: (args?: {
    distinct_on?: Maybe<Array<follow_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<follow_order_by>>
    where?: Maybe<follow_bool_exp>
  }) => follow_aggregate
  follow_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<follow>
  hrr: (args?: {
    distinct_on?: Maybe<Array<hrr_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<hrr_order_by>>
    where?: Maybe<hrr_bool_exp>
  }) => Array<hrr>
  hrr_aggregate: (args?: {
    distinct_on?: Maybe<Array<hrr_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<hrr_order_by>>
    where?: Maybe<hrr_bool_exp>
  }) => hrr_aggregate
  hrr_by_pk: (args: { ogc_fid: Scalars['Int'] }) => Maybe<hrr>
  list: (args?: {
    distinct_on?: Maybe<Array<list_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_order_by>>
    where?: Maybe<list_bool_exp>
  }) => Array<list>
  list_aggregate: (args?: {
    distinct_on?: Maybe<Array<list_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_order_by>>
    where?: Maybe<list_bool_exp>
  }) => list_aggregate
  list_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<list>
  list_populated: (args: {
    args: list_populated_args
    distinct_on?: Maybe<Array<list_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_order_by>>
    where?: Maybe<list_bool_exp>
  }) => Array<list>
  list_populated_aggregate: (args: {
    args: list_populated_args
    distinct_on?: Maybe<Array<list_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_order_by>>
    where?: Maybe<list_bool_exp>
  }) => list_aggregate
  list_region: (args?: {
    distinct_on?: Maybe<Array<list_region_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_region_order_by>>
    where?: Maybe<list_region_bool_exp>
  }) => Array<list_region>
  list_region_aggregate: (args?: {
    distinct_on?: Maybe<Array<list_region_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_region_order_by>>
    where?: Maybe<list_region_bool_exp>
  }) => list_region_aggregate
  list_region_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<list_region>
  list_restaurant: (args?: {
    distinct_on?: Maybe<Array<list_restaurant_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_restaurant_order_by>>
    where?: Maybe<list_restaurant_bool_exp>
  }) => Array<list_restaurant>
  list_restaurant_aggregate: (args?: {
    distinct_on?: Maybe<Array<list_restaurant_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_restaurant_order_by>>
    where?: Maybe<list_restaurant_bool_exp>
  }) => list_restaurant_aggregate
  list_restaurant_by_pk: (args: {
    list_id: Scalars['uuid']
    restaurant_id: Scalars['uuid']
  }) => Maybe<list_restaurant>
  list_restaurant_tag: (args?: {
    distinct_on?: Maybe<Array<list_restaurant_tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_restaurant_tag_order_by>>
    where?: Maybe<list_restaurant_tag_bool_exp>
  }) => Array<list_restaurant_tag>
  list_restaurant_tag_aggregate: (args?: {
    distinct_on?: Maybe<Array<list_restaurant_tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_restaurant_tag_order_by>>
    where?: Maybe<list_restaurant_tag_bool_exp>
  }) => list_restaurant_tag_aggregate
  list_restaurant_tag_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<list_restaurant_tag>
  list_tag: (args?: {
    distinct_on?: Maybe<Array<list_tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_tag_order_by>>
    where?: Maybe<list_tag_bool_exp>
  }) => Array<list_tag>
  list_tag_aggregate: (args?: {
    distinct_on?: Maybe<Array<list_tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_tag_order_by>>
    where?: Maybe<list_tag_bool_exp>
  }) => list_tag_aggregate
  list_tag_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<list_tag>
  menu_item: (args?: {
    distinct_on?: Maybe<Array<menu_item_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<menu_item_order_by>>
    where?: Maybe<menu_item_bool_exp>
  }) => Array<menu_item>
  menu_item_aggregate: (args?: {
    distinct_on?: Maybe<Array<menu_item_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<menu_item_order_by>>
    where?: Maybe<menu_item_bool_exp>
  }) => menu_item_aggregate
  menu_item_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<menu_item>
  nhood_labels: (args?: {
    distinct_on?: Maybe<Array<nhood_labels_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<nhood_labels_order_by>>
    where?: Maybe<nhood_labels_bool_exp>
  }) => Array<nhood_labels>
  nhood_labels_aggregate: (args?: {
    distinct_on?: Maybe<Array<nhood_labels_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<nhood_labels_order_by>>
    where?: Maybe<nhood_labels_bool_exp>
  }) => nhood_labels_aggregate
  nhood_labels_by_pk: (args: { ogc_fid: Scalars['Int'] }) => Maybe<nhood_labels>
  opening_hours: (args?: {
    distinct_on?: Maybe<Array<opening_hours_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<opening_hours_order_by>>
    where?: Maybe<opening_hours_bool_exp>
  }) => Array<opening_hours>
  opening_hours_aggregate: (args?: {
    distinct_on?: Maybe<Array<opening_hours_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<opening_hours_order_by>>
    where?: Maybe<opening_hours_bool_exp>
  }) => opening_hours_aggregate
  opening_hours_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<opening_hours>
  photo: (args?: {
    distinct_on?: Maybe<Array<photo_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<photo_order_by>>
    where?: Maybe<photo_bool_exp>
  }) => Array<photo>
  photo_aggregate: (args?: {
    distinct_on?: Maybe<Array<photo_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<photo_order_by>>
    where?: Maybe<photo_bool_exp>
  }) => photo_aggregate
  photo_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<photo>
  photo_xref: (args?: {
    distinct_on?: Maybe<Array<photo_xref_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<photo_xref_order_by>>
    where?: Maybe<photo_xref_bool_exp>
  }) => Array<photo_xref>
  photo_xref_aggregate: (args?: {
    distinct_on?: Maybe<Array<photo_xref_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<photo_xref_order_by>>
    where?: Maybe<photo_xref_bool_exp>
  }) => photo_xref_aggregate
  photo_xref_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<photo_xref>
  restaurant: (args?: {
    distinct_on?: Maybe<Array<restaurant_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_order_by>>
    where?: Maybe<restaurant_bool_exp>
  }) => Array<restaurant>
  restaurant_aggregate: (args?: {
    distinct_on?: Maybe<Array<restaurant_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_order_by>>
    where?: Maybe<restaurant_bool_exp>
  }) => restaurant_aggregate
  restaurant_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<restaurant>
  restaurant_new: (args: {
    args: restaurant_new_args
    distinct_on?: Maybe<Array<restaurant_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_order_by>>
    where?: Maybe<restaurant_bool_exp>
  }) => Array<restaurant>
  restaurant_new_aggregate: (args: {
    args: restaurant_new_args
    distinct_on?: Maybe<Array<restaurant_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_order_by>>
    where?: Maybe<restaurant_bool_exp>
  }) => restaurant_aggregate
  restaurant_tag: (args?: {
    distinct_on?: Maybe<Array<restaurant_tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    where?: Maybe<restaurant_tag_bool_exp>
  }) => Array<restaurant_tag>
  restaurant_tag_aggregate: (args?: {
    distinct_on?: Maybe<Array<restaurant_tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    where?: Maybe<restaurant_tag_bool_exp>
  }) => restaurant_tag_aggregate
  restaurant_tag_by_pk: (args: {
    restaurant_id: Scalars['uuid']
    tag_id: Scalars['uuid']
  }) => Maybe<restaurant_tag>
  restaurant_top_tags: (args: {
    args: restaurant_top_tags_args
    distinct_on?: Maybe<Array<restaurant_tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    where?: Maybe<restaurant_tag_bool_exp>
  }) => Array<restaurant_tag>
  restaurant_top_tags_aggregate: (args: {
    args: restaurant_top_tags_args
    distinct_on?: Maybe<Array<restaurant_tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    where?: Maybe<restaurant_tag_bool_exp>
  }) => restaurant_tag_aggregate
  restaurant_trending: (args: {
    args: restaurant_trending_args
    distinct_on?: Maybe<Array<restaurant_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_order_by>>
    where?: Maybe<restaurant_bool_exp>
  }) => Array<restaurant>
  restaurant_trending_aggregate: (args: {
    args: restaurant_trending_args
    distinct_on?: Maybe<Array<restaurant_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_order_by>>
    where?: Maybe<restaurant_bool_exp>
  }) => restaurant_aggregate
  restaurant_with_tags: (args: {
    args: restaurant_with_tags_args
    distinct_on?: Maybe<Array<restaurant_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_order_by>>
    where?: Maybe<restaurant_bool_exp>
  }) => Array<restaurant>
  restaurant_with_tags_aggregate: (args: {
    args: restaurant_with_tags_args
    distinct_on?: Maybe<Array<restaurant_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_order_by>>
    where?: Maybe<restaurant_bool_exp>
  }) => restaurant_aggregate
  review: (args?: {
    distinct_on?: Maybe<Array<review_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<review_order_by>>
    where?: Maybe<review_bool_exp>
  }) => Array<review>
  review_aggregate: (args?: {
    distinct_on?: Maybe<Array<review_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<review_order_by>>
    where?: Maybe<review_bool_exp>
  }) => review_aggregate
  review_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<review>
  review_tag_sentence: (args?: {
    distinct_on?: Maybe<Array<review_tag_sentence_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<review_tag_sentence_order_by>>
    where?: Maybe<review_tag_sentence_bool_exp>
  }) => Array<review_tag_sentence>
  review_tag_sentence_aggregate: (args?: {
    distinct_on?: Maybe<Array<review_tag_sentence_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<review_tag_sentence_order_by>>
    where?: Maybe<review_tag_sentence_bool_exp>
  }) => review_tag_sentence_aggregate
  review_tag_sentence_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<review_tag_sentence>
  setting: (args?: {
    distinct_on?: Maybe<Array<setting_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<setting_order_by>>
    where?: Maybe<setting_bool_exp>
  }) => Array<setting>
  setting_aggregate: (args?: {
    distinct_on?: Maybe<Array<setting_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<setting_order_by>>
    where?: Maybe<setting_bool_exp>
  }) => setting_aggregate
  setting_by_pk: (args: { key: Scalars['String'] }) => Maybe<setting>
  tag: (args?: {
    distinct_on?: Maybe<Array<tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<tag_order_by>>
    where?: Maybe<tag_bool_exp>
  }) => Array<tag>
  tag_aggregate: (args?: {
    distinct_on?: Maybe<Array<tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<tag_order_by>>
    where?: Maybe<tag_bool_exp>
  }) => tag_aggregate
  tag_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<tag>
  tag_tag: (args?: {
    distinct_on?: Maybe<Array<tag_tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<tag_tag_order_by>>
    where?: Maybe<tag_tag_bool_exp>
  }) => Array<tag_tag>
  tag_tag_aggregate: (args?: {
    distinct_on?: Maybe<Array<tag_tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<tag_tag_order_by>>
    where?: Maybe<tag_tag_bool_exp>
  }) => tag_tag_aggregate
  tag_tag_by_pk: (args: {
    category_tag_id: Scalars['uuid']
    tag_id: Scalars['uuid']
  }) => Maybe<tag_tag>
  user: (args?: {
    distinct_on?: Maybe<Array<user_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<user_order_by>>
    where?: Maybe<user_bool_exp>
  }) => Array<user>
  user_aggregate: (args?: {
    distinct_on?: Maybe<Array<user_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<user_order_by>>
    where?: Maybe<user_bool_exp>
  }) => user_aggregate
  user_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<user>
  zcta5: (args?: {
    distinct_on?: Maybe<Array<zcta5_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<zcta5_order_by>>
    where?: Maybe<zcta5_bool_exp>
  }) => Array<zcta5>
  zcta5_aggregate: (args?: {
    distinct_on?: Maybe<Array<zcta5_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<zcta5_order_by>>
    where?: Maybe<zcta5_bool_exp>
  }) => zcta5_aggregate
  zcta5_by_pk: (args: { ogc_fid: Scalars['Int'] }) => Maybe<zcta5>
}

/**
 * columns and relationships of "restaurant"
 */
export interface restaurant {
  __typename?: 'restaurant'
  address?: Maybe<ScalarsEnums['String']>
  city?: Maybe<ScalarsEnums['String']>
  created_at: ScalarsEnums['timestamptz']
  description?: Maybe<ScalarsEnums['String']>
  downvotes?: Maybe<ScalarsEnums['numeric']>
  external_source_info?: Maybe<ScalarsEnums['jsonb']>
  geocoder_id?: Maybe<ScalarsEnums['String']>
  headlines?: Maybe<ScalarsEnums['jsonb']>
  hours?: Maybe<ScalarsEnums['jsonb']>
  id: ScalarsEnums['uuid']
  image?: Maybe<ScalarsEnums['String']>
  /**
   * A computed field, executes function "is_restaurant_open"
   */
  is_open_now?: Maybe<ScalarsEnums['Boolean']>
  is_out_of_business?: Maybe<ScalarsEnums['Boolean']>
  /**
   * An array relationship
   */
  lists: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<list_restaurant_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<list_restaurant_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<list_restaurant_bool_exp>
  }) => Array<list_restaurant>
  /**
   * An aggregate relationship
   */
  lists_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<list_restaurant_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<list_restaurant_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<list_restaurant_bool_exp>
  }) => list_restaurant_aggregate
  location: ScalarsEnums['geometry']
  /**
   * An array relationship
   */
  menu_items: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<menu_item_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<menu_item_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<menu_item_bool_exp>
  }) => Array<menu_item>
  /**
   * An aggregate relationship
   */
  menu_items_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<menu_item_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<menu_item_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<menu_item_bool_exp>
  }) => menu_item_aggregate
  name: ScalarsEnums['String']
  og_source_ids?: Maybe<ScalarsEnums['jsonb']>
  oldest_review_date?: Maybe<ScalarsEnums['timestamptz']>
  /**
   * An array relationship
   */
  photo_table: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<photo_xref_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<photo_xref_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<photo_xref_bool_exp>
  }) => Array<photo_xref>
  /**
   * An aggregate relationship
   */
  photo_table_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<photo_xref_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<photo_xref_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<photo_xref_bool_exp>
  }) => photo_xref_aggregate
  photos?: Maybe<ScalarsEnums['jsonb']>
  price_range?: Maybe<ScalarsEnums['String']>
  rating?: Maybe<ScalarsEnums['numeric']>
  rating_factors?: Maybe<ScalarsEnums['jsonb']>
  /**
   * An array relationship
   */
  reviews: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<review_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<review_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<review_bool_exp>
  }) => Array<review>
  /**
   * An aggregate relationship
   */
  reviews_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<review_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<review_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<review_bool_exp>
  }) => review_aggregate
  score?: Maybe<ScalarsEnums['numeric']>
  score_breakdown?: Maybe<ScalarsEnums['jsonb']>
  scrape_metadata?: Maybe<ScalarsEnums['jsonb']>
  slug?: Maybe<ScalarsEnums['String']>
  source_breakdown?: Maybe<ScalarsEnums['jsonb']>
  sources?: Maybe<ScalarsEnums['jsonb']>
  state?: Maybe<ScalarsEnums['String']>
  summary?: Maybe<ScalarsEnums['String']>
  tag_names?: Maybe<ScalarsEnums['jsonb']>
  /**
   * An array relationship
   */
  tags: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<restaurant_tag_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<restaurant_tag_bool_exp>
  }) => Array<restaurant_tag>
  /**
   * An aggregate relationship
   */
  tags_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<restaurant_tag_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<restaurant_tag_bool_exp>
  }) => restaurant_tag_aggregate
  telephone?: Maybe<ScalarsEnums['String']>
  top_tags: (args: {
    /**
     * input parameters for computed field "top_tags" defined on table "restaurant"
     */
    args: top_tags_restaurant_args
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<restaurant_tag_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<restaurant_tag_bool_exp>
  }) => Maybe<Array<restaurant_tag>>
  updated_at: ScalarsEnums['timestamptz']
  upvotes?: Maybe<ScalarsEnums['numeric']>
  votes_ratio?: Maybe<ScalarsEnums['numeric']>
  website?: Maybe<ScalarsEnums['String']>
  zip?: Maybe<ScalarsEnums['numeric']>
}

/**
 * aggregated selection of "restaurant"
 */
export interface restaurant_aggregate {
  __typename?: 'restaurant_aggregate'
  aggregate?: Maybe<restaurant_aggregate_fields>
  nodes: Array<restaurant>
}

/**
 * aggregate fields of "restaurant"
 */
export interface restaurant_aggregate_fields {
  __typename?: 'restaurant_aggregate_fields'
  avg?: Maybe<restaurant_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<restaurant_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<restaurant_max_fields>
  min?: Maybe<restaurant_min_fields>
  stddev?: Maybe<restaurant_stddev_fields>
  stddev_pop?: Maybe<restaurant_stddev_pop_fields>
  stddev_samp?: Maybe<restaurant_stddev_samp_fields>
  sum?: Maybe<restaurant_sum_fields>
  var_pop?: Maybe<restaurant_var_pop_fields>
  var_samp?: Maybe<restaurant_var_samp_fields>
  variance?: Maybe<restaurant_variance_fields>
}

/**
 * aggregate avg on columns
 */
export interface restaurant_avg_fields {
  __typename?: 'restaurant_avg_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
  zip?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate max on columns
 */
export interface restaurant_max_fields {
  __typename?: 'restaurant_max_fields'
  address?: Maybe<ScalarsEnums['String']>
  city?: Maybe<ScalarsEnums['String']>
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  description?: Maybe<ScalarsEnums['String']>
  downvotes?: Maybe<ScalarsEnums['numeric']>
  geocoder_id?: Maybe<ScalarsEnums['String']>
  id?: Maybe<ScalarsEnums['uuid']>
  image?: Maybe<ScalarsEnums['String']>
  name?: Maybe<ScalarsEnums['String']>
  oldest_review_date?: Maybe<ScalarsEnums['timestamptz']>
  price_range?: Maybe<ScalarsEnums['String']>
  rating?: Maybe<ScalarsEnums['numeric']>
  score?: Maybe<ScalarsEnums['numeric']>
  slug?: Maybe<ScalarsEnums['String']>
  state?: Maybe<ScalarsEnums['String']>
  summary?: Maybe<ScalarsEnums['String']>
  telephone?: Maybe<ScalarsEnums['String']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
  upvotes?: Maybe<ScalarsEnums['numeric']>
  votes_ratio?: Maybe<ScalarsEnums['numeric']>
  website?: Maybe<ScalarsEnums['String']>
  zip?: Maybe<ScalarsEnums['numeric']>
}

/**
 * aggregate min on columns
 */
export interface restaurant_min_fields {
  __typename?: 'restaurant_min_fields'
  address?: Maybe<ScalarsEnums['String']>
  city?: Maybe<ScalarsEnums['String']>
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  description?: Maybe<ScalarsEnums['String']>
  downvotes?: Maybe<ScalarsEnums['numeric']>
  geocoder_id?: Maybe<ScalarsEnums['String']>
  id?: Maybe<ScalarsEnums['uuid']>
  image?: Maybe<ScalarsEnums['String']>
  name?: Maybe<ScalarsEnums['String']>
  oldest_review_date?: Maybe<ScalarsEnums['timestamptz']>
  price_range?: Maybe<ScalarsEnums['String']>
  rating?: Maybe<ScalarsEnums['numeric']>
  score?: Maybe<ScalarsEnums['numeric']>
  slug?: Maybe<ScalarsEnums['String']>
  state?: Maybe<ScalarsEnums['String']>
  summary?: Maybe<ScalarsEnums['String']>
  telephone?: Maybe<ScalarsEnums['String']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
  upvotes?: Maybe<ScalarsEnums['numeric']>
  votes_ratio?: Maybe<ScalarsEnums['numeric']>
  website?: Maybe<ScalarsEnums['String']>
  zip?: Maybe<ScalarsEnums['numeric']>
}

/**
 * response of any mutation on the table "restaurant"
 */
export interface restaurant_mutation_response {
  __typename?: 'restaurant_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<restaurant>
}

/**
 * aggregate stddev on columns
 */
export interface restaurant_stddev_fields {
  __typename?: 'restaurant_stddev_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
  zip?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_pop on columns
 */
export interface restaurant_stddev_pop_fields {
  __typename?: 'restaurant_stddev_pop_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
  zip?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_samp on columns
 */
export interface restaurant_stddev_samp_fields {
  __typename?: 'restaurant_stddev_samp_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
  zip?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate sum on columns
 */
export interface restaurant_sum_fields {
  __typename?: 'restaurant_sum_fields'
  downvotes?: Maybe<ScalarsEnums['numeric']>
  rating?: Maybe<ScalarsEnums['numeric']>
  score?: Maybe<ScalarsEnums['numeric']>
  upvotes?: Maybe<ScalarsEnums['numeric']>
  votes_ratio?: Maybe<ScalarsEnums['numeric']>
  zip?: Maybe<ScalarsEnums['numeric']>
}

/**
 * columns and relationships of "restaurant_tag"
 */
export interface restaurant_tag {
  __typename?: 'restaurant_tag'
  downvotes?: Maybe<ScalarsEnums['numeric']>
  id: ScalarsEnums['uuid']
  photos?: Maybe<ScalarsEnums['jsonb']>
  rank?: Maybe<ScalarsEnums['Int']>
  rating?: Maybe<ScalarsEnums['numeric']>
  /**
   * An object relationship
   */
  restaurant: restaurant
  restaurant_id: ScalarsEnums['uuid']
  review_mentions_count?: Maybe<ScalarsEnums['numeric']>
  /**
   * An array relationship
   */
  reviews: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<review_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<review_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<review_bool_exp>
  }) => Array<review>
  /**
   * An aggregate relationship
   */
  reviews_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<review_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<review_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<review_bool_exp>
  }) => review_aggregate
  score?: Maybe<ScalarsEnums['numeric']>
  score_breakdown?: Maybe<ScalarsEnums['jsonb']>
  /**
   * An array relationship
   */
  sentences: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<review_tag_sentence_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<review_tag_sentence_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<review_tag_sentence_bool_exp>
  }) => Array<review_tag_sentence>
  /**
   * An aggregate relationship
   */
  sentences_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<review_tag_sentence_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<review_tag_sentence_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<review_tag_sentence_bool_exp>
  }) => review_tag_sentence_aggregate
  source_breakdown?: Maybe<ScalarsEnums['jsonb']>
  /**
   * An object relationship
   */
  tag: tag
  tag_id: ScalarsEnums['uuid']
  upvotes?: Maybe<ScalarsEnums['numeric']>
  votes_ratio?: Maybe<ScalarsEnums['numeric']>
}

/**
 * aggregated selection of "restaurant_tag"
 */
export interface restaurant_tag_aggregate {
  __typename?: 'restaurant_tag_aggregate'
  aggregate?: Maybe<restaurant_tag_aggregate_fields>
  nodes: Array<restaurant_tag>
}

/**
 * aggregate fields of "restaurant_tag"
 */
export interface restaurant_tag_aggregate_fields {
  __typename?: 'restaurant_tag_aggregate_fields'
  avg?: Maybe<restaurant_tag_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<restaurant_tag_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<restaurant_tag_max_fields>
  min?: Maybe<restaurant_tag_min_fields>
  stddev?: Maybe<restaurant_tag_stddev_fields>
  stddev_pop?: Maybe<restaurant_tag_stddev_pop_fields>
  stddev_samp?: Maybe<restaurant_tag_stddev_samp_fields>
  sum?: Maybe<restaurant_tag_sum_fields>
  var_pop?: Maybe<restaurant_tag_var_pop_fields>
  var_samp?: Maybe<restaurant_tag_var_samp_fields>
  variance?: Maybe<restaurant_tag_variance_fields>
}

/**
 * aggregate avg on columns
 */
export interface restaurant_tag_avg_fields {
  __typename?: 'restaurant_tag_avg_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rank?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  review_mentions_count?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate max on columns
 */
export interface restaurant_tag_max_fields {
  __typename?: 'restaurant_tag_max_fields'
  downvotes?: Maybe<ScalarsEnums['numeric']>
  id?: Maybe<ScalarsEnums['uuid']>
  rank?: Maybe<ScalarsEnums['Int']>
  rating?: Maybe<ScalarsEnums['numeric']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  review_mentions_count?: Maybe<ScalarsEnums['numeric']>
  score?: Maybe<ScalarsEnums['numeric']>
  tag_id?: Maybe<ScalarsEnums['uuid']>
  upvotes?: Maybe<ScalarsEnums['numeric']>
  votes_ratio?: Maybe<ScalarsEnums['numeric']>
}

/**
 * aggregate min on columns
 */
export interface restaurant_tag_min_fields {
  __typename?: 'restaurant_tag_min_fields'
  downvotes?: Maybe<ScalarsEnums['numeric']>
  id?: Maybe<ScalarsEnums['uuid']>
  rank?: Maybe<ScalarsEnums['Int']>
  rating?: Maybe<ScalarsEnums['numeric']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  review_mentions_count?: Maybe<ScalarsEnums['numeric']>
  score?: Maybe<ScalarsEnums['numeric']>
  tag_id?: Maybe<ScalarsEnums['uuid']>
  upvotes?: Maybe<ScalarsEnums['numeric']>
  votes_ratio?: Maybe<ScalarsEnums['numeric']>
}

/**
 * response of any mutation on the table "restaurant_tag"
 */
export interface restaurant_tag_mutation_response {
  __typename?: 'restaurant_tag_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<restaurant_tag>
}

/**
 * aggregate stddev on columns
 */
export interface restaurant_tag_stddev_fields {
  __typename?: 'restaurant_tag_stddev_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rank?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  review_mentions_count?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_pop on columns
 */
export interface restaurant_tag_stddev_pop_fields {
  __typename?: 'restaurant_tag_stddev_pop_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rank?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  review_mentions_count?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_samp on columns
 */
export interface restaurant_tag_stddev_samp_fields {
  __typename?: 'restaurant_tag_stddev_samp_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rank?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  review_mentions_count?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate sum on columns
 */
export interface restaurant_tag_sum_fields {
  __typename?: 'restaurant_tag_sum_fields'
  downvotes?: Maybe<ScalarsEnums['numeric']>
  rank?: Maybe<ScalarsEnums['Int']>
  rating?: Maybe<ScalarsEnums['numeric']>
  review_mentions_count?: Maybe<ScalarsEnums['numeric']>
  score?: Maybe<ScalarsEnums['numeric']>
  upvotes?: Maybe<ScalarsEnums['numeric']>
  votes_ratio?: Maybe<ScalarsEnums['numeric']>
}

/**
 * aggregate var_pop on columns
 */
export interface restaurant_tag_var_pop_fields {
  __typename?: 'restaurant_tag_var_pop_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rank?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  review_mentions_count?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate var_samp on columns
 */
export interface restaurant_tag_var_samp_fields {
  __typename?: 'restaurant_tag_var_samp_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rank?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  review_mentions_count?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate variance on columns
 */
export interface restaurant_tag_variance_fields {
  __typename?: 'restaurant_tag_variance_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rank?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  review_mentions_count?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate var_pop on columns
 */
export interface restaurant_var_pop_fields {
  __typename?: 'restaurant_var_pop_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
  zip?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate var_samp on columns
 */
export interface restaurant_var_samp_fields {
  __typename?: 'restaurant_var_samp_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
  zip?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate variance on columns
 */
export interface restaurant_variance_fields {
  __typename?: 'restaurant_variance_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
  zip?: Maybe<ScalarsEnums['Float']>
}

/**
 * columns and relationships of "review"
 */
export interface review {
  __typename?: 'review'
  authored_at: ScalarsEnums['timestamptz']
  categories?: Maybe<ScalarsEnums['jsonb']>
  favorited?: Maybe<ScalarsEnums['Boolean']>
  id: ScalarsEnums['uuid']
  /**
   * An object relationship
   */
  list?: Maybe<list>
  list_id?: Maybe<ScalarsEnums['uuid']>
  location?: Maybe<ScalarsEnums['geometry']>
  native_data_unique_key?: Maybe<ScalarsEnums['String']>
  /**
   * An array relationship
   */
  photos: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<photo_xref_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<photo_xref_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<photo_xref_bool_exp>
  }) => Array<photo_xref>
  /**
   * An aggregate relationship
   */
  photos_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<photo_xref_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<photo_xref_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<photo_xref_bool_exp>
  }) => photo_xref_aggregate
  rating?: Maybe<ScalarsEnums['numeric']>
  /**
   * An object relationship
   */
  restaurant?: Maybe<restaurant>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  /**
   * An array relationship
   */
  reviews: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<review_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<review_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<review_bool_exp>
  }) => Array<review>
  /**
   * An aggregate relationship
   */
  reviews_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<review_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<review_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<review_bool_exp>
  }) => review_aggregate
  /**
   * An array relationship
   */
  sentiments: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<review_tag_sentence_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<review_tag_sentence_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<review_tag_sentence_bool_exp>
  }) => Array<review_tag_sentence>
  /**
   * An aggregate relationship
   */
  sentiments_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<review_tag_sentence_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<review_tag_sentence_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<review_tag_sentence_bool_exp>
  }) => review_tag_sentence_aggregate
  source?: Maybe<ScalarsEnums['String']>
  /**
   * An object relationship
   */
  tag?: Maybe<tag>
  tag_id?: Maybe<ScalarsEnums['uuid']>
  text?: Maybe<ScalarsEnums['String']>
  type?: Maybe<ScalarsEnums['String']>
  updated_at: ScalarsEnums['timestamptz']
  /**
   * An object relationship
   */
  user: user
  user_id: ScalarsEnums['uuid']
  username?: Maybe<ScalarsEnums['String']>
  vote?: Maybe<ScalarsEnums['numeric']>
}

/**
 * aggregated selection of "review"
 */
export interface review_aggregate {
  __typename?: 'review_aggregate'
  aggregate?: Maybe<review_aggregate_fields>
  nodes: Array<review>
}

/**
 * aggregate fields of "review"
 */
export interface review_aggregate_fields {
  __typename?: 'review_aggregate_fields'
  avg?: Maybe<review_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<review_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<review_max_fields>
  min?: Maybe<review_min_fields>
  stddev?: Maybe<review_stddev_fields>
  stddev_pop?: Maybe<review_stddev_pop_fields>
  stddev_samp?: Maybe<review_stddev_samp_fields>
  sum?: Maybe<review_sum_fields>
  var_pop?: Maybe<review_var_pop_fields>
  var_samp?: Maybe<review_var_samp_fields>
  variance?: Maybe<review_variance_fields>
}

/**
 * aggregate avg on columns
 */
export interface review_avg_fields {
  __typename?: 'review_avg_fields'
  rating?: Maybe<ScalarsEnums['Float']>
  vote?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate max on columns
 */
export interface review_max_fields {
  __typename?: 'review_max_fields'
  authored_at?: Maybe<ScalarsEnums['timestamptz']>
  id?: Maybe<ScalarsEnums['uuid']>
  list_id?: Maybe<ScalarsEnums['uuid']>
  native_data_unique_key?: Maybe<ScalarsEnums['String']>
  rating?: Maybe<ScalarsEnums['numeric']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  source?: Maybe<ScalarsEnums['String']>
  tag_id?: Maybe<ScalarsEnums['uuid']>
  text?: Maybe<ScalarsEnums['String']>
  type?: Maybe<ScalarsEnums['String']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
  user_id?: Maybe<ScalarsEnums['uuid']>
  username?: Maybe<ScalarsEnums['String']>
  vote?: Maybe<ScalarsEnums['numeric']>
}

/**
 * aggregate min on columns
 */
export interface review_min_fields {
  __typename?: 'review_min_fields'
  authored_at?: Maybe<ScalarsEnums['timestamptz']>
  id?: Maybe<ScalarsEnums['uuid']>
  list_id?: Maybe<ScalarsEnums['uuid']>
  native_data_unique_key?: Maybe<ScalarsEnums['String']>
  rating?: Maybe<ScalarsEnums['numeric']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  source?: Maybe<ScalarsEnums['String']>
  tag_id?: Maybe<ScalarsEnums['uuid']>
  text?: Maybe<ScalarsEnums['String']>
  type?: Maybe<ScalarsEnums['String']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
  user_id?: Maybe<ScalarsEnums['uuid']>
  username?: Maybe<ScalarsEnums['String']>
  vote?: Maybe<ScalarsEnums['numeric']>
}

/**
 * response of any mutation on the table "review"
 */
export interface review_mutation_response {
  __typename?: 'review_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<review>
}

/**
 * aggregate stddev on columns
 */
export interface review_stddev_fields {
  __typename?: 'review_stddev_fields'
  rating?: Maybe<ScalarsEnums['Float']>
  vote?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_pop on columns
 */
export interface review_stddev_pop_fields {
  __typename?: 'review_stddev_pop_fields'
  rating?: Maybe<ScalarsEnums['Float']>
  vote?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_samp on columns
 */
export interface review_stddev_samp_fields {
  __typename?: 'review_stddev_samp_fields'
  rating?: Maybe<ScalarsEnums['Float']>
  vote?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate sum on columns
 */
export interface review_sum_fields {
  __typename?: 'review_sum_fields'
  rating?: Maybe<ScalarsEnums['numeric']>
  vote?: Maybe<ScalarsEnums['numeric']>
}

/**
 * columns and relationships of "review_tag_sentence"
 */
export interface review_tag_sentence {
  __typename?: 'review_tag_sentence'
  id: ScalarsEnums['uuid']
  ml_sentiment?: Maybe<ScalarsEnums['numeric']>
  naive_sentiment: ScalarsEnums['numeric']
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  /**
   * An object relationship
   */
  review: review
  review_id: ScalarsEnums['uuid']
  sentence: ScalarsEnums['String']
  /**
   * An object relationship
   */
  tag: tag
  tag_id: ScalarsEnums['uuid']
}

/**
 * aggregated selection of "review_tag_sentence"
 */
export interface review_tag_sentence_aggregate {
  __typename?: 'review_tag_sentence_aggregate'
  aggregate?: Maybe<review_tag_sentence_aggregate_fields>
  nodes: Array<review_tag_sentence>
}

/**
 * aggregate fields of "review_tag_sentence"
 */
export interface review_tag_sentence_aggregate_fields {
  __typename?: 'review_tag_sentence_aggregate_fields'
  avg?: Maybe<review_tag_sentence_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<review_tag_sentence_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<review_tag_sentence_max_fields>
  min?: Maybe<review_tag_sentence_min_fields>
  stddev?: Maybe<review_tag_sentence_stddev_fields>
  stddev_pop?: Maybe<review_tag_sentence_stddev_pop_fields>
  stddev_samp?: Maybe<review_tag_sentence_stddev_samp_fields>
  sum?: Maybe<review_tag_sentence_sum_fields>
  var_pop?: Maybe<review_tag_sentence_var_pop_fields>
  var_samp?: Maybe<review_tag_sentence_var_samp_fields>
  variance?: Maybe<review_tag_sentence_variance_fields>
}

/**
 * aggregate avg on columns
 */
export interface review_tag_sentence_avg_fields {
  __typename?: 'review_tag_sentence_avg_fields'
  ml_sentiment?: Maybe<ScalarsEnums['Float']>
  naive_sentiment?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate max on columns
 */
export interface review_tag_sentence_max_fields {
  __typename?: 'review_tag_sentence_max_fields'
  id?: Maybe<ScalarsEnums['uuid']>
  ml_sentiment?: Maybe<ScalarsEnums['numeric']>
  naive_sentiment?: Maybe<ScalarsEnums['numeric']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  review_id?: Maybe<ScalarsEnums['uuid']>
  sentence?: Maybe<ScalarsEnums['String']>
  tag_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * aggregate min on columns
 */
export interface review_tag_sentence_min_fields {
  __typename?: 'review_tag_sentence_min_fields'
  id?: Maybe<ScalarsEnums['uuid']>
  ml_sentiment?: Maybe<ScalarsEnums['numeric']>
  naive_sentiment?: Maybe<ScalarsEnums['numeric']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  review_id?: Maybe<ScalarsEnums['uuid']>
  sentence?: Maybe<ScalarsEnums['String']>
  tag_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * response of any mutation on the table "review_tag_sentence"
 */
export interface review_tag_sentence_mutation_response {
  __typename?: 'review_tag_sentence_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<review_tag_sentence>
}

/**
 * aggregate stddev on columns
 */
export interface review_tag_sentence_stddev_fields {
  __typename?: 'review_tag_sentence_stddev_fields'
  ml_sentiment?: Maybe<ScalarsEnums['Float']>
  naive_sentiment?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_pop on columns
 */
export interface review_tag_sentence_stddev_pop_fields {
  __typename?: 'review_tag_sentence_stddev_pop_fields'
  ml_sentiment?: Maybe<ScalarsEnums['Float']>
  naive_sentiment?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_samp on columns
 */
export interface review_tag_sentence_stddev_samp_fields {
  __typename?: 'review_tag_sentence_stddev_samp_fields'
  ml_sentiment?: Maybe<ScalarsEnums['Float']>
  naive_sentiment?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate sum on columns
 */
export interface review_tag_sentence_sum_fields {
  __typename?: 'review_tag_sentence_sum_fields'
  ml_sentiment?: Maybe<ScalarsEnums['numeric']>
  naive_sentiment?: Maybe<ScalarsEnums['numeric']>
}

/**
 * aggregate var_pop on columns
 */
export interface review_tag_sentence_var_pop_fields {
  __typename?: 'review_tag_sentence_var_pop_fields'
  ml_sentiment?: Maybe<ScalarsEnums['Float']>
  naive_sentiment?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate var_samp on columns
 */
export interface review_tag_sentence_var_samp_fields {
  __typename?: 'review_tag_sentence_var_samp_fields'
  ml_sentiment?: Maybe<ScalarsEnums['Float']>
  naive_sentiment?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate variance on columns
 */
export interface review_tag_sentence_variance_fields {
  __typename?: 'review_tag_sentence_variance_fields'
  ml_sentiment?: Maybe<ScalarsEnums['Float']>
  naive_sentiment?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate var_pop on columns
 */
export interface review_var_pop_fields {
  __typename?: 'review_var_pop_fields'
  rating?: Maybe<ScalarsEnums['Float']>
  vote?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate var_samp on columns
 */
export interface review_var_samp_fields {
  __typename?: 'review_var_samp_fields'
  rating?: Maybe<ScalarsEnums['Float']>
  vote?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate variance on columns
 */
export interface review_variance_fields {
  __typename?: 'review_variance_fields'
  rating?: Maybe<ScalarsEnums['Float']>
  vote?: Maybe<ScalarsEnums['Float']>
}

/**
 * columns and relationships of "setting"
 */
export interface setting {
  __typename?: 'setting'
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  id: ScalarsEnums['uuid']
  key: ScalarsEnums['String']
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
  value: ScalarsEnums['jsonb']
}

/**
 * aggregated selection of "setting"
 */
export interface setting_aggregate {
  __typename?: 'setting_aggregate'
  aggregate?: Maybe<setting_aggregate_fields>
  nodes: Array<setting>
}

/**
 * aggregate fields of "setting"
 */
export interface setting_aggregate_fields {
  __typename?: 'setting_aggregate_fields'
  count: (args?: {
    columns?: Maybe<Array<setting_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<setting_max_fields>
  min?: Maybe<setting_min_fields>
}

/**
 * aggregate max on columns
 */
export interface setting_max_fields {
  __typename?: 'setting_max_fields'
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  id?: Maybe<ScalarsEnums['uuid']>
  key?: Maybe<ScalarsEnums['String']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
}

/**
 * aggregate min on columns
 */
export interface setting_min_fields {
  __typename?: 'setting_min_fields'
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  id?: Maybe<ScalarsEnums['uuid']>
  key?: Maybe<ScalarsEnums['String']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
}

/**
 * response of any mutation on the table "setting"
 */
export interface setting_mutation_response {
  __typename?: 'setting_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<setting>
}

export interface Subscription {
  __typename?: 'Subscription'
  boundaries_city: (args?: {
    distinct_on?: Maybe<Array<boundaries_city_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<boundaries_city_order_by>>
    where?: Maybe<boundaries_city_bool_exp>
  }) => Array<boundaries_city>
  boundaries_city_aggregate: (args?: {
    distinct_on?: Maybe<Array<boundaries_city_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<boundaries_city_order_by>>
    where?: Maybe<boundaries_city_bool_exp>
  }) => boundaries_city_aggregate
  boundaries_city_by_pk: (args: { ogc_fid: Scalars['Int'] }) => Maybe<boundaries_city>
  boundaries_city_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<boundaries_city_stream_cursor_input>>
    where?: Maybe<boundaries_city_bool_exp>
  }) => Array<boundaries_city>
  follow: (args?: {
    distinct_on?: Maybe<Array<follow_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<follow_order_by>>
    where?: Maybe<follow_bool_exp>
  }) => Array<follow>
  follow_aggregate: (args?: {
    distinct_on?: Maybe<Array<follow_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<follow_order_by>>
    where?: Maybe<follow_bool_exp>
  }) => follow_aggregate
  follow_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<follow>
  follow_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<follow_stream_cursor_input>>
    where?: Maybe<follow_bool_exp>
  }) => Array<follow>
  hrr: (args?: {
    distinct_on?: Maybe<Array<hrr_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<hrr_order_by>>
    where?: Maybe<hrr_bool_exp>
  }) => Array<hrr>
  hrr_aggregate: (args?: {
    distinct_on?: Maybe<Array<hrr_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<hrr_order_by>>
    where?: Maybe<hrr_bool_exp>
  }) => hrr_aggregate
  hrr_by_pk: (args: { ogc_fid: Scalars['Int'] }) => Maybe<hrr>
  hrr_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<hrr_stream_cursor_input>>
    where?: Maybe<hrr_bool_exp>
  }) => Array<hrr>
  list: (args?: {
    distinct_on?: Maybe<Array<list_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_order_by>>
    where?: Maybe<list_bool_exp>
  }) => Array<list>
  list_aggregate: (args?: {
    distinct_on?: Maybe<Array<list_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_order_by>>
    where?: Maybe<list_bool_exp>
  }) => list_aggregate
  list_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<list>
  list_populated: (args: {
    args: list_populated_args
    distinct_on?: Maybe<Array<list_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_order_by>>
    where?: Maybe<list_bool_exp>
  }) => Array<list>
  list_populated_aggregate: (args: {
    args: list_populated_args
    distinct_on?: Maybe<Array<list_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_order_by>>
    where?: Maybe<list_bool_exp>
  }) => list_aggregate
  list_region: (args?: {
    distinct_on?: Maybe<Array<list_region_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_region_order_by>>
    where?: Maybe<list_region_bool_exp>
  }) => Array<list_region>
  list_region_aggregate: (args?: {
    distinct_on?: Maybe<Array<list_region_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_region_order_by>>
    where?: Maybe<list_region_bool_exp>
  }) => list_region_aggregate
  list_region_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<list_region>
  list_region_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<list_region_stream_cursor_input>>
    where?: Maybe<list_region_bool_exp>
  }) => Array<list_region>
  list_restaurant: (args?: {
    distinct_on?: Maybe<Array<list_restaurant_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_restaurant_order_by>>
    where?: Maybe<list_restaurant_bool_exp>
  }) => Array<list_restaurant>
  list_restaurant_aggregate: (args?: {
    distinct_on?: Maybe<Array<list_restaurant_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_restaurant_order_by>>
    where?: Maybe<list_restaurant_bool_exp>
  }) => list_restaurant_aggregate
  list_restaurant_by_pk: (args: {
    list_id: Scalars['uuid']
    restaurant_id: Scalars['uuid']
  }) => Maybe<list_restaurant>
  list_restaurant_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<list_restaurant_stream_cursor_input>>
    where?: Maybe<list_restaurant_bool_exp>
  }) => Array<list_restaurant>
  list_restaurant_tag: (args?: {
    distinct_on?: Maybe<Array<list_restaurant_tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_restaurant_tag_order_by>>
    where?: Maybe<list_restaurant_tag_bool_exp>
  }) => Array<list_restaurant_tag>
  list_restaurant_tag_aggregate: (args?: {
    distinct_on?: Maybe<Array<list_restaurant_tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_restaurant_tag_order_by>>
    where?: Maybe<list_restaurant_tag_bool_exp>
  }) => list_restaurant_tag_aggregate
  list_restaurant_tag_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<list_restaurant_tag>
  list_restaurant_tag_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<list_restaurant_tag_stream_cursor_input>>
    where?: Maybe<list_restaurant_tag_bool_exp>
  }) => Array<list_restaurant_tag>
  list_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<list_stream_cursor_input>>
    where?: Maybe<list_bool_exp>
  }) => Array<list>
  list_tag: (args?: {
    distinct_on?: Maybe<Array<list_tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_tag_order_by>>
    where?: Maybe<list_tag_bool_exp>
  }) => Array<list_tag>
  list_tag_aggregate: (args?: {
    distinct_on?: Maybe<Array<list_tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<list_tag_order_by>>
    where?: Maybe<list_tag_bool_exp>
  }) => list_tag_aggregate
  list_tag_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<list_tag>
  list_tag_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<list_tag_stream_cursor_input>>
    where?: Maybe<list_tag_bool_exp>
  }) => Array<list_tag>
  menu_item: (args?: {
    distinct_on?: Maybe<Array<menu_item_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<menu_item_order_by>>
    where?: Maybe<menu_item_bool_exp>
  }) => Array<menu_item>
  menu_item_aggregate: (args?: {
    distinct_on?: Maybe<Array<menu_item_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<menu_item_order_by>>
    where?: Maybe<menu_item_bool_exp>
  }) => menu_item_aggregate
  menu_item_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<menu_item>
  menu_item_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<menu_item_stream_cursor_input>>
    where?: Maybe<menu_item_bool_exp>
  }) => Array<menu_item>
  nhood_labels: (args?: {
    distinct_on?: Maybe<Array<nhood_labels_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<nhood_labels_order_by>>
    where?: Maybe<nhood_labels_bool_exp>
  }) => Array<nhood_labels>
  nhood_labels_aggregate: (args?: {
    distinct_on?: Maybe<Array<nhood_labels_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<nhood_labels_order_by>>
    where?: Maybe<nhood_labels_bool_exp>
  }) => nhood_labels_aggregate
  nhood_labels_by_pk: (args: { ogc_fid: Scalars['Int'] }) => Maybe<nhood_labels>
  nhood_labels_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<nhood_labels_stream_cursor_input>>
    where?: Maybe<nhood_labels_bool_exp>
  }) => Array<nhood_labels>
  opening_hours: (args?: {
    distinct_on?: Maybe<Array<opening_hours_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<opening_hours_order_by>>
    where?: Maybe<opening_hours_bool_exp>
  }) => Array<opening_hours>
  opening_hours_aggregate: (args?: {
    distinct_on?: Maybe<Array<opening_hours_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<opening_hours_order_by>>
    where?: Maybe<opening_hours_bool_exp>
  }) => opening_hours_aggregate
  opening_hours_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<opening_hours>
  opening_hours_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<opening_hours_stream_cursor_input>>
    where?: Maybe<opening_hours_bool_exp>
  }) => Array<opening_hours>
  photo: (args?: {
    distinct_on?: Maybe<Array<photo_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<photo_order_by>>
    where?: Maybe<photo_bool_exp>
  }) => Array<photo>
  photo_aggregate: (args?: {
    distinct_on?: Maybe<Array<photo_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<photo_order_by>>
    where?: Maybe<photo_bool_exp>
  }) => photo_aggregate
  photo_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<photo>
  photo_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<photo_stream_cursor_input>>
    where?: Maybe<photo_bool_exp>
  }) => Array<photo>
  photo_xref: (args?: {
    distinct_on?: Maybe<Array<photo_xref_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<photo_xref_order_by>>
    where?: Maybe<photo_xref_bool_exp>
  }) => Array<photo_xref>
  photo_xref_aggregate: (args?: {
    distinct_on?: Maybe<Array<photo_xref_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<photo_xref_order_by>>
    where?: Maybe<photo_xref_bool_exp>
  }) => photo_xref_aggregate
  photo_xref_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<photo_xref>
  photo_xref_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<photo_xref_stream_cursor_input>>
    where?: Maybe<photo_xref_bool_exp>
  }) => Array<photo_xref>
  restaurant: (args?: {
    distinct_on?: Maybe<Array<restaurant_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_order_by>>
    where?: Maybe<restaurant_bool_exp>
  }) => Array<restaurant>
  restaurant_aggregate: (args?: {
    distinct_on?: Maybe<Array<restaurant_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_order_by>>
    where?: Maybe<restaurant_bool_exp>
  }) => restaurant_aggregate
  restaurant_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<restaurant>
  restaurant_new: (args: {
    args: restaurant_new_args
    distinct_on?: Maybe<Array<restaurant_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_order_by>>
    where?: Maybe<restaurant_bool_exp>
  }) => Array<restaurant>
  restaurant_new_aggregate: (args: {
    args: restaurant_new_args
    distinct_on?: Maybe<Array<restaurant_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_order_by>>
    where?: Maybe<restaurant_bool_exp>
  }) => restaurant_aggregate
  restaurant_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<restaurant_stream_cursor_input>>
    where?: Maybe<restaurant_bool_exp>
  }) => Array<restaurant>
  restaurant_tag: (args?: {
    distinct_on?: Maybe<Array<restaurant_tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    where?: Maybe<restaurant_tag_bool_exp>
  }) => Array<restaurant_tag>
  restaurant_tag_aggregate: (args?: {
    distinct_on?: Maybe<Array<restaurant_tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    where?: Maybe<restaurant_tag_bool_exp>
  }) => restaurant_tag_aggregate
  restaurant_tag_by_pk: (args: {
    restaurant_id: Scalars['uuid']
    tag_id: Scalars['uuid']
  }) => Maybe<restaurant_tag>
  restaurant_tag_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<restaurant_tag_stream_cursor_input>>
    where?: Maybe<restaurant_tag_bool_exp>
  }) => Array<restaurant_tag>
  restaurant_top_tags: (args: {
    args: restaurant_top_tags_args
    distinct_on?: Maybe<Array<restaurant_tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    where?: Maybe<restaurant_tag_bool_exp>
  }) => Array<restaurant_tag>
  restaurant_top_tags_aggregate: (args: {
    args: restaurant_top_tags_args
    distinct_on?: Maybe<Array<restaurant_tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    where?: Maybe<restaurant_tag_bool_exp>
  }) => restaurant_tag_aggregate
  restaurant_trending: (args: {
    args: restaurant_trending_args
    distinct_on?: Maybe<Array<restaurant_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_order_by>>
    where?: Maybe<restaurant_bool_exp>
  }) => Array<restaurant>
  restaurant_trending_aggregate: (args: {
    args: restaurant_trending_args
    distinct_on?: Maybe<Array<restaurant_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_order_by>>
    where?: Maybe<restaurant_bool_exp>
  }) => restaurant_aggregate
  restaurant_with_tags: (args: {
    args: restaurant_with_tags_args
    distinct_on?: Maybe<Array<restaurant_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_order_by>>
    where?: Maybe<restaurant_bool_exp>
  }) => Array<restaurant>
  restaurant_with_tags_aggregate: (args: {
    args: restaurant_with_tags_args
    distinct_on?: Maybe<Array<restaurant_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<restaurant_order_by>>
    where?: Maybe<restaurant_bool_exp>
  }) => restaurant_aggregate
  review: (args?: {
    distinct_on?: Maybe<Array<review_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<review_order_by>>
    where?: Maybe<review_bool_exp>
  }) => Array<review>
  review_aggregate: (args?: {
    distinct_on?: Maybe<Array<review_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<review_order_by>>
    where?: Maybe<review_bool_exp>
  }) => review_aggregate
  review_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<review>
  review_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<review_stream_cursor_input>>
    where?: Maybe<review_bool_exp>
  }) => Array<review>
  review_tag_sentence: (args?: {
    distinct_on?: Maybe<Array<review_tag_sentence_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<review_tag_sentence_order_by>>
    where?: Maybe<review_tag_sentence_bool_exp>
  }) => Array<review_tag_sentence>
  review_tag_sentence_aggregate: (args?: {
    distinct_on?: Maybe<Array<review_tag_sentence_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<review_tag_sentence_order_by>>
    where?: Maybe<review_tag_sentence_bool_exp>
  }) => review_tag_sentence_aggregate
  review_tag_sentence_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<review_tag_sentence>
  review_tag_sentence_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<review_tag_sentence_stream_cursor_input>>
    where?: Maybe<review_tag_sentence_bool_exp>
  }) => Array<review_tag_sentence>
  setting: (args?: {
    distinct_on?: Maybe<Array<setting_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<setting_order_by>>
    where?: Maybe<setting_bool_exp>
  }) => Array<setting>
  setting_aggregate: (args?: {
    distinct_on?: Maybe<Array<setting_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<setting_order_by>>
    where?: Maybe<setting_bool_exp>
  }) => setting_aggregate
  setting_by_pk: (args: { key: Scalars['String'] }) => Maybe<setting>
  setting_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<setting_stream_cursor_input>>
    where?: Maybe<setting_bool_exp>
  }) => Array<setting>
  tag: (args?: {
    distinct_on?: Maybe<Array<tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<tag_order_by>>
    where?: Maybe<tag_bool_exp>
  }) => Array<tag>
  tag_aggregate: (args?: {
    distinct_on?: Maybe<Array<tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<tag_order_by>>
    where?: Maybe<tag_bool_exp>
  }) => tag_aggregate
  tag_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<tag>
  tag_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<tag_stream_cursor_input>>
    where?: Maybe<tag_bool_exp>
  }) => Array<tag>
  tag_tag: (args?: {
    distinct_on?: Maybe<Array<tag_tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<tag_tag_order_by>>
    where?: Maybe<tag_tag_bool_exp>
  }) => Array<tag_tag>
  tag_tag_aggregate: (args?: {
    distinct_on?: Maybe<Array<tag_tag_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<tag_tag_order_by>>
    where?: Maybe<tag_tag_bool_exp>
  }) => tag_tag_aggregate
  tag_tag_by_pk: (args: {
    category_tag_id: Scalars['uuid']
    tag_id: Scalars['uuid']
  }) => Maybe<tag_tag>
  tag_tag_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<tag_tag_stream_cursor_input>>
    where?: Maybe<tag_tag_bool_exp>
  }) => Array<tag_tag>
  user: (args?: {
    distinct_on?: Maybe<Array<user_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<user_order_by>>
    where?: Maybe<user_bool_exp>
  }) => Array<user>
  user_aggregate: (args?: {
    distinct_on?: Maybe<Array<user_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<user_order_by>>
    where?: Maybe<user_bool_exp>
  }) => user_aggregate
  user_by_pk: (args: { id: Scalars['uuid'] }) => Maybe<user>
  user_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<user_stream_cursor_input>>
    where?: Maybe<user_bool_exp>
  }) => Array<user>
  zcta5: (args?: {
    distinct_on?: Maybe<Array<zcta5_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<zcta5_order_by>>
    where?: Maybe<zcta5_bool_exp>
  }) => Array<zcta5>
  zcta5_aggregate: (args?: {
    distinct_on?: Maybe<Array<zcta5_select_column>>
    limit?: Maybe<Scalars['Int']>
    offset?: Maybe<Scalars['Int']>
    order_by?: Maybe<Array<zcta5_order_by>>
    where?: Maybe<zcta5_bool_exp>
  }) => zcta5_aggregate
  zcta5_by_pk: (args: { ogc_fid: Scalars['Int'] }) => Maybe<zcta5>
  zcta5_stream: (args: {
    batch_size: Scalars['Int']
    cursor: Array<Maybe<zcta5_stream_cursor_input>>
    where?: Maybe<zcta5_bool_exp>
  }) => Array<zcta5>
}

/**
 * columns and relationships of "tag"
 */
export interface tag {
  __typename?: 'tag'
  alternates?: Maybe<ScalarsEnums['jsonb']>
  /**
   * An array relationship
   */
  categories: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<tag_tag_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<tag_tag_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<tag_tag_bool_exp>
  }) => Array<tag_tag>
  /**
   * An aggregate relationship
   */
  categories_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<tag_tag_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<tag_tag_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<tag_tag_bool_exp>
  }) => tag_tag_aggregate
  created_at: ScalarsEnums['timestamptz']
  default_image?: Maybe<ScalarsEnums['String']>
  default_images?: Maybe<ScalarsEnums['jsonb']>
  description?: Maybe<ScalarsEnums['String']>
  displayName?: Maybe<ScalarsEnums['String']>
  frequency?: Maybe<ScalarsEnums['Int']>
  icon?: Maybe<ScalarsEnums['String']>
  id: ScalarsEnums['uuid']
  is_ambiguous: ScalarsEnums['Boolean']
  misc?: Maybe<ScalarsEnums['jsonb']>
  name: ScalarsEnums['String']
  order: ScalarsEnums['Int']
  /**
   * An object relationship
   */
  parent?: Maybe<tag>
  parentId?: Maybe<ScalarsEnums['uuid']>
  popularity?: Maybe<ScalarsEnums['Int']>
  /**
   * An array relationship
   */
  restaurant_taxonomies: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<restaurant_tag_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<restaurant_tag_bool_exp>
  }) => Array<restaurant_tag>
  /**
   * An aggregate relationship
   */
  restaurant_taxonomies_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<restaurant_tag_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<restaurant_tag_bool_exp>
  }) => restaurant_tag_aggregate
  /**
   * An array relationship
   */
  reviews: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<review_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<review_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<review_bool_exp>
  }) => Array<review>
  /**
   * An aggregate relationship
   */
  reviews_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<review_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<review_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<review_bool_exp>
  }) => review_aggregate
  rgb?: Maybe<ScalarsEnums['jsonb']>
  slug?: Maybe<ScalarsEnums['String']>
  type?: Maybe<ScalarsEnums['String']>
  updated_at: ScalarsEnums['timestamptz']
}

/**
 * aggregated selection of "tag"
 */
export interface tag_aggregate {
  __typename?: 'tag_aggregate'
  aggregate?: Maybe<tag_aggregate_fields>
  nodes: Array<tag>
}

/**
 * aggregate fields of "tag"
 */
export interface tag_aggregate_fields {
  __typename?: 'tag_aggregate_fields'
  avg?: Maybe<tag_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<tag_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<tag_max_fields>
  min?: Maybe<tag_min_fields>
  stddev?: Maybe<tag_stddev_fields>
  stddev_pop?: Maybe<tag_stddev_pop_fields>
  stddev_samp?: Maybe<tag_stddev_samp_fields>
  sum?: Maybe<tag_sum_fields>
  var_pop?: Maybe<tag_var_pop_fields>
  var_samp?: Maybe<tag_var_samp_fields>
  variance?: Maybe<tag_variance_fields>
}

/**
 * aggregate avg on columns
 */
export interface tag_avg_fields {
  __typename?: 'tag_avg_fields'
  frequency?: Maybe<ScalarsEnums['Float']>
  order?: Maybe<ScalarsEnums['Float']>
  popularity?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate max on columns
 */
export interface tag_max_fields {
  __typename?: 'tag_max_fields'
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  default_image?: Maybe<ScalarsEnums['String']>
  description?: Maybe<ScalarsEnums['String']>
  displayName?: Maybe<ScalarsEnums['String']>
  frequency?: Maybe<ScalarsEnums['Int']>
  icon?: Maybe<ScalarsEnums['String']>
  id?: Maybe<ScalarsEnums['uuid']>
  name?: Maybe<ScalarsEnums['String']>
  order?: Maybe<ScalarsEnums['Int']>
  parentId?: Maybe<ScalarsEnums['uuid']>
  popularity?: Maybe<ScalarsEnums['Int']>
  slug?: Maybe<ScalarsEnums['String']>
  type?: Maybe<ScalarsEnums['String']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
}

/**
 * aggregate min on columns
 */
export interface tag_min_fields {
  __typename?: 'tag_min_fields'
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  default_image?: Maybe<ScalarsEnums['String']>
  description?: Maybe<ScalarsEnums['String']>
  displayName?: Maybe<ScalarsEnums['String']>
  frequency?: Maybe<ScalarsEnums['Int']>
  icon?: Maybe<ScalarsEnums['String']>
  id?: Maybe<ScalarsEnums['uuid']>
  name?: Maybe<ScalarsEnums['String']>
  order?: Maybe<ScalarsEnums['Int']>
  parentId?: Maybe<ScalarsEnums['uuid']>
  popularity?: Maybe<ScalarsEnums['Int']>
  slug?: Maybe<ScalarsEnums['String']>
  type?: Maybe<ScalarsEnums['String']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
}

/**
 * response of any mutation on the table "tag"
 */
export interface tag_mutation_response {
  __typename?: 'tag_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<tag>
}

/**
 * aggregate stddev on columns
 */
export interface tag_stddev_fields {
  __typename?: 'tag_stddev_fields'
  frequency?: Maybe<ScalarsEnums['Float']>
  order?: Maybe<ScalarsEnums['Float']>
  popularity?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_pop on columns
 */
export interface tag_stddev_pop_fields {
  __typename?: 'tag_stddev_pop_fields'
  frequency?: Maybe<ScalarsEnums['Float']>
  order?: Maybe<ScalarsEnums['Float']>
  popularity?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_samp on columns
 */
export interface tag_stddev_samp_fields {
  __typename?: 'tag_stddev_samp_fields'
  frequency?: Maybe<ScalarsEnums['Float']>
  order?: Maybe<ScalarsEnums['Float']>
  popularity?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate sum on columns
 */
export interface tag_sum_fields {
  __typename?: 'tag_sum_fields'
  frequency?: Maybe<ScalarsEnums['Int']>
  order?: Maybe<ScalarsEnums['Int']>
  popularity?: Maybe<ScalarsEnums['Int']>
}

/**
 * columns and relationships of "tag_tag"
 */
export interface tag_tag {
  __typename?: 'tag_tag'
  /**
   * An object relationship
   */
  category: tag
  category_tag_id: ScalarsEnums['uuid']
  /**
   * An object relationship
   */
  main: tag
  tag_id: ScalarsEnums['uuid']
}

/**
 * aggregated selection of "tag_tag"
 */
export interface tag_tag_aggregate {
  __typename?: 'tag_tag_aggregate'
  aggregate?: Maybe<tag_tag_aggregate_fields>
  nodes: Array<tag_tag>
}

/**
 * aggregate fields of "tag_tag"
 */
export interface tag_tag_aggregate_fields {
  __typename?: 'tag_tag_aggregate_fields'
  count: (args?: {
    columns?: Maybe<Array<tag_tag_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<tag_tag_max_fields>
  min?: Maybe<tag_tag_min_fields>
}

/**
 * aggregate max on columns
 */
export interface tag_tag_max_fields {
  __typename?: 'tag_tag_max_fields'
  category_tag_id?: Maybe<ScalarsEnums['uuid']>
  tag_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * aggregate min on columns
 */
export interface tag_tag_min_fields {
  __typename?: 'tag_tag_min_fields'
  category_tag_id?: Maybe<ScalarsEnums['uuid']>
  tag_id?: Maybe<ScalarsEnums['uuid']>
}

/**
 * response of any mutation on the table "tag_tag"
 */
export interface tag_tag_mutation_response {
  __typename?: 'tag_tag_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<tag_tag>
}

/**
 * aggregate var_pop on columns
 */
export interface tag_var_pop_fields {
  __typename?: 'tag_var_pop_fields'
  frequency?: Maybe<ScalarsEnums['Float']>
  order?: Maybe<ScalarsEnums['Float']>
  popularity?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate var_samp on columns
 */
export interface tag_var_samp_fields {
  __typename?: 'tag_var_samp_fields'
  frequency?: Maybe<ScalarsEnums['Float']>
  order?: Maybe<ScalarsEnums['Float']>
  popularity?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate variance on columns
 */
export interface tag_variance_fields {
  __typename?: 'tag_variance_fields'
  frequency?: Maybe<ScalarsEnums['Float']>
  order?: Maybe<ScalarsEnums['Float']>
  popularity?: Maybe<ScalarsEnums['Float']>
}

/**
 * columns and relationships of "user"
 */
export interface user {
  __typename?: 'user'
  about?: Maybe<ScalarsEnums['String']>
  apple_email?: Maybe<ScalarsEnums['String']>
  apple_refresh_token?: Maybe<ScalarsEnums['String']>
  apple_token?: Maybe<ScalarsEnums['String']>
  apple_uid?: Maybe<ScalarsEnums['String']>
  avatar?: Maybe<ScalarsEnums['String']>
  charIndex: ScalarsEnums['Int']
  created_at: ScalarsEnums['timestamptz']
  email?: Maybe<ScalarsEnums['String']>
  /**
   * An array relationship
   */
  followers: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<follow_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<follow_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<follow_bool_exp>
  }) => Array<follow>
  /**
   * An aggregate relationship
   */
  followers_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<follow_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<follow_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<follow_bool_exp>
  }) => follow_aggregate
  /**
   * An array relationship
   */
  following: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<follow_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<follow_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<follow_bool_exp>
  }) => Array<follow>
  /**
   * An aggregate relationship
   */
  following_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<follow_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<follow_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<follow_bool_exp>
  }) => follow_aggregate
  has_onboarded: ScalarsEnums['Boolean']
  id: ScalarsEnums['uuid']
  /**
   * An array relationship
   */
  lists: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<list_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<list_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<list_bool_exp>
  }) => Array<list>
  /**
   * An aggregate relationship
   */
  lists_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<list_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<list_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<list_bool_exp>
  }) => list_aggregate
  location?: Maybe<ScalarsEnums['String']>
  name?: Maybe<ScalarsEnums['String']>
  password: ScalarsEnums['String']
  password_reset_date?: Maybe<ScalarsEnums['timestamptz']>
  password_reset_token?: Maybe<ScalarsEnums['String']>
  /**
   * An array relationship
   */
  photo_xrefs: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<photo_xref_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<photo_xref_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<photo_xref_bool_exp>
  }) => Array<photo_xref>
  /**
   * An aggregate relationship
   */
  photo_xrefs_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<photo_xref_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<photo_xref_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<photo_xref_bool_exp>
  }) => photo_xref_aggregate
  /**
   * An array relationship
   */
  reviews: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<review_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<review_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<review_bool_exp>
  }) => Array<review>
  /**
   * An aggregate relationship
   */
  reviews_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<review_select_column>>
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<review_order_by>>
    /**
     * filter the rows returned
     */
    where?: Maybe<review_bool_exp>
  }) => review_aggregate
  role?: Maybe<ScalarsEnums['String']>
  updated_at: ScalarsEnums['timestamptz']
  username: ScalarsEnums['String']
}

/**
 * aggregated selection of "user"
 */
export interface user_aggregate {
  __typename?: 'user_aggregate'
  aggregate?: Maybe<user_aggregate_fields>
  nodes: Array<user>
}

/**
 * aggregate fields of "user"
 */
export interface user_aggregate_fields {
  __typename?: 'user_aggregate_fields'
  avg?: Maybe<user_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<user_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<user_max_fields>
  min?: Maybe<user_min_fields>
  stddev?: Maybe<user_stddev_fields>
  stddev_pop?: Maybe<user_stddev_pop_fields>
  stddev_samp?: Maybe<user_stddev_samp_fields>
  sum?: Maybe<user_sum_fields>
  var_pop?: Maybe<user_var_pop_fields>
  var_samp?: Maybe<user_var_samp_fields>
  variance?: Maybe<user_variance_fields>
}

/**
 * aggregate avg on columns
 */
export interface user_avg_fields {
  __typename?: 'user_avg_fields'
  charIndex?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate max on columns
 */
export interface user_max_fields {
  __typename?: 'user_max_fields'
  about?: Maybe<ScalarsEnums['String']>
  apple_email?: Maybe<ScalarsEnums['String']>
  apple_refresh_token?: Maybe<ScalarsEnums['String']>
  apple_token?: Maybe<ScalarsEnums['String']>
  apple_uid?: Maybe<ScalarsEnums['String']>
  avatar?: Maybe<ScalarsEnums['String']>
  charIndex?: Maybe<ScalarsEnums['Int']>
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  email?: Maybe<ScalarsEnums['String']>
  id?: Maybe<ScalarsEnums['uuid']>
  location?: Maybe<ScalarsEnums['String']>
  name?: Maybe<ScalarsEnums['String']>
  password?: Maybe<ScalarsEnums['String']>
  password_reset_date?: Maybe<ScalarsEnums['timestamptz']>
  password_reset_token?: Maybe<ScalarsEnums['String']>
  role?: Maybe<ScalarsEnums['String']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
  username?: Maybe<ScalarsEnums['String']>
}

/**
 * aggregate min on columns
 */
export interface user_min_fields {
  __typename?: 'user_min_fields'
  about?: Maybe<ScalarsEnums['String']>
  apple_email?: Maybe<ScalarsEnums['String']>
  apple_refresh_token?: Maybe<ScalarsEnums['String']>
  apple_token?: Maybe<ScalarsEnums['String']>
  apple_uid?: Maybe<ScalarsEnums['String']>
  avatar?: Maybe<ScalarsEnums['String']>
  charIndex?: Maybe<ScalarsEnums['Int']>
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  email?: Maybe<ScalarsEnums['String']>
  id?: Maybe<ScalarsEnums['uuid']>
  location?: Maybe<ScalarsEnums['String']>
  name?: Maybe<ScalarsEnums['String']>
  password?: Maybe<ScalarsEnums['String']>
  password_reset_date?: Maybe<ScalarsEnums['timestamptz']>
  password_reset_token?: Maybe<ScalarsEnums['String']>
  role?: Maybe<ScalarsEnums['String']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
  username?: Maybe<ScalarsEnums['String']>
}

/**
 * response of any mutation on the table "user"
 */
export interface user_mutation_response {
  __typename?: 'user_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<user>
}

/**
 * aggregate stddev on columns
 */
export interface user_stddev_fields {
  __typename?: 'user_stddev_fields'
  charIndex?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_pop on columns
 */
export interface user_stddev_pop_fields {
  __typename?: 'user_stddev_pop_fields'
  charIndex?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_samp on columns
 */
export interface user_stddev_samp_fields {
  __typename?: 'user_stddev_samp_fields'
  charIndex?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate sum on columns
 */
export interface user_sum_fields {
  __typename?: 'user_sum_fields'
  charIndex?: Maybe<ScalarsEnums['Int']>
}

/**
 * aggregate var_pop on columns
 */
export interface user_var_pop_fields {
  __typename?: 'user_var_pop_fields'
  charIndex?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate var_samp on columns
 */
export interface user_var_samp_fields {
  __typename?: 'user_var_samp_fields'
  charIndex?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate variance on columns
 */
export interface user_variance_fields {
  __typename?: 'user_variance_fields'
  charIndex?: Maybe<ScalarsEnums['Float']>
}

/**
 * columns and relationships of "zcta5"
 */
export interface zcta5 {
  __typename?: 'zcta5'
  color?: Maybe<ScalarsEnums['String']>
  intptlat10?: Maybe<ScalarsEnums['String']>
  intptlon10?: Maybe<ScalarsEnums['String']>
  nhood?: Maybe<ScalarsEnums['String']>
  ogc_fid: ScalarsEnums['Int']
  slug?: Maybe<ScalarsEnums['String']>
  wkb_geometry?: Maybe<ScalarsEnums['geometry']>
}

/**
 * aggregated selection of "zcta5"
 */
export interface zcta5_aggregate {
  __typename?: 'zcta5_aggregate'
  aggregate?: Maybe<zcta5_aggregate_fields>
  nodes: Array<zcta5>
}

/**
 * aggregate fields of "zcta5"
 */
export interface zcta5_aggregate_fields {
  __typename?: 'zcta5_aggregate_fields'
  avg?: Maybe<zcta5_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<zcta5_select_column>>
    distinct?: Maybe<Scalars['Boolean']>
  }) => ScalarsEnums['Int']
  max?: Maybe<zcta5_max_fields>
  min?: Maybe<zcta5_min_fields>
  stddev?: Maybe<zcta5_stddev_fields>
  stddev_pop?: Maybe<zcta5_stddev_pop_fields>
  stddev_samp?: Maybe<zcta5_stddev_samp_fields>
  sum?: Maybe<zcta5_sum_fields>
  var_pop?: Maybe<zcta5_var_pop_fields>
  var_samp?: Maybe<zcta5_var_samp_fields>
  variance?: Maybe<zcta5_variance_fields>
}

/**
 * aggregate avg on columns
 */
export interface zcta5_avg_fields {
  __typename?: 'zcta5_avg_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate max on columns
 */
export interface zcta5_max_fields {
  __typename?: 'zcta5_max_fields'
  color?: Maybe<ScalarsEnums['String']>
  intptlat10?: Maybe<ScalarsEnums['String']>
  intptlon10?: Maybe<ScalarsEnums['String']>
  nhood?: Maybe<ScalarsEnums['String']>
  ogc_fid?: Maybe<ScalarsEnums['Int']>
  slug?: Maybe<ScalarsEnums['String']>
}

/**
 * aggregate min on columns
 */
export interface zcta5_min_fields {
  __typename?: 'zcta5_min_fields'
  color?: Maybe<ScalarsEnums['String']>
  intptlat10?: Maybe<ScalarsEnums['String']>
  intptlon10?: Maybe<ScalarsEnums['String']>
  nhood?: Maybe<ScalarsEnums['String']>
  ogc_fid?: Maybe<ScalarsEnums['Int']>
  slug?: Maybe<ScalarsEnums['String']>
}

/**
 * response of any mutation on the table "zcta5"
 */
export interface zcta5_mutation_response {
  __typename?: 'zcta5_mutation_response'
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int']
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<zcta5>
}

/**
 * aggregate stddev on columns
 */
export interface zcta5_stddev_fields {
  __typename?: 'zcta5_stddev_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_pop on columns
 */
export interface zcta5_stddev_pop_fields {
  __typename?: 'zcta5_stddev_pop_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate stddev_samp on columns
 */
export interface zcta5_stddev_samp_fields {
  __typename?: 'zcta5_stddev_samp_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate sum on columns
 */
export interface zcta5_sum_fields {
  __typename?: 'zcta5_sum_fields'
  ogc_fid?: Maybe<ScalarsEnums['Int']>
}

/**
 * aggregate var_pop on columns
 */
export interface zcta5_var_pop_fields {
  __typename?: 'zcta5_var_pop_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate var_samp on columns
 */
export interface zcta5_var_samp_fields {
  __typename?: 'zcta5_var_samp_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

/**
 * aggregate variance on columns
 */
export interface zcta5_variance_fields {
  __typename?: 'zcta5_variance_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface SchemaObjectTypes {
  Mutation: Mutation
  Query: Query
  Subscription: Subscription
  boundaries_city: boundaries_city
  boundaries_city_aggregate: boundaries_city_aggregate
  boundaries_city_aggregate_fields: boundaries_city_aggregate_fields
  boundaries_city_avg_fields: boundaries_city_avg_fields
  boundaries_city_max_fields: boundaries_city_max_fields
  boundaries_city_min_fields: boundaries_city_min_fields
  boundaries_city_mutation_response: boundaries_city_mutation_response
  boundaries_city_stddev_fields: boundaries_city_stddev_fields
  boundaries_city_stddev_pop_fields: boundaries_city_stddev_pop_fields
  boundaries_city_stddev_samp_fields: boundaries_city_stddev_samp_fields
  boundaries_city_sum_fields: boundaries_city_sum_fields
  boundaries_city_var_pop_fields: boundaries_city_var_pop_fields
  boundaries_city_var_samp_fields: boundaries_city_var_samp_fields
  boundaries_city_variance_fields: boundaries_city_variance_fields
  follow: follow
  follow_aggregate: follow_aggregate
  follow_aggregate_fields: follow_aggregate_fields
  follow_max_fields: follow_max_fields
  follow_min_fields: follow_min_fields
  follow_mutation_response: follow_mutation_response
  hrr: hrr
  hrr_aggregate: hrr_aggregate
  hrr_aggregate_fields: hrr_aggregate_fields
  hrr_avg_fields: hrr_avg_fields
  hrr_max_fields: hrr_max_fields
  hrr_min_fields: hrr_min_fields
  hrr_mutation_response: hrr_mutation_response
  hrr_stddev_fields: hrr_stddev_fields
  hrr_stddev_pop_fields: hrr_stddev_pop_fields
  hrr_stddev_samp_fields: hrr_stddev_samp_fields
  hrr_sum_fields: hrr_sum_fields
  hrr_var_pop_fields: hrr_var_pop_fields
  hrr_var_samp_fields: hrr_var_samp_fields
  hrr_variance_fields: hrr_variance_fields
  list: list
  list_aggregate: list_aggregate
  list_aggregate_fields: list_aggregate_fields
  list_avg_fields: list_avg_fields
  list_max_fields: list_max_fields
  list_min_fields: list_min_fields
  list_mutation_response: list_mutation_response
  list_region: list_region
  list_region_aggregate: list_region_aggregate
  list_region_aggregate_fields: list_region_aggregate_fields
  list_region_max_fields: list_region_max_fields
  list_region_min_fields: list_region_min_fields
  list_region_mutation_response: list_region_mutation_response
  list_restaurant: list_restaurant
  list_restaurant_aggregate: list_restaurant_aggregate
  list_restaurant_aggregate_fields: list_restaurant_aggregate_fields
  list_restaurant_avg_fields: list_restaurant_avg_fields
  list_restaurant_max_fields: list_restaurant_max_fields
  list_restaurant_min_fields: list_restaurant_min_fields
  list_restaurant_mutation_response: list_restaurant_mutation_response
  list_restaurant_stddev_fields: list_restaurant_stddev_fields
  list_restaurant_stddev_pop_fields: list_restaurant_stddev_pop_fields
  list_restaurant_stddev_samp_fields: list_restaurant_stddev_samp_fields
  list_restaurant_sum_fields: list_restaurant_sum_fields
  list_restaurant_tag: list_restaurant_tag
  list_restaurant_tag_aggregate: list_restaurant_tag_aggregate
  list_restaurant_tag_aggregate_fields: list_restaurant_tag_aggregate_fields
  list_restaurant_tag_avg_fields: list_restaurant_tag_avg_fields
  list_restaurant_tag_max_fields: list_restaurant_tag_max_fields
  list_restaurant_tag_min_fields: list_restaurant_tag_min_fields
  list_restaurant_tag_mutation_response: list_restaurant_tag_mutation_response
  list_restaurant_tag_stddev_fields: list_restaurant_tag_stddev_fields
  list_restaurant_tag_stddev_pop_fields: list_restaurant_tag_stddev_pop_fields
  list_restaurant_tag_stddev_samp_fields: list_restaurant_tag_stddev_samp_fields
  list_restaurant_tag_sum_fields: list_restaurant_tag_sum_fields
  list_restaurant_tag_var_pop_fields: list_restaurant_tag_var_pop_fields
  list_restaurant_tag_var_samp_fields: list_restaurant_tag_var_samp_fields
  list_restaurant_tag_variance_fields: list_restaurant_tag_variance_fields
  list_restaurant_var_pop_fields: list_restaurant_var_pop_fields
  list_restaurant_var_samp_fields: list_restaurant_var_samp_fields
  list_restaurant_variance_fields: list_restaurant_variance_fields
  list_stddev_fields: list_stddev_fields
  list_stddev_pop_fields: list_stddev_pop_fields
  list_stddev_samp_fields: list_stddev_samp_fields
  list_sum_fields: list_sum_fields
  list_tag: list_tag
  list_tag_aggregate: list_tag_aggregate
  list_tag_aggregate_fields: list_tag_aggregate_fields
  list_tag_max_fields: list_tag_max_fields
  list_tag_min_fields: list_tag_min_fields
  list_tag_mutation_response: list_tag_mutation_response
  list_var_pop_fields: list_var_pop_fields
  list_var_samp_fields: list_var_samp_fields
  list_variance_fields: list_variance_fields
  menu_item: menu_item
  menu_item_aggregate: menu_item_aggregate
  menu_item_aggregate_fields: menu_item_aggregate_fields
  menu_item_avg_fields: menu_item_avg_fields
  menu_item_max_fields: menu_item_max_fields
  menu_item_min_fields: menu_item_min_fields
  menu_item_mutation_response: menu_item_mutation_response
  menu_item_stddev_fields: menu_item_stddev_fields
  menu_item_stddev_pop_fields: menu_item_stddev_pop_fields
  menu_item_stddev_samp_fields: menu_item_stddev_samp_fields
  menu_item_sum_fields: menu_item_sum_fields
  menu_item_var_pop_fields: menu_item_var_pop_fields
  menu_item_var_samp_fields: menu_item_var_samp_fields
  menu_item_variance_fields: menu_item_variance_fields
  nhood_labels: nhood_labels
  nhood_labels_aggregate: nhood_labels_aggregate
  nhood_labels_aggregate_fields: nhood_labels_aggregate_fields
  nhood_labels_avg_fields: nhood_labels_avg_fields
  nhood_labels_max_fields: nhood_labels_max_fields
  nhood_labels_min_fields: nhood_labels_min_fields
  nhood_labels_mutation_response: nhood_labels_mutation_response
  nhood_labels_stddev_fields: nhood_labels_stddev_fields
  nhood_labels_stddev_pop_fields: nhood_labels_stddev_pop_fields
  nhood_labels_stddev_samp_fields: nhood_labels_stddev_samp_fields
  nhood_labels_sum_fields: nhood_labels_sum_fields
  nhood_labels_var_pop_fields: nhood_labels_var_pop_fields
  nhood_labels_var_samp_fields: nhood_labels_var_samp_fields
  nhood_labels_variance_fields: nhood_labels_variance_fields
  opening_hours: opening_hours
  opening_hours_aggregate: opening_hours_aggregate
  opening_hours_aggregate_fields: opening_hours_aggregate_fields
  opening_hours_max_fields: opening_hours_max_fields
  opening_hours_min_fields: opening_hours_min_fields
  opening_hours_mutation_response: opening_hours_mutation_response
  photo: photo
  photo_aggregate: photo_aggregate
  photo_aggregate_fields: photo_aggregate_fields
  photo_avg_fields: photo_avg_fields
  photo_max_fields: photo_max_fields
  photo_min_fields: photo_min_fields
  photo_mutation_response: photo_mutation_response
  photo_stddev_fields: photo_stddev_fields
  photo_stddev_pop_fields: photo_stddev_pop_fields
  photo_stddev_samp_fields: photo_stddev_samp_fields
  photo_sum_fields: photo_sum_fields
  photo_var_pop_fields: photo_var_pop_fields
  photo_var_samp_fields: photo_var_samp_fields
  photo_variance_fields: photo_variance_fields
  photo_xref: photo_xref
  photo_xref_aggregate: photo_xref_aggregate
  photo_xref_aggregate_fields: photo_xref_aggregate_fields
  photo_xref_max_fields: photo_xref_max_fields
  photo_xref_min_fields: photo_xref_min_fields
  photo_xref_mutation_response: photo_xref_mutation_response
  restaurant: restaurant
  restaurant_aggregate: restaurant_aggregate
  restaurant_aggregate_fields: restaurant_aggregate_fields
  restaurant_avg_fields: restaurant_avg_fields
  restaurant_max_fields: restaurant_max_fields
  restaurant_min_fields: restaurant_min_fields
  restaurant_mutation_response: restaurant_mutation_response
  restaurant_stddev_fields: restaurant_stddev_fields
  restaurant_stddev_pop_fields: restaurant_stddev_pop_fields
  restaurant_stddev_samp_fields: restaurant_stddev_samp_fields
  restaurant_sum_fields: restaurant_sum_fields
  restaurant_tag: restaurant_tag
  restaurant_tag_aggregate: restaurant_tag_aggregate
  restaurant_tag_aggregate_fields: restaurant_tag_aggregate_fields
  restaurant_tag_avg_fields: restaurant_tag_avg_fields
  restaurant_tag_max_fields: restaurant_tag_max_fields
  restaurant_tag_min_fields: restaurant_tag_min_fields
  restaurant_tag_mutation_response: restaurant_tag_mutation_response
  restaurant_tag_stddev_fields: restaurant_tag_stddev_fields
  restaurant_tag_stddev_pop_fields: restaurant_tag_stddev_pop_fields
  restaurant_tag_stddev_samp_fields: restaurant_tag_stddev_samp_fields
  restaurant_tag_sum_fields: restaurant_tag_sum_fields
  restaurant_tag_var_pop_fields: restaurant_tag_var_pop_fields
  restaurant_tag_var_samp_fields: restaurant_tag_var_samp_fields
  restaurant_tag_variance_fields: restaurant_tag_variance_fields
  restaurant_var_pop_fields: restaurant_var_pop_fields
  restaurant_var_samp_fields: restaurant_var_samp_fields
  restaurant_variance_fields: restaurant_variance_fields
  review: review
  review_aggregate: review_aggregate
  review_aggregate_fields: review_aggregate_fields
  review_avg_fields: review_avg_fields
  review_max_fields: review_max_fields
  review_min_fields: review_min_fields
  review_mutation_response: review_mutation_response
  review_stddev_fields: review_stddev_fields
  review_stddev_pop_fields: review_stddev_pop_fields
  review_stddev_samp_fields: review_stddev_samp_fields
  review_sum_fields: review_sum_fields
  review_tag_sentence: review_tag_sentence
  review_tag_sentence_aggregate: review_tag_sentence_aggregate
  review_tag_sentence_aggregate_fields: review_tag_sentence_aggregate_fields
  review_tag_sentence_avg_fields: review_tag_sentence_avg_fields
  review_tag_sentence_max_fields: review_tag_sentence_max_fields
  review_tag_sentence_min_fields: review_tag_sentence_min_fields
  review_tag_sentence_mutation_response: review_tag_sentence_mutation_response
  review_tag_sentence_stddev_fields: review_tag_sentence_stddev_fields
  review_tag_sentence_stddev_pop_fields: review_tag_sentence_stddev_pop_fields
  review_tag_sentence_stddev_samp_fields: review_tag_sentence_stddev_samp_fields
  review_tag_sentence_sum_fields: review_tag_sentence_sum_fields
  review_tag_sentence_var_pop_fields: review_tag_sentence_var_pop_fields
  review_tag_sentence_var_samp_fields: review_tag_sentence_var_samp_fields
  review_tag_sentence_variance_fields: review_tag_sentence_variance_fields
  review_var_pop_fields: review_var_pop_fields
  review_var_samp_fields: review_var_samp_fields
  review_variance_fields: review_variance_fields
  setting: setting
  setting_aggregate: setting_aggregate
  setting_aggregate_fields: setting_aggregate_fields
  setting_max_fields: setting_max_fields
  setting_min_fields: setting_min_fields
  setting_mutation_response: setting_mutation_response
  tag: tag
  tag_aggregate: tag_aggregate
  tag_aggregate_fields: tag_aggregate_fields
  tag_avg_fields: tag_avg_fields
  tag_max_fields: tag_max_fields
  tag_min_fields: tag_min_fields
  tag_mutation_response: tag_mutation_response
  tag_stddev_fields: tag_stddev_fields
  tag_stddev_pop_fields: tag_stddev_pop_fields
  tag_stddev_samp_fields: tag_stddev_samp_fields
  tag_sum_fields: tag_sum_fields
  tag_tag: tag_tag
  tag_tag_aggregate: tag_tag_aggregate
  tag_tag_aggregate_fields: tag_tag_aggregate_fields
  tag_tag_max_fields: tag_tag_max_fields
  tag_tag_min_fields: tag_tag_min_fields
  tag_tag_mutation_response: tag_tag_mutation_response
  tag_var_pop_fields: tag_var_pop_fields
  tag_var_samp_fields: tag_var_samp_fields
  tag_variance_fields: tag_variance_fields
  user: user
  user_aggregate: user_aggregate
  user_aggregate_fields: user_aggregate_fields
  user_avg_fields: user_avg_fields
  user_max_fields: user_max_fields
  user_min_fields: user_min_fields
  user_mutation_response: user_mutation_response
  user_stddev_fields: user_stddev_fields
  user_stddev_pop_fields: user_stddev_pop_fields
  user_stddev_samp_fields: user_stddev_samp_fields
  user_sum_fields: user_sum_fields
  user_var_pop_fields: user_var_pop_fields
  user_var_samp_fields: user_var_samp_fields
  user_variance_fields: user_variance_fields
  zcta5: zcta5
  zcta5_aggregate: zcta5_aggregate
  zcta5_aggregate_fields: zcta5_aggregate_fields
  zcta5_avg_fields: zcta5_avg_fields
  zcta5_max_fields: zcta5_max_fields
  zcta5_min_fields: zcta5_min_fields
  zcta5_mutation_response: zcta5_mutation_response
  zcta5_stddev_fields: zcta5_stddev_fields
  zcta5_stddev_pop_fields: zcta5_stddev_pop_fields
  zcta5_stddev_samp_fields: zcta5_stddev_samp_fields
  zcta5_sum_fields: zcta5_sum_fields
  zcta5_var_pop_fields: zcta5_var_pop_fields
  zcta5_var_samp_fields: zcta5_var_samp_fields
  zcta5_variance_fields: zcta5_variance_fields
}
export type SchemaObjectTypesNames =
  | 'Mutation'
  | 'Query'
  | 'Subscription'
  | 'boundaries_city'
  | 'boundaries_city_aggregate'
  | 'boundaries_city_aggregate_fields'
  | 'boundaries_city_avg_fields'
  | 'boundaries_city_max_fields'
  | 'boundaries_city_min_fields'
  | 'boundaries_city_mutation_response'
  | 'boundaries_city_stddev_fields'
  | 'boundaries_city_stddev_pop_fields'
  | 'boundaries_city_stddev_samp_fields'
  | 'boundaries_city_sum_fields'
  | 'boundaries_city_var_pop_fields'
  | 'boundaries_city_var_samp_fields'
  | 'boundaries_city_variance_fields'
  | 'follow'
  | 'follow_aggregate'
  | 'follow_aggregate_fields'
  | 'follow_max_fields'
  | 'follow_min_fields'
  | 'follow_mutation_response'
  | 'hrr'
  | 'hrr_aggregate'
  | 'hrr_aggregate_fields'
  | 'hrr_avg_fields'
  | 'hrr_max_fields'
  | 'hrr_min_fields'
  | 'hrr_mutation_response'
  | 'hrr_stddev_fields'
  | 'hrr_stddev_pop_fields'
  | 'hrr_stddev_samp_fields'
  | 'hrr_sum_fields'
  | 'hrr_var_pop_fields'
  | 'hrr_var_samp_fields'
  | 'hrr_variance_fields'
  | 'list'
  | 'list_aggregate'
  | 'list_aggregate_fields'
  | 'list_avg_fields'
  | 'list_max_fields'
  | 'list_min_fields'
  | 'list_mutation_response'
  | 'list_region'
  | 'list_region_aggregate'
  | 'list_region_aggregate_fields'
  | 'list_region_max_fields'
  | 'list_region_min_fields'
  | 'list_region_mutation_response'
  | 'list_restaurant'
  | 'list_restaurant_aggregate'
  | 'list_restaurant_aggregate_fields'
  | 'list_restaurant_avg_fields'
  | 'list_restaurant_max_fields'
  | 'list_restaurant_min_fields'
  | 'list_restaurant_mutation_response'
  | 'list_restaurant_stddev_fields'
  | 'list_restaurant_stddev_pop_fields'
  | 'list_restaurant_stddev_samp_fields'
  | 'list_restaurant_sum_fields'
  | 'list_restaurant_tag'
  | 'list_restaurant_tag_aggregate'
  | 'list_restaurant_tag_aggregate_fields'
  | 'list_restaurant_tag_avg_fields'
  | 'list_restaurant_tag_max_fields'
  | 'list_restaurant_tag_min_fields'
  | 'list_restaurant_tag_mutation_response'
  | 'list_restaurant_tag_stddev_fields'
  | 'list_restaurant_tag_stddev_pop_fields'
  | 'list_restaurant_tag_stddev_samp_fields'
  | 'list_restaurant_tag_sum_fields'
  | 'list_restaurant_tag_var_pop_fields'
  | 'list_restaurant_tag_var_samp_fields'
  | 'list_restaurant_tag_variance_fields'
  | 'list_restaurant_var_pop_fields'
  | 'list_restaurant_var_samp_fields'
  | 'list_restaurant_variance_fields'
  | 'list_stddev_fields'
  | 'list_stddev_pop_fields'
  | 'list_stddev_samp_fields'
  | 'list_sum_fields'
  | 'list_tag'
  | 'list_tag_aggregate'
  | 'list_tag_aggregate_fields'
  | 'list_tag_max_fields'
  | 'list_tag_min_fields'
  | 'list_tag_mutation_response'
  | 'list_var_pop_fields'
  | 'list_var_samp_fields'
  | 'list_variance_fields'
  | 'menu_item'
  | 'menu_item_aggregate'
  | 'menu_item_aggregate_fields'
  | 'menu_item_avg_fields'
  | 'menu_item_max_fields'
  | 'menu_item_min_fields'
  | 'menu_item_mutation_response'
  | 'menu_item_stddev_fields'
  | 'menu_item_stddev_pop_fields'
  | 'menu_item_stddev_samp_fields'
  | 'menu_item_sum_fields'
  | 'menu_item_var_pop_fields'
  | 'menu_item_var_samp_fields'
  | 'menu_item_variance_fields'
  | 'nhood_labels'
  | 'nhood_labels_aggregate'
  | 'nhood_labels_aggregate_fields'
  | 'nhood_labels_avg_fields'
  | 'nhood_labels_max_fields'
  | 'nhood_labels_min_fields'
  | 'nhood_labels_mutation_response'
  | 'nhood_labels_stddev_fields'
  | 'nhood_labels_stddev_pop_fields'
  | 'nhood_labels_stddev_samp_fields'
  | 'nhood_labels_sum_fields'
  | 'nhood_labels_var_pop_fields'
  | 'nhood_labels_var_samp_fields'
  | 'nhood_labels_variance_fields'
  | 'opening_hours'
  | 'opening_hours_aggregate'
  | 'opening_hours_aggregate_fields'
  | 'opening_hours_max_fields'
  | 'opening_hours_min_fields'
  | 'opening_hours_mutation_response'
  | 'photo'
  | 'photo_aggregate'
  | 'photo_aggregate_fields'
  | 'photo_avg_fields'
  | 'photo_max_fields'
  | 'photo_min_fields'
  | 'photo_mutation_response'
  | 'photo_stddev_fields'
  | 'photo_stddev_pop_fields'
  | 'photo_stddev_samp_fields'
  | 'photo_sum_fields'
  | 'photo_var_pop_fields'
  | 'photo_var_samp_fields'
  | 'photo_variance_fields'
  | 'photo_xref'
  | 'photo_xref_aggregate'
  | 'photo_xref_aggregate_fields'
  | 'photo_xref_max_fields'
  | 'photo_xref_min_fields'
  | 'photo_xref_mutation_response'
  | 'restaurant'
  | 'restaurant_aggregate'
  | 'restaurant_aggregate_fields'
  | 'restaurant_avg_fields'
  | 'restaurant_max_fields'
  | 'restaurant_min_fields'
  | 'restaurant_mutation_response'
  | 'restaurant_stddev_fields'
  | 'restaurant_stddev_pop_fields'
  | 'restaurant_stddev_samp_fields'
  | 'restaurant_sum_fields'
  | 'restaurant_tag'
  | 'restaurant_tag_aggregate'
  | 'restaurant_tag_aggregate_fields'
  | 'restaurant_tag_avg_fields'
  | 'restaurant_tag_max_fields'
  | 'restaurant_tag_min_fields'
  | 'restaurant_tag_mutation_response'
  | 'restaurant_tag_stddev_fields'
  | 'restaurant_tag_stddev_pop_fields'
  | 'restaurant_tag_stddev_samp_fields'
  | 'restaurant_tag_sum_fields'
  | 'restaurant_tag_var_pop_fields'
  | 'restaurant_tag_var_samp_fields'
  | 'restaurant_tag_variance_fields'
  | 'restaurant_var_pop_fields'
  | 'restaurant_var_samp_fields'
  | 'restaurant_variance_fields'
  | 'review'
  | 'review_aggregate'
  | 'review_aggregate_fields'
  | 'review_avg_fields'
  | 'review_max_fields'
  | 'review_min_fields'
  | 'review_mutation_response'
  | 'review_stddev_fields'
  | 'review_stddev_pop_fields'
  | 'review_stddev_samp_fields'
  | 'review_sum_fields'
  | 'review_tag_sentence'
  | 'review_tag_sentence_aggregate'
  | 'review_tag_sentence_aggregate_fields'
  | 'review_tag_sentence_avg_fields'
  | 'review_tag_sentence_max_fields'
  | 'review_tag_sentence_min_fields'
  | 'review_tag_sentence_mutation_response'
  | 'review_tag_sentence_stddev_fields'
  | 'review_tag_sentence_stddev_pop_fields'
  | 'review_tag_sentence_stddev_samp_fields'
  | 'review_tag_sentence_sum_fields'
  | 'review_tag_sentence_var_pop_fields'
  | 'review_tag_sentence_var_samp_fields'
  | 'review_tag_sentence_variance_fields'
  | 'review_var_pop_fields'
  | 'review_var_samp_fields'
  | 'review_variance_fields'
  | 'setting'
  | 'setting_aggregate'
  | 'setting_aggregate_fields'
  | 'setting_max_fields'
  | 'setting_min_fields'
  | 'setting_mutation_response'
  | 'tag'
  | 'tag_aggregate'
  | 'tag_aggregate_fields'
  | 'tag_avg_fields'
  | 'tag_max_fields'
  | 'tag_min_fields'
  | 'tag_mutation_response'
  | 'tag_stddev_fields'
  | 'tag_stddev_pop_fields'
  | 'tag_stddev_samp_fields'
  | 'tag_sum_fields'
  | 'tag_tag'
  | 'tag_tag_aggregate'
  | 'tag_tag_aggregate_fields'
  | 'tag_tag_max_fields'
  | 'tag_tag_min_fields'
  | 'tag_tag_mutation_response'
  | 'tag_var_pop_fields'
  | 'tag_var_samp_fields'
  | 'tag_variance_fields'
  | 'user'
  | 'user_aggregate'
  | 'user_aggregate_fields'
  | 'user_avg_fields'
  | 'user_max_fields'
  | 'user_min_fields'
  | 'user_mutation_response'
  | 'user_stddev_fields'
  | 'user_stddev_pop_fields'
  | 'user_stddev_samp_fields'
  | 'user_sum_fields'
  | 'user_var_pop_fields'
  | 'user_var_samp_fields'
  | 'user_variance_fields'
  | 'zcta5'
  | 'zcta5_aggregate'
  | 'zcta5_aggregate_fields'
  | 'zcta5_avg_fields'
  | 'zcta5_max_fields'
  | 'zcta5_min_fields'
  | 'zcta5_mutation_response'
  | 'zcta5_stddev_fields'
  | 'zcta5_stddev_pop_fields'
  | 'zcta5_stddev_samp_fields'
  | 'zcta5_sum_fields'
  | 'zcta5_var_pop_fields'
  | 'zcta5_var_samp_fields'
  | 'zcta5_variance_fields'

export interface GeneratedSchema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}

export type MakeNullable<T> = {
  [K in keyof T]: T[K] | undefined
}

export interface ScalarsEnums extends MakeNullable<Scalars> {
  boundaries_city_constraint: boundaries_city_constraint | undefined
  boundaries_city_select_column: boundaries_city_select_column | undefined
  boundaries_city_update_column: boundaries_city_update_column | undefined
  cursor_ordering: cursor_ordering | undefined
  follow_constraint: follow_constraint | undefined
  follow_select_column: follow_select_column | undefined
  follow_update_column: follow_update_column | undefined
  hrr_constraint: hrr_constraint | undefined
  hrr_select_column: hrr_select_column | undefined
  hrr_update_column: hrr_update_column | undefined
  list_constraint: list_constraint | undefined
  list_region_constraint: list_region_constraint | undefined
  list_region_select_column: list_region_select_column | undefined
  list_region_update_column: list_region_update_column | undefined
  list_restaurant_constraint: list_restaurant_constraint | undefined
  list_restaurant_select_column: list_restaurant_select_column | undefined
  list_restaurant_tag_constraint: list_restaurant_tag_constraint | undefined
  list_restaurant_tag_select_column: list_restaurant_tag_select_column | undefined
  list_restaurant_tag_update_column: list_restaurant_tag_update_column | undefined
  list_restaurant_update_column: list_restaurant_update_column | undefined
  list_select_column: list_select_column | undefined
  list_select_column_list_aggregate_bool_exp_bool_and_arguments_columns:
    | list_select_column_list_aggregate_bool_exp_bool_and_arguments_columns
    | undefined
  list_select_column_list_aggregate_bool_exp_bool_or_arguments_columns:
    | list_select_column_list_aggregate_bool_exp_bool_or_arguments_columns
    | undefined
  list_tag_constraint: list_tag_constraint | undefined
  list_tag_select_column: list_tag_select_column | undefined
  list_tag_update_column: list_tag_update_column | undefined
  list_update_column: list_update_column | undefined
  menu_item_constraint: menu_item_constraint | undefined
  menu_item_select_column: menu_item_select_column | undefined
  menu_item_update_column: menu_item_update_column | undefined
  nhood_labels_constraint: nhood_labels_constraint | undefined
  nhood_labels_select_column: nhood_labels_select_column | undefined
  nhood_labels_update_column: nhood_labels_update_column | undefined
  opening_hours_constraint: opening_hours_constraint | undefined
  opening_hours_select_column: opening_hours_select_column | undefined
  opening_hours_update_column: opening_hours_update_column | undefined
  order_by: order_by | undefined
  photo_constraint: photo_constraint | undefined
  photo_select_column: photo_select_column | undefined
  photo_update_column: photo_update_column | undefined
  photo_xref_constraint: photo_xref_constraint | undefined
  photo_xref_select_column: photo_xref_select_column | undefined
  photo_xref_update_column: photo_xref_update_column | undefined
  restaurant_constraint: restaurant_constraint | undefined
  restaurant_select_column: restaurant_select_column | undefined
  restaurant_select_column_restaurant_aggregate_bool_exp_bool_and_arguments_columns:
    | restaurant_select_column_restaurant_aggregate_bool_exp_bool_and_arguments_columns
    | undefined
  restaurant_select_column_restaurant_aggregate_bool_exp_bool_or_arguments_columns:
    | restaurant_select_column_restaurant_aggregate_bool_exp_bool_or_arguments_columns
    | undefined
  restaurant_tag_constraint: restaurant_tag_constraint | undefined
  restaurant_tag_select_column: restaurant_tag_select_column | undefined
  restaurant_tag_update_column: restaurant_tag_update_column | undefined
  restaurant_update_column: restaurant_update_column | undefined
  review_constraint: review_constraint | undefined
  review_select_column: review_select_column | undefined
  review_select_column_review_aggregate_bool_exp_bool_and_arguments_columns:
    | review_select_column_review_aggregate_bool_exp_bool_and_arguments_columns
    | undefined
  review_select_column_review_aggregate_bool_exp_bool_or_arguments_columns:
    | review_select_column_review_aggregate_bool_exp_bool_or_arguments_columns
    | undefined
  review_tag_sentence_constraint: review_tag_sentence_constraint | undefined
  review_tag_sentence_select_column: review_tag_sentence_select_column | undefined
  review_tag_sentence_update_column: review_tag_sentence_update_column | undefined
  review_update_column: review_update_column | undefined
  setting_constraint: setting_constraint | undefined
  setting_select_column: setting_select_column | undefined
  setting_update_column: setting_update_column | undefined
  tag_constraint: tag_constraint | undefined
  tag_select_column: tag_select_column | undefined
  tag_tag_constraint: tag_tag_constraint | undefined
  tag_tag_select_column: tag_tag_select_column | undefined
  tag_tag_update_column: tag_tag_update_column | undefined
  tag_update_column: tag_update_column | undefined
  user_constraint: user_constraint | undefined
  user_select_column: user_select_column | undefined
  user_update_column: user_update_column | undefined
  zcta5_constraint: zcta5_constraint | undefined
  zcta5_select_column: zcta5_select_column | undefined
  zcta5_update_column: zcta5_update_column | undefined
}
