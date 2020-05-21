import { TypeData } from 'gqless'

import * as extensions from '../extensions'
import { Extension } from './extensionsTypes'
import { t_Float } from './Float'
import { t_geometry } from './geometry'

/**
 * @name st_d_within_input
 * @type INPUT_OBJECT
 */
export type st_d_within_input = { distance: number; from: any }
