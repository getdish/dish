import { getColorsForColor } from '../helpers/getColorsForName'
import { allColors, bgAlt, blue, colorNames } from './colors'

export type MyTheme = typeof dark
export type MyThemes = typeof themes

const baseTheme = {
  color: '#fff',
  colorSecondary: '#ccc',
  colorTertiary: '#777',
  colorQuartenary: '#444',
  shadowColor: `rgba(0,0,0,0.3)`,
  shadowColorLighter: `rgba(0,0,0,0.15)`,
  backgroundColorTransluscent: '#1111155',
  backgroundColorDarker: '#11111',
  backgroundColorTransparent: 'rgba(40,40,200,0)',
  cardBackgroundColor: '#333',
  backgroundColorAlt: bgAlt,
  mapBackground: '#dbdeeb',
  colorAlt: blue,
}

const active: MyTheme = {
  name: 'active',
  ...baseTheme,
  backgroundColor: 'rgb(217, 109, 134)',
  backgroundColorSecondary: 'rgb(217, 109, 134)',
  backgroundColorTertiary: 'rgba(217, 109, 134, 0.85)',
  backgroundColorQuartenary: 'rgba(217, 109, 134, 0.7)',
  borderColor: 'rgb(217, 109, 134)',
  borderColorHover: 'rgb(217, 109, 134)',
}

const darkActive: MyTheme = {
  name: 'active',
  ...baseTheme,
  backgroundColor: 'rgb(17, 10, 13)',
  backgroundColorSecondary: 'rgb(17, 10, 13)',
  backgroundColorTertiary: 'rgba(17, 10, 13, 0.85)',
  backgroundColorQuartenary: 'rgba(17, 10, 13, 0.7)',
  borderColor: 'rgb(17, 10, 13)',
  borderColorHover: 'rgb(17, 10, 13)',
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
  mapBackground: '#151515',
  backgroundColorTransparent: 'rgba(25,25,25,0)',
  backgroundColorAlt: 'rgba(54, 54, 104, 0.39)',
  backgroundColorTransluscent: '#1111155',
  backgroundColorDarker: '#111111',
  colorAlt: '#fff',
  borderColor: '#353535',
  borderColorHover: '#353535',
  color: '#fefefe',
  colorSecondary: '#ddd',
  colorTertiary: '#999',
  colorQuartenary: '#aaa',
  cardBackgroundColor: '#333',
  shadowColor: `rgba(0,0,0,0.4)`,
  shadowColorLighter: `rgba(0,0,0,0.2)`,
}

const dark = {
  name: 'dark',
  ...baseTheme,
  ...darkBase,
  backgroundColor: '#1f1f1f',
  backgroundColorSecondary: '#333',
  backgroundColorTertiary: '#444',
  backgroundColorQuartenary: '#555',
}

const darkTranslucent: MyTheme = {
  name: 'darkTranslucent',
  ...baseTheme,
  ...darkBase,
  backgroundColor: 'rgba(0,0,0,0.7)',
  backgroundColorSecondary: 'rgba(25,25,25,0.5)',
  backgroundColorTertiary: 'rgba(50,50,50,0.25)',
  backgroundColorQuartenary: 'rgba(75,75,75,0.1)',
}

const lightBase = {
  colorAlt: blue,
  backgroundColorTransluscent: '#f2f2f255',
  backgroundColorDarker: '#f2f2f2',
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
  shadowColorLighter: `rgba(0,0,0,0.05)`,
}

const light: MyTheme = {
  name: 'light',
  ...baseTheme,
  ...lightBase,
  backgroundColor: '#fff',
  backgroundColorSecondary: '#f5f5f5',
  backgroundColorTertiary: '#e9e9e9',
  backgroundColorQuartenary: '#d9d9d9',
}

const lightTranslucent: MyTheme = {
  name: 'lightTranslucent',
  ...baseTheme,
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
    ...baseTheme,
    ...lightBase,
    color: colors.darkColor,
    backgroundColor: colors.extraLightColor,
    backgroundColorSecondary: colors.lightColor,
    backgroundColorTertiary: `${colors.lightColor}dd`,
    backgroundColorQuartenary: `${colors.lightColor}bb`,
    borderColor: colors.lightColor,
    backgroundColorAlt: colors.darkColor,
  }
  const darkName = `${name}-dark`
  colorThemes[darkName] = {
    name: darkName,
    ...baseTheme,
    ...lightBase,
    color: colors.extraLightColor,
    backgroundColor: colors.darkColor,
    backgroundColorSecondary: colors.color,
    backgroundColorTertiary: `${colors.darkColor}dd`,
    backgroundColorQuartenary: `${colors.darkColor}bb`,
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
  darkActive,
  error,
  ...colorThemes,
}

if (typeof window !== 'undefined') {
  window['themes'] = window['themes'] || themes
}

export default themes
