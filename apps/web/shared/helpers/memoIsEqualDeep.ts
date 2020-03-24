import { isEqual, IsEqualOptions } from '@o/fast-compare'
import { memo } from 'react'

export function memoIsEqualDeep<A>(a: A, options?: IsEqualOptions): A {
  return (memo(a as any, (a, b) => isEqual(a, b, options)) as unknown) as A
}
