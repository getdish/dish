import { ScalarType, TypeData } from 'gqless'

import * as extensions from '../extensions'
import { Extension } from './extensionsTypes'

/**
 * @name Float
 * @type SCALAR
 */
export type t_Float<T extends number = number> = ScalarType<
  T,
  Extension<'Float'>
>

/**
 * @name Float
 * @type SCALAR
 */
export type Float = TypeData<t_Float>
