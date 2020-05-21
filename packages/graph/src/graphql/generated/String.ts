import { ScalarType, TypeData } from 'gqless'

import * as extensions from '../extensions'
import { t_Boolean } from './Boolean'
import { Extension } from './extensionsTypes'

/**
 * @name String
 * @type SCALAR
 */
export type t_String<T extends string = string> = ScalarType<
  T,
  Extension<'String'>
>

/**
 * @name String_comparison_exp
 * @type INPUT_OBJECT
 */
export type String_comparison_exp = {
  _eq?: string | null
  _gt?: string | null
  _gte?: string | null
  _ilike?: string | null
  _in?: string[] | null
  _is_null?: boolean | null
  _like?: string | null
  _lt?: string | null
  _lte?: string | null
  _neq?: string | null
  _nilike?: string | null
  _nin?: string[] | null
  _nlike?: string | null
  _nsimilar?: string | null
  _similar?: string | null
}

/**
 * @name String
 * @type SCALAR
 */
export type String = TypeData<t_String>
