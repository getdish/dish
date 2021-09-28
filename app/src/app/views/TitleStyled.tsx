import { Title as SnackTitle, TitleProps } from 'snackui'

export type FontTheme = 'slab' | 'sans'

export const getFontFamily = (theme?: FontTheme) => (theme === 'sans' ? 'Magnat' : 'WhyteHeavy')

export const getListFontTheme = (listFont?: number | null) => (!listFont ? 'slab' : 'sans')

export const getListFontFamily = (listFont?: number | null) =>
  getFontFamily(getListFontTheme(listFont))

export const TitleStyled = (
  props: TitleProps & {
    fontTheme?: FontTheme
  }
) => {
  return (
    <SnackTitle
      {...props}
      fontFamily={getFontFamily(props.fontTheme)}
      // fontFamily="Magnat"
      className={`font-title ${props.className || ''}`}
    />
  )
}
