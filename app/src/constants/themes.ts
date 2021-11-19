import * as RadixColors from '@tamagui/colors'

import { tokens } from './tokens'

export type MyTheme = typeof light
export type MyThemes = typeof themes

const lightColors = Object.fromEntries(
  Object.entries(tokens.color).filter(([k]) => !k.endsWith('Dark'))
)
const darkColors = Object.fromEntries(
  Object.entries(tokens.color)
    .filter(([k]) => k.endsWith('Dark'))
    .map(([k, v]) => [k.replace('Dark', ''), v])
)

const light = {
  bg: '#fff',
  bg2: tokens.color.gray3,
  bg3: tokens.color.gray4,
  bg4: tokens.color.gray5,
  bgTransparent: tokens.color.grayA1,
  borderColor: tokens.color.gray4,
  borderColor2: tokens.color.gray6,
  colorBright: '#000',
  color: tokens.color.gray12,
  color2: tokens.color.gray11,
  color3: tokens.color.gray10,
  color4: tokens.color.gray6,
  shadowColor: tokens.color.grayA5,
  shadowColor2: tokens.color.grayA6,
  ...lightColors,
}

const dark = {
  bg: '#171717',
  bg2: tokens.color.gray3Dark,
  bg3: tokens.color.gray4Dark,
  bg4: tokens.color.gray5Dark,
  bgTransparent: tokens.color.grayA1Dark,
  borderColor: tokens.color.gray3Dark,
  borderColor2: tokens.color.gray4Dark,
  color: '#ddd',
  colorBright: '#fff',
  color2: tokens.color.gray11Dark,
  color3: tokens.color.gray10Dark,
  color4: tokens.color.gray6Dark,
  shadowColor: tokens.color.grayA6,
  shadowColor2: tokens.color.grayA7,
  ...darkColors,
}

const colorThemes: Record<string, typeof light> = {}
const colorKeys = Object.keys(RadixColors)
for (const key of colorKeys) {
  if (key.endsWith('A')) continue
  const colorName = key.replace('Dark', '')
  const colorValues = RadixColors[key]
  const isDark = key.endsWith('Dark')
  const nameKey = isDark ? key.replace('Dark', '-dark') : `${key}-light`
  const offset = isDark ? -1 : 0
  // @ts-ignore
  colorThemes[nameKey] = {
    // @ts-ignore
    color: isDark ? '#ddd' : colorValues[`${colorName}12`],
    color2: isDark ? dark.color2 : light.color2,
    color3: colorValues[`${colorName}11`],
    color4: colorValues[`${colorName}10`],
    bg: colorValues[`${colorName}${2 + offset}`],
    bg2: colorValues[`${colorName}${3 + offset}`],
    bg3: colorValues[`${colorName}${4 + offset}`],
    bg4: colorValues[`${colorName}${5 + offset}`],
    bgTransparent: colorValues[`${colorName}${1 + offset}`],
    borderColor: colorValues[`${colorName}${4 + offset}`],
    borderColor2: colorValues[`${colorName}${5 + offset}`],
  }
}

export const themes = {
  dark,
  light,
  ...colorThemes,
  'active-light': {
    ...colorThemes['blue-dark'],
    bg: tokens.color.blue1,
    bg2: tokens.color.blue3,
    bg3: tokens.color.blue3,
    bg4: tokens.color.blue5,
    color: tokens.color.blue10,
    color2: tokens.color.blue11,
  },
  'active-dark': {
    ...colorThemes['blue-light'],
    bg: tokens.color.blue12,
    bg2: tokens.color.blue12,
    bg3: tokens.color.blue12,
    bg4: tokens.color.blue10,
    color: tokens.color.blue1,
    color2: tokens.color.blue2,
  },
} as const

// import { getColorsForColor } from '../helpers/getColorsForName'
// import { bgAlt, blue, blue200, blue600, colorNames, colors400 } from './colors'

// export type MyTheme = typeof dark
// export type MyThemes = typeof themes

// const baseTheme = {
//   color: '#ffffff',
//   colorSecondary: '#cccccc',
//   colorTertiary: '#777777',
//   colorQuartenary: '#444',
//   shadowColor: `rgba(0,0,0,0.225)`,
//   shadowColorLighter: `rgba(0,0,0,0.15)`,
//   backgroundColorTransluscent: '#1111155',
//   backgroundColorTransluscentHover: '#1111133',
//   backgroundColorDarker: '#111111',
//   backgroundColorTransparent: 'rgba(40,40,200,0)',
//   cardBackgroundColor: '#333333',
//   backgroundColorAlt: bgAlt,
//   mapBackground: '#ffffff',
//   colorAlt: blue,
// }

// const lightBase = {
//   colorAlt: blue,
//   // restaurantitem header + loading effects want this to be off white
//   // this being #fff looks better on list pages....
//   backgroundColorTransluscent: '#ffffff33',
//   backgroundColorTransluscentHover: '#e2e2e222',
//   backgroundColorDarker: '#f6f6f6',
//   backgroundColorAlt: blue200,
//   borderColor: '#f2f2f2',
//   borderColorHover: '#eeeeee',
//   color: '#111111',
//   colorSecondary: '#444444',
//   colorTertiary: '#777777',
//   colorQuartenary: '#aaaaaa',
//   cardBackgroundColor: '#ffffff',
//   backgroundColorTransparent: 'rgba(255,255,255,0)',
//   shadowColor: `rgba(0,0,0,0.1)`,
//   shadowColorLighter: `rgba(0,0,0,0.02)`,
// }

// const light: MyTheme = {
//   name: 'light',
//   ...baseTheme,
//   ...lightBase,
//   backgroundColor: '#ffffff',
//   backgroundColorSecondary: '#f2f2f2',
//   backgroundColorTertiary: '#e9e9e9',
//   backgroundColorQuartenary: '#d9d9d9',
// }

// const lightTranslucent: MyTheme = {
//   name: 'lightTranslucent',
//   ...baseTheme,
//   ...lightBase,
//   backgroundColor: 'rgba(255,255,255,0.75)',
//   backgroundColorSecondary: 'rgba(250,250,250,0.6)',
//   backgroundColorTertiary: 'rgba(240,240,240,0.4)',
//   backgroundColorQuartenary: 'rgba(240,240,240,0.3)',
// }

// const darkBase = {
//   backgroundColor: '#262626',
//   backgroundColorSecondary: '#353535',
//   backgroundColorTertiary: '#444444',
//   backgroundColorQuartenary: '#454545',
//   backgroundColorAlt: blue600,
//   backgroundColorDarker: '#161616',
//   backgroundColorTransluscent: 'rgba(0,0,0,0.25)',
//   backgroundColorTransluscentHover: 'rgba(0,0,0,0.15)',
//   backgroundColorTransparent: 'rgba(25,25,25,0)',
//   borderColor: '#333333',
//   borderColorHover: '#33333355',
//   cardBackgroundColor: '#292929',
//   color: '#fefefe',
//   colorAlt: '#ffffff',
//   colorSecondary: '#dddddd',
//   colorTertiary: '#aaaaaa',
//   colorQuartenary: '#999999',
//   mapBackground: '#151515',
//   shadowColor: `rgba(0,0,0,0.4)`,
//   shadowColorLighter: `rgba(0,0,0,0.15)`,
// }

// const dark = {
//   name: 'dark',
//   ...baseTheme,
//   ...darkBase,
// }

// const darkTranslucent: MyTheme = {
//   name: 'darkTranslucent',
//   ...baseTheme,
//   ...darkBase,
//   backgroundColor: 'rgba(0,0,0,0.55)',
//   backgroundColorSecondary: 'rgba(25,25,25,0.5)',
//   backgroundColorTertiary: 'rgba(50,50,50,0.4)',
//   backgroundColorQuartenary: 'rgba(75,75,75,0.3)',
// }

// const active: MyTheme = {
//   name: 'active',
//   ...baseTheme,
//   color: '#ffffff',
//   colorSecondary: '#ffffff',
//   backgroundColor: blue,
//   backgroundColorSecondary: blue,
//   backgroundColorTertiary: `${blue}99`,
//   backgroundColorQuartenary: `${blue}77`,
//   backgroundColorTransluscent: `${blue}55`,
//   borderColor: blue,
//   borderColorHover: blue,
// }

// const error: MyTheme = {
//   name: 'error',
//   ...baseTheme,
//   backgroundColor: 'rgb(245, 38, 102)',
//   backgroundColorSecondary: 'rgb(245, 38, 102)',
//   backgroundColorTertiary: 'rgba(245, 38, 102, 0.85)',
//   backgroundColorQuartenary: 'rgba(245, 38, 102, 0.7)',
//   borderColor: 'rgb(205, 28, 92)',
//   borderColorHover: 'rgb(205, 28, 92)',
// }

// const colorThemes: { [key: string]: MyTheme } = {}

// for (const [index, name] of colorNames.entries()) {
//   const color = colors400[index]
//   const colors = getColorsForColor(color)
//   colorThemes[name] = {
//     name,
//     ...baseTheme,
//     ...lightBase,
//     color: colors.color600,
//     colorSecondary: colors.color400,
//     colorTertiary: `${colors.color400}99`,
//     colorQuartenary: `#00000055`,
//     cardBackgroundColor: colors.color100,
//     backgroundColor: colors.color100,
//     backgroundColorSecondary: colors.color200,
//     backgroundColorTertiary: colors.color300,
//     backgroundColorQuartenary: colors.color400,
//     backgroundColorTransluscent: `${colors.color100}33`,
//     backgroundColorTransluscentHover: `${colors.color100}22`,
//     borderColor: colors.color200,
//     backgroundColorAlt: colors.color600,
//   }
//   const lightName = `${name}-light`
//   colorThemes[lightName] = {
//     name: lightName,
//     ...baseTheme,
//     ...lightBase,
//     color: colors.color700,
//     colorSecondary: colors.color600,
//     colorTertiary: colors.color500,
//     colorQuartenary: colors.color400,
//     cardBackgroundColor: '#fff',
//     backgroundColor: colors.color25,
//     backgroundColorSecondary: colors.color50,
//     backgroundColorTertiary: colors.color100,
//     backgroundColorQuartenary: colors.color200,
//     backgroundColorTransluscent: `${colors.color25}44`,
//     backgroundColorTransluscentHover: `${colors.color25}33`,
//     borderColor: colors.color100,
//     backgroundColorAlt: colors.color200,
//   }
//   const darkName = `${name}-dark`
//   colorThemes[darkName] = {
//     name: darkName,
//     ...baseTheme,
//     ...lightBase,
//     color: colors.color50,
//     colorSecondary: colors.color100,
//     colorTertiary: colors.color200,
//     colorQuartenary: colors.color300,
//     cardBackgroundColor: colors.color600,
//     backgroundColor: colors.color800,
//     backgroundColorSecondary: colors.color700,
//     backgroundColorTertiary: colors.color600,
//     backgroundColorQuartenary: colors.color500,
//     backgroundColorTransluscent: `${colors.color800}99`,
//     backgroundColorTransluscentHover: `${colors.color800}ee`,
//     borderColor: colors.color600,
//     backgroundColorAlt: colors.color200,
//   }
// }

// const themes = {
//   dark,
//   light,
//   lightTranslucent,
//   darkTranslucent,
//   active,
//   error,
//   ...colorThemes,
// }

// if (typeof window !== 'undefined') {
//   window['themes'] = window['themes'] || themes
// }

// export default themes
