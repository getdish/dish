import { mutation, selectFields, setting } from '../graphql'
import { Setting, WithID } from '../types'
import { createQueryHelpersFor, prepareData } from './queryHelpers'
import { resolvedMutationWithFields } from './queryResolvers'

const QueryHelpers = createQueryHelpersFor<Setting>('setting')
export const settingInsert = QueryHelpers.insert
export const settingUpsert = QueryHelpers.upsert
export const _settingFindOne = QueryHelpers.findOne

export async function settingFindOne(
  requested_setting: Partial<Setting>
): Promise<Setting> {
  console.log(141414)
  if (!requested_setting.key) return {} as Setting
  let found_setting = await _settingFindOne(
    requested_setting,
    (v_s: setting[]) => {
      return v_s.map((v) => {
        return {
          ...selectFields(v, '*', 2),
          value: v.value(),
        }
      })
    }
  )
  if (!found_setting || !found_setting.key) {
    found_setting = await initKey(requested_setting.key)
  }
  return found_setting
}

async function initKey(key: string) {
  console.log('SETTING HELPER: inserting new key for ' + key)
  await settingInsert([{ key, value: {} }])
  return { key, value: {} } as WithID<Setting>
}

export async function settingGet(key: string) {
  const setting = await settingFindOne({ key: key })
  return setting['value']
}

export async function settingSet(key: string, value: any) {
  const table = 'setting'
  let object = { key, value }
  object = prepareData(table, [object], '_set_input')[0]
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
