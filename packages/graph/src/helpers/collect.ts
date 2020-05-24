export const collect = <A extends any>(object: A, fields: string[]): A => {
  return fields.reduce((acc, cur) => {
    const val = object[cur]
    if (typeof val !== 'function') {
      acc[cur] = val
    }
    return acc
  }, {}) as A
}

export const collectAll = <A extends any>(
  object: A[],
  fields: string[]
): A[] => {
  return object.map((x) => collect(x, fields))
}
