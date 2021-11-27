export type FontTheme = 'slab' | 'sans'

export const getFontFamily = (theme?: FontTheme) => (theme === 'sans' ? '$title' : '$title')

export const getListFontTheme = (listFont?: number | null) => (!listFont ? 'slab' : 'sans')

export const getListFontFamily = (listFont?: number | null) =>
  getFontFamily(getListFontTheme(listFont))
