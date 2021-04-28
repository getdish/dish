export const relativeTimeFormat = (
  date: number,
  {
    locales,
    unit = 'hours',
    ...rest
  }: any & {
    locales?: string | string[]
    unit?: any
  } = {}
) => {
  if (process.env.TARGET === 'web') {
    return new Intl.RelativeTimeFormat(locales, rest).format(date, unit)
  } else {
    const formatRelative = require('date-fns').formatRelative
    return formatRelative(new Date(), date)
  }
}
