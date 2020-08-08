import { mutation } from '../graphql/mutation'
import { Setting } from '../types'
import { createQueryHelpersFor, prepareData } from './queryHelpers'
import { resolvedMutationWithFields } from './queryResolvers'

const QueryHelpers = createQueryHelpersFor<Setting>('setting')
export const settingInsert = QueryHelpers.insert
export const settingUpsert = QueryHelpers.upsert
export const _settingFindOne = QueryHelpers.findOne

export async function settingFindOne(
  requested_setting: Setting
): Promise<Setting> {
  if (!requested_setting.key) return {}
  let found_setting: Setting = (await _settingFindOne(requested_setting)) || {}
  if (!found_setting.key) {
    found_setting = await initKey(requested_setting.key)
  }
  return found_setting
}

async function initKey(key: string) {
  await settingInsert([{ key, value: {} }])
  return { key, value: {} }
}

export async function settingGet(key: string) {
  const setting = await settingFindOne({ key: key })
  return setting['value']
}

export async function settingSet(key: string, value: any) {
  const table = 'setting'
  let object = { key, value }
  object = prepareData(table, [object])[0]
  await resolvedMutationWithFields(() => {
    const result = mutation[`update_${table}`]({
      where: {
        key: {
          _eq: key,
        },
      },
      _append: { value },
    })
    return result as Setting[]
  })
}
