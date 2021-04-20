console.log(123)
export const dateTimeFormatter = (
  date?: number | Date | null,
  {
    locales,
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
