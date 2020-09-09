import { client, mutation, query, resolved, schema } from '@dish/graph'
import * as React from 'react'

import { searchLocations } from './pages/home/searchLocations'
import { reverseGeocode } from './state/reverseGeocode'

window['React'] = React
window['gqless'] = {
  query,
  mutation,
  schema,
  client,
  resolved,
}
window['query'] = query
window['mutation'] = mutation
window['resolved'] = resolved
window['React'] = React
window['searchLocations'] = searchLocations
window['reverseGeocode'] = reverseGeocode

// startup stuff (can put in some other file eventually)
const queue = new Map<
  any,
  {
    item: Object
    tableName?: string
  }
>()
let cur = null

window['gqlessSetListener'] = function gqlessSetListener(
  fieldAccessor: any,
  value: any
) {
  const parentAccessor = fieldAccessor.parent
  const model = parentAccessor.data
  const fieldName = fieldAccessor.selection.field.name
  updateItem(model, parentAccessor.node.name, fieldName, value, () => {
    const item = {}
    for (const key in parentAccessor.value.data) {
      item[key] = parentAccessor.value.data[key].data
    }
    return item
  })
}

const updateItem = (
  key: string,
  tableName: string,
  keyName: string,
  value: any,
  getDefaultItem?: () => any
) => {
  if (!queue.has(key)) {
    console.log('updateItem', tableName)
    queue.set(key, {
      item: getDefaultItem?.() ?? {},
      tableName,
    })
  }
  const item = queue.get(key)!.item
  item[keyName] = value
  scheduleSet()
}

export const gqlessSet = (tableName: string, item: any) => {
  queue.set({}, { item, tableName })
  scheduleSet()
}

const scheduleSet = () => {
  clearTimeout(cur)
  cur = setTimeout(() => {
    const values = [...queue.values()]
    queue.clear()
    const promises = new Set<Promise<any>>()
    for (const { tableName, item } of values) {
      const mutate = mutation[`update_${tableName}`]
      if (!mutate) return
      const key = 'id' in item ? 'id' : 'name'
      if (!item[key]) {
        throw new Error(`No valid id? TODO support custom`)
      }
      const args = {
        where: { [key]: { _eq: item[key] } },
        _set: {
          ...item,
        },
      }
      console.log('write', tableName, item, args)
      promises.add(resolved(() => mutate(args).affected_rows))
    }
    Promise.all([...promises]).then((res) => {
      console.log(
        'saved',
        res.map((x) => JSON.stringify(x))
      )
    })
  }, 100)
}
