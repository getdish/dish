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
  bgDark: '#eee',
  bgCard: '#ffffff',
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
  mapBackground: '#ffffff',
  ...lightColors,
}

const dark = {
  bg: '#171717',
  bg2: tokens.color.gray3Dark,
  bg3: tokens.color.gray4Dark,
  bg4: tokens.color.gray5Dark,
  bgDark: '#111',
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
  mapBackground: '#151515',
  bgCard: '#333333',
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
    bgDark: colorValues[`${colorName}${1 + offset}`],
    bgTransparent: colorValues[`${colorName}${1 + offset}`],
    borderColor: colorValues[`${colorName}${4 + offset}`],
    borderColor2: colorValues[`${colorName}${5 + offset}`],
    shadowColor: colorValues[`${colorName}${2 + offset}`],
    shadowColor2: colorValues[`${colorName}${3 + offset}`],
    bgCard: colorValues[`${colorName}${3 + offset}`],
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
  'dark-translucent': {
    ...dark,
    bg: 'rgba(0,0,0,0.7)',
    bg2: 'rgba(0,0,0,0.5)',
    bg3: 'rgba(0,0,0,0.25)',
    bg4: 'rgba(0,0,0,0.1)',
  },
  'light-translucent': {
    ...light,
    bg: 'rgba(255,255,255,0.85)',
    bg2: 'rgba(250,250,250,0.85)',
    bg3: 'rgba(240,240,240,0.85)',
    bg4: 'rgba(240,240,240,0.7)',
  },
} as const
