import { setting_constraint } from '../graphql'
import { Setting } from '../types'
import { createQueryHelpersFor } from './queryHelpers'

const QueryHelpers = createQueryHelpersFor<Setting>(
  'setting',
  setting_constraint.setting_pkey
)
export const settingUpsert = QueryHelpers.upsert
export const settingFindOne = QueryHelpers.findOne
