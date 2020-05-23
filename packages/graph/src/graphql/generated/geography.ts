import { ScalarType, TypeData } from 'gqless'

import * as extensions from '../extensions'
import { t_Boolean } from './Boolean'
import { Extension } from './extensionsTypes'
import { geometry_comparison_exp } from './geometry'
import { st_d_within_geography_input } from './st_d_within_geography_input'

/**
 * @name geography
 * @type SCALAR
 */
export type t_geography<T extends any = any> = ScalarType<
  T,
  Extension<'geography'>
>

/**
 * @name geography_cast_exp
 * @type INPUT_OBJECT
 */
export type geography_cast_exp = { geometry?: geometry_comparison_exp | null }

/**
 * @name geography_comparison_exp
 * @type INPUT_OBJECT
 */
export type geography_comparison_exp = {
  _cast?: geography_cast_exp | null
  _eq?: any | null
  _gt?: any | null
  _gte?: any | null
  _in?: any[] | null
  _is_null?: boolean | null
  _lt?: any | null
  _lte?: any | null
  _neq?: any | null
  _nin?: any[] | null
  _st_d_within?: st_d_within_geography_input | null
  _st_intersects?: any | null
}

/**
 * @name geography
 * @type SCALAR
 */
export type geography = TypeData<t_geography>
