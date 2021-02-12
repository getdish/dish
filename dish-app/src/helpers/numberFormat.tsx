export function numberFormat(n: number, size?: 'sm') {
  if (size === 'sm') {
    if (n < 950) return n
    if (n < 1100) return '1k'
    return `${Math.round(n / 1000)}k`
  }
  return n.toLocaleString()
}
