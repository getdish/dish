export const relativeTimeFormat = (
  date: number,
  {
    locales,
    unit = 'hours',
    ...rest
  }: Intl.RelativeTimeFormatOptions & {
    locales?: string | string[]
    unit?: Intl.RelativeTimeFormatUnit
  } = {}
) => {
  return new Intl.RelativeTimeFormat(locales, rest).format(date, unit)
}
