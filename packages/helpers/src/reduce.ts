export function reduce<A extends { [key: string]: any }>(
  obj: A,
  transform: (key: keyof A, val: any) => any
): {
  [key in keyof A]: any
} {
  // @ts-expect-error
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, transform(k, v)]))
}
