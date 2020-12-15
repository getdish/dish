import { ScalarsEnumsHash } from '@dish/gqless'

export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  float8: any
  geography: any
  geometry: any
  jsonb: any
  numeric: any
  timestamptz: any
  tsrange: any
  uuid: any
}

/** expression to compare columns of type Boolean. All fields are combined with logical 'AND'. */
export interface Boolean_comparison_exp {
  _eq?: Maybe<Scalars['Boolean']>
  _gt?: Maybe<Scalars['Boolean']>
  _gte?: Maybe<Scalars['Boolean']>
  _in?: Maybe<Array<Scalars['Boolean']>>
  _is_null?: Maybe<Scalars['Boolean']>
  _lt?: Maybe<Scalars['Boolean']>
  _lte?: Maybe<Scalars['Boolean']>
  _neq?: Maybe<Scalars['Boolean']>
  _nin?: Maybe<Array<Scalars['Boolean']>>
}

/** expression to compare columns of type Int. All fields are combined with logical 'AND'. */
export interface Int_comparison_exp {
  _eq?: Maybe<Scalars['Int']>
  _gt?: Maybe<Scalars['Int']>
  _gte?: Maybe<Scalars['Int']>
  _in?: Maybe<Array<Scalars['Int']>>
  _is_null?: Maybe<Scalars['Boolean']>
  _lt?: Maybe<Scalars['Int']>
  _lte?: Maybe<Scalars['Int']>
  _neq?: Maybe<Scalars['Int']>
  _nin?: Maybe<Array<Scalars['Int']>>
}

/** expression to compare columns of type String. All fields are combined with logical 'AND'. */
export interface String_comparison_exp {
  _eq?: Maybe<Scalars['String']>
  _gt?: Maybe<Scalars['String']>
  _gte?: Maybe<Scalars['String']>
  _ilike?: Maybe<Scalars['String']>
  _in?: Maybe<Array<Scalars['String']>>
  _is_null?: Maybe<Scalars['Boolean']>
  _like?: Maybe<Scalars['String']>
  _lt?: Maybe<Scalars['String']>
  _lte?: Maybe<Scalars['String']>
  _neq?: Maybe<Scalars['String']>
  _nilike?: Maybe<Scalars['String']>
  _nin?: Maybe<Array<Scalars['String']>>
  _nlike?: Maybe<Scalars['String']>
  _nsimilar?: Maybe<Scalars['String']>
  _similar?: Maybe<Scalars['String']>
}

/** expression to compare columns of type float8. All fields are combined with logical 'AND'. */
export interface float8_comparison_exp {
  _eq?: Maybe<Scalars['float8']>
  _gt?: Maybe<Scalars['float8']>
  _gte?: Maybe<Scalars['float8']>
  _in?: Maybe<Array<Scalars['float8']>>
  _is_null?: Maybe<Scalars['Boolean']>
  _lt?: Maybe<Scalars['float8']>
  _lte?: Maybe<Scalars['float8']>
  _neq?: Maybe<Scalars['float8']>
  _nin?: Maybe<Array<Scalars['float8']>>
}

/** Expression to compare the result of casting a column of type geography. Multiple cast targets are combined with logical 'AND'. */
export interface geography_cast_exp {
  geometry?: Maybe<geometry_comparison_exp>
}

/** expression to compare columns of type geography. All fields are combined with logical 'AND'. */
export interface geography_comparison_exp {
  _cast?: Maybe<geography_cast_exp>
  _eq?: Maybe<Scalars['geography']>
  _gt?: Maybe<Scalars['geography']>
  _gte?: Maybe<Scalars['geography']>
  _in?: Maybe<Array<Scalars['geography']>>
  _is_null?: Maybe<Scalars['Boolean']>
  _lt?: Maybe<Scalars['geography']>
  _lte?: Maybe<Scalars['geography']>
  _neq?: Maybe<Scalars['geography']>
  _nin?: Maybe<Array<Scalars['geography']>>
  /** is the column within a distance from a geography value */
  _st_d_within?: Maybe<st_d_within_geography_input>
  /** does the column spatially intersect the given geography value */
  _st_intersects?: Maybe<Scalars['geography']>
}

/** Expression to compare the result of casting a column of type geometry. Multiple cast targets are combined with logical 'AND'. */
export interface geometry_cast_exp {
  geography?: Maybe<geography_comparison_exp>
}

/** expression to compare columns of type geometry. All fields are combined with logical 'AND'. */
export interface geometry_comparison_exp {
  _cast?: Maybe<geometry_cast_exp>
  _eq?: Maybe<Scalars['geometry']>
  _gt?: Maybe<Scalars['geometry']>
  _gte?: Maybe<Scalars['geometry']>
  _in?: Maybe<Array<Scalars['geometry']>>
  _is_null?: Maybe<Scalars['Boolean']>
  _lt?: Maybe<Scalars['geometry']>
  _lte?: Maybe<Scalars['geometry']>
  _neq?: Maybe<Scalars['geometry']>
  _nin?: Maybe<Array<Scalars['geometry']>>
  /** does the column contain the given geometry value */
  _st_contains?: Maybe<Scalars['geometry']>
  /** does the column crosses the given geometry value */
  _st_crosses?: Maybe<Scalars['geometry']>
  /** is the column within a distance from a geometry value */
  _st_d_within?: Maybe<st_d_within_input>
  /** is the column equal to given geometry value. Directionality is ignored */
  _st_equals?: Maybe<Scalars['geometry']>
  /** does the column spatially intersect the given geometry value */
  _st_intersects?: Maybe<Scalars['geometry']>
  /** does the column 'spatially overlap' (intersect but not completely contain) the given geometry value */
  _st_overlaps?: Maybe<Scalars['geometry']>
  /** does the column have atleast one point in common with the given geometry value */
  _st_touches?: Maybe<Scalars['geometry']>
  /** is the column contained in the given geometry value */
  _st_within?: Maybe<Scalars['geometry']>
}

/** order by aggregate values of table "hrr" */
export interface hrr_aggregate_order_by {
  avg?: Maybe<hrr_avg_order_by>
  count?: Maybe<order_by>
  max?: Maybe<hrr_max_order_by>
  min?: Maybe<hrr_min_order_by>
  stddev?: Maybe<hrr_stddev_order_by>
  stddev_pop?: Maybe<hrr_stddev_pop_order_by>
  stddev_samp?: Maybe<hrr_stddev_samp_order_by>
  sum?: Maybe<hrr_sum_order_by>
  var_pop?: Maybe<hrr_var_pop_order_by>
  var_samp?: Maybe<hrr_var_samp_order_by>
  variance?: Maybe<hrr_variance_order_by>
}

/** input type for inserting array relation for remote table "hrr" */
export interface hrr_arr_rel_insert_input {
  data: Array<hrr_insert_input>
  on_conflict?: Maybe<hrr_on_conflict>
}

/** order by avg() on columns of table "hrr" */
export interface hrr_avg_order_by {
  hrr_bdry_i?: Maybe<order_by>
  hrrnum?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
}

/** Boolean expression to filter rows from the table "hrr". All fields are combined with a logical 'AND'. */
export interface hrr_bool_exp {
  _and?: Maybe<Array<Maybe<hrr_bool_exp>>>
  _not?: Maybe<hrr_bool_exp>
  _or?: Maybe<Array<Maybe<hrr_bool_exp>>>
  hrr_bdry_i?: Maybe<float8_comparison_exp>
  hrrcity?: Maybe<String_comparison_exp>
  hrrnum?: Maybe<Int_comparison_exp>
  ogc_fid?: Maybe<Int_comparison_exp>
  slug?: Maybe<String_comparison_exp>
  wkb_geometry?: Maybe<geometry_comparison_exp>
}

/** unique or primary key constraints on table "hrr" */
export enum hrr_constraint {
  /** unique or primary key constraint */
  hrr_pkey = 'hrr_pkey',
  /** unique or primary key constraint */
  hrr_slug_key = 'hrr_slug_key',
}

/** input type for incrementing integer column in table "hrr" */
export interface hrr_inc_input {
  hrr_bdry_i?: Maybe<Scalars['float8']>
  hrrnum?: Maybe<Scalars['Int']>
  ogc_fid?: Maybe<Scalars['Int']>
}

/** input type for inserting data into table "hrr" */
export interface hrr_insert_input {
  hrr_bdry_i?: Maybe<Scalars['float8']>
  hrrcity?: Maybe<Scalars['String']>
  hrrnum?: Maybe<Scalars['Int']>
  ogc_fid?: Maybe<Scalars['Int']>
  slug?: Maybe<Scalars['String']>
  wkb_geometry?: Maybe<Scalars['geometry']>
}

/** order by max() on columns of table "hrr" */
export interface hrr_max_order_by {
  hrr_bdry_i?: Maybe<order_by>
  hrrcity?: Maybe<order_by>
  hrrnum?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
  slug?: Maybe<order_by>
}

/** order by min() on columns of table "hrr" */
export interface hrr_min_order_by {
  hrr_bdry_i?: Maybe<order_by>
  hrrcity?: Maybe<order_by>
  hrrnum?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
  slug?: Maybe<order_by>
}

/** input type for inserting object relation for remote table "hrr" */
export interface hrr_obj_rel_insert_input {
  data: hrr_insert_input
  on_conflict?: Maybe<hrr_on_conflict>
}

/** on conflict condition type for table "hrr" */
export interface hrr_on_conflict {
  constraint: hrr_constraint
  update_columns: Array<hrr_update_column>
  where?: Maybe<hrr_bool_exp>
}

/** ordering options when selecting data from "hrr" */
export interface hrr_order_by {
  hrr_bdry_i?: Maybe<order_by>
  hrrcity?: Maybe<order_by>
  hrrnum?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
  slug?: Maybe<order_by>
  wkb_geometry?: Maybe<order_by>
}

/** primary key columns input for table: "hrr" */
export interface hrr_pk_columns_input {
  ogc_fid: Scalars['Int']
}

/** select columns of table "hrr" */
export enum hrr_select_column {
  /** column name */
  hrr_bdry_i = 'hrr_bdry_i',
  /** column name */
  hrrcity = 'hrrcity',
  /** column name */
  hrrnum = 'hrrnum',
  /** column name */
  ogc_fid = 'ogc_fid',
  /** column name */
  slug = 'slug',
  /** column name */
  wkb_geometry = 'wkb_geometry',
}

/** input type for updating data in table "hrr" */
export interface hrr_set_input {
  hrr_bdry_i?: Maybe<Scalars['float8']>
  hrrcity?: Maybe<Scalars['String']>
  hrrnum?: Maybe<Scalars['Int']>
  ogc_fid?: Maybe<Scalars['Int']>
  slug?: Maybe<Scalars['String']>
  wkb_geometry?: Maybe<Scalars['geometry']>
}

/** order by stddev() on columns of table "hrr" */
export interface hrr_stddev_order_by {
  hrr_bdry_i?: Maybe<order_by>
  hrrnum?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
}

/** order by stddev_pop() on columns of table "hrr" */
export interface hrr_stddev_pop_order_by {
  hrr_bdry_i?: Maybe<order_by>
  hrrnum?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
}

/** order by stddev_samp() on columns of table "hrr" */
export interface hrr_stddev_samp_order_by {
  hrr_bdry_i?: Maybe<order_by>
  hrrnum?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
}

/** order by sum() on columns of table "hrr" */
export interface hrr_sum_order_by {
  hrr_bdry_i?: Maybe<order_by>
  hrrnum?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
}

/** update columns of table "hrr" */
export enum hrr_update_column {
  /** column name */
  hrr_bdry_i = 'hrr_bdry_i',
  /** column name */
  hrrcity = 'hrrcity',
  /** column name */
  hrrnum = 'hrrnum',
  /** column name */
  ogc_fid = 'ogc_fid',
  /** column name */
  slug = 'slug',
  /** column name */
  wkb_geometry = 'wkb_geometry',
}

/** order by var_pop() on columns of table "hrr" */
export interface hrr_var_pop_order_by {
  hrr_bdry_i?: Maybe<order_by>
  hrrnum?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
}

/** order by var_samp() on columns of table "hrr" */
export interface hrr_var_samp_order_by {
  hrr_bdry_i?: Maybe<order_by>
  hrrnum?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
}

/** order by variance() on columns of table "hrr" */
export interface hrr_variance_order_by {
  hrr_bdry_i?: Maybe<order_by>
  hrrnum?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
}

/** expression to compare columns of type jsonb. All fields are combined with logical 'AND'. */
export interface jsonb_comparison_exp {
  /** is the column contained in the given json value */
  _contained_in?: Maybe<Scalars['jsonb']>
  /** does the column contain the given json value at the top level */
  _contains?: Maybe<Scalars['jsonb']>
  _eq?: Maybe<Scalars['jsonb']>
  _gt?: Maybe<Scalars['jsonb']>
  _gte?: Maybe<Scalars['jsonb']>
  /** does the string exist as a top-level key in the column */
  _has_key?: Maybe<Scalars['String']>
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: Maybe<Array<Scalars['String']>>
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: Maybe<Array<Scalars['String']>>
  _in?: Maybe<Array<Scalars['jsonb']>>
  _is_null?: Maybe<Scalars['Boolean']>
  _lt?: Maybe<Scalars['jsonb']>
  _lte?: Maybe<Scalars['jsonb']>
  _neq?: Maybe<Scalars['jsonb']>
  _nin?: Maybe<Array<Scalars['jsonb']>>
}

/** order by aggregate values of table "menu_item" */
export interface menu_item_aggregate_order_by {
  avg?: Maybe<menu_item_avg_order_by>
  count?: Maybe<order_by>
  max?: Maybe<menu_item_max_order_by>
  min?: Maybe<menu_item_min_order_by>
  stddev?: Maybe<menu_item_stddev_order_by>
  stddev_pop?: Maybe<menu_item_stddev_pop_order_by>
  stddev_samp?: Maybe<menu_item_stddev_samp_order_by>
  sum?: Maybe<menu_item_sum_order_by>
  var_pop?: Maybe<menu_item_var_pop_order_by>
  var_samp?: Maybe<menu_item_var_samp_order_by>
  variance?: Maybe<menu_item_variance_order_by>
}

/** input type for inserting array relation for remote table "menu_item" */
export interface menu_item_arr_rel_insert_input {
  data: Array<menu_item_insert_input>
  on_conflict?: Maybe<menu_item_on_conflict>
}

/** order by avg() on columns of table "menu_item" */
export interface menu_item_avg_order_by {
  price?: Maybe<order_by>
}

/** Boolean expression to filter rows from the table "menu_item". All fields are combined with a logical 'AND'. */
export interface menu_item_bool_exp {
  _and?: Maybe<Array<Maybe<menu_item_bool_exp>>>
  _not?: Maybe<menu_item_bool_exp>
  _or?: Maybe<Array<Maybe<menu_item_bool_exp>>>
  created_at?: Maybe<timestamptz_comparison_exp>
  description?: Maybe<String_comparison_exp>
  id?: Maybe<uuid_comparison_exp>
  image?: Maybe<String_comparison_exp>
  location?: Maybe<geometry_comparison_exp>
  name?: Maybe<String_comparison_exp>
  price?: Maybe<Int_comparison_exp>
  restaurant?: Maybe<restaurant_bool_exp>
  restaurant_id?: Maybe<uuid_comparison_exp>
  updated_at?: Maybe<timestamptz_comparison_exp>
}

/** unique or primary key constraints on table "menu_item" */
export enum menu_item_constraint {
  /** unique or primary key constraint */
  menu_item_pkey = 'menu_item_pkey',
  /** unique or primary key constraint */
  menu_item_restaurant_id_name_key = 'menu_item_restaurant_id_name_key',
}

/** input type for incrementing integer column in table "menu_item" */
export interface menu_item_inc_input {
  price?: Maybe<Scalars['Int']>
}

/** input type for inserting data into table "menu_item" */
export interface menu_item_insert_input {
  created_at?: Maybe<Scalars['timestamptz']>
  description?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['uuid']>
  image?: Maybe<Scalars['String']>
  location?: Maybe<Scalars['geometry']>
  name?: Maybe<Scalars['String']>
  price?: Maybe<Scalars['Int']>
  restaurant?: Maybe<restaurant_obj_rel_insert_input>
  restaurant_id?: Maybe<Scalars['uuid']>
  updated_at?: Maybe<Scalars['timestamptz']>
}

/** order by max() on columns of table "menu_item" */
export interface menu_item_max_order_by {
  created_at?: Maybe<order_by>
  description?: Maybe<order_by>
  id?: Maybe<order_by>
  image?: Maybe<order_by>
  name?: Maybe<order_by>
  price?: Maybe<order_by>
  restaurant_id?: Maybe<order_by>
  updated_at?: Maybe<order_by>
}

/** order by min() on columns of table "menu_item" */
export interface menu_item_min_order_by {
  created_at?: Maybe<order_by>
  description?: Maybe<order_by>
  id?: Maybe<order_by>
  image?: Maybe<order_by>
  name?: Maybe<order_by>
  price?: Maybe<order_by>
  restaurant_id?: Maybe<order_by>
  updated_at?: Maybe<order_by>
}

/** input type for inserting object relation for remote table "menu_item" */
export interface menu_item_obj_rel_insert_input {
  data: menu_item_insert_input
  on_conflict?: Maybe<menu_item_on_conflict>
}

/** on conflict condition type for table "menu_item" */
export interface menu_item_on_conflict {
  constraint: menu_item_constraint
  update_columns: Array<menu_item_update_column>
  where?: Maybe<menu_item_bool_exp>
}

/** ordering options when selecting data from "menu_item" */
export interface menu_item_order_by {
  created_at?: Maybe<order_by>
  description?: Maybe<order_by>
  id?: Maybe<order_by>
  image?: Maybe<order_by>
  location?: Maybe<order_by>
  name?: Maybe<order_by>
  price?: Maybe<order_by>
  restaurant?: Maybe<restaurant_order_by>
  restaurant_id?: Maybe<order_by>
  updated_at?: Maybe<order_by>
}

/** primary key columns input for table: "menu_item" */
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
  created_at?: Maybe<Scalars['timestamptz']>
  description?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['uuid']>
  image?: Maybe<Scalars['String']>
  location?: Maybe<Scalars['geometry']>
  name?: Maybe<Scalars['String']>
  price?: Maybe<Scalars['Int']>
  restaurant_id?: Maybe<Scalars['uuid']>
  updated_at?: Maybe<Scalars['timestamptz']>
}

/** order by stddev() on columns of table "menu_item" */
export interface menu_item_stddev_order_by {
  price?: Maybe<order_by>
}

/** order by stddev_pop() on columns of table "menu_item" */
export interface menu_item_stddev_pop_order_by {
  price?: Maybe<order_by>
}

/** order by stddev_samp() on columns of table "menu_item" */
export interface menu_item_stddev_samp_order_by {
  price?: Maybe<order_by>
}

/** order by sum() on columns of table "menu_item" */
export interface menu_item_sum_order_by {
  price?: Maybe<order_by>
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

/** order by var_pop() on columns of table "menu_item" */
export interface menu_item_var_pop_order_by {
  price?: Maybe<order_by>
}

/** order by var_samp() on columns of table "menu_item" */
export interface menu_item_var_samp_order_by {
  price?: Maybe<order_by>
}

/** order by variance() on columns of table "menu_item" */
export interface menu_item_variance_order_by {
  price?: Maybe<order_by>
}

/** order by aggregate values of table "nhood_labels" */
export interface nhood_labels_aggregate_order_by {
  avg?: Maybe<nhood_labels_avg_order_by>
  count?: Maybe<order_by>
  max?: Maybe<nhood_labels_max_order_by>
  min?: Maybe<nhood_labels_min_order_by>
  stddev?: Maybe<nhood_labels_stddev_order_by>
  stddev_pop?: Maybe<nhood_labels_stddev_pop_order_by>
  stddev_samp?: Maybe<nhood_labels_stddev_samp_order_by>
  sum?: Maybe<nhood_labels_sum_order_by>
  var_pop?: Maybe<nhood_labels_var_pop_order_by>
  var_samp?: Maybe<nhood_labels_var_samp_order_by>
  variance?: Maybe<nhood_labels_variance_order_by>
}

/** input type for inserting array relation for remote table "nhood_labels" */
export interface nhood_labels_arr_rel_insert_input {
  data: Array<nhood_labels_insert_input>
  on_conflict?: Maybe<nhood_labels_on_conflict>
}

/** order by avg() on columns of table "nhood_labels" */
export interface nhood_labels_avg_order_by {
  ogc_fid?: Maybe<order_by>
}

/** Boolean expression to filter rows from the table "nhood_labels". All fields are combined with a logical 'AND'. */
export interface nhood_labels_bool_exp {
  _and?: Maybe<Array<Maybe<nhood_labels_bool_exp>>>
  _not?: Maybe<nhood_labels_bool_exp>
  _or?: Maybe<Array<Maybe<nhood_labels_bool_exp>>>
  center?: Maybe<geometry_comparison_exp>
  name?: Maybe<String_comparison_exp>
  ogc_fid?: Maybe<Int_comparison_exp>
}

/** unique or primary key constraints on table "nhood_labels" */
export enum nhood_labels_constraint {
  /** unique or primary key constraint */
  nhood_labels_pkey = 'nhood_labels_pkey',
}

/** input type for incrementing integer column in table "nhood_labels" */
export interface nhood_labels_inc_input {
  ogc_fid?: Maybe<Scalars['Int']>
}

/** input type for inserting data into table "nhood_labels" */
export interface nhood_labels_insert_input {
  center?: Maybe<Scalars['geometry']>
  name?: Maybe<Scalars['String']>
  ogc_fid?: Maybe<Scalars['Int']>
}

/** order by max() on columns of table "nhood_labels" */
export interface nhood_labels_max_order_by {
  name?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
}

/** order by min() on columns of table "nhood_labels" */
export interface nhood_labels_min_order_by {
  name?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
}

/** input type for inserting object relation for remote table "nhood_labels" */
export interface nhood_labels_obj_rel_insert_input {
  data: nhood_labels_insert_input
  on_conflict?: Maybe<nhood_labels_on_conflict>
}

/** on conflict condition type for table "nhood_labels" */
export interface nhood_labels_on_conflict {
  constraint: nhood_labels_constraint
  update_columns: Array<nhood_labels_update_column>
  where?: Maybe<nhood_labels_bool_exp>
}

/** ordering options when selecting data from "nhood_labels" */
export interface nhood_labels_order_by {
  center?: Maybe<order_by>
  name?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
}

/** primary key columns input for table: "nhood_labels" */
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
  center?: Maybe<Scalars['geometry']>
  name?: Maybe<Scalars['String']>
  ogc_fid?: Maybe<Scalars['Int']>
}

/** order by stddev() on columns of table "nhood_labels" */
export interface nhood_labels_stddev_order_by {
  ogc_fid?: Maybe<order_by>
}

/** order by stddev_pop() on columns of table "nhood_labels" */
export interface nhood_labels_stddev_pop_order_by {
  ogc_fid?: Maybe<order_by>
}

/** order by stddev_samp() on columns of table "nhood_labels" */
export interface nhood_labels_stddev_samp_order_by {
  ogc_fid?: Maybe<order_by>
}

/** order by sum() on columns of table "nhood_labels" */
export interface nhood_labels_sum_order_by {
  ogc_fid?: Maybe<order_by>
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

/** order by var_pop() on columns of table "nhood_labels" */
export interface nhood_labels_var_pop_order_by {
  ogc_fid?: Maybe<order_by>
}

/** order by var_samp() on columns of table "nhood_labels" */
export interface nhood_labels_var_samp_order_by {
  ogc_fid?: Maybe<order_by>
}

/** order by variance() on columns of table "nhood_labels" */
export interface nhood_labels_variance_order_by {
  ogc_fid?: Maybe<order_by>
}

/** expression to compare columns of type numeric. All fields are combined with logical 'AND'. */
export interface numeric_comparison_exp {
  _eq?: Maybe<Scalars['numeric']>
  _gt?: Maybe<Scalars['numeric']>
  _gte?: Maybe<Scalars['numeric']>
  _in?: Maybe<Array<Scalars['numeric']>>
  _is_null?: Maybe<Scalars['Boolean']>
  _lt?: Maybe<Scalars['numeric']>
  _lte?: Maybe<Scalars['numeric']>
  _neq?: Maybe<Scalars['numeric']>
  _nin?: Maybe<Array<Scalars['numeric']>>
}

/** order by aggregate values of table "opening_hours" */
export interface opening_hours_aggregate_order_by {
  count?: Maybe<order_by>
  max?: Maybe<opening_hours_max_order_by>
  min?: Maybe<opening_hours_min_order_by>
}

/** input type for inserting array relation for remote table "opening_hours" */
export interface opening_hours_arr_rel_insert_input {
  data: Array<opening_hours_insert_input>
  on_conflict?: Maybe<opening_hours_on_conflict>
}

/** Boolean expression to filter rows from the table "opening_hours". All fields are combined with a logical 'AND'. */
export interface opening_hours_bool_exp {
  _and?: Maybe<Array<Maybe<opening_hours_bool_exp>>>
  _not?: Maybe<opening_hours_bool_exp>
  _or?: Maybe<Array<Maybe<opening_hours_bool_exp>>>
  hours?: Maybe<tsrange_comparison_exp>
  id?: Maybe<uuid_comparison_exp>
  restaurant?: Maybe<restaurant_bool_exp>
  restaurant_id?: Maybe<uuid_comparison_exp>
}

/** unique or primary key constraints on table "opening_hours" */
export enum opening_hours_constraint {
  /** unique or primary key constraint */
  opening_hours_pkey = 'opening_hours_pkey',
}

/** input type for inserting data into table "opening_hours" */
export interface opening_hours_insert_input {
  hours?: Maybe<Scalars['tsrange']>
  id?: Maybe<Scalars['uuid']>
  restaurant?: Maybe<restaurant_obj_rel_insert_input>
  restaurant_id?: Maybe<Scalars['uuid']>
}

/** order by max() on columns of table "opening_hours" */
export interface opening_hours_max_order_by {
  id?: Maybe<order_by>
  restaurant_id?: Maybe<order_by>
}

/** order by min() on columns of table "opening_hours" */
export interface opening_hours_min_order_by {
  id?: Maybe<order_by>
  restaurant_id?: Maybe<order_by>
}

/** input type for inserting object relation for remote table "opening_hours" */
export interface opening_hours_obj_rel_insert_input {
  data: opening_hours_insert_input
  on_conflict?: Maybe<opening_hours_on_conflict>
}

/** on conflict condition type for table "opening_hours" */
export interface opening_hours_on_conflict {
  constraint: opening_hours_constraint
  update_columns: Array<opening_hours_update_column>
  where?: Maybe<opening_hours_bool_exp>
}

/** ordering options when selecting data from "opening_hours" */
export interface opening_hours_order_by {
  hours?: Maybe<order_by>
  id?: Maybe<order_by>
  restaurant?: Maybe<restaurant_order_by>
  restaurant_id?: Maybe<order_by>
}

/** primary key columns input for table: "opening_hours" */
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
  hours?: Maybe<Scalars['tsrange']>
  id?: Maybe<Scalars['uuid']>
  restaurant_id?: Maybe<Scalars['uuid']>
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

/** column ordering options */
export enum order_by {
  /** in the ascending order, nulls last */
  asc = 'asc',
  /** in the ascending order, nulls first */
  asc_nulls_first = 'asc_nulls_first',
  /** in the ascending order, nulls last */
  asc_nulls_last = 'asc_nulls_last',
  /** in the descending order, nulls first */
  desc = 'desc',
  /** in the descending order, nulls first */
  desc_nulls_first = 'desc_nulls_first',
  /** in the descending order, nulls last */
  desc_nulls_last = 'desc_nulls_last',
}

/** order by aggregate values of table "photo" */
export interface photo_aggregate_order_by {
  avg?: Maybe<photo_avg_order_by>
  count?: Maybe<order_by>
  max?: Maybe<photo_max_order_by>
  min?: Maybe<photo_min_order_by>
  stddev?: Maybe<photo_stddev_order_by>
  stddev_pop?: Maybe<photo_stddev_pop_order_by>
  stddev_samp?: Maybe<photo_stddev_samp_order_by>
  sum?: Maybe<photo_sum_order_by>
  var_pop?: Maybe<photo_var_pop_order_by>
  var_samp?: Maybe<photo_var_samp_order_by>
  variance?: Maybe<photo_variance_order_by>
}

/** input type for inserting array relation for remote table "photo" */
export interface photo_arr_rel_insert_input {
  data: Array<photo_insert_input>
  on_conflict?: Maybe<photo_on_conflict>
}

/** order by avg() on columns of table "photo" */
export interface photo_avg_order_by {
  quality?: Maybe<order_by>
}

/** Boolean expression to filter rows from the table "photo". All fields are combined with a logical 'AND'. */
export interface photo_bool_exp {
  _and?: Maybe<Array<Maybe<photo_bool_exp>>>
  _not?: Maybe<photo_bool_exp>
  _or?: Maybe<Array<Maybe<photo_bool_exp>>>
  created_at?: Maybe<timestamptz_comparison_exp>
  id?: Maybe<uuid_comparison_exp>
  origin?: Maybe<String_comparison_exp>
  quality?: Maybe<numeric_comparison_exp>
  updated_at?: Maybe<timestamptz_comparison_exp>
  url?: Maybe<String_comparison_exp>
}

/** unique or primary key constraints on table "photo" */
export enum photo_constraint {
  /** unique or primary key constraint */
  photo_origin_key = 'photo_origin_key',
  /** unique or primary key constraint */
  photo_url_key = 'photo_url_key',
  /** unique or primary key constraint */
  photos_pkey = 'photos_pkey',
}

/** input type for incrementing integer column in table "photo" */
export interface photo_inc_input {
  quality?: Maybe<Scalars['numeric']>
}

/** input type for inserting data into table "photo" */
export interface photo_insert_input {
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  origin?: Maybe<Scalars['String']>
  quality?: Maybe<Scalars['numeric']>
  updated_at?: Maybe<Scalars['timestamptz']>
  url?: Maybe<Scalars['String']>
}

/** order by max() on columns of table "photo" */
export interface photo_max_order_by {
  created_at?: Maybe<order_by>
  id?: Maybe<order_by>
  origin?: Maybe<order_by>
  quality?: Maybe<order_by>
  updated_at?: Maybe<order_by>
  url?: Maybe<order_by>
}

/** order by min() on columns of table "photo" */
export interface photo_min_order_by {
  created_at?: Maybe<order_by>
  id?: Maybe<order_by>
  origin?: Maybe<order_by>
  quality?: Maybe<order_by>
  updated_at?: Maybe<order_by>
  url?: Maybe<order_by>
}

/** input type for inserting object relation for remote table "photo" */
export interface photo_obj_rel_insert_input {
  data: photo_insert_input
  on_conflict?: Maybe<photo_on_conflict>
}

/** on conflict condition type for table "photo" */
export interface photo_on_conflict {
  constraint: photo_constraint
  update_columns: Array<photo_update_column>
  where?: Maybe<photo_bool_exp>
}

/** ordering options when selecting data from "photo" */
export interface photo_order_by {
  created_at?: Maybe<order_by>
  id?: Maybe<order_by>
  origin?: Maybe<order_by>
  quality?: Maybe<order_by>
  updated_at?: Maybe<order_by>
  url?: Maybe<order_by>
}

/** primary key columns input for table: "photo" */
export interface photo_pk_columns_input {
  id: Scalars['uuid']
}

/** select columns of table "photo" */
export enum photo_select_column {
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
}

/** input type for updating data in table "photo" */
export interface photo_set_input {
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  origin?: Maybe<Scalars['String']>
  quality?: Maybe<Scalars['numeric']>
  updated_at?: Maybe<Scalars['timestamptz']>
  url?: Maybe<Scalars['String']>
}

/** order by stddev() on columns of table "photo" */
export interface photo_stddev_order_by {
  quality?: Maybe<order_by>
}

/** order by stddev_pop() on columns of table "photo" */
export interface photo_stddev_pop_order_by {
  quality?: Maybe<order_by>
}

/** order by stddev_samp() on columns of table "photo" */
export interface photo_stddev_samp_order_by {
  quality?: Maybe<order_by>
}

/** order by sum() on columns of table "photo" */
export interface photo_sum_order_by {
  quality?: Maybe<order_by>
}

/** update columns of table "photo" */
export enum photo_update_column {
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
}

/** order by var_pop() on columns of table "photo" */
export interface photo_var_pop_order_by {
  quality?: Maybe<order_by>
}

/** order by var_samp() on columns of table "photo" */
export interface photo_var_samp_order_by {
  quality?: Maybe<order_by>
}

/** order by variance() on columns of table "photo" */
export interface photo_variance_order_by {
  quality?: Maybe<order_by>
}

/** order by aggregate values of table "photo_xref" */
export interface photo_xref_aggregate_order_by {
  count?: Maybe<order_by>
  max?: Maybe<photo_xref_max_order_by>
  min?: Maybe<photo_xref_min_order_by>
}

/** input type for inserting array relation for remote table "photo_xref" */
export interface photo_xref_arr_rel_insert_input {
  data: Array<photo_xref_insert_input>
  on_conflict?: Maybe<photo_xref_on_conflict>
}

/** Boolean expression to filter rows from the table "photo_xref". All fields are combined with a logical 'AND'. */
export interface photo_xref_bool_exp {
  _and?: Maybe<Array<Maybe<photo_xref_bool_exp>>>
  _not?: Maybe<photo_xref_bool_exp>
  _or?: Maybe<Array<Maybe<photo_xref_bool_exp>>>
  id?: Maybe<uuid_comparison_exp>
  photo?: Maybe<photo_bool_exp>
  photo_id?: Maybe<uuid_comparison_exp>
  restaurant_id?: Maybe<uuid_comparison_exp>
  tag_id?: Maybe<uuid_comparison_exp>
  type?: Maybe<String_comparison_exp>
}

/** unique or primary key constraints on table "photo_xref" */
export enum photo_xref_constraint {
  /** unique or primary key constraint */
  photos_xref_photos_id_restaurant_id_tag_id_key = 'photos_xref_photos_id_restaurant_id_tag_id_key',
  /** unique or primary key constraint */
  photos_xref_pkey = 'photos_xref_pkey',
}

/** input type for inserting data into table "photo_xref" */
export interface photo_xref_insert_input {
  id?: Maybe<Scalars['uuid']>
  photo?: Maybe<photo_obj_rel_insert_input>
  photo_id?: Maybe<Scalars['uuid']>
  restaurant_id?: Maybe<Scalars['uuid']>
  tag_id?: Maybe<Scalars['uuid']>
  type?: Maybe<Scalars['String']>
}

/** order by max() on columns of table "photo_xref" */
export interface photo_xref_max_order_by {
  id?: Maybe<order_by>
  photo_id?: Maybe<order_by>
  restaurant_id?: Maybe<order_by>
  tag_id?: Maybe<order_by>
  type?: Maybe<order_by>
}

/** order by min() on columns of table "photo_xref" */
export interface photo_xref_min_order_by {
  id?: Maybe<order_by>
  photo_id?: Maybe<order_by>
  restaurant_id?: Maybe<order_by>
  tag_id?: Maybe<order_by>
  type?: Maybe<order_by>
}

/** input type for inserting object relation for remote table "photo_xref" */
export interface photo_xref_obj_rel_insert_input {
  data: photo_xref_insert_input
  on_conflict?: Maybe<photo_xref_on_conflict>
}

/** on conflict condition type for table "photo_xref" */
export interface photo_xref_on_conflict {
  constraint: photo_xref_constraint
  update_columns: Array<photo_xref_update_column>
  where?: Maybe<photo_xref_bool_exp>
}

/** ordering options when selecting data from "photo_xref" */
export interface photo_xref_order_by {
  id?: Maybe<order_by>
  photo?: Maybe<photo_order_by>
  photo_id?: Maybe<order_by>
  restaurant_id?: Maybe<order_by>
  tag_id?: Maybe<order_by>
  type?: Maybe<order_by>
}

/** primary key columns input for table: "photo_xref" */
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
  tag_id = 'tag_id',
  /** column name */
  type = 'type',
}

/** input type for updating data in table "photo_xref" */
export interface photo_xref_set_input {
  id?: Maybe<Scalars['uuid']>
  photo_id?: Maybe<Scalars['uuid']>
  restaurant_id?: Maybe<Scalars['uuid']>
  tag_id?: Maybe<Scalars['uuid']>
  type?: Maybe<Scalars['String']>
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
  tag_id = 'tag_id',
  /** column name */
  type = 'type',
}

/** order by aggregate values of table "restaurant" */
export interface restaurant_aggregate_order_by {
  avg?: Maybe<restaurant_avg_order_by>
  count?: Maybe<order_by>
  max?: Maybe<restaurant_max_order_by>
  min?: Maybe<restaurant_min_order_by>
  stddev?: Maybe<restaurant_stddev_order_by>
  stddev_pop?: Maybe<restaurant_stddev_pop_order_by>
  stddev_samp?: Maybe<restaurant_stddev_samp_order_by>
  sum?: Maybe<restaurant_sum_order_by>
  var_pop?: Maybe<restaurant_var_pop_order_by>
  var_samp?: Maybe<restaurant_var_samp_order_by>
  variance?: Maybe<restaurant_variance_order_by>
}

/** append existing jsonb value of filtered columns with new jsonb value */
export interface restaurant_append_input {
  headlines?: Maybe<Scalars['jsonb']>
  hours?: Maybe<Scalars['jsonb']>
  photos?: Maybe<Scalars['jsonb']>
  rating_factors?: Maybe<Scalars['jsonb']>
  score_breakdown?: Maybe<Scalars['jsonb']>
  source_breakdown?: Maybe<Scalars['jsonb']>
  sources?: Maybe<Scalars['jsonb']>
  tag_names?: Maybe<Scalars['jsonb']>
}

/** input type for inserting array relation for remote table "restaurant" */
export interface restaurant_arr_rel_insert_input {
  data: Array<restaurant_insert_input>
  on_conflict?: Maybe<restaurant_on_conflict>
}

/** order by avg() on columns of table "restaurant" */
export interface restaurant_avg_order_by {
  downvotes?: Maybe<order_by>
  rating?: Maybe<order_by>
  score?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
  zip?: Maybe<order_by>
}

/** Boolean expression to filter rows from the table "restaurant". All fields are combined with a logical 'AND'. */
export interface restaurant_bool_exp {
  _and?: Maybe<Array<Maybe<restaurant_bool_exp>>>
  _not?: Maybe<restaurant_bool_exp>
  _or?: Maybe<Array<Maybe<restaurant_bool_exp>>>
  address?: Maybe<String_comparison_exp>
  city?: Maybe<String_comparison_exp>
  created_at?: Maybe<timestamptz_comparison_exp>
  description?: Maybe<String_comparison_exp>
  downvotes?: Maybe<numeric_comparison_exp>
  geocoder_id?: Maybe<String_comparison_exp>
  headlines?: Maybe<jsonb_comparison_exp>
  hours?: Maybe<jsonb_comparison_exp>
  id?: Maybe<uuid_comparison_exp>
  image?: Maybe<String_comparison_exp>
  location?: Maybe<geometry_comparison_exp>
  menu_items?: Maybe<menu_item_bool_exp>
  name?: Maybe<String_comparison_exp>
  oldest_review_date?: Maybe<timestamptz_comparison_exp>
  photos?: Maybe<jsonb_comparison_exp>
  price_range?: Maybe<String_comparison_exp>
  rating?: Maybe<numeric_comparison_exp>
  rating_factors?: Maybe<jsonb_comparison_exp>
  reviews?: Maybe<review_bool_exp>
  score?: Maybe<numeric_comparison_exp>
  score_breakdown?: Maybe<jsonb_comparison_exp>
  slug?: Maybe<String_comparison_exp>
  source_breakdown?: Maybe<jsonb_comparison_exp>
  sources?: Maybe<jsonb_comparison_exp>
  state?: Maybe<String_comparison_exp>
  summary?: Maybe<String_comparison_exp>
  tag_names?: Maybe<jsonb_comparison_exp>
  tags?: Maybe<restaurant_tag_bool_exp>
  telephone?: Maybe<String_comparison_exp>
  updated_at?: Maybe<timestamptz_comparison_exp>
  upvotes?: Maybe<numeric_comparison_exp>
  votes_ratio?: Maybe<numeric_comparison_exp>
  website?: Maybe<String_comparison_exp>
  zip?: Maybe<numeric_comparison_exp>
}

/** unique or primary key constraints on table "restaurant" */
export enum restaurant_constraint {
  /** unique or primary key constraint */
  restaurant_geocoder_id_key = 'restaurant_geocoder_id_key',
  /** unique or primary key constraint */
  restaurant_name_address_key = 'restaurant_name_address_key',
  /** unique or primary key constraint */
  restaurant_pkey = 'restaurant_pkey',
  /** unique or primary key constraint */
  restaurant_slug_key = 'restaurant_slug_key',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface restaurant_delete_at_path_input {
  headlines?: Maybe<Array<Maybe<Scalars['String']>>>
  hours?: Maybe<Array<Maybe<Scalars['String']>>>
  photos?: Maybe<Array<Maybe<Scalars['String']>>>
  rating_factors?: Maybe<Array<Maybe<Scalars['String']>>>
  score_breakdown?: Maybe<Array<Maybe<Scalars['String']>>>
  source_breakdown?: Maybe<Array<Maybe<Scalars['String']>>>
  sources?: Maybe<Array<Maybe<Scalars['String']>>>
  tag_names?: Maybe<Array<Maybe<Scalars['String']>>>
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface restaurant_delete_elem_input {
  headlines?: Maybe<Scalars['Int']>
  hours?: Maybe<Scalars['Int']>
  photos?: Maybe<Scalars['Int']>
  rating_factors?: Maybe<Scalars['Int']>
  score_breakdown?: Maybe<Scalars['Int']>
  source_breakdown?: Maybe<Scalars['Int']>
  sources?: Maybe<Scalars['Int']>
  tag_names?: Maybe<Scalars['Int']>
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface restaurant_delete_key_input {
  headlines?: Maybe<Scalars['String']>
  hours?: Maybe<Scalars['String']>
  photos?: Maybe<Scalars['String']>
  rating_factors?: Maybe<Scalars['String']>
  score_breakdown?: Maybe<Scalars['String']>
  source_breakdown?: Maybe<Scalars['String']>
  sources?: Maybe<Scalars['String']>
  tag_names?: Maybe<Scalars['String']>
}

/** input type for incrementing integer column in table "restaurant" */
export interface restaurant_inc_input {
  downvotes?: Maybe<Scalars['numeric']>
  rating?: Maybe<Scalars['numeric']>
  score?: Maybe<Scalars['numeric']>
  upvotes?: Maybe<Scalars['numeric']>
  votes_ratio?: Maybe<Scalars['numeric']>
  zip?: Maybe<Scalars['numeric']>
}

/** input type for inserting data into table "restaurant" */
export interface restaurant_insert_input {
  address?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  created_at?: Maybe<Scalars['timestamptz']>
  description?: Maybe<Scalars['String']>
  downvotes?: Maybe<Scalars['numeric']>
  geocoder_id?: Maybe<Scalars['String']>
  headlines?: Maybe<Scalars['jsonb']>
  hours?: Maybe<Scalars['jsonb']>
  id?: Maybe<Scalars['uuid']>
  image?: Maybe<Scalars['String']>
  location?: Maybe<Scalars['geometry']>
  menu_items?: Maybe<menu_item_arr_rel_insert_input>
  name?: Maybe<Scalars['String']>
  oldest_review_date?: Maybe<Scalars['timestamptz']>
  photos?: Maybe<Scalars['jsonb']>
  price_range?: Maybe<Scalars['String']>
  rating?: Maybe<Scalars['numeric']>
  rating_factors?: Maybe<Scalars['jsonb']>
  reviews?: Maybe<review_arr_rel_insert_input>
  score?: Maybe<Scalars['numeric']>
  score_breakdown?: Maybe<Scalars['jsonb']>
  slug?: Maybe<Scalars['String']>
  source_breakdown?: Maybe<Scalars['jsonb']>
  sources?: Maybe<Scalars['jsonb']>
  state?: Maybe<Scalars['String']>
  summary?: Maybe<Scalars['String']>
  tag_names?: Maybe<Scalars['jsonb']>
  tags?: Maybe<restaurant_tag_arr_rel_insert_input>
  telephone?: Maybe<Scalars['String']>
  updated_at?: Maybe<Scalars['timestamptz']>
  upvotes?: Maybe<Scalars['numeric']>
  votes_ratio?: Maybe<Scalars['numeric']>
  website?: Maybe<Scalars['String']>
  zip?: Maybe<Scalars['numeric']>
}

/** order by max() on columns of table "restaurant" */
export interface restaurant_max_order_by {
  address?: Maybe<order_by>
  city?: Maybe<order_by>
  created_at?: Maybe<order_by>
  description?: Maybe<order_by>
  downvotes?: Maybe<order_by>
  geocoder_id?: Maybe<order_by>
  id?: Maybe<order_by>
  image?: Maybe<order_by>
  name?: Maybe<order_by>
  oldest_review_date?: Maybe<order_by>
  price_range?: Maybe<order_by>
  rating?: Maybe<order_by>
  score?: Maybe<order_by>
  slug?: Maybe<order_by>
  state?: Maybe<order_by>
  summary?: Maybe<order_by>
  telephone?: Maybe<order_by>
  updated_at?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
  website?: Maybe<order_by>
  zip?: Maybe<order_by>
}

/** order by min() on columns of table "restaurant" */
export interface restaurant_min_order_by {
  address?: Maybe<order_by>
  city?: Maybe<order_by>
  created_at?: Maybe<order_by>
  description?: Maybe<order_by>
  downvotes?: Maybe<order_by>
  geocoder_id?: Maybe<order_by>
  id?: Maybe<order_by>
  image?: Maybe<order_by>
  name?: Maybe<order_by>
  oldest_review_date?: Maybe<order_by>
  price_range?: Maybe<order_by>
  rating?: Maybe<order_by>
  score?: Maybe<order_by>
  slug?: Maybe<order_by>
  state?: Maybe<order_by>
  summary?: Maybe<order_by>
  telephone?: Maybe<order_by>
  updated_at?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
  website?: Maybe<order_by>
  zip?: Maybe<order_by>
}

/** input type for inserting object relation for remote table "restaurant" */
export interface restaurant_obj_rel_insert_input {
  data: restaurant_insert_input
  on_conflict?: Maybe<restaurant_on_conflict>
}

/** on conflict condition type for table "restaurant" */
export interface restaurant_on_conflict {
  constraint: restaurant_constraint
  update_columns: Array<restaurant_update_column>
  where?: Maybe<restaurant_bool_exp>
}

/** ordering options when selecting data from "restaurant" */
export interface restaurant_order_by {
  address?: Maybe<order_by>
  city?: Maybe<order_by>
  created_at?: Maybe<order_by>
  description?: Maybe<order_by>
  downvotes?: Maybe<order_by>
  geocoder_id?: Maybe<order_by>
  headlines?: Maybe<order_by>
  hours?: Maybe<order_by>
  id?: Maybe<order_by>
  image?: Maybe<order_by>
  location?: Maybe<order_by>
  menu_items_aggregate?: Maybe<menu_item_aggregate_order_by>
  name?: Maybe<order_by>
  oldest_review_date?: Maybe<order_by>
  photos?: Maybe<order_by>
  price_range?: Maybe<order_by>
  rating?: Maybe<order_by>
  rating_factors?: Maybe<order_by>
  reviews_aggregate?: Maybe<review_aggregate_order_by>
  score?: Maybe<order_by>
  score_breakdown?: Maybe<order_by>
  slug?: Maybe<order_by>
  source_breakdown?: Maybe<order_by>
  sources?: Maybe<order_by>
  state?: Maybe<order_by>
  summary?: Maybe<order_by>
  tag_names?: Maybe<order_by>
  tags_aggregate?: Maybe<restaurant_tag_aggregate_order_by>
  telephone?: Maybe<order_by>
  updated_at?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
  website?: Maybe<order_by>
  zip?: Maybe<order_by>
}

/** primary key columns input for table: "restaurant" */
export interface restaurant_pk_columns_input {
  id: Scalars['uuid']
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface restaurant_prepend_input {
  headlines?: Maybe<Scalars['jsonb']>
  hours?: Maybe<Scalars['jsonb']>
  photos?: Maybe<Scalars['jsonb']>
  rating_factors?: Maybe<Scalars['jsonb']>
  score_breakdown?: Maybe<Scalars['jsonb']>
  source_breakdown?: Maybe<Scalars['jsonb']>
  sources?: Maybe<Scalars['jsonb']>
  tag_names?: Maybe<Scalars['jsonb']>
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
  location = 'location',
  /** column name */
  name = 'name',
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

/** input type for updating data in table "restaurant" */
export interface restaurant_set_input {
  address?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  created_at?: Maybe<Scalars['timestamptz']>
  description?: Maybe<Scalars['String']>
  downvotes?: Maybe<Scalars['numeric']>
  geocoder_id?: Maybe<Scalars['String']>
  headlines?: Maybe<Scalars['jsonb']>
  hours?: Maybe<Scalars['jsonb']>
  id?: Maybe<Scalars['uuid']>
  image?: Maybe<Scalars['String']>
  location?: Maybe<Scalars['geometry']>
  name?: Maybe<Scalars['String']>
  oldest_review_date?: Maybe<Scalars['timestamptz']>
  photos?: Maybe<Scalars['jsonb']>
  price_range?: Maybe<Scalars['String']>
  rating?: Maybe<Scalars['numeric']>
  rating_factors?: Maybe<Scalars['jsonb']>
  score?: Maybe<Scalars['numeric']>
  score_breakdown?: Maybe<Scalars['jsonb']>
  slug?: Maybe<Scalars['String']>
  source_breakdown?: Maybe<Scalars['jsonb']>
  sources?: Maybe<Scalars['jsonb']>
  state?: Maybe<Scalars['String']>
  summary?: Maybe<Scalars['String']>
  tag_names?: Maybe<Scalars['jsonb']>
  telephone?: Maybe<Scalars['String']>
  updated_at?: Maybe<Scalars['timestamptz']>
  upvotes?: Maybe<Scalars['numeric']>
  votes_ratio?: Maybe<Scalars['numeric']>
  website?: Maybe<Scalars['String']>
  zip?: Maybe<Scalars['numeric']>
}

/** order by stddev() on columns of table "restaurant" */
export interface restaurant_stddev_order_by {
  downvotes?: Maybe<order_by>
  rating?: Maybe<order_by>
  score?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
  zip?: Maybe<order_by>
}

/** order by stddev_pop() on columns of table "restaurant" */
export interface restaurant_stddev_pop_order_by {
  downvotes?: Maybe<order_by>
  rating?: Maybe<order_by>
  score?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
  zip?: Maybe<order_by>
}

/** order by stddev_samp() on columns of table "restaurant" */
export interface restaurant_stddev_samp_order_by {
  downvotes?: Maybe<order_by>
  rating?: Maybe<order_by>
  score?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
  zip?: Maybe<order_by>
}

/** order by sum() on columns of table "restaurant" */
export interface restaurant_sum_order_by {
  downvotes?: Maybe<order_by>
  rating?: Maybe<order_by>
  score?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
  zip?: Maybe<order_by>
}

/** order by aggregate values of table "restaurant_tag" */
export interface restaurant_tag_aggregate_order_by {
  avg?: Maybe<restaurant_tag_avg_order_by>
  count?: Maybe<order_by>
  max?: Maybe<restaurant_tag_max_order_by>
  min?: Maybe<restaurant_tag_min_order_by>
  stddev?: Maybe<restaurant_tag_stddev_order_by>
  stddev_pop?: Maybe<restaurant_tag_stddev_pop_order_by>
  stddev_samp?: Maybe<restaurant_tag_stddev_samp_order_by>
  sum?: Maybe<restaurant_tag_sum_order_by>
  var_pop?: Maybe<restaurant_tag_var_pop_order_by>
  var_samp?: Maybe<restaurant_tag_var_samp_order_by>
  variance?: Maybe<restaurant_tag_variance_order_by>
}

/** append existing jsonb value of filtered columns with new jsonb value */
export interface restaurant_tag_append_input {
  photos?: Maybe<Scalars['jsonb']>
  score_breakdown?: Maybe<Scalars['jsonb']>
  source_breakdown?: Maybe<Scalars['jsonb']>
}

/** input type for inserting array relation for remote table "restaurant_tag" */
export interface restaurant_tag_arr_rel_insert_input {
  data: Array<restaurant_tag_insert_input>
  on_conflict?: Maybe<restaurant_tag_on_conflict>
}

/** order by avg() on columns of table "restaurant_tag" */
export interface restaurant_tag_avg_order_by {
  downvotes?: Maybe<order_by>
  rank?: Maybe<order_by>
  rating?: Maybe<order_by>
  review_mentions_count?: Maybe<order_by>
  score?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
}

/** Boolean expression to filter rows from the table "restaurant_tag". All fields are combined with a logical 'AND'. */
export interface restaurant_tag_bool_exp {
  _and?: Maybe<Array<Maybe<restaurant_tag_bool_exp>>>
  _not?: Maybe<restaurant_tag_bool_exp>
  _or?: Maybe<Array<Maybe<restaurant_tag_bool_exp>>>
  downvotes?: Maybe<numeric_comparison_exp>
  id?: Maybe<uuid_comparison_exp>
  photos?: Maybe<jsonb_comparison_exp>
  rank?: Maybe<Int_comparison_exp>
  rating?: Maybe<numeric_comparison_exp>
  restaurant?: Maybe<restaurant_bool_exp>
  restaurant_id?: Maybe<uuid_comparison_exp>
  review_mentions_count?: Maybe<numeric_comparison_exp>
  reviews?: Maybe<review_bool_exp>
  score?: Maybe<numeric_comparison_exp>
  score_breakdown?: Maybe<jsonb_comparison_exp>
  sentences?: Maybe<review_tag_sentence_bool_exp>
  source_breakdown?: Maybe<jsonb_comparison_exp>
  tag?: Maybe<tag_bool_exp>
  tag_id?: Maybe<uuid_comparison_exp>
  upvotes?: Maybe<numeric_comparison_exp>
  votes_ratio?: Maybe<numeric_comparison_exp>
}

/** unique or primary key constraints on table "restaurant_tag" */
export enum restaurant_tag_constraint {
  /** unique or primary key constraint */
  restaurant_tag_id_key = 'restaurant_tag_id_key',
  /** unique or primary key constraint */
  restaurant_tag_pkey = 'restaurant_tag_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface restaurant_tag_delete_at_path_input {
  photos?: Maybe<Array<Maybe<Scalars['String']>>>
  score_breakdown?: Maybe<Array<Maybe<Scalars['String']>>>
  source_breakdown?: Maybe<Array<Maybe<Scalars['String']>>>
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface restaurant_tag_delete_elem_input {
  photos?: Maybe<Scalars['Int']>
  score_breakdown?: Maybe<Scalars['Int']>
  source_breakdown?: Maybe<Scalars['Int']>
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface restaurant_tag_delete_key_input {
  photos?: Maybe<Scalars['String']>
  score_breakdown?: Maybe<Scalars['String']>
  source_breakdown?: Maybe<Scalars['String']>
}

/** input type for incrementing integer column in table "restaurant_tag" */
export interface restaurant_tag_inc_input {
  downvotes?: Maybe<Scalars['numeric']>
  rank?: Maybe<Scalars['Int']>
  rating?: Maybe<Scalars['numeric']>
  review_mentions_count?: Maybe<Scalars['numeric']>
  score?: Maybe<Scalars['numeric']>
  upvotes?: Maybe<Scalars['numeric']>
  votes_ratio?: Maybe<Scalars['numeric']>
}

/** input type for inserting data into table "restaurant_tag" */
export interface restaurant_tag_insert_input {
  downvotes?: Maybe<Scalars['numeric']>
  id?: Maybe<Scalars['uuid']>
  photos?: Maybe<Scalars['jsonb']>
  rank?: Maybe<Scalars['Int']>
  rating?: Maybe<Scalars['numeric']>
  restaurant?: Maybe<restaurant_obj_rel_insert_input>
  restaurant_id?: Maybe<Scalars['uuid']>
  review_mentions_count?: Maybe<Scalars['numeric']>
  reviews?: Maybe<review_arr_rel_insert_input>
  score?: Maybe<Scalars['numeric']>
  score_breakdown?: Maybe<Scalars['jsonb']>
  sentences?: Maybe<review_tag_sentence_arr_rel_insert_input>
  source_breakdown?: Maybe<Scalars['jsonb']>
  tag?: Maybe<tag_obj_rel_insert_input>
  tag_id?: Maybe<Scalars['uuid']>
  upvotes?: Maybe<Scalars['numeric']>
  votes_ratio?: Maybe<Scalars['numeric']>
}

/** order by max() on columns of table "restaurant_tag" */
export interface restaurant_tag_max_order_by {
  downvotes?: Maybe<order_by>
  id?: Maybe<order_by>
  rank?: Maybe<order_by>
  rating?: Maybe<order_by>
  restaurant_id?: Maybe<order_by>
  review_mentions_count?: Maybe<order_by>
  score?: Maybe<order_by>
  tag_id?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
}

/** order by min() on columns of table "restaurant_tag" */
export interface restaurant_tag_min_order_by {
  downvotes?: Maybe<order_by>
  id?: Maybe<order_by>
  rank?: Maybe<order_by>
  rating?: Maybe<order_by>
  restaurant_id?: Maybe<order_by>
  review_mentions_count?: Maybe<order_by>
  score?: Maybe<order_by>
  tag_id?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
}

/** input type for inserting object relation for remote table "restaurant_tag" */
export interface restaurant_tag_obj_rel_insert_input {
  data: restaurant_tag_insert_input
  on_conflict?: Maybe<restaurant_tag_on_conflict>
}

/** on conflict condition type for table "restaurant_tag" */
export interface restaurant_tag_on_conflict {
  constraint: restaurant_tag_constraint
  update_columns: Array<restaurant_tag_update_column>
  where?: Maybe<restaurant_tag_bool_exp>
}

/** ordering options when selecting data from "restaurant_tag" */
export interface restaurant_tag_order_by {
  downvotes?: Maybe<order_by>
  id?: Maybe<order_by>
  photos?: Maybe<order_by>
  rank?: Maybe<order_by>
  rating?: Maybe<order_by>
  restaurant?: Maybe<restaurant_order_by>
  restaurant_id?: Maybe<order_by>
  review_mentions_count?: Maybe<order_by>
  reviews_aggregate?: Maybe<review_aggregate_order_by>
  score?: Maybe<order_by>
  score_breakdown?: Maybe<order_by>
  sentences_aggregate?: Maybe<review_tag_sentence_aggregate_order_by>
  source_breakdown?: Maybe<order_by>
  tag?: Maybe<tag_order_by>
  tag_id?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
}

/** primary key columns input for table: "restaurant_tag" */
export interface restaurant_tag_pk_columns_input {
  restaurant_id: Scalars['uuid']
  tag_id: Scalars['uuid']
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface restaurant_tag_prepend_input {
  photos?: Maybe<Scalars['jsonb']>
  score_breakdown?: Maybe<Scalars['jsonb']>
  source_breakdown?: Maybe<Scalars['jsonb']>
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
  downvotes?: Maybe<Scalars['numeric']>
  id?: Maybe<Scalars['uuid']>
  photos?: Maybe<Scalars['jsonb']>
  rank?: Maybe<Scalars['Int']>
  rating?: Maybe<Scalars['numeric']>
  restaurant_id?: Maybe<Scalars['uuid']>
  review_mentions_count?: Maybe<Scalars['numeric']>
  score?: Maybe<Scalars['numeric']>
  score_breakdown?: Maybe<Scalars['jsonb']>
  source_breakdown?: Maybe<Scalars['jsonb']>
  tag_id?: Maybe<Scalars['uuid']>
  upvotes?: Maybe<Scalars['numeric']>
  votes_ratio?: Maybe<Scalars['numeric']>
}

/** order by stddev() on columns of table "restaurant_tag" */
export interface restaurant_tag_stddev_order_by {
  downvotes?: Maybe<order_by>
  rank?: Maybe<order_by>
  rating?: Maybe<order_by>
  review_mentions_count?: Maybe<order_by>
  score?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
}

/** order by stddev_pop() on columns of table "restaurant_tag" */
export interface restaurant_tag_stddev_pop_order_by {
  downvotes?: Maybe<order_by>
  rank?: Maybe<order_by>
  rating?: Maybe<order_by>
  review_mentions_count?: Maybe<order_by>
  score?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
}

/** order by stddev_samp() on columns of table "restaurant_tag" */
export interface restaurant_tag_stddev_samp_order_by {
  downvotes?: Maybe<order_by>
  rank?: Maybe<order_by>
  rating?: Maybe<order_by>
  review_mentions_count?: Maybe<order_by>
  score?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
}

/** order by sum() on columns of table "restaurant_tag" */
export interface restaurant_tag_sum_order_by {
  downvotes?: Maybe<order_by>
  rank?: Maybe<order_by>
  rating?: Maybe<order_by>
  review_mentions_count?: Maybe<order_by>
  score?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
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

/** order by var_pop() on columns of table "restaurant_tag" */
export interface restaurant_tag_var_pop_order_by {
  downvotes?: Maybe<order_by>
  rank?: Maybe<order_by>
  rating?: Maybe<order_by>
  review_mentions_count?: Maybe<order_by>
  score?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
}

/** order by var_samp() on columns of table "restaurant_tag" */
export interface restaurant_tag_var_samp_order_by {
  downvotes?: Maybe<order_by>
  rank?: Maybe<order_by>
  rating?: Maybe<order_by>
  review_mentions_count?: Maybe<order_by>
  score?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
}

/** order by variance() on columns of table "restaurant_tag" */
export interface restaurant_tag_variance_order_by {
  downvotes?: Maybe<order_by>
  rank?: Maybe<order_by>
  rating?: Maybe<order_by>
  review_mentions_count?: Maybe<order_by>
  score?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
}

export interface restaurant_top_tags_args {
  _tag_types?: Maybe<Scalars['String']>
  tag_slugs?: Maybe<Scalars['String']>
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
  location = 'location',
  /** column name */
  name = 'name',
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

/** order by var_pop() on columns of table "restaurant" */
export interface restaurant_var_pop_order_by {
  downvotes?: Maybe<order_by>
  rating?: Maybe<order_by>
  score?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
  zip?: Maybe<order_by>
}

/** order by var_samp() on columns of table "restaurant" */
export interface restaurant_var_samp_order_by {
  downvotes?: Maybe<order_by>
  rating?: Maybe<order_by>
  score?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
  zip?: Maybe<order_by>
}

/** order by variance() on columns of table "restaurant" */
export interface restaurant_variance_order_by {
  downvotes?: Maybe<order_by>
  rating?: Maybe<order_by>
  score?: Maybe<order_by>
  upvotes?: Maybe<order_by>
  votes_ratio?: Maybe<order_by>
  zip?: Maybe<order_by>
}

/** order by aggregate values of table "review" */
export interface review_aggregate_order_by {
  avg?: Maybe<review_avg_order_by>
  count?: Maybe<order_by>
  max?: Maybe<review_max_order_by>
  min?: Maybe<review_min_order_by>
  stddev?: Maybe<review_stddev_order_by>
  stddev_pop?: Maybe<review_stddev_pop_order_by>
  stddev_samp?: Maybe<review_stddev_samp_order_by>
  sum?: Maybe<review_sum_order_by>
  var_pop?: Maybe<review_var_pop_order_by>
  var_samp?: Maybe<review_var_samp_order_by>
  variance?: Maybe<review_variance_order_by>
}

/** append existing jsonb value of filtered columns with new jsonb value */
export interface review_append_input {
  categories?: Maybe<Scalars['jsonb']>
}

/** input type for inserting array relation for remote table "review" */
export interface review_arr_rel_insert_input {
  data: Array<review_insert_input>
  on_conflict?: Maybe<review_on_conflict>
}

/** order by avg() on columns of table "review" */
export interface review_avg_order_by {
  rating?: Maybe<order_by>
  vote?: Maybe<order_by>
}

/** Boolean expression to filter rows from the table "review". All fields are combined with a logical 'AND'. */
export interface review_bool_exp {
  _and?: Maybe<Array<Maybe<review_bool_exp>>>
  _not?: Maybe<review_bool_exp>
  _or?: Maybe<Array<Maybe<review_bool_exp>>>
  authored_at?: Maybe<timestamptz_comparison_exp>
  categories?: Maybe<jsonb_comparison_exp>
  favorited?: Maybe<Boolean_comparison_exp>
  id?: Maybe<uuid_comparison_exp>
  location?: Maybe<geometry_comparison_exp>
  native_data_unique_key?: Maybe<String_comparison_exp>
  rating?: Maybe<numeric_comparison_exp>
  restaurant?: Maybe<restaurant_bool_exp>
  restaurant_id?: Maybe<uuid_comparison_exp>
  sentiments?: Maybe<review_tag_sentence_bool_exp>
  source?: Maybe<String_comparison_exp>
  tag?: Maybe<tag_bool_exp>
  tag_id?: Maybe<uuid_comparison_exp>
  text?: Maybe<String_comparison_exp>
  type?: Maybe<String_comparison_exp>
  updated_at?: Maybe<timestamptz_comparison_exp>
  user?: Maybe<user_bool_exp>
  user_id?: Maybe<uuid_comparison_exp>
  username?: Maybe<String_comparison_exp>
  vote?: Maybe<numeric_comparison_exp>
}

/** unique or primary key constraints on table "review" */
export enum review_constraint {
  /** unique or primary key constraint */
  review_native_data_unique_constraint = 'review_native_data_unique_constraint',
  /** unique or primary key constraint */
  review_native_data_unique_key_key = 'review_native_data_unique_key_key',
  /** unique or primary key constraint */
  review_pkey = 'review_pkey',
  /** unique or primary key constraint */
  review_username_restaurant_id_tag_id_authored_at_key = 'review_username_restaurant_id_tag_id_authored_at_key',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface review_delete_at_path_input {
  categories?: Maybe<Array<Maybe<Scalars['String']>>>
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface review_delete_elem_input {
  categories?: Maybe<Scalars['Int']>
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface review_delete_key_input {
  categories?: Maybe<Scalars['String']>
}

/** input type for incrementing integer column in table "review" */
export interface review_inc_input {
  rating?: Maybe<Scalars['numeric']>
  vote?: Maybe<Scalars['numeric']>
}

/** input type for inserting data into table "review" */
export interface review_insert_input {
  authored_at?: Maybe<Scalars['timestamptz']>
  categories?: Maybe<Scalars['jsonb']>
  favorited?: Maybe<Scalars['Boolean']>
  id?: Maybe<Scalars['uuid']>
  location?: Maybe<Scalars['geometry']>
  native_data_unique_key?: Maybe<Scalars['String']>
  rating?: Maybe<Scalars['numeric']>
  restaurant?: Maybe<restaurant_obj_rel_insert_input>
  restaurant_id?: Maybe<Scalars['uuid']>
  sentiments?: Maybe<review_tag_sentence_arr_rel_insert_input>
  source?: Maybe<Scalars['String']>
  tag?: Maybe<tag_obj_rel_insert_input>
  tag_id?: Maybe<Scalars['uuid']>
  text?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  updated_at?: Maybe<Scalars['timestamptz']>
  user?: Maybe<user_obj_rel_insert_input>
  user_id?: Maybe<Scalars['uuid']>
  username?: Maybe<Scalars['String']>
  vote?: Maybe<Scalars['numeric']>
}

/** order by max() on columns of table "review" */
export interface review_max_order_by {
  authored_at?: Maybe<order_by>
  id?: Maybe<order_by>
  native_data_unique_key?: Maybe<order_by>
  rating?: Maybe<order_by>
  restaurant_id?: Maybe<order_by>
  source?: Maybe<order_by>
  tag_id?: Maybe<order_by>
  text?: Maybe<order_by>
  type?: Maybe<order_by>
  updated_at?: Maybe<order_by>
  user_id?: Maybe<order_by>
  username?: Maybe<order_by>
  vote?: Maybe<order_by>
}

/** order by min() on columns of table "review" */
export interface review_min_order_by {
  authored_at?: Maybe<order_by>
  id?: Maybe<order_by>
  native_data_unique_key?: Maybe<order_by>
  rating?: Maybe<order_by>
  restaurant_id?: Maybe<order_by>
  source?: Maybe<order_by>
  tag_id?: Maybe<order_by>
  text?: Maybe<order_by>
  type?: Maybe<order_by>
  updated_at?: Maybe<order_by>
  user_id?: Maybe<order_by>
  username?: Maybe<order_by>
  vote?: Maybe<order_by>
}

/** input type for inserting object relation for remote table "review" */
export interface review_obj_rel_insert_input {
  data: review_insert_input
  on_conflict?: Maybe<review_on_conflict>
}

/** on conflict condition type for table "review" */
export interface review_on_conflict {
  constraint: review_constraint
  update_columns: Array<review_update_column>
  where?: Maybe<review_bool_exp>
}

/** ordering options when selecting data from "review" */
export interface review_order_by {
  authored_at?: Maybe<order_by>
  categories?: Maybe<order_by>
  favorited?: Maybe<order_by>
  id?: Maybe<order_by>
  location?: Maybe<order_by>
  native_data_unique_key?: Maybe<order_by>
  rating?: Maybe<order_by>
  restaurant?: Maybe<restaurant_order_by>
  restaurant_id?: Maybe<order_by>
  sentiments_aggregate?: Maybe<review_tag_sentence_aggregate_order_by>
  source?: Maybe<order_by>
  tag?: Maybe<tag_order_by>
  tag_id?: Maybe<order_by>
  text?: Maybe<order_by>
  type?: Maybe<order_by>
  updated_at?: Maybe<order_by>
  user?: Maybe<user_order_by>
  user_id?: Maybe<order_by>
  username?: Maybe<order_by>
  vote?: Maybe<order_by>
}

/** primary key columns input for table: "review" */
export interface review_pk_columns_input {
  id: Scalars['uuid']
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface review_prepend_input {
  categories?: Maybe<Scalars['jsonb']>
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

/** input type for updating data in table "review" */
export interface review_set_input {
  authored_at?: Maybe<Scalars['timestamptz']>
  categories?: Maybe<Scalars['jsonb']>
  favorited?: Maybe<Scalars['Boolean']>
  id?: Maybe<Scalars['uuid']>
  location?: Maybe<Scalars['geometry']>
  native_data_unique_key?: Maybe<Scalars['String']>
  rating?: Maybe<Scalars['numeric']>
  restaurant_id?: Maybe<Scalars['uuid']>
  source?: Maybe<Scalars['String']>
  tag_id?: Maybe<Scalars['uuid']>
  text?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  updated_at?: Maybe<Scalars['timestamptz']>
  user_id?: Maybe<Scalars['uuid']>
  username?: Maybe<Scalars['String']>
  vote?: Maybe<Scalars['numeric']>
}

/** order by stddev() on columns of table "review" */
export interface review_stddev_order_by {
  rating?: Maybe<order_by>
  vote?: Maybe<order_by>
}

/** order by stddev_pop() on columns of table "review" */
export interface review_stddev_pop_order_by {
  rating?: Maybe<order_by>
  vote?: Maybe<order_by>
}

/** order by stddev_samp() on columns of table "review" */
export interface review_stddev_samp_order_by {
  rating?: Maybe<order_by>
  vote?: Maybe<order_by>
}

/** order by sum() on columns of table "review" */
export interface review_sum_order_by {
  rating?: Maybe<order_by>
  vote?: Maybe<order_by>
}

/** order by aggregate values of table "review_tag_sentence" */
export interface review_tag_sentence_aggregate_order_by {
  avg?: Maybe<review_tag_sentence_avg_order_by>
  count?: Maybe<order_by>
  max?: Maybe<review_tag_sentence_max_order_by>
  min?: Maybe<review_tag_sentence_min_order_by>
  stddev?: Maybe<review_tag_sentence_stddev_order_by>
  stddev_pop?: Maybe<review_tag_sentence_stddev_pop_order_by>
  stddev_samp?: Maybe<review_tag_sentence_stddev_samp_order_by>
  sum?: Maybe<review_tag_sentence_sum_order_by>
  var_pop?: Maybe<review_tag_sentence_var_pop_order_by>
  var_samp?: Maybe<review_tag_sentence_var_samp_order_by>
  variance?: Maybe<review_tag_sentence_variance_order_by>
}

/** input type for inserting array relation for remote table "review_tag_sentence" */
export interface review_tag_sentence_arr_rel_insert_input {
  data: Array<review_tag_sentence_insert_input>
  on_conflict?: Maybe<review_tag_sentence_on_conflict>
}

/** order by avg() on columns of table "review_tag_sentence" */
export interface review_tag_sentence_avg_order_by {
  ml_sentiment?: Maybe<order_by>
  naive_sentiment?: Maybe<order_by>
}

/** Boolean expression to filter rows from the table "review_tag_sentence". All fields are combined with a logical 'AND'. */
export interface review_tag_sentence_bool_exp {
  _and?: Maybe<Array<Maybe<review_tag_sentence_bool_exp>>>
  _not?: Maybe<review_tag_sentence_bool_exp>
  _or?: Maybe<Array<Maybe<review_tag_sentence_bool_exp>>>
  id?: Maybe<uuid_comparison_exp>
  ml_sentiment?: Maybe<numeric_comparison_exp>
  naive_sentiment?: Maybe<numeric_comparison_exp>
  restaurant_id?: Maybe<uuid_comparison_exp>
  review?: Maybe<review_bool_exp>
  review_id?: Maybe<uuid_comparison_exp>
  sentence?: Maybe<String_comparison_exp>
  tag?: Maybe<tag_bool_exp>
  tag_id?: Maybe<uuid_comparison_exp>
}

/** unique or primary key constraints on table "review_tag_sentence" */
export enum review_tag_sentence_constraint {
  /** unique or primary key constraint */
  review_tag_pkey = 'review_tag_pkey',
  /** unique or primary key constraint */
  review_tag_tag_id_review_id_sentence_key = 'review_tag_tag_id_review_id_sentence_key',
}

/** input type for incrementing integer column in table "review_tag_sentence" */
export interface review_tag_sentence_inc_input {
  ml_sentiment?: Maybe<Scalars['numeric']>
  naive_sentiment?: Maybe<Scalars['numeric']>
}

/** input type for inserting data into table "review_tag_sentence" */
export interface review_tag_sentence_insert_input {
  id?: Maybe<Scalars['uuid']>
  ml_sentiment?: Maybe<Scalars['numeric']>
  naive_sentiment?: Maybe<Scalars['numeric']>
  restaurant_id?: Maybe<Scalars['uuid']>
  review?: Maybe<review_obj_rel_insert_input>
  review_id?: Maybe<Scalars['uuid']>
  sentence?: Maybe<Scalars['String']>
  tag?: Maybe<tag_obj_rel_insert_input>
  tag_id?: Maybe<Scalars['uuid']>
}

/** order by max() on columns of table "review_tag_sentence" */
export interface review_tag_sentence_max_order_by {
  id?: Maybe<order_by>
  ml_sentiment?: Maybe<order_by>
  naive_sentiment?: Maybe<order_by>
  restaurant_id?: Maybe<order_by>
  review_id?: Maybe<order_by>
  sentence?: Maybe<order_by>
  tag_id?: Maybe<order_by>
}

/** order by min() on columns of table "review_tag_sentence" */
export interface review_tag_sentence_min_order_by {
  id?: Maybe<order_by>
  ml_sentiment?: Maybe<order_by>
  naive_sentiment?: Maybe<order_by>
  restaurant_id?: Maybe<order_by>
  review_id?: Maybe<order_by>
  sentence?: Maybe<order_by>
  tag_id?: Maybe<order_by>
}

/** input type for inserting object relation for remote table "review_tag_sentence" */
export interface review_tag_sentence_obj_rel_insert_input {
  data: review_tag_sentence_insert_input
  on_conflict?: Maybe<review_tag_sentence_on_conflict>
}

/** on conflict condition type for table "review_tag_sentence" */
export interface review_tag_sentence_on_conflict {
  constraint: review_tag_sentence_constraint
  update_columns: Array<review_tag_sentence_update_column>
  where?: Maybe<review_tag_sentence_bool_exp>
}

/** ordering options when selecting data from "review_tag_sentence" */
export interface review_tag_sentence_order_by {
  id?: Maybe<order_by>
  ml_sentiment?: Maybe<order_by>
  naive_sentiment?: Maybe<order_by>
  restaurant_id?: Maybe<order_by>
  review?: Maybe<review_order_by>
  review_id?: Maybe<order_by>
  sentence?: Maybe<order_by>
  tag?: Maybe<tag_order_by>
  tag_id?: Maybe<order_by>
}

/** primary key columns input for table: "review_tag_sentence" */
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
  id?: Maybe<Scalars['uuid']>
  ml_sentiment?: Maybe<Scalars['numeric']>
  naive_sentiment?: Maybe<Scalars['numeric']>
  restaurant_id?: Maybe<Scalars['uuid']>
  review_id?: Maybe<Scalars['uuid']>
  sentence?: Maybe<Scalars['String']>
  tag_id?: Maybe<Scalars['uuid']>
}

/** order by stddev() on columns of table "review_tag_sentence" */
export interface review_tag_sentence_stddev_order_by {
  ml_sentiment?: Maybe<order_by>
  naive_sentiment?: Maybe<order_by>
}

/** order by stddev_pop() on columns of table "review_tag_sentence" */
export interface review_tag_sentence_stddev_pop_order_by {
  ml_sentiment?: Maybe<order_by>
  naive_sentiment?: Maybe<order_by>
}

/** order by stddev_samp() on columns of table "review_tag_sentence" */
export interface review_tag_sentence_stddev_samp_order_by {
  ml_sentiment?: Maybe<order_by>
  naive_sentiment?: Maybe<order_by>
}

/** order by sum() on columns of table "review_tag_sentence" */
export interface review_tag_sentence_sum_order_by {
  ml_sentiment?: Maybe<order_by>
  naive_sentiment?: Maybe<order_by>
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

/** order by var_pop() on columns of table "review_tag_sentence" */
export interface review_tag_sentence_var_pop_order_by {
  ml_sentiment?: Maybe<order_by>
  naive_sentiment?: Maybe<order_by>
}

/** order by var_samp() on columns of table "review_tag_sentence" */
export interface review_tag_sentence_var_samp_order_by {
  ml_sentiment?: Maybe<order_by>
  naive_sentiment?: Maybe<order_by>
}

/** order by variance() on columns of table "review_tag_sentence" */
export interface review_tag_sentence_variance_order_by {
  ml_sentiment?: Maybe<order_by>
  naive_sentiment?: Maybe<order_by>
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

/** order by var_pop() on columns of table "review" */
export interface review_var_pop_order_by {
  rating?: Maybe<order_by>
  vote?: Maybe<order_by>
}

/** order by var_samp() on columns of table "review" */
export interface review_var_samp_order_by {
  rating?: Maybe<order_by>
  vote?: Maybe<order_by>
}

/** order by variance() on columns of table "review" */
export interface review_variance_order_by {
  rating?: Maybe<order_by>
  vote?: Maybe<order_by>
}

/** order by aggregate values of table "setting" */
export interface setting_aggregate_order_by {
  count?: Maybe<order_by>
  max?: Maybe<setting_max_order_by>
  min?: Maybe<setting_min_order_by>
}

/** append existing jsonb value of filtered columns with new jsonb value */
export interface setting_append_input {
  value?: Maybe<Scalars['jsonb']>
}

/** input type for inserting array relation for remote table "setting" */
export interface setting_arr_rel_insert_input {
  data: Array<setting_insert_input>
  on_conflict?: Maybe<setting_on_conflict>
}

/** Boolean expression to filter rows from the table "setting". All fields are combined with a logical 'AND'. */
export interface setting_bool_exp {
  _and?: Maybe<Array<Maybe<setting_bool_exp>>>
  _not?: Maybe<setting_bool_exp>
  _or?: Maybe<Array<Maybe<setting_bool_exp>>>
  created_at?: Maybe<timestamptz_comparison_exp>
  id?: Maybe<uuid_comparison_exp>
  key?: Maybe<String_comparison_exp>
  updated_at?: Maybe<timestamptz_comparison_exp>
  value?: Maybe<jsonb_comparison_exp>
}

/** unique or primary key constraints on table "setting" */
export enum setting_constraint {
  /** unique or primary key constraint */
  setting_id_key = 'setting_id_key',
  /** unique or primary key constraint */
  setting_pkey = 'setting_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface setting_delete_at_path_input {
  value?: Maybe<Array<Maybe<Scalars['String']>>>
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface setting_delete_elem_input {
  value?: Maybe<Scalars['Int']>
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface setting_delete_key_input {
  value?: Maybe<Scalars['String']>
}

/** input type for inserting data into table "setting" */
export interface setting_insert_input {
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  key?: Maybe<Scalars['String']>
  updated_at?: Maybe<Scalars['timestamptz']>
  value?: Maybe<Scalars['jsonb']>
}

/** order by max() on columns of table "setting" */
export interface setting_max_order_by {
  created_at?: Maybe<order_by>
  id?: Maybe<order_by>
  key?: Maybe<order_by>
  updated_at?: Maybe<order_by>
}

/** order by min() on columns of table "setting" */
export interface setting_min_order_by {
  created_at?: Maybe<order_by>
  id?: Maybe<order_by>
  key?: Maybe<order_by>
  updated_at?: Maybe<order_by>
}

/** input type for inserting object relation for remote table "setting" */
export interface setting_obj_rel_insert_input {
  data: setting_insert_input
  on_conflict?: Maybe<setting_on_conflict>
}

/** on conflict condition type for table "setting" */
export interface setting_on_conflict {
  constraint: setting_constraint
  update_columns: Array<setting_update_column>
  where?: Maybe<setting_bool_exp>
}

/** ordering options when selecting data from "setting" */
export interface setting_order_by {
  created_at?: Maybe<order_by>
  id?: Maybe<order_by>
  key?: Maybe<order_by>
  updated_at?: Maybe<order_by>
  value?: Maybe<order_by>
}

/** primary key columns input for table: "setting" */
export interface setting_pk_columns_input {
  key: Scalars['String']
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface setting_prepend_input {
  value?: Maybe<Scalars['jsonb']>
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
  created_at?: Maybe<Scalars['timestamptz']>
  id?: Maybe<Scalars['uuid']>
  key?: Maybe<Scalars['String']>
  updated_at?: Maybe<Scalars['timestamptz']>
  value?: Maybe<Scalars['jsonb']>
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

export interface st_d_within_geography_input {
  distance: Scalars['Float']
  from: Scalars['geography']
  use_spheroid?: Maybe<Scalars['Boolean']>
}

export interface st_d_within_input {
  distance: Scalars['Float']
  from: Scalars['geometry']
}

/** order by aggregate values of table "tag" */
export interface tag_aggregate_order_by {
  avg?: Maybe<tag_avg_order_by>
  count?: Maybe<order_by>
  max?: Maybe<tag_max_order_by>
  min?: Maybe<tag_min_order_by>
  stddev?: Maybe<tag_stddev_order_by>
  stddev_pop?: Maybe<tag_stddev_pop_order_by>
  stddev_samp?: Maybe<tag_stddev_samp_order_by>
  sum?: Maybe<tag_sum_order_by>
  var_pop?: Maybe<tag_var_pop_order_by>
  var_samp?: Maybe<tag_var_samp_order_by>
  variance?: Maybe<tag_variance_order_by>
}

/** append existing jsonb value of filtered columns with new jsonb value */
export interface tag_append_input {
  alternates?: Maybe<Scalars['jsonb']>
  default_images?: Maybe<Scalars['jsonb']>
  misc?: Maybe<Scalars['jsonb']>
  rgb?: Maybe<Scalars['jsonb']>
}

/** input type for inserting array relation for remote table "tag" */
export interface tag_arr_rel_insert_input {
  data: Array<tag_insert_input>
  on_conflict?: Maybe<tag_on_conflict>
}

/** order by avg() on columns of table "tag" */
export interface tag_avg_order_by {
  frequency?: Maybe<order_by>
  order?: Maybe<order_by>
  popularity?: Maybe<order_by>
}

/** Boolean expression to filter rows from the table "tag". All fields are combined with a logical 'AND'. */
export interface tag_bool_exp {
  _and?: Maybe<Array<Maybe<tag_bool_exp>>>
  _not?: Maybe<tag_bool_exp>
  _or?: Maybe<Array<Maybe<tag_bool_exp>>>
  alternates?: Maybe<jsonb_comparison_exp>
  categories?: Maybe<tag_tag_bool_exp>
  created_at?: Maybe<timestamptz_comparison_exp>
  default_images?: Maybe<jsonb_comparison_exp>
  description?: Maybe<String_comparison_exp>
  displayName?: Maybe<String_comparison_exp>
  frequency?: Maybe<Int_comparison_exp>
  icon?: Maybe<String_comparison_exp>
  id?: Maybe<uuid_comparison_exp>
  is_ambiguous?: Maybe<Boolean_comparison_exp>
  misc?: Maybe<jsonb_comparison_exp>
  name?: Maybe<String_comparison_exp>
  order?: Maybe<Int_comparison_exp>
  parent?: Maybe<tag_bool_exp>
  parentId?: Maybe<uuid_comparison_exp>
  popularity?: Maybe<Int_comparison_exp>
  restaurant_taxonomies?: Maybe<restaurant_tag_bool_exp>
  rgb?: Maybe<jsonb_comparison_exp>
  slug?: Maybe<String_comparison_exp>
  type?: Maybe<String_comparison_exp>
  updated_at?: Maybe<timestamptz_comparison_exp>
}

/** unique or primary key constraints on table "tag" */
export enum tag_constraint {
  /** unique or primary key constraint */
  tag_id_key1 = 'tag_id_key1',
  /** unique or primary key constraint */
  tag_order_key = 'tag_order_key',
  /** unique or primary key constraint */
  tag_parentId_name_key = 'tag_parentId_name_key',
  /** unique or primary key constraint */
  tag_pkey = 'tag_pkey',
  /** unique or primary key constraint */
  tag_slug_key = 'tag_slug_key',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface tag_delete_at_path_input {
  alternates?: Maybe<Array<Maybe<Scalars['String']>>>
  default_images?: Maybe<Array<Maybe<Scalars['String']>>>
  misc?: Maybe<Array<Maybe<Scalars['String']>>>
  rgb?: Maybe<Array<Maybe<Scalars['String']>>>
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface tag_delete_elem_input {
  alternates?: Maybe<Scalars['Int']>
  default_images?: Maybe<Scalars['Int']>
  misc?: Maybe<Scalars['Int']>
  rgb?: Maybe<Scalars['Int']>
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface tag_delete_key_input {
  alternates?: Maybe<Scalars['String']>
  default_images?: Maybe<Scalars['String']>
  misc?: Maybe<Scalars['String']>
  rgb?: Maybe<Scalars['String']>
}

/** input type for incrementing integer column in table "tag" */
export interface tag_inc_input {
  frequency?: Maybe<Scalars['Int']>
  order?: Maybe<Scalars['Int']>
  popularity?: Maybe<Scalars['Int']>
}

/** input type for inserting data into table "tag" */
export interface tag_insert_input {
  alternates?: Maybe<Scalars['jsonb']>
  categories?: Maybe<tag_tag_arr_rel_insert_input>
  created_at?: Maybe<Scalars['timestamptz']>
  default_images?: Maybe<Scalars['jsonb']>
  description?: Maybe<Scalars['String']>
  displayName?: Maybe<Scalars['String']>
  frequency?: Maybe<Scalars['Int']>
  icon?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['uuid']>
  is_ambiguous?: Maybe<Scalars['Boolean']>
  misc?: Maybe<Scalars['jsonb']>
  name?: Maybe<Scalars['String']>
  order?: Maybe<Scalars['Int']>
  parent?: Maybe<tag_obj_rel_insert_input>
  parentId?: Maybe<Scalars['uuid']>
  popularity?: Maybe<Scalars['Int']>
  restaurant_taxonomies?: Maybe<restaurant_tag_arr_rel_insert_input>
  rgb?: Maybe<Scalars['jsonb']>
  slug?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  updated_at?: Maybe<Scalars['timestamptz']>
}

/** order by max() on columns of table "tag" */
export interface tag_max_order_by {
  created_at?: Maybe<order_by>
  description?: Maybe<order_by>
  displayName?: Maybe<order_by>
  frequency?: Maybe<order_by>
  icon?: Maybe<order_by>
  id?: Maybe<order_by>
  name?: Maybe<order_by>
  order?: Maybe<order_by>
  parentId?: Maybe<order_by>
  popularity?: Maybe<order_by>
  slug?: Maybe<order_by>
  type?: Maybe<order_by>
  updated_at?: Maybe<order_by>
}

/** order by min() on columns of table "tag" */
export interface tag_min_order_by {
  created_at?: Maybe<order_by>
  description?: Maybe<order_by>
  displayName?: Maybe<order_by>
  frequency?: Maybe<order_by>
  icon?: Maybe<order_by>
  id?: Maybe<order_by>
  name?: Maybe<order_by>
  order?: Maybe<order_by>
  parentId?: Maybe<order_by>
  popularity?: Maybe<order_by>
  slug?: Maybe<order_by>
  type?: Maybe<order_by>
  updated_at?: Maybe<order_by>
}

/** input type for inserting object relation for remote table "tag" */
export interface tag_obj_rel_insert_input {
  data: tag_insert_input
  on_conflict?: Maybe<tag_on_conflict>
}

/** on conflict condition type for table "tag" */
export interface tag_on_conflict {
  constraint: tag_constraint
  update_columns: Array<tag_update_column>
  where?: Maybe<tag_bool_exp>
}

/** ordering options when selecting data from "tag" */
export interface tag_order_by {
  alternates?: Maybe<order_by>
  categories_aggregate?: Maybe<tag_tag_aggregate_order_by>
  created_at?: Maybe<order_by>
  default_images?: Maybe<order_by>
  description?: Maybe<order_by>
  displayName?: Maybe<order_by>
  frequency?: Maybe<order_by>
  icon?: Maybe<order_by>
  id?: Maybe<order_by>
  is_ambiguous?: Maybe<order_by>
  misc?: Maybe<order_by>
  name?: Maybe<order_by>
  order?: Maybe<order_by>
  parent?: Maybe<tag_order_by>
  parentId?: Maybe<order_by>
  popularity?: Maybe<order_by>
  restaurant_taxonomies_aggregate?: Maybe<restaurant_tag_aggregate_order_by>
  rgb?: Maybe<order_by>
  slug?: Maybe<order_by>
  type?: Maybe<order_by>
  updated_at?: Maybe<order_by>
}

/** primary key columns input for table: "tag" */
export interface tag_pk_columns_input {
  id: Scalars['uuid']
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface tag_prepend_input {
  alternates?: Maybe<Scalars['jsonb']>
  default_images?: Maybe<Scalars['jsonb']>
  misc?: Maybe<Scalars['jsonb']>
  rgb?: Maybe<Scalars['jsonb']>
}

/** select columns of table "tag" */
export enum tag_select_column {
  /** column name */
  alternates = 'alternates',
  /** column name */
  created_at = 'created_at',
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
  alternates?: Maybe<Scalars['jsonb']>
  created_at?: Maybe<Scalars['timestamptz']>
  default_images?: Maybe<Scalars['jsonb']>
  description?: Maybe<Scalars['String']>
  displayName?: Maybe<Scalars['String']>
  frequency?: Maybe<Scalars['Int']>
  icon?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['uuid']>
  is_ambiguous?: Maybe<Scalars['Boolean']>
  misc?: Maybe<Scalars['jsonb']>
  name?: Maybe<Scalars['String']>
  order?: Maybe<Scalars['Int']>
  parentId?: Maybe<Scalars['uuid']>
  popularity?: Maybe<Scalars['Int']>
  rgb?: Maybe<Scalars['jsonb']>
  slug?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  updated_at?: Maybe<Scalars['timestamptz']>
}

/** order by stddev() on columns of table "tag" */
export interface tag_stddev_order_by {
  frequency?: Maybe<order_by>
  order?: Maybe<order_by>
  popularity?: Maybe<order_by>
}

/** order by stddev_pop() on columns of table "tag" */
export interface tag_stddev_pop_order_by {
  frequency?: Maybe<order_by>
  order?: Maybe<order_by>
  popularity?: Maybe<order_by>
}

/** order by stddev_samp() on columns of table "tag" */
export interface tag_stddev_samp_order_by {
  frequency?: Maybe<order_by>
  order?: Maybe<order_by>
  popularity?: Maybe<order_by>
}

/** order by sum() on columns of table "tag" */
export interface tag_sum_order_by {
  frequency?: Maybe<order_by>
  order?: Maybe<order_by>
  popularity?: Maybe<order_by>
}

/** order by aggregate values of table "tag_tag" */
export interface tag_tag_aggregate_order_by {
  count?: Maybe<order_by>
  max?: Maybe<tag_tag_max_order_by>
  min?: Maybe<tag_tag_min_order_by>
}

/** input type for inserting array relation for remote table "tag_tag" */
export interface tag_tag_arr_rel_insert_input {
  data: Array<tag_tag_insert_input>
  on_conflict?: Maybe<tag_tag_on_conflict>
}

/** Boolean expression to filter rows from the table "tag_tag". All fields are combined with a logical 'AND'. */
export interface tag_tag_bool_exp {
  _and?: Maybe<Array<Maybe<tag_tag_bool_exp>>>
  _not?: Maybe<tag_tag_bool_exp>
  _or?: Maybe<Array<Maybe<tag_tag_bool_exp>>>
  category?: Maybe<tag_bool_exp>
  category_tag_id?: Maybe<uuid_comparison_exp>
  main?: Maybe<tag_bool_exp>
  tag_id?: Maybe<uuid_comparison_exp>
}

/** unique or primary key constraints on table "tag_tag" */
export enum tag_tag_constraint {
  /** unique or primary key constraint */
  tag_tag_pkey = 'tag_tag_pkey',
}

/** input type for inserting data into table "tag_tag" */
export interface tag_tag_insert_input {
  category?: Maybe<tag_obj_rel_insert_input>
  category_tag_id?: Maybe<Scalars['uuid']>
  main?: Maybe<tag_obj_rel_insert_input>
  tag_id?: Maybe<Scalars['uuid']>
}

/** order by max() on columns of table "tag_tag" */
export interface tag_tag_max_order_by {
  category_tag_id?: Maybe<order_by>
  tag_id?: Maybe<order_by>
}

/** order by min() on columns of table "tag_tag" */
export interface tag_tag_min_order_by {
  category_tag_id?: Maybe<order_by>
  tag_id?: Maybe<order_by>
}

/** input type for inserting object relation for remote table "tag_tag" */
export interface tag_tag_obj_rel_insert_input {
  data: tag_tag_insert_input
  on_conflict?: Maybe<tag_tag_on_conflict>
}

/** on conflict condition type for table "tag_tag" */
export interface tag_tag_on_conflict {
  constraint: tag_tag_constraint
  update_columns: Array<tag_tag_update_column>
  where?: Maybe<tag_tag_bool_exp>
}

/** ordering options when selecting data from "tag_tag" */
export interface tag_tag_order_by {
  category?: Maybe<tag_order_by>
  category_tag_id?: Maybe<order_by>
  main?: Maybe<tag_order_by>
  tag_id?: Maybe<order_by>
}

/** primary key columns input for table: "tag_tag" */
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
  category_tag_id?: Maybe<Scalars['uuid']>
  tag_id?: Maybe<Scalars['uuid']>
}

/** update columns of table "tag_tag" */
export enum tag_tag_update_column {
  /** column name */
  category_tag_id = 'category_tag_id',
  /** column name */
  tag_id = 'tag_id',
}

/** update columns of table "tag" */
export enum tag_update_column {
  /** column name */
  alternates = 'alternates',
  /** column name */
  created_at = 'created_at',
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

/** order by var_pop() on columns of table "tag" */
export interface tag_var_pop_order_by {
  frequency?: Maybe<order_by>
  order?: Maybe<order_by>
  popularity?: Maybe<order_by>
}

/** order by var_samp() on columns of table "tag" */
export interface tag_var_samp_order_by {
  frequency?: Maybe<order_by>
  order?: Maybe<order_by>
  popularity?: Maybe<order_by>
}

/** order by variance() on columns of table "tag" */
export interface tag_variance_order_by {
  frequency?: Maybe<order_by>
  order?: Maybe<order_by>
  popularity?: Maybe<order_by>
}

/** expression to compare columns of type timestamptz. All fields are combined with logical 'AND'. */
export interface timestamptz_comparison_exp {
  _eq?: Maybe<Scalars['timestamptz']>
  _gt?: Maybe<Scalars['timestamptz']>
  _gte?: Maybe<Scalars['timestamptz']>
  _in?: Maybe<Array<Scalars['timestamptz']>>
  _is_null?: Maybe<Scalars['Boolean']>
  _lt?: Maybe<Scalars['timestamptz']>
  _lte?: Maybe<Scalars['timestamptz']>
  _neq?: Maybe<Scalars['timestamptz']>
  _nin?: Maybe<Array<Scalars['timestamptz']>>
}

/** expression to compare columns of type tsrange. All fields are combined with logical 'AND'. */
export interface tsrange_comparison_exp {
  _eq?: Maybe<Scalars['tsrange']>
  _gt?: Maybe<Scalars['tsrange']>
  _gte?: Maybe<Scalars['tsrange']>
  _in?: Maybe<Array<Scalars['tsrange']>>
  _is_null?: Maybe<Scalars['Boolean']>
  _lt?: Maybe<Scalars['tsrange']>
  _lte?: Maybe<Scalars['tsrange']>
  _neq?: Maybe<Scalars['tsrange']>
  _nin?: Maybe<Array<Scalars['tsrange']>>
}

/** order by aggregate values of table "user" */
export interface user_aggregate_order_by {
  avg?: Maybe<user_avg_order_by>
  count?: Maybe<order_by>
  max?: Maybe<user_max_order_by>
  min?: Maybe<user_min_order_by>
  stddev?: Maybe<user_stddev_order_by>
  stddev_pop?: Maybe<user_stddev_pop_order_by>
  stddev_samp?: Maybe<user_stddev_samp_order_by>
  sum?: Maybe<user_sum_order_by>
  var_pop?: Maybe<user_var_pop_order_by>
  var_samp?: Maybe<user_var_samp_order_by>
  variance?: Maybe<user_variance_order_by>
}

/** input type for inserting array relation for remote table "user" */
export interface user_arr_rel_insert_input {
  data: Array<user_insert_input>
  on_conflict?: Maybe<user_on_conflict>
}

/** order by avg() on columns of table "user" */
export interface user_avg_order_by {
  charIndex?: Maybe<order_by>
}

/** Boolean expression to filter rows from the table "user". All fields are combined with a logical 'AND'. */
export interface user_bool_exp {
  _and?: Maybe<Array<Maybe<user_bool_exp>>>
  _not?: Maybe<user_bool_exp>
  _or?: Maybe<Array<Maybe<user_bool_exp>>>
  about?: Maybe<String_comparison_exp>
  apple_email?: Maybe<String_comparison_exp>
  apple_refresh_token?: Maybe<String_comparison_exp>
  apple_token?: Maybe<String_comparison_exp>
  apple_uid?: Maybe<String_comparison_exp>
  avatar?: Maybe<String_comparison_exp>
  charIndex?: Maybe<Int_comparison_exp>
  created_at?: Maybe<timestamptz_comparison_exp>
  email?: Maybe<String_comparison_exp>
  has_onboarded?: Maybe<Boolean_comparison_exp>
  id?: Maybe<uuid_comparison_exp>
  location?: Maybe<String_comparison_exp>
  password?: Maybe<String_comparison_exp>
  password_reset_date?: Maybe<timestamptz_comparison_exp>
  password_reset_token?: Maybe<String_comparison_exp>
  reviews?: Maybe<review_bool_exp>
  role?: Maybe<String_comparison_exp>
  updated_at?: Maybe<timestamptz_comparison_exp>
  username?: Maybe<String_comparison_exp>
}

/** unique or primary key constraints on table "user" */
export enum user_constraint {
  /** unique or primary key constraint */
  user_email_key = 'user_email_key',
  /** unique or primary key constraint */
  user_pkey = 'user_pkey',
  /** unique or primary key constraint */
  user_username_key = 'user_username_key',
}

/** input type for incrementing integer column in table "user" */
export interface user_inc_input {
  charIndex?: Maybe<Scalars['Int']>
}

/** input type for inserting data into table "user" */
export interface user_insert_input {
  about?: Maybe<Scalars['String']>
  apple_email?: Maybe<Scalars['String']>
  apple_refresh_token?: Maybe<Scalars['String']>
  apple_token?: Maybe<Scalars['String']>
  apple_uid?: Maybe<Scalars['String']>
  avatar?: Maybe<Scalars['String']>
  charIndex?: Maybe<Scalars['Int']>
  created_at?: Maybe<Scalars['timestamptz']>
  email?: Maybe<Scalars['String']>
  has_onboarded?: Maybe<Scalars['Boolean']>
  id?: Maybe<Scalars['uuid']>
  location?: Maybe<Scalars['String']>
  password?: Maybe<Scalars['String']>
  password_reset_date?: Maybe<Scalars['timestamptz']>
  password_reset_token?: Maybe<Scalars['String']>
  reviews?: Maybe<review_arr_rel_insert_input>
  role?: Maybe<Scalars['String']>
  updated_at?: Maybe<Scalars['timestamptz']>
  username?: Maybe<Scalars['String']>
}

/** order by max() on columns of table "user" */
export interface user_max_order_by {
  about?: Maybe<order_by>
  apple_email?: Maybe<order_by>
  apple_refresh_token?: Maybe<order_by>
  apple_token?: Maybe<order_by>
  apple_uid?: Maybe<order_by>
  avatar?: Maybe<order_by>
  charIndex?: Maybe<order_by>
  created_at?: Maybe<order_by>
  email?: Maybe<order_by>
  id?: Maybe<order_by>
  location?: Maybe<order_by>
  password?: Maybe<order_by>
  password_reset_date?: Maybe<order_by>
  password_reset_token?: Maybe<order_by>
  role?: Maybe<order_by>
  updated_at?: Maybe<order_by>
  username?: Maybe<order_by>
}

/** order by min() on columns of table "user" */
export interface user_min_order_by {
  about?: Maybe<order_by>
  apple_email?: Maybe<order_by>
  apple_refresh_token?: Maybe<order_by>
  apple_token?: Maybe<order_by>
  apple_uid?: Maybe<order_by>
  avatar?: Maybe<order_by>
  charIndex?: Maybe<order_by>
  created_at?: Maybe<order_by>
  email?: Maybe<order_by>
  id?: Maybe<order_by>
  location?: Maybe<order_by>
  password?: Maybe<order_by>
  password_reset_date?: Maybe<order_by>
  password_reset_token?: Maybe<order_by>
  role?: Maybe<order_by>
  updated_at?: Maybe<order_by>
  username?: Maybe<order_by>
}

/** input type for inserting object relation for remote table "user" */
export interface user_obj_rel_insert_input {
  data: user_insert_input
  on_conflict?: Maybe<user_on_conflict>
}

/** on conflict condition type for table "user" */
export interface user_on_conflict {
  constraint: user_constraint
  update_columns: Array<user_update_column>
  where?: Maybe<user_bool_exp>
}

/** ordering options when selecting data from "user" */
export interface user_order_by {
  about?: Maybe<order_by>
  apple_email?: Maybe<order_by>
  apple_refresh_token?: Maybe<order_by>
  apple_token?: Maybe<order_by>
  apple_uid?: Maybe<order_by>
  avatar?: Maybe<order_by>
  charIndex?: Maybe<order_by>
  created_at?: Maybe<order_by>
  email?: Maybe<order_by>
  has_onboarded?: Maybe<order_by>
  id?: Maybe<order_by>
  location?: Maybe<order_by>
  password?: Maybe<order_by>
  password_reset_date?: Maybe<order_by>
  password_reset_token?: Maybe<order_by>
  reviews_aggregate?: Maybe<review_aggregate_order_by>
  role?: Maybe<order_by>
  updated_at?: Maybe<order_by>
  username?: Maybe<order_by>
}

/** primary key columns input for table: "user" */
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
  about?: Maybe<Scalars['String']>
  apple_email?: Maybe<Scalars['String']>
  apple_refresh_token?: Maybe<Scalars['String']>
  apple_token?: Maybe<Scalars['String']>
  apple_uid?: Maybe<Scalars['String']>
  avatar?: Maybe<Scalars['String']>
  charIndex?: Maybe<Scalars['Int']>
  created_at?: Maybe<Scalars['timestamptz']>
  email?: Maybe<Scalars['String']>
  has_onboarded?: Maybe<Scalars['Boolean']>
  id?: Maybe<Scalars['uuid']>
  location?: Maybe<Scalars['String']>
  password?: Maybe<Scalars['String']>
  password_reset_date?: Maybe<Scalars['timestamptz']>
  password_reset_token?: Maybe<Scalars['String']>
  role?: Maybe<Scalars['String']>
  updated_at?: Maybe<Scalars['timestamptz']>
  username?: Maybe<Scalars['String']>
}

/** order by stddev() on columns of table "user" */
export interface user_stddev_order_by {
  charIndex?: Maybe<order_by>
}

/** order by stddev_pop() on columns of table "user" */
export interface user_stddev_pop_order_by {
  charIndex?: Maybe<order_by>
}

/** order by stddev_samp() on columns of table "user" */
export interface user_stddev_samp_order_by {
  charIndex?: Maybe<order_by>
}

/** order by sum() on columns of table "user" */
export interface user_sum_order_by {
  charIndex?: Maybe<order_by>
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

/** order by var_pop() on columns of table "user" */
export interface user_var_pop_order_by {
  charIndex?: Maybe<order_by>
}

/** order by var_samp() on columns of table "user" */
export interface user_var_samp_order_by {
  charIndex?: Maybe<order_by>
}

/** order by variance() on columns of table "user" */
export interface user_variance_order_by {
  charIndex?: Maybe<order_by>
}

/** expression to compare columns of type uuid. All fields are combined with logical 'AND'. */
export interface uuid_comparison_exp {
  _eq?: Maybe<Scalars['uuid']>
  _gt?: Maybe<Scalars['uuid']>
  _gte?: Maybe<Scalars['uuid']>
  _in?: Maybe<Array<Scalars['uuid']>>
  _is_null?: Maybe<Scalars['Boolean']>
  _lt?: Maybe<Scalars['uuid']>
  _lte?: Maybe<Scalars['uuid']>
  _neq?: Maybe<Scalars['uuid']>
  _nin?: Maybe<Array<Scalars['uuid']>>
}

/** order by aggregate values of table "zcta5" */
export interface zcta5_aggregate_order_by {
  avg?: Maybe<zcta5_avg_order_by>
  count?: Maybe<order_by>
  max?: Maybe<zcta5_max_order_by>
  min?: Maybe<zcta5_min_order_by>
  stddev?: Maybe<zcta5_stddev_order_by>
  stddev_pop?: Maybe<zcta5_stddev_pop_order_by>
  stddev_samp?: Maybe<zcta5_stddev_samp_order_by>
  sum?: Maybe<zcta5_sum_order_by>
  var_pop?: Maybe<zcta5_var_pop_order_by>
  var_samp?: Maybe<zcta5_var_samp_order_by>
  variance?: Maybe<zcta5_variance_order_by>
}

/** input type for inserting array relation for remote table "zcta5" */
export interface zcta5_arr_rel_insert_input {
  data: Array<zcta5_insert_input>
  on_conflict?: Maybe<zcta5_on_conflict>
}

/** order by avg() on columns of table "zcta5" */
export interface zcta5_avg_order_by {
  aland10?: Maybe<order_by>
  awater10?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
}

/** Boolean expression to filter rows from the table "zcta5". All fields are combined with a logical 'AND'. */
export interface zcta5_bool_exp {
  _and?: Maybe<Array<Maybe<zcta5_bool_exp>>>
  _not?: Maybe<zcta5_bool_exp>
  _or?: Maybe<Array<Maybe<zcta5_bool_exp>>>
  aland10?: Maybe<float8_comparison_exp>
  awater10?: Maybe<float8_comparison_exp>
  classfp10?: Maybe<String_comparison_exp>
  funcstat10?: Maybe<String_comparison_exp>
  geoid10?: Maybe<String_comparison_exp>
  intptlat10?: Maybe<String_comparison_exp>
  intptlon10?: Maybe<String_comparison_exp>
  mtfcc10?: Maybe<String_comparison_exp>
  nhood?: Maybe<String_comparison_exp>
  ogc_fid?: Maybe<Int_comparison_exp>
  slug?: Maybe<String_comparison_exp>
  wkb_geometry?: Maybe<geometry_comparison_exp>
  zcta5ce10?: Maybe<String_comparison_exp>
}

/** unique or primary key constraints on table "zcta5" */
export enum zcta5_constraint {
  /** unique or primary key constraint */
  zcta5_pkey = 'zcta5_pkey',
  /** unique or primary key constraint */
  zcta5_slug_key = 'zcta5_slug_key',
}

/** input type for incrementing integer column in table "zcta5" */
export interface zcta5_inc_input {
  aland10?: Maybe<Scalars['float8']>
  awater10?: Maybe<Scalars['float8']>
  ogc_fid?: Maybe<Scalars['Int']>
}

/** input type for inserting data into table "zcta5" */
export interface zcta5_insert_input {
  aland10?: Maybe<Scalars['float8']>
  awater10?: Maybe<Scalars['float8']>
  classfp10?: Maybe<Scalars['String']>
  funcstat10?: Maybe<Scalars['String']>
  geoid10?: Maybe<Scalars['String']>
  intptlat10?: Maybe<Scalars['String']>
  intptlon10?: Maybe<Scalars['String']>
  mtfcc10?: Maybe<Scalars['String']>
  nhood?: Maybe<Scalars['String']>
  ogc_fid?: Maybe<Scalars['Int']>
  slug?: Maybe<Scalars['String']>
  wkb_geometry?: Maybe<Scalars['geometry']>
  zcta5ce10?: Maybe<Scalars['String']>
}

/** order by max() on columns of table "zcta5" */
export interface zcta5_max_order_by {
  aland10?: Maybe<order_by>
  awater10?: Maybe<order_by>
  classfp10?: Maybe<order_by>
  funcstat10?: Maybe<order_by>
  geoid10?: Maybe<order_by>
  intptlat10?: Maybe<order_by>
  intptlon10?: Maybe<order_by>
  mtfcc10?: Maybe<order_by>
  nhood?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
  slug?: Maybe<order_by>
  zcta5ce10?: Maybe<order_by>
}

/** order by min() on columns of table "zcta5" */
export interface zcta5_min_order_by {
  aland10?: Maybe<order_by>
  awater10?: Maybe<order_by>
  classfp10?: Maybe<order_by>
  funcstat10?: Maybe<order_by>
  geoid10?: Maybe<order_by>
  intptlat10?: Maybe<order_by>
  intptlon10?: Maybe<order_by>
  mtfcc10?: Maybe<order_by>
  nhood?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
  slug?: Maybe<order_by>
  zcta5ce10?: Maybe<order_by>
}

/** input type for inserting object relation for remote table "zcta5" */
export interface zcta5_obj_rel_insert_input {
  data: zcta5_insert_input
  on_conflict?: Maybe<zcta5_on_conflict>
}

/** on conflict condition type for table "zcta5" */
export interface zcta5_on_conflict {
  constraint: zcta5_constraint
  update_columns: Array<zcta5_update_column>
  where?: Maybe<zcta5_bool_exp>
}

/** ordering options when selecting data from "zcta5" */
export interface zcta5_order_by {
  aland10?: Maybe<order_by>
  awater10?: Maybe<order_by>
  classfp10?: Maybe<order_by>
  funcstat10?: Maybe<order_by>
  geoid10?: Maybe<order_by>
  intptlat10?: Maybe<order_by>
  intptlon10?: Maybe<order_by>
  mtfcc10?: Maybe<order_by>
  nhood?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
  slug?: Maybe<order_by>
  wkb_geometry?: Maybe<order_by>
  zcta5ce10?: Maybe<order_by>
}

/** primary key columns input for table: "zcta5" */
export interface zcta5_pk_columns_input {
  ogc_fid: Scalars['Int']
}

/** select columns of table "zcta5" */
export enum zcta5_select_column {
  /** column name */
  aland10 = 'aland10',
  /** column name */
  awater10 = 'awater10',
  /** column name */
  classfp10 = 'classfp10',
  /** column name */
  funcstat10 = 'funcstat10',
  /** column name */
  geoid10 = 'geoid10',
  /** column name */
  intptlat10 = 'intptlat10',
  /** column name */
  intptlon10 = 'intptlon10',
  /** column name */
  mtfcc10 = 'mtfcc10',
  /** column name */
  nhood = 'nhood',
  /** column name */
  ogc_fid = 'ogc_fid',
  /** column name */
  slug = 'slug',
  /** column name */
  wkb_geometry = 'wkb_geometry',
  /** column name */
  zcta5ce10 = 'zcta5ce10',
}

/** input type for updating data in table "zcta5" */
export interface zcta5_set_input {
  aland10?: Maybe<Scalars['float8']>
  awater10?: Maybe<Scalars['float8']>
  classfp10?: Maybe<Scalars['String']>
  funcstat10?: Maybe<Scalars['String']>
  geoid10?: Maybe<Scalars['String']>
  intptlat10?: Maybe<Scalars['String']>
  intptlon10?: Maybe<Scalars['String']>
  mtfcc10?: Maybe<Scalars['String']>
  nhood?: Maybe<Scalars['String']>
  ogc_fid?: Maybe<Scalars['Int']>
  slug?: Maybe<Scalars['String']>
  wkb_geometry?: Maybe<Scalars['geometry']>
  zcta5ce10?: Maybe<Scalars['String']>
}

/** order by stddev() on columns of table "zcta5" */
export interface zcta5_stddev_order_by {
  aland10?: Maybe<order_by>
  awater10?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
}

/** order by stddev_pop() on columns of table "zcta5" */
export interface zcta5_stddev_pop_order_by {
  aland10?: Maybe<order_by>
  awater10?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
}

/** order by stddev_samp() on columns of table "zcta5" */
export interface zcta5_stddev_samp_order_by {
  aland10?: Maybe<order_by>
  awater10?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
}

/** order by sum() on columns of table "zcta5" */
export interface zcta5_sum_order_by {
  aland10?: Maybe<order_by>
  awater10?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
}

/** update columns of table "zcta5" */
export enum zcta5_update_column {
  /** column name */
  aland10 = 'aland10',
  /** column name */
  awater10 = 'awater10',
  /** column name */
  classfp10 = 'classfp10',
  /** column name */
  funcstat10 = 'funcstat10',
  /** column name */
  geoid10 = 'geoid10',
  /** column name */
  intptlat10 = 'intptlat10',
  /** column name */
  intptlon10 = 'intptlon10',
  /** column name */
  mtfcc10 = 'mtfcc10',
  /** column name */
  nhood = 'nhood',
  /** column name */
  ogc_fid = 'ogc_fid',
  /** column name */
  slug = 'slug',
  /** column name */
  wkb_geometry = 'wkb_geometry',
  /** column name */
  zcta5ce10 = 'zcta5ce10',
}

/** order by var_pop() on columns of table "zcta5" */
export interface zcta5_var_pop_order_by {
  aland10?: Maybe<order_by>
  awater10?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
}

/** order by var_samp() on columns of table "zcta5" */
export interface zcta5_var_samp_order_by {
  aland10?: Maybe<order_by>
  awater10?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
}

/** order by variance() on columns of table "zcta5" */
export interface zcta5_variance_order_by {
  aland10?: Maybe<order_by>
  awater10?: Maybe<order_by>
  ogc_fid?: Maybe<order_by>
}

export const scalarsEnumsHash: ScalarsEnumsHash = {
  Boolean: true,
  Float: true,
  ID: true,
  Int: true,
  String: true,
  float8: true,
  geography: true,
  geometry: true,
  hrr_constraint: true,
  hrr_select_column: true,
  hrr_update_column: true,
  jsonb: true,
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
  restaurant_select_column: true,
  restaurant_tag_constraint: true,
  restaurant_tag_select_column: true,
  restaurant_tag_update_column: true,
  restaurant_update_column: true,
  review_constraint: true,
  review_select_column: true,
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
  query: {
    __typename: { __type: 'String!' },
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
    review_tag_sentence_by_pk: {
      __type: 'review_tag_sentence',
      __args: { id: 'uuid!' },
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
  mutation: {
    __typename: { __type: 'String!' },
    delete_hrr: {
      __type: 'hrr_mutation_response',
      __args: { where: 'hrr_bool_exp!' },
    },
    delete_hrr_by_pk: { __type: 'hrr', __args: { ogc_fid: 'Int!' } },
    delete_menu_item: {
      __type: 'menu_item_mutation_response',
      __args: { where: 'menu_item_bool_exp!' },
    },
    delete_menu_item_by_pk: { __type: 'menu_item', __args: { id: 'uuid!' } },
    delete_nhood_labels: {
      __type: 'nhood_labels_mutation_response',
      __args: { where: 'nhood_labels_bool_exp!' },
    },
    delete_nhood_labels_by_pk: {
      __type: 'nhood_labels',
      __args: { ogc_fid: 'Int!' },
    },
    delete_opening_hours: {
      __type: 'opening_hours_mutation_response',
      __args: { where: 'opening_hours_bool_exp!' },
    },
    delete_opening_hours_by_pk: {
      __type: 'opening_hours',
      __args: { id: 'uuid!' },
    },
    delete_photo: {
      __type: 'photo_mutation_response',
      __args: { where: 'photo_bool_exp!' },
    },
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
    delete_tag: {
      __type: 'tag_mutation_response',
      __args: { where: 'tag_bool_exp!' },
    },
    delete_tag_by_pk: { __type: 'tag', __args: { id: 'uuid!' } },
    delete_tag_tag: {
      __type: 'tag_tag_mutation_response',
      __args: { where: 'tag_tag_bool_exp!' },
    },
    delete_tag_tag_by_pk: {
      __type: 'tag_tag',
      __args: { category_tag_id: 'uuid!', tag_id: 'uuid!' },
    },
    delete_user: {
      __type: 'user_mutation_response',
      __args: { where: 'user_bool_exp!' },
    },
    delete_user_by_pk: { __type: 'user', __args: { id: 'uuid!' } },
    delete_zcta5: {
      __type: 'zcta5_mutation_response',
      __args: { where: 'zcta5_bool_exp!' },
    },
    delete_zcta5_by_pk: { __type: 'zcta5', __args: { ogc_fid: 'Int!' } },
    insert_hrr: {
      __type: 'hrr_mutation_response',
      __args: {
        objects: '[hrr_insert_input!]!',
        on_conflict: 'hrr_on_conflict',
      },
    },
    insert_hrr_one: {
      __type: 'hrr',
      __args: { object: 'hrr_insert_input!', on_conflict: 'hrr_on_conflict' },
    },
    insert_menu_item: {
      __type: 'menu_item_mutation_response',
      __args: {
        objects: '[menu_item_insert_input!]!',
        on_conflict: 'menu_item_on_conflict',
      },
    },
    insert_menu_item_one: {
      __type: 'menu_item',
      __args: {
        object: 'menu_item_insert_input!',
        on_conflict: 'menu_item_on_conflict',
      },
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
      __args: {
        objects: '[photo_insert_input!]!',
        on_conflict: 'photo_on_conflict',
      },
    },
    insert_photo_one: {
      __type: 'photo',
      __args: {
        object: 'photo_insert_input!',
        on_conflict: 'photo_on_conflict',
      },
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
      __args: {
        object: 'photo_xref_insert_input!',
        on_conflict: 'photo_xref_on_conflict',
      },
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
      __args: {
        object: 'restaurant_insert_input!',
        on_conflict: 'restaurant_on_conflict',
      },
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
      __args: {
        objects: '[review_insert_input!]!',
        on_conflict: 'review_on_conflict',
      },
    },
    insert_review_one: {
      __type: 'review',
      __args: {
        object: 'review_insert_input!',
        on_conflict: 'review_on_conflict',
      },
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
      __args: {
        objects: '[setting_insert_input!]!',
        on_conflict: 'setting_on_conflict',
      },
    },
    insert_setting_one: {
      __type: 'setting',
      __args: {
        object: 'setting_insert_input!',
        on_conflict: 'setting_on_conflict',
      },
    },
    insert_tag: {
      __type: 'tag_mutation_response',
      __args: {
        objects: '[tag_insert_input!]!',
        on_conflict: 'tag_on_conflict',
      },
    },
    insert_tag_one: {
      __type: 'tag',
      __args: { object: 'tag_insert_input!', on_conflict: 'tag_on_conflict' },
    },
    insert_tag_tag: {
      __type: 'tag_tag_mutation_response',
      __args: {
        objects: '[tag_tag_insert_input!]!',
        on_conflict: 'tag_tag_on_conflict',
      },
    },
    insert_tag_tag_one: {
      __type: 'tag_tag',
      __args: {
        object: 'tag_tag_insert_input!',
        on_conflict: 'tag_tag_on_conflict',
      },
    },
    insert_user: {
      __type: 'user_mutation_response',
      __args: {
        objects: '[user_insert_input!]!',
        on_conflict: 'user_on_conflict',
      },
    },
    insert_user_one: {
      __type: 'user',
      __args: { object: 'user_insert_input!', on_conflict: 'user_on_conflict' },
    },
    insert_zcta5: {
      __type: 'zcta5_mutation_response',
      __args: {
        objects: '[zcta5_insert_input!]!',
        on_conflict: 'zcta5_on_conflict',
      },
    },
    insert_zcta5_one: {
      __type: 'zcta5',
      __args: {
        object: 'zcta5_insert_input!',
        on_conflict: 'zcta5_on_conflict',
      },
    },
    update_hrr: {
      __type: 'hrr_mutation_response',
      __args: {
        _inc: 'hrr_inc_input',
        _set: 'hrr_set_input',
        where: 'hrr_bool_exp!',
      },
    },
    update_hrr_by_pk: {
      __type: 'hrr',
      __args: {
        _inc: 'hrr_inc_input',
        _set: 'hrr_set_input',
        pk_columns: 'hrr_pk_columns_input!',
      },
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
    update_opening_hours: {
      __type: 'opening_hours_mutation_response',
      __args: {
        _set: 'opening_hours_set_input',
        where: 'opening_hours_bool_exp!',
      },
    },
    update_opening_hours_by_pk: {
      __type: 'opening_hours',
      __args: {
        _set: 'opening_hours_set_input',
        pk_columns: 'opening_hours_pk_columns_input!',
      },
    },
    update_photo: {
      __type: 'photo_mutation_response',
      __args: {
        _inc: 'photo_inc_input',
        _set: 'photo_set_input',
        where: 'photo_bool_exp!',
      },
    },
    update_photo_by_pk: {
      __type: 'photo',
      __args: {
        _inc: 'photo_inc_input',
        _set: 'photo_set_input',
        pk_columns: 'photo_pk_columns_input!',
      },
    },
    update_photo_xref: {
      __type: 'photo_xref_mutation_response',
      __args: { _set: 'photo_xref_set_input', where: 'photo_xref_bool_exp!' },
    },
    update_photo_xref_by_pk: {
      __type: 'photo_xref',
      __args: {
        _set: 'photo_xref_set_input',
        pk_columns: 'photo_xref_pk_columns_input!',
      },
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
    update_tag_tag: {
      __type: 'tag_tag_mutation_response',
      __args: { _set: 'tag_tag_set_input', where: 'tag_tag_bool_exp!' },
    },
    update_tag_tag_by_pk: {
      __type: 'tag_tag',
      __args: {
        _set: 'tag_tag_set_input',
        pk_columns: 'tag_tag_pk_columns_input!',
      },
    },
    update_user: {
      __type: 'user_mutation_response',
      __args: {
        _inc: 'user_inc_input',
        _set: 'user_set_input',
        where: 'user_bool_exp!',
      },
    },
    update_user_by_pk: {
      __type: 'user',
      __args: {
        _inc: 'user_inc_input',
        _set: 'user_set_input',
        pk_columns: 'user_pk_columns_input!',
      },
    },
    update_zcta5: {
      __type: 'zcta5_mutation_response',
      __args: {
        _inc: 'zcta5_inc_input',
        _set: 'zcta5_set_input',
        where: 'zcta5_bool_exp!',
      },
    },
    update_zcta5_by_pk: {
      __type: 'zcta5',
      __args: {
        _inc: 'zcta5_inc_input',
        _set: 'zcta5_set_input',
        pk_columns: 'zcta5_pk_columns_input!',
      },
    },
  },
  subscription: {
    __typename: { __type: 'String!' },
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
    review_tag_sentence_by_pk: {
      __type: 'review_tag_sentence',
      __args: { id: 'uuid!' },
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
    _is_null: { __type: 'Boolean' },
    _like: { __type: 'String' },
    _lt: { __type: 'String' },
    _lte: { __type: 'String' },
    _neq: { __type: 'String' },
    _nilike: { __type: 'String' },
    _nin: { __type: '[String!]' },
    _nlike: { __type: 'String' },
    _nsimilar: { __type: 'String' },
    _similar: { __type: 'String' },
  },
  float8_comparison_exp: {
    _eq: { __type: 'float8' },
    _gt: { __type: 'float8' },
    _gte: { __type: 'float8' },
    _in: { __type: '[float8!]' },
    _is_null: { __type: 'Boolean' },
    _lt: { __type: 'float8' },
    _lte: { __type: 'float8' },
    _neq: { __type: 'float8' },
    _nin: { __type: '[float8!]' },
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
    hrr_bdry_i: { __type: 'float8' },
    hrrcity: { __type: 'String' },
    hrrnum: { __type: 'Int' },
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
      __type: 'Int',
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
  hrr_aggregate_order_by: {
    avg: { __type: 'hrr_avg_order_by' },
    count: { __type: 'order_by' },
    max: { __type: 'hrr_max_order_by' },
    min: { __type: 'hrr_min_order_by' },
    stddev: { __type: 'hrr_stddev_order_by' },
    stddev_pop: { __type: 'hrr_stddev_pop_order_by' },
    stddev_samp: { __type: 'hrr_stddev_samp_order_by' },
    sum: { __type: 'hrr_sum_order_by' },
    var_pop: { __type: 'hrr_var_pop_order_by' },
    var_samp: { __type: 'hrr_var_samp_order_by' },
    variance: { __type: 'hrr_variance_order_by' },
  },
  hrr_arr_rel_insert_input: {
    data: { __type: '[hrr_insert_input!]!' },
    on_conflict: { __type: 'hrr_on_conflict' },
  },
  hrr_avg_fields: {
    __typename: { __type: 'String!' },
    hrr_bdry_i: { __type: 'Float' },
    hrrnum: { __type: 'Float' },
    ogc_fid: { __type: 'Float' },
  },
  hrr_avg_order_by: {
    hrr_bdry_i: { __type: 'order_by' },
    hrrnum: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
  },
  hrr_bool_exp: {
    _and: { __type: '[hrr_bool_exp]' },
    _not: { __type: 'hrr_bool_exp' },
    _or: { __type: '[hrr_bool_exp]' },
    hrr_bdry_i: { __type: 'float8_comparison_exp' },
    hrrcity: { __type: 'String_comparison_exp' },
    hrrnum: { __type: 'Int_comparison_exp' },
    ogc_fid: { __type: 'Int_comparison_exp' },
    slug: { __type: 'String_comparison_exp' },
    wkb_geometry: { __type: 'geometry_comparison_exp' },
  },
  hrr_inc_input: {
    hrr_bdry_i: { __type: 'float8' },
    hrrnum: { __type: 'Int' },
    ogc_fid: { __type: 'Int' },
  },
  hrr_insert_input: {
    hrr_bdry_i: { __type: 'float8' },
    hrrcity: { __type: 'String' },
    hrrnum: { __type: 'Int' },
    ogc_fid: { __type: 'Int' },
    slug: { __type: 'String' },
    wkb_geometry: { __type: 'geometry' },
  },
  hrr_max_fields: {
    __typename: { __type: 'String!' },
    hrr_bdry_i: { __type: 'float8' },
    hrrcity: { __type: 'String' },
    hrrnum: { __type: 'Int' },
    ogc_fid: { __type: 'Int' },
    slug: { __type: 'String' },
  },
  hrr_max_order_by: {
    hrr_bdry_i: { __type: 'order_by' },
    hrrcity: { __type: 'order_by' },
    hrrnum: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
    slug: { __type: 'order_by' },
  },
  hrr_min_fields: {
    __typename: { __type: 'String!' },
    hrr_bdry_i: { __type: 'float8' },
    hrrcity: { __type: 'String' },
    hrrnum: { __type: 'Int' },
    ogc_fid: { __type: 'Int' },
    slug: { __type: 'String' },
  },
  hrr_min_order_by: {
    hrr_bdry_i: { __type: 'order_by' },
    hrrcity: { __type: 'order_by' },
    hrrnum: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
    slug: { __type: 'order_by' },
  },
  hrr_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[hrr!]!' },
  },
  hrr_obj_rel_insert_input: {
    data: { __type: 'hrr_insert_input!' },
    on_conflict: { __type: 'hrr_on_conflict' },
  },
  hrr_on_conflict: {
    constraint: { __type: 'hrr_constraint!' },
    update_columns: { __type: '[hrr_update_column!]!' },
    where: { __type: 'hrr_bool_exp' },
  },
  hrr_order_by: {
    hrr_bdry_i: { __type: 'order_by' },
    hrrcity: { __type: 'order_by' },
    hrrnum: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
    slug: { __type: 'order_by' },
    wkb_geometry: { __type: 'order_by' },
  },
  hrr_pk_columns_input: { ogc_fid: { __type: 'Int!' } },
  hrr_set_input: {
    hrr_bdry_i: { __type: 'float8' },
    hrrcity: { __type: 'String' },
    hrrnum: { __type: 'Int' },
    ogc_fid: { __type: 'Int' },
    slug: { __type: 'String' },
    wkb_geometry: { __type: 'geometry' },
  },
  hrr_stddev_fields: {
    __typename: { __type: 'String!' },
    hrr_bdry_i: { __type: 'Float' },
    hrrnum: { __type: 'Float' },
    ogc_fid: { __type: 'Float' },
  },
  hrr_stddev_order_by: {
    hrr_bdry_i: { __type: 'order_by' },
    hrrnum: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
  },
  hrr_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    hrr_bdry_i: { __type: 'Float' },
    hrrnum: { __type: 'Float' },
    ogc_fid: { __type: 'Float' },
  },
  hrr_stddev_pop_order_by: {
    hrr_bdry_i: { __type: 'order_by' },
    hrrnum: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
  },
  hrr_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    hrr_bdry_i: { __type: 'Float' },
    hrrnum: { __type: 'Float' },
    ogc_fid: { __type: 'Float' },
  },
  hrr_stddev_samp_order_by: {
    hrr_bdry_i: { __type: 'order_by' },
    hrrnum: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
  },
  hrr_sum_fields: {
    __typename: { __type: 'String!' },
    hrr_bdry_i: { __type: 'float8' },
    hrrnum: { __type: 'Int' },
    ogc_fid: { __type: 'Int' },
  },
  hrr_sum_order_by: {
    hrr_bdry_i: { __type: 'order_by' },
    hrrnum: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
  },
  hrr_var_pop_fields: {
    __typename: { __type: 'String!' },
    hrr_bdry_i: { __type: 'Float' },
    hrrnum: { __type: 'Float' },
    ogc_fid: { __type: 'Float' },
  },
  hrr_var_pop_order_by: {
    hrr_bdry_i: { __type: 'order_by' },
    hrrnum: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
  },
  hrr_var_samp_fields: {
    __typename: { __type: 'String!' },
    hrr_bdry_i: { __type: 'Float' },
    hrrnum: { __type: 'Float' },
    ogc_fid: { __type: 'Float' },
  },
  hrr_var_samp_order_by: {
    hrr_bdry_i: { __type: 'order_by' },
    hrrnum: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
  },
  hrr_variance_fields: {
    __typename: { __type: 'String!' },
    hrr_bdry_i: { __type: 'Float' },
    hrrnum: { __type: 'Float' },
    ogc_fid: { __type: 'Float' },
  },
  hrr_variance_order_by: {
    hrr_bdry_i: { __type: 'order_by' },
    hrrnum: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
  },
  jsonb_comparison_exp: {
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
  menu_item_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'menu_item_avg_fields' },
    count: {
      __type: 'Int',
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
  menu_item_avg_fields: {
    __typename: { __type: 'String!' },
    price: { __type: 'Float' },
  },
  menu_item_avg_order_by: { price: { __type: 'order_by' } },
  menu_item_bool_exp: {
    _and: { __type: '[menu_item_bool_exp]' },
    _not: { __type: 'menu_item_bool_exp' },
    _or: { __type: '[menu_item_bool_exp]' },
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
  menu_item_obj_rel_insert_input: {
    data: { __type: 'menu_item_insert_input!' },
    on_conflict: { __type: 'menu_item_on_conflict' },
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
  menu_item_stddev_fields: {
    __typename: { __type: 'String!' },
    price: { __type: 'Float' },
  },
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
  menu_item_sum_fields: {
    __typename: { __type: 'String!' },
    price: { __type: 'Int' },
  },
  menu_item_sum_order_by: { price: { __type: 'order_by' } },
  menu_item_var_pop_fields: {
    __typename: { __type: 'String!' },
    price: { __type: 'Float' },
  },
  menu_item_var_pop_order_by: { price: { __type: 'order_by' } },
  menu_item_var_samp_fields: {
    __typename: { __type: 'String!' },
    price: { __type: 'Float' },
  },
  menu_item_var_samp_order_by: { price: { __type: 'order_by' } },
  menu_item_variance_fields: {
    __typename: { __type: 'String!' },
    price: { __type: 'Float' },
  },
  menu_item_variance_order_by: { price: { __type: 'order_by' } },
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
      __type: 'Int',
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
  nhood_labels_aggregate_order_by: {
    avg: { __type: 'nhood_labels_avg_order_by' },
    count: { __type: 'order_by' },
    max: { __type: 'nhood_labels_max_order_by' },
    min: { __type: 'nhood_labels_min_order_by' },
    stddev: { __type: 'nhood_labels_stddev_order_by' },
    stddev_pop: { __type: 'nhood_labels_stddev_pop_order_by' },
    stddev_samp: { __type: 'nhood_labels_stddev_samp_order_by' },
    sum: { __type: 'nhood_labels_sum_order_by' },
    var_pop: { __type: 'nhood_labels_var_pop_order_by' },
    var_samp: { __type: 'nhood_labels_var_samp_order_by' },
    variance: { __type: 'nhood_labels_variance_order_by' },
  },
  nhood_labels_arr_rel_insert_input: {
    data: { __type: '[nhood_labels_insert_input!]!' },
    on_conflict: { __type: 'nhood_labels_on_conflict' },
  },
  nhood_labels_avg_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Float' },
  },
  nhood_labels_avg_order_by: { ogc_fid: { __type: 'order_by' } },
  nhood_labels_bool_exp: {
    _and: { __type: '[nhood_labels_bool_exp]' },
    _not: { __type: 'nhood_labels_bool_exp' },
    _or: { __type: '[nhood_labels_bool_exp]' },
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
  nhood_labels_max_order_by: {
    name: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
  },
  nhood_labels_min_fields: {
    __typename: { __type: 'String!' },
    name: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
  },
  nhood_labels_min_order_by: {
    name: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
  },
  nhood_labels_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[nhood_labels!]!' },
  },
  nhood_labels_obj_rel_insert_input: {
    data: { __type: 'nhood_labels_insert_input!' },
    on_conflict: { __type: 'nhood_labels_on_conflict' },
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
  nhood_labels_stddev_order_by: { ogc_fid: { __type: 'order_by' } },
  nhood_labels_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Float' },
  },
  nhood_labels_stddev_pop_order_by: { ogc_fid: { __type: 'order_by' } },
  nhood_labels_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Float' },
  },
  nhood_labels_stddev_samp_order_by: { ogc_fid: { __type: 'order_by' } },
  nhood_labels_sum_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Int' },
  },
  nhood_labels_sum_order_by: { ogc_fid: { __type: 'order_by' } },
  nhood_labels_var_pop_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Float' },
  },
  nhood_labels_var_pop_order_by: { ogc_fid: { __type: 'order_by' } },
  nhood_labels_var_samp_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Float' },
  },
  nhood_labels_var_samp_order_by: { ogc_fid: { __type: 'order_by' } },
  nhood_labels_variance_fields: {
    __typename: { __type: 'String!' },
    ogc_fid: { __type: 'Float' },
  },
  nhood_labels_variance_order_by: { ogc_fid: { __type: 'order_by' } },
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
      __type: 'Int',
      __args: {
        columns: '[opening_hours_select_column!]',
        distinct: 'Boolean',
      },
    },
    max: { __type: 'opening_hours_max_fields' },
    min: { __type: 'opening_hours_min_fields' },
  },
  opening_hours_aggregate_order_by: {
    count: { __type: 'order_by' },
    max: { __type: 'opening_hours_max_order_by' },
    min: { __type: 'opening_hours_min_order_by' },
  },
  opening_hours_arr_rel_insert_input: {
    data: { __type: '[opening_hours_insert_input!]!' },
    on_conflict: { __type: 'opening_hours_on_conflict' },
  },
  opening_hours_bool_exp: {
    _and: { __type: '[opening_hours_bool_exp]' },
    _not: { __type: 'opening_hours_bool_exp' },
    _or: { __type: '[opening_hours_bool_exp]' },
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
  opening_hours_max_order_by: {
    id: { __type: 'order_by' },
    restaurant_id: { __type: 'order_by' },
  },
  opening_hours_min_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'uuid' },
    restaurant_id: { __type: 'uuid' },
  },
  opening_hours_min_order_by: {
    id: { __type: 'order_by' },
    restaurant_id: { __type: 'order_by' },
  },
  opening_hours_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[opening_hours!]!' },
  },
  opening_hours_obj_rel_insert_input: {
    data: { __type: 'opening_hours_insert_input!' },
    on_conflict: { __type: 'opening_hours_on_conflict' },
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
  photo: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamptz!' },
    id: { __type: 'uuid!' },
    origin: { __type: 'String' },
    quality: { __type: 'numeric' },
    updated_at: { __type: 'timestamptz!' },
    url: { __type: 'String' },
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
      __type: 'Int',
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
  photo_aggregate_order_by: {
    avg: { __type: 'photo_avg_order_by' },
    count: { __type: 'order_by' },
    max: { __type: 'photo_max_order_by' },
    min: { __type: 'photo_min_order_by' },
    stddev: { __type: 'photo_stddev_order_by' },
    stddev_pop: { __type: 'photo_stddev_pop_order_by' },
    stddev_samp: { __type: 'photo_stddev_samp_order_by' },
    sum: { __type: 'photo_sum_order_by' },
    var_pop: { __type: 'photo_var_pop_order_by' },
    var_samp: { __type: 'photo_var_samp_order_by' },
    variance: { __type: 'photo_variance_order_by' },
  },
  photo_arr_rel_insert_input: {
    data: { __type: '[photo_insert_input!]!' },
    on_conflict: { __type: 'photo_on_conflict' },
  },
  photo_avg_fields: {
    __typename: { __type: 'String!' },
    quality: { __type: 'Float' },
  },
  photo_avg_order_by: { quality: { __type: 'order_by' } },
  photo_bool_exp: {
    _and: { __type: '[photo_bool_exp]' },
    _not: { __type: 'photo_bool_exp' },
    _or: { __type: '[photo_bool_exp]' },
    created_at: { __type: 'timestamptz_comparison_exp' },
    id: { __type: 'uuid_comparison_exp' },
    origin: { __type: 'String_comparison_exp' },
    quality: { __type: 'numeric_comparison_exp' },
    updated_at: { __type: 'timestamptz_comparison_exp' },
    url: { __type: 'String_comparison_exp' },
  },
  photo_inc_input: { quality: { __type: 'numeric' } },
  photo_insert_input: {
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    origin: { __type: 'String' },
    quality: { __type: 'numeric' },
    updated_at: { __type: 'timestamptz' },
    url: { __type: 'String' },
  },
  photo_max_fields: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    origin: { __type: 'String' },
    quality: { __type: 'numeric' },
    updated_at: { __type: 'timestamptz' },
    url: { __type: 'String' },
  },
  photo_max_order_by: {
    created_at: { __type: 'order_by' },
    id: { __type: 'order_by' },
    origin: { __type: 'order_by' },
    quality: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    url: { __type: 'order_by' },
  },
  photo_min_fields: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    origin: { __type: 'String' },
    quality: { __type: 'numeric' },
    updated_at: { __type: 'timestamptz' },
    url: { __type: 'String' },
  },
  photo_min_order_by: {
    created_at: { __type: 'order_by' },
    id: { __type: 'order_by' },
    origin: { __type: 'order_by' },
    quality: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    url: { __type: 'order_by' },
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
    created_at: { __type: 'order_by' },
    id: { __type: 'order_by' },
    origin: { __type: 'order_by' },
    quality: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    url: { __type: 'order_by' },
  },
  photo_pk_columns_input: { id: { __type: 'uuid!' } },
  photo_set_input: {
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    origin: { __type: 'String' },
    quality: { __type: 'numeric' },
    updated_at: { __type: 'timestamptz' },
    url: { __type: 'String' },
  },
  photo_stddev_fields: {
    __typename: { __type: 'String!' },
    quality: { __type: 'Float' },
  },
  photo_stddev_order_by: { quality: { __type: 'order_by' } },
  photo_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    quality: { __type: 'Float' },
  },
  photo_stddev_pop_order_by: { quality: { __type: 'order_by' } },
  photo_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    quality: { __type: 'Float' },
  },
  photo_stddev_samp_order_by: { quality: { __type: 'order_by' } },
  photo_sum_fields: {
    __typename: { __type: 'String!' },
    quality: { __type: 'numeric' },
  },
  photo_sum_order_by: { quality: { __type: 'order_by' } },
  photo_var_pop_fields: {
    __typename: { __type: 'String!' },
    quality: { __type: 'Float' },
  },
  photo_var_pop_order_by: { quality: { __type: 'order_by' } },
  photo_var_samp_fields: {
    __typename: { __type: 'String!' },
    quality: { __type: 'Float' },
  },
  photo_var_samp_order_by: { quality: { __type: 'order_by' } },
  photo_variance_fields: {
    __typename: { __type: 'String!' },
    quality: { __type: 'Float' },
  },
  photo_variance_order_by: { quality: { __type: 'order_by' } },
  photo_xref: {
    __typename: { __type: 'String!' },
    id: { __type: 'uuid!' },
    photo: { __type: 'photo!' },
    photo_id: { __type: 'uuid!' },
    restaurant_id: { __type: 'uuid!' },
    tag_id: { __type: 'uuid!' },
    type: { __type: 'String' },
  },
  photo_xref_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'photo_xref_aggregate_fields' },
    nodes: { __type: '[photo_xref!]!' },
  },
  photo_xref_aggregate_fields: {
    __typename: { __type: 'String!' },
    count: {
      __type: 'Int',
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
    _and: { __type: '[photo_xref_bool_exp]' },
    _not: { __type: 'photo_xref_bool_exp' },
    _or: { __type: '[photo_xref_bool_exp]' },
    id: { __type: 'uuid_comparison_exp' },
    photo: { __type: 'photo_bool_exp' },
    photo_id: { __type: 'uuid_comparison_exp' },
    restaurant_id: { __type: 'uuid_comparison_exp' },
    tag_id: { __type: 'uuid_comparison_exp' },
    type: { __type: 'String_comparison_exp' },
  },
  photo_xref_insert_input: {
    id: { __type: 'uuid' },
    photo: { __type: 'photo_obj_rel_insert_input' },
    photo_id: { __type: 'uuid' },
    restaurant_id: { __type: 'uuid' },
    tag_id: { __type: 'uuid' },
    type: { __type: 'String' },
  },
  photo_xref_max_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'uuid' },
    photo_id: { __type: 'uuid' },
    restaurant_id: { __type: 'uuid' },
    tag_id: { __type: 'uuid' },
    type: { __type: 'String' },
  },
  photo_xref_max_order_by: {
    id: { __type: 'order_by' },
    photo_id: { __type: 'order_by' },
    restaurant_id: { __type: 'order_by' },
    tag_id: { __type: 'order_by' },
    type: { __type: 'order_by' },
  },
  photo_xref_min_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'uuid' },
    photo_id: { __type: 'uuid' },
    restaurant_id: { __type: 'uuid' },
    tag_id: { __type: 'uuid' },
    type: { __type: 'String' },
  },
  photo_xref_min_order_by: {
    id: { __type: 'order_by' },
    photo_id: { __type: 'order_by' },
    restaurant_id: { __type: 'order_by' },
    tag_id: { __type: 'order_by' },
    type: { __type: 'order_by' },
  },
  photo_xref_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[photo_xref!]!' },
  },
  photo_xref_obj_rel_insert_input: {
    data: { __type: 'photo_xref_insert_input!' },
    on_conflict: { __type: 'photo_xref_on_conflict' },
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
    restaurant_id: { __type: 'order_by' },
    tag_id: { __type: 'order_by' },
    type: { __type: 'order_by' },
  },
  photo_xref_pk_columns_input: { id: { __type: 'uuid!' } },
  photo_xref_set_input: {
    id: { __type: 'uuid' },
    photo_id: { __type: 'uuid' },
    restaurant_id: { __type: 'uuid' },
    tag_id: { __type: 'uuid' },
    type: { __type: 'String' },
  },
  restaurant: {
    __typename: { __type: 'String!' },
    address: { __type: 'String' },
    city: { __type: 'String' },
    created_at: { __type: 'timestamptz!' },
    description: { __type: 'String' },
    downvotes: { __type: 'numeric' },
    geocoder_id: { __type: 'String' },
    headlines: { __type: 'jsonb', __args: { path: 'String' } },
    hours: { __type: 'jsonb', __args: { path: 'String' } },
    id: { __type: 'uuid!' },
    image: { __type: 'String' },
    is_open_now: { __type: 'Boolean' },
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
    oldest_review_date: { __type: 'timestamptz' },
    photos: { __type: 'jsonb', __args: { path: 'String' } },
    price_range: { __type: 'String' },
    rating: { __type: 'numeric' },
    rating_factors: { __type: 'jsonb', __args: { path: 'String' } },
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
    score_breakdown: { __type: 'jsonb', __args: { path: 'String' } },
    slug: { __type: 'String!' },
    source_breakdown: { __type: 'jsonb', __args: { path: 'String' } },
    sources: { __type: 'jsonb', __args: { path: 'String' } },
    state: { __type: 'String' },
    summary: { __type: 'String' },
    tag_names: { __type: 'jsonb', __args: { path: 'String' } },
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
        args: 'restaurant_top_tags_args!',
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
  restaurant_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'restaurant_avg_fields' },
    count: {
      __type: 'Int',
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
    headlines: { __type: 'jsonb' },
    hours: { __type: 'jsonb' },
    photos: { __type: 'jsonb' },
    rating_factors: { __type: 'jsonb' },
    score_breakdown: { __type: 'jsonb' },
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
    _and: { __type: '[restaurant_bool_exp]' },
    _not: { __type: 'restaurant_bool_exp' },
    _or: { __type: '[restaurant_bool_exp]' },
    address: { __type: 'String_comparison_exp' },
    city: { __type: 'String_comparison_exp' },
    created_at: { __type: 'timestamptz_comparison_exp' },
    description: { __type: 'String_comparison_exp' },
    downvotes: { __type: 'numeric_comparison_exp' },
    geocoder_id: { __type: 'String_comparison_exp' },
    headlines: { __type: 'jsonb_comparison_exp' },
    hours: { __type: 'jsonb_comparison_exp' },
    id: { __type: 'uuid_comparison_exp' },
    image: { __type: 'String_comparison_exp' },
    location: { __type: 'geometry_comparison_exp' },
    menu_items: { __type: 'menu_item_bool_exp' },
    name: { __type: 'String_comparison_exp' },
    oldest_review_date: { __type: 'timestamptz_comparison_exp' },
    photos: { __type: 'jsonb_comparison_exp' },
    price_range: { __type: 'String_comparison_exp' },
    rating: { __type: 'numeric_comparison_exp' },
    rating_factors: { __type: 'jsonb_comparison_exp' },
    reviews: { __type: 'review_bool_exp' },
    score: { __type: 'numeric_comparison_exp' },
    score_breakdown: { __type: 'jsonb_comparison_exp' },
    slug: { __type: 'String_comparison_exp' },
    source_breakdown: { __type: 'jsonb_comparison_exp' },
    sources: { __type: 'jsonb_comparison_exp' },
    state: { __type: 'String_comparison_exp' },
    summary: { __type: 'String_comparison_exp' },
    tag_names: { __type: 'jsonb_comparison_exp' },
    tags: { __type: 'restaurant_tag_bool_exp' },
    telephone: { __type: 'String_comparison_exp' },
    updated_at: { __type: 'timestamptz_comparison_exp' },
    upvotes: { __type: 'numeric_comparison_exp' },
    votes_ratio: { __type: 'numeric_comparison_exp' },
    website: { __type: 'String_comparison_exp' },
    zip: { __type: 'numeric_comparison_exp' },
  },
  restaurant_delete_at_path_input: {
    headlines: { __type: '[String]' },
    hours: { __type: '[String]' },
    photos: { __type: '[String]' },
    rating_factors: { __type: '[String]' },
    score_breakdown: { __type: '[String]' },
    source_breakdown: { __type: '[String]' },
    sources: { __type: '[String]' },
    tag_names: { __type: '[String]' },
  },
  restaurant_delete_elem_input: {
    headlines: { __type: 'Int' },
    hours: { __type: 'Int' },
    photos: { __type: 'Int' },
    rating_factors: { __type: 'Int' },
    score_breakdown: { __type: 'Int' },
    source_breakdown: { __type: 'Int' },
    sources: { __type: 'Int' },
    tag_names: { __type: 'Int' },
  },
  restaurant_delete_key_input: {
    headlines: { __type: 'String' },
    hours: { __type: 'String' },
    photos: { __type: 'String' },
    rating_factors: { __type: 'String' },
    score_breakdown: { __type: 'String' },
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
    geocoder_id: { __type: 'String' },
    headlines: { __type: 'jsonb' },
    hours: { __type: 'jsonb' },
    id: { __type: 'uuid' },
    image: { __type: 'String' },
    location: { __type: 'geometry' },
    menu_items: { __type: 'menu_item_arr_rel_insert_input' },
    name: { __type: 'String' },
    oldest_review_date: { __type: 'timestamptz' },
    photos: { __type: 'jsonb' },
    price_range: { __type: 'String' },
    rating: { __type: 'numeric' },
    rating_factors: { __type: 'jsonb' },
    reviews: { __type: 'review_arr_rel_insert_input' },
    score: { __type: 'numeric' },
    score_breakdown: { __type: 'jsonb' },
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
    geocoder_id: { __type: 'order_by' },
    headlines: { __type: 'order_by' },
    hours: { __type: 'order_by' },
    id: { __type: 'order_by' },
    image: { __type: 'order_by' },
    location: { __type: 'order_by' },
    menu_items_aggregate: { __type: 'menu_item_aggregate_order_by' },
    name: { __type: 'order_by' },
    oldest_review_date: { __type: 'order_by' },
    photos: { __type: 'order_by' },
    price_range: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    rating_factors: { __type: 'order_by' },
    reviews_aggregate: { __type: 'review_aggregate_order_by' },
    score: { __type: 'order_by' },
    score_breakdown: { __type: 'order_by' },
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
    headlines: { __type: 'jsonb' },
    hours: { __type: 'jsonb' },
    photos: { __type: 'jsonb' },
    rating_factors: { __type: 'jsonb' },
    score_breakdown: { __type: 'jsonb' },
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
    geocoder_id: { __type: 'String' },
    headlines: { __type: 'jsonb' },
    hours: { __type: 'jsonb' },
    id: { __type: 'uuid' },
    image: { __type: 'String' },
    location: { __type: 'geometry' },
    name: { __type: 'String' },
    oldest_review_date: { __type: 'timestamptz' },
    photos: { __type: 'jsonb' },
    price_range: { __type: 'String' },
    rating: { __type: 'numeric' },
    rating_factors: { __type: 'jsonb' },
    score: { __type: 'numeric' },
    score_breakdown: { __type: 'jsonb' },
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
    photos: { __type: 'jsonb', __args: { path: 'String' } },
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
    score_breakdown: { __type: 'jsonb', __args: { path: 'String' } },
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
    source_breakdown: { __type: 'jsonb', __args: { path: 'String' } },
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
  restaurant_tag_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'restaurant_tag_avg_fields' },
    count: {
      __type: 'Int',
      __args: {
        columns: '[restaurant_tag_select_column!]',
        distinct: 'Boolean',
      },
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
    _and: { __type: '[restaurant_tag_bool_exp]' },
    _not: { __type: 'restaurant_tag_bool_exp' },
    _or: { __type: '[restaurant_tag_bool_exp]' },
    downvotes: { __type: 'numeric_comparison_exp' },
    id: { __type: 'uuid_comparison_exp' },
    photos: { __type: 'jsonb_comparison_exp' },
    rank: { __type: 'Int_comparison_exp' },
    rating: { __type: 'numeric_comparison_exp' },
    restaurant: { __type: 'restaurant_bool_exp' },
    restaurant_id: { __type: 'uuid_comparison_exp' },
    review_mentions_count: { __type: 'numeric_comparison_exp' },
    reviews: { __type: 'review_bool_exp' },
    score: { __type: 'numeric_comparison_exp' },
    score_breakdown: { __type: 'jsonb_comparison_exp' },
    sentences: { __type: 'review_tag_sentence_bool_exp' },
    source_breakdown: { __type: 'jsonb_comparison_exp' },
    tag: { __type: 'tag_bool_exp' },
    tag_id: { __type: 'uuid_comparison_exp' },
    upvotes: { __type: 'numeric_comparison_exp' },
    votes_ratio: { __type: 'numeric_comparison_exp' },
  },
  restaurant_tag_delete_at_path_input: {
    photos: { __type: '[String]' },
    score_breakdown: { __type: '[String]' },
    source_breakdown: { __type: '[String]' },
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
    _tag_types: { __type: 'String' },
    tag_slugs: { __type: 'String' },
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
  review: {
    __typename: { __type: 'String!' },
    authored_at: { __type: 'timestamptz!' },
    categories: { __type: 'jsonb', __args: { path: 'String' } },
    favorited: { __type: 'Boolean' },
    id: { __type: 'uuid!' },
    location: { __type: 'geometry' },
    native_data_unique_key: { __type: 'String' },
    rating: { __type: 'numeric' },
    restaurant: { __type: 'restaurant!' },
    restaurant_id: { __type: 'uuid!' },
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
  review_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'review_avg_fields' },
    count: {
      __type: 'Int',
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
  review_avg_order_by: {
    rating: { __type: 'order_by' },
    vote: { __type: 'order_by' },
  },
  review_bool_exp: {
    _and: { __type: '[review_bool_exp]' },
    _not: { __type: 'review_bool_exp' },
    _or: { __type: '[review_bool_exp]' },
    authored_at: { __type: 'timestamptz_comparison_exp' },
    categories: { __type: 'jsonb_comparison_exp' },
    favorited: { __type: 'Boolean_comparison_exp' },
    id: { __type: 'uuid_comparison_exp' },
    location: { __type: 'geometry_comparison_exp' },
    native_data_unique_key: { __type: 'String_comparison_exp' },
    rating: { __type: 'numeric_comparison_exp' },
    restaurant: { __type: 'restaurant_bool_exp' },
    restaurant_id: { __type: 'uuid_comparison_exp' },
    sentiments: { __type: 'review_tag_sentence_bool_exp' },
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
  review_delete_at_path_input: { categories: { __type: '[String]' } },
  review_delete_elem_input: { categories: { __type: 'Int' } },
  review_delete_key_input: { categories: { __type: 'String' } },
  review_inc_input: {
    rating: { __type: 'numeric' },
    vote: { __type: 'numeric' },
  },
  review_insert_input: {
    authored_at: { __type: 'timestamptz' },
    categories: { __type: 'jsonb' },
    favorited: { __type: 'Boolean' },
    id: { __type: 'uuid' },
    location: { __type: 'geometry' },
    native_data_unique_key: { __type: 'String' },
    rating: { __type: 'numeric' },
    restaurant: { __type: 'restaurant_obj_rel_insert_input' },
    restaurant_id: { __type: 'uuid' },
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
    location: { __type: 'order_by' },
    native_data_unique_key: { __type: 'order_by' },
    rating: { __type: 'order_by' },
    restaurant: { __type: 'restaurant_order_by' },
    restaurant_id: { __type: 'order_by' },
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
  review_stddev_order_by: {
    rating: { __type: 'order_by' },
    vote: { __type: 'order_by' },
  },
  review_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    rating: { __type: 'Float' },
    vote: { __type: 'Float' },
  },
  review_stddev_pop_order_by: {
    rating: { __type: 'order_by' },
    vote: { __type: 'order_by' },
  },
  review_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    rating: { __type: 'Float' },
    vote: { __type: 'Float' },
  },
  review_stddev_samp_order_by: {
    rating: { __type: 'order_by' },
    vote: { __type: 'order_by' },
  },
  review_sum_fields: {
    __typename: { __type: 'String!' },
    rating: { __type: 'numeric' },
    vote: { __type: 'numeric' },
  },
  review_sum_order_by: {
    rating: { __type: 'order_by' },
    vote: { __type: 'order_by' },
  },
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
  review_tag_sentence_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'review_tag_sentence_avg_fields' },
    count: {
      __type: 'Int',
      __args: {
        columns: '[review_tag_sentence_select_column!]',
        distinct: 'Boolean',
      },
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
    _and: { __type: '[review_tag_sentence_bool_exp]' },
    _not: { __type: 'review_tag_sentence_bool_exp' },
    _or: { __type: '[review_tag_sentence_bool_exp]' },
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
  review_tag_sentence_obj_rel_insert_input: {
    data: { __type: 'review_tag_sentence_insert_input!' },
    on_conflict: { __type: 'review_tag_sentence_on_conflict' },
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
  review_tag_sentence_sum_fields: {
    __typename: { __type: 'String!' },
    ml_sentiment: { __type: 'numeric' },
    naive_sentiment: { __type: 'numeric' },
  },
  review_tag_sentence_sum_order_by: {
    ml_sentiment: { __type: 'order_by' },
    naive_sentiment: { __type: 'order_by' },
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
  review_var_pop_fields: {
    __typename: { __type: 'String!' },
    rating: { __type: 'Float' },
    vote: { __type: 'Float' },
  },
  review_var_pop_order_by: {
    rating: { __type: 'order_by' },
    vote: { __type: 'order_by' },
  },
  review_var_samp_fields: {
    __typename: { __type: 'String!' },
    rating: { __type: 'Float' },
    vote: { __type: 'Float' },
  },
  review_var_samp_order_by: {
    rating: { __type: 'order_by' },
    vote: { __type: 'order_by' },
  },
  review_variance_fields: {
    __typename: { __type: 'String!' },
    rating: { __type: 'Float' },
    vote: { __type: 'Float' },
  },
  review_variance_order_by: {
    rating: { __type: 'order_by' },
    vote: { __type: 'order_by' },
  },
  setting: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid!' },
    key: { __type: 'String!' },
    updated_at: { __type: 'timestamptz' },
    value: { __type: 'jsonb!', __args: { path: 'String' } },
  },
  setting_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'setting_aggregate_fields' },
    nodes: { __type: '[setting!]!' },
  },
  setting_aggregate_fields: {
    __typename: { __type: 'String!' },
    count: {
      __type: 'Int',
      __args: { columns: '[setting_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'setting_max_fields' },
    min: { __type: 'setting_min_fields' },
  },
  setting_aggregate_order_by: {
    count: { __type: 'order_by' },
    max: { __type: 'setting_max_order_by' },
    min: { __type: 'setting_min_order_by' },
  },
  setting_append_input: { value: { __type: 'jsonb' } },
  setting_arr_rel_insert_input: {
    data: { __type: '[setting_insert_input!]!' },
    on_conflict: { __type: 'setting_on_conflict' },
  },
  setting_bool_exp: {
    _and: { __type: '[setting_bool_exp]' },
    _not: { __type: 'setting_bool_exp' },
    _or: { __type: '[setting_bool_exp]' },
    created_at: { __type: 'timestamptz_comparison_exp' },
    id: { __type: 'uuid_comparison_exp' },
    key: { __type: 'String_comparison_exp' },
    updated_at: { __type: 'timestamptz_comparison_exp' },
    value: { __type: 'jsonb_comparison_exp' },
  },
  setting_delete_at_path_input: { value: { __type: '[String]' } },
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
  setting_max_order_by: {
    created_at: { __type: 'order_by' },
    id: { __type: 'order_by' },
    key: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
  },
  setting_min_fields: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamptz' },
    id: { __type: 'uuid' },
    key: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
  },
  setting_min_order_by: {
    created_at: { __type: 'order_by' },
    id: { __type: 'order_by' },
    key: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
  },
  setting_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[setting!]!' },
  },
  setting_obj_rel_insert_input: {
    data: { __type: 'setting_insert_input!' },
    on_conflict: { __type: 'setting_on_conflict' },
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
  st_d_within_geography_input: {
    distance: { __type: 'Float!' },
    from: { __type: 'geography!' },
    use_spheroid: { __type: 'Boolean' },
  },
  st_d_within_input: {
    distance: { __type: 'Float!' },
    from: { __type: 'geometry!' },
  },
  tag: {
    __typename: { __type: 'String!' },
    alternates: { __type: 'jsonb', __args: { path: 'String' } },
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
    default_images: { __type: 'jsonb', __args: { path: 'String' } },
    description: { __type: 'String' },
    displayName: { __type: 'String' },
    frequency: { __type: 'Int' },
    icon: { __type: 'String' },
    id: { __type: 'uuid!' },
    is_ambiguous: { __type: 'Boolean!' },
    misc: { __type: 'jsonb', __args: { path: 'String' } },
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
    rgb: { __type: 'jsonb', __args: { path: 'String' } },
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
      __type: 'Int',
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
  tag_aggregate_order_by: {
    avg: { __type: 'tag_avg_order_by' },
    count: { __type: 'order_by' },
    max: { __type: 'tag_max_order_by' },
    min: { __type: 'tag_min_order_by' },
    stddev: { __type: 'tag_stddev_order_by' },
    stddev_pop: { __type: 'tag_stddev_pop_order_by' },
    stddev_samp: { __type: 'tag_stddev_samp_order_by' },
    sum: { __type: 'tag_sum_order_by' },
    var_pop: { __type: 'tag_var_pop_order_by' },
    var_samp: { __type: 'tag_var_samp_order_by' },
    variance: { __type: 'tag_variance_order_by' },
  },
  tag_append_input: {
    alternates: { __type: 'jsonb' },
    default_images: { __type: 'jsonb' },
    misc: { __type: 'jsonb' },
    rgb: { __type: 'jsonb' },
  },
  tag_arr_rel_insert_input: {
    data: { __type: '[tag_insert_input!]!' },
    on_conflict: { __type: 'tag_on_conflict' },
  },
  tag_avg_fields: {
    __typename: { __type: 'String!' },
    frequency: { __type: 'Float' },
    order: { __type: 'Float' },
    popularity: { __type: 'Float' },
  },
  tag_avg_order_by: {
    frequency: { __type: 'order_by' },
    order: { __type: 'order_by' },
    popularity: { __type: 'order_by' },
  },
  tag_bool_exp: {
    _and: { __type: '[tag_bool_exp]' },
    _not: { __type: 'tag_bool_exp' },
    _or: { __type: '[tag_bool_exp]' },
    alternates: { __type: 'jsonb_comparison_exp' },
    categories: { __type: 'tag_tag_bool_exp' },
    created_at: { __type: 'timestamptz_comparison_exp' },
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
    rgb: { __type: 'jsonb_comparison_exp' },
    slug: { __type: 'String_comparison_exp' },
    type: { __type: 'String_comparison_exp' },
    updated_at: { __type: 'timestamptz_comparison_exp' },
  },
  tag_delete_at_path_input: {
    alternates: { __type: '[String]' },
    default_images: { __type: '[String]' },
    misc: { __type: '[String]' },
    rgb: { __type: '[String]' },
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
    rgb: { __type: 'jsonb' },
    slug: { __type: 'String' },
    type: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
  },
  tag_max_fields: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamptz' },
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
  tag_max_order_by: {
    created_at: { __type: 'order_by' },
    description: { __type: 'order_by' },
    displayName: { __type: 'order_by' },
    frequency: { __type: 'order_by' },
    icon: { __type: 'order_by' },
    id: { __type: 'order_by' },
    name: { __type: 'order_by' },
    order: { __type: 'order_by' },
    parentId: { __type: 'order_by' },
    popularity: { __type: 'order_by' },
    slug: { __type: 'order_by' },
    type: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
  },
  tag_min_fields: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamptz' },
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
  tag_min_order_by: {
    created_at: { __type: 'order_by' },
    description: { __type: 'order_by' },
    displayName: { __type: 'order_by' },
    frequency: { __type: 'order_by' },
    icon: { __type: 'order_by' },
    id: { __type: 'order_by' },
    name: { __type: 'order_by' },
    order: { __type: 'order_by' },
    parentId: { __type: 'order_by' },
    popularity: { __type: 'order_by' },
    slug: { __type: 'order_by' },
    type: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
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
    restaurant_taxonomies_aggregate: {
      __type: 'restaurant_tag_aggregate_order_by',
    },
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
  tag_stddev_order_by: {
    frequency: { __type: 'order_by' },
    order: { __type: 'order_by' },
    popularity: { __type: 'order_by' },
  },
  tag_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    frequency: { __type: 'Float' },
    order: { __type: 'Float' },
    popularity: { __type: 'Float' },
  },
  tag_stddev_pop_order_by: {
    frequency: { __type: 'order_by' },
    order: { __type: 'order_by' },
    popularity: { __type: 'order_by' },
  },
  tag_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    frequency: { __type: 'Float' },
    order: { __type: 'Float' },
    popularity: { __type: 'Float' },
  },
  tag_stddev_samp_order_by: {
    frequency: { __type: 'order_by' },
    order: { __type: 'order_by' },
    popularity: { __type: 'order_by' },
  },
  tag_sum_fields: {
    __typename: { __type: 'String!' },
    frequency: { __type: 'Int' },
    order: { __type: 'Int' },
    popularity: { __type: 'Int' },
  },
  tag_sum_order_by: {
    frequency: { __type: 'order_by' },
    order: { __type: 'order_by' },
    popularity: { __type: 'order_by' },
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
  tag_tag_aggregate_fields: {
    __typename: { __type: 'String!' },
    count: {
      __type: 'Int',
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
    _and: { __type: '[tag_tag_bool_exp]' },
    _not: { __type: 'tag_tag_bool_exp' },
    _or: { __type: '[tag_tag_bool_exp]' },
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
  tag_tag_obj_rel_insert_input: {
    data: { __type: 'tag_tag_insert_input!' },
    on_conflict: { __type: 'tag_tag_on_conflict' },
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
  tag_tag_set_input: {
    category_tag_id: { __type: 'uuid' },
    tag_id: { __type: 'uuid' },
  },
  tag_var_pop_fields: {
    __typename: { __type: 'String!' },
    frequency: { __type: 'Float' },
    order: { __type: 'Float' },
    popularity: { __type: 'Float' },
  },
  tag_var_pop_order_by: {
    frequency: { __type: 'order_by' },
    order: { __type: 'order_by' },
    popularity: { __type: 'order_by' },
  },
  tag_var_samp_fields: {
    __typename: { __type: 'String!' },
    frequency: { __type: 'Float' },
    order: { __type: 'Float' },
    popularity: { __type: 'Float' },
  },
  tag_var_samp_order_by: {
    frequency: { __type: 'order_by' },
    order: { __type: 'order_by' },
    popularity: { __type: 'order_by' },
  },
  tag_variance_fields: {
    __typename: { __type: 'String!' },
    frequency: { __type: 'Float' },
    order: { __type: 'Float' },
    popularity: { __type: 'Float' },
  },
  tag_variance_order_by: {
    frequency: { __type: 'order_by' },
    order: { __type: 'order_by' },
    popularity: { __type: 'order_by' },
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
    has_onboarded: { __type: 'Boolean!' },
    id: { __type: 'uuid!' },
    location: { __type: 'String' },
    password: { __type: 'String!' },
    password_reset_date: { __type: 'timestamptz' },
    password_reset_token: { __type: 'String' },
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
      __type: 'Int',
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
  user_aggregate_order_by: {
    avg: { __type: 'user_avg_order_by' },
    count: { __type: 'order_by' },
    max: { __type: 'user_max_order_by' },
    min: { __type: 'user_min_order_by' },
    stddev: { __type: 'user_stddev_order_by' },
    stddev_pop: { __type: 'user_stddev_pop_order_by' },
    stddev_samp: { __type: 'user_stddev_samp_order_by' },
    sum: { __type: 'user_sum_order_by' },
    var_pop: { __type: 'user_var_pop_order_by' },
    var_samp: { __type: 'user_var_samp_order_by' },
    variance: { __type: 'user_variance_order_by' },
  },
  user_arr_rel_insert_input: {
    data: { __type: '[user_insert_input!]!' },
    on_conflict: { __type: 'user_on_conflict' },
  },
  user_avg_fields: {
    __typename: { __type: 'String!' },
    charIndex: { __type: 'Float' },
  },
  user_avg_order_by: { charIndex: { __type: 'order_by' } },
  user_bool_exp: {
    _and: { __type: '[user_bool_exp]' },
    _not: { __type: 'user_bool_exp' },
    _or: { __type: '[user_bool_exp]' },
    about: { __type: 'String_comparison_exp' },
    apple_email: { __type: 'String_comparison_exp' },
    apple_refresh_token: { __type: 'String_comparison_exp' },
    apple_token: { __type: 'String_comparison_exp' },
    apple_uid: { __type: 'String_comparison_exp' },
    avatar: { __type: 'String_comparison_exp' },
    charIndex: { __type: 'Int_comparison_exp' },
    created_at: { __type: 'timestamptz_comparison_exp' },
    email: { __type: 'String_comparison_exp' },
    has_onboarded: { __type: 'Boolean_comparison_exp' },
    id: { __type: 'uuid_comparison_exp' },
    location: { __type: 'String_comparison_exp' },
    password: { __type: 'String_comparison_exp' },
    password_reset_date: { __type: 'timestamptz_comparison_exp' },
    password_reset_token: { __type: 'String_comparison_exp' },
    reviews: { __type: 'review_bool_exp' },
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
    has_onboarded: { __type: 'Boolean' },
    id: { __type: 'uuid' },
    location: { __type: 'String' },
    password: { __type: 'String' },
    password_reset_date: { __type: 'timestamptz' },
    password_reset_token: { __type: 'String' },
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
    password: { __type: 'String' },
    password_reset_date: { __type: 'timestamptz' },
    password_reset_token: { __type: 'String' },
    role: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    username: { __type: 'String' },
  },
  user_max_order_by: {
    about: { __type: 'order_by' },
    apple_email: { __type: 'order_by' },
    apple_refresh_token: { __type: 'order_by' },
    apple_token: { __type: 'order_by' },
    apple_uid: { __type: 'order_by' },
    avatar: { __type: 'order_by' },
    charIndex: { __type: 'order_by' },
    created_at: { __type: 'order_by' },
    email: { __type: 'order_by' },
    id: { __type: 'order_by' },
    location: { __type: 'order_by' },
    password: { __type: 'order_by' },
    password_reset_date: { __type: 'order_by' },
    password_reset_token: { __type: 'order_by' },
    role: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    username: { __type: 'order_by' },
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
    password: { __type: 'String' },
    password_reset_date: { __type: 'timestamptz' },
    password_reset_token: { __type: 'String' },
    role: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    username: { __type: 'String' },
  },
  user_min_order_by: {
    about: { __type: 'order_by' },
    apple_email: { __type: 'order_by' },
    apple_refresh_token: { __type: 'order_by' },
    apple_token: { __type: 'order_by' },
    apple_uid: { __type: 'order_by' },
    avatar: { __type: 'order_by' },
    charIndex: { __type: 'order_by' },
    created_at: { __type: 'order_by' },
    email: { __type: 'order_by' },
    id: { __type: 'order_by' },
    location: { __type: 'order_by' },
    password: { __type: 'order_by' },
    password_reset_date: { __type: 'order_by' },
    password_reset_token: { __type: 'order_by' },
    role: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    username: { __type: 'order_by' },
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
    has_onboarded: { __type: 'order_by' },
    id: { __type: 'order_by' },
    location: { __type: 'order_by' },
    password: { __type: 'order_by' },
    password_reset_date: { __type: 'order_by' },
    password_reset_token: { __type: 'order_by' },
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
    password: { __type: 'String' },
    password_reset_date: { __type: 'timestamptz' },
    password_reset_token: { __type: 'String' },
    role: { __type: 'String' },
    updated_at: { __type: 'timestamptz' },
    username: { __type: 'String' },
  },
  user_stddev_fields: {
    __typename: { __type: 'String!' },
    charIndex: { __type: 'Float' },
  },
  user_stddev_order_by: { charIndex: { __type: 'order_by' } },
  user_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    charIndex: { __type: 'Float' },
  },
  user_stddev_pop_order_by: { charIndex: { __type: 'order_by' } },
  user_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    charIndex: { __type: 'Float' },
  },
  user_stddev_samp_order_by: { charIndex: { __type: 'order_by' } },
  user_sum_fields: {
    __typename: { __type: 'String!' },
    charIndex: { __type: 'Int' },
  },
  user_sum_order_by: { charIndex: { __type: 'order_by' } },
  user_var_pop_fields: {
    __typename: { __type: 'String!' },
    charIndex: { __type: 'Float' },
  },
  user_var_pop_order_by: { charIndex: { __type: 'order_by' } },
  user_var_samp_fields: {
    __typename: { __type: 'String!' },
    charIndex: { __type: 'Float' },
  },
  user_var_samp_order_by: { charIndex: { __type: 'order_by' } },
  user_variance_fields: {
    __typename: { __type: 'String!' },
    charIndex: { __type: 'Float' },
  },
  user_variance_order_by: { charIndex: { __type: 'order_by' } },
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
    aland10: { __type: 'float8' },
    awater10: { __type: 'float8' },
    classfp10: { __type: 'String' },
    funcstat10: { __type: 'String' },
    geoid10: { __type: 'String' },
    intptlat10: { __type: 'String' },
    intptlon10: { __type: 'String' },
    mtfcc10: { __type: 'String' },
    nhood: { __type: 'String' },
    ogc_fid: { __type: 'Int!' },
    slug: { __type: 'String' },
    wkb_geometry: { __type: 'geometry' },
    zcta5ce10: { __type: 'String' },
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
      __type: 'Int',
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
  zcta5_aggregate_order_by: {
    avg: { __type: 'zcta5_avg_order_by' },
    count: { __type: 'order_by' },
    max: { __type: 'zcta5_max_order_by' },
    min: { __type: 'zcta5_min_order_by' },
    stddev: { __type: 'zcta5_stddev_order_by' },
    stddev_pop: { __type: 'zcta5_stddev_pop_order_by' },
    stddev_samp: { __type: 'zcta5_stddev_samp_order_by' },
    sum: { __type: 'zcta5_sum_order_by' },
    var_pop: { __type: 'zcta5_var_pop_order_by' },
    var_samp: { __type: 'zcta5_var_samp_order_by' },
    variance: { __type: 'zcta5_variance_order_by' },
  },
  zcta5_arr_rel_insert_input: {
    data: { __type: '[zcta5_insert_input!]!' },
    on_conflict: { __type: 'zcta5_on_conflict' },
  },
  zcta5_avg_fields: {
    __typename: { __type: 'String!' },
    aland10: { __type: 'Float' },
    awater10: { __type: 'Float' },
    ogc_fid: { __type: 'Float' },
  },
  zcta5_avg_order_by: {
    aland10: { __type: 'order_by' },
    awater10: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
  },
  zcta5_bool_exp: {
    _and: { __type: '[zcta5_bool_exp]' },
    _not: { __type: 'zcta5_bool_exp' },
    _or: { __type: '[zcta5_bool_exp]' },
    aland10: { __type: 'float8_comparison_exp' },
    awater10: { __type: 'float8_comparison_exp' },
    classfp10: { __type: 'String_comparison_exp' },
    funcstat10: { __type: 'String_comparison_exp' },
    geoid10: { __type: 'String_comparison_exp' },
    intptlat10: { __type: 'String_comparison_exp' },
    intptlon10: { __type: 'String_comparison_exp' },
    mtfcc10: { __type: 'String_comparison_exp' },
    nhood: { __type: 'String_comparison_exp' },
    ogc_fid: { __type: 'Int_comparison_exp' },
    slug: { __type: 'String_comparison_exp' },
    wkb_geometry: { __type: 'geometry_comparison_exp' },
    zcta5ce10: { __type: 'String_comparison_exp' },
  },
  zcta5_inc_input: {
    aland10: { __type: 'float8' },
    awater10: { __type: 'float8' },
    ogc_fid: { __type: 'Int' },
  },
  zcta5_insert_input: {
    aland10: { __type: 'float8' },
    awater10: { __type: 'float8' },
    classfp10: { __type: 'String' },
    funcstat10: { __type: 'String' },
    geoid10: { __type: 'String' },
    intptlat10: { __type: 'String' },
    intptlon10: { __type: 'String' },
    mtfcc10: { __type: 'String' },
    nhood: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
    slug: { __type: 'String' },
    wkb_geometry: { __type: 'geometry' },
    zcta5ce10: { __type: 'String' },
  },
  zcta5_max_fields: {
    __typename: { __type: 'String!' },
    aland10: { __type: 'float8' },
    awater10: { __type: 'float8' },
    classfp10: { __type: 'String' },
    funcstat10: { __type: 'String' },
    geoid10: { __type: 'String' },
    intptlat10: { __type: 'String' },
    intptlon10: { __type: 'String' },
    mtfcc10: { __type: 'String' },
    nhood: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
    slug: { __type: 'String' },
    zcta5ce10: { __type: 'String' },
  },
  zcta5_max_order_by: {
    aland10: { __type: 'order_by' },
    awater10: { __type: 'order_by' },
    classfp10: { __type: 'order_by' },
    funcstat10: { __type: 'order_by' },
    geoid10: { __type: 'order_by' },
    intptlat10: { __type: 'order_by' },
    intptlon10: { __type: 'order_by' },
    mtfcc10: { __type: 'order_by' },
    nhood: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
    slug: { __type: 'order_by' },
    zcta5ce10: { __type: 'order_by' },
  },
  zcta5_min_fields: {
    __typename: { __type: 'String!' },
    aland10: { __type: 'float8' },
    awater10: { __type: 'float8' },
    classfp10: { __type: 'String' },
    funcstat10: { __type: 'String' },
    geoid10: { __type: 'String' },
    intptlat10: { __type: 'String' },
    intptlon10: { __type: 'String' },
    mtfcc10: { __type: 'String' },
    nhood: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
    slug: { __type: 'String' },
    zcta5ce10: { __type: 'String' },
  },
  zcta5_min_order_by: {
    aland10: { __type: 'order_by' },
    awater10: { __type: 'order_by' },
    classfp10: { __type: 'order_by' },
    funcstat10: { __type: 'order_by' },
    geoid10: { __type: 'order_by' },
    intptlat10: { __type: 'order_by' },
    intptlon10: { __type: 'order_by' },
    mtfcc10: { __type: 'order_by' },
    nhood: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
    slug: { __type: 'order_by' },
    zcta5ce10: { __type: 'order_by' },
  },
  zcta5_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[zcta5!]!' },
  },
  zcta5_obj_rel_insert_input: {
    data: { __type: 'zcta5_insert_input!' },
    on_conflict: { __type: 'zcta5_on_conflict' },
  },
  zcta5_on_conflict: {
    constraint: { __type: 'zcta5_constraint!' },
    update_columns: { __type: '[zcta5_update_column!]!' },
    where: { __type: 'zcta5_bool_exp' },
  },
  zcta5_order_by: {
    aland10: { __type: 'order_by' },
    awater10: { __type: 'order_by' },
    classfp10: { __type: 'order_by' },
    funcstat10: { __type: 'order_by' },
    geoid10: { __type: 'order_by' },
    intptlat10: { __type: 'order_by' },
    intptlon10: { __type: 'order_by' },
    mtfcc10: { __type: 'order_by' },
    nhood: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
    slug: { __type: 'order_by' },
    wkb_geometry: { __type: 'order_by' },
    zcta5ce10: { __type: 'order_by' },
  },
  zcta5_pk_columns_input: { ogc_fid: { __type: 'Int!' } },
  zcta5_set_input: {
    aland10: { __type: 'float8' },
    awater10: { __type: 'float8' },
    classfp10: { __type: 'String' },
    funcstat10: { __type: 'String' },
    geoid10: { __type: 'String' },
    intptlat10: { __type: 'String' },
    intptlon10: { __type: 'String' },
    mtfcc10: { __type: 'String' },
    nhood: { __type: 'String' },
    ogc_fid: { __type: 'Int' },
    slug: { __type: 'String' },
    wkb_geometry: { __type: 'geometry' },
    zcta5ce10: { __type: 'String' },
  },
  zcta5_stddev_fields: {
    __typename: { __type: 'String!' },
    aland10: { __type: 'Float' },
    awater10: { __type: 'Float' },
    ogc_fid: { __type: 'Float' },
  },
  zcta5_stddev_order_by: {
    aland10: { __type: 'order_by' },
    awater10: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
  },
  zcta5_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    aland10: { __type: 'Float' },
    awater10: { __type: 'Float' },
    ogc_fid: { __type: 'Float' },
  },
  zcta5_stddev_pop_order_by: {
    aland10: { __type: 'order_by' },
    awater10: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
  },
  zcta5_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    aland10: { __type: 'Float' },
    awater10: { __type: 'Float' },
    ogc_fid: { __type: 'Float' },
  },
  zcta5_stddev_samp_order_by: {
    aland10: { __type: 'order_by' },
    awater10: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
  },
  zcta5_sum_fields: {
    __typename: { __type: 'String!' },
    aland10: { __type: 'float8' },
    awater10: { __type: 'float8' },
    ogc_fid: { __type: 'Int' },
  },
  zcta5_sum_order_by: {
    aland10: { __type: 'order_by' },
    awater10: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
  },
  zcta5_var_pop_fields: {
    __typename: { __type: 'String!' },
    aland10: { __type: 'Float' },
    awater10: { __type: 'Float' },
    ogc_fid: { __type: 'Float' },
  },
  zcta5_var_pop_order_by: {
    aland10: { __type: 'order_by' },
    awater10: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
  },
  zcta5_var_samp_fields: {
    __typename: { __type: 'String!' },
    aland10: { __type: 'Float' },
    awater10: { __type: 'Float' },
    ogc_fid: { __type: 'Float' },
  },
  zcta5_var_samp_order_by: {
    aland10: { __type: 'order_by' },
    awater10: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
  },
  zcta5_variance_fields: {
    __typename: { __type: 'String!' },
    aland10: { __type: 'Float' },
    awater10: { __type: 'Float' },
    ogc_fid: { __type: 'Float' },
  },
  zcta5_variance_order_by: {
    aland10: { __type: 'order_by' },
    awater10: { __type: 'order_by' },
    ogc_fid: { __type: 'order_by' },
  },
} as const

export interface Query {
  __typename: 'Query'
  hrr: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['hrr_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<hrr_order_by>>
    where?: Maybe<hrr_bool_exp>
  }) => Array<hrr>
  hrr_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['hrr_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<hrr_order_by>>
    where?: Maybe<hrr_bool_exp>
  }) => hrr_aggregate
  hrr_by_pk: (args: { ogc_fid: ScalarsEnums['Int'] }) => Maybe<hrr>
  menu_item: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['menu_item_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<menu_item_order_by>>
    where?: Maybe<menu_item_bool_exp>
  }) => Array<menu_item>
  menu_item_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['menu_item_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<menu_item_order_by>>
    where?: Maybe<menu_item_bool_exp>
  }) => menu_item_aggregate
  menu_item_by_pk: (args: { id: ScalarsEnums['uuid'] }) => Maybe<menu_item>
  nhood_labels: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['nhood_labels_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<nhood_labels_order_by>>
    where?: Maybe<nhood_labels_bool_exp>
  }) => Array<nhood_labels>
  nhood_labels_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['nhood_labels_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<nhood_labels_order_by>>
    where?: Maybe<nhood_labels_bool_exp>
  }) => nhood_labels_aggregate
  nhood_labels_by_pk: (args: {
    ogc_fid: ScalarsEnums['Int']
  }) => Maybe<nhood_labels>
  opening_hours: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['opening_hours_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<opening_hours_order_by>>
    where?: Maybe<opening_hours_bool_exp>
  }) => Array<opening_hours>
  opening_hours_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['opening_hours_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<opening_hours_order_by>>
    where?: Maybe<opening_hours_bool_exp>
  }) => opening_hours_aggregate
  opening_hours_by_pk: (args: {
    id: ScalarsEnums['uuid']
  }) => Maybe<opening_hours>
  photo: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['photo_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<photo_order_by>>
    where?: Maybe<photo_bool_exp>
  }) => Array<photo>
  photo_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['photo_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<photo_order_by>>
    where?: Maybe<photo_bool_exp>
  }) => photo_aggregate
  photo_by_pk: (args: { id: ScalarsEnums['uuid'] }) => Maybe<photo>
  photo_xref: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['photo_xref_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<photo_xref_order_by>>
    where?: Maybe<photo_xref_bool_exp>
  }) => Array<photo_xref>
  photo_xref_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['photo_xref_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<photo_xref_order_by>>
    where?: Maybe<photo_xref_bool_exp>
  }) => photo_xref_aggregate
  photo_xref_by_pk: (args: { id: ScalarsEnums['uuid'] }) => Maybe<photo_xref>
  restaurant: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<restaurant_order_by>>
    where?: Maybe<restaurant_bool_exp>
  }) => Array<restaurant>
  restaurant_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<restaurant_order_by>>
    where?: Maybe<restaurant_bool_exp>
  }) => restaurant_aggregate
  restaurant_by_pk: (args: { id: ScalarsEnums['uuid'] }) => Maybe<restaurant>
  restaurant_tag: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    where?: Maybe<restaurant_tag_bool_exp>
  }) => Array<restaurant_tag>
  restaurant_tag_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    where?: Maybe<restaurant_tag_bool_exp>
  }) => restaurant_tag_aggregate
  restaurant_tag_by_pk: (args: {
    restaurant_id: ScalarsEnums['uuid']
    tag_id: ScalarsEnums['uuid']
  }) => Maybe<restaurant_tag>
  review: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['review_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<review_order_by>>
    where?: Maybe<review_bool_exp>
  }) => Array<review>
  review_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['review_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<review_order_by>>
    where?: Maybe<review_bool_exp>
  }) => review_aggregate
  review_by_pk: (args: { id: ScalarsEnums['uuid'] }) => Maybe<review>
  review_tag_sentence: (args?: {
    distinct_on?: Maybe<
      Array<ScalarsEnums['review_tag_sentence_select_column']>
    >
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<review_tag_sentence_order_by>>
    where?: Maybe<review_tag_sentence_bool_exp>
  }) => Array<review_tag_sentence>
  review_tag_sentence_aggregate: (args?: {
    distinct_on?: Maybe<
      Array<ScalarsEnums['review_tag_sentence_select_column']>
    >
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<review_tag_sentence_order_by>>
    where?: Maybe<review_tag_sentence_bool_exp>
  }) => review_tag_sentence_aggregate
  review_tag_sentence_by_pk: (args: {
    id: ScalarsEnums['uuid']
  }) => Maybe<review_tag_sentence>
  setting: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['setting_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<setting_order_by>>
    where?: Maybe<setting_bool_exp>
  }) => Array<setting>
  setting_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['setting_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<setting_order_by>>
    where?: Maybe<setting_bool_exp>
  }) => setting_aggregate
  setting_by_pk: (args: { key: ScalarsEnums['String'] }) => Maybe<setting>
  tag: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['tag_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<tag_order_by>>
    where?: Maybe<tag_bool_exp>
  }) => Array<tag>
  tag_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['tag_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<tag_order_by>>
    where?: Maybe<tag_bool_exp>
  }) => tag_aggregate
  tag_by_pk: (args: { id: ScalarsEnums['uuid'] }) => Maybe<tag>
  tag_tag: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['tag_tag_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<tag_tag_order_by>>
    where?: Maybe<tag_tag_bool_exp>
  }) => Array<tag_tag>
  tag_tag_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['tag_tag_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<tag_tag_order_by>>
    where?: Maybe<tag_tag_bool_exp>
  }) => tag_tag_aggregate
  tag_tag_by_pk: (args: {
    category_tag_id: ScalarsEnums['uuid']
    tag_id: ScalarsEnums['uuid']
  }) => Maybe<tag_tag>
  user: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['user_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<user_order_by>>
    where?: Maybe<user_bool_exp>
  }) => Array<user>
  user_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['user_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<user_order_by>>
    where?: Maybe<user_bool_exp>
  }) => user_aggregate
  user_by_pk: (args: { id: ScalarsEnums['uuid'] }) => Maybe<user>
  zcta5: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['zcta5_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<zcta5_order_by>>
    where?: Maybe<zcta5_bool_exp>
  }) => Array<zcta5>
  zcta5_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['zcta5_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<zcta5_order_by>>
    where?: Maybe<zcta5_bool_exp>
  }) => zcta5_aggregate
  zcta5_by_pk: (args: { ogc_fid: ScalarsEnums['Int'] }) => Maybe<zcta5>
}

export interface Mutation {
  __typename: 'Mutation'
  delete_hrr: (args: { where: hrr_bool_exp }) => Maybe<hrr_mutation_response>
  delete_hrr_by_pk: (args: { ogc_fid: ScalarsEnums['Int'] }) => Maybe<hrr>
  delete_menu_item: (args: {
    where: menu_item_bool_exp
  }) => Maybe<menu_item_mutation_response>
  delete_menu_item_by_pk: (args: {
    id: ScalarsEnums['uuid']
  }) => Maybe<menu_item>
  delete_nhood_labels: (args: {
    where: nhood_labels_bool_exp
  }) => Maybe<nhood_labels_mutation_response>
  delete_nhood_labels_by_pk: (args: {
    ogc_fid: ScalarsEnums['Int']
  }) => Maybe<nhood_labels>
  delete_opening_hours: (args: {
    where: opening_hours_bool_exp
  }) => Maybe<opening_hours_mutation_response>
  delete_opening_hours_by_pk: (args: {
    id: ScalarsEnums['uuid']
  }) => Maybe<opening_hours>
  delete_photo: (args: {
    where: photo_bool_exp
  }) => Maybe<photo_mutation_response>
  delete_photo_by_pk: (args: { id: ScalarsEnums['uuid'] }) => Maybe<photo>
  delete_photo_xref: (args: {
    where: photo_xref_bool_exp
  }) => Maybe<photo_xref_mutation_response>
  delete_photo_xref_by_pk: (args: {
    id: ScalarsEnums['uuid']
  }) => Maybe<photo_xref>
  delete_restaurant: (args: {
    where: restaurant_bool_exp
  }) => Maybe<restaurant_mutation_response>
  delete_restaurant_by_pk: (args: {
    id: ScalarsEnums['uuid']
  }) => Maybe<restaurant>
  delete_restaurant_tag: (args: {
    where: restaurant_tag_bool_exp
  }) => Maybe<restaurant_tag_mutation_response>
  delete_restaurant_tag_by_pk: (args: {
    restaurant_id: ScalarsEnums['uuid']
    tag_id: ScalarsEnums['uuid']
  }) => Maybe<restaurant_tag>
  delete_review: (args: {
    where: review_bool_exp
  }) => Maybe<review_mutation_response>
  delete_review_by_pk: (args: { id: ScalarsEnums['uuid'] }) => Maybe<review>
  delete_review_tag_sentence: (args: {
    where: review_tag_sentence_bool_exp
  }) => Maybe<review_tag_sentence_mutation_response>
  delete_review_tag_sentence_by_pk: (args: {
    id: ScalarsEnums['uuid']
  }) => Maybe<review_tag_sentence>
  delete_setting: (args: {
    where: setting_bool_exp
  }) => Maybe<setting_mutation_response>
  delete_setting_by_pk: (args: {
    key: ScalarsEnums['String']
  }) => Maybe<setting>
  delete_tag: (args: { where: tag_bool_exp }) => Maybe<tag_mutation_response>
  delete_tag_by_pk: (args: { id: ScalarsEnums['uuid'] }) => Maybe<tag>
  delete_tag_tag: (args: {
    where: tag_tag_bool_exp
  }) => Maybe<tag_tag_mutation_response>
  delete_tag_tag_by_pk: (args: {
    category_tag_id: ScalarsEnums['uuid']
    tag_id: ScalarsEnums['uuid']
  }) => Maybe<tag_tag>
  delete_user: (args: { where: user_bool_exp }) => Maybe<user_mutation_response>
  delete_user_by_pk: (args: { id: ScalarsEnums['uuid'] }) => Maybe<user>
  delete_zcta5: (args: {
    where: zcta5_bool_exp
  }) => Maybe<zcta5_mutation_response>
  delete_zcta5_by_pk: (args: { ogc_fid: ScalarsEnums['Int'] }) => Maybe<zcta5>
  insert_hrr: (args: {
    objects: Array<hrr_insert_input>
    on_conflict?: Maybe<hrr_on_conflict>
  }) => Maybe<hrr_mutation_response>
  insert_hrr_one: (args: {
    object: hrr_insert_input
    on_conflict?: Maybe<hrr_on_conflict>
  }) => Maybe<hrr>
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
  update_opening_hours: (args: {
    _set?: Maybe<opening_hours_set_input>
    where: opening_hours_bool_exp
  }) => Maybe<opening_hours_mutation_response>
  update_opening_hours_by_pk: (args: {
    _set?: Maybe<opening_hours_set_input>
    pk_columns: opening_hours_pk_columns_input
  }) => Maybe<opening_hours>
  update_photo: (args: {
    _inc?: Maybe<photo_inc_input>
    _set?: Maybe<photo_set_input>
    where: photo_bool_exp
  }) => Maybe<photo_mutation_response>
  update_photo_by_pk: (args: {
    _inc?: Maybe<photo_inc_input>
    _set?: Maybe<photo_set_input>
    pk_columns: photo_pk_columns_input
  }) => Maybe<photo>
  update_photo_xref: (args: {
    _set?: Maybe<photo_xref_set_input>
    where: photo_xref_bool_exp
  }) => Maybe<photo_xref_mutation_response>
  update_photo_xref_by_pk: (args: {
    _set?: Maybe<photo_xref_set_input>
    pk_columns: photo_xref_pk_columns_input
  }) => Maybe<photo_xref>
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
  update_tag_tag: (args: {
    _set?: Maybe<tag_tag_set_input>
    where: tag_tag_bool_exp
  }) => Maybe<tag_tag_mutation_response>
  update_tag_tag_by_pk: (args: {
    _set?: Maybe<tag_tag_set_input>
    pk_columns: tag_tag_pk_columns_input
  }) => Maybe<tag_tag>
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
}

export interface Subscription {
  __typename: 'Subscription'
  hrr: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['hrr_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<hrr_order_by>>
    where?: Maybe<hrr_bool_exp>
  }) => Array<hrr>
  hrr_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['hrr_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<hrr_order_by>>
    where?: Maybe<hrr_bool_exp>
  }) => hrr_aggregate
  hrr_by_pk: (args: { ogc_fid: ScalarsEnums['Int'] }) => Maybe<hrr>
  menu_item: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['menu_item_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<menu_item_order_by>>
    where?: Maybe<menu_item_bool_exp>
  }) => Array<menu_item>
  menu_item_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['menu_item_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<menu_item_order_by>>
    where?: Maybe<menu_item_bool_exp>
  }) => menu_item_aggregate
  menu_item_by_pk: (args: { id: ScalarsEnums['uuid'] }) => Maybe<menu_item>
  nhood_labels: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['nhood_labels_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<nhood_labels_order_by>>
    where?: Maybe<nhood_labels_bool_exp>
  }) => Array<nhood_labels>
  nhood_labels_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['nhood_labels_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<nhood_labels_order_by>>
    where?: Maybe<nhood_labels_bool_exp>
  }) => nhood_labels_aggregate
  nhood_labels_by_pk: (args: {
    ogc_fid: ScalarsEnums['Int']
  }) => Maybe<nhood_labels>
  opening_hours: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['opening_hours_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<opening_hours_order_by>>
    where?: Maybe<opening_hours_bool_exp>
  }) => Array<opening_hours>
  opening_hours_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['opening_hours_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<opening_hours_order_by>>
    where?: Maybe<opening_hours_bool_exp>
  }) => opening_hours_aggregate
  opening_hours_by_pk: (args: {
    id: ScalarsEnums['uuid']
  }) => Maybe<opening_hours>
  photo: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['photo_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<photo_order_by>>
    where?: Maybe<photo_bool_exp>
  }) => Array<photo>
  photo_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['photo_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<photo_order_by>>
    where?: Maybe<photo_bool_exp>
  }) => photo_aggregate
  photo_by_pk: (args: { id: ScalarsEnums['uuid'] }) => Maybe<photo>
  photo_xref: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['photo_xref_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<photo_xref_order_by>>
    where?: Maybe<photo_xref_bool_exp>
  }) => Array<photo_xref>
  photo_xref_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['photo_xref_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<photo_xref_order_by>>
    where?: Maybe<photo_xref_bool_exp>
  }) => photo_xref_aggregate
  photo_xref_by_pk: (args: { id: ScalarsEnums['uuid'] }) => Maybe<photo_xref>
  restaurant: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<restaurant_order_by>>
    where?: Maybe<restaurant_bool_exp>
  }) => Array<restaurant>
  restaurant_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<restaurant_order_by>>
    where?: Maybe<restaurant_bool_exp>
  }) => restaurant_aggregate
  restaurant_by_pk: (args: { id: ScalarsEnums['uuid'] }) => Maybe<restaurant>
  restaurant_tag: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    where?: Maybe<restaurant_tag_bool_exp>
  }) => Array<restaurant_tag>
  restaurant_tag_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    where?: Maybe<restaurant_tag_bool_exp>
  }) => restaurant_tag_aggregate
  restaurant_tag_by_pk: (args: {
    restaurant_id: ScalarsEnums['uuid']
    tag_id: ScalarsEnums['uuid']
  }) => Maybe<restaurant_tag>
  review: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['review_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<review_order_by>>
    where?: Maybe<review_bool_exp>
  }) => Array<review>
  review_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['review_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<review_order_by>>
    where?: Maybe<review_bool_exp>
  }) => review_aggregate
  review_by_pk: (args: { id: ScalarsEnums['uuid'] }) => Maybe<review>
  review_tag_sentence: (args?: {
    distinct_on?: Maybe<
      Array<ScalarsEnums['review_tag_sentence_select_column']>
    >
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<review_tag_sentence_order_by>>
    where?: Maybe<review_tag_sentence_bool_exp>
  }) => Array<review_tag_sentence>
  review_tag_sentence_aggregate: (args?: {
    distinct_on?: Maybe<
      Array<ScalarsEnums['review_tag_sentence_select_column']>
    >
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<review_tag_sentence_order_by>>
    where?: Maybe<review_tag_sentence_bool_exp>
  }) => review_tag_sentence_aggregate
  review_tag_sentence_by_pk: (args: {
    id: ScalarsEnums['uuid']
  }) => Maybe<review_tag_sentence>
  setting: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['setting_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<setting_order_by>>
    where?: Maybe<setting_bool_exp>
  }) => Array<setting>
  setting_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['setting_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<setting_order_by>>
    where?: Maybe<setting_bool_exp>
  }) => setting_aggregate
  setting_by_pk: (args: { key: ScalarsEnums['String'] }) => Maybe<setting>
  tag: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['tag_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<tag_order_by>>
    where?: Maybe<tag_bool_exp>
  }) => Array<tag>
  tag_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['tag_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<tag_order_by>>
    where?: Maybe<tag_bool_exp>
  }) => tag_aggregate
  tag_by_pk: (args: { id: ScalarsEnums['uuid'] }) => Maybe<tag>
  tag_tag: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['tag_tag_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<tag_tag_order_by>>
    where?: Maybe<tag_tag_bool_exp>
  }) => Array<tag_tag>
  tag_tag_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['tag_tag_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<tag_tag_order_by>>
    where?: Maybe<tag_tag_bool_exp>
  }) => tag_tag_aggregate
  tag_tag_by_pk: (args: {
    category_tag_id: ScalarsEnums['uuid']
    tag_id: ScalarsEnums['uuid']
  }) => Maybe<tag_tag>
  user: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['user_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<user_order_by>>
    where?: Maybe<user_bool_exp>
  }) => Array<user>
  user_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['user_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<user_order_by>>
    where?: Maybe<user_bool_exp>
  }) => user_aggregate
  user_by_pk: (args: { id: ScalarsEnums['uuid'] }) => Maybe<user>
  zcta5: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['zcta5_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<zcta5_order_by>>
    where?: Maybe<zcta5_bool_exp>
  }) => Array<zcta5>
  zcta5_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['zcta5_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<zcta5_order_by>>
    where?: Maybe<zcta5_bool_exp>
  }) => zcta5_aggregate
  zcta5_by_pk: (args: { ogc_fid: ScalarsEnums['Int'] }) => Maybe<zcta5>
}

export interface hrr {
  __typename: 'hrr'
  hrr_bdry_i?: Maybe<ScalarsEnums['float8']>
  hrrcity?: Maybe<ScalarsEnums['String']>
  hrrnum?: Maybe<ScalarsEnums['Int']>
  ogc_fid: ScalarsEnums['Int']
  slug?: Maybe<ScalarsEnums['String']>
  wkb_geometry?: Maybe<ScalarsEnums['geometry']>
}

export interface hrr_aggregate {
  __typename: 'hrr_aggregate'
  aggregate?: Maybe<hrr_aggregate_fields>
  nodes: Array<hrr>
}

export interface hrr_aggregate_fields {
  __typename: 'hrr_aggregate_fields'
  avg?: Maybe<hrr_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<ScalarsEnums['hrr_select_column']>>
    distinct?: Maybe<ScalarsEnums['Boolean']>
  }) => Maybe<ScalarsEnums['Int']>
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

export interface hrr_avg_fields {
  __typename: 'hrr_avg_fields'
  hrr_bdry_i?: Maybe<ScalarsEnums['Float']>
  hrrnum?: Maybe<ScalarsEnums['Float']>
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface hrr_max_fields {
  __typename: 'hrr_max_fields'
  hrr_bdry_i?: Maybe<ScalarsEnums['float8']>
  hrrcity?: Maybe<ScalarsEnums['String']>
  hrrnum?: Maybe<ScalarsEnums['Int']>
  ogc_fid?: Maybe<ScalarsEnums['Int']>
  slug?: Maybe<ScalarsEnums['String']>
}

export interface hrr_min_fields {
  __typename: 'hrr_min_fields'
  hrr_bdry_i?: Maybe<ScalarsEnums['float8']>
  hrrcity?: Maybe<ScalarsEnums['String']>
  hrrnum?: Maybe<ScalarsEnums['Int']>
  ogc_fid?: Maybe<ScalarsEnums['Int']>
  slug?: Maybe<ScalarsEnums['String']>
}

export interface hrr_mutation_response {
  __typename: 'hrr_mutation_response'
  affected_rows: ScalarsEnums['Int']
  returning: Array<hrr>
}

export interface hrr_stddev_fields {
  __typename: 'hrr_stddev_fields'
  hrr_bdry_i?: Maybe<ScalarsEnums['Float']>
  hrrnum?: Maybe<ScalarsEnums['Float']>
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface hrr_stddev_pop_fields {
  __typename: 'hrr_stddev_pop_fields'
  hrr_bdry_i?: Maybe<ScalarsEnums['Float']>
  hrrnum?: Maybe<ScalarsEnums['Float']>
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface hrr_stddev_samp_fields {
  __typename: 'hrr_stddev_samp_fields'
  hrr_bdry_i?: Maybe<ScalarsEnums['Float']>
  hrrnum?: Maybe<ScalarsEnums['Float']>
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface hrr_sum_fields {
  __typename: 'hrr_sum_fields'
  hrr_bdry_i?: Maybe<ScalarsEnums['float8']>
  hrrnum?: Maybe<ScalarsEnums['Int']>
  ogc_fid?: Maybe<ScalarsEnums['Int']>
}

export interface hrr_var_pop_fields {
  __typename: 'hrr_var_pop_fields'
  hrr_bdry_i?: Maybe<ScalarsEnums['Float']>
  hrrnum?: Maybe<ScalarsEnums['Float']>
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface hrr_var_samp_fields {
  __typename: 'hrr_var_samp_fields'
  hrr_bdry_i?: Maybe<ScalarsEnums['Float']>
  hrrnum?: Maybe<ScalarsEnums['Float']>
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface hrr_variance_fields {
  __typename: 'hrr_variance_fields'
  hrr_bdry_i?: Maybe<ScalarsEnums['Float']>
  hrrnum?: Maybe<ScalarsEnums['Float']>
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface menu_item {
  __typename: 'menu_item'
  created_at: ScalarsEnums['timestamptz']
  description?: Maybe<ScalarsEnums['String']>
  id: ScalarsEnums['uuid']
  image?: Maybe<ScalarsEnums['String']>
  location?: Maybe<ScalarsEnums['geometry']>
  name: ScalarsEnums['String']
  price?: Maybe<ScalarsEnums['Int']>
  restaurant: restaurant
  restaurant_id: ScalarsEnums['uuid']
  updated_at: ScalarsEnums['timestamptz']
}

export interface menu_item_aggregate {
  __typename: 'menu_item_aggregate'
  aggregate?: Maybe<menu_item_aggregate_fields>
  nodes: Array<menu_item>
}

export interface menu_item_aggregate_fields {
  __typename: 'menu_item_aggregate_fields'
  avg?: Maybe<menu_item_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<ScalarsEnums['menu_item_select_column']>>
    distinct?: Maybe<ScalarsEnums['Boolean']>
  }) => Maybe<ScalarsEnums['Int']>
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

export interface menu_item_avg_fields {
  __typename: 'menu_item_avg_fields'
  price?: Maybe<ScalarsEnums['Float']>
}

export interface menu_item_max_fields {
  __typename: 'menu_item_max_fields'
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  description?: Maybe<ScalarsEnums['String']>
  id?: Maybe<ScalarsEnums['uuid']>
  image?: Maybe<ScalarsEnums['String']>
  name?: Maybe<ScalarsEnums['String']>
  price?: Maybe<ScalarsEnums['Int']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
}

export interface menu_item_min_fields {
  __typename: 'menu_item_min_fields'
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  description?: Maybe<ScalarsEnums['String']>
  id?: Maybe<ScalarsEnums['uuid']>
  image?: Maybe<ScalarsEnums['String']>
  name?: Maybe<ScalarsEnums['String']>
  price?: Maybe<ScalarsEnums['Int']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
}

export interface menu_item_mutation_response {
  __typename: 'menu_item_mutation_response'
  affected_rows: ScalarsEnums['Int']
  returning: Array<menu_item>
}

export interface menu_item_stddev_fields {
  __typename: 'menu_item_stddev_fields'
  price?: Maybe<ScalarsEnums['Float']>
}

export interface menu_item_stddev_pop_fields {
  __typename: 'menu_item_stddev_pop_fields'
  price?: Maybe<ScalarsEnums['Float']>
}

export interface menu_item_stddev_samp_fields {
  __typename: 'menu_item_stddev_samp_fields'
  price?: Maybe<ScalarsEnums['Float']>
}

export interface menu_item_sum_fields {
  __typename: 'menu_item_sum_fields'
  price?: Maybe<ScalarsEnums['Int']>
}

export interface menu_item_var_pop_fields {
  __typename: 'menu_item_var_pop_fields'
  price?: Maybe<ScalarsEnums['Float']>
}

export interface menu_item_var_samp_fields {
  __typename: 'menu_item_var_samp_fields'
  price?: Maybe<ScalarsEnums['Float']>
}

export interface menu_item_variance_fields {
  __typename: 'menu_item_variance_fields'
  price?: Maybe<ScalarsEnums['Float']>
}

export interface nhood_labels {
  __typename: 'nhood_labels'
  center: ScalarsEnums['geometry']
  name: ScalarsEnums['String']
  ogc_fid: ScalarsEnums['Int']
}

export interface nhood_labels_aggregate {
  __typename: 'nhood_labels_aggregate'
  aggregate?: Maybe<nhood_labels_aggregate_fields>
  nodes: Array<nhood_labels>
}

export interface nhood_labels_aggregate_fields {
  __typename: 'nhood_labels_aggregate_fields'
  avg?: Maybe<nhood_labels_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<ScalarsEnums['nhood_labels_select_column']>>
    distinct?: Maybe<ScalarsEnums['Boolean']>
  }) => Maybe<ScalarsEnums['Int']>
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

export interface nhood_labels_avg_fields {
  __typename: 'nhood_labels_avg_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface nhood_labels_max_fields {
  __typename: 'nhood_labels_max_fields'
  name?: Maybe<ScalarsEnums['String']>
  ogc_fid?: Maybe<ScalarsEnums['Int']>
}

export interface nhood_labels_min_fields {
  __typename: 'nhood_labels_min_fields'
  name?: Maybe<ScalarsEnums['String']>
  ogc_fid?: Maybe<ScalarsEnums['Int']>
}

export interface nhood_labels_mutation_response {
  __typename: 'nhood_labels_mutation_response'
  affected_rows: ScalarsEnums['Int']
  returning: Array<nhood_labels>
}

export interface nhood_labels_stddev_fields {
  __typename: 'nhood_labels_stddev_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface nhood_labels_stddev_pop_fields {
  __typename: 'nhood_labels_stddev_pop_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface nhood_labels_stddev_samp_fields {
  __typename: 'nhood_labels_stddev_samp_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface nhood_labels_sum_fields {
  __typename: 'nhood_labels_sum_fields'
  ogc_fid?: Maybe<ScalarsEnums['Int']>
}

export interface nhood_labels_var_pop_fields {
  __typename: 'nhood_labels_var_pop_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface nhood_labels_var_samp_fields {
  __typename: 'nhood_labels_var_samp_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface nhood_labels_variance_fields {
  __typename: 'nhood_labels_variance_fields'
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface opening_hours {
  __typename: 'opening_hours'
  hours: ScalarsEnums['tsrange']
  id: ScalarsEnums['uuid']
  restaurant: restaurant
  restaurant_id: ScalarsEnums['uuid']
}

export interface opening_hours_aggregate {
  __typename: 'opening_hours_aggregate'
  aggregate?: Maybe<opening_hours_aggregate_fields>
  nodes: Array<opening_hours>
}

export interface opening_hours_aggregate_fields {
  __typename: 'opening_hours_aggregate_fields'
  count: (args?: {
    columns?: Maybe<Array<ScalarsEnums['opening_hours_select_column']>>
    distinct?: Maybe<ScalarsEnums['Boolean']>
  }) => Maybe<ScalarsEnums['Int']>
  max?: Maybe<opening_hours_max_fields>
  min?: Maybe<opening_hours_min_fields>
}

export interface opening_hours_max_fields {
  __typename: 'opening_hours_max_fields'
  id?: Maybe<ScalarsEnums['uuid']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
}

export interface opening_hours_min_fields {
  __typename: 'opening_hours_min_fields'
  id?: Maybe<ScalarsEnums['uuid']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
}

export interface opening_hours_mutation_response {
  __typename: 'opening_hours_mutation_response'
  affected_rows: ScalarsEnums['Int']
  returning: Array<opening_hours>
}

export interface photo {
  __typename: 'photo'
  created_at: ScalarsEnums['timestamptz']
  id: ScalarsEnums['uuid']
  origin?: Maybe<ScalarsEnums['String']>
  quality?: Maybe<ScalarsEnums['numeric']>
  updated_at: ScalarsEnums['timestamptz']
  url?: Maybe<ScalarsEnums['String']>
}

export interface photo_aggregate {
  __typename: 'photo_aggregate'
  aggregate?: Maybe<photo_aggregate_fields>
  nodes: Array<photo>
}

export interface photo_aggregate_fields {
  __typename: 'photo_aggregate_fields'
  avg?: Maybe<photo_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<ScalarsEnums['photo_select_column']>>
    distinct?: Maybe<ScalarsEnums['Boolean']>
  }) => Maybe<ScalarsEnums['Int']>
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

export interface photo_avg_fields {
  __typename: 'photo_avg_fields'
  quality?: Maybe<ScalarsEnums['Float']>
}

export interface photo_max_fields {
  __typename: 'photo_max_fields'
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  id?: Maybe<ScalarsEnums['uuid']>
  origin?: Maybe<ScalarsEnums['String']>
  quality?: Maybe<ScalarsEnums['numeric']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
  url?: Maybe<ScalarsEnums['String']>
}

export interface photo_min_fields {
  __typename: 'photo_min_fields'
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  id?: Maybe<ScalarsEnums['uuid']>
  origin?: Maybe<ScalarsEnums['String']>
  quality?: Maybe<ScalarsEnums['numeric']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
  url?: Maybe<ScalarsEnums['String']>
}

export interface photo_mutation_response {
  __typename: 'photo_mutation_response'
  affected_rows: ScalarsEnums['Int']
  returning: Array<photo>
}

export interface photo_stddev_fields {
  __typename: 'photo_stddev_fields'
  quality?: Maybe<ScalarsEnums['Float']>
}

export interface photo_stddev_pop_fields {
  __typename: 'photo_stddev_pop_fields'
  quality?: Maybe<ScalarsEnums['Float']>
}

export interface photo_stddev_samp_fields {
  __typename: 'photo_stddev_samp_fields'
  quality?: Maybe<ScalarsEnums['Float']>
}

export interface photo_sum_fields {
  __typename: 'photo_sum_fields'
  quality?: Maybe<ScalarsEnums['numeric']>
}

export interface photo_var_pop_fields {
  __typename: 'photo_var_pop_fields'
  quality?: Maybe<ScalarsEnums['Float']>
}

export interface photo_var_samp_fields {
  __typename: 'photo_var_samp_fields'
  quality?: Maybe<ScalarsEnums['Float']>
}

export interface photo_variance_fields {
  __typename: 'photo_variance_fields'
  quality?: Maybe<ScalarsEnums['Float']>
}

export interface photo_xref {
  __typename: 'photo_xref'
  id: ScalarsEnums['uuid']
  photo: photo
  photo_id: ScalarsEnums['uuid']
  restaurant_id: ScalarsEnums['uuid']
  tag_id: ScalarsEnums['uuid']
  type?: Maybe<ScalarsEnums['String']>
}

export interface photo_xref_aggregate {
  __typename: 'photo_xref_aggregate'
  aggregate?: Maybe<photo_xref_aggregate_fields>
  nodes: Array<photo_xref>
}

export interface photo_xref_aggregate_fields {
  __typename: 'photo_xref_aggregate_fields'
  count: (args?: {
    columns?: Maybe<Array<ScalarsEnums['photo_xref_select_column']>>
    distinct?: Maybe<ScalarsEnums['Boolean']>
  }) => Maybe<ScalarsEnums['Int']>
  max?: Maybe<photo_xref_max_fields>
  min?: Maybe<photo_xref_min_fields>
}

export interface photo_xref_max_fields {
  __typename: 'photo_xref_max_fields'
  id?: Maybe<ScalarsEnums['uuid']>
  photo_id?: Maybe<ScalarsEnums['uuid']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  tag_id?: Maybe<ScalarsEnums['uuid']>
  type?: Maybe<ScalarsEnums['String']>
}

export interface photo_xref_min_fields {
  __typename: 'photo_xref_min_fields'
  id?: Maybe<ScalarsEnums['uuid']>
  photo_id?: Maybe<ScalarsEnums['uuid']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  tag_id?: Maybe<ScalarsEnums['uuid']>
  type?: Maybe<ScalarsEnums['String']>
}

export interface photo_xref_mutation_response {
  __typename: 'photo_xref_mutation_response'
  affected_rows: ScalarsEnums['Int']
  returning: Array<photo_xref>
}

export interface restaurant {
  __typename: 'restaurant'
  address?: Maybe<ScalarsEnums['String']>
  city?: Maybe<ScalarsEnums['String']>
  created_at: ScalarsEnums['timestamptz']
  description?: Maybe<ScalarsEnums['String']>
  downvotes?: Maybe<ScalarsEnums['numeric']>
  geocoder_id?: Maybe<ScalarsEnums['String']>
  headlines: (args?: {
    path?: Maybe<ScalarsEnums['String']>
  }) => Maybe<ScalarsEnums['jsonb']>
  hours: (args?: {
    path?: Maybe<ScalarsEnums['String']>
  }) => Maybe<ScalarsEnums['jsonb']>
  id: ScalarsEnums['uuid']
  image?: Maybe<ScalarsEnums['String']>
  is_open_now?: Maybe<ScalarsEnums['Boolean']>
  location: ScalarsEnums['geometry']
  menu_items: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['menu_item_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<menu_item_order_by>>
    where?: Maybe<menu_item_bool_exp>
  }) => Array<menu_item>
  menu_items_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['menu_item_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<menu_item_order_by>>
    where?: Maybe<menu_item_bool_exp>
  }) => menu_item_aggregate
  name: ScalarsEnums['String']
  oldest_review_date?: Maybe<ScalarsEnums['timestamptz']>
  photos: (args?: {
    path?: Maybe<ScalarsEnums['String']>
  }) => Maybe<ScalarsEnums['jsonb']>
  price_range?: Maybe<ScalarsEnums['String']>
  rating?: Maybe<ScalarsEnums['numeric']>
  rating_factors: (args?: {
    path?: Maybe<ScalarsEnums['String']>
  }) => Maybe<ScalarsEnums['jsonb']>
  reviews: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['review_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<review_order_by>>
    where?: Maybe<review_bool_exp>
  }) => Array<review>
  reviews_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['review_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<review_order_by>>
    where?: Maybe<review_bool_exp>
  }) => review_aggregate
  score?: Maybe<ScalarsEnums['numeric']>
  score_breakdown: (args?: {
    path?: Maybe<ScalarsEnums['String']>
  }) => Maybe<ScalarsEnums['jsonb']>
  slug: ScalarsEnums['String']
  source_breakdown: (args?: {
    path?: Maybe<ScalarsEnums['String']>
  }) => Maybe<ScalarsEnums['jsonb']>
  sources: (args?: {
    path?: Maybe<ScalarsEnums['String']>
  }) => Maybe<ScalarsEnums['jsonb']>
  state?: Maybe<ScalarsEnums['String']>
  summary?: Maybe<ScalarsEnums['String']>
  tag_names: (args?: {
    path?: Maybe<ScalarsEnums['String']>
  }) => Maybe<ScalarsEnums['jsonb']>
  tags: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    where?: Maybe<restaurant_tag_bool_exp>
  }) => Array<restaurant_tag>
  tags_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    where?: Maybe<restaurant_tag_bool_exp>
  }) => restaurant_tag_aggregate
  telephone?: Maybe<ScalarsEnums['String']>
  top_tags: (args: {
    args: restaurant_top_tags_args
    distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    where?: Maybe<restaurant_tag_bool_exp>
  }) => Maybe<Array<restaurant_tag>>
  updated_at: ScalarsEnums['timestamptz']
  upvotes?: Maybe<ScalarsEnums['numeric']>
  votes_ratio?: Maybe<ScalarsEnums['numeric']>
  website?: Maybe<ScalarsEnums['String']>
  zip?: Maybe<ScalarsEnums['numeric']>
}

export interface restaurant_aggregate {
  __typename: 'restaurant_aggregate'
  aggregate?: Maybe<restaurant_aggregate_fields>
  nodes: Array<restaurant>
}

export interface restaurant_aggregate_fields {
  __typename: 'restaurant_aggregate_fields'
  avg?: Maybe<restaurant_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>
    distinct?: Maybe<ScalarsEnums['Boolean']>
  }) => Maybe<ScalarsEnums['Int']>
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

export interface restaurant_avg_fields {
  __typename: 'restaurant_avg_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
  zip?: Maybe<ScalarsEnums['Float']>
}

export interface restaurant_max_fields {
  __typename: 'restaurant_max_fields'
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

export interface restaurant_min_fields {
  __typename: 'restaurant_min_fields'
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

export interface restaurant_mutation_response {
  __typename: 'restaurant_mutation_response'
  affected_rows: ScalarsEnums['Int']
  returning: Array<restaurant>
}

export interface restaurant_stddev_fields {
  __typename: 'restaurant_stddev_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
  zip?: Maybe<ScalarsEnums['Float']>
}

export interface restaurant_stddev_pop_fields {
  __typename: 'restaurant_stddev_pop_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
  zip?: Maybe<ScalarsEnums['Float']>
}

export interface restaurant_stddev_samp_fields {
  __typename: 'restaurant_stddev_samp_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
  zip?: Maybe<ScalarsEnums['Float']>
}

export interface restaurant_sum_fields {
  __typename: 'restaurant_sum_fields'
  downvotes?: Maybe<ScalarsEnums['numeric']>
  rating?: Maybe<ScalarsEnums['numeric']>
  score?: Maybe<ScalarsEnums['numeric']>
  upvotes?: Maybe<ScalarsEnums['numeric']>
  votes_ratio?: Maybe<ScalarsEnums['numeric']>
  zip?: Maybe<ScalarsEnums['numeric']>
}

export interface restaurant_tag {
  __typename: 'restaurant_tag'
  downvotes?: Maybe<ScalarsEnums['numeric']>
  id: ScalarsEnums['uuid']
  photos: (args?: {
    path?: Maybe<ScalarsEnums['String']>
  }) => Maybe<ScalarsEnums['jsonb']>
  rank?: Maybe<ScalarsEnums['Int']>
  rating?: Maybe<ScalarsEnums['numeric']>
  restaurant: restaurant
  restaurant_id: ScalarsEnums['uuid']
  review_mentions_count?: Maybe<ScalarsEnums['numeric']>
  reviews: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['review_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<review_order_by>>
    where?: Maybe<review_bool_exp>
  }) => Array<review>
  reviews_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['review_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<review_order_by>>
    where?: Maybe<review_bool_exp>
  }) => review_aggregate
  score?: Maybe<ScalarsEnums['numeric']>
  score_breakdown: (args?: {
    path?: Maybe<ScalarsEnums['String']>
  }) => Maybe<ScalarsEnums['jsonb']>
  sentences: (args?: {
    distinct_on?: Maybe<
      Array<ScalarsEnums['review_tag_sentence_select_column']>
    >
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<review_tag_sentence_order_by>>
    where?: Maybe<review_tag_sentence_bool_exp>
  }) => Array<review_tag_sentence>
  sentences_aggregate: (args?: {
    distinct_on?: Maybe<
      Array<ScalarsEnums['review_tag_sentence_select_column']>
    >
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<review_tag_sentence_order_by>>
    where?: Maybe<review_tag_sentence_bool_exp>
  }) => review_tag_sentence_aggregate
  source_breakdown: (args?: {
    path?: Maybe<ScalarsEnums['String']>
  }) => Maybe<ScalarsEnums['jsonb']>
  tag: tag
  tag_id: ScalarsEnums['uuid']
  upvotes?: Maybe<ScalarsEnums['numeric']>
  votes_ratio?: Maybe<ScalarsEnums['numeric']>
}

export interface restaurant_tag_aggregate {
  __typename: 'restaurant_tag_aggregate'
  aggregate?: Maybe<restaurant_tag_aggregate_fields>
  nodes: Array<restaurant_tag>
}

export interface restaurant_tag_aggregate_fields {
  __typename: 'restaurant_tag_aggregate_fields'
  avg?: Maybe<restaurant_tag_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>
    distinct?: Maybe<ScalarsEnums['Boolean']>
  }) => Maybe<ScalarsEnums['Int']>
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

export interface restaurant_tag_avg_fields {
  __typename: 'restaurant_tag_avg_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rank?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  review_mentions_count?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
}

export interface restaurant_tag_max_fields {
  __typename: 'restaurant_tag_max_fields'
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

export interface restaurant_tag_min_fields {
  __typename: 'restaurant_tag_min_fields'
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

export interface restaurant_tag_mutation_response {
  __typename: 'restaurant_tag_mutation_response'
  affected_rows: ScalarsEnums['Int']
  returning: Array<restaurant_tag>
}

export interface restaurant_tag_stddev_fields {
  __typename: 'restaurant_tag_stddev_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rank?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  review_mentions_count?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
}

export interface restaurant_tag_stddev_pop_fields {
  __typename: 'restaurant_tag_stddev_pop_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rank?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  review_mentions_count?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
}

export interface restaurant_tag_stddev_samp_fields {
  __typename: 'restaurant_tag_stddev_samp_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rank?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  review_mentions_count?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
}

export interface restaurant_tag_sum_fields {
  __typename: 'restaurant_tag_sum_fields'
  downvotes?: Maybe<ScalarsEnums['numeric']>
  rank?: Maybe<ScalarsEnums['Int']>
  rating?: Maybe<ScalarsEnums['numeric']>
  review_mentions_count?: Maybe<ScalarsEnums['numeric']>
  score?: Maybe<ScalarsEnums['numeric']>
  upvotes?: Maybe<ScalarsEnums['numeric']>
  votes_ratio?: Maybe<ScalarsEnums['numeric']>
}

export interface restaurant_tag_var_pop_fields {
  __typename: 'restaurant_tag_var_pop_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rank?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  review_mentions_count?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
}

export interface restaurant_tag_var_samp_fields {
  __typename: 'restaurant_tag_var_samp_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rank?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  review_mentions_count?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
}

export interface restaurant_tag_variance_fields {
  __typename: 'restaurant_tag_variance_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rank?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  review_mentions_count?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
}

export interface restaurant_var_pop_fields {
  __typename: 'restaurant_var_pop_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
  zip?: Maybe<ScalarsEnums['Float']>
}

export interface restaurant_var_samp_fields {
  __typename: 'restaurant_var_samp_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
  zip?: Maybe<ScalarsEnums['Float']>
}

export interface restaurant_variance_fields {
  __typename: 'restaurant_variance_fields'
  downvotes?: Maybe<ScalarsEnums['Float']>
  rating?: Maybe<ScalarsEnums['Float']>
  score?: Maybe<ScalarsEnums['Float']>
  upvotes?: Maybe<ScalarsEnums['Float']>
  votes_ratio?: Maybe<ScalarsEnums['Float']>
  zip?: Maybe<ScalarsEnums['Float']>
}

export interface review {
  __typename: 'review'
  authored_at: ScalarsEnums['timestamptz']
  categories: (args?: {
    path?: Maybe<ScalarsEnums['String']>
  }) => Maybe<ScalarsEnums['jsonb']>
  favorited?: Maybe<ScalarsEnums['Boolean']>
  id: ScalarsEnums['uuid']
  location?: Maybe<ScalarsEnums['geometry']>
  native_data_unique_key?: Maybe<ScalarsEnums['String']>
  rating?: Maybe<ScalarsEnums['numeric']>
  restaurant: restaurant
  restaurant_id: ScalarsEnums['uuid']
  sentiments: (args?: {
    distinct_on?: Maybe<
      Array<ScalarsEnums['review_tag_sentence_select_column']>
    >
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<review_tag_sentence_order_by>>
    where?: Maybe<review_tag_sentence_bool_exp>
  }) => Array<review_tag_sentence>
  sentiments_aggregate: (args?: {
    distinct_on?: Maybe<
      Array<ScalarsEnums['review_tag_sentence_select_column']>
    >
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<review_tag_sentence_order_by>>
    where?: Maybe<review_tag_sentence_bool_exp>
  }) => review_tag_sentence_aggregate
  source?: Maybe<ScalarsEnums['String']>
  tag?: Maybe<tag>
  tag_id?: Maybe<ScalarsEnums['uuid']>
  text?: Maybe<ScalarsEnums['String']>
  type?: Maybe<ScalarsEnums['String']>
  updated_at: ScalarsEnums['timestamptz']
  user: user
  user_id: ScalarsEnums['uuid']
  username?: Maybe<ScalarsEnums['String']>
  vote?: Maybe<ScalarsEnums['numeric']>
}

export interface review_aggregate {
  __typename: 'review_aggregate'
  aggregate?: Maybe<review_aggregate_fields>
  nodes: Array<review>
}

export interface review_aggregate_fields {
  __typename: 'review_aggregate_fields'
  avg?: Maybe<review_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<ScalarsEnums['review_select_column']>>
    distinct?: Maybe<ScalarsEnums['Boolean']>
  }) => Maybe<ScalarsEnums['Int']>
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

export interface review_avg_fields {
  __typename: 'review_avg_fields'
  rating?: Maybe<ScalarsEnums['Float']>
  vote?: Maybe<ScalarsEnums['Float']>
}

export interface review_max_fields {
  __typename: 'review_max_fields'
  authored_at?: Maybe<ScalarsEnums['timestamptz']>
  id?: Maybe<ScalarsEnums['uuid']>
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

export interface review_min_fields {
  __typename: 'review_min_fields'
  authored_at?: Maybe<ScalarsEnums['timestamptz']>
  id?: Maybe<ScalarsEnums['uuid']>
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

export interface review_mutation_response {
  __typename: 'review_mutation_response'
  affected_rows: ScalarsEnums['Int']
  returning: Array<review>
}

export interface review_stddev_fields {
  __typename: 'review_stddev_fields'
  rating?: Maybe<ScalarsEnums['Float']>
  vote?: Maybe<ScalarsEnums['Float']>
}

export interface review_stddev_pop_fields {
  __typename: 'review_stddev_pop_fields'
  rating?: Maybe<ScalarsEnums['Float']>
  vote?: Maybe<ScalarsEnums['Float']>
}

export interface review_stddev_samp_fields {
  __typename: 'review_stddev_samp_fields'
  rating?: Maybe<ScalarsEnums['Float']>
  vote?: Maybe<ScalarsEnums['Float']>
}

export interface review_sum_fields {
  __typename: 'review_sum_fields'
  rating?: Maybe<ScalarsEnums['numeric']>
  vote?: Maybe<ScalarsEnums['numeric']>
}

export interface review_tag_sentence {
  __typename: 'review_tag_sentence'
  id: ScalarsEnums['uuid']
  ml_sentiment?: Maybe<ScalarsEnums['numeric']>
  naive_sentiment: ScalarsEnums['numeric']
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  review: review
  review_id: ScalarsEnums['uuid']
  sentence: ScalarsEnums['String']
  tag: tag
  tag_id: ScalarsEnums['uuid']
}

export interface review_tag_sentence_aggregate {
  __typename: 'review_tag_sentence_aggregate'
  aggregate?: Maybe<review_tag_sentence_aggregate_fields>
  nodes: Array<review_tag_sentence>
}

export interface review_tag_sentence_aggregate_fields {
  __typename: 'review_tag_sentence_aggregate_fields'
  avg?: Maybe<review_tag_sentence_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<ScalarsEnums['review_tag_sentence_select_column']>>
    distinct?: Maybe<ScalarsEnums['Boolean']>
  }) => Maybe<ScalarsEnums['Int']>
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

export interface review_tag_sentence_avg_fields {
  __typename: 'review_tag_sentence_avg_fields'
  ml_sentiment?: Maybe<ScalarsEnums['Float']>
  naive_sentiment?: Maybe<ScalarsEnums['Float']>
}

export interface review_tag_sentence_max_fields {
  __typename: 'review_tag_sentence_max_fields'
  id?: Maybe<ScalarsEnums['uuid']>
  ml_sentiment?: Maybe<ScalarsEnums['numeric']>
  naive_sentiment?: Maybe<ScalarsEnums['numeric']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  review_id?: Maybe<ScalarsEnums['uuid']>
  sentence?: Maybe<ScalarsEnums['String']>
  tag_id?: Maybe<ScalarsEnums['uuid']>
}

export interface review_tag_sentence_min_fields {
  __typename: 'review_tag_sentence_min_fields'
  id?: Maybe<ScalarsEnums['uuid']>
  ml_sentiment?: Maybe<ScalarsEnums['numeric']>
  naive_sentiment?: Maybe<ScalarsEnums['numeric']>
  restaurant_id?: Maybe<ScalarsEnums['uuid']>
  review_id?: Maybe<ScalarsEnums['uuid']>
  sentence?: Maybe<ScalarsEnums['String']>
  tag_id?: Maybe<ScalarsEnums['uuid']>
}

export interface review_tag_sentence_mutation_response {
  __typename: 'review_tag_sentence_mutation_response'
  affected_rows: ScalarsEnums['Int']
  returning: Array<review_tag_sentence>
}

export interface review_tag_sentence_stddev_fields {
  __typename: 'review_tag_sentence_stddev_fields'
  ml_sentiment?: Maybe<ScalarsEnums['Float']>
  naive_sentiment?: Maybe<ScalarsEnums['Float']>
}

export interface review_tag_sentence_stddev_pop_fields {
  __typename: 'review_tag_sentence_stddev_pop_fields'
  ml_sentiment?: Maybe<ScalarsEnums['Float']>
  naive_sentiment?: Maybe<ScalarsEnums['Float']>
}

export interface review_tag_sentence_stddev_samp_fields {
  __typename: 'review_tag_sentence_stddev_samp_fields'
  ml_sentiment?: Maybe<ScalarsEnums['Float']>
  naive_sentiment?: Maybe<ScalarsEnums['Float']>
}

export interface review_tag_sentence_sum_fields {
  __typename: 'review_tag_sentence_sum_fields'
  ml_sentiment?: Maybe<ScalarsEnums['numeric']>
  naive_sentiment?: Maybe<ScalarsEnums['numeric']>
}

export interface review_tag_sentence_var_pop_fields {
  __typename: 'review_tag_sentence_var_pop_fields'
  ml_sentiment?: Maybe<ScalarsEnums['Float']>
  naive_sentiment?: Maybe<ScalarsEnums['Float']>
}

export interface review_tag_sentence_var_samp_fields {
  __typename: 'review_tag_sentence_var_samp_fields'
  ml_sentiment?: Maybe<ScalarsEnums['Float']>
  naive_sentiment?: Maybe<ScalarsEnums['Float']>
}

export interface review_tag_sentence_variance_fields {
  __typename: 'review_tag_sentence_variance_fields'
  ml_sentiment?: Maybe<ScalarsEnums['Float']>
  naive_sentiment?: Maybe<ScalarsEnums['Float']>
}

export interface review_var_pop_fields {
  __typename: 'review_var_pop_fields'
  rating?: Maybe<ScalarsEnums['Float']>
  vote?: Maybe<ScalarsEnums['Float']>
}

export interface review_var_samp_fields {
  __typename: 'review_var_samp_fields'
  rating?: Maybe<ScalarsEnums['Float']>
  vote?: Maybe<ScalarsEnums['Float']>
}

export interface review_variance_fields {
  __typename: 'review_variance_fields'
  rating?: Maybe<ScalarsEnums['Float']>
  vote?: Maybe<ScalarsEnums['Float']>
}

export interface setting {
  __typename: 'setting'
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  id: ScalarsEnums['uuid']
  key: ScalarsEnums['String']
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
  value: (args?: {
    path?: Maybe<ScalarsEnums['String']>
  }) => ScalarsEnums['jsonb']
}

export interface setting_aggregate {
  __typename: 'setting_aggregate'
  aggregate?: Maybe<setting_aggregate_fields>
  nodes: Array<setting>
}

export interface setting_aggregate_fields {
  __typename: 'setting_aggregate_fields'
  count: (args?: {
    columns?: Maybe<Array<ScalarsEnums['setting_select_column']>>
    distinct?: Maybe<ScalarsEnums['Boolean']>
  }) => Maybe<ScalarsEnums['Int']>
  max?: Maybe<setting_max_fields>
  min?: Maybe<setting_min_fields>
}

export interface setting_max_fields {
  __typename: 'setting_max_fields'
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  id?: Maybe<ScalarsEnums['uuid']>
  key?: Maybe<ScalarsEnums['String']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
}

export interface setting_min_fields {
  __typename: 'setting_min_fields'
  created_at?: Maybe<ScalarsEnums['timestamptz']>
  id?: Maybe<ScalarsEnums['uuid']>
  key?: Maybe<ScalarsEnums['String']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
}

export interface setting_mutation_response {
  __typename: 'setting_mutation_response'
  affected_rows: ScalarsEnums['Int']
  returning: Array<setting>
}

export interface tag {
  __typename: 'tag'
  alternates: (args?: {
    path?: Maybe<ScalarsEnums['String']>
  }) => Maybe<ScalarsEnums['jsonb']>
  categories: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['tag_tag_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<tag_tag_order_by>>
    where?: Maybe<tag_tag_bool_exp>
  }) => Array<tag_tag>
  categories_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['tag_tag_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<tag_tag_order_by>>
    where?: Maybe<tag_tag_bool_exp>
  }) => tag_tag_aggregate
  created_at: ScalarsEnums['timestamptz']
  default_images: (args?: {
    path?: Maybe<ScalarsEnums['String']>
  }) => Maybe<ScalarsEnums['jsonb']>
  description?: Maybe<ScalarsEnums['String']>
  displayName?: Maybe<ScalarsEnums['String']>
  frequency?: Maybe<ScalarsEnums['Int']>
  icon?: Maybe<ScalarsEnums['String']>
  id: ScalarsEnums['uuid']
  is_ambiguous: ScalarsEnums['Boolean']
  misc: (args?: {
    path?: Maybe<ScalarsEnums['String']>
  }) => Maybe<ScalarsEnums['jsonb']>
  name: ScalarsEnums['String']
  order: ScalarsEnums['Int']
  parent?: Maybe<tag>
  parentId?: Maybe<ScalarsEnums['uuid']>
  popularity?: Maybe<ScalarsEnums['Int']>
  restaurant_taxonomies: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    where?: Maybe<restaurant_tag_bool_exp>
  }) => Array<restaurant_tag>
  restaurant_taxonomies_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<restaurant_tag_order_by>>
    where?: Maybe<restaurant_tag_bool_exp>
  }) => restaurant_tag_aggregate
  rgb: (args?: {
    path?: Maybe<ScalarsEnums['String']>
  }) => Maybe<ScalarsEnums['jsonb']>
  slug?: Maybe<ScalarsEnums['String']>
  type?: Maybe<ScalarsEnums['String']>
  updated_at: ScalarsEnums['timestamptz']
}

export interface tag_aggregate {
  __typename: 'tag_aggregate'
  aggregate?: Maybe<tag_aggregate_fields>
  nodes: Array<tag>
}

export interface tag_aggregate_fields {
  __typename: 'tag_aggregate_fields'
  avg?: Maybe<tag_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<ScalarsEnums['tag_select_column']>>
    distinct?: Maybe<ScalarsEnums['Boolean']>
  }) => Maybe<ScalarsEnums['Int']>
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

export interface tag_avg_fields {
  __typename: 'tag_avg_fields'
  frequency?: Maybe<ScalarsEnums['Float']>
  order?: Maybe<ScalarsEnums['Float']>
  popularity?: Maybe<ScalarsEnums['Float']>
}

export interface tag_max_fields {
  __typename: 'tag_max_fields'
  created_at?: Maybe<ScalarsEnums['timestamptz']>
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

export interface tag_min_fields {
  __typename: 'tag_min_fields'
  created_at?: Maybe<ScalarsEnums['timestamptz']>
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

export interface tag_mutation_response {
  __typename: 'tag_mutation_response'
  affected_rows: ScalarsEnums['Int']
  returning: Array<tag>
}

export interface tag_stddev_fields {
  __typename: 'tag_stddev_fields'
  frequency?: Maybe<ScalarsEnums['Float']>
  order?: Maybe<ScalarsEnums['Float']>
  popularity?: Maybe<ScalarsEnums['Float']>
}

export interface tag_stddev_pop_fields {
  __typename: 'tag_stddev_pop_fields'
  frequency?: Maybe<ScalarsEnums['Float']>
  order?: Maybe<ScalarsEnums['Float']>
  popularity?: Maybe<ScalarsEnums['Float']>
}

export interface tag_stddev_samp_fields {
  __typename: 'tag_stddev_samp_fields'
  frequency?: Maybe<ScalarsEnums['Float']>
  order?: Maybe<ScalarsEnums['Float']>
  popularity?: Maybe<ScalarsEnums['Float']>
}

export interface tag_sum_fields {
  __typename: 'tag_sum_fields'
  frequency?: Maybe<ScalarsEnums['Int']>
  order?: Maybe<ScalarsEnums['Int']>
  popularity?: Maybe<ScalarsEnums['Int']>
}

export interface tag_tag {
  __typename: 'tag_tag'
  category: tag
  category_tag_id: ScalarsEnums['uuid']
  main: tag
  tag_id: ScalarsEnums['uuid']
}

export interface tag_tag_aggregate {
  __typename: 'tag_tag_aggregate'
  aggregate?: Maybe<tag_tag_aggregate_fields>
  nodes: Array<tag_tag>
}

export interface tag_tag_aggregate_fields {
  __typename: 'tag_tag_aggregate_fields'
  count: (args?: {
    columns?: Maybe<Array<ScalarsEnums['tag_tag_select_column']>>
    distinct?: Maybe<ScalarsEnums['Boolean']>
  }) => Maybe<ScalarsEnums['Int']>
  max?: Maybe<tag_tag_max_fields>
  min?: Maybe<tag_tag_min_fields>
}

export interface tag_tag_max_fields {
  __typename: 'tag_tag_max_fields'
  category_tag_id?: Maybe<ScalarsEnums['uuid']>
  tag_id?: Maybe<ScalarsEnums['uuid']>
}

export interface tag_tag_min_fields {
  __typename: 'tag_tag_min_fields'
  category_tag_id?: Maybe<ScalarsEnums['uuid']>
  tag_id?: Maybe<ScalarsEnums['uuid']>
}

export interface tag_tag_mutation_response {
  __typename: 'tag_tag_mutation_response'
  affected_rows: ScalarsEnums['Int']
  returning: Array<tag_tag>
}

export interface tag_var_pop_fields {
  __typename: 'tag_var_pop_fields'
  frequency?: Maybe<ScalarsEnums['Float']>
  order?: Maybe<ScalarsEnums['Float']>
  popularity?: Maybe<ScalarsEnums['Float']>
}

export interface tag_var_samp_fields {
  __typename: 'tag_var_samp_fields'
  frequency?: Maybe<ScalarsEnums['Float']>
  order?: Maybe<ScalarsEnums['Float']>
  popularity?: Maybe<ScalarsEnums['Float']>
}

export interface tag_variance_fields {
  __typename: 'tag_variance_fields'
  frequency?: Maybe<ScalarsEnums['Float']>
  order?: Maybe<ScalarsEnums['Float']>
  popularity?: Maybe<ScalarsEnums['Float']>
}

export interface user {
  __typename: 'user'
  about?: Maybe<ScalarsEnums['String']>
  apple_email?: Maybe<ScalarsEnums['String']>
  apple_refresh_token?: Maybe<ScalarsEnums['String']>
  apple_token?: Maybe<ScalarsEnums['String']>
  apple_uid?: Maybe<ScalarsEnums['String']>
  avatar?: Maybe<ScalarsEnums['String']>
  charIndex: ScalarsEnums['Int']
  created_at: ScalarsEnums['timestamptz']
  email?: Maybe<ScalarsEnums['String']>
  has_onboarded: ScalarsEnums['Boolean']
  id: ScalarsEnums['uuid']
  location?: Maybe<ScalarsEnums['String']>
  password: ScalarsEnums['String']
  password_reset_date?: Maybe<ScalarsEnums['timestamptz']>
  password_reset_token?: Maybe<ScalarsEnums['String']>
  reviews: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['review_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<review_order_by>>
    where?: Maybe<review_bool_exp>
  }) => Array<review>
  reviews_aggregate: (args?: {
    distinct_on?: Maybe<Array<ScalarsEnums['review_select_column']>>
    limit?: Maybe<ScalarsEnums['Int']>
    offset?: Maybe<ScalarsEnums['Int']>
    order_by?: Maybe<Array<review_order_by>>
    where?: Maybe<review_bool_exp>
  }) => review_aggregate
  role?: Maybe<ScalarsEnums['String']>
  updated_at: ScalarsEnums['timestamptz']
  username: ScalarsEnums['String']
}

export interface user_aggregate {
  __typename: 'user_aggregate'
  aggregate?: Maybe<user_aggregate_fields>
  nodes: Array<user>
}

export interface user_aggregate_fields {
  __typename: 'user_aggregate_fields'
  avg?: Maybe<user_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<ScalarsEnums['user_select_column']>>
    distinct?: Maybe<ScalarsEnums['Boolean']>
  }) => Maybe<ScalarsEnums['Int']>
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

export interface user_avg_fields {
  __typename: 'user_avg_fields'
  charIndex?: Maybe<ScalarsEnums['Float']>
}

export interface user_max_fields {
  __typename: 'user_max_fields'
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
  password?: Maybe<ScalarsEnums['String']>
  password_reset_date?: Maybe<ScalarsEnums['timestamptz']>
  password_reset_token?: Maybe<ScalarsEnums['String']>
  role?: Maybe<ScalarsEnums['String']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
  username?: Maybe<ScalarsEnums['String']>
}

export interface user_min_fields {
  __typename: 'user_min_fields'
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
  password?: Maybe<ScalarsEnums['String']>
  password_reset_date?: Maybe<ScalarsEnums['timestamptz']>
  password_reset_token?: Maybe<ScalarsEnums['String']>
  role?: Maybe<ScalarsEnums['String']>
  updated_at?: Maybe<ScalarsEnums['timestamptz']>
  username?: Maybe<ScalarsEnums['String']>
}

export interface user_mutation_response {
  __typename: 'user_mutation_response'
  affected_rows: ScalarsEnums['Int']
  returning: Array<user>
}

export interface user_stddev_fields {
  __typename: 'user_stddev_fields'
  charIndex?: Maybe<ScalarsEnums['Float']>
}

export interface user_stddev_pop_fields {
  __typename: 'user_stddev_pop_fields'
  charIndex?: Maybe<ScalarsEnums['Float']>
}

export interface user_stddev_samp_fields {
  __typename: 'user_stddev_samp_fields'
  charIndex?: Maybe<ScalarsEnums['Float']>
}

export interface user_sum_fields {
  __typename: 'user_sum_fields'
  charIndex?: Maybe<ScalarsEnums['Int']>
}

export interface user_var_pop_fields {
  __typename: 'user_var_pop_fields'
  charIndex?: Maybe<ScalarsEnums['Float']>
}

export interface user_var_samp_fields {
  __typename: 'user_var_samp_fields'
  charIndex?: Maybe<ScalarsEnums['Float']>
}

export interface user_variance_fields {
  __typename: 'user_variance_fields'
  charIndex?: Maybe<ScalarsEnums['Float']>
}

export interface zcta5 {
  __typename: 'zcta5'
  aland10?: Maybe<ScalarsEnums['float8']>
  awater10?: Maybe<ScalarsEnums['float8']>
  classfp10?: Maybe<ScalarsEnums['String']>
  funcstat10?: Maybe<ScalarsEnums['String']>
  geoid10?: Maybe<ScalarsEnums['String']>
  intptlat10?: Maybe<ScalarsEnums['String']>
  intptlon10?: Maybe<ScalarsEnums['String']>
  mtfcc10?: Maybe<ScalarsEnums['String']>
  nhood?: Maybe<ScalarsEnums['String']>
  ogc_fid: ScalarsEnums['Int']
  slug?: Maybe<ScalarsEnums['String']>
  wkb_geometry?: Maybe<ScalarsEnums['geometry']>
  zcta5ce10?: Maybe<ScalarsEnums['String']>
}

export interface zcta5_aggregate {
  __typename: 'zcta5_aggregate'
  aggregate?: Maybe<zcta5_aggregate_fields>
  nodes: Array<zcta5>
}

export interface zcta5_aggregate_fields {
  __typename: 'zcta5_aggregate_fields'
  avg?: Maybe<zcta5_avg_fields>
  count: (args?: {
    columns?: Maybe<Array<ScalarsEnums['zcta5_select_column']>>
    distinct?: Maybe<ScalarsEnums['Boolean']>
  }) => Maybe<ScalarsEnums['Int']>
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

export interface zcta5_avg_fields {
  __typename: 'zcta5_avg_fields'
  aland10?: Maybe<ScalarsEnums['Float']>
  awater10?: Maybe<ScalarsEnums['Float']>
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface zcta5_max_fields {
  __typename: 'zcta5_max_fields'
  aland10?: Maybe<ScalarsEnums['float8']>
  awater10?: Maybe<ScalarsEnums['float8']>
  classfp10?: Maybe<ScalarsEnums['String']>
  funcstat10?: Maybe<ScalarsEnums['String']>
  geoid10?: Maybe<ScalarsEnums['String']>
  intptlat10?: Maybe<ScalarsEnums['String']>
  intptlon10?: Maybe<ScalarsEnums['String']>
  mtfcc10?: Maybe<ScalarsEnums['String']>
  nhood?: Maybe<ScalarsEnums['String']>
  ogc_fid?: Maybe<ScalarsEnums['Int']>
  slug?: Maybe<ScalarsEnums['String']>
  zcta5ce10?: Maybe<ScalarsEnums['String']>
}

export interface zcta5_min_fields {
  __typename: 'zcta5_min_fields'
  aland10?: Maybe<ScalarsEnums['float8']>
  awater10?: Maybe<ScalarsEnums['float8']>
  classfp10?: Maybe<ScalarsEnums['String']>
  funcstat10?: Maybe<ScalarsEnums['String']>
  geoid10?: Maybe<ScalarsEnums['String']>
  intptlat10?: Maybe<ScalarsEnums['String']>
  intptlon10?: Maybe<ScalarsEnums['String']>
  mtfcc10?: Maybe<ScalarsEnums['String']>
  nhood?: Maybe<ScalarsEnums['String']>
  ogc_fid?: Maybe<ScalarsEnums['Int']>
  slug?: Maybe<ScalarsEnums['String']>
  zcta5ce10?: Maybe<ScalarsEnums['String']>
}

export interface zcta5_mutation_response {
  __typename: 'zcta5_mutation_response'
  affected_rows: ScalarsEnums['Int']
  returning: Array<zcta5>
}

export interface zcta5_stddev_fields {
  __typename: 'zcta5_stddev_fields'
  aland10?: Maybe<ScalarsEnums['Float']>
  awater10?: Maybe<ScalarsEnums['Float']>
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface zcta5_stddev_pop_fields {
  __typename: 'zcta5_stddev_pop_fields'
  aland10?: Maybe<ScalarsEnums['Float']>
  awater10?: Maybe<ScalarsEnums['Float']>
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface zcta5_stddev_samp_fields {
  __typename: 'zcta5_stddev_samp_fields'
  aland10?: Maybe<ScalarsEnums['Float']>
  awater10?: Maybe<ScalarsEnums['Float']>
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface zcta5_sum_fields {
  __typename: 'zcta5_sum_fields'
  aland10?: Maybe<ScalarsEnums['float8']>
  awater10?: Maybe<ScalarsEnums['float8']>
  ogc_fid?: Maybe<ScalarsEnums['Int']>
}

export interface zcta5_var_pop_fields {
  __typename: 'zcta5_var_pop_fields'
  aland10?: Maybe<ScalarsEnums['Float']>
  awater10?: Maybe<ScalarsEnums['Float']>
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface zcta5_var_samp_fields {
  __typename: 'zcta5_var_samp_fields'
  aland10?: Maybe<ScalarsEnums['Float']>
  awater10?: Maybe<ScalarsEnums['Float']>
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface zcta5_variance_fields {
  __typename: 'zcta5_variance_fields'
  aland10?: Maybe<ScalarsEnums['Float']>
  awater10?: Maybe<ScalarsEnums['Float']>
  ogc_fid?: Maybe<ScalarsEnums['Float']>
}

export interface GeneratedSchema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}

export interface ScalarsEnums extends Scalars {
  hrr_constraint: hrr_constraint
  hrr_select_column: hrr_select_column
  hrr_update_column: hrr_update_column
  menu_item_constraint: menu_item_constraint
  menu_item_select_column: menu_item_select_column
  menu_item_update_column: menu_item_update_column
  nhood_labels_constraint: nhood_labels_constraint
  nhood_labels_select_column: nhood_labels_select_column
  nhood_labels_update_column: nhood_labels_update_column
  opening_hours_constraint: opening_hours_constraint
  opening_hours_select_column: opening_hours_select_column
  opening_hours_update_column: opening_hours_update_column
  order_by: order_by
  photo_constraint: photo_constraint
  photo_select_column: photo_select_column
  photo_update_column: photo_update_column
  photo_xref_constraint: photo_xref_constraint
  photo_xref_select_column: photo_xref_select_column
  photo_xref_update_column: photo_xref_update_column
  restaurant_constraint: restaurant_constraint
  restaurant_select_column: restaurant_select_column
  restaurant_tag_constraint: restaurant_tag_constraint
  restaurant_tag_select_column: restaurant_tag_select_column
  restaurant_tag_update_column: restaurant_tag_update_column
  restaurant_update_column: restaurant_update_column
  review_constraint: review_constraint
  review_select_column: review_select_column
  review_tag_sentence_constraint: review_tag_sentence_constraint
  review_tag_sentence_select_column: review_tag_sentence_select_column
  review_tag_sentence_update_column: review_tag_sentence_update_column
  review_update_column: review_update_column
  setting_constraint: setting_constraint
  setting_select_column: setting_select_column
  setting_update_column: setting_update_column
  tag_constraint: tag_constraint
  tag_select_column: tag_select_column
  tag_tag_constraint: tag_tag_constraint
  tag_tag_select_column: tag_tag_select_column
  tag_tag_update_column: tag_tag_update_column
  tag_update_column: tag_update_column
  user_constraint: user_constraint
  user_select_column: user_select_column
  user_update_column: user_update_column
  zcta5_constraint: zcta5_constraint
  zcta5_select_column: zcta5_select_column
  zcta5_update_column: zcta5_update_column
}
