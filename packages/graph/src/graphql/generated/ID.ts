import { ScalarType, TypeData } from 'gqless'

import { Extension } from './extensionsTypes'

/**
 * @name ID
 * @type SCALAR
 */
export type t_ID<T extends string = string> = ScalarType<T, Extension<'ID'>>

/**
 * @name ID
 * @type SCALAR
 */
export type ID = TypeData<t_ID>
