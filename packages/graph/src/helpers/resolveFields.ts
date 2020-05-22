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

export function touchToResolveInGQLess<A>(record: A, fields: string[]): A {
  // @ts-ignore
  let one: A = {}
  for (const key of fields) {
    if (typeof record[key] == 'function') {
      if (key == 'tags') {
        one[key] = record[key]().map((x) => ({
          name: x.name,
        }))
      } else {
        one[key] = record[key]()
      }
    } else {
      one[key] = record[key]
    }
  }
  return one
}
