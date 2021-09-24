import { IsEqualOptions, isEqual } from '@dish/fast-compare'

export const isEqualSubsetShallow = (a: any, b: any, opts?: IsEqualOptions) =>
  isEqual(a, b, { maxDepth: 2, ...opts })

export const isEqualStrict = (a: any, b: any) => a === b
