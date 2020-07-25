import { resolved, update } from '@dish/graph'

// startup stuff (can put in some other file eventually)
const queue = new Map<
  any,
  {
    item: Object
    tableName: string
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
      const out = update(tableName, item as any)
      console.log('saving', item, out)
      promises.add(resolved(out))
    }
    Promise.all([...promises]).then((res) => {
      console.log(
        'saved',
        res.map((x) => JSON.stringify(x))
      )
    })
  }, 100)
}
