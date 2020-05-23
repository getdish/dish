import { TypeData } from 'gqless'

import * as extensions from '../extensions'
import { t_Boolean } from './Boolean'
import { Extension } from './extensionsTypes'
import { t_Float } from './Float'
import { t_geography } from './geography'

/**
 * @name st_d_within_geography_input
 * @type INPUT_OBJECT
 */
export type st_d_within_geography_input = {
  distance: number
  from: any
  use_spheroid?: boolean | null
}
