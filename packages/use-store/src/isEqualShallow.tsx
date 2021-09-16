import { isEqual } from '@dish/fast-compare'

// export const isEqualSubsetShallow = isEqual

// this profiled slower:

export function isEqualSubsetShallow(prev: any, next: any) {
  if (prev === next) return true
  if (!next || !prev) return prev === next
  const aType = typeof prev
  if (aType !== typeof next) return false
  if (aType !== 'object') return prev === next
  for (const k in next) {
    if (prev[k] !== next[k]) return false
  }
  return true
}
