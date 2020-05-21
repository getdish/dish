import { resolved } from 'gqless'

export async function resolveFields<A>(
  fields: string[],
  cb: () => A
): Promise<A> {
  return await resolved(() => {
    const res = cb()
    for (const key of fields) {
      // touch each key to resolve it in gqless
      res[key]
    }
    return res
  })
}
