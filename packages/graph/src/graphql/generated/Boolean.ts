import { ScalarType, TypeData } from 'gqless'

import { Extension } from './extensionsTypes'

/**
 * @name Boolean
 * @type SCALAR
 */
export type t_Boolean<T extends boolean = boolean> = ScalarType<
  T,
  Extension<'Boolean'>
>

/**
 * @name Boolean_comparison_exp
 * @type INPUT_OBJECT
 */
export type Boolean_comparison_exp = {
  _eq?: boolean | null
  _gt?: boolean | null
  _gte?: boolean | null
  _in?: boolean[] | null
  _is_null?: boolean | null
  _lt?: boolean | null
  _lte?: boolean | null
  _neq?: boolean | null
  _nin?: boolean[] | null
}

/**
 * @name Boolean
 * @type SCALAR
 */
export type Boolean = TypeData<t_Boolean>
