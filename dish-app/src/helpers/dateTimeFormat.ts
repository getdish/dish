export const dateTimeFormat = (
  date?: number | Date | null,
  {
    locales = ['en'],
    ...rest
  }: any & {
    locales?: string | string[] | undefined
  } = {}
) => {
  if (!date) {
    return null
  }
  if (process.env.TARGET === 'native') {
    global['Intl'] = require('@formatjs/intl-datetimeformat')
    console.log('date time import')
  }
  return ''
  // return new Intl.DateTimeFormat(locales, rest).format()
}
