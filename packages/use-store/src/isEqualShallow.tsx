export function isEqualSubsetShallow(prev: Object, next: Object) {
  if (!prev || !next) return prev === next
  const aType = typeof prev
  if (aType !== typeof next) return false
  if (aType !== 'object') return prev === next
  for (const k in next) {
    if (prev[k] !== next[k]) return false
  }
  return true
}
