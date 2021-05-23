export const dateTimeFormat = (
  date?: number | Date | null,
  {
    locales = 'en',
    ...rest
  }: any & {
    locales?: string | string[] | undefined
  } = {}
) => {
  if (!date) {
    return null
  }
  if (process.env.TARGET === 'web') {
    return new Intl.DateTimeFormat(locales, rest).format()
  } else {
    const format = require('date-fns').format
    return format(date, 'MM/dd/yyyy')
  }
}
