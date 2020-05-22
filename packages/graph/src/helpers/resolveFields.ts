import { resolved } from 'gqless'

export async function resolveFields<A>(
  fields: string[],
  cb: () => A[]
): Promise<A[]> {
  return await resolved(() => {
    const result = cb()
    if (result.length == 0) return []
    touchToResolveInGQLess<A>(result[0], fields)
    return result
  })
}

export function touchToResolveInGQLess<A>(record: A, fields: string[]) {
  // @ts-ignore
  let one: A = {}
  for (const key of fields) {
    if (typeof record[key] == 'function') {
      one[key] = record[key]()
      if (key == 'tags') {
        one[key] = [{ tag: { name: record[key]()[0].tag.name } }]
      }
    } else {
      one[key] = record[key]
    }
  }
  return one
}
