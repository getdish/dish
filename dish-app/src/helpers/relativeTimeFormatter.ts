export const relativeTimeFormatter = (
  date: number,
  {
    locales,
    unit,
    ...rest
  }: Intl.RelativeTimeFormatOptions & {
    locales?: string | string[]
    unit?: Intl.RelativeTimeFormatUnit
  } = {}
) => {
  return new Intl.RelativeTimeFormat(locales, rest).format(
    date,
    //@ts-expect-error
    unit
  )
}
