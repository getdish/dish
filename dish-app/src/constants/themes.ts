import { getColorsForColor } from '../helpers/getColorsForName'
import { allColors, bgAlt, blue, colorNames } from './colors'

export type MyTheme = typeof dark
export type MyThemes = typeof themes

const shared = {}

const baseTheme = {
  color: '#fff',
  colorSecondary: '#ccc',
  colorTertiary: '#777',
  colorQuartenary: '#444',
  shadowColor: `rgba(0,0,0,0.3)`,
  backgroundColorTransparent: 'rgba(40,40,200,0)',
  cardBackgroundColor: '#333',
  backgroundColorAlt: bgAlt,
  colorAlt: blue,
}

const active: MyTheme = {
  name: 'active',
  ...baseTheme,
  backgroundColor: 'rgb(152, 88, 255)',
  backgroundColorSecondary: 'rgb(152, 88, 255)',
  backgroundColorTertiary: 'rgba(152, 88, 255, 0.85)',
  backgroundColorQuartenary: 'rgba(152, 88, 255, 0.7)',
  borderColor: 'rgb(142, 78, 245)',
  borderColorHover: 'rgb(132, 68, 235)',
}

const error: MyTheme = {
  name: 'error',
  ...baseTheme,
  backgroundColor: 'rgb(245, 38, 102)',
  backgroundColorSecondary: 'rgb(245, 38, 102)',
  backgroundColorTertiary: 'rgba(245, 38, 102, 0.85)',
  backgroundColorQuartenary: 'rgba(245, 38, 102, 0.7)',
  borderColor: 'rgb(205, 28, 92)',
  borderColorHover: 'rgb(205, 28, 92)',
}

const darkBase = {
  backgroundColorAlt: 'rgba(240, 250, 255, 0.1)',
  colorAlt: '#fff',
  borderColor: '#252525',
  borderColorHover: '#353535',
  color: '#fefefe',
  colorSecondary: '#ccc',
  colorTertiary: '#777',
  colorQuartenary: '#aaa',
  cardBackgroundColor: '#333',
  shadowColor: `rgba(0,0,0,0.7)`,
  backgroundColorTransparent: 'rgba(0,0,0,0)',
}

const dark = {
  name: 'dark',
  ...shared,
  ...darkBase,
  backgroundColor: '#222',
  backgroundColorSecondary: '#333',
  backgroundColorTertiary: '#444',
  backgroundColorQuartenary: '#555',
}

const darkTranslucent: MyTheme = {
  name: 'darkTranslucent',
  ...shared,
  ...darkBase,
  backgroundColor: 'rgba(0,0,0,0.7)',
  backgroundColorSecondary: 'rgba(0,0,0,0.5)',
  backgroundColorTertiary: 'rgba(0,0,0,0.25)',
  backgroundColorQuartenary: 'rgba(0,0,0,0.1)',
}

const lightBase = {
  colorAlt: blue,
  backgroundColorAlt: 'rgb(240, 250, 255)',
  borderColor: '#eee',
  borderColorHover: '#d5d5d5',
  color: '#111',
  colorSecondary: '#444',
  colorTertiary: '#777',
  colorQuartenary: '#aaa',
  cardBackgroundColor: '#fff',
  backgroundColorTransparent: 'rgba(255,255,255,0)',
  shadowColor: `rgba(0,0,0,0.1)`,
}

const light: MyTheme = {
  name: 'light',
  ...shared,
  ...lightBase,
  backgroundColor: '#fff',
  backgroundColorSecondary: '#f2f2f2',
  backgroundColorTertiary: '#e9e9e9',
  backgroundColorQuartenary: '#d9d9d9',
}

const lightTranslucent: MyTheme = {
  name: 'lightTranslucent',
  ...shared,
  ...lightBase,
  backgroundColor: 'rgba(255,255,255,0.85)',
  backgroundColorSecondary: 'rgba(250,250,250,0.85)',
  backgroundColorTertiary: 'rgba(240,240,240,0.85)',
  backgroundColorQuartenary: 'rgba(240,240,240,0.7)',
}

const colorThemes: { [key: string]: MyTheme } = {}

for (const [index, name] of colorNames.entries()) {
  const color = allColors[index]
  const colors = getColorsForColor(color)
  colorThemes[name] = {
    name,
    ...shared,
    ...lightBase,
    color: colors.darkColor,
    backgroundColor: colors.extraLightColor,
    backgroundColorSecondary: colors.lightColor,
    backgroundColorTertiary: `${colors.lightColor}aa`,
    backgroundColorQuartenary: `${colors.lightColor}77`,
    borderColor: colors.lightColor,
    backgroundColorAlt: colors.darkColor,
  }
  colorThemes[`${name}Dark`] = {
    name,
    ...shared,
    ...lightBase,
    color: colors.extraLightColor,
    backgroundColor: colors.darkColor,
    backgroundColorSecondary: colors.color,
    backgroundColorTertiary: `${colors.darkColor}aa`,
    backgroundColorQuartenary: `${colors.darkColor}77`,
    borderColor: colors.color,
    backgroundColorAlt: colors.lightColor,
  }
}

const themes = {
  dark,
  light,
  lightTranslucent,
  darkTranslucent,
  active,
  error,
  ...colorThemes,
}

export default themes
