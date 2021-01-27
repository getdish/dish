export function isEqualShallow(a: Object, b: Object) {
  if (!a || !b) return a === b
  if (typeof a !== typeof b) return false
  if (typeof a !== 'object') return a === b
  const ak = Object.keys(a)
  const bk = Object.keys(b)
  if (ak.length !== bk.length) return false
  for (const akey of ak) {
    if (!(akey in b)) return false
    if (a[akey] !== b[akey]) return false
  }
  return true
}
