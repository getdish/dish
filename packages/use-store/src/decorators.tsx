import { isEqual } from '@dish/fast-compare'

import { isEqualStrict, isEqualSubsetShallow } from './comparators'

export type ComparisonFn = (a: any, b: any) => boolean

export function compare(comparator: ComparisonFn) {
  return (target: any, propertyKey: string): any => {
    target['_comparators'] = target['_comparators'] || {}
    target['_comparators'][propertyKey] = comparator
  }
}

export const compareStrict = compare(isEqualStrict)
export const compareShallow = compare(isEqualSubsetShallow)
export const compareDeep = compare(isEqual)
