import { ScalarType, TypeData } from 'gqless'

import * as extensions from '../extensions'
import { t_Boolean } from './Boolean'
import { Extension } from './extensionsTypes'

/**
 * @name Int
 * @type SCALAR
 */
export type t_Int<T extends number = number> = ScalarType<T, Extension<'Int'>>

/**
 * @name Int_comparison_exp
 * @type INPUT_OBJECT
 */
export type Int_comparison_exp = {
  _eq?: number | null
  _gt?: number | null
  _gte?: number | null
  _in?: number[] | null
  _is_null?: boolean | null
  _lt?: number | null
  _lte?: number | null
  _neq?: number | null
  _nin?: number[] | null
}

/**
 * @name Int
 * @type SCALAR
 */
export type Int = TypeData<t_Int>
