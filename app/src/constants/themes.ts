import { getColorsForColor } from '../helpers/getColorsForName'
import {
  colors as allColors,
  bgAlt,
  blue,
  blue200,
  blue300,
  blue600,
  colorNames,
  pink,
} from './colors'

export type MyTheme = typeof dark
export type MyThemes = typeof themes

const baseTheme = {
  color: '#ffffff',
  colorSecondary: '#cccccc',
  colorTertiary: '#777777',
  colorQuartenary: '#444',
  shadowColor: `rgba(0,0,0,0.225)`,
  shadowColorLighter: `rgba(0,0,0,0.15)`,
  backgroundColorTransluscent: '#1111133',
  backgroundColorTransluscentHover: '#1111166',
  backgroundColorDarker: '#111111',
  backgroundColorTransparent: 'rgba(40,40,200,0)',
  cardBackgroundColor: '#333333',
  backgroundColorAlt: bgAlt,
  mapBackground: '#EAF9F8',
  colorAlt: blue,
}

const active: MyTheme = {
  name: 'active',
  ...baseTheme,
  color: '#ffffff',
  colorSecondary: '#ffffff',
  backgroundColor: blue,
  backgroundColorSecondary: blue,
  backgroundColorTertiary: `${blue}55`,
  backgroundColorQuartenary: `${blue}44`,
  backgroundColorTransluscent: `${blue}33`,
  borderColor: blue,
  borderColorHover: blue,
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
  backgroundColorAlt: blue600,
  backgroundColorDarker: '#161616',
  backgroundColorTransluscent: 'rgba(0,0,0,0.1)',
  backgroundColorTransluscentHover: 'rgba(0,0,0,0.2)',
  backgroundColorTransparent: 'rgba(25,25,25,0)',
  borderColor: '#353535',
  borderColorHover: '#353535',
  cardBackgroundColor: '#353535',
  color: '#fefefe',
  colorAlt: '#ffffff',
  colorSecondary: '#dddddd',
  colorTertiary: '#aaaaaa',
  colorQuartenary: '#999999',
  mapBackground: '#151515',
  shadowColor: `rgba(0,0,0,0.4)`,
  shadowColorLighter: `rgba(0,0,0,0.2)`,
}

const dark = {
  name: 'dark',
  ...baseTheme,
  ...darkBase,
  backgroundColor: '#272727',
  backgroundColorSecondary: '#353535',
  backgroundColorTertiary: '#444444',
  backgroundColorQuartenary: '#454545',
}

const darkTranslucent: MyTheme = {
  name: 'darkTranslucent',
  ...baseTheme,
  ...darkBase,
  backgroundColor: 'rgba(0,0,0,0.55)',
  backgroundColorSecondary: 'rgba(25,25,25,0.5)',
  backgroundColorTertiary: 'rgba(50,50,50,0.4)',
  backgroundColorQuartenary: 'rgba(75,75,75,0.3)',
}

const lightBase = {
  colorAlt: blue,
  backgroundColorTransluscent: '#ffffff22',
  backgroundColorTransluscentHover: '#ffffff33',
  backgroundColorDarker: '#f6f6f6',
  backgroundColorAlt: blue200,
  borderColor: '#f2f2f2',
  borderColorHover: '#eeeeee',
  color: '#111111',
  colorSecondary: '#444444',
  colorTertiary: '#777777',
  colorQuartenary: '#aaaaaa',
  cardBackgroundColor: '#ffffff',
  backgroundColorTransparent: 'rgba(255,255,255,0)',
  shadowColor: `rgba(0,0,0,0.1)`,
  shadowColorLighter: `rgba(0,0,0,0.05)`,
}

const light: MyTheme = {
  name: 'light',
  ...baseTheme,
  ...lightBase,
  backgroundColor: '#ffffff',
  backgroundColorSecondary: '#f2f2f2',
  backgroundColorTertiary: '#e9e9e9',
  backgroundColorQuartenary: '#d9d9d9',
}

const lightTranslucent: MyTheme = {
  name: 'lightTranslucent',
  ...baseTheme,
  ...lightBase,
  backgroundColor: 'rgba(255,255,255,0.75)',
  backgroundColorSecondary: 'rgba(250,250,250,0.6)',
  backgroundColorTertiary: 'rgba(240,240,240,0.4)',
  backgroundColorQuartenary: 'rgba(240,240,240,0.3)',
}

const colorThemes: { [key: string]: MyTheme } = {}

for (const [index, name] of colorNames.entries()) {
  const color = allColors[index]
  const colors = getColorsForColor(color)
  colorThemes[name] = {
    name,
    ...baseTheme,
    ...lightBase,
    color: colors.color600,
    colorSecondary: colors.color400,
    colorTertiary: `${colors.color400}99`,
    colorQuartenary: `#00000055`,
    cardBackgroundColor: colors.color100,
    backgroundColor: colors.color100,
    backgroundColorSecondary: colors.color200,
    backgroundColorTertiary: colors.color300,
    backgroundColorQuartenary: colors.color400,
    backgroundColorTransluscent: `${colors.color100}22`,
    backgroundColorTransluscentHover: `${colors.color100}33`,
    borderColor: colors.color200,
    backgroundColorAlt: colors.color600,
  }
  const lightName = `${name}-light`
  colorThemes[lightName] = {
    name: lightName,
    ...baseTheme,
    ...lightBase,
    color: colors.color700,
    colorSecondary: colors.color600,
    colorTertiary: colors.color500,
    colorQuartenary: colors.color400,
    cardBackgroundColor: '#fff',
    backgroundColor: colors.color50,
    backgroundColorSecondary: colors.color100,
    backgroundColorTertiary: colors.color200,
    backgroundColorQuartenary: colors.color300,
    backgroundColorTransluscent: `${colors.color50}55`,
    backgroundColorTransluscentHover: `${colors.color50}33`,
    borderColor: colors.altPastelColor,
    backgroundColorAlt: colors.color200,
  }
  const darkName = `${name}-dark`
  colorThemes[darkName] = {
    name: darkName,
    ...baseTheme,
    ...lightBase,
    color: colors.color50,
    colorSecondary: colors.color100,
    colorTertiary: colors.color200,
    colorQuartenary: colors.color300,
    cardBackgroundColor: colors.color600,
    backgroundColor: colors.color800,
    backgroundColorSecondary: colors.color700,
    backgroundColorTertiary: colors.color600,
    backgroundColorQuartenary: colors.color500,
    backgroundColorTransluscent: `${colors.color800}99`,
    backgroundColorTransluscentHover: `${colors.color800}ee`,
    borderColor: colors.color500,
    backgroundColorAlt: colors.color200,
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

if (typeof window !== 'undefined') {
  window['themes'] = window['themes'] || themes
}

export default themes
