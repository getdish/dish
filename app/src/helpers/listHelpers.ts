export function promote(items: any[], index: number): any[] {
  const now = [...items]
  const [id] = now.splice(index, 1)
  if (!id) return []
  now.splice(index - 1, 0, id)
  return now
}
