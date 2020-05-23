import { ScalarType, TypeData } from 'gqless'

import * as extensions from '../extensions'
import { t_Boolean } from './Boolean'
import { Extension } from './extensionsTypes'

/**
 * @name uuid
 * @type SCALAR
 */
export type t_uuid<T extends any = any> = ScalarType<T, Extension<'uuid'>>

/**
 * @name uuid_comparison_exp
 * @type INPUT_OBJECT
 */
export type uuid_comparison_exp = {
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
 * @name uuid
 * @type SCALAR
 */
export type uuid = TypeData<t_uuid>
