import { ScalarType, TypeData } from 'gqless'

import * as extensions from '../extensions'
import { t_Boolean } from './Boolean'
import { Extension } from './extensionsTypes'
import { geography_comparison_exp } from './geography'
import { st_d_within_input } from './st_d_within_input'

/**
 * @name geometry
 * @type SCALAR
 */
export type t_geometry<T extends any = any> = ScalarType<
  T,
  Extension<'geometry'>
>

/**
 * @name geometry_cast_exp
 * @type INPUT_OBJECT
 */
export type geometry_cast_exp = { geography?: geography_comparison_exp | null }

/**
 * @name geometry_comparison_exp
 * @type INPUT_OBJECT
 */
export type geometry_comparison_exp = {
  _cast?: geometry_cast_exp | null
  _eq?: any | null
  _gt?: any | null
  _gte?: any | null
  _in?: any[] | null
  _is_null?: boolean | null
  _lt?: any | null
  _lte?: any | null
  _neq?: any | null
  _nin?: any[] | null
  _st_contains?: any | null
  _st_crosses?: any | null
  _st_d_within?: st_d_within_input | null
  _st_equals?: any | null
  _st_intersects?: any | null
  _st_overlaps?: any | null
  _st_touches?: any | null
  _st_within?: any | null
}

/**
 * @name geometry
 * @type SCALAR
 */
export type geometry = TypeData<t_geometry>
