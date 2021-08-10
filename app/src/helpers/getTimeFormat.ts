import { relativeTimeFormat } from './relativeTimeFormat'

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

const relatime = (elapsed: number) => {
  for (const [unit, amount] of units) {
    if (Math.abs(elapsed) > amount || unit === 'second') {
      const answer = relativeTimeFormat(Math.round(elapsed / amount), {
        locales: 'en',
        style: 'narrow',
        unit,
      })
      if (answer.startsWith('in ')) {
        return answer.replace('in ', '') + ' ago'
      }
      return answer
    }
  }
  return '?'
}
