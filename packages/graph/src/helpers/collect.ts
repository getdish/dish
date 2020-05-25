export const collect = <A extends any>(object: A, fields: string[]): A => {
  const record = fields.reduce((acc, cur) => {
    const val = object[cur]
    if (typeof val === 'function') {
      acc[cur] = val()
    } else {
      acc[cur] = val
    }
    return acc
  }, {}) as A
  return record
}

export const collectAll = <A extends any>(
  objects: A[],
  fields: string[]
): A[] => {
  return objects.map((x) => collect(x, fields))
}
