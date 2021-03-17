/// <reference lib="dom" />
/// <reference lib="esnext" />
declare module "@dish/graph" {
    export const isNode: boolean;
    export const isProd: boolean;
    export const isStaging: boolean;
    export const isDev: boolean;
    export const isNative: boolean;
    export const JWT_SECRET: string;
    export const HASURA_SECRET: string;
    export const DISH_API_ENDPOINT: string;
    export const SEARCH_DOMAIN: string;
    export const SEARCH_DOMAIN_INTERNAL: string;
    export const ZeroUUID = "00000000-0000-0000-0000-000000000000";
    export const OneUUID = "00000000-0000-0000-0000-000000000001";
    export const globalTagId = "00000000-0000-0000-0000-000000000000";
    export const externalUserUUID = "00000000-0000-0000-0000-000000000001";
    export const RESTAURANT_WEIGHTS: {
        yelp: number;
        tripadvisor: number;
        michelin: number;
        infatuated: number;
        ubereats: number;
        doordash: number;
        grubhub: number;
        google: number;
    };
    export const MARTIN_TILES_HOST: string;
    export const GRAPH_DOMAIN: string;
    export const GRAPH_API_INTERNAL: string;
    export const GRAPH_API: string;
}

declare module "@dish/graph" {
    export const LOGIN_KEY = "auth";
    export const HAS_LOGGED_IN_BEFORE = "HAS_LOGGED_IN_BEFORE";
    export function getAuth(): null | {
        user: Object;
        token: string;
        admin?: boolean;
    };
    export function getAuthHeaders(isAdmin?: boolean): {
        Authorization?: string | undefined;
        'x-hasura-admin-secret'?: string | undefined;
    };
}

declare module "@dish/graph" {
    export type EditUserProps = {
        username: string;
        about?: string;
        location?: string;
        charIndex?: number;
    };
    export type EditUserResponse = {
        email: string;
        has_onboarded: boolean;
        about: string;
        location: string;
        charIndex: number;
        username: string;
    };
    export function userEdit(user: EditUserProps): Promise<EditUserResponse | null>;
    type UserFetchOpts = {
        isAdmin?: boolean;
        handleLogOut?: () => void;
        rawData?: boolean;
    };
    export function userFetchSimple(method: 'POST' | 'GET', path: string, data?: any, { handleLogOut, rawData, isAdmin }?: UserFetchOpts): Promise<Response>;
    class AuthModel {
        jwt: string;
        isLoggedIn: boolean;
        isAdmin: boolean;
        user: any;
        has_been_logged_out: boolean;
        getRedirectUri(): string;
        hasEverLoggedIn: boolean;
        constructor();
        checkForExistingLogin(): void;
        api(method: 'POST' | 'GET', path: string, data?: any, opts?: UserFetchOpts): Promise<Response>;
        as(role: string): void;
        uploadAvatar(body: FormData): Promise<any>;
        register(username: string, email: string, password: string): Promise<readonly [
            number,
            any
        ]>;
        login(login: string, password: string): Promise<readonly [
            number,
            string
        ] | readonly [
            200 | 201,
            any
        ]>;
        setLoginData(data: {
            user: any;
            token: string;
        }): void;
        appleAuth(authorization: {
            id_token: string;
            code: string;
        }): Promise<any>;
        logout(): Promise<void>;
    }
    export const Auth: AuthModel;
}

declare module "@dish/graph" {
    import "@dish/helpers/polyfill";
}

declare module "@dish/graph" {
    import { ScalarsEnumsHash } from "@dish/gqless";
    export type Maybe<T> = T | null;
    export type Exact<T extends {
        [key: string]: unknown;
    }> = {
        [K in keyof T]: T[K];
    };
    export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
        [SubKey in K]?: Maybe<T[SubKey]>;
    };
    export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
        [SubKey in K]: Maybe<T[SubKey]>;
    };
    export interface Scalars {
        ID: string;
        String: string;
        Boolean: boolean;
        Int: number;
        Float: number;
        geography: any;
        geometry: any;
        jsonb: any;
        numeric: any;
        timestamptz: any;
        tsrange: any;
        uuid: any;
    }
    export interface Boolean_comparison_exp {
        _eq?: Maybe<Scalars['Boolean']>;
        _gt?: Maybe<Scalars['Boolean']>;
        _gte?: Maybe<Scalars['Boolean']>;
        _in?: Maybe<Array<Scalars['Boolean']>>;
        _is_null?: Maybe<Scalars['Boolean']>;
        _lt?: Maybe<Scalars['Boolean']>;
        _lte?: Maybe<Scalars['Boolean']>;
        _neq?: Maybe<Scalars['Boolean']>;
        _nin?: Maybe<Array<Scalars['Boolean']>>;
    }
    export interface Int_comparison_exp {
        _eq?: Maybe<Scalars['Int']>;
        _gt?: Maybe<Scalars['Int']>;
        _gte?: Maybe<Scalars['Int']>;
        _in?: Maybe<Array<Scalars['Int']>>;
        _is_null?: Maybe<Scalars['Boolean']>;
        _lt?: Maybe<Scalars['Int']>;
        _lte?: Maybe<Scalars['Int']>;
        _neq?: Maybe<Scalars['Int']>;
        _nin?: Maybe<Array<Scalars['Int']>>;
    }
    export interface String_comparison_exp {
        _eq?: Maybe<Scalars['String']>;
        _gt?: Maybe<Scalars['String']>;
        _gte?: Maybe<Scalars['String']>;
        _ilike?: Maybe<Scalars['String']>;
        _in?: Maybe<Array<Scalars['String']>>;
        _is_null?: Maybe<Scalars['Boolean']>;
        _like?: Maybe<Scalars['String']>;
        _lt?: Maybe<Scalars['String']>;
        _lte?: Maybe<Scalars['String']>;
        _neq?: Maybe<Scalars['String']>;
        _nilike?: Maybe<Scalars['String']>;
        _nin?: Maybe<Array<Scalars['String']>>;
        _nlike?: Maybe<Scalars['String']>;
        _nsimilar?: Maybe<Scalars['String']>;
        _similar?: Maybe<Scalars['String']>;
    }
    export interface geography_cast_exp {
        geometry?: Maybe<geometry_comparison_exp>;
    }
    export interface geography_comparison_exp {
        _cast?: Maybe<geography_cast_exp>;
        _eq?: Maybe<Scalars['geography']>;
        _gt?: Maybe<Scalars['geography']>;
        _gte?: Maybe<Scalars['geography']>;
        _in?: Maybe<Array<Scalars['geography']>>;
        _is_null?: Maybe<Scalars['Boolean']>;
        _lt?: Maybe<Scalars['geography']>;
        _lte?: Maybe<Scalars['geography']>;
        _neq?: Maybe<Scalars['geography']>;
        _nin?: Maybe<Array<Scalars['geography']>>;
        _st_d_within?: Maybe<st_d_within_geography_input>;
        _st_intersects?: Maybe<Scalars['geography']>;
    }
    export interface geometry_cast_exp {
        geography?: Maybe<geography_comparison_exp>;
    }
    export interface geometry_comparison_exp {
        _cast?: Maybe<geometry_cast_exp>;
        _eq?: Maybe<Scalars['geometry']>;
        _gt?: Maybe<Scalars['geometry']>;
        _gte?: Maybe<Scalars['geometry']>;
        _in?: Maybe<Array<Scalars['geometry']>>;
        _is_null?: Maybe<Scalars['Boolean']>;
        _lt?: Maybe<Scalars['geometry']>;
        _lte?: Maybe<Scalars['geometry']>;
        _neq?: Maybe<Scalars['geometry']>;
        _nin?: Maybe<Array<Scalars['geometry']>>;
        _st_contains?: Maybe<Scalars['geometry']>;
        _st_crosses?: Maybe<Scalars['geometry']>;
        _st_d_within?: Maybe<st_d_within_input>;
        _st_equals?: Maybe<Scalars['geometry']>;
        _st_intersects?: Maybe<Scalars['geometry']>;
        _st_overlaps?: Maybe<Scalars['geometry']>;
        _st_touches?: Maybe<Scalars['geometry']>;
        _st_within?: Maybe<Scalars['geometry']>;
    }
    export interface hrr_aggregate_order_by {
        avg?: Maybe<hrr_avg_order_by>;
        count?: Maybe<order_by>;
        max?: Maybe<hrr_max_order_by>;
        min?: Maybe<hrr_min_order_by>;
        stddev?: Maybe<hrr_stddev_order_by>;
        stddev_pop?: Maybe<hrr_stddev_pop_order_by>;
        stddev_samp?: Maybe<hrr_stddev_samp_order_by>;
        sum?: Maybe<hrr_sum_order_by>;
        var_pop?: Maybe<hrr_var_pop_order_by>;
        var_samp?: Maybe<hrr_var_samp_order_by>;
        variance?: Maybe<hrr_variance_order_by>;
    }
    export interface hrr_arr_rel_insert_input {
        data: Array<hrr_insert_input>;
        on_conflict?: Maybe<hrr_on_conflict>;
    }
    export interface hrr_avg_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export interface hrr_bool_exp {
        _and?: Maybe<Array<Maybe<hrr_bool_exp>>>;
        _not?: Maybe<hrr_bool_exp>;
        _or?: Maybe<Array<Maybe<hrr_bool_exp>>>;
        color?: Maybe<String_comparison_exp>;
        hrrcity?: Maybe<String_comparison_exp>;
        ogc_fid?: Maybe<Int_comparison_exp>;
        slug?: Maybe<String_comparison_exp>;
        wkb_geometry?: Maybe<geometry_comparison_exp>;
    }
    export enum hrr_constraint {
        hrr_pkey = "hrr_pkey",
        hrr_slug_key = "hrr_slug_key"
    }
    export interface hrr_inc_input {
        ogc_fid?: Maybe<Scalars['Int']>;
    }
    export interface hrr_insert_input {
        color?: Maybe<Scalars['String']>;
        hrrcity?: Maybe<Scalars['String']>;
        ogc_fid?: Maybe<Scalars['Int']>;
        slug?: Maybe<Scalars['String']>;
        wkb_geometry?: Maybe<Scalars['geometry']>;
    }
    export interface hrr_max_order_by {
        color?: Maybe<order_by>;
        hrrcity?: Maybe<order_by>;
        ogc_fid?: Maybe<order_by>;
        slug?: Maybe<order_by>;
    }
    export interface hrr_min_order_by {
        color?: Maybe<order_by>;
        hrrcity?: Maybe<order_by>;
        ogc_fid?: Maybe<order_by>;
        slug?: Maybe<order_by>;
    }
    export interface hrr_obj_rel_insert_input {
        data: hrr_insert_input;
        on_conflict?: Maybe<hrr_on_conflict>;
    }
    export interface hrr_on_conflict {
        constraint: hrr_constraint;
        update_columns: Array<hrr_update_column>;
        where?: Maybe<hrr_bool_exp>;
    }
    export interface hrr_order_by {
        color?: Maybe<order_by>;
        hrrcity?: Maybe<order_by>;
        ogc_fid?: Maybe<order_by>;
        slug?: Maybe<order_by>;
        wkb_geometry?: Maybe<order_by>;
    }
    export interface hrr_pk_columns_input {
        ogc_fid: Scalars['Int'];
    }
    export enum hrr_select_column {
        color = "color",
        hrrcity = "hrrcity",
        ogc_fid = "ogc_fid",
        slug = "slug",
        wkb_geometry = "wkb_geometry"
    }
    export interface hrr_set_input {
        color?: Maybe<Scalars['String']>;
        hrrcity?: Maybe<Scalars['String']>;
        ogc_fid?: Maybe<Scalars['Int']>;
        slug?: Maybe<Scalars['String']>;
        wkb_geometry?: Maybe<Scalars['geometry']>;
    }
    export interface hrr_stddev_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export interface hrr_stddev_pop_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export interface hrr_stddev_samp_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export interface hrr_sum_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export enum hrr_update_column {
        color = "color",
        hrrcity = "hrrcity",
        ogc_fid = "ogc_fid",
        slug = "slug",
        wkb_geometry = "wkb_geometry"
    }
    export interface hrr_var_pop_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export interface hrr_var_samp_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export interface hrr_variance_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export interface jsonb_comparison_exp {
        _contained_in?: Maybe<Scalars['jsonb']>;
        _contains?: Maybe<Scalars['jsonb']>;
        _eq?: Maybe<Scalars['jsonb']>;
        _gt?: Maybe<Scalars['jsonb']>;
        _gte?: Maybe<Scalars['jsonb']>;
        _has_key?: Maybe<Scalars['String']>;
        _has_keys_all?: Maybe<Array<Scalars['String']>>;
        _has_keys_any?: Maybe<Array<Scalars['String']>>;
        _in?: Maybe<Array<Scalars['jsonb']>>;
        _is_null?: Maybe<Scalars['Boolean']>;
        _lt?: Maybe<Scalars['jsonb']>;
        _lte?: Maybe<Scalars['jsonb']>;
        _neq?: Maybe<Scalars['jsonb']>;
        _nin?: Maybe<Array<Scalars['jsonb']>>;
    }
    export interface list_aggregate_order_by {
        avg?: Maybe<list_avg_order_by>;
        count?: Maybe<order_by>;
        max?: Maybe<list_max_order_by>;
        min?: Maybe<list_min_order_by>;
        stddev?: Maybe<list_stddev_order_by>;
        stddev_pop?: Maybe<list_stddev_pop_order_by>;
        stddev_samp?: Maybe<list_stddev_samp_order_by>;
        sum?: Maybe<list_sum_order_by>;
        var_pop?: Maybe<list_var_pop_order_by>;
        var_samp?: Maybe<list_var_samp_order_by>;
        variance?: Maybe<list_variance_order_by>;
    }
    export interface list_arr_rel_insert_input {
        data: Array<list_insert_input>;
        on_conflict?: Maybe<list_on_conflict>;
    }
    export interface list_avg_order_by {
        color?: Maybe<order_by>;
    }
    export interface list_bool_exp {
        _and?: Maybe<Array<Maybe<list_bool_exp>>>;
        _not?: Maybe<list_bool_exp>;
        _or?: Maybe<Array<Maybe<list_bool_exp>>>;
        color?: Maybe<Int_comparison_exp>;
        created_at?: Maybe<timestamptz_comparison_exp>;
        description?: Maybe<String_comparison_exp>;
        id?: Maybe<uuid_comparison_exp>;
        location?: Maybe<geometry_comparison_exp>;
        name?: Maybe<String_comparison_exp>;
        public?: Maybe<Boolean_comparison_exp>;
        region?: Maybe<String_comparison_exp>;
        restaurants?: Maybe<list_restaurant_bool_exp>;
        slug?: Maybe<String_comparison_exp>;
        tags?: Maybe<list_tag_bool_exp>;
        updated_at?: Maybe<timestamptz_comparison_exp>;
        user?: Maybe<user_bool_exp>;
        user_id?: Maybe<uuid_comparison_exp>;
    }
    export enum list_constraint {
        list_pkey = "list_pkey",
        list_slug_user_id_region_key = "list_slug_user_id_region_key"
    }
    export interface list_inc_input {
        color?: Maybe<Scalars['Int']>;
    }
    export interface list_insert_input {
        color?: Maybe<Scalars['Int']>;
        created_at?: Maybe<Scalars['timestamptz']>;
        description?: Maybe<Scalars['String']>;
        id?: Maybe<Scalars['uuid']>;
        location?: Maybe<Scalars['geometry']>;
        name?: Maybe<Scalars['String']>;
        public?: Maybe<Scalars['Boolean']>;
        region?: Maybe<Scalars['String']>;
        restaurants?: Maybe<list_restaurant_arr_rel_insert_input>;
        slug?: Maybe<Scalars['String']>;
        tags?: Maybe<list_tag_arr_rel_insert_input>;
        updated_at?: Maybe<Scalars['timestamptz']>;
        user?: Maybe<user_obj_rel_insert_input>;
        user_id?: Maybe<Scalars['uuid']>;
    }
    export interface list_max_order_by {
        color?: Maybe<order_by>;
        created_at?: Maybe<order_by>;
        description?: Maybe<order_by>;
        id?: Maybe<order_by>;
        name?: Maybe<order_by>;
        region?: Maybe<order_by>;
        slug?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
        user_id?: Maybe<order_by>;
    }
    export interface list_min_order_by {
        color?: Maybe<order_by>;
        created_at?: Maybe<order_by>;
        description?: Maybe<order_by>;
        id?: Maybe<order_by>;
        name?: Maybe<order_by>;
        region?: Maybe<order_by>;
        slug?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
        user_id?: Maybe<order_by>;
    }
    export interface list_obj_rel_insert_input {
        data: list_insert_input;
        on_conflict?: Maybe<list_on_conflict>;
    }
    export interface list_on_conflict {
        constraint: list_constraint;
        update_columns: Array<list_update_column>;
        where?: Maybe<list_bool_exp>;
    }
    export interface list_order_by {
        color?: Maybe<order_by>;
        created_at?: Maybe<order_by>;
        description?: Maybe<order_by>;
        id?: Maybe<order_by>;
        location?: Maybe<order_by>;
        name?: Maybe<order_by>;
        public?: Maybe<order_by>;
        region?: Maybe<order_by>;
        restaurants_aggregate?: Maybe<list_restaurant_aggregate_order_by>;
        slug?: Maybe<order_by>;
        tags_aggregate?: Maybe<list_tag_aggregate_order_by>;
        updated_at?: Maybe<order_by>;
        user?: Maybe<user_order_by>;
        user_id?: Maybe<order_by>;
    }
    export interface list_pk_columns_input {
        id: Scalars['uuid'];
    }
    export interface list_populated_args {
        min_items?: Maybe<Scalars['Int']>;
    }
    export interface list_restaurant_aggregate_order_by {
        avg?: Maybe<list_restaurant_avg_order_by>;
        count?: Maybe<order_by>;
        max?: Maybe<list_restaurant_max_order_by>;
        min?: Maybe<list_restaurant_min_order_by>;
        stddev?: Maybe<list_restaurant_stddev_order_by>;
        stddev_pop?: Maybe<list_restaurant_stddev_pop_order_by>;
        stddev_samp?: Maybe<list_restaurant_stddev_samp_order_by>;
        sum?: Maybe<list_restaurant_sum_order_by>;
        var_pop?: Maybe<list_restaurant_var_pop_order_by>;
        var_samp?: Maybe<list_restaurant_var_samp_order_by>;
        variance?: Maybe<list_restaurant_variance_order_by>;
    }
    export interface list_restaurant_arr_rel_insert_input {
        data: Array<list_restaurant_insert_input>;
        on_conflict?: Maybe<list_restaurant_on_conflict>;
    }
    export interface list_restaurant_avg_order_by {
        position?: Maybe<order_by>;
    }
    export interface list_restaurant_bool_exp {
        _and?: Maybe<Array<Maybe<list_restaurant_bool_exp>>>;
        _not?: Maybe<list_restaurant_bool_exp>;
        _or?: Maybe<Array<Maybe<list_restaurant_bool_exp>>>;
        comment?: Maybe<String_comparison_exp>;
        id?: Maybe<uuid_comparison_exp>;
        list?: Maybe<list_bool_exp>;
        list_id?: Maybe<uuid_comparison_exp>;
        position?: Maybe<Int_comparison_exp>;
        restaurant?: Maybe<restaurant_bool_exp>;
        restaurant_id?: Maybe<uuid_comparison_exp>;
        restaurants?: Maybe<restaurant_bool_exp>;
        tags?: Maybe<list_restaurant_tag_bool_exp>;
        user_id?: Maybe<uuid_comparison_exp>;
    }
    export enum list_restaurant_constraint {
        list_restaurant_id_key = "list_restaurant_id_key",
        list_restaurant_pkey = "list_restaurant_pkey",
        list_restaurant_position_list_id_key = "list_restaurant_position_list_id_key"
    }
    export interface list_restaurant_inc_input {
        position?: Maybe<Scalars['Int']>;
    }
    export interface list_restaurant_insert_input {
        comment?: Maybe<Scalars['String']>;
        id?: Maybe<Scalars['uuid']>;
        list?: Maybe<list_obj_rel_insert_input>;
        list_id?: Maybe<Scalars['uuid']>;
        position?: Maybe<Scalars['Int']>;
        restaurant?: Maybe<restaurant_obj_rel_insert_input>;
        restaurant_id?: Maybe<Scalars['uuid']>;
        restaurants?: Maybe<restaurant_arr_rel_insert_input>;
        tags?: Maybe<list_restaurant_tag_arr_rel_insert_input>;
        user_id?: Maybe<Scalars['uuid']>;
    }
    export interface list_restaurant_max_order_by {
        comment?: Maybe<order_by>;
        id?: Maybe<order_by>;
        list_id?: Maybe<order_by>;
        position?: Maybe<order_by>;
        restaurant_id?: Maybe<order_by>;
        user_id?: Maybe<order_by>;
    }
    export interface list_restaurant_min_order_by {
        comment?: Maybe<order_by>;
        id?: Maybe<order_by>;
        list_id?: Maybe<order_by>;
        position?: Maybe<order_by>;
        restaurant_id?: Maybe<order_by>;
        user_id?: Maybe<order_by>;
    }
    export interface list_restaurant_obj_rel_insert_input {
        data: list_restaurant_insert_input;
        on_conflict?: Maybe<list_restaurant_on_conflict>;
    }
    export interface list_restaurant_on_conflict {
        constraint: list_restaurant_constraint;
        update_columns: Array<list_restaurant_update_column>;
        where?: Maybe<list_restaurant_bool_exp>;
    }
    export interface list_restaurant_order_by {
        comment?: Maybe<order_by>;
        id?: Maybe<order_by>;
        list?: Maybe<list_order_by>;
        list_id?: Maybe<order_by>;
        position?: Maybe<order_by>;
        restaurant?: Maybe<restaurant_order_by>;
        restaurant_id?: Maybe<order_by>;
        restaurants_aggregate?: Maybe<restaurant_aggregate_order_by>;
        tags_aggregate?: Maybe<list_restaurant_tag_aggregate_order_by>;
        user_id?: Maybe<order_by>;
    }
    export interface list_restaurant_pk_columns_input {
        list_id: Scalars['uuid'];
        restaurant_id: Scalars['uuid'];
    }
    export enum list_restaurant_select_column {
        comment = "comment",
        id = "id",
        list_id = "list_id",
        position = "position",
        restaurant_id = "restaurant_id",
        user_id = "user_id"
    }
    export interface list_restaurant_set_input {
        comment?: Maybe<Scalars['String']>;
        id?: Maybe<Scalars['uuid']>;
        list_id?: Maybe<Scalars['uuid']>;
        position?: Maybe<Scalars['Int']>;
        restaurant_id?: Maybe<Scalars['uuid']>;
        user_id?: Maybe<Scalars['uuid']>;
    }
    export interface list_restaurant_stddev_order_by {
        position?: Maybe<order_by>;
    }
    export interface list_restaurant_stddev_pop_order_by {
        position?: Maybe<order_by>;
    }
    export interface list_restaurant_stddev_samp_order_by {
        position?: Maybe<order_by>;
    }
    export interface list_restaurant_sum_order_by {
        position?: Maybe<order_by>;
    }
    export interface list_restaurant_tag_aggregate_order_by {
        avg?: Maybe<list_restaurant_tag_avg_order_by>;
        count?: Maybe<order_by>;
        max?: Maybe<list_restaurant_tag_max_order_by>;
        min?: Maybe<list_restaurant_tag_min_order_by>;
        stddev?: Maybe<list_restaurant_tag_stddev_order_by>;
        stddev_pop?: Maybe<list_restaurant_tag_stddev_pop_order_by>;
        stddev_samp?: Maybe<list_restaurant_tag_stddev_samp_order_by>;
        sum?: Maybe<list_restaurant_tag_sum_order_by>;
        var_pop?: Maybe<list_restaurant_tag_var_pop_order_by>;
        var_samp?: Maybe<list_restaurant_tag_var_samp_order_by>;
        variance?: Maybe<list_restaurant_tag_variance_order_by>;
    }
    export interface list_restaurant_tag_arr_rel_insert_input {
        data: Array<list_restaurant_tag_insert_input>;
        on_conflict?: Maybe<list_restaurant_tag_on_conflict>;
    }
    export interface list_restaurant_tag_avg_order_by {
        position?: Maybe<order_by>;
    }
    export interface list_restaurant_tag_bool_exp {
        _and?: Maybe<Array<Maybe<list_restaurant_tag_bool_exp>>>;
        _not?: Maybe<list_restaurant_tag_bool_exp>;
        _or?: Maybe<Array<Maybe<list_restaurant_tag_bool_exp>>>;
        id?: Maybe<uuid_comparison_exp>;
        list_id?: Maybe<uuid_comparison_exp>;
        list_restaurant_id?: Maybe<uuid_comparison_exp>;
        position?: Maybe<Int_comparison_exp>;
        restaurant_tag?: Maybe<restaurant_tag_bool_exp>;
        restaurant_tag_id?: Maybe<uuid_comparison_exp>;
        user_id?: Maybe<uuid_comparison_exp>;
    }
    export enum list_restaurant_tag_constraint {
        list_restaurant_tag_id_key = "list_restaurant_tag_id_key",
        list_restaurant_tag_list_id_list_restaurant_id_restaurant_tag_i = "list_restaurant_tag_list_id_list_restaurant_id_restaurant_tag_i",
        list_restaurant_tag_pkey = "list_restaurant_tag_pkey",
        list_restaurant_tag_position_list_id_list_restaurant_id_key = "list_restaurant_tag_position_list_id_list_restaurant_id_key"
    }
    export interface list_restaurant_tag_inc_input {
        position?: Maybe<Scalars['Int']>;
    }
    export interface list_restaurant_tag_insert_input {
        id?: Maybe<Scalars['uuid']>;
        list_id?: Maybe<Scalars['uuid']>;
        list_restaurant_id?: Maybe<Scalars['uuid']>;
        position?: Maybe<Scalars['Int']>;
        restaurant_tag?: Maybe<restaurant_tag_obj_rel_insert_input>;
        restaurant_tag_id?: Maybe<Scalars['uuid']>;
        user_id?: Maybe<Scalars['uuid']>;
    }
    export interface list_restaurant_tag_max_order_by {
        id?: Maybe<order_by>;
        list_id?: Maybe<order_by>;
        list_restaurant_id?: Maybe<order_by>;
        position?: Maybe<order_by>;
        restaurant_tag_id?: Maybe<order_by>;
        user_id?: Maybe<order_by>;
    }
    export interface list_restaurant_tag_min_order_by {
        id?: Maybe<order_by>;
        list_id?: Maybe<order_by>;
        list_restaurant_id?: Maybe<order_by>;
        position?: Maybe<order_by>;
        restaurant_tag_id?: Maybe<order_by>;
        user_id?: Maybe<order_by>;
    }
    export interface list_restaurant_tag_obj_rel_insert_input {
        data: list_restaurant_tag_insert_input;
        on_conflict?: Maybe<list_restaurant_tag_on_conflict>;
    }
    export interface list_restaurant_tag_on_conflict {
        constraint: list_restaurant_tag_constraint;
        update_columns: Array<list_restaurant_tag_update_column>;
        where?: Maybe<list_restaurant_tag_bool_exp>;
    }
    export interface list_restaurant_tag_order_by {
        id?: Maybe<order_by>;
        list_id?: Maybe<order_by>;
        list_restaurant_id?: Maybe<order_by>;
        position?: Maybe<order_by>;
        restaurant_tag?: Maybe<restaurant_tag_order_by>;
        restaurant_tag_id?: Maybe<order_by>;
        user_id?: Maybe<order_by>;
    }
    export interface list_restaurant_tag_pk_columns_input {
        id: Scalars['uuid'];
    }
    export enum list_restaurant_tag_select_column {
        id = "id",
        list_id = "list_id",
        list_restaurant_id = "list_restaurant_id",
        position = "position",
        restaurant_tag_id = "restaurant_tag_id",
        user_id = "user_id"
    }
    export interface list_restaurant_tag_set_input {
        id?: Maybe<Scalars['uuid']>;
        list_id?: Maybe<Scalars['uuid']>;
        list_restaurant_id?: Maybe<Scalars['uuid']>;
        position?: Maybe<Scalars['Int']>;
        restaurant_tag_id?: Maybe<Scalars['uuid']>;
        user_id?: Maybe<Scalars['uuid']>;
    }
    export interface list_restaurant_tag_stddev_order_by {
        position?: Maybe<order_by>;
    }
    export interface list_restaurant_tag_stddev_pop_order_by {
        position?: Maybe<order_by>;
    }
    export interface list_restaurant_tag_stddev_samp_order_by {
        position?: Maybe<order_by>;
    }
    export interface list_restaurant_tag_sum_order_by {
        position?: Maybe<order_by>;
    }
    export enum list_restaurant_tag_update_column {
        id = "id",
        list_id = "list_id",
        list_restaurant_id = "list_restaurant_id",
        position = "position",
        restaurant_tag_id = "restaurant_tag_id",
        user_id = "user_id"
    }
    export interface list_restaurant_tag_var_pop_order_by {
        position?: Maybe<order_by>;
    }
    export interface list_restaurant_tag_var_samp_order_by {
        position?: Maybe<order_by>;
    }
    export interface list_restaurant_tag_variance_order_by {
        position?: Maybe<order_by>;
    }
    export enum list_restaurant_update_column {
        comment = "comment",
        id = "id",
        list_id = "list_id",
        position = "position",
        restaurant_id = "restaurant_id",
        user_id = "user_id"
    }
    export interface list_restaurant_var_pop_order_by {
        position?: Maybe<order_by>;
    }
    export interface list_restaurant_var_samp_order_by {
        position?: Maybe<order_by>;
    }
    export interface list_restaurant_variance_order_by {
        position?: Maybe<order_by>;
    }
    export enum list_select_column {
        color = "color",
        created_at = "created_at",
        description = "description",
        id = "id",
        location = "location",
        name = "name",
        public = "public",
        region = "region",
        slug = "slug",
        updated_at = "updated_at",
        user_id = "user_id"
    }
    export interface list_set_input {
        color?: Maybe<Scalars['Int']>;
        created_at?: Maybe<Scalars['timestamptz']>;
        description?: Maybe<Scalars['String']>;
        id?: Maybe<Scalars['uuid']>;
        location?: Maybe<Scalars['geometry']>;
        name?: Maybe<Scalars['String']>;
        public?: Maybe<Scalars['Boolean']>;
        region?: Maybe<Scalars['String']>;
        slug?: Maybe<Scalars['String']>;
        updated_at?: Maybe<Scalars['timestamptz']>;
        user_id?: Maybe<Scalars['uuid']>;
    }
    export interface list_stddev_order_by {
        color?: Maybe<order_by>;
    }
    export interface list_stddev_pop_order_by {
        color?: Maybe<order_by>;
    }
    export interface list_stddev_samp_order_by {
        color?: Maybe<order_by>;
    }
    export interface list_sum_order_by {
        color?: Maybe<order_by>;
    }
    export interface list_tag_aggregate_order_by {
        count?: Maybe<order_by>;
        max?: Maybe<list_tag_max_order_by>;
        min?: Maybe<list_tag_min_order_by>;
    }
    export interface list_tag_arr_rel_insert_input {
        data: Array<list_tag_insert_input>;
        on_conflict?: Maybe<list_tag_on_conflict>;
    }
    export interface list_tag_bool_exp {
        _and?: Maybe<Array<Maybe<list_tag_bool_exp>>>;
        _not?: Maybe<list_tag_bool_exp>;
        _or?: Maybe<Array<Maybe<list_tag_bool_exp>>>;
        created_at?: Maybe<timestamptz_comparison_exp>;
        id?: Maybe<uuid_comparison_exp>;
        list?: Maybe<list_bool_exp>;
        list_id?: Maybe<uuid_comparison_exp>;
        tag?: Maybe<tag_bool_exp>;
        tag_id?: Maybe<uuid_comparison_exp>;
    }
    export enum list_tag_constraint {
        list_tag_list_id_tag_id_id_key = "list_tag_list_id_tag_id_id_key",
        list_tag_pkey = "list_tag_pkey"
    }
    export interface list_tag_insert_input {
        created_at?: Maybe<Scalars['timestamptz']>;
        id?: Maybe<Scalars['uuid']>;
        list?: Maybe<list_obj_rel_insert_input>;
        list_id?: Maybe<Scalars['uuid']>;
        tag?: Maybe<tag_obj_rel_insert_input>;
        tag_id?: Maybe<Scalars['uuid']>;
    }
    export interface list_tag_max_order_by {
        created_at?: Maybe<order_by>;
        id?: Maybe<order_by>;
        list_id?: Maybe<order_by>;
        tag_id?: Maybe<order_by>;
    }
    export interface list_tag_min_order_by {
        created_at?: Maybe<order_by>;
        id?: Maybe<order_by>;
        list_id?: Maybe<order_by>;
        tag_id?: Maybe<order_by>;
    }
    export interface list_tag_obj_rel_insert_input {
        data: list_tag_insert_input;
        on_conflict?: Maybe<list_tag_on_conflict>;
    }
    export interface list_tag_on_conflict {
        constraint: list_tag_constraint;
        update_columns: Array<list_tag_update_column>;
        where?: Maybe<list_tag_bool_exp>;
    }
    export interface list_tag_order_by {
        created_at?: Maybe<order_by>;
        id?: Maybe<order_by>;
        list?: Maybe<list_order_by>;
        list_id?: Maybe<order_by>;
        tag?: Maybe<tag_order_by>;
        tag_id?: Maybe<order_by>;
    }
    export interface list_tag_pk_columns_input {
        id: Scalars['uuid'];
    }
    export enum list_tag_select_column {
        created_at = "created_at",
        id = "id",
        list_id = "list_id",
        tag_id = "tag_id"
    }
    export interface list_tag_set_input {
        created_at?: Maybe<Scalars['timestamptz']>;
        id?: Maybe<Scalars['uuid']>;
        list_id?: Maybe<Scalars['uuid']>;
        tag_id?: Maybe<Scalars['uuid']>;
    }
    export enum list_tag_update_column {
        created_at = "created_at",
        id = "id",
        list_id = "list_id",
        tag_id = "tag_id"
    }
    export enum list_update_column {
        color = "color",
        created_at = "created_at",
        description = "description",
        id = "id",
        location = "location",
        name = "name",
        public = "public",
        region = "region",
        slug = "slug",
        updated_at = "updated_at",
        user_id = "user_id"
    }
    export interface list_var_pop_order_by {
        color?: Maybe<order_by>;
    }
    export interface list_var_samp_order_by {
        color?: Maybe<order_by>;
    }
    export interface list_variance_order_by {
        color?: Maybe<order_by>;
    }
    export interface menu_item_aggregate_order_by {
        avg?: Maybe<menu_item_avg_order_by>;
        count?: Maybe<order_by>;
        max?: Maybe<menu_item_max_order_by>;
        min?: Maybe<menu_item_min_order_by>;
        stddev?: Maybe<menu_item_stddev_order_by>;
        stddev_pop?: Maybe<menu_item_stddev_pop_order_by>;
        stddev_samp?: Maybe<menu_item_stddev_samp_order_by>;
        sum?: Maybe<menu_item_sum_order_by>;
        var_pop?: Maybe<menu_item_var_pop_order_by>;
        var_samp?: Maybe<menu_item_var_samp_order_by>;
        variance?: Maybe<menu_item_variance_order_by>;
    }
    export interface menu_item_arr_rel_insert_input {
        data: Array<menu_item_insert_input>;
        on_conflict?: Maybe<menu_item_on_conflict>;
    }
    export interface menu_item_avg_order_by {
        price?: Maybe<order_by>;
    }
    export interface menu_item_bool_exp {
        _and?: Maybe<Array<Maybe<menu_item_bool_exp>>>;
        _not?: Maybe<menu_item_bool_exp>;
        _or?: Maybe<Array<Maybe<menu_item_bool_exp>>>;
        created_at?: Maybe<timestamptz_comparison_exp>;
        description?: Maybe<String_comparison_exp>;
        id?: Maybe<uuid_comparison_exp>;
        image?: Maybe<String_comparison_exp>;
        location?: Maybe<geometry_comparison_exp>;
        name?: Maybe<String_comparison_exp>;
        price?: Maybe<Int_comparison_exp>;
        restaurant?: Maybe<restaurant_bool_exp>;
        restaurant_id?: Maybe<uuid_comparison_exp>;
        updated_at?: Maybe<timestamptz_comparison_exp>;
    }
    export enum menu_item_constraint {
        menu_item_pkey = "menu_item_pkey",
        menu_item_restaurant_id_name_key = "menu_item_restaurant_id_name_key"
    }
    export interface menu_item_inc_input {
        price?: Maybe<Scalars['Int']>;
    }
    export interface menu_item_insert_input {
        created_at?: Maybe<Scalars['timestamptz']>;
        description?: Maybe<Scalars['String']>;
        id?: Maybe<Scalars['uuid']>;
        image?: Maybe<Scalars['String']>;
        location?: Maybe<Scalars['geometry']>;
        name?: Maybe<Scalars['String']>;
        price?: Maybe<Scalars['Int']>;
        restaurant?: Maybe<restaurant_obj_rel_insert_input>;
        restaurant_id?: Maybe<Scalars['uuid']>;
        updated_at?: Maybe<Scalars['timestamptz']>;
    }
    export interface menu_item_max_order_by {
        created_at?: Maybe<order_by>;
        description?: Maybe<order_by>;
        id?: Maybe<order_by>;
        image?: Maybe<order_by>;
        name?: Maybe<order_by>;
        price?: Maybe<order_by>;
        restaurant_id?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
    }
    export interface menu_item_min_order_by {
        created_at?: Maybe<order_by>;
        description?: Maybe<order_by>;
        id?: Maybe<order_by>;
        image?: Maybe<order_by>;
        name?: Maybe<order_by>;
        price?: Maybe<order_by>;
        restaurant_id?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
    }
    export interface menu_item_obj_rel_insert_input {
        data: menu_item_insert_input;
        on_conflict?: Maybe<menu_item_on_conflict>;
    }
    export interface menu_item_on_conflict {
        constraint: menu_item_constraint;
        update_columns: Array<menu_item_update_column>;
        where?: Maybe<menu_item_bool_exp>;
    }
    export interface menu_item_order_by {
        created_at?: Maybe<order_by>;
        description?: Maybe<order_by>;
        id?: Maybe<order_by>;
        image?: Maybe<order_by>;
        location?: Maybe<order_by>;
        name?: Maybe<order_by>;
        price?: Maybe<order_by>;
        restaurant?: Maybe<restaurant_order_by>;
        restaurant_id?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
    }
    export interface menu_item_pk_columns_input {
        id: Scalars['uuid'];
    }
    export enum menu_item_select_column {
        created_at = "created_at",
        description = "description",
        id = "id",
        image = "image",
        location = "location",
        name = "name",
        price = "price",
        restaurant_id = "restaurant_id",
        updated_at = "updated_at"
    }
    export interface menu_item_set_input {
        created_at?: Maybe<Scalars['timestamptz']>;
        description?: Maybe<Scalars['String']>;
        id?: Maybe<Scalars['uuid']>;
        image?: Maybe<Scalars['String']>;
        location?: Maybe<Scalars['geometry']>;
        name?: Maybe<Scalars['String']>;
        price?: Maybe<Scalars['Int']>;
        restaurant_id?: Maybe<Scalars['uuid']>;
        updated_at?: Maybe<Scalars['timestamptz']>;
    }
    export interface menu_item_stddev_order_by {
        price?: Maybe<order_by>;
    }
    export interface menu_item_stddev_pop_order_by {
        price?: Maybe<order_by>;
    }
    export interface menu_item_stddev_samp_order_by {
        price?: Maybe<order_by>;
    }
    export interface menu_item_sum_order_by {
        price?: Maybe<order_by>;
    }
    export enum menu_item_update_column {
        created_at = "created_at",
        description = "description",
        id = "id",
        image = "image",
        location = "location",
        name = "name",
        price = "price",
        restaurant_id = "restaurant_id",
        updated_at = "updated_at"
    }
    export interface menu_item_var_pop_order_by {
        price?: Maybe<order_by>;
    }
    export interface menu_item_var_samp_order_by {
        price?: Maybe<order_by>;
    }
    export interface menu_item_variance_order_by {
        price?: Maybe<order_by>;
    }
    export interface nhood_labels_aggregate_order_by {
        avg?: Maybe<nhood_labels_avg_order_by>;
        count?: Maybe<order_by>;
        max?: Maybe<nhood_labels_max_order_by>;
        min?: Maybe<nhood_labels_min_order_by>;
        stddev?: Maybe<nhood_labels_stddev_order_by>;
        stddev_pop?: Maybe<nhood_labels_stddev_pop_order_by>;
        stddev_samp?: Maybe<nhood_labels_stddev_samp_order_by>;
        sum?: Maybe<nhood_labels_sum_order_by>;
        var_pop?: Maybe<nhood_labels_var_pop_order_by>;
        var_samp?: Maybe<nhood_labels_var_samp_order_by>;
        variance?: Maybe<nhood_labels_variance_order_by>;
    }
    export interface nhood_labels_arr_rel_insert_input {
        data: Array<nhood_labels_insert_input>;
        on_conflict?: Maybe<nhood_labels_on_conflict>;
    }
    export interface nhood_labels_avg_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export interface nhood_labels_bool_exp {
        _and?: Maybe<Array<Maybe<nhood_labels_bool_exp>>>;
        _not?: Maybe<nhood_labels_bool_exp>;
        _or?: Maybe<Array<Maybe<nhood_labels_bool_exp>>>;
        center?: Maybe<geometry_comparison_exp>;
        name?: Maybe<String_comparison_exp>;
        ogc_fid?: Maybe<Int_comparison_exp>;
    }
    export enum nhood_labels_constraint {
        nhood_labels_pkey = "nhood_labels_pkey"
    }
    export interface nhood_labels_inc_input {
        ogc_fid?: Maybe<Scalars['Int']>;
    }
    export interface nhood_labels_insert_input {
        center?: Maybe<Scalars['geometry']>;
        name?: Maybe<Scalars['String']>;
        ogc_fid?: Maybe<Scalars['Int']>;
    }
    export interface nhood_labels_max_order_by {
        name?: Maybe<order_by>;
        ogc_fid?: Maybe<order_by>;
    }
    export interface nhood_labels_min_order_by {
        name?: Maybe<order_by>;
        ogc_fid?: Maybe<order_by>;
    }
    export interface nhood_labels_obj_rel_insert_input {
        data: nhood_labels_insert_input;
        on_conflict?: Maybe<nhood_labels_on_conflict>;
    }
    export interface nhood_labels_on_conflict {
        constraint: nhood_labels_constraint;
        update_columns: Array<nhood_labels_update_column>;
        where?: Maybe<nhood_labels_bool_exp>;
    }
    export interface nhood_labels_order_by {
        center?: Maybe<order_by>;
        name?: Maybe<order_by>;
        ogc_fid?: Maybe<order_by>;
    }
    export interface nhood_labels_pk_columns_input {
        ogc_fid: Scalars['Int'];
    }
    export enum nhood_labels_select_column {
        center = "center",
        name = "name",
        ogc_fid = "ogc_fid"
    }
    export interface nhood_labels_set_input {
        center?: Maybe<Scalars['geometry']>;
        name?: Maybe<Scalars['String']>;
        ogc_fid?: Maybe<Scalars['Int']>;
    }
    export interface nhood_labels_stddev_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export interface nhood_labels_stddev_pop_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export interface nhood_labels_stddev_samp_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export interface nhood_labels_sum_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export enum nhood_labels_update_column {
        center = "center",
        name = "name",
        ogc_fid = "ogc_fid"
    }
    export interface nhood_labels_var_pop_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export interface nhood_labels_var_samp_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export interface nhood_labels_variance_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export interface numeric_comparison_exp {
        _eq?: Maybe<Scalars['numeric']>;
        _gt?: Maybe<Scalars['numeric']>;
        _gte?: Maybe<Scalars['numeric']>;
        _in?: Maybe<Array<Scalars['numeric']>>;
        _is_null?: Maybe<Scalars['Boolean']>;
        _lt?: Maybe<Scalars['numeric']>;
        _lte?: Maybe<Scalars['numeric']>;
        _neq?: Maybe<Scalars['numeric']>;
        _nin?: Maybe<Array<Scalars['numeric']>>;
    }
    export interface opening_hours_aggregate_order_by {
        count?: Maybe<order_by>;
        max?: Maybe<opening_hours_max_order_by>;
        min?: Maybe<opening_hours_min_order_by>;
    }
    export interface opening_hours_arr_rel_insert_input {
        data: Array<opening_hours_insert_input>;
        on_conflict?: Maybe<opening_hours_on_conflict>;
    }
    export interface opening_hours_bool_exp {
        _and?: Maybe<Array<Maybe<opening_hours_bool_exp>>>;
        _not?: Maybe<opening_hours_bool_exp>;
        _or?: Maybe<Array<Maybe<opening_hours_bool_exp>>>;
        hours?: Maybe<tsrange_comparison_exp>;
        id?: Maybe<uuid_comparison_exp>;
        restaurant?: Maybe<restaurant_bool_exp>;
        restaurant_id?: Maybe<uuid_comparison_exp>;
    }
    export enum opening_hours_constraint {
        opening_hours_pkey = "opening_hours_pkey"
    }
    export interface opening_hours_insert_input {
        hours?: Maybe<Scalars['tsrange']>;
        id?: Maybe<Scalars['uuid']>;
        restaurant?: Maybe<restaurant_obj_rel_insert_input>;
        restaurant_id?: Maybe<Scalars['uuid']>;
    }
    export interface opening_hours_max_order_by {
        id?: Maybe<order_by>;
        restaurant_id?: Maybe<order_by>;
    }
    export interface opening_hours_min_order_by {
        id?: Maybe<order_by>;
        restaurant_id?: Maybe<order_by>;
    }
    export interface opening_hours_obj_rel_insert_input {
        data: opening_hours_insert_input;
        on_conflict?: Maybe<opening_hours_on_conflict>;
    }
    export interface opening_hours_on_conflict {
        constraint: opening_hours_constraint;
        update_columns: Array<opening_hours_update_column>;
        where?: Maybe<opening_hours_bool_exp>;
    }
    export interface opening_hours_order_by {
        hours?: Maybe<order_by>;
        id?: Maybe<order_by>;
        restaurant?: Maybe<restaurant_order_by>;
        restaurant_id?: Maybe<order_by>;
    }
    export interface opening_hours_pk_columns_input {
        id: Scalars['uuid'];
    }
    export enum opening_hours_select_column {
        hours = "hours",
        id = "id",
        restaurant_id = "restaurant_id"
    }
    export interface opening_hours_set_input {
        hours?: Maybe<Scalars['tsrange']>;
        id?: Maybe<Scalars['uuid']>;
        restaurant_id?: Maybe<Scalars['uuid']>;
    }
    export enum opening_hours_update_column {
        hours = "hours",
        id = "id",
        restaurant_id = "restaurant_id"
    }
    export enum order_by {
        asc = "asc",
        asc_nulls_first = "asc_nulls_first",
        asc_nulls_last = "asc_nulls_last",
        desc = "desc",
        desc_nulls_first = "desc_nulls_first",
        desc_nulls_last = "desc_nulls_last"
    }
    export interface photo_aggregate_order_by {
        avg?: Maybe<photo_avg_order_by>;
        count?: Maybe<order_by>;
        max?: Maybe<photo_max_order_by>;
        min?: Maybe<photo_min_order_by>;
        stddev?: Maybe<photo_stddev_order_by>;
        stddev_pop?: Maybe<photo_stddev_pop_order_by>;
        stddev_samp?: Maybe<photo_stddev_samp_order_by>;
        sum?: Maybe<photo_sum_order_by>;
        var_pop?: Maybe<photo_var_pop_order_by>;
        var_samp?: Maybe<photo_var_samp_order_by>;
        variance?: Maybe<photo_variance_order_by>;
    }
    export interface photo_arr_rel_insert_input {
        data: Array<photo_insert_input>;
        on_conflict?: Maybe<photo_on_conflict>;
    }
    export interface photo_avg_order_by {
        quality?: Maybe<order_by>;
    }
    export interface photo_bool_exp {
        _and?: Maybe<Array<Maybe<photo_bool_exp>>>;
        _not?: Maybe<photo_bool_exp>;
        _or?: Maybe<Array<Maybe<photo_bool_exp>>>;
        created_at?: Maybe<timestamptz_comparison_exp>;
        id?: Maybe<uuid_comparison_exp>;
        origin?: Maybe<String_comparison_exp>;
        quality?: Maybe<numeric_comparison_exp>;
        updated_at?: Maybe<timestamptz_comparison_exp>;
        url?: Maybe<String_comparison_exp>;
    }
    export enum photo_constraint {
        photo_origin_key = "photo_origin_key",
        photo_url_key = "photo_url_key",
        photos_pkey = "photos_pkey"
    }
    export interface photo_inc_input {
        quality?: Maybe<Scalars['numeric']>;
    }
    export interface photo_insert_input {
        created_at?: Maybe<Scalars['timestamptz']>;
        id?: Maybe<Scalars['uuid']>;
        origin?: Maybe<Scalars['String']>;
        quality?: Maybe<Scalars['numeric']>;
        updated_at?: Maybe<Scalars['timestamptz']>;
        url?: Maybe<Scalars['String']>;
    }
    export interface photo_max_order_by {
        created_at?: Maybe<order_by>;
        id?: Maybe<order_by>;
        origin?: Maybe<order_by>;
        quality?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
        url?: Maybe<order_by>;
    }
    export interface photo_min_order_by {
        created_at?: Maybe<order_by>;
        id?: Maybe<order_by>;
        origin?: Maybe<order_by>;
        quality?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
        url?: Maybe<order_by>;
    }
    export interface photo_obj_rel_insert_input {
        data: photo_insert_input;
        on_conflict?: Maybe<photo_on_conflict>;
    }
    export interface photo_on_conflict {
        constraint: photo_constraint;
        update_columns: Array<photo_update_column>;
        where?: Maybe<photo_bool_exp>;
    }
    export interface photo_order_by {
        created_at?: Maybe<order_by>;
        id?: Maybe<order_by>;
        origin?: Maybe<order_by>;
        quality?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
        url?: Maybe<order_by>;
    }
    export interface photo_pk_columns_input {
        id: Scalars['uuid'];
    }
    export enum photo_select_column {
        created_at = "created_at",
        id = "id",
        origin = "origin",
        quality = "quality",
        updated_at = "updated_at",
        url = "url"
    }
    export interface photo_set_input {
        created_at?: Maybe<Scalars['timestamptz']>;
        id?: Maybe<Scalars['uuid']>;
        origin?: Maybe<Scalars['String']>;
        quality?: Maybe<Scalars['numeric']>;
        updated_at?: Maybe<Scalars['timestamptz']>;
        url?: Maybe<Scalars['String']>;
    }
    export interface photo_stddev_order_by {
        quality?: Maybe<order_by>;
    }
    export interface photo_stddev_pop_order_by {
        quality?: Maybe<order_by>;
    }
    export interface photo_stddev_samp_order_by {
        quality?: Maybe<order_by>;
    }
    export interface photo_sum_order_by {
        quality?: Maybe<order_by>;
    }
    export enum photo_update_column {
        created_at = "created_at",
        id = "id",
        origin = "origin",
        quality = "quality",
        updated_at = "updated_at",
        url = "url"
    }
    export interface photo_var_pop_order_by {
        quality?: Maybe<order_by>;
    }
    export interface photo_var_samp_order_by {
        quality?: Maybe<order_by>;
    }
    export interface photo_variance_order_by {
        quality?: Maybe<order_by>;
    }
    export interface photo_xref_aggregate_order_by {
        count?: Maybe<order_by>;
        max?: Maybe<photo_xref_max_order_by>;
        min?: Maybe<photo_xref_min_order_by>;
    }
    export interface photo_xref_arr_rel_insert_input {
        data: Array<photo_xref_insert_input>;
        on_conflict?: Maybe<photo_xref_on_conflict>;
    }
    export interface photo_xref_bool_exp {
        _and?: Maybe<Array<Maybe<photo_xref_bool_exp>>>;
        _not?: Maybe<photo_xref_bool_exp>;
        _or?: Maybe<Array<Maybe<photo_xref_bool_exp>>>;
        id?: Maybe<uuid_comparison_exp>;
        photo?: Maybe<photo_bool_exp>;
        photo_id?: Maybe<uuid_comparison_exp>;
        restaurant_id?: Maybe<uuid_comparison_exp>;
        tag_id?: Maybe<uuid_comparison_exp>;
        type?: Maybe<String_comparison_exp>;
    }
    export enum photo_xref_constraint {
        photos_xref_photos_id_restaurant_id_tag_id_key = "photos_xref_photos_id_restaurant_id_tag_id_key",
        photos_xref_pkey = "photos_xref_pkey"
    }
    export interface photo_xref_insert_input {
        id?: Maybe<Scalars['uuid']>;
        photo?: Maybe<photo_obj_rel_insert_input>;
        photo_id?: Maybe<Scalars['uuid']>;
        restaurant_id?: Maybe<Scalars['uuid']>;
        tag_id?: Maybe<Scalars['uuid']>;
        type?: Maybe<Scalars['String']>;
    }
    export interface photo_xref_max_order_by {
        id?: Maybe<order_by>;
        photo_id?: Maybe<order_by>;
        restaurant_id?: Maybe<order_by>;
        tag_id?: Maybe<order_by>;
        type?: Maybe<order_by>;
    }
    export interface photo_xref_min_order_by {
        id?: Maybe<order_by>;
        photo_id?: Maybe<order_by>;
        restaurant_id?: Maybe<order_by>;
        tag_id?: Maybe<order_by>;
        type?: Maybe<order_by>;
    }
    export interface photo_xref_obj_rel_insert_input {
        data: photo_xref_insert_input;
        on_conflict?: Maybe<photo_xref_on_conflict>;
    }
    export interface photo_xref_on_conflict {
        constraint: photo_xref_constraint;
        update_columns: Array<photo_xref_update_column>;
        where?: Maybe<photo_xref_bool_exp>;
    }
    export interface photo_xref_order_by {
        id?: Maybe<order_by>;
        photo?: Maybe<photo_order_by>;
        photo_id?: Maybe<order_by>;
        restaurant_id?: Maybe<order_by>;
        tag_id?: Maybe<order_by>;
        type?: Maybe<order_by>;
    }
    export interface photo_xref_pk_columns_input {
        id: Scalars['uuid'];
    }
    export enum photo_xref_select_column {
        id = "id",
        photo_id = "photo_id",
        restaurant_id = "restaurant_id",
        tag_id = "tag_id",
        type = "type"
    }
    export interface photo_xref_set_input {
        id?: Maybe<Scalars['uuid']>;
        photo_id?: Maybe<Scalars['uuid']>;
        restaurant_id?: Maybe<Scalars['uuid']>;
        tag_id?: Maybe<Scalars['uuid']>;
        type?: Maybe<Scalars['String']>;
    }
    export enum photo_xref_update_column {
        id = "id",
        photo_id = "photo_id",
        restaurant_id = "restaurant_id",
        tag_id = "tag_id",
        type = "type"
    }
    export interface restaurant_aggregate_order_by {
        avg?: Maybe<restaurant_avg_order_by>;
        count?: Maybe<order_by>;
        max?: Maybe<restaurant_max_order_by>;
        min?: Maybe<restaurant_min_order_by>;
        stddev?: Maybe<restaurant_stddev_order_by>;
        stddev_pop?: Maybe<restaurant_stddev_pop_order_by>;
        stddev_samp?: Maybe<restaurant_stddev_samp_order_by>;
        sum?: Maybe<restaurant_sum_order_by>;
        var_pop?: Maybe<restaurant_var_pop_order_by>;
        var_samp?: Maybe<restaurant_var_samp_order_by>;
        variance?: Maybe<restaurant_variance_order_by>;
    }
    export interface restaurant_append_input {
        headlines?: Maybe<Scalars['jsonb']>;
        hours?: Maybe<Scalars['jsonb']>;
        photos?: Maybe<Scalars['jsonb']>;
        rating_factors?: Maybe<Scalars['jsonb']>;
        score_breakdown?: Maybe<Scalars['jsonb']>;
        source_breakdown?: Maybe<Scalars['jsonb']>;
        sources?: Maybe<Scalars['jsonb']>;
        tag_names?: Maybe<Scalars['jsonb']>;
    }
    export interface restaurant_arr_rel_insert_input {
        data: Array<restaurant_insert_input>;
        on_conflict?: Maybe<restaurant_on_conflict>;
    }
    export interface restaurant_avg_order_by {
        downvotes?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        score?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
        zip?: Maybe<order_by>;
    }
    export interface restaurant_bool_exp {
        _and?: Maybe<Array<Maybe<restaurant_bool_exp>>>;
        _not?: Maybe<restaurant_bool_exp>;
        _or?: Maybe<Array<Maybe<restaurant_bool_exp>>>;
        address?: Maybe<String_comparison_exp>;
        city?: Maybe<String_comparison_exp>;
        created_at?: Maybe<timestamptz_comparison_exp>;
        description?: Maybe<String_comparison_exp>;
        downvotes?: Maybe<numeric_comparison_exp>;
        geocoder_id?: Maybe<String_comparison_exp>;
        headlines?: Maybe<jsonb_comparison_exp>;
        hours?: Maybe<jsonb_comparison_exp>;
        id?: Maybe<uuid_comparison_exp>;
        image?: Maybe<String_comparison_exp>;
        lists?: Maybe<list_restaurant_bool_exp>;
        location?: Maybe<geometry_comparison_exp>;
        menu_items?: Maybe<menu_item_bool_exp>;
        name?: Maybe<String_comparison_exp>;
        oldest_review_date?: Maybe<timestamptz_comparison_exp>;
        photo_table?: Maybe<photo_xref_bool_exp>;
        photos?: Maybe<jsonb_comparison_exp>;
        price_range?: Maybe<String_comparison_exp>;
        rating?: Maybe<numeric_comparison_exp>;
        rating_factors?: Maybe<jsonb_comparison_exp>;
        reviews?: Maybe<review_bool_exp>;
        score?: Maybe<numeric_comparison_exp>;
        score_breakdown?: Maybe<jsonb_comparison_exp>;
        slug?: Maybe<String_comparison_exp>;
        source_breakdown?: Maybe<jsonb_comparison_exp>;
        sources?: Maybe<jsonb_comparison_exp>;
        state?: Maybe<String_comparison_exp>;
        summary?: Maybe<String_comparison_exp>;
        tag_names?: Maybe<jsonb_comparison_exp>;
        tags?: Maybe<restaurant_tag_bool_exp>;
        telephone?: Maybe<String_comparison_exp>;
        updated_at?: Maybe<timestamptz_comparison_exp>;
        upvotes?: Maybe<numeric_comparison_exp>;
        votes_ratio?: Maybe<numeric_comparison_exp>;
        website?: Maybe<String_comparison_exp>;
        zip?: Maybe<numeric_comparison_exp>;
    }
    export enum restaurant_constraint {
        restaurant_geocoder_id_key = "restaurant_geocoder_id_key",
        restaurant_name_address_key = "restaurant_name_address_key",
        restaurant_pkey = "restaurant_pkey",
        restaurant_slug_key = "restaurant_slug_key"
    }
    export interface restaurant_delete_at_path_input {
        headlines?: Maybe<Array<Maybe<Scalars['String']>>>;
        hours?: Maybe<Array<Maybe<Scalars['String']>>>;
        photos?: Maybe<Array<Maybe<Scalars['String']>>>;
        rating_factors?: Maybe<Array<Maybe<Scalars['String']>>>;
        score_breakdown?: Maybe<Array<Maybe<Scalars['String']>>>;
        source_breakdown?: Maybe<Array<Maybe<Scalars['String']>>>;
        sources?: Maybe<Array<Maybe<Scalars['String']>>>;
        tag_names?: Maybe<Array<Maybe<Scalars['String']>>>;
    }
    export interface restaurant_delete_elem_input {
        headlines?: Maybe<Scalars['Int']>;
        hours?: Maybe<Scalars['Int']>;
        photos?: Maybe<Scalars['Int']>;
        rating_factors?: Maybe<Scalars['Int']>;
        score_breakdown?: Maybe<Scalars['Int']>;
        source_breakdown?: Maybe<Scalars['Int']>;
        sources?: Maybe<Scalars['Int']>;
        tag_names?: Maybe<Scalars['Int']>;
    }
    export interface restaurant_delete_key_input {
        headlines?: Maybe<Scalars['String']>;
        hours?: Maybe<Scalars['String']>;
        photos?: Maybe<Scalars['String']>;
        rating_factors?: Maybe<Scalars['String']>;
        score_breakdown?: Maybe<Scalars['String']>;
        source_breakdown?: Maybe<Scalars['String']>;
        sources?: Maybe<Scalars['String']>;
        tag_names?: Maybe<Scalars['String']>;
    }
    export interface restaurant_inc_input {
        downvotes?: Maybe<Scalars['numeric']>;
        rating?: Maybe<Scalars['numeric']>;
        score?: Maybe<Scalars['numeric']>;
        upvotes?: Maybe<Scalars['numeric']>;
        votes_ratio?: Maybe<Scalars['numeric']>;
        zip?: Maybe<Scalars['numeric']>;
    }
    export interface restaurant_insert_input {
        address?: Maybe<Scalars['String']>;
        city?: Maybe<Scalars['String']>;
        created_at?: Maybe<Scalars['timestamptz']>;
        description?: Maybe<Scalars['String']>;
        downvotes?: Maybe<Scalars['numeric']>;
        geocoder_id?: Maybe<Scalars['String']>;
        headlines?: Maybe<Scalars['jsonb']>;
        hours?: Maybe<Scalars['jsonb']>;
        id?: Maybe<Scalars['uuid']>;
        image?: Maybe<Scalars['String']>;
        lists?: Maybe<list_restaurant_arr_rel_insert_input>;
        location?: Maybe<Scalars['geometry']>;
        menu_items?: Maybe<menu_item_arr_rel_insert_input>;
        name?: Maybe<Scalars['String']>;
        oldest_review_date?: Maybe<Scalars['timestamptz']>;
        photo_table?: Maybe<photo_xref_arr_rel_insert_input>;
        photos?: Maybe<Scalars['jsonb']>;
        price_range?: Maybe<Scalars['String']>;
        rating?: Maybe<Scalars['numeric']>;
        rating_factors?: Maybe<Scalars['jsonb']>;
        reviews?: Maybe<review_arr_rel_insert_input>;
        score?: Maybe<Scalars['numeric']>;
        score_breakdown?: Maybe<Scalars['jsonb']>;
        slug?: Maybe<Scalars['String']>;
        source_breakdown?: Maybe<Scalars['jsonb']>;
        sources?: Maybe<Scalars['jsonb']>;
        state?: Maybe<Scalars['String']>;
        summary?: Maybe<Scalars['String']>;
        tag_names?: Maybe<Scalars['jsonb']>;
        tags?: Maybe<restaurant_tag_arr_rel_insert_input>;
        telephone?: Maybe<Scalars['String']>;
        updated_at?: Maybe<Scalars['timestamptz']>;
        upvotes?: Maybe<Scalars['numeric']>;
        votes_ratio?: Maybe<Scalars['numeric']>;
        website?: Maybe<Scalars['String']>;
        zip?: Maybe<Scalars['numeric']>;
    }
    export interface restaurant_max_order_by {
        address?: Maybe<order_by>;
        city?: Maybe<order_by>;
        created_at?: Maybe<order_by>;
        description?: Maybe<order_by>;
        downvotes?: Maybe<order_by>;
        geocoder_id?: Maybe<order_by>;
        id?: Maybe<order_by>;
        image?: Maybe<order_by>;
        name?: Maybe<order_by>;
        oldest_review_date?: Maybe<order_by>;
        price_range?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        score?: Maybe<order_by>;
        slug?: Maybe<order_by>;
        state?: Maybe<order_by>;
        summary?: Maybe<order_by>;
        telephone?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
        website?: Maybe<order_by>;
        zip?: Maybe<order_by>;
    }
    export interface restaurant_min_order_by {
        address?: Maybe<order_by>;
        city?: Maybe<order_by>;
        created_at?: Maybe<order_by>;
        description?: Maybe<order_by>;
        downvotes?: Maybe<order_by>;
        geocoder_id?: Maybe<order_by>;
        id?: Maybe<order_by>;
        image?: Maybe<order_by>;
        name?: Maybe<order_by>;
        oldest_review_date?: Maybe<order_by>;
        price_range?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        score?: Maybe<order_by>;
        slug?: Maybe<order_by>;
        state?: Maybe<order_by>;
        summary?: Maybe<order_by>;
        telephone?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
        website?: Maybe<order_by>;
        zip?: Maybe<order_by>;
    }
    export interface restaurant_new_args {
        region_slug?: Maybe<Scalars['String']>;
    }
    export interface restaurant_obj_rel_insert_input {
        data: restaurant_insert_input;
        on_conflict?: Maybe<restaurant_on_conflict>;
    }
    export interface restaurant_on_conflict {
        constraint: restaurant_constraint;
        update_columns: Array<restaurant_update_column>;
        where?: Maybe<restaurant_bool_exp>;
    }
    export interface restaurant_order_by {
        address?: Maybe<order_by>;
        city?: Maybe<order_by>;
        created_at?: Maybe<order_by>;
        description?: Maybe<order_by>;
        downvotes?: Maybe<order_by>;
        geocoder_id?: Maybe<order_by>;
        headlines?: Maybe<order_by>;
        hours?: Maybe<order_by>;
        id?: Maybe<order_by>;
        image?: Maybe<order_by>;
        lists_aggregate?: Maybe<list_restaurant_aggregate_order_by>;
        location?: Maybe<order_by>;
        menu_items_aggregate?: Maybe<menu_item_aggregate_order_by>;
        name?: Maybe<order_by>;
        oldest_review_date?: Maybe<order_by>;
        photo_table_aggregate?: Maybe<photo_xref_aggregate_order_by>;
        photos?: Maybe<order_by>;
        price_range?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        rating_factors?: Maybe<order_by>;
        reviews_aggregate?: Maybe<review_aggregate_order_by>;
        score?: Maybe<order_by>;
        score_breakdown?: Maybe<order_by>;
        slug?: Maybe<order_by>;
        source_breakdown?: Maybe<order_by>;
        sources?: Maybe<order_by>;
        state?: Maybe<order_by>;
        summary?: Maybe<order_by>;
        tag_names?: Maybe<order_by>;
        tags_aggregate?: Maybe<restaurant_tag_aggregate_order_by>;
        telephone?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
        website?: Maybe<order_by>;
        zip?: Maybe<order_by>;
    }
    export interface restaurant_pk_columns_input {
        id: Scalars['uuid'];
    }
    export interface restaurant_prepend_input {
        headlines?: Maybe<Scalars['jsonb']>;
        hours?: Maybe<Scalars['jsonb']>;
        photos?: Maybe<Scalars['jsonb']>;
        rating_factors?: Maybe<Scalars['jsonb']>;
        score_breakdown?: Maybe<Scalars['jsonb']>;
        source_breakdown?: Maybe<Scalars['jsonb']>;
        sources?: Maybe<Scalars['jsonb']>;
        tag_names?: Maybe<Scalars['jsonb']>;
    }
    export enum restaurant_select_column {
        address = "address",
        city = "city",
        created_at = "created_at",
        description = "description",
        downvotes = "downvotes",
        geocoder_id = "geocoder_id",
        headlines = "headlines",
        hours = "hours",
        id = "id",
        image = "image",
        location = "location",
        name = "name",
        oldest_review_date = "oldest_review_date",
        photos = "photos",
        price_range = "price_range",
        rating = "rating",
        rating_factors = "rating_factors",
        score = "score",
        score_breakdown = "score_breakdown",
        slug = "slug",
        source_breakdown = "source_breakdown",
        sources = "sources",
        state = "state",
        summary = "summary",
        tag_names = "tag_names",
        telephone = "telephone",
        updated_at = "updated_at",
        upvotes = "upvotes",
        votes_ratio = "votes_ratio",
        website = "website",
        zip = "zip"
    }
    export interface restaurant_set_input {
        address?: Maybe<Scalars['String']>;
        city?: Maybe<Scalars['String']>;
        created_at?: Maybe<Scalars['timestamptz']>;
        description?: Maybe<Scalars['String']>;
        downvotes?: Maybe<Scalars['numeric']>;
        geocoder_id?: Maybe<Scalars['String']>;
        headlines?: Maybe<Scalars['jsonb']>;
        hours?: Maybe<Scalars['jsonb']>;
        id?: Maybe<Scalars['uuid']>;
        image?: Maybe<Scalars['String']>;
        location?: Maybe<Scalars['geometry']>;
        name?: Maybe<Scalars['String']>;
        oldest_review_date?: Maybe<Scalars['timestamptz']>;
        photos?: Maybe<Scalars['jsonb']>;
        price_range?: Maybe<Scalars['String']>;
        rating?: Maybe<Scalars['numeric']>;
        rating_factors?: Maybe<Scalars['jsonb']>;
        score?: Maybe<Scalars['numeric']>;
        score_breakdown?: Maybe<Scalars['jsonb']>;
        slug?: Maybe<Scalars['String']>;
        source_breakdown?: Maybe<Scalars['jsonb']>;
        sources?: Maybe<Scalars['jsonb']>;
        state?: Maybe<Scalars['String']>;
        summary?: Maybe<Scalars['String']>;
        tag_names?: Maybe<Scalars['jsonb']>;
        telephone?: Maybe<Scalars['String']>;
        updated_at?: Maybe<Scalars['timestamptz']>;
        upvotes?: Maybe<Scalars['numeric']>;
        votes_ratio?: Maybe<Scalars['numeric']>;
        website?: Maybe<Scalars['String']>;
        zip?: Maybe<Scalars['numeric']>;
    }
    export interface restaurant_stddev_order_by {
        downvotes?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        score?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
        zip?: Maybe<order_by>;
    }
    export interface restaurant_stddev_pop_order_by {
        downvotes?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        score?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
        zip?: Maybe<order_by>;
    }
    export interface restaurant_stddev_samp_order_by {
        downvotes?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        score?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
        zip?: Maybe<order_by>;
    }
    export interface restaurant_sum_order_by {
        downvotes?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        score?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
        zip?: Maybe<order_by>;
    }
    export interface restaurant_tag_aggregate_order_by {
        avg?: Maybe<restaurant_tag_avg_order_by>;
        count?: Maybe<order_by>;
        max?: Maybe<restaurant_tag_max_order_by>;
        min?: Maybe<restaurant_tag_min_order_by>;
        stddev?: Maybe<restaurant_tag_stddev_order_by>;
        stddev_pop?: Maybe<restaurant_tag_stddev_pop_order_by>;
        stddev_samp?: Maybe<restaurant_tag_stddev_samp_order_by>;
        sum?: Maybe<restaurant_tag_sum_order_by>;
        var_pop?: Maybe<restaurant_tag_var_pop_order_by>;
        var_samp?: Maybe<restaurant_tag_var_samp_order_by>;
        variance?: Maybe<restaurant_tag_variance_order_by>;
    }
    export interface restaurant_tag_append_input {
        photos?: Maybe<Scalars['jsonb']>;
        score_breakdown?: Maybe<Scalars['jsonb']>;
        source_breakdown?: Maybe<Scalars['jsonb']>;
    }
    export interface restaurant_tag_arr_rel_insert_input {
        data: Array<restaurant_tag_insert_input>;
        on_conflict?: Maybe<restaurant_tag_on_conflict>;
    }
    export interface restaurant_tag_avg_order_by {
        downvotes?: Maybe<order_by>;
        rank?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        review_mentions_count?: Maybe<order_by>;
        score?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
    }
    export interface restaurant_tag_bool_exp {
        _and?: Maybe<Array<Maybe<restaurant_tag_bool_exp>>>;
        _not?: Maybe<restaurant_tag_bool_exp>;
        _or?: Maybe<Array<Maybe<restaurant_tag_bool_exp>>>;
        downvotes?: Maybe<numeric_comparison_exp>;
        id?: Maybe<uuid_comparison_exp>;
        photos?: Maybe<jsonb_comparison_exp>;
        rank?: Maybe<Int_comparison_exp>;
        rating?: Maybe<numeric_comparison_exp>;
        restaurant?: Maybe<restaurant_bool_exp>;
        restaurant_id?: Maybe<uuid_comparison_exp>;
        review_mentions_count?: Maybe<numeric_comparison_exp>;
        reviews?: Maybe<review_bool_exp>;
        score?: Maybe<numeric_comparison_exp>;
        score_breakdown?: Maybe<jsonb_comparison_exp>;
        sentences?: Maybe<review_tag_sentence_bool_exp>;
        source_breakdown?: Maybe<jsonb_comparison_exp>;
        tag?: Maybe<tag_bool_exp>;
        tag_id?: Maybe<uuid_comparison_exp>;
        upvotes?: Maybe<numeric_comparison_exp>;
        votes_ratio?: Maybe<numeric_comparison_exp>;
    }
    export enum restaurant_tag_constraint {
        restaurant_tag_id_key = "restaurant_tag_id_key",
        restaurant_tag_pkey = "restaurant_tag_pkey"
    }
    export interface restaurant_tag_delete_at_path_input {
        photos?: Maybe<Array<Maybe<Scalars['String']>>>;
        score_breakdown?: Maybe<Array<Maybe<Scalars['String']>>>;
        source_breakdown?: Maybe<Array<Maybe<Scalars['String']>>>;
    }
    export interface restaurant_tag_delete_elem_input {
        photos?: Maybe<Scalars['Int']>;
        score_breakdown?: Maybe<Scalars['Int']>;
        source_breakdown?: Maybe<Scalars['Int']>;
    }
    export interface restaurant_tag_delete_key_input {
        photos?: Maybe<Scalars['String']>;
        score_breakdown?: Maybe<Scalars['String']>;
        source_breakdown?: Maybe<Scalars['String']>;
    }
    export interface restaurant_tag_inc_input {
        downvotes?: Maybe<Scalars['numeric']>;
        rank?: Maybe<Scalars['Int']>;
        rating?: Maybe<Scalars['numeric']>;
        review_mentions_count?: Maybe<Scalars['numeric']>;
        score?: Maybe<Scalars['numeric']>;
        upvotes?: Maybe<Scalars['numeric']>;
        votes_ratio?: Maybe<Scalars['numeric']>;
    }
    export interface restaurant_tag_insert_input {
        downvotes?: Maybe<Scalars['numeric']>;
        id?: Maybe<Scalars['uuid']>;
        photos?: Maybe<Scalars['jsonb']>;
        rank?: Maybe<Scalars['Int']>;
        rating?: Maybe<Scalars['numeric']>;
        restaurant?: Maybe<restaurant_obj_rel_insert_input>;
        restaurant_id?: Maybe<Scalars['uuid']>;
        review_mentions_count?: Maybe<Scalars['numeric']>;
        reviews?: Maybe<review_arr_rel_insert_input>;
        score?: Maybe<Scalars['numeric']>;
        score_breakdown?: Maybe<Scalars['jsonb']>;
        sentences?: Maybe<review_tag_sentence_arr_rel_insert_input>;
        source_breakdown?: Maybe<Scalars['jsonb']>;
        tag?: Maybe<tag_obj_rel_insert_input>;
        tag_id?: Maybe<Scalars['uuid']>;
        upvotes?: Maybe<Scalars['numeric']>;
        votes_ratio?: Maybe<Scalars['numeric']>;
    }
    export interface restaurant_tag_max_order_by {
        downvotes?: Maybe<order_by>;
        id?: Maybe<order_by>;
        rank?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        restaurant_id?: Maybe<order_by>;
        review_mentions_count?: Maybe<order_by>;
        score?: Maybe<order_by>;
        tag_id?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
    }
    export interface restaurant_tag_min_order_by {
        downvotes?: Maybe<order_by>;
        id?: Maybe<order_by>;
        rank?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        restaurant_id?: Maybe<order_by>;
        review_mentions_count?: Maybe<order_by>;
        score?: Maybe<order_by>;
        tag_id?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
    }
    export interface restaurant_tag_obj_rel_insert_input {
        data: restaurant_tag_insert_input;
        on_conflict?: Maybe<restaurant_tag_on_conflict>;
    }
    export interface restaurant_tag_on_conflict {
        constraint: restaurant_tag_constraint;
        update_columns: Array<restaurant_tag_update_column>;
        where?: Maybe<restaurant_tag_bool_exp>;
    }
    export interface restaurant_tag_order_by {
        downvotes?: Maybe<order_by>;
        id?: Maybe<order_by>;
        photos?: Maybe<order_by>;
        rank?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        restaurant?: Maybe<restaurant_order_by>;
        restaurant_id?: Maybe<order_by>;
        review_mentions_count?: Maybe<order_by>;
        reviews_aggregate?: Maybe<review_aggregate_order_by>;
        score?: Maybe<order_by>;
        score_breakdown?: Maybe<order_by>;
        sentences_aggregate?: Maybe<review_tag_sentence_aggregate_order_by>;
        source_breakdown?: Maybe<order_by>;
        tag?: Maybe<tag_order_by>;
        tag_id?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
    }
    export interface restaurant_tag_pk_columns_input {
        restaurant_id: Scalars['uuid'];
        tag_id: Scalars['uuid'];
    }
    export interface restaurant_tag_prepend_input {
        photos?: Maybe<Scalars['jsonb']>;
        score_breakdown?: Maybe<Scalars['jsonb']>;
        source_breakdown?: Maybe<Scalars['jsonb']>;
    }
    export enum restaurant_tag_select_column {
        downvotes = "downvotes",
        id = "id",
        photos = "photos",
        rank = "rank",
        rating = "rating",
        restaurant_id = "restaurant_id",
        review_mentions_count = "review_mentions_count",
        score = "score",
        score_breakdown = "score_breakdown",
        source_breakdown = "source_breakdown",
        tag_id = "tag_id",
        upvotes = "upvotes",
        votes_ratio = "votes_ratio"
    }
    export interface restaurant_tag_set_input {
        downvotes?: Maybe<Scalars['numeric']>;
        id?: Maybe<Scalars['uuid']>;
        photos?: Maybe<Scalars['jsonb']>;
        rank?: Maybe<Scalars['Int']>;
        rating?: Maybe<Scalars['numeric']>;
        restaurant_id?: Maybe<Scalars['uuid']>;
        review_mentions_count?: Maybe<Scalars['numeric']>;
        score?: Maybe<Scalars['numeric']>;
        score_breakdown?: Maybe<Scalars['jsonb']>;
        source_breakdown?: Maybe<Scalars['jsonb']>;
        tag_id?: Maybe<Scalars['uuid']>;
        upvotes?: Maybe<Scalars['numeric']>;
        votes_ratio?: Maybe<Scalars['numeric']>;
    }
    export interface restaurant_tag_stddev_order_by {
        downvotes?: Maybe<order_by>;
        rank?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        review_mentions_count?: Maybe<order_by>;
        score?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
    }
    export interface restaurant_tag_stddev_pop_order_by {
        downvotes?: Maybe<order_by>;
        rank?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        review_mentions_count?: Maybe<order_by>;
        score?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
    }
    export interface restaurant_tag_stddev_samp_order_by {
        downvotes?: Maybe<order_by>;
        rank?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        review_mentions_count?: Maybe<order_by>;
        score?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
    }
    export interface restaurant_tag_sum_order_by {
        downvotes?: Maybe<order_by>;
        rank?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        review_mentions_count?: Maybe<order_by>;
        score?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
    }
    export enum restaurant_tag_update_column {
        downvotes = "downvotes",
        id = "id",
        photos = "photos",
        rank = "rank",
        rating = "rating",
        restaurant_id = "restaurant_id",
        review_mentions_count = "review_mentions_count",
        score = "score",
        score_breakdown = "score_breakdown",
        source_breakdown = "source_breakdown",
        tag_id = "tag_id",
        upvotes = "upvotes",
        votes_ratio = "votes_ratio"
    }
    export interface restaurant_tag_var_pop_order_by {
        downvotes?: Maybe<order_by>;
        rank?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        review_mentions_count?: Maybe<order_by>;
        score?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
    }
    export interface restaurant_tag_var_samp_order_by {
        downvotes?: Maybe<order_by>;
        rank?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        review_mentions_count?: Maybe<order_by>;
        score?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
    }
    export interface restaurant_tag_variance_order_by {
        downvotes?: Maybe<order_by>;
        rank?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        review_mentions_count?: Maybe<order_by>;
        score?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
    }
    export interface restaurant_top_tags_args {
        _tag_types?: Maybe<Scalars['String']>;
        tag_slugs?: Maybe<Scalars['String']>;
    }
    export interface restaurant_trending_args {
        region_slug?: Maybe<Scalars['String']>;
    }
    export enum restaurant_update_column {
        address = "address",
        city = "city",
        created_at = "created_at",
        description = "description",
        downvotes = "downvotes",
        geocoder_id = "geocoder_id",
        headlines = "headlines",
        hours = "hours",
        id = "id",
        image = "image",
        location = "location",
        name = "name",
        oldest_review_date = "oldest_review_date",
        photos = "photos",
        price_range = "price_range",
        rating = "rating",
        rating_factors = "rating_factors",
        score = "score",
        score_breakdown = "score_breakdown",
        slug = "slug",
        source_breakdown = "source_breakdown",
        sources = "sources",
        state = "state",
        summary = "summary",
        tag_names = "tag_names",
        telephone = "telephone",
        updated_at = "updated_at",
        upvotes = "upvotes",
        votes_ratio = "votes_ratio",
        website = "website",
        zip = "zip"
    }
    export interface restaurant_var_pop_order_by {
        downvotes?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        score?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
        zip?: Maybe<order_by>;
    }
    export interface restaurant_var_samp_order_by {
        downvotes?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        score?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
        zip?: Maybe<order_by>;
    }
    export interface restaurant_variance_order_by {
        downvotes?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        score?: Maybe<order_by>;
        upvotes?: Maybe<order_by>;
        votes_ratio?: Maybe<order_by>;
        zip?: Maybe<order_by>;
    }
    export interface restaurant_with_tags_args {
        tag_slugs?: Maybe<Scalars['String']>;
    }
    export interface review_aggregate_order_by {
        avg?: Maybe<review_avg_order_by>;
        count?: Maybe<order_by>;
        max?: Maybe<review_max_order_by>;
        min?: Maybe<review_min_order_by>;
        stddev?: Maybe<review_stddev_order_by>;
        stddev_pop?: Maybe<review_stddev_pop_order_by>;
        stddev_samp?: Maybe<review_stddev_samp_order_by>;
        sum?: Maybe<review_sum_order_by>;
        var_pop?: Maybe<review_var_pop_order_by>;
        var_samp?: Maybe<review_var_samp_order_by>;
        variance?: Maybe<review_variance_order_by>;
    }
    export interface review_append_input {
        categories?: Maybe<Scalars['jsonb']>;
    }
    export interface review_arr_rel_insert_input {
        data: Array<review_insert_input>;
        on_conflict?: Maybe<review_on_conflict>;
    }
    export interface review_avg_order_by {
        rating?: Maybe<order_by>;
        vote?: Maybe<order_by>;
    }
    export interface review_bool_exp {
        _and?: Maybe<Array<Maybe<review_bool_exp>>>;
        _not?: Maybe<review_bool_exp>;
        _or?: Maybe<Array<Maybe<review_bool_exp>>>;
        authored_at?: Maybe<timestamptz_comparison_exp>;
        categories?: Maybe<jsonb_comparison_exp>;
        favorited?: Maybe<Boolean_comparison_exp>;
        id?: Maybe<uuid_comparison_exp>;
        list_id?: Maybe<uuid_comparison_exp>;
        location?: Maybe<geometry_comparison_exp>;
        native_data_unique_key?: Maybe<String_comparison_exp>;
        rating?: Maybe<numeric_comparison_exp>;
        restaurant?: Maybe<restaurant_bool_exp>;
        restaurant_id?: Maybe<uuid_comparison_exp>;
        sentiments?: Maybe<review_tag_sentence_bool_exp>;
        source?: Maybe<String_comparison_exp>;
        tag?: Maybe<tag_bool_exp>;
        tag_id?: Maybe<uuid_comparison_exp>;
        text?: Maybe<String_comparison_exp>;
        type?: Maybe<String_comparison_exp>;
        updated_at?: Maybe<timestamptz_comparison_exp>;
        user?: Maybe<user_bool_exp>;
        user_id?: Maybe<uuid_comparison_exp>;
        username?: Maybe<String_comparison_exp>;
        vote?: Maybe<numeric_comparison_exp>;
    }
    export enum review_constraint {
        review_native_data_unique_constraint = "review_native_data_unique_constraint",
        review_native_data_unique_key_key = "review_native_data_unique_key_key",
        review_pkey = "review_pkey",
        review_username_restaurant_id_tag_id_authored_at_key = "review_username_restaurant_id_tag_id_authored_at_key"
    }
    export interface review_delete_at_path_input {
        categories?: Maybe<Array<Maybe<Scalars['String']>>>;
    }
    export interface review_delete_elem_input {
        categories?: Maybe<Scalars['Int']>;
    }
    export interface review_delete_key_input {
        categories?: Maybe<Scalars['String']>;
    }
    export interface review_inc_input {
        rating?: Maybe<Scalars['numeric']>;
        vote?: Maybe<Scalars['numeric']>;
    }
    export interface review_insert_input {
        authored_at?: Maybe<Scalars['timestamptz']>;
        categories?: Maybe<Scalars['jsonb']>;
        favorited?: Maybe<Scalars['Boolean']>;
        id?: Maybe<Scalars['uuid']>;
        list_id?: Maybe<Scalars['uuid']>;
        location?: Maybe<Scalars['geometry']>;
        native_data_unique_key?: Maybe<Scalars['String']>;
        rating?: Maybe<Scalars['numeric']>;
        restaurant?: Maybe<restaurant_obj_rel_insert_input>;
        restaurant_id?: Maybe<Scalars['uuid']>;
        sentiments?: Maybe<review_tag_sentence_arr_rel_insert_input>;
        source?: Maybe<Scalars['String']>;
        tag?: Maybe<tag_obj_rel_insert_input>;
        tag_id?: Maybe<Scalars['uuid']>;
        text?: Maybe<Scalars['String']>;
        type?: Maybe<Scalars['String']>;
        updated_at?: Maybe<Scalars['timestamptz']>;
        user?: Maybe<user_obj_rel_insert_input>;
        user_id?: Maybe<Scalars['uuid']>;
        username?: Maybe<Scalars['String']>;
        vote?: Maybe<Scalars['numeric']>;
    }
    export interface review_max_order_by {
        authored_at?: Maybe<order_by>;
        id?: Maybe<order_by>;
        list_id?: Maybe<order_by>;
        native_data_unique_key?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        restaurant_id?: Maybe<order_by>;
        source?: Maybe<order_by>;
        tag_id?: Maybe<order_by>;
        text?: Maybe<order_by>;
        type?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
        user_id?: Maybe<order_by>;
        username?: Maybe<order_by>;
        vote?: Maybe<order_by>;
    }
    export interface review_min_order_by {
        authored_at?: Maybe<order_by>;
        id?: Maybe<order_by>;
        list_id?: Maybe<order_by>;
        native_data_unique_key?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        restaurant_id?: Maybe<order_by>;
        source?: Maybe<order_by>;
        tag_id?: Maybe<order_by>;
        text?: Maybe<order_by>;
        type?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
        user_id?: Maybe<order_by>;
        username?: Maybe<order_by>;
        vote?: Maybe<order_by>;
    }
    export interface review_obj_rel_insert_input {
        data: review_insert_input;
        on_conflict?: Maybe<review_on_conflict>;
    }
    export interface review_on_conflict {
        constraint: review_constraint;
        update_columns: Array<review_update_column>;
        where?: Maybe<review_bool_exp>;
    }
    export interface review_order_by {
        authored_at?: Maybe<order_by>;
        categories?: Maybe<order_by>;
        favorited?: Maybe<order_by>;
        id?: Maybe<order_by>;
        list_id?: Maybe<order_by>;
        location?: Maybe<order_by>;
        native_data_unique_key?: Maybe<order_by>;
        rating?: Maybe<order_by>;
        restaurant?: Maybe<restaurant_order_by>;
        restaurant_id?: Maybe<order_by>;
        sentiments_aggregate?: Maybe<review_tag_sentence_aggregate_order_by>;
        source?: Maybe<order_by>;
        tag?: Maybe<tag_order_by>;
        tag_id?: Maybe<order_by>;
        text?: Maybe<order_by>;
        type?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
        user?: Maybe<user_order_by>;
        user_id?: Maybe<order_by>;
        username?: Maybe<order_by>;
        vote?: Maybe<order_by>;
    }
    export interface review_pk_columns_input {
        id: Scalars['uuid'];
    }
    export interface review_prepend_input {
        categories?: Maybe<Scalars['jsonb']>;
    }
    export enum review_select_column {
        authored_at = "authored_at",
        categories = "categories",
        favorited = "favorited",
        id = "id",
        list_id = "list_id",
        location = "location",
        native_data_unique_key = "native_data_unique_key",
        rating = "rating",
        restaurant_id = "restaurant_id",
        source = "source",
        tag_id = "tag_id",
        text = "text",
        type = "type",
        updated_at = "updated_at",
        user_id = "user_id",
        username = "username",
        vote = "vote"
    }
    export interface review_set_input {
        authored_at?: Maybe<Scalars['timestamptz']>;
        categories?: Maybe<Scalars['jsonb']>;
        favorited?: Maybe<Scalars['Boolean']>;
        id?: Maybe<Scalars['uuid']>;
        list_id?: Maybe<Scalars['uuid']>;
        location?: Maybe<Scalars['geometry']>;
        native_data_unique_key?: Maybe<Scalars['String']>;
        rating?: Maybe<Scalars['numeric']>;
        restaurant_id?: Maybe<Scalars['uuid']>;
        source?: Maybe<Scalars['String']>;
        tag_id?: Maybe<Scalars['uuid']>;
        text?: Maybe<Scalars['String']>;
        type?: Maybe<Scalars['String']>;
        updated_at?: Maybe<Scalars['timestamptz']>;
        user_id?: Maybe<Scalars['uuid']>;
        username?: Maybe<Scalars['String']>;
        vote?: Maybe<Scalars['numeric']>;
    }
    export interface review_stddev_order_by {
        rating?: Maybe<order_by>;
        vote?: Maybe<order_by>;
    }
    export interface review_stddev_pop_order_by {
        rating?: Maybe<order_by>;
        vote?: Maybe<order_by>;
    }
    export interface review_stddev_samp_order_by {
        rating?: Maybe<order_by>;
        vote?: Maybe<order_by>;
    }
    export interface review_sum_order_by {
        rating?: Maybe<order_by>;
        vote?: Maybe<order_by>;
    }
    export interface review_tag_sentence_aggregate_order_by {
        avg?: Maybe<review_tag_sentence_avg_order_by>;
        count?: Maybe<order_by>;
        max?: Maybe<review_tag_sentence_max_order_by>;
        min?: Maybe<review_tag_sentence_min_order_by>;
        stddev?: Maybe<review_tag_sentence_stddev_order_by>;
        stddev_pop?: Maybe<review_tag_sentence_stddev_pop_order_by>;
        stddev_samp?: Maybe<review_tag_sentence_stddev_samp_order_by>;
        sum?: Maybe<review_tag_sentence_sum_order_by>;
        var_pop?: Maybe<review_tag_sentence_var_pop_order_by>;
        var_samp?: Maybe<review_tag_sentence_var_samp_order_by>;
        variance?: Maybe<review_tag_sentence_variance_order_by>;
    }
    export interface review_tag_sentence_arr_rel_insert_input {
        data: Array<review_tag_sentence_insert_input>;
        on_conflict?: Maybe<review_tag_sentence_on_conflict>;
    }
    export interface review_tag_sentence_avg_order_by {
        ml_sentiment?: Maybe<order_by>;
        naive_sentiment?: Maybe<order_by>;
    }
    export interface review_tag_sentence_bool_exp {
        _and?: Maybe<Array<Maybe<review_tag_sentence_bool_exp>>>;
        _not?: Maybe<review_tag_sentence_bool_exp>;
        _or?: Maybe<Array<Maybe<review_tag_sentence_bool_exp>>>;
        id?: Maybe<uuid_comparison_exp>;
        ml_sentiment?: Maybe<numeric_comparison_exp>;
        naive_sentiment?: Maybe<numeric_comparison_exp>;
        restaurant_id?: Maybe<uuid_comparison_exp>;
        review?: Maybe<review_bool_exp>;
        review_id?: Maybe<uuid_comparison_exp>;
        sentence?: Maybe<String_comparison_exp>;
        tag?: Maybe<tag_bool_exp>;
        tag_id?: Maybe<uuid_comparison_exp>;
    }
    export enum review_tag_sentence_constraint {
        review_tag_pkey = "review_tag_pkey",
        review_tag_tag_id_review_id_sentence_key = "review_tag_tag_id_review_id_sentence_key"
    }
    export interface review_tag_sentence_inc_input {
        ml_sentiment?: Maybe<Scalars['numeric']>;
        naive_sentiment?: Maybe<Scalars['numeric']>;
    }
    export interface review_tag_sentence_insert_input {
        id?: Maybe<Scalars['uuid']>;
        ml_sentiment?: Maybe<Scalars['numeric']>;
        naive_sentiment?: Maybe<Scalars['numeric']>;
        restaurant_id?: Maybe<Scalars['uuid']>;
        review?: Maybe<review_obj_rel_insert_input>;
        review_id?: Maybe<Scalars['uuid']>;
        sentence?: Maybe<Scalars['String']>;
        tag?: Maybe<tag_obj_rel_insert_input>;
        tag_id?: Maybe<Scalars['uuid']>;
    }
    export interface review_tag_sentence_max_order_by {
        id?: Maybe<order_by>;
        ml_sentiment?: Maybe<order_by>;
        naive_sentiment?: Maybe<order_by>;
        restaurant_id?: Maybe<order_by>;
        review_id?: Maybe<order_by>;
        sentence?: Maybe<order_by>;
        tag_id?: Maybe<order_by>;
    }
    export interface review_tag_sentence_min_order_by {
        id?: Maybe<order_by>;
        ml_sentiment?: Maybe<order_by>;
        naive_sentiment?: Maybe<order_by>;
        restaurant_id?: Maybe<order_by>;
        review_id?: Maybe<order_by>;
        sentence?: Maybe<order_by>;
        tag_id?: Maybe<order_by>;
    }
    export interface review_tag_sentence_obj_rel_insert_input {
        data: review_tag_sentence_insert_input;
        on_conflict?: Maybe<review_tag_sentence_on_conflict>;
    }
    export interface review_tag_sentence_on_conflict {
        constraint: review_tag_sentence_constraint;
        update_columns: Array<review_tag_sentence_update_column>;
        where?: Maybe<review_tag_sentence_bool_exp>;
    }
    export interface review_tag_sentence_order_by {
        id?: Maybe<order_by>;
        ml_sentiment?: Maybe<order_by>;
        naive_sentiment?: Maybe<order_by>;
        restaurant_id?: Maybe<order_by>;
        review?: Maybe<review_order_by>;
        review_id?: Maybe<order_by>;
        sentence?: Maybe<order_by>;
        tag?: Maybe<tag_order_by>;
        tag_id?: Maybe<order_by>;
    }
    export interface review_tag_sentence_pk_columns_input {
        id: Scalars['uuid'];
    }
    export enum review_tag_sentence_select_column {
        id = "id",
        ml_sentiment = "ml_sentiment",
        naive_sentiment = "naive_sentiment",
        restaurant_id = "restaurant_id",
        review_id = "review_id",
        sentence = "sentence",
        tag_id = "tag_id"
    }
    export interface review_tag_sentence_set_input {
        id?: Maybe<Scalars['uuid']>;
        ml_sentiment?: Maybe<Scalars['numeric']>;
        naive_sentiment?: Maybe<Scalars['numeric']>;
        restaurant_id?: Maybe<Scalars['uuid']>;
        review_id?: Maybe<Scalars['uuid']>;
        sentence?: Maybe<Scalars['String']>;
        tag_id?: Maybe<Scalars['uuid']>;
    }
    export interface review_tag_sentence_stddev_order_by {
        ml_sentiment?: Maybe<order_by>;
        naive_sentiment?: Maybe<order_by>;
    }
    export interface review_tag_sentence_stddev_pop_order_by {
        ml_sentiment?: Maybe<order_by>;
        naive_sentiment?: Maybe<order_by>;
    }
    export interface review_tag_sentence_stddev_samp_order_by {
        ml_sentiment?: Maybe<order_by>;
        naive_sentiment?: Maybe<order_by>;
    }
    export interface review_tag_sentence_sum_order_by {
        ml_sentiment?: Maybe<order_by>;
        naive_sentiment?: Maybe<order_by>;
    }
    export enum review_tag_sentence_update_column {
        id = "id",
        ml_sentiment = "ml_sentiment",
        naive_sentiment = "naive_sentiment",
        restaurant_id = "restaurant_id",
        review_id = "review_id",
        sentence = "sentence",
        tag_id = "tag_id"
    }
    export interface review_tag_sentence_var_pop_order_by {
        ml_sentiment?: Maybe<order_by>;
        naive_sentiment?: Maybe<order_by>;
    }
    export interface review_tag_sentence_var_samp_order_by {
        ml_sentiment?: Maybe<order_by>;
        naive_sentiment?: Maybe<order_by>;
    }
    export interface review_tag_sentence_variance_order_by {
        ml_sentiment?: Maybe<order_by>;
        naive_sentiment?: Maybe<order_by>;
    }
    export enum review_update_column {
        authored_at = "authored_at",
        categories = "categories",
        favorited = "favorited",
        id = "id",
        list_id = "list_id",
        location = "location",
        native_data_unique_key = "native_data_unique_key",
        rating = "rating",
        restaurant_id = "restaurant_id",
        source = "source",
        tag_id = "tag_id",
        text = "text",
        type = "type",
        updated_at = "updated_at",
        user_id = "user_id",
        username = "username",
        vote = "vote"
    }
    export interface review_var_pop_order_by {
        rating?: Maybe<order_by>;
        vote?: Maybe<order_by>;
    }
    export interface review_var_samp_order_by {
        rating?: Maybe<order_by>;
        vote?: Maybe<order_by>;
    }
    export interface review_variance_order_by {
        rating?: Maybe<order_by>;
        vote?: Maybe<order_by>;
    }
    export interface setting_aggregate_order_by {
        count?: Maybe<order_by>;
        max?: Maybe<setting_max_order_by>;
        min?: Maybe<setting_min_order_by>;
    }
    export interface setting_append_input {
        value?: Maybe<Scalars['jsonb']>;
    }
    export interface setting_arr_rel_insert_input {
        data: Array<setting_insert_input>;
        on_conflict?: Maybe<setting_on_conflict>;
    }
    export interface setting_bool_exp {
        _and?: Maybe<Array<Maybe<setting_bool_exp>>>;
        _not?: Maybe<setting_bool_exp>;
        _or?: Maybe<Array<Maybe<setting_bool_exp>>>;
        created_at?: Maybe<timestamptz_comparison_exp>;
        id?: Maybe<uuid_comparison_exp>;
        key?: Maybe<String_comparison_exp>;
        updated_at?: Maybe<timestamptz_comparison_exp>;
        value?: Maybe<jsonb_comparison_exp>;
    }
    export enum setting_constraint {
        setting_id_key = "setting_id_key",
        setting_pkey = "setting_pkey"
    }
    export interface setting_delete_at_path_input {
        value?: Maybe<Array<Maybe<Scalars['String']>>>;
    }
    export interface setting_delete_elem_input {
        value?: Maybe<Scalars['Int']>;
    }
    export interface setting_delete_key_input {
        value?: Maybe<Scalars['String']>;
    }
    export interface setting_insert_input {
        created_at?: Maybe<Scalars['timestamptz']>;
        id?: Maybe<Scalars['uuid']>;
        key?: Maybe<Scalars['String']>;
        updated_at?: Maybe<Scalars['timestamptz']>;
        value?: Maybe<Scalars['jsonb']>;
    }
    export interface setting_max_order_by {
        created_at?: Maybe<order_by>;
        id?: Maybe<order_by>;
        key?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
    }
    export interface setting_min_order_by {
        created_at?: Maybe<order_by>;
        id?: Maybe<order_by>;
        key?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
    }
    export interface setting_obj_rel_insert_input {
        data: setting_insert_input;
        on_conflict?: Maybe<setting_on_conflict>;
    }
    export interface setting_on_conflict {
        constraint: setting_constraint;
        update_columns: Array<setting_update_column>;
        where?: Maybe<setting_bool_exp>;
    }
    export interface setting_order_by {
        created_at?: Maybe<order_by>;
        id?: Maybe<order_by>;
        key?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
        value?: Maybe<order_by>;
    }
    export interface setting_pk_columns_input {
        key: Scalars['String'];
    }
    export interface setting_prepend_input {
        value?: Maybe<Scalars['jsonb']>;
    }
    export enum setting_select_column {
        created_at = "created_at",
        id = "id",
        key = "key",
        updated_at = "updated_at",
        value = "value"
    }
    export interface setting_set_input {
        created_at?: Maybe<Scalars['timestamptz']>;
        id?: Maybe<Scalars['uuid']>;
        key?: Maybe<Scalars['String']>;
        updated_at?: Maybe<Scalars['timestamptz']>;
        value?: Maybe<Scalars['jsonb']>;
    }
    export enum setting_update_column {
        created_at = "created_at",
        id = "id",
        key = "key",
        updated_at = "updated_at",
        value = "value"
    }
    export interface st_d_within_geography_input {
        distance: Scalars['Float'];
        from: Scalars['geography'];
        use_spheroid?: Maybe<Scalars['Boolean']>;
    }
    export interface st_d_within_input {
        distance: Scalars['Float'];
        from: Scalars['geometry'];
    }
    export interface tag_aggregate_order_by {
        avg?: Maybe<tag_avg_order_by>;
        count?: Maybe<order_by>;
        max?: Maybe<tag_max_order_by>;
        min?: Maybe<tag_min_order_by>;
        stddev?: Maybe<tag_stddev_order_by>;
        stddev_pop?: Maybe<tag_stddev_pop_order_by>;
        stddev_samp?: Maybe<tag_stddev_samp_order_by>;
        sum?: Maybe<tag_sum_order_by>;
        var_pop?: Maybe<tag_var_pop_order_by>;
        var_samp?: Maybe<tag_var_samp_order_by>;
        variance?: Maybe<tag_variance_order_by>;
    }
    export interface tag_append_input {
        alternates?: Maybe<Scalars['jsonb']>;
        default_images?: Maybe<Scalars['jsonb']>;
        misc?: Maybe<Scalars['jsonb']>;
        rgb?: Maybe<Scalars['jsonb']>;
    }
    export interface tag_arr_rel_insert_input {
        data: Array<tag_insert_input>;
        on_conflict?: Maybe<tag_on_conflict>;
    }
    export interface tag_avg_order_by {
        frequency?: Maybe<order_by>;
        order?: Maybe<order_by>;
        popularity?: Maybe<order_by>;
    }
    export interface tag_bool_exp {
        _and?: Maybe<Array<Maybe<tag_bool_exp>>>;
        _not?: Maybe<tag_bool_exp>;
        _or?: Maybe<Array<Maybe<tag_bool_exp>>>;
        alternates?: Maybe<jsonb_comparison_exp>;
        categories?: Maybe<tag_tag_bool_exp>;
        created_at?: Maybe<timestamptz_comparison_exp>;
        default_image?: Maybe<String_comparison_exp>;
        default_images?: Maybe<jsonb_comparison_exp>;
        description?: Maybe<String_comparison_exp>;
        displayName?: Maybe<String_comparison_exp>;
        frequency?: Maybe<Int_comparison_exp>;
        icon?: Maybe<String_comparison_exp>;
        id?: Maybe<uuid_comparison_exp>;
        is_ambiguous?: Maybe<Boolean_comparison_exp>;
        misc?: Maybe<jsonb_comparison_exp>;
        name?: Maybe<String_comparison_exp>;
        order?: Maybe<Int_comparison_exp>;
        parent?: Maybe<tag_bool_exp>;
        parentId?: Maybe<uuid_comparison_exp>;
        popularity?: Maybe<Int_comparison_exp>;
        restaurant_taxonomies?: Maybe<restaurant_tag_bool_exp>;
        rgb?: Maybe<jsonb_comparison_exp>;
        slug?: Maybe<String_comparison_exp>;
        type?: Maybe<String_comparison_exp>;
        updated_at?: Maybe<timestamptz_comparison_exp>;
    }
    export enum tag_constraint {
        tag_id_key1 = "tag_id_key1",
        tag_order_key = "tag_order_key",
        tag_parentId_name_key = "tag_parentId_name_key",
        tag_pkey = "tag_pkey",
        tag_slug_key = "tag_slug_key"
    }
    export interface tag_delete_at_path_input {
        alternates?: Maybe<Array<Maybe<Scalars['String']>>>;
        default_images?: Maybe<Array<Maybe<Scalars['String']>>>;
        misc?: Maybe<Array<Maybe<Scalars['String']>>>;
        rgb?: Maybe<Array<Maybe<Scalars['String']>>>;
    }
    export interface tag_delete_elem_input {
        alternates?: Maybe<Scalars['Int']>;
        default_images?: Maybe<Scalars['Int']>;
        misc?: Maybe<Scalars['Int']>;
        rgb?: Maybe<Scalars['Int']>;
    }
    export interface tag_delete_key_input {
        alternates?: Maybe<Scalars['String']>;
        default_images?: Maybe<Scalars['String']>;
        misc?: Maybe<Scalars['String']>;
        rgb?: Maybe<Scalars['String']>;
    }
    export interface tag_inc_input {
        frequency?: Maybe<Scalars['Int']>;
        order?: Maybe<Scalars['Int']>;
        popularity?: Maybe<Scalars['Int']>;
    }
    export interface tag_insert_input {
        alternates?: Maybe<Scalars['jsonb']>;
        categories?: Maybe<tag_tag_arr_rel_insert_input>;
        created_at?: Maybe<Scalars['timestamptz']>;
        default_image?: Maybe<Scalars['String']>;
        default_images?: Maybe<Scalars['jsonb']>;
        description?: Maybe<Scalars['String']>;
        displayName?: Maybe<Scalars['String']>;
        frequency?: Maybe<Scalars['Int']>;
        icon?: Maybe<Scalars['String']>;
        id?: Maybe<Scalars['uuid']>;
        is_ambiguous?: Maybe<Scalars['Boolean']>;
        misc?: Maybe<Scalars['jsonb']>;
        name?: Maybe<Scalars['String']>;
        order?: Maybe<Scalars['Int']>;
        parent?: Maybe<tag_obj_rel_insert_input>;
        parentId?: Maybe<Scalars['uuid']>;
        popularity?: Maybe<Scalars['Int']>;
        restaurant_taxonomies?: Maybe<restaurant_tag_arr_rel_insert_input>;
        rgb?: Maybe<Scalars['jsonb']>;
        slug?: Maybe<Scalars['String']>;
        type?: Maybe<Scalars['String']>;
        updated_at?: Maybe<Scalars['timestamptz']>;
    }
    export interface tag_max_order_by {
        created_at?: Maybe<order_by>;
        default_image?: Maybe<order_by>;
        description?: Maybe<order_by>;
        displayName?: Maybe<order_by>;
        frequency?: Maybe<order_by>;
        icon?: Maybe<order_by>;
        id?: Maybe<order_by>;
        name?: Maybe<order_by>;
        order?: Maybe<order_by>;
        parentId?: Maybe<order_by>;
        popularity?: Maybe<order_by>;
        slug?: Maybe<order_by>;
        type?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
    }
    export interface tag_min_order_by {
        created_at?: Maybe<order_by>;
        default_image?: Maybe<order_by>;
        description?: Maybe<order_by>;
        displayName?: Maybe<order_by>;
        frequency?: Maybe<order_by>;
        icon?: Maybe<order_by>;
        id?: Maybe<order_by>;
        name?: Maybe<order_by>;
        order?: Maybe<order_by>;
        parentId?: Maybe<order_by>;
        popularity?: Maybe<order_by>;
        slug?: Maybe<order_by>;
        type?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
    }
    export interface tag_obj_rel_insert_input {
        data: tag_insert_input;
        on_conflict?: Maybe<tag_on_conflict>;
    }
    export interface tag_on_conflict {
        constraint: tag_constraint;
        update_columns: Array<tag_update_column>;
        where?: Maybe<tag_bool_exp>;
    }
    export interface tag_order_by {
        alternates?: Maybe<order_by>;
        categories_aggregate?: Maybe<tag_tag_aggregate_order_by>;
        created_at?: Maybe<order_by>;
        default_image?: Maybe<order_by>;
        default_images?: Maybe<order_by>;
        description?: Maybe<order_by>;
        displayName?: Maybe<order_by>;
        frequency?: Maybe<order_by>;
        icon?: Maybe<order_by>;
        id?: Maybe<order_by>;
        is_ambiguous?: Maybe<order_by>;
        misc?: Maybe<order_by>;
        name?: Maybe<order_by>;
        order?: Maybe<order_by>;
        parent?: Maybe<tag_order_by>;
        parentId?: Maybe<order_by>;
        popularity?: Maybe<order_by>;
        restaurant_taxonomies_aggregate?: Maybe<restaurant_tag_aggregate_order_by>;
        rgb?: Maybe<order_by>;
        slug?: Maybe<order_by>;
        type?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
    }
    export interface tag_pk_columns_input {
        id: Scalars['uuid'];
    }
    export interface tag_prepend_input {
        alternates?: Maybe<Scalars['jsonb']>;
        default_images?: Maybe<Scalars['jsonb']>;
        misc?: Maybe<Scalars['jsonb']>;
        rgb?: Maybe<Scalars['jsonb']>;
    }
    export enum tag_select_column {
        alternates = "alternates",
        created_at = "created_at",
        default_image = "default_image",
        default_images = "default_images",
        description = "description",
        displayName = "displayName",
        frequency = "frequency",
        icon = "icon",
        id = "id",
        is_ambiguous = "is_ambiguous",
        misc = "misc",
        name = "name",
        order = "order",
        parentId = "parentId",
        popularity = "popularity",
        rgb = "rgb",
        slug = "slug",
        type = "type",
        updated_at = "updated_at"
    }
    export interface tag_set_input {
        alternates?: Maybe<Scalars['jsonb']>;
        created_at?: Maybe<Scalars['timestamptz']>;
        default_image?: Maybe<Scalars['String']>;
        default_images?: Maybe<Scalars['jsonb']>;
        description?: Maybe<Scalars['String']>;
        displayName?: Maybe<Scalars['String']>;
        frequency?: Maybe<Scalars['Int']>;
        icon?: Maybe<Scalars['String']>;
        id?: Maybe<Scalars['uuid']>;
        is_ambiguous?: Maybe<Scalars['Boolean']>;
        misc?: Maybe<Scalars['jsonb']>;
        name?: Maybe<Scalars['String']>;
        order?: Maybe<Scalars['Int']>;
        parentId?: Maybe<Scalars['uuid']>;
        popularity?: Maybe<Scalars['Int']>;
        rgb?: Maybe<Scalars['jsonb']>;
        slug?: Maybe<Scalars['String']>;
        type?: Maybe<Scalars['String']>;
        updated_at?: Maybe<Scalars['timestamptz']>;
    }
    export interface tag_stddev_order_by {
        frequency?: Maybe<order_by>;
        order?: Maybe<order_by>;
        popularity?: Maybe<order_by>;
    }
    export interface tag_stddev_pop_order_by {
        frequency?: Maybe<order_by>;
        order?: Maybe<order_by>;
        popularity?: Maybe<order_by>;
    }
    export interface tag_stddev_samp_order_by {
        frequency?: Maybe<order_by>;
        order?: Maybe<order_by>;
        popularity?: Maybe<order_by>;
    }
    export interface tag_sum_order_by {
        frequency?: Maybe<order_by>;
        order?: Maybe<order_by>;
        popularity?: Maybe<order_by>;
    }
    export interface tag_tag_aggregate_order_by {
        count?: Maybe<order_by>;
        max?: Maybe<tag_tag_max_order_by>;
        min?: Maybe<tag_tag_min_order_by>;
    }
    export interface tag_tag_arr_rel_insert_input {
        data: Array<tag_tag_insert_input>;
        on_conflict?: Maybe<tag_tag_on_conflict>;
    }
    export interface tag_tag_bool_exp {
        _and?: Maybe<Array<Maybe<tag_tag_bool_exp>>>;
        _not?: Maybe<tag_tag_bool_exp>;
        _or?: Maybe<Array<Maybe<tag_tag_bool_exp>>>;
        category?: Maybe<tag_bool_exp>;
        category_tag_id?: Maybe<uuid_comparison_exp>;
        main?: Maybe<tag_bool_exp>;
        tag_id?: Maybe<uuid_comparison_exp>;
    }
    export enum tag_tag_constraint {
        tag_tag_pkey = "tag_tag_pkey"
    }
    export interface tag_tag_insert_input {
        category?: Maybe<tag_obj_rel_insert_input>;
        category_tag_id?: Maybe<Scalars['uuid']>;
        main?: Maybe<tag_obj_rel_insert_input>;
        tag_id?: Maybe<Scalars['uuid']>;
    }
    export interface tag_tag_max_order_by {
        category_tag_id?: Maybe<order_by>;
        tag_id?: Maybe<order_by>;
    }
    export interface tag_tag_min_order_by {
        category_tag_id?: Maybe<order_by>;
        tag_id?: Maybe<order_by>;
    }
    export interface tag_tag_obj_rel_insert_input {
        data: tag_tag_insert_input;
        on_conflict?: Maybe<tag_tag_on_conflict>;
    }
    export interface tag_tag_on_conflict {
        constraint: tag_tag_constraint;
        update_columns: Array<tag_tag_update_column>;
        where?: Maybe<tag_tag_bool_exp>;
    }
    export interface tag_tag_order_by {
        category?: Maybe<tag_order_by>;
        category_tag_id?: Maybe<order_by>;
        main?: Maybe<tag_order_by>;
        tag_id?: Maybe<order_by>;
    }
    export interface tag_tag_pk_columns_input {
        category_tag_id: Scalars['uuid'];
        tag_id: Scalars['uuid'];
    }
    export enum tag_tag_select_column {
        category_tag_id = "category_tag_id",
        tag_id = "tag_id"
    }
    export interface tag_tag_set_input {
        category_tag_id?: Maybe<Scalars['uuid']>;
        tag_id?: Maybe<Scalars['uuid']>;
    }
    export enum tag_tag_update_column {
        category_tag_id = "category_tag_id",
        tag_id = "tag_id"
    }
    export enum tag_update_column {
        alternates = "alternates",
        created_at = "created_at",
        default_image = "default_image",
        default_images = "default_images",
        description = "description",
        displayName = "displayName",
        frequency = "frequency",
        icon = "icon",
        id = "id",
        is_ambiguous = "is_ambiguous",
        misc = "misc",
        name = "name",
        order = "order",
        parentId = "parentId",
        popularity = "popularity",
        rgb = "rgb",
        slug = "slug",
        type = "type",
        updated_at = "updated_at"
    }
    export interface tag_var_pop_order_by {
        frequency?: Maybe<order_by>;
        order?: Maybe<order_by>;
        popularity?: Maybe<order_by>;
    }
    export interface tag_var_samp_order_by {
        frequency?: Maybe<order_by>;
        order?: Maybe<order_by>;
        popularity?: Maybe<order_by>;
    }
    export interface tag_variance_order_by {
        frequency?: Maybe<order_by>;
        order?: Maybe<order_by>;
        popularity?: Maybe<order_by>;
    }
    export interface timestamptz_comparison_exp {
        _eq?: Maybe<Scalars['timestamptz']>;
        _gt?: Maybe<Scalars['timestamptz']>;
        _gte?: Maybe<Scalars['timestamptz']>;
        _in?: Maybe<Array<Scalars['timestamptz']>>;
        _is_null?: Maybe<Scalars['Boolean']>;
        _lt?: Maybe<Scalars['timestamptz']>;
        _lte?: Maybe<Scalars['timestamptz']>;
        _neq?: Maybe<Scalars['timestamptz']>;
        _nin?: Maybe<Array<Scalars['timestamptz']>>;
    }
    export interface tsrange_comparison_exp {
        _eq?: Maybe<Scalars['tsrange']>;
        _gt?: Maybe<Scalars['tsrange']>;
        _gte?: Maybe<Scalars['tsrange']>;
        _in?: Maybe<Array<Scalars['tsrange']>>;
        _is_null?: Maybe<Scalars['Boolean']>;
        _lt?: Maybe<Scalars['tsrange']>;
        _lte?: Maybe<Scalars['tsrange']>;
        _neq?: Maybe<Scalars['tsrange']>;
        _nin?: Maybe<Array<Scalars['tsrange']>>;
    }
    export interface user_aggregate_order_by {
        avg?: Maybe<user_avg_order_by>;
        count?: Maybe<order_by>;
        max?: Maybe<user_max_order_by>;
        min?: Maybe<user_min_order_by>;
        stddev?: Maybe<user_stddev_order_by>;
        stddev_pop?: Maybe<user_stddev_pop_order_by>;
        stddev_samp?: Maybe<user_stddev_samp_order_by>;
        sum?: Maybe<user_sum_order_by>;
        var_pop?: Maybe<user_var_pop_order_by>;
        var_samp?: Maybe<user_var_samp_order_by>;
        variance?: Maybe<user_variance_order_by>;
    }
    export interface user_arr_rel_insert_input {
        data: Array<user_insert_input>;
        on_conflict?: Maybe<user_on_conflict>;
    }
    export interface user_avg_order_by {
        charIndex?: Maybe<order_by>;
    }
    export interface user_bool_exp {
        _and?: Maybe<Array<Maybe<user_bool_exp>>>;
        _not?: Maybe<user_bool_exp>;
        _or?: Maybe<Array<Maybe<user_bool_exp>>>;
        about?: Maybe<String_comparison_exp>;
        apple_email?: Maybe<String_comparison_exp>;
        apple_refresh_token?: Maybe<String_comparison_exp>;
        apple_token?: Maybe<String_comparison_exp>;
        apple_uid?: Maybe<String_comparison_exp>;
        avatar?: Maybe<String_comparison_exp>;
        charIndex?: Maybe<Int_comparison_exp>;
        created_at?: Maybe<timestamptz_comparison_exp>;
        email?: Maybe<String_comparison_exp>;
        has_onboarded?: Maybe<Boolean_comparison_exp>;
        id?: Maybe<uuid_comparison_exp>;
        lists?: Maybe<list_bool_exp>;
        location?: Maybe<String_comparison_exp>;
        name?: Maybe<String_comparison_exp>;
        password?: Maybe<String_comparison_exp>;
        password_reset_date?: Maybe<timestamptz_comparison_exp>;
        password_reset_token?: Maybe<String_comparison_exp>;
        reviews?: Maybe<review_bool_exp>;
        role?: Maybe<String_comparison_exp>;
        updated_at?: Maybe<timestamptz_comparison_exp>;
        username?: Maybe<String_comparison_exp>;
    }
    export enum user_constraint {
        user_email_key = "user_email_key",
        user_pkey = "user_pkey",
        user_username_key = "user_username_key"
    }
    export interface user_inc_input {
        charIndex?: Maybe<Scalars['Int']>;
    }
    export interface user_insert_input {
        about?: Maybe<Scalars['String']>;
        apple_email?: Maybe<Scalars['String']>;
        apple_refresh_token?: Maybe<Scalars['String']>;
        apple_token?: Maybe<Scalars['String']>;
        apple_uid?: Maybe<Scalars['String']>;
        avatar?: Maybe<Scalars['String']>;
        charIndex?: Maybe<Scalars['Int']>;
        created_at?: Maybe<Scalars['timestamptz']>;
        email?: Maybe<Scalars['String']>;
        has_onboarded?: Maybe<Scalars['Boolean']>;
        id?: Maybe<Scalars['uuid']>;
        lists?: Maybe<list_arr_rel_insert_input>;
        location?: Maybe<Scalars['String']>;
        name?: Maybe<Scalars['String']>;
        password?: Maybe<Scalars['String']>;
        password_reset_date?: Maybe<Scalars['timestamptz']>;
        password_reset_token?: Maybe<Scalars['String']>;
        reviews?: Maybe<review_arr_rel_insert_input>;
        role?: Maybe<Scalars['String']>;
        updated_at?: Maybe<Scalars['timestamptz']>;
        username?: Maybe<Scalars['String']>;
    }
    export interface user_max_order_by {
        about?: Maybe<order_by>;
        apple_email?: Maybe<order_by>;
        apple_refresh_token?: Maybe<order_by>;
        apple_token?: Maybe<order_by>;
        apple_uid?: Maybe<order_by>;
        avatar?: Maybe<order_by>;
        charIndex?: Maybe<order_by>;
        created_at?: Maybe<order_by>;
        email?: Maybe<order_by>;
        id?: Maybe<order_by>;
        location?: Maybe<order_by>;
        name?: Maybe<order_by>;
        password?: Maybe<order_by>;
        password_reset_date?: Maybe<order_by>;
        password_reset_token?: Maybe<order_by>;
        role?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
        username?: Maybe<order_by>;
    }
    export interface user_min_order_by {
        about?: Maybe<order_by>;
        apple_email?: Maybe<order_by>;
        apple_refresh_token?: Maybe<order_by>;
        apple_token?: Maybe<order_by>;
        apple_uid?: Maybe<order_by>;
        avatar?: Maybe<order_by>;
        charIndex?: Maybe<order_by>;
        created_at?: Maybe<order_by>;
        email?: Maybe<order_by>;
        id?: Maybe<order_by>;
        location?: Maybe<order_by>;
        name?: Maybe<order_by>;
        password?: Maybe<order_by>;
        password_reset_date?: Maybe<order_by>;
        password_reset_token?: Maybe<order_by>;
        role?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
        username?: Maybe<order_by>;
    }
    export interface user_obj_rel_insert_input {
        data: user_insert_input;
        on_conflict?: Maybe<user_on_conflict>;
    }
    export interface user_on_conflict {
        constraint: user_constraint;
        update_columns: Array<user_update_column>;
        where?: Maybe<user_bool_exp>;
    }
    export interface user_order_by {
        about?: Maybe<order_by>;
        apple_email?: Maybe<order_by>;
        apple_refresh_token?: Maybe<order_by>;
        apple_token?: Maybe<order_by>;
        apple_uid?: Maybe<order_by>;
        avatar?: Maybe<order_by>;
        charIndex?: Maybe<order_by>;
        created_at?: Maybe<order_by>;
        email?: Maybe<order_by>;
        has_onboarded?: Maybe<order_by>;
        id?: Maybe<order_by>;
        lists_aggregate?: Maybe<list_aggregate_order_by>;
        location?: Maybe<order_by>;
        name?: Maybe<order_by>;
        password?: Maybe<order_by>;
        password_reset_date?: Maybe<order_by>;
        password_reset_token?: Maybe<order_by>;
        reviews_aggregate?: Maybe<review_aggregate_order_by>;
        role?: Maybe<order_by>;
        updated_at?: Maybe<order_by>;
        username?: Maybe<order_by>;
    }
    export interface user_pk_columns_input {
        id: Scalars['uuid'];
    }
    export enum user_select_column {
        about = "about",
        apple_email = "apple_email",
        apple_refresh_token = "apple_refresh_token",
        apple_token = "apple_token",
        apple_uid = "apple_uid",
        avatar = "avatar",
        charIndex = "charIndex",
        created_at = "created_at",
        email = "email",
        has_onboarded = "has_onboarded",
        id = "id",
        location = "location",
        name = "name",
        password = "password",
        password_reset_date = "password_reset_date",
        password_reset_token = "password_reset_token",
        role = "role",
        updated_at = "updated_at",
        username = "username"
    }
    export interface user_set_input {
        about?: Maybe<Scalars['String']>;
        apple_email?: Maybe<Scalars['String']>;
        apple_refresh_token?: Maybe<Scalars['String']>;
        apple_token?: Maybe<Scalars['String']>;
        apple_uid?: Maybe<Scalars['String']>;
        avatar?: Maybe<Scalars['String']>;
        charIndex?: Maybe<Scalars['Int']>;
        created_at?: Maybe<Scalars['timestamptz']>;
        email?: Maybe<Scalars['String']>;
        has_onboarded?: Maybe<Scalars['Boolean']>;
        id?: Maybe<Scalars['uuid']>;
        location?: Maybe<Scalars['String']>;
        name?: Maybe<Scalars['String']>;
        password?: Maybe<Scalars['String']>;
        password_reset_date?: Maybe<Scalars['timestamptz']>;
        password_reset_token?: Maybe<Scalars['String']>;
        role?: Maybe<Scalars['String']>;
        updated_at?: Maybe<Scalars['timestamptz']>;
        username?: Maybe<Scalars['String']>;
    }
    export interface user_stddev_order_by {
        charIndex?: Maybe<order_by>;
    }
    export interface user_stddev_pop_order_by {
        charIndex?: Maybe<order_by>;
    }
    export interface user_stddev_samp_order_by {
        charIndex?: Maybe<order_by>;
    }
    export interface user_sum_order_by {
        charIndex?: Maybe<order_by>;
    }
    export enum user_update_column {
        about = "about",
        apple_email = "apple_email",
        apple_refresh_token = "apple_refresh_token",
        apple_token = "apple_token",
        apple_uid = "apple_uid",
        avatar = "avatar",
        charIndex = "charIndex",
        created_at = "created_at",
        email = "email",
        has_onboarded = "has_onboarded",
        id = "id",
        location = "location",
        name = "name",
        password = "password",
        password_reset_date = "password_reset_date",
        password_reset_token = "password_reset_token",
        role = "role",
        updated_at = "updated_at",
        username = "username"
    }
    export interface user_var_pop_order_by {
        charIndex?: Maybe<order_by>;
    }
    export interface user_var_samp_order_by {
        charIndex?: Maybe<order_by>;
    }
    export interface user_variance_order_by {
        charIndex?: Maybe<order_by>;
    }
    export interface uuid_comparison_exp {
        _eq?: Maybe<Scalars['uuid']>;
        _gt?: Maybe<Scalars['uuid']>;
        _gte?: Maybe<Scalars['uuid']>;
        _in?: Maybe<Array<Scalars['uuid']>>;
        _is_null?: Maybe<Scalars['Boolean']>;
        _lt?: Maybe<Scalars['uuid']>;
        _lte?: Maybe<Scalars['uuid']>;
        _neq?: Maybe<Scalars['uuid']>;
        _nin?: Maybe<Array<Scalars['uuid']>>;
    }
    export interface zcta5_aggregate_order_by {
        avg?: Maybe<zcta5_avg_order_by>;
        count?: Maybe<order_by>;
        max?: Maybe<zcta5_max_order_by>;
        min?: Maybe<zcta5_min_order_by>;
        stddev?: Maybe<zcta5_stddev_order_by>;
        stddev_pop?: Maybe<zcta5_stddev_pop_order_by>;
        stddev_samp?: Maybe<zcta5_stddev_samp_order_by>;
        sum?: Maybe<zcta5_sum_order_by>;
        var_pop?: Maybe<zcta5_var_pop_order_by>;
        var_samp?: Maybe<zcta5_var_samp_order_by>;
        variance?: Maybe<zcta5_variance_order_by>;
    }
    export interface zcta5_arr_rel_insert_input {
        data: Array<zcta5_insert_input>;
        on_conflict?: Maybe<zcta5_on_conflict>;
    }
    export interface zcta5_avg_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export interface zcta5_bool_exp {
        _and?: Maybe<Array<Maybe<zcta5_bool_exp>>>;
        _not?: Maybe<zcta5_bool_exp>;
        _or?: Maybe<Array<Maybe<zcta5_bool_exp>>>;
        color?: Maybe<String_comparison_exp>;
        intptlat10?: Maybe<String_comparison_exp>;
        intptlon10?: Maybe<String_comparison_exp>;
        nhood?: Maybe<String_comparison_exp>;
        ogc_fid?: Maybe<Int_comparison_exp>;
        slug?: Maybe<String_comparison_exp>;
        wkb_geometry?: Maybe<geometry_comparison_exp>;
    }
    export enum zcta5_constraint {
        zcta5_pkey = "zcta5_pkey",
        zcta5_slug_key = "zcta5_slug_key"
    }
    export interface zcta5_inc_input {
        ogc_fid?: Maybe<Scalars['Int']>;
    }
    export interface zcta5_insert_input {
        color?: Maybe<Scalars['String']>;
        intptlat10?: Maybe<Scalars['String']>;
        intptlon10?: Maybe<Scalars['String']>;
        nhood?: Maybe<Scalars['String']>;
        ogc_fid?: Maybe<Scalars['Int']>;
        slug?: Maybe<Scalars['String']>;
        wkb_geometry?: Maybe<Scalars['geometry']>;
    }
    export interface zcta5_max_order_by {
        color?: Maybe<order_by>;
        intptlat10?: Maybe<order_by>;
        intptlon10?: Maybe<order_by>;
        nhood?: Maybe<order_by>;
        ogc_fid?: Maybe<order_by>;
        slug?: Maybe<order_by>;
    }
    export interface zcta5_min_order_by {
        color?: Maybe<order_by>;
        intptlat10?: Maybe<order_by>;
        intptlon10?: Maybe<order_by>;
        nhood?: Maybe<order_by>;
        ogc_fid?: Maybe<order_by>;
        slug?: Maybe<order_by>;
    }
    export interface zcta5_obj_rel_insert_input {
        data: zcta5_insert_input;
        on_conflict?: Maybe<zcta5_on_conflict>;
    }
    export interface zcta5_on_conflict {
        constraint: zcta5_constraint;
        update_columns: Array<zcta5_update_column>;
        where?: Maybe<zcta5_bool_exp>;
    }
    export interface zcta5_order_by {
        color?: Maybe<order_by>;
        intptlat10?: Maybe<order_by>;
        intptlon10?: Maybe<order_by>;
        nhood?: Maybe<order_by>;
        ogc_fid?: Maybe<order_by>;
        slug?: Maybe<order_by>;
        wkb_geometry?: Maybe<order_by>;
    }
    export interface zcta5_pk_columns_input {
        ogc_fid: Scalars['Int'];
    }
    export enum zcta5_select_column {
        color = "color",
        intptlat10 = "intptlat10",
        intptlon10 = "intptlon10",
        nhood = "nhood",
        ogc_fid = "ogc_fid",
        slug = "slug",
        wkb_geometry = "wkb_geometry"
    }
    export interface zcta5_set_input {
        color?: Maybe<Scalars['String']>;
        intptlat10?: Maybe<Scalars['String']>;
        intptlon10?: Maybe<Scalars['String']>;
        nhood?: Maybe<Scalars['String']>;
        ogc_fid?: Maybe<Scalars['Int']>;
        slug?: Maybe<Scalars['String']>;
        wkb_geometry?: Maybe<Scalars['geometry']>;
    }
    export interface zcta5_stddev_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export interface zcta5_stddev_pop_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export interface zcta5_stddev_samp_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export interface zcta5_sum_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export enum zcta5_update_column {
        color = "color",
        intptlat10 = "intptlat10",
        intptlon10 = "intptlon10",
        nhood = "nhood",
        ogc_fid = "ogc_fid",
        slug = "slug",
        wkb_geometry = "wkb_geometry"
    }
    export interface zcta5_var_pop_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export interface zcta5_var_samp_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export interface zcta5_variance_order_by {
        ogc_fid?: Maybe<order_by>;
    }
    export const scalarsEnumsHash: ScalarsEnumsHash;
    export const generatedSchema: {
        readonly query: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly hrr: {
                readonly __type: "[hrr!]!";
                readonly __args: {
                    readonly distinct_on: "[hrr_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[hrr_order_by!]";
                    readonly where: "hrr_bool_exp";
                };
            };
            readonly hrr_aggregate: {
                readonly __type: "hrr_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[hrr_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[hrr_order_by!]";
                    readonly where: "hrr_bool_exp";
                };
            };
            readonly hrr_by_pk: {
                readonly __type: "hrr";
                readonly __args: {
                    readonly ogc_fid: "Int!";
                };
            };
            readonly list: {
                readonly __type: "[list!]!";
                readonly __args: {
                    readonly distinct_on: "[list_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_order_by!]";
                    readonly where: "list_bool_exp";
                };
            };
            readonly list_aggregate: {
                readonly __type: "list_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[list_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_order_by!]";
                    readonly where: "list_bool_exp";
                };
            };
            readonly list_by_pk: {
                readonly __type: "list";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly list_populated: {
                readonly __type: "[list!]!";
                readonly __args: {
                    readonly args: "list_populated_args!";
                    readonly distinct_on: "[list_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_order_by!]";
                    readonly where: "list_bool_exp";
                };
            };
            readonly list_populated_aggregate: {
                readonly __type: "list_aggregate!";
                readonly __args: {
                    readonly args: "list_populated_args!";
                    readonly distinct_on: "[list_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_order_by!]";
                    readonly where: "list_bool_exp";
                };
            };
            readonly list_restaurant: {
                readonly __type: "[list_restaurant!]!";
                readonly __args: {
                    readonly distinct_on: "[list_restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_restaurant_order_by!]";
                    readonly where: "list_restaurant_bool_exp";
                };
            };
            readonly list_restaurant_aggregate: {
                readonly __type: "list_restaurant_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[list_restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_restaurant_order_by!]";
                    readonly where: "list_restaurant_bool_exp";
                };
            };
            readonly list_restaurant_by_pk: {
                readonly __type: "list_restaurant";
                readonly __args: {
                    readonly list_id: "uuid!";
                    readonly restaurant_id: "uuid!";
                };
            };
            readonly list_restaurant_tag: {
                readonly __type: "[list_restaurant_tag!]!";
                readonly __args: {
                    readonly distinct_on: "[list_restaurant_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_restaurant_tag_order_by!]";
                    readonly where: "list_restaurant_tag_bool_exp";
                };
            };
            readonly list_restaurant_tag_aggregate: {
                readonly __type: "list_restaurant_tag_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[list_restaurant_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_restaurant_tag_order_by!]";
                    readonly where: "list_restaurant_tag_bool_exp";
                };
            };
            readonly list_restaurant_tag_by_pk: {
                readonly __type: "list_restaurant_tag";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly list_tag: {
                readonly __type: "[list_tag!]!";
                readonly __args: {
                    readonly distinct_on: "[list_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_tag_order_by!]";
                    readonly where: "list_tag_bool_exp";
                };
            };
            readonly list_tag_aggregate: {
                readonly __type: "list_tag_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[list_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_tag_order_by!]";
                    readonly where: "list_tag_bool_exp";
                };
            };
            readonly list_tag_by_pk: {
                readonly __type: "list_tag";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly menu_item: {
                readonly __type: "[menu_item!]!";
                readonly __args: {
                    readonly distinct_on: "[menu_item_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[menu_item_order_by!]";
                    readonly where: "menu_item_bool_exp";
                };
            };
            readonly menu_item_aggregate: {
                readonly __type: "menu_item_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[menu_item_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[menu_item_order_by!]";
                    readonly where: "menu_item_bool_exp";
                };
            };
            readonly menu_item_by_pk: {
                readonly __type: "menu_item";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly nhood_labels: {
                readonly __type: "[nhood_labels!]!";
                readonly __args: {
                    readonly distinct_on: "[nhood_labels_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[nhood_labels_order_by!]";
                    readonly where: "nhood_labels_bool_exp";
                };
            };
            readonly nhood_labels_aggregate: {
                readonly __type: "nhood_labels_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[nhood_labels_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[nhood_labels_order_by!]";
                    readonly where: "nhood_labels_bool_exp";
                };
            };
            readonly nhood_labels_by_pk: {
                readonly __type: "nhood_labels";
                readonly __args: {
                    readonly ogc_fid: "Int!";
                };
            };
            readonly opening_hours: {
                readonly __type: "[opening_hours!]!";
                readonly __args: {
                    readonly distinct_on: "[opening_hours_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[opening_hours_order_by!]";
                    readonly where: "opening_hours_bool_exp";
                };
            };
            readonly opening_hours_aggregate: {
                readonly __type: "opening_hours_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[opening_hours_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[opening_hours_order_by!]";
                    readonly where: "opening_hours_bool_exp";
                };
            };
            readonly opening_hours_by_pk: {
                readonly __type: "opening_hours";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly photo: {
                readonly __type: "[photo!]!";
                readonly __args: {
                    readonly distinct_on: "[photo_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[photo_order_by!]";
                    readonly where: "photo_bool_exp";
                };
            };
            readonly photo_aggregate: {
                readonly __type: "photo_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[photo_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[photo_order_by!]";
                    readonly where: "photo_bool_exp";
                };
            };
            readonly photo_by_pk: {
                readonly __type: "photo";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly photo_xref: {
                readonly __type: "[photo_xref!]!";
                readonly __args: {
                    readonly distinct_on: "[photo_xref_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[photo_xref_order_by!]";
                    readonly where: "photo_xref_bool_exp";
                };
            };
            readonly photo_xref_aggregate: {
                readonly __type: "photo_xref_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[photo_xref_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[photo_xref_order_by!]";
                    readonly where: "photo_xref_bool_exp";
                };
            };
            readonly photo_xref_by_pk: {
                readonly __type: "photo_xref";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly restaurant: {
                readonly __type: "[restaurant!]!";
                readonly __args: {
                    readonly distinct_on: "[restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_order_by!]";
                    readonly where: "restaurant_bool_exp";
                };
            };
            readonly restaurant_aggregate: {
                readonly __type: "restaurant_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_order_by!]";
                    readonly where: "restaurant_bool_exp";
                };
            };
            readonly restaurant_by_pk: {
                readonly __type: "restaurant";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly restaurant_new: {
                readonly __type: "[restaurant!]!";
                readonly __args: {
                    readonly args: "restaurant_new_args!";
                    readonly distinct_on: "[restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_order_by!]";
                    readonly where: "restaurant_bool_exp";
                };
            };
            readonly restaurant_new_aggregate: {
                readonly __type: "restaurant_aggregate!";
                readonly __args: {
                    readonly args: "restaurant_new_args!";
                    readonly distinct_on: "[restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_order_by!]";
                    readonly where: "restaurant_bool_exp";
                };
            };
            readonly restaurant_tag: {
                readonly __type: "[restaurant_tag!]!";
                readonly __args: {
                    readonly distinct_on: "[restaurant_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_tag_order_by!]";
                    readonly where: "restaurant_tag_bool_exp";
                };
            };
            readonly restaurant_tag_aggregate: {
                readonly __type: "restaurant_tag_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[restaurant_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_tag_order_by!]";
                    readonly where: "restaurant_tag_bool_exp";
                };
            };
            readonly restaurant_tag_by_pk: {
                readonly __type: "restaurant_tag";
                readonly __args: {
                    readonly restaurant_id: "uuid!";
                    readonly tag_id: "uuid!";
                };
            };
            readonly restaurant_top_tags: {
                readonly __type: "[restaurant_tag!]!";
                readonly __args: {
                    readonly args: "restaurant_top_tags_args!";
                    readonly distinct_on: "[restaurant_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_tag_order_by!]";
                    readonly where: "restaurant_tag_bool_exp";
                };
            };
            readonly restaurant_top_tags_aggregate: {
                readonly __type: "restaurant_tag_aggregate!";
                readonly __args: {
                    readonly args: "restaurant_top_tags_args!";
                    readonly distinct_on: "[restaurant_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_tag_order_by!]";
                    readonly where: "restaurant_tag_bool_exp";
                };
            };
            readonly restaurant_trending: {
                readonly __type: "[restaurant!]!";
                readonly __args: {
                    readonly args: "restaurant_trending_args!";
                    readonly distinct_on: "[restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_order_by!]";
                    readonly where: "restaurant_bool_exp";
                };
            };
            readonly restaurant_trending_aggregate: {
                readonly __type: "restaurant_aggregate!";
                readonly __args: {
                    readonly args: "restaurant_trending_args!";
                    readonly distinct_on: "[restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_order_by!]";
                    readonly where: "restaurant_bool_exp";
                };
            };
            readonly restaurant_with_tags: {
                readonly __type: "[restaurant!]!";
                readonly __args: {
                    readonly args: "restaurant_with_tags_args!";
                    readonly distinct_on: "[restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_order_by!]";
                    readonly where: "restaurant_bool_exp";
                };
            };
            readonly restaurant_with_tags_aggregate: {
                readonly __type: "restaurant_aggregate!";
                readonly __args: {
                    readonly args: "restaurant_with_tags_args!";
                    readonly distinct_on: "[restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_order_by!]";
                    readonly where: "restaurant_bool_exp";
                };
            };
            readonly review: {
                readonly __type: "[review!]!";
                readonly __args: {
                    readonly distinct_on: "[review_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[review_order_by!]";
                    readonly where: "review_bool_exp";
                };
            };
            readonly review_aggregate: {
                readonly __type: "review_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[review_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[review_order_by!]";
                    readonly where: "review_bool_exp";
                };
            };
            readonly review_by_pk: {
                readonly __type: "review";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly review_tag_sentence: {
                readonly __type: "[review_tag_sentence!]!";
                readonly __args: {
                    readonly distinct_on: "[review_tag_sentence_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[review_tag_sentence_order_by!]";
                    readonly where: "review_tag_sentence_bool_exp";
                };
            };
            readonly review_tag_sentence_aggregate: {
                readonly __type: "review_tag_sentence_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[review_tag_sentence_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[review_tag_sentence_order_by!]";
                    readonly where: "review_tag_sentence_bool_exp";
                };
            };
            readonly review_tag_sentence_by_pk: {
                readonly __type: "review_tag_sentence";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly setting: {
                readonly __type: "[setting!]!";
                readonly __args: {
                    readonly distinct_on: "[setting_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[setting_order_by!]";
                    readonly where: "setting_bool_exp";
                };
            };
            readonly setting_aggregate: {
                readonly __type: "setting_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[setting_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[setting_order_by!]";
                    readonly where: "setting_bool_exp";
                };
            };
            readonly setting_by_pk: {
                readonly __type: "setting";
                readonly __args: {
                    readonly key: "String!";
                };
            };
            readonly tag: {
                readonly __type: "[tag!]!";
                readonly __args: {
                    readonly distinct_on: "[tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[tag_order_by!]";
                    readonly where: "tag_bool_exp";
                };
            };
            readonly tag_aggregate: {
                readonly __type: "tag_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[tag_order_by!]";
                    readonly where: "tag_bool_exp";
                };
            };
            readonly tag_by_pk: {
                readonly __type: "tag";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly tag_tag: {
                readonly __type: "[tag_tag!]!";
                readonly __args: {
                    readonly distinct_on: "[tag_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[tag_tag_order_by!]";
                    readonly where: "tag_tag_bool_exp";
                };
            };
            readonly tag_tag_aggregate: {
                readonly __type: "tag_tag_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[tag_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[tag_tag_order_by!]";
                    readonly where: "tag_tag_bool_exp";
                };
            };
            readonly tag_tag_by_pk: {
                readonly __type: "tag_tag";
                readonly __args: {
                    readonly category_tag_id: "uuid!";
                    readonly tag_id: "uuid!";
                };
            };
            readonly user: {
                readonly __type: "[user!]!";
                readonly __args: {
                    readonly distinct_on: "[user_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[user_order_by!]";
                    readonly where: "user_bool_exp";
                };
            };
            readonly user_aggregate: {
                readonly __type: "user_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[user_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[user_order_by!]";
                    readonly where: "user_bool_exp";
                };
            };
            readonly user_by_pk: {
                readonly __type: "user";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly zcta5: {
                readonly __type: "[zcta5!]!";
                readonly __args: {
                    readonly distinct_on: "[zcta5_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[zcta5_order_by!]";
                    readonly where: "zcta5_bool_exp";
                };
            };
            readonly zcta5_aggregate: {
                readonly __type: "zcta5_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[zcta5_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[zcta5_order_by!]";
                    readonly where: "zcta5_bool_exp";
                };
            };
            readonly zcta5_by_pk: {
                readonly __type: "zcta5";
                readonly __args: {
                    readonly ogc_fid: "Int!";
                };
            };
        };
        readonly mutation: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly delete_hrr: {
                readonly __type: "hrr_mutation_response";
                readonly __args: {
                    readonly where: "hrr_bool_exp!";
                };
            };
            readonly delete_hrr_by_pk: {
                readonly __type: "hrr";
                readonly __args: {
                    readonly ogc_fid: "Int!";
                };
            };
            readonly delete_list: {
                readonly __type: "list_mutation_response";
                readonly __args: {
                    readonly where: "list_bool_exp!";
                };
            };
            readonly delete_list_by_pk: {
                readonly __type: "list";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly delete_list_restaurant: {
                readonly __type: "list_restaurant_mutation_response";
                readonly __args: {
                    readonly where: "list_restaurant_bool_exp!";
                };
            };
            readonly delete_list_restaurant_by_pk: {
                readonly __type: "list_restaurant";
                readonly __args: {
                    readonly list_id: "uuid!";
                    readonly restaurant_id: "uuid!";
                };
            };
            readonly delete_list_restaurant_tag: {
                readonly __type: "list_restaurant_tag_mutation_response";
                readonly __args: {
                    readonly where: "list_restaurant_tag_bool_exp!";
                };
            };
            readonly delete_list_restaurant_tag_by_pk: {
                readonly __type: "list_restaurant_tag";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly delete_list_tag: {
                readonly __type: "list_tag_mutation_response";
                readonly __args: {
                    readonly where: "list_tag_bool_exp!";
                };
            };
            readonly delete_list_tag_by_pk: {
                readonly __type: "list_tag";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly delete_menu_item: {
                readonly __type: "menu_item_mutation_response";
                readonly __args: {
                    readonly where: "menu_item_bool_exp!";
                };
            };
            readonly delete_menu_item_by_pk: {
                readonly __type: "menu_item";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly delete_nhood_labels: {
                readonly __type: "nhood_labels_mutation_response";
                readonly __args: {
                    readonly where: "nhood_labels_bool_exp!";
                };
            };
            readonly delete_nhood_labels_by_pk: {
                readonly __type: "nhood_labels";
                readonly __args: {
                    readonly ogc_fid: "Int!";
                };
            };
            readonly delete_opening_hours: {
                readonly __type: "opening_hours_mutation_response";
                readonly __args: {
                    readonly where: "opening_hours_bool_exp!";
                };
            };
            readonly delete_opening_hours_by_pk: {
                readonly __type: "opening_hours";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly delete_photo: {
                readonly __type: "photo_mutation_response";
                readonly __args: {
                    readonly where: "photo_bool_exp!";
                };
            };
            readonly delete_photo_by_pk: {
                readonly __type: "photo";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly delete_photo_xref: {
                readonly __type: "photo_xref_mutation_response";
                readonly __args: {
                    readonly where: "photo_xref_bool_exp!";
                };
            };
            readonly delete_photo_xref_by_pk: {
                readonly __type: "photo_xref";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly delete_restaurant: {
                readonly __type: "restaurant_mutation_response";
                readonly __args: {
                    readonly where: "restaurant_bool_exp!";
                };
            };
            readonly delete_restaurant_by_pk: {
                readonly __type: "restaurant";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly delete_restaurant_tag: {
                readonly __type: "restaurant_tag_mutation_response";
                readonly __args: {
                    readonly where: "restaurant_tag_bool_exp!";
                };
            };
            readonly delete_restaurant_tag_by_pk: {
                readonly __type: "restaurant_tag";
                readonly __args: {
                    readonly restaurant_id: "uuid!";
                    readonly tag_id: "uuid!";
                };
            };
            readonly delete_review: {
                readonly __type: "review_mutation_response";
                readonly __args: {
                    readonly where: "review_bool_exp!";
                };
            };
            readonly delete_review_by_pk: {
                readonly __type: "review";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly delete_review_tag_sentence: {
                readonly __type: "review_tag_sentence_mutation_response";
                readonly __args: {
                    readonly where: "review_tag_sentence_bool_exp!";
                };
            };
            readonly delete_review_tag_sentence_by_pk: {
                readonly __type: "review_tag_sentence";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly delete_setting: {
                readonly __type: "setting_mutation_response";
                readonly __args: {
                    readonly where: "setting_bool_exp!";
                };
            };
            readonly delete_setting_by_pk: {
                readonly __type: "setting";
                readonly __args: {
                    readonly key: "String!";
                };
            };
            readonly delete_tag: {
                readonly __type: "tag_mutation_response";
                readonly __args: {
                    readonly where: "tag_bool_exp!";
                };
            };
            readonly delete_tag_by_pk: {
                readonly __type: "tag";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly delete_tag_tag: {
                readonly __type: "tag_tag_mutation_response";
                readonly __args: {
                    readonly where: "tag_tag_bool_exp!";
                };
            };
            readonly delete_tag_tag_by_pk: {
                readonly __type: "tag_tag";
                readonly __args: {
                    readonly category_tag_id: "uuid!";
                    readonly tag_id: "uuid!";
                };
            };
            readonly delete_user: {
                readonly __type: "user_mutation_response";
                readonly __args: {
                    readonly where: "user_bool_exp!";
                };
            };
            readonly delete_user_by_pk: {
                readonly __type: "user";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly delete_zcta5: {
                readonly __type: "zcta5_mutation_response";
                readonly __args: {
                    readonly where: "zcta5_bool_exp!";
                };
            };
            readonly delete_zcta5_by_pk: {
                readonly __type: "zcta5";
                readonly __args: {
                    readonly ogc_fid: "Int!";
                };
            };
            readonly insert_hrr: {
                readonly __type: "hrr_mutation_response";
                readonly __args: {
                    readonly objects: "[hrr_insert_input!]!";
                    readonly on_conflict: "hrr_on_conflict";
                };
            };
            readonly insert_hrr_one: {
                readonly __type: "hrr";
                readonly __args: {
                    readonly object: "hrr_insert_input!";
                    readonly on_conflict: "hrr_on_conflict";
                };
            };
            readonly insert_list: {
                readonly __type: "list_mutation_response";
                readonly __args: {
                    readonly objects: "[list_insert_input!]!";
                    readonly on_conflict: "list_on_conflict";
                };
            };
            readonly insert_list_one: {
                readonly __type: "list";
                readonly __args: {
                    readonly object: "list_insert_input!";
                    readonly on_conflict: "list_on_conflict";
                };
            };
            readonly insert_list_restaurant: {
                readonly __type: "list_restaurant_mutation_response";
                readonly __args: {
                    readonly objects: "[list_restaurant_insert_input!]!";
                    readonly on_conflict: "list_restaurant_on_conflict";
                };
            };
            readonly insert_list_restaurant_one: {
                readonly __type: "list_restaurant";
                readonly __args: {
                    readonly object: "list_restaurant_insert_input!";
                    readonly on_conflict: "list_restaurant_on_conflict";
                };
            };
            readonly insert_list_restaurant_tag: {
                readonly __type: "list_restaurant_tag_mutation_response";
                readonly __args: {
                    readonly objects: "[list_restaurant_tag_insert_input!]!";
                    readonly on_conflict: "list_restaurant_tag_on_conflict";
                };
            };
            readonly insert_list_restaurant_tag_one: {
                readonly __type: "list_restaurant_tag";
                readonly __args: {
                    readonly object: "list_restaurant_tag_insert_input!";
                    readonly on_conflict: "list_restaurant_tag_on_conflict";
                };
            };
            readonly insert_list_tag: {
                readonly __type: "list_tag_mutation_response";
                readonly __args: {
                    readonly objects: "[list_tag_insert_input!]!";
                    readonly on_conflict: "list_tag_on_conflict";
                };
            };
            readonly insert_list_tag_one: {
                readonly __type: "list_tag";
                readonly __args: {
                    readonly object: "list_tag_insert_input!";
                    readonly on_conflict: "list_tag_on_conflict";
                };
            };
            readonly insert_menu_item: {
                readonly __type: "menu_item_mutation_response";
                readonly __args: {
                    readonly objects: "[menu_item_insert_input!]!";
                    readonly on_conflict: "menu_item_on_conflict";
                };
            };
            readonly insert_menu_item_one: {
                readonly __type: "menu_item";
                readonly __args: {
                    readonly object: "menu_item_insert_input!";
                    readonly on_conflict: "menu_item_on_conflict";
                };
            };
            readonly insert_nhood_labels: {
                readonly __type: "nhood_labels_mutation_response";
                readonly __args: {
                    readonly objects: "[nhood_labels_insert_input!]!";
                    readonly on_conflict: "nhood_labels_on_conflict";
                };
            };
            readonly insert_nhood_labels_one: {
                readonly __type: "nhood_labels";
                readonly __args: {
                    readonly object: "nhood_labels_insert_input!";
                    readonly on_conflict: "nhood_labels_on_conflict";
                };
            };
            readonly insert_opening_hours: {
                readonly __type: "opening_hours_mutation_response";
                readonly __args: {
                    readonly objects: "[opening_hours_insert_input!]!";
                    readonly on_conflict: "opening_hours_on_conflict";
                };
            };
            readonly insert_opening_hours_one: {
                readonly __type: "opening_hours";
                readonly __args: {
                    readonly object: "opening_hours_insert_input!";
                    readonly on_conflict: "opening_hours_on_conflict";
                };
            };
            readonly insert_photo: {
                readonly __type: "photo_mutation_response";
                readonly __args: {
                    readonly objects: "[photo_insert_input!]!";
                    readonly on_conflict: "photo_on_conflict";
                };
            };
            readonly insert_photo_one: {
                readonly __type: "photo";
                readonly __args: {
                    readonly object: "photo_insert_input!";
                    readonly on_conflict: "photo_on_conflict";
                };
            };
            readonly insert_photo_xref: {
                readonly __type: "photo_xref_mutation_response";
                readonly __args: {
                    readonly objects: "[photo_xref_insert_input!]!";
                    readonly on_conflict: "photo_xref_on_conflict";
                };
            };
            readonly insert_photo_xref_one: {
                readonly __type: "photo_xref";
                readonly __args: {
                    readonly object: "photo_xref_insert_input!";
                    readonly on_conflict: "photo_xref_on_conflict";
                };
            };
            readonly insert_restaurant: {
                readonly __type: "restaurant_mutation_response";
                readonly __args: {
                    readonly objects: "[restaurant_insert_input!]!";
                    readonly on_conflict: "restaurant_on_conflict";
                };
            };
            readonly insert_restaurant_one: {
                readonly __type: "restaurant";
                readonly __args: {
                    readonly object: "restaurant_insert_input!";
                    readonly on_conflict: "restaurant_on_conflict";
                };
            };
            readonly insert_restaurant_tag: {
                readonly __type: "restaurant_tag_mutation_response";
                readonly __args: {
                    readonly objects: "[restaurant_tag_insert_input!]!";
                    readonly on_conflict: "restaurant_tag_on_conflict";
                };
            };
            readonly insert_restaurant_tag_one: {
                readonly __type: "restaurant_tag";
                readonly __args: {
                    readonly object: "restaurant_tag_insert_input!";
                    readonly on_conflict: "restaurant_tag_on_conflict";
                };
            };
            readonly insert_review: {
                readonly __type: "review_mutation_response";
                readonly __args: {
                    readonly objects: "[review_insert_input!]!";
                    readonly on_conflict: "review_on_conflict";
                };
            };
            readonly insert_review_one: {
                readonly __type: "review";
                readonly __args: {
                    readonly object: "review_insert_input!";
                    readonly on_conflict: "review_on_conflict";
                };
            };
            readonly insert_review_tag_sentence: {
                readonly __type: "review_tag_sentence_mutation_response";
                readonly __args: {
                    readonly objects: "[review_tag_sentence_insert_input!]!";
                    readonly on_conflict: "review_tag_sentence_on_conflict";
                };
            };
            readonly insert_review_tag_sentence_one: {
                readonly __type: "review_tag_sentence";
                readonly __args: {
                    readonly object: "review_tag_sentence_insert_input!";
                    readonly on_conflict: "review_tag_sentence_on_conflict";
                };
            };
            readonly insert_setting: {
                readonly __type: "setting_mutation_response";
                readonly __args: {
                    readonly objects: "[setting_insert_input!]!";
                    readonly on_conflict: "setting_on_conflict";
                };
            };
            readonly insert_setting_one: {
                readonly __type: "setting";
                readonly __args: {
                    readonly object: "setting_insert_input!";
                    readonly on_conflict: "setting_on_conflict";
                };
            };
            readonly insert_tag: {
                readonly __type: "tag_mutation_response";
                readonly __args: {
                    readonly objects: "[tag_insert_input!]!";
                    readonly on_conflict: "tag_on_conflict";
                };
            };
            readonly insert_tag_one: {
                readonly __type: "tag";
                readonly __args: {
                    readonly object: "tag_insert_input!";
                    readonly on_conflict: "tag_on_conflict";
                };
            };
            readonly insert_tag_tag: {
                readonly __type: "tag_tag_mutation_response";
                readonly __args: {
                    readonly objects: "[tag_tag_insert_input!]!";
                    readonly on_conflict: "tag_tag_on_conflict";
                };
            };
            readonly insert_tag_tag_one: {
                readonly __type: "tag_tag";
                readonly __args: {
                    readonly object: "tag_tag_insert_input!";
                    readonly on_conflict: "tag_tag_on_conflict";
                };
            };
            readonly insert_user: {
                readonly __type: "user_mutation_response";
                readonly __args: {
                    readonly objects: "[user_insert_input!]!";
                    readonly on_conflict: "user_on_conflict";
                };
            };
            readonly insert_user_one: {
                readonly __type: "user";
                readonly __args: {
                    readonly object: "user_insert_input!";
                    readonly on_conflict: "user_on_conflict";
                };
            };
            readonly insert_zcta5: {
                readonly __type: "zcta5_mutation_response";
                readonly __args: {
                    readonly objects: "[zcta5_insert_input!]!";
                    readonly on_conflict: "zcta5_on_conflict";
                };
            };
            readonly insert_zcta5_one: {
                readonly __type: "zcta5";
                readonly __args: {
                    readonly object: "zcta5_insert_input!";
                    readonly on_conflict: "zcta5_on_conflict";
                };
            };
            readonly update_hrr: {
                readonly __type: "hrr_mutation_response";
                readonly __args: {
                    readonly _inc: "hrr_inc_input";
                    readonly _set: "hrr_set_input";
                    readonly where: "hrr_bool_exp!";
                };
            };
            readonly update_hrr_by_pk: {
                readonly __type: "hrr";
                readonly __args: {
                    readonly _inc: "hrr_inc_input";
                    readonly _set: "hrr_set_input";
                    readonly pk_columns: "hrr_pk_columns_input!";
                };
            };
            readonly update_list: {
                readonly __type: "list_mutation_response";
                readonly __args: {
                    readonly _inc: "list_inc_input";
                    readonly _set: "list_set_input";
                    readonly where: "list_bool_exp!";
                };
            };
            readonly update_list_by_pk: {
                readonly __type: "list";
                readonly __args: {
                    readonly _inc: "list_inc_input";
                    readonly _set: "list_set_input";
                    readonly pk_columns: "list_pk_columns_input!";
                };
            };
            readonly update_list_restaurant: {
                readonly __type: "list_restaurant_mutation_response";
                readonly __args: {
                    readonly _inc: "list_restaurant_inc_input";
                    readonly _set: "list_restaurant_set_input";
                    readonly where: "list_restaurant_bool_exp!";
                };
            };
            readonly update_list_restaurant_by_pk: {
                readonly __type: "list_restaurant";
                readonly __args: {
                    readonly _inc: "list_restaurant_inc_input";
                    readonly _set: "list_restaurant_set_input";
                    readonly pk_columns: "list_restaurant_pk_columns_input!";
                };
            };
            readonly update_list_restaurant_tag: {
                readonly __type: "list_restaurant_tag_mutation_response";
                readonly __args: {
                    readonly _inc: "list_restaurant_tag_inc_input";
                    readonly _set: "list_restaurant_tag_set_input";
                    readonly where: "list_restaurant_tag_bool_exp!";
                };
            };
            readonly update_list_restaurant_tag_by_pk: {
                readonly __type: "list_restaurant_tag";
                readonly __args: {
                    readonly _inc: "list_restaurant_tag_inc_input";
                    readonly _set: "list_restaurant_tag_set_input";
                    readonly pk_columns: "list_restaurant_tag_pk_columns_input!";
                };
            };
            readonly update_list_tag: {
                readonly __type: "list_tag_mutation_response";
                readonly __args: {
                    readonly _set: "list_tag_set_input";
                    readonly where: "list_tag_bool_exp!";
                };
            };
            readonly update_list_tag_by_pk: {
                readonly __type: "list_tag";
                readonly __args: {
                    readonly _set: "list_tag_set_input";
                    readonly pk_columns: "list_tag_pk_columns_input!";
                };
            };
            readonly update_menu_item: {
                readonly __type: "menu_item_mutation_response";
                readonly __args: {
                    readonly _inc: "menu_item_inc_input";
                    readonly _set: "menu_item_set_input";
                    readonly where: "menu_item_bool_exp!";
                };
            };
            readonly update_menu_item_by_pk: {
                readonly __type: "menu_item";
                readonly __args: {
                    readonly _inc: "menu_item_inc_input";
                    readonly _set: "menu_item_set_input";
                    readonly pk_columns: "menu_item_pk_columns_input!";
                };
            };
            readonly update_nhood_labels: {
                readonly __type: "nhood_labels_mutation_response";
                readonly __args: {
                    readonly _inc: "nhood_labels_inc_input";
                    readonly _set: "nhood_labels_set_input";
                    readonly where: "nhood_labels_bool_exp!";
                };
            };
            readonly update_nhood_labels_by_pk: {
                readonly __type: "nhood_labels";
                readonly __args: {
                    readonly _inc: "nhood_labels_inc_input";
                    readonly _set: "nhood_labels_set_input";
                    readonly pk_columns: "nhood_labels_pk_columns_input!";
                };
            };
            readonly update_opening_hours: {
                readonly __type: "opening_hours_mutation_response";
                readonly __args: {
                    readonly _set: "opening_hours_set_input";
                    readonly where: "opening_hours_bool_exp!";
                };
            };
            readonly update_opening_hours_by_pk: {
                readonly __type: "opening_hours";
                readonly __args: {
                    readonly _set: "opening_hours_set_input";
                    readonly pk_columns: "opening_hours_pk_columns_input!";
                };
            };
            readonly update_photo: {
                readonly __type: "photo_mutation_response";
                readonly __args: {
                    readonly _inc: "photo_inc_input";
                    readonly _set: "photo_set_input";
                    readonly where: "photo_bool_exp!";
                };
            };
            readonly update_photo_by_pk: {
                readonly __type: "photo";
                readonly __args: {
                    readonly _inc: "photo_inc_input";
                    readonly _set: "photo_set_input";
                    readonly pk_columns: "photo_pk_columns_input!";
                };
            };
            readonly update_photo_xref: {
                readonly __type: "photo_xref_mutation_response";
                readonly __args: {
                    readonly _set: "photo_xref_set_input";
                    readonly where: "photo_xref_bool_exp!";
                };
            };
            readonly update_photo_xref_by_pk: {
                readonly __type: "photo_xref";
                readonly __args: {
                    readonly _set: "photo_xref_set_input";
                    readonly pk_columns: "photo_xref_pk_columns_input!";
                };
            };
            readonly update_restaurant: {
                readonly __type: "restaurant_mutation_response";
                readonly __args: {
                    readonly _append: "restaurant_append_input";
                    readonly _delete_at_path: "restaurant_delete_at_path_input";
                    readonly _delete_elem: "restaurant_delete_elem_input";
                    readonly _delete_key: "restaurant_delete_key_input";
                    readonly _inc: "restaurant_inc_input";
                    readonly _prepend: "restaurant_prepend_input";
                    readonly _set: "restaurant_set_input";
                    readonly where: "restaurant_bool_exp!";
                };
            };
            readonly update_restaurant_by_pk: {
                readonly __type: "restaurant";
                readonly __args: {
                    readonly _append: "restaurant_append_input";
                    readonly _delete_at_path: "restaurant_delete_at_path_input";
                    readonly _delete_elem: "restaurant_delete_elem_input";
                    readonly _delete_key: "restaurant_delete_key_input";
                    readonly _inc: "restaurant_inc_input";
                    readonly _prepend: "restaurant_prepend_input";
                    readonly _set: "restaurant_set_input";
                    readonly pk_columns: "restaurant_pk_columns_input!";
                };
            };
            readonly update_restaurant_tag: {
                readonly __type: "restaurant_tag_mutation_response";
                readonly __args: {
                    readonly _append: "restaurant_tag_append_input";
                    readonly _delete_at_path: "restaurant_tag_delete_at_path_input";
                    readonly _delete_elem: "restaurant_tag_delete_elem_input";
                    readonly _delete_key: "restaurant_tag_delete_key_input";
                    readonly _inc: "restaurant_tag_inc_input";
                    readonly _prepend: "restaurant_tag_prepend_input";
                    readonly _set: "restaurant_tag_set_input";
                    readonly where: "restaurant_tag_bool_exp!";
                };
            };
            readonly update_restaurant_tag_by_pk: {
                readonly __type: "restaurant_tag";
                readonly __args: {
                    readonly _append: "restaurant_tag_append_input";
                    readonly _delete_at_path: "restaurant_tag_delete_at_path_input";
                    readonly _delete_elem: "restaurant_tag_delete_elem_input";
                    readonly _delete_key: "restaurant_tag_delete_key_input";
                    readonly _inc: "restaurant_tag_inc_input";
                    readonly _prepend: "restaurant_tag_prepend_input";
                    readonly _set: "restaurant_tag_set_input";
                    readonly pk_columns: "restaurant_tag_pk_columns_input!";
                };
            };
            readonly update_review: {
                readonly __type: "review_mutation_response";
                readonly __args: {
                    readonly _append: "review_append_input";
                    readonly _delete_at_path: "review_delete_at_path_input";
                    readonly _delete_elem: "review_delete_elem_input";
                    readonly _delete_key: "review_delete_key_input";
                    readonly _inc: "review_inc_input";
                    readonly _prepend: "review_prepend_input";
                    readonly _set: "review_set_input";
                    readonly where: "review_bool_exp!";
                };
            };
            readonly update_review_by_pk: {
                readonly __type: "review";
                readonly __args: {
                    readonly _append: "review_append_input";
                    readonly _delete_at_path: "review_delete_at_path_input";
                    readonly _delete_elem: "review_delete_elem_input";
                    readonly _delete_key: "review_delete_key_input";
                    readonly _inc: "review_inc_input";
                    readonly _prepend: "review_prepend_input";
                    readonly _set: "review_set_input";
                    readonly pk_columns: "review_pk_columns_input!";
                };
            };
            readonly update_review_tag_sentence: {
                readonly __type: "review_tag_sentence_mutation_response";
                readonly __args: {
                    readonly _inc: "review_tag_sentence_inc_input";
                    readonly _set: "review_tag_sentence_set_input";
                    readonly where: "review_tag_sentence_bool_exp!";
                };
            };
            readonly update_review_tag_sentence_by_pk: {
                readonly __type: "review_tag_sentence";
                readonly __args: {
                    readonly _inc: "review_tag_sentence_inc_input";
                    readonly _set: "review_tag_sentence_set_input";
                    readonly pk_columns: "review_tag_sentence_pk_columns_input!";
                };
            };
            readonly update_setting: {
                readonly __type: "setting_mutation_response";
                readonly __args: {
                    readonly _append: "setting_append_input";
                    readonly _delete_at_path: "setting_delete_at_path_input";
                    readonly _delete_elem: "setting_delete_elem_input";
                    readonly _delete_key: "setting_delete_key_input";
                    readonly _prepend: "setting_prepend_input";
                    readonly _set: "setting_set_input";
                    readonly where: "setting_bool_exp!";
                };
            };
            readonly update_setting_by_pk: {
                readonly __type: "setting";
                readonly __args: {
                    readonly _append: "setting_append_input";
                    readonly _delete_at_path: "setting_delete_at_path_input";
                    readonly _delete_elem: "setting_delete_elem_input";
                    readonly _delete_key: "setting_delete_key_input";
                    readonly _prepend: "setting_prepend_input";
                    readonly _set: "setting_set_input";
                    readonly pk_columns: "setting_pk_columns_input!";
                };
            };
            readonly update_tag: {
                readonly __type: "tag_mutation_response";
                readonly __args: {
                    readonly _append: "tag_append_input";
                    readonly _delete_at_path: "tag_delete_at_path_input";
                    readonly _delete_elem: "tag_delete_elem_input";
                    readonly _delete_key: "tag_delete_key_input";
                    readonly _inc: "tag_inc_input";
                    readonly _prepend: "tag_prepend_input";
                    readonly _set: "tag_set_input";
                    readonly where: "tag_bool_exp!";
                };
            };
            readonly update_tag_by_pk: {
                readonly __type: "tag";
                readonly __args: {
                    readonly _append: "tag_append_input";
                    readonly _delete_at_path: "tag_delete_at_path_input";
                    readonly _delete_elem: "tag_delete_elem_input";
                    readonly _delete_key: "tag_delete_key_input";
                    readonly _inc: "tag_inc_input";
                    readonly _prepend: "tag_prepend_input";
                    readonly _set: "tag_set_input";
                    readonly pk_columns: "tag_pk_columns_input!";
                };
            };
            readonly update_tag_tag: {
                readonly __type: "tag_tag_mutation_response";
                readonly __args: {
                    readonly _set: "tag_tag_set_input";
                    readonly where: "tag_tag_bool_exp!";
                };
            };
            readonly update_tag_tag_by_pk: {
                readonly __type: "tag_tag";
                readonly __args: {
                    readonly _set: "tag_tag_set_input";
                    readonly pk_columns: "tag_tag_pk_columns_input!";
                };
            };
            readonly update_user: {
                readonly __type: "user_mutation_response";
                readonly __args: {
                    readonly _inc: "user_inc_input";
                    readonly _set: "user_set_input";
                    readonly where: "user_bool_exp!";
                };
            };
            readonly update_user_by_pk: {
                readonly __type: "user";
                readonly __args: {
                    readonly _inc: "user_inc_input";
                    readonly _set: "user_set_input";
                    readonly pk_columns: "user_pk_columns_input!";
                };
            };
            readonly update_zcta5: {
                readonly __type: "zcta5_mutation_response";
                readonly __args: {
                    readonly _inc: "zcta5_inc_input";
                    readonly _set: "zcta5_set_input";
                    readonly where: "zcta5_bool_exp!";
                };
            };
            readonly update_zcta5_by_pk: {
                readonly __type: "zcta5";
                readonly __args: {
                    readonly _inc: "zcta5_inc_input";
                    readonly _set: "zcta5_set_input";
                    readonly pk_columns: "zcta5_pk_columns_input!";
                };
            };
        };
        readonly subscription: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly hrr: {
                readonly __type: "[hrr!]!";
                readonly __args: {
                    readonly distinct_on: "[hrr_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[hrr_order_by!]";
                    readonly where: "hrr_bool_exp";
                };
            };
            readonly hrr_aggregate: {
                readonly __type: "hrr_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[hrr_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[hrr_order_by!]";
                    readonly where: "hrr_bool_exp";
                };
            };
            readonly hrr_by_pk: {
                readonly __type: "hrr";
                readonly __args: {
                    readonly ogc_fid: "Int!";
                };
            };
            readonly list: {
                readonly __type: "[list!]!";
                readonly __args: {
                    readonly distinct_on: "[list_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_order_by!]";
                    readonly where: "list_bool_exp";
                };
            };
            readonly list_aggregate: {
                readonly __type: "list_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[list_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_order_by!]";
                    readonly where: "list_bool_exp";
                };
            };
            readonly list_by_pk: {
                readonly __type: "list";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly list_populated: {
                readonly __type: "[list!]!";
                readonly __args: {
                    readonly args: "list_populated_args!";
                    readonly distinct_on: "[list_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_order_by!]";
                    readonly where: "list_bool_exp";
                };
            };
            readonly list_populated_aggregate: {
                readonly __type: "list_aggregate!";
                readonly __args: {
                    readonly args: "list_populated_args!";
                    readonly distinct_on: "[list_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_order_by!]";
                    readonly where: "list_bool_exp";
                };
            };
            readonly list_restaurant: {
                readonly __type: "[list_restaurant!]!";
                readonly __args: {
                    readonly distinct_on: "[list_restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_restaurant_order_by!]";
                    readonly where: "list_restaurant_bool_exp";
                };
            };
            readonly list_restaurant_aggregate: {
                readonly __type: "list_restaurant_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[list_restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_restaurant_order_by!]";
                    readonly where: "list_restaurant_bool_exp";
                };
            };
            readonly list_restaurant_by_pk: {
                readonly __type: "list_restaurant";
                readonly __args: {
                    readonly list_id: "uuid!";
                    readonly restaurant_id: "uuid!";
                };
            };
            readonly list_restaurant_tag: {
                readonly __type: "[list_restaurant_tag!]!";
                readonly __args: {
                    readonly distinct_on: "[list_restaurant_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_restaurant_tag_order_by!]";
                    readonly where: "list_restaurant_tag_bool_exp";
                };
            };
            readonly list_restaurant_tag_aggregate: {
                readonly __type: "list_restaurant_tag_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[list_restaurant_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_restaurant_tag_order_by!]";
                    readonly where: "list_restaurant_tag_bool_exp";
                };
            };
            readonly list_restaurant_tag_by_pk: {
                readonly __type: "list_restaurant_tag";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly list_tag: {
                readonly __type: "[list_tag!]!";
                readonly __args: {
                    readonly distinct_on: "[list_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_tag_order_by!]";
                    readonly where: "list_tag_bool_exp";
                };
            };
            readonly list_tag_aggregate: {
                readonly __type: "list_tag_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[list_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_tag_order_by!]";
                    readonly where: "list_tag_bool_exp";
                };
            };
            readonly list_tag_by_pk: {
                readonly __type: "list_tag";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly menu_item: {
                readonly __type: "[menu_item!]!";
                readonly __args: {
                    readonly distinct_on: "[menu_item_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[menu_item_order_by!]";
                    readonly where: "menu_item_bool_exp";
                };
            };
            readonly menu_item_aggregate: {
                readonly __type: "menu_item_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[menu_item_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[menu_item_order_by!]";
                    readonly where: "menu_item_bool_exp";
                };
            };
            readonly menu_item_by_pk: {
                readonly __type: "menu_item";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly nhood_labels: {
                readonly __type: "[nhood_labels!]!";
                readonly __args: {
                    readonly distinct_on: "[nhood_labels_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[nhood_labels_order_by!]";
                    readonly where: "nhood_labels_bool_exp";
                };
            };
            readonly nhood_labels_aggregate: {
                readonly __type: "nhood_labels_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[nhood_labels_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[nhood_labels_order_by!]";
                    readonly where: "nhood_labels_bool_exp";
                };
            };
            readonly nhood_labels_by_pk: {
                readonly __type: "nhood_labels";
                readonly __args: {
                    readonly ogc_fid: "Int!";
                };
            };
            readonly opening_hours: {
                readonly __type: "[opening_hours!]!";
                readonly __args: {
                    readonly distinct_on: "[opening_hours_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[opening_hours_order_by!]";
                    readonly where: "opening_hours_bool_exp";
                };
            };
            readonly opening_hours_aggregate: {
                readonly __type: "opening_hours_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[opening_hours_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[opening_hours_order_by!]";
                    readonly where: "opening_hours_bool_exp";
                };
            };
            readonly opening_hours_by_pk: {
                readonly __type: "opening_hours";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly photo: {
                readonly __type: "[photo!]!";
                readonly __args: {
                    readonly distinct_on: "[photo_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[photo_order_by!]";
                    readonly where: "photo_bool_exp";
                };
            };
            readonly photo_aggregate: {
                readonly __type: "photo_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[photo_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[photo_order_by!]";
                    readonly where: "photo_bool_exp";
                };
            };
            readonly photo_by_pk: {
                readonly __type: "photo";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly photo_xref: {
                readonly __type: "[photo_xref!]!";
                readonly __args: {
                    readonly distinct_on: "[photo_xref_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[photo_xref_order_by!]";
                    readonly where: "photo_xref_bool_exp";
                };
            };
            readonly photo_xref_aggregate: {
                readonly __type: "photo_xref_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[photo_xref_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[photo_xref_order_by!]";
                    readonly where: "photo_xref_bool_exp";
                };
            };
            readonly photo_xref_by_pk: {
                readonly __type: "photo_xref";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly restaurant: {
                readonly __type: "[restaurant!]!";
                readonly __args: {
                    readonly distinct_on: "[restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_order_by!]";
                    readonly where: "restaurant_bool_exp";
                };
            };
            readonly restaurant_aggregate: {
                readonly __type: "restaurant_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_order_by!]";
                    readonly where: "restaurant_bool_exp";
                };
            };
            readonly restaurant_by_pk: {
                readonly __type: "restaurant";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly restaurant_new: {
                readonly __type: "[restaurant!]!";
                readonly __args: {
                    readonly args: "restaurant_new_args!";
                    readonly distinct_on: "[restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_order_by!]";
                    readonly where: "restaurant_bool_exp";
                };
            };
            readonly restaurant_new_aggregate: {
                readonly __type: "restaurant_aggregate!";
                readonly __args: {
                    readonly args: "restaurant_new_args!";
                    readonly distinct_on: "[restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_order_by!]";
                    readonly where: "restaurant_bool_exp";
                };
            };
            readonly restaurant_tag: {
                readonly __type: "[restaurant_tag!]!";
                readonly __args: {
                    readonly distinct_on: "[restaurant_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_tag_order_by!]";
                    readonly where: "restaurant_tag_bool_exp";
                };
            };
            readonly restaurant_tag_aggregate: {
                readonly __type: "restaurant_tag_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[restaurant_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_tag_order_by!]";
                    readonly where: "restaurant_tag_bool_exp";
                };
            };
            readonly restaurant_tag_by_pk: {
                readonly __type: "restaurant_tag";
                readonly __args: {
                    readonly restaurant_id: "uuid!";
                    readonly tag_id: "uuid!";
                };
            };
            readonly restaurant_top_tags: {
                readonly __type: "[restaurant_tag!]!";
                readonly __args: {
                    readonly args: "restaurant_top_tags_args!";
                    readonly distinct_on: "[restaurant_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_tag_order_by!]";
                    readonly where: "restaurant_tag_bool_exp";
                };
            };
            readonly restaurant_top_tags_aggregate: {
                readonly __type: "restaurant_tag_aggregate!";
                readonly __args: {
                    readonly args: "restaurant_top_tags_args!";
                    readonly distinct_on: "[restaurant_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_tag_order_by!]";
                    readonly where: "restaurant_tag_bool_exp";
                };
            };
            readonly restaurant_trending: {
                readonly __type: "[restaurant!]!";
                readonly __args: {
                    readonly args: "restaurant_trending_args!";
                    readonly distinct_on: "[restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_order_by!]";
                    readonly where: "restaurant_bool_exp";
                };
            };
            readonly restaurant_trending_aggregate: {
                readonly __type: "restaurant_aggregate!";
                readonly __args: {
                    readonly args: "restaurant_trending_args!";
                    readonly distinct_on: "[restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_order_by!]";
                    readonly where: "restaurant_bool_exp";
                };
            };
            readonly restaurant_with_tags: {
                readonly __type: "[restaurant!]!";
                readonly __args: {
                    readonly args: "restaurant_with_tags_args!";
                    readonly distinct_on: "[restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_order_by!]";
                    readonly where: "restaurant_bool_exp";
                };
            };
            readonly restaurant_with_tags_aggregate: {
                readonly __type: "restaurant_aggregate!";
                readonly __args: {
                    readonly args: "restaurant_with_tags_args!";
                    readonly distinct_on: "[restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_order_by!]";
                    readonly where: "restaurant_bool_exp";
                };
            };
            readonly review: {
                readonly __type: "[review!]!";
                readonly __args: {
                    readonly distinct_on: "[review_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[review_order_by!]";
                    readonly where: "review_bool_exp";
                };
            };
            readonly review_aggregate: {
                readonly __type: "review_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[review_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[review_order_by!]";
                    readonly where: "review_bool_exp";
                };
            };
            readonly review_by_pk: {
                readonly __type: "review";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly review_tag_sentence: {
                readonly __type: "[review_tag_sentence!]!";
                readonly __args: {
                    readonly distinct_on: "[review_tag_sentence_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[review_tag_sentence_order_by!]";
                    readonly where: "review_tag_sentence_bool_exp";
                };
            };
            readonly review_tag_sentence_aggregate: {
                readonly __type: "review_tag_sentence_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[review_tag_sentence_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[review_tag_sentence_order_by!]";
                    readonly where: "review_tag_sentence_bool_exp";
                };
            };
            readonly review_tag_sentence_by_pk: {
                readonly __type: "review_tag_sentence";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly setting: {
                readonly __type: "[setting!]!";
                readonly __args: {
                    readonly distinct_on: "[setting_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[setting_order_by!]";
                    readonly where: "setting_bool_exp";
                };
            };
            readonly setting_aggregate: {
                readonly __type: "setting_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[setting_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[setting_order_by!]";
                    readonly where: "setting_bool_exp";
                };
            };
            readonly setting_by_pk: {
                readonly __type: "setting";
                readonly __args: {
                    readonly key: "String!";
                };
            };
            readonly tag: {
                readonly __type: "[tag!]!";
                readonly __args: {
                    readonly distinct_on: "[tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[tag_order_by!]";
                    readonly where: "tag_bool_exp";
                };
            };
            readonly tag_aggregate: {
                readonly __type: "tag_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[tag_order_by!]";
                    readonly where: "tag_bool_exp";
                };
            };
            readonly tag_by_pk: {
                readonly __type: "tag";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly tag_tag: {
                readonly __type: "[tag_tag!]!";
                readonly __args: {
                    readonly distinct_on: "[tag_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[tag_tag_order_by!]";
                    readonly where: "tag_tag_bool_exp";
                };
            };
            readonly tag_tag_aggregate: {
                readonly __type: "tag_tag_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[tag_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[tag_tag_order_by!]";
                    readonly where: "tag_tag_bool_exp";
                };
            };
            readonly tag_tag_by_pk: {
                readonly __type: "tag_tag";
                readonly __args: {
                    readonly category_tag_id: "uuid!";
                    readonly tag_id: "uuid!";
                };
            };
            readonly user: {
                readonly __type: "[user!]!";
                readonly __args: {
                    readonly distinct_on: "[user_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[user_order_by!]";
                    readonly where: "user_bool_exp";
                };
            };
            readonly user_aggregate: {
                readonly __type: "user_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[user_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[user_order_by!]";
                    readonly where: "user_bool_exp";
                };
            };
            readonly user_by_pk: {
                readonly __type: "user";
                readonly __args: {
                    readonly id: "uuid!";
                };
            };
            readonly zcta5: {
                readonly __type: "[zcta5!]!";
                readonly __args: {
                    readonly distinct_on: "[zcta5_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[zcta5_order_by!]";
                    readonly where: "zcta5_bool_exp";
                };
            };
            readonly zcta5_aggregate: {
                readonly __type: "zcta5_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[zcta5_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[zcta5_order_by!]";
                    readonly where: "zcta5_bool_exp";
                };
            };
            readonly zcta5_by_pk: {
                readonly __type: "zcta5";
                readonly __args: {
                    readonly ogc_fid: "Int!";
                };
            };
        };
        readonly Boolean_comparison_exp: {
            readonly _eq: {
                readonly __type: "Boolean";
            };
            readonly _gt: {
                readonly __type: "Boolean";
            };
            readonly _gte: {
                readonly __type: "Boolean";
            };
            readonly _in: {
                readonly __type: "[Boolean!]";
            };
            readonly _is_null: {
                readonly __type: "Boolean";
            };
            readonly _lt: {
                readonly __type: "Boolean";
            };
            readonly _lte: {
                readonly __type: "Boolean";
            };
            readonly _neq: {
                readonly __type: "Boolean";
            };
            readonly _nin: {
                readonly __type: "[Boolean!]";
            };
        };
        readonly Int_comparison_exp: {
            readonly _eq: {
                readonly __type: "Int";
            };
            readonly _gt: {
                readonly __type: "Int";
            };
            readonly _gte: {
                readonly __type: "Int";
            };
            readonly _in: {
                readonly __type: "[Int!]";
            };
            readonly _is_null: {
                readonly __type: "Boolean";
            };
            readonly _lt: {
                readonly __type: "Int";
            };
            readonly _lte: {
                readonly __type: "Int";
            };
            readonly _neq: {
                readonly __type: "Int";
            };
            readonly _nin: {
                readonly __type: "[Int!]";
            };
        };
        readonly String_comparison_exp: {
            readonly _eq: {
                readonly __type: "String";
            };
            readonly _gt: {
                readonly __type: "String";
            };
            readonly _gte: {
                readonly __type: "String";
            };
            readonly _ilike: {
                readonly __type: "String";
            };
            readonly _in: {
                readonly __type: "[String!]";
            };
            readonly _is_null: {
                readonly __type: "Boolean";
            };
            readonly _like: {
                readonly __type: "String";
            };
            readonly _lt: {
                readonly __type: "String";
            };
            readonly _lte: {
                readonly __type: "String";
            };
            readonly _neq: {
                readonly __type: "String";
            };
            readonly _nilike: {
                readonly __type: "String";
            };
            readonly _nin: {
                readonly __type: "[String!]";
            };
            readonly _nlike: {
                readonly __type: "String";
            };
            readonly _nsimilar: {
                readonly __type: "String";
            };
            readonly _similar: {
                readonly __type: "String";
            };
        };
        readonly geography_cast_exp: {
            readonly geometry: {
                readonly __type: "geometry_comparison_exp";
            };
        };
        readonly geography_comparison_exp: {
            readonly _cast: {
                readonly __type: "geography_cast_exp";
            };
            readonly _eq: {
                readonly __type: "geography";
            };
            readonly _gt: {
                readonly __type: "geography";
            };
            readonly _gte: {
                readonly __type: "geography";
            };
            readonly _in: {
                readonly __type: "[geography!]";
            };
            readonly _is_null: {
                readonly __type: "Boolean";
            };
            readonly _lt: {
                readonly __type: "geography";
            };
            readonly _lte: {
                readonly __type: "geography";
            };
            readonly _neq: {
                readonly __type: "geography";
            };
            readonly _nin: {
                readonly __type: "[geography!]";
            };
            readonly _st_d_within: {
                readonly __type: "st_d_within_geography_input";
            };
            readonly _st_intersects: {
                readonly __type: "geography";
            };
        };
        readonly geometry_cast_exp: {
            readonly geography: {
                readonly __type: "geography_comparison_exp";
            };
        };
        readonly geometry_comparison_exp: {
            readonly _cast: {
                readonly __type: "geometry_cast_exp";
            };
            readonly _eq: {
                readonly __type: "geometry";
            };
            readonly _gt: {
                readonly __type: "geometry";
            };
            readonly _gte: {
                readonly __type: "geometry";
            };
            readonly _in: {
                readonly __type: "[geometry!]";
            };
            readonly _is_null: {
                readonly __type: "Boolean";
            };
            readonly _lt: {
                readonly __type: "geometry";
            };
            readonly _lte: {
                readonly __type: "geometry";
            };
            readonly _neq: {
                readonly __type: "geometry";
            };
            readonly _nin: {
                readonly __type: "[geometry!]";
            };
            readonly _st_contains: {
                readonly __type: "geometry";
            };
            readonly _st_crosses: {
                readonly __type: "geometry";
            };
            readonly _st_d_within: {
                readonly __type: "st_d_within_input";
            };
            readonly _st_equals: {
                readonly __type: "geometry";
            };
            readonly _st_intersects: {
                readonly __type: "geometry";
            };
            readonly _st_overlaps: {
                readonly __type: "geometry";
            };
            readonly _st_touches: {
                readonly __type: "geometry";
            };
            readonly _st_within: {
                readonly __type: "geometry";
            };
        };
        readonly hrr: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly color: {
                readonly __type: "String";
            };
            readonly hrrcity: {
                readonly __type: "String";
            };
            readonly ogc_fid: {
                readonly __type: "Int!";
            };
            readonly slug: {
                readonly __type: "String";
            };
            readonly wkb_geometry: {
                readonly __type: "geometry";
            };
        };
        readonly hrr_aggregate: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly aggregate: {
                readonly __type: "hrr_aggregate_fields";
            };
            readonly nodes: {
                readonly __type: "[hrr!]!";
            };
        };
        readonly hrr_aggregate_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly avg: {
                readonly __type: "hrr_avg_fields";
            };
            readonly count: {
                readonly __type: "Int";
                readonly __args: {
                    readonly columns: "[hrr_select_column!]";
                    readonly distinct: "Boolean";
                };
            };
            readonly max: {
                readonly __type: "hrr_max_fields";
            };
            readonly min: {
                readonly __type: "hrr_min_fields";
            };
            readonly stddev: {
                readonly __type: "hrr_stddev_fields";
            };
            readonly stddev_pop: {
                readonly __type: "hrr_stddev_pop_fields";
            };
            readonly stddev_samp: {
                readonly __type: "hrr_stddev_samp_fields";
            };
            readonly sum: {
                readonly __type: "hrr_sum_fields";
            };
            readonly var_pop: {
                readonly __type: "hrr_var_pop_fields";
            };
            readonly var_samp: {
                readonly __type: "hrr_var_samp_fields";
            };
            readonly variance: {
                readonly __type: "hrr_variance_fields";
            };
        };
        readonly hrr_aggregate_order_by: {
            readonly avg: {
                readonly __type: "hrr_avg_order_by";
            };
            readonly count: {
                readonly __type: "order_by";
            };
            readonly max: {
                readonly __type: "hrr_max_order_by";
            };
            readonly min: {
                readonly __type: "hrr_min_order_by";
            };
            readonly stddev: {
                readonly __type: "hrr_stddev_order_by";
            };
            readonly stddev_pop: {
                readonly __type: "hrr_stddev_pop_order_by";
            };
            readonly stddev_samp: {
                readonly __type: "hrr_stddev_samp_order_by";
            };
            readonly sum: {
                readonly __type: "hrr_sum_order_by";
            };
            readonly var_pop: {
                readonly __type: "hrr_var_pop_order_by";
            };
            readonly var_samp: {
                readonly __type: "hrr_var_samp_order_by";
            };
            readonly variance: {
                readonly __type: "hrr_variance_order_by";
            };
        };
        readonly hrr_arr_rel_insert_input: {
            readonly data: {
                readonly __type: "[hrr_insert_input!]!";
            };
            readonly on_conflict: {
                readonly __type: "hrr_on_conflict";
            };
        };
        readonly hrr_avg_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly hrr_avg_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly hrr_bool_exp: {
            readonly _and: {
                readonly __type: "[hrr_bool_exp]";
            };
            readonly _not: {
                readonly __type: "hrr_bool_exp";
            };
            readonly _or: {
                readonly __type: "[hrr_bool_exp]";
            };
            readonly color: {
                readonly __type: "String_comparison_exp";
            };
            readonly hrrcity: {
                readonly __type: "String_comparison_exp";
            };
            readonly ogc_fid: {
                readonly __type: "Int_comparison_exp";
            };
            readonly slug: {
                readonly __type: "String_comparison_exp";
            };
            readonly wkb_geometry: {
                readonly __type: "geometry_comparison_exp";
            };
        };
        readonly hrr_inc_input: {
            readonly ogc_fid: {
                readonly __type: "Int";
            };
        };
        readonly hrr_insert_input: {
            readonly color: {
                readonly __type: "String";
            };
            readonly hrrcity: {
                readonly __type: "String";
            };
            readonly ogc_fid: {
                readonly __type: "Int";
            };
            readonly slug: {
                readonly __type: "String";
            };
            readonly wkb_geometry: {
                readonly __type: "geometry";
            };
        };
        readonly hrr_max_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly color: {
                readonly __type: "String";
            };
            readonly hrrcity: {
                readonly __type: "String";
            };
            readonly ogc_fid: {
                readonly __type: "Int";
            };
            readonly slug: {
                readonly __type: "String";
            };
        };
        readonly hrr_max_order_by: {
            readonly color: {
                readonly __type: "order_by";
            };
            readonly hrrcity: {
                readonly __type: "order_by";
            };
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
            readonly slug: {
                readonly __type: "order_by";
            };
        };
        readonly hrr_min_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly color: {
                readonly __type: "String";
            };
            readonly hrrcity: {
                readonly __type: "String";
            };
            readonly ogc_fid: {
                readonly __type: "Int";
            };
            readonly slug: {
                readonly __type: "String";
            };
        };
        readonly hrr_min_order_by: {
            readonly color: {
                readonly __type: "order_by";
            };
            readonly hrrcity: {
                readonly __type: "order_by";
            };
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
            readonly slug: {
                readonly __type: "order_by";
            };
        };
        readonly hrr_mutation_response: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly affected_rows: {
                readonly __type: "Int!";
            };
            readonly returning: {
                readonly __type: "[hrr!]!";
            };
        };
        readonly hrr_obj_rel_insert_input: {
            readonly data: {
                readonly __type: "hrr_insert_input!";
            };
            readonly on_conflict: {
                readonly __type: "hrr_on_conflict";
            };
        };
        readonly hrr_on_conflict: {
            readonly constraint: {
                readonly __type: "hrr_constraint!";
            };
            readonly update_columns: {
                readonly __type: "[hrr_update_column!]!";
            };
            readonly where: {
                readonly __type: "hrr_bool_exp";
            };
        };
        readonly hrr_order_by: {
            readonly color: {
                readonly __type: "order_by";
            };
            readonly hrrcity: {
                readonly __type: "order_by";
            };
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
            readonly slug: {
                readonly __type: "order_by";
            };
            readonly wkb_geometry: {
                readonly __type: "order_by";
            };
        };
        readonly hrr_pk_columns_input: {
            readonly ogc_fid: {
                readonly __type: "Int!";
            };
        };
        readonly hrr_set_input: {
            readonly color: {
                readonly __type: "String";
            };
            readonly hrrcity: {
                readonly __type: "String";
            };
            readonly ogc_fid: {
                readonly __type: "Int";
            };
            readonly slug: {
                readonly __type: "String";
            };
            readonly wkb_geometry: {
                readonly __type: "geometry";
            };
        };
        readonly hrr_stddev_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly hrr_stddev_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly hrr_stddev_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly hrr_stddev_pop_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly hrr_stddev_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly hrr_stddev_samp_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly hrr_sum_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Int";
            };
        };
        readonly hrr_sum_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly hrr_var_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly hrr_var_pop_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly hrr_var_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly hrr_var_samp_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly hrr_variance_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly hrr_variance_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly jsonb_comparison_exp: {
            readonly _contained_in: {
                readonly __type: "jsonb";
            };
            readonly _contains: {
                readonly __type: "jsonb";
            };
            readonly _eq: {
                readonly __type: "jsonb";
            };
            readonly _gt: {
                readonly __type: "jsonb";
            };
            readonly _gte: {
                readonly __type: "jsonb";
            };
            readonly _has_key: {
                readonly __type: "String";
            };
            readonly _has_keys_all: {
                readonly __type: "[String!]";
            };
            readonly _has_keys_any: {
                readonly __type: "[String!]";
            };
            readonly _in: {
                readonly __type: "[jsonb!]";
            };
            readonly _is_null: {
                readonly __type: "Boolean";
            };
            readonly _lt: {
                readonly __type: "jsonb";
            };
            readonly _lte: {
                readonly __type: "jsonb";
            };
            readonly _neq: {
                readonly __type: "jsonb";
            };
            readonly _nin: {
                readonly __type: "[jsonb!]";
            };
        };
        readonly list: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly color: {
                readonly __type: "Int";
            };
            readonly created_at: {
                readonly __type: "timestamptz!";
            };
            readonly description: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid!";
            };
            readonly location: {
                readonly __type: "geometry";
            };
            readonly name: {
                readonly __type: "String!";
            };
            readonly public: {
                readonly __type: "Boolean!";
            };
            readonly region: {
                readonly __type: "String";
            };
            readonly restaurants: {
                readonly __type: "[list_restaurant!]!";
                readonly __args: {
                    readonly distinct_on: "[list_restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_restaurant_order_by!]";
                    readonly where: "list_restaurant_bool_exp";
                };
            };
            readonly restaurants_aggregate: {
                readonly __type: "list_restaurant_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[list_restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_restaurant_order_by!]";
                    readonly where: "list_restaurant_bool_exp";
                };
            };
            readonly slug: {
                readonly __type: "String!";
            };
            readonly tags: {
                readonly __type: "[list_tag!]!";
                readonly __args: {
                    readonly distinct_on: "[list_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_tag_order_by!]";
                    readonly where: "list_tag_bool_exp";
                };
            };
            readonly tags_aggregate: {
                readonly __type: "list_tag_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[list_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_tag_order_by!]";
                    readonly where: "list_tag_bool_exp";
                };
            };
            readonly updated_at: {
                readonly __type: "timestamptz!";
            };
            readonly user: {
                readonly __type: "user";
            };
            readonly user_id: {
                readonly __type: "uuid!";
            };
        };
        readonly list_aggregate: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly aggregate: {
                readonly __type: "list_aggregate_fields";
            };
            readonly nodes: {
                readonly __type: "[list!]!";
            };
        };
        readonly list_aggregate_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly avg: {
                readonly __type: "list_avg_fields";
            };
            readonly count: {
                readonly __type: "Int";
                readonly __args: {
                    readonly columns: "[list_select_column!]";
                    readonly distinct: "Boolean";
                };
            };
            readonly max: {
                readonly __type: "list_max_fields";
            };
            readonly min: {
                readonly __type: "list_min_fields";
            };
            readonly stddev: {
                readonly __type: "list_stddev_fields";
            };
            readonly stddev_pop: {
                readonly __type: "list_stddev_pop_fields";
            };
            readonly stddev_samp: {
                readonly __type: "list_stddev_samp_fields";
            };
            readonly sum: {
                readonly __type: "list_sum_fields";
            };
            readonly var_pop: {
                readonly __type: "list_var_pop_fields";
            };
            readonly var_samp: {
                readonly __type: "list_var_samp_fields";
            };
            readonly variance: {
                readonly __type: "list_variance_fields";
            };
        };
        readonly list_aggregate_order_by: {
            readonly avg: {
                readonly __type: "list_avg_order_by";
            };
            readonly count: {
                readonly __type: "order_by";
            };
            readonly max: {
                readonly __type: "list_max_order_by";
            };
            readonly min: {
                readonly __type: "list_min_order_by";
            };
            readonly stddev: {
                readonly __type: "list_stddev_order_by";
            };
            readonly stddev_pop: {
                readonly __type: "list_stddev_pop_order_by";
            };
            readonly stddev_samp: {
                readonly __type: "list_stddev_samp_order_by";
            };
            readonly sum: {
                readonly __type: "list_sum_order_by";
            };
            readonly var_pop: {
                readonly __type: "list_var_pop_order_by";
            };
            readonly var_samp: {
                readonly __type: "list_var_samp_order_by";
            };
            readonly variance: {
                readonly __type: "list_variance_order_by";
            };
        };
        readonly list_arr_rel_insert_input: {
            readonly data: {
                readonly __type: "[list_insert_input!]!";
            };
            readonly on_conflict: {
                readonly __type: "list_on_conflict";
            };
        };
        readonly list_avg_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly color: {
                readonly __type: "Float";
            };
        };
        readonly list_avg_order_by: {
            readonly color: {
                readonly __type: "order_by";
            };
        };
        readonly list_bool_exp: {
            readonly _and: {
                readonly __type: "[list_bool_exp]";
            };
            readonly _not: {
                readonly __type: "list_bool_exp";
            };
            readonly _or: {
                readonly __type: "[list_bool_exp]";
            };
            readonly color: {
                readonly __type: "Int_comparison_exp";
            };
            readonly created_at: {
                readonly __type: "timestamptz_comparison_exp";
            };
            readonly description: {
                readonly __type: "String_comparison_exp";
            };
            readonly id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly location: {
                readonly __type: "geometry_comparison_exp";
            };
            readonly name: {
                readonly __type: "String_comparison_exp";
            };
            readonly public: {
                readonly __type: "Boolean_comparison_exp";
            };
            readonly region: {
                readonly __type: "String_comparison_exp";
            };
            readonly restaurants: {
                readonly __type: "list_restaurant_bool_exp";
            };
            readonly slug: {
                readonly __type: "String_comparison_exp";
            };
            readonly tags: {
                readonly __type: "list_tag_bool_exp";
            };
            readonly updated_at: {
                readonly __type: "timestamptz_comparison_exp";
            };
            readonly user: {
                readonly __type: "user_bool_exp";
            };
            readonly user_id: {
                readonly __type: "uuid_comparison_exp";
            };
        };
        readonly list_inc_input: {
            readonly color: {
                readonly __type: "Int";
            };
        };
        readonly list_insert_input: {
            readonly color: {
                readonly __type: "Int";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly description: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly location: {
                readonly __type: "geometry";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly public: {
                readonly __type: "Boolean";
            };
            readonly region: {
                readonly __type: "String";
            };
            readonly restaurants: {
                readonly __type: "list_restaurant_arr_rel_insert_input";
            };
            readonly slug: {
                readonly __type: "String";
            };
            readonly tags: {
                readonly __type: "list_tag_arr_rel_insert_input";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly user: {
                readonly __type: "user_obj_rel_insert_input";
            };
            readonly user_id: {
                readonly __type: "uuid";
            };
        };
        readonly list_max_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly color: {
                readonly __type: "Int";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly description: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly region: {
                readonly __type: "String";
            };
            readonly slug: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly user_id: {
                readonly __type: "uuid";
            };
        };
        readonly list_max_order_by: {
            readonly color: {
                readonly __type: "order_by";
            };
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly description: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly name: {
                readonly __type: "order_by";
            };
            readonly region: {
                readonly __type: "order_by";
            };
            readonly slug: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
            readonly user_id: {
                readonly __type: "order_by";
            };
        };
        readonly list_min_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly color: {
                readonly __type: "Int";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly description: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly region: {
                readonly __type: "String";
            };
            readonly slug: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly user_id: {
                readonly __type: "uuid";
            };
        };
        readonly list_min_order_by: {
            readonly color: {
                readonly __type: "order_by";
            };
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly description: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly name: {
                readonly __type: "order_by";
            };
            readonly region: {
                readonly __type: "order_by";
            };
            readonly slug: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
            readonly user_id: {
                readonly __type: "order_by";
            };
        };
        readonly list_mutation_response: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly affected_rows: {
                readonly __type: "Int!";
            };
            readonly returning: {
                readonly __type: "[list!]!";
            };
        };
        readonly list_obj_rel_insert_input: {
            readonly data: {
                readonly __type: "list_insert_input!";
            };
            readonly on_conflict: {
                readonly __type: "list_on_conflict";
            };
        };
        readonly list_on_conflict: {
            readonly constraint: {
                readonly __type: "list_constraint!";
            };
            readonly update_columns: {
                readonly __type: "[list_update_column!]!";
            };
            readonly where: {
                readonly __type: "list_bool_exp";
            };
        };
        readonly list_order_by: {
            readonly color: {
                readonly __type: "order_by";
            };
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly description: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly location: {
                readonly __type: "order_by";
            };
            readonly name: {
                readonly __type: "order_by";
            };
            readonly public: {
                readonly __type: "order_by";
            };
            readonly region: {
                readonly __type: "order_by";
            };
            readonly restaurants_aggregate: {
                readonly __type: "list_restaurant_aggregate_order_by";
            };
            readonly slug: {
                readonly __type: "order_by";
            };
            readonly tags_aggregate: {
                readonly __type: "list_tag_aggregate_order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
            readonly user: {
                readonly __type: "user_order_by";
            };
            readonly user_id: {
                readonly __type: "order_by";
            };
        };
        readonly list_pk_columns_input: {
            readonly id: {
                readonly __type: "uuid!";
            };
        };
        readonly list_populated_args: {
            readonly min_items: {
                readonly __type: "Int";
            };
        };
        readonly list_restaurant: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly comment: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid!";
            };
            readonly list: {
                readonly __type: "list!";
            };
            readonly list_id: {
                readonly __type: "uuid!";
            };
            readonly position: {
                readonly __type: "Int";
            };
            readonly restaurant: {
                readonly __type: "restaurant!";
            };
            readonly restaurant_id: {
                readonly __type: "uuid!";
            };
            readonly restaurants: {
                readonly __type: "[restaurant!]!";
                readonly __args: {
                    readonly distinct_on: "[restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_order_by!]";
                    readonly where: "restaurant_bool_exp";
                };
            };
            readonly restaurants_aggregate: {
                readonly __type: "restaurant_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_order_by!]";
                    readonly where: "restaurant_bool_exp";
                };
            };
            readonly tags: {
                readonly __type: "[list_restaurant_tag!]!";
                readonly __args: {
                    readonly distinct_on: "[list_restaurant_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_restaurant_tag_order_by!]";
                    readonly where: "list_restaurant_tag_bool_exp";
                };
            };
            readonly tags_aggregate: {
                readonly __type: "list_restaurant_tag_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[list_restaurant_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_restaurant_tag_order_by!]";
                    readonly where: "list_restaurant_tag_bool_exp";
                };
            };
            readonly user_id: {
                readonly __type: "uuid!";
            };
        };
        readonly list_restaurant_aggregate: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly aggregate: {
                readonly __type: "list_restaurant_aggregate_fields";
            };
            readonly nodes: {
                readonly __type: "[list_restaurant!]!";
            };
        };
        readonly list_restaurant_aggregate_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly avg: {
                readonly __type: "list_restaurant_avg_fields";
            };
            readonly count: {
                readonly __type: "Int";
                readonly __args: {
                    readonly columns: "[list_restaurant_select_column!]";
                    readonly distinct: "Boolean";
                };
            };
            readonly max: {
                readonly __type: "list_restaurant_max_fields";
            };
            readonly min: {
                readonly __type: "list_restaurant_min_fields";
            };
            readonly stddev: {
                readonly __type: "list_restaurant_stddev_fields";
            };
            readonly stddev_pop: {
                readonly __type: "list_restaurant_stddev_pop_fields";
            };
            readonly stddev_samp: {
                readonly __type: "list_restaurant_stddev_samp_fields";
            };
            readonly sum: {
                readonly __type: "list_restaurant_sum_fields";
            };
            readonly var_pop: {
                readonly __type: "list_restaurant_var_pop_fields";
            };
            readonly var_samp: {
                readonly __type: "list_restaurant_var_samp_fields";
            };
            readonly variance: {
                readonly __type: "list_restaurant_variance_fields";
            };
        };
        readonly list_restaurant_aggregate_order_by: {
            readonly avg: {
                readonly __type: "list_restaurant_avg_order_by";
            };
            readonly count: {
                readonly __type: "order_by";
            };
            readonly max: {
                readonly __type: "list_restaurant_max_order_by";
            };
            readonly min: {
                readonly __type: "list_restaurant_min_order_by";
            };
            readonly stddev: {
                readonly __type: "list_restaurant_stddev_order_by";
            };
            readonly stddev_pop: {
                readonly __type: "list_restaurant_stddev_pop_order_by";
            };
            readonly stddev_samp: {
                readonly __type: "list_restaurant_stddev_samp_order_by";
            };
            readonly sum: {
                readonly __type: "list_restaurant_sum_order_by";
            };
            readonly var_pop: {
                readonly __type: "list_restaurant_var_pop_order_by";
            };
            readonly var_samp: {
                readonly __type: "list_restaurant_var_samp_order_by";
            };
            readonly variance: {
                readonly __type: "list_restaurant_variance_order_by";
            };
        };
        readonly list_restaurant_arr_rel_insert_input: {
            readonly data: {
                readonly __type: "[list_restaurant_insert_input!]!";
            };
            readonly on_conflict: {
                readonly __type: "list_restaurant_on_conflict";
            };
        };
        readonly list_restaurant_avg_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly position: {
                readonly __type: "Float";
            };
        };
        readonly list_restaurant_avg_order_by: {
            readonly position: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_bool_exp: {
            readonly _and: {
                readonly __type: "[list_restaurant_bool_exp]";
            };
            readonly _not: {
                readonly __type: "list_restaurant_bool_exp";
            };
            readonly _or: {
                readonly __type: "[list_restaurant_bool_exp]";
            };
            readonly comment: {
                readonly __type: "String_comparison_exp";
            };
            readonly id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly list: {
                readonly __type: "list_bool_exp";
            };
            readonly list_id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly position: {
                readonly __type: "Int_comparison_exp";
            };
            readonly restaurant: {
                readonly __type: "restaurant_bool_exp";
            };
            readonly restaurant_id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly restaurants: {
                readonly __type: "restaurant_bool_exp";
            };
            readonly tags: {
                readonly __type: "list_restaurant_tag_bool_exp";
            };
            readonly user_id: {
                readonly __type: "uuid_comparison_exp";
            };
        };
        readonly list_restaurant_inc_input: {
            readonly position: {
                readonly __type: "Int";
            };
        };
        readonly list_restaurant_insert_input: {
            readonly comment: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly list: {
                readonly __type: "list_obj_rel_insert_input";
            };
            readonly list_id: {
                readonly __type: "uuid";
            };
            readonly position: {
                readonly __type: "Int";
            };
            readonly restaurant: {
                readonly __type: "restaurant_obj_rel_insert_input";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly restaurants: {
                readonly __type: "restaurant_arr_rel_insert_input";
            };
            readonly tags: {
                readonly __type: "list_restaurant_tag_arr_rel_insert_input";
            };
            readonly user_id: {
                readonly __type: "uuid";
            };
        };
        readonly list_restaurant_max_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly comment: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly list_id: {
                readonly __type: "uuid";
            };
            readonly position: {
                readonly __type: "Int";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly user_id: {
                readonly __type: "uuid";
            };
        };
        readonly list_restaurant_max_order_by: {
            readonly comment: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly list_id: {
                readonly __type: "order_by";
            };
            readonly position: {
                readonly __type: "order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
            readonly user_id: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_min_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly comment: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly list_id: {
                readonly __type: "uuid";
            };
            readonly position: {
                readonly __type: "Int";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly user_id: {
                readonly __type: "uuid";
            };
        };
        readonly list_restaurant_min_order_by: {
            readonly comment: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly list_id: {
                readonly __type: "order_by";
            };
            readonly position: {
                readonly __type: "order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
            readonly user_id: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_mutation_response: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly affected_rows: {
                readonly __type: "Int!";
            };
            readonly returning: {
                readonly __type: "[list_restaurant!]!";
            };
        };
        readonly list_restaurant_obj_rel_insert_input: {
            readonly data: {
                readonly __type: "list_restaurant_insert_input!";
            };
            readonly on_conflict: {
                readonly __type: "list_restaurant_on_conflict";
            };
        };
        readonly list_restaurant_on_conflict: {
            readonly constraint: {
                readonly __type: "list_restaurant_constraint!";
            };
            readonly update_columns: {
                readonly __type: "[list_restaurant_update_column!]!";
            };
            readonly where: {
                readonly __type: "list_restaurant_bool_exp";
            };
        };
        readonly list_restaurant_order_by: {
            readonly comment: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly list: {
                readonly __type: "list_order_by";
            };
            readonly list_id: {
                readonly __type: "order_by";
            };
            readonly position: {
                readonly __type: "order_by";
            };
            readonly restaurant: {
                readonly __type: "restaurant_order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
            readonly restaurants_aggregate: {
                readonly __type: "restaurant_aggregate_order_by";
            };
            readonly tags_aggregate: {
                readonly __type: "list_restaurant_tag_aggregate_order_by";
            };
            readonly user_id: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_pk_columns_input: {
            readonly list_id: {
                readonly __type: "uuid!";
            };
            readonly restaurant_id: {
                readonly __type: "uuid!";
            };
        };
        readonly list_restaurant_set_input: {
            readonly comment: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly list_id: {
                readonly __type: "uuid";
            };
            readonly position: {
                readonly __type: "Int";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly user_id: {
                readonly __type: "uuid";
            };
        };
        readonly list_restaurant_stddev_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly position: {
                readonly __type: "Float";
            };
        };
        readonly list_restaurant_stddev_order_by: {
            readonly position: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_stddev_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly position: {
                readonly __type: "Float";
            };
        };
        readonly list_restaurant_stddev_pop_order_by: {
            readonly position: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_stddev_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly position: {
                readonly __type: "Float";
            };
        };
        readonly list_restaurant_stddev_samp_order_by: {
            readonly position: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_sum_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly position: {
                readonly __type: "Int";
            };
        };
        readonly list_restaurant_sum_order_by: {
            readonly position: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_tag: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly id: {
                readonly __type: "uuid!";
            };
            readonly list_id: {
                readonly __type: "uuid!";
            };
            readonly list_restaurant_id: {
                readonly __type: "uuid!";
            };
            readonly position: {
                readonly __type: "Int!";
            };
            readonly restaurant_tag: {
                readonly __type: "restaurant_tag";
            };
            readonly restaurant_tag_id: {
                readonly __type: "uuid!";
            };
            readonly user_id: {
                readonly __type: "uuid!";
            };
        };
        readonly list_restaurant_tag_aggregate: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly aggregate: {
                readonly __type: "list_restaurant_tag_aggregate_fields";
            };
            readonly nodes: {
                readonly __type: "[list_restaurant_tag!]!";
            };
        };
        readonly list_restaurant_tag_aggregate_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly avg: {
                readonly __type: "list_restaurant_tag_avg_fields";
            };
            readonly count: {
                readonly __type: "Int";
                readonly __args: {
                    readonly columns: "[list_restaurant_tag_select_column!]";
                    readonly distinct: "Boolean";
                };
            };
            readonly max: {
                readonly __type: "list_restaurant_tag_max_fields";
            };
            readonly min: {
                readonly __type: "list_restaurant_tag_min_fields";
            };
            readonly stddev: {
                readonly __type: "list_restaurant_tag_stddev_fields";
            };
            readonly stddev_pop: {
                readonly __type: "list_restaurant_tag_stddev_pop_fields";
            };
            readonly stddev_samp: {
                readonly __type: "list_restaurant_tag_stddev_samp_fields";
            };
            readonly sum: {
                readonly __type: "list_restaurant_tag_sum_fields";
            };
            readonly var_pop: {
                readonly __type: "list_restaurant_tag_var_pop_fields";
            };
            readonly var_samp: {
                readonly __type: "list_restaurant_tag_var_samp_fields";
            };
            readonly variance: {
                readonly __type: "list_restaurant_tag_variance_fields";
            };
        };
        readonly list_restaurant_tag_aggregate_order_by: {
            readonly avg: {
                readonly __type: "list_restaurant_tag_avg_order_by";
            };
            readonly count: {
                readonly __type: "order_by";
            };
            readonly max: {
                readonly __type: "list_restaurant_tag_max_order_by";
            };
            readonly min: {
                readonly __type: "list_restaurant_tag_min_order_by";
            };
            readonly stddev: {
                readonly __type: "list_restaurant_tag_stddev_order_by";
            };
            readonly stddev_pop: {
                readonly __type: "list_restaurant_tag_stddev_pop_order_by";
            };
            readonly stddev_samp: {
                readonly __type: "list_restaurant_tag_stddev_samp_order_by";
            };
            readonly sum: {
                readonly __type: "list_restaurant_tag_sum_order_by";
            };
            readonly var_pop: {
                readonly __type: "list_restaurant_tag_var_pop_order_by";
            };
            readonly var_samp: {
                readonly __type: "list_restaurant_tag_var_samp_order_by";
            };
            readonly variance: {
                readonly __type: "list_restaurant_tag_variance_order_by";
            };
        };
        readonly list_restaurant_tag_arr_rel_insert_input: {
            readonly data: {
                readonly __type: "[list_restaurant_tag_insert_input!]!";
            };
            readonly on_conflict: {
                readonly __type: "list_restaurant_tag_on_conflict";
            };
        };
        readonly list_restaurant_tag_avg_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly position: {
                readonly __type: "Float";
            };
        };
        readonly list_restaurant_tag_avg_order_by: {
            readonly position: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_tag_bool_exp: {
            readonly _and: {
                readonly __type: "[list_restaurant_tag_bool_exp]";
            };
            readonly _not: {
                readonly __type: "list_restaurant_tag_bool_exp";
            };
            readonly _or: {
                readonly __type: "[list_restaurant_tag_bool_exp]";
            };
            readonly id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly list_id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly list_restaurant_id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly position: {
                readonly __type: "Int_comparison_exp";
            };
            readonly restaurant_tag: {
                readonly __type: "restaurant_tag_bool_exp";
            };
            readonly restaurant_tag_id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly user_id: {
                readonly __type: "uuid_comparison_exp";
            };
        };
        readonly list_restaurant_tag_inc_input: {
            readonly position: {
                readonly __type: "Int";
            };
        };
        readonly list_restaurant_tag_insert_input: {
            readonly id: {
                readonly __type: "uuid";
            };
            readonly list_id: {
                readonly __type: "uuid";
            };
            readonly list_restaurant_id: {
                readonly __type: "uuid";
            };
            readonly position: {
                readonly __type: "Int";
            };
            readonly restaurant_tag: {
                readonly __type: "restaurant_tag_obj_rel_insert_input";
            };
            readonly restaurant_tag_id: {
                readonly __type: "uuid";
            };
            readonly user_id: {
                readonly __type: "uuid";
            };
        };
        readonly list_restaurant_tag_max_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly list_id: {
                readonly __type: "uuid";
            };
            readonly list_restaurant_id: {
                readonly __type: "uuid";
            };
            readonly position: {
                readonly __type: "Int";
            };
            readonly restaurant_tag_id: {
                readonly __type: "uuid";
            };
            readonly user_id: {
                readonly __type: "uuid";
            };
        };
        readonly list_restaurant_tag_max_order_by: {
            readonly id: {
                readonly __type: "order_by";
            };
            readonly list_id: {
                readonly __type: "order_by";
            };
            readonly list_restaurant_id: {
                readonly __type: "order_by";
            };
            readonly position: {
                readonly __type: "order_by";
            };
            readonly restaurant_tag_id: {
                readonly __type: "order_by";
            };
            readonly user_id: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_tag_min_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly list_id: {
                readonly __type: "uuid";
            };
            readonly list_restaurant_id: {
                readonly __type: "uuid";
            };
            readonly position: {
                readonly __type: "Int";
            };
            readonly restaurant_tag_id: {
                readonly __type: "uuid";
            };
            readonly user_id: {
                readonly __type: "uuid";
            };
        };
        readonly list_restaurant_tag_min_order_by: {
            readonly id: {
                readonly __type: "order_by";
            };
            readonly list_id: {
                readonly __type: "order_by";
            };
            readonly list_restaurant_id: {
                readonly __type: "order_by";
            };
            readonly position: {
                readonly __type: "order_by";
            };
            readonly restaurant_tag_id: {
                readonly __type: "order_by";
            };
            readonly user_id: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_tag_mutation_response: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly affected_rows: {
                readonly __type: "Int!";
            };
            readonly returning: {
                readonly __type: "[list_restaurant_tag!]!";
            };
        };
        readonly list_restaurant_tag_obj_rel_insert_input: {
            readonly data: {
                readonly __type: "list_restaurant_tag_insert_input!";
            };
            readonly on_conflict: {
                readonly __type: "list_restaurant_tag_on_conflict";
            };
        };
        readonly list_restaurant_tag_on_conflict: {
            readonly constraint: {
                readonly __type: "list_restaurant_tag_constraint!";
            };
            readonly update_columns: {
                readonly __type: "[list_restaurant_tag_update_column!]!";
            };
            readonly where: {
                readonly __type: "list_restaurant_tag_bool_exp";
            };
        };
        readonly list_restaurant_tag_order_by: {
            readonly id: {
                readonly __type: "order_by";
            };
            readonly list_id: {
                readonly __type: "order_by";
            };
            readonly list_restaurant_id: {
                readonly __type: "order_by";
            };
            readonly position: {
                readonly __type: "order_by";
            };
            readonly restaurant_tag: {
                readonly __type: "restaurant_tag_order_by";
            };
            readonly restaurant_tag_id: {
                readonly __type: "order_by";
            };
            readonly user_id: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_tag_pk_columns_input: {
            readonly id: {
                readonly __type: "uuid!";
            };
        };
        readonly list_restaurant_tag_set_input: {
            readonly id: {
                readonly __type: "uuid";
            };
            readonly list_id: {
                readonly __type: "uuid";
            };
            readonly list_restaurant_id: {
                readonly __type: "uuid";
            };
            readonly position: {
                readonly __type: "Int";
            };
            readonly restaurant_tag_id: {
                readonly __type: "uuid";
            };
            readonly user_id: {
                readonly __type: "uuid";
            };
        };
        readonly list_restaurant_tag_stddev_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly position: {
                readonly __type: "Float";
            };
        };
        readonly list_restaurant_tag_stddev_order_by: {
            readonly position: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_tag_stddev_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly position: {
                readonly __type: "Float";
            };
        };
        readonly list_restaurant_tag_stddev_pop_order_by: {
            readonly position: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_tag_stddev_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly position: {
                readonly __type: "Float";
            };
        };
        readonly list_restaurant_tag_stddev_samp_order_by: {
            readonly position: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_tag_sum_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly position: {
                readonly __type: "Int";
            };
        };
        readonly list_restaurant_tag_sum_order_by: {
            readonly position: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_tag_var_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly position: {
                readonly __type: "Float";
            };
        };
        readonly list_restaurant_tag_var_pop_order_by: {
            readonly position: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_tag_var_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly position: {
                readonly __type: "Float";
            };
        };
        readonly list_restaurant_tag_var_samp_order_by: {
            readonly position: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_tag_variance_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly position: {
                readonly __type: "Float";
            };
        };
        readonly list_restaurant_tag_variance_order_by: {
            readonly position: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_var_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly position: {
                readonly __type: "Float";
            };
        };
        readonly list_restaurant_var_pop_order_by: {
            readonly position: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_var_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly position: {
                readonly __type: "Float";
            };
        };
        readonly list_restaurant_var_samp_order_by: {
            readonly position: {
                readonly __type: "order_by";
            };
        };
        readonly list_restaurant_variance_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly position: {
                readonly __type: "Float";
            };
        };
        readonly list_restaurant_variance_order_by: {
            readonly position: {
                readonly __type: "order_by";
            };
        };
        readonly list_set_input: {
            readonly color: {
                readonly __type: "Int";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly description: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly location: {
                readonly __type: "geometry";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly public: {
                readonly __type: "Boolean";
            };
            readonly region: {
                readonly __type: "String";
            };
            readonly slug: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly user_id: {
                readonly __type: "uuid";
            };
        };
        readonly list_stddev_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly color: {
                readonly __type: "Float";
            };
        };
        readonly list_stddev_order_by: {
            readonly color: {
                readonly __type: "order_by";
            };
        };
        readonly list_stddev_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly color: {
                readonly __type: "Float";
            };
        };
        readonly list_stddev_pop_order_by: {
            readonly color: {
                readonly __type: "order_by";
            };
        };
        readonly list_stddev_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly color: {
                readonly __type: "Float";
            };
        };
        readonly list_stddev_samp_order_by: {
            readonly color: {
                readonly __type: "order_by";
            };
        };
        readonly list_sum_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly color: {
                readonly __type: "Int";
            };
        };
        readonly list_sum_order_by: {
            readonly color: {
                readonly __type: "order_by";
            };
        };
        readonly list_tag: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly created_at: {
                readonly __type: "timestamptz!";
            };
            readonly id: {
                readonly __type: "uuid!";
            };
            readonly list: {
                readonly __type: "list";
            };
            readonly list_id: {
                readonly __type: "uuid!";
            };
            readonly tag: {
                readonly __type: "tag";
            };
            readonly tag_id: {
                readonly __type: "uuid!";
            };
        };
        readonly list_tag_aggregate: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly aggregate: {
                readonly __type: "list_tag_aggregate_fields";
            };
            readonly nodes: {
                readonly __type: "[list_tag!]!";
            };
        };
        readonly list_tag_aggregate_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly count: {
                readonly __type: "Int";
                readonly __args: {
                    readonly columns: "[list_tag_select_column!]";
                    readonly distinct: "Boolean";
                };
            };
            readonly max: {
                readonly __type: "list_tag_max_fields";
            };
            readonly min: {
                readonly __type: "list_tag_min_fields";
            };
        };
        readonly list_tag_aggregate_order_by: {
            readonly count: {
                readonly __type: "order_by";
            };
            readonly max: {
                readonly __type: "list_tag_max_order_by";
            };
            readonly min: {
                readonly __type: "list_tag_min_order_by";
            };
        };
        readonly list_tag_arr_rel_insert_input: {
            readonly data: {
                readonly __type: "[list_tag_insert_input!]!";
            };
            readonly on_conflict: {
                readonly __type: "list_tag_on_conflict";
            };
        };
        readonly list_tag_bool_exp: {
            readonly _and: {
                readonly __type: "[list_tag_bool_exp]";
            };
            readonly _not: {
                readonly __type: "list_tag_bool_exp";
            };
            readonly _or: {
                readonly __type: "[list_tag_bool_exp]";
            };
            readonly created_at: {
                readonly __type: "timestamptz_comparison_exp";
            };
            readonly id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly list: {
                readonly __type: "list_bool_exp";
            };
            readonly list_id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly tag: {
                readonly __type: "tag_bool_exp";
            };
            readonly tag_id: {
                readonly __type: "uuid_comparison_exp";
            };
        };
        readonly list_tag_insert_input: {
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly list: {
                readonly __type: "list_obj_rel_insert_input";
            };
            readonly list_id: {
                readonly __type: "uuid";
            };
            readonly tag: {
                readonly __type: "tag_obj_rel_insert_input";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
        };
        readonly list_tag_max_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly list_id: {
                readonly __type: "uuid";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
        };
        readonly list_tag_max_order_by: {
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly list_id: {
                readonly __type: "order_by";
            };
            readonly tag_id: {
                readonly __type: "order_by";
            };
        };
        readonly list_tag_min_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly list_id: {
                readonly __type: "uuid";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
        };
        readonly list_tag_min_order_by: {
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly list_id: {
                readonly __type: "order_by";
            };
            readonly tag_id: {
                readonly __type: "order_by";
            };
        };
        readonly list_tag_mutation_response: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly affected_rows: {
                readonly __type: "Int!";
            };
            readonly returning: {
                readonly __type: "[list_tag!]!";
            };
        };
        readonly list_tag_obj_rel_insert_input: {
            readonly data: {
                readonly __type: "list_tag_insert_input!";
            };
            readonly on_conflict: {
                readonly __type: "list_tag_on_conflict";
            };
        };
        readonly list_tag_on_conflict: {
            readonly constraint: {
                readonly __type: "list_tag_constraint!";
            };
            readonly update_columns: {
                readonly __type: "[list_tag_update_column!]!";
            };
            readonly where: {
                readonly __type: "list_tag_bool_exp";
            };
        };
        readonly list_tag_order_by: {
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly list: {
                readonly __type: "list_order_by";
            };
            readonly list_id: {
                readonly __type: "order_by";
            };
            readonly tag: {
                readonly __type: "tag_order_by";
            };
            readonly tag_id: {
                readonly __type: "order_by";
            };
        };
        readonly list_tag_pk_columns_input: {
            readonly id: {
                readonly __type: "uuid!";
            };
        };
        readonly list_tag_set_input: {
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly list_id: {
                readonly __type: "uuid";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
        };
        readonly list_var_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly color: {
                readonly __type: "Float";
            };
        };
        readonly list_var_pop_order_by: {
            readonly color: {
                readonly __type: "order_by";
            };
        };
        readonly list_var_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly color: {
                readonly __type: "Float";
            };
        };
        readonly list_var_samp_order_by: {
            readonly color: {
                readonly __type: "order_by";
            };
        };
        readonly list_variance_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly color: {
                readonly __type: "Float";
            };
        };
        readonly list_variance_order_by: {
            readonly color: {
                readonly __type: "order_by";
            };
        };
        readonly menu_item: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly created_at: {
                readonly __type: "timestamptz!";
            };
            readonly description: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid!";
            };
            readonly image: {
                readonly __type: "String";
            };
            readonly location: {
                readonly __type: "geometry";
            };
            readonly name: {
                readonly __type: "String!";
            };
            readonly price: {
                readonly __type: "Int";
            };
            readonly restaurant: {
                readonly __type: "restaurant!";
            };
            readonly restaurant_id: {
                readonly __type: "uuid!";
            };
            readonly updated_at: {
                readonly __type: "timestamptz!";
            };
        };
        readonly menu_item_aggregate: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly aggregate: {
                readonly __type: "menu_item_aggregate_fields";
            };
            readonly nodes: {
                readonly __type: "[menu_item!]!";
            };
        };
        readonly menu_item_aggregate_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly avg: {
                readonly __type: "menu_item_avg_fields";
            };
            readonly count: {
                readonly __type: "Int";
                readonly __args: {
                    readonly columns: "[menu_item_select_column!]";
                    readonly distinct: "Boolean";
                };
            };
            readonly max: {
                readonly __type: "menu_item_max_fields";
            };
            readonly min: {
                readonly __type: "menu_item_min_fields";
            };
            readonly stddev: {
                readonly __type: "menu_item_stddev_fields";
            };
            readonly stddev_pop: {
                readonly __type: "menu_item_stddev_pop_fields";
            };
            readonly stddev_samp: {
                readonly __type: "menu_item_stddev_samp_fields";
            };
            readonly sum: {
                readonly __type: "menu_item_sum_fields";
            };
            readonly var_pop: {
                readonly __type: "menu_item_var_pop_fields";
            };
            readonly var_samp: {
                readonly __type: "menu_item_var_samp_fields";
            };
            readonly variance: {
                readonly __type: "menu_item_variance_fields";
            };
        };
        readonly menu_item_aggregate_order_by: {
            readonly avg: {
                readonly __type: "menu_item_avg_order_by";
            };
            readonly count: {
                readonly __type: "order_by";
            };
            readonly max: {
                readonly __type: "menu_item_max_order_by";
            };
            readonly min: {
                readonly __type: "menu_item_min_order_by";
            };
            readonly stddev: {
                readonly __type: "menu_item_stddev_order_by";
            };
            readonly stddev_pop: {
                readonly __type: "menu_item_stddev_pop_order_by";
            };
            readonly stddev_samp: {
                readonly __type: "menu_item_stddev_samp_order_by";
            };
            readonly sum: {
                readonly __type: "menu_item_sum_order_by";
            };
            readonly var_pop: {
                readonly __type: "menu_item_var_pop_order_by";
            };
            readonly var_samp: {
                readonly __type: "menu_item_var_samp_order_by";
            };
            readonly variance: {
                readonly __type: "menu_item_variance_order_by";
            };
        };
        readonly menu_item_arr_rel_insert_input: {
            readonly data: {
                readonly __type: "[menu_item_insert_input!]!";
            };
            readonly on_conflict: {
                readonly __type: "menu_item_on_conflict";
            };
        };
        readonly menu_item_avg_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly price: {
                readonly __type: "Float";
            };
        };
        readonly menu_item_avg_order_by: {
            readonly price: {
                readonly __type: "order_by";
            };
        };
        readonly menu_item_bool_exp: {
            readonly _and: {
                readonly __type: "[menu_item_bool_exp]";
            };
            readonly _not: {
                readonly __type: "menu_item_bool_exp";
            };
            readonly _or: {
                readonly __type: "[menu_item_bool_exp]";
            };
            readonly created_at: {
                readonly __type: "timestamptz_comparison_exp";
            };
            readonly description: {
                readonly __type: "String_comparison_exp";
            };
            readonly id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly image: {
                readonly __type: "String_comparison_exp";
            };
            readonly location: {
                readonly __type: "geometry_comparison_exp";
            };
            readonly name: {
                readonly __type: "String_comparison_exp";
            };
            readonly price: {
                readonly __type: "Int_comparison_exp";
            };
            readonly restaurant: {
                readonly __type: "restaurant_bool_exp";
            };
            readonly restaurant_id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly updated_at: {
                readonly __type: "timestamptz_comparison_exp";
            };
        };
        readonly menu_item_inc_input: {
            readonly price: {
                readonly __type: "Int";
            };
        };
        readonly menu_item_insert_input: {
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly description: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly image: {
                readonly __type: "String";
            };
            readonly location: {
                readonly __type: "geometry";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly price: {
                readonly __type: "Int";
            };
            readonly restaurant: {
                readonly __type: "restaurant_obj_rel_insert_input";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
        };
        readonly menu_item_max_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly description: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly image: {
                readonly __type: "String";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly price: {
                readonly __type: "Int";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
        };
        readonly menu_item_max_order_by: {
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly description: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly image: {
                readonly __type: "order_by";
            };
            readonly name: {
                readonly __type: "order_by";
            };
            readonly price: {
                readonly __type: "order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
        };
        readonly menu_item_min_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly description: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly image: {
                readonly __type: "String";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly price: {
                readonly __type: "Int";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
        };
        readonly menu_item_min_order_by: {
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly description: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly image: {
                readonly __type: "order_by";
            };
            readonly name: {
                readonly __type: "order_by";
            };
            readonly price: {
                readonly __type: "order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
        };
        readonly menu_item_mutation_response: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly affected_rows: {
                readonly __type: "Int!";
            };
            readonly returning: {
                readonly __type: "[menu_item!]!";
            };
        };
        readonly menu_item_obj_rel_insert_input: {
            readonly data: {
                readonly __type: "menu_item_insert_input!";
            };
            readonly on_conflict: {
                readonly __type: "menu_item_on_conflict";
            };
        };
        readonly menu_item_on_conflict: {
            readonly constraint: {
                readonly __type: "menu_item_constraint!";
            };
            readonly update_columns: {
                readonly __type: "[menu_item_update_column!]!";
            };
            readonly where: {
                readonly __type: "menu_item_bool_exp";
            };
        };
        readonly menu_item_order_by: {
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly description: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly image: {
                readonly __type: "order_by";
            };
            readonly location: {
                readonly __type: "order_by";
            };
            readonly name: {
                readonly __type: "order_by";
            };
            readonly price: {
                readonly __type: "order_by";
            };
            readonly restaurant: {
                readonly __type: "restaurant_order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
        };
        readonly menu_item_pk_columns_input: {
            readonly id: {
                readonly __type: "uuid!";
            };
        };
        readonly menu_item_set_input: {
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly description: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly image: {
                readonly __type: "String";
            };
            readonly location: {
                readonly __type: "geometry";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly price: {
                readonly __type: "Int";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
        };
        readonly menu_item_stddev_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly price: {
                readonly __type: "Float";
            };
        };
        readonly menu_item_stddev_order_by: {
            readonly price: {
                readonly __type: "order_by";
            };
        };
        readonly menu_item_stddev_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly price: {
                readonly __type: "Float";
            };
        };
        readonly menu_item_stddev_pop_order_by: {
            readonly price: {
                readonly __type: "order_by";
            };
        };
        readonly menu_item_stddev_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly price: {
                readonly __type: "Float";
            };
        };
        readonly menu_item_stddev_samp_order_by: {
            readonly price: {
                readonly __type: "order_by";
            };
        };
        readonly menu_item_sum_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly price: {
                readonly __type: "Int";
            };
        };
        readonly menu_item_sum_order_by: {
            readonly price: {
                readonly __type: "order_by";
            };
        };
        readonly menu_item_var_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly price: {
                readonly __type: "Float";
            };
        };
        readonly menu_item_var_pop_order_by: {
            readonly price: {
                readonly __type: "order_by";
            };
        };
        readonly menu_item_var_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly price: {
                readonly __type: "Float";
            };
        };
        readonly menu_item_var_samp_order_by: {
            readonly price: {
                readonly __type: "order_by";
            };
        };
        readonly menu_item_variance_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly price: {
                readonly __type: "Float";
            };
        };
        readonly menu_item_variance_order_by: {
            readonly price: {
                readonly __type: "order_by";
            };
        };
        readonly nhood_labels: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly center: {
                readonly __type: "geometry!";
            };
            readonly name: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Int!";
            };
        };
        readonly nhood_labels_aggregate: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly aggregate: {
                readonly __type: "nhood_labels_aggregate_fields";
            };
            readonly nodes: {
                readonly __type: "[nhood_labels!]!";
            };
        };
        readonly nhood_labels_aggregate_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly avg: {
                readonly __type: "nhood_labels_avg_fields";
            };
            readonly count: {
                readonly __type: "Int";
                readonly __args: {
                    readonly columns: "[nhood_labels_select_column!]";
                    readonly distinct: "Boolean";
                };
            };
            readonly max: {
                readonly __type: "nhood_labels_max_fields";
            };
            readonly min: {
                readonly __type: "nhood_labels_min_fields";
            };
            readonly stddev: {
                readonly __type: "nhood_labels_stddev_fields";
            };
            readonly stddev_pop: {
                readonly __type: "nhood_labels_stddev_pop_fields";
            };
            readonly stddev_samp: {
                readonly __type: "nhood_labels_stddev_samp_fields";
            };
            readonly sum: {
                readonly __type: "nhood_labels_sum_fields";
            };
            readonly var_pop: {
                readonly __type: "nhood_labels_var_pop_fields";
            };
            readonly var_samp: {
                readonly __type: "nhood_labels_var_samp_fields";
            };
            readonly variance: {
                readonly __type: "nhood_labels_variance_fields";
            };
        };
        readonly nhood_labels_aggregate_order_by: {
            readonly avg: {
                readonly __type: "nhood_labels_avg_order_by";
            };
            readonly count: {
                readonly __type: "order_by";
            };
            readonly max: {
                readonly __type: "nhood_labels_max_order_by";
            };
            readonly min: {
                readonly __type: "nhood_labels_min_order_by";
            };
            readonly stddev: {
                readonly __type: "nhood_labels_stddev_order_by";
            };
            readonly stddev_pop: {
                readonly __type: "nhood_labels_stddev_pop_order_by";
            };
            readonly stddev_samp: {
                readonly __type: "nhood_labels_stddev_samp_order_by";
            };
            readonly sum: {
                readonly __type: "nhood_labels_sum_order_by";
            };
            readonly var_pop: {
                readonly __type: "nhood_labels_var_pop_order_by";
            };
            readonly var_samp: {
                readonly __type: "nhood_labels_var_samp_order_by";
            };
            readonly variance: {
                readonly __type: "nhood_labels_variance_order_by";
            };
        };
        readonly nhood_labels_arr_rel_insert_input: {
            readonly data: {
                readonly __type: "[nhood_labels_insert_input!]!";
            };
            readonly on_conflict: {
                readonly __type: "nhood_labels_on_conflict";
            };
        };
        readonly nhood_labels_avg_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly nhood_labels_avg_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly nhood_labels_bool_exp: {
            readonly _and: {
                readonly __type: "[nhood_labels_bool_exp]";
            };
            readonly _not: {
                readonly __type: "nhood_labels_bool_exp";
            };
            readonly _or: {
                readonly __type: "[nhood_labels_bool_exp]";
            };
            readonly center: {
                readonly __type: "geometry_comparison_exp";
            };
            readonly name: {
                readonly __type: "String_comparison_exp";
            };
            readonly ogc_fid: {
                readonly __type: "Int_comparison_exp";
            };
        };
        readonly nhood_labels_inc_input: {
            readonly ogc_fid: {
                readonly __type: "Int";
            };
        };
        readonly nhood_labels_insert_input: {
            readonly center: {
                readonly __type: "geometry";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly ogc_fid: {
                readonly __type: "Int";
            };
        };
        readonly nhood_labels_max_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly ogc_fid: {
                readonly __type: "Int";
            };
        };
        readonly nhood_labels_max_order_by: {
            readonly name: {
                readonly __type: "order_by";
            };
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly nhood_labels_min_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly ogc_fid: {
                readonly __type: "Int";
            };
        };
        readonly nhood_labels_min_order_by: {
            readonly name: {
                readonly __type: "order_by";
            };
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly nhood_labels_mutation_response: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly affected_rows: {
                readonly __type: "Int!";
            };
            readonly returning: {
                readonly __type: "[nhood_labels!]!";
            };
        };
        readonly nhood_labels_obj_rel_insert_input: {
            readonly data: {
                readonly __type: "nhood_labels_insert_input!";
            };
            readonly on_conflict: {
                readonly __type: "nhood_labels_on_conflict";
            };
        };
        readonly nhood_labels_on_conflict: {
            readonly constraint: {
                readonly __type: "nhood_labels_constraint!";
            };
            readonly update_columns: {
                readonly __type: "[nhood_labels_update_column!]!";
            };
            readonly where: {
                readonly __type: "nhood_labels_bool_exp";
            };
        };
        readonly nhood_labels_order_by: {
            readonly center: {
                readonly __type: "order_by";
            };
            readonly name: {
                readonly __type: "order_by";
            };
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly nhood_labels_pk_columns_input: {
            readonly ogc_fid: {
                readonly __type: "Int!";
            };
        };
        readonly nhood_labels_set_input: {
            readonly center: {
                readonly __type: "geometry";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly ogc_fid: {
                readonly __type: "Int";
            };
        };
        readonly nhood_labels_stddev_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly nhood_labels_stddev_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly nhood_labels_stddev_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly nhood_labels_stddev_pop_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly nhood_labels_stddev_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly nhood_labels_stddev_samp_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly nhood_labels_sum_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Int";
            };
        };
        readonly nhood_labels_sum_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly nhood_labels_var_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly nhood_labels_var_pop_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly nhood_labels_var_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly nhood_labels_var_samp_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly nhood_labels_variance_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly nhood_labels_variance_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly numeric_comparison_exp: {
            readonly _eq: {
                readonly __type: "numeric";
            };
            readonly _gt: {
                readonly __type: "numeric";
            };
            readonly _gte: {
                readonly __type: "numeric";
            };
            readonly _in: {
                readonly __type: "[numeric!]";
            };
            readonly _is_null: {
                readonly __type: "Boolean";
            };
            readonly _lt: {
                readonly __type: "numeric";
            };
            readonly _lte: {
                readonly __type: "numeric";
            };
            readonly _neq: {
                readonly __type: "numeric";
            };
            readonly _nin: {
                readonly __type: "[numeric!]";
            };
        };
        readonly opening_hours: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly hours: {
                readonly __type: "tsrange!";
            };
            readonly id: {
                readonly __type: "uuid!";
            };
            readonly restaurant: {
                readonly __type: "restaurant!";
            };
            readonly restaurant_id: {
                readonly __type: "uuid!";
            };
        };
        readonly opening_hours_aggregate: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly aggregate: {
                readonly __type: "opening_hours_aggregate_fields";
            };
            readonly nodes: {
                readonly __type: "[opening_hours!]!";
            };
        };
        readonly opening_hours_aggregate_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly count: {
                readonly __type: "Int";
                readonly __args: {
                    readonly columns: "[opening_hours_select_column!]";
                    readonly distinct: "Boolean";
                };
            };
            readonly max: {
                readonly __type: "opening_hours_max_fields";
            };
            readonly min: {
                readonly __type: "opening_hours_min_fields";
            };
        };
        readonly opening_hours_aggregate_order_by: {
            readonly count: {
                readonly __type: "order_by";
            };
            readonly max: {
                readonly __type: "opening_hours_max_order_by";
            };
            readonly min: {
                readonly __type: "opening_hours_min_order_by";
            };
        };
        readonly opening_hours_arr_rel_insert_input: {
            readonly data: {
                readonly __type: "[opening_hours_insert_input!]!";
            };
            readonly on_conflict: {
                readonly __type: "opening_hours_on_conflict";
            };
        };
        readonly opening_hours_bool_exp: {
            readonly _and: {
                readonly __type: "[opening_hours_bool_exp]";
            };
            readonly _not: {
                readonly __type: "opening_hours_bool_exp";
            };
            readonly _or: {
                readonly __type: "[opening_hours_bool_exp]";
            };
            readonly hours: {
                readonly __type: "tsrange_comparison_exp";
            };
            readonly id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly restaurant: {
                readonly __type: "restaurant_bool_exp";
            };
            readonly restaurant_id: {
                readonly __type: "uuid_comparison_exp";
            };
        };
        readonly opening_hours_insert_input: {
            readonly hours: {
                readonly __type: "tsrange";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly restaurant: {
                readonly __type: "restaurant_obj_rel_insert_input";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
        };
        readonly opening_hours_max_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
        };
        readonly opening_hours_max_order_by: {
            readonly id: {
                readonly __type: "order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
        };
        readonly opening_hours_min_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
        };
        readonly opening_hours_min_order_by: {
            readonly id: {
                readonly __type: "order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
        };
        readonly opening_hours_mutation_response: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly affected_rows: {
                readonly __type: "Int!";
            };
            readonly returning: {
                readonly __type: "[opening_hours!]!";
            };
        };
        readonly opening_hours_obj_rel_insert_input: {
            readonly data: {
                readonly __type: "opening_hours_insert_input!";
            };
            readonly on_conflict: {
                readonly __type: "opening_hours_on_conflict";
            };
        };
        readonly opening_hours_on_conflict: {
            readonly constraint: {
                readonly __type: "opening_hours_constraint!";
            };
            readonly update_columns: {
                readonly __type: "[opening_hours_update_column!]!";
            };
            readonly where: {
                readonly __type: "opening_hours_bool_exp";
            };
        };
        readonly opening_hours_order_by: {
            readonly hours: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly restaurant: {
                readonly __type: "restaurant_order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
        };
        readonly opening_hours_pk_columns_input: {
            readonly id: {
                readonly __type: "uuid!";
            };
        };
        readonly opening_hours_set_input: {
            readonly hours: {
                readonly __type: "tsrange";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
        };
        readonly photo: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly created_at: {
                readonly __type: "timestamptz!";
            };
            readonly id: {
                readonly __type: "uuid!";
            };
            readonly origin: {
                readonly __type: "String";
            };
            readonly quality: {
                readonly __type: "numeric";
            };
            readonly updated_at: {
                readonly __type: "timestamptz!";
            };
            readonly url: {
                readonly __type: "String";
            };
        };
        readonly photo_aggregate: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly aggregate: {
                readonly __type: "photo_aggregate_fields";
            };
            readonly nodes: {
                readonly __type: "[photo!]!";
            };
        };
        readonly photo_aggregate_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly avg: {
                readonly __type: "photo_avg_fields";
            };
            readonly count: {
                readonly __type: "Int";
                readonly __args: {
                    readonly columns: "[photo_select_column!]";
                    readonly distinct: "Boolean";
                };
            };
            readonly max: {
                readonly __type: "photo_max_fields";
            };
            readonly min: {
                readonly __type: "photo_min_fields";
            };
            readonly stddev: {
                readonly __type: "photo_stddev_fields";
            };
            readonly stddev_pop: {
                readonly __type: "photo_stddev_pop_fields";
            };
            readonly stddev_samp: {
                readonly __type: "photo_stddev_samp_fields";
            };
            readonly sum: {
                readonly __type: "photo_sum_fields";
            };
            readonly var_pop: {
                readonly __type: "photo_var_pop_fields";
            };
            readonly var_samp: {
                readonly __type: "photo_var_samp_fields";
            };
            readonly variance: {
                readonly __type: "photo_variance_fields";
            };
        };
        readonly photo_aggregate_order_by: {
            readonly avg: {
                readonly __type: "photo_avg_order_by";
            };
            readonly count: {
                readonly __type: "order_by";
            };
            readonly max: {
                readonly __type: "photo_max_order_by";
            };
            readonly min: {
                readonly __type: "photo_min_order_by";
            };
            readonly stddev: {
                readonly __type: "photo_stddev_order_by";
            };
            readonly stddev_pop: {
                readonly __type: "photo_stddev_pop_order_by";
            };
            readonly stddev_samp: {
                readonly __type: "photo_stddev_samp_order_by";
            };
            readonly sum: {
                readonly __type: "photo_sum_order_by";
            };
            readonly var_pop: {
                readonly __type: "photo_var_pop_order_by";
            };
            readonly var_samp: {
                readonly __type: "photo_var_samp_order_by";
            };
            readonly variance: {
                readonly __type: "photo_variance_order_by";
            };
        };
        readonly photo_arr_rel_insert_input: {
            readonly data: {
                readonly __type: "[photo_insert_input!]!";
            };
            readonly on_conflict: {
                readonly __type: "photo_on_conflict";
            };
        };
        readonly photo_avg_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly quality: {
                readonly __type: "Float";
            };
        };
        readonly photo_avg_order_by: {
            readonly quality: {
                readonly __type: "order_by";
            };
        };
        readonly photo_bool_exp: {
            readonly _and: {
                readonly __type: "[photo_bool_exp]";
            };
            readonly _not: {
                readonly __type: "photo_bool_exp";
            };
            readonly _or: {
                readonly __type: "[photo_bool_exp]";
            };
            readonly created_at: {
                readonly __type: "timestamptz_comparison_exp";
            };
            readonly id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly origin: {
                readonly __type: "String_comparison_exp";
            };
            readonly quality: {
                readonly __type: "numeric_comparison_exp";
            };
            readonly updated_at: {
                readonly __type: "timestamptz_comparison_exp";
            };
            readonly url: {
                readonly __type: "String_comparison_exp";
            };
        };
        readonly photo_inc_input: {
            readonly quality: {
                readonly __type: "numeric";
            };
        };
        readonly photo_insert_input: {
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly origin: {
                readonly __type: "String";
            };
            readonly quality: {
                readonly __type: "numeric";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly url: {
                readonly __type: "String";
            };
        };
        readonly photo_max_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly origin: {
                readonly __type: "String";
            };
            readonly quality: {
                readonly __type: "numeric";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly url: {
                readonly __type: "String";
            };
        };
        readonly photo_max_order_by: {
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly origin: {
                readonly __type: "order_by";
            };
            readonly quality: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
            readonly url: {
                readonly __type: "order_by";
            };
        };
        readonly photo_min_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly origin: {
                readonly __type: "String";
            };
            readonly quality: {
                readonly __type: "numeric";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly url: {
                readonly __type: "String";
            };
        };
        readonly photo_min_order_by: {
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly origin: {
                readonly __type: "order_by";
            };
            readonly quality: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
            readonly url: {
                readonly __type: "order_by";
            };
        };
        readonly photo_mutation_response: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly affected_rows: {
                readonly __type: "Int!";
            };
            readonly returning: {
                readonly __type: "[photo!]!";
            };
        };
        readonly photo_obj_rel_insert_input: {
            readonly data: {
                readonly __type: "photo_insert_input!";
            };
            readonly on_conflict: {
                readonly __type: "photo_on_conflict";
            };
        };
        readonly photo_on_conflict: {
            readonly constraint: {
                readonly __type: "photo_constraint!";
            };
            readonly update_columns: {
                readonly __type: "[photo_update_column!]!";
            };
            readonly where: {
                readonly __type: "photo_bool_exp";
            };
        };
        readonly photo_order_by: {
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly origin: {
                readonly __type: "order_by";
            };
            readonly quality: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
            readonly url: {
                readonly __type: "order_by";
            };
        };
        readonly photo_pk_columns_input: {
            readonly id: {
                readonly __type: "uuid!";
            };
        };
        readonly photo_set_input: {
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly origin: {
                readonly __type: "String";
            };
            readonly quality: {
                readonly __type: "numeric";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly url: {
                readonly __type: "String";
            };
        };
        readonly photo_stddev_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly quality: {
                readonly __type: "Float";
            };
        };
        readonly photo_stddev_order_by: {
            readonly quality: {
                readonly __type: "order_by";
            };
        };
        readonly photo_stddev_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly quality: {
                readonly __type: "Float";
            };
        };
        readonly photo_stddev_pop_order_by: {
            readonly quality: {
                readonly __type: "order_by";
            };
        };
        readonly photo_stddev_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly quality: {
                readonly __type: "Float";
            };
        };
        readonly photo_stddev_samp_order_by: {
            readonly quality: {
                readonly __type: "order_by";
            };
        };
        readonly photo_sum_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly quality: {
                readonly __type: "numeric";
            };
        };
        readonly photo_sum_order_by: {
            readonly quality: {
                readonly __type: "order_by";
            };
        };
        readonly photo_var_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly quality: {
                readonly __type: "Float";
            };
        };
        readonly photo_var_pop_order_by: {
            readonly quality: {
                readonly __type: "order_by";
            };
        };
        readonly photo_var_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly quality: {
                readonly __type: "Float";
            };
        };
        readonly photo_var_samp_order_by: {
            readonly quality: {
                readonly __type: "order_by";
            };
        };
        readonly photo_variance_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly quality: {
                readonly __type: "Float";
            };
        };
        readonly photo_variance_order_by: {
            readonly quality: {
                readonly __type: "order_by";
            };
        };
        readonly photo_xref: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly id: {
                readonly __type: "uuid!";
            };
            readonly photo: {
                readonly __type: "photo!";
            };
            readonly photo_id: {
                readonly __type: "uuid!";
            };
            readonly restaurant_id: {
                readonly __type: "uuid!";
            };
            readonly tag_id: {
                readonly __type: "uuid!";
            };
            readonly type: {
                readonly __type: "String";
            };
        };
        readonly photo_xref_aggregate: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly aggregate: {
                readonly __type: "photo_xref_aggregate_fields";
            };
            readonly nodes: {
                readonly __type: "[photo_xref!]!";
            };
        };
        readonly photo_xref_aggregate_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly count: {
                readonly __type: "Int";
                readonly __args: {
                    readonly columns: "[photo_xref_select_column!]";
                    readonly distinct: "Boolean";
                };
            };
            readonly max: {
                readonly __type: "photo_xref_max_fields";
            };
            readonly min: {
                readonly __type: "photo_xref_min_fields";
            };
        };
        readonly photo_xref_aggregate_order_by: {
            readonly count: {
                readonly __type: "order_by";
            };
            readonly max: {
                readonly __type: "photo_xref_max_order_by";
            };
            readonly min: {
                readonly __type: "photo_xref_min_order_by";
            };
        };
        readonly photo_xref_arr_rel_insert_input: {
            readonly data: {
                readonly __type: "[photo_xref_insert_input!]!";
            };
            readonly on_conflict: {
                readonly __type: "photo_xref_on_conflict";
            };
        };
        readonly photo_xref_bool_exp: {
            readonly _and: {
                readonly __type: "[photo_xref_bool_exp]";
            };
            readonly _not: {
                readonly __type: "photo_xref_bool_exp";
            };
            readonly _or: {
                readonly __type: "[photo_xref_bool_exp]";
            };
            readonly id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly photo: {
                readonly __type: "photo_bool_exp";
            };
            readonly photo_id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly restaurant_id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly tag_id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly type: {
                readonly __type: "String_comparison_exp";
            };
        };
        readonly photo_xref_insert_input: {
            readonly id: {
                readonly __type: "uuid";
            };
            readonly photo: {
                readonly __type: "photo_obj_rel_insert_input";
            };
            readonly photo_id: {
                readonly __type: "uuid";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
            readonly type: {
                readonly __type: "String";
            };
        };
        readonly photo_xref_max_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly photo_id: {
                readonly __type: "uuid";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
            readonly type: {
                readonly __type: "String";
            };
        };
        readonly photo_xref_max_order_by: {
            readonly id: {
                readonly __type: "order_by";
            };
            readonly photo_id: {
                readonly __type: "order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
            readonly tag_id: {
                readonly __type: "order_by";
            };
            readonly type: {
                readonly __type: "order_by";
            };
        };
        readonly photo_xref_min_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly photo_id: {
                readonly __type: "uuid";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
            readonly type: {
                readonly __type: "String";
            };
        };
        readonly photo_xref_min_order_by: {
            readonly id: {
                readonly __type: "order_by";
            };
            readonly photo_id: {
                readonly __type: "order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
            readonly tag_id: {
                readonly __type: "order_by";
            };
            readonly type: {
                readonly __type: "order_by";
            };
        };
        readonly photo_xref_mutation_response: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly affected_rows: {
                readonly __type: "Int!";
            };
            readonly returning: {
                readonly __type: "[photo_xref!]!";
            };
        };
        readonly photo_xref_obj_rel_insert_input: {
            readonly data: {
                readonly __type: "photo_xref_insert_input!";
            };
            readonly on_conflict: {
                readonly __type: "photo_xref_on_conflict";
            };
        };
        readonly photo_xref_on_conflict: {
            readonly constraint: {
                readonly __type: "photo_xref_constraint!";
            };
            readonly update_columns: {
                readonly __type: "[photo_xref_update_column!]!";
            };
            readonly where: {
                readonly __type: "photo_xref_bool_exp";
            };
        };
        readonly photo_xref_order_by: {
            readonly id: {
                readonly __type: "order_by";
            };
            readonly photo: {
                readonly __type: "photo_order_by";
            };
            readonly photo_id: {
                readonly __type: "order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
            readonly tag_id: {
                readonly __type: "order_by";
            };
            readonly type: {
                readonly __type: "order_by";
            };
        };
        readonly photo_xref_pk_columns_input: {
            readonly id: {
                readonly __type: "uuid!";
            };
        };
        readonly photo_xref_set_input: {
            readonly id: {
                readonly __type: "uuid";
            };
            readonly photo_id: {
                readonly __type: "uuid";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
            readonly type: {
                readonly __type: "String";
            };
        };
        readonly restaurant: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly address: {
                readonly __type: "String";
            };
            readonly city: {
                readonly __type: "String";
            };
            readonly created_at: {
                readonly __type: "timestamptz!";
            };
            readonly description: {
                readonly __type: "String";
            };
            readonly downvotes: {
                readonly __type: "numeric";
            };
            readonly geocoder_id: {
                readonly __type: "String";
            };
            readonly headlines: {
                readonly __type: "jsonb";
                readonly __args: {
                    readonly path: "String";
                };
            };
            readonly hours: {
                readonly __type: "jsonb";
                readonly __args: {
                    readonly path: "String";
                };
            };
            readonly id: {
                readonly __type: "uuid!";
            };
            readonly image: {
                readonly __type: "String";
            };
            readonly is_open_now: {
                readonly __type: "Boolean";
            };
            readonly lists: {
                readonly __type: "[list_restaurant!]!";
                readonly __args: {
                    readonly distinct_on: "[list_restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_restaurant_order_by!]";
                    readonly where: "list_restaurant_bool_exp";
                };
            };
            readonly lists_aggregate: {
                readonly __type: "list_restaurant_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[list_restaurant_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_restaurant_order_by!]";
                    readonly where: "list_restaurant_bool_exp";
                };
            };
            readonly location: {
                readonly __type: "geometry!";
            };
            readonly menu_items: {
                readonly __type: "[menu_item!]!";
                readonly __args: {
                    readonly distinct_on: "[menu_item_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[menu_item_order_by!]";
                    readonly where: "menu_item_bool_exp";
                };
            };
            readonly menu_items_aggregate: {
                readonly __type: "menu_item_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[menu_item_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[menu_item_order_by!]";
                    readonly where: "menu_item_bool_exp";
                };
            };
            readonly name: {
                readonly __type: "String!";
            };
            readonly oldest_review_date: {
                readonly __type: "timestamptz";
            };
            readonly photo_table: {
                readonly __type: "[photo_xref!]!";
                readonly __args: {
                    readonly distinct_on: "[photo_xref_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[photo_xref_order_by!]";
                    readonly where: "photo_xref_bool_exp";
                };
            };
            readonly photo_table_aggregate: {
                readonly __type: "photo_xref_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[photo_xref_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[photo_xref_order_by!]";
                    readonly where: "photo_xref_bool_exp";
                };
            };
            readonly photos: {
                readonly __type: "jsonb";
                readonly __args: {
                    readonly path: "String";
                };
            };
            readonly price_range: {
                readonly __type: "String";
            };
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly rating_factors: {
                readonly __type: "jsonb";
                readonly __args: {
                    readonly path: "String";
                };
            };
            readonly reviews: {
                readonly __type: "[review!]!";
                readonly __args: {
                    readonly distinct_on: "[review_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[review_order_by!]";
                    readonly where: "review_bool_exp";
                };
            };
            readonly reviews_aggregate: {
                readonly __type: "review_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[review_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[review_order_by!]";
                    readonly where: "review_bool_exp";
                };
            };
            readonly score: {
                readonly __type: "numeric";
            };
            readonly score_breakdown: {
                readonly __type: "jsonb";
                readonly __args: {
                    readonly path: "String";
                };
            };
            readonly slug: {
                readonly __type: "String!";
            };
            readonly source_breakdown: {
                readonly __type: "jsonb";
                readonly __args: {
                    readonly path: "String";
                };
            };
            readonly sources: {
                readonly __type: "jsonb";
                readonly __args: {
                    readonly path: "String";
                };
            };
            readonly state: {
                readonly __type: "String";
            };
            readonly summary: {
                readonly __type: "String";
            };
            readonly tag_names: {
                readonly __type: "jsonb";
                readonly __args: {
                    readonly path: "String";
                };
            };
            readonly tags: {
                readonly __type: "[restaurant_tag!]!";
                readonly __args: {
                    readonly distinct_on: "[restaurant_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_tag_order_by!]";
                    readonly where: "restaurant_tag_bool_exp";
                };
            };
            readonly tags_aggregate: {
                readonly __type: "restaurant_tag_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[restaurant_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_tag_order_by!]";
                    readonly where: "restaurant_tag_bool_exp";
                };
            };
            readonly telephone: {
                readonly __type: "String";
            };
            readonly top_tags: {
                readonly __type: "[restaurant_tag!]";
                readonly __args: {
                    readonly args: "restaurant_top_tags_args!";
                    readonly distinct_on: "[restaurant_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_tag_order_by!]";
                    readonly where: "restaurant_tag_bool_exp";
                };
            };
            readonly updated_at: {
                readonly __type: "timestamptz!";
            };
            readonly upvotes: {
                readonly __type: "numeric";
            };
            readonly votes_ratio: {
                readonly __type: "numeric";
            };
            readonly website: {
                readonly __type: "String";
            };
            readonly zip: {
                readonly __type: "numeric";
            };
        };
        readonly restaurant_aggregate: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly aggregate: {
                readonly __type: "restaurant_aggregate_fields";
            };
            readonly nodes: {
                readonly __type: "[restaurant!]!";
            };
        };
        readonly restaurant_aggregate_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly avg: {
                readonly __type: "restaurant_avg_fields";
            };
            readonly count: {
                readonly __type: "Int";
                readonly __args: {
                    readonly columns: "[restaurant_select_column!]";
                    readonly distinct: "Boolean";
                };
            };
            readonly max: {
                readonly __type: "restaurant_max_fields";
            };
            readonly min: {
                readonly __type: "restaurant_min_fields";
            };
            readonly stddev: {
                readonly __type: "restaurant_stddev_fields";
            };
            readonly stddev_pop: {
                readonly __type: "restaurant_stddev_pop_fields";
            };
            readonly stddev_samp: {
                readonly __type: "restaurant_stddev_samp_fields";
            };
            readonly sum: {
                readonly __type: "restaurant_sum_fields";
            };
            readonly var_pop: {
                readonly __type: "restaurant_var_pop_fields";
            };
            readonly var_samp: {
                readonly __type: "restaurant_var_samp_fields";
            };
            readonly variance: {
                readonly __type: "restaurant_variance_fields";
            };
        };
        readonly restaurant_aggregate_order_by: {
            readonly avg: {
                readonly __type: "restaurant_avg_order_by";
            };
            readonly count: {
                readonly __type: "order_by";
            };
            readonly max: {
                readonly __type: "restaurant_max_order_by";
            };
            readonly min: {
                readonly __type: "restaurant_min_order_by";
            };
            readonly stddev: {
                readonly __type: "restaurant_stddev_order_by";
            };
            readonly stddev_pop: {
                readonly __type: "restaurant_stddev_pop_order_by";
            };
            readonly stddev_samp: {
                readonly __type: "restaurant_stddev_samp_order_by";
            };
            readonly sum: {
                readonly __type: "restaurant_sum_order_by";
            };
            readonly var_pop: {
                readonly __type: "restaurant_var_pop_order_by";
            };
            readonly var_samp: {
                readonly __type: "restaurant_var_samp_order_by";
            };
            readonly variance: {
                readonly __type: "restaurant_variance_order_by";
            };
        };
        readonly restaurant_append_input: {
            readonly headlines: {
                readonly __type: "jsonb";
            };
            readonly hours: {
                readonly __type: "jsonb";
            };
            readonly photos: {
                readonly __type: "jsonb";
            };
            readonly rating_factors: {
                readonly __type: "jsonb";
            };
            readonly score_breakdown: {
                readonly __type: "jsonb";
            };
            readonly source_breakdown: {
                readonly __type: "jsonb";
            };
            readonly sources: {
                readonly __type: "jsonb";
            };
            readonly tag_names: {
                readonly __type: "jsonb";
            };
        };
        readonly restaurant_arr_rel_insert_input: {
            readonly data: {
                readonly __type: "[restaurant_insert_input!]!";
            };
            readonly on_conflict: {
                readonly __type: "restaurant_on_conflict";
            };
        };
        readonly restaurant_avg_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly downvotes: {
                readonly __type: "Float";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly score: {
                readonly __type: "Float";
            };
            readonly upvotes: {
                readonly __type: "Float";
            };
            readonly votes_ratio: {
                readonly __type: "Float";
            };
            readonly zip: {
                readonly __type: "Float";
            };
        };
        readonly restaurant_avg_order_by: {
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
            readonly zip: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_bool_exp: {
            readonly _and: {
                readonly __type: "[restaurant_bool_exp]";
            };
            readonly _not: {
                readonly __type: "restaurant_bool_exp";
            };
            readonly _or: {
                readonly __type: "[restaurant_bool_exp]";
            };
            readonly address: {
                readonly __type: "String_comparison_exp";
            };
            readonly city: {
                readonly __type: "String_comparison_exp";
            };
            readonly created_at: {
                readonly __type: "timestamptz_comparison_exp";
            };
            readonly description: {
                readonly __type: "String_comparison_exp";
            };
            readonly downvotes: {
                readonly __type: "numeric_comparison_exp";
            };
            readonly geocoder_id: {
                readonly __type: "String_comparison_exp";
            };
            readonly headlines: {
                readonly __type: "jsonb_comparison_exp";
            };
            readonly hours: {
                readonly __type: "jsonb_comparison_exp";
            };
            readonly id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly image: {
                readonly __type: "String_comparison_exp";
            };
            readonly lists: {
                readonly __type: "list_restaurant_bool_exp";
            };
            readonly location: {
                readonly __type: "geometry_comparison_exp";
            };
            readonly menu_items: {
                readonly __type: "menu_item_bool_exp";
            };
            readonly name: {
                readonly __type: "String_comparison_exp";
            };
            readonly oldest_review_date: {
                readonly __type: "timestamptz_comparison_exp";
            };
            readonly photo_table: {
                readonly __type: "photo_xref_bool_exp";
            };
            readonly photos: {
                readonly __type: "jsonb_comparison_exp";
            };
            readonly price_range: {
                readonly __type: "String_comparison_exp";
            };
            readonly rating: {
                readonly __type: "numeric_comparison_exp";
            };
            readonly rating_factors: {
                readonly __type: "jsonb_comparison_exp";
            };
            readonly reviews: {
                readonly __type: "review_bool_exp";
            };
            readonly score: {
                readonly __type: "numeric_comparison_exp";
            };
            readonly score_breakdown: {
                readonly __type: "jsonb_comparison_exp";
            };
            readonly slug: {
                readonly __type: "String_comparison_exp";
            };
            readonly source_breakdown: {
                readonly __type: "jsonb_comparison_exp";
            };
            readonly sources: {
                readonly __type: "jsonb_comparison_exp";
            };
            readonly state: {
                readonly __type: "String_comparison_exp";
            };
            readonly summary: {
                readonly __type: "String_comparison_exp";
            };
            readonly tag_names: {
                readonly __type: "jsonb_comparison_exp";
            };
            readonly tags: {
                readonly __type: "restaurant_tag_bool_exp";
            };
            readonly telephone: {
                readonly __type: "String_comparison_exp";
            };
            readonly updated_at: {
                readonly __type: "timestamptz_comparison_exp";
            };
            readonly upvotes: {
                readonly __type: "numeric_comparison_exp";
            };
            readonly votes_ratio: {
                readonly __type: "numeric_comparison_exp";
            };
            readonly website: {
                readonly __type: "String_comparison_exp";
            };
            readonly zip: {
                readonly __type: "numeric_comparison_exp";
            };
        };
        readonly restaurant_delete_at_path_input: {
            readonly headlines: {
                readonly __type: "[String]";
            };
            readonly hours: {
                readonly __type: "[String]";
            };
            readonly photos: {
                readonly __type: "[String]";
            };
            readonly rating_factors: {
                readonly __type: "[String]";
            };
            readonly score_breakdown: {
                readonly __type: "[String]";
            };
            readonly source_breakdown: {
                readonly __type: "[String]";
            };
            readonly sources: {
                readonly __type: "[String]";
            };
            readonly tag_names: {
                readonly __type: "[String]";
            };
        };
        readonly restaurant_delete_elem_input: {
            readonly headlines: {
                readonly __type: "Int";
            };
            readonly hours: {
                readonly __type: "Int";
            };
            readonly photos: {
                readonly __type: "Int";
            };
            readonly rating_factors: {
                readonly __type: "Int";
            };
            readonly score_breakdown: {
                readonly __type: "Int";
            };
            readonly source_breakdown: {
                readonly __type: "Int";
            };
            readonly sources: {
                readonly __type: "Int";
            };
            readonly tag_names: {
                readonly __type: "Int";
            };
        };
        readonly restaurant_delete_key_input: {
            readonly headlines: {
                readonly __type: "String";
            };
            readonly hours: {
                readonly __type: "String";
            };
            readonly photos: {
                readonly __type: "String";
            };
            readonly rating_factors: {
                readonly __type: "String";
            };
            readonly score_breakdown: {
                readonly __type: "String";
            };
            readonly source_breakdown: {
                readonly __type: "String";
            };
            readonly sources: {
                readonly __type: "String";
            };
            readonly tag_names: {
                readonly __type: "String";
            };
        };
        readonly restaurant_inc_input: {
            readonly downvotes: {
                readonly __type: "numeric";
            };
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly score: {
                readonly __type: "numeric";
            };
            readonly upvotes: {
                readonly __type: "numeric";
            };
            readonly votes_ratio: {
                readonly __type: "numeric";
            };
            readonly zip: {
                readonly __type: "numeric";
            };
        };
        readonly restaurant_insert_input: {
            readonly address: {
                readonly __type: "String";
            };
            readonly city: {
                readonly __type: "String";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly description: {
                readonly __type: "String";
            };
            readonly downvotes: {
                readonly __type: "numeric";
            };
            readonly geocoder_id: {
                readonly __type: "String";
            };
            readonly headlines: {
                readonly __type: "jsonb";
            };
            readonly hours: {
                readonly __type: "jsonb";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly image: {
                readonly __type: "String";
            };
            readonly lists: {
                readonly __type: "list_restaurant_arr_rel_insert_input";
            };
            readonly location: {
                readonly __type: "geometry";
            };
            readonly menu_items: {
                readonly __type: "menu_item_arr_rel_insert_input";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly oldest_review_date: {
                readonly __type: "timestamptz";
            };
            readonly photo_table: {
                readonly __type: "photo_xref_arr_rel_insert_input";
            };
            readonly photos: {
                readonly __type: "jsonb";
            };
            readonly price_range: {
                readonly __type: "String";
            };
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly rating_factors: {
                readonly __type: "jsonb";
            };
            readonly reviews: {
                readonly __type: "review_arr_rel_insert_input";
            };
            readonly score: {
                readonly __type: "numeric";
            };
            readonly score_breakdown: {
                readonly __type: "jsonb";
            };
            readonly slug: {
                readonly __type: "String";
            };
            readonly source_breakdown: {
                readonly __type: "jsonb";
            };
            readonly sources: {
                readonly __type: "jsonb";
            };
            readonly state: {
                readonly __type: "String";
            };
            readonly summary: {
                readonly __type: "String";
            };
            readonly tag_names: {
                readonly __type: "jsonb";
            };
            readonly tags: {
                readonly __type: "restaurant_tag_arr_rel_insert_input";
            };
            readonly telephone: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly upvotes: {
                readonly __type: "numeric";
            };
            readonly votes_ratio: {
                readonly __type: "numeric";
            };
            readonly website: {
                readonly __type: "String";
            };
            readonly zip: {
                readonly __type: "numeric";
            };
        };
        readonly restaurant_max_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly address: {
                readonly __type: "String";
            };
            readonly city: {
                readonly __type: "String";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly description: {
                readonly __type: "String";
            };
            readonly downvotes: {
                readonly __type: "numeric";
            };
            readonly geocoder_id: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly image: {
                readonly __type: "String";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly oldest_review_date: {
                readonly __type: "timestamptz";
            };
            readonly price_range: {
                readonly __type: "String";
            };
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly score: {
                readonly __type: "numeric";
            };
            readonly slug: {
                readonly __type: "String";
            };
            readonly state: {
                readonly __type: "String";
            };
            readonly summary: {
                readonly __type: "String";
            };
            readonly telephone: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly upvotes: {
                readonly __type: "numeric";
            };
            readonly votes_ratio: {
                readonly __type: "numeric";
            };
            readonly website: {
                readonly __type: "String";
            };
            readonly zip: {
                readonly __type: "numeric";
            };
        };
        readonly restaurant_max_order_by: {
            readonly address: {
                readonly __type: "order_by";
            };
            readonly city: {
                readonly __type: "order_by";
            };
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly description: {
                readonly __type: "order_by";
            };
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly geocoder_id: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly image: {
                readonly __type: "order_by";
            };
            readonly name: {
                readonly __type: "order_by";
            };
            readonly oldest_review_date: {
                readonly __type: "order_by";
            };
            readonly price_range: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly slug: {
                readonly __type: "order_by";
            };
            readonly state: {
                readonly __type: "order_by";
            };
            readonly summary: {
                readonly __type: "order_by";
            };
            readonly telephone: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
            readonly website: {
                readonly __type: "order_by";
            };
            readonly zip: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_min_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly address: {
                readonly __type: "String";
            };
            readonly city: {
                readonly __type: "String";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly description: {
                readonly __type: "String";
            };
            readonly downvotes: {
                readonly __type: "numeric";
            };
            readonly geocoder_id: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly image: {
                readonly __type: "String";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly oldest_review_date: {
                readonly __type: "timestamptz";
            };
            readonly price_range: {
                readonly __type: "String";
            };
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly score: {
                readonly __type: "numeric";
            };
            readonly slug: {
                readonly __type: "String";
            };
            readonly state: {
                readonly __type: "String";
            };
            readonly summary: {
                readonly __type: "String";
            };
            readonly telephone: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly upvotes: {
                readonly __type: "numeric";
            };
            readonly votes_ratio: {
                readonly __type: "numeric";
            };
            readonly website: {
                readonly __type: "String";
            };
            readonly zip: {
                readonly __type: "numeric";
            };
        };
        readonly restaurant_min_order_by: {
            readonly address: {
                readonly __type: "order_by";
            };
            readonly city: {
                readonly __type: "order_by";
            };
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly description: {
                readonly __type: "order_by";
            };
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly geocoder_id: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly image: {
                readonly __type: "order_by";
            };
            readonly name: {
                readonly __type: "order_by";
            };
            readonly oldest_review_date: {
                readonly __type: "order_by";
            };
            readonly price_range: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly slug: {
                readonly __type: "order_by";
            };
            readonly state: {
                readonly __type: "order_by";
            };
            readonly summary: {
                readonly __type: "order_by";
            };
            readonly telephone: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
            readonly website: {
                readonly __type: "order_by";
            };
            readonly zip: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_mutation_response: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly affected_rows: {
                readonly __type: "Int!";
            };
            readonly returning: {
                readonly __type: "[restaurant!]!";
            };
        };
        readonly restaurant_new_args: {
            readonly region_slug: {
                readonly __type: "String";
            };
        };
        readonly restaurant_obj_rel_insert_input: {
            readonly data: {
                readonly __type: "restaurant_insert_input!";
            };
            readonly on_conflict: {
                readonly __type: "restaurant_on_conflict";
            };
        };
        readonly restaurant_on_conflict: {
            readonly constraint: {
                readonly __type: "restaurant_constraint!";
            };
            readonly update_columns: {
                readonly __type: "[restaurant_update_column!]!";
            };
            readonly where: {
                readonly __type: "restaurant_bool_exp";
            };
        };
        readonly restaurant_order_by: {
            readonly address: {
                readonly __type: "order_by";
            };
            readonly city: {
                readonly __type: "order_by";
            };
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly description: {
                readonly __type: "order_by";
            };
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly geocoder_id: {
                readonly __type: "order_by";
            };
            readonly headlines: {
                readonly __type: "order_by";
            };
            readonly hours: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly image: {
                readonly __type: "order_by";
            };
            readonly lists_aggregate: {
                readonly __type: "list_restaurant_aggregate_order_by";
            };
            readonly location: {
                readonly __type: "order_by";
            };
            readonly menu_items_aggregate: {
                readonly __type: "menu_item_aggregate_order_by";
            };
            readonly name: {
                readonly __type: "order_by";
            };
            readonly oldest_review_date: {
                readonly __type: "order_by";
            };
            readonly photo_table_aggregate: {
                readonly __type: "photo_xref_aggregate_order_by";
            };
            readonly photos: {
                readonly __type: "order_by";
            };
            readonly price_range: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly rating_factors: {
                readonly __type: "order_by";
            };
            readonly reviews_aggregate: {
                readonly __type: "review_aggregate_order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly score_breakdown: {
                readonly __type: "order_by";
            };
            readonly slug: {
                readonly __type: "order_by";
            };
            readonly source_breakdown: {
                readonly __type: "order_by";
            };
            readonly sources: {
                readonly __type: "order_by";
            };
            readonly state: {
                readonly __type: "order_by";
            };
            readonly summary: {
                readonly __type: "order_by";
            };
            readonly tag_names: {
                readonly __type: "order_by";
            };
            readonly tags_aggregate: {
                readonly __type: "restaurant_tag_aggregate_order_by";
            };
            readonly telephone: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
            readonly website: {
                readonly __type: "order_by";
            };
            readonly zip: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_pk_columns_input: {
            readonly id: {
                readonly __type: "uuid!";
            };
        };
        readonly restaurant_prepend_input: {
            readonly headlines: {
                readonly __type: "jsonb";
            };
            readonly hours: {
                readonly __type: "jsonb";
            };
            readonly photos: {
                readonly __type: "jsonb";
            };
            readonly rating_factors: {
                readonly __type: "jsonb";
            };
            readonly score_breakdown: {
                readonly __type: "jsonb";
            };
            readonly source_breakdown: {
                readonly __type: "jsonb";
            };
            readonly sources: {
                readonly __type: "jsonb";
            };
            readonly tag_names: {
                readonly __type: "jsonb";
            };
        };
        readonly restaurant_set_input: {
            readonly address: {
                readonly __type: "String";
            };
            readonly city: {
                readonly __type: "String";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly description: {
                readonly __type: "String";
            };
            readonly downvotes: {
                readonly __type: "numeric";
            };
            readonly geocoder_id: {
                readonly __type: "String";
            };
            readonly headlines: {
                readonly __type: "jsonb";
            };
            readonly hours: {
                readonly __type: "jsonb";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly image: {
                readonly __type: "String";
            };
            readonly location: {
                readonly __type: "geometry";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly oldest_review_date: {
                readonly __type: "timestamptz";
            };
            readonly photos: {
                readonly __type: "jsonb";
            };
            readonly price_range: {
                readonly __type: "String";
            };
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly rating_factors: {
                readonly __type: "jsonb";
            };
            readonly score: {
                readonly __type: "numeric";
            };
            readonly score_breakdown: {
                readonly __type: "jsonb";
            };
            readonly slug: {
                readonly __type: "String";
            };
            readonly source_breakdown: {
                readonly __type: "jsonb";
            };
            readonly sources: {
                readonly __type: "jsonb";
            };
            readonly state: {
                readonly __type: "String";
            };
            readonly summary: {
                readonly __type: "String";
            };
            readonly tag_names: {
                readonly __type: "jsonb";
            };
            readonly telephone: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly upvotes: {
                readonly __type: "numeric";
            };
            readonly votes_ratio: {
                readonly __type: "numeric";
            };
            readonly website: {
                readonly __type: "String";
            };
            readonly zip: {
                readonly __type: "numeric";
            };
        };
        readonly restaurant_stddev_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly downvotes: {
                readonly __type: "Float";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly score: {
                readonly __type: "Float";
            };
            readonly upvotes: {
                readonly __type: "Float";
            };
            readonly votes_ratio: {
                readonly __type: "Float";
            };
            readonly zip: {
                readonly __type: "Float";
            };
        };
        readonly restaurant_stddev_order_by: {
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
            readonly zip: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_stddev_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly downvotes: {
                readonly __type: "Float";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly score: {
                readonly __type: "Float";
            };
            readonly upvotes: {
                readonly __type: "Float";
            };
            readonly votes_ratio: {
                readonly __type: "Float";
            };
            readonly zip: {
                readonly __type: "Float";
            };
        };
        readonly restaurant_stddev_pop_order_by: {
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
            readonly zip: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_stddev_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly downvotes: {
                readonly __type: "Float";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly score: {
                readonly __type: "Float";
            };
            readonly upvotes: {
                readonly __type: "Float";
            };
            readonly votes_ratio: {
                readonly __type: "Float";
            };
            readonly zip: {
                readonly __type: "Float";
            };
        };
        readonly restaurant_stddev_samp_order_by: {
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
            readonly zip: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_sum_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly downvotes: {
                readonly __type: "numeric";
            };
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly score: {
                readonly __type: "numeric";
            };
            readonly upvotes: {
                readonly __type: "numeric";
            };
            readonly votes_ratio: {
                readonly __type: "numeric";
            };
            readonly zip: {
                readonly __type: "numeric";
            };
        };
        readonly restaurant_sum_order_by: {
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
            readonly zip: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_tag: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly downvotes: {
                readonly __type: "numeric";
            };
            readonly id: {
                readonly __type: "uuid!";
            };
            readonly photos: {
                readonly __type: "jsonb";
                readonly __args: {
                    readonly path: "String";
                };
            };
            readonly rank: {
                readonly __type: "Int";
            };
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly restaurant: {
                readonly __type: "restaurant!";
            };
            readonly restaurant_id: {
                readonly __type: "uuid!";
            };
            readonly review_mentions_count: {
                readonly __type: "numeric";
            };
            readonly reviews: {
                readonly __type: "[review!]!";
                readonly __args: {
                    readonly distinct_on: "[review_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[review_order_by!]";
                    readonly where: "review_bool_exp";
                };
            };
            readonly reviews_aggregate: {
                readonly __type: "review_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[review_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[review_order_by!]";
                    readonly where: "review_bool_exp";
                };
            };
            readonly score: {
                readonly __type: "numeric";
            };
            readonly score_breakdown: {
                readonly __type: "jsonb";
                readonly __args: {
                    readonly path: "String";
                };
            };
            readonly sentences: {
                readonly __type: "[review_tag_sentence!]!";
                readonly __args: {
                    readonly distinct_on: "[review_tag_sentence_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[review_tag_sentence_order_by!]";
                    readonly where: "review_tag_sentence_bool_exp";
                };
            };
            readonly sentences_aggregate: {
                readonly __type: "review_tag_sentence_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[review_tag_sentence_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[review_tag_sentence_order_by!]";
                    readonly where: "review_tag_sentence_bool_exp";
                };
            };
            readonly source_breakdown: {
                readonly __type: "jsonb";
                readonly __args: {
                    readonly path: "String";
                };
            };
            readonly tag: {
                readonly __type: "tag!";
            };
            readonly tag_id: {
                readonly __type: "uuid!";
            };
            readonly upvotes: {
                readonly __type: "numeric";
            };
            readonly votes_ratio: {
                readonly __type: "numeric";
            };
        };
        readonly restaurant_tag_aggregate: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly aggregate: {
                readonly __type: "restaurant_tag_aggregate_fields";
            };
            readonly nodes: {
                readonly __type: "[restaurant_tag!]!";
            };
        };
        readonly restaurant_tag_aggregate_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly avg: {
                readonly __type: "restaurant_tag_avg_fields";
            };
            readonly count: {
                readonly __type: "Int";
                readonly __args: {
                    readonly columns: "[restaurant_tag_select_column!]";
                    readonly distinct: "Boolean";
                };
            };
            readonly max: {
                readonly __type: "restaurant_tag_max_fields";
            };
            readonly min: {
                readonly __type: "restaurant_tag_min_fields";
            };
            readonly stddev: {
                readonly __type: "restaurant_tag_stddev_fields";
            };
            readonly stddev_pop: {
                readonly __type: "restaurant_tag_stddev_pop_fields";
            };
            readonly stddev_samp: {
                readonly __type: "restaurant_tag_stddev_samp_fields";
            };
            readonly sum: {
                readonly __type: "restaurant_tag_sum_fields";
            };
            readonly var_pop: {
                readonly __type: "restaurant_tag_var_pop_fields";
            };
            readonly var_samp: {
                readonly __type: "restaurant_tag_var_samp_fields";
            };
            readonly variance: {
                readonly __type: "restaurant_tag_variance_fields";
            };
        };
        readonly restaurant_tag_aggregate_order_by: {
            readonly avg: {
                readonly __type: "restaurant_tag_avg_order_by";
            };
            readonly count: {
                readonly __type: "order_by";
            };
            readonly max: {
                readonly __type: "restaurant_tag_max_order_by";
            };
            readonly min: {
                readonly __type: "restaurant_tag_min_order_by";
            };
            readonly stddev: {
                readonly __type: "restaurant_tag_stddev_order_by";
            };
            readonly stddev_pop: {
                readonly __type: "restaurant_tag_stddev_pop_order_by";
            };
            readonly stddev_samp: {
                readonly __type: "restaurant_tag_stddev_samp_order_by";
            };
            readonly sum: {
                readonly __type: "restaurant_tag_sum_order_by";
            };
            readonly var_pop: {
                readonly __type: "restaurant_tag_var_pop_order_by";
            };
            readonly var_samp: {
                readonly __type: "restaurant_tag_var_samp_order_by";
            };
            readonly variance: {
                readonly __type: "restaurant_tag_variance_order_by";
            };
        };
        readonly restaurant_tag_append_input: {
            readonly photos: {
                readonly __type: "jsonb";
            };
            readonly score_breakdown: {
                readonly __type: "jsonb";
            };
            readonly source_breakdown: {
                readonly __type: "jsonb";
            };
        };
        readonly restaurant_tag_arr_rel_insert_input: {
            readonly data: {
                readonly __type: "[restaurant_tag_insert_input!]!";
            };
            readonly on_conflict: {
                readonly __type: "restaurant_tag_on_conflict";
            };
        };
        readonly restaurant_tag_avg_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly downvotes: {
                readonly __type: "Float";
            };
            readonly rank: {
                readonly __type: "Float";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly review_mentions_count: {
                readonly __type: "Float";
            };
            readonly score: {
                readonly __type: "Float";
            };
            readonly upvotes: {
                readonly __type: "Float";
            };
            readonly votes_ratio: {
                readonly __type: "Float";
            };
        };
        readonly restaurant_tag_avg_order_by: {
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly rank: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly review_mentions_count: {
                readonly __type: "order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_tag_bool_exp: {
            readonly _and: {
                readonly __type: "[restaurant_tag_bool_exp]";
            };
            readonly _not: {
                readonly __type: "restaurant_tag_bool_exp";
            };
            readonly _or: {
                readonly __type: "[restaurant_tag_bool_exp]";
            };
            readonly downvotes: {
                readonly __type: "numeric_comparison_exp";
            };
            readonly id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly photos: {
                readonly __type: "jsonb_comparison_exp";
            };
            readonly rank: {
                readonly __type: "Int_comparison_exp";
            };
            readonly rating: {
                readonly __type: "numeric_comparison_exp";
            };
            readonly restaurant: {
                readonly __type: "restaurant_bool_exp";
            };
            readonly restaurant_id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly review_mentions_count: {
                readonly __type: "numeric_comparison_exp";
            };
            readonly reviews: {
                readonly __type: "review_bool_exp";
            };
            readonly score: {
                readonly __type: "numeric_comparison_exp";
            };
            readonly score_breakdown: {
                readonly __type: "jsonb_comparison_exp";
            };
            readonly sentences: {
                readonly __type: "review_tag_sentence_bool_exp";
            };
            readonly source_breakdown: {
                readonly __type: "jsonb_comparison_exp";
            };
            readonly tag: {
                readonly __type: "tag_bool_exp";
            };
            readonly tag_id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly upvotes: {
                readonly __type: "numeric_comparison_exp";
            };
            readonly votes_ratio: {
                readonly __type: "numeric_comparison_exp";
            };
        };
        readonly restaurant_tag_delete_at_path_input: {
            readonly photos: {
                readonly __type: "[String]";
            };
            readonly score_breakdown: {
                readonly __type: "[String]";
            };
            readonly source_breakdown: {
                readonly __type: "[String]";
            };
        };
        readonly restaurant_tag_delete_elem_input: {
            readonly photos: {
                readonly __type: "Int";
            };
            readonly score_breakdown: {
                readonly __type: "Int";
            };
            readonly source_breakdown: {
                readonly __type: "Int";
            };
        };
        readonly restaurant_tag_delete_key_input: {
            readonly photos: {
                readonly __type: "String";
            };
            readonly score_breakdown: {
                readonly __type: "String";
            };
            readonly source_breakdown: {
                readonly __type: "String";
            };
        };
        readonly restaurant_tag_inc_input: {
            readonly downvotes: {
                readonly __type: "numeric";
            };
            readonly rank: {
                readonly __type: "Int";
            };
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly review_mentions_count: {
                readonly __type: "numeric";
            };
            readonly score: {
                readonly __type: "numeric";
            };
            readonly upvotes: {
                readonly __type: "numeric";
            };
            readonly votes_ratio: {
                readonly __type: "numeric";
            };
        };
        readonly restaurant_tag_insert_input: {
            readonly downvotes: {
                readonly __type: "numeric";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly photos: {
                readonly __type: "jsonb";
            };
            readonly rank: {
                readonly __type: "Int";
            };
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly restaurant: {
                readonly __type: "restaurant_obj_rel_insert_input";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly review_mentions_count: {
                readonly __type: "numeric";
            };
            readonly reviews: {
                readonly __type: "review_arr_rel_insert_input";
            };
            readonly score: {
                readonly __type: "numeric";
            };
            readonly score_breakdown: {
                readonly __type: "jsonb";
            };
            readonly sentences: {
                readonly __type: "review_tag_sentence_arr_rel_insert_input";
            };
            readonly source_breakdown: {
                readonly __type: "jsonb";
            };
            readonly tag: {
                readonly __type: "tag_obj_rel_insert_input";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
            readonly upvotes: {
                readonly __type: "numeric";
            };
            readonly votes_ratio: {
                readonly __type: "numeric";
            };
        };
        readonly restaurant_tag_max_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly downvotes: {
                readonly __type: "numeric";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly rank: {
                readonly __type: "Int";
            };
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly review_mentions_count: {
                readonly __type: "numeric";
            };
            readonly score: {
                readonly __type: "numeric";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
            readonly upvotes: {
                readonly __type: "numeric";
            };
            readonly votes_ratio: {
                readonly __type: "numeric";
            };
        };
        readonly restaurant_tag_max_order_by: {
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly rank: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
            readonly review_mentions_count: {
                readonly __type: "order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly tag_id: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_tag_min_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly downvotes: {
                readonly __type: "numeric";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly rank: {
                readonly __type: "Int";
            };
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly review_mentions_count: {
                readonly __type: "numeric";
            };
            readonly score: {
                readonly __type: "numeric";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
            readonly upvotes: {
                readonly __type: "numeric";
            };
            readonly votes_ratio: {
                readonly __type: "numeric";
            };
        };
        readonly restaurant_tag_min_order_by: {
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly rank: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
            readonly review_mentions_count: {
                readonly __type: "order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly tag_id: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_tag_mutation_response: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly affected_rows: {
                readonly __type: "Int!";
            };
            readonly returning: {
                readonly __type: "[restaurant_tag!]!";
            };
        };
        readonly restaurant_tag_obj_rel_insert_input: {
            readonly data: {
                readonly __type: "restaurant_tag_insert_input!";
            };
            readonly on_conflict: {
                readonly __type: "restaurant_tag_on_conflict";
            };
        };
        readonly restaurant_tag_on_conflict: {
            readonly constraint: {
                readonly __type: "restaurant_tag_constraint!";
            };
            readonly update_columns: {
                readonly __type: "[restaurant_tag_update_column!]!";
            };
            readonly where: {
                readonly __type: "restaurant_tag_bool_exp";
            };
        };
        readonly restaurant_tag_order_by: {
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly photos: {
                readonly __type: "order_by";
            };
            readonly rank: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly restaurant: {
                readonly __type: "restaurant_order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
            readonly review_mentions_count: {
                readonly __type: "order_by";
            };
            readonly reviews_aggregate: {
                readonly __type: "review_aggregate_order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly score_breakdown: {
                readonly __type: "order_by";
            };
            readonly sentences_aggregate: {
                readonly __type: "review_tag_sentence_aggregate_order_by";
            };
            readonly source_breakdown: {
                readonly __type: "order_by";
            };
            readonly tag: {
                readonly __type: "tag_order_by";
            };
            readonly tag_id: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_tag_pk_columns_input: {
            readonly restaurant_id: {
                readonly __type: "uuid!";
            };
            readonly tag_id: {
                readonly __type: "uuid!";
            };
        };
        readonly restaurant_tag_prepend_input: {
            readonly photos: {
                readonly __type: "jsonb";
            };
            readonly score_breakdown: {
                readonly __type: "jsonb";
            };
            readonly source_breakdown: {
                readonly __type: "jsonb";
            };
        };
        readonly restaurant_tag_set_input: {
            readonly downvotes: {
                readonly __type: "numeric";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly photos: {
                readonly __type: "jsonb";
            };
            readonly rank: {
                readonly __type: "Int";
            };
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly review_mentions_count: {
                readonly __type: "numeric";
            };
            readonly score: {
                readonly __type: "numeric";
            };
            readonly score_breakdown: {
                readonly __type: "jsonb";
            };
            readonly source_breakdown: {
                readonly __type: "jsonb";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
            readonly upvotes: {
                readonly __type: "numeric";
            };
            readonly votes_ratio: {
                readonly __type: "numeric";
            };
        };
        readonly restaurant_tag_stddev_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly downvotes: {
                readonly __type: "Float";
            };
            readonly rank: {
                readonly __type: "Float";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly review_mentions_count: {
                readonly __type: "Float";
            };
            readonly score: {
                readonly __type: "Float";
            };
            readonly upvotes: {
                readonly __type: "Float";
            };
            readonly votes_ratio: {
                readonly __type: "Float";
            };
        };
        readonly restaurant_tag_stddev_order_by: {
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly rank: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly review_mentions_count: {
                readonly __type: "order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_tag_stddev_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly downvotes: {
                readonly __type: "Float";
            };
            readonly rank: {
                readonly __type: "Float";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly review_mentions_count: {
                readonly __type: "Float";
            };
            readonly score: {
                readonly __type: "Float";
            };
            readonly upvotes: {
                readonly __type: "Float";
            };
            readonly votes_ratio: {
                readonly __type: "Float";
            };
        };
        readonly restaurant_tag_stddev_pop_order_by: {
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly rank: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly review_mentions_count: {
                readonly __type: "order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_tag_stddev_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly downvotes: {
                readonly __type: "Float";
            };
            readonly rank: {
                readonly __type: "Float";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly review_mentions_count: {
                readonly __type: "Float";
            };
            readonly score: {
                readonly __type: "Float";
            };
            readonly upvotes: {
                readonly __type: "Float";
            };
            readonly votes_ratio: {
                readonly __type: "Float";
            };
        };
        readonly restaurant_tag_stddev_samp_order_by: {
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly rank: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly review_mentions_count: {
                readonly __type: "order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_tag_sum_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly downvotes: {
                readonly __type: "numeric";
            };
            readonly rank: {
                readonly __type: "Int";
            };
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly review_mentions_count: {
                readonly __type: "numeric";
            };
            readonly score: {
                readonly __type: "numeric";
            };
            readonly upvotes: {
                readonly __type: "numeric";
            };
            readonly votes_ratio: {
                readonly __type: "numeric";
            };
        };
        readonly restaurant_tag_sum_order_by: {
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly rank: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly review_mentions_count: {
                readonly __type: "order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_tag_var_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly downvotes: {
                readonly __type: "Float";
            };
            readonly rank: {
                readonly __type: "Float";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly review_mentions_count: {
                readonly __type: "Float";
            };
            readonly score: {
                readonly __type: "Float";
            };
            readonly upvotes: {
                readonly __type: "Float";
            };
            readonly votes_ratio: {
                readonly __type: "Float";
            };
        };
        readonly restaurant_tag_var_pop_order_by: {
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly rank: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly review_mentions_count: {
                readonly __type: "order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_tag_var_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly downvotes: {
                readonly __type: "Float";
            };
            readonly rank: {
                readonly __type: "Float";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly review_mentions_count: {
                readonly __type: "Float";
            };
            readonly score: {
                readonly __type: "Float";
            };
            readonly upvotes: {
                readonly __type: "Float";
            };
            readonly votes_ratio: {
                readonly __type: "Float";
            };
        };
        readonly restaurant_tag_var_samp_order_by: {
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly rank: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly review_mentions_count: {
                readonly __type: "order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_tag_variance_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly downvotes: {
                readonly __type: "Float";
            };
            readonly rank: {
                readonly __type: "Float";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly review_mentions_count: {
                readonly __type: "Float";
            };
            readonly score: {
                readonly __type: "Float";
            };
            readonly upvotes: {
                readonly __type: "Float";
            };
            readonly votes_ratio: {
                readonly __type: "Float";
            };
        };
        readonly restaurant_tag_variance_order_by: {
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly rank: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly review_mentions_count: {
                readonly __type: "order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_top_tags_args: {
            readonly _tag_types: {
                readonly __type: "String";
            };
            readonly tag_slugs: {
                readonly __type: "String";
            };
        };
        readonly restaurant_trending_args: {
            readonly region_slug: {
                readonly __type: "String";
            };
        };
        readonly restaurant_var_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly downvotes: {
                readonly __type: "Float";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly score: {
                readonly __type: "Float";
            };
            readonly upvotes: {
                readonly __type: "Float";
            };
            readonly votes_ratio: {
                readonly __type: "Float";
            };
            readonly zip: {
                readonly __type: "Float";
            };
        };
        readonly restaurant_var_pop_order_by: {
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
            readonly zip: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_var_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly downvotes: {
                readonly __type: "Float";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly score: {
                readonly __type: "Float";
            };
            readonly upvotes: {
                readonly __type: "Float";
            };
            readonly votes_ratio: {
                readonly __type: "Float";
            };
            readonly zip: {
                readonly __type: "Float";
            };
        };
        readonly restaurant_var_samp_order_by: {
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
            readonly zip: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_variance_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly downvotes: {
                readonly __type: "Float";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly score: {
                readonly __type: "Float";
            };
            readonly upvotes: {
                readonly __type: "Float";
            };
            readonly votes_ratio: {
                readonly __type: "Float";
            };
            readonly zip: {
                readonly __type: "Float";
            };
        };
        readonly restaurant_variance_order_by: {
            readonly downvotes: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly score: {
                readonly __type: "order_by";
            };
            readonly upvotes: {
                readonly __type: "order_by";
            };
            readonly votes_ratio: {
                readonly __type: "order_by";
            };
            readonly zip: {
                readonly __type: "order_by";
            };
        };
        readonly restaurant_with_tags_args: {
            readonly tag_slugs: {
                readonly __type: "String";
            };
        };
        readonly review: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly authored_at: {
                readonly __type: "timestamptz!";
            };
            readonly categories: {
                readonly __type: "jsonb";
                readonly __args: {
                    readonly path: "String";
                };
            };
            readonly favorited: {
                readonly __type: "Boolean";
            };
            readonly id: {
                readonly __type: "uuid!";
            };
            readonly list_id: {
                readonly __type: "uuid";
            };
            readonly location: {
                readonly __type: "geometry";
            };
            readonly native_data_unique_key: {
                readonly __type: "String";
            };
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly restaurant: {
                readonly __type: "restaurant!";
            };
            readonly restaurant_id: {
                readonly __type: "uuid!";
            };
            readonly sentiments: {
                readonly __type: "[review_tag_sentence!]!";
                readonly __args: {
                    readonly distinct_on: "[review_tag_sentence_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[review_tag_sentence_order_by!]";
                    readonly where: "review_tag_sentence_bool_exp";
                };
            };
            readonly sentiments_aggregate: {
                readonly __type: "review_tag_sentence_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[review_tag_sentence_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[review_tag_sentence_order_by!]";
                    readonly where: "review_tag_sentence_bool_exp";
                };
            };
            readonly source: {
                readonly __type: "String";
            };
            readonly tag: {
                readonly __type: "tag";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
            readonly text: {
                readonly __type: "String";
            };
            readonly type: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz!";
            };
            readonly user: {
                readonly __type: "user!";
            };
            readonly user_id: {
                readonly __type: "uuid!";
            };
            readonly username: {
                readonly __type: "String";
            };
            readonly vote: {
                readonly __type: "numeric";
            };
        };
        readonly review_aggregate: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly aggregate: {
                readonly __type: "review_aggregate_fields";
            };
            readonly nodes: {
                readonly __type: "[review!]!";
            };
        };
        readonly review_aggregate_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly avg: {
                readonly __type: "review_avg_fields";
            };
            readonly count: {
                readonly __type: "Int";
                readonly __args: {
                    readonly columns: "[review_select_column!]";
                    readonly distinct: "Boolean";
                };
            };
            readonly max: {
                readonly __type: "review_max_fields";
            };
            readonly min: {
                readonly __type: "review_min_fields";
            };
            readonly stddev: {
                readonly __type: "review_stddev_fields";
            };
            readonly stddev_pop: {
                readonly __type: "review_stddev_pop_fields";
            };
            readonly stddev_samp: {
                readonly __type: "review_stddev_samp_fields";
            };
            readonly sum: {
                readonly __type: "review_sum_fields";
            };
            readonly var_pop: {
                readonly __type: "review_var_pop_fields";
            };
            readonly var_samp: {
                readonly __type: "review_var_samp_fields";
            };
            readonly variance: {
                readonly __type: "review_variance_fields";
            };
        };
        readonly review_aggregate_order_by: {
            readonly avg: {
                readonly __type: "review_avg_order_by";
            };
            readonly count: {
                readonly __type: "order_by";
            };
            readonly max: {
                readonly __type: "review_max_order_by";
            };
            readonly min: {
                readonly __type: "review_min_order_by";
            };
            readonly stddev: {
                readonly __type: "review_stddev_order_by";
            };
            readonly stddev_pop: {
                readonly __type: "review_stddev_pop_order_by";
            };
            readonly stddev_samp: {
                readonly __type: "review_stddev_samp_order_by";
            };
            readonly sum: {
                readonly __type: "review_sum_order_by";
            };
            readonly var_pop: {
                readonly __type: "review_var_pop_order_by";
            };
            readonly var_samp: {
                readonly __type: "review_var_samp_order_by";
            };
            readonly variance: {
                readonly __type: "review_variance_order_by";
            };
        };
        readonly review_append_input: {
            readonly categories: {
                readonly __type: "jsonb";
            };
        };
        readonly review_arr_rel_insert_input: {
            readonly data: {
                readonly __type: "[review_insert_input!]!";
            };
            readonly on_conflict: {
                readonly __type: "review_on_conflict";
            };
        };
        readonly review_avg_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly vote: {
                readonly __type: "Float";
            };
        };
        readonly review_avg_order_by: {
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly vote: {
                readonly __type: "order_by";
            };
        };
        readonly review_bool_exp: {
            readonly _and: {
                readonly __type: "[review_bool_exp]";
            };
            readonly _not: {
                readonly __type: "review_bool_exp";
            };
            readonly _or: {
                readonly __type: "[review_bool_exp]";
            };
            readonly authored_at: {
                readonly __type: "timestamptz_comparison_exp";
            };
            readonly categories: {
                readonly __type: "jsonb_comparison_exp";
            };
            readonly favorited: {
                readonly __type: "Boolean_comparison_exp";
            };
            readonly id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly list_id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly location: {
                readonly __type: "geometry_comparison_exp";
            };
            readonly native_data_unique_key: {
                readonly __type: "String_comparison_exp";
            };
            readonly rating: {
                readonly __type: "numeric_comparison_exp";
            };
            readonly restaurant: {
                readonly __type: "restaurant_bool_exp";
            };
            readonly restaurant_id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly sentiments: {
                readonly __type: "review_tag_sentence_bool_exp";
            };
            readonly source: {
                readonly __type: "String_comparison_exp";
            };
            readonly tag: {
                readonly __type: "tag_bool_exp";
            };
            readonly tag_id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly text: {
                readonly __type: "String_comparison_exp";
            };
            readonly type: {
                readonly __type: "String_comparison_exp";
            };
            readonly updated_at: {
                readonly __type: "timestamptz_comparison_exp";
            };
            readonly user: {
                readonly __type: "user_bool_exp";
            };
            readonly user_id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly username: {
                readonly __type: "String_comparison_exp";
            };
            readonly vote: {
                readonly __type: "numeric_comparison_exp";
            };
        };
        readonly review_delete_at_path_input: {
            readonly categories: {
                readonly __type: "[String]";
            };
        };
        readonly review_delete_elem_input: {
            readonly categories: {
                readonly __type: "Int";
            };
        };
        readonly review_delete_key_input: {
            readonly categories: {
                readonly __type: "String";
            };
        };
        readonly review_inc_input: {
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly vote: {
                readonly __type: "numeric";
            };
        };
        readonly review_insert_input: {
            readonly authored_at: {
                readonly __type: "timestamptz";
            };
            readonly categories: {
                readonly __type: "jsonb";
            };
            readonly favorited: {
                readonly __type: "Boolean";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly list_id: {
                readonly __type: "uuid";
            };
            readonly location: {
                readonly __type: "geometry";
            };
            readonly native_data_unique_key: {
                readonly __type: "String";
            };
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly restaurant: {
                readonly __type: "restaurant_obj_rel_insert_input";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly sentiments: {
                readonly __type: "review_tag_sentence_arr_rel_insert_input";
            };
            readonly source: {
                readonly __type: "String";
            };
            readonly tag: {
                readonly __type: "tag_obj_rel_insert_input";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
            readonly text: {
                readonly __type: "String";
            };
            readonly type: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly user: {
                readonly __type: "user_obj_rel_insert_input";
            };
            readonly user_id: {
                readonly __type: "uuid";
            };
            readonly username: {
                readonly __type: "String";
            };
            readonly vote: {
                readonly __type: "numeric";
            };
        };
        readonly review_max_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly authored_at: {
                readonly __type: "timestamptz";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly list_id: {
                readonly __type: "uuid";
            };
            readonly native_data_unique_key: {
                readonly __type: "String";
            };
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly source: {
                readonly __type: "String";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
            readonly text: {
                readonly __type: "String";
            };
            readonly type: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly user_id: {
                readonly __type: "uuid";
            };
            readonly username: {
                readonly __type: "String";
            };
            readonly vote: {
                readonly __type: "numeric";
            };
        };
        readonly review_max_order_by: {
            readonly authored_at: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly list_id: {
                readonly __type: "order_by";
            };
            readonly native_data_unique_key: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
            readonly source: {
                readonly __type: "order_by";
            };
            readonly tag_id: {
                readonly __type: "order_by";
            };
            readonly text: {
                readonly __type: "order_by";
            };
            readonly type: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
            readonly user_id: {
                readonly __type: "order_by";
            };
            readonly username: {
                readonly __type: "order_by";
            };
            readonly vote: {
                readonly __type: "order_by";
            };
        };
        readonly review_min_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly authored_at: {
                readonly __type: "timestamptz";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly list_id: {
                readonly __type: "uuid";
            };
            readonly native_data_unique_key: {
                readonly __type: "String";
            };
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly source: {
                readonly __type: "String";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
            readonly text: {
                readonly __type: "String";
            };
            readonly type: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly user_id: {
                readonly __type: "uuid";
            };
            readonly username: {
                readonly __type: "String";
            };
            readonly vote: {
                readonly __type: "numeric";
            };
        };
        readonly review_min_order_by: {
            readonly authored_at: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly list_id: {
                readonly __type: "order_by";
            };
            readonly native_data_unique_key: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
            readonly source: {
                readonly __type: "order_by";
            };
            readonly tag_id: {
                readonly __type: "order_by";
            };
            readonly text: {
                readonly __type: "order_by";
            };
            readonly type: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
            readonly user_id: {
                readonly __type: "order_by";
            };
            readonly username: {
                readonly __type: "order_by";
            };
            readonly vote: {
                readonly __type: "order_by";
            };
        };
        readonly review_mutation_response: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly affected_rows: {
                readonly __type: "Int!";
            };
            readonly returning: {
                readonly __type: "[review!]!";
            };
        };
        readonly review_obj_rel_insert_input: {
            readonly data: {
                readonly __type: "review_insert_input!";
            };
            readonly on_conflict: {
                readonly __type: "review_on_conflict";
            };
        };
        readonly review_on_conflict: {
            readonly constraint: {
                readonly __type: "review_constraint!";
            };
            readonly update_columns: {
                readonly __type: "[review_update_column!]!";
            };
            readonly where: {
                readonly __type: "review_bool_exp";
            };
        };
        readonly review_order_by: {
            readonly authored_at: {
                readonly __type: "order_by";
            };
            readonly categories: {
                readonly __type: "order_by";
            };
            readonly favorited: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly list_id: {
                readonly __type: "order_by";
            };
            readonly location: {
                readonly __type: "order_by";
            };
            readonly native_data_unique_key: {
                readonly __type: "order_by";
            };
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly restaurant: {
                readonly __type: "restaurant_order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
            readonly sentiments_aggregate: {
                readonly __type: "review_tag_sentence_aggregate_order_by";
            };
            readonly source: {
                readonly __type: "order_by";
            };
            readonly tag: {
                readonly __type: "tag_order_by";
            };
            readonly tag_id: {
                readonly __type: "order_by";
            };
            readonly text: {
                readonly __type: "order_by";
            };
            readonly type: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
            readonly user: {
                readonly __type: "user_order_by";
            };
            readonly user_id: {
                readonly __type: "order_by";
            };
            readonly username: {
                readonly __type: "order_by";
            };
            readonly vote: {
                readonly __type: "order_by";
            };
        };
        readonly review_pk_columns_input: {
            readonly id: {
                readonly __type: "uuid!";
            };
        };
        readonly review_prepend_input: {
            readonly categories: {
                readonly __type: "jsonb";
            };
        };
        readonly review_set_input: {
            readonly authored_at: {
                readonly __type: "timestamptz";
            };
            readonly categories: {
                readonly __type: "jsonb";
            };
            readonly favorited: {
                readonly __type: "Boolean";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly list_id: {
                readonly __type: "uuid";
            };
            readonly location: {
                readonly __type: "geometry";
            };
            readonly native_data_unique_key: {
                readonly __type: "String";
            };
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly source: {
                readonly __type: "String";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
            readonly text: {
                readonly __type: "String";
            };
            readonly type: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly user_id: {
                readonly __type: "uuid";
            };
            readonly username: {
                readonly __type: "String";
            };
            readonly vote: {
                readonly __type: "numeric";
            };
        };
        readonly review_stddev_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly vote: {
                readonly __type: "Float";
            };
        };
        readonly review_stddev_order_by: {
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly vote: {
                readonly __type: "order_by";
            };
        };
        readonly review_stddev_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly vote: {
                readonly __type: "Float";
            };
        };
        readonly review_stddev_pop_order_by: {
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly vote: {
                readonly __type: "order_by";
            };
        };
        readonly review_stddev_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly vote: {
                readonly __type: "Float";
            };
        };
        readonly review_stddev_samp_order_by: {
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly vote: {
                readonly __type: "order_by";
            };
        };
        readonly review_sum_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly rating: {
                readonly __type: "numeric";
            };
            readonly vote: {
                readonly __type: "numeric";
            };
        };
        readonly review_sum_order_by: {
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly vote: {
                readonly __type: "order_by";
            };
        };
        readonly review_tag_sentence: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly id: {
                readonly __type: "uuid!";
            };
            readonly ml_sentiment: {
                readonly __type: "numeric";
            };
            readonly naive_sentiment: {
                readonly __type: "numeric!";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly review: {
                readonly __type: "review!";
            };
            readonly review_id: {
                readonly __type: "uuid!";
            };
            readonly sentence: {
                readonly __type: "String!";
            };
            readonly tag: {
                readonly __type: "tag!";
            };
            readonly tag_id: {
                readonly __type: "uuid!";
            };
        };
        readonly review_tag_sentence_aggregate: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly aggregate: {
                readonly __type: "review_tag_sentence_aggregate_fields";
            };
            readonly nodes: {
                readonly __type: "[review_tag_sentence!]!";
            };
        };
        readonly review_tag_sentence_aggregate_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly avg: {
                readonly __type: "review_tag_sentence_avg_fields";
            };
            readonly count: {
                readonly __type: "Int";
                readonly __args: {
                    readonly columns: "[review_tag_sentence_select_column!]";
                    readonly distinct: "Boolean";
                };
            };
            readonly max: {
                readonly __type: "review_tag_sentence_max_fields";
            };
            readonly min: {
                readonly __type: "review_tag_sentence_min_fields";
            };
            readonly stddev: {
                readonly __type: "review_tag_sentence_stddev_fields";
            };
            readonly stddev_pop: {
                readonly __type: "review_tag_sentence_stddev_pop_fields";
            };
            readonly stddev_samp: {
                readonly __type: "review_tag_sentence_stddev_samp_fields";
            };
            readonly sum: {
                readonly __type: "review_tag_sentence_sum_fields";
            };
            readonly var_pop: {
                readonly __type: "review_tag_sentence_var_pop_fields";
            };
            readonly var_samp: {
                readonly __type: "review_tag_sentence_var_samp_fields";
            };
            readonly variance: {
                readonly __type: "review_tag_sentence_variance_fields";
            };
        };
        readonly review_tag_sentence_aggregate_order_by: {
            readonly avg: {
                readonly __type: "review_tag_sentence_avg_order_by";
            };
            readonly count: {
                readonly __type: "order_by";
            };
            readonly max: {
                readonly __type: "review_tag_sentence_max_order_by";
            };
            readonly min: {
                readonly __type: "review_tag_sentence_min_order_by";
            };
            readonly stddev: {
                readonly __type: "review_tag_sentence_stddev_order_by";
            };
            readonly stddev_pop: {
                readonly __type: "review_tag_sentence_stddev_pop_order_by";
            };
            readonly stddev_samp: {
                readonly __type: "review_tag_sentence_stddev_samp_order_by";
            };
            readonly sum: {
                readonly __type: "review_tag_sentence_sum_order_by";
            };
            readonly var_pop: {
                readonly __type: "review_tag_sentence_var_pop_order_by";
            };
            readonly var_samp: {
                readonly __type: "review_tag_sentence_var_samp_order_by";
            };
            readonly variance: {
                readonly __type: "review_tag_sentence_variance_order_by";
            };
        };
        readonly review_tag_sentence_arr_rel_insert_input: {
            readonly data: {
                readonly __type: "[review_tag_sentence_insert_input!]!";
            };
            readonly on_conflict: {
                readonly __type: "review_tag_sentence_on_conflict";
            };
        };
        readonly review_tag_sentence_avg_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ml_sentiment: {
                readonly __type: "Float";
            };
            readonly naive_sentiment: {
                readonly __type: "Float";
            };
        };
        readonly review_tag_sentence_avg_order_by: {
            readonly ml_sentiment: {
                readonly __type: "order_by";
            };
            readonly naive_sentiment: {
                readonly __type: "order_by";
            };
        };
        readonly review_tag_sentence_bool_exp: {
            readonly _and: {
                readonly __type: "[review_tag_sentence_bool_exp]";
            };
            readonly _not: {
                readonly __type: "review_tag_sentence_bool_exp";
            };
            readonly _or: {
                readonly __type: "[review_tag_sentence_bool_exp]";
            };
            readonly id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly ml_sentiment: {
                readonly __type: "numeric_comparison_exp";
            };
            readonly naive_sentiment: {
                readonly __type: "numeric_comparison_exp";
            };
            readonly restaurant_id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly review: {
                readonly __type: "review_bool_exp";
            };
            readonly review_id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly sentence: {
                readonly __type: "String_comparison_exp";
            };
            readonly tag: {
                readonly __type: "tag_bool_exp";
            };
            readonly tag_id: {
                readonly __type: "uuid_comparison_exp";
            };
        };
        readonly review_tag_sentence_inc_input: {
            readonly ml_sentiment: {
                readonly __type: "numeric";
            };
            readonly naive_sentiment: {
                readonly __type: "numeric";
            };
        };
        readonly review_tag_sentence_insert_input: {
            readonly id: {
                readonly __type: "uuid";
            };
            readonly ml_sentiment: {
                readonly __type: "numeric";
            };
            readonly naive_sentiment: {
                readonly __type: "numeric";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly review: {
                readonly __type: "review_obj_rel_insert_input";
            };
            readonly review_id: {
                readonly __type: "uuid";
            };
            readonly sentence: {
                readonly __type: "String";
            };
            readonly tag: {
                readonly __type: "tag_obj_rel_insert_input";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
        };
        readonly review_tag_sentence_max_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly ml_sentiment: {
                readonly __type: "numeric";
            };
            readonly naive_sentiment: {
                readonly __type: "numeric";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly review_id: {
                readonly __type: "uuid";
            };
            readonly sentence: {
                readonly __type: "String";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
        };
        readonly review_tag_sentence_max_order_by: {
            readonly id: {
                readonly __type: "order_by";
            };
            readonly ml_sentiment: {
                readonly __type: "order_by";
            };
            readonly naive_sentiment: {
                readonly __type: "order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
            readonly review_id: {
                readonly __type: "order_by";
            };
            readonly sentence: {
                readonly __type: "order_by";
            };
            readonly tag_id: {
                readonly __type: "order_by";
            };
        };
        readonly review_tag_sentence_min_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly ml_sentiment: {
                readonly __type: "numeric";
            };
            readonly naive_sentiment: {
                readonly __type: "numeric";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly review_id: {
                readonly __type: "uuid";
            };
            readonly sentence: {
                readonly __type: "String";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
        };
        readonly review_tag_sentence_min_order_by: {
            readonly id: {
                readonly __type: "order_by";
            };
            readonly ml_sentiment: {
                readonly __type: "order_by";
            };
            readonly naive_sentiment: {
                readonly __type: "order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
            readonly review_id: {
                readonly __type: "order_by";
            };
            readonly sentence: {
                readonly __type: "order_by";
            };
            readonly tag_id: {
                readonly __type: "order_by";
            };
        };
        readonly review_tag_sentence_mutation_response: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly affected_rows: {
                readonly __type: "Int!";
            };
            readonly returning: {
                readonly __type: "[review_tag_sentence!]!";
            };
        };
        readonly review_tag_sentence_obj_rel_insert_input: {
            readonly data: {
                readonly __type: "review_tag_sentence_insert_input!";
            };
            readonly on_conflict: {
                readonly __type: "review_tag_sentence_on_conflict";
            };
        };
        readonly review_tag_sentence_on_conflict: {
            readonly constraint: {
                readonly __type: "review_tag_sentence_constraint!";
            };
            readonly update_columns: {
                readonly __type: "[review_tag_sentence_update_column!]!";
            };
            readonly where: {
                readonly __type: "review_tag_sentence_bool_exp";
            };
        };
        readonly review_tag_sentence_order_by: {
            readonly id: {
                readonly __type: "order_by";
            };
            readonly ml_sentiment: {
                readonly __type: "order_by";
            };
            readonly naive_sentiment: {
                readonly __type: "order_by";
            };
            readonly restaurant_id: {
                readonly __type: "order_by";
            };
            readonly review: {
                readonly __type: "review_order_by";
            };
            readonly review_id: {
                readonly __type: "order_by";
            };
            readonly sentence: {
                readonly __type: "order_by";
            };
            readonly tag: {
                readonly __type: "tag_order_by";
            };
            readonly tag_id: {
                readonly __type: "order_by";
            };
        };
        readonly review_tag_sentence_pk_columns_input: {
            readonly id: {
                readonly __type: "uuid!";
            };
        };
        readonly review_tag_sentence_set_input: {
            readonly id: {
                readonly __type: "uuid";
            };
            readonly ml_sentiment: {
                readonly __type: "numeric";
            };
            readonly naive_sentiment: {
                readonly __type: "numeric";
            };
            readonly restaurant_id: {
                readonly __type: "uuid";
            };
            readonly review_id: {
                readonly __type: "uuid";
            };
            readonly sentence: {
                readonly __type: "String";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
        };
        readonly review_tag_sentence_stddev_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ml_sentiment: {
                readonly __type: "Float";
            };
            readonly naive_sentiment: {
                readonly __type: "Float";
            };
        };
        readonly review_tag_sentence_stddev_order_by: {
            readonly ml_sentiment: {
                readonly __type: "order_by";
            };
            readonly naive_sentiment: {
                readonly __type: "order_by";
            };
        };
        readonly review_tag_sentence_stddev_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ml_sentiment: {
                readonly __type: "Float";
            };
            readonly naive_sentiment: {
                readonly __type: "Float";
            };
        };
        readonly review_tag_sentence_stddev_pop_order_by: {
            readonly ml_sentiment: {
                readonly __type: "order_by";
            };
            readonly naive_sentiment: {
                readonly __type: "order_by";
            };
        };
        readonly review_tag_sentence_stddev_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ml_sentiment: {
                readonly __type: "Float";
            };
            readonly naive_sentiment: {
                readonly __type: "Float";
            };
        };
        readonly review_tag_sentence_stddev_samp_order_by: {
            readonly ml_sentiment: {
                readonly __type: "order_by";
            };
            readonly naive_sentiment: {
                readonly __type: "order_by";
            };
        };
        readonly review_tag_sentence_sum_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ml_sentiment: {
                readonly __type: "numeric";
            };
            readonly naive_sentiment: {
                readonly __type: "numeric";
            };
        };
        readonly review_tag_sentence_sum_order_by: {
            readonly ml_sentiment: {
                readonly __type: "order_by";
            };
            readonly naive_sentiment: {
                readonly __type: "order_by";
            };
        };
        readonly review_tag_sentence_var_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ml_sentiment: {
                readonly __type: "Float";
            };
            readonly naive_sentiment: {
                readonly __type: "Float";
            };
        };
        readonly review_tag_sentence_var_pop_order_by: {
            readonly ml_sentiment: {
                readonly __type: "order_by";
            };
            readonly naive_sentiment: {
                readonly __type: "order_by";
            };
        };
        readonly review_tag_sentence_var_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ml_sentiment: {
                readonly __type: "Float";
            };
            readonly naive_sentiment: {
                readonly __type: "Float";
            };
        };
        readonly review_tag_sentence_var_samp_order_by: {
            readonly ml_sentiment: {
                readonly __type: "order_by";
            };
            readonly naive_sentiment: {
                readonly __type: "order_by";
            };
        };
        readonly review_tag_sentence_variance_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ml_sentiment: {
                readonly __type: "Float";
            };
            readonly naive_sentiment: {
                readonly __type: "Float";
            };
        };
        readonly review_tag_sentence_variance_order_by: {
            readonly ml_sentiment: {
                readonly __type: "order_by";
            };
            readonly naive_sentiment: {
                readonly __type: "order_by";
            };
        };
        readonly review_var_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly vote: {
                readonly __type: "Float";
            };
        };
        readonly review_var_pop_order_by: {
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly vote: {
                readonly __type: "order_by";
            };
        };
        readonly review_var_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly vote: {
                readonly __type: "Float";
            };
        };
        readonly review_var_samp_order_by: {
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly vote: {
                readonly __type: "order_by";
            };
        };
        readonly review_variance_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly rating: {
                readonly __type: "Float";
            };
            readonly vote: {
                readonly __type: "Float";
            };
        };
        readonly review_variance_order_by: {
            readonly rating: {
                readonly __type: "order_by";
            };
            readonly vote: {
                readonly __type: "order_by";
            };
        };
        readonly setting: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly id: {
                readonly __type: "uuid!";
            };
            readonly key: {
                readonly __type: "String!";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly value: {
                readonly __type: "jsonb!";
                readonly __args: {
                    readonly path: "String";
                };
            };
        };
        readonly setting_aggregate: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly aggregate: {
                readonly __type: "setting_aggregate_fields";
            };
            readonly nodes: {
                readonly __type: "[setting!]!";
            };
        };
        readonly setting_aggregate_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly count: {
                readonly __type: "Int";
                readonly __args: {
                    readonly columns: "[setting_select_column!]";
                    readonly distinct: "Boolean";
                };
            };
            readonly max: {
                readonly __type: "setting_max_fields";
            };
            readonly min: {
                readonly __type: "setting_min_fields";
            };
        };
        readonly setting_aggregate_order_by: {
            readonly count: {
                readonly __type: "order_by";
            };
            readonly max: {
                readonly __type: "setting_max_order_by";
            };
            readonly min: {
                readonly __type: "setting_min_order_by";
            };
        };
        readonly setting_append_input: {
            readonly value: {
                readonly __type: "jsonb";
            };
        };
        readonly setting_arr_rel_insert_input: {
            readonly data: {
                readonly __type: "[setting_insert_input!]!";
            };
            readonly on_conflict: {
                readonly __type: "setting_on_conflict";
            };
        };
        readonly setting_bool_exp: {
            readonly _and: {
                readonly __type: "[setting_bool_exp]";
            };
            readonly _not: {
                readonly __type: "setting_bool_exp";
            };
            readonly _or: {
                readonly __type: "[setting_bool_exp]";
            };
            readonly created_at: {
                readonly __type: "timestamptz_comparison_exp";
            };
            readonly id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly key: {
                readonly __type: "String_comparison_exp";
            };
            readonly updated_at: {
                readonly __type: "timestamptz_comparison_exp";
            };
            readonly value: {
                readonly __type: "jsonb_comparison_exp";
            };
        };
        readonly setting_delete_at_path_input: {
            readonly value: {
                readonly __type: "[String]";
            };
        };
        readonly setting_delete_elem_input: {
            readonly value: {
                readonly __type: "Int";
            };
        };
        readonly setting_delete_key_input: {
            readonly value: {
                readonly __type: "String";
            };
        };
        readonly setting_insert_input: {
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly key: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly value: {
                readonly __type: "jsonb";
            };
        };
        readonly setting_max_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly key: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
        };
        readonly setting_max_order_by: {
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly key: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
        };
        readonly setting_min_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly key: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
        };
        readonly setting_min_order_by: {
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly key: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
        };
        readonly setting_mutation_response: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly affected_rows: {
                readonly __type: "Int!";
            };
            readonly returning: {
                readonly __type: "[setting!]!";
            };
        };
        readonly setting_obj_rel_insert_input: {
            readonly data: {
                readonly __type: "setting_insert_input!";
            };
            readonly on_conflict: {
                readonly __type: "setting_on_conflict";
            };
        };
        readonly setting_on_conflict: {
            readonly constraint: {
                readonly __type: "setting_constraint!";
            };
            readonly update_columns: {
                readonly __type: "[setting_update_column!]!";
            };
            readonly where: {
                readonly __type: "setting_bool_exp";
            };
        };
        readonly setting_order_by: {
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly key: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
            readonly value: {
                readonly __type: "order_by";
            };
        };
        readonly setting_pk_columns_input: {
            readonly key: {
                readonly __type: "String!";
            };
        };
        readonly setting_prepend_input: {
            readonly value: {
                readonly __type: "jsonb";
            };
        };
        readonly setting_set_input: {
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly key: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly value: {
                readonly __type: "jsonb";
            };
        };
        readonly st_d_within_geography_input: {
            readonly distance: {
                readonly __type: "Float!";
            };
            readonly from: {
                readonly __type: "geography!";
            };
            readonly use_spheroid: {
                readonly __type: "Boolean";
            };
        };
        readonly st_d_within_input: {
            readonly distance: {
                readonly __type: "Float!";
            };
            readonly from: {
                readonly __type: "geometry!";
            };
        };
        readonly tag: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly alternates: {
                readonly __type: "jsonb";
                readonly __args: {
                    readonly path: "String";
                };
            };
            readonly categories: {
                readonly __type: "[tag_tag!]!";
                readonly __args: {
                    readonly distinct_on: "[tag_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[tag_tag_order_by!]";
                    readonly where: "tag_tag_bool_exp";
                };
            };
            readonly categories_aggregate: {
                readonly __type: "tag_tag_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[tag_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[tag_tag_order_by!]";
                    readonly where: "tag_tag_bool_exp";
                };
            };
            readonly created_at: {
                readonly __type: "timestamptz!";
            };
            readonly default_image: {
                readonly __type: "String";
            };
            readonly default_images: {
                readonly __type: "jsonb";
                readonly __args: {
                    readonly path: "String";
                };
            };
            readonly description: {
                readonly __type: "String";
            };
            readonly displayName: {
                readonly __type: "String";
            };
            readonly frequency: {
                readonly __type: "Int";
            };
            readonly icon: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid!";
            };
            readonly is_ambiguous: {
                readonly __type: "Boolean!";
            };
            readonly misc: {
                readonly __type: "jsonb";
                readonly __args: {
                    readonly path: "String";
                };
            };
            readonly name: {
                readonly __type: "String!";
            };
            readonly order: {
                readonly __type: "Int!";
            };
            readonly parent: {
                readonly __type: "tag";
            };
            readonly parentId: {
                readonly __type: "uuid";
            };
            readonly popularity: {
                readonly __type: "Int";
            };
            readonly restaurant_taxonomies: {
                readonly __type: "[restaurant_tag!]!";
                readonly __args: {
                    readonly distinct_on: "[restaurant_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_tag_order_by!]";
                    readonly where: "restaurant_tag_bool_exp";
                };
            };
            readonly restaurant_taxonomies_aggregate: {
                readonly __type: "restaurant_tag_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[restaurant_tag_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[restaurant_tag_order_by!]";
                    readonly where: "restaurant_tag_bool_exp";
                };
            };
            readonly rgb: {
                readonly __type: "jsonb";
                readonly __args: {
                    readonly path: "String";
                };
            };
            readonly slug: {
                readonly __type: "String";
            };
            readonly type: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz!";
            };
        };
        readonly tag_aggregate: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly aggregate: {
                readonly __type: "tag_aggregate_fields";
            };
            readonly nodes: {
                readonly __type: "[tag!]!";
            };
        };
        readonly tag_aggregate_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly avg: {
                readonly __type: "tag_avg_fields";
            };
            readonly count: {
                readonly __type: "Int";
                readonly __args: {
                    readonly columns: "[tag_select_column!]";
                    readonly distinct: "Boolean";
                };
            };
            readonly max: {
                readonly __type: "tag_max_fields";
            };
            readonly min: {
                readonly __type: "tag_min_fields";
            };
            readonly stddev: {
                readonly __type: "tag_stddev_fields";
            };
            readonly stddev_pop: {
                readonly __type: "tag_stddev_pop_fields";
            };
            readonly stddev_samp: {
                readonly __type: "tag_stddev_samp_fields";
            };
            readonly sum: {
                readonly __type: "tag_sum_fields";
            };
            readonly var_pop: {
                readonly __type: "tag_var_pop_fields";
            };
            readonly var_samp: {
                readonly __type: "tag_var_samp_fields";
            };
            readonly variance: {
                readonly __type: "tag_variance_fields";
            };
        };
        readonly tag_aggregate_order_by: {
            readonly avg: {
                readonly __type: "tag_avg_order_by";
            };
            readonly count: {
                readonly __type: "order_by";
            };
            readonly max: {
                readonly __type: "tag_max_order_by";
            };
            readonly min: {
                readonly __type: "tag_min_order_by";
            };
            readonly stddev: {
                readonly __type: "tag_stddev_order_by";
            };
            readonly stddev_pop: {
                readonly __type: "tag_stddev_pop_order_by";
            };
            readonly stddev_samp: {
                readonly __type: "tag_stddev_samp_order_by";
            };
            readonly sum: {
                readonly __type: "tag_sum_order_by";
            };
            readonly var_pop: {
                readonly __type: "tag_var_pop_order_by";
            };
            readonly var_samp: {
                readonly __type: "tag_var_samp_order_by";
            };
            readonly variance: {
                readonly __type: "tag_variance_order_by";
            };
        };
        readonly tag_append_input: {
            readonly alternates: {
                readonly __type: "jsonb";
            };
            readonly default_images: {
                readonly __type: "jsonb";
            };
            readonly misc: {
                readonly __type: "jsonb";
            };
            readonly rgb: {
                readonly __type: "jsonb";
            };
        };
        readonly tag_arr_rel_insert_input: {
            readonly data: {
                readonly __type: "[tag_insert_input!]!";
            };
            readonly on_conflict: {
                readonly __type: "tag_on_conflict";
            };
        };
        readonly tag_avg_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly frequency: {
                readonly __type: "Float";
            };
            readonly order: {
                readonly __type: "Float";
            };
            readonly popularity: {
                readonly __type: "Float";
            };
        };
        readonly tag_avg_order_by: {
            readonly frequency: {
                readonly __type: "order_by";
            };
            readonly order: {
                readonly __type: "order_by";
            };
            readonly popularity: {
                readonly __type: "order_by";
            };
        };
        readonly tag_bool_exp: {
            readonly _and: {
                readonly __type: "[tag_bool_exp]";
            };
            readonly _not: {
                readonly __type: "tag_bool_exp";
            };
            readonly _or: {
                readonly __type: "[tag_bool_exp]";
            };
            readonly alternates: {
                readonly __type: "jsonb_comparison_exp";
            };
            readonly categories: {
                readonly __type: "tag_tag_bool_exp";
            };
            readonly created_at: {
                readonly __type: "timestamptz_comparison_exp";
            };
            readonly default_image: {
                readonly __type: "String_comparison_exp";
            };
            readonly default_images: {
                readonly __type: "jsonb_comparison_exp";
            };
            readonly description: {
                readonly __type: "String_comparison_exp";
            };
            readonly displayName: {
                readonly __type: "String_comparison_exp";
            };
            readonly frequency: {
                readonly __type: "Int_comparison_exp";
            };
            readonly icon: {
                readonly __type: "String_comparison_exp";
            };
            readonly id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly is_ambiguous: {
                readonly __type: "Boolean_comparison_exp";
            };
            readonly misc: {
                readonly __type: "jsonb_comparison_exp";
            };
            readonly name: {
                readonly __type: "String_comparison_exp";
            };
            readonly order: {
                readonly __type: "Int_comparison_exp";
            };
            readonly parent: {
                readonly __type: "tag_bool_exp";
            };
            readonly parentId: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly popularity: {
                readonly __type: "Int_comparison_exp";
            };
            readonly restaurant_taxonomies: {
                readonly __type: "restaurant_tag_bool_exp";
            };
            readonly rgb: {
                readonly __type: "jsonb_comparison_exp";
            };
            readonly slug: {
                readonly __type: "String_comparison_exp";
            };
            readonly type: {
                readonly __type: "String_comparison_exp";
            };
            readonly updated_at: {
                readonly __type: "timestamptz_comparison_exp";
            };
        };
        readonly tag_delete_at_path_input: {
            readonly alternates: {
                readonly __type: "[String]";
            };
            readonly default_images: {
                readonly __type: "[String]";
            };
            readonly misc: {
                readonly __type: "[String]";
            };
            readonly rgb: {
                readonly __type: "[String]";
            };
        };
        readonly tag_delete_elem_input: {
            readonly alternates: {
                readonly __type: "Int";
            };
            readonly default_images: {
                readonly __type: "Int";
            };
            readonly misc: {
                readonly __type: "Int";
            };
            readonly rgb: {
                readonly __type: "Int";
            };
        };
        readonly tag_delete_key_input: {
            readonly alternates: {
                readonly __type: "String";
            };
            readonly default_images: {
                readonly __type: "String";
            };
            readonly misc: {
                readonly __type: "String";
            };
            readonly rgb: {
                readonly __type: "String";
            };
        };
        readonly tag_inc_input: {
            readonly frequency: {
                readonly __type: "Int";
            };
            readonly order: {
                readonly __type: "Int";
            };
            readonly popularity: {
                readonly __type: "Int";
            };
        };
        readonly tag_insert_input: {
            readonly alternates: {
                readonly __type: "jsonb";
            };
            readonly categories: {
                readonly __type: "tag_tag_arr_rel_insert_input";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly default_image: {
                readonly __type: "String";
            };
            readonly default_images: {
                readonly __type: "jsonb";
            };
            readonly description: {
                readonly __type: "String";
            };
            readonly displayName: {
                readonly __type: "String";
            };
            readonly frequency: {
                readonly __type: "Int";
            };
            readonly icon: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly is_ambiguous: {
                readonly __type: "Boolean";
            };
            readonly misc: {
                readonly __type: "jsonb";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly order: {
                readonly __type: "Int";
            };
            readonly parent: {
                readonly __type: "tag_obj_rel_insert_input";
            };
            readonly parentId: {
                readonly __type: "uuid";
            };
            readonly popularity: {
                readonly __type: "Int";
            };
            readonly restaurant_taxonomies: {
                readonly __type: "restaurant_tag_arr_rel_insert_input";
            };
            readonly rgb: {
                readonly __type: "jsonb";
            };
            readonly slug: {
                readonly __type: "String";
            };
            readonly type: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
        };
        readonly tag_max_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly default_image: {
                readonly __type: "String";
            };
            readonly description: {
                readonly __type: "String";
            };
            readonly displayName: {
                readonly __type: "String";
            };
            readonly frequency: {
                readonly __type: "Int";
            };
            readonly icon: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly order: {
                readonly __type: "Int";
            };
            readonly parentId: {
                readonly __type: "uuid";
            };
            readonly popularity: {
                readonly __type: "Int";
            };
            readonly slug: {
                readonly __type: "String";
            };
            readonly type: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
        };
        readonly tag_max_order_by: {
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly default_image: {
                readonly __type: "order_by";
            };
            readonly description: {
                readonly __type: "order_by";
            };
            readonly displayName: {
                readonly __type: "order_by";
            };
            readonly frequency: {
                readonly __type: "order_by";
            };
            readonly icon: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly name: {
                readonly __type: "order_by";
            };
            readonly order: {
                readonly __type: "order_by";
            };
            readonly parentId: {
                readonly __type: "order_by";
            };
            readonly popularity: {
                readonly __type: "order_by";
            };
            readonly slug: {
                readonly __type: "order_by";
            };
            readonly type: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
        };
        readonly tag_min_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly default_image: {
                readonly __type: "String";
            };
            readonly description: {
                readonly __type: "String";
            };
            readonly displayName: {
                readonly __type: "String";
            };
            readonly frequency: {
                readonly __type: "Int";
            };
            readonly icon: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly order: {
                readonly __type: "Int";
            };
            readonly parentId: {
                readonly __type: "uuid";
            };
            readonly popularity: {
                readonly __type: "Int";
            };
            readonly slug: {
                readonly __type: "String";
            };
            readonly type: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
        };
        readonly tag_min_order_by: {
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly default_image: {
                readonly __type: "order_by";
            };
            readonly description: {
                readonly __type: "order_by";
            };
            readonly displayName: {
                readonly __type: "order_by";
            };
            readonly frequency: {
                readonly __type: "order_by";
            };
            readonly icon: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly name: {
                readonly __type: "order_by";
            };
            readonly order: {
                readonly __type: "order_by";
            };
            readonly parentId: {
                readonly __type: "order_by";
            };
            readonly popularity: {
                readonly __type: "order_by";
            };
            readonly slug: {
                readonly __type: "order_by";
            };
            readonly type: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
        };
        readonly tag_mutation_response: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly affected_rows: {
                readonly __type: "Int!";
            };
            readonly returning: {
                readonly __type: "[tag!]!";
            };
        };
        readonly tag_obj_rel_insert_input: {
            readonly data: {
                readonly __type: "tag_insert_input!";
            };
            readonly on_conflict: {
                readonly __type: "tag_on_conflict";
            };
        };
        readonly tag_on_conflict: {
            readonly constraint: {
                readonly __type: "tag_constraint!";
            };
            readonly update_columns: {
                readonly __type: "[tag_update_column!]!";
            };
            readonly where: {
                readonly __type: "tag_bool_exp";
            };
        };
        readonly tag_order_by: {
            readonly alternates: {
                readonly __type: "order_by";
            };
            readonly categories_aggregate: {
                readonly __type: "tag_tag_aggregate_order_by";
            };
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly default_image: {
                readonly __type: "order_by";
            };
            readonly default_images: {
                readonly __type: "order_by";
            };
            readonly description: {
                readonly __type: "order_by";
            };
            readonly displayName: {
                readonly __type: "order_by";
            };
            readonly frequency: {
                readonly __type: "order_by";
            };
            readonly icon: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly is_ambiguous: {
                readonly __type: "order_by";
            };
            readonly misc: {
                readonly __type: "order_by";
            };
            readonly name: {
                readonly __type: "order_by";
            };
            readonly order: {
                readonly __type: "order_by";
            };
            readonly parent: {
                readonly __type: "tag_order_by";
            };
            readonly parentId: {
                readonly __type: "order_by";
            };
            readonly popularity: {
                readonly __type: "order_by";
            };
            readonly restaurant_taxonomies_aggregate: {
                readonly __type: "restaurant_tag_aggregate_order_by";
            };
            readonly rgb: {
                readonly __type: "order_by";
            };
            readonly slug: {
                readonly __type: "order_by";
            };
            readonly type: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
        };
        readonly tag_pk_columns_input: {
            readonly id: {
                readonly __type: "uuid!";
            };
        };
        readonly tag_prepend_input: {
            readonly alternates: {
                readonly __type: "jsonb";
            };
            readonly default_images: {
                readonly __type: "jsonb";
            };
            readonly misc: {
                readonly __type: "jsonb";
            };
            readonly rgb: {
                readonly __type: "jsonb";
            };
        };
        readonly tag_set_input: {
            readonly alternates: {
                readonly __type: "jsonb";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly default_image: {
                readonly __type: "String";
            };
            readonly default_images: {
                readonly __type: "jsonb";
            };
            readonly description: {
                readonly __type: "String";
            };
            readonly displayName: {
                readonly __type: "String";
            };
            readonly frequency: {
                readonly __type: "Int";
            };
            readonly icon: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly is_ambiguous: {
                readonly __type: "Boolean";
            };
            readonly misc: {
                readonly __type: "jsonb";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly order: {
                readonly __type: "Int";
            };
            readonly parentId: {
                readonly __type: "uuid";
            };
            readonly popularity: {
                readonly __type: "Int";
            };
            readonly rgb: {
                readonly __type: "jsonb";
            };
            readonly slug: {
                readonly __type: "String";
            };
            readonly type: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
        };
        readonly tag_stddev_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly frequency: {
                readonly __type: "Float";
            };
            readonly order: {
                readonly __type: "Float";
            };
            readonly popularity: {
                readonly __type: "Float";
            };
        };
        readonly tag_stddev_order_by: {
            readonly frequency: {
                readonly __type: "order_by";
            };
            readonly order: {
                readonly __type: "order_by";
            };
            readonly popularity: {
                readonly __type: "order_by";
            };
        };
        readonly tag_stddev_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly frequency: {
                readonly __type: "Float";
            };
            readonly order: {
                readonly __type: "Float";
            };
            readonly popularity: {
                readonly __type: "Float";
            };
        };
        readonly tag_stddev_pop_order_by: {
            readonly frequency: {
                readonly __type: "order_by";
            };
            readonly order: {
                readonly __type: "order_by";
            };
            readonly popularity: {
                readonly __type: "order_by";
            };
        };
        readonly tag_stddev_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly frequency: {
                readonly __type: "Float";
            };
            readonly order: {
                readonly __type: "Float";
            };
            readonly popularity: {
                readonly __type: "Float";
            };
        };
        readonly tag_stddev_samp_order_by: {
            readonly frequency: {
                readonly __type: "order_by";
            };
            readonly order: {
                readonly __type: "order_by";
            };
            readonly popularity: {
                readonly __type: "order_by";
            };
        };
        readonly tag_sum_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly frequency: {
                readonly __type: "Int";
            };
            readonly order: {
                readonly __type: "Int";
            };
            readonly popularity: {
                readonly __type: "Int";
            };
        };
        readonly tag_sum_order_by: {
            readonly frequency: {
                readonly __type: "order_by";
            };
            readonly order: {
                readonly __type: "order_by";
            };
            readonly popularity: {
                readonly __type: "order_by";
            };
        };
        readonly tag_tag: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly category: {
                readonly __type: "tag!";
            };
            readonly category_tag_id: {
                readonly __type: "uuid!";
            };
            readonly main: {
                readonly __type: "tag!";
            };
            readonly tag_id: {
                readonly __type: "uuid!";
            };
        };
        readonly tag_tag_aggregate: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly aggregate: {
                readonly __type: "tag_tag_aggregate_fields";
            };
            readonly nodes: {
                readonly __type: "[tag_tag!]!";
            };
        };
        readonly tag_tag_aggregate_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly count: {
                readonly __type: "Int";
                readonly __args: {
                    readonly columns: "[tag_tag_select_column!]";
                    readonly distinct: "Boolean";
                };
            };
            readonly max: {
                readonly __type: "tag_tag_max_fields";
            };
            readonly min: {
                readonly __type: "tag_tag_min_fields";
            };
        };
        readonly tag_tag_aggregate_order_by: {
            readonly count: {
                readonly __type: "order_by";
            };
            readonly max: {
                readonly __type: "tag_tag_max_order_by";
            };
            readonly min: {
                readonly __type: "tag_tag_min_order_by";
            };
        };
        readonly tag_tag_arr_rel_insert_input: {
            readonly data: {
                readonly __type: "[tag_tag_insert_input!]!";
            };
            readonly on_conflict: {
                readonly __type: "tag_tag_on_conflict";
            };
        };
        readonly tag_tag_bool_exp: {
            readonly _and: {
                readonly __type: "[tag_tag_bool_exp]";
            };
            readonly _not: {
                readonly __type: "tag_tag_bool_exp";
            };
            readonly _or: {
                readonly __type: "[tag_tag_bool_exp]";
            };
            readonly category: {
                readonly __type: "tag_bool_exp";
            };
            readonly category_tag_id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly main: {
                readonly __type: "tag_bool_exp";
            };
            readonly tag_id: {
                readonly __type: "uuid_comparison_exp";
            };
        };
        readonly tag_tag_insert_input: {
            readonly category: {
                readonly __type: "tag_obj_rel_insert_input";
            };
            readonly category_tag_id: {
                readonly __type: "uuid";
            };
            readonly main: {
                readonly __type: "tag_obj_rel_insert_input";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
        };
        readonly tag_tag_max_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly category_tag_id: {
                readonly __type: "uuid";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
        };
        readonly tag_tag_max_order_by: {
            readonly category_tag_id: {
                readonly __type: "order_by";
            };
            readonly tag_id: {
                readonly __type: "order_by";
            };
        };
        readonly tag_tag_min_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly category_tag_id: {
                readonly __type: "uuid";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
        };
        readonly tag_tag_min_order_by: {
            readonly category_tag_id: {
                readonly __type: "order_by";
            };
            readonly tag_id: {
                readonly __type: "order_by";
            };
        };
        readonly tag_tag_mutation_response: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly affected_rows: {
                readonly __type: "Int!";
            };
            readonly returning: {
                readonly __type: "[tag_tag!]!";
            };
        };
        readonly tag_tag_obj_rel_insert_input: {
            readonly data: {
                readonly __type: "tag_tag_insert_input!";
            };
            readonly on_conflict: {
                readonly __type: "tag_tag_on_conflict";
            };
        };
        readonly tag_tag_on_conflict: {
            readonly constraint: {
                readonly __type: "tag_tag_constraint!";
            };
            readonly update_columns: {
                readonly __type: "[tag_tag_update_column!]!";
            };
            readonly where: {
                readonly __type: "tag_tag_bool_exp";
            };
        };
        readonly tag_tag_order_by: {
            readonly category: {
                readonly __type: "tag_order_by";
            };
            readonly category_tag_id: {
                readonly __type: "order_by";
            };
            readonly main: {
                readonly __type: "tag_order_by";
            };
            readonly tag_id: {
                readonly __type: "order_by";
            };
        };
        readonly tag_tag_pk_columns_input: {
            readonly category_tag_id: {
                readonly __type: "uuid!";
            };
            readonly tag_id: {
                readonly __type: "uuid!";
            };
        };
        readonly tag_tag_set_input: {
            readonly category_tag_id: {
                readonly __type: "uuid";
            };
            readonly tag_id: {
                readonly __type: "uuid";
            };
        };
        readonly tag_var_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly frequency: {
                readonly __type: "Float";
            };
            readonly order: {
                readonly __type: "Float";
            };
            readonly popularity: {
                readonly __type: "Float";
            };
        };
        readonly tag_var_pop_order_by: {
            readonly frequency: {
                readonly __type: "order_by";
            };
            readonly order: {
                readonly __type: "order_by";
            };
            readonly popularity: {
                readonly __type: "order_by";
            };
        };
        readonly tag_var_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly frequency: {
                readonly __type: "Float";
            };
            readonly order: {
                readonly __type: "Float";
            };
            readonly popularity: {
                readonly __type: "Float";
            };
        };
        readonly tag_var_samp_order_by: {
            readonly frequency: {
                readonly __type: "order_by";
            };
            readonly order: {
                readonly __type: "order_by";
            };
            readonly popularity: {
                readonly __type: "order_by";
            };
        };
        readonly tag_variance_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly frequency: {
                readonly __type: "Float";
            };
            readonly order: {
                readonly __type: "Float";
            };
            readonly popularity: {
                readonly __type: "Float";
            };
        };
        readonly tag_variance_order_by: {
            readonly frequency: {
                readonly __type: "order_by";
            };
            readonly order: {
                readonly __type: "order_by";
            };
            readonly popularity: {
                readonly __type: "order_by";
            };
        };
        readonly timestamptz_comparison_exp: {
            readonly _eq: {
                readonly __type: "timestamptz";
            };
            readonly _gt: {
                readonly __type: "timestamptz";
            };
            readonly _gte: {
                readonly __type: "timestamptz";
            };
            readonly _in: {
                readonly __type: "[timestamptz!]";
            };
            readonly _is_null: {
                readonly __type: "Boolean";
            };
            readonly _lt: {
                readonly __type: "timestamptz";
            };
            readonly _lte: {
                readonly __type: "timestamptz";
            };
            readonly _neq: {
                readonly __type: "timestamptz";
            };
            readonly _nin: {
                readonly __type: "[timestamptz!]";
            };
        };
        readonly tsrange_comparison_exp: {
            readonly _eq: {
                readonly __type: "tsrange";
            };
            readonly _gt: {
                readonly __type: "tsrange";
            };
            readonly _gte: {
                readonly __type: "tsrange";
            };
            readonly _in: {
                readonly __type: "[tsrange!]";
            };
            readonly _is_null: {
                readonly __type: "Boolean";
            };
            readonly _lt: {
                readonly __type: "tsrange";
            };
            readonly _lte: {
                readonly __type: "tsrange";
            };
            readonly _neq: {
                readonly __type: "tsrange";
            };
            readonly _nin: {
                readonly __type: "[tsrange!]";
            };
        };
        readonly user: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly about: {
                readonly __type: "String";
            };
            readonly apple_email: {
                readonly __type: "String";
            };
            readonly apple_refresh_token: {
                readonly __type: "String";
            };
            readonly apple_token: {
                readonly __type: "String";
            };
            readonly apple_uid: {
                readonly __type: "String";
            };
            readonly avatar: {
                readonly __type: "String";
            };
            readonly charIndex: {
                readonly __type: "Int!";
            };
            readonly created_at: {
                readonly __type: "timestamptz!";
            };
            readonly email: {
                readonly __type: "String";
            };
            readonly has_onboarded: {
                readonly __type: "Boolean!";
            };
            readonly id: {
                readonly __type: "uuid!";
            };
            readonly lists: {
                readonly __type: "[list!]!";
                readonly __args: {
                    readonly distinct_on: "[list_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_order_by!]";
                    readonly where: "list_bool_exp";
                };
            };
            readonly lists_aggregate: {
                readonly __type: "list_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[list_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[list_order_by!]";
                    readonly where: "list_bool_exp";
                };
            };
            readonly location: {
                readonly __type: "String";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly password: {
                readonly __type: "String!";
            };
            readonly password_reset_date: {
                readonly __type: "timestamptz";
            };
            readonly password_reset_token: {
                readonly __type: "String";
            };
            readonly reviews: {
                readonly __type: "[review!]!";
                readonly __args: {
                    readonly distinct_on: "[review_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[review_order_by!]";
                    readonly where: "review_bool_exp";
                };
            };
            readonly reviews_aggregate: {
                readonly __type: "review_aggregate!";
                readonly __args: {
                    readonly distinct_on: "[review_select_column!]";
                    readonly limit: "Int";
                    readonly offset: "Int";
                    readonly order_by: "[review_order_by!]";
                    readonly where: "review_bool_exp";
                };
            };
            readonly role: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz!";
            };
            readonly username: {
                readonly __type: "String!";
            };
        };
        readonly user_aggregate: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly aggregate: {
                readonly __type: "user_aggregate_fields";
            };
            readonly nodes: {
                readonly __type: "[user!]!";
            };
        };
        readonly user_aggregate_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly avg: {
                readonly __type: "user_avg_fields";
            };
            readonly count: {
                readonly __type: "Int";
                readonly __args: {
                    readonly columns: "[user_select_column!]";
                    readonly distinct: "Boolean";
                };
            };
            readonly max: {
                readonly __type: "user_max_fields";
            };
            readonly min: {
                readonly __type: "user_min_fields";
            };
            readonly stddev: {
                readonly __type: "user_stddev_fields";
            };
            readonly stddev_pop: {
                readonly __type: "user_stddev_pop_fields";
            };
            readonly stddev_samp: {
                readonly __type: "user_stddev_samp_fields";
            };
            readonly sum: {
                readonly __type: "user_sum_fields";
            };
            readonly var_pop: {
                readonly __type: "user_var_pop_fields";
            };
            readonly var_samp: {
                readonly __type: "user_var_samp_fields";
            };
            readonly variance: {
                readonly __type: "user_variance_fields";
            };
        };
        readonly user_aggregate_order_by: {
            readonly avg: {
                readonly __type: "user_avg_order_by";
            };
            readonly count: {
                readonly __type: "order_by";
            };
            readonly max: {
                readonly __type: "user_max_order_by";
            };
            readonly min: {
                readonly __type: "user_min_order_by";
            };
            readonly stddev: {
                readonly __type: "user_stddev_order_by";
            };
            readonly stddev_pop: {
                readonly __type: "user_stddev_pop_order_by";
            };
            readonly stddev_samp: {
                readonly __type: "user_stddev_samp_order_by";
            };
            readonly sum: {
                readonly __type: "user_sum_order_by";
            };
            readonly var_pop: {
                readonly __type: "user_var_pop_order_by";
            };
            readonly var_samp: {
                readonly __type: "user_var_samp_order_by";
            };
            readonly variance: {
                readonly __type: "user_variance_order_by";
            };
        };
        readonly user_arr_rel_insert_input: {
            readonly data: {
                readonly __type: "[user_insert_input!]!";
            };
            readonly on_conflict: {
                readonly __type: "user_on_conflict";
            };
        };
        readonly user_avg_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly charIndex: {
                readonly __type: "Float";
            };
        };
        readonly user_avg_order_by: {
            readonly charIndex: {
                readonly __type: "order_by";
            };
        };
        readonly user_bool_exp: {
            readonly _and: {
                readonly __type: "[user_bool_exp]";
            };
            readonly _not: {
                readonly __type: "user_bool_exp";
            };
            readonly _or: {
                readonly __type: "[user_bool_exp]";
            };
            readonly about: {
                readonly __type: "String_comparison_exp";
            };
            readonly apple_email: {
                readonly __type: "String_comparison_exp";
            };
            readonly apple_refresh_token: {
                readonly __type: "String_comparison_exp";
            };
            readonly apple_token: {
                readonly __type: "String_comparison_exp";
            };
            readonly apple_uid: {
                readonly __type: "String_comparison_exp";
            };
            readonly avatar: {
                readonly __type: "String_comparison_exp";
            };
            readonly charIndex: {
                readonly __type: "Int_comparison_exp";
            };
            readonly created_at: {
                readonly __type: "timestamptz_comparison_exp";
            };
            readonly email: {
                readonly __type: "String_comparison_exp";
            };
            readonly has_onboarded: {
                readonly __type: "Boolean_comparison_exp";
            };
            readonly id: {
                readonly __type: "uuid_comparison_exp";
            };
            readonly lists: {
                readonly __type: "list_bool_exp";
            };
            readonly location: {
                readonly __type: "String_comparison_exp";
            };
            readonly name: {
                readonly __type: "String_comparison_exp";
            };
            readonly password: {
                readonly __type: "String_comparison_exp";
            };
            readonly password_reset_date: {
                readonly __type: "timestamptz_comparison_exp";
            };
            readonly password_reset_token: {
                readonly __type: "String_comparison_exp";
            };
            readonly reviews: {
                readonly __type: "review_bool_exp";
            };
            readonly role: {
                readonly __type: "String_comparison_exp";
            };
            readonly updated_at: {
                readonly __type: "timestamptz_comparison_exp";
            };
            readonly username: {
                readonly __type: "String_comparison_exp";
            };
        };
        readonly user_inc_input: {
            readonly charIndex: {
                readonly __type: "Int";
            };
        };
        readonly user_insert_input: {
            readonly about: {
                readonly __type: "String";
            };
            readonly apple_email: {
                readonly __type: "String";
            };
            readonly apple_refresh_token: {
                readonly __type: "String";
            };
            readonly apple_token: {
                readonly __type: "String";
            };
            readonly apple_uid: {
                readonly __type: "String";
            };
            readonly avatar: {
                readonly __type: "String";
            };
            readonly charIndex: {
                readonly __type: "Int";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly email: {
                readonly __type: "String";
            };
            readonly has_onboarded: {
                readonly __type: "Boolean";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly lists: {
                readonly __type: "list_arr_rel_insert_input";
            };
            readonly location: {
                readonly __type: "String";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly password: {
                readonly __type: "String";
            };
            readonly password_reset_date: {
                readonly __type: "timestamptz";
            };
            readonly password_reset_token: {
                readonly __type: "String";
            };
            readonly reviews: {
                readonly __type: "review_arr_rel_insert_input";
            };
            readonly role: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly username: {
                readonly __type: "String";
            };
        };
        readonly user_max_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly about: {
                readonly __type: "String";
            };
            readonly apple_email: {
                readonly __type: "String";
            };
            readonly apple_refresh_token: {
                readonly __type: "String";
            };
            readonly apple_token: {
                readonly __type: "String";
            };
            readonly apple_uid: {
                readonly __type: "String";
            };
            readonly avatar: {
                readonly __type: "String";
            };
            readonly charIndex: {
                readonly __type: "Int";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly email: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly location: {
                readonly __type: "String";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly password: {
                readonly __type: "String";
            };
            readonly password_reset_date: {
                readonly __type: "timestamptz";
            };
            readonly password_reset_token: {
                readonly __type: "String";
            };
            readonly role: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly username: {
                readonly __type: "String";
            };
        };
        readonly user_max_order_by: {
            readonly about: {
                readonly __type: "order_by";
            };
            readonly apple_email: {
                readonly __type: "order_by";
            };
            readonly apple_refresh_token: {
                readonly __type: "order_by";
            };
            readonly apple_token: {
                readonly __type: "order_by";
            };
            readonly apple_uid: {
                readonly __type: "order_by";
            };
            readonly avatar: {
                readonly __type: "order_by";
            };
            readonly charIndex: {
                readonly __type: "order_by";
            };
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly email: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly location: {
                readonly __type: "order_by";
            };
            readonly name: {
                readonly __type: "order_by";
            };
            readonly password: {
                readonly __type: "order_by";
            };
            readonly password_reset_date: {
                readonly __type: "order_by";
            };
            readonly password_reset_token: {
                readonly __type: "order_by";
            };
            readonly role: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
            readonly username: {
                readonly __type: "order_by";
            };
        };
        readonly user_min_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly about: {
                readonly __type: "String";
            };
            readonly apple_email: {
                readonly __type: "String";
            };
            readonly apple_refresh_token: {
                readonly __type: "String";
            };
            readonly apple_token: {
                readonly __type: "String";
            };
            readonly apple_uid: {
                readonly __type: "String";
            };
            readonly avatar: {
                readonly __type: "String";
            };
            readonly charIndex: {
                readonly __type: "Int";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly email: {
                readonly __type: "String";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly location: {
                readonly __type: "String";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly password: {
                readonly __type: "String";
            };
            readonly password_reset_date: {
                readonly __type: "timestamptz";
            };
            readonly password_reset_token: {
                readonly __type: "String";
            };
            readonly role: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly username: {
                readonly __type: "String";
            };
        };
        readonly user_min_order_by: {
            readonly about: {
                readonly __type: "order_by";
            };
            readonly apple_email: {
                readonly __type: "order_by";
            };
            readonly apple_refresh_token: {
                readonly __type: "order_by";
            };
            readonly apple_token: {
                readonly __type: "order_by";
            };
            readonly apple_uid: {
                readonly __type: "order_by";
            };
            readonly avatar: {
                readonly __type: "order_by";
            };
            readonly charIndex: {
                readonly __type: "order_by";
            };
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly email: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly location: {
                readonly __type: "order_by";
            };
            readonly name: {
                readonly __type: "order_by";
            };
            readonly password: {
                readonly __type: "order_by";
            };
            readonly password_reset_date: {
                readonly __type: "order_by";
            };
            readonly password_reset_token: {
                readonly __type: "order_by";
            };
            readonly role: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
            readonly username: {
                readonly __type: "order_by";
            };
        };
        readonly user_mutation_response: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly affected_rows: {
                readonly __type: "Int!";
            };
            readonly returning: {
                readonly __type: "[user!]!";
            };
        };
        readonly user_obj_rel_insert_input: {
            readonly data: {
                readonly __type: "user_insert_input!";
            };
            readonly on_conflict: {
                readonly __type: "user_on_conflict";
            };
        };
        readonly user_on_conflict: {
            readonly constraint: {
                readonly __type: "user_constraint!";
            };
            readonly update_columns: {
                readonly __type: "[user_update_column!]!";
            };
            readonly where: {
                readonly __type: "user_bool_exp";
            };
        };
        readonly user_order_by: {
            readonly about: {
                readonly __type: "order_by";
            };
            readonly apple_email: {
                readonly __type: "order_by";
            };
            readonly apple_refresh_token: {
                readonly __type: "order_by";
            };
            readonly apple_token: {
                readonly __type: "order_by";
            };
            readonly apple_uid: {
                readonly __type: "order_by";
            };
            readonly avatar: {
                readonly __type: "order_by";
            };
            readonly charIndex: {
                readonly __type: "order_by";
            };
            readonly created_at: {
                readonly __type: "order_by";
            };
            readonly email: {
                readonly __type: "order_by";
            };
            readonly has_onboarded: {
                readonly __type: "order_by";
            };
            readonly id: {
                readonly __type: "order_by";
            };
            readonly lists_aggregate: {
                readonly __type: "list_aggregate_order_by";
            };
            readonly location: {
                readonly __type: "order_by";
            };
            readonly name: {
                readonly __type: "order_by";
            };
            readonly password: {
                readonly __type: "order_by";
            };
            readonly password_reset_date: {
                readonly __type: "order_by";
            };
            readonly password_reset_token: {
                readonly __type: "order_by";
            };
            readonly reviews_aggregate: {
                readonly __type: "review_aggregate_order_by";
            };
            readonly role: {
                readonly __type: "order_by";
            };
            readonly updated_at: {
                readonly __type: "order_by";
            };
            readonly username: {
                readonly __type: "order_by";
            };
        };
        readonly user_pk_columns_input: {
            readonly id: {
                readonly __type: "uuid!";
            };
        };
        readonly user_set_input: {
            readonly about: {
                readonly __type: "String";
            };
            readonly apple_email: {
                readonly __type: "String";
            };
            readonly apple_refresh_token: {
                readonly __type: "String";
            };
            readonly apple_token: {
                readonly __type: "String";
            };
            readonly apple_uid: {
                readonly __type: "String";
            };
            readonly avatar: {
                readonly __type: "String";
            };
            readonly charIndex: {
                readonly __type: "Int";
            };
            readonly created_at: {
                readonly __type: "timestamptz";
            };
            readonly email: {
                readonly __type: "String";
            };
            readonly has_onboarded: {
                readonly __type: "Boolean";
            };
            readonly id: {
                readonly __type: "uuid";
            };
            readonly location: {
                readonly __type: "String";
            };
            readonly name: {
                readonly __type: "String";
            };
            readonly password: {
                readonly __type: "String";
            };
            readonly password_reset_date: {
                readonly __type: "timestamptz";
            };
            readonly password_reset_token: {
                readonly __type: "String";
            };
            readonly role: {
                readonly __type: "String";
            };
            readonly updated_at: {
                readonly __type: "timestamptz";
            };
            readonly username: {
                readonly __type: "String";
            };
        };
        readonly user_stddev_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly charIndex: {
                readonly __type: "Float";
            };
        };
        readonly user_stddev_order_by: {
            readonly charIndex: {
                readonly __type: "order_by";
            };
        };
        readonly user_stddev_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly charIndex: {
                readonly __type: "Float";
            };
        };
        readonly user_stddev_pop_order_by: {
            readonly charIndex: {
                readonly __type: "order_by";
            };
        };
        readonly user_stddev_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly charIndex: {
                readonly __type: "Float";
            };
        };
        readonly user_stddev_samp_order_by: {
            readonly charIndex: {
                readonly __type: "order_by";
            };
        };
        readonly user_sum_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly charIndex: {
                readonly __type: "Int";
            };
        };
        readonly user_sum_order_by: {
            readonly charIndex: {
                readonly __type: "order_by";
            };
        };
        readonly user_var_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly charIndex: {
                readonly __type: "Float";
            };
        };
        readonly user_var_pop_order_by: {
            readonly charIndex: {
                readonly __type: "order_by";
            };
        };
        readonly user_var_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly charIndex: {
                readonly __type: "Float";
            };
        };
        readonly user_var_samp_order_by: {
            readonly charIndex: {
                readonly __type: "order_by";
            };
        };
        readonly user_variance_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly charIndex: {
                readonly __type: "Float";
            };
        };
        readonly user_variance_order_by: {
            readonly charIndex: {
                readonly __type: "order_by";
            };
        };
        readonly uuid_comparison_exp: {
            readonly _eq: {
                readonly __type: "uuid";
            };
            readonly _gt: {
                readonly __type: "uuid";
            };
            readonly _gte: {
                readonly __type: "uuid";
            };
            readonly _in: {
                readonly __type: "[uuid!]";
            };
            readonly _is_null: {
                readonly __type: "Boolean";
            };
            readonly _lt: {
                readonly __type: "uuid";
            };
            readonly _lte: {
                readonly __type: "uuid";
            };
            readonly _neq: {
                readonly __type: "uuid";
            };
            readonly _nin: {
                readonly __type: "[uuid!]";
            };
        };
        readonly zcta5: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly color: {
                readonly __type: "String";
            };
            readonly intptlat10: {
                readonly __type: "String";
            };
            readonly intptlon10: {
                readonly __type: "String";
            };
            readonly nhood: {
                readonly __type: "String";
            };
            readonly ogc_fid: {
                readonly __type: "Int!";
            };
            readonly slug: {
                readonly __type: "String";
            };
            readonly wkb_geometry: {
                readonly __type: "geometry";
            };
        };
        readonly zcta5_aggregate: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly aggregate: {
                readonly __type: "zcta5_aggregate_fields";
            };
            readonly nodes: {
                readonly __type: "[zcta5!]!";
            };
        };
        readonly zcta5_aggregate_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly avg: {
                readonly __type: "zcta5_avg_fields";
            };
            readonly count: {
                readonly __type: "Int";
                readonly __args: {
                    readonly columns: "[zcta5_select_column!]";
                    readonly distinct: "Boolean";
                };
            };
            readonly max: {
                readonly __type: "zcta5_max_fields";
            };
            readonly min: {
                readonly __type: "zcta5_min_fields";
            };
            readonly stddev: {
                readonly __type: "zcta5_stddev_fields";
            };
            readonly stddev_pop: {
                readonly __type: "zcta5_stddev_pop_fields";
            };
            readonly stddev_samp: {
                readonly __type: "zcta5_stddev_samp_fields";
            };
            readonly sum: {
                readonly __type: "zcta5_sum_fields";
            };
            readonly var_pop: {
                readonly __type: "zcta5_var_pop_fields";
            };
            readonly var_samp: {
                readonly __type: "zcta5_var_samp_fields";
            };
            readonly variance: {
                readonly __type: "zcta5_variance_fields";
            };
        };
        readonly zcta5_aggregate_order_by: {
            readonly avg: {
                readonly __type: "zcta5_avg_order_by";
            };
            readonly count: {
                readonly __type: "order_by";
            };
            readonly max: {
                readonly __type: "zcta5_max_order_by";
            };
            readonly min: {
                readonly __type: "zcta5_min_order_by";
            };
            readonly stddev: {
                readonly __type: "zcta5_stddev_order_by";
            };
            readonly stddev_pop: {
                readonly __type: "zcta5_stddev_pop_order_by";
            };
            readonly stddev_samp: {
                readonly __type: "zcta5_stddev_samp_order_by";
            };
            readonly sum: {
                readonly __type: "zcta5_sum_order_by";
            };
            readonly var_pop: {
                readonly __type: "zcta5_var_pop_order_by";
            };
            readonly var_samp: {
                readonly __type: "zcta5_var_samp_order_by";
            };
            readonly variance: {
                readonly __type: "zcta5_variance_order_by";
            };
        };
        readonly zcta5_arr_rel_insert_input: {
            readonly data: {
                readonly __type: "[zcta5_insert_input!]!";
            };
            readonly on_conflict: {
                readonly __type: "zcta5_on_conflict";
            };
        };
        readonly zcta5_avg_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly zcta5_avg_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly zcta5_bool_exp: {
            readonly _and: {
                readonly __type: "[zcta5_bool_exp]";
            };
            readonly _not: {
                readonly __type: "zcta5_bool_exp";
            };
            readonly _or: {
                readonly __type: "[zcta5_bool_exp]";
            };
            readonly color: {
                readonly __type: "String_comparison_exp";
            };
            readonly intptlat10: {
                readonly __type: "String_comparison_exp";
            };
            readonly intptlon10: {
                readonly __type: "String_comparison_exp";
            };
            readonly nhood: {
                readonly __type: "String_comparison_exp";
            };
            readonly ogc_fid: {
                readonly __type: "Int_comparison_exp";
            };
            readonly slug: {
                readonly __type: "String_comparison_exp";
            };
            readonly wkb_geometry: {
                readonly __type: "geometry_comparison_exp";
            };
        };
        readonly zcta5_inc_input: {
            readonly ogc_fid: {
                readonly __type: "Int";
            };
        };
        readonly zcta5_insert_input: {
            readonly color: {
                readonly __type: "String";
            };
            readonly intptlat10: {
                readonly __type: "String";
            };
            readonly intptlon10: {
                readonly __type: "String";
            };
            readonly nhood: {
                readonly __type: "String";
            };
            readonly ogc_fid: {
                readonly __type: "Int";
            };
            readonly slug: {
                readonly __type: "String";
            };
            readonly wkb_geometry: {
                readonly __type: "geometry";
            };
        };
        readonly zcta5_max_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly color: {
                readonly __type: "String";
            };
            readonly intptlat10: {
                readonly __type: "String";
            };
            readonly intptlon10: {
                readonly __type: "String";
            };
            readonly nhood: {
                readonly __type: "String";
            };
            readonly ogc_fid: {
                readonly __type: "Int";
            };
            readonly slug: {
                readonly __type: "String";
            };
        };
        readonly zcta5_max_order_by: {
            readonly color: {
                readonly __type: "order_by";
            };
            readonly intptlat10: {
                readonly __type: "order_by";
            };
            readonly intptlon10: {
                readonly __type: "order_by";
            };
            readonly nhood: {
                readonly __type: "order_by";
            };
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
            readonly slug: {
                readonly __type: "order_by";
            };
        };
        readonly zcta5_min_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly color: {
                readonly __type: "String";
            };
            readonly intptlat10: {
                readonly __type: "String";
            };
            readonly intptlon10: {
                readonly __type: "String";
            };
            readonly nhood: {
                readonly __type: "String";
            };
            readonly ogc_fid: {
                readonly __type: "Int";
            };
            readonly slug: {
                readonly __type: "String";
            };
        };
        readonly zcta5_min_order_by: {
            readonly color: {
                readonly __type: "order_by";
            };
            readonly intptlat10: {
                readonly __type: "order_by";
            };
            readonly intptlon10: {
                readonly __type: "order_by";
            };
            readonly nhood: {
                readonly __type: "order_by";
            };
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
            readonly slug: {
                readonly __type: "order_by";
            };
        };
        readonly zcta5_mutation_response: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly affected_rows: {
                readonly __type: "Int!";
            };
            readonly returning: {
                readonly __type: "[zcta5!]!";
            };
        };
        readonly zcta5_obj_rel_insert_input: {
            readonly data: {
                readonly __type: "zcta5_insert_input!";
            };
            readonly on_conflict: {
                readonly __type: "zcta5_on_conflict";
            };
        };
        readonly zcta5_on_conflict: {
            readonly constraint: {
                readonly __type: "zcta5_constraint!";
            };
            readonly update_columns: {
                readonly __type: "[zcta5_update_column!]!";
            };
            readonly where: {
                readonly __type: "zcta5_bool_exp";
            };
        };
        readonly zcta5_order_by: {
            readonly color: {
                readonly __type: "order_by";
            };
            readonly intptlat10: {
                readonly __type: "order_by";
            };
            readonly intptlon10: {
                readonly __type: "order_by";
            };
            readonly nhood: {
                readonly __type: "order_by";
            };
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
            readonly slug: {
                readonly __type: "order_by";
            };
            readonly wkb_geometry: {
                readonly __type: "order_by";
            };
        };
        readonly zcta5_pk_columns_input: {
            readonly ogc_fid: {
                readonly __type: "Int!";
            };
        };
        readonly zcta5_set_input: {
            readonly color: {
                readonly __type: "String";
            };
            readonly intptlat10: {
                readonly __type: "String";
            };
            readonly intptlon10: {
                readonly __type: "String";
            };
            readonly nhood: {
                readonly __type: "String";
            };
            readonly ogc_fid: {
                readonly __type: "Int";
            };
            readonly slug: {
                readonly __type: "String";
            };
            readonly wkb_geometry: {
                readonly __type: "geometry";
            };
        };
        readonly zcta5_stddev_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly zcta5_stddev_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly zcta5_stddev_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly zcta5_stddev_pop_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly zcta5_stddev_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly zcta5_stddev_samp_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly zcta5_sum_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Int";
            };
        };
        readonly zcta5_sum_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly zcta5_var_pop_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly zcta5_var_pop_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly zcta5_var_samp_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly zcta5_var_samp_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
        readonly zcta5_variance_fields: {
            readonly __typename: {
                readonly __type: "String!";
            };
            readonly ogc_fid: {
                readonly __type: "Float";
            };
        };
        readonly zcta5_variance_order_by: {
            readonly ogc_fid: {
                readonly __type: "order_by";
            };
        };
    };
    export interface Query {
        __typename: 'Query' | null;
        hrr: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['hrr_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<hrr_order_by>>;
            where?: Maybe<hrr_bool_exp>;
        }) => Array<hrr>;
        hrr_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['hrr_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<hrr_order_by>>;
            where?: Maybe<hrr_bool_exp>;
        }) => hrr_aggregate;
        hrr_by_pk: (args: {
            ogc_fid: ScalarsEnums['Int'];
        }) => Maybe<hrr>;
        list: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_order_by>>;
            where?: Maybe<list_bool_exp>;
        }) => Array<list>;
        list_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_order_by>>;
            where?: Maybe<list_bool_exp>;
        }) => list_aggregate;
        list_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<list>;
        list_populated: (args: {
            args: list_populated_args;
            distinct_on?: Maybe<Array<ScalarsEnums['list_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_order_by>>;
            where?: Maybe<list_bool_exp>;
        }) => Array<list>;
        list_populated_aggregate: (args: {
            args: list_populated_args;
            distinct_on?: Maybe<Array<ScalarsEnums['list_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_order_by>>;
            where?: Maybe<list_bool_exp>;
        }) => list_aggregate;
        list_restaurant: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_restaurant_order_by>>;
            where?: Maybe<list_restaurant_bool_exp>;
        }) => Array<list_restaurant>;
        list_restaurant_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_restaurant_order_by>>;
            where?: Maybe<list_restaurant_bool_exp>;
        }) => list_restaurant_aggregate;
        list_restaurant_by_pk: (args: {
            list_id: ScalarsEnums['uuid'];
            restaurant_id: ScalarsEnums['uuid'];
        }) => Maybe<list_restaurant>;
        list_restaurant_tag: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_restaurant_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_restaurant_tag_order_by>>;
            where?: Maybe<list_restaurant_tag_bool_exp>;
        }) => Array<list_restaurant_tag>;
        list_restaurant_tag_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_restaurant_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_restaurant_tag_order_by>>;
            where?: Maybe<list_restaurant_tag_bool_exp>;
        }) => list_restaurant_tag_aggregate;
        list_restaurant_tag_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<list_restaurant_tag>;
        list_tag: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_tag_order_by>>;
            where?: Maybe<list_tag_bool_exp>;
        }) => Array<list_tag>;
        list_tag_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_tag_order_by>>;
            where?: Maybe<list_tag_bool_exp>;
        }) => list_tag_aggregate;
        list_tag_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<list_tag>;
        menu_item: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['menu_item_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<menu_item_order_by>>;
            where?: Maybe<menu_item_bool_exp>;
        }) => Array<menu_item>;
        menu_item_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['menu_item_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<menu_item_order_by>>;
            where?: Maybe<menu_item_bool_exp>;
        }) => menu_item_aggregate;
        menu_item_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<menu_item>;
        nhood_labels: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['nhood_labels_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<nhood_labels_order_by>>;
            where?: Maybe<nhood_labels_bool_exp>;
        }) => Array<nhood_labels>;
        nhood_labels_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['nhood_labels_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<nhood_labels_order_by>>;
            where?: Maybe<nhood_labels_bool_exp>;
        }) => nhood_labels_aggregate;
        nhood_labels_by_pk: (args: {
            ogc_fid: ScalarsEnums['Int'];
        }) => Maybe<nhood_labels>;
        opening_hours: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['opening_hours_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<opening_hours_order_by>>;
            where?: Maybe<opening_hours_bool_exp>;
        }) => Array<opening_hours>;
        opening_hours_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['opening_hours_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<opening_hours_order_by>>;
            where?: Maybe<opening_hours_bool_exp>;
        }) => opening_hours_aggregate;
        opening_hours_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<opening_hours>;
        photo: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['photo_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<photo_order_by>>;
            where?: Maybe<photo_bool_exp>;
        }) => Array<photo>;
        photo_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['photo_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<photo_order_by>>;
            where?: Maybe<photo_bool_exp>;
        }) => photo_aggregate;
        photo_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<photo>;
        photo_xref: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['photo_xref_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<photo_xref_order_by>>;
            where?: Maybe<photo_xref_bool_exp>;
        }) => Array<photo_xref>;
        photo_xref_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['photo_xref_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<photo_xref_order_by>>;
            where?: Maybe<photo_xref_bool_exp>;
        }) => photo_xref_aggregate;
        photo_xref_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<photo_xref>;
        restaurant: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_order_by>>;
            where?: Maybe<restaurant_bool_exp>;
        }) => Array<restaurant>;
        restaurant_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_order_by>>;
            where?: Maybe<restaurant_bool_exp>;
        }) => restaurant_aggregate;
        restaurant_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<restaurant>;
        restaurant_new: (args: {
            args: restaurant_new_args;
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_order_by>>;
            where?: Maybe<restaurant_bool_exp>;
        }) => Array<restaurant>;
        restaurant_new_aggregate: (args: {
            args: restaurant_new_args;
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_order_by>>;
            where?: Maybe<restaurant_bool_exp>;
        }) => restaurant_aggregate;
        restaurant_tag: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_tag_order_by>>;
            where?: Maybe<restaurant_tag_bool_exp>;
        }) => Array<restaurant_tag>;
        restaurant_tag_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_tag_order_by>>;
            where?: Maybe<restaurant_tag_bool_exp>;
        }) => restaurant_tag_aggregate;
        restaurant_tag_by_pk: (args: {
            restaurant_id: ScalarsEnums['uuid'];
            tag_id: ScalarsEnums['uuid'];
        }) => Maybe<restaurant_tag>;
        restaurant_top_tags: (args: {
            args: restaurant_top_tags_args;
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_tag_order_by>>;
            where?: Maybe<restaurant_tag_bool_exp>;
        }) => Array<restaurant_tag>;
        restaurant_top_tags_aggregate: (args: {
            args: restaurant_top_tags_args;
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_tag_order_by>>;
            where?: Maybe<restaurant_tag_bool_exp>;
        }) => restaurant_tag_aggregate;
        restaurant_trending: (args: {
            args: restaurant_trending_args;
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_order_by>>;
            where?: Maybe<restaurant_bool_exp>;
        }) => Array<restaurant>;
        restaurant_trending_aggregate: (args: {
            args: restaurant_trending_args;
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_order_by>>;
            where?: Maybe<restaurant_bool_exp>;
        }) => restaurant_aggregate;
        restaurant_with_tags: (args: {
            args: restaurant_with_tags_args;
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_order_by>>;
            where?: Maybe<restaurant_bool_exp>;
        }) => Array<restaurant>;
        restaurant_with_tags_aggregate: (args: {
            args: restaurant_with_tags_args;
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_order_by>>;
            where?: Maybe<restaurant_bool_exp>;
        }) => restaurant_aggregate;
        review: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['review_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<review_order_by>>;
            where?: Maybe<review_bool_exp>;
        }) => Array<review>;
        review_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['review_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<review_order_by>>;
            where?: Maybe<review_bool_exp>;
        }) => review_aggregate;
        review_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<review>;
        review_tag_sentence: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['review_tag_sentence_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<review_tag_sentence_order_by>>;
            where?: Maybe<review_tag_sentence_bool_exp>;
        }) => Array<review_tag_sentence>;
        review_tag_sentence_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['review_tag_sentence_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<review_tag_sentence_order_by>>;
            where?: Maybe<review_tag_sentence_bool_exp>;
        }) => review_tag_sentence_aggregate;
        review_tag_sentence_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<review_tag_sentence>;
        setting: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['setting_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<setting_order_by>>;
            where?: Maybe<setting_bool_exp>;
        }) => Array<setting>;
        setting_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['setting_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<setting_order_by>>;
            where?: Maybe<setting_bool_exp>;
        }) => setting_aggregate;
        setting_by_pk: (args: {
            key: ScalarsEnums['String'];
        }) => Maybe<setting>;
        tag: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<tag_order_by>>;
            where?: Maybe<tag_bool_exp>;
        }) => Array<tag>;
        tag_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<tag_order_by>>;
            where?: Maybe<tag_bool_exp>;
        }) => tag_aggregate;
        tag_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<tag>;
        tag_tag: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['tag_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<tag_tag_order_by>>;
            where?: Maybe<tag_tag_bool_exp>;
        }) => Array<tag_tag>;
        tag_tag_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['tag_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<tag_tag_order_by>>;
            where?: Maybe<tag_tag_bool_exp>;
        }) => tag_tag_aggregate;
        tag_tag_by_pk: (args: {
            category_tag_id: ScalarsEnums['uuid'];
            tag_id: ScalarsEnums['uuid'];
        }) => Maybe<tag_tag>;
        user: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['user_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<user_order_by>>;
            where?: Maybe<user_bool_exp>;
        }) => Array<user>;
        user_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['user_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<user_order_by>>;
            where?: Maybe<user_bool_exp>;
        }) => user_aggregate;
        user_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<user>;
        zcta5: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['zcta5_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<zcta5_order_by>>;
            where?: Maybe<zcta5_bool_exp>;
        }) => Array<zcta5>;
        zcta5_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['zcta5_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<zcta5_order_by>>;
            where?: Maybe<zcta5_bool_exp>;
        }) => zcta5_aggregate;
        zcta5_by_pk: (args: {
            ogc_fid: ScalarsEnums['Int'];
        }) => Maybe<zcta5>;
    }
    export interface Mutation {
        __typename: 'Mutation' | null;
        delete_hrr: (args: {
            where: hrr_bool_exp;
        }) => Maybe<hrr_mutation_response>;
        delete_hrr_by_pk: (args: {
            ogc_fid: ScalarsEnums['Int'];
        }) => Maybe<hrr>;
        delete_list: (args: {
            where: list_bool_exp;
        }) => Maybe<list_mutation_response>;
        delete_list_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<list>;
        delete_list_restaurant: (args: {
            where: list_restaurant_bool_exp;
        }) => Maybe<list_restaurant_mutation_response>;
        delete_list_restaurant_by_pk: (args: {
            list_id: ScalarsEnums['uuid'];
            restaurant_id: ScalarsEnums['uuid'];
        }) => Maybe<list_restaurant>;
        delete_list_restaurant_tag: (args: {
            where: list_restaurant_tag_bool_exp;
        }) => Maybe<list_restaurant_tag_mutation_response>;
        delete_list_restaurant_tag_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<list_restaurant_tag>;
        delete_list_tag: (args: {
            where: list_tag_bool_exp;
        }) => Maybe<list_tag_mutation_response>;
        delete_list_tag_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<list_tag>;
        delete_menu_item: (args: {
            where: menu_item_bool_exp;
        }) => Maybe<menu_item_mutation_response>;
        delete_menu_item_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<menu_item>;
        delete_nhood_labels: (args: {
            where: nhood_labels_bool_exp;
        }) => Maybe<nhood_labels_mutation_response>;
        delete_nhood_labels_by_pk: (args: {
            ogc_fid: ScalarsEnums['Int'];
        }) => Maybe<nhood_labels>;
        delete_opening_hours: (args: {
            where: opening_hours_bool_exp;
        }) => Maybe<opening_hours_mutation_response>;
        delete_opening_hours_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<opening_hours>;
        delete_photo: (args: {
            where: photo_bool_exp;
        }) => Maybe<photo_mutation_response>;
        delete_photo_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<photo>;
        delete_photo_xref: (args: {
            where: photo_xref_bool_exp;
        }) => Maybe<photo_xref_mutation_response>;
        delete_photo_xref_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<photo_xref>;
        delete_restaurant: (args: {
            where: restaurant_bool_exp;
        }) => Maybe<restaurant_mutation_response>;
        delete_restaurant_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<restaurant>;
        delete_restaurant_tag: (args: {
            where: restaurant_tag_bool_exp;
        }) => Maybe<restaurant_tag_mutation_response>;
        delete_restaurant_tag_by_pk: (args: {
            restaurant_id: ScalarsEnums['uuid'];
            tag_id: ScalarsEnums['uuid'];
        }) => Maybe<restaurant_tag>;
        delete_review: (args: {
            where: review_bool_exp;
        }) => Maybe<review_mutation_response>;
        delete_review_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<review>;
        delete_review_tag_sentence: (args: {
            where: review_tag_sentence_bool_exp;
        }) => Maybe<review_tag_sentence_mutation_response>;
        delete_review_tag_sentence_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<review_tag_sentence>;
        delete_setting: (args: {
            where: setting_bool_exp;
        }) => Maybe<setting_mutation_response>;
        delete_setting_by_pk: (args: {
            key: ScalarsEnums['String'];
        }) => Maybe<setting>;
        delete_tag: (args: {
            where: tag_bool_exp;
        }) => Maybe<tag_mutation_response>;
        delete_tag_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<tag>;
        delete_tag_tag: (args: {
            where: tag_tag_bool_exp;
        }) => Maybe<tag_tag_mutation_response>;
        delete_tag_tag_by_pk: (args: {
            category_tag_id: ScalarsEnums['uuid'];
            tag_id: ScalarsEnums['uuid'];
        }) => Maybe<tag_tag>;
        delete_user: (args: {
            where: user_bool_exp;
        }) => Maybe<user_mutation_response>;
        delete_user_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<user>;
        delete_zcta5: (args: {
            where: zcta5_bool_exp;
        }) => Maybe<zcta5_mutation_response>;
        delete_zcta5_by_pk: (args: {
            ogc_fid: ScalarsEnums['Int'];
        }) => Maybe<zcta5>;
        insert_hrr: (args: {
            objects: Array<hrr_insert_input>;
            on_conflict?: Maybe<hrr_on_conflict>;
        }) => Maybe<hrr_mutation_response>;
        insert_hrr_one: (args: {
            object: hrr_insert_input;
            on_conflict?: Maybe<hrr_on_conflict>;
        }) => Maybe<hrr>;
        insert_list: (args: {
            objects: Array<list_insert_input>;
            on_conflict?: Maybe<list_on_conflict>;
        }) => Maybe<list_mutation_response>;
        insert_list_one: (args: {
            object: list_insert_input;
            on_conflict?: Maybe<list_on_conflict>;
        }) => Maybe<list>;
        insert_list_restaurant: (args: {
            objects: Array<list_restaurant_insert_input>;
            on_conflict?: Maybe<list_restaurant_on_conflict>;
        }) => Maybe<list_restaurant_mutation_response>;
        insert_list_restaurant_one: (args: {
            object: list_restaurant_insert_input;
            on_conflict?: Maybe<list_restaurant_on_conflict>;
        }) => Maybe<list_restaurant>;
        insert_list_restaurant_tag: (args: {
            objects: Array<list_restaurant_tag_insert_input>;
            on_conflict?: Maybe<list_restaurant_tag_on_conflict>;
        }) => Maybe<list_restaurant_tag_mutation_response>;
        insert_list_restaurant_tag_one: (args: {
            object: list_restaurant_tag_insert_input;
            on_conflict?: Maybe<list_restaurant_tag_on_conflict>;
        }) => Maybe<list_restaurant_tag>;
        insert_list_tag: (args: {
            objects: Array<list_tag_insert_input>;
            on_conflict?: Maybe<list_tag_on_conflict>;
        }) => Maybe<list_tag_mutation_response>;
        insert_list_tag_one: (args: {
            object: list_tag_insert_input;
            on_conflict?: Maybe<list_tag_on_conflict>;
        }) => Maybe<list_tag>;
        insert_menu_item: (args: {
            objects: Array<menu_item_insert_input>;
            on_conflict?: Maybe<menu_item_on_conflict>;
        }) => Maybe<menu_item_mutation_response>;
        insert_menu_item_one: (args: {
            object: menu_item_insert_input;
            on_conflict?: Maybe<menu_item_on_conflict>;
        }) => Maybe<menu_item>;
        insert_nhood_labels: (args: {
            objects: Array<nhood_labels_insert_input>;
            on_conflict?: Maybe<nhood_labels_on_conflict>;
        }) => Maybe<nhood_labels_mutation_response>;
        insert_nhood_labels_one: (args: {
            object: nhood_labels_insert_input;
            on_conflict?: Maybe<nhood_labels_on_conflict>;
        }) => Maybe<nhood_labels>;
        insert_opening_hours: (args: {
            objects: Array<opening_hours_insert_input>;
            on_conflict?: Maybe<opening_hours_on_conflict>;
        }) => Maybe<opening_hours_mutation_response>;
        insert_opening_hours_one: (args: {
            object: opening_hours_insert_input;
            on_conflict?: Maybe<opening_hours_on_conflict>;
        }) => Maybe<opening_hours>;
        insert_photo: (args: {
            objects: Array<photo_insert_input>;
            on_conflict?: Maybe<photo_on_conflict>;
        }) => Maybe<photo_mutation_response>;
        insert_photo_one: (args: {
            object: photo_insert_input;
            on_conflict?: Maybe<photo_on_conflict>;
        }) => Maybe<photo>;
        insert_photo_xref: (args: {
            objects: Array<photo_xref_insert_input>;
            on_conflict?: Maybe<photo_xref_on_conflict>;
        }) => Maybe<photo_xref_mutation_response>;
        insert_photo_xref_one: (args: {
            object: photo_xref_insert_input;
            on_conflict?: Maybe<photo_xref_on_conflict>;
        }) => Maybe<photo_xref>;
        insert_restaurant: (args: {
            objects: Array<restaurant_insert_input>;
            on_conflict?: Maybe<restaurant_on_conflict>;
        }) => Maybe<restaurant_mutation_response>;
        insert_restaurant_one: (args: {
            object: restaurant_insert_input;
            on_conflict?: Maybe<restaurant_on_conflict>;
        }) => Maybe<restaurant>;
        insert_restaurant_tag: (args: {
            objects: Array<restaurant_tag_insert_input>;
            on_conflict?: Maybe<restaurant_tag_on_conflict>;
        }) => Maybe<restaurant_tag_mutation_response>;
        insert_restaurant_tag_one: (args: {
            object: restaurant_tag_insert_input;
            on_conflict?: Maybe<restaurant_tag_on_conflict>;
        }) => Maybe<restaurant_tag>;
        insert_review: (args: {
            objects: Array<review_insert_input>;
            on_conflict?: Maybe<review_on_conflict>;
        }) => Maybe<review_mutation_response>;
        insert_review_one: (args: {
            object: review_insert_input;
            on_conflict?: Maybe<review_on_conflict>;
        }) => Maybe<review>;
        insert_review_tag_sentence: (args: {
            objects: Array<review_tag_sentence_insert_input>;
            on_conflict?: Maybe<review_tag_sentence_on_conflict>;
        }) => Maybe<review_tag_sentence_mutation_response>;
        insert_review_tag_sentence_one: (args: {
            object: review_tag_sentence_insert_input;
            on_conflict?: Maybe<review_tag_sentence_on_conflict>;
        }) => Maybe<review_tag_sentence>;
        insert_setting: (args: {
            objects: Array<setting_insert_input>;
            on_conflict?: Maybe<setting_on_conflict>;
        }) => Maybe<setting_mutation_response>;
        insert_setting_one: (args: {
            object: setting_insert_input;
            on_conflict?: Maybe<setting_on_conflict>;
        }) => Maybe<setting>;
        insert_tag: (args: {
            objects: Array<tag_insert_input>;
            on_conflict?: Maybe<tag_on_conflict>;
        }) => Maybe<tag_mutation_response>;
        insert_tag_one: (args: {
            object: tag_insert_input;
            on_conflict?: Maybe<tag_on_conflict>;
        }) => Maybe<tag>;
        insert_tag_tag: (args: {
            objects: Array<tag_tag_insert_input>;
            on_conflict?: Maybe<tag_tag_on_conflict>;
        }) => Maybe<tag_tag_mutation_response>;
        insert_tag_tag_one: (args: {
            object: tag_tag_insert_input;
            on_conflict?: Maybe<tag_tag_on_conflict>;
        }) => Maybe<tag_tag>;
        insert_user: (args: {
            objects: Array<user_insert_input>;
            on_conflict?: Maybe<user_on_conflict>;
        }) => Maybe<user_mutation_response>;
        insert_user_one: (args: {
            object: user_insert_input;
            on_conflict?: Maybe<user_on_conflict>;
        }) => Maybe<user>;
        insert_zcta5: (args: {
            objects: Array<zcta5_insert_input>;
            on_conflict?: Maybe<zcta5_on_conflict>;
        }) => Maybe<zcta5_mutation_response>;
        insert_zcta5_one: (args: {
            object: zcta5_insert_input;
            on_conflict?: Maybe<zcta5_on_conflict>;
        }) => Maybe<zcta5>;
        update_hrr: (args: {
            _inc?: Maybe<hrr_inc_input>;
            _set?: Maybe<hrr_set_input>;
            where: hrr_bool_exp;
        }) => Maybe<hrr_mutation_response>;
        update_hrr_by_pk: (args: {
            _inc?: Maybe<hrr_inc_input>;
            _set?: Maybe<hrr_set_input>;
            pk_columns: hrr_pk_columns_input;
        }) => Maybe<hrr>;
        update_list: (args: {
            _inc?: Maybe<list_inc_input>;
            _set?: Maybe<list_set_input>;
            where: list_bool_exp;
        }) => Maybe<list_mutation_response>;
        update_list_by_pk: (args: {
            _inc?: Maybe<list_inc_input>;
            _set?: Maybe<list_set_input>;
            pk_columns: list_pk_columns_input;
        }) => Maybe<list>;
        update_list_restaurant: (args: {
            _inc?: Maybe<list_restaurant_inc_input>;
            _set?: Maybe<list_restaurant_set_input>;
            where: list_restaurant_bool_exp;
        }) => Maybe<list_restaurant_mutation_response>;
        update_list_restaurant_by_pk: (args: {
            _inc?: Maybe<list_restaurant_inc_input>;
            _set?: Maybe<list_restaurant_set_input>;
            pk_columns: list_restaurant_pk_columns_input;
        }) => Maybe<list_restaurant>;
        update_list_restaurant_tag: (args: {
            _inc?: Maybe<list_restaurant_tag_inc_input>;
            _set?: Maybe<list_restaurant_tag_set_input>;
            where: list_restaurant_tag_bool_exp;
        }) => Maybe<list_restaurant_tag_mutation_response>;
        update_list_restaurant_tag_by_pk: (args: {
            _inc?: Maybe<list_restaurant_tag_inc_input>;
            _set?: Maybe<list_restaurant_tag_set_input>;
            pk_columns: list_restaurant_tag_pk_columns_input;
        }) => Maybe<list_restaurant_tag>;
        update_list_tag: (args: {
            _set?: Maybe<list_tag_set_input>;
            where: list_tag_bool_exp;
        }) => Maybe<list_tag_mutation_response>;
        update_list_tag_by_pk: (args: {
            _set?: Maybe<list_tag_set_input>;
            pk_columns: list_tag_pk_columns_input;
        }) => Maybe<list_tag>;
        update_menu_item: (args: {
            _inc?: Maybe<menu_item_inc_input>;
            _set?: Maybe<menu_item_set_input>;
            where: menu_item_bool_exp;
        }) => Maybe<menu_item_mutation_response>;
        update_menu_item_by_pk: (args: {
            _inc?: Maybe<menu_item_inc_input>;
            _set?: Maybe<menu_item_set_input>;
            pk_columns: menu_item_pk_columns_input;
        }) => Maybe<menu_item>;
        update_nhood_labels: (args: {
            _inc?: Maybe<nhood_labels_inc_input>;
            _set?: Maybe<nhood_labels_set_input>;
            where: nhood_labels_bool_exp;
        }) => Maybe<nhood_labels_mutation_response>;
        update_nhood_labels_by_pk: (args: {
            _inc?: Maybe<nhood_labels_inc_input>;
            _set?: Maybe<nhood_labels_set_input>;
            pk_columns: nhood_labels_pk_columns_input;
        }) => Maybe<nhood_labels>;
        update_opening_hours: (args: {
            _set?: Maybe<opening_hours_set_input>;
            where: opening_hours_bool_exp;
        }) => Maybe<opening_hours_mutation_response>;
        update_opening_hours_by_pk: (args: {
            _set?: Maybe<opening_hours_set_input>;
            pk_columns: opening_hours_pk_columns_input;
        }) => Maybe<opening_hours>;
        update_photo: (args: {
            _inc?: Maybe<photo_inc_input>;
            _set?: Maybe<photo_set_input>;
            where: photo_bool_exp;
        }) => Maybe<photo_mutation_response>;
        update_photo_by_pk: (args: {
            _inc?: Maybe<photo_inc_input>;
            _set?: Maybe<photo_set_input>;
            pk_columns: photo_pk_columns_input;
        }) => Maybe<photo>;
        update_photo_xref: (args: {
            _set?: Maybe<photo_xref_set_input>;
            where: photo_xref_bool_exp;
        }) => Maybe<photo_xref_mutation_response>;
        update_photo_xref_by_pk: (args: {
            _set?: Maybe<photo_xref_set_input>;
            pk_columns: photo_xref_pk_columns_input;
        }) => Maybe<photo_xref>;
        update_restaurant: (args: {
            _append?: Maybe<restaurant_append_input>;
            _delete_at_path?: Maybe<restaurant_delete_at_path_input>;
            _delete_elem?: Maybe<restaurant_delete_elem_input>;
            _delete_key?: Maybe<restaurant_delete_key_input>;
            _inc?: Maybe<restaurant_inc_input>;
            _prepend?: Maybe<restaurant_prepend_input>;
            _set?: Maybe<restaurant_set_input>;
            where: restaurant_bool_exp;
        }) => Maybe<restaurant_mutation_response>;
        update_restaurant_by_pk: (args: {
            _append?: Maybe<restaurant_append_input>;
            _delete_at_path?: Maybe<restaurant_delete_at_path_input>;
            _delete_elem?: Maybe<restaurant_delete_elem_input>;
            _delete_key?: Maybe<restaurant_delete_key_input>;
            _inc?: Maybe<restaurant_inc_input>;
            _prepend?: Maybe<restaurant_prepend_input>;
            _set?: Maybe<restaurant_set_input>;
            pk_columns: restaurant_pk_columns_input;
        }) => Maybe<restaurant>;
        update_restaurant_tag: (args: {
            _append?: Maybe<restaurant_tag_append_input>;
            _delete_at_path?: Maybe<restaurant_tag_delete_at_path_input>;
            _delete_elem?: Maybe<restaurant_tag_delete_elem_input>;
            _delete_key?: Maybe<restaurant_tag_delete_key_input>;
            _inc?: Maybe<restaurant_tag_inc_input>;
            _prepend?: Maybe<restaurant_tag_prepend_input>;
            _set?: Maybe<restaurant_tag_set_input>;
            where: restaurant_tag_bool_exp;
        }) => Maybe<restaurant_tag_mutation_response>;
        update_restaurant_tag_by_pk: (args: {
            _append?: Maybe<restaurant_tag_append_input>;
            _delete_at_path?: Maybe<restaurant_tag_delete_at_path_input>;
            _delete_elem?: Maybe<restaurant_tag_delete_elem_input>;
            _delete_key?: Maybe<restaurant_tag_delete_key_input>;
            _inc?: Maybe<restaurant_tag_inc_input>;
            _prepend?: Maybe<restaurant_tag_prepend_input>;
            _set?: Maybe<restaurant_tag_set_input>;
            pk_columns: restaurant_tag_pk_columns_input;
        }) => Maybe<restaurant_tag>;
        update_review: (args: {
            _append?: Maybe<review_append_input>;
            _delete_at_path?: Maybe<review_delete_at_path_input>;
            _delete_elem?: Maybe<review_delete_elem_input>;
            _delete_key?: Maybe<review_delete_key_input>;
            _inc?: Maybe<review_inc_input>;
            _prepend?: Maybe<review_prepend_input>;
            _set?: Maybe<review_set_input>;
            where: review_bool_exp;
        }) => Maybe<review_mutation_response>;
        update_review_by_pk: (args: {
            _append?: Maybe<review_append_input>;
            _delete_at_path?: Maybe<review_delete_at_path_input>;
            _delete_elem?: Maybe<review_delete_elem_input>;
            _delete_key?: Maybe<review_delete_key_input>;
            _inc?: Maybe<review_inc_input>;
            _prepend?: Maybe<review_prepend_input>;
            _set?: Maybe<review_set_input>;
            pk_columns: review_pk_columns_input;
        }) => Maybe<review>;
        update_review_tag_sentence: (args: {
            _inc?: Maybe<review_tag_sentence_inc_input>;
            _set?: Maybe<review_tag_sentence_set_input>;
            where: review_tag_sentence_bool_exp;
        }) => Maybe<review_tag_sentence_mutation_response>;
        update_review_tag_sentence_by_pk: (args: {
            _inc?: Maybe<review_tag_sentence_inc_input>;
            _set?: Maybe<review_tag_sentence_set_input>;
            pk_columns: review_tag_sentence_pk_columns_input;
        }) => Maybe<review_tag_sentence>;
        update_setting: (args: {
            _append?: Maybe<setting_append_input>;
            _delete_at_path?: Maybe<setting_delete_at_path_input>;
            _delete_elem?: Maybe<setting_delete_elem_input>;
            _delete_key?: Maybe<setting_delete_key_input>;
            _prepend?: Maybe<setting_prepend_input>;
            _set?: Maybe<setting_set_input>;
            where: setting_bool_exp;
        }) => Maybe<setting_mutation_response>;
        update_setting_by_pk: (args: {
            _append?: Maybe<setting_append_input>;
            _delete_at_path?: Maybe<setting_delete_at_path_input>;
            _delete_elem?: Maybe<setting_delete_elem_input>;
            _delete_key?: Maybe<setting_delete_key_input>;
            _prepend?: Maybe<setting_prepend_input>;
            _set?: Maybe<setting_set_input>;
            pk_columns: setting_pk_columns_input;
        }) => Maybe<setting>;
        update_tag: (args: {
            _append?: Maybe<tag_append_input>;
            _delete_at_path?: Maybe<tag_delete_at_path_input>;
            _delete_elem?: Maybe<tag_delete_elem_input>;
            _delete_key?: Maybe<tag_delete_key_input>;
            _inc?: Maybe<tag_inc_input>;
            _prepend?: Maybe<tag_prepend_input>;
            _set?: Maybe<tag_set_input>;
            where: tag_bool_exp;
        }) => Maybe<tag_mutation_response>;
        update_tag_by_pk: (args: {
            _append?: Maybe<tag_append_input>;
            _delete_at_path?: Maybe<tag_delete_at_path_input>;
            _delete_elem?: Maybe<tag_delete_elem_input>;
            _delete_key?: Maybe<tag_delete_key_input>;
            _inc?: Maybe<tag_inc_input>;
            _prepend?: Maybe<tag_prepend_input>;
            _set?: Maybe<tag_set_input>;
            pk_columns: tag_pk_columns_input;
        }) => Maybe<tag>;
        update_tag_tag: (args: {
            _set?: Maybe<tag_tag_set_input>;
            where: tag_tag_bool_exp;
        }) => Maybe<tag_tag_mutation_response>;
        update_tag_tag_by_pk: (args: {
            _set?: Maybe<tag_tag_set_input>;
            pk_columns: tag_tag_pk_columns_input;
        }) => Maybe<tag_tag>;
        update_user: (args: {
            _inc?: Maybe<user_inc_input>;
            _set?: Maybe<user_set_input>;
            where: user_bool_exp;
        }) => Maybe<user_mutation_response>;
        update_user_by_pk: (args: {
            _inc?: Maybe<user_inc_input>;
            _set?: Maybe<user_set_input>;
            pk_columns: user_pk_columns_input;
        }) => Maybe<user>;
        update_zcta5: (args: {
            _inc?: Maybe<zcta5_inc_input>;
            _set?: Maybe<zcta5_set_input>;
            where: zcta5_bool_exp;
        }) => Maybe<zcta5_mutation_response>;
        update_zcta5_by_pk: (args: {
            _inc?: Maybe<zcta5_inc_input>;
            _set?: Maybe<zcta5_set_input>;
            pk_columns: zcta5_pk_columns_input;
        }) => Maybe<zcta5>;
    }
    export interface Subscription {
        __typename: 'Subscription' | null;
        hrr: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['hrr_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<hrr_order_by>>;
            where?: Maybe<hrr_bool_exp>;
        }) => Array<hrr>;
        hrr_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['hrr_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<hrr_order_by>>;
            where?: Maybe<hrr_bool_exp>;
        }) => hrr_aggregate;
        hrr_by_pk: (args: {
            ogc_fid: ScalarsEnums['Int'];
        }) => Maybe<hrr>;
        list: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_order_by>>;
            where?: Maybe<list_bool_exp>;
        }) => Array<list>;
        list_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_order_by>>;
            where?: Maybe<list_bool_exp>;
        }) => list_aggregate;
        list_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<list>;
        list_populated: (args: {
            args: list_populated_args;
            distinct_on?: Maybe<Array<ScalarsEnums['list_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_order_by>>;
            where?: Maybe<list_bool_exp>;
        }) => Array<list>;
        list_populated_aggregate: (args: {
            args: list_populated_args;
            distinct_on?: Maybe<Array<ScalarsEnums['list_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_order_by>>;
            where?: Maybe<list_bool_exp>;
        }) => list_aggregate;
        list_restaurant: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_restaurant_order_by>>;
            where?: Maybe<list_restaurant_bool_exp>;
        }) => Array<list_restaurant>;
        list_restaurant_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_restaurant_order_by>>;
            where?: Maybe<list_restaurant_bool_exp>;
        }) => list_restaurant_aggregate;
        list_restaurant_by_pk: (args: {
            list_id: ScalarsEnums['uuid'];
            restaurant_id: ScalarsEnums['uuid'];
        }) => Maybe<list_restaurant>;
        list_restaurant_tag: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_restaurant_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_restaurant_tag_order_by>>;
            where?: Maybe<list_restaurant_tag_bool_exp>;
        }) => Array<list_restaurant_tag>;
        list_restaurant_tag_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_restaurant_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_restaurant_tag_order_by>>;
            where?: Maybe<list_restaurant_tag_bool_exp>;
        }) => list_restaurant_tag_aggregate;
        list_restaurant_tag_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<list_restaurant_tag>;
        list_tag: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_tag_order_by>>;
            where?: Maybe<list_tag_bool_exp>;
        }) => Array<list_tag>;
        list_tag_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_tag_order_by>>;
            where?: Maybe<list_tag_bool_exp>;
        }) => list_tag_aggregate;
        list_tag_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<list_tag>;
        menu_item: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['menu_item_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<menu_item_order_by>>;
            where?: Maybe<menu_item_bool_exp>;
        }) => Array<menu_item>;
        menu_item_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['menu_item_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<menu_item_order_by>>;
            where?: Maybe<menu_item_bool_exp>;
        }) => menu_item_aggregate;
        menu_item_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<menu_item>;
        nhood_labels: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['nhood_labels_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<nhood_labels_order_by>>;
            where?: Maybe<nhood_labels_bool_exp>;
        }) => Array<nhood_labels>;
        nhood_labels_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['nhood_labels_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<nhood_labels_order_by>>;
            where?: Maybe<nhood_labels_bool_exp>;
        }) => nhood_labels_aggregate;
        nhood_labels_by_pk: (args: {
            ogc_fid: ScalarsEnums['Int'];
        }) => Maybe<nhood_labels>;
        opening_hours: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['opening_hours_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<opening_hours_order_by>>;
            where?: Maybe<opening_hours_bool_exp>;
        }) => Array<opening_hours>;
        opening_hours_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['opening_hours_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<opening_hours_order_by>>;
            where?: Maybe<opening_hours_bool_exp>;
        }) => opening_hours_aggregate;
        opening_hours_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<opening_hours>;
        photo: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['photo_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<photo_order_by>>;
            where?: Maybe<photo_bool_exp>;
        }) => Array<photo>;
        photo_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['photo_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<photo_order_by>>;
            where?: Maybe<photo_bool_exp>;
        }) => photo_aggregate;
        photo_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<photo>;
        photo_xref: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['photo_xref_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<photo_xref_order_by>>;
            where?: Maybe<photo_xref_bool_exp>;
        }) => Array<photo_xref>;
        photo_xref_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['photo_xref_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<photo_xref_order_by>>;
            where?: Maybe<photo_xref_bool_exp>;
        }) => photo_xref_aggregate;
        photo_xref_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<photo_xref>;
        restaurant: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_order_by>>;
            where?: Maybe<restaurant_bool_exp>;
        }) => Array<restaurant>;
        restaurant_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_order_by>>;
            where?: Maybe<restaurant_bool_exp>;
        }) => restaurant_aggregate;
        restaurant_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<restaurant>;
        restaurant_new: (args: {
            args: restaurant_new_args;
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_order_by>>;
            where?: Maybe<restaurant_bool_exp>;
        }) => Array<restaurant>;
        restaurant_new_aggregate: (args: {
            args: restaurant_new_args;
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_order_by>>;
            where?: Maybe<restaurant_bool_exp>;
        }) => restaurant_aggregate;
        restaurant_tag: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_tag_order_by>>;
            where?: Maybe<restaurant_tag_bool_exp>;
        }) => Array<restaurant_tag>;
        restaurant_tag_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_tag_order_by>>;
            where?: Maybe<restaurant_tag_bool_exp>;
        }) => restaurant_tag_aggregate;
        restaurant_tag_by_pk: (args: {
            restaurant_id: ScalarsEnums['uuid'];
            tag_id: ScalarsEnums['uuid'];
        }) => Maybe<restaurant_tag>;
        restaurant_top_tags: (args: {
            args: restaurant_top_tags_args;
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_tag_order_by>>;
            where?: Maybe<restaurant_tag_bool_exp>;
        }) => Array<restaurant_tag>;
        restaurant_top_tags_aggregate: (args: {
            args: restaurant_top_tags_args;
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_tag_order_by>>;
            where?: Maybe<restaurant_tag_bool_exp>;
        }) => restaurant_tag_aggregate;
        restaurant_trending: (args: {
            args: restaurant_trending_args;
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_order_by>>;
            where?: Maybe<restaurant_bool_exp>;
        }) => Array<restaurant>;
        restaurant_trending_aggregate: (args: {
            args: restaurant_trending_args;
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_order_by>>;
            where?: Maybe<restaurant_bool_exp>;
        }) => restaurant_aggregate;
        restaurant_with_tags: (args: {
            args: restaurant_with_tags_args;
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_order_by>>;
            where?: Maybe<restaurant_bool_exp>;
        }) => Array<restaurant>;
        restaurant_with_tags_aggregate: (args: {
            args: restaurant_with_tags_args;
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_order_by>>;
            where?: Maybe<restaurant_bool_exp>;
        }) => restaurant_aggregate;
        review: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['review_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<review_order_by>>;
            where?: Maybe<review_bool_exp>;
        }) => Array<review>;
        review_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['review_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<review_order_by>>;
            where?: Maybe<review_bool_exp>;
        }) => review_aggregate;
        review_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<review>;
        review_tag_sentence: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['review_tag_sentence_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<review_tag_sentence_order_by>>;
            where?: Maybe<review_tag_sentence_bool_exp>;
        }) => Array<review_tag_sentence>;
        review_tag_sentence_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['review_tag_sentence_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<review_tag_sentence_order_by>>;
            where?: Maybe<review_tag_sentence_bool_exp>;
        }) => review_tag_sentence_aggregate;
        review_tag_sentence_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<review_tag_sentence>;
        setting: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['setting_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<setting_order_by>>;
            where?: Maybe<setting_bool_exp>;
        }) => Array<setting>;
        setting_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['setting_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<setting_order_by>>;
            where?: Maybe<setting_bool_exp>;
        }) => setting_aggregate;
        setting_by_pk: (args: {
            key: ScalarsEnums['String'];
        }) => Maybe<setting>;
        tag: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<tag_order_by>>;
            where?: Maybe<tag_bool_exp>;
        }) => Array<tag>;
        tag_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<tag_order_by>>;
            where?: Maybe<tag_bool_exp>;
        }) => tag_aggregate;
        tag_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<tag>;
        tag_tag: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['tag_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<tag_tag_order_by>>;
            where?: Maybe<tag_tag_bool_exp>;
        }) => Array<tag_tag>;
        tag_tag_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['tag_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<tag_tag_order_by>>;
            where?: Maybe<tag_tag_bool_exp>;
        }) => tag_tag_aggregate;
        tag_tag_by_pk: (args: {
            category_tag_id: ScalarsEnums['uuid'];
            tag_id: ScalarsEnums['uuid'];
        }) => Maybe<tag_tag>;
        user: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['user_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<user_order_by>>;
            where?: Maybe<user_bool_exp>;
        }) => Array<user>;
        user_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['user_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<user_order_by>>;
            where?: Maybe<user_bool_exp>;
        }) => user_aggregate;
        user_by_pk: (args: {
            id: ScalarsEnums['uuid'];
        }) => Maybe<user>;
        zcta5: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['zcta5_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<zcta5_order_by>>;
            where?: Maybe<zcta5_bool_exp>;
        }) => Array<zcta5>;
        zcta5_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['zcta5_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<zcta5_order_by>>;
            where?: Maybe<zcta5_bool_exp>;
        }) => zcta5_aggregate;
        zcta5_by_pk: (args: {
            ogc_fid: ScalarsEnums['Int'];
        }) => Maybe<zcta5>;
    }
    export interface hrr {
        __typename: 'hrr' | null;
        color?: Maybe<ScalarsEnums['String']>;
        hrrcity?: Maybe<ScalarsEnums['String']>;
        ogc_fid: ScalarsEnums['Int'];
        slug?: Maybe<ScalarsEnums['String']>;
        wkb_geometry?: Maybe<ScalarsEnums['geometry']>;
    }
    export interface hrr_aggregate {
        __typename: 'hrr_aggregate' | null;
        aggregate?: Maybe<hrr_aggregate_fields>;
        nodes: Array<hrr>;
    }
    export interface hrr_aggregate_fields {
        __typename: 'hrr_aggregate_fields' | null;
        avg?: Maybe<hrr_avg_fields>;
        count: (args?: {
            columns?: Maybe<Array<ScalarsEnums['hrr_select_column']>>;
            distinct?: Maybe<ScalarsEnums['Boolean']>;
        }) => Maybe<ScalarsEnums['Int']>;
        max?: Maybe<hrr_max_fields>;
        min?: Maybe<hrr_min_fields>;
        stddev?: Maybe<hrr_stddev_fields>;
        stddev_pop?: Maybe<hrr_stddev_pop_fields>;
        stddev_samp?: Maybe<hrr_stddev_samp_fields>;
        sum?: Maybe<hrr_sum_fields>;
        var_pop?: Maybe<hrr_var_pop_fields>;
        var_samp?: Maybe<hrr_var_samp_fields>;
        variance?: Maybe<hrr_variance_fields>;
    }
    export interface hrr_avg_fields {
        __typename: 'hrr_avg_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface hrr_max_fields {
        __typename: 'hrr_max_fields' | null;
        color?: Maybe<ScalarsEnums['String']>;
        hrrcity?: Maybe<ScalarsEnums['String']>;
        ogc_fid?: Maybe<ScalarsEnums['Int']>;
        slug?: Maybe<ScalarsEnums['String']>;
    }
    export interface hrr_min_fields {
        __typename: 'hrr_min_fields' | null;
        color?: Maybe<ScalarsEnums['String']>;
        hrrcity?: Maybe<ScalarsEnums['String']>;
        ogc_fid?: Maybe<ScalarsEnums['Int']>;
        slug?: Maybe<ScalarsEnums['String']>;
    }
    export interface hrr_mutation_response {
        __typename: 'hrr_mutation_response' | null;
        affected_rows: ScalarsEnums['Int'];
        returning: Array<hrr>;
    }
    export interface hrr_stddev_fields {
        __typename: 'hrr_stddev_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface hrr_stddev_pop_fields {
        __typename: 'hrr_stddev_pop_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface hrr_stddev_samp_fields {
        __typename: 'hrr_stddev_samp_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface hrr_sum_fields {
        __typename: 'hrr_sum_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Int']>;
    }
    export interface hrr_var_pop_fields {
        __typename: 'hrr_var_pop_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface hrr_var_samp_fields {
        __typename: 'hrr_var_samp_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface hrr_variance_fields {
        __typename: 'hrr_variance_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list {
        __typename: 'list' | null;
        color?: Maybe<ScalarsEnums['Int']>;
        created_at: ScalarsEnums['timestamptz'];
        description?: Maybe<ScalarsEnums['String']>;
        id: ScalarsEnums['uuid'];
        location?: Maybe<ScalarsEnums['geometry']>;
        name: ScalarsEnums['String'];
        public: ScalarsEnums['Boolean'];
        region?: Maybe<ScalarsEnums['String']>;
        restaurants: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_restaurant_order_by>>;
            where?: Maybe<list_restaurant_bool_exp>;
        }) => Array<list_restaurant>;
        restaurants_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_restaurant_order_by>>;
            where?: Maybe<list_restaurant_bool_exp>;
        }) => list_restaurant_aggregate;
        slug: ScalarsEnums['String'];
        tags: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_tag_order_by>>;
            where?: Maybe<list_tag_bool_exp>;
        }) => Array<list_tag>;
        tags_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_tag_order_by>>;
            where?: Maybe<list_tag_bool_exp>;
        }) => list_tag_aggregate;
        updated_at: ScalarsEnums['timestamptz'];
        user?: Maybe<user>;
        user_id: ScalarsEnums['uuid'];
    }
    export interface list_aggregate {
        __typename: 'list_aggregate' | null;
        aggregate?: Maybe<list_aggregate_fields>;
        nodes: Array<list>;
    }
    export interface list_aggregate_fields {
        __typename: 'list_aggregate_fields' | null;
        avg?: Maybe<list_avg_fields>;
        count: (args?: {
            columns?: Maybe<Array<ScalarsEnums['list_select_column']>>;
            distinct?: Maybe<ScalarsEnums['Boolean']>;
        }) => Maybe<ScalarsEnums['Int']>;
        max?: Maybe<list_max_fields>;
        min?: Maybe<list_min_fields>;
        stddev?: Maybe<list_stddev_fields>;
        stddev_pop?: Maybe<list_stddev_pop_fields>;
        stddev_samp?: Maybe<list_stddev_samp_fields>;
        sum?: Maybe<list_sum_fields>;
        var_pop?: Maybe<list_var_pop_fields>;
        var_samp?: Maybe<list_var_samp_fields>;
        variance?: Maybe<list_variance_fields>;
    }
    export interface list_avg_fields {
        __typename: 'list_avg_fields' | null;
        color?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list_max_fields {
        __typename: 'list_max_fields' | null;
        color?: Maybe<ScalarsEnums['Int']>;
        created_at?: Maybe<ScalarsEnums['timestamptz']>;
        description?: Maybe<ScalarsEnums['String']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        name?: Maybe<ScalarsEnums['String']>;
        region?: Maybe<ScalarsEnums['String']>;
        slug?: Maybe<ScalarsEnums['String']>;
        updated_at?: Maybe<ScalarsEnums['timestamptz']>;
        user_id?: Maybe<ScalarsEnums['uuid']>;
    }
    export interface list_min_fields {
        __typename: 'list_min_fields' | null;
        color?: Maybe<ScalarsEnums['Int']>;
        created_at?: Maybe<ScalarsEnums['timestamptz']>;
        description?: Maybe<ScalarsEnums['String']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        name?: Maybe<ScalarsEnums['String']>;
        region?: Maybe<ScalarsEnums['String']>;
        slug?: Maybe<ScalarsEnums['String']>;
        updated_at?: Maybe<ScalarsEnums['timestamptz']>;
        user_id?: Maybe<ScalarsEnums['uuid']>;
    }
    export interface list_mutation_response {
        __typename: 'list_mutation_response' | null;
        affected_rows: ScalarsEnums['Int'];
        returning: Array<list>;
    }
    export interface list_restaurant {
        __typename: 'list_restaurant' | null;
        comment?: Maybe<ScalarsEnums['String']>;
        id: ScalarsEnums['uuid'];
        list: list;
        list_id: ScalarsEnums['uuid'];
        position?: Maybe<ScalarsEnums['Int']>;
        restaurant: restaurant;
        restaurant_id: ScalarsEnums['uuid'];
        restaurants: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_order_by>>;
            where?: Maybe<restaurant_bool_exp>;
        }) => Array<restaurant>;
        restaurants_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_order_by>>;
            where?: Maybe<restaurant_bool_exp>;
        }) => restaurant_aggregate;
        tags: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_restaurant_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_restaurant_tag_order_by>>;
            where?: Maybe<list_restaurant_tag_bool_exp>;
        }) => Array<list_restaurant_tag>;
        tags_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_restaurant_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_restaurant_tag_order_by>>;
            where?: Maybe<list_restaurant_tag_bool_exp>;
        }) => list_restaurant_tag_aggregate;
        user_id: ScalarsEnums['uuid'];
    }
    export interface list_restaurant_aggregate {
        __typename: 'list_restaurant_aggregate' | null;
        aggregate?: Maybe<list_restaurant_aggregate_fields>;
        nodes: Array<list_restaurant>;
    }
    export interface list_restaurant_aggregate_fields {
        __typename: 'list_restaurant_aggregate_fields' | null;
        avg?: Maybe<list_restaurant_avg_fields>;
        count: (args?: {
            columns?: Maybe<Array<ScalarsEnums['list_restaurant_select_column']>>;
            distinct?: Maybe<ScalarsEnums['Boolean']>;
        }) => Maybe<ScalarsEnums['Int']>;
        max?: Maybe<list_restaurant_max_fields>;
        min?: Maybe<list_restaurant_min_fields>;
        stddev?: Maybe<list_restaurant_stddev_fields>;
        stddev_pop?: Maybe<list_restaurant_stddev_pop_fields>;
        stddev_samp?: Maybe<list_restaurant_stddev_samp_fields>;
        sum?: Maybe<list_restaurant_sum_fields>;
        var_pop?: Maybe<list_restaurant_var_pop_fields>;
        var_samp?: Maybe<list_restaurant_var_samp_fields>;
        variance?: Maybe<list_restaurant_variance_fields>;
    }
    export interface list_restaurant_avg_fields {
        __typename: 'list_restaurant_avg_fields' | null;
        position?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list_restaurant_max_fields {
        __typename: 'list_restaurant_max_fields' | null;
        comment?: Maybe<ScalarsEnums['String']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        list_id?: Maybe<ScalarsEnums['uuid']>;
        position?: Maybe<ScalarsEnums['Int']>;
        restaurant_id?: Maybe<ScalarsEnums['uuid']>;
        user_id?: Maybe<ScalarsEnums['uuid']>;
    }
    export interface list_restaurant_min_fields {
        __typename: 'list_restaurant_min_fields' | null;
        comment?: Maybe<ScalarsEnums['String']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        list_id?: Maybe<ScalarsEnums['uuid']>;
        position?: Maybe<ScalarsEnums['Int']>;
        restaurant_id?: Maybe<ScalarsEnums['uuid']>;
        user_id?: Maybe<ScalarsEnums['uuid']>;
    }
    export interface list_restaurant_mutation_response {
        __typename: 'list_restaurant_mutation_response' | null;
        affected_rows: ScalarsEnums['Int'];
        returning: Array<list_restaurant>;
    }
    export interface list_restaurant_stddev_fields {
        __typename: 'list_restaurant_stddev_fields' | null;
        position?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list_restaurant_stddev_pop_fields {
        __typename: 'list_restaurant_stddev_pop_fields' | null;
        position?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list_restaurant_stddev_samp_fields {
        __typename: 'list_restaurant_stddev_samp_fields' | null;
        position?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list_restaurant_sum_fields {
        __typename: 'list_restaurant_sum_fields' | null;
        position?: Maybe<ScalarsEnums['Int']>;
    }
    export interface list_restaurant_tag {
        __typename: 'list_restaurant_tag' | null;
        id: ScalarsEnums['uuid'];
        list_id: ScalarsEnums['uuid'];
        list_restaurant_id: ScalarsEnums['uuid'];
        position: ScalarsEnums['Int'];
        restaurant_tag?: Maybe<restaurant_tag>;
        restaurant_tag_id: ScalarsEnums['uuid'];
        user_id: ScalarsEnums['uuid'];
    }
    export interface list_restaurant_tag_aggregate {
        __typename: 'list_restaurant_tag_aggregate' | null;
        aggregate?: Maybe<list_restaurant_tag_aggregate_fields>;
        nodes: Array<list_restaurant_tag>;
    }
    export interface list_restaurant_tag_aggregate_fields {
        __typename: 'list_restaurant_tag_aggregate_fields' | null;
        avg?: Maybe<list_restaurant_tag_avg_fields>;
        count: (args?: {
            columns?: Maybe<Array<ScalarsEnums['list_restaurant_tag_select_column']>>;
            distinct?: Maybe<ScalarsEnums['Boolean']>;
        }) => Maybe<ScalarsEnums['Int']>;
        max?: Maybe<list_restaurant_tag_max_fields>;
        min?: Maybe<list_restaurant_tag_min_fields>;
        stddev?: Maybe<list_restaurant_tag_stddev_fields>;
        stddev_pop?: Maybe<list_restaurant_tag_stddev_pop_fields>;
        stddev_samp?: Maybe<list_restaurant_tag_stddev_samp_fields>;
        sum?: Maybe<list_restaurant_tag_sum_fields>;
        var_pop?: Maybe<list_restaurant_tag_var_pop_fields>;
        var_samp?: Maybe<list_restaurant_tag_var_samp_fields>;
        variance?: Maybe<list_restaurant_tag_variance_fields>;
    }
    export interface list_restaurant_tag_avg_fields {
        __typename: 'list_restaurant_tag_avg_fields' | null;
        position?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list_restaurant_tag_max_fields {
        __typename: 'list_restaurant_tag_max_fields' | null;
        id?: Maybe<ScalarsEnums['uuid']>;
        list_id?: Maybe<ScalarsEnums['uuid']>;
        list_restaurant_id?: Maybe<ScalarsEnums['uuid']>;
        position?: Maybe<ScalarsEnums['Int']>;
        restaurant_tag_id?: Maybe<ScalarsEnums['uuid']>;
        user_id?: Maybe<ScalarsEnums['uuid']>;
    }
    export interface list_restaurant_tag_min_fields {
        __typename: 'list_restaurant_tag_min_fields' | null;
        id?: Maybe<ScalarsEnums['uuid']>;
        list_id?: Maybe<ScalarsEnums['uuid']>;
        list_restaurant_id?: Maybe<ScalarsEnums['uuid']>;
        position?: Maybe<ScalarsEnums['Int']>;
        restaurant_tag_id?: Maybe<ScalarsEnums['uuid']>;
        user_id?: Maybe<ScalarsEnums['uuid']>;
    }
    export interface list_restaurant_tag_mutation_response {
        __typename: 'list_restaurant_tag_mutation_response' | null;
        affected_rows: ScalarsEnums['Int'];
        returning: Array<list_restaurant_tag>;
    }
    export interface list_restaurant_tag_stddev_fields {
        __typename: 'list_restaurant_tag_stddev_fields' | null;
        position?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list_restaurant_tag_stddev_pop_fields {
        __typename: 'list_restaurant_tag_stddev_pop_fields' | null;
        position?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list_restaurant_tag_stddev_samp_fields {
        __typename: 'list_restaurant_tag_stddev_samp_fields' | null;
        position?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list_restaurant_tag_sum_fields {
        __typename: 'list_restaurant_tag_sum_fields' | null;
        position?: Maybe<ScalarsEnums['Int']>;
    }
    export interface list_restaurant_tag_var_pop_fields {
        __typename: 'list_restaurant_tag_var_pop_fields' | null;
        position?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list_restaurant_tag_var_samp_fields {
        __typename: 'list_restaurant_tag_var_samp_fields' | null;
        position?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list_restaurant_tag_variance_fields {
        __typename: 'list_restaurant_tag_variance_fields' | null;
        position?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list_restaurant_var_pop_fields {
        __typename: 'list_restaurant_var_pop_fields' | null;
        position?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list_restaurant_var_samp_fields {
        __typename: 'list_restaurant_var_samp_fields' | null;
        position?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list_restaurant_variance_fields {
        __typename: 'list_restaurant_variance_fields' | null;
        position?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list_stddev_fields {
        __typename: 'list_stddev_fields' | null;
        color?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list_stddev_pop_fields {
        __typename: 'list_stddev_pop_fields' | null;
        color?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list_stddev_samp_fields {
        __typename: 'list_stddev_samp_fields' | null;
        color?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list_sum_fields {
        __typename: 'list_sum_fields' | null;
        color?: Maybe<ScalarsEnums['Int']>;
    }
    export interface list_tag {
        __typename: 'list_tag' | null;
        created_at: ScalarsEnums['timestamptz'];
        id: ScalarsEnums['uuid'];
        list?: Maybe<list>;
        list_id: ScalarsEnums['uuid'];
        tag?: Maybe<tag>;
        tag_id: ScalarsEnums['uuid'];
    }
    export interface list_tag_aggregate {
        __typename: 'list_tag_aggregate' | null;
        aggregate?: Maybe<list_tag_aggregate_fields>;
        nodes: Array<list_tag>;
    }
    export interface list_tag_aggregate_fields {
        __typename: 'list_tag_aggregate_fields' | null;
        count: (args?: {
            columns?: Maybe<Array<ScalarsEnums['list_tag_select_column']>>;
            distinct?: Maybe<ScalarsEnums['Boolean']>;
        }) => Maybe<ScalarsEnums['Int']>;
        max?: Maybe<list_tag_max_fields>;
        min?: Maybe<list_tag_min_fields>;
    }
    export interface list_tag_max_fields {
        __typename: 'list_tag_max_fields' | null;
        created_at?: Maybe<ScalarsEnums['timestamptz']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        list_id?: Maybe<ScalarsEnums['uuid']>;
        tag_id?: Maybe<ScalarsEnums['uuid']>;
    }
    export interface list_tag_min_fields {
        __typename: 'list_tag_min_fields' | null;
        created_at?: Maybe<ScalarsEnums['timestamptz']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        list_id?: Maybe<ScalarsEnums['uuid']>;
        tag_id?: Maybe<ScalarsEnums['uuid']>;
    }
    export interface list_tag_mutation_response {
        __typename: 'list_tag_mutation_response' | null;
        affected_rows: ScalarsEnums['Int'];
        returning: Array<list_tag>;
    }
    export interface list_var_pop_fields {
        __typename: 'list_var_pop_fields' | null;
        color?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list_var_samp_fields {
        __typename: 'list_var_samp_fields' | null;
        color?: Maybe<ScalarsEnums['Float']>;
    }
    export interface list_variance_fields {
        __typename: 'list_variance_fields' | null;
        color?: Maybe<ScalarsEnums['Float']>;
    }
    export interface menu_item {
        __typename: 'menu_item' | null;
        created_at: ScalarsEnums['timestamptz'];
        description?: Maybe<ScalarsEnums['String']>;
        id: ScalarsEnums['uuid'];
        image?: Maybe<ScalarsEnums['String']>;
        location?: Maybe<ScalarsEnums['geometry']>;
        name: ScalarsEnums['String'];
        price?: Maybe<ScalarsEnums['Int']>;
        restaurant: restaurant;
        restaurant_id: ScalarsEnums['uuid'];
        updated_at: ScalarsEnums['timestamptz'];
    }
    export interface menu_item_aggregate {
        __typename: 'menu_item_aggregate' | null;
        aggregate?: Maybe<menu_item_aggregate_fields>;
        nodes: Array<menu_item>;
    }
    export interface menu_item_aggregate_fields {
        __typename: 'menu_item_aggregate_fields' | null;
        avg?: Maybe<menu_item_avg_fields>;
        count: (args?: {
            columns?: Maybe<Array<ScalarsEnums['menu_item_select_column']>>;
            distinct?: Maybe<ScalarsEnums['Boolean']>;
        }) => Maybe<ScalarsEnums['Int']>;
        max?: Maybe<menu_item_max_fields>;
        min?: Maybe<menu_item_min_fields>;
        stddev?: Maybe<menu_item_stddev_fields>;
        stddev_pop?: Maybe<menu_item_stddev_pop_fields>;
        stddev_samp?: Maybe<menu_item_stddev_samp_fields>;
        sum?: Maybe<menu_item_sum_fields>;
        var_pop?: Maybe<menu_item_var_pop_fields>;
        var_samp?: Maybe<menu_item_var_samp_fields>;
        variance?: Maybe<menu_item_variance_fields>;
    }
    export interface menu_item_avg_fields {
        __typename: 'menu_item_avg_fields' | null;
        price?: Maybe<ScalarsEnums['Float']>;
    }
    export interface menu_item_max_fields {
        __typename: 'menu_item_max_fields' | null;
        created_at?: Maybe<ScalarsEnums['timestamptz']>;
        description?: Maybe<ScalarsEnums['String']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        image?: Maybe<ScalarsEnums['String']>;
        name?: Maybe<ScalarsEnums['String']>;
        price?: Maybe<ScalarsEnums['Int']>;
        restaurant_id?: Maybe<ScalarsEnums['uuid']>;
        updated_at?: Maybe<ScalarsEnums['timestamptz']>;
    }
    export interface menu_item_min_fields {
        __typename: 'menu_item_min_fields' | null;
        created_at?: Maybe<ScalarsEnums['timestamptz']>;
        description?: Maybe<ScalarsEnums['String']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        image?: Maybe<ScalarsEnums['String']>;
        name?: Maybe<ScalarsEnums['String']>;
        price?: Maybe<ScalarsEnums['Int']>;
        restaurant_id?: Maybe<ScalarsEnums['uuid']>;
        updated_at?: Maybe<ScalarsEnums['timestamptz']>;
    }
    export interface menu_item_mutation_response {
        __typename: 'menu_item_mutation_response' | null;
        affected_rows: ScalarsEnums['Int'];
        returning: Array<menu_item>;
    }
    export interface menu_item_stddev_fields {
        __typename: 'menu_item_stddev_fields' | null;
        price?: Maybe<ScalarsEnums['Float']>;
    }
    export interface menu_item_stddev_pop_fields {
        __typename: 'menu_item_stddev_pop_fields' | null;
        price?: Maybe<ScalarsEnums['Float']>;
    }
    export interface menu_item_stddev_samp_fields {
        __typename: 'menu_item_stddev_samp_fields' | null;
        price?: Maybe<ScalarsEnums['Float']>;
    }
    export interface menu_item_sum_fields {
        __typename: 'menu_item_sum_fields' | null;
        price?: Maybe<ScalarsEnums['Int']>;
    }
    export interface menu_item_var_pop_fields {
        __typename: 'menu_item_var_pop_fields' | null;
        price?: Maybe<ScalarsEnums['Float']>;
    }
    export interface menu_item_var_samp_fields {
        __typename: 'menu_item_var_samp_fields' | null;
        price?: Maybe<ScalarsEnums['Float']>;
    }
    export interface menu_item_variance_fields {
        __typename: 'menu_item_variance_fields' | null;
        price?: Maybe<ScalarsEnums['Float']>;
    }
    export interface nhood_labels {
        __typename: 'nhood_labels' | null;
        center: ScalarsEnums['geometry'];
        name: ScalarsEnums['String'];
        ogc_fid: ScalarsEnums['Int'];
    }
    export interface nhood_labels_aggregate {
        __typename: 'nhood_labels_aggregate' | null;
        aggregate?: Maybe<nhood_labels_aggregate_fields>;
        nodes: Array<nhood_labels>;
    }
    export interface nhood_labels_aggregate_fields {
        __typename: 'nhood_labels_aggregate_fields' | null;
        avg?: Maybe<nhood_labels_avg_fields>;
        count: (args?: {
            columns?: Maybe<Array<ScalarsEnums['nhood_labels_select_column']>>;
            distinct?: Maybe<ScalarsEnums['Boolean']>;
        }) => Maybe<ScalarsEnums['Int']>;
        max?: Maybe<nhood_labels_max_fields>;
        min?: Maybe<nhood_labels_min_fields>;
        stddev?: Maybe<nhood_labels_stddev_fields>;
        stddev_pop?: Maybe<nhood_labels_stddev_pop_fields>;
        stddev_samp?: Maybe<nhood_labels_stddev_samp_fields>;
        sum?: Maybe<nhood_labels_sum_fields>;
        var_pop?: Maybe<nhood_labels_var_pop_fields>;
        var_samp?: Maybe<nhood_labels_var_samp_fields>;
        variance?: Maybe<nhood_labels_variance_fields>;
    }
    export interface nhood_labels_avg_fields {
        __typename: 'nhood_labels_avg_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface nhood_labels_max_fields {
        __typename: 'nhood_labels_max_fields' | null;
        name?: Maybe<ScalarsEnums['String']>;
        ogc_fid?: Maybe<ScalarsEnums['Int']>;
    }
    export interface nhood_labels_min_fields {
        __typename: 'nhood_labels_min_fields' | null;
        name?: Maybe<ScalarsEnums['String']>;
        ogc_fid?: Maybe<ScalarsEnums['Int']>;
    }
    export interface nhood_labels_mutation_response {
        __typename: 'nhood_labels_mutation_response' | null;
        affected_rows: ScalarsEnums['Int'];
        returning: Array<nhood_labels>;
    }
    export interface nhood_labels_stddev_fields {
        __typename: 'nhood_labels_stddev_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface nhood_labels_stddev_pop_fields {
        __typename: 'nhood_labels_stddev_pop_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface nhood_labels_stddev_samp_fields {
        __typename: 'nhood_labels_stddev_samp_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface nhood_labels_sum_fields {
        __typename: 'nhood_labels_sum_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Int']>;
    }
    export interface nhood_labels_var_pop_fields {
        __typename: 'nhood_labels_var_pop_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface nhood_labels_var_samp_fields {
        __typename: 'nhood_labels_var_samp_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface nhood_labels_variance_fields {
        __typename: 'nhood_labels_variance_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface opening_hours {
        __typename: 'opening_hours' | null;
        hours: ScalarsEnums['tsrange'];
        id: ScalarsEnums['uuid'];
        restaurant: restaurant;
        restaurant_id: ScalarsEnums['uuid'];
    }
    export interface opening_hours_aggregate {
        __typename: 'opening_hours_aggregate' | null;
        aggregate?: Maybe<opening_hours_aggregate_fields>;
        nodes: Array<opening_hours>;
    }
    export interface opening_hours_aggregate_fields {
        __typename: 'opening_hours_aggregate_fields' | null;
        count: (args?: {
            columns?: Maybe<Array<ScalarsEnums['opening_hours_select_column']>>;
            distinct?: Maybe<ScalarsEnums['Boolean']>;
        }) => Maybe<ScalarsEnums['Int']>;
        max?: Maybe<opening_hours_max_fields>;
        min?: Maybe<opening_hours_min_fields>;
    }
    export interface opening_hours_max_fields {
        __typename: 'opening_hours_max_fields' | null;
        id?: Maybe<ScalarsEnums['uuid']>;
        restaurant_id?: Maybe<ScalarsEnums['uuid']>;
    }
    export interface opening_hours_min_fields {
        __typename: 'opening_hours_min_fields' | null;
        id?: Maybe<ScalarsEnums['uuid']>;
        restaurant_id?: Maybe<ScalarsEnums['uuid']>;
    }
    export interface opening_hours_mutation_response {
        __typename: 'opening_hours_mutation_response' | null;
        affected_rows: ScalarsEnums['Int'];
        returning: Array<opening_hours>;
    }
    export interface photo {
        __typename: 'photo' | null;
        created_at: ScalarsEnums['timestamptz'];
        id: ScalarsEnums['uuid'];
        origin?: Maybe<ScalarsEnums['String']>;
        quality?: Maybe<ScalarsEnums['numeric']>;
        updated_at: ScalarsEnums['timestamptz'];
        url?: Maybe<ScalarsEnums['String']>;
    }
    export interface photo_aggregate {
        __typename: 'photo_aggregate' | null;
        aggregate?: Maybe<photo_aggregate_fields>;
        nodes: Array<photo>;
    }
    export interface photo_aggregate_fields {
        __typename: 'photo_aggregate_fields' | null;
        avg?: Maybe<photo_avg_fields>;
        count: (args?: {
            columns?: Maybe<Array<ScalarsEnums['photo_select_column']>>;
            distinct?: Maybe<ScalarsEnums['Boolean']>;
        }) => Maybe<ScalarsEnums['Int']>;
        max?: Maybe<photo_max_fields>;
        min?: Maybe<photo_min_fields>;
        stddev?: Maybe<photo_stddev_fields>;
        stddev_pop?: Maybe<photo_stddev_pop_fields>;
        stddev_samp?: Maybe<photo_stddev_samp_fields>;
        sum?: Maybe<photo_sum_fields>;
        var_pop?: Maybe<photo_var_pop_fields>;
        var_samp?: Maybe<photo_var_samp_fields>;
        variance?: Maybe<photo_variance_fields>;
    }
    export interface photo_avg_fields {
        __typename: 'photo_avg_fields' | null;
        quality?: Maybe<ScalarsEnums['Float']>;
    }
    export interface photo_max_fields {
        __typename: 'photo_max_fields' | null;
        created_at?: Maybe<ScalarsEnums['timestamptz']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        origin?: Maybe<ScalarsEnums['String']>;
        quality?: Maybe<ScalarsEnums['numeric']>;
        updated_at?: Maybe<ScalarsEnums['timestamptz']>;
        url?: Maybe<ScalarsEnums['String']>;
    }
    export interface photo_min_fields {
        __typename: 'photo_min_fields' | null;
        created_at?: Maybe<ScalarsEnums['timestamptz']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        origin?: Maybe<ScalarsEnums['String']>;
        quality?: Maybe<ScalarsEnums['numeric']>;
        updated_at?: Maybe<ScalarsEnums['timestamptz']>;
        url?: Maybe<ScalarsEnums['String']>;
    }
    export interface photo_mutation_response {
        __typename: 'photo_mutation_response' | null;
        affected_rows: ScalarsEnums['Int'];
        returning: Array<photo>;
    }
    export interface photo_stddev_fields {
        __typename: 'photo_stddev_fields' | null;
        quality?: Maybe<ScalarsEnums['Float']>;
    }
    export interface photo_stddev_pop_fields {
        __typename: 'photo_stddev_pop_fields' | null;
        quality?: Maybe<ScalarsEnums['Float']>;
    }
    export interface photo_stddev_samp_fields {
        __typename: 'photo_stddev_samp_fields' | null;
        quality?: Maybe<ScalarsEnums['Float']>;
    }
    export interface photo_sum_fields {
        __typename: 'photo_sum_fields' | null;
        quality?: Maybe<ScalarsEnums['numeric']>;
    }
    export interface photo_var_pop_fields {
        __typename: 'photo_var_pop_fields' | null;
        quality?: Maybe<ScalarsEnums['Float']>;
    }
    export interface photo_var_samp_fields {
        __typename: 'photo_var_samp_fields' | null;
        quality?: Maybe<ScalarsEnums['Float']>;
    }
    export interface photo_variance_fields {
        __typename: 'photo_variance_fields' | null;
        quality?: Maybe<ScalarsEnums['Float']>;
    }
    export interface photo_xref {
        __typename: 'photo_xref' | null;
        id: ScalarsEnums['uuid'];
        photo: photo;
        photo_id: ScalarsEnums['uuid'];
        restaurant_id: ScalarsEnums['uuid'];
        tag_id: ScalarsEnums['uuid'];
        type?: Maybe<ScalarsEnums['String']>;
    }
    export interface photo_xref_aggregate {
        __typename: 'photo_xref_aggregate' | null;
        aggregate?: Maybe<photo_xref_aggregate_fields>;
        nodes: Array<photo_xref>;
    }
    export interface photo_xref_aggregate_fields {
        __typename: 'photo_xref_aggregate_fields' | null;
        count: (args?: {
            columns?: Maybe<Array<ScalarsEnums['photo_xref_select_column']>>;
            distinct?: Maybe<ScalarsEnums['Boolean']>;
        }) => Maybe<ScalarsEnums['Int']>;
        max?: Maybe<photo_xref_max_fields>;
        min?: Maybe<photo_xref_min_fields>;
    }
    export interface photo_xref_max_fields {
        __typename: 'photo_xref_max_fields' | null;
        id?: Maybe<ScalarsEnums['uuid']>;
        photo_id?: Maybe<ScalarsEnums['uuid']>;
        restaurant_id?: Maybe<ScalarsEnums['uuid']>;
        tag_id?: Maybe<ScalarsEnums['uuid']>;
        type?: Maybe<ScalarsEnums['String']>;
    }
    export interface photo_xref_min_fields {
        __typename: 'photo_xref_min_fields' | null;
        id?: Maybe<ScalarsEnums['uuid']>;
        photo_id?: Maybe<ScalarsEnums['uuid']>;
        restaurant_id?: Maybe<ScalarsEnums['uuid']>;
        tag_id?: Maybe<ScalarsEnums['uuid']>;
        type?: Maybe<ScalarsEnums['String']>;
    }
    export interface photo_xref_mutation_response {
        __typename: 'photo_xref_mutation_response' | null;
        affected_rows: ScalarsEnums['Int'];
        returning: Array<photo_xref>;
    }
    export interface restaurant {
        __typename: 'restaurant' | null;
        address?: Maybe<ScalarsEnums['String']>;
        city?: Maybe<ScalarsEnums['String']>;
        created_at: ScalarsEnums['timestamptz'];
        description?: Maybe<ScalarsEnums['String']>;
        downvotes?: Maybe<ScalarsEnums['numeric']>;
        geocoder_id?: Maybe<ScalarsEnums['String']>;
        headlines: (args?: {
            path?: Maybe<ScalarsEnums['String']>;
        }) => Maybe<ScalarsEnums['jsonb']>;
        hours: (args?: {
            path?: Maybe<ScalarsEnums['String']>;
        }) => Maybe<ScalarsEnums['jsonb']>;
        id: ScalarsEnums['uuid'];
        image?: Maybe<ScalarsEnums['String']>;
        is_open_now?: Maybe<ScalarsEnums['Boolean']>;
        lists: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_restaurant_order_by>>;
            where?: Maybe<list_restaurant_bool_exp>;
        }) => Array<list_restaurant>;
        lists_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_restaurant_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_restaurant_order_by>>;
            where?: Maybe<list_restaurant_bool_exp>;
        }) => list_restaurant_aggregate;
        location: ScalarsEnums['geometry'];
        menu_items: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['menu_item_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<menu_item_order_by>>;
            where?: Maybe<menu_item_bool_exp>;
        }) => Array<menu_item>;
        menu_items_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['menu_item_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<menu_item_order_by>>;
            where?: Maybe<menu_item_bool_exp>;
        }) => menu_item_aggregate;
        name: ScalarsEnums['String'];
        oldest_review_date?: Maybe<ScalarsEnums['timestamptz']>;
        photo_table: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['photo_xref_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<photo_xref_order_by>>;
            where?: Maybe<photo_xref_bool_exp>;
        }) => Array<photo_xref>;
        photo_table_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['photo_xref_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<photo_xref_order_by>>;
            where?: Maybe<photo_xref_bool_exp>;
        }) => photo_xref_aggregate;
        photos: (args?: {
            path?: Maybe<ScalarsEnums['String']>;
        }) => Maybe<ScalarsEnums['jsonb']>;
        price_range?: Maybe<ScalarsEnums['String']>;
        rating?: Maybe<ScalarsEnums['numeric']>;
        rating_factors: (args?: {
            path?: Maybe<ScalarsEnums['String']>;
        }) => Maybe<ScalarsEnums['jsonb']>;
        reviews: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['review_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<review_order_by>>;
            where?: Maybe<review_bool_exp>;
        }) => Array<review>;
        reviews_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['review_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<review_order_by>>;
            where?: Maybe<review_bool_exp>;
        }) => review_aggregate;
        score?: Maybe<ScalarsEnums['numeric']>;
        score_breakdown: (args?: {
            path?: Maybe<ScalarsEnums['String']>;
        }) => Maybe<ScalarsEnums['jsonb']>;
        slug: ScalarsEnums['String'];
        source_breakdown: (args?: {
            path?: Maybe<ScalarsEnums['String']>;
        }) => Maybe<ScalarsEnums['jsonb']>;
        sources: (args?: {
            path?: Maybe<ScalarsEnums['String']>;
        }) => Maybe<ScalarsEnums['jsonb']>;
        state?: Maybe<ScalarsEnums['String']>;
        summary?: Maybe<ScalarsEnums['String']>;
        tag_names: (args?: {
            path?: Maybe<ScalarsEnums['String']>;
        }) => Maybe<ScalarsEnums['jsonb']>;
        tags: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_tag_order_by>>;
            where?: Maybe<restaurant_tag_bool_exp>;
        }) => Array<restaurant_tag>;
        tags_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_tag_order_by>>;
            where?: Maybe<restaurant_tag_bool_exp>;
        }) => restaurant_tag_aggregate;
        telephone?: Maybe<ScalarsEnums['String']>;
        top_tags: (args: {
            args: restaurant_top_tags_args;
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_tag_order_by>>;
            where?: Maybe<restaurant_tag_bool_exp>;
        }) => Maybe<Array<restaurant_tag>>;
        updated_at: ScalarsEnums['timestamptz'];
        upvotes?: Maybe<ScalarsEnums['numeric']>;
        votes_ratio?: Maybe<ScalarsEnums['numeric']>;
        website?: Maybe<ScalarsEnums['String']>;
        zip?: Maybe<ScalarsEnums['numeric']>;
    }
    export interface restaurant_aggregate {
        __typename: 'restaurant_aggregate' | null;
        aggregate?: Maybe<restaurant_aggregate_fields>;
        nodes: Array<restaurant>;
    }
    export interface restaurant_aggregate_fields {
        __typename: 'restaurant_aggregate_fields' | null;
        avg?: Maybe<restaurant_avg_fields>;
        count: (args?: {
            columns?: Maybe<Array<ScalarsEnums['restaurant_select_column']>>;
            distinct?: Maybe<ScalarsEnums['Boolean']>;
        }) => Maybe<ScalarsEnums['Int']>;
        max?: Maybe<restaurant_max_fields>;
        min?: Maybe<restaurant_min_fields>;
        stddev?: Maybe<restaurant_stddev_fields>;
        stddev_pop?: Maybe<restaurant_stddev_pop_fields>;
        stddev_samp?: Maybe<restaurant_stddev_samp_fields>;
        sum?: Maybe<restaurant_sum_fields>;
        var_pop?: Maybe<restaurant_var_pop_fields>;
        var_samp?: Maybe<restaurant_var_samp_fields>;
        variance?: Maybe<restaurant_variance_fields>;
    }
    export interface restaurant_avg_fields {
        __typename: 'restaurant_avg_fields' | null;
        downvotes?: Maybe<ScalarsEnums['Float']>;
        rating?: Maybe<ScalarsEnums['Float']>;
        score?: Maybe<ScalarsEnums['Float']>;
        upvotes?: Maybe<ScalarsEnums['Float']>;
        votes_ratio?: Maybe<ScalarsEnums['Float']>;
        zip?: Maybe<ScalarsEnums['Float']>;
    }
    export interface restaurant_max_fields {
        __typename: 'restaurant_max_fields' | null;
        address?: Maybe<ScalarsEnums['String']>;
        city?: Maybe<ScalarsEnums['String']>;
        created_at?: Maybe<ScalarsEnums['timestamptz']>;
        description?: Maybe<ScalarsEnums['String']>;
        downvotes?: Maybe<ScalarsEnums['numeric']>;
        geocoder_id?: Maybe<ScalarsEnums['String']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        image?: Maybe<ScalarsEnums['String']>;
        name?: Maybe<ScalarsEnums['String']>;
        oldest_review_date?: Maybe<ScalarsEnums['timestamptz']>;
        price_range?: Maybe<ScalarsEnums['String']>;
        rating?: Maybe<ScalarsEnums['numeric']>;
        score?: Maybe<ScalarsEnums['numeric']>;
        slug?: Maybe<ScalarsEnums['String']>;
        state?: Maybe<ScalarsEnums['String']>;
        summary?: Maybe<ScalarsEnums['String']>;
        telephone?: Maybe<ScalarsEnums['String']>;
        updated_at?: Maybe<ScalarsEnums['timestamptz']>;
        upvotes?: Maybe<ScalarsEnums['numeric']>;
        votes_ratio?: Maybe<ScalarsEnums['numeric']>;
        website?: Maybe<ScalarsEnums['String']>;
        zip?: Maybe<ScalarsEnums['numeric']>;
    }
    export interface restaurant_min_fields {
        __typename: 'restaurant_min_fields' | null;
        address?: Maybe<ScalarsEnums['String']>;
        city?: Maybe<ScalarsEnums['String']>;
        created_at?: Maybe<ScalarsEnums['timestamptz']>;
        description?: Maybe<ScalarsEnums['String']>;
        downvotes?: Maybe<ScalarsEnums['numeric']>;
        geocoder_id?: Maybe<ScalarsEnums['String']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        image?: Maybe<ScalarsEnums['String']>;
        name?: Maybe<ScalarsEnums['String']>;
        oldest_review_date?: Maybe<ScalarsEnums['timestamptz']>;
        price_range?: Maybe<ScalarsEnums['String']>;
        rating?: Maybe<ScalarsEnums['numeric']>;
        score?: Maybe<ScalarsEnums['numeric']>;
        slug?: Maybe<ScalarsEnums['String']>;
        state?: Maybe<ScalarsEnums['String']>;
        summary?: Maybe<ScalarsEnums['String']>;
        telephone?: Maybe<ScalarsEnums['String']>;
        updated_at?: Maybe<ScalarsEnums['timestamptz']>;
        upvotes?: Maybe<ScalarsEnums['numeric']>;
        votes_ratio?: Maybe<ScalarsEnums['numeric']>;
        website?: Maybe<ScalarsEnums['String']>;
        zip?: Maybe<ScalarsEnums['numeric']>;
    }
    export interface restaurant_mutation_response {
        __typename: 'restaurant_mutation_response' | null;
        affected_rows: ScalarsEnums['Int'];
        returning: Array<restaurant>;
    }
    export interface restaurant_stddev_fields {
        __typename: 'restaurant_stddev_fields' | null;
        downvotes?: Maybe<ScalarsEnums['Float']>;
        rating?: Maybe<ScalarsEnums['Float']>;
        score?: Maybe<ScalarsEnums['Float']>;
        upvotes?: Maybe<ScalarsEnums['Float']>;
        votes_ratio?: Maybe<ScalarsEnums['Float']>;
        zip?: Maybe<ScalarsEnums['Float']>;
    }
    export interface restaurant_stddev_pop_fields {
        __typename: 'restaurant_stddev_pop_fields' | null;
        downvotes?: Maybe<ScalarsEnums['Float']>;
        rating?: Maybe<ScalarsEnums['Float']>;
        score?: Maybe<ScalarsEnums['Float']>;
        upvotes?: Maybe<ScalarsEnums['Float']>;
        votes_ratio?: Maybe<ScalarsEnums['Float']>;
        zip?: Maybe<ScalarsEnums['Float']>;
    }
    export interface restaurant_stddev_samp_fields {
        __typename: 'restaurant_stddev_samp_fields' | null;
        downvotes?: Maybe<ScalarsEnums['Float']>;
        rating?: Maybe<ScalarsEnums['Float']>;
        score?: Maybe<ScalarsEnums['Float']>;
        upvotes?: Maybe<ScalarsEnums['Float']>;
        votes_ratio?: Maybe<ScalarsEnums['Float']>;
        zip?: Maybe<ScalarsEnums['Float']>;
    }
    export interface restaurant_sum_fields {
        __typename: 'restaurant_sum_fields' | null;
        downvotes?: Maybe<ScalarsEnums['numeric']>;
        rating?: Maybe<ScalarsEnums['numeric']>;
        score?: Maybe<ScalarsEnums['numeric']>;
        upvotes?: Maybe<ScalarsEnums['numeric']>;
        votes_ratio?: Maybe<ScalarsEnums['numeric']>;
        zip?: Maybe<ScalarsEnums['numeric']>;
    }
    export interface restaurant_tag {
        __typename: 'restaurant_tag' | null;
        downvotes?: Maybe<ScalarsEnums['numeric']>;
        id: ScalarsEnums['uuid'];
        photos: (args?: {
            path?: Maybe<ScalarsEnums['String']>;
        }) => Maybe<ScalarsEnums['jsonb']>;
        rank?: Maybe<ScalarsEnums['Int']>;
        rating?: Maybe<ScalarsEnums['numeric']>;
        restaurant: restaurant;
        restaurant_id: ScalarsEnums['uuid'];
        review_mentions_count?: Maybe<ScalarsEnums['numeric']>;
        reviews: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['review_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<review_order_by>>;
            where?: Maybe<review_bool_exp>;
        }) => Array<review>;
        reviews_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['review_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<review_order_by>>;
            where?: Maybe<review_bool_exp>;
        }) => review_aggregate;
        score?: Maybe<ScalarsEnums['numeric']>;
        score_breakdown: (args?: {
            path?: Maybe<ScalarsEnums['String']>;
        }) => Maybe<ScalarsEnums['jsonb']>;
        sentences: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['review_tag_sentence_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<review_tag_sentence_order_by>>;
            where?: Maybe<review_tag_sentence_bool_exp>;
        }) => Array<review_tag_sentence>;
        sentences_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['review_tag_sentence_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<review_tag_sentence_order_by>>;
            where?: Maybe<review_tag_sentence_bool_exp>;
        }) => review_tag_sentence_aggregate;
        source_breakdown: (args?: {
            path?: Maybe<ScalarsEnums['String']>;
        }) => Maybe<ScalarsEnums['jsonb']>;
        tag: tag;
        tag_id: ScalarsEnums['uuid'];
        upvotes?: Maybe<ScalarsEnums['numeric']>;
        votes_ratio?: Maybe<ScalarsEnums['numeric']>;
    }
    export interface restaurant_tag_aggregate {
        __typename: 'restaurant_tag_aggregate' | null;
        aggregate?: Maybe<restaurant_tag_aggregate_fields>;
        nodes: Array<restaurant_tag>;
    }
    export interface restaurant_tag_aggregate_fields {
        __typename: 'restaurant_tag_aggregate_fields' | null;
        avg?: Maybe<restaurant_tag_avg_fields>;
        count: (args?: {
            columns?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>;
            distinct?: Maybe<ScalarsEnums['Boolean']>;
        }) => Maybe<ScalarsEnums['Int']>;
        max?: Maybe<restaurant_tag_max_fields>;
        min?: Maybe<restaurant_tag_min_fields>;
        stddev?: Maybe<restaurant_tag_stddev_fields>;
        stddev_pop?: Maybe<restaurant_tag_stddev_pop_fields>;
        stddev_samp?: Maybe<restaurant_tag_stddev_samp_fields>;
        sum?: Maybe<restaurant_tag_sum_fields>;
        var_pop?: Maybe<restaurant_tag_var_pop_fields>;
        var_samp?: Maybe<restaurant_tag_var_samp_fields>;
        variance?: Maybe<restaurant_tag_variance_fields>;
    }
    export interface restaurant_tag_avg_fields {
        __typename: 'restaurant_tag_avg_fields' | null;
        downvotes?: Maybe<ScalarsEnums['Float']>;
        rank?: Maybe<ScalarsEnums['Float']>;
        rating?: Maybe<ScalarsEnums['Float']>;
        review_mentions_count?: Maybe<ScalarsEnums['Float']>;
        score?: Maybe<ScalarsEnums['Float']>;
        upvotes?: Maybe<ScalarsEnums['Float']>;
        votes_ratio?: Maybe<ScalarsEnums['Float']>;
    }
    export interface restaurant_tag_max_fields {
        __typename: 'restaurant_tag_max_fields' | null;
        downvotes?: Maybe<ScalarsEnums['numeric']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        rank?: Maybe<ScalarsEnums['Int']>;
        rating?: Maybe<ScalarsEnums['numeric']>;
        restaurant_id?: Maybe<ScalarsEnums['uuid']>;
        review_mentions_count?: Maybe<ScalarsEnums['numeric']>;
        score?: Maybe<ScalarsEnums['numeric']>;
        tag_id?: Maybe<ScalarsEnums['uuid']>;
        upvotes?: Maybe<ScalarsEnums['numeric']>;
        votes_ratio?: Maybe<ScalarsEnums['numeric']>;
    }
    export interface restaurant_tag_min_fields {
        __typename: 'restaurant_tag_min_fields' | null;
        downvotes?: Maybe<ScalarsEnums['numeric']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        rank?: Maybe<ScalarsEnums['Int']>;
        rating?: Maybe<ScalarsEnums['numeric']>;
        restaurant_id?: Maybe<ScalarsEnums['uuid']>;
        review_mentions_count?: Maybe<ScalarsEnums['numeric']>;
        score?: Maybe<ScalarsEnums['numeric']>;
        tag_id?: Maybe<ScalarsEnums['uuid']>;
        upvotes?: Maybe<ScalarsEnums['numeric']>;
        votes_ratio?: Maybe<ScalarsEnums['numeric']>;
    }
    export interface restaurant_tag_mutation_response {
        __typename: 'restaurant_tag_mutation_response' | null;
        affected_rows: ScalarsEnums['Int'];
        returning: Array<restaurant_tag>;
    }
    export interface restaurant_tag_stddev_fields {
        __typename: 'restaurant_tag_stddev_fields' | null;
        downvotes?: Maybe<ScalarsEnums['Float']>;
        rank?: Maybe<ScalarsEnums['Float']>;
        rating?: Maybe<ScalarsEnums['Float']>;
        review_mentions_count?: Maybe<ScalarsEnums['Float']>;
        score?: Maybe<ScalarsEnums['Float']>;
        upvotes?: Maybe<ScalarsEnums['Float']>;
        votes_ratio?: Maybe<ScalarsEnums['Float']>;
    }
    export interface restaurant_tag_stddev_pop_fields {
        __typename: 'restaurant_tag_stddev_pop_fields' | null;
        downvotes?: Maybe<ScalarsEnums['Float']>;
        rank?: Maybe<ScalarsEnums['Float']>;
        rating?: Maybe<ScalarsEnums['Float']>;
        review_mentions_count?: Maybe<ScalarsEnums['Float']>;
        score?: Maybe<ScalarsEnums['Float']>;
        upvotes?: Maybe<ScalarsEnums['Float']>;
        votes_ratio?: Maybe<ScalarsEnums['Float']>;
    }
    export interface restaurant_tag_stddev_samp_fields {
        __typename: 'restaurant_tag_stddev_samp_fields' | null;
        downvotes?: Maybe<ScalarsEnums['Float']>;
        rank?: Maybe<ScalarsEnums['Float']>;
        rating?: Maybe<ScalarsEnums['Float']>;
        review_mentions_count?: Maybe<ScalarsEnums['Float']>;
        score?: Maybe<ScalarsEnums['Float']>;
        upvotes?: Maybe<ScalarsEnums['Float']>;
        votes_ratio?: Maybe<ScalarsEnums['Float']>;
    }
    export interface restaurant_tag_sum_fields {
        __typename: 'restaurant_tag_sum_fields' | null;
        downvotes?: Maybe<ScalarsEnums['numeric']>;
        rank?: Maybe<ScalarsEnums['Int']>;
        rating?: Maybe<ScalarsEnums['numeric']>;
        review_mentions_count?: Maybe<ScalarsEnums['numeric']>;
        score?: Maybe<ScalarsEnums['numeric']>;
        upvotes?: Maybe<ScalarsEnums['numeric']>;
        votes_ratio?: Maybe<ScalarsEnums['numeric']>;
    }
    export interface restaurant_tag_var_pop_fields {
        __typename: 'restaurant_tag_var_pop_fields' | null;
        downvotes?: Maybe<ScalarsEnums['Float']>;
        rank?: Maybe<ScalarsEnums['Float']>;
        rating?: Maybe<ScalarsEnums['Float']>;
        review_mentions_count?: Maybe<ScalarsEnums['Float']>;
        score?: Maybe<ScalarsEnums['Float']>;
        upvotes?: Maybe<ScalarsEnums['Float']>;
        votes_ratio?: Maybe<ScalarsEnums['Float']>;
    }
    export interface restaurant_tag_var_samp_fields {
        __typename: 'restaurant_tag_var_samp_fields' | null;
        downvotes?: Maybe<ScalarsEnums['Float']>;
        rank?: Maybe<ScalarsEnums['Float']>;
        rating?: Maybe<ScalarsEnums['Float']>;
        review_mentions_count?: Maybe<ScalarsEnums['Float']>;
        score?: Maybe<ScalarsEnums['Float']>;
        upvotes?: Maybe<ScalarsEnums['Float']>;
        votes_ratio?: Maybe<ScalarsEnums['Float']>;
    }
    export interface restaurant_tag_variance_fields {
        __typename: 'restaurant_tag_variance_fields' | null;
        downvotes?: Maybe<ScalarsEnums['Float']>;
        rank?: Maybe<ScalarsEnums['Float']>;
        rating?: Maybe<ScalarsEnums['Float']>;
        review_mentions_count?: Maybe<ScalarsEnums['Float']>;
        score?: Maybe<ScalarsEnums['Float']>;
        upvotes?: Maybe<ScalarsEnums['Float']>;
        votes_ratio?: Maybe<ScalarsEnums['Float']>;
    }
    export interface restaurant_var_pop_fields {
        __typename: 'restaurant_var_pop_fields' | null;
        downvotes?: Maybe<ScalarsEnums['Float']>;
        rating?: Maybe<ScalarsEnums['Float']>;
        score?: Maybe<ScalarsEnums['Float']>;
        upvotes?: Maybe<ScalarsEnums['Float']>;
        votes_ratio?: Maybe<ScalarsEnums['Float']>;
        zip?: Maybe<ScalarsEnums['Float']>;
    }
    export interface restaurant_var_samp_fields {
        __typename: 'restaurant_var_samp_fields' | null;
        downvotes?: Maybe<ScalarsEnums['Float']>;
        rating?: Maybe<ScalarsEnums['Float']>;
        score?: Maybe<ScalarsEnums['Float']>;
        upvotes?: Maybe<ScalarsEnums['Float']>;
        votes_ratio?: Maybe<ScalarsEnums['Float']>;
        zip?: Maybe<ScalarsEnums['Float']>;
    }
    export interface restaurant_variance_fields {
        __typename: 'restaurant_variance_fields' | null;
        downvotes?: Maybe<ScalarsEnums['Float']>;
        rating?: Maybe<ScalarsEnums['Float']>;
        score?: Maybe<ScalarsEnums['Float']>;
        upvotes?: Maybe<ScalarsEnums['Float']>;
        votes_ratio?: Maybe<ScalarsEnums['Float']>;
        zip?: Maybe<ScalarsEnums['Float']>;
    }
    export interface review {
        __typename: 'review' | null;
        authored_at: ScalarsEnums['timestamptz'];
        categories: (args?: {
            path?: Maybe<ScalarsEnums['String']>;
        }) => Maybe<ScalarsEnums['jsonb']>;
        favorited?: Maybe<ScalarsEnums['Boolean']>;
        id: ScalarsEnums['uuid'];
        list_id?: Maybe<ScalarsEnums['uuid']>;
        location?: Maybe<ScalarsEnums['geometry']>;
        native_data_unique_key?: Maybe<ScalarsEnums['String']>;
        rating?: Maybe<ScalarsEnums['numeric']>;
        restaurant: restaurant;
        restaurant_id: ScalarsEnums['uuid'];
        sentiments: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['review_tag_sentence_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<review_tag_sentence_order_by>>;
            where?: Maybe<review_tag_sentence_bool_exp>;
        }) => Array<review_tag_sentence>;
        sentiments_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['review_tag_sentence_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<review_tag_sentence_order_by>>;
            where?: Maybe<review_tag_sentence_bool_exp>;
        }) => review_tag_sentence_aggregate;
        source?: Maybe<ScalarsEnums['String']>;
        tag?: Maybe<tag>;
        tag_id?: Maybe<ScalarsEnums['uuid']>;
        text?: Maybe<ScalarsEnums['String']>;
        type?: Maybe<ScalarsEnums['String']>;
        updated_at: ScalarsEnums['timestamptz'];
        user: user;
        user_id: ScalarsEnums['uuid'];
        username?: Maybe<ScalarsEnums['String']>;
        vote?: Maybe<ScalarsEnums['numeric']>;
    }
    export interface review_aggregate {
        __typename: 'review_aggregate' | null;
        aggregate?: Maybe<review_aggregate_fields>;
        nodes: Array<review>;
    }
    export interface review_aggregate_fields {
        __typename: 'review_aggregate_fields' | null;
        avg?: Maybe<review_avg_fields>;
        count: (args?: {
            columns?: Maybe<Array<ScalarsEnums['review_select_column']>>;
            distinct?: Maybe<ScalarsEnums['Boolean']>;
        }) => Maybe<ScalarsEnums['Int']>;
        max?: Maybe<review_max_fields>;
        min?: Maybe<review_min_fields>;
        stddev?: Maybe<review_stddev_fields>;
        stddev_pop?: Maybe<review_stddev_pop_fields>;
        stddev_samp?: Maybe<review_stddev_samp_fields>;
        sum?: Maybe<review_sum_fields>;
        var_pop?: Maybe<review_var_pop_fields>;
        var_samp?: Maybe<review_var_samp_fields>;
        variance?: Maybe<review_variance_fields>;
    }
    export interface review_avg_fields {
        __typename: 'review_avg_fields' | null;
        rating?: Maybe<ScalarsEnums['Float']>;
        vote?: Maybe<ScalarsEnums['Float']>;
    }
    export interface review_max_fields {
        __typename: 'review_max_fields' | null;
        authored_at?: Maybe<ScalarsEnums['timestamptz']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        list_id?: Maybe<ScalarsEnums['uuid']>;
        native_data_unique_key?: Maybe<ScalarsEnums['String']>;
        rating?: Maybe<ScalarsEnums['numeric']>;
        restaurant_id?: Maybe<ScalarsEnums['uuid']>;
        source?: Maybe<ScalarsEnums['String']>;
        tag_id?: Maybe<ScalarsEnums['uuid']>;
        text?: Maybe<ScalarsEnums['String']>;
        type?: Maybe<ScalarsEnums['String']>;
        updated_at?: Maybe<ScalarsEnums['timestamptz']>;
        user_id?: Maybe<ScalarsEnums['uuid']>;
        username?: Maybe<ScalarsEnums['String']>;
        vote?: Maybe<ScalarsEnums['numeric']>;
    }
    export interface review_min_fields {
        __typename: 'review_min_fields' | null;
        authored_at?: Maybe<ScalarsEnums['timestamptz']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        list_id?: Maybe<ScalarsEnums['uuid']>;
        native_data_unique_key?: Maybe<ScalarsEnums['String']>;
        rating?: Maybe<ScalarsEnums['numeric']>;
        restaurant_id?: Maybe<ScalarsEnums['uuid']>;
        source?: Maybe<ScalarsEnums['String']>;
        tag_id?: Maybe<ScalarsEnums['uuid']>;
        text?: Maybe<ScalarsEnums['String']>;
        type?: Maybe<ScalarsEnums['String']>;
        updated_at?: Maybe<ScalarsEnums['timestamptz']>;
        user_id?: Maybe<ScalarsEnums['uuid']>;
        username?: Maybe<ScalarsEnums['String']>;
        vote?: Maybe<ScalarsEnums['numeric']>;
    }
    export interface review_mutation_response {
        __typename: 'review_mutation_response' | null;
        affected_rows: ScalarsEnums['Int'];
        returning: Array<review>;
    }
    export interface review_stddev_fields {
        __typename: 'review_stddev_fields' | null;
        rating?: Maybe<ScalarsEnums['Float']>;
        vote?: Maybe<ScalarsEnums['Float']>;
    }
    export interface review_stddev_pop_fields {
        __typename: 'review_stddev_pop_fields' | null;
        rating?: Maybe<ScalarsEnums['Float']>;
        vote?: Maybe<ScalarsEnums['Float']>;
    }
    export interface review_stddev_samp_fields {
        __typename: 'review_stddev_samp_fields' | null;
        rating?: Maybe<ScalarsEnums['Float']>;
        vote?: Maybe<ScalarsEnums['Float']>;
    }
    export interface review_sum_fields {
        __typename: 'review_sum_fields' | null;
        rating?: Maybe<ScalarsEnums['numeric']>;
        vote?: Maybe<ScalarsEnums['numeric']>;
    }
    export interface review_tag_sentence {
        __typename: 'review_tag_sentence' | null;
        id: ScalarsEnums['uuid'];
        ml_sentiment?: Maybe<ScalarsEnums['numeric']>;
        naive_sentiment: ScalarsEnums['numeric'];
        restaurant_id?: Maybe<ScalarsEnums['uuid']>;
        review: review;
        review_id: ScalarsEnums['uuid'];
        sentence: ScalarsEnums['String'];
        tag: tag;
        tag_id: ScalarsEnums['uuid'];
    }
    export interface review_tag_sentence_aggregate {
        __typename: 'review_tag_sentence_aggregate' | null;
        aggregate?: Maybe<review_tag_sentence_aggregate_fields>;
        nodes: Array<review_tag_sentence>;
    }
    export interface review_tag_sentence_aggregate_fields {
        __typename: 'review_tag_sentence_aggregate_fields' | null;
        avg?: Maybe<review_tag_sentence_avg_fields>;
        count: (args?: {
            columns?: Maybe<Array<ScalarsEnums['review_tag_sentence_select_column']>>;
            distinct?: Maybe<ScalarsEnums['Boolean']>;
        }) => Maybe<ScalarsEnums['Int']>;
        max?: Maybe<review_tag_sentence_max_fields>;
        min?: Maybe<review_tag_sentence_min_fields>;
        stddev?: Maybe<review_tag_sentence_stddev_fields>;
        stddev_pop?: Maybe<review_tag_sentence_stddev_pop_fields>;
        stddev_samp?: Maybe<review_tag_sentence_stddev_samp_fields>;
        sum?: Maybe<review_tag_sentence_sum_fields>;
        var_pop?: Maybe<review_tag_sentence_var_pop_fields>;
        var_samp?: Maybe<review_tag_sentence_var_samp_fields>;
        variance?: Maybe<review_tag_sentence_variance_fields>;
    }
    export interface review_tag_sentence_avg_fields {
        __typename: 'review_tag_sentence_avg_fields' | null;
        ml_sentiment?: Maybe<ScalarsEnums['Float']>;
        naive_sentiment?: Maybe<ScalarsEnums['Float']>;
    }
    export interface review_tag_sentence_max_fields {
        __typename: 'review_tag_sentence_max_fields' | null;
        id?: Maybe<ScalarsEnums['uuid']>;
        ml_sentiment?: Maybe<ScalarsEnums['numeric']>;
        naive_sentiment?: Maybe<ScalarsEnums['numeric']>;
        restaurant_id?: Maybe<ScalarsEnums['uuid']>;
        review_id?: Maybe<ScalarsEnums['uuid']>;
        sentence?: Maybe<ScalarsEnums['String']>;
        tag_id?: Maybe<ScalarsEnums['uuid']>;
    }
    export interface review_tag_sentence_min_fields {
        __typename: 'review_tag_sentence_min_fields' | null;
        id?: Maybe<ScalarsEnums['uuid']>;
        ml_sentiment?: Maybe<ScalarsEnums['numeric']>;
        naive_sentiment?: Maybe<ScalarsEnums['numeric']>;
        restaurant_id?: Maybe<ScalarsEnums['uuid']>;
        review_id?: Maybe<ScalarsEnums['uuid']>;
        sentence?: Maybe<ScalarsEnums['String']>;
        tag_id?: Maybe<ScalarsEnums['uuid']>;
    }
    export interface review_tag_sentence_mutation_response {
        __typename: 'review_tag_sentence_mutation_response' | null;
        affected_rows: ScalarsEnums['Int'];
        returning: Array<review_tag_sentence>;
    }
    export interface review_tag_sentence_stddev_fields {
        __typename: 'review_tag_sentence_stddev_fields' | null;
        ml_sentiment?: Maybe<ScalarsEnums['Float']>;
        naive_sentiment?: Maybe<ScalarsEnums['Float']>;
    }
    export interface review_tag_sentence_stddev_pop_fields {
        __typename: 'review_tag_sentence_stddev_pop_fields' | null;
        ml_sentiment?: Maybe<ScalarsEnums['Float']>;
        naive_sentiment?: Maybe<ScalarsEnums['Float']>;
    }
    export interface review_tag_sentence_stddev_samp_fields {
        __typename: 'review_tag_sentence_stddev_samp_fields' | null;
        ml_sentiment?: Maybe<ScalarsEnums['Float']>;
        naive_sentiment?: Maybe<ScalarsEnums['Float']>;
    }
    export interface review_tag_sentence_sum_fields {
        __typename: 'review_tag_sentence_sum_fields' | null;
        ml_sentiment?: Maybe<ScalarsEnums['numeric']>;
        naive_sentiment?: Maybe<ScalarsEnums['numeric']>;
    }
    export interface review_tag_sentence_var_pop_fields {
        __typename: 'review_tag_sentence_var_pop_fields' | null;
        ml_sentiment?: Maybe<ScalarsEnums['Float']>;
        naive_sentiment?: Maybe<ScalarsEnums['Float']>;
    }
    export interface review_tag_sentence_var_samp_fields {
        __typename: 'review_tag_sentence_var_samp_fields' | null;
        ml_sentiment?: Maybe<ScalarsEnums['Float']>;
        naive_sentiment?: Maybe<ScalarsEnums['Float']>;
    }
    export interface review_tag_sentence_variance_fields {
        __typename: 'review_tag_sentence_variance_fields' | null;
        ml_sentiment?: Maybe<ScalarsEnums['Float']>;
        naive_sentiment?: Maybe<ScalarsEnums['Float']>;
    }
    export interface review_var_pop_fields {
        __typename: 'review_var_pop_fields' | null;
        rating?: Maybe<ScalarsEnums['Float']>;
        vote?: Maybe<ScalarsEnums['Float']>;
    }
    export interface review_var_samp_fields {
        __typename: 'review_var_samp_fields' | null;
        rating?: Maybe<ScalarsEnums['Float']>;
        vote?: Maybe<ScalarsEnums['Float']>;
    }
    export interface review_variance_fields {
        __typename: 'review_variance_fields' | null;
        rating?: Maybe<ScalarsEnums['Float']>;
        vote?: Maybe<ScalarsEnums['Float']>;
    }
    export interface setting {
        __typename: 'setting' | null;
        created_at?: Maybe<ScalarsEnums['timestamptz']>;
        id: ScalarsEnums['uuid'];
        key: ScalarsEnums['String'];
        updated_at?: Maybe<ScalarsEnums['timestamptz']>;
        value: (args?: {
            path?: Maybe<ScalarsEnums['String']>;
        }) => ScalarsEnums['jsonb'];
    }
    export interface setting_aggregate {
        __typename: 'setting_aggregate' | null;
        aggregate?: Maybe<setting_aggregate_fields>;
        nodes: Array<setting>;
    }
    export interface setting_aggregate_fields {
        __typename: 'setting_aggregate_fields' | null;
        count: (args?: {
            columns?: Maybe<Array<ScalarsEnums['setting_select_column']>>;
            distinct?: Maybe<ScalarsEnums['Boolean']>;
        }) => Maybe<ScalarsEnums['Int']>;
        max?: Maybe<setting_max_fields>;
        min?: Maybe<setting_min_fields>;
    }
    export interface setting_max_fields {
        __typename: 'setting_max_fields' | null;
        created_at?: Maybe<ScalarsEnums['timestamptz']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        key?: Maybe<ScalarsEnums['String']>;
        updated_at?: Maybe<ScalarsEnums['timestamptz']>;
    }
    export interface setting_min_fields {
        __typename: 'setting_min_fields' | null;
        created_at?: Maybe<ScalarsEnums['timestamptz']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        key?: Maybe<ScalarsEnums['String']>;
        updated_at?: Maybe<ScalarsEnums['timestamptz']>;
    }
    export interface setting_mutation_response {
        __typename: 'setting_mutation_response' | null;
        affected_rows: ScalarsEnums['Int'];
        returning: Array<setting>;
    }
    export interface tag {
        __typename: 'tag' | null;
        alternates: (args?: {
            path?: Maybe<ScalarsEnums['String']>;
        }) => Maybe<ScalarsEnums['jsonb']>;
        categories: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['tag_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<tag_tag_order_by>>;
            where?: Maybe<tag_tag_bool_exp>;
        }) => Array<tag_tag>;
        categories_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['tag_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<tag_tag_order_by>>;
            where?: Maybe<tag_tag_bool_exp>;
        }) => tag_tag_aggregate;
        created_at: ScalarsEnums['timestamptz'];
        default_image?: Maybe<ScalarsEnums['String']>;
        default_images: (args?: {
            path?: Maybe<ScalarsEnums['String']>;
        }) => Maybe<ScalarsEnums['jsonb']>;
        description?: Maybe<ScalarsEnums['String']>;
        displayName?: Maybe<ScalarsEnums['String']>;
        frequency?: Maybe<ScalarsEnums['Int']>;
        icon?: Maybe<ScalarsEnums['String']>;
        id: ScalarsEnums['uuid'];
        is_ambiguous: ScalarsEnums['Boolean'];
        misc: (args?: {
            path?: Maybe<ScalarsEnums['String']>;
        }) => Maybe<ScalarsEnums['jsonb']>;
        name: ScalarsEnums['String'];
        order: ScalarsEnums['Int'];
        parent?: Maybe<tag>;
        parentId?: Maybe<ScalarsEnums['uuid']>;
        popularity?: Maybe<ScalarsEnums['Int']>;
        restaurant_taxonomies: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_tag_order_by>>;
            where?: Maybe<restaurant_tag_bool_exp>;
        }) => Array<restaurant_tag>;
        restaurant_taxonomies_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['restaurant_tag_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<restaurant_tag_order_by>>;
            where?: Maybe<restaurant_tag_bool_exp>;
        }) => restaurant_tag_aggregate;
        rgb: (args?: {
            path?: Maybe<ScalarsEnums['String']>;
        }) => Maybe<ScalarsEnums['jsonb']>;
        slug?: Maybe<ScalarsEnums['String']>;
        type?: Maybe<ScalarsEnums['String']>;
        updated_at: ScalarsEnums['timestamptz'];
    }
    export interface tag_aggregate {
        __typename: 'tag_aggregate' | null;
        aggregate?: Maybe<tag_aggregate_fields>;
        nodes: Array<tag>;
    }
    export interface tag_aggregate_fields {
        __typename: 'tag_aggregate_fields' | null;
        avg?: Maybe<tag_avg_fields>;
        count: (args?: {
            columns?: Maybe<Array<ScalarsEnums['tag_select_column']>>;
            distinct?: Maybe<ScalarsEnums['Boolean']>;
        }) => Maybe<ScalarsEnums['Int']>;
        max?: Maybe<tag_max_fields>;
        min?: Maybe<tag_min_fields>;
        stddev?: Maybe<tag_stddev_fields>;
        stddev_pop?: Maybe<tag_stddev_pop_fields>;
        stddev_samp?: Maybe<tag_stddev_samp_fields>;
        sum?: Maybe<tag_sum_fields>;
        var_pop?: Maybe<tag_var_pop_fields>;
        var_samp?: Maybe<tag_var_samp_fields>;
        variance?: Maybe<tag_variance_fields>;
    }
    export interface tag_avg_fields {
        __typename: 'tag_avg_fields' | null;
        frequency?: Maybe<ScalarsEnums['Float']>;
        order?: Maybe<ScalarsEnums['Float']>;
        popularity?: Maybe<ScalarsEnums['Float']>;
    }
    export interface tag_max_fields {
        __typename: 'tag_max_fields' | null;
        created_at?: Maybe<ScalarsEnums['timestamptz']>;
        default_image?: Maybe<ScalarsEnums['String']>;
        description?: Maybe<ScalarsEnums['String']>;
        displayName?: Maybe<ScalarsEnums['String']>;
        frequency?: Maybe<ScalarsEnums['Int']>;
        icon?: Maybe<ScalarsEnums['String']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        name?: Maybe<ScalarsEnums['String']>;
        order?: Maybe<ScalarsEnums['Int']>;
        parentId?: Maybe<ScalarsEnums['uuid']>;
        popularity?: Maybe<ScalarsEnums['Int']>;
        slug?: Maybe<ScalarsEnums['String']>;
        type?: Maybe<ScalarsEnums['String']>;
        updated_at?: Maybe<ScalarsEnums['timestamptz']>;
    }
    export interface tag_min_fields {
        __typename: 'tag_min_fields' | null;
        created_at?: Maybe<ScalarsEnums['timestamptz']>;
        default_image?: Maybe<ScalarsEnums['String']>;
        description?: Maybe<ScalarsEnums['String']>;
        displayName?: Maybe<ScalarsEnums['String']>;
        frequency?: Maybe<ScalarsEnums['Int']>;
        icon?: Maybe<ScalarsEnums['String']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        name?: Maybe<ScalarsEnums['String']>;
        order?: Maybe<ScalarsEnums['Int']>;
        parentId?: Maybe<ScalarsEnums['uuid']>;
        popularity?: Maybe<ScalarsEnums['Int']>;
        slug?: Maybe<ScalarsEnums['String']>;
        type?: Maybe<ScalarsEnums['String']>;
        updated_at?: Maybe<ScalarsEnums['timestamptz']>;
    }
    export interface tag_mutation_response {
        __typename: 'tag_mutation_response' | null;
        affected_rows: ScalarsEnums['Int'];
        returning: Array<tag>;
    }
    export interface tag_stddev_fields {
        __typename: 'tag_stddev_fields' | null;
        frequency?: Maybe<ScalarsEnums['Float']>;
        order?: Maybe<ScalarsEnums['Float']>;
        popularity?: Maybe<ScalarsEnums['Float']>;
    }
    export interface tag_stddev_pop_fields {
        __typename: 'tag_stddev_pop_fields' | null;
        frequency?: Maybe<ScalarsEnums['Float']>;
        order?: Maybe<ScalarsEnums['Float']>;
        popularity?: Maybe<ScalarsEnums['Float']>;
    }
    export interface tag_stddev_samp_fields {
        __typename: 'tag_stddev_samp_fields' | null;
        frequency?: Maybe<ScalarsEnums['Float']>;
        order?: Maybe<ScalarsEnums['Float']>;
        popularity?: Maybe<ScalarsEnums['Float']>;
    }
    export interface tag_sum_fields {
        __typename: 'tag_sum_fields' | null;
        frequency?: Maybe<ScalarsEnums['Int']>;
        order?: Maybe<ScalarsEnums['Int']>;
        popularity?: Maybe<ScalarsEnums['Int']>;
    }
    export interface tag_tag {
        __typename: 'tag_tag' | null;
        category: tag;
        category_tag_id: ScalarsEnums['uuid'];
        main: tag;
        tag_id: ScalarsEnums['uuid'];
    }
    export interface tag_tag_aggregate {
        __typename: 'tag_tag_aggregate' | null;
        aggregate?: Maybe<tag_tag_aggregate_fields>;
        nodes: Array<tag_tag>;
    }
    export interface tag_tag_aggregate_fields {
        __typename: 'tag_tag_aggregate_fields' | null;
        count: (args?: {
            columns?: Maybe<Array<ScalarsEnums['tag_tag_select_column']>>;
            distinct?: Maybe<ScalarsEnums['Boolean']>;
        }) => Maybe<ScalarsEnums['Int']>;
        max?: Maybe<tag_tag_max_fields>;
        min?: Maybe<tag_tag_min_fields>;
    }
    export interface tag_tag_max_fields {
        __typename: 'tag_tag_max_fields' | null;
        category_tag_id?: Maybe<ScalarsEnums['uuid']>;
        tag_id?: Maybe<ScalarsEnums['uuid']>;
    }
    export interface tag_tag_min_fields {
        __typename: 'tag_tag_min_fields' | null;
        category_tag_id?: Maybe<ScalarsEnums['uuid']>;
        tag_id?: Maybe<ScalarsEnums['uuid']>;
    }
    export interface tag_tag_mutation_response {
        __typename: 'tag_tag_mutation_response' | null;
        affected_rows: ScalarsEnums['Int'];
        returning: Array<tag_tag>;
    }
    export interface tag_var_pop_fields {
        __typename: 'tag_var_pop_fields' | null;
        frequency?: Maybe<ScalarsEnums['Float']>;
        order?: Maybe<ScalarsEnums['Float']>;
        popularity?: Maybe<ScalarsEnums['Float']>;
    }
    export interface tag_var_samp_fields {
        __typename: 'tag_var_samp_fields' | null;
        frequency?: Maybe<ScalarsEnums['Float']>;
        order?: Maybe<ScalarsEnums['Float']>;
        popularity?: Maybe<ScalarsEnums['Float']>;
    }
    export interface tag_variance_fields {
        __typename: 'tag_variance_fields' | null;
        frequency?: Maybe<ScalarsEnums['Float']>;
        order?: Maybe<ScalarsEnums['Float']>;
        popularity?: Maybe<ScalarsEnums['Float']>;
    }
    export interface user {
        __typename: 'user' | null;
        about?: Maybe<ScalarsEnums['String']>;
        apple_email?: Maybe<ScalarsEnums['String']>;
        apple_refresh_token?: Maybe<ScalarsEnums['String']>;
        apple_token?: Maybe<ScalarsEnums['String']>;
        apple_uid?: Maybe<ScalarsEnums['String']>;
        avatar?: Maybe<ScalarsEnums['String']>;
        charIndex: ScalarsEnums['Int'];
        created_at: ScalarsEnums['timestamptz'];
        email?: Maybe<ScalarsEnums['String']>;
        has_onboarded: ScalarsEnums['Boolean'];
        id: ScalarsEnums['uuid'];
        lists: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_order_by>>;
            where?: Maybe<list_bool_exp>;
        }) => Array<list>;
        lists_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['list_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<list_order_by>>;
            where?: Maybe<list_bool_exp>;
        }) => list_aggregate;
        location?: Maybe<ScalarsEnums['String']>;
        name?: Maybe<ScalarsEnums['String']>;
        password: ScalarsEnums['String'];
        password_reset_date?: Maybe<ScalarsEnums['timestamptz']>;
        password_reset_token?: Maybe<ScalarsEnums['String']>;
        reviews: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['review_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<review_order_by>>;
            where?: Maybe<review_bool_exp>;
        }) => Array<review>;
        reviews_aggregate: (args?: {
            distinct_on?: Maybe<Array<ScalarsEnums['review_select_column']>>;
            limit?: Maybe<ScalarsEnums['Int']>;
            offset?: Maybe<ScalarsEnums['Int']>;
            order_by?: Maybe<Array<review_order_by>>;
            where?: Maybe<review_bool_exp>;
        }) => review_aggregate;
        role?: Maybe<ScalarsEnums['String']>;
        updated_at: ScalarsEnums['timestamptz'];
        username: ScalarsEnums['String'];
    }
    export interface user_aggregate {
        __typename: 'user_aggregate' | null;
        aggregate?: Maybe<user_aggregate_fields>;
        nodes: Array<user>;
    }
    export interface user_aggregate_fields {
        __typename: 'user_aggregate_fields' | null;
        avg?: Maybe<user_avg_fields>;
        count: (args?: {
            columns?: Maybe<Array<ScalarsEnums['user_select_column']>>;
            distinct?: Maybe<ScalarsEnums['Boolean']>;
        }) => Maybe<ScalarsEnums['Int']>;
        max?: Maybe<user_max_fields>;
        min?: Maybe<user_min_fields>;
        stddev?: Maybe<user_stddev_fields>;
        stddev_pop?: Maybe<user_stddev_pop_fields>;
        stddev_samp?: Maybe<user_stddev_samp_fields>;
        sum?: Maybe<user_sum_fields>;
        var_pop?: Maybe<user_var_pop_fields>;
        var_samp?: Maybe<user_var_samp_fields>;
        variance?: Maybe<user_variance_fields>;
    }
    export interface user_avg_fields {
        __typename: 'user_avg_fields' | null;
        charIndex?: Maybe<ScalarsEnums['Float']>;
    }
    export interface user_max_fields {
        __typename: 'user_max_fields' | null;
        about?: Maybe<ScalarsEnums['String']>;
        apple_email?: Maybe<ScalarsEnums['String']>;
        apple_refresh_token?: Maybe<ScalarsEnums['String']>;
        apple_token?: Maybe<ScalarsEnums['String']>;
        apple_uid?: Maybe<ScalarsEnums['String']>;
        avatar?: Maybe<ScalarsEnums['String']>;
        charIndex?: Maybe<ScalarsEnums['Int']>;
        created_at?: Maybe<ScalarsEnums['timestamptz']>;
        email?: Maybe<ScalarsEnums['String']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        location?: Maybe<ScalarsEnums['String']>;
        name?: Maybe<ScalarsEnums['String']>;
        password?: Maybe<ScalarsEnums['String']>;
        password_reset_date?: Maybe<ScalarsEnums['timestamptz']>;
        password_reset_token?: Maybe<ScalarsEnums['String']>;
        role?: Maybe<ScalarsEnums['String']>;
        updated_at?: Maybe<ScalarsEnums['timestamptz']>;
        username?: Maybe<ScalarsEnums['String']>;
    }
    export interface user_min_fields {
        __typename: 'user_min_fields' | null;
        about?: Maybe<ScalarsEnums['String']>;
        apple_email?: Maybe<ScalarsEnums['String']>;
        apple_refresh_token?: Maybe<ScalarsEnums['String']>;
        apple_token?: Maybe<ScalarsEnums['String']>;
        apple_uid?: Maybe<ScalarsEnums['String']>;
        avatar?: Maybe<ScalarsEnums['String']>;
        charIndex?: Maybe<ScalarsEnums['Int']>;
        created_at?: Maybe<ScalarsEnums['timestamptz']>;
        email?: Maybe<ScalarsEnums['String']>;
        id?: Maybe<ScalarsEnums['uuid']>;
        location?: Maybe<ScalarsEnums['String']>;
        name?: Maybe<ScalarsEnums['String']>;
        password?: Maybe<ScalarsEnums['String']>;
        password_reset_date?: Maybe<ScalarsEnums['timestamptz']>;
        password_reset_token?: Maybe<ScalarsEnums['String']>;
        role?: Maybe<ScalarsEnums['String']>;
        updated_at?: Maybe<ScalarsEnums['timestamptz']>;
        username?: Maybe<ScalarsEnums['String']>;
    }
    export interface user_mutation_response {
        __typename: 'user_mutation_response' | null;
        affected_rows: ScalarsEnums['Int'];
        returning: Array<user>;
    }
    export interface user_stddev_fields {
        __typename: 'user_stddev_fields' | null;
        charIndex?: Maybe<ScalarsEnums['Float']>;
    }
    export interface user_stddev_pop_fields {
        __typename: 'user_stddev_pop_fields' | null;
        charIndex?: Maybe<ScalarsEnums['Float']>;
    }
    export interface user_stddev_samp_fields {
        __typename: 'user_stddev_samp_fields' | null;
        charIndex?: Maybe<ScalarsEnums['Float']>;
    }
    export interface user_sum_fields {
        __typename: 'user_sum_fields' | null;
        charIndex?: Maybe<ScalarsEnums['Int']>;
    }
    export interface user_var_pop_fields {
        __typename: 'user_var_pop_fields' | null;
        charIndex?: Maybe<ScalarsEnums['Float']>;
    }
    export interface user_var_samp_fields {
        __typename: 'user_var_samp_fields' | null;
        charIndex?: Maybe<ScalarsEnums['Float']>;
    }
    export interface user_variance_fields {
        __typename: 'user_variance_fields' | null;
        charIndex?: Maybe<ScalarsEnums['Float']>;
    }
    export interface zcta5 {
        __typename: 'zcta5' | null;
        color?: Maybe<ScalarsEnums['String']>;
        intptlat10?: Maybe<ScalarsEnums['String']>;
        intptlon10?: Maybe<ScalarsEnums['String']>;
        nhood?: Maybe<ScalarsEnums['String']>;
        ogc_fid: ScalarsEnums['Int'];
        slug?: Maybe<ScalarsEnums['String']>;
        wkb_geometry?: Maybe<ScalarsEnums['geometry']>;
    }
    export interface zcta5_aggregate {
        __typename: 'zcta5_aggregate' | null;
        aggregate?: Maybe<zcta5_aggregate_fields>;
        nodes: Array<zcta5>;
    }
    export interface zcta5_aggregate_fields {
        __typename: 'zcta5_aggregate_fields' | null;
        avg?: Maybe<zcta5_avg_fields>;
        count: (args?: {
            columns?: Maybe<Array<ScalarsEnums['zcta5_select_column']>>;
            distinct?: Maybe<ScalarsEnums['Boolean']>;
        }) => Maybe<ScalarsEnums['Int']>;
        max?: Maybe<zcta5_max_fields>;
        min?: Maybe<zcta5_min_fields>;
        stddev?: Maybe<zcta5_stddev_fields>;
        stddev_pop?: Maybe<zcta5_stddev_pop_fields>;
        stddev_samp?: Maybe<zcta5_stddev_samp_fields>;
        sum?: Maybe<zcta5_sum_fields>;
        var_pop?: Maybe<zcta5_var_pop_fields>;
        var_samp?: Maybe<zcta5_var_samp_fields>;
        variance?: Maybe<zcta5_variance_fields>;
    }
    export interface zcta5_avg_fields {
        __typename: 'zcta5_avg_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface zcta5_max_fields {
        __typename: 'zcta5_max_fields' | null;
        color?: Maybe<ScalarsEnums['String']>;
        intptlat10?: Maybe<ScalarsEnums['String']>;
        intptlon10?: Maybe<ScalarsEnums['String']>;
        nhood?: Maybe<ScalarsEnums['String']>;
        ogc_fid?: Maybe<ScalarsEnums['Int']>;
        slug?: Maybe<ScalarsEnums['String']>;
    }
    export interface zcta5_min_fields {
        __typename: 'zcta5_min_fields' | null;
        color?: Maybe<ScalarsEnums['String']>;
        intptlat10?: Maybe<ScalarsEnums['String']>;
        intptlon10?: Maybe<ScalarsEnums['String']>;
        nhood?: Maybe<ScalarsEnums['String']>;
        ogc_fid?: Maybe<ScalarsEnums['Int']>;
        slug?: Maybe<ScalarsEnums['String']>;
    }
    export interface zcta5_mutation_response {
        __typename: 'zcta5_mutation_response' | null;
        affected_rows: ScalarsEnums['Int'];
        returning: Array<zcta5>;
    }
    export interface zcta5_stddev_fields {
        __typename: 'zcta5_stddev_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface zcta5_stddev_pop_fields {
        __typename: 'zcta5_stddev_pop_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface zcta5_stddev_samp_fields {
        __typename: 'zcta5_stddev_samp_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface zcta5_sum_fields {
        __typename: 'zcta5_sum_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Int']>;
    }
    export interface zcta5_var_pop_fields {
        __typename: 'zcta5_var_pop_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface zcta5_var_samp_fields {
        __typename: 'zcta5_var_samp_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface zcta5_variance_fields {
        __typename: 'zcta5_variance_fields' | null;
        ogc_fid?: Maybe<ScalarsEnums['Float']>;
    }
    export interface GeneratedSchema {
        query: Query;
        mutation: Mutation;
        subscription: Subscription;
    }
    export type MakeNullable<T> = {
        [K in keyof T]: T[K] | null;
    };
    export interface ScalarsEnums extends MakeNullable<Scalars> {
        hrr_constraint: hrr_constraint | null;
        hrr_select_column: hrr_select_column | null;
        hrr_update_column: hrr_update_column | null;
        list_constraint: list_constraint | null;
        list_restaurant_constraint: list_restaurant_constraint | null;
        list_restaurant_select_column: list_restaurant_select_column | null;
        list_restaurant_tag_constraint: list_restaurant_tag_constraint | null;
        list_restaurant_tag_select_column: list_restaurant_tag_select_column | null;
        list_restaurant_tag_update_column: list_restaurant_tag_update_column | null;
        list_restaurant_update_column: list_restaurant_update_column | null;
        list_select_column: list_select_column | null;
        list_tag_constraint: list_tag_constraint | null;
        list_tag_select_column: list_tag_select_column | null;
        list_tag_update_column: list_tag_update_column | null;
        list_update_column: list_update_column | null;
        menu_item_constraint: menu_item_constraint | null;
        menu_item_select_column: menu_item_select_column | null;
        menu_item_update_column: menu_item_update_column | null;
        nhood_labels_constraint: nhood_labels_constraint | null;
        nhood_labels_select_column: nhood_labels_select_column | null;
        nhood_labels_update_column: nhood_labels_update_column | null;
        opening_hours_constraint: opening_hours_constraint | null;
        opening_hours_select_column: opening_hours_select_column | null;
        opening_hours_update_column: opening_hours_update_column | null;
        order_by: order_by | null;
        photo_constraint: photo_constraint | null;
        photo_select_column: photo_select_column | null;
        photo_update_column: photo_update_column | null;
        photo_xref_constraint: photo_xref_constraint | null;
        photo_xref_select_column: photo_xref_select_column | null;
        photo_xref_update_column: photo_xref_update_column | null;
        restaurant_constraint: restaurant_constraint | null;
        restaurant_select_column: restaurant_select_column | null;
        restaurant_tag_constraint: restaurant_tag_constraint | null;
        restaurant_tag_select_column: restaurant_tag_select_column | null;
        restaurant_tag_update_column: restaurant_tag_update_column | null;
        restaurant_update_column: restaurant_update_column | null;
        review_constraint: review_constraint | null;
        review_select_column: review_select_column | null;
        review_tag_sentence_constraint: review_tag_sentence_constraint | null;
        review_tag_sentence_select_column: review_tag_sentence_select_column | null;
        review_tag_sentence_update_column: review_tag_sentence_update_column | null;
        review_update_column: review_update_column | null;
        setting_constraint: setting_constraint | null;
        setting_select_column: setting_select_column | null;
        setting_update_column: setting_update_column | null;
        tag_constraint: tag_constraint | null;
        tag_select_column: tag_select_column | null;
        tag_tag_constraint: tag_tag_constraint | null;
        tag_tag_select_column: tag_tag_select_column | null;
        tag_tag_update_column: tag_tag_update_column | null;
        tag_update_column: tag_update_column | null;
        user_constraint: user_constraint | null;
        user_select_column: user_select_column | null;
        user_update_column: user_update_column | null;
        zcta5_constraint: zcta5_constraint | null;
        zcta5_select_column: zcta5_select_column | null;
        zcta5_update_column: zcta5_update_column | null;
    }
}

declare module "@dish/graph" {
    import { QueryFetcher } from "@dish/gqless";
    export const fetchLog: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>;
    export const queryFetcher: QueryFetcher;
    export const client: {
        query: import("graphql/schema.generated").Query;
        mutation: import("graphql/schema.generated").Mutation;
        subscription: import("graphql/schema.generated").Subscription;
        resolved: <T = unknown>(dataFn: () => T, { refetch, noCache, onCacheData, onSelection }?: import("@dish/gqless").ResolveOptions<T> | undefined) => Promise<T>;
        cache: import("@dish/gqless/dist/Cache").CacheType;
        interceptorManager: {
            interceptors: Set<import("@dish/gqless/dist/Interceptor").Interceptor>;
            globalInterceptor: import("@dish/gqless/dist/Interceptor").Interceptor;
            createInterceptor: () => import("@dish/gqless/dist/Interceptor").Interceptor;
            removeInterceptor: (interceptor: import("@dish/gqless/dist/Interceptor").Interceptor) => void;
            addSelection: (selection: import("@dish/gqless").Selection) => void;
            addSelectionCache: (selection: import("@dish/gqless").Selection) => void;
            addSelectionCacheFound: (selection: import("@dish/gqless").Selection) => void;
            addSelections: (selection: Set<import("@dish/gqless").Selection> | import("@dish/gqless").Selection[]) => void;
            removeSelections: (selections: Set<import("@dish/gqless").Selection> | import("@dish/gqless").Selection[]) => void;
        };
        scheduler: {
            resolving: import("@dish/gqless/dist/Utils").LazyPromise<import("@dish/gqless/dist/Scheduler").SchedulerPromiseValue> | null;
            subscribeResolve: (fn: (promise: Promise<import("@dish/gqless/dist/Scheduler").SchedulerPromiseValue>, selection: import("@dish/gqless").Selection) => void) => () => void;
            errors: {
                map: Map<import("@dish/gqless").Selection, import("@dish/gqless").gqlessError>;
                subscribeErrors: (fn: import("@dish/gqless/dist/Scheduler").ErrorSubscriptionFn) => () => void;
                triggerError: (newError: import("@dish/gqless").gqlessError, selections: import("@dish/gqless").Selection[]) => void;
                removeErrors: (selectionsCleaned: import("@dish/gqless").Selection[]) => void;
                retryPromise: (retryPromise: Promise<{
                    error?: import("@dish/gqless").gqlessError | undefined;
                    data?: unknown;
                }>, selections: Set<import("@dish/gqless").Selection>) => void;
            };
            isFetching: boolean;
            pendingSelectionsGroups: Set<Set<import("@dish/gqless").Selection>>;
            pendingSelectionsGroupsPromises: Map<Set<import("@dish/gqless").Selection>, Promise<import("@dish/gqless/dist/Scheduler").SchedulerPromiseValue>>;
        };
        refetch: <T_1 = void | undefined>(refetchArg: T_1 | (() => T_1)) => Promise<T_1>;
        accessorCache: {
            getAccessor: (selection: import("@dish/gqless").Selection, cacheValue: unknown, proxyFactory: () => import("@dish/gqless/dist/Cache").ProxyAccessor) => import("@dish/gqless/dist/Cache").ProxyAccessor;
            getArrayAccessor: (selection: import("@dish/gqless").Selection, reference: unknown[], proxyFactory: () => import("@dish/gqless/dist/Cache").ProxyAccessor) => import("@dish/gqless/dist/Cache").ProxyAccessor;
            isProxy: (obj: any) => obj is import("@dish/gqless/dist/Cache").ProxyAccessor;
            getProxySelection: (proxy: import("@dish/gqless/dist/Cache").ProxyAccessor) => import("@dish/gqless").Selection | undefined;
            addSelectionToAccessorHistory: (accessor: import("@dish/gqless/dist/Cache").ProxyAccessor, selection: import("@dish/gqless").Selection) => void;
            getSelectionSetHistory: (accessor: import("@dish/gqless/dist/Cache").ProxyAccessor) => Set<import("@dish/gqless").Selection> | undefined;
            addAccessorChild: (parent: import("@dish/gqless/dist/Cache").ProxyAccessor, child: import("@dish/gqless/dist/Cache").ProxyAccessor | null) => void;
        };
        buildAndFetchSelections: <TData = unknown>(selections: import("@dish/gqless").Selection[], type: "query" | "mutation" | "subscription", cache?: {
            cache: import("@dish/gqless/dist/Cache").CacheType;
            getCacheFromSelection: {
                <Value = unknown>(selection: import("@dish/gqless").Selection): Value | typeof import("@dish/gqless/dist/Cache").CacheNotFound;
                <Value_1 = unknown, NotFound = typeof import("@dish/gqless/dist/Cache").CacheNotFound>(selection: import("@dish/gqless").Selection, defaultValue: NotFound): NotFound | Value_1;
            };
            setCacheFromSelection: (selection: import("@dish/gqless").Selection, value: unknown) => void;
            mergeCache: (data: Record<string, unknown>, prefix: "query" | "mutation" | "subscription") => void;
            normalizedCache: Record<string, import("@dish/gqless/dist/Utils").PlainObject | undefined> | undefined;
        } | undefined, options?: import("@dish/gqless/dist/Client/resolvers").FetchResolveOptions | undefined) => Promise<TData | null | undefined>;
        eventHandler: import("@dish/gqless/dist/Events").EventHandler;
        setCache: {
            (selection: import("@dish/gqless").Selection, data: unknown): void;
            <A extends object>(accessor: A, data: import("@dish/gqless").DeepPartial<A> | null | undefined): void;
            <B extends (args?: any) => unknown>(accessor: B, args: Parameters<B>["0"], data: import("@dish/gqless").DeepPartial<ReturnType<B>> | null | undefined): void;
        };
        hydrateCache: ({ cacheSnapshot, shouldRefetch, }: import("@dish/gqless").HydrateCacheOptions) => void;
        prepareRender: (render: () => void | Promise<void>) => Promise<{
            cacheSnapshot: string;
        }>;
        assignSelections: <A_1 extends object, B_1 extends A_1>(source: A_1 | null | undefined, target: B_1 | null | undefined) => void;
        mutate: <T_2>(fn: (mutation: import("graphql/schema.generated").Mutation, helpers: {
            query: import("graphql/schema.generated").Query;
            setCache: {
                (selection: import("@dish/gqless").Selection, data: unknown): void;
                <A_2 extends object>(accessor: A_2, data: import("@dish/gqless").DeepPartial<A_2> | null | undefined): void;
                <B_2 extends (args?: any) => unknown>(accessor: B_2, args: Parameters<B_2>["0"], data: import("@dish/gqless").DeepPartial<ReturnType<B_2>> | null | undefined): void;
            };
            assignSelections: <A_1_1 extends object, B_1_1 extends A_1_1>(source: A_1_1 | null | undefined, target: B_1_1 | null | undefined) => void;
        }) => T_2) => Promise<T_2>;
        buildSelection: (__0_0: "query" | "mutation" | "subscription", ...__0_1: import("@dish/gqless").BuildSelectionValue[]) => import("@dish/gqless").Selection;
    };
    export const query: import("graphql/schema.generated").Query, mutation: import("graphql/schema.generated").Mutation, subscription: import("graphql/schema.generated").Subscription, resolved: <T = unknown>(dataFn: () => T, { refetch, noCache, onCacheData, onSelection }?: import("@dish/gqless").ResolveOptions<T> | undefined) => Promise<T>, refetch: <T_1 = void | undefined>(refetchArg: T_1 | (() => T_1)) => Promise<T_1>, setCache: {
        (selection: import("@dish/gqless").Selection, data: unknown): void;
        <A extends object>(accessor: A, data: import("@dish/gqless").DeepPartial<A> | null | undefined): void;
        <B extends (args?: any) => unknown>(accessor: B, args: Parameters<B>["0"], data: import("@dish/gqless").DeepPartial<ReturnType<B>> | null | undefined): void;
    }, mutate: <T_2>(fn: (mutation: import("graphql/schema.generated").Mutation, helpers: {
        query: import("graphql/schema.generated").Query;
        setCache: {
            (selection: import("@dish/gqless").Selection, data: unknown): void;
            <A extends object>(accessor: A, data: import("@dish/gqless").DeepPartial<A> | null | undefined): void;
            <B extends (args?: any) => unknown>(accessor: B, args: Parameters<B>["0"], data: import("@dish/gqless").DeepPartial<ReturnType<B>> | null | undefined): void;
        };
        assignSelections: <A_1 extends object, B_1 extends A_1>(source: A_1 | null | undefined, target: B_1 | null | undefined) => void;
    }) => T_2) => Promise<T_2>;
}

declare module "@dish/graph" {
    export const graphql: import("@dish/gqless-react/dist/hoc").GraphQLHOC, useQuery: import("@dish/gqless-react/dist/query/useQuery").UseQuery<GeneratedSchema>, useMutation: import("@dish/gqless-react/dist/mutation/useMutation").UseMutation<GeneratedSchema>, useLazyQuery: import("@dish/gqless-react/dist/query/useLazyQuery").UseLazyQuery<GeneratedSchema>, usePolling: import("@dish/gqless-react/dist/query/usePolling").UsePolling, useTransactionQuery: import("@dish/gqless-react/dist/query/useTransactionQuery").UseTransactionQuery<GeneratedSchema>, useRefetch: import("@dish/gqless-react/dist/query/useRefetch").UseRefetch, prepareReactRender: (element: import("react").ReactNode) => Promise<{
        cacheSnapshot: string;
    }>, useHydrateCache: ({ cacheSnapshot, shouldRefetch, }: import("@dish/gqless-react/dist/ssr").UseHydrateCacheOptions) => void;
}

declare module "@dish/graph" {
    export function startLogging(verbose?: boolean): void;
}

declare module "@dish/graph" {
    export type FlatResolvedModel<O> = {
        [K in keyof O]: O[K] extends (...args: any) => any ? ReturnType<O[K]> extends object ? FlatResolvedModel<ReturnType<O[K]>> : ReturnType<O[K]> : O[K] extends object ? FlatResolvedModel<O[K]> : O[K];
    };
    export interface ReviewTagSentenceQuery extends review_tag_sentence {
    }
    export interface RestaurantQuery extends restaurant {
    }
    export interface TagQuery extends tag {
    }
    export interface RestaurantTagQuery extends restaurant_tag {
    }
    export interface TagTagQuery extends tag_tag {
    }
    export interface UserQuery extends user {
    }
    export interface ReviewQuery extends review {
    }
    export interface MenuItemQuery extends menu_item {
    }
    export interface SettingQuery extends setting {
    }
    export interface PhotoBaseQuery extends photo {
    }
    export interface PhotoXrefQuery extends photo_xref {
    }
    export interface ListQuery extends list {
    }
    export interface ReviewTagSentence extends FlatResolvedModel<review_tag_sentence> {
    }
    export interface Restaurant extends FlatResolvedModel<RestaurantQuery> {
    }
    export interface Tag extends FlatResolvedModel<TagQuery> {
    }
    export interface RestaurantTag extends FlatResolvedModel<RestaurantTagQuery> {
    }
    export interface TagTag extends FlatResolvedModel<TagTagQuery> {
    }
    export interface User extends FlatResolvedModel<UserQuery> {
    }
    export interface Review extends FlatResolvedModel<ReviewQuery> {
    }
    export interface MenuItem extends FlatResolvedModel<MenuItemQuery> {
    }
    export interface Setting extends FlatResolvedModel<SettingQuery> {
    }
    export interface PhotoBase extends FlatResolvedModel<PhotoBaseQuery> {
    }
    export interface PhotoXref extends FlatResolvedModel<PhotoXrefQuery> {
    }
    export interface List extends FlatResolvedModel<ListQuery> {
    }
    export interface RestaurantWithId extends WithID<Restaurant> {
    }
    export interface TagWithId extends WithID<Tag> {
    }
    export interface RestaurantTagWithId extends WithID<RestaurantTag> {
    }
    export interface TagTagWithId extends WithID<TagTag> {
    }
    export interface UserWithId extends WithID<User> {
    }
    export interface ReviewWithId extends WithID<Review> {
    }
    export interface MenuItemWithId extends WithID<MenuItem> {
    }
    export interface SettingWithId extends WithID<Setting> {
    }
    export interface ListWithId extends WithID<List> {
    }
    export type ModelType = Restaurant | Tag | RestaurantTag | TagTag | User | Review | MenuItem | PhotoBase | PhotoXref | Setting | List | ReviewTagSentence;
    export type ModelName = Exclude<GetModelTypeName<ModelType>, undefined | null>;
    type GetModelTypeName<U> = U extends ModelType ? U['__typename'] : never;
    export type WithID<A> = A & {
        id: string;
    };
    export type RestaurantTagWithID = Partial<RestaurantTag> & Pick<RestaurantTag, 'tag_id'>;
    export type NonNullObject<A extends Object> = {
        [K in keyof A]: Exclude<A[K], null>;
    };
    export type DeepPartial<T> = T extends Function ? T : T extends Array<infer U> ? _DeepPartialArray<U> : T extends object ? _DeepPartialObject<T> : T | undefined;
    export interface _DeepPartialArray<T> extends Array<DeepPartial<T>> {
    }
    export type _DeepPartialObject<T> = {
        [P in keyof T]?: DeepPartial<T[P]>;
    };
}

declare module "@dish/graph" {
    export type RestaurantOnlyIds = {
        id: string;
        slug: string;
        rish_rank?: number;
        restaurant_rank?: number;
    };
    export type RestaurantOnlyIdsPartial = {
        slug?: RestaurantOnlyIds['slug'] | null;
        id?: RestaurantOnlyIds['id'] | null;
        rish_rank?: number;
        restaurant_rank?: number;
    };
    export type TagType = 'root' | 'lense' | 'filter' | 'continent' | 'country' | 'dish' | 'restaurant' | 'category' | 'orphan';
    export type TagRecord = Partial<Tag> & Pick<Tag, 'type'>;
    export type LngLat = {
        lng: number;
        lat: number;
    };
    export type TopCuisineDish = {
        name: string;
        rating?: number;
        icon?: string;
        count?: number;
        score?: number;
        image: string;
        best_restaurants?: Restaurant[];
        isFallback?: boolean;
        reviews?: Review[];
    };
    export type HomeMeta = {
        query: string;
        tags: string;
        main_tag: string;
        deliveries: string;
        prices: string;
        limit: string;
        scores: {
            highest_score: number;
            weights: {
                rishes: number;
                main_tag: number;
                restaurant_base: number;
                rishes_votes_ratio: number;
                main_tag_votes_ratio: number;
                restaurant_base_votes_ratio: number;
            };
        };
    };
    export type TopCuisine = {
        country: string;
        icon: string;
        frequency: number;
        avg_score: number;
        dishes: TopCuisineDish[];
        top_restaurants: Partial<Restaurant>[];
        tag_slug: string;
        tag_id: string;
    };
    export type MapPosition = {
        center: LngLat;
        span: LngLat;
    };
    export type RestaurantSearchArgs = MapPosition & {
        query: string;
        tags?: string[];
        limit?: number;
        main_tag?: string;
    };
    export type RatingFactors = {
        food: number;
        service: number;
        value: number;
        ambience: number;
    };
    export type Sources = {
        [key: string]: {
            url: string;
            rating: number;
        };
    };
    export type Point = {
        type: string;
        coordinates: [
            number,
            number
        ];
    };
}

declare module "@dish/graph" {
    export type SelectionOptions = {
        select?: (v: any) => unknown;
        keys?: '*' | string[];
        depth?: number;
        query?: any;
    };
    export function resolvedMutation<T extends () => unknown>(resolver: T): Promise<T extends () => {
        returning: infer X;
    } ? X : any>;
    export function resolvedMutationWithFields<T>(resolver: () => T, { keys, select, depth }?: SelectionOptions): Promise<T>;
    export function resolvedWithFields<T extends () => unknown>(resolver: T, { keys, select, depth }?: SelectionOptions): Promise<any>;
    export function resolvedWithoutCache<T>(resolver: () => T): Promise<T>;
}

declare module "@dish/graph" {
    export const isMutatableField: (fieldName: string, typeName: string) => boolean;
    export const isMutatableRelation: (fieldName: string, typeName: string) => boolean;
    export const isMutableReturningField: (name: string) => boolean;
}

declare module "@dish/graph" {
    type scaleUid = Scalars['uuid'];
    export function objectToWhere(hash: {
        [key: string]: any;
    }): any;
    export function createQueryHelpersFor<A extends ModelType>(modelName: ModelName, defaultUpsertConstraint?: string): {
        insert(items: Partial<A>[], opts?: SelectionOptions | undefined): Promise<WithID<A>[]>;
        upsert(items: Partial<A>[], constraint?: string | undefined, opts?: SelectionOptions | undefined): Promise<WithID<A>[]>;
        update(a: WithID<Partial<A>>, opts?: SelectionOptions | undefined): Promise<WithID<WithID<A>>>;
        findOne(a: Partial<A>, opts?: SelectionOptions | undefined): Promise<WithID<A> | null>;
        findAll(a: Partial<A>, opts?: SelectionOptions | undefined): Promise<WithID<A>[]>;
        refresh(a: WithID<A>): Promise<WithID<A>>;
        delete(a: WithID<Partial<A>>): Promise<void>;
    };
    export function findOne<T extends ModelType>(table: ModelName, hash: Partial<T>, opts?: SelectionOptions): Promise<T | null>;
    export function findAll<T extends ModelType>(table: ModelName, hash: Partial<T>, opts?: SelectionOptions): Promise<T[]>;
    export function insert<T extends ModelType>(table: ModelName, insertObjects: Partial<T>[], opts?: SelectionOptions): Promise<WithID<T>[]>;
    export function upsert<T extends ModelType>(table: ModelName, objectsIn: Partial<T>[], constraint?: string, opts?: SelectionOptions): Promise<WithID<T>[]>;
    export function update<T extends WithID<ModelType>>(table: ModelName, objectIn: T, opts?: SelectionOptions): Promise<WithID<T>>;
    export function deleteAllFuzzyBy(table: ModelName, key: string, value: string): Promise<void>;
    export function deleteAllBy(table: string, key: string, value: string): Promise<void>;
    export function deleteByIDs(table: string, ids: scaleUid[]): Promise<void>;
    export function prepareData<T>(table: string, objects: T[], inputType: '_set_input' | '_insert_input'): T[];
    export function ensureJSONSyntax(json: {}): {};
    export function updateableColumns(table: string, object: any): string[];
}

declare module "@dish/graph" {
    export function flushTestData(): Promise<void>;
}

declare module "@dish/graph" {
    export const tagHelpers = 0;
    export const tagSlug: (tag: Pick<Tag, 'slug'>) => string;
    export const tagSlugWithoutParent: (tag: Tag) => string;
    export const tagSlugWithAndWithoutParent: (tag: Tag) => (import("graphql").Maybe<string | null> | undefined)[];
    export const tagSlugs: (tag: Tag) => string[];
    export const tagIsOrphan: (tag: Tag) => boolean;
    export function getTagNameWithIcon(tag: Tag): string | null;
}

declare module "@dish/graph" {
    export function reviewAnalyze({ restaurantId, text, }: {
        text: string;
        restaurantId: string;
    }): Promise<any>;
}

declare module "@dish/graph" {
    export function levenshteinDistance(a: string, b: string): any;
}

declare module "@dish/graph" {
    export function slugify(text?: string | null, separator?: string): any;
}

declare module "@dish/graph" {
    export const listInsert: (items: Partial<List>[], opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<List>[]>;
    export const listUpsert: (items: Partial<List>[], constraint?: string | undefined, opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<List>[]>;
    export const listUpdate: (a: import("types").WithID<Partial<List>>, opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<import("types").WithID<List>>>;
    export const listFindOne: (a: Partial<List>, opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<List> | null>;
    export const listRefresh: (a: import("types").WithID<List>) => Promise<import("types").WithID<List>>;
}

declare module "@dish/graph" {
    export const menuItemInsert: (items: Partial<MenuItem>[], opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<MenuItem>[]>;
    export const menuItemUpsert: (items: Partial<MenuItem>[], constraint?: string | undefined, opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<MenuItem>[]>;
    export const menuItemUpdate: (a: import("types").WithID<Partial<MenuItem>>, opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<import("types").WithID<MenuItem>>>;
    export const menuItemFindOne: (a: Partial<MenuItem>, opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<MenuItem> | null>;
    export const menuItemFindAll: (a: Partial<MenuItem>, opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<MenuItem>[]>;
    export const menuItemRefresh: (a: import("types").WithID<MenuItem>) => Promise<import("types").WithID<MenuItem>>;
    export const menuItemsUpsertMerge: (items: Partial<MenuItem>[]) => Promise<void>;
}

declare module "@dish/graph" {
    export function restaurantTagUpsert(restaurant_id: string, tags: Partial<RestaurantTag>[], fn?: (returning: restaurant_tag[]) => any[]): Promise<RestaurantWithId>;
}

declare module "@dish/graph" {
    export const tagTagInsert: (items: Partial<TagTag>[], opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<TagTag>[]>;
    export const tagTagUpsert: (items: Partial<TagTag>[], constraint?: string | undefined, opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<TagTag>[]>;
    export const tagTagUpdate: (a: import("types").WithID<Partial<TagTag>>, opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<import("types").WithID<TagTag>>>;
    export const tagTagFindOne: (a: Partial<TagTag>, opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<TagTag> | null>;
    export const tagTagRefresh: (a: import("types").WithID<TagTag>) => Promise<import("types").WithID<TagTag>>;
}

declare module "@dish/graph" {
    export const tagInsert: (items: Partial<Tag>[], opts?: import("helpers/queryResolvers").SelectionOptions | undefined) => Promise<import("types").WithID<Tag>[]>;
    export const tagUpsert: (items: Partial<Tag>[], constraint?: string | undefined, opts?: import("helpers/queryResolvers").SelectionOptions | undefined) => Promise<import("types").WithID<Tag>[]>;
    export const tagUpdate: (a: import("types").WithID<Partial<Tag>>, opts?: import("helpers/queryResolvers").SelectionOptions | undefined) => Promise<import("types").WithID<import("types").WithID<Tag>>>;
    export const tagFindOne: (a: Partial<Tag>, opts?: import("helpers/queryResolvers").SelectionOptions | undefined) => Promise<import("types").WithID<Tag> | null>;
    export const tagDelete: (a: import("types").WithID<Partial<Tag>>) => Promise<void>;
    export const tagRefresh: (a: import("types").WithID<Tag>) => Promise<import("types").WithID<Tag>>;
    export const tagFindOneWithCategories: (tag: Partial<Tag>) => Promise<import("types").WithID<Tag> | null>;
    export function tagGetAllChildren(parents: Pick<Tag, 'id'>[]): Promise<Tag[]>;
    export function tagFindCountryMatches(countries: string[]): Promise<Tag[]>;
    export function tagGetAllGenerics(): Promise<Tag[]>;
    export function tagGetAllCuisinesWithDishes(batch_size: number, page: number): Promise<any>;
    export function tagUpsertCategorizations(tag: TagWithId, category_tag_ids: string[]): Promise<import("types").WithID<import("types").TagTag>[]>;
    export function tagAddAlternate(tag: Tag, alternate: string): void;
}

declare module "@dish/graph" {
    export const restaurantInsert: (items: Partial<Restaurant>[], opts?: SelectionOptions | undefined) => Promise<import("types").WithID<Restaurant>[]>;
    export const restaurantUpsert: (items: Partial<Restaurant>[], constraint?: string | undefined, opts?: SelectionOptions | undefined) => Promise<import("types").WithID<Restaurant>[]>;
    export const restaurantUpdate: (a: import("types").WithID<Partial<Restaurant>>, opts?: SelectionOptions | undefined) => Promise<import("types").WithID<import("types").WithID<Restaurant>>>;
    export const restaurantFindOne: (a: Partial<Restaurant>, opts?: SelectionOptions | undefined) => Promise<import("types").WithID<Restaurant> | null>;
    export const restaurantRefresh: (a: import("types").WithID<Restaurant>) => Promise<import("types").WithID<Restaurant>>;
    export const restaurant_fixture: {
        name: string;
        address: string;
        geocoder_id: string;
        location: {
            type: string;
            coordinates: number[];
        };
    };
    export function restaurantFindOneWithTags(restaurant: Partial<RestaurantWithId>): Promise<import("types").WithID<Restaurant> | null>;
    export function restaurantFindBatch(size: number, previous_id: string, extra_where?: {}): Promise<restaurant[]>;
    export function restaurantFindNear(lat: number, lng: number, distance: number): Promise<restaurant[]>;
    export function restaurantUpsertManyTags(restaurant: RestaurantWithId, restaurant_tags: Partial<RestaurantTag>[], opts?: SelectionOptions): Promise<RestaurantWithId | null>;
    export function restaurantUpsertOrphanTags(restaurant: RestaurantWithId, tag_strings: string[]): Promise<import("types").WithID<import("types").WithID<Restaurant>> | null>;
    export function convertSimpleTagsToRestaurantTags(tag_strings: string[]): Promise<{
        tag_id: any;
    }[]>;
    export function restaurantUpsertRestaurantTags(restaurant: RestaurantWithId, restaurant_tags: Partial<RestaurantTag>[], opts?: SelectionOptions): Promise<import("types").WithID<import("types").WithID<Restaurant>> | null>;
    export function restaurantGetAllPossibleTags(restaurant: Restaurant): Promise<import("types").Tag[]>;
}

declare module "@dish/graph" {
    export type uuid = Scalars['uuid'];
    export const reviewInsert: (items: Partial<Review>[], opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<Review>[]>;
    export const reviewUpsert: (items: Partial<Review>[], constraint?: string | undefined, opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<Review>[]>;
    export const reviewUpdate: (a: import("types").WithID<Partial<Review>>, opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<import("types").WithID<Review>>>;
    export const reviewFindOne: (a: Partial<Review>, opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<Review> | null>;
    export const reviewRefresh: (a: import("types").WithID<Review>) => Promise<import("types").WithID<Review>>;
    export const reviewDelete: (a: import("types").WithID<Partial<Review>>) => Promise<void>;
}

declare module "@dish/graph" {
    export type RestaurantItemMeta = {
        effective_score: number;
        main_tag_normalised_score: number;
        main_tag_rank: number;
        main_tag_votes_ratio_normalised_score: number;
        main_tag_votes_ratio_rank: number;
        restaurant_base_normalised_score: number;
        restaurant_base_votes_ratio_normalised_score: number;
        restaurant_base_votes_ratio_rank: number;
        restaurant_rank: number;
        rish_rank: number;
        rishes_normalised_score: number;
        rishes_votes_ratio_normalised_score: number;
        rishes_votes_ratio_rank: number;
    };
    export type RestaurantSearchItem = RestaurantOnlyIds & {
        meta: RestaurantItemMeta;
        isPlaceholder?: boolean;
    };
    export type SearchResults = {
        restaurants: RestaurantSearchItem[];
        meta: HomeMeta;
        name_matches: null | RestaurantOnlyIds[];
        tags: null | string[];
        text_matches: null | RestaurantOnlyIds[];
    };
    export function search({ center: { lat, lng }, span, query, tags, limit, main_tag, }: RestaurantSearchArgs): Promise<SearchResults>;
}

declare module "@dish/graph" {
    export const settingInsert: (items: Partial<Setting>[], opts?: import("helpers/queryResolvers").SelectionOptions | undefined) => Promise<WithID<Setting>[]>;
    export const settingUpsert: (items: Partial<Setting>[], constraint?: string | undefined, opts?: import("helpers/queryResolvers").SelectionOptions | undefined) => Promise<WithID<Setting>[]>;
    export const _settingFindOne: (a: Partial<Setting>, opts?: import("helpers/queryResolvers").SelectionOptions | undefined) => Promise<WithID<Setting> | null>;
    export function settingFindOne(requested_setting: Partial<Setting>): Promise<Setting | null>;
    export function settingGet(key: string): Promise<any>;
    export function settingSet(key: string, value: any): Promise<void>;
}

declare module "@dish/graph" {
    export const userInsert: (items: Partial<User>[], opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<User>[]>;
    export const userUpsert: (items: Partial<User>[], constraint?: string | undefined, opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<User>[]>;
    export const userUpdate: (a: import("types").WithID<Partial<User>>, opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<import("types").WithID<User>>>;
    export const userFindOne: (a: Partial<User>, opts?: import("index").SelectionOptions | undefined) => Promise<import("types").WithID<User> | null>;
    export const userRefresh: (a: import("types").WithID<User>) => Promise<import("types").WithID<User>>;
}

declare module "@dish/graph" {
    import "isomorphic-unfetch";
}

declare module "@dish/graph" {
    export const allFieldsForTable: (table: ModelName) => string[];
}
//# sourceMappingURL=types.d.ts.map
