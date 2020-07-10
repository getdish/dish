import { mutation, resolved } from '@dish/graph'

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
    queue.set(model, {
      item: { ...parentAccessor._data },
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
    const now = [...queue.values()]
    queue.clear()
    const promises = new Set<Promise<any>>()
    for (const { tableName, item } of now) {
      const mutate = mutation[`update_${tableName}`]
      if (!mutate) return
      const key = 'id' in item ? 'id' : 'name'
      if (!item[key]) {
        throw new Error(`No valid id? TODO support custom`)
      }
      const args = {
        where: { [key]: { _eq: item[key] } },
        _append: {
          data: item,
        },
      }
      console.log('write', tableName, item, args)
      promises.add(resolved(() => mutate(args).returning))
    }
    Promise.all([...promises]).then((res) => {
      console.log(
        'saved',
        res.map((x) => JSON.stringify(x))
      )
    })
  }, 100)
}
