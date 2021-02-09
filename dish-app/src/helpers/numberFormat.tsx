export function numberFormat(n: number, size?: 'sm') {
  if (size === 'sm') {
    if (n > 950 && n < 1100) {
      return '1k'
    }
    if (n >= 1250) {
      return `${Math.round(n / 1000)}.${Math.round((n % 1000) / 100)}k`
    }
    return n
  }
  return n.toLocaleString()
}
