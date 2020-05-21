import { ScalarType, TypeData } from 'gqless'

import { Extension } from './extensionsTypes'

/**
 * @name numeric
 * @type SCALAR
 */
export type t_numeric<T extends any = any> = ScalarType<T, Extension<'numeric'>>

/**
 * @name numeric_comparison_exp
 * @type INPUT_OBJECT
 */
export type numeric_comparison_exp = {
  _eq?: any | null
  _gt?: any | null
  _gte?: any | null
  _in?: any[] | null
  _is_null?: boolean | null
  _lt?: any | null
  _lte?: any | null
  _neq?: any | null
  _nin?: any[] | null
}

/**
 * @name numeric
 * @type SCALAR
 */
export type numeric = TypeData<t_numeric>
