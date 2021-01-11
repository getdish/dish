export function getTimeFormat(date: Date): string {
  return relatime(Date.now() - +date)
}

const units = [
  ['year', 31536000000],
  ['month', 2628000000],
  ['day', 86400000],
  ['hour', 3600000],
  ['minute', 60000],
  ['second', 1000],
] as const

const rtf = new Intl.RelativeTimeFormat('en', { style: 'narrow' })
const relatime = (elapsed: number) => {
  for (const [unit, amount] of units) {
    if (Math.abs(elapsed) > amount || unit === 'second') {
      return rtf.format(Math.round(elapsed / amount), unit)
    }
  }
}
