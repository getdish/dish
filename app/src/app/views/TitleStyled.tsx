import { Title as SnackTitle, TitleProps } from '@dish/ui'

export type FontTheme = 'slab' | 'sans'

export const getFontFamily = (theme?: FontTheme) => (theme === 'sans' ? '$title' : '$title')

export const getListFontTheme = (listFont?: number | null) => (!listFont ? 'slab' : 'sans')

export const getListFontFamily = (listFont?: number | null) =>
  getFontFamily(getListFontTheme(listFont))

export const TitleStyled = ({
  fontTheme,
  ...props
}: TitleProps & {
  fontTheme?: FontTheme
}) => {
  return (
    <SnackTitle
      {...props}
      fontFamily={getFontFamily(props.fontTheme)}
      className={`font-title ${props.className || ''}`}
    />
  )
}
