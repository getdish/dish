import { ScalarType, TypeData } from 'gqless'

import { Extension } from './extensionsTypes'

/**
 * @name jsonb
 * @type SCALAR
 */
export type t_jsonb<T extends any = any> = ScalarType<T, Extension<'jsonb'>>

/**
 * @name jsonb_comparison_exp
 * @type INPUT_OBJECT
 */
export type jsonb_comparison_exp = {
  _contained_in?: any | null
  _contains?: any | null
  _eq?: any | null
  _gt?: any | null
  _gte?: any | null
  _has_key?: string | null
  _has_keys_all?: string[] | null
  _has_keys_any?: string[] | null
  _in?: any[] | null
  _is_null?: boolean | null
  _lt?: any | null
  _lte?: any | null
  _neq?: any | null
  _nin?: any[] | null
}

/**
 * @name jsonb
 * @type SCALAR
 */
export type jsonb = TypeData<t_jsonb>
