import { isEqual } from '@dish/fast-compare'

export const isEqualSubsetShallow = (a: any, b: any) => isEqual(a, b, { maxDepth: 2 })
