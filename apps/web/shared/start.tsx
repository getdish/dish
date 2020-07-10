import { update } from '@dish/graph'

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
  if (!queue.has(model)) {
    const item = {}
    for (const key in parentAccessor.value.data) {
      item[key] = parentAccessor.value.data[key].data
    }
    queue.set(model, {
      item,
      tableName: parentAccessor.node.name,
    })
  }
  const { item } = queue.get(model)!
  const fieldName = fieldAccessor.selection.field.name
  item[fieldName] = value
  scheduleSet()
}

const scheduleSet = () => {
  clearTimeout(cur)
  cur = setTimeout(() => {
    const values = [...queue.values()]
    queue.clear()
    const promises = new Set<Promise<any>>()
    for (const { tableName, item } of values) {
      console.log('item', item)
      promises.add(update(tableName, item as any))
    }
    Promise.all([...promises]).then((res) => {
      console.log(
        'saved',
        res.map((x) => JSON.stringify(x))
      )
    })
  }, 100)
}
