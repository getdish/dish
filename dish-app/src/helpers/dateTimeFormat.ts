export const dateTimeFormat = (
  date?: number | Date | null,
  {
    locales = ['en'],
    ...rest
  }: Intl.DateTimeFormatOptions & {
    locales?: string | string[] | undefined
  } = {}
) => {
  if (!date) {
    return null
  }
  return new Intl.DateTimeFormat(locales, rest).format()
}
