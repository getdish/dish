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
  return ''
  // return new Intl.RelativeTimeFormat(locales, rest).format(date, unit)
}
